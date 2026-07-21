(() => {
  'use strict';

  const subtitle = document.getElementById('legalVersionSummary');
  const status = document.getElementById('legalManifestStatus');
  const cards = {
    system_terms: document.querySelector('[data-legal-document="system_terms"]'),
    privacy_notice: document.querySelector('[data-legal-document="privacy_notice"]')
  };

  const applyDocument = (key, data) => {
    const card = cards[key];
    if (!card || !data) return;
    const title = card.querySelector('[data-legal-title]');
    const version = card.querySelector('[data-legal-version]');
    if (title && data.title) title.textContent = data.title;
    if (version) version.textContent = `版本 ${data.version || '未標示'} →`;
    card.href = data.latest_url || data.version_url || card.href;
  };

  fetch('/legal/manifest.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((manifest) => {
      const documents = manifest.documents || {};
      applyDocument('system_terms', documents.system_terms);
      applyDocument('privacy_notice', documents.privacy_notice);
      const versions = [...new Set(Object.values(documents).map((item) => item?.version).filter(Boolean))];
      if (subtitle) subtitle.textContent = versions.length === 1
        ? `版本 ${versions[0]}｜核准版`
        : '各文件依其標示版本為準';
      if (status) status.textContent = `文件清單更新：${manifest.updated_at || '未標示'}`;
    })
    .catch((error) => {
      if (status) status.textContent = `文件版本資訊載入失敗：${error.message}`;
    });
})();
