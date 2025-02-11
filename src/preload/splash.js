const { ipcRenderer } = require("electron");
const version = require("../../package.json").version;

document.addEventListener("DOMContentLoaded", () => {
  const versionElement = document.querySelector(".ver");
  const statusElement = document.querySelector(".status");
  const splashElement = document.querySelector(".splash");

  versionElement.textContent = `v${version}`;

  const updateStatus = (status) => (statusElement.textContent = status);

  // List of background images
  const backgrounds = [
    "../img/juice_banner1.webp",
    "../img/juice_banner2.webp",
    "../img/juice_banner3.webp"
  ];

  // Select a random background image
  const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  splashElement.style.backgroundImage = `url(${randomBackground})`;

  ipcRenderer.send("check-for-updates");
  updateStatus("Checking for updates...");

  ipcRenderer.on("update-available", () =>
    updateStatus("Update available! Downloading...")
  );
  ipcRenderer.on("update-not-available", () =>
    updateStatus("No updates available. Launching...")
  );

  ipcRenderer.on("update-downloaded", () => {
    updateStatus("Update downloaded! Installing...");
    ipcRenderer.send("quit-and-install");
  });

  ipcRenderer.on("download-progress", (_, progress) =>
    updateStatus(`Downloading update: ${Math.round(progress.percent)}%`)
  );
});
