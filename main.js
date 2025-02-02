const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 635,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    hasShadow: false,
    backgroundColor: "#00000000",
    icon: path.join(__dirname, "assets", "icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    },
  });

  mainWindow.loadFile("index.html");
  mainWindow.setIgnoreMouseEvents(false);

  ipcMain.on("toggle-click", (event, isClickThrough) => {
    if (isClickThrough) {
      mainWindow.setIgnoreMouseEvents(true, { forward: true });
    } else {
      mainWindow.setIgnoreMouseEvents(false);
    }
  });

  // Close the application when the renderer sends the 'close-app' event
  ipcMain.on('close-app', () => {
    console.log('Closing the application...');
    app.quit();  // Quit the application
  });

  globalShortcut.register("Ctrl+X", () => {
    console.log("Unlocking window - Ctrl + X pressed");
    mainWindow.setIgnoreMouseEvents(false); 
    mainWindow.webContents.send('toggle-lock-button', true);
  });

  globalShortcut.register("Ctrl+L", () => {
    console.log("Locking window - Ctrl + L pressed");
    mainWindow.setIgnoreMouseEvents(true, { forward: true }); 
    mainWindow.webContents.send('toggle-lock-button', false);
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
