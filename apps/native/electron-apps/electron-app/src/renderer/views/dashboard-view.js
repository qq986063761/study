const viewMeta = {
  overview: ['工作台', '桌面能力概览'],
  files: ['文件', '打开、编辑与保存'],
  clipboard: ['剪贴板', '读取与写入文本'],
  windows: ['窗口', '原生窗口状态与控制'],
  system: ['系统', '运行时、路径与外部链接'],
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character]);
}

function formatBytes(value) {
  if (!Number.isFinite(value)) return '-';
  if (value < 1024) return `${value} B`;
  return `${(value / 1024).toFixed(1)} KB`;
}

function navItem(id, icon, label, activeView) {
  return `
    <button class="nav-item ${activeView === id ? 'is-active' : ''}" data-view="${id}" type="button">
      <span class="nav-icon" aria-hidden="true">${icon}</span>
      <span>${label}</span>
    </button>`;
}

function renderOverview(state) {
  const info = state.info;
  return `
    <section class="page-heading">
      <div>
        <span class="section-kicker">DESKTOP WORKSPACE</span>
        <h2>工作台</h2>
      </div>
      <button class="button secondary" data-action="copy-runtime" type="button">
        <span aria-hidden="true">⧉</span>复制运行时信息
      </button>
    </section>

    <section class="metric-grid" aria-label="运行状态">
      <article class="metric"><span>Electron</span><strong>${escapeHtml(info?.electronVersion ?? '-')}</strong></article>
      <article class="metric"><span>操作系统</span><strong>${escapeHtml(info ? `${info.platform} / ${info.arch}` : '-')}</strong></article>
      <article class="metric"><span>系统主题</span><strong>${info ? (info.darkMode ? '深色' : '浅色') : '-'}</strong></article>
      <article class="metric"><span>窗口</span><strong>${state.window?.maximized ? '已最大化' : '标准尺寸'}</strong></article>
    </section>

    <section class="content-section">
      <div class="section-title"><h3>快速操作</h3><span>主进程能力</span></div>
      <div class="action-grid">
        <button class="action-item" data-action="open-file" type="button"><b>打开文件</b><span>TXT / MD / JSON</span><i>↗</i></button>
        <button class="action-item" data-action="save-quick-note" type="button"><b>保存便笺</b><span>系统保存对话框</span><i>↗</i></button>
        <button class="action-item" data-action="message" type="button"><b>消息对话框</b><span>系统原生提示</span><i>↗</i></button>
        <button class="action-item" data-action="notification" type="button"><b>桌面通知</b><span>系统通知中心</span><i>↗</i></button>
        <button class="action-item" data-action="read-clipboard" type="button"><b>读取剪贴板</b><span>文本内容</span><i>↗</i></button>
        <button class="action-item" data-action="open-docs" type="button"><b>外部链接</b><span>Electron 文档</span><i>↗</i></button>
      </div>
    </section>

    <section class="content-section runtime-section">
      <div class="section-title"><h3>运行时</h3><span>${escapeHtml(info?.name ?? 'Electron Desktop Lab')} ${escapeHtml(info?.appVersion ?? '')}</span></div>
      <div class="runtime-row"><span>Chromium</span><code>${escapeHtml(info?.chromiumVersion ?? '-')}</code></div>
      <div class="runtime-row"><span>Node.js</span><code>${escapeHtml(info?.nodeVersion ?? '-')}</code></div>
      <div class="runtime-row"><span>区域</span><code>${escapeHtml(info?.locale ?? '-')}</code></div>
    </section>`;
}

function renderFiles(state) {
  const file = state.file;
  return `
    <section class="page-heading">
      <div><span class="section-kicker">FILE SYSTEM</span><h2>文件</h2></div>
      <div class="button-row">
        <button class="button secondary" data-action="open-file" type="button">打开</button>
        <button class="button primary" data-action="save-file" type="button">保存</button>
      </div>
    </section>
    <section class="file-layout">
      <div class="editor-panel">
        <div class="panel-toolbar">
          <strong>${escapeHtml(file?.name ?? '未命名便笺')}</strong>
          <span>${file ? formatBytes(file.size) : 'UTF-8'}</span>
        </div>
        <textarea id="file-content" spellcheck="false" placeholder="在此输入要保存的文本">${escapeHtml(file?.content ?? '')}</textarea>
      </div>
      <aside class="details-panel">
        <h3>文件信息</h3>
        <dl class="details-list">
          <div><dt>名称</dt><dd>${escapeHtml(file?.name ?? '-')}</dd></div>
          <div><dt>大小</dt><dd>${file ? formatBytes(file.size) : '-'}</dd></div>
          <div><dt>修改时间</dt><dd>${file ? escapeHtml(new Date(file.modifiedAt).toLocaleString()) : '-'}</dd></div>
          <div><dt>路径</dt><dd class="path-value">${escapeHtml(file?.path ?? '-')}</dd></div>
        </dl>
        <button class="button secondary full-width" data-action="reveal-file" type="button" ${file ? '' : 'disabled'}>在文件夹中显示</button>
      </aside>
    </section>`;
}

function renderClipboard(state) {
  return `
    <section class="page-heading">
      <div><span class="section-kicker">CLIPBOARD</span><h2>剪贴板</h2></div>
      <button class="button secondary" data-action="read-clipboard" type="button">读取系统剪贴板</button>
    </section>
    <section class="tool-panel narrow-panel">
      <label for="clipboard-content">文本内容</label>
      <textarea id="clipboard-content" rows="12" placeholder="输入要写入系统剪贴板的文本">${escapeHtml(state.clipboardText)}</textarea>
      <div class="panel-footer">
        <span>${state.clipboardText.length} 个字符</span>
        <button class="button primary" data-action="write-clipboard" type="button">写入剪贴板</button>
      </div>
    </section>`;
}

function renderWindows(state) {
  const windowState = state.window;
  const bounds = windowState?.bounds;
  return `
    <section class="page-heading">
      <div><span class="section-kicker">BROWSER WINDOW</span><h2>窗口</h2></div>
    </section>
    <section class="window-layout">
      <div class="window-preview ${windowState?.maximized ? 'is-maximized' : ''}">
        <div class="preview-titlebar"><span></span><span></span><span></span><b>Electron Desktop Lab</b></div>
        <div class="preview-body"><strong>${windowState?.maximized ? '最大化' : '标准窗口'}</strong><span>${bounds ? `${bounds.width} × ${bounds.height}` : '-'}</span></div>
      </div>
      <div class="control-list">
        <button data-action="minimize-window" type="button"><span>最小化</span><kbd>—</kbd></button>
        <button data-action="maximize-window" type="button"><span>${windowState?.maximized ? '还原窗口' : '最大化'}</span><kbd>□</kbd></button>
        <button class="danger-action" data-action="close-window" type="button"><span>关闭窗口</span><kbd>×</kbd></button>
      </div>
    </section>`;
}

function renderSystem(state) {
  const info = state.info;
  const paths = info?.paths ?? {};
  return `
    <section class="page-heading">
      <div><span class="section-kicker">SYSTEM</span><h2>系统</h2></div>
      <button class="button secondary" data-action="open-docs" type="button">Electron 文档 ↗</button>
    </section>
    <section class="system-grid">
      <div class="tool-panel">
        <div class="section-title"><h3>运行环境</h3></div>
        <dl class="details-list system-list">
          <div><dt>应用版本</dt><dd>${escapeHtml(info?.appVersion ?? '-')}</dd></div>
          <div><dt>Electron</dt><dd>${escapeHtml(info?.electronVersion ?? '-')}</dd></div>
          <div><dt>Chromium</dt><dd>${escapeHtml(info?.chromiumVersion ?? '-')}</dd></div>
          <div><dt>Node.js</dt><dd>${escapeHtml(info?.nodeVersion ?? '-')}</dd></div>
          <div><dt>平台</dt><dd>${escapeHtml(info ? `${info.platform} / ${info.arch}` : '-')}</dd></div>
          <div><dt>区域</dt><dd>${escapeHtml(info?.locale ?? '-')}</dd></div>
        </dl>
      </div>
      <div class="tool-panel">
        <div class="section-title"><h3>系统路径</h3></div>
        <dl class="details-list system-list paths-list">
          <div><dt>用户数据</dt><dd>${escapeHtml(paths.userData ?? '-')}</dd></div>
          <div><dt>文档</dt><dd>${escapeHtml(paths.documents ?? '-')}</dd></div>
          <div><dt>下载</dt><dd>${escapeHtml(paths.downloads ?? '-')}</dd></div>
          <div><dt>临时目录</dt><dd>${escapeHtml(paths.temp ?? '-')}</dd></div>
        </dl>
      </div>
    </section>`;
}

function renderActiveView(state) {
  if (state.activeView === 'files') return renderFiles(state);
  if (state.activeView === 'clipboard') return renderClipboard(state);
  if (state.activeView === 'windows') return renderWindows(state);
  if (state.activeView === 'system') return renderSystem(state);
  return renderOverview(state);
}

function renderDashboard(root, store) {
  const { state } = store;
  const [title, subtitle] = viewMeta[state.activeView];
  root.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand"><span class="brand-mark">E</span><div><strong>Desktop Lab</strong><small>Electron ${escapeHtml(state.info?.electronVersion ?? '')}</small></div></div>
        <nav aria-label="主导航">
          ${navItem('overview', '⌂', '工作台', state.activeView)}
          ${navItem('files', '▤', '文件', state.activeView)}
          ${navItem('clipboard', '⧉', '剪贴板', state.activeView)}
          ${navItem('windows', '□', '窗口', state.activeView)}
          ${navItem('system', 'i', '系统', state.activeView)}
        </nav>
        <div class="security-status"><span></span><div><strong>隔离模式</strong><small>Context Isolation</small></div></div>
      </aside>
      <section class="workspace">
        <header class="topbar">
          <div><strong>${title}</strong><span>${subtitle}</span></div>
          <div class="window-buttons" aria-label="窗口控制">
            <button data-action="minimize-window" type="button" title="最小化" aria-label="最小化">—</button>
            <button data-action="maximize-window" type="button" title="${state.window?.maximized ? '还原' : '最大化'}" aria-label="${state.window?.maximized ? '还原' : '最大化'}">${state.window?.maximized ? '❐' : '□'}</button>
            <button class="close-button" data-action="close-window" type="button" title="关闭" aria-label="关闭">×</button>
          </div>
        </header>
        <main class="content">${renderActiveView(state)}</main>
      </section>
      ${state.notice ? `<div class="toast ${escapeHtml(state.notice.tone)}" role="status">${escapeHtml(state.notice.message)}</div>` : ''}
    </div>`;

  bindEvents(root, store);
}

function bindEvents(root, store) {
  root.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => store.setView(button.dataset.view));
  });

  root.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => store.execute(async () => {
      const action = button.dataset.action;
      if (action === 'open-file') await store.openFile();
      if (action === 'save-file') await store.saveFile(root.querySelector('#file-content')?.value ?? '');
      if (action === 'save-quick-note') await store.saveFile(`Electron 便笺\n${new Date().toLocaleString()}\n`);
      if (action === 'reveal-file') await store.revealFile();
      if (action === 'read-clipboard') {
        await store.readClipboard();
        store.setView('clipboard');
      }
      if (action === 'write-clipboard') await store.writeClipboard(root.querySelector('#clipboard-content')?.value ?? '');
      if (action === 'message') await store.showMessage();
      if (action === 'notification') await store.showNotification();
      if (action === 'copy-runtime') await store.copyRuntimeInfo();
      if (action === 'open-docs') await store.openElectronDocs();
      if (action === 'minimize-window') await store.minimizeWindow();
      if (action === 'maximize-window') await store.toggleMaximizeWindow();
      if (action === 'close-window') await store.closeWindow();
    }));
  });
}

window.renderDashboard = renderDashboard;
