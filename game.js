const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down'); 
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const spanResult = document.querySelector('#result');
const botonReiniciar = document.querySelector('#reset');

let canvasSize; 
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

const playerPosition = {
    x: undefined,
    y: undefined,
}
const giftPosition = {
    x: undefined,
    y: undefined,
}
let enemiesPositions = [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

// function fixNumber(n){
//     return Number(n.toFixed(2));
// }

function setCanvasSize() {
    if(window.innerHeight > innerWidth){
        canvasSize = window.innerWidth * 0.7;
    } else{
        canvasSize = window.innerHeight * 0.7;
    }

    canvasSize = Number(canvasSize.toFixed(0));

    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)

    elementsSize = (canvasSize / 10) - 2;

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
}

function startGame() {
    game.font = (elementsSize - 12) + 'px Verdanada';
    game.textAlign = 'end';

    const map = maps[level];

    if (!map) {
        gameWin();
        return;
    }

    if (!timeStart) {
        timeStart = Date.now();
        timeInterval = setInterval( showTime,100);
        showRecord();
    }

    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));

    showLives();

    enemiesPositions = [];
    game.clearRect(0,0, canvasSize, canvasSize);
    mapRowCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col];
            const posX = elementsSize * (colI + 1);
            const posY = elementsSize * (rowI + 1);

            if (col == 'O') {
                if (!playerPosition.x && !playerPosition.y){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                    console.log(playerPosition);
                } 
            } else if (col == 'I'){
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                enemiesPositions.push({
                    x: posX,
                    y: posY,
                });
            }
            game.fillText(emoji, posX, posY);
        });
    });

    botonReiniciar.addEventListener('click', reiniciarJuego);

    movePlayer();
}

function movePlayer(){
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;

    if (giftCollision){
        levelWin()
    }

    const enemyCollision = enemiesPositions.find(enemy => {
        const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY;
    });
    
    if (enemyCollision){
        levelFail();
    }
    
    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)
}

function levelWin(){
    console.log('subiste de nivel');
    level++;
    startGame();
}

function levelFail(){
    lives--;
    if (lives <= 0) {
        level = 0;
        lives = 3;
        timeStart = undefined;
    }

    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();

}

function gameWin(){
    console.log('TERMINASTE');
    clearInterval(timeInterval);

    const recordTime = localStorage.getItem('record_time');
    const playerTime = Date.now() - timeStart;
    
    if (recordTime) {
        if (recordTime >=playerTime) {
            localStorage.setItem('record_time', playerTime);
        } else {
            console.log('lelo');
        }
    } else {
        localStorage.setItem('record_time', playerTime);
    }
}

function reiniciarJuego () {
    location.reload();
}

function showLives() {
    const heartsArray = Array(lives).fill(emojis['HEART']); 
    
    spanLives.innerHTML = '';
    heartsArray.forEach(heart => spanLives.append(heart));
    // spanLives.innerHTML = ; 
}

function showTime () {
    spanTime.innerHTML = Date.now() - timeStart;
}

function showRecord () {
    spanRecord.innerHTML = localStorage.getItem('record_time');
}

window.addEventListener('keydown', moveByKeys);
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);

function moveByKeys(event){
    if(event.key == 'ArrowUp') moveUp();
    else if (event.key == 'ArrowLeft') moveLeft();
    else if (event.key == 'ArrowRight') moveRight();
    else if (event.key == 'ArrowDown') moveDown();
}

function moveUp(){
    if ((playerPosition.y - elementsSize) < elementsSize){
        console.log('OUT');
    } else {
        playerPosition.y -= elementsSize;
        startGame();   
    }
}

function moveLeft(){
    if ((playerPosition.x - elementsSize) < elementsSize){
        console.log('NOT');
    } else{
        playerPosition.x -= elementsSize;
        startGame();
    }
}

function moveRight(){
    if ((playerPosition.x + elementsSize) > canvasSize){
        console.log('NOT');
    } else{
        playerPosition.x += elementsSize;
        startGame();
    }
}

function moveDown(){
    if ((playerPosition.y + elementsSize) > canvasSize){
        console.log('OUT');
    } else {
        playerPosition.y += elementsSize;
        startGame();   
    }
}


