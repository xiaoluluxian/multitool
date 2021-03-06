/**
 * @author WMXPY
 * @overview generated by ghoti-cli
 * @fileoverview Page set edit
 */

import * as React from 'react';

import Config from '../../config/config';

import Dropper from './dropper';
import { IItem, IPage } from './interface';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import * as fs from "fs";

import MultiDropper from './multiDropper';

import * as $ from 'jquery';
import * as Path from 'path';
import * as NodeFormData from 'form-data';
import Markus from 'markus-sdk-node';

export interface IProps {
    page: IPage;
    updatePage: (page: IPage, next?: () => void) => void;
    changeStatus: (status: string) => void;
}

class Edit extends React.Component<IProps, {}> {
    /**
     * FOR MAINTAINER
     * MAKSSURE show.tsx is not editable, but as in a result of edit.tsx
     */
    public constructor(props) {
        super(props);
        this.mapItem = this.mapItem.bind(this);
        this.addItem = this.addItem.bind(this);
        this.renderMain = this.renderMain.bind(this);

        this.initItem = this.initItem.bind(this);
    }

    public render(): JSX.Element {
        return (<div>
            {this.renderMain()}
            {this.props.page.item.map(this.mapItem)}
            <button onClick={this.addItem} className="big" title="add item">
                <i className="fas fa-plus-square"></i>
            </button>
        </div>);
    }

    protected renderMain(): JSX.Element {
        return (<Paper
            className="paper self-margin"
            elevation={4}>
            <div className="title-container"><h1>Main</h1></div>
            <div className="inputs">
                <TextField
                    fullWidth
                    label="Invoice Number/ Key Code and Lock Box Number"
                    className="inputs"
                    margin="dense"
                    multiline
                    value={this.props.page.invoice}
                    onChange={(event) => {
                        let page: IPage = this.props.page;
                        page.invoice = event.target.value;
                        this.props.updatePage(page);
                    }} />
            </div>
            <div className="inputs">
                <TextField
                    fullWidth
                    className="inputs"
                    label="Bill To/ Upload Link/ Note"
                    margin="dense"
                    value={this.props.page.billTo}
                    multiline
                    onChange={(event) => {
                        let page: IPage = this.props.page;
                        page.billTo = event.target.value;
                        this.props.updatePage(page);
                    }} />
            </div>
            <div className="inputs">
                <TextField
                    fullWidth
                    className="inputs"
                    label="Address"
                    margin="dense"
                    value={this.props.page.address}
                    multiline
                    onChange={(event) => {
                        let page: IPage = this.props.page;
                        page.address = event.target.value;
                        this.props.updatePage(page);
                    }} />
            </div>
            <div className="inputs">
                <TextField
                    fullWidth
                    className="inputs"
                    type="date"
                    label="Completion Date"
                    value={this.props.page.completionDate}
                    margin="dense"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={(event) => {
                        let page: IPage = this.props.page;
                        page.completionDate = event.target.value;
                        this.props.updatePage(page);
                    }} />
            </div>
            <div className="inputs">
            <TextField
                fullWidth
                className="inputs"
                type="date"
                label="Invoice Date/ Due Date"
                margin="dense"
                value={this.props.page.invoiceDate}
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={(event) => {
                    let page: IPage = this.props.page;
                    page.invoiceDate = event.target.value;
                    this.props.updatePage(page);
                }} /> 
            </div>
            <div className="inputs">
                <TextField
                    fullWidth
                    className="inputs"
                    label="Tax"
                    value={this.props.page.tax}
                    type="number"
                    margin="dense"
                    onChange={(event) => {
                        let page: IPage = this.props.page;
                        page.tax = parseFloat(event.target.value) || 0;
                        this.props.updatePage(page);
                    }} />
            </div>
        </Paper>);
    }

    protected initItem(): IItem {
        const uniqueIdSmall = () => {
            return '_' + Math.random().toString(36).substring(2, 9);
        };
        return {
            description: '',
            amount: 0,
            taxable: true,
            unique: uniqueIdSmall(),
            before: [],
            during: [],
            after: [],
        };
    }



    protected addItem(): void {
        let page: IPage = this.props.page;
        page.item.push(this.initItem());
        this.props.updatePage(page);
    }

    protected mapItem(value: IItem, index: number) {
        const addBefore = () => {
            let page: IPage = this.props.page;
            page.item[index].before.push('');
            this.props.updatePage(page);
        };
        const addMutipleBefore = (fileList: string[]) => {
            let bitmap = [];
            for(var i=0;i<fileList.length;i++){
                bitmap.push(fs.readFileSync(fileList[i]));
            }
            console.log();
            const markus = new Markus('http://206.189.167.228');
            const length = fileList.length;
            markus.UploadMultipleBuffer(bitmap, this.props.page.address, 'jpeg', [this.props.page.address], (count)=>{
                this.props.changeStatus(`Upload ${count}/${length}`);
            }, 'test').then((result)=>{
                for(let i of result){
                    let page = this.props.page;
                    page.item[index].before.push("http://206.189.167.228/b/" + i.id);
                    this.props.updatePage(page);
                }
            });
        };

        const addMutipleDuring = (fileList: string[]) => {
            let bitmap = [];
            for(var i=0;i<fileList.length;i++){
                bitmap.push(fs.readFileSync(fileList[i]));
            }
            console.log();
            const markus = new Markus('http://206.189.167.228');
            const length = fileList.length;
            markus.UploadMultipleBuffer(bitmap, this.props.page.address, 'jpeg', [this.props.page.address], (count)=>{
                this.props.changeStatus(`Upload ${count}/${length}`);
            }, 'test').then((result)=>{
                for(let i of result){
                    let page = this.props.page;
                    page.item[index].during.push("http://206.189.167.228/b/" + i.id);
                    this.props.updatePage(page);
                }
            });
        };

        const addDuring = () => {
            let page: IPage = this.props.page;
            page.item[index].during.push('');
            this.props.updatePage(page);
        };

        const addMutipleAfter = (fileList: string[]) => {
            let bitmap = [];
            for(var i=0;i<fileList.length;i++){
                bitmap.push(fs.readFileSync(fileList[i]));
            }
            console.log();
            const markus = new Markus('http://206.189.167.228');
            const length = fileList.length;
            markus.UploadMultipleBuffer(bitmap, this.props.page.address, 'jpeg', [this.props.page.address], (count)=>{
                this.props.changeStatus(`Upload ${count}/${length}`);
            }, 'test').then((result)=>{
                for(let i of result){
                    let page = this.props.page;
                    page.item[index].after.push("http://206.189.167.228/b/" + i.id);
                    this.props.updatePage(page);
                }
            });
        };

        const addAfter = () => {
            let page: IPage = this.props.page;
            page.item[index].after.push('');
            this.props.updatePage(page);
        };

        const mapBeforePicture = (picture: string, pictureIndex: number) => {
            const editPicture = (path: string) => {
                const bitmap: Buffer = fs.readFileSync(path);
                const markus = new Markus('http://206.189.167.228');
                markus.UploadSingleBuffer(bitmap, 'pasda.jpg', [this.props.page.address], 'test').then((result)=>{
                    let page: IPage = this.props.page;
                    page.item[index].before[pictureIndex] = "http://206.189.167.228/b/" + result.id;
                    this.props.updatePage(page);
                });
            };

            const deletePicture = () => {
                let page: IPage = this.props.page;
                page.item[index].before.splice(pictureIndex, 1);
                this.props.updatePage(page);
            };
            return (<div className="ikka" key={pictureIndex}>
            <div>{pictureIndex+1}</div>
                <Dropper
                    onDrop={editPicture}
                    load={picture} />
                <div className="ikkb">
                    <button className="sm" onClick={deletePicture} title="delete picture">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>);
        };

        const mapDuringPicture = (picture: string, pictureIndex: number) => {
            const editPicture = (path: string) => {
                const bitmap: Buffer = fs.readFileSync(path);
                const markus = new Markus('http://206.189.167.228');
                markus.UploadSingleBuffer(bitmap, 'pasda.jpg', [this.props.page.address], 'test').then((result)=>{
                    let page: IPage = this.props.page;
                    page.item[index].during[pictureIndex] = "http://206.189.167.228/b/" + result.id;
                    this.props.updatePage(page);
                });
            };

            const deletePicture = () => {
                let page: IPage = this.props.page;
                page.item[index].during.splice(pictureIndex, 1);
                this.props.updatePage(page);
            };
            return (<div className="ikka" key={pictureIndex} >
            <div>{pictureIndex+1}</div>
                <Dropper
                    onDrop={editPicture}
                    load={picture} />
                <div className="ikkb">
                    <button className="sm" onClick={deletePicture} title="delete pictures">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>);
        };

        const mapAfterPicture = (picture: string, pictureIndex: number) => {
            const editPicture = (path: string) => {
                const bitmap: Buffer = fs.readFileSync(path);
                const markus = new Markus('http://206.189.167.228');
                markus.UploadSingleBuffer(bitmap, 'pasda.jpg', [this.props.page.address], 'test').then((result)=>{
                    let page: IPage = this.props.page;
                    page.item[index].after[pictureIndex] = "http://206.189.167.228/b/" + result.id;
                    this.props.updatePage(page);
                });
            };

            const deletePicture = () => {
                let page: IPage = this.props.page;
                page.item[index].after.splice(pictureIndex, 1);
                this.props.updatePage(page);
            };

            return (<div className="ikka" key={pictureIndex} >
            <div>{pictureIndex+1}</div>
                <Dropper
                    onDrop={editPicture}
                    load={picture} />
                <div className="ikkb">
                    <button className="sm" onClick={deletePicture} title="delete pictures">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>);
        };

        return (<div key={value.unique} >
            <div className="insert">
                <button onClick={() => {
                    let page: IPage = this.props.page;
                    page.item.splice(index, 0, this.initItem());
                    this.props.updatePage(page);
                }}><i className="fas fa-plus-square"></i></button>
            </div>
            <Paper
                className="paper"
                elevation={4}
            >
                <div className="itemTop">
                    <div className="right">
                        <button className="bigger" onClick={() => {
                            let page: IPage = this.props.page;
                            page.item.splice(index, 1);
                            this.props.updatePage(page);
                        }} title="delete"><i className="fas fa-times"></i></button>
                        <button className={value.taxable ? "check" : "uncheck"} onClick={() => {
                            let page: IPage = this.props.page;
                            page.item[index].taxable = !page.item[index].taxable;
                            this.props.updatePage(page);
                        }} title="tax"><i className="fas fa-money-check-alt"></i></button>
                    </div>
                    <div className="left"><h3>Item - {index + 1}</h3></div>
                </div>
                <div className="inputs">
                    <TextField
                        fullWidth
                        className="inputs"
                        label="Description"
                        multiline
                        value={value.description}
                        onChange={(event) => {
                            let page: IPage = this.props.page;
                            page.item[index].description = event.target.value;
                            this.props.updatePage(page);
                        }} />
                </div>
                <div className="inputs">
                    <TextField
                        fullWidth
                        className="inputs"
                        label="Amount"
                        type="number"
                        value={value.amount}
                        onChange={(event) => {
                            let page: IPage = this.props.page;
                            page.item[index].amount = parseFloat(event.target.value) || 0;
                            this.props.updatePage(page);
                        }} />
                </div>
                <div className="picture">
                    <MultiDropper
                        onDrop={addMutipleBefore}
                        load=""
                    />
                    {value.before.map(mapBeforePicture)}
                    <button
                        onClick={addBefore}
                        title="before photo"
                        className="add"
                    // className={"add " + (value.before.length > 0 ? "contain" : "not")}
                    >
                        <i className="fas fa-clipboard-list"></i>
                    </button>
                </div>
                <div className="picture">
                    <MultiDropper
                        onDrop={addMutipleDuring}
                        load=""
                    />
                    {value.during.map(mapDuringPicture)}
                    <button onClick={addDuring} className="add" title="during photo">
                        <i className="fas fa-wrench"></i>
                    </button>
                </div>
                <div className="picture">
                    <MultiDropper
                        onDrop={addMutipleAfter}
                        load=""
                    />
                    {value.after.map(mapAfterPicture)}
                    <button onClick={addAfter} className="add" title="after photo">
                        <i className="fas fa-clipboard-check"></i>
                    </button>
                </div>


            </Paper>
        </div>);
    }
}

export default Edit;
