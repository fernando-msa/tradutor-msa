const CONTEXT_MENU_ID = 'translate-selection';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: 'Traduzir com Tradutor MSA',
      contexts: ['selection']
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !info.selectionText) return;

  const text = info.selectionText.trim().slice(0, 5000);
  if (!text) return;

  const url = `popup.html?text=${encodeURIComponent(text)}&auto=true`;
  chrome.windows.create({
    url,
    type: 'popup',
    width: 360,
    height: 560,
    focused: true
  });
});
