const browserApi = globalThis.browser || globalThis.chrome;
const STORAGE_KEYS = {
  history: 'history',
  lastSource: 'lastSource',
  lastTarget: 'lastTarget',
  translationCount: 'translationCount',
  hasReviewed: 'hasReviewed',
  cache: 'translationCache'
};
const HISTORY_LIMIT = 20;
const CACHE_LIMIT = 30;
const REVIEW_THRESHOLD = 5;
const DEFAULT_SOURCE = 'autodetect';
const DEFAULT_TARGET = 'en-US';
const EDGE_REVIEW_URL = 'https://microsoftedge.microsoft.com/addons/detail/tradutor-msa-extens%C3%A3o/dkojdeehfjpjphkndhagfbhknnlckami';
const FIREFOX_REVIEW_URL = 'https://addons.mozilla.org/pt-BR/firefox/addon/tradutor-msa/';
const SUPPORT_URL = 'https://github.com/fernando-msa/tradutor-msa/issues';

const sourceLangSelect = document.getElementById('sourceLang');
const targetLangSelect = document.getElementById('targetLang');
const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapLanguages');
const micBtn = document.getElementById('micBtn');
const speakBtn = document.getElementById('speakBtn');
const voiceSelect = document.getElementById('voiceSelect');
const copySourceBtn = document.getElementById('copySourceBtn');
const copyTargetBtn = document.getElementById('copyTargetBtn');
const statusMessage = document.getElementById('statusMessage');
const reviewBanner = document.getElementById('reviewBanner');
const rateBtn = document.getElementById('rateBtn');
const closeRateBtn = document.getElementById('closeRateBtn');
const translatorView = document.getElementById('translator-view');
const tabs = Array.from(document.querySelectorAll('.tab-btn'));
const views = Array.from(document.querySelectorAll('.view'));
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const supportBtn = document.getElementById('supportBtn');

let isTranslating = false;
let lastRequestId = 0;
let voices = [];
let speechRecognition;
let contextMenuSelectionWasTruncated = false;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  populateLanguages();
  setupTabs();
  bindEvents();
  setupVoiceOutput();

  await loadSettings();
  await loadHistory();
  await showReviewBannerIfNeeded();
  preloadContextMenuSelection();
  updateActionButtons();
}

function bindEvents() {
  sourceText.addEventListener('input', updateActionButtons);
  targetText.addEventListener('input', updateActionButtons);
  translateBtn.addEventListener('click', handleTranslate);
  swapBtn.addEventListener('click', swapLanguagesAndTexts);
  sourceText.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'Enter') handleTranslate();
  });

  targetLangSelect.addEventListener('change', updateVoiceOptions);
  micBtn.addEventListener('click', startSpeechToText);
  speakBtn.addEventListener('click', speakTranslatedText);
  copySourceBtn.addEventListener('click', () => copyToClipboard(sourceText.value));
  copyTargetBtn.addEventListener('click', () => copyToClipboard(targetText.value));

  clearHistoryBtn.addEventListener('click', clearHistory);
  supportBtn.addEventListener('click', () => openNewTab(SUPPORT_URL));

  rateBtn.addEventListener('click', async () => {
    await storageSet({ [STORAGE_KEYS.hasReviewed]: true });
    hideReviewBanner();
    openNewTab(getReviewUrl());
  });

  closeRateBtn.addEventListener('click', async () => {
    await storageSet({ [STORAGE_KEYS.hasReviewed]: true });
    hideReviewBanner();
  });
}

function populateLanguages() {
  sourceLangSelect.textContent = '';
  targetLangSelect.textContent = '';

  sourceLangSelect.setAttribute('aria-describedby', 'sourceLangHelp');
  targetLangSelect.setAttribute('aria-describedby', 'targetLangHelp');

  sourceLangSelect.appendChild(createOption(DEFAULT_SOURCE, 'Detectar idioma'));
  Object.entries(LANGUAGES).forEach(([code, name]) => {
    sourceLangSelect.appendChild(createOption(code, name));
    targetLangSelect.appendChild(createOption(code, name));
  });

  sourceLangSelect.value = DEFAULT_SOURCE;
  targetLangSelect.value = DEFAULT_TARGET;
}

function setupTabs() {
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const selectedTab = tab.dataset.tab;
      tabs.forEach((item) => {
        const isActive = item === tab;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-selected', String(isActive));
      });

      views.forEach((view) => {
        view.classList.toggle('active', view.id === `${selectedTab}-view`);
      });

      if (selectedTab === 'history') loadHistory();
    });
  });
}

async function handleTranslate() {
  const text = sanitizeInput(sourceText.value);
  if (!text) {
    setStatus('Digite algum texto para traduzir.', 'info');
    return;
  }

  if (isTranslating) {
    setStatus('Uma tradução já está em andamento.', 'info');
    return;
  }

  const source = sourceLangSelect.value;
  const target = targetLangSelect.value;
  if (source !== DEFAULT_SOURCE && source === target) {
    setStatus('Escolha idiomas diferentes para origem e destino.', 'info');
    return;
  }

  setTranslatingState(true);
  const requestId = ++lastRequestId;
  const cacheKey = `${source}|${target}|${text.toLowerCase()}`;

  try {
    const cached = await getFromCache(cacheKey);
    if (cached) {
      applyTranslationResult(cached.translatedText, cached.detectedSource || source, target, text, true, requestId);
      return;
    }

    const data = await requestTranslation(text, source, target);
    if (requestId !== lastRequestId) return;

    const translatedText = (data.responseData?.translatedText || '').trim();
    if (!translatedText) throw new Error('Resposta vazia da API.');

    const detectedSource = data.responseData?.detectedSourceLanguage || source;
    await cacheTranslation(cacheKey, translatedText, detectedSource);
    await applyTranslationResult(translatedText, detectedSource, target, text, false, requestId);
  } catch (error) {
    console.error('Falha na tradução:', error);
    targetText.value = '';
    targetText.placeholder = 'Não foi possível traduzir agora.';
    setStatus(getFriendlyError(error), 'error');
  } finally {
    if (requestId === lastRequestId) setTranslatingState(false);
  }
}

async function requestTranslation(text, source, target) {
  const apiSource = source === DEFAULT_SOURCE ? 'Autodetect' : source;
  const url = new URL('https://api.mymemory.translated.net/get');
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', `${apiSource}|${target}`);

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10000);

  let response;
  try {
    response = await fetch(url.toString(), { signal: controller.signal });
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('A tradução demorou demais para responder.');
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) throw new Error(`Falha HTTP ${response.status}`);

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Resposta inválida do serviço de tradução.');
  }

  if (data.responseStatus !== 200) {
    throw new Error(data.responseDetails || `Erro da API (${data.responseStatus || 'desconhecido'})`);
  }

  return data;
}

async function applyTranslationResult(translatedText, detectedSource, target, originalText, fromCache, requestId) {
  if (requestId !== lastRequestId) return;

  targetText.value = translatedText;
  await saveToHistory(originalText, translatedText, detectedSource, target);
  await incrementTranslationCount();
  const baseMessage = fromCache ? 'Tradução recuperada do cache local.' : 'Tradução concluída.';
  setStatus(
    contextMenuSelectionWasTruncated ? `${baseMessage} O texto selecionado foi truncado para 5000 caracteres.` : baseMessage,
    'success'
  );

  await storageSet({
    [STORAGE_KEYS.lastSource]: sourceLangSelect.value,
    [STORAGE_KEYS.lastTarget]: targetLangSelect.value
  });

  if (tabs[1]?.classList.contains('active')) await loadHistory();
  updateActionButtons();
}

function sanitizeInput(value) {
  return String(value || '').trim();
}

function normalizeForComparison(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function setTranslatingState(loading) {
  isTranslating = loading;
  translateBtn.disabled = loading;
  micBtn.disabled = loading;
  sourceLangSelect.disabled = loading;
  targetLangSelect.disabled = loading;
  translateBtn.textContent = loading ? 'Traduzindo…' : 'Traduzir';
  if (loading) {
    translatorView.setAttribute('aria-busy', 'true');
  } else {
    translatorView.removeAttribute('aria-busy');
  }

  if (loading) {
    setStatus('Enviando texto para tradução…', 'info');
    targetText.value = '';
    targetText.placeholder = 'Aguardando resposta da API…';
  }
}

function updateActionButtons() {
  const hasSource = Boolean(sanitizeInput(sourceText.value));
  const hasTarget = Boolean(sanitizeInput(targetText.value));

  translateBtn.disabled = isTranslating || !hasSource;
  copySourceBtn.disabled = !hasSource;
  copyTargetBtn.disabled = !hasTarget;
  speakBtn.disabled = !hasTarget;
}

function swapLanguagesAndTexts() {
  const source = sourceLangSelect.value;
  const target = targetLangSelect.value;

  sourceLangSelect.value = target;
  targetLangSelect.value = source === DEFAULT_SOURCE ? DEFAULT_TARGET : source;

  const currentSourceText = sourceText.value;
  if (targetText.value.trim()) {
    sourceText.value = targetText.value;
    targetText.value = currentSourceText;
  }

  updateVoiceOptions();
  updateActionButtons();
}

function setupVoiceOutput() {
  if (!('speechSynthesis' in window)) {
    voiceSelect.disabled = true;
    speakBtn.disabled = true;
    return;
  }

  populateVoices();
  window.speechSynthesis.onvoiceschanged = populateVoices;
}

function populateVoices() {
  voices = window.speechSynthesis.getVoices();
  updateVoiceOptions();
}

function updateVoiceOptions() {
  voiceSelect.textContent = '';
  voiceSelect.appendChild(createOption('', 'Voz padrão'));

  const langPrefix = targetLangSelect.value.split('-')[0].toLowerCase();
  voices
    .filter((voice) => voice.lang.toLowerCase().startsWith(langPrefix))
    .forEach((voice) => {
      voiceSelect.appendChild(createOption(voice.voiceURI, cleanVoiceName(voice.name)));
    });
}

function cleanVoiceName(name) {
  return name.replace(/-?\s*desktop/gi, '').replace(/microsoft/gi, '').trim() || name;
}

function speakTranslatedText() {
  const text = sanitizeInput(targetText.value);
  if (!text) {
    setStatus('Não há tradução para reproduzir.', 'info');
    return;
  }

  if (!('speechSynthesis' in window)) {
    setStatus('Leitura em voz alta não está disponível neste navegador.', 'info');
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = targetLangSelect.value;
  const selectedVoice = voices.find((voice) => voice.voiceURI === voiceSelect.value);
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.onerror = () => setStatus('Não foi possível reproduzir o áudio.', 'error');

  window.speechSynthesis.speak(utterance);
}

function startSpeechToText() {
  const SpeechRecognitionApi = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionApi) {
    setStatus('Ditado por voz não é suportado neste navegador.', 'info');
    return;
  }

  if (speechRecognition) speechRecognition.abort();
  speechRecognition = new SpeechRecognitionApi();
  speechRecognition.lang = sourceLangSelect.value === DEFAULT_SOURCE ? (navigator.language || 'pt-BR') : sourceLangSelect.value;
  speechRecognition.continuous = false;
  speechRecognition.interimResults = false;

  micBtn.classList.add('active');
  setStatus('Ouvindo… fale agora.', 'info');

  speechRecognition.onresult = (event) => {
    const transcript = event.results?.[0]?.[0]?.transcript || '';
    sourceText.value = transcript;
    updateActionButtons();
    handleTranslate();
  };

  speechRecognition.onerror = (event) => {
    if (event.error === 'not-allowed' || event.error === 'permission-denied') {
      setStatus('Permissão de microfone negada. Abra a ajuda para conceder acesso.', 'error');
      openPopupWindow('permission.html', 360, 340);
      return;
    }

    if (event.error === 'no-speech') {
      setStatus('Nenhuma fala detectada. Tente novamente.', 'info');
      return;
    }

    if (event.error === 'network') {
      setStatus('Erro de rede no reconhecimento de voz.', 'error');
      return;
    }

    setStatus(`Erro no reconhecimento de voz (${event.error}).`, 'error');
  };

  speechRecognition.onend = () => {
    micBtn.classList.remove('active');
  };

  try {
    speechRecognition.start();
  } catch {
    micBtn.classList.remove('active');
    setStatus('Não foi possível iniciar o microfone agora.', 'error');
  }
}

async function copyToClipboard(text) {
  const safeText = String(text || '').trim();
  if (!safeText) return;

  try {
    await navigator.clipboard.writeText(safeText);
    setStatus('Texto copiado.', 'success');
  } catch (error) {
    console.error('Erro ao copiar texto:', error);
    setStatus('Falha ao copiar texto.', 'error');
  }
}

async function saveToHistory(original, translated, source, target) {
  const { [STORAGE_KEYS.history]: existingHistory = [] } = await storageGet([STORAGE_KEYS.history]);

  const normalizedOriginal = sanitizeInput(original);
  const normalizedKey = normalizeForComparison(original);
  const history = existingHistory.filter((item) => normalizeForComparison(item.original) !== normalizedKey || item.target !== target);
  history.unshift({ original: normalizedOriginal, translated, source, target, timestamp: Date.now() });

  await storageSet({ [STORAGE_KEYS.history]: history.slice(0, HISTORY_LIMIT) });
}

async function loadHistory() {
  const { [STORAGE_KEYS.history]: history = [] } = await storageGet([STORAGE_KEYS.history]);
  renderHistory(history);
}

function renderHistory(history) {
  historyList.textContent = '';

  if (!history.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 'Ainda não há traduções salvas.';
    historyList.appendChild(empty);
    return;
  }

  history.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'history-item';

    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', 'Carregar tradução no editor');
    button.addEventListener('click', () => useHistoryItem(item));

    const lang = document.createElement('div');
    lang.className = 'history-lang';
    lang.textContent = `${getLangName(item.source)} → ${getLangName(item.target)}`;

    const original = document.createElement('div');
    original.className = 'history-original';
    original.textContent = item.original;
    original.title = item.original;

    const translated = document.createElement('div');
    translated.className = 'history-translated';
    translated.textContent = item.translated;
    translated.title = item.translated;

    button.append(lang, original, translated);
    li.appendChild(button);
    historyList.appendChild(li);
  });
}

function useHistoryItem(item) {
  sourceText.value = item.original;
  targetText.value = item.translated;
  sourceLangSelect.value = isAutodetectValue(item.source) ? DEFAULT_SOURCE : ensureLanguageValue(item.source, DEFAULT_SOURCE, sourceLangSelect);
  targetLangSelect.value = ensureLanguageValue(item.target, DEFAULT_TARGET, targetLangSelect);
  tabs[0].click();
  updateVoiceOptions();
  updateActionButtons();
}

async function clearHistory() {
  const shouldClear = window.confirm('Deseja remover todo o histórico salvo localmente?');
  if (!shouldClear) return;

  await storageSet({ [STORAGE_KEYS.history]: [] });
  await loadHistory();
  setStatus('Histórico removido.', 'success');
}

async function loadSettings() {
  const settings = await storageGet([STORAGE_KEYS.lastSource, STORAGE_KEYS.lastTarget]);
  sourceLangSelect.value = ensureLanguageValue(settings[STORAGE_KEYS.lastSource], DEFAULT_SOURCE, sourceLangSelect);
  targetLangSelect.value = ensureLanguageValue(settings[STORAGE_KEYS.lastTarget], DEFAULT_TARGET, targetLangSelect);
}

function ensureLanguageValue(value, fallback, selectEl) {
  if (!value) return fallback;
  const hasValue = Array.from(selectEl.options).some((option) => option.value === value);
  return hasValue ? value : fallback;
}

function isAutodetectValue(value) {
  return value === DEFAULT_SOURCE || value === 'Autodetect';
}

async function preloadContextMenuSelection() {
  const params = new URLSearchParams(window.location.search);
  const rawText = params.get('text');
  const auto = params.get('auto') === 'true';
  contextMenuSelectionWasTruncated = params.get('truncated') === 'true';

  if (!rawText) return;
  const text = sanitizeInput(rawText);
  sourceText.value = text;
  updateActionButtons();

  if (auto && text) handleTranslate();
}

async function showReviewBannerIfNeeded() {
  const settings = await storageGet([STORAGE_KEYS.translationCount, STORAGE_KEYS.hasReviewed]);
  if (settings[STORAGE_KEYS.hasReviewed]) return;
  if ((settings[STORAGE_KEYS.translationCount] || 0) >= REVIEW_THRESHOLD) {
    reviewBanner.hidden = false;
  }
}

function hideReviewBanner() {
  reviewBanner.hidden = true;
}

async function incrementTranslationCount() {
  const current = await storageGet([STORAGE_KEYS.translationCount]);
  const count = (current[STORAGE_KEYS.translationCount] || 0) + 1;
  await storageSet({ [STORAGE_KEYS.translationCount]: count });

  if (count >= REVIEW_THRESHOLD) reviewBanner.hidden = false;
}

async function getFromCache(key) {
  const { [STORAGE_KEYS.cache]: cache = [] } = await storageGet([STORAGE_KEYS.cache]);
  return cache.find((item) => item.key === key) || null;
}

async function cacheTranslation(key, translatedText, detectedSource) {
  const { [STORAGE_KEYS.cache]: currentCache = [] } = await storageGet([STORAGE_KEYS.cache]);
  const cache = currentCache.filter((item) => item.key !== key);
  cache.unshift({ key, translatedText, detectedSource, timestamp: Date.now() });
  await storageSet({ [STORAGE_KEYS.cache]: cache.slice(0, CACHE_LIMIT) });
}

function getFriendlyError(error) {
  if (!error?.message) return 'Erro inesperado durante a tradução.';
  if (error.message.includes('HTTP')) return 'Serviço de tradução indisponível no momento.';
  if (error.message.includes('network')) return 'Sem conexão com a internet.';
  return error.message;
}

function getLangName(code) {
  if (!code || code === 'Autodetect' || code === DEFAULT_SOURCE) return 'Detectado';
  return LANGUAGES[code] || code;
}

function setStatus(message, type = 'info') {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
}

function createOption(value, label) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  return option;
}

function isFirefox() {
  if (globalThis.browser && !globalThis.chrome) return true;
  const extensionUrl = browserApi?.runtime?.getURL?.('') || '';
  return extensionUrl.startsWith('moz-extension://');
}

function getReviewUrl() {
  return isFirefox() ? FIREFOX_REVIEW_URL : EDGE_REVIEW_URL;
}

function openNewTab(url) {
  if (browserApi?.tabs?.create) browserApi.tabs.create({ url });
}

function openPopupWindow(url, width, height) {
  if (browserApi?.windows?.create) {
    browserApi.windows.create({ url, type: 'popup', width, height, focused: true });
  }
}

async function storageGet(keys) {
  if (!browserApi?.storage?.local) return {};

  try {
    const result = await browserApi.storage.local.get(keys);
    return result || {};
  } catch (promiseError) {
    return new Promise((resolve) => {
      try {
        browserApi.storage.local.get(keys, (result) => {
          if (browserApi.runtime?.lastError) {
            console.error(browserApi.runtime.lastError.message);
            resolve({});
            return;
          }
          resolve(result || {});
        });
      } catch (callbackError) {
        console.error(promiseError);
        console.error(callbackError);
        resolve({});
      }
    });
  }
}

async function storageSet(values) {
  if (!browserApi?.storage?.local) return;

  try {
    await browserApi.storage.local.set(values);
    return true;
  } catch (promiseError) {
    if (isStorageQuotaError(promiseError)) {
      await clearStoredCache();

      try {
        await browserApi.storage.local.set(values);
        return true;
      } catch (retryError) {
        if (!isStorageQuotaError(retryError)) {
          console.error(retryError);
        }
      }
    }

    return await new Promise((resolve) => {
      try {
        browserApi.storage.local.set(values, () => {
          if (browserApi.runtime?.lastError) {
            const lastErrorMessage = browserApi.runtime.lastError.message || '';
            if (isStorageQuotaError(browserApi.runtime.lastError)) {
              clearStoredCache().then(() => resolve(false));
              return;
            }

            console.error(lastErrorMessage);
            resolve(false);
            return;
          }

          resolve(true);
        });
      } catch (callbackError) {
        console.error(promiseError);
        console.error(callbackError);
        resolve(false);
      }
    });
  }
}

function isStorageQuotaError(error) {
  const message = String(error?.message || error?.toString?.() || '');
  return error?.name === 'QuotaExceededError' || /quota|storage area is full/i.test(message);
}

async function clearStoredCache() {
  try {
    await browserApi.storage.local.set({ [STORAGE_KEYS.cache]: [] });
  } catch (error) {
    if (!isStorageQuotaError(error)) {
      console.error(error);
    }
  }
}
