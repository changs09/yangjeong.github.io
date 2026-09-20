const STORAGE_KEY = SITE_CONFIG.storageKey;
const defaults = {
  organizationName: "재단법인 양정장학회",
  chairmanName: "공양진",
  chairmanTitle: "이사장",
  chairmanMessage: "안녕하십니까. 재단법인 양정장학회 이사장 공양진입니다.\n\n2008년 4월 10일 설립된 양정장학회는 배움의 기회가 한 사람의 삶을 바꾸고, 그 변화가 우리 사회의 희망으로 이어진다는 믿음으로 걸어왔습니다.\n\n학생들이 환경의 어려움으로 꿈을 접지 않도록, 성실하게 자신의 길을 준비하는 이들의 곁에서 든든한 버팀목이 되고자 합니다. 장학금의 지원을 넘어 각자가 가진 가능성을 발견하고 자신 있게 미래를 선택할 수 있도록 함께하겠습니다.\n\n앞으로도 양정장학회는 투명하고 성실한 나눔으로 더 많은 배움의 기회를 만들겠습니다. 따뜻한 관심과 응원을 보내주시는 모든 분께 깊이 감사드립니다."
};

function escapeHtml(value = "") { return String(value).replace(/[&<>'"]/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", "'":"&#39;", '"':"&quot;" })[char]); }
function getData() { try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") }; } catch { return defaults; } }
const data = getData();
const shortName = data.organizationName.replace("재단법인 ", "");
document.querySelector("#brand-name").textContent = shortName;
document.querySelector("#footer-name").textContent = shortName;
document.querySelector("#chairman-title").textContent = data.chairmanTitle;
document.querySelector("#chairman-name").textContent = data.chairmanName;
document.querySelector("#chairman-message").innerHTML = escapeHtml(data.chairmanMessage).split(/\n{2,}/).map(paragraph => `<p>${paragraph.replace(/\n/g, "<br />")}</p>`).join("");
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector(".menu-toggle").addEventListener("click", event => { const open = event.currentTarget.getAttribute("aria-expanded") === "true"; event.currentTarget.setAttribute("aria-expanded", String(!open)); document.querySelector("#primary-nav").classList.toggle("is-open", !open); });
document.querySelectorAll(".primary-nav a").forEach(link => link.addEventListener("click", () => { document.querySelector("#primary-nav").classList.remove("is-open"); document.querySelector(".menu-toggle").setAttribute("aria-expanded", "false"); }));
