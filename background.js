const browserApi = globalThis.browser || globalThis.chrome;
const CONTEXT_MENU_ID = 'translate-selection';

browserApi.runtime.onInstalled.addListener(() => {
  browserApi.contextMenus.removeAll(() => {
    browserApi.contextMenus.create({
      id: CONTEXT_MENU_ID,
      title: 'Traduzir com Tradutor MSA',
      contexts: ['selection']
    });
  });
});

browserApi.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== CONTEXT_MENU_ID || !info.selectionText) return;

  const text = info.selectionText.trim();
  const wasTruncated = text.length > 5000;
  const selectedText = text.slice(0, 5000);
  const url = `popup.html?text=${encodeURIComponent(selectedText)}&auto=true${wasTruncated ? '&truncated=true' : ''}`;
  if (!text) return;

  browserApi.windows.create({
    url,
    type: 'popup',
    width: 360,
    height: 560,
    focused: true
  });
});
