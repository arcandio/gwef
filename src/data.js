var elerem = require('electron').remote;
var dialog = elerem.dialog;
var app = elerem.app;

var http = require('http');
var fs = require('graceful-fs');
var path = require('path');

const text = require('./text.js');
const dirTree = require("directory-tree");
var tree = null;
//var projectdir = null;
var projectdir = "F:\\freelance\\repos\\gwef\\ExampleProject";
const storage = require('electron-json-storage');
const defaultDataPath = storage.getDefaultDataPath()
var openfile = null
var namesInProject = {}

document.getElementById("loadproject").onclick = function(){OpenProject()}

function InitialOpen(){
	//console.log(arguments.callee.name)
	storage.getAll(function(error, data) {
		//console.log('io fired')
		if (error) throw error;
		//console.log(data)
		if(data){
			var lp = data["lastProject"]
			if(lp){
				projectdir = lp
				BuildTree()
				var lf = data["lastFile"]
				if(lf){
					FileSummoned(lf)
				}
			}
		}
	})
}


function OpenProject(){
	var options = {properties:["openDirectory", 'multiSelections']}
	var newpath = dialog.showOpenDialogSync(window.main, options)
	//console.log(newpath)
	projectdir = newpath[0]
	BuildTree()
	// remember our last open project
	storage.set('lastProject', projectdir, function(error) {if (error) throw error;})
}

function BuildTree(){
	tree = dirTree(projectdir, {extensions: /\.(md|jpg|png)$/})
	namesInProject = {}
	//console.log(tree)
	if (tree){
		//console.log(tree)
		var tv = document.getElementById("treeview")
		var ul = tv.getElementsByTagName('ul')[0]
		while (ul.firstChild){
			ul.removeChild(ul.firstChild)
		}
		ListDir(tree, ul)
		//tv.replaceChild(t, tv.getElementsByTagName('ul')[0])
	}
	else {
		console.error('did not find the directory:', projectdir)
	}
	//console.log(namesInProject)
}

function ListDir(obj, parent){
	obj.children.forEach(function(element){
		var name = element.name
		var li = document.createElement('li')
		var x = element.extension || ''
		var span = document.createElement('span')
		var nameonly = name.replace(x, '')
		span.innerHTML = nameonly
		span.classList.add('leaf')
		li.appendChild(span)
		parent.appendChild(li)
		li.setAttribute('data-path', element.path)
		li.setAttribute('data-type', x)
		if (element.type === "directory"){
			// bind function
			span.onclick = function(){FolderClicked(event)}
			// process children
			var ul = document.createElement('ul')
			li.appendChild(ul)
			ListDir(element, ul)
		}
		else {
			// bind function
			span.onclick = function(){FileClicked(event)}
			li.classList.add('file')
			namesInProject[nameonly] = element.path
		}
	})
}

function FolderClicked(e){
	e.stopPropagation()
	parent = e.target.parentElement
	console.log(arguments.callee.name, parent)
	parent.classList.toggle('collapsed')
}

function FileClicked(e){
	e.stopPropagation()
	parent = e.target.parentElement
	var p = parent.getAttribute('data-path')
	FileSummoned(p)
}

function FileSummoned(p){
	//console.log(arguments.callee.name, p)
	OpenFileType(p)
	HighlightOpenedFile(p)
}

function HighlightOpenedFile(p){
	var o = document.getElementsByClassName('open')
	Array.from(o).forEach(element => {element.classList.remove('open')})
	var files = document.getElementsByClassName('file')
	Array.from(files).forEach((file) => {
		var treepath = file.dataset.path
		//console.log(treepath)
		if(treepath == p){
			file.classList.add('open')
		}	
	})
}

function OpenFileType(p){
	var parseObject = path.parse(p)
	openfile = parseObject.name
	var ext = parseObject.ext
	SetTitle(false)
	storage.set('lastFile', p, function(error) {if (error) throw error;})
	switch(ext){
		case '.md':
			//console.log('document')
			OpenDocument(p)
			break;
		case '.jpg':
		case '.png':
			//console.log('image')
			OpenImage(p);
			break;
		default:
			console.error('wrong type of file')
			break;
	}
}

function SetTitle(dirty){
	dirty = dirty ? " ⚠" : ""
	document.title = "GWEF - " + openfile + dirty
}
//exports.SetTitle = SetTitle


function OpenDocument(p){
	//console.log(arguments.callee.name, p)
	fs.readFile(p, 'utf8', (err, data) => {
		if (err) {console.error(err)}
		text.LoadMd(data)
	})
}

function OpenImage(p){
	fs.readFile(p, (err, data) => {
		if (err) {console.error(err)}
		var payload = 'data:image/png;base64,' + data.toString('base64')
		var img = document.createElement('img')
		img.src = payload
		document.getElementById("editor").innerHTML = ''
		document.getElementById("editor").appendChild(img)
	})
}

InitialOpen()

export {namesInProject, SetTitle}
