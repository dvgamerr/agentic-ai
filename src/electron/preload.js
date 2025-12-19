import { ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'
import { domReady, createPreloading } from './dom'

Promise.all([domReady(), ipcRenderer.invoke('INIT-THEME')]).then((res) => {
  const [, { theme }] = res
  createPreloading(theme).add()
  //   const loading = document.querySelector('#loading .text')

  //   // Custom APIs for renderer
  //   const api = {
  //     initConfig: () => config[1],
  //     preloadInit: (msg) => {
  //       if (msg) loading.textContent = msg
  //       preload.add()
  //     },
  //     preloadRemove: preload.remove,
  //     preloadText: (msg) => (loading.textContent = msg),
  //   }

  //   if (process.contextIsolated) {
  //     try {
  //       contextBridge.exposeInMainWorld('electron', electronAPI)
  //       contextBridge.exposeInMainWorld('invoke', ipcRenderer.invoke)
  //       contextBridge.exposeInMainWorld('api', api)
  //     } catch (ex) {
  //       console.error(ex)
  //     }
  //   } else {
  //     window.Electron = electronAPI
  //     window.invoke = ipcRenderer.invoke
  //     window.api = api
  //   }
  console.log({ contextIsolated: process.contextIsolated })
  console.log('init preload.')
})
