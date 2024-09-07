
const canvas = document.getElementById("game-area");
const context = canvas.getContext("2d");

function drawRectangle(x, y, w, h, color) {
  context.fillStyle = color;
  context.fillRect(x, y, w, h);
}

// User game paddle information
const userPaddle = {
  x: 10,
  y: canvas.height / 2 - 50 / 2,
  width: 12,
  height: 80,
  color: "white",
  score: 0,
};

// Computer paddle
const computerPaddle = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 50 / 2,
  width: 12,
  height: 80,
  color: "white",
  score: 0,
};

// Center line
function centerLine() {
  context.beginPath();
  context.setLineDash([10]);
  context.moveTo(canvas.width / 2, 0);
  context.lineTo(canvas.width / 2, canvas.height);
  context.strokeStyle = "white";
  context.stroke();
}

// Draw a circle
function drawCircle(x, y, r, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}

// Create a ball
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  speed: 1,
  velocityX: 5,
  velocityY: 5,
  color: "black",
};

// Scores
function drawText(text, x, y, color) {
  context.fillStyle = color;
  context.font = "32px josefin sans";
  context.fillText(text, x, y);
}

// Render the game
function renderGame() {
  // Make canvas
  drawRectangle(0, 0, canvas.width, canvas.height, "#ff7373");

  // User paddle
  drawRectangle(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);

  // Computer paddle
  drawRectangle(computerPaddle.x, computerPaddle.y, computerPaddle.width, computerPaddle.height, computerPaddle.color);

  // Center line
  centerLine();

  // Create a ball
  drawCircle(ball.x, ball.y, ball.radius, ball.color);

  // Scores of user and com
  drawText(userPaddle.score, canvas.width / 2 - 50, 50);
  drawText(computerPaddle.score, canvas.width / 2 + 20, 50);
}

// Control the user paddle
canvas.addEventListener("mousemove", movePaddle);
function movePaddle(e) {
  let rect = canvas.getBoundingClientRect();
  userPaddle.y = e.clientY - rect.top - userPaddle.height / 2;
}

// Collision detection
function collision(ball, paddle) {
  ball.top = ball.y - ball.radius;
  ball.bottom = ball.y + ball.radius;
  ball.left = ball.x - ball.radius;
  ball.right = ball.x + ball.radius;

  paddle.top = paddle.y;
  paddle.bottom = paddle.y + paddle.height;
  paddle.left = paddle.x;
  paddle.right = paddle.x + paddle.width;

  return (
    paddle.right > ball.left && paddle.left < ball.right && ball.bottom > paddle.top && ball.top < paddle.bottom
  );
}

// Reset ball
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  ball.speed = 1;
  ball.velocityX = -ball.velocityX;
}

// Game over function
function showGameOver() {
 
  const winner = userPaddle.score > computerPaddle.score ? "User" : "Computer";


  const winMessage = document.getElementById("win");
  winMessage.textContent = `${winner} Wins! Play again`;
  winMessage.style="display:block"

 
  canvas.style.display = "none";
  document.querySelector(".user-name").style="display:none"
   document.querySelector(".comp-name").style="display:none"


  const result = document.getElementById("result");
  result.style.display = "block";
}

// Update the game
function updateGame() {
  ball.x += ball.velocityX * ball.speed;
  ball.y += ball.velocityY * ball.speed;

  // Control the computer paddle
  let computerLevel = 0.2;
  computerPaddle.y += (ball.y - (computerPaddle.y + computerPaddle.height / 2)) * computerLevel;

  // Reflect from walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.velocityY = -ball.velocityY;
  }

  // If collision happens
  let player = ball.x < canvas.width / 2 ? userPaddle : computerPaddle;
  if (collision(ball, player)) {
    ball.velocityX = -ball.velocityX;
    ball.speed += 0.1;
  }


  if (ball.x - ball.radius < 0) {
    computerPaddle.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    userPaddle.score++;
    resetBall();
  }

  // Game over
  if (userPaddle.score > 4 || computerPaddle.score > 4) {
    clearInterval(gameLoop);
    showGameOver();
  }
}


const gameLoop = setInterval(() => {
  updateGame();
  renderGame();
}, 20);
