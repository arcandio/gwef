const showdown = require('showdown')
showdown.setFlavor('github')
const converter = new showdown.Converter()

function LoadAllBlocks(data){
	ed = document.getElementById("editor")
	ed.innerHTML = ''
	lines = data.split('\n')
	console.log(lines.length)
	//ed.innerHTML = converter.makeHtml(data)
	lines.forEach(line => {
		div = document.createElement('div')
		mb = new MdBlock(line, div)
		console.log(mb)
		div.setAttribute('data-mdblock', mb)
		ed.appendChild(div)
		b = div.getAttribute('data-mdblock')
		console.log(b)
		b.refresh()
		/*
		h = ReplaceParagraph(line)
		ed.innerHTML += h*/
	})
}
window.LoadAllBlocks = LoadAllBlocks

function ReplaceParagraph(input, previous, container){
	// assume the text has arbitrary html,
	// and we're just here to clean it up
	html = converter.makeHtml(input)
	return html
}


/* todo: refactor

this should not use a class instance for each block, because I don't want to have to store a parallel array of these to the dom.

instead, move the constructor vars to the div's data attributes, and do all work from global, when passed an event from a bound block.

capture an event on keypress.
* ctrl: commands. pass elsewhere for custom js functions
* return: process new line. create new blank line in container, if in a container. if last container line was blank, break out of container.
* arrow: move cursor. possibly no change?
* characters: pass into the html, but also pass them into the model.

<div data-model="some md">
	html
</div>

calculating changes to md

newText - oldMd.toHtml() = remainderMd

*/

class MdBlock{
	constructor(model, div){
		this.model = model
		this.div = div
		this.view = model
		div.innerHTML = model
	}
	refresh() {
		div.innerHTML = converter.makeHtml(this.model)
	}
	combine(){
		/*
		* check to see what type I should be
		* check previous block to see if I should get in their container
		*/
	}
}