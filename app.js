var whoWentFirst = "player";
var currentPlayer = "player";
var playerSymbol = "X";
var computerSymbol = "O";
var turnsLeft = 9;
var board = ["E", "E", "E",
             "E", "E", "E", 
             "E", "E", "E"];

function playerClick(button) {
  if (board[button] === "E" && currentPlayer == "player") {
    board[button] = playerSymbol;
    turnsLeft--;
    updateBoard();
    if (win(board) === playerSymbol) {
      playerWin();
      return;
    }
    if (tie()) {
      tieWin();
      return;
    }
    computerTurn();
  }
}

function computerTurn() {
  currentPlayer = "computer";
  //minimax make a move, then return control to player
  minimax();
  updateBoard();
  if (win(board) === computerSymbol) {
    computerWin();
    return;
  }
  if (tie()) {
    tieWin();
    return;
  }
  turnsLeft--;
  currentPlayer = "player";
}

function tie() {
  var numEmpty = 0;
  for (var i = 0; i < board.length; i++) {
    if (board[i] === "E") {
      numEmpty++;
    }
  }
  if (numEmpty === 0) {
    return true;
  }
  return false;
}

function minimax() {
  var move;
  mmRecursive(board, "X", 0);
  board[move] = computerSymbol;

  function mmRecursive(tempBoard, tempPlayer, currentDepth) {
    if (win(tempBoard) === computerSymbol) {
      return 10-currentDepth;
    } else if (win(tempBoard) === playerSymbol) {
      return currentDepth-10;
    }

    var moves = [];
    var scores = [];

    // change player
    if (tempPlayer === "X") {
      tempPlayer = "O";
    } else {
      tempPlayer = "X";
    }

    // find all empty board states and fill 
    // them with current tempPlayer, then
    // use the results to make array of scores
    for (var i = 0; i < tempBoard.length; i++) {
      var newBoard = tempBoard.slice();
      if (newBoard[i] === "E") {
        newBoard[i] = tempPlayer;
        moves.push(i);
        scores.push(mmRecursive(newBoard, tempPlayer, currentDepth+1));
      } 
    }   

    // actual turn computer takes
    if (currentDepth === 0) {
      move = moves[scores.indexOf(Math.max.apply(null, scores))];
    } else {
      // reached a draw state
      if (moves.length === 0) {
        return 0;
      }

      if (tempPlayer === computerSymbol) {
        return Math.max.apply(Math, scores);
      } else {
        return Math.min.apply(Math, scores);
      }
      
    }

  }
}

function tieWin() {
  alert("tie!");
  board = ["E", "E", "E",
           "E", "E", "E", 
           "E", "E", "E"];
  if (whoWentFirst === "player") {
    whoWentFirst = "computer)";
    currentPlayer = "computer";
    board[Math.floor(Math.random()*9)] = computerSymbol;
  } else {
    whoWentFirst = "player";
  }
  currentPlayer = "player";
  updateBoard();
}

function computerWin() {
  alert("computer won");
  board = ["E", "E", "E",
           "E", "E", "E", 
           "E", "E", "E"];
  if (whoWentFirst === "player") {
    whoWentFirst = "computer)";
    currentPlayer = "computer";
    board[Math.floor(Math.random()*9)] = computerSymbol;
  } else {
    whoWentFirst = "player";
  }
  currentPlayer = "player";
  updateBoard();
}

function playerWin() {
  alert("you win");
  board = ["E", "E", "E",
           "E", "E", "E", 
           "E", "E", "E"];
  if (whoWentFirst === "player") {
    whoWentFirst = "computer)";
    currentPlayer = "computer";
    board[Math.floor(Math.random()*9)] = computerSymbol;
  } else {
    whoWentFirst = "player";
  }
  currentPlayer = "player";
  updateBoard();
}

function updateBoard () {
  $(".place").each(function(i) {
    if (board[i] === "X") {
      $(this).removeClass("e");
      $(this).removeClass("o");
      $(this).addClass("x");
    } else if (board[i] === "O") {
      $(this).removeClass("e");
      $(this).removeClass("x");
      $(this).addClass("o");
    } else {
      $(this).removeClass("o");
      $(this).removeClass("x");
      $(this).addClass("e");
    }
    //$(this).text((board[i] === "E" ? "" : board[i]));
  });
}

function win(testBoard) {
  var winStates = [[0,1,2], [3,4,5], [6,7,8],
                   [0,3,6], [1,4,7], [2,5,8],
                   [0,4,8], [2,4,6]];
  var winner;

  for (var i = 0; i < winStates.length; i++) {
    winner = check(testBoard, winStates[i][0], winStates[i][1], winStates[i][2]);
    if (winner !== "E"){
      return winner;
    }
  }

  return winner;
}

function check(testBoard, place1, place2, place3) {
  if (testBoard[place1] !== "E" && testBoard[place1] === testBoard[place2] && testBoard[place1] === testBoard[place3]){
    return testBoard[place1];
  } else {
    return "E";
  }
}

// board[Math.floor(Math.random()*9)] = computerSymbol;
updateBoard();

$("#button0").click(function(){playerClick(0);});
$("#button1").click(function(){playerClick(1);});
$("#button2").click(function(){playerClick(2);});
$("#button3").click(function(){playerClick(3);});
$("#button4").click(function(){playerClick(4);});
$("#button5").click(function(){playerClick(5);});
$("#button6").click(function(){playerClick(6);});
$("#button7").click(function(){playerClick(7);});
$("#button8").click(function(){playerClick(8);});
