const game = document.getElementById("game");
const scoreBoard = document.getElementById("scoreBoard");
const message = document.getElementById("message");

const gameWidth = 800;
const gameHeight = 600;
const ballSize = 40;

let balls = [];

const ballImageURL = "https://i.imgur.com/O6aQ8YQ.png";

const paddle = document.createElement("div");
paddle.id = "paddle";
game.appendChild(paddle);

const paddleWidth = 150;
const paddleHeight = 20;
let paddleX = (gameWidth - paddleWidth) / 2;
const paddleY = gameHeight - paddleHeight - 10;

let score = 0;
let gameOver = false;

game.addEventListener("mousemove", (e) => {
  if(gameOver) return;
  const rect = game.getBoundingClientRect();
  let x = e.clientX - rect.left;
  paddleX = x - paddleWidth / 2;

  if (paddleX < 0) paddleX = 0;
  if (paddleX + paddleWidth > gameWidth) paddleX = gameWidth - paddleWidth;

  paddle.style.left = paddleX + "px";
});

function createBall(x, y, vx, vy) {
  const ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.backgroundImage = `url(${ballImageURL})`;
  ball.style.left = x + "px";
  ball.style.top = y + "px";

  return { element: ball, x, y, vx, vy };
}

function init() {
  balls.forEach(b => game.removeChild(b.element));
  balls = [];

  let startX = gameWidth / 2 - ballSize / 2;
  let startY = gameHeight / 2 - ballSize / 2;
  let initialBall = createBall(startX, startY, 3, -3);
  balls.push(initialBall);
  game.appendChild(initialBall.element);

  score = 0;
  updateScore();
  message.textContent = "";
  gameOver = false;
  paddle.style.left = paddleX + "px";
}

function updateScore() {
  scoreBoard.textContent = `分數：${score}`;
}

function endGame(win = false) {
  gameOver = true;
  if(win) {
    message.textContent = "恭喜！你已通關！🎉";
  } else {
    message.textContent = "遊戲結束！球全部消失！";
  }
}

function gameLoop() {
  if(gameOver) return;

  balls.forEach((ball) => {
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x <= 0 || ball.x + ballSize >= gameWidth) {
      ball.vx = -ball.vx;
      ball.x = ball.x <= 0 ? 0 : gameWidth - ballSize;
    }

    if (ball.y <= 0) {
      ball.vy = -ball.vy;
      ball.y = 0;
    }

    if (
      ball.y + ballSize >= paddleY &&
      ball.y + ballSize <= paddleY + paddleHeight &&
      ball.x + ballSize > paddleX &&
      ball.x < paddleX + paddleWidth &&
      ball.vy > 0
    ) {
      ball.vy = -ball.vy;
      score++;
      updateScore();

      let newBalls = [];
      balls.forEach((b) => {
        let b1 = createBall(b.x, b.y, b.vx, -b.vy);
        let b2 = createBall(b.x, b.y, -b.vx, -b.vy);
        newBalls.push(b1, b2);

        game.appendChild(b1.element);
        game.appendChild(b2.element);

        game.removeChild(b.element);
      });
      balls = newBalls;
    }

    // 球掉到底部，移除該球
    if (ball.y > gameHeight) {
      game.removeChild(ball.element);
      balls = balls.filter(b => b !== ball);
    }

    ball.element.style.left = ball.x + "px";
    ball.element.style.top = ball.y + "px";
  });

  // 判斷遊戲結束條件
  if (balls.length === 0) {
    endGame(false);
  } else if (score >= 507) {
    endGame(true);
  } else {
    requestAnimationFrame(gameLoop);
  }
}

init();
gameLoop();