# Delivery information

## Who wrote this piece of crap

Its me. <https://github.com/WMXPY>.

I felt terrible to let you work on this crap of mass wrote by me...

I tried to make it as easy as possible to read. Feel free to send my email about my work, <mailto://wm@mengw.io>

## To set up this package

Run `npm install` and run `npm install --only=dev` to install dependence. The electron will auto downloaded during the process.

### Start

You should always check src/config/config.ts' isDebug boolean status.

To develop parser, you should run `npm run electron` and `npm run start:parser` in a different terminal window. 

to develop invoice generator, you should run `npm run electron` and `npm start` in different terminal window

### Build

You should always check src/config/config.ts' isDebug boolean status.

To build this software, whatever Mac or Win32 version, is dependent on what os is your build machine, run `npm run build,` and the script will finish rest of it for you.

## Merge to browser

### Required technologys

-   Webpack 3
-   React
-   Typescript
-   NodeJS

### TODO LIST

-   Change webpack build funtion
-   Move IPC piped function to local
-   Remove all NodeJS dependence in webpage
-   Add new image load and upload function
-   Add webpage jump function
-   Add service worker

## For the maintainer

### UNIT TEST

The unit test should be filled later, but nothing is written now. :(

### Why use typescript

We are handling frequently changing source data structure and which will be applied to multiple requirement practices. Typescript will help us fix error during compile stage.

### About tslint and eslint

The lint configures copied from my other project, and you can change it to fit your habit of course.

### What is ghoti-cli

<https://github.com/WMXPY/Ghoti-CLI>

### Git

I removed git history to hide my API keys, and you can init a .git folder and publish it to your git remote server.

After install, you can run `./node_modules/.bin/ghoti =git-init` to see an example steps to init your git service (Of course you already knew this).

### UI is so ugly!

I know.

Please help me <https://github.com/WMXPY/Indifferent!>

### Sass

Because of requirement changing, the launcher is added after the development of invoice generator. Sass is necessary to help us control global styling and private styling for each rendering thread. 

In another hand, Sass can help us handle nesting structure easier.

You can always use a .css file, but maybe copy many global styles might be necessary. 

### CSS IN JS ????????????

In src/anotherone/page/print.tsx and src/renderer/page/show.tsx, I used css in js format for one-time rendering. Currently, we are using React server render component to string function and transfer rendered string through ipc to print it out. The way I make it work is not the best practice, which means you may need to move the print function from the main thread back to renderer thread to move it to the browser. Until now, works well.

### IPCIPCICPICPCIPCIP IPC!

In extreme case, ipc cannot transfer too much data, especially base64 img code. I already fix it by add props/isprint, aware about it.

### Launcher .html file

As I said, the launcher is added after the development of invoice generator. To add this launcher faster I use single .html file to develop launcher, is a bad practice, it might be hard to upgrade, especially add function. Rewrite it with react later for the better experience.

### Version number

THIS AUTO UPDATE IS A BAD PRACTICE!!!, you shall upgrade the auto-update function for the better experience. Until now, this still working. 

There are three different location that you have to change for upgrading this software.

-   app/navigator/index.html 
    -   line const version = "x.x.x";
-   src/config/config.ts
    -   line version: "x.x.x"
-   app/package.json
    -   line "version": "x.x.x"

### Pageclip

This software 100% will throw an error due to I remove my pageclip API key and verification key in src/config/config.ts.

Use yours instead; also if the form name is changed, you have to change it in src/main.pageclip.ts. The reason I use nodejs native lib to submit this form instead of other lib is because .../ Regretted.
