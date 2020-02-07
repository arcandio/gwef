const data = require('./data.js')
const selection = require('./selection.js')
const showdown = require('showdown')
showdown.setFlavor('github')
const converter = new showdown.Converter()
var timeout = null
const ingoredKeys = [
	'ArrowRight',
	'ArrowLeft',
	//'ArrowUp',
	//'ArrowDown',
	'Home',
	'End',
	'Insert',
	'Control',
	'Shift',
	'Alt'
]
var editor = document.getElementById('editor')

function LoadMd(data){
	//console.log(arguments.callee.name)
	document.getElementById('editor').innerHTML = converter.makeHtml(data)
}
exports.LoadMd = LoadMd

function GetMd(){
	var md = converter.makeMarkdown(document.getElementById('editor').innerHTML)
	md = FilterMdOutput(md)
	console.log(md)
	return md
}
document.getElementById('savefile').onclick = function(){
	GetMd()
}

function RecieveKeys(e){
	// https://javascript.info/keyboard-events
	var ignoredKey = ingoredKeys.includes(e.key)
	var modifierKey =
		e.ctrlKey ||
		e.altKey ||
		e.metaKey
	//console.log('key', e.key, ignoredKey, modifierKey)
	if( !ignoredKey && !modifierKey ){
		MarkDirty()
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			console.log(arguments.callee.name, 'rebuild md')
			RebuildMd()
		}, 1000)
	}
}
editor.onkeyup = RecieveKeys

function RebuildMd(){
	// store selection
	var parent = selection.GetCursorElement()
	var el = parent
    var offset = selection.GetCaretCharacterOffsetWithin(el)
	// process mixed markdown
	var html = parent.innerHTML
	console.log(html)
	var md = converter.makeMarkdown(html)
	console.log(md)
	md = FilterMdOutput(md)
	html = converter.makeHtml(md)
	parent.innerHTML = html
	//restore selection
	selection.SetCaretPosition(el, offset)
}

function FilterMdOutput(md){
	//console.log(arguments.callee.name)
	md = md.replace(/\n<!-- -->\n/g, '\n\n')
	md = md.replace(/\&nbsp\;/g, ' ')
	md = md.replace(/^- <input type="checkbox".+checked.+\n\n\s/gm, '\* [x] ')
	md = md.replace(/^- <input type="checkbox".+\n\n\s/gm, '\* [ ] ')
	md = CheckForLinks(md)
	return md
}

function CheckForLinks(md){
	let names = Object.keys(data.namesInProject)
	for (var i = 0; i < names.length; i++){
		let name = names[i]
		let s = '(?<!\\[|\\\\)' + name + "(?!\\]|\\\\.)"
		console.log(s)
		let rex = new RegExp(s, 'gm')
		console.log(rex)
		let rep = '\[$&\]\(' + data.namesInProject[name] + '\)'
		md = md.replace(rex, rep)
		console.log(md)
	}
	return md
}

function MarkDirty(){
	//console.log(arguments.callee.name)
	data.SetTitle(true)
}
