// ProjectFlow Background Service Worker
// Manifest V3 - Chrome Web Store Compatible

// Initialize storage on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.local.set({
      settings: {
        darkMode: true,
        notifications: true,
        reminderTime: 30, // minutes before due
        language: 'ar',
        autoSave: true,
      },
      tasks: [],
      projects: [],
      stats: {
        totalCreated: 0,
        totalCompleted: 0,
        streak: 0,
        lastActiveDate: null,
      },
    });

    // Set up periodic alarm for reminders
    chrome.alarms.create('checkReminders', {
      periodInMinutes: 5,
    });

    // Open options page on first install
    chrome.runtime.openOptionsPage();
  }

  if (details.reason === 'update') {
    // Handle migration if needed
    console.log('ProjectFlow updated to version', chrome.runtime.getManifest().version);
  }
});

// Handle alarms for task reminders
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkReminders') {
    await checkTaskReminders();
  }
});

// Check for upcoming task deadlines
async function checkTaskReminders() {
  try {
    const data = await chrome.storage.local.get(['tasks', 'settings']);
    const tasks = data.tasks || [];
    const settings = data.settings || {};

    if (!settings.notifications) return;

    const now = new Date();
    const reminderTime = settings.reminderTime || 30;

    const upcomingTasks = tasks.filter((task) => {
      if (task.status === 'done' || !task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const diffMinutes = (dueDate - now) / (1000 * 60);
      return diffMinutes > 0 && diffMinutes <= reminderTime;
    });

    for (const task of upcomingTasks) {
      chrome.notifications.create(`reminder-${task.id}`, {
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: '⏰ تذكير بمهمة',
        message: `"${task.title}" - موعد التسليم قريب!`,
        priority: 1,
      });
    }
  } catch (error) {
    console.error('Error checking reminders:', error);
  }
}

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(sendResponse)
    .catch((error) => {
      console.error('Message handler error:', error);
      sendResponse({ error: error.message });
    });

  return true; // Keep message channel open for async response
});

async function handleMessage(message, sender) {
  switch (message.type) {
    case 'GET_TASKS': {
      const data = await chrome.storage.local.get(['tasks']);
      return { tasks: data.tasks || [] };
    }

    case 'ADD_TASK': {
      const data = await chrome.storage.local.get(['tasks', 'stats']);
      const tasks = data.tasks || [];
      const stats = data.stats || {};

      const newTask = {
        id: crypto.randomUUID(),
        title: message.task.title,
        description: message.task.description || '',
        priority: message.task.priority || 'medium',
        status: 'todo',
        dueDate: message.task.dueDate || null,
        tags: message.task.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      tasks.push(newTask);
      stats.totalCreated = (stats.totalCreated || 0) + 1;

      await chrome.storage.local.set({ tasks, stats });
      updateBadge(tasks);
      return { success: true, task: newTask };
    }

    case 'UPDATE_TASK': {
      const data = await chrome.storage.local.get(['tasks', 'stats']);
      const tasks = data.tasks || [];
      const stats = data.stats || {};

      const taskIndex = tasks.findIndex((t) => t.id === message.taskId);
      if (taskIndex === -1) return { error: 'Task not found' };

      const wasNotDone = tasks[taskIndex].status !== 'done';

      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...message.updates,
        updatedAt: new Date().toISOString(),
      };

      if (message.updates.status === 'done' && wasNotDone) {
        stats.totalCompleted = (stats.totalCompleted || 0) + 1;
      }

      await chrome.storage.local.set({ tasks, stats });
      updateBadge(tasks);
      return { success: true, task: tasks[taskIndex] };
    }

    case 'DELETE_TASK': {
      const data = await chrome.storage.local.get(['tasks']);
      const tasks = (data.tasks || []).filter((t) => t.id !== message.taskId);
      await chrome.storage.local.set({ tasks });
      updateBadge(tasks);
      return { success: true };
    }

    case 'GET_STATS': {
      const data = await chrome.storage.local.get(['tasks', 'stats']);
      const tasks = data.tasks || [];
      const stats = data.stats || {};

      return {
        stats: {
          ...stats,
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t) => t.status === 'done').length,
          inProgressTasks: tasks.filter((t) => t.status === 'in-progress').length,
          pendingTasks: tasks.filter((t) => t.status === 'todo').length,
        },
      };
    }

    case 'GET_SETTINGS': {
      const data = await chrome.storage.local.get(['settings']);
      return { settings: data.settings || {} };
    }

    case 'UPDATE_SETTINGS': {
      const data = await chrome.storage.local.get(['settings']);
      const settings = { ...data.settings, ...message.settings };
      await chrome.storage.local.set({ settings });
      return { success: true, settings };
    }

    case 'QUICK_ADD': {
      // Quick add from content script or keyboard shortcut
      const data = await chrome.storage.local.get(['tasks', 'stats']);
      const tasks = data.tasks || [];
      const stats = data.stats || {};

      const newTask = {
        id: crypto.randomUUID(),
        title: message.title,
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: null,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sourceUrl: sender.tab?.url || '',
      };

      tasks.push(newTask);
      stats.totalCreated = (stats.totalCreated || 0) + 1;

      await chrome.storage.local.set({ tasks, stats });
      updateBadge(tasks);
      return { success: true, task: newTask };
    }

    default:
      return { error: 'Unknown message type' };
  }
}

// Update badge with pending task count
function updateBadge(tasks) {
  const pendingCount = tasks.filter(
    (t) => t.status !== 'done' && t.priority === 'high'
  ).length;

  if (pendingCount > 0) {
    chrome.action.setBadgeText({ text: pendingCount.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Handle keyboard commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'quick-add') {
    // Open popup for quick add
    // The popup will handle the quick add flow
  }
});

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith('reminder-')) {
    // Open the popup to show the task
    chrome.action.openPopup?.();
  }
});

// Initialize badge on startup
chrome.runtime.onStartup.addListener(async () => {
  const data = await chrome.storage.local.get(['tasks']);
  updateBadge(data.tasks || []);
});
