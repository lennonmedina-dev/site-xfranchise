// Rotativo de estatísticas: cada info entra, sai e volta em loop
const statSlides = document.querySelectorAll('.stat-slide');
if (statSlides.length > 1) {
  let statIndex = 0;
  setInterval(() => {
    const current = statSlides[statIndex];
    current.classList.remove('is-active');
    current.classList.add('is-leaving');
    setTimeout(() => current.classList.remove('is-leaving'), 500);

    statIndex = (statIndex + 1) % statSlides.length;
    statSlides[statIndex].classList.add('is-active');
  }, 3000);
}

// Radar: duplica o conteúdo para o loop contínuo não ter emenda
const radarScroll = document.querySelector('.radar-scroll');
if (radarScroll) {
  radarScroll.innerHTML += radarScroll.innerHTML;
}

// Botão pausar/continuar o radar
const radarToggle = document.getElementById('radarToggle');
if (radarToggle && radarScroll) {
  radarToggle.addEventListener('click', () => {
    const paused = radarScroll.classList.toggle('paused');
    radarToggle.classList.toggle('is-paused', paused);
    radarToggle.setAttribute('aria-label', paused ? 'Continuar novidades' : 'Pausar novidades');
  });
}

// Buscador de franquias (placeholder — integra com o guia depois)
const finderForm = document.getElementById('finderForm');
if (finderForm) {
  finderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const segmento = document.getElementById('segmento').value;
    const investimento = document.getElementById('investimento').value;
    console.log('Busca:', { segmento, investimento });
    // TODO: levar para a página do guia com os filtros aplicados
  });
}

// Newsletter (placeholder)
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterForm.innerHTML = '<p style="color:#9FC9AD;font-weight:600;padding:13px 0">Pronto. Confirme a inscrição no e-mail que acabamos de enviar.</p>';
    // TODO: integrar com o serviço de e-mail/CRM
  });
}

// Números do setor: contagem animada + barra que cresce quando entra na tela
const mercadoStats = document.querySelector('.mercado-stats');
if (mercadoStats) {
  const animateCount = (el) => {
    const target = parseInt(el.dataset.value, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1500;
    const start = performance.now();
    const fmt = (n) => n.toLocaleString('pt-BR');

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        mercadoStats.classList.add('stats-in');
        mercadoStats.querySelectorAll('strong[data-value]').forEach(animateCount);
        statsObserver.disconnect();
      }
    },
    { threshold: 0.3 }
  );
  statsObserver.observe(mercadoStats);
}

// Shine nos títulos: só roda enquanto a seção está visível (e reinicia a cada entrada)
const shineTargets = document.querySelectorAll('.label, .hero-portal, .stat-strip-label');

const shineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('shine-run', entry.isIntersecting);
    });
  },
  { threshold: 0.4 }
);

shineTargets.forEach((el) => shineObserver.observe(el));

// Rotativo de parceiros: logo + info trocando em loop
const partnerSlides = document.querySelectorAll('.partner-slide');
if (partnerSlides.length > 1) {
  let partnerIndex = 0;
  setInterval(() => {
    const current = partnerSlides[partnerIndex];
    current.classList.remove('is-active');
    current.classList.add('is-leaving');
    setTimeout(() => current.classList.remove('is-leaving'), 500);

    partnerIndex = (partnerIndex + 1) % partnerSlides.length;
    partnerSlides[partnerIndex].classList.add('is-active');
  }, 3200);
}

// Carrossel de capas da revista
const carTrack = document.querySelector('.car-track');
if (carTrack) {
  const step = 268;
  const next = () => {
    const fim = carTrack.scrollLeft + carTrack.clientWidth >= carTrack.scrollWidth - 8;
    carTrack.scrollTo({ left: fim ? 0 : carTrack.scrollLeft + step, behavior: 'smooth' });
  };
  document.querySelector('.car-prev')?.addEventListener('click', () => {
    carTrack.scrollBy({ left: -step, behavior: 'smooth' });
  });
  document.querySelector('.car-next')?.addEventListener('click', () => {
    next();
  });

  let carTimer = setInterval(next, 2800);
  const carousel = carTrack.closest('.revista-carousel');
  carousel.addEventListener('mouseenter', () => clearInterval(carTimer));
  carousel.addEventListener('mouseleave', () => {
    clearInterval(carTimer);
    carTimer = setInterval(next, 2800);
  });
}

// Reveal suave das seções ao rolar
const revealTargets = document.querySelectorAll(
  '.blog-layout, .finder, .franchise-grid, .stat-strip, .duo, .mercado-grid, .newsletter-inner'
);

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealTargets.forEach((el) => {
  el.classList.add('reveal');
  io.observe(el);
});
