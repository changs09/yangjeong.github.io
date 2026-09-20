const STORAGE_KEY = SITE_CONFIG.storageKey;
const ADMIN_PASSWORD = SITE_CONFIG.adminPassword;

const defaultData = {
  organizationName: "재단법인 양정장학회",
  foundationDate: "2008년 4월 10일",
  heroKicker: "YANGJEONG SCHOLARSHIP FOUNDATION",
  heroTitle: "배움의 가능성이\n미래가 되도록",
  heroDescription: "양정장학회는 성실하게 자신의 길을 만들어가는 학생들의 곁에서, 더 넓은 세상을 향한 도전을 함께합니다.",
  aboutTitle: "한 사람의 배움이\n더 나은 내일로 이어집니다.",
  aboutBody: "공익재단법인 양정장학회는 경제적 여건에 관계없이 모든 학생이 배움에 집중할 수 있도록 지원합니다. 장학금뿐 아니라 서로의 성장을 응원하는 든든한 연결을 만들어갑니다.",
  values: [
    { title: "배움의 기회", body: "누구에게나 공정한 배움의 기회가 주어져야 한다고 믿습니다." },
    { title: "성장의 동행", body: "장학생 한 사람 한 사람의 긴 여정을 진심으로 응원합니다." },
    { title: "선한 연결", body: "나눔이 또 다른 가능성으로 이어지는 사회를 꿈꿉니다." }
  ],
  notices: [
    { tag: "모집", title: "2026년 상반기 양정장학생 모집 안내", summary: "꿈을 향해 성실히 나아가는 학생들의 지원을 기다립니다.", date: "2026.03.02" },
    { tag: "소식", title: "2025년 양정장학회 장학증서 수여식 개최", summary: "새로운 장학생들과 함께한 따뜻한 봄날의 현장을 전합니다.", date: "2025.04.18" },
    { tag: "안내", title: "장학생 활동 보고서 제출 안내", summary: "2025년도 하반기 활동 보고서 제출 일정과 방법을 확인하세요.", date: "2025.11.03" }
  ],
  contactTitle: "언제든\n문을 두드려 주세요.",
  contactBody: "장학사업 및 지원에 관한 문의를 남겨주시면 정성껏 안내해 드리겠습니다.",
  address: "전라남도 장성군 시목3길 26-12",
  email: "airman97@nate.com",
  phone: "061-392-3077",
  chairmanName: "공양진",
  chairmanTitle: "이사장",
  chairmanMessage: "안녕하십니까. 재단법인 양정장학회 이사장 공양진입니다.\n\n2008년 4월 10일 설립된 양정장학회는 배움의 기회가 한 사람의 삶을 바꾸고, 그 변화가 우리 사회의 희망으로 이어진다는 믿음으로 걸어왔습니다.\n\n학생들이 환경의 어려움으로 꿈을 접지 않도록, 성실하게 자신의 길을 준비하는 이들의 곁에서 든든한 버팀목이 되고자 합니다. 장학금의 지원을 넘어 각자가 가진 가능성을 발견하고 자신 있게 미래를 선택할 수 있도록 함께하겠습니다.\n\n앞으로도 양정장학회는 투명하고 성실한 나눔으로 더 많은 배움의 기회를 만들겠습니다. 따뜻한 관심과 응원을 보내주시는 모든 분께 깊이 감사드립니다."
};

let data = readData();
let toastTimer;

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function readData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return clone(defaultData);
    return { ...clone(defaultData), ...JSON.parse(saved) };
  } catch { return clone(defaultData); }
}
function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[char]); }
function lineBreaks(value) { return escapeHtml(value).replace(/\n/g, "<br />"); }
function setText(selector, value) { document.querySelector(selector).textContent = value; }

function renderSite() {
  setText("#brand-name", data.organizationName.replace("공익재단법인 ", ""));
  setText("#footer-name", data.organizationName.replace("공익재단법인 ", ""));
  setText("#hero-kicker", data.heroKicker);
  document.querySelector("#hero-title").innerHTML = lineBreaks(data.heroTitle).replace("미래", "<em>미래</em>");
  setText("#hero-description", data.heroDescription);
  document.querySelector("#about-title").innerHTML = lineBreaks(data.aboutTitle);
  setText("#about-body", data.aboutBody);
  document.querySelector("#value-list").innerHTML = data.values.map((item, index) => `<article class="value-item"><span class="value-num">0${index + 1}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.body)}</p></article>`).join("");
  document.querySelector("#notice-list").innerHTML = data.notices.map(notice => `<article class="notice"><span class="notice-tag">${escapeHtml(notice.tag)}</span><h3>${escapeHtml(notice.title)}</h3><p>${escapeHtml(notice.summary)}</p><time datetime="${escapeHtml(notice.date)}">${escapeHtml(notice.date)}</time></article>`).join("");
  document.querySelector("#contact-title").innerHTML = lineBreaks(data.contactTitle);
  setText("#contact-body", data.contactBody);
  document.querySelector("#contact-details").innerHTML = `
    <div class="contact-detail"><span>ESTABLISHED</span><p>${escapeHtml(data.foundationDate)}</p></div>
    <div class="contact-detail"><span>ADDRESS</span><p>${escapeHtml(data.address)}</p></div>
    <div class="contact-detail"><span>E-MAIL</span><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
    <div class="contact-detail"><span>TEL</span><a href="tel:${escapeHtml(data.phone).replace(/[^+\d]/g, "")}">${escapeHtml(data.phone)}</a></div>`;
  setText("#year", new Date().getFullYear());
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

function lockAdmin() {
  document.querySelector("#admin-login").hidden = false;
  document.querySelector("#admin-editor").hidden = true;
  document.querySelector("#login-form").reset();
  document.querySelector("#login-message").textContent = "";
}

function openAdmin() {
  lockAdmin();
  document.querySelector("#modal-backdrop").hidden = false;
  document.querySelector("#admin-panel").hidden = false;
  document.body.style.overflow = "hidden";
  document.querySelector("#admin-password").focus();
}
function closeAdmin() {
  lockAdmin();
  document.querySelector("#modal-backdrop").hidden = true;
  document.querySelector("#admin-panel").hidden = true;
  document.body.style.overflow = "";
}
function editorInput(name) { return document.querySelector(`[name="${name}"]`); }
function fillEditor() {
  ["organizationName", "heroKicker", "heroTitle", "heroDescription", "aboutTitle", "aboutBody", "contactTitle", "contactBody", "foundationDate", "address", "email", "phone", "chairmanName", "chairmanTitle", "chairmanMessage"].forEach(key => { editorInput(key).value = data[key]; });
  renderNoticeEditor();
}
function renderNoticeEditor() {
  document.querySelector("#notice-editor-list").innerHTML = data.notices.map((notice, index) => `
    <div class="notice-edit-row" data-index="${index}">
      <button class="remove-notice" type="button" data-remove-notice="${index}">삭제</button>
      <label>구분</label><input data-field="tag" value="${escapeHtml(notice.tag)}" required />
      <label>제목</label><input data-field="title" value="${escapeHtml(notice.title)}" required />
      <label>요약</label><textarea data-field="summary" rows="2" required>${escapeHtml(notice.summary)}</textarea>
      <div class="two-col"><div><label>게시일</label><input data-field="date" placeholder="2026.03.02" value="${escapeHtml(notice.date)}" required /></div></div>
    </div>`).join("");
}
function saveEditor(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const next = { ...data };
  ["organizationName", "heroKicker", "heroTitle", "heroDescription", "aboutTitle", "aboutBody", "contactTitle", "contactBody", "foundationDate", "address", "email", "phone", "chairmanName", "chairmanTitle", "chairmanMessage"].forEach(key => { next[key] = form.elements[key].value.trim(); });
  next.notices = [...document.querySelectorAll(".notice-edit-row")].map((row, index) => ({
    tag: row.querySelector('[data-field="tag"]').value.trim(),
    title: row.querySelector('[data-field="title"]').value.trim(),
    summary: row.querySelector('[data-field="summary"]').value.trim(),
    date: row.querySelector('[data-field="date"]').value.trim(),
    attachment: data.notices[index]?.attachment || null
  }));
  data = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  renderSite();
  showToast("변경사항을 저장했습니다.");
}

document.querySelector("#admin-trigger").addEventListener("click", openAdmin);
document.querySelector("#close-admin").addEventListener("click", closeAdmin);
document.querySelector("#modal-backdrop").addEventListener("click", closeAdmin);
document.addEventListener("keydown", event => { if (event.key === "Escape" && !document.querySelector("#admin-panel").hidden) closeAdmin(); });
document.querySelector("#login-form").addEventListener("submit", event => {
  event.preventDefault();
  const message = document.querySelector("#login-message");
  if (document.querySelector("#admin-password").value !== ADMIN_PASSWORD) { message.textContent = "비밀번호가 올바르지 않습니다."; return; }
  message.textContent = "";
  document.querySelector("#admin-login").hidden = true;
  document.querySelector("#admin-editor").hidden = false;
  fillEditor();
});
document.querySelector("#admin-editor").addEventListener("submit", saveEditor);
document.querySelector("#add-notice").addEventListener("click", () => { data.notices.push({ tag:"안내", title:"새 공지사항", summary:"공지 내용을 입력해 주세요.", date:"2026.00.00" }); renderNoticeEditor(); });
document.querySelector("#notice-editor-list").addEventListener("click", event => {
  const index = event.target.dataset.removeNotice;
  if (index === undefined) return;
  data.notices.splice(Number(index), 1);
  renderNoticeEditor();
});
document.querySelector("#reset-data").addEventListener("click", () => {
  if (!confirm("저장된 모든 홈페이지 내용을 기본 상태로 되돌릴까요?")) return;
  data = clone(defaultData);
  localStorage.removeItem(STORAGE_KEY);
  fillEditor(); renderSite(); showToast("기본 내용으로 되돌렸습니다.");
});
document.querySelector(".menu-toggle").addEventListener("click", event => {
  const open = event.currentTarget.getAttribute("aria-expanded") === "true";
  event.currentTarget.setAttribute("aria-expanded", String(!open));
  document.querySelector("#primary-nav").classList.toggle("is-open", !open);
});
document.querySelectorAll(".primary-nav a").forEach(link => link.addEventListener("click", () => { document.querySelector("#primary-nav").classList.remove("is-open"); document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false"); }));

renderSite();
