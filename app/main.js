"use strict"
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

const ipc = require('electron').ipcMain

require('@electron/remote/main').initialize()

let mainWindow

function createWindow () {

    mainWindow = new BrowserWindow({width: 1100, height: 600, webPreferences: {
      webSecurity: false,
      contextIsolation: false,
      nodeIntegration: true,
      enableRemoteModule: true,
    }})

    require('@electron/remote/main').enable(mainWindow.webContents)

    mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))


  mainWindow.on('closed', function () {
    mainWindow = null
  })
}


app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('navigate-login', function (event, arg) {
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file:',
        slashes: true
    }))
})

