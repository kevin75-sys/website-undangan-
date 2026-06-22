const assetsFolder = "assets/";
const guest = new URLSearchParams(window.location.search).get("to");
document.getElementById("guestName").textContent = guest?.trim().slice(0, 80) || "Tamu Undangan";

document.getElementById("openInvitation").addEventListener("click", () => {
  document.getElementById("opening").classList.add("is-open");
  document.body.classList.remove("is-locked");
});

document.querySelectorAll("[data-photo]").forEach((element) => {
  const file = assetsFolder + element.dataset.photo;
  const image = new Image();
  image.onload = () => {
    element.style.backgroundImage = `url("${file}")`;
    element.classList.add("has-photo");
  };
  image.src = file;
});

const weddingDate = new Date("2026-10-28T08:00:00+07:00").getTime();
const countdownIds = ["days", "hours", "minutes", "seconds"];
function updateCountdown() {
  const remaining = Math.max(0, weddingDate - Date.now());
  const values = [
    Math.floor(remaining / 86400000),
    Math.floor((remaining % 86400000) / 3600000),
    Math.floor((remaining % 3600000) / 60000),
    Math.floor((remaining % 60000) / 1000)
  ];
  countdownIds.forEach((id, index) => { document.getElementById(id).textContent = values[index]; });
}
updateCountdown();
setInterval(updateCountdown, 1000);

document.getElementById("copyAccount").addEventListener("click", async () => {
  const message = document.getElementById("copyMessage");
  try {
    await navigator.clipboard.writeText("109293664");
    message.textContent = "Nomor rekening berhasil disalin.";
  } catch {
    message.textContent = "Silakan salin: 109293664";
  }
  setTimeout(() => { message.textContent = ""; }, 3000);
});

document.getElementById("wishForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("wishName").value.trim();
  const attendance = document.getElementById("attendance").value;
  const message = document.getElementById("wishMessage").value.trim();
  const item = document.createElement("article");
  item.className = "wish-item";
  const strong = document.createElement("strong");
  const small = document.createElement("small");
  const paragraph = document.createElement("p");
  strong.textContent = name;
  small.textContent = attendance;
  paragraph.textContent = message;
  item.append(strong, small, paragraph);
  document.getElementById("wishList").prepend(item);
  event.currentTarget.reset();
});

document.getElementById("musicButton").addEventListener("click", () => {
  alert("Tambahkan file musik ke folder assets, lalu hubungkan di script.js.");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: .1 });
document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
