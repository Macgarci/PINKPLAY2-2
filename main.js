const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');


const dataFile = path.join(__dirname, 'render', 'data.json');


function readData(){
try{ return JSON.parse(fs.readFileSync(dataFile, 'utf-8')); }
catch(e){ return { users:[], songs:[], playlists:[], favorites:[] }; }
}


function writeData(d){ fs.writeFileSync(dataFile, JSON.stringify(d, null, 2)); }


function hashPassword(p){ return crypto.createHash('sha256').update(p).digest('hex'); }


function createWindow(){
const win = new BrowserWindow({
width: 1000,
height: 700,
webPreferences: { preload: path.join(__dirname, 'preload.js') }
});
win.loadFile(path.join(__dirname, 'render', 'index.html'));
}
app.whenReady().then(createWindow);


ipcMain.handle('data:read', async ()=> readData());
ipcMain.handle('data:write', async (e,d)=>{ writeData(d); return true; });


ipcMain.handle('auth:register', async (e,{ name,email,password })=>{
const data = readData();
if(data.users.find(u=>u.email===email)) return { ok:false, error:'EMAIL_EXISTS' };
const id = 'u_'+Math.random().toString(36).slice(2,9);
const user = { id, name, email, passwordHash: hashPassword(password) };
data.users.push(user);
writeData(data);
return { ok:true, user:{ id, name, email } };
});


ipcMain.handle('auth:login', async (e,{ email,password })=>{
const data = readData();
const user = data.users.find(u=>u.email===email && u.passwordHash===hashPassword(password));
if(!user) return { ok:false, error:'INVALID_CREDENTIALS' };
return { ok:true, user:{ id:user.id, name:user.name, email:user.email } };
});