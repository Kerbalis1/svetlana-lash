(() => {
  'use strict';
  const config = window.SITE_CONFIG || {};
  const directDialog = document.querySelector('#direct-dialog');
  const validDirect = typeof config.directUrl === 'string' && /^https?:\/\//i.test(config.directUrl);
  document.querySelectorAll('.direct').forEach(link => {
    link.href = config.directUrl || '[ССЫЛКА НА DIRECT]';
    if (validDirect) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    else link.addEventListener('click', event => { event.preventDefault(); directDialog.showModal(); });
  });
  document.querySelectorAll('.photo-slot').forEach(slot => {
    const isPortrait = slot.dataset.image === 'portrait';
    const source = isPortrait ? config.portraitImage : config.heroImage;
    if (!source) return;
    const img = document.createElement('img');
    img.alt = isPortrait ? 'Светлана Демидович' : 'Работа Светланы Демидович — наращивание ресниц';
    img.decoding = 'async';
    if (isPortrait) img.loading = 'lazy';
    img.onload = () => slot.classList.add('has-image');
    img.onerror = () => img.remove();
    img.src = source; slot.append(img);
  });
  const works = config.works || [];
  const cards = Array.from(document.querySelectorAll('.work-card'));
  cards.forEach((card, index) => {
    const work = works[index];
    if (!work) return;
    card.querySelector('.work-caption').firstChild.textContent = work.title + ' ';
    if (work.image) {
      const img = document.createElement('img'); img.alt = work.title; img.loading = 'lazy'; img.decoding = 'async';
      img.onload = () => { card.querySelector('.slot-label').hidden = true; card.setAttribute('aria-label', 'Увеличить фотографию: ' + work.title); };
      img.onerror = () => img.remove(); img.src = work.image; card.querySelector('.work-image').append(img);
    }
    card.addEventListener('click', () => { openWork(index); lightbox.showModal(); });
  });
  const lightbox = document.querySelector('#lightbox');
  const content = document.querySelector('#lightbox-content');
  let current = 0;
  function openWork(index) {
    current = (index + cards.length) % cards.length;
    const work = works[current] || { title: 'Работа', image: null };
    content.replaceChildren();
    if (work.image) {
      const img = document.createElement('img'); img.src = work.image; img.alt = work.title;
      img.onerror = () => renderPlaceholder(current); content.append(img);
    } else renderPlaceholder(current);
    document.querySelector('#lightbox-caption').textContent = work.title + ' · ' + (current + 1) + ' / ' + cards.length;
    const originalLink = document.querySelector('#original-photo');
    if (originalLink) { originalLink.hidden = !work.originalImage; if (work.originalImage) originalLink.href = work.originalImage; else originalLink.removeAttribute('href'); }
  }
  function renderPlaceholder(index) {
    const placeholder = document.createElement('div'); placeholder.className = 'lightbox-placeholder ' + ['tone-one','tone-two','tone-three'][index % 3];
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg'); svg.setAttribute('viewBox','0 0 300 160');
    const use = document.createElementNS('http://www.w3.org/2000/svg','use'); use.setAttribute('href','#eye'); svg.append(use);
    const caption = document.createElement('p'); caption.textContent = 'Здесь появится фотография моей работы';
    placeholder.append(svg,caption); content.replaceChildren(placeholder);
  }
  document.querySelector('#prev-work').addEventListener('click', () => openWork(current - 1));
  document.querySelector('#next-work').addEventListener('click', () => openWork(current + 1));
  lightbox.addEventListener('keydown', event => { if (event.key === 'ArrowRight') openWork(current + 1); if (event.key === 'ArrowLeft') openWork(current - 1); });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.modal-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
    new MutationObserver(() => { if (dialog.open) document.body.style.overflow = 'hidden'; }).observe(dialog, {attributes:true,attributeFilter:['open']});
  });
  document.querySelector('.close-direct').addEventListener('click', () => directDialog.close());
})();
