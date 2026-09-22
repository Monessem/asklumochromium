// ProjectFlow Content Script
// Adds a floating quick-add button to web pages

(function () {
  'use strict';

  // Don't inject on Chrome internal pages
  if (
    window.location.protocol === 'chrome:' ||
    window.location.protocol === 'chrome-extension:' ||
    window.location.protocol === 'about:'
  ) {
    return;
  }

  let isButtonVisible = false;
  let isPanelVisible = false;

  // Create the floating button
  function createFloatingButton() {
    const button = document.createElement('div');
    button.id = 'projectflow-fab';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    `;
    button.title = 'إضافة مهمة سريعة - ProjectFlow';

    // Create the quick-add panel
    const panel = document.createElement('div');
    panel.id = 'projectflow-panel';
    panel.innerHTML = `
      <div class="pf-panel-header">
        <span class="pf-panel-title">⚡ إضافة مهمة سريعة</span>
        <button class="pf-panel-close" id="pf-close-btn">✕</button>
      </div>
      <div class="pf-panel-body">
        <input type="text" id="pf-task-input" placeholder="اكتب المهمة هنا..." dir="rtl" />
        <div class="pf-panel-actions">
          <button id="pf-add-btn" class="pf-btn-primary">إضافة</button>
        </div>
        <div id="pf-success-msg" class="pf-success-msg" style="display:none;">
          ✅ تم الإضافة بنجاح!
        </div>
      </div>
    `;

    document.body.appendChild(button);
    document.body.appendChild(panel);

    // Event listeners
    button.addEventListener('click', togglePanel);

    const closeBtn = panel.querySelector('#pf-close-btn');
    closeBtn.addEventListener('click', () => hidePanel());

    const addBtn = panel.querySelector('#pf-add-btn');
    const taskInput = panel.querySelector('#pf-task-input');

    addBtn.addEventListener('click', () => addQuickTask(taskInput.value));
    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        addQuickTask(taskInput.value);
      }
      if (e.key === 'Escape') {
        hidePanel();
      }
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (
        isPanelVisible &&
        !panel.contains(e.target) &&
        !button.contains(e.target)
      ) {
        hidePanel();
      }
    });
  }

  function togglePanel() {
    if (isPanelVisible) {
      hidePanel();
    } else {
      showPanel();
    }
  }

  function showPanel() {
    const panel = document.getElementById('projectflow-panel');
    const button = document.getElementById('projectflow-fab');
    if (panel && button) {
      panel.classList.add('pf-visible');
      button.classList.add('pf-active');
      isPanelVisible = true;
      const input = panel.querySelector('#pf-task-input');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
    }
  }

  function hidePanel() {
    const panel = document.getElementById('projectflow-panel');
    const button = document.getElementById('projectflow-fab');
    if (panel && button) {
      panel.classList.remove('pf-visible');
      button.classList.remove('pf-active');
      isPanelVisible = false;
    }
  }

  async function addQuickTask(title) {
    if (!title || !title.trim()) return;

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'QUICK_ADD',
        title: title.trim(),
      });

      if (response.success) {
        const successMsg = document.getElementById('pf-success-msg');
        const taskInput = document.getElementById('pf-task-input');
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(() => {
            successMsg.style.display = 'none';
          }, 2000);
        }
        if (taskInput) {
          taskInput.value = '';
          taskInput.focus();
        }
      }
    } catch (error) {
      console.error('ProjectFlow: Error adding task:', error);
    }
  }

  // Listen for messages from background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SHOW_PANEL') {
      showPanel();
    }
    if (message.type === 'HIDE_PANEL') {
      hidePanel();
    }
    sendResponse({ received: true });
    return true;
  });

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createFloatingButton);
  } else {
    createFloatingButton();
  }
})();
