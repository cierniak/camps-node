/**
 * @author Michal Cierniak
 */

var jade = require('jade')
  , fs = require('fs')
  , path = require('path');
  
var templatesJs = '';

function loadTemplatesFromDir(err, files, dirName, containerName) {
	var templatesList = [];
  files.forEach(function(fileName) {
    var parts = fileName.split('.');
    var name = parts[0];
		loadTemplate(path.join(dirName, fileName), name, containerName, templatesList, files.length);
	});
}

exports.loadTemplates = function(dirName, options) {
  console.log('Loading templates from ' + dirName);
  containerName = 'jadeTemplates';
  if (options && options.container) {
  	containerName = options.container;
  }
  fs.readdir(dirName, function(err, files) {
  	loadTemplatesFromDir(err, files, dirName, containerName);
  	});
}

function loadTemplate(fileName, name, containerName, templatesList, numTemplates) {
  //console.log('Reading template "' + name + '" from file: "' + fileName + '"');
  fs.readFile(fileName, 'utf8', function (err, data) {
    if (err) throw err;
    //console.log('file read: ' + data);
    var fn = jade.compile(data, {client: true, filename: fileName});
    var fnStr = fn.toString();
    var namedFnStr = fnStr.replace('function anonymous(', containerName + '.' + name + ' = function(');
    templatesList.push(namedFnStr);
   	if (templatesList.length >= numTemplates) {
   		var pre = 'var ' + containerName + ' = {};\n\n';
	    templatesJs = pre + templatesList.join(';\n\n');
	    console.log('All ' + numTemplates + ' templates loaded.');
	  }
  });
  
}

exports.serveTemplates = function(req, res) {
	res.setHeader('Content-Type', 'application/javascript');
  res.write(templatesJs);
  res.end();
}

