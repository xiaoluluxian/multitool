import { app, BrowserWindow, dialog, Event, ipcMain, Menu, shell } from "electron";

import Config from "../config/config";
import template from './menu';

let navigitorWindow: BrowserWindow;

export const destroyNavgitor: () => void = () => {
    navigitorWindow.close();
};

const createNavgitor: () => void = () => {
    if (Config.isDebug) {
        navigitorWindow = new BrowserWindow({
            width: 880,
            height: 720,
            show: false,
            frame: false,
            backgroundColor: Config.backgroundColor,
        });
        navigitorWindow.loadURL(`file://${__dirname}/../navigator/index.html`);
        navigitorWindow.webContents.openDevTools();
    } else {
        navigitorWindow = new BrowserWindow({
            width: 480,
            height: 720,
            show: false,
            frame: false,
            backgroundColor: Config.backgroundColor,
        });
        navigitorWindow.loadURL(`file://${__dirname}/../navigator/index.html`);
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    navigitorWindow.on("closed", (): void => {
        navigitorWindow = null;
        ipcMain.removeListener('window-control', windowControl);
    });

    navigitorWindow.on("ready-to-show", (): void => {
        navigitorWindow.show();
        navigitorWindow.focus();
    });

    const windowControl = (event: any, mode: string) => {
        switch (mode) {
            case 'min':
                navigitorWindow.minimize();
                break;
            case 'close':
                app.quit();
                break;
        }
    };

    ipcMain.on('window-control', windowControl);
};

export default createNavgitor;
