import { IncomingHttpHeaders, IncomingMessage } from 'http';
import * as https from 'https';
import * as os from 'os';
import * as querystring from 'querystring';

import Config from '../config/config';

type TPaceClip = {
    code: number,
    headers: IncomingHttpHeaders,
    body: any,
} | any;

const pageclip = async (content: any): Promise<TPaceClip> => {
    const configeration: https.RequestOptions = {
        method: 'PUT',
        host: 'api.pageclip.co',
        path: '/data/test',
        headers: {
            "Content-Type": 'application/x-www-form-urlencoded',
            "Authorization": 'Basic ' + Config.pageclipVeri,
        },
    };
    const req = https.request(configeration, (res: IncomingMessage) => {
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', () => {
            return {
                code: res.statusCode,
                headers: res.headers,
                body,
            };
        });
    });
    req.on('error', (e: Error) => {
        console.log('problem with request: ' + e.message);
    });
    const cpus = os.cpus();
    const totalMemory = os.totalmem() / 1048576;
    const usedMemory = totalMemory - os.freemem() / 1048576;
    const writes = {
        ...content,
        arch: `${cpus[0].model} * ${cpus.length}(${os.arch()} - ${os.platform()}@${os.release()})`,
        memory: `${Math.round(usedMemory)} / ${Math.round(totalMemory)}(${Math.round((usedMemory / totalMemory) * 100)}% used)`,
    };
    req.end(querystring.stringify(writes));
};

const pageClipError = async (message: string): Promise<TPaceClip> => {
    return await pageclip({
        from: `ERROR: p6@${Config.version}`,
        content: message,
    });
};

const pageClipReport = async (message: string, from: string): Promise<TPaceClip> => {
    return await pageclip({
        content: message,
        from: `REPORT: ${from}`,
    });
};

export {
    pageClipError,
    pageClipReport,
};
