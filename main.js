const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const reload = require('electron-reload')
const path = require('path')
const url = require('url')
const debug = /--debug/.test(process.argv[2])

let mainWindow

if (debug) reload(path.join(__dirname, 'dist'))

function createWindow() {
    mainWindow = new BrowserWindow({ width: 900, height: 700 })

    mainWindow.setMenu(null)
    mainWindow.setTitle(require('./package.json').name)
    if (debug) mainWindow.openDevTools()

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})

ipcMain.on('open-file-dialog', event => {
    dialog.showOpenDialog(mainWindow, {
        properties: ['openFile']
    }, files => {
        if (files) event.sender.send('selected-directory', files)
    })
})

ipcMain.on('open-error-dialog', (event, args) => {
    dialog.showErrorBox(args.title ? args.title : 'Error', args.message)
})

ipcMain.on('save-dialog', (event, args) => {
    const options = {
        title: args.title,
        filters: args.filters
    }
    dialog.showSaveDialog(mainWindow, options, filename => {
        event.sender.send('saved-file', filename)
    })
})

ipcMain.on('open-information-dialog', (event, args) => {
    const options = {
        type: args.type ? args.type : 'info',
        title: args.title ? args.title : 'Info',
        message: args.message,
        buttons: args.buttons
    }
    dialog.showMessageBox(mainWindow, options, index => {
        event.sender.send('information-dialog-selection', index)
    });
});
