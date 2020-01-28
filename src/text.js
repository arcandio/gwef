const showdown = require('showdown')
showdown.setFlavor('github')
const converter = new showdown.Converter()

function LoadAllBlocks(data){
	ed = document.getElementById("editor")
	ed.innerHTML = ''
	lines = data.split('\n')
	console.log(lines.length)
	ed.innerHTML = converter.makeHtml(data)
	/*lines.forEach(line => {
		h = ReplaceParagraph(line)
		ed.innerHTML += h
	})*/
}
window.LoadAllBlocks = LoadAllBlocks

function ReplaceParagraph(input, previous, container){
	// assume the text has arbitrary html,
	// and we're just here to clean it up
	html = converter.makeHtml(input)

	return html
}

function DetermineContainer(md){

}

function ReplaceInline(md){

	return md
}