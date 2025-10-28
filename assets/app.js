// === APP EVIDENT FOTO GEDUNG TELKOM 2025 ===

const urlParams = new URLSearchParams(window.location.search);
const kelas = urlParams.get("kelas");
const jobData = (window.KELAS_DATA && window.KELAS_DATA[kelas]) || [];

const root = document.getElementById("root");
const progressBar = document.getElementById("progressBar");

// Ganti judul form sesuai kelas
const titleEl = document.querySelector("header h1");
if (titleEl) titleEl.textContent = `FORM EVIDENT AKTIVITAS KELAS ${kelas || "?"}`;

// Isi otomatis periode
const periodeInput = document.getElementById("periode");
if (periodeInput) {
  periodeInput.value = new Date().toLocaleString("id-ID", {
    month: "long",
    year: "numeric",
  });
}

// Jika kelas tidak ditemukan
if (!jobData.length) {
  root.innerHTML = `
    <div style="text-align:center; margin-top:40px; color:#999;">
      <h2>⚠️ Data aktivitas untuk kelas ${kelas || "(tidak diketahui)"} tidak ditemukan.</h2>
      <p>Silakan kembali ke <a href="index.html">Dashboard</a>.</p>
    </div>`;
  throw new Error("Data kelas tidak ditemukan");
}

// Konstanta gambar
const TARGET_W = 900, TARGET_H = 1200, JPEG_QUALITY = 0.8;
let hashes = [];

// Utility: buat elemen cepat
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.substring(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  }
  for (const c of children) node.append(c instanceof Node ? c : document.createTextNode(c));
  return node;
}

// Render form
function render() {
  root.innerHTML = "";
  const section = el("section", { class: "section" }, [el("h2", {}, [`KELAS ${kelas}`])]);
  const grid = el("div", { class: "cards" });

  jobData.forEach((job, idx) => {
    const inputId = `file-${idx}`;
    const count = el("span", { class: "chip", id: `count-${inputId}` }, ["0 Foto"]);
    const fileInput = el("input", {
      id: inputId,
      type: "file",
      accept: "image/*",
      multiple: true,
      style: "display:none",
    });
    const preview = el("div", { class: "preview", id: `preview-${inputId}` });

    fileInput.addEventListener("change", async (e) => {
      if (!e.target.files?.length) return;
      for (const file of e.target.files) await addImage(preview, file);
      updateCount(preview, count);
      updateProgress();
      e.target.value = "";
    });

    const card = el("div", { class: "card" }, [
      el("div", { class: "title" }, [`${job.no}. ${job.pekerjaan}`]),
      el("div", { class: "meta" }, [`Frekuensi: ${job.frekuensi} — `, count]),
      el("div", { class: "upload" }, [
        el("button", { class: "btn", onClick: () => fileInput.click() }, ["Upload Foto"]),
        fileInput,
      ]),
      preview,
    ]);
    grid.append(card);
  });

  section.append(grid);
  root.append(section);
  updateProgress();
}

// Tambah gambar ke preview
async function addImage(previewEl, file) {
  const frame = el("div", { class: "frame" });
  previewEl.append(frame);

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = TARGET_W;
  canvas.height = TARGET_H;
  const ctx = canvas.getContext("2d");

  const ratio = TARGET_W / TARGET_H;
  const srcW = img.width, srcH = img.height;
  const srcRatio = srcW / srcH;
  let sx, sy, sw, sh;

  if (srcRatio > ratio) {
    sh = srcH; sw = sh * ratio; sx = (srcW - sw) / 2; sy = 0;
  } else {
    sw = srcW; sh = sw / ratio; sx = 0; sy = (srcH - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, TARGET_W, TARGET_H);
  const url = canvas.toDataURL("image/jpeg", JPEG_QUALITY);

  const hash = await getImageHash(canvas);
  if (isDuplicate(hash)) {
    alert("⚠️ Gambar ini terdeteksi duplikat!");
    frame.remove();
    return;
  }
  hashes.push(hash);

  const image = new Image();
  image.src = url;

  const del = el("button", { class: "delete" }, ["×"]);
  del.addEventListener("click", () => {
    frame.remove();
    hashes = hashes.filter((h) => h !== hash);
    updateProgress();
  });

  frame.append(image, del);
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getImageHash(canvas) {
  const ctx = canvas.getContext("2d");
  const data = ctx.getImageData(0, 0, 32, 32).data;
  let sum = 0;
  for (let i = 0; i < data.length; i += 4)
    sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
  const avg = sum / (data.length / 4);
  let bits = "";
  for (let i = 0; i < data.length; i += 4) {
    const val = (data[i] + data[i + 1] + data[i + 2]) / 3;
    bits += val > avg ? "1" : "0";
  }
  return bits;
}

function isDuplicate(newHash) {
  return hashes.some((h) => similarity(h, newHash) > 0.98);
}

function similarity(h1, h2) {
  let same = 0;
  for (let i = 0; i < h1.length && i < h2.length; i++)
    if (h1[i] === h2[i]) same++;
  return same / Math.min(h1.length, h2.length);
}

function updateCount(previewEl, chipEl) {
  const n = previewEl.querySelectorAll(".frame").length;
  chipEl.textContent = `${n} Foto`;
}

function updateProgress() {
  const cards = [...document.querySelectorAll(".card")];
  const filled = cards.filter((c) => c.querySelectorAll(".frame").length > 0).length;
  const pct = cards.length ? Math.round((filled / cards.length) * 100) : 0;
  progressBar.style.width = pct + "%";
  progressBar.textContent = pct + "%";
}

// Tombol
document.getElementById("btnPrint").onclick = () => window.print();
document.getElementById("btnClear").onclick = () => {
  if (confirm("Hapus seluruh foto di form ini?")) {
    document.querySelectorAll("#root .preview").forEach((p) => (p.innerHTML = ""));
    hashes = [];
    updateProgress();
  }
};
document.getElementById("btnDashboard").onclick = () => (window.location.href = "index.html");

// Render awal
render();

// === 🆕 Dropdown Sinkronisasi Gedung ===
const idSelect = document.getElementById("idGedung");
const namaSelect = document.getElementById("namaGedung");

if (window.GEDUNG_DATA && idSelect && namaSelect) {
  Object.entries(GEDUNG_DATA).forEach(([id, nama]) => {
    const opt1 = document.createElement("option");
    opt1.value = id;
    opt1.textContent = id;
    idSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = nama;
    opt2.textContent = nama;
    namaSelect.appendChild(opt2);
  });

  idSelect.addEventListener("change", () => {
    namaSelect.value = GEDUNG_DATA[idSelect.value] || "";
  });

  namaSelect.addEventListener("change", () => {
    const found = Object.entries(GEDUNG_DATA).find(([id, n]) => n === namaSelect.value);
    idSelect.value = found ? found[0] : "";
  });
}
