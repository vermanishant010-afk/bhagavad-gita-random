// 🌸 Path to your Bhagavad Gita JSON file
const jsonPath = "Bhagwad_Gita.json";
let data = [];
let currentIndex = -1;

// 🌄 Spiritual background images (rotates each time you show a shloka)
const gitaBackgrounds = [
  "https://images.unsplash.com/photo-1607697987721-f69e9ad336a8?auto=format&fit=crop&w=1600&q=80", // temple
  "https://images.unsplash.com/photo-1598992616139-9b2a5e51550c?auto=format&fit=crop&w=1600&q=80", // sunrise
  "https://images.unsplash.com/photo-1608808178347-8d084b57cf7c?auto=format&fit=crop&w=1600&q=80", // ancient scroll
  "https://images.unsplash.com/photo-1586172687072-934d9a8f95b3?auto=format&fit=crop&w=1600&q=80", // sky
  "https://images.unsplash.com/photo-1598203196220-1e81aeb6a0ec?auto=format&fit=crop&w=1600&q=80"  // ocean
];

// 🪔 Function to change background smoothly
function setRandomBackground() {
  const randomImage = gitaBackgrounds[Math.floor(Math.random() * gitaBackgrounds.length)];
  document.body.style.setProperty("--bg-url", `url('${randomImage}')`);

  // Create or update ::before background via style tag
  let styleTag = document.getElementById("bg-style");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "bg-style";
    document.head.appendChild(styleTag);
  }
  styleTag.innerHTML = `body::before { background-image: url('${randomImage}'); }`;
}

// 📜 Load Bhagavad Gita JSON file
async function loadJSON() {
  try {
    const res = await fetch(jsonPath);
    data = await res.json();
    console.log("✅ Loaded", data.length, "shlokas");
  } catch (err) {
    alert("Failed to load JSON: " + err.message);
  }
}

// 🌺 Display one shloka on screen
function showEntry(i) {
  if (!data.length) return;
  if (i < 0) i = 0;
  if (i >= data.length) i = data.length - 1;
  currentIndex = i;

  const e = data[i];
  const sanskrit = e.sanskrit || e.Shloka || "—";
  const english = e.English || e.EngMeaning || "";
  const hindi = e.Hindi || e.HinMeaning || "";

  // Centered and formatted meanings (adds one-line space between English & Hindi)
  document.getElementById("shlokaText").textContent = sanskrit;
  document.getElementById("translit").textContent = e.transliteration || e.Transliteration || "";
  document.getElementById("meaning").innerHTML = `
    <div>${english}</div>
    <br>
    <div style="font-family: 'Noto Serif Devanagari', serif;">${hindi}</div>
  `;

  document.getElementById("chap").textContent = e.chapter || e.Chapter || "—";
  document.getElementById("verse").textContent = e.verse || e.Verse || "—";
  document.getElementById("idTag").textContent = e.ID || "—";

  // 🌄 Change background every time new shloka is displayed
  setRandomBackground();
}

// 🌸 Generate random shloka index
function randomIndex() {
  return Math.floor(Math.random() * data.length);
}

// 🕉 Setup the buttons
function setupButtons() {
  // “Show Shloka” button
  document.getElementById("randBtn").onclick = () => showEntry(randomIndex());

  // Share button (Twitter)
  document.getElementById("tweetBtn").onclick = () => {
    if (currentIndex < 0) return;
    const t = `📜 ${data[currentIndex].sanskrit || data[currentIndex].Shloka || "Bhagavad Gita"}\n\n— Bhagavad Gita`;
    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(t), "_blank");
  };
}

// 🌼 Initialize the app
window.onload = async () => {
  await loadJSON();
  setupButtons();
  if (data.length) showEntry(randomIndex());
};
