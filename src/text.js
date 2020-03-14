const data = require('./data.js')
const selection = require('./selection.js')
const showdown = require('showdown')
showdown.setFlavor('github')
const converter = new showdown.Converter()
var timeout = null
const moveKeys = [
	'ArrowRight',
	'ArrowLeft',
	'PageUp',
	'PageDown',
	'Home',
	'End'
]
const ingoredKeys = [
	'Insert',
	'Control',
	'Shift',
	'Alt'
]
var editor = document.getElementById('editor')
var cursor = null
const inlineStyles = [
	{
		pattern: /\*\*(\w[\s|\w]+\w)\*\*/,
		markup: '**',
		css: 'mdbold'
	},
	{
		pattern: /\*(\w[\s|\w]+\w)\*/,
		markup: '*',
		css: 'mditalic'
	},
	{
		pattern: /\~\~(\w[\s|\w]+\w)\~\~/,
		markup: '~~',
		css: 'mdstrike'
	},
	{
		pattern: /\=\=(\w[\s|\w]+\w)\=\=/,
		markup: '==',
		css: 'mdmark'
	},
	{
		pattern: /\`(\w[\s|\w]+\w)\`/,
		markup: '`',
		css: 'mdcode'
	},
	{
		pattern: /\!\[(\w[\s|\w]+\w)\]\((.+)\)/,
		html: '<img src="$2" alt="$1" >',
		markup: '![$1]($2)',
		css: 'mdimage'
	},
	{
		pattern: /(?<!\!)\[(\w[\s|\w]+\w)\]\((.+)\)/,
		html: '<a data-link="$2">$1</a>',
		markup: '[$1]($2)',
		css: 'mdlink'
	}
]


function LoadMd(data){
	//console.log(arguments.callee.name)
	//document.getElementById('editor').innerHTML = converter.makeHtml(data)
	document.getElementById('editor').innerHTML = ''
	StartParseChain(data)
}
exports.LoadMd = LoadMd

function StartParseChain(data){
	// make a new fake block for each md line
	var lines = data.split('\n')
	lines.forEach(line => {
		NewFakeBlock(line)
	})
}

function NewFakeBlock(line){
	element = document.createElement('div')
	element.innerHTML = line
	element.classList.add('mdline')
	element.setAttribute("contentEditable", true)
	//element.onkeyup = KeyUp
	//element.onkeydown = KeyDown
	element.onmousedown = MouseDown
	document.getElementById('editor').appendChild(element)
	ContainerPhase(element)
}

function ContainerPhase(container){
	//console.log(arguments.callee.name, container)
	if (!container){
		console.error('MUST HAVE CONTAINER')
	}
	// need to strip .inlinehtml child elements here
	ihlist = container.querySelectorAll('.inlinehtml')
	//console.log(ihlist)
	ihlist.forEach(ih => {
		ih.remove()
	})
	// now that we've removed the inline html, reparse it all
	var data = container.textContent
	container.innerHTML = BlockPhase(data)

}

function BlockPhase(data){
	return InlinePhase(data)
}

function InlinePhase(data){
	inlineStyles.forEach(style => {
		var regex = new RegExp(style.pattern, 'gm')
		if ('html' in style){
			var rep = WrapInlineHtml(style.markup, style.html, style.css)
		}
		else {
			var rep = WrapInlineSpan(style.markup, style.css)
			
		}
		data = data.replace(regex, rep)
	})
	return data
}
function WrapInlineSpan(markup, cssclass){
	var el = ' <span class="'
	el += cssclass
	el += '">'
	el += '<span class="markup">'
	el += markup
	el += '</span>'
	el += '$1'
	el += '<span class="markup">'
	el += markup
	el += '</span>'
	el += '</span> '
	return el
}
function WrapInlineHtml(markup, html, cssclass){
	var el = '<span class="'
	el += cssclass
	el += '">'
	el += '<span class="inlinehtml">'
	el += html
	el += '</span>'
	el += '<span class="markup">'
	el += markup
	el += '</span>'
	el += '</span> '
	return el
}

function GetMd(){
	var md = converter.makeMarkdown(document.getElementById('editor').innerHTML)
	md = FilterMdOutput(md)
	console.log(md)
	return md
}
document.getElementById('savefile').onclick = function(){
	GetMd()
}

function KeyUp(e){
	e.stopPropagation()
	var line = selection.GetLineOfElement(selection.GetElementOfCursor())
	console.log('line', line)
	var ignoredKey = ingoredKeys.includes(e.key)
	var moveKey = moveKeys.includes(e.key)
	var modifierKey =
		e.ctrlKey ||
		e.altKey ||
		e.metaKey
	console.log('keyUp', e.key, ignoredKey, modifierKey)
	if( !ignoredKey && !modifierKey && !moveKey ){
		clearTimeout(timeout)
		timeout = setTimeout(ContainerPhase, 1000, line)
	}
}
editor.onkeyup = KeyUp

function KeyDown(e){
	console.log('keyDown')
	e.stopPropagation()
	MarkDirty()
	var moveKey = moveKeys.includes(e.key)
	if(moveKey){
		console.log(arguments.callee.name, e)
		ReparseThis()
	}
}
editor.onkeydown = KeyDown

function MouseDown(e){
	e.stopPropagation()
	ReparseLast(e.target)
	UpdateCaret(e.target)
}

function UpdateCaret(target){
	// reset all carets
	var carets = document.querySelectorAll('.caret')
	Array.from(carets).forEach((caret) => {
		caret.classList.remove('caret')
	})
	// set this caret
	var current = selection.GetLineOfElement(target)
	current.classList.add('caret')
}

function ReparseLast(current){
	var carets = document.querySelectorAll('.caret')
	Array.from(carets).forEach((caret) => {
		var line = selection.GetLineOfElement(caret)
		var currentline = selection.GetLineOfElement(current)
		if (line != currentline){
			ContainerPhase(line)
		}
	})
}

// todo refactor this to match UpdateCaret()
function ReparseThis(){
	// store selection
	var parent = selection.GetElementOfCursor()
	var el = parent
    var offset = selection.GetCaretCharacterOffsetWithin(el)
	// process mixed markdown
	//ParseMd(parent)
	container = parent.closest('.mdline')
	ContainerPhase(container)
	//restore selection
	selection.SetCaretPosition(el, offset)
}


/*
function ParseMd(parent){
	var text = parent.innerHTML
	// check if I should create a container
	var pat = /^>>>|^```|^[*-]\s(!?\[)|^[*-]\s|^\d\.\s|.\|./gm
	var ncre = new RegExp(pat)
	var cm = text.match(ncre)
	console.log(arguments.callee.name, cm)

	// check for 
	return parent
}*/

/*function FilterMdOutput(md){
	//console.log(arguments.callee.name)
	md = md.replace(/\n<!-- -->\n/g, '\n\n')
	md = md.replace(/\&nbsp\;/g, ' ')
	md = md.replace(/^- <input type="checkbox".+checked.+\n\n\s/gm, '\* [x] ')
	md = md.replace(/^- <input type="checkbox".+\n\n\s/gm, '\* [ ] ')
	md = CheckForLinks(md)
	return md
}*/

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
