const form = document.getElementById("guestbook-form");
const nicknameInput = document.getElementById("nickname");
const messageInput = document.getElementById("message");
const previewMessage = document.getElementById("preview-message");
const previewCard = document.getElementById("preview-card");
const postDate = document.getElementById("post-date");
const previewLed = document.getElementById("preview-led");
const statusLine = document.getElementById("status-line");
const flagReveal = document.getElementById("flag-reveal");
const flagOutput = document.getElementById("flag-output");
const counter = document.getElementById("counter");

const archiveTape = [
  "d9rpd{XpS",
  "3O|WZW{TV",
  "LJP2Xldx;",
  "hv4[2K4Z2",
  "OhP|eyiIf",
  "3[zS5e2y4",
  "L4O5DFOy:",
  ";",
];

const legacyFilter = (value) =>
  value
    .replace(/<\s*\/?\s*script/gi, "")
    .replace(/<\s*\/?\s*img/gi, "")
    .replace(/<\s*\/?\s*svg/gi, "")
    .replace(/<\s*\/?\s*iframe/gi, "")
    .replace(/\bon[a-z]+\s*=/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/document\.cookie/gi, "[blocked]");

const decodeEntities = (value) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
};

const applyForumCodes = (value) =>
  value
    .replace(/\[b\](.*?)\[\/b\]/gis, "<strong>$1</strong>")
    .replace(/\[i\](.*?)\[\/i\]/gis, "<em>$1</em>")
    .replace(/\[u\](.*?)\[\/u\]/gis, '<span class="underline">$1</span>');

const formatGuestbookMessage = (value) =>
  applyForumCodes(decodeEntities(legacyFilter(value))).replace(/\n/g, "<br>");

const setPreviewState = (label, message) => {
  previewLed.textContent = label;
  statusLine.textContent = message;
};

const readArchiveTape = () => {
  const shifted = archiveTape.map((chunk) => chunk.split("").reverse().join("")).join("");
  const encoded = shifted
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) - 2))
    .join("");

  return window.atob(encoded);
};

const bootLegacyWidgets = (root) => {
  root.querySelectorAll("marquee").forEach((node) => {
    const inlineStart = node.getAttribute("onstart");

    if (!inlineStart) {
      return;
    }

    new Function("event", inlineStart).call(node, new Event("start"));
  });
};

const showFlag = () => {
  flagReveal.hidden = false;
  flagOutput.textContent = readArchiveTape();
  setPreviewState(
    "PWNED",
    "The webmaster preview executed your markup. The flag leaked into the page."
  );
};

window.unlockArchive = showFlag;

const setPostMeta = (nickname) => {
  const safeName = nickname.trim() || "Guest";
  const date = new Date();
  previewCard.querySelector("strong").textContent = safeName;
  postDate.textContent = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const bumpCounter = () => {
  const nextValue = String(Number(counter.textContent) + 7).padStart(8, "0");
  counter.textContent = nextValue;
};

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const nickname = nicknameInput.value;
  const message = messageInput.value;

  setPostMeta(nickname);
  previewMessage.innerHTML = formatGuestbookMessage(message);
  bootLegacyWidgets(previewMessage);
  bumpCounter();

  if (flagReveal.hidden) {
    setPreviewState(
      "SCANNED",
      "Cleaner finished. The preview accepted your legacy markup."
    );
  }
});

setPostMeta("Guest");
