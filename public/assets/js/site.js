(() => {
  'use strict';

  const NAV_ITEMS = [
    { href: '/', label: '首頁' },
    { href: '/introduction/', label: '系統介紹' },
    { href: '/student-manual/', label: '學生手冊' },
    { href: '/admin-manual/', label: '管理手冊' },
    { href: '/release-notes/', label: '發布紀錄' }
  ];

  const normalizePath = (value) => {
    const path = (value || '/').split('?')[0].split('#')[0];
    return path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`;
  };

  const currentPath = normalizePath(window.location.pathname);

  const isActive = (href) => {
    const target = normalizePath(href);
    if (target === '/') return currentPath === '/';
    return currentPath.startsWith(target);
  };

  const injectGlobalStyles = () => {
    if (document.getElementById('docs-global-ui-styles')) return;

    const style = document.createElement('style');
    style.id = 'docs-global-ui-styles';
    style.textContent = `
      .docs-navbar{position:sticky;top:0;z-index:10000;border-bottom:1px solid #d9e2de;background:rgba(255,255,255,.96);box-shadow:0 5px 18px rgba(19,37,31,.07);backdrop-filter:blur(14px);font-family:Arial,"Noto Sans TC","Microsoft JhengHei","PingFang TC",sans-serif}
      .docs-navbar__inner{width:min(100% - 24px,1180px);min-height:62px;margin:0 auto;display:flex;align-items:center;gap:24px}
      .docs-navbar__brand{flex:0 0 auto;color:#14364a!important;font-size:15px;font-weight:900;line-height:1.25;text-decoration:none!important;white-space:nowrap}
      .docs-navbar__links{display:flex;align-items:center;gap:4px;min-width:0;margin-left:auto;overflow-x:auto;scrollbar-width:none}
      .docs-navbar__links::-webkit-scrollbar{display:none}
      .docs-navbar__link{position:relative;display:inline-flex;align-items:center;min-height:42px;padding:8px 12px;border-radius:9px;color:#43545c!important;font-size:14px;font-weight:750;text-decoration:none!important;white-space:nowrap}
      .docs-navbar__link:hover{background:#eef5f2;color:#145340!important}
      .docs-navbar__link[aria-current="page"]{background:#e4f3ec;color:#145340!important}
      .docs-navbar__link[aria-current="page"]::after{content:"";position:absolute;left:12px;right:12px;bottom:5px;height:2px;border-radius:999px;background:#1b6f58}
      .docs-global-dialog{width:min(96vw,1600px);max-height:96vh;padding:0;border:0;border-radius:16px;background:#f1f5f3;box-shadow:0 24px 80px rgba(0,0,0,.4)}
      .docs-global-dialog::backdrop{background:rgba(11,18,20,.76)}
      .docs-global-dialog__wrap{position:relative;max-height:96vh;overflow:auto}
      .docs-global-dialog__image{display:block;width:100%;height:auto}
      .docs-global-dialog__close{position:sticky;top:12px;z-index:3;float:right;margin:12px 12px -50px 0;padding:8px 13px;border:1px solid #c8d4cf;border-radius:999px;background:rgba(255,255,255,.96);color:#2a3d43;font-weight:800;cursor:pointer}
      #research .project-details{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 18px;margin:20px 0 0;padding:18px;border:1px solid #d9e2de;border-radius:14px;background:#f8faf9}
      #research .project-detail{margin:0!important;color:#40535b}
      #research .project-detail strong{display:block;margin-bottom:4px;color:#29404a}
      #research .project-detail--wide{grid-column:1/-1}
      #research .open-source-statement{margin-top:24px;padding-top:24px;border-top:1px solid #d9e2de;color:#40535b}
      #research .open-source-statement h3{margin:0 0 16px;color:#29404a;font-size:19px}
      #research .open-source-statement p{margin:0 0 14px}
      #research .open-source-statement a{font-weight:800;overflow-wrap:anywhere}
      #research .project-title-en{margin:16px 0;padding:16px 18px;border-left:4px solid #1b6f58;border-radius:0 12px 12px 0;background:#f3f8f5;color:#29404a;font-weight:700;line-height:1.75}
      @media(max-width:720px){.docs-navbar__inner{min-height:56px;gap:12px}.docs-navbar__brand{font-size:13px}.docs-navbar__link{padding:7px 10px;font-size:13px}#research .project-details{grid-template-columns:1fr}#research .project-detail--wide{grid-column:auto}}
      @media(max-width:470px){.docs-navbar__inner{width:100%;padding:0 10px;display:block}.docs-navbar__brand{display:block;padding:9px 4px 2px}.docs-navbar__links{margin:0 -2px;padding:0 0 7px}.docs-navbar__link{min-height:36px}}
      @media print{.docs-navbar,.docs-global-dialog{display:none!important}}
    `;
    document.head.appendChild(style);
  };

  const removeAdHocNavigation = () => {
    document.querySelectorAll('.page-nav').forEach((node) => node.remove());

    if (currentPath === '/introduction/') {
      document.querySelectorAll('.hero-actions').forEach((group) => {
        const links = [...group.querySelectorAll('a[href]')];
        const onlyDocumentationLinks = links.length > 0 && links.every((link) => {
          const href = normalizePath(link.getAttribute('href'));
          return NAV_ITEMS.some((item) => normalizePath(item.href) === href);
        });
        if (onlyDocumentationLinks) group.remove();
      });
    }
  };

  const applyIntroductionResearchContent = () => {
    if (currentPath !== '/introduction/') return;

    const researchCard = document.querySelector('#research .project-card');
    if (!researchCard) return;

    researchCard.innerHTML = `
      <p>本系統原始版本係於中華民國（臺灣）教育部教學實踐研究計畫支持下，為國立雲林科技大學職場英文課程所開發。</p>

      <div class="project-details" aria-label="研究計畫資訊">
        <p class="project-detail project-detail--wide"><strong>計畫名稱</strong>「AI 輔助之英文面試訓練模組 --探討其對學習者面試表現提昇與語言焦慮降低的影響」</p>
        <p class="project-detail"><strong>計畫主持人</strong>蘇姿文（Tzu-Wen Su）</p>
        <p class="project-detail"><strong>系統設計與開發</strong>洪名琮（Ming-Tsung Hung）</p>
        <p class="project-detail project-detail--wide"><strong>執行學校</strong>國立雲林科技大學<br>National Yunlin University of Science and Technology</p>
      </div>

      <div class="open-source-statement" lang="en">
        <h3>Open-source and Project Information</h3>
        <p>For technical documentation and implementation details, please refer to the source code:</p>
        <p><a href="https://github.com/bridgerhung/oral" target="_blank" rel="noopener noreferrer">github.com/bridgerhung/oral</a></p>
        <p>This project is released as open-source software under the Apache License 2.0.</p>
        <p><strong>AI English Oral Interview Practice System</strong></p>
        <p>Copyright © 2026 Ming-Tsung Hung</p>
        <p>This software was originally developed as part of a Teaching Practice Research Project funded by the Ministry of Education, Republic of China (Taiwan):</p>
        <div class="project-title-en">“AI-Assisted English Interview Training Module:<br>Investigating Its Effects on Learners’ Interview Performance<br>and the Reduction of Language Anxiety”</div>
        <p><strong>Principal Investigator:</strong><br>Tzu-Wen Su</p>
        <p><strong>Institution:</strong><br>National Yunlin University of Science and Technology</p>
      </div>
    `;

    const footer = document.querySelector('.footer');
    if (footer) footer.textContent = 'Copyright © 2026 洪名琮 Ming-Tsung Hung';
  };

  const injectNavbar = () => {
    if (!document.body || document.querySelector('.docs-navbar')) return;

    const nav = document.createElement('nav');
    nav.className = 'docs-navbar';
    nav.setAttribute('aria-label', '全站文件導覽');

    const inner = document.createElement('div');
    inner.className = 'docs-navbar__inner';

    const brand = document.createElement('a');
    brand.className = 'docs-navbar__brand';
    brand.href = '/';
    brand.textContent = 'AI 英語面試練習系統';
    inner.appendChild(brand);

    const links = document.createElement('div');
    links.className = 'docs-navbar__links';

    NAV_ITEMS.forEach((item) => {
      const link = document.createElement('a');
      link.className = 'docs-navbar__link';
      link.href = item.href;
      link.textContent = item.label;
      if (isActive(item.href)) link.setAttribute('aria-current', 'page');
      links.appendChild(link);
    });

    inner.appendChild(links);
    nav.appendChild(inner);
    document.body.insertBefore(nav, document.body.firstChild);
  };

  const ensureFallbackDialog = () => {
    let dialog = document.getElementById('docsGlobalImageDialog');
    if (dialog) return dialog;

    dialog = document.createElement('dialog');
    dialog.id = 'docsGlobalImageDialog';
    dialog.className = 'docs-global-dialog';
    dialog.innerHTML = `
      <div class="docs-global-dialog__wrap">
        <button class="docs-global-dialog__close" type="button" aria-label="關閉放大圖片">✕ 關閉</button>
        <img class="docs-global-dialog__image" alt="放大圖片">
      </div>
    `;
    document.body.appendChild(dialog);

    dialog.querySelector('.docs-global-dialog__close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    return dialog;
  };

  const openImage = (source, altText = '放大圖片') => {
    if (!source) return;

    const standardDialog = document.getElementById('imageModal');
    const standardImage = document.getElementById('modalImage');
    if (standardDialog && standardImage && typeof standardDialog.showModal === 'function') {
      standardImage.src = source;
      standardImage.alt = altText;
      if (!standardDialog.open) standardDialog.showModal();
      return;
    }

    const adminDialog = document.getElementById('modal');
    const adminImage = document.getElementById('modalImg');
    if (adminDialog && adminImage && typeof adminDialog.showModal === 'function') {
      adminImage.src = source;
      adminImage.alt = altText;
      if (!adminDialog.open) adminDialog.showModal();
      return;
    }

    const dialog = ensureFallbackDialog();
    const image = dialog.querySelector('.docs-global-dialog__image');
    image.src = source;
    image.alt = altText;
    if (!dialog.open) dialog.showModal();
  };

  const bindImageZoom = () => {
    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-zoom-src],.figure-card button,.shot-btn,.screen-button');
      if (!trigger) return;

      const image = trigger.querySelector('img');
      const source = trigger.dataset.zoomSrc || trigger.dataset.img || image?.currentSrc || image?.src;
      if (!source) return;

      event.preventDefault();
      openImage(source, trigger.dataset.zoomAlt || image?.alt || trigger.getAttribute('aria-label') || '放大圖片');
    });

    document.querySelectorAll('[data-dialog-close],.modal-close,.close').forEach((button) => {
      if (button.dataset.docsCloseBound) return;
      button.dataset.docsCloseBound = 'true';
      button.addEventListener('click', () => button.closest('dialog')?.close());
    });
  };

  const bindSectionSpy = () => {
    const navigation = document.querySelectorAll('[data-spy-nav] a[href^="#"],.sidebar a[href^="#"]');
    if (!navigation.length || !('IntersectionObserver' in window)) return;

    const sections = [...navigation]
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navigation.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-18% 0px -66% 0px' });

    sections.forEach((section) => observer.observe(section));
  };

  injectGlobalStyles();
  removeAdHocNavigation();
  applyIntroductionResearchContent();
  injectNavbar();
  bindImageZoom();
  bindSectionSpy();
})();