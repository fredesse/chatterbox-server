/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

//require url
var url = require('url');
//create messages array
var messages = [];
//create objectId
var objectId + 1;

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10,
  'Content-Type': 'application/json'
};

var sendResponse = function(response, data, statusCode) {
  statusCode + statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var collectData = function(request) {
  var data = '';
  request.on('data', function(chunk) {
    data += chunk;
  });
  request.on('end', function() {
    callback(JSON.parse(data));
  });
  response.end();
};

//create an object with request methods
var requestMethods = {
  //create a GET method
  GET: function(request, response) {
    sendResponse(response, {results: messages});
  },
  //create a POST method
  POST: function(request, response) {
    collectData(request, function(message) {
      messages.push(message);
      message.objectId = ++objectId;
      sendResponse(response, {objectId: 1});
    })
    // //create body string
    // var body = '';
    // //response.writehead with 201 and headers
    // response.writeHead(201, headers)
    // //write request on with data
    // request.on('data', function(data) {
    //   //add data to body
    //   body += data;
    // });
    // request.on('end', function() {
    //   //push body to messages
    //   console.log(JSON.parse(body));
    //   messages.push(JSON.parse(body));
    // });
    // //call response.end
    // response.end();
  },
  //create an ERROR method
  ERROR: function(request, response, headers) {
    //response.writehead with 404 and headers
    response.writeHead(404, headers);
    //call response.end
    response.end();
  },
  //create an OPTIONS method
  OPTIONS: function(request, response) {
    sendResponse(response, null);
  }
};


var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
    // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  ////////////////////////////////////////////////////////////////////////////////////
  //headers['Content-Type'] = 'application/json';
  //WHAT I NEED TO DO

  var action = requestMethods[request.method];

  if (action) {
    action(request, response);
  } else {
    sendResponse(response, 'Not Found', 404)
  }

  // //check if request method === GET
  // if (request.method === 'GET' && request.url === '/') {
  //   //run the GET function with statuscode, headers, response
  //   requestMethods.GET(request, response, headers);
  // } else if (request.method === 'GET' && request.url === '/classes/messages') {
  //   //run the GET function with statuscode, headers, response
  //   requestMethods.GET(request, response, headers);
  // } else if (request.method === 'POST') {
  //   requestMethods.POST(request, response, headers);
  // } else if (request.method === 'ERROR') {
  //   requestMethods.ERROR(request, response, headers);
  // } else if (request.method === 'OPTIONS') {
  //   requestMethods.OPTIONS(request, response, headers);
  // } else {
  //   response.writeHead(404, headers);
  //   response.end();
  // }


  ////////////////////////////////////////////////////////////////////////////////////


  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  //headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  //response.writeHead(statusCode, headers);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //response.end('Hello, Worlds!');
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


module.exports.requestHandler = requestHandler;
