// i18n.js — Joga Audio | Bilingual ES/EN via localStorage
const JI_LANG_KEY = 'jiLang';

const STRINGS = {
  es: {
    tagline: 'Escucha. Crece. Transforma.',
    hero_sub: 'Los libros de crecimiento de Joga Intelligence, narrados con claridad y propósito.',
    hero_cta: 'EXPLORAR CATALOGO',
    hero_cta2: 'VER PLANES',
    catalog_title: 'Biblioteca Joga Audio',
    catalog_sub: 'Cada libro, narrado con intención.',
    free_chapter: 'CAPÍTULO GRATIS',
    buy_book: 'OBTENER ACCESO',
    chapters: 'capítulos',
    listen: 'ESCUCHAR',
    preview: 'VISTA PREVIA',
    all_books: 'TODOS LOS LIBROS',
    playing_now: 'Reproduciendo',
    chapter: 'Capítulo',
    speed: 'Velocidad',
    free_badge: 'Gratis',
    premium_badge: 'Premium',
    pricing_title: 'Elige tu acceso',
    pricing_sub: 'Sin suscripciones complicadas. Un libro, toda la vida.',
    plan_single: 'Un Audiobook',
    plan_single_price: '$19 USD',
    plan_single_desc: 'Acceso de por vida a un audiobook de tu elección.',
    plan_all: 'Biblioteca Completa',
    plan_all_price: '$79 USD / año',
    plan_all_desc: 'Todos los audiobooks actuales y futuros. Se renueva anualmente.',
    plan_cta1: 'ELEGIR LIBRO',
    plan_cta2: 'ACCESO COMPLETO',
    footer_copy: '© 2026 Joga Intelligence. Todos los derechos reservados.',
    free_preview_notice: 'Vista previa — Capítulo 1 disponible gratis.',
    get_full: 'OBTENER LIBRO COMPLETO',
    search_placeholder: 'Buscar audiobook...',
    filter_all: 'Todos',
    filter_mind: 'Mente',
    filter_habits: 'Hábitos',
    filter_purpose: 'Propósito',
    filter_money: 'Dinero',
    filter_sales: 'Ventas',
    filter_time: 'Tiempo',
    stat_audiobooks: 'Audiolibros',
    stat_chapters: 'Capítulos',
    stat_narrated: 'Ya narrado',
    coming_soon: 'Próximamente',
    narrated_in_spanish: 'narrado en español',
  },
  en: {
    tagline: 'Listen. Grow. Transform.',
    hero_sub: 'Joga Intelligence growth books, narrated with clarity and purpose.',
    hero_cta: 'EXPLORE CATALOG',
    hero_cta2: 'VIEW PLANS',
    catalog_title: 'Joga Audio Library',
    catalog_sub: 'Every book, narrated with intention.',
    free_chapter: 'FREE CHAPTER',
    buy_book: 'GET ACCESS',
    chapters: 'chapters',
    listen: 'LISTEN',
    preview: 'PREVIEW',
    all_books: 'ALL BOOKS',
    playing_now: 'Now Playing',
    chapter: 'Chapter',
    speed: 'Speed',
    free_badge: 'Free',
    premium_badge: 'Premium',
    pricing_title: 'Choose your access',
    pricing_sub: 'No complex subscriptions. One book, for life.',
    plan_single: 'One Audiobook',
    plan_single_price: '$19 USD',
    plan_single_desc: 'Lifetime access to one audiobook of your choice.',
    plan_all: 'Full Library',
    plan_all_price: '$79 USD / year',
    plan_all_desc: 'All current and future audiobooks. Renews annually.',
    plan_cta1: 'CHOOSE A BOOK',
    plan_cta2: 'FULL ACCESS',
    footer_copy: '© 2026 Joga Intelligence. All rights reserved.',
    free_preview_notice: 'Preview — Chapter 1 available free.',
    get_full: 'GET FULL BOOK',
    search_placeholder: 'Search audiobooks...',
    filter_all: 'All',
    filter_mind: 'Mind',
    filter_habits: 'Habits',
    filter_purpose: 'Purpose',
    filter_money: 'Money',
    filter_sales: 'Sales',
    filter_time: 'Time',
    stat_audiobooks: 'Audiobooks',
    stat_chapters: 'Chapters',
    stat_narrated: 'Narrated so far',
    coming_soon: 'Coming soon',
    narrated_in_spanish: 'narrated in Spanish',
  }
};

function getLang() {
  return localStorage.getItem(JI_LANG_KEY) || 'es';
}

function t(key) {
  const lang = getLang();
  return (STRINGS[lang] && STRINGS[lang][key]) || STRINGS['es'][key] || key;
}

function toggleLang() {
  const next = getLang() === 'es' ? 'en' : 'es';
  localStorage.setItem(JI_LANG_KEY, next);
  applyLang();
}

function applyLang() {
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.getAttribute('data-t');
    const attr = el.getAttribute('data-t-attr');
    if (attr) el.setAttribute(attr, t(key));
    else el.textContent = t(key);
  });
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = getLang() === 'es' ? 'EN' : 'ES';
  if (typeof onLangChange === 'function') onLangChange();
}
