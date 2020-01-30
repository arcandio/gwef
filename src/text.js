const showdown = require('showdown')
showdown.setFlavor('github')
const converter = new showdown.Converter()

function LoadMd(data){
	document.getElementById('editor').innerHTML = converter.makeHtml(data)
}
window.LoadMd = LoadMd

function GetMd(){
	md = converter.makeMarkdown(document.getElementById('editor').innerHTML)
	md = FilterMdOutput(md)
	console.log(md)
	return md
}
document.getElementById('savefile').onclick = function(){
	GetMd()
}

function RecieveKeys(e){
	console.log(e.key)
	/*
	https://javascript.info/keyboard-events

	switch behavior based on what keys are pressed, and what modifiers are down at the time.

	e.ctrlKey
	e.shiftKey
	e.altKey
	e.metaKey
	e.repeat
	*/
	//https://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
	// store selection
	cursor = document.getSelection()
	console.log(cursor)
	node = cursor.anchorNode
	range = document.createRange()
	range.setStart(node, cursor.anchorOffset)
	range.collapse(true)
	// process mixed markdown
	parent = GetCursorElement()
	html = parent.innerHTML
	md = converter.makeHtml(html)
	html = converter.makeMarkdown(md)
	parent.innerHTML = html
	//restore selection
	cursor.removeAllRanges()
	cursor.addRange(range)
}
editor = document.getElementById('editor')
editor.onkeyup = editor.onkeypress = RecieveKeys

function FilterMdOutput(md){
	console.log('filtered')
	md = md.replace(/\n<!-- -->\n/g, '\n\n')
	md = md.replace(/^- <input type="checkbox".+checked.+\n\n\s/gm, '\* [x] ')
	md = md.replace(/^- <input type="checkbox".+\n\n\s/gm, '\* [ ] ')
	return md
}

function GetCursorElement(){
	sel = document.getSelection()
	parent = sel.baseNode.parentElement
	if(parent.parentElement !== document.getElementById('editor')){
		parent = parent.parentElement
	}
	return parent
}
window.GetCursorElement = GetCursorElement