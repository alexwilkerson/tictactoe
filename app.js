var pageState = "intro";

var whoWentFirst = "player";
var currentPlayer = "player";
var playerSymbol;
var computerSymbol;
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
  mmRecursive(board, playerSymbol, 0);
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

function winScreen(who) {
  pageState = "win-screen";
  $(".win-screen-container").text("");
  var quips = [];
  if (who === "computer") {
    quips = ["I WIN. :)", "HOW ABOUT A NICE GAME OF CHESS?", "PROFESSOR FALKEN... I DO DECLARE!", "MATTHEW BRODERICK WOULD BE^DISAPPOINTED.", "THIS IS GETTING EASIER.", "HOW ABOUT GLOBAL THERMONUCLEAR WAR?", "I ALWAYS PREFERRED DIGITAL^INTELLIGENCE OVER ANALOGUE."];
  } else if (who === "tie"){
    quips = ["NICE TRY. :P", "A TIE. HOW REMARKABLE.", "PERHAPS ANOTHER GAME?", "THIS IS GETTING BORING.", "GREETINGS PROFESSOR FALKEN", "USER PASSWORD: pencil", "PERHAPS YOU SHOULD TRY^STRATEGY: WINNING"];
  }
  var quip = quips[Math.floor(Math.random()*quips.length)];
  $(".board").addClass("hidden");
  $(".win-screen").removeClass("hidden");
  typeWinScreen(quip);
}

function computerWin() {
  winScreen("computer");
  pageState = "game";
}

function tieWin() {
  winScreen("tie");
  pageState = "game";
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

function typeWinScreen(winString) {
  if (winString[0] === "^") {
    $(".win-screen-container").append("<br>");
    winString = winString.slice(1);
  }
  if (winString[0] === "$") {
    setTimeout(function() {
      $(".win-screen").addClass("hidden");
      $(".board").removeClass("hidden");
    }, 1000);
    return;
  }
  setTimeout(function() {
    $(".win-screen-container").append(winString[0]);
    if (winString.slice(1) === "") {
      setTimeout(function() {
        $(".win-screen-container").append("<br><br><br><br>");
        board = ["E", "E", "E",
                 "E", "E", "E", 
                 "E", "E", "E"];
        if (whoWentFirst === "player") {
          whoWentFirst = "computer)";
          currentPlayer = "computer";
          typeWinScreen("MY TURN!$");
          board[Math.floor(Math.random()*9)] = computerSymbol;
        } else {
          whoWentFirst = "player";
          typeWinScreen("YOUR TURN!$");
        }
        currentPlayer = "player";
        updateBoard();
      }, 400);
      return;
    } else {
      typeWinScreen(winString.slice(1));
    }
  }, 40);
}

function typeChoose(chooseString) {
  setTimeout(function() {
    $(".choose-text").append(chooseString[0]);
    if (chooseString.slice(1) === "") {
      setTimeout(function() {
        $(".choose-x").removeClass("hidden");
        $(".choose-o").removeClass("hidden");
        return 1;
      }, 400);
    } else {
      typeChoose(chooseString.slice(1));
    }
  }, 40);
}

function typeIntro(introString) {
  if (pageState === "intro") {
    if (introString[0] === "%") {
      setTimeout(function() {
        $(".intro-container").append("<br>");
        if (introString.slice(1) === "") {
          return 1;
        } else {
          typeIntro(introString.slice(1));
        }
      }, 400);
    } else if (introString[0] === "^") {
      setTimeout(function() {
        $(".intro-container").append("<br><br><br><br>");
        if (introString.slice(1) === "") {
          return 1;
        } else {
          typeIntro(introString.slice(1));
        }
      }, 1000);
    } else {
      setTimeout(function() {
        $(".intro-container").append(introString[0]);
        if (introString.slice(1) === "") {
          return 1;
        } else {
          typeIntro(introString.slice(1));
        }
      }, 40);
    }
  }
}

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

$(".intro").click(function() {
  pageState = "choose-symbol";
  $(this).addClass("hidden");
  $(".choose-symbol").removeClass("hidden");
  typeChoose("CHOOSE YOUR SYMBOL:");
});

$("#choose-x").click(function() {
  playerSymbol = "X";
  computerSymbol = "O";
  pageState = "game";
  $(".choose-symbol").addClass("hidden");
  $(".board").removeClass("hidden");
});

$("#choose-o").click(function() {
  playerSymbol = "O";
  computerSymbol = "X";
  pageState = "game";
  $(".choose-symbol").addClass("hidden");
  $(".board").removeClass("hidden");
});

$(document).ready(function() {
  // a ^ represents a page break and a pause
  typeIntro("SHALL WE PLAY A GAME?^A STRANGE GAME.%THE ONLY WINNING MOVE IS%NOT TO PLAY.");
});
