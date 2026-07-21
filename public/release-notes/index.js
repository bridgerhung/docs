(() => {
  'use strict';

  const list = document.getElementById('releaseList');
  const latestButton = document.getElementById('latestReleaseButton');
  const status = document.getElementById('releaseStatus');
  const search = document.getElementById('releaseSearch');
  let releases = [];

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const typeLabel = (type) => ({
    stable: '穩定版',
    development: '開發紀事',
    announcement: '重要公告',
    feedback: '回饋處理'
  }[type] || '發布紀錄');

  const render = (items) => {
    if (!items.length) {
      list.innerHTML = '<p class="note">目前沒有符合條件的發布紀錄。</p>';
      return;
    }

    list.innerHTML = items.map((item) => `
      <article class="card release-card">
        <div class="release-card__meta">
          <span class="badge">${escapeHtml(typeLabel(item.type))}</span>
          <span>${escapeHtml(item.date || '')}</span>
          ${item.version ? `<span>${escapeHtml(item.version)}</span>` : ''}
        </div>
        <h2>${escapeHtml(item.title || item.date || '發布紀錄')}</h2>
        ${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ''}
        <a class="button primary" href="${escapeHtml(item.url)}">查看公告</a>
      </article>
    `).join('');
  };

  const applySearch = () => {
    const keyword = String(search?.value || '').trim().toLocaleLowerCase('zh-TW');
    if (!keyword) return render(releases);
    render(releases.filter((item) => [item.title, item.version, item.summary, item.date, typeLabel(item.type)]
      .some((value) => String(value || '').toLocaleLowerCase('zh-TW').includes(keyword))));
  };

  fetch('/release-notes/releases.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      releases = Array.isArray(data.releases) ? data.releases.slice() : [];
      releases.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
      const latest = releases.find((item) => item.featured) || releases[0];
      if (latest && latestButton) {
        latestButton.href = latest.url;
        latestButton.textContent = `最新版本：${latest.date}${latest.version ? `｜${latest.version}` : ''}`;
      }
      if (status) status.textContent = `共 ${releases.length} 筆發布紀錄`;
      render(releases);
    })
    .catch((error) => {
      if (status) status.textContent = '發布紀錄索引載入失敗';
      list.innerHTML = `<p class="warn">目前無法載入發布紀錄：${escapeHtml(error.message)}</p>`;
    });

  search?.addEventListener('input', applySearch);
})();
