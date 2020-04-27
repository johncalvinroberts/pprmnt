const { app, BrowserWindow, dialog, messageNode } = require('deskgap');
const fs = require('fs');

let win = null;

app.once('ready', () => {
  win = new BrowserWindow({
    menu: null,
    show: false,
    width: 600,
    height: 370,
  }).once('ready-to-show', function () {
    this.show();
  });

  messageNode.on('save-file', (e, fileName, fileContentBase64) => {
    dialog.showSaveDialog(win, { defaultPath: fileName }, (path) => {
      if (path == null) return;
      fs.writeFileSync(path, Buffer.from(fileContentBase64, 'base64'));
    });
  });

  win.loadFile('../dist/index.html');
});
