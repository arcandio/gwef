var elerem = require('electron').remote;
var dialog = elerem.dialog;
var app = elerem.app;

var http = require('http');
var fs = require('graceful-fs');
var path = require('path');

const text = require('./text.js')
const dirTree = require("directory-tree")

document.getElementById("loadproject").onclick = function(){BuildTree()}

BuildTree()

function BuildTree(){
	const tree = dirTree('F:/freelance/repos/gwe/electronforge test/eftest/gwef/gwef/test project', {extensions: /\.(md|jpg|png)$/})
	//console.log(tree)
	tv = document.getElementById("treeview")
	ul = tv.getElementsByTagName('ul')[0]
	while (ul.firstChild){
		ul.removeChild(ul.firstChild)
	}
	ListDir(tree, ul)
	//tv.replaceChild(t, tv.getElementsByTagName('ul')[0])
}

function ListDir(obj, parent){
	obj.children.forEach(function(element){
		name = element.name
		li = document.createElement('li')
		x = element.extension || ''
		span = document.createElement('span')
		span.innerHTML = name.replace(x, '')
		span.classList.add('leaf')
		li.appendChild(span)
		parent.appendChild(li)
		li.setAttribute('data-path', element.path)
		li.setAttribute('data-type', x)
		if (element.type === "directory"){
			// bind function
			span.onclick = function(){FolderClicked(event)}
			// process children
			ul = document.createElement('ul')
			li.appendChild(ul)
			ListDir(element, ul)
		}
		else {
			// bind function
			span.onclick = function(){FileClicked(event)}
		}
	})
}

function FolderClicked(e){
	e.stopPropagation()
	parent = e.target.parentElement
	console.log('toggle folder', parent)
	parent.classList.toggle('collapsed')
}

function FileClicked(e){
	e.stopPropagation()
	parent = e.target.parentElement
	p = parent.getAttribute('data-path')
	ext = parent.getAttribute('data-type')
	console.log('open file', p)
	OpenFileType(p, ext)
	//set file highlight
	o = document.getElementsByClassName('open')
	Array.from(o).forEach(element => {element.classList.remove('open')})
	parent.classList.add('open')
}

function OpenFileType(p, ext){
	filename = path.parse(p).name
	document.getElementById("pagename").innerHTML = filename
	document.title = "GWEF - " + filename
	switch(ext){
		case '.md':
			console.log('document')
			OpenDocument(p)
			break;
		case '.jpg':
		case '.png':
			console.log('image')
			OpenImage(p);
			break;
		default:
			console.error('wrong type of file')
			break;
	}
}

function OpenDocument(p){
	c = fs.readFile(p, 'utf8', (err, data) => {
		if (err) {console.error(err)}
		window.LoadAllBlocks(data)
	})
}

function OpenImage(p){
	b64 = fs.readFile(p, (err, data) => {
		if (err) {console.error(err)}
		payload = 'data:image/png;base64,' + data.toString('base64')
		img = document.createElement('img')
		img.src = payload
		document.getElementById("editor").innerHTML = ''
		document.getElementById("editor").appendChild(img)
	})
}