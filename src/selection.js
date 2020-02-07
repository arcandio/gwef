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

function GetCaretCharacterOffsetWithin(element) {
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
	var sel = document.getSelection()
	parent = sel.baseNode.parentElement
	if(parent.parentElement !== document.getElementById('editor')){
		parent = parent.parentElement
	}
	return parent
}
export {GetCursorElement, SetCaretPosition, GetCaretCharacterOffsetWithin, ShrinkDcSelection}
//window.GetCursorElement = GetCursorElement
