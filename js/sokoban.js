"use strict";

var c = document.getElementById("mycanvas");
var ctx = c.getContext("2d");
var posX = 0;
var posY = 0;
var playerState = '0';
    

// map
var mapArray = 
[   
    ["0", "0", "1", "1", "1", "1", "1", "0",],
    ["1", "1", "1", "0", "0", "0", "1", "0",],
    ["1", "2", "*", "3", "0", "0", "1", "0",],
    ["1", "1", "1", "0", "3", "2", "1", "0",],
    ["1", "2", "1", "1", "3", "0", "1", "0",],
    ["1", "0", "1", "0", "2", "0", "1", "1",],
    ["1", "3", "0", "3", "3", '3', "2", "1",],
    ["1", "0", "0", "0", "2", "0", "0", "1",],
    ["1", "1", "1", "1", "1", "1", "1", "1",]
];


// // * is where the character is
// // 0 is for where we can move and is not the point of the box
// // 1 is for the walls
// // 2 is for where we can move and is a point of the box
// // 3 is where a box is
// // 4 is when a box is at the point 

var EMPTY = "0";
var WALL = "1";
var VOID = "2";
var BOX = "3";
var boxOnPoint = "4";
var PLAYER = "*"

//function that makes the map
function makeMap() {
    ctx.clearRect(0, 0, c.width, c.height);
    var yellow = "#FFFF00";
    var gray = "#808080";
    var orange = "#FFA500";
    posX = 0;
    posY = 0;

    for (var i = 0; i < mapArray.length; i++) {
        for (var j = 0; j < mapArray[i].length; j++) {
            if (mapArray[i][j] == '*') {
                drawImage('./images/char.ico', posX, posY)
            } else if (mapArray[i][j] === '0') {
                makeSquare(posX, posY, yellow)
            } else if (mapArray[i][j] === '1') {
                makeSquare(posX, posY, gray)
            } else if (mapArray[i][j] === '2') {
                makeSquare(posX, posY, orange)
            } else if (mapArray[i][j] === '3') {
                drawImage('./images/box.png', posX, posY);
            } else if (mapArray[i][j] === '4') {
                drawImage('./images/boxonpoint.png', posX, posY);
            }
            posX += 32;
        }
        posX = 0;
        posY += 32;
    }
}

//function to put images
function drawImage(imageUrl, x, y) {
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, x, y, 32, 32);
    };
    img.src = imageUrl;
}

//function to draw squares
function makeSquare(posX, posY, colour) {
    ctx.beginPath();
    ctx.rect(posX, posY, 32, 32);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = colour;
    ctx.fill();
}

function findPlayerCords() {
    const y = mapArray.findIndex((row) => row.includes('*'));
    const x = mapArray[y].indexOf('*');
    
    const above = mapArray[y - 1]?.[x];
    const above2 = mapArray[y - 2]?.[x];
    const below = mapArray[y + 1]?.[x];
    const below2 = mapArray[y + 2]?.[x];
    const sideLeft = mapArray[y]?.[x - 1];
    const sideLeft2 = mapArray[y]?.[x - 2];
    const sideRight = mapArray[y]?.[x + 1];
    const sideRight2 = mapArray[y]?.[x + 2];

    return {
      x,
      y,
      above,
      above2,
      below,
      below2,
      sideLeft,
      sideLeft2,
      sideRight,
      sideRight2
    };
}

//function to end the game
function isGameOver() {
    for (var i = 0; i < mapArray.length; i++) {
        for (var j = 0; j < mapArray[i].length; j++) {
            if (mapArray[i][j] === VOID) {
                if (!hasBoxAtPoint(i, j)) {
                    return false;
                }
            }
        }
    }
    return true;
}

function hasBoxAtPoint(row, col) {
    return mapArray[row][col] === BOX || mapArray[row][col] === boxOnPoint;
}

//all moves of player
function keys(e) {
    var playerCords = findPlayerCords();
    var playerCordsX = playerCords.x;
    var playerCordsY = playerCords.y;
    var boxMoved = false;
    var direction;
    
    if ((e.keyCode == 87 || e.keyCode == 38) && (playerCords.above !== "1")) {
        var nextCellAbove = mapArray[playerCordsY - 1][playerCordsX];
        direction = "up";
        if (nextCellAbove === '3') {
            var nextNextCellAbove = mapArray[playerCordsY - 2][playerCordsX];

            if (nextNextCellAbove === '0' || nextNextCellAbove === '2' || nextNextCellAbove === '4') {
                mapArray[playerCordsY - 2][playerCordsX] = '3';
                mapArray[playerCordsY - 1][playerCordsX] = '*';
                boxMoved = true;
            } else if (nextNextCellAbove === '1') {
                boxMoved = false;
            }
        } else {
            mapArray[playerCordsY - 1][playerCordsX] = '*';
            boxMoved = true;
        }
    } else if ((e.keyCode == 65 || e.keyCode == 37) && (playerCords.sideLeft !== "1")) {
        var nextCellLeft = mapArray[playerCordsY][playerCordsX - 1];
        direction = "left";
        if (nextCellLeft === '3') {
            var nextNextCellLeft = mapArray[playerCordsY][playerCordsX - 2];

            if (nextNextCellLeft === '0' || nextNextCellLeft === '2' || nextNextCellLeft === '4') {
                mapArray[playerCordsY][playerCordsX - 2] = '3';
                mapArray[playerCordsY][playerCordsX - 1] = '*';
                boxMoved = true;
            } else if (nextNextCellLeft === '1') {
                boxMoved = false;
            }
        } else {
            mapArray[playerCordsY][playerCordsX - 1] = '*';
            boxMoved = true;
        }
    } else if ((e.keyCode == 83 || e.keyCode == 40) && (playerCords.below !== "1")) {
        var nextCellBelow = mapArray[playerCordsY + 1][playerCordsX];
        direction = "down";
        if (nextCellBelow === '3') {
            var nextNextCellBelow = mapArray[playerCordsY + 2][playerCordsX];

            if (nextNextCellBelow === '0' || nextNextCellBelow === '2' || nextNextCellBelow === '4') {
                mapArray[playerCordsY + 2][playerCordsX] = '3';
                mapArray[playerCordsY + 1][playerCordsX] = '*';
                boxMoved = true;
            } else if (nextNextCellBelow === '1') {
                boxMoved = false;
            }
        } else {
            mapArray[playerCordsY + 1][playerCordsX] = '*';
            boxMoved = true;
        }
    } else if ((e.keyCode == 68 || e.keyCode == 39) && (playerCords.sideRight !== "1")) {
        var nextCellRight = mapArray[playerCordsY][playerCordsX + 1];
        direction = "right";
        if (nextCellRight === '3') {
            var nextNextCellRight = mapArray[playerCordsY][playerCordsX + 2];

            if (nextNextCellRight === '0' || nextNextCellRight === '2' || nextNextCellRight === '4') {
                mapArray[playerCordsY][playerCordsX + 2] = '3';
                mapArray[playerCordsY][playerCordsX + 1] = '*';
                boxMoved = true;
            } else if (nextNextCellRight === '1') {
                boxMoved = false;
            }
        } else {
            mapArray[playerCordsY][playerCordsX + 1] = '*';
            boxMoved = true;
        }
    }

    if (boxMoved) {
        console.log("Box moved");
        
        mapArray[playerCordsY][playerCordsX] = '0';

        if (isGameOver()) {
            alert("Congratulations! You completed the level.");
        }
        
        makeMap();
    }
}

document.onkeydown = keys;
makeMap();