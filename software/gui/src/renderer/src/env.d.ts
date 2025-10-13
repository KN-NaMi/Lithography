// src/renderer/src/env.d.ts
/// <reference types="vite/client" />

import { electronAPI } from '@electron-toolkit/preload'
import { api } from '../../preload/index'

declare global {
    interface Window {
        electron: typeof electronAPI
        api: typeof api
    }
}