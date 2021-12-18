const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const gameBackgroundImage = document.createElement('img');
gameBackgroundImage.src = 'https://img5.goodfon.com/wallpaper/nbig/9/5a/gora-gory-mount-mounts-luna-moon-mesiats-zakat-dymnoe-nebo-o.jpg';

const logo = document.createElement('img');
logo.src = './Pictures/Nikoyan.svg';

class Hero {
    constructor(x, y) {
        this._x = x - 75;
        this._y = y - 75;
        this._width = 150;
        this._height = 150;
        this._xDelta = 0;
        this._yDelta = 0;
        this._avatar = document.createElement('img');
        this._avatar.src = 'https://cdn.pixabay.com/photo/2020/10/16/14/40/among-us-5659730_960_720.png';
    }

    update() {
        if(this._x + this._width + this._xDelta > 800 || this._x + this._xDelta < 200) {
            this._xDelta = 0;
        }
        if(this._y + this._height + this._yDelta > 800 || this._y + this._yDelta < 200) {
            this._yDelta = 0;
        }
        this._x += this._xDelta;
        this._y += this._yDelta;
        if(this._xDelta !== 0 || this._yDelta !== 0) {
            this._xDelta = 0;
            this._yDelta = 0;
        }

    }

    render() {
        context.drawImage(this._avatar, this._x, this._y, this._width, this._height);
    }

    moveUp() {
        this._yDelta = -200;
    }

    moveRight() {
        this._xDelta = 200;
    }

    moveDown() {
        this._yDelta = 200;
    }

    moveLeft() {
        this._xDelta = -200;
    }

    stop() {
        this._xDelta = 0;
        this._yDelta = 0;
    }
}

class Enemy {
    constructor(x, y, speed) {
        this._x = x === 0 || x === 1000 ? x : x - 15;
        this._y = y === 0 || y === 1000 ? y : y - 15;

        this._width = this._x === 0 ? -150 : this._x === 1000 ? 150 : 30;
        this._height = this._y === 0 ? -150 : this._y === 1000 ? 150 : 30;

        this._xDelta = this._x === 0 ? speed : this._x === 1000 ? -1*speed : 0;
        this._yDelta = this._y === 0 ? speed : this._y === 1000 ? -1*speed : 0;

        this.deleteMe = false;

        this._avatar = document.createElement('img');
        this._avatar.src = './Pictures/enemy_vertical.svg';
    }

    isVertical() {
        return this._xDelta === 0;
    }

    update() {
        if(
            this._x + this._width < 0 && this._xDelta < 0 ||
            this._x > 1000 && this._xDelta > 0 ||
            this._y > 1000 && this._yDelta > 0 ||
            this._y + this._height < 0 && this._yDelta < 0
        ) {
            this.deleteMe = true;
        }

        this._x += this._xDelta;
        this._y +=this._yDelta;
    }

    render() {
        context.drawImage(this._avatar, this._x, this._y, this._width, this._height);
    }
}

class Coin {
    constructor(x, y) {
        this._randomArrayForX = [300, 500, 700].filter(elem => {
            return elem !== x;
        });
        this._randomArrayForY = [300, 500, 700].filter(elem => {
            return elem !== y;
        })
        this._x = this._randomArrayForX[random(0, 1)] - 60;
        this._y = this._randomArrayForY[random(0, 1)] - 60;
        this._avatar = document.createElement('img');
        this._avatar.src = 'https://iconarchive.com/download/i7999/hopstarter/soft-scraps/Coin.ico';
        this._audio = document.createElement('audio');
        this._audio.src = 'http://www.utc.fr/si28/ProjetsUpload/P2006_si28p004/flash_puzzle/sons/rush/coinhit.wav';
    }

    playSound() {
        this._audio.currentTime = 0;
        this._audio.play();
    }

    render() {
        context.drawImage(this._avatar, this._x, this._y, 120, 120);
    }
}

class GameState {
    static randomBorder = [0, 1000];
    static randomPosition = [300, 500, 700];
    static netImg = document.createElement('img');
    static playAgain = document.createElement('img');
    static gameOverSound = new Audio('./Pictures/game_over.mp3');

    constructor() {
        GameState.netImg.src = 'https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAlsbWG4K3CPjTK5W3tAMvh4';
        GameState.playAgain.src = 'https://cdn4.iconfinder.com/data/icons/arrows-1-6/48/89-512.png';

        this.hero = new Hero(500, 500);
        this.enemies = [
            new Enemy(GameState.randomPosition[random(0, 2)], GameState.randomBorder[random(0, 1)], 6),
            new Enemy(GameState.randomBorder[random(0, 1)], GameState.randomPosition[random(0, 2)], 6)
        ];
        this.coin = new Coin(500, 500);
        this.score = 0;
        this.gameOver = false;
        this.enemySpeed = 6;
        this.enemySpeedController = 0;
    }
}


let data = new GameState();

function random(start, end) {
    return Math.floor(Math.random() * ( end - start + 1)) + start;
}

function intersect(hero, enemy) {
    if(
        !enemy.isVertical() && 
        enemy._y >= hero._y && 
        enemy._y <= hero._y + hero._height && 
        enemy._width > 0 && 
        enemy._x <= hero._x + hero._width && 
        enemy._x + enemy._x + enemy._width >= hero._x
    ) {
        return true;
    }

    else if(
        !enemy.isVertical() && 
        enemy._y >= hero._y && 
        enemy._y <= hero._y + hero._height && 
        enemy._width < 0 && 
        enemy._x >= hero._x && 
        enemy._x + enemy._width <= hero._x + hero._width
    ) {
        return true;
    }
    else if(
        enemy.isVertical() && 
        enemy._x >= hero._x && 
        enemy._x <= hero._x + hero._width && 
        enemy._height < 0 && 
        enemy._y >= hero._y &&
        enemy._y + enemy._height <= hero._y + hero._height
    ) {
        return true
    }
    else if(
        enemy.isVertical() && 
        enemy._x >= hero._x && 
        enemy._x <= hero._x + hero._width && 
        enemy._height > 0 && 
        enemy._y <= hero._y + hero._height &&
        enemy._y + enemy._height >= hero._y
    ) {
        return true;
    }

    else {
        return false;
    }
}

function isClickInside(button, mouse) {
     return button.x <= mouse.x && button.x + button.width >= mouse.x && button.y <= mouse.y && button.y + button.height >= mouse.y;
}

function update() {
    if(!data.gameOver) {
        data.hero.update();
        data.enemies.forEach(enemy => {
            if(intersect(data.hero, enemy)) {
                GameState.gameOverSound.currentTime = 0;
                GameState.gameOverSound.play();
                data.gameOver = true;
            }
            enemy.update();
        });

        data.enemies = data.enemies.filter(enemy => {
            return !enemy.deleteMe;
        });

        if(data.enemies.length === 0) {
            data.enemySpeedController++;
            if(data.enemySpeedController === 3) {
                data.enemySpeedController = 0;
                data.enemySpeed += 0.3;
            } 
            data.enemies = [
                new Enemy(GameState.randomPosition[random(0, 2)], GameState.randomBorder[random(0, 1)], data.enemySpeed),
                new Enemy(GameState.randomBorder[random(0, 1)], GameState.randomPosition[random(0, 2)], data.enemySpeed)
            ];
        }
    }
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(gameBackgroundImage, 0, 0, canvas.width, canvas.height);
    context.drawImage(logo, 945, 5, 50, 50);
    if(!data.gameOver) {
        context.font = "30px Comic Sans MS";
        context.fillStyle = "red";
        context.textAlign = 'start';
        context.fillText(`Score: ${data.score}`, 10, 30);
        context.drawImage(GameState.netImg, 200, 200, 600, 600);
        data.coin.render();
        data.hero.render();
        data.enemies.forEach(enemy => {
            enemy.render();
        });

        if(data.coin._x - data.hero._x === 15 && data.coin._y - data.hero._y === 15) {
            data.coin.playSound();
            data.coin = new Coin(data.hero._x + 75, data.hero._y + 75);
            data.score++;
        }
    }
    else {
        context.font = "30px Comic Sans MS";
        context.fillStyle = "red";
        context.textAlign = "center";
        context.fillText("Game Over", canvas.width/2, canvas.height/2 - 50);
        context.fillText(`Score: ${data.score}`, canvas.width/2, canvas.height/2);
        context.drawImage(GameState.playAgain, 480, 520, 50, 50);
    }
}

function loop() {
    requestAnimationFrame(loop);
    update();
    render();
}

document.addEventListener('keydown', e => {
    if(e.key === 'ArrowUp') {
        data.hero.moveUp();
    }
    else if(e.key === 'ArrowRight') {
        data.hero.moveRight();
    }
    else if(e.key === 'ArrowDown') {
        data.hero.moveDown();
    }
    else if(e.key === 'ArrowLeft') {
        data.hero.moveLeft();
    }
    else if(e.key === ' ' || e.key === 'Enter' && data.gameOver) {
        data = new GameState();
    }
});

canvas.addEventListener('click', e => {
    const x = e.clientX - ((document.body.clientWidth - 1000) / 2);
    const y = e.clientY - ((document.body.clientHeight - 1000) / 2);
    if(data.gameOver) {
        const button = {
            x: 480,
            y: 520,
            width: 50,
            height: 50
        }
        if(isClickInside(button, {x, y})){
            data = new GameState()
        }
    }
})

loop();