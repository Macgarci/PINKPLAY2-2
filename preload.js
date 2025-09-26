const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('api', {
readData: ()=> ipcRenderer.invoke('data:read'),
writeData: (d)=> ipcRenderer.invoke('data:write', d),
register: (p)=> ipcRenderer.invoke('auth:register', p),
login: (p)=> ipcRenderer.invoke('auth:login', p)
});