import path from 'path';
import url from 'url';
import { app, BrowserWindow, ipcMain as ipc, dialog } from 'electron';
import config from '../config/app';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow(config.windowOpts);

  // Set Menu and Title.
  mainWindow.setMenu(null);
  mainWindow.setTitle(config.title);

  // Open dev tools if environment is set to development.
  if (process.env.environment === 'development') mainWindow.openDevTools();

  // Load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // Emitted when the window is closed.
  mainWindow.on('closed', () => (mainWindow = null));
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// On OS X it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// -------------------------------------------------------------
//                   ipcMain Listeners
// -------------------------------------------------------------

// This listener will be called on renderer process and it will
// open a dialog to select files.
ipc.on('open-file-dialog', event => {
  dialog.showOpenDialog(
    mainWindow,
    {
      properties: ['openFile'],
    },
    files => {
      if (files) event.sender.send('selected-directory', files);
    }
  );
});

// This listener will be called on renderer process and it will
// open a dialog to show error messages.
ipc.on('open-error-dialog', (event, args) => {
  dialog.showErrorBox(args.title ? args.title : 'Error', args.message);
});

// This listener will be called on renderer process and it will
// open a dialog to save a file.
ipc.on('save-dialog', (event, args) => {
  const options = {
    title: args.title,
    filters: args.filters,
  };

  dialog.showSaveDialog(mainWindow, options, filename => {
    event.sender.send('saved-file', filename);
  });
});

// This listener will be called on renderer process and it will
// open a dialog to show information messages.
ipc.on('open-information-dialog', (event, args) => {
  const options = {
    type: args.type ? args.type : 'info',
    title: args.title ? args.title : 'Info',
    message: args.message,
    buttons: args.buttons,
  };

  dialog.showMessageBox(mainWindow, options, index => {
    event.sender.send('information-dialog-selection', index);
  });
});

// This listener will be called on renderer process and it will
// get the system locale.
ipc.on('get-system-locale', (event, callback) => {
  event.sender.send('system-locale-information', app.getLocale());
});

// In this file you can include the rest of your app's specific main process
