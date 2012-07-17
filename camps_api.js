/**
 * @author Michal Cierniak
 */

var camps = {};
camps['ymca'] = {id: 'ymca', name: 'YMCA'};
camps['edmo'] = {id: 'edmo', name: 'Edmo'};
camps['galileo'] = {id: 'galileo', name: 'Galileo'};


function campGet(req, res) {
  console.log('GET API request');
  var result;
  var id = req.params.id;
  if(id) {
    console.log('id: ' + id);
    var camp = camps[id];
    if (camp) {
    	result = camp;
    } else {
    	result = {};
    }
  } else {
  	var campsList = [];
  	for (key in camps) {
  		var camp = camps[key];
  		campsList.push(camp);
   	}
  	result = campsList;
  }
  console.log('result: ' + JSON.stringify(result));
  res.json(result);
};


function payloadHandlerData(chunk) {
  console.log('chunk: ' + chunk);	
}

function payloadHandlerEnd() {
  console.log('payloadHandlerEnd');	
}

function campPut(req, res) {
  req.addListener('data', payloadHandlerData);
  req.addListener('end', payloadHandlerEnd);
  console.log('PUT API request, url: ' + req.url);
  var result = {};
  var id = req.params.id;
  if(id) {
    console.log('id: ' + id);
    var camp = camps[id];
    if (camp) {
      console.log('old value of camp: ' + JSON.stringify(camp));
      console.log('new value of camp: ' + JSON.stringify(req.body));
      camps[id] = req.body;
    } else {
      console.log('No camp with id: ' + id);
      // TODO: Should we return an HTTP error in this case?
    }
  }
  console.log('result: ' + JSON.stringify(result));
  res.json(result);
}

function campPost(req, res) {
  console.log('POST API request, url: ' + req.url);
  var camp = req.body;
  console.log('new camp: ' + JSON.stringify(camp));
  if (camp.id) {
    console.log('Error. Id non-null: ' + camp.id);  	
  } else {
    console.log('Assigning new id: ');  	  	
  }
  var result = {};
  console.log('result: ' + JSON.stringify(result));
  res.json(result);
}

function campDelete(req, res) {
  console.log('DELETE API request, url: ' + req.url);
  var result = {};
  var id = req.params.id;
  if(id) {
    console.log('id: ' + id);
    var camp = camps[id];
    if (camp) {
      console.log('Deleting camp: ' + JSON.stringify(camp));
      delete camps[id];
    } else {
      console.log('No camp with id: ' + id);    	
    }
  }
  console.log('result: ' + JSON.stringify(result));
  res.json(result);
}

exports.api_all = function(req, res, next) {
	var method = req.method;
  console.log('API request, method: ' + method + ', url: ' + req.url);
  req.setEncoding('utf8');
  if (method == 'GET') {
  	campGet(req, res);
  } else if (method == 'PUT') {
  	campPut(req, res);
  } else if (method == 'POST') {
  	campPost(req, res);
  } else if (method == 'DELETE') {
  	campDelete(req, res);
  } else {
    next();
  }
};

