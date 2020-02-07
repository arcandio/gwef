/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */
 import './index.css';
 import './text.js';
 import './data.js';
 import './contextmenu.js';
 import './selection.js';
 //import './ui.js'
 //import './test.js'

if(module.hot){
	module.hot.accept('./data.js', function(){
		//console.log('hmr update')
	})
	module.hot.accept('./text.js', function(){
		//console.log('hmr update', text)
	})
	module.hot.accept('./contextmenu.js', function(){
		//console.log('hmr update')
	})
	module.hot.accept('./selection.js', function(){
		//console.log('hmr update')
	})
	module.hot.accept()
}