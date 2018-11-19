const {app, BrowserWindow, Menu, MenuItem, ipcMain, shell }  = require('electron');
const fs = require('fs');
const $ = require('jquery');
const config = JSON.parse(fs.readFileSync('./src/environment/config/config.json','utf8'));

var images = [];

function createWindow(){
    mainWindow = new BrowserWindow({ minWidth:600, minHeight:750,width:1366, height:720, frame:config.frame, fullscreen:config.fullscreen, webPreferences: {
        plugins: true
      }});

    if(config.fullscreen == false)mainWindow.maximize();
    mainWindow.loadFile('./src/index.html');
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(true);
    mainWindow.on('closed', () => {
        mainWindow = null
    })
    
    compileInput();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
        mainWindow.removeAllListeners('close');
      }
})

function compileInput(){
    fs.readdir(config.inputpath, (err, dir) => {
        for(let i in dir){
            images.push(config.inputpath + dir[i]);
        }
    });
    global.images = images;
}