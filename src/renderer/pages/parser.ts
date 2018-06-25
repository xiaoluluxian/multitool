import { app, BrowserWindow, dialog, Event, ipcMain, Menu, shell } from "electron";

import Config from "../../config/config";
import template from '../../main/menu';

let parserWindow: BrowserWindow;

export const destroyParser: () => void = () => {
    parserWindow.close();
};

const createParser: () => void = () => {
    if (Config.isDebug) {
        parserWindow = new BrowserWindow({
            width: 980,
            height: 600,
            show: false,
            frame: false,
            resizable: false,
            backgroundColor: Config.backgroundColor,
        });
        parserWindow.loadURL("http://localhost:8080");
        parserWindow.webContents.openDevTools();
    } else {
        parserWindow = new BrowserWindow({
            width: 480,
            height: 600,
            show: false,
            frame: false,
            resizable: false,
            backgroundColor: Config.backgroundColor,
        });
        parserWindow.loadURL(`file://${__dirname}/../../anotherone/index.html`);
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    parserWindow.on("closed", (): void => {
        parserWindow = null;
        ipcMain.removeListener('window-control', windowControl);
    });

    parserWindow.on("ready-to-show", (): void => {
        parserWindow.show();
        parserWindow.focus();
    });

    const windowControl = (event: any, mode: string) => {
        switch (mode) {
            case 'min':
                parserWindow.minimize();
                break;
            case 'close':
                app.quit();
                break;
        }
    };

    ipcMain.on('window-control', windowControl);
};

export default createParser;
