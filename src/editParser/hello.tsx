/**
 * @overview generated by ghoti-cli
 * @fileoverview Page Index
 */

import { ipcRenderer, app, BrowserWindow, dialog, Event, ipcMain, Menu, shell } from "electron";

import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import Lunuh from './components/lunuh';
import * as Pages from "./pages/import";

import "../style/parser.sass";

class Hello extends React.Component<{}, {
    help: boolean;
}> {

    public constructor(props: {}) {
        super(props);
        this.state = {
            help: false,
        };
    }

    public render(): any {
        return (
            <React.Fragment>
                <div className="title">
                    <div className="left"><i className="fas fa-dove"></i>&nbsp;RPN Parser</div>
                    <div className="right">
                        <button onClick={this.minium}>
                        <i className="fas fa-minus"></i>
                        </button>
                        <button onClick={this.maximum}>
                            <i className="far fa-window-restore"></i>
                        </button>
                        <button onClick={this.close}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                {this.state.help ? <Lunuh /> : <Route path="/" exact component={Pages.Root} />}
            </React.Fragment>
        );
    }

    protected minium() {
        ipcRenderer.send('window-control', 'min');
    }
    protected maximum() {
        ipcRenderer.send('window-control', 'max');
    }

    protected close() {
        ipcRenderer.send('window-control', 'close');
    }

    
    



}

export default Hello;
