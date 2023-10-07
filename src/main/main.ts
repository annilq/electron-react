/* eslint-disable camelcase */
/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';

import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  // protocol,
  // net,
  dialog,
} from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import {
  getAssetPath,
  isDebug,
  loadImgs,
  resolveHtmlPath,
  saveImgFromPath,
} from './util';
import { addFace, deleteFace, detectFace, searchFace } from './FaceApi';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  ipcMain.handle('getFiles', loadImgs);
  ipcMain.on('delete-img', deleteFace);

  ipcMain.on('upload-img', (event, options) => {
    dialog
      .showOpenDialog({
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
        properties: ['openFile'],
      })
      .then(async (result) => {
        if (!result.canceled && result.filePaths.length > 0) {
          const filepath = result.filePaths[0];
          // 调用人脸检测
          const faceResult = await detectFace(filepath);

          if (faceResult?.result?.face_num > 0) {
            const face_token = faceResult?.result?.face_list[0]?.face_token;
            const searchResult = await searchFace(filepath);
            if (
              searchResult?.result?.user_list?.length > 0 &&
              searchResult?.result?.user_list[0].score > 80
            ) {
              console.log('find search');
              event.sender.send('message', '人脸已注册，请勿重复注册');
              return;
            }
            const addresult = await addFace(filepath);
            if (addresult?.error_code == '223105') {
              event.sender.send('message', '人脸已注册，请勿重复注册');
            }
            if (addresult?.error_code === 0) {
              saveImgFromPath(filepath, face_token);
              event.sender.send('upload-img-end', {
                name: face_token + path.extname(filepath),
                path: filepath,
              });
            }
          } else {
            event.sender.send('message', '未检测到人脸信息');
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });
  ipcMain.on('rec-img', (event) => {
    dialog
      .showOpenDialog({
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }],
        properties: ['openFile'],
      })
      .then(async (result) => {
        if (!result.canceled && result.filePaths.length > 0) {
          const filepath = result.filePaths[0];
          // 调用人脸检测
          const faceResult = await detectFace(filepath);

          if (faceResult?.result?.face_num > 0) {
            const searchResult = await searchFace(filepath);
            if (
              searchResult?.result?.user_list?.length > 0 &&
              searchResult?.result?.user_list[0].score > 80
            ) {
              event.sender.send('upload-img-for-rec', {
                name: path.basename(filepath),
                path: filepath,
                result: true,
              });
            } else {
              event.sender.send('upload-img-for-rec', {
                name: path.basename(filepath),
                path: filepath,
                result: false,
              });
              event.sender.send('message', '人脸未注册');
            }
          } else {
            event.sender.send('message', '未检测到人脸信息');
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      webSecurity: false,
      sandbox: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    // protocol.handle('atom', (request) => {
    //   console.log(request.url);
    //   const fileName = request.url.slice('atom://'.length);
    //   console.log(fileName);
    //   return net.fetch(`file://${fileName}`);
    // });
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
