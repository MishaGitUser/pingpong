const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.9;

const paddleWidth = 100; // Ширина изображения ракетки
const paddleHeight = 200; // Высота изображения ракетки
const ballSize = 10; // Радиус мяча
const paddleSpeed = 5;
const ballSpeed = 3;
const borderWidth = 10; // Ширина границы

const playerImage = new Image();
const aiImage = new Image();

playerImage.src = 'ruslan.jpg'; // Путь к изображению ракетки игрока
aiImage.src = 'artem.jpg'; // Путь к изображению ракетки ИИ

let playerPaddle = { x: 10, y: canvas.height / 2 - paddleHeight / 2 };
let aiPaddle = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight / 2 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, dx: ballSpeed, dy: ballSpeed };

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw border
    ctx.strokeStyle = '#fff'; // Цвет границы
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.drawImage(playerImage, playerPaddle.x, playerPaddle.y, paddleWidth, paddleHeight);
    ctx.drawImage(aiImage, aiPaddle.x, aiPaddle.y, paddleWidth, paddleHeight);
    
    // Draw ball
    ctx.fillStyle = '#fff'; // Цвет мяча
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2); // Рисуем круг
    ctx.fill();
    
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top/bottom walls
    if (ball.y + ballSize > canvas.height - borderWidth || ball.y - ballSize < borderWidth) {
        ball.dy = -ball.dy;
    }
    
    // Ball collision with paddles
    if (ball.x - ballSize < playerPaddle.x + paddleWidth && ball.y > playerPaddle.y && ball.y < playerPaddle.y + paddleHeight) {
        ball.dx = -ball.dx;
    }
    if (ball.x + ballSize > aiPaddle.x && ball.y > aiPaddle.y && ball.y < aiPaddle.y + paddleHeight) {
        ball.dx = -ball.dx;
    }
    
    // AI paddle movement
    if (ball.y > aiPaddle.y + paddleHeight / 2) {
        aiPaddle.y += paddleSpeed;
    } else {
        aiPaddle.y -= paddleSpeed;
    }
    
    // Player paddle movement
    document.addEventListener('mousemove', (event) => {
        let mouseY = event.clientY - canvas.getBoundingClientRect().top;
        playerPaddle.y = Math.min(Math.max(mouseY - paddleHeight / 2, 0 + borderWidth), canvas.height - paddleHeight - borderWidth);
    });
    
    // Reset ball if it goes off the sides
    if (ball.x < borderWidth || ball.x > canvas.width - borderWidth) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    }
}

function update() {
    draw();
    requestAnimationFrame(update);
}

// Ensure images are loaded before starting the game
let imagesLoaded = 0;
const totalImages = 2; // Обновляем количество загружаемых изображений

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        update();
    }
}

playerImage.onload = imageLoaded;
aiImage.onload = imageLoaded;
