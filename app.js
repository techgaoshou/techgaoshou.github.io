const root = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) root.dataset.theme = savedTheme;

const themeToggle = document.querySelector("#themeToggle");
themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("theme", next);
});

const progress = document.querySelector(".progress");
window.addEventListener("scroll", () => {
  const max = document.body.scrollHeight - window.innerHeight;
  progress.style.width = `${Math.max(0, Math.min(100, (window.scrollY / max) * 100))}%`;
});

const filters = [...document.querySelectorAll(".filter")];
const cards = [...document.querySelectorAll(".article-card")];
const search = document.querySelector("#articleSearch");

function applyArticleFilter(category = document.querySelector(".filter.active")?.dataset.filter || "all") {
  const query = search.value.trim().toLowerCase();
  cards.forEach((card) => {
    const matchesCategory = category === "all" || card.dataset.category === category;
    const text = `${card.dataset.title} ${card.textContent}`.toLowerCase();
    const matchesSearch = !query || text.includes(query);
    card.hidden = !(matchesCategory && matchesSearch);
  });
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyArticleFilter(button.dataset.filter);
  });
});

document.querySelectorAll("[data-filter-link]").forEach((link) => {
  link.addEventListener("click", () => {
    const category = link.dataset.filterLink;
    const target = filters.find((item) => item.dataset.filter === category);
    if (target) target.click();
  });
});

search.addEventListener("input", () => applyArticleFilter());

const dcaForm = document.querySelector("#dcaForm");
const dcaResult = document.querySelector("#dcaResult");

function formatUsd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function updateDca() {
  const data = new FormData(dcaForm);
  const amount = Number(data.get("amount"));
  const rate = Number(data.get("rate")) / 100 / 12;
  const months = Number(data.get("years")) * 12;
  const total = rate === 0 ? amount * months : amount * (((1 + rate) ** months - 1) / rate);
  dcaResult.value = `${Number(data.get("years"))} 年后约为 ${formatUsd(total)}`;
}

dcaForm.addEventListener("input", updateDca);
updateDca();

const episodes = [...document.querySelectorAll(".episode")];
const videoTitle = document.querySelector(".video-frame strong");
const videoText = document.querySelector(".video-frame p");
const episodeCopy = [
  ["AI 工具总览：ChatGPT、Claude、Gemini 怎么选", "先用真实任务对比，不陷入模型参数争论。"],
  ["美股 ETF：小白第一套长期投资框架", "从现金流、风险承受能力和指数基金开始。"],
  ["用 AI 读财报：从英伟达到苹果", "让 AI 帮你提取重点，但最后判断仍然要自己做。"],
  ["个人博客 + X + YouTube 的内容飞轮", "一份内容拆成文章、视频、短帖和邮件。"]
];

episodes.forEach((episode, index) => {
  episode.addEventListener("click", () => {
    episodes.forEach((item) => item.classList.remove("active"));
    episode.classList.add("active");
    videoTitle.textContent = episodeCopy[index][0];
    videoText.textContent = episodeCopy[index][1];
  });
});

const canvas = document.querySelector("#signalCanvas");
const ctx = canvas.getContext("2d");
const nodes = [
  { x: 0.18, y: 0.24, label: "AI" },
  { x: 0.38, y: 0.18, label: "Prompt" },
  { x: 0.62, y: 0.28, label: "ETF" },
  { x: 0.78, y: 0.48, label: "DCA" },
  { x: 0.52, y: 0.68, label: "Research" },
  { x: 0.24, y: 0.62, label: "Workflow" }
];
let tick = 0;
let canvasCssWidth = 720;
let canvasCssHeight = 520;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function shouldAnimateSignal() {
  return window.innerWidth > 680 && !reducedMotion.matches;
}

function resizeSignalCanvas() {
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasCssWidth = Math.max(320, rect.width || 720);
  canvasCssHeight = Math.max(280, rect.height || 520);
  canvas.width = Math.round(canvasCssWidth * ratio);
  canvas.height = Math.round(canvasCssHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

resizeSignalCanvas();
window.addEventListener("resize", () => {
  resizeSignalCanvas();
  if (!shouldAnimateSignal()) drawSignal();
});

function drawSignal() {
  const width = canvasCssWidth;
  const height = canvasCssHeight;
  tick += shouldAnimateSignal() ? 0.012 : 0;
  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255, 248, 232, 0.16)";
  ctx.lineWidth = 1;
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      ctx.beginPath();
      ctx.moveTo(a.x * width, a.y * height);
      ctx.lineTo(b.x * width, b.y * height);
      ctx.stroke();
    }
  }

  nodes.forEach((node, index) => {
    const pulse = Math.sin(tick * 4 + index) * 0.5 + 0.5;
    const x = node.x * width + Math.sin(tick + index) * 8;
    const y = node.y * height + Math.cos(tick + index * 0.8) * 8;
    ctx.beginPath();
    ctx.fillStyle = `rgba(46, 196, 182, ${0.18 + pulse * 0.22})`;
    ctx.arc(x, y, 42 + pulse * 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = index % 2 ? "#ffca3a" : "#2ec4b6";
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 248, 232, 0.86)";
    ctx.font = `${width < 460 ? "700 14px" : "700 18px"} system-ui, sans-serif`;
    ctx.fillText(node.label, x + 13, y + 6);
  });

  ctx.strokeStyle = "rgba(255, 202, 58, 0.8)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < width; x += 12) {
    const y = height * 0.54 + Math.sin(x * 0.018 + tick * 4) * 30 + Math.cos(x * 0.009 + tick) * 18;
    if (x === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  if (shouldAnimateSignal()) requestAnimationFrame(drawSignal);
}

drawSignal();
