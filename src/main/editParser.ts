import { app, BrowserWindow, dialog, Event, ipcMain, Menu, shell } from "electron";

import Config from "../config/config";
import template from './menu';

let editParserWindow: BrowserWindow;

export const destroyEditParser: () => void = () => {
    editParserWindow.close();
};

const createEditParser: () => void = () => {
    if (Config.isDebug) {
        editParserWindow = new BrowserWindow({
            width: 980,
            height: 600,
            show: false,
            frame: false,
            resizable: true,
            backgroundColor: Config.backgroundColor,
        });
        editParserWindow.loadURL("http://localhost:8080");
        editParserWindow.webContents.openDevTools();
    } else {
        editParserWindow = new BrowserWindow({
            width: 480,
            height: 600,
            show: false,
            frame: false,
            resizable: true,
            backgroundColor: Config.backgroundColor,
        });
        editParserWindow.loadURL(`file://${__dirname}/../editParser/index.html`);
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    editParserWindow.on("closed", (): void => {
        editParserWindow = null;
        ipcMain.removeListener('window-control', windowControl);
    });

    editParserWindow.on("ready-to-show", (): void => {
        editParserWindow.show();
        editParserWindow.focus();
    });

    const windowControl = (event: any, mode: string) => {
        switch (mode) {
            case 'min':
                editParserWindow.minimize();
                break;
            case 'max':
                editParserWindow.maximize();
                break;
            case 'close':
                app.quit();
                break;
        }
    };

    ipcMain.on('window-control', windowControl);
};

export default createEditParser;
