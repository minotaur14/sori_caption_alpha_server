const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");
const ProgressBar = require("electron-progressbar");

require("dotenv").config();

// 자동으로 업데이트가 되는 것 방지
autoUpdater.autoDownload = false;

// main window*
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1010,
    height: 640,
    fullscreen: false,
    center: true,
    // transparent: true,
    frame: true,
    autoHideMenuBar: true,
    alwaysOnTop: false,
    backgroundColor: "#222",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: __dirname + "/preload.js",
    },
  });
  // mainWindow.loadFile("./index.html");
  // mainWindow.loadURL("http://localhost:3000");
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
  mainWindow.setResizable(true);
  mainWindow.on("closed", () => (mainWindow = null));
}

// app.on("ready", createWindow);
app.on("ready", () => {
  createWindow();
  autoUpdater.checkForUpdates();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
// main window**

// test*
ipcMain.on("test", (event, arg) => {
  console.log(arg);
});

ipcMain.on("toMain", (event, arg) => {
  console.log(arg);
  event.sender.send("fromMain", "응답");
});
// test**

// update*
let progressBar = null;
ipcMain.on("app_version", (event) => {
  event.reply("app_version", { version: app.getVersion() });
});

autoUpdater.on("checking-for-update", () => {
  console.log("업데이트 확인 중...");
});

autoUpdater.on("update-available", () => {
  console.log("최신 버전 확인");

  dialog
    .showMessageBox({
      type: "info",
      title: "Update",
      message:
        "새로운 버전이 확인되었습니다. 설치 파일을 다운로드 하시겠습니까?",
      buttons: ["지금 설치", "나중에 설치"],
    })
    .then((result) => {
      const { response } = result;

      if (response === 0) autoUpdater.downloadUpdate();
    });
});

autoUpdater.on("update-not-available", () => {
  console.log("업데이트가 없습니다.");
});

autoUpdater.once("download-progress", () => {
  console.log("설치 중");

  progressBar = new ProgressBar({
    text: "다운로드 합니다.",
  });

  progressBar
    .on("completed", () => {
      console.log("설치 완료");
    })
    .on("aborted", () => {
      console.log("aborted");
    });
});

autoUpdater.on("update-downloaded", () => {
  console.log("업데이트 완료");

  progressBar.setCompleted();

  dialog
    .showMessageBox({
      type: "info",
      title: "Update",
      message: "새로운 버전이 다운로드 되었습니다. 다시 시작하시겠습니까?",
      buttons: ["예", "아니오"],
    })
    .then((result) => {
      const { response } = result;

      if (response === 0) autoUpdater.quitAndInstall(false, true);
    });
});
// update**
