var playerName;

$(function() {
  $("#login-form").on("submit", setup)
})

function keyListener(event) {
  if (event.which == 192) {
    console.log("sending")
    socket.send(playerName);
  }
}

function setup() {
  event.preventDefault()
  console.log("setup called")

  playerName = $("#player-name").val();
  $(document).on('keyup', keyListener);
  $(this).hide();

  connect();
}

var socket;
var host;


function connect() {
  host = "ws://" + window.document.location.host + "/";
  try {
    socket = new WebSocket(host);

    socket.onopen = function() {
      addMessage("Socket Status: " + socket.readyState + " (open)");
      socket.send(playerName)
    }

    socket.onclose = function() {
      addMessage("Socket Status: " + socket.readyState + " (closed)");
    }

    socket.onmessage = function(msg) {
      msg_hash = $.parseJSON(msg.data)
      console.log(msg.data);
      setCurrentState(msg_hash["players_hash"], msg_hash["length"]);
    }
  } catch(exception) {
    addMessage("Error: " + exception);
  }
}

function addMessage(msg) {
  $("#chat-log").append("" + msg + "");
}