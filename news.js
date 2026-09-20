const STORAGE_KEY = SITE_CONFIG.storageKey;
const ADMIN_PASSWORD = SITE_CONFIG.adminPassword;
const MAX_ATTACHMENT_SIZE = 2 * 1024 * 1024;
const ALLOWED_ATTACHMENT = /\.(pdf|hwp|hwpx|doc|docx|xls|xlsx|ppt|pptx|png|jpe?g)$/i;
const defaults = {
  organizationName: "재단법인 양정장학회",
  notices: [
    { tag: "모집", title: "2026년 상반기 양정장학생 모집 안내", summary: "꿈을 향해 성실히 나아가는 학생들의 지원을 기다립니다.", date: "2026.03.02" },
    { tag: "소식", title: "2025년 양정장학회 장학증서 수여식 개최", summary: "새로운 장학생들과 함께한 따뜻한 봄날의 현장을 전합니다.", date: "2025.04.18" },
    { tag: "안내", title: "장학생 활동 보고서 제출 안내", summary: "2025년도 하반기 활동 보고서 제출 일정과 방법을 확인하세요.", date: "2025.11.03" }
  ]
};

function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[char]); }
function getData() { try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; } catch { return defaults; } }
let data = getData();
const shortName = data.organizationName.replace("재단법인 ", "");
document.querySelector("#brand-name").textContent = shortName;
document.querySelector("#footer-name").textContent = shortName;
function renderNotices() {
  document.querySelector("#notice-count").textContent = data.notices.length;
  document.querySelector("#news-archive-list").innerHTML = data.notices.map((notice, index) => {
    const attachment = notice.attachment?.dataUrl ? `<a class="attachment-link" href="${escapeHtml(notice.attachment.dataUrl)}" download="${escapeHtml(notice.attachment.name)}"><span aria-hidden="true">⌇</span>${escapeHtml(notice.attachment.name)}<small>내려받기</small></a>` : "";
    return `<article class="news-archive-item"><div class="news-archive-meta"><span class="notice-tag">${escapeHtml(notice.tag)}</span><time datetime="${escapeHtml(notice.date)}">${escapeHtml(notice.date)}</time></div><div><span class="archive-index">${String(index + 1).padStart(2, "0")}</span><h2>${escapeHtml(notice.title)}</h2><p>${escapeHtml(notice.summary)}</p>${attachment}</div><span class="archive-arrow" aria-hidden="true">↗</span></article>`;
  }).join("");
}
renderNotices();
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector(".menu-toggle").addEventListener("click", event => { const open = event.currentTarget.getAttribute("aria-expanded") === "true"; event.currentTarget.setAttribute("aria-expanded", String(!open)); document.querySelector("#primary-nav").classList.toggle("is-open", !open); });
document.querySelectorAll(".primary-nav a").forEach(link => link.addEventListener("click", () => { document.querySelector("#primary-nav").classList.remove("is-open"); document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false"); }));

function formatToday() { return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" }); }
function readAttachment(file) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve({ name: file.name, type: file.type || "application/octet-stream", dataUrl: reader.result }); reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다.")); reader.readAsDataURL(file); }); }
function openPostPanel() { document.querySelector("#post-backdrop").hidden = false; document.querySelector("#post-panel").hidden = false; document.body.style.overflow = "hidden"; document.querySelector("#post-form").reset(); document.querySelector("#post-date").value = formatToday(); document.querySelector("#post-message").textContent = ""; document.querySelector("#post-password").focus(); }
function closePostPanel() { document.querySelector("#post-backdrop").hidden = true; document.querySelector("#post-panel").hidden = true; document.body.style.overflow = ""; }
document.querySelector("#post-trigger").addEventListener("click", openPostPanel);
document.querySelector("#close-post-panel").addEventListener("click", closePostPanel);
document.querySelector("#post-backdrop").addEventListener("click", closePostPanel);
document.querySelector("#post-form").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.querySelector("#post-message");
  if (form.elements.password.value !== ADMIN_PASSWORD) { message.textContent = "비밀번호가 올바르지 않습니다."; return; }
  const file = form.elements.attachment.files[0];
  if (file && !ALLOWED_ATTACHMENT.test(file.name)) { message.textContent = "PDF, 한글·오피스 문서 또는 이미지 파일만 첨부할 수 있습니다."; return; }
  if (file && file.size > MAX_ATTACHMENT_SIZE) { message.textContent = "첨부파일은 2MB 이하만 등록할 수 있습니다."; return; }
  let attachment = null;
  try { if (file) attachment = await readAttachment(file); } catch { message.textContent = "첨부파일을 읽지 못했습니다. 다시 시도해 주세요."; return; }
  const nextData = { ...data, notices: [{ tag: form.elements.category.value.trim(), title: form.elements.title.value.trim(), summary: form.elements.content.value.trim(), date: form.elements.date.value.replaceAll("-", "."), attachment }, ...data.notices] };
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData)); } catch { message.textContent = "저장 공간이 부족합니다. 첨부파일 크기를 줄인 뒤 다시 시도해 주세요."; return; }
  data = nextData;
  renderNotices();
  closePostPanel();
  const toast = document.querySelector("#post-toast"); toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2500);
});
document.addEventListener("keydown", event => { if (event.key === "Escape" && !document.querySelector("#post-panel").hidden) closePostPanel(); });
