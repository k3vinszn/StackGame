const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const mainMenu = document.getElementById('mainMenu');
const scoreDiv = document.getElementById('score');

const playButton = document.getElementById('playButton');
const quitButton = document.getElementById('quitButton');

// Function to resize the canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Event listener for window resize
window.addEventListener('resize', resizeCanvas);

// Initial resizing of the canvas
resizeCanvas();

let objects = [];
let score = 0;
let gameOver = false;
let keys = {};

playButton.addEventListener('click', startGame);
quitButton.addEventListener('click', () => window.close());

class GameObject {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.velocity = 2;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.velocity;
        this.draw();
    }
}

class Character {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x + this.width < canvas.width) {
            this.x += this.speed;
        }
        this.draw();
    }
}

const character = new Character(canvas.width / 2 - 25, canvas.height - 30, 50, 20, 'blue');

function spawnObject() {
    const width = Math.random() * 50 + 50;
    const height = 20;
    const x = Math.random() * (canvas.width - width);
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    objects.push(new GameObject(x, 0, width, height, color));
}

function detectCollision(object) {
    if (object.y + object.height >= canvas.height) {
        if (object.y + object.height >= character.y &&
            object.x < character.x + character.width &&
            object.x + object.width > character.x) {
            return true; // Collides with character
        }
        return false; // No collision
    }
    if (object.y + object.height >= character.y &&
        object.x < character.x + character.width &&
        object.x + object.width > character.x) {
        return true; // Collides with character
    }
    return false; // No collision
}

function updateScore() {
    scoreElement.textContent = score;
}

function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    character.update();

    if (Math.random() < 0.01) {
        spawnObject();
    }

    for (let i = 0; i < objects.length; i++) {
        objects[i].update();
        if (detectCollision(objects[i])) {
            if (objects[i].y + objects[i].height >= character.y) {
                score++;
                updateScore();
            }
            objects.splice(i, 1);
            i--;
        }
    }

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function startGame() {
    mainMenu.style.display = 'none';
    scoreDiv.style.display = 'block';
    canvas.style.display = 'block';
    score = 0;
    gameOver = false;
    objects = [];
    updateScore();
    gameLoop();
}
