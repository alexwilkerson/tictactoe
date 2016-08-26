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
  minimax(20);
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

function minimax(depth) {
  var move;
  var howManyTimes = 0;
  mmRecursive(board, "X", 0, depth);
  board[move] = computerSymbol;
  console.log("called function " + howManyTimes + " times.");

  function mmRecursive(tempBoard, tempPlayer, currentDepth, maxDepth) {
    howManyTimes++;
    if (win(tempBoard) === computerSymbol) {
      return 10;
    } else if (win(tempBoard) === playerSymbol) {
      return -10;
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
        /*
        if (win(newBoard) === tempPlayer && tempPlayer === computerSymbol) {
          if (currentDepth === 0) {
            move = i;
            return;
          }
          return 10-currentDepth;
        } else if (win(newBoard) === tempPlayer && tempPlayer === playerSymbol) {
          if (currentDepth === 1) {
            move = i;
            return;
          }
          console.log("player win");
          return currentDepth-10;
        }*/
        if (currentDepth === 0) {
          if (win(newBoard) === computerSymbol) {
            move = i;
            return;
          }
        }
        scores.push(mmRecursive(newBoard, tempPlayer, currentDepth+1, maxDepth));
      } 
    }   

    // actual turn computer takes
    if (currentDepth === 0) {
      console.log(moves);
      console.log(moves[scores.indexOf(Math.max.apply(null, scores))]);
      move = moves[scores.indexOf(Math.max.apply(null, scores))];
      console.log(scores);
      console.log(move);
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

/*
function minimax() {
  var boardArrayScore = [];
  var boardArrayPosition = [];
  var lookAhead = 9;
  
  for (var i = 0; i < 9; i++) {
    if (board[i] === "E") {
      boardArrayScore.push(0);
      boardArrayPosition.push(i);
    }
  }
*/
  /*
  for (var i = 0; i < 9; i++) {
    var tempBoard = board.slice();
    if (board[i] === "E") {
      tempBoard[i] = computerSymbol;
      if (win(tempBoard) === computerSymbol) {
        board[i] = computerSymbol;
        updateBoard();
        computerWin();
        return;
      }
      boardArray.push(tempBoard);
      boardArrayScore.push(0);
    }
  }
  */

/*
  for (var i = 0; i < boardArray.length; i++) {
    minimaxRecursion(boardArray[i], boardArrayScore[i], playerSymbol, 0);
  }
  minimaxRecursion(board, playerSymbol, 0);

  function minimaxRecursion(boardState, tmpPlayer, lookAheadCount) {
    var tmpBoardArray = [];

    if (lookAheadCount === lookAhead) {
      return;
    }

    if (tmpPlayer === "X") {
      tmpPlayer = "O";
    } else {
      tmpPlayer = "X";
    }

    for (var i = 0; i < 9; i++) {
      var tmpBoard = boardState.slice();
      if (tmpBoard[i] === "E") {
        tmpBoard[i] = tmpPlayer;
        if (win(tmpBoard) === tmpPlayer && tmpPlayer === playerSymbol && boardArrayScore[boardArrayPosition.indexOf(i)] === 0) {
          boardArrayScore[boardArrayPosition.indexOf(i)] = -10 + lookAheadCount - 1;
          return
        } else if (win(tmpBoard) === tmpPlayer && tmpPlayer === computerSymbol) {
          boardArrayScore[boardArrayPosition.indexOf(i)] = 10 - lookAheadCount;
          return
        } else {
          tmpBoardArray.push(tmpBoard);
        }
      }
    }

    if (tmpBoardArray.length === 0) {
      return;
    }

    for (var i = 0; i < tmpBoardArray.length; i++) {
      minimaxRecursion(tmpBoardArray[i], tmpPlayer, lookAheadCount+1);
    }
  }

  console.log(boardArrayScore);
  console.log(boardArrayPosition);

  var highest = Math.max.apply(Math, boardArrayScore);
  var lowest = Math.min.apply(Math, boardArrayScore);

  var index = (Math.abs(lowest) > Math.abs(highest)) ? lowest : highest; 

  board[boardArrayPosition[boardArrayScore.indexOf(index)]] = computerSymbol;
  updateBoard();



  // cut off.. return here

}


 /* 
  function minimaxRecursion(newBoard, tmpScoreArray, tmpPlayer) {
    if (tmpScoreArray.indexOf(1)) {
      return;
    }
    var tmpBoardArray = [];
    if (tmpPlayer === "X") {
      tmpPlayer = "O";
    } else {
      tmpPlayer = "X";
    }
    for (var i = 0; i < 9; i++) {
      var tmpBoard = newBoard.slice();
      if (tmpBoard[i] === "E") {
        tmpBoard[i] = tmpPlayer;
        if (win(tmpBoard) === tmpPlayer && tmpPlayer !== computerSymbol) {
          tmpScoreArray[i]-=1;
        } else if (win(tmpBoard) === tmpPlayer && tmpPlayer === computerSymbol) {
          tmpScoreArray[i]+=1;
        }
        tmpBoardArray.push(tmpBoard);
      }
    }
    for (var i = 0; i < tmpBoardArray.length; i++) {
      if (tmpScoreArray[i] === -1) {
        tmpBoardArray.splice(i, 1);
        i--;
      }
    }
    for (var i = 0; i < tmpBoardArray.length;)
  }

}

  /*

  for (var i = 0; i < boardArray.length; i++) {
    boardArrayScore.push(minimaxRecursion(boardArray[i], turnsLeft));
  }

  console.log(boardArrayScore);

  whichBoard = boardArrayScore[0];
  for (var i = 1; i < boardArrayScore.length; i++) {
    if (boardArrayScore[i] > whichBoard) {
      whichBoard = boardArrayScore[i];
    }
  }

  board = boardArray[whichBoard];

  function minimaxRecursion (testBoard, iteration) {
    if (iteration === 0) {
      return 0;
    }
    if (win(testBoard) === computerSymbol) {
      return 10+iteration;
    } else if (win(testBoard) === playerSymbol) {
      return -10-iteration;
    } else {
      return minimaxRecursion(testBoard, iteration-1);
    }
  }

}
*/

function tieWin() {
  alert("tie!");
  currentPlayer = "player";
  board = ["E", "E", "E",
           "E", "E", "E", 
           "E", "E", "E"];
  board[Math.floor(Math.random()*9)] = computerSymbol;
  updateBoard();
}

function computerWin() {
  alert("computer won");
  currentPlayer = "player";
  board = ["E", "E", "E",
           "E", "E", "E", 
           "E", "E", "E"];
  board[Math.floor(Math.random()*9)] = computerSymbol;
  updateBoard();
}

function playerWin() {
  alert("you win");
  currentPlayer = "player";
  board = ["E", "E", "E",
           "E", "E", "E", 
           "E", "E", "E"];
  board[Math.floor(Math.random()*9)] = computerSymbol;
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
  if (testBoard[place1] === "E" || testBoard[place2] === "E" || testBoard[place3] === "E" ||
      board[place1] !== testBoard[place2] || testBoard[place2] !== testBoard[place3]) {
    return "E";
  } else {
    return testBoard[place1];
  }
}

board[Math.floor(Math.random()*9)] = computerSymbol;
updateBoard();
console.log(win(board));

$("#button0").click(function(){playerClick(0);});
$("#button1").click(function(){playerClick(1);});
$("#button2").click(function(){playerClick(2);});
$("#button3").click(function(){playerClick(3);});
$("#button4").click(function(){playerClick(4);});
$("#button5").click(function(){playerClick(5);});
$("#button6").click(function(){playerClick(6);});
$("#button7").click(function(){playerClick(7);});
$("#button8").click(function(){playerClick(8);});
