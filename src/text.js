const showdown = require('showdown')
showdown.setFlavor('github')
const converter = new showdown.Converter()

const r = {
	heading1: {
		re: new RegExp(/^#\s+\S+/),
		blocktype: 'h1',
		containertype: null
	}
}

const allregexes = {
	blank: "^$",
	heading1: "^#\\s+.+",
	heading2: "^##\\s+.+",
	heading3: "^###\\s+.+",
	heading4: "^####\\s+.+",
	heading5: "^#####\\s+.+",
	heading6: "^######\\s+.+",
	checkbox: "^[\\*|\\-]\\s+\\[\\s?\\].+",
	bullet: "^[\\*|\\-]\\s.+",
	numbered: "^\\d\\.\\s.+",
	paragraph: "."
}
rl = ""
for (let key in allregexes){
	rl += "("
	rl += allregexes[key]
	rl += ")|"
}
rl = new RegExp(rl.slice(0,-1))

function LoadAllBlocks(data){
	ed = document.getElementById("editor")
	ed.innerHTML = ''
	lines = data.split('\n')
	console.log(lines.length)
	//ed.innerHTML = converter.makeHtml(data)
	lines.forEach(line => {
		div = document.createElement('div')
		div.setAttribute('data-md', line)
		ed.appendChild(div)
		DetermineContainer(div)
		ParseMd(div)
	})
}
window.LoadAllBlocks = LoadAllBlocks

function DetermineContainer(div){
	previousElement = div.previousElementSibling
	//console.log(previousElement)
	md = div.getAttribute('data-md')
	containertype = null
	matches = [...md.matchAll(rl)]
	index = GetIndex(matches)
	blocktype = Object.keys(allregexes)[index]
	console.log(blocktype)
	div.setAttribute('data-blocktype', blocktype)
	div.setAttribute('data-containertype', containertype)
}

function GetIndex(array){
	//console.log(array)
	if (!array || array.length === 0){
		return null
	}
	//always skip first one
	array = array[0].slice(1)
	for (i = 0; i < array.length; i++){
		if (array[i] !== undefined){
			return i
		}
	}
}

function ParseMd(div){
	md = div.getAttribute('data-md')
	html = converter.makeHtml(md)
	div.innerHTML = md
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
