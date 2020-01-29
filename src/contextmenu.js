var elerem = require('electron').remote;
const { Menu, MenuItem } = elerem

const fileMenu = new Menu()
fileMenu.append(new MenuItem({ label: 'Rename', click() { console.log('rename clicked') } }))
fileMenu.append(new MenuItem({ label: 'Add', click() { console.log('add clicked') } }))
fileMenu.append(new MenuItem({ label: 'Insert Link', click() { console.log('insert link clicked') } }))

const textSelectionMenu = new Menu()
textSelectionMenu.append(new MenuItem({ label: 'goto link', click() { console.log('link clicked') } }))
textSelectionMenu.append(new MenuItem({ label: 'Clear formatting', click() { ClearInline() } }))
textSelectionMenu.append(new MenuItem({ type: 'separator' }))
textSelectionMenu.append(new MenuItem({ label: 'bold', type: 'checkbox', checked: false }))
textSelectionMenu.append(new MenuItem({ label: 'italic', type: 'checkbox', checked: false }))
textSelectionMenu.append(new MenuItem({ label: 'code', type: 'checkbox', checked: false }))
textSelectionMenu.append(new MenuItem({ label: 'highlight', type: 'checkbox', checked: false }))
textSelectionMenu.append(new MenuItem({ label: 'strike', type: 'checkbox', checked: false }))

const textCursorMenu = new Menu()
textCursorMenu.append(new MenuItem({ label: 'Clear formatting', click() { ClearInline() } }))
textCursorMenu.append(new MenuItem({ type: 'separator' }))
textCursorMenu.append(new MenuItem({ label: 'Insert Table', click() { console.log('insert clicked') } }))
textCursorMenu.append(new MenuItem({ label: 'Insert Ordered List', click() { console.log('insert clicked') } }))

window.addEventListener('contextmenu', (e) => {
	//console.log('context menu target:', e.target)
	e.preventDefault()
	classes = e.target.classList
	if (classes.contains('leaf')){
		fileMenu.popup({ window: elerem.getCurrentWindow() })
	}
	else if (e.target.closest('#editor')) {
		console.log(document.getSelection())
		if(document.getSelection().type === "Range"){
			textSelectionMenu.popup({ window: elerem.getCurrentWindow() })
		}
		else{
			textCursorMenu.popup({ window: elerem.getCurrentWindow() })
		}
	}
}, false)

window.addEventListener('dblclick', (e) => {
	if(e.target.tagName === 'A'){
		console.log('doubleclicked link: ', e.target)
	}
}, false)

/*================================================================================================================*/

function ClearInline(e){
	sel = document.getSelection()
	parent = sel.baseNode.parentElement
	if(parent.parentElement !== document.getElementById('editor')){
		parent = parent.parentElement
	}
	console.log(parent.innerText)
	parent.innerHTML = parent.innerText
}