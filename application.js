function setCurrentState(playersHash, length) {
  var players = Object.keys(playersHash);
  createBoard(players, length);

  for (player in playersHash) {
    updatePlayerPosition(player, playersHash[player]);
  }

}
// function incrementPlayerPosition(playerName) {
//   var pos = getPlayerPosition(playerName);
//   updatePlayerPosition(playerName, pos + 1);
// }

// function getPlayerPosition(playerName) {
//   var stripName = '#' + playerName + '_strip';

//   return $(stripName).children(".active").index() + 1
// }

function updatePlayerPosition(playerName, position) {
  var stripName = '#' + playerName + '_strip';

  var $playerRow = $(stripName);
  $playerRow.children().removeClass("active");

  var stringToUpdate = ':nth-child(' + String(position) + ')';
  $playerRow.children( stringToUpdate ).addClass("active");
}

function createBoard(playersArray, length) {
  var $table = $('table#racer_table');
  var rows = playersArray.length;

  $table.children().remove();

  for (var i=0; i<rows; i++) {
    $table.append( createRow(playersArray[i], length) );
    $table.children().last().addClass( "key_" + String( i + 1 ) );
  }
}

function createRow(name, length) {
  returnString = "<tr id='" + name + "_strip'><td class='active'></td>"
  for (var j=0; j<(length-1); j++) {
    returnString = returnString + "<td></td>";
  }
  return returnString + "</tr>";
}

// function finished(player) {
//   return getPlayerPosition(player) === getLength(player)
// }

// function getLength(player) {
//   var stripName = '#' + player + '_strip';
//   return $(stripName).children().last().index() + 1
// }



function keyListener(event) {
  var number = event.which - 48;
  console.log(number);
  var $row = $( ".key_" + String(number) );
  console.log($row)
  if ($row.length > 0) {
    var name = $row.attr("id").replace("_strip", "");
    console.log(name);
    incrementPlayerPosition(name);
    if (finished(name)) {
      $(document).off('keyup');
      $('body').append('<h1>' + name + ' wins!</h1>');
      $('body').append('<button id="restart">Restart</button>');
      $('#restart').on("click", function() {
        createBoard(["greg", "leul", "alex"], 10);
        $('#restart').off("click");
        $('#restart, h1').remove();
        $(document).on('keyup', keyListener);
      })

    }
  }
}

function addMessage(msg) {
  $("#chat-log").append("" + msg + "");
}

var socket;
var host;

host = "ws://localhost:8080";

function connect() {
  try {
    socket = new WebSocket(host);

    addMessage("Socket State: " + socket.readyState);

    socket.onopen = function() {
      addMessage("Socket Status: " + socket.readyState + " (open)");
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

function send() {
  var text = $("#message").val();
  if (text == '') {
    addMessage("Please Enter a Message");
    return;
  }

  try {
    socket.send(text);
    addMessage("Sent: " + text)
  } catch(exception) {
    addMessage("Failed To Send")
  }

  $("#message").val('');
}

$('#message').keypress(function(event) {
  if (event.keyCode == '13') { send(); }
});

$("#disconnect").click(function() {
  socket.close()
});

$(function() {
  createBoard(["greg", "leul", "alex"], 10);

  $(document).on('keyup', keyListener);

  connect();

  $('#message').on("keypress", function(event) {
    if (event.keyCode == '13') { send(); }
  });

  $("#disconnect").on("click", function() {
    socket.close()
  });
})






