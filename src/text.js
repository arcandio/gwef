const showdown = require('showdown')
showdown.setFlavor('github')
const converter = new showdown.Converter()

function LoadMd(data){
	document.getElementById('editor').innerHTML = converter.makeHtml(data)
}
window.LoadMd = LoadMd

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
	console.log('key', e.key)
	/*
	https://javascript.info/keyboard-events

	switch behavior based on what keys are pressed, and what modifiers are down at the time.

	e.ctrlKey
	e.shiftKey
	e.altKey
	e.metaKey
	e.repeat
	*/
	RebuildMd()
}
var editor = document.getElementById('editor')
editor.onkeyup = RecieveKeys

function RebuildMd(){
	// store selection
	parent = GetCursorElement()
	var el = parent
    var offset = getCaretCharacterOffsetWithin(el)
	// process mixed markdown
	html = parent.innerHTML
	md = converter.makeMarkdown(html)
	md = FilterMdOutput(md)
	html = converter.makeHtml(md)
	parent.innerHTML = html
	//restore selection
	SetCaretPosition(el, offset)
}

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

/*
function CreateRange(node, chars, range){
	if(!range){
		range = document.createRange()
		range.selectNode(node)
		range.setStart(node, 0)
	}
	if (chars.count === 0){
		range.setEnd(node, chars.count)
	}
	else if (node && chars.count > 0) {
		if (node.nodeType === Node.TEXT_NODE) {
			chars.count -= node.textContent.length
		}
		else {
			console.log('range', range)
			range.setEnd(node, chars.count)
			chars.count = 0
		}
	}
	else {
		for (let lp = 0; lp < node.childNodes.length; lp++) {
			range = CreateRange(node.childNodes[lp], chars, range)
			if (chars.count === 0){
				break
			}
		}
	}
	return range
}

function SetCurrentCursorPosition(chars, parent){
	if (chars >= 0){
		var selection = window.getSelection()
		range = CreateRange(parent, {count: chars})
		if (range){
			range.collapse(false)
			selection.removeAllRanges()
			selection.addRange(range)
		}
	}
}
*/