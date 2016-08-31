function setCurrentState(playersHash, length) {
  var players = Object.keys(playersHash);
  createBoard(players, length);

  for (player in playersHash) {
    updatePlayerPosition(player, playersHash[player]);
  }
}

function updatePlayerPosition(playerName, position) {
  var stripName = '#' + playerName + '_strip';

  var $playerRow = $(stripName);
  $playerRow.children().removeClass("active");

  var stringToUpdate = ':nth-child(' + String(position + 1) + ')';
  $playerRow.children( stringToUpdate ).addClass("active");
}

function createBoard(playersArray, length) {
  var $table = $('table#racer_table');
  var rows = playersArray.length;

  $table.children().remove();

  for (var i=0; i<rows; i++) {
    $table.append( createRow(playersArray[i], length + 1) );
  }
}

function createRow(name, length) {
  returnString = "<tr id='" + name + "_strip'><td class='active'>" + name + "</td>"
  for (var j=0; j<(length-1); j++) {
    returnString = returnString + "<td></td>";
  }
  return returnString + "</tr>";
}