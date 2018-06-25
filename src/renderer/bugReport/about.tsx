/**
 * @author WMXPY
 * @overview generated by ghoti-cli
 * @fileoverview Component set Dropper
 */

import { shell } from 'electron';

import * as React from 'react';

import Paper from '@material-ui/core/Paper';

import Config from '../../config/config';
import versionChecker from '../../config/versionchecker';

import * as fs from 'fs';
import * as path from 'path';

class Dropper extends React.Component<{}, {
    version: string;
    path: string;
}> {
    public constructor(props) {
        super(props);
        this.state = {
            version: '',
            path: '',
        };
        this.test = this.test.bind(this);
    }

    public componentDidMount() {
        this.test();
    }

    public render() {
        let content;
        if (this.state.version.length < 1) {
            content = <div>Checking updates</div>;
        } else {
            if (versionChecker(Config.version, this.state.version)) {
                content = <button onClick={() => {
                    shell.openExternal(this.state.path);
                }}>Click to download latest verion</button>;
            } else {
                content = <div>You are running latest verion</div>;
            }
        }


        return (
            <Paper
                className="paper self-margin"
                elevation={4}>
                <div className="about-box">
                    <div className="version">
                        {content}
                    </div>
                    <div className="support">
                        <div className="left">Support</div>
                        <div className="right">
                            <a href="mailto:arc@lunuh.com">arc@lunuh.com</a>
                        </div>
                    </div>
                </div>
            </Paper>);
    }

    protected test() {
        fetch('http://a.service.songshuames.com/version/latest').then((res) => {
            if (res.ok) {
                res.json().then((data) => {
                    let p = data.path ? data.path : 'https://github.com/Lunuh/deploy/releases';
                    this.setState({
                        version: data.version,
                        path: p,
                    });
                    this.forceUpdate();
                });
            } else {
                console.log('err');
            }
        });
    }
}

export default Dropper;
