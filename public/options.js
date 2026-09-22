// Options page script
document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.local.get(['settings']);
  const settings = data.settings || {};

  // Update toggles
  if (settings.darkMode === false) {
    document.getElementById('toggle-dark').classList.remove('active');
  }
  if (settings.notifications === false) {
    document.getElementById('toggle-notif').classList.remove('active');
  }
  if (settings.reminderTime) {
    document.getElementById('reminder-time').value = settings.reminderTime.toString();
  }
});

function toggleSetting(key, element) {
  element.classList.toggle('active');
}

function updateReminderTime() {
  // Will be saved when user clicks save
}

async function saveSettings() {
  const settings = {
    darkMode: document.getElementById('toggle-dark').classList.contains('active'),
    notifications: document.getElementById('toggle-notif').classList.contains('active'),
    reminderTime: parseInt(document.getElementById('reminder-time').value),
    language: 'ar',
    autoSave: true,
  };

  await chrome.storage.local.set({ settings });

  const msg = document.getElementById('save-msg');
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 3000);
}

async function exportData() {
  const data = await chrome.storage.local.get(['tasks', 'settings', 'stats']);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `projectflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function clearData() {
  if (confirm('هل أنت متأكد من حذف جميع البيانات؟ لا يمكن التراجع عن هذا الإجراء.')) {
    await chrome.storage.local.clear();
    alert('تم مسح جميع البيانات بنجاح.');
    location.reload();
  }
}
