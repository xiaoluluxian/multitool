/*
@author untitled95
*/
import { availableDivider, IEach, IPicture } from '../pages/interface';

import * as path from 'path';

const seprateCurrent = (current: string): {
    n: number;
    s: string;
} => {
    for (let i = 0; i < current.length; i++) {
        if (!parseFloat(current[i])) {
            return {
                n: parseFloat(current.substring(0, i)),
                s: current.substring(i, current.length),
            };
        }
    }
    return {
        n: 0,
        s: '',
    };
};

const parsePDF = (thing: string[]): IEach[] => {
    let stuffs: IEach[] = [];
    let buffer: IEach = {};
    let next = -1;
    for (let i = 0; i < thing.length; i++) {
        let current = thing[i];
        if (next === -1) {
            if (current === 'Item #DescriptionQTYU/MPPUCost') {
                next = 0;
            }
        }
        switch (next) {
            case 0:
                console.log(seprateCurrent(thing[i + 1]));
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;
            case 5:
                break;
        }
    }
    return [];
};

const removeOthers = (name: string): string => {
    return name.split(/ |-/).join('').trim().toLowerCase();
};

const parsePictureName = (name: string, divider: availableDivider): { outer: string, num: string } => {
    let splited: string[] = name.trim().split(' ').join('').split(divider);
    let { outer, num, all }: { outer: string; num: string; all: string } = {
        outer: splited.shift(),
        num: splited.shift(),
        all: splited.join(''),
    };

    return {
        outer,
        num,
    };

    // name format [outer]-[number]-[any]

};

const removeExtName = (name: string): string => {
    return name.replace(/\.[^/.]+$/, "");
};

const cleanImageList = (list: Array<{
    name: string;
    used: boolean;
}>): Array<{
    name: string;
    used: boolean;
}> => {
    let temp = [];

    for (let i of list) {
        if (path.extname(i.name).toLowerCase() === '.jpg' || path.extname(i.name).toLowerCase() === '.jpeg' ) {
            temp.push(i);
        }
    }

    return temp;
};

const comparePictureName = (name: string, category: string, itemNumber: number, divider: availableDivider) => {
    let extName = path.extname(name);

    if (extName.toLowerCase() !== '.jpg' && (extName as any).toLowerCase() !== '.jpeg') {
        return false;
    }

    // parse from dasod.jpg to dasod
    let baseName = path.basename(name);

    let { outer, num }: { outer: string, num: string } = parsePictureName(baseName, divider);
    let parsedNum: number = parseInt(num, 10);

    if (!parsedNum) {
        return false;
    }

    // LOGGING
    // console.log(removeOthers(outer), removeOthers(category));

    if (removeOthers(outer) !== removeOthers(category)) {
        return false;
    }

    if (itemNumber !== parsedNum) {
        return false;
    }

    return true;

    // name format [outer]-[number]-[any]
};

const getInner = (element: Cheerio): IEach[] => {
    let stuffs: IEach[] = [];
    let buffer: IEach = {};
    let next = 0;
    for (let i = 0; i < element.length; i++) {
        if (next === 6) {
            next = 0;
            stuffs.push(buffer);
            buffer = {};
        }
        let current = element.eq(i).text();
        switch (next) {
            case 0:
                let num: number = parseFloat(current);
                if (num && current.length <= 3) {
                    buffer.item = num;
                    next++;
                } else {
                    if (stuffs.length > 0 && current.trim().substring(0, 1) !== '$' && current.trim().substring(0, 10) !== 'Area Total') {
                        stuffs[stuffs.length - 1].comments = current;
                    }
                }
                break;
            case 1:
                buffer.description = current;
                next++;
                break;
            case 2:
                buffer.qty = parseFloat(current);
                next++;
                break;
            case 3:
                buffer.UM = current;
                next++;
                break;
            case 4:
                buffer.PPU = parseFloat(current.substr(1).split(',').join(''));
                next++;
                break;
            case 5:
                buffer.cost = parseFloat(current.substr(1).split(',').join(''));
                next++;
                break;
        }
    }
    return stuffs;
};

export {
    getInner,
    parsePDF,
    cleanImageList,
    comparePictureName,
    removeExtName,
};
