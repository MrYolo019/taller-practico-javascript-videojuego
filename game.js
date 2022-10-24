const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

let canvasSize; 
let elementsSize;

function setCanvasSize() {
    if(window.innerHeight > innerWidth){
        canvasSize = window.innerWidth * 0.8;
    } else{
        canvasSize = window.innerHeight * 0.8;
    }

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)

    elementsSize = (canvasSize / 10) - 2;

    startGame();
}

const map = maps[0];
const mapRows = map.trim().split('\n');
const mapRowCols = mapRows.map(row => row.trim().split(''));

function startGame() {
    game.font = (elementsSize - 12) + 'px Verdanada';
    game.textAlign = 'end';

     for (let row = 1; row <= 10; row++) {
        for (let col = 0; col <=10; col++) {
        game.fillText(emojis[mapRowCols[row -1][col -1]], elementsSize * col, elementsSize * row);
        }
    }
}