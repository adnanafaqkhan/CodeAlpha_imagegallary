(() => {
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCaption = document.getElementById('lbCaption');
  const lbTitle = document.getElementById('lbTitle');
  const lbCount = document.getElementById('lbCount');

  const btnClose = lightbox.querySelector('[data-close]');
  const btnPrev = lightbox.querySelector('[data-prev]');
  const btnNext = lightbox.querySelector('[data-next]');
  const backdrop = lightbox.querySelector('.lightbox__backdrop');

  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

  // Inline dataset (replace `src` with your own local images if desired)
  const images = [
    {
      id: 'nature-1',
      title: 'Forest Mist',
      caption: 'Morning fog over dense trees.',
      category: 'nature',
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'nature-2',
      title: 'Mossy Path',
      caption: 'A calm trail covered in green.',
      category: 'nature',
      src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'city-1',
      title: 'Neon Streets',
      caption: 'Lights reflecting on wet pavement.',
      category: 'city',
      src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'city-2',
      title: 'Urban Skyline',
      caption: 'Buildings fading into evening haze.',
      category: 'city',
      src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'people-1',
      title: 'Portrait Light',
      caption: 'Soft shadows and warm tones.',
      category: 'people',
      src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'people-2',
      title: 'City Runner',
      caption: 'Motion captured between streets.',
      category: 'people',
      src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'architecture-1',
      title: 'Modern Geometry',
      caption: 'Clean lines and strong contrast.',
      category: 'architecture',
      src: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'architecture-2',
      title: 'Staircase Study',
      caption: 'A pattern of steps and shadows.',
      category: 'architecture',
      src: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'nature-3',
      title: 'Sunlit Leaves',
      caption: 'Light filtering through the canopy.',
      category: 'nature',
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80'
    },
    {
      id: 'city-3',
      title: 'Bridge Glow',
      caption: 'Architecture illuminated at night.',
      category: 'city',
      src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80'
    }
  ];

  // Fix duplicate src for city-3 by choosing a different photo if you want.
  images[images.length - 1].src = 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1600&q=80';

  let activeCategory = 'all';
  let filtered = images.slice();

  let lightboxIndex = 0;
  let lastFocusedEl = null;

  function normalizeCategory(cat) {
    if (!cat) return 'all';
    return String(cat).toLowerCase();
  }

  function getFilteredImages() {
    const c = normalizeCategory(activeCategory);
    if (c === 'all') return images.slice();
    return images.filter((img) => img.category === c);
  }

  function renderGallery() {
    filtered = getFilteredImages();
    gallery.innerHTML = '';

    filtered.forEach((img, idx) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Open ${img.title}`);
      card.dataset.index = String(idx);
      card.dataset.id = img.id;

      card.innerHTML = `
        <img class="card__img" src="${img.src}" alt="${img.title}" loading="lazy" />
        <div class="card__overlay" aria-hidden="true"></div>
        <div class="card__bottom">
          <p class="card__name">${img.title}</p>
          <span class="badge">${img.category}</span>
        </div>
      `;

      card.addEventListener('click', () => openLightboxByIndex(idx));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightboxByIndex(idx);
        }
      });

      gallery.appendChild(card);
    });
  }

  function setActiveFilter(category) {
    activeCategory = category;
    filterButtons.forEach((b) => {
      const isActive = b.dataset.category === category;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
    renderGallery();

    // If lightbox is open, keep it consistent with filtered list.
    if (lightbox.classList.contains('is-open')) {
      const currentId = filtered[lightboxIndex]?.id;
      // If the current image is no longer in the filtered set, reset.
      if (!currentId) {
        lightboxIndex = 0;
        updateLightbox();
      }
    }
  }

  function openLightboxByIndex(idx) {
    lastFocusedEl = document.activeElement;
    lightboxIndex = idx;
    updateLightbox();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');

    // Focus close button for accessibility
    btnClose?.focus?.();
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');

    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  }

  function updateLightbox() {
    const img = filtered[lightboxIndex];
    if (!img) return;

    lbImage.src = img.src;
    lbImage.alt = img.title;
    lbCaption.textContent = img.caption;
    lbTitle.textContent = img.title;
    lbCount.textContent = `${lightboxIndex + 1} / ${filtered.length}`;
  }

  function moveNext() {
    if (!filtered.length) return;
    lightboxIndex = (lightboxIndex + 1) % filtered.length;
    updateLightbox();
  }

  function movePrev() {
    if (!filtered.length) return;
    lightboxIndex = (lightboxIndex - 1 + filtered.length) % filtered.length;
    updateLightbox();
  }

  // Filter controls
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveFilter(btn.dataset.category || 'all');
    });
  });

  // Lightbox events
  btnClose?.addEventListener('click', closeLightbox);
  backdrop?.addEventListener('click', closeLightbox);
  btnPrev?.addEventListener('click', movePrev);
  btnNext?.addEventListener('click', moveNext);

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') moveNext();
    if (e.key === 'ArrowLeft') movePrev();
  });

  // Initial render
  renderGallery();
  setActiveFilter('all');
})();

