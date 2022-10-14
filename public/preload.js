// window.ipcRenderer = require("electron").ipcRenderer;

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    let { send: validChannels } = JSON.parse(process.env.IPC_CHANNELS);
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let { receive: validChannels } = JSON.parse(process.env.IPC_CHANNELS);
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
