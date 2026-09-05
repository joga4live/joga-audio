// player.js — Joga Audio | Audio player engine
let currentBook = null;
let currentChapter = 0;
let isPlaying = false;
let audioEl = null;
let playerSpeed = 1.0;

function initAudio() {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.onended = () => nextChapter();
    audioEl.ontimeupdate = () => updateProgress();
    audioEl.onloadedmetadata = () => {
      document.getElementById('p-duration').textContent = formatTime(audioEl.duration);
    };
  }
}

function openPlayer(bookId, chapterIndex) {
  currentBook = getBook(bookId);
  currentChapter = chapterIndex - 1;
  showPlayer();
  loadChapter(currentChapter);
}

function showPlayer() {
  const panel = document.getElementById('player-panel');
  if (panel) panel.classList.add('open');
}

function hidePlayer() {
  const panel = document.getElementById('player-panel');
  if (panel) panel.classList.remove('open');
  pauseAudio();
}

function loadChapter(idx) {
  if (!currentBook) return;
  const ch = currentBook.chapters[idx];
  if (!ch) return;

  // UI update
  const lang = getLang();
  const title = lang === 'en' ? currentBook.title_en : currentBook.title_es;
  const chTitle = lang === 'en' ? ch.title_en : ch.title_es;

  document.getElementById('p-book-title').textContent = title;
  document.getElementById('p-chapter-title').textContent = `${t('chapter')} ${ch.id} — ${chTitle}`;
  document.getElementById('p-cover-color').style.background = currentBook.color;
  document.getElementById('p-cover-accent').style.background = currentBook.accent;
  document.getElementById('p-progress').value = 0;
  document.getElementById('p-current').textContent = '0:00';
  document.getElementById('p-duration').textContent = ch.duration;

  renderChapterList();

  // Lock gate: only ch.free === true plays without account
  if (!ch.free) {
    showGate();
    return;
  }
  hideGate();
  // v2 (Nico, 5-sep): antes cargaba ch.audio sin ver el idioma — en ingles sonaba
  // el mp3 en espanol igual, sin avisar. Sin audio_en grabado, cae en "coming_soon".
  const audioSrc = lang === 'en' ? (ch.audio_en || '') : (ch.audio || '');
  loadAudio(audioSrc);
}

function loadAudio(src) {
  initAudio();
  const playBtn = document.getElementById('p-play-btn');
  if (!src) {
    // v1 (Nico, 4-sep): antes se quedaba mudo — el boton parecia roto, sin avisar nada
    // v2 (Nico, 5-sep): y encima no paraba el audio que ya sonaba — cambiabas a
    // ingles sin grabacion y seguia oyendose el capitulo en español de fondo
    if (audioEl) { audioEl.pause(); audioEl.removeAttribute('src'); audioEl.load(); }
    playBtn.textContent = '▶';
    playBtn.disabled = true;
    playBtn.title = t('coming_soon');
    document.getElementById('p-chapter-title').textContent += ` — ${t('coming_soon')}`;
    isPlaying = false;
    return;
  }
  playBtn.disabled = false;
  playBtn.title = '';
  audioEl.src = src;
  audioEl.playbackRate = playerSpeed;
  audioEl.play();
  isPlaying = true;
  playBtn.textContent = '⏸';
}

function togglePlay() {
  if (!audioEl || !audioEl.src) return;
  if (isPlaying) {
    audioEl.pause();
    isPlaying = false;
    document.getElementById('p-play-btn').textContent = '▶';
  } else {
    audioEl.play();
    isPlaying = true;
    document.getElementById('p-play-btn').textContent = '⏸';
  }
}

function pauseAudio() {
  if (audioEl && isPlaying) {
    audioEl.pause();
    isPlaying = false;
  }
}

function nextChapter() {
  if (!currentBook) return;
  if (currentChapter < currentBook.chapters.length - 1) {
    currentChapter++;
    loadChapter(currentChapter);
  }
}

function prevChapter() {
  if (!currentBook) return;
  if (currentChapter > 0) {
    currentChapter--;
    loadChapter(currentChapter);
  }
}

function setSpeed(s) {
  playerSpeed = parseFloat(s);
  if (audioEl) audioEl.playbackRate = playerSpeed;
  document.getElementById('p-speed-label').textContent = `${playerSpeed}x`;
}

function seekTo(val) {
  if (audioEl && audioEl.duration) {
    audioEl.currentTime = (val / 100) * audioEl.duration;
  }
}

function updateProgress() {
  if (!audioEl || !audioEl.duration) return;
  const pct = (audioEl.currentTime / audioEl.duration) * 100;
  const bar = document.getElementById('p-progress');
  if (bar) bar.value = pct;
  document.getElementById('p-current').textContent = formatTime(audioEl.currentTime);
}

function formatTime(s) {
  if (isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

function showGate() {
  const gate = document.getElementById('p-gate');
  if (gate) gate.style.display = 'flex';
}

function hideGate() {
  const gate = document.getElementById('p-gate');
  if (gate) gate.style.display = 'none';
}

function renderChapterList() {
  if (!currentBook) return;
  const lang = getLang();
  const list = document.getElementById('p-chapter-list');
  if (!list) return;
  list.innerHTML = currentBook.chapters.map((ch, i) => {
    const chTitle = lang === 'en' ? ch.title_en : ch.title_es;
    const activeClass = i === currentChapter ? 'active' : '';
    // v1 (Nico, 4-sep): era el emoji 🔒, contra la regla de cero emojis del proyecto
    const lockIcon = ch.free ? '' : `<span class="lock-icon">${t('premium_badge')}</span>`;
    return `<li class="chapter-item ${activeClass}" onclick="selectChapter(${i})">
      <span class="ch-num">${ch.id}</span>
      <span class="ch-title">${chTitle}</span>
      ${lockIcon}
      <span class="ch-dur">${ch.duration}</span>
    </li>`;
  }).join('');
}

function selectChapter(idx) {
  currentChapter = idx;
  loadChapter(idx);
}
