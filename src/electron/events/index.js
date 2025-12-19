import { initilizeApp } from '../lib/config'
// import settings from './lib/settings'
import log from 'electron-log/renderer'

export default {
  'INIT-THEME': initilizeApp,
  'APP-OPEN-MENU': () => {
    log.log('backend')
  },
}
