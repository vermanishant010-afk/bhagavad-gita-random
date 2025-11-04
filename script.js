'use strict';

const JSON_PATH = 'Bhagwad_Gita.json';
let shlokas = [];
let currentIndex = -1;

// Array of peaceful spiritual backgrounds
const BG_IMAGES = [
  'https://images.unsplash.com/photo-1607697987721-f69e9ad336a8?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1598992616139-9b2a5e51550c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1608808178347-8d084b57cf7c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1586172687072-934d9a8f95b3?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1598203196220-1e81aeb6a0ec?auto=format&fit=crop&w=1600&q=80'
];

function setRandomBackground() {
  const idx = Math.floor(Math.random() * BG_IMAGES.length);
  const imgUrl = BG_IMAGES[idx];

  let styleTag = document.getElementById('bg-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'bg-style';
    document.head.appendChild(styleTag);
  }
  styleTag.innerHTML = `body::before { background-image: url('${imgUrl}'); }`;
}

// Load JSON
async function loadShlokaJSON(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const rawData = await response.json();
    // Data hygiene: ensure array, remove empty entries, normalize keys
    return Array.isArray(rawData)
      ? rawData.filter(e => e && e.chapter && e.verse)
      : Object.values(rawData).filter(e => e && e.chapter && e.verse);
  } catch (err) {
    alert('Failed to load Bhagavad Gita data: ' + err.message);
    return [];
  }
}

// Render a shloka entry by index
function renderShloka(i) {
  if (!shlokas.length) return;
  i = Math.max(0, Math.min(i, shlokas.length - 1));
  currentIndex = i;

  const e = shlokas[i];
  const sanskrit = e.sanskrit || e.Shloka || '—';
  const translit = e.transliteration || e.Transliteration || '';
  const english = e.English || e.EngMeaning || '';
  const hindi = e.Hindi || e.HinMeaning || '';

  document.getElementById('shlokaText').textContent = sanskrit;
  document.getElementById('translit').textContent = translit;
  document.getElementById('meaning').innerHTML =
    `<div>${english}</div><br><div style="font-family:'Noto Serif Devanagari',serif">${hindi}</div>`;

  document.getElementById('chap').textContent = e.chapter || e.Chapter || '—';
  document.getElementById('verse').textContent = e.verse || e.Verse || '—';
  document.getElementById('idTag').textContent = e.ID || '—';

  setRandomBackground();
}

// Return a random integer index for the shloka array
function randomShlokaIndex() {
  return Math.floor(Math.random() * shlokas.length);
}

function setupUI() {
  document.getElementById('randBtn').onclick = () => {
    const idx = randomShlokaIndex();
    renderShloka(idx);
    document.getElementById('shlokaText').focus();
  };

  document.getElementById('tweetBtn').onclick = () => {
    if (currentIndex < 0) return;
    const e = shlokas[currentIndex];
    const t = `📜 ${e.sanskrit || e.Shloka || 'Bhagavad Gita'}\n— Bhagavad Gita`;
    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(t), '_blank');
  };
}

// Initialize the web app
window.onload = async () => {
  shlokas = await loadShlokaJSON(JSON_PATH);
  setupUI();
  if (shlokas.length) renderShloka(randomShlokaIndex());
};
