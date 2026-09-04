// catalog.js — Joga Audio | Book data + catalog render
const CATALOG = [
  {
    id: 'claridad-mental',
    slug: 'claridad-mental',
    category: 'mind',
    title_es: 'Claridad Mental',
    title_en: 'Mental Clarity',
    subtitle_es: 'Domina tu mente. Decide con precisión.',
    subtitle_en: 'Master your mind. Decide with precision.',
    author: 'Joga',
    duration: '4h 28min',
    chapters_count: 8,
    color: '#2D4A3E',
    accent: '#7EC8A0',
    price: '$19 USD',
    chapters: [
      { id: 1, title_es: 'El ruido que nunca para', title_en: 'The Noise That Never Stops', duration: '32min', free: true, audio: 'audio/claridad-mental/es/ch01.mp3' },
      { id: 2, title_es: 'La arquitectura del pensamiento', title_en: 'The Architecture of Thought', duration: '35min', free: false, audio: 'audio/claridad-mental/es/ch02.mp3' },
      { id: 3, title_es: 'Foco sin esfuerzo', title_en: 'Effortless Focus', duration: '28min', free: false, audio: 'audio/claridad-mental/es/ch03.mp3' },
      { id: 4, title_es: 'Emociones como datos', title_en: 'Emotions as Data', duration: '34min', free: false, audio: 'audio/claridad-mental/es/ch04.mp3' },
      { id: 5, title_es: 'Decisiones de alto impacto', title_en: 'High-Impact Decisions', duration: '36min', free: false, audio: 'audio/claridad-mental/es/ch05.mp3' },
      { id: 6, title_es: 'La mente en descanso', title_en: 'The Resting Mind', duration: '30min', free: false, audio: 'audio/claridad-mental/es/ch06.mp3' },
      { id: 7, title_es: 'Hábitos cognitivos', title_en: 'Cognitive Habits', duration: '29min', free: false, audio: 'audio/claridad-mental/es/ch07.mp3' },
      { id: 8, title_es: 'Tu mente, tu ventaja', title_en: 'Your Mind, Your Edge', duration: '24min', free: false, audio: 'audio/claridad-mental/es/ch08.mp3' },
    ]
  },
  {
    id: 'tiempo-consciente',
    slug: 'tiempo-consciente',
    category: 'time',
    title_es: 'Tiempo Consciente',
    title_en: 'Conscious Time',
    subtitle_es: 'Recupera tu tiempo. Vive con intención.',
    subtitle_en: 'Reclaim your time. Live with intention.',
    author: 'Joga',
    duration: '3h 15min',
    chapters_count: 6,
    color: '#3A2D4A',
    accent: '#B89FD4',
    price: '$19 USD',
    chapters: [
      { id: 1, title_es: 'El tiempo que se escapa', title_en: 'The Time That Slips Away', duration: '30min', free: true, audio: '' },
      { id: 2, title_es: 'Diseña tu día', title_en: 'Design Your Day', duration: '33min', free: false, audio: '' },
      { id: 3, title_es: 'El poder del bloque', title_en: 'The Power of Time Blocks', duration: '28min', free: false, audio: '' },
      { id: 4, title_es: 'Menos pero mejor', title_en: 'Less but Better', duration: '32min', free: false, audio: '' },
      { id: 5, title_es: 'Ritmos y energía', title_en: 'Rhythms and Energy', duration: '26min', free: false, audio: '' },
      { id: 6, title_es: 'Tu semana ideal', title_en: 'Your Ideal Week', duration: '26min', free: false, audio: '' },
    ]
  },
  {
    id: 'habitos-que-transforman',
    slug: 'habitos-que-transforman',
    category: 'habits',
    title_es: 'Hábitos que Transforman',
    title_en: 'Habits That Transform',
    subtitle_es: 'El cambio no es fuerza de voluntad. Es sistema.',
    subtitle_en: "Change isn't willpower. It's system.",
    author: 'Joga',
    duration: '5h 02min',
    chapters_count: 10,
    color: '#4A2D2D',
    accent: '#D4907C',
    price: '$19 USD',
    chapters: [
      { id: 1, title_es: 'Por qué los hábitos fallan', title_en: 'Why Habits Fail', duration: '28min', free: true, audio: '' },
      { id: 2, title_es: 'El ciclo del hábito', title_en: 'The Habit Loop', duration: '30min', free: false, audio: '' },
      { id: 3, title_es: 'Identidad primero', title_en: 'Identity First', duration: '32min', free: false, audio: '' },
      { id: 4, title_es: 'Stacking y anclas', title_en: 'Stacking and Anchors', duration: '28min', free: false, audio: '' },
      { id: 5, title_es: 'El entorno como aliado', title_en: 'Environment as Ally', duration: '31min', free: false, audio: '' },
      { id: 6, title_es: 'Hábitos de mañana', title_en: 'Morning Habits', duration: '29min', free: false, audio: '' },
      { id: 7, title_es: 'Resistencia y fricción', title_en: 'Resistance and Friction', duration: '27min', free: false, audio: '' },
      { id: 8, title_es: 'Medir sin obsesión', title_en: 'Measure Without Obsession', duration: '30min', free: false, audio: '' },
      { id: 9, title_es: 'Cuando rompes la racha', title_en: 'When You Break the Streak', duration: '25min', free: false, audio: '' },
      { id: 10, title_es: 'El sistema completo', title_en: 'The Complete System', duration: '22min', free: false, audio: '' },
    ]
  },
  {
    id: 'tu-proposito',
    slug: 'tu-proposito',
    category: 'purpose',
    title_es: 'Tu Propósito',
    title_en: 'Your Purpose',
    subtitle_es: 'Encuentra tu norte. Actúa desde lo que importa.',
    subtitle_en: 'Find your north. Act from what matters.',
    author: 'Joga',
    duration: '3h 48min',
    chapters_count: 7,
    color: '#2D3A4A',
    accent: '#7CA8D4',
    price: '$19 USD',
    chapters: [
      { id: 1, title_es: 'La pregunta que cambia todo', title_en: 'The Question That Changes Everything', duration: '30min', free: true, audio: '' },
      { id: 2, title_es: 'Valores como brújula', title_en: 'Values as Compass', duration: '34min', free: false, audio: '' },
      { id: 3, title_es: 'El rol que eliges', title_en: 'The Role You Choose', duration: '31min', free: false, audio: '' },
      { id: 4, title_es: 'Miedo vs. propósito', title_en: 'Fear vs. Purpose', duration: '33min', free: false, audio: '' },
      { id: 5, title_es: 'Trabajar con sentido', title_en: 'Work with Meaning', duration: '32min', free: false, audio: '' },
      { id: 6, title_es: 'Tu legado cotidiano', title_en: 'Your Daily Legacy', duration: '29min', free: false, audio: '' },
      { id: 7, title_es: 'Vivir alineado', title_en: 'Living Aligned', duration: '19min', free: false, audio: '' },
    ]
  },
  {
    id: 'capital-inteligente',
    slug: 'capital-inteligente',
    category: 'money',
    title_es: 'Capital Inteligente',
    title_en: 'Intelligent Capital',
    subtitle_es: 'Dinero que trabaja contigo. Libertad real.',
    subtitle_en: 'Money that works with you. Real freedom.',
    author: 'Joga',
    duration: '4h 10min',
    chapters_count: 8,
    color: '#3A4A2D',
    accent: '#A0C87E',
    price: '$19 USD',
    chapters: [
      { id: 1, title_es: 'Tu relación con el dinero', title_en: 'Your Relationship with Money', duration: '30min', free: true, audio: '' },
      { id: 2, title_es: 'El primer paso financiero', title_en: 'The First Financial Step', duration: '32min', free: false, audio: '' },
      { id: 3, title_es: 'Flujo de caja personal', title_en: 'Personal Cash Flow', duration: '31min', free: false, audio: '' },
      { id: 4, title_es: 'Invertir sin miedo', title_en: 'Invest Without Fear', duration: '33min', free: false, audio: '' },
      { id: 5, title_es: 'Deuda estratégica', title_en: 'Strategic Debt', duration: '28min', free: false, audio: '' },
      { id: 6, title_es: 'Ingresos paralelos', title_en: 'Parallel Income', duration: '30min', free: false, audio: '' },
      { id: 7, title_es: 'El portafolio simple', title_en: 'The Simple Portfolio', duration: '28min', free: false, audio: '' },
      { id: 8, title_es: 'Libertad financiera real', title_en: 'Real Financial Freedom', duration: '18min', free: false, audio: '' },
    ]
  },
  {
    id: 'el-arte-de-vender',
    slug: 'el-arte-de-vender',
    category: 'sales',
    title_es: 'El Arte de Vender',
    title_en: 'The Art of Selling',
    subtitle_es: 'Vende con alma. Sin presión. Con resultados.',
    subtitle_en: 'Sell with soul. No pressure. Real results.',
    author: 'Joga',
    duration: '3h 38min',
    chapters_count: 7,
    color: '#4A3A2D',
    accent: '#D4B87C',
    price: '$19 USD',
    chapters: [
      { id: 1, title_es: 'La venta como servicio', title_en: 'Selling as Service', duration: '28min', free: true, audio: '' },
      { id: 2, title_es: 'Escuchar antes de hablar', title_en: 'Listen Before You Speak', duration: '31min', free: false, audio: '' },
      { id: 3, title_es: 'Conversaciones que convierten', title_en: 'Conversations That Convert', duration: '33min', free: false, audio: '' },
      { id: 4, title_es: 'El precio con confianza', title_en: 'Price with Confidence', duration: '32min', free: false, audio: '' },
      { id: 5, title_es: 'Objeciones como datos', title_en: 'Objections as Data', duration: '30min', free: false, audio: '' },
      { id: 6, title_es: 'Seguimiento sin ruido', title_en: 'Follow-Up Without Noise', duration: '28min', free: false, audio: '' },
      { id: 7, title_es: 'Tu sistema de ventas', title_en: 'Your Sales System', duration: '16min', free: false, audio: '' },
    ]
  }
];

// Render catalog card
function renderCard(book, lang) {
  const title = lang === 'en' ? book.title_en : book.title_es;
  const subtitle = lang === 'en' ? book.subtitle_en : book.subtitle_es;
  return `
  <article class="book-card" data-id="${book.id}" data-category="${book.category}">
    <div class="book-cover" style="background:${book.color}">
      <div class="cover-accent" style="background:${book.accent}"></div>
      <div class="cover-text">
        <span class="cover-label">JOGA AUDIO</span>
        <h3 class="cover-title">${title}</h3>
        <span class="cover-author">${book.author}</span>
      </div>
    </div>
    <div class="book-info">
      <p class="book-subtitle">${subtitle}</p>
      <div class="book-meta">
        <span>${book.duration}</span>
        <span>·</span>
        <span>${book.chapters_count} ${t('chapters')}</span>
      </div>
      <div class="book-actions">
        <button class="btn-primary" onclick="openPlayer('${book.id}', 1)">
          <span data-t="listen"></span>
        </button>
        <button class="btn-secondary" onclick="openBookDetail('${book.id}')">
          ${book.price}
        </button>
      </div>
    </div>
  </article>`;
}

function renderCatalog(filter = 'all') {
  const lang = getLang();
  const grid = document.getElementById('catalog-grid');
  if (!grid) return;
  const books = filter === 'all' ? CATALOG : CATALOG.filter(b => b.category === filter);
  grid.innerHTML = books.map(b => renderCard(b, lang)).join('');
  applyLang();
}

function getBook(id) {
  return CATALOG.find(b => b.id === id);
}
