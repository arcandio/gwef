# GWEF

> Game Wiki in Electron Forge

This work-in-progress project is an attempt to create a markdown-based personal wiki designed to be fast and powerful enough for use *during* a D&D or other TTRPG session.

![screenshot](docs\screenshot.png)

## dev setup

* install node & npm
* `npm install -g electron-forge`
* `npm install -g yarn`
* clone repo
* `npm install`
* `npm start`

## Key Features (make or break)

* Non-refresh formatting, live as you type (typora-like) :construction:
* markdown limited formatting :construction:
* save & load markdown files :construction:
* project structure & treeview :heavy_check_mark:
* automatically link existing files :heavy_check_mark:

## High Value Features

* json project preferences
* drag and drop files in *treeview*
* treeview icon/link style :construction:
  * NOT stored in yaml front matter, to prevent loading all pages. Store in `project.json` instead
  * https://www.npmjs.com/package/a-color-picker
* backlinks
* children
* tags
* drag & drop images into files (copy file to project)
* persist app settings between sessions :construction:
* formatting touch buttons on selection popup
* Color coded links based on link attributes, like good, bad, hate, love, etc
* tree-view file watching
* warn :warning: ​if filename exists 

## Other things to explore

* SVG drawing over bitmap image
* hunspell
* appveyor
* travis ci

## Possible tools

* https://www.npmjs.com/package/electron-less
* https://www.npmjs.com/package/yaml-front-matter
* https://www.npmjs.com/package/sanitize-html
* `graceful-fs` :heavy_check_mark:
* https://www.toptal.com/designers/subtlepatterns/ :heavy_check_mark:
* https://github.com/sindresorhus/electron-context-menu :heavy_check_mark:
* https://www.electronforge.io/config/plugins/webpack#project-setup :heavy_check_mark:
* https://www.electronforge.io/advanced/debugging :heavy_check_mark:
* ~~https://www.npmjs.com/package/electron-tree-view~~
* Hide Progressive Loading until finished
  * https://www.electronjs.org/docs/api/browser-window#showing-window-gracefully
* 

### Docs needed for completion

* FS
  * https://github.com/electron/electron/blob/master/docs/api/remote.md :heavy_check_mark:
* https://stackoverflow.com/questions/30465034/where-to-store-user-settings-in-electron-atom-shell-application

## MD parsing

### structure

* containers: lists, blockquotes, tables, code
  * blocks: paragraphs, etc
    * spans: bold, etc

### pseudocode

* for each line
  * keep last container
  * get current block type
    * search line for inline styles
    * create spans

### list of styles

* container styles
  * blockquote
  * codebox
  * unordered list
  * ordered list
  * check list
  * table
* Block/paragraph styles
  * paragraph
  * heading
  * horizontal rule
* Inline/Character styles
  * bold
  * italic
  * highlight
  * link
  * code
  * strike
* Save for later
  * math?

# Problems & Solutions

## troubleshooting

* clear
  * delete `node_modules`
  * delete `.webpack`
  * delete `C:\Users\arcan\AppData\Roaming\gwef`
  * delete `C:\Users\arcan\AppData\Roaming\npm-cache`
  * npm install
* New App
  * `npx create-electron-app mystupidtestapp`

## Moving the caret on update :heavy_check_mark:

* https://jsfiddle.net/arcandio/gpe2rk7t/28/
* https://jsfiddle.net/TjXEG/900/



* Issues
  * https://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
    * tried first and second answers, but not generalizable enough for my conditions (child element regeneration)
  * https://stackoverflow.com/questions/4749146/problem-with-caret-position-when-modifying-a-field-htmljs
    * not relevant
  * https://stackoverflow.com/questions/27380018/when-cmd-key-is-kept-pressed-keyup-is-not-triggered-for-any-other-key?noredirect=1&lq=1
    * no idea

## Fails to load file silently

* seems to be a Webpack problem, changing `data.js` functions seems to sometimes force it to refresh and work. Deleting the webpack folder doesn't seem to affect it though.
* Sometimes it works if you Refresh the app

## Possible Alternative: Proton Native

* no Electron
* uses React
* compiles to native QT
* Can I access the text elements/do my md parsing?