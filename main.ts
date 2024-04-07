import { app, BrowserWindow } from "electron";
import * as path from "node:path";
import { bindWindowToLune, watchForChanges } from "electron-lune-bindings";
import * as config from "./src/config.json";

let win: BrowserWindow | undefined = undefined;
__dirname = path.resolve(__dirname, "../"); // from ./dist to project directory

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "https://luau-lang.org/assets/images/luau-88.png",
    webPreferences: {
      preload: path.join(__dirname, "/dist/src-js/preload.js"),
    },
  });

  win.loadFile("public/index.html").catch((err) => {
    console.error(err);
  });
}

app.whenReady().then(() => {
  createWindow();

  if (!win) return;

  bindWindowToLune(
    win,
    path.resolve(__dirname, config.mainScript),
    path.resolve(__dirname, config.mainScript.replace(".luau", ".exe")),
    config.lunePort
  );

  watchForChanges(win, __dirname);

  console.info(
    "Create a new shell instance and run 'tsc -w' inside of it to compile typescript files while the app is running\nif you're a vscode user you can run the 'tsc: watch' task"
  );

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});