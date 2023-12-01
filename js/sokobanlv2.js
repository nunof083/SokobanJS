"use strict";

var c = document.getElementById("mycanvas");
var ctx = c.getContext("2d");
var posX = 0;
var posY = 0;
    
var mapArray = 
[   
    ["0","0","0","0","1","1","1","1","1","0","0","0","0","0","0","0","0","0","0","0","0","0"],
    ["0","0","0","0","1","0","0","0","1","0","0","0","0","0","0","0","0","0","0","0","0","0"],
    ["0","0","0","0","1","3","0","0","1","0","0","0","0","0","0","0","0","0","0","0","0","0"],
    ["0","0","1","1","1","0","0","3","1","1","1","0","0","0","0","0","0","0","0","0","0","0"],
    ["0","0","1","0","0","3","0","0","3","0","1","0","0","0","0","0","0","0","0","0","0","0"],
    ["1","1","1","0","1","0","1","1","1","0","1","0","0","0","0","0","1","1","1","1","1","1"],
    ["1","0","0","0","1","0","1","1","1","0","1","1","1","1","1","1","1","0","0","2","2","1"],
    ["1","0","3","0","0","3","0","0","0","0","0","0","0","0","0","0","0","0","0","2","2","1"],
    ["1","1","1","1","1","0","1","1","1","1","0","1","*","1","1","1","1","0","0","2","2","1"],
    ["0","0","0","0","1","0","0","0","0","0","0","0","1","1","1","0","0","1","1","1","1","1"],
    ["0","0","0","0","1","1","1","1","1","1","1","1","0","0","0","0","0","0","0","0","0","0"]
];

// // * is where the character is
// // 0 is for where we can move and is not the point of the box
// // 1 is for the walls
// // 2 is for where we can move and is a point of the box
// // 3 is where a box is
// // 4 is when a box is at the point 

function makeMap ()
{
    ctx.clearRect(0, 0, c.width, c.height);
    var yellow = "#FFFF00"; // replace with your desired color value
    var gray = "#808080";
    var orange = "#FFA500";
    posX = 0;
    posY = 0;
    for (var i = 0; i < mapArray.length; i++) {
        for (var j = 0; j < mapArray[i].length; j++) {
            if (mapArray[i][j] == '*') {
                drawImage('./images/char.ico', posX, posY)
            } else if (mapArray[i][j] == '0') {
                makeSquare(posX, posY, yellow)
            } else if (mapArray[i][j] == '1') {
                makeSquare(posX, posY, gray)
            } else if (mapArray[i][j] == '2') {
                makeSquare(posX, posY, orange)
            } else if (mapArray[i][j] === '3' || mapArray[i][j] === '4') {
                drawImage('./images/box.png', posX, posY);
            }
            posX += 32;
        }
        posX = 0;
        posY += 32;
    }
}

function drawImage(imageUrl, x, y) {
    var img = new Image();
    img.onload = function() {
        ctx.drawImage(img, x, y, 32, 32);
    };
    img.src = imageUrl;
}

function makeSquare(posX, posY, colour) {
    ctx.beginPath();
    ctx.rect(posX, posY, 32, 32);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fillStyle = colour;  // Correction ici
    ctx.fill();
}

function findPlayerCords() {
    const y = mapArray.findIndex((row) => row.includes('*'));
    const x = mapArray[y].indexOf('*');

    return {
      x,
      y,
      above: mapArray[y - 1][x],
      below: mapArray[y + 1][x],
      sideLeft: mapArray[y][x - 1],
      sideRight: mapArray[y][x + 1],
    };
}

function keys(e) {
    var playerCords = findPlayerCords();
    var playerCordsX = playerCords.x;
    var playerCordsY = playerCords.y;
    
    if ((e.keyCode == 87 || e.keyCode == 38) && (playerCords.above !== "1")) {
        mapArray[playerCordsY - 1][playerCordsX + 0] = '*';
        mapArray[playerCordsY][playerCordsX] = ' ';
        makeMap();
    }
    if ((e.keyCode == 65 || e.keyCode == 37) && (playerCords.sideLeft !== "1")) {
        mapArray[playerCordsY + 0][playerCordsX - 1] = '*';
        mapArray[playerCordsY][playerCordsX] = ' ';
        makeMap();
    }
    if ((e.keyCode == 83 || e.keyCode == 40) && (playerCords.below !== "1")) {
        mapArray[playerCordsY + 1][playerCordsX + 0] = '*';
        mapArray[playerCordsY][playerCordsX] = ' ';
        makeMap();
    }
    if ((e.keyCode == 68 || e.keyCode == 39) && (playerCords.sideRight !== "1")) {
        mapArray[playerCordsY - 0][playerCordsX + 1] = '*';
        mapArray[playerCordsY][playerCordsX] = ' ';
        makeMap();
    }
  }

document.onkeydown = keys;
console.log(keys);
makeMap ();