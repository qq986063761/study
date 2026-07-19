const api = window.desktop;

if (!api) {
  throw new Error('Desktop API 未注入，请确认 preload 脚本已加载');
}

window.desktopApi = api;
