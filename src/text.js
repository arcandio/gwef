const data = require('./data.js');
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
	/*
	https://javascript.info/keyboard-events

	switch behavior based on what keys are pressed, and what modifiers are down at the time.

	e.ctrlKey
	e.shiftKey
	e.altKey
	e.metaKey
	e.repeat
	*/
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
		}, 2000)
	}
}
editor.onkeyup = RecieveKeys

function RebuildMd(){
	// store selection
	var parent = GetCursorElement()
	var el = parent
    var offset = getCaretCharacterOffsetWithin(el)
	// process mixed markdown
	var html = parent.innerHTML
	console.log(html)
	var md = converter.makeMarkdown(html)
	console.log(md)
	md = FilterMdOutput(md)
	html = converter.makeHtml(md)
	parent.innerHTML = html
	//restore selection
	SetCaretPosition(el, offset)
}

function FilterMdOutput(md){
	//console.log(arguments.callee.name)
	md = md.replace(/\n<!-- -->\n/g, '\n\n')
	md = md.replace(/\&nbsp\;/g, ' ')
	md = md.replace(/^- <input type="checkbox".+checked.+\n\n\s/gm, '\* [x] ')
	md = md.replace(/^- <input type="checkbox".+\n\n\s/gm, '\* [ ] ')
	return md
}

function ShrinkDcSelection(event){
	if(event.detail === 2){
		var sel = document.getSelection()
		var range = sel.getRangeAt(0)
		var text = range.toString()
		var trm = text.endsWith(" ")
		if(trm){
			range.setEnd(range.endContainer, range.endOffset - 1)
		}
	}
}
editor.onmouseup = ShrinkDcSelection

function MarkDirty(){
	//console.log(arguments.callee.name)
	data.SetTitle(true)
}

/*

selection stuff

=======================================================*/

function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

function SetCaretPosition(el, pos){
    // Loop through all child nodes
    for(var node of el.childNodes){
        if(node.nodeType == 3){ // we have a text node
            if(node.length >= pos){
                // finally add our range
                var range = document.createRange(),
                    sel = window.getSelection();
                range.setStart(node,pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1; // we are done
            }
            else{
                pos -= node.length;
            }
        }
        else{
            pos = SetCaretPosition(node,pos);
            if(pos == -1){
                return -1; // no need to finish the for loop
            }
        }
    }
    return pos; // needed because of recursion stuff
}

function GetCursorElement(){
	sel = document.getSelection()
	parent = sel.baseNode.parentElement
	if(parent.parentElement !== document.getElementById('editor')){
		parent = parent.parentElement
	}
	return parent
}
//window.GetCursorElement = GetCursorElement
