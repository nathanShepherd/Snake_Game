/**
 * snake.js
 *
 * EECS 183: Final Project REACH
 * Fall 2016
 *
 *
 */

var Constants = {
    numberOfRows: 13,
    numberOfColumns: 25,
    cellSize: 20,
    maxLength: 200,
    snakeColor: "#2ecc71",
    appleColor: "#e74c3c",
    white: "#ffffff",
    frameRate: 100,

    wCode: 119,
    aCode: 97,
    sCode: 115,
    dCode: 100

};
var Variables = {
  length: 3,
  counter: 0,
  highscore: 0
};



/**
 * Creates an HTML table representing canvas and inserts it into HTML.
 */
function createCanvas() {
    var canvasTable = $("<table>", {id: "canvas-table"});
    var canvasTableHead = $("<thead>");
    // add rows and columns
    for (var rowIndex = 0; rowIndex < Constants.numberOfRows; rowIndex++) {
        // make a row
        var canvasRow = $("<tr>");
        for (var columnIndex = 0; columnIndex < Constants.numberOfColumns; columnIndex++) {
            // make a cell
            var canvasCell = $("<td>");
            canvasRow.append(canvasCell);
        }
        canvasTableHead.append(canvasRow);
    }
    canvasTable.append(canvasTableHead);
    // add table to HTML
    $("#canvas-container").append(canvasTable);

    // set size of cells
    $("#canvas-table td").css({
        width: Constants.cellSize,
        height: Constants.cellSize,
    });
}

/**
 * Returns cell from HTML canvas table at specified rowIndex and columnIndex.
 */
function getCanvasCellAtIndex(rowIndex, columnIndex) {
    return $("#canvas-table tr:eq(" + rowIndex + ") td:eq(" + columnIndex + ")");
}

/**
 * Creates and returns 2d array representing game grid.
 * Initializes each cell to an object with isBody, isApple as false;
 */
function createGameGrid() {
    var grid = new Array(Constants.numberOfRows);
    for (var row = 0; row < Constants.numberOfRows; row++) {
        grid[row] = new Array(Constants.numberOfColumns);
        for (var col = 0; col < Constants.numberOfColumns; col++) {
            grid[row][col] = {
                isApple: false,
                isBody: false,
            };
        }
    }
    return grid;
}

/**
 * Executes when entire HTML document loads.
 */
$(document).ready(function() {
    createCanvas();
    var gameGrid = createGameGrid()

    var length = 2;
    var counter = -1;

    var snakeHead = {
        row: 0,
        col: 0,
        direction: "right",
    };

    //contains all previous positions of snakeHead
    var bodyPositions = {
      row: [],
      col: []
    };


    // game loop
    var timer;
    function playSnake() {
        updateGameGrid(gameGrid, snakeHead, bodyPositions);
        timer = setTimeout(function() {
                              playSnake();
                                  }, Constants.frameRate)
    }

    var numberOfClicks = 0;
    $("#start-game").click(function () {
      clearInterval(timer);

      if(numberOfClicks < 1) {
        drawApple(gameGrid);
        playSnake();
        ++numberOfClicks;
      } else {
        playSnake();
      }
    });

    $("#pause-game").click(function () {
        clearInterval(timer);
    });

    $("#how-to").click(function () {

      alert("If your snake goes outside the boarders of the box, game over.\n" +
             "If your snake attempts to eat itself, game over.\n" +
             "If your snake eats an apple, you grow longer ... try to get the highscore!");
    });

    /**
     * Create an event listener for the arrow keys
     * snakeHead moves in the direction of last keystroke at all times
     *      cannot move the opposite direction of last keystroke
     *      (ex.) if OLDkeystoke === <--, then NEWkeystroke != -->
     */
    document.addEventListener("keypress", function (keystroke) {
        if (keystroke.charCode === Constants.wCode) {
          if (snakeHead.direction != "down"){
              snakeHead.direction = "up";
          }
        }
        if (keystroke.charCode === Constants.sCode) {
          if (snakeHead.direction != "up"){
            snakeHead.direction = "down";
          }
        }
        if (keystroke.charCode === Constants.aCode) {
          if (snakeHead.direction != "right") {
            snakeHead.direction = "left";
          }
        }
        if (keystroke.charCode === Constants.dCode) {
          if (snakeHead.direction != "left") {
            snakeHead.direction = "right";
          }
        }
    });
})



/****************************** BEGIN CORE CODE ******************************/

function updateGameGrid(gameGrid, snakeHead, bodyPositions) {
  moveHead(gameGrid, snakeHead, bodyPositions);
  drawHead(snakeHead, gameGrid, bodyPositions);

  eraseBody(gameGrid, bodyPositions);
  drawBody(gameGrid, bodyPositions, snakeHead);

  updateApplePosition(gameGrid, snakeHead);
}


function moveHead(gameGrid, snakeHead, bodyPositions) {
  if (snakeHead.direction === "up") {
    if (snakeHead.row > 0) {
      snakeHead.row -= 1;
    } else if (snakeHead.row === 0) {
      gameOver(snakeHead, bodyPositions);
    }
  }
  else if (snakeHead.direction === "right") {
    if (snakeHead.col < Constants.numberOfColumns -1){
      snakeHead.col += 1;
    } else if (snakeHead.col === Constants.numberOfColumns -1){
      gameOver(snakeHead, bodyPositions);
    }
  }
  else if (snakeHead.direction === "down") {
    if (snakeHead.row < Constants.numberOfRows -1){
      snakeHead.row += 1;
    }else if (snakeHead.row === Constants.numberOfRows -1){
      gameOver(snakeHead, bodyPositions);
    }
  }
  else if (snakeHead.direction === "left") {
    if (snakeHead.col > 0) {
      snakeHead.col -= 1;
    }else if (snakeHead.col === 0){
      gameOver(snakeHead, bodyPositions);
    }
  }

  // update bodyPositions
  bodyPositions.row.push(snakeHead.row);
  bodyPositions.col.push(snakeHead.col);
}


function drawHead(snakeHead, gameGrid, bodyPositions) {
  var colorize = getCanvasCellAtIndex(snakeHead.row, snakeHead.col).css(
                  "backgroundColor", Constants.snakeColor);
    // removes color since head is in different pos
    switch (snakeHead.direction) {
      case "up":
        colorize;
        getCanvasCellAtIndex(snakeHead.row +1, snakeHead.col).css("backgroundColor", "");
        break;
      case "down":
        colorize;
        getCanvasCellAtIndex(snakeHead.row -1, snakeHead.col).css("backgroundColor", "");
        break;
      case "right":
        colorize;
        getCanvasCellAtIndex(snakeHead.row, snakeHead.col -1).css("backgroundColor", "");
        break;
      case "left":
        colorize;
        getCanvasCellAtIndex(snakeHead.row, snakeHead.col +1).css("backgroundColor", "");
        break;
    }

    // So that snakeHead cannot exist at any snakeBody Position
    if (gameGrid[snakeHead.row][snakeHead.col].isBody){
      gameOver(snakeHead, bodyPositions);
    }
}

function drawBody(gameGrid, bodyPositions, snakeHead) {
  // bodyPositions.length is always increasing at the rate of one
  //   unit per frame. counter allows only the most recent segments
  //   to be drawn.
  Variables.counter += 1;
  if (Variables.counter > Constants.maxLength) {
    Variables.counter -= 20;
    bodyPositions.row.splice(0, 20);
    bodyPositions.col.splice(0, 20);
  }

  for (var i = 0; i < Variables.length; i++) {
    if (Variables.counter >= Variables.length) {
      var row = bodyPositions.row[i + Variables.counter - Variables.length];
      var col = bodyPositions.col[i + Variables.counter - Variables.length];
      gameGrid[row][col].isBody = true;

      getCanvasCellAtIndex(row, col).css("backgroundColor", Constants.snakeColor);
    }
  }
}

function eraseBody(gameGrid, bodyPositions) {
  for (var i = 0; i < Variables.counter - Variables.length; ++i) {
    if (Variables.counter >= (2*Variables.length)){
      var row = bodyPositions.row[i];
      var col = bodyPositions.col[i];
      gameGrid[row][col].isBody = false;

      if (!gameGrid[row][col].isApple){
        getCanvasCellAtIndex(row, col).css("backgroundColor", "");
      }
    }
  }
}


/**
 *  applePos = position of apple
 *  updated when applePos === snakeHeadPos
 *
 */
function drawApple(gameGrid) {
  //removes extra apples from gameGrid
  for (var row = 0; row < Constants.numberOfRows; row++) {
    for (var col = 0; col < Constants.numberOfColumns; col++) {
      gameGrid[row][col].isApple = false;
    }
  }
  //draws new apple at random position
  var appleRow = Math.floor(Math.random() * Constants.numberOfRows);
  var appleCol = Math.floor(Math.random() * Constants.numberOfColumns);

  if (gameGrid[appleRow][appleCol].isBody) {
    drawApple(gameGrid);
  } else {
    getCanvasCellAtIndex(appleRow, appleCol).css("backgroundColor", Constants.appleColor);
    gameGrid[appleRow][appleCol].isApple = true;
  }
}

function updateApplePosition(gameGrid, snakeHead){
    var row = snakeHead.row;
    var col = snakeHead.col;

    if ((gameGrid[row][col].isApple)){
        drawApple(gameGrid);
        Variables.length += 5;
    }
    document.getElementById("length").innerHTML = Variables.length;
}


/**
 *
 * if snakeHeadPos === any snakeBody.Pos(row, col) or
 * if snakeHeadPos is outside canvas bounds
 *      gameOver();
 *
 */
function gameOver(snakeHead, bodyPositions) {
    //Updates highscore-dispay
    if (Variables.length > Variables.highscore) {
      document.getElementById("score").innerHTML = Variables.length;
      Variables.highscore = Variables.length;
    }

    snakeHead.row = 1;
    snakeHead.col = 1;
    snakeHead.direction = "right";

    Variables.length = 3;

    alert("Game Over");
}
