// YOUR CODE HERE:
var app = {
  //server: 'http://parse.hrr.hackreactor.com/chatterbox/classes/messages',
  server: 'http://127.0.0.1:3000/classes/messages',
  text: 'string',
  username: 'default',
  roomname: 'lobby',
  messages: [],
  lastMessageId: 0,
  friends: {}
};

app.init = function() {

  app.username = window.location.search.slice(10);

  app.$message = $('#message');
  app.$chats = $('#chats');
  app.$roomSelect = $('#roomSelect');
  app.$send = $('#send');

  app.fetch();
  //Add listeners
  app.$send.on('submit', app.handleSubmit);
  app.$roomSelect.on('change', app.handleRoomChange);
  app.$chats.on('click', '.username', app.handleUsernameClick);

  // setInterval(function() {
  //   app.fetch();
  // }, 3000);
  app.fetch();

};

// AJAX REQUESTS

app.fetch = function() {
  $.ajax({
    url: app.server,
    type: 'GET',
    data: {
      order: '-createdAt',
      limit: 30
    },
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message received');
      if (!data.results || !data.results.length) { return; }

      app.messages = data.results;
      var mostRecentMessage = app.messages[app.messages.length - 1];

      if (mostRecentMessage.objectId !== app.lastMessageId) {
        app.renderRoomList(app.messages);
        app.renderMessages(app.messages);
      }
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive the message', data);
    }
  });
};

app.send = function(obj) {
  $.ajax({
    url: app.server,
    type: 'POST',
    data: JSON.stringify(obj),
    contentType: 'application/json',
    success: function (data) {
      app.$message.val('');
      app.fetch();
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};



// MESSAGE RENDERING

app.renderMessages = function(messages) {
  app.clearMessages();

  messages
    .filter(function(message) {
      if (app.roomname === 'lobby' && !message.roomname) {
        return true;
      } else if (message.roomname === app.roomname) {
        return true;
      } else {
        return false;
      }
    })
    .forEach(app.renderMessage);
};

app.renderMessage = function (message) {
  var $chat = $('<div class="chat"/>');

  var $username = $('<span class="username"/>');
  $username.text(message.username + ': ')
    .attr('data-username', message.username)
    .appendTo($chat);

  var $message = $('<br><span/>');
  $message.text(message.text).appendTo($chat);

  app.$chats.append($chat);
};



app.clearMessages = function() {
  $('#chats').empty();
};

// HANDLE EVENTS

app.handleUsernameClick = function(event) {
  console.log('Username clicked');
  var username = $(event.target).data('username');

  if (username !== undefined) {
    app.friends[username] = !app.friends[username];

    var selector = '[data-username="' + username.replace(/"/g, '\\\"' + '"]');
    var $usernames = $(selector).toggleClass('friend');
  }
};

app.handleRoomChange = function(event) {
  console.log('This start handleRoomChange');
  var selectedIndex = app.$roomSelect.prop('selectedIndex');
  if (selectedIndex === 0) {
    var roomname = prompt('Enter new room name: ');

    if (roomname) {
      app.roomname = roomname;
      app.renderRoom(roomname);
      app.$roomSelect.val(roomname);
    }
  } else {
    app.roomname = app.$roomSelect.val();
  }

  app.renderMessages(app.messages);
};

app.handleSubmit = function(event) {
  console.log('Submit button pushed');
  var message = {
    username: app.username,
    text: app.$message.val(),
    roomname: app.roomname || 'lobby'
  };

  app.send(message);

  event.preventDefault();
};

// ROOM METHODS

app.renderRoomList = function(messages) {
  if (messages) {
    var rooms = {};
    messages.forEach(function(message) {
      var roomname = message.roomname;
      if (roomname && !rooms[roomname]) {
        app.renderRoom(roomname);

        rooms[roomname] = true;
      }
    });
  }
  app.$roomSelect.val(app.roomname);
};

app.renderRoom = function(roomname) {
  var $option = $('<option/>').val(roomname).text(roomname);

  app.$roomSelect.append($option);
};

//escape html, meaning turn inserted messages into safe strings
// var entityMap = {
//   '&': '&amp;',
//   '<': '&lt;',
//   '>': '&gt;',
//   '"': '&quot;',
//   "'": '&#39;',
//   '/': '&#x2F;',
//   '`': '&#x60;',
//   '=': '&#x3D;'
// };

// function escapeHTML(string) {
//   return String(string).replace(/[&<>"'`=\/]/g, function (s) {
//     return entityMap[s];
//   });
// }










