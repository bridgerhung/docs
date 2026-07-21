(() => {
  const dialog = document.getElementById('imageModal');
  const dialogImage = document.getElementById('modalImage');

  document.querySelectorAll('[data-zoom-src]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!dialog || !dialogImage) {
        return;
      }

      dialogImage.src = button.dataset.zoomSrc;
      dialogImage.alt = button.dataset.zoomAlt || dialogImage.alt;
      dialog.showModal();
    });
  });

  const closeButton = document.querySelector('[data-dialog-close]');
  if (dialog && closeButton) {
    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  }

  const navigation = document.querySelectorAll('[data-spy-nav] a');
  if (navigation.length > 0) {
    const sections = Array.from(navigation)
      .map((link) => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navigation.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      });
    }, { rootMargin: '-18% 0px -66% 0px' });

    sections.forEach((section) => observer.observe(section));
  }
})();
