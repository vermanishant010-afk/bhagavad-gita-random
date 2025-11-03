const jsonPath = "Bhagwad_Gita.json";
let data = [];
let currentIndex = -1;

async function loadJSON() {
  try {
    const res = await fetch(jsonPath);
    data = await res.json();
    console.log("Loaded", data.length, "shlokas");
  } catch (err) {
    alert("Failed to load JSON: " + err.message);
  }
}

function showEntry(i) {
  if (!data.length) return;
  if (i < 0) i = 0;
  if (i >= data.length) i = data.length - 1;
  currentIndex = i;

  const e = data[i];
  document.getElementById("shlokaText").textContent = e.sanskrit || e.Shloka || "—";
  document.getElementById("translit").textContent = e.transliteration || e.Transliteration || "";
  document.getElementById("meaning").textContent =
    (e.English || e.EngMeaning || "") + "\n\n" + (e.Hindi || e.HinMeaning || "");
  document.getElementById("chap").textContent = e.chapter || e.Chapter || "—";
  document.getElementById("verse").textContent = e.verse || e.Verse || "—";
  document.getElementById("idTag").textContent = e.ID || "—";
}

function randomIndex() {
  return Math.floor(Math.random() * data.length);
}

function copyJSON() {
  if (currentIndex < 0) return;
  const obj = data[currentIndex];
  navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
  alert("Copied to clipboard!");
}

function downloadJSON() {
  if (currentIndex < 0) return;
  const blob = new Blob([JSON.stringify(data[currentIndex], null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shloka.json";
  a.click();
  URL.revokeObjectURL(url);
}

function setupButtons() {
  document.getElementById("randBtn").onclick = () => showEntry(randomIndex());
  document.getElementById("prevBtn").onclick = () => showEntry(currentIndex - 1);
  document.getElementById("nextBtn").onclick = () => showEntry(currentIndex + 1);
  document.getElementById("copyBtn").onclick = copyJSON;
  document.getElementById("downloadBtn").onclick = downloadJSON;
  document.getElementById("gotoBtn").onclick = () => {
    const n = parseInt(document.getElementById("indexInput").value, 10);
    if (!isNaN(n)) showEntry(n - 1);
  };
  document.getElementById("tweetBtn").onclick = () => {
    const t = document.getElementById("shlokaText").textContent;
    window.open("https://twitter.com/intent/tweet?text=" + encodeURIComponent(t));
  };
}

window.onload = async () => {
  await loadJSON();
  setupButtons();
  if (data.length) showEntry(randomIndex());
};
