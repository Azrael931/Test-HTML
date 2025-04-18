const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

const paddleWidth = 10;
const paddleHeight = 60;
const ballSize = 8;

let playerScore = 0;
let computerScore = 0;

const player = {
    y: canvas.height / 2 - paddleHeight / 2,
    speed: 0
};

const computer = {
    y: canvas.height / 2 - paddleHeight / 2,
    speed: 4
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    speedX: 2,
    speedY: 2
};

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

function updateGame() {
    // Déplacement de la balle
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Collision avec les murs (haut/bas)
    if (ball.y + ballSize > canvas.height || ball.y - ballSize < 0) {
        ball.speedY = -ball.speedY;
    }

    // IA de l'ordinateur
    if (ball.x > canvas.width / 2) {
        if (computer.y + paddleHeight / 2 < ball.y) {
            computer.y += computer.speed;
        } else {
            computer.y -= computer.speed;
        }
    }

    // Collision avec les raquettes
    // Raquette du joueur
    if (ball.x - ballSize < paddleWidth &&
        ball.y > player.y &&
        ball.y < player.y + paddleHeight) {
        ball.speedX = -ball.speedX;
    }

    // Raquette de l'ordinateur
    if (ball.x + ballSize > canvas.width - paddleWidth &&
        ball.y > computer.y &&
        ball.y < computer.y + paddleHeight) {
        ball.speedX = -ball.speedX;
    }

    // Points
    if (ball.x < 0) {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
        resetBall();
    }
    if (ball.x > canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = -ball.speedX;
}

function gameLoop() {
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner les éléments
    drawRect(0, player.y, paddleWidth, paddleHeight, 'white'); // Raquette joueur
    drawRect(canvas.width - paddleWidth, computer.y, paddleWidth, paddleHeight, 'white'); // Raquette ordinateur
    drawBall(ball.x, ball.y, ballSize, 'white'); // Balle

    updateGame();
    requestAnimationFrame(gameLoop);
}

// Contrôles du joueur
document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    player.y = Math.max(0, Math.min(canvas.height - paddleHeight, mouseY));
});

// Démarrer le jeu
gameLoop();