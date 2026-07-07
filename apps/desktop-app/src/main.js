const { app, BrowserWindow } = require("electron");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 700,
    title: "Smart Campus Desktop",
    backgroundColor: "#eef3f8",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const APP_URL =
    "http://smart-campus-qa-alb-1174325889.us-east-1.elb.amazonaws.com/api";

  mainWindow.loadURL(APP_URL);
  mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});