const themeToggle = document.querySelector("#themeToggle");
const menuToggle = document.querySelector("#menuToggle");
const primaryNav = document.querySelector("#primaryNav");
const yearLabel = document.querySelector("#currentYear");
const themeColor = document.querySelector('meta[name="theme-color"]');

function setTheme(isLight) {
  document.body.classList.toggle("light-theme", isLight);
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.innerHTML = `<span aria-hidden="true">${isLight ? "☾" : "☼"}</span>`;
  themeColor.setAttribute("content", isLight ? "#f6f7f2" : "#10110f");
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
}

const savedTheme = localStorage.getItem("portfolio-theme");
setTheme(savedTheme === "light");
yearLabel.textContent = String(new Date().getFullYear());

themeToggle.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("light-theme"));
});

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  primaryNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
