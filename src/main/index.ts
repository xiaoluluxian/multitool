/**
 * @overview generated by ghoti-cli
 * @fileoverview Electron Entry
 */

import { app, BrowserWindow, contentTracing, dialog, Event, ipcMain, Menu, shell } from "electron";
import Config from "../config/config";

import template from './menu';

import nav, { destroyNavgitor } from './navigator';
import createParser, { destroyParser } from './parser';

import { pageClipError, pageClipReport } from './pageclip';

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import createEditParser from "./editParser";

let win: BrowserWindow;
let tempWindows: BrowserWindow;
let main: any;
let maxStatus: boolean = false;
let errorBuffer: any[] = [];


const createWindow: () => void = () => {
    if (Config.isDebug) {
        win = new BrowserWindow({
            width: 1850,
            height: 1020,
            show: false,
            frame: false,
            backgroundColor: Config.backgroundColor,
        });
        win.loadURL("http://localhost:8080");
        win.webContents.openDevTools();
    } else {
        win = new BrowserWindow({
            width: 1350,
            height: 1020,
            show: false,
            frame: false,
            backgroundColor: Config.backgroundColor,
        });
        win.loadURL(`file://${__dirname}/../renderer/index.html`);
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    win.on('maximize', (): void => {
        maxStatus = true;
        main.sender.send('max-status', maxStatus);
    });

    win.on('unmaximize', (): void => {
        maxStatus = false;
        main.sender.send('max-status', maxStatus);
    });

    win.on("closed", (): void => {
        win = null;
        ipcMain.removeListener('window-control', windowControl);
    });

    win.on("ready-to-show", (): void => {
        win.show();
        win.focus();
    });

    if (!Config.isDebug) {
        win.webContents.on(('console-message' as any), (event: any, level: number, message: string, line: number, sourceId: string) => {
            if (level >= 1) {
                errorBuffer.push(`Level ${level}, [[${message}]] from ${sourceId ? sourceId : 'Nothing'}:${line}`);
            }

            if (level >= 2) {
                pageClipError(JSON.stringify(errorBuffer));
                errorBuffer = [];
            }
        });
    }

    const windowControl = (event: any, mode: string) => {
        switch (mode) {
            case 'min':
                win.minimize();
                break;
            case 'max':
                if (maxStatus) {
                    win.restore();
                } else {
                    win.maximize();
                }
                break;
            case 'close':
                app.quit();
                break;
        }
    };

    ipcMain.on('window-control', windowControl);
};

ipcMain.on('lunch-window', (evnet: any, windowName: string) => {
    switch (windowName) {
        case 'ig':
            createWindow();
            destroyNavgitor();
            break;
        case 'par':
            createParser();
            destroyNavgitor();
            break;
        case 'editpar':
            createEditParser();
            destroyNavgitor();
            break;
    }
});

ipcMain.on('register', (event: any) => {
    main = event;
});


ipcMain.on('save-file', (event: any, arg: string, content: string) => {
    content += '<script>window.print();</script>';

    if (arg === 'add') {
        content += '<style>\
          @page {\
            size: A4;\
          }\
          @page :left {\
            margin-left: 4cm;\
          }\
          @page :right {\
            margin-left: 4cm;\
          }</style>';
    }
    let tempPath = path.join(os.tmpdir(), 'temp.html');
    // content += '<style>@media print{div.div-footer{width:100%;position:fixed;bottom:0}}</style>';
    fs.writeFile(tempPath, content, (err1) => {
        if (err1) {
            console.log(err1);
            return;
        }

        if (os.platform() === 'darwin') {
            shell.openExternal('file://' + tempPath);
        } else {
            shell.openExternal(tempPath);
        }
    });
});

ipcMain.on('save-page', (event: any, arg: string) => {
    dialog.showSaveDialog(win, {
        title: 'Save page',
        defaultPath: path.join(os.homedir(), 'Desktop', arg + '.rpni'),
        buttonLabel: 'Save',
    }, (file) => {
        if (file === null) {
            event.sender.send('save-page-re', null);
        } else {
            event.sender.send('save-page-re', file);
        }
    });
});

ipcMain.on('load-page', (event: any, arg: string) => {
    dialog.showOpenDialog(win, {
        title: 'Load page',
        defaultPath: path.join(os.homedir(), 'Desktop', arg + '.rpni'),
        buttonLabel: 'Load',
    }, (file) => {
        if (file === null) {
            event.sender.send('load-page-re', null);
        } else {
            event.sender.send('load-page-re', file);
        }
    });
});

app.on("ready", () => {
    nav();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (win === null) {
        nav();
    }
});
