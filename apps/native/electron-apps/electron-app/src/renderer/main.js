const root = document.querySelector('#app');
const store = new window.DesktopStore(window.desktopApi);

store.subscribe(() => window.renderDashboard(root, store));
window.renderDashboard(root, store);
void store.initialize();
