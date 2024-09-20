// Header
<link href="https://ghosthub.boo/assets/pong-game/style.css" rel="stylesheet">

// Footer
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.4/p5.min.js" integrity="sha512-d6sc8kbZEtA2LwB9m/ck0FhvyUwVfdmvTeyJRprmj7Wg9wRFtHDIpr6qk4g/y3Ix3O9I6KHIv6SGu9f7RaP1Gw==" crossorigin="anonymous" referrerpolicy="no-referrer"></script> 

<script>
   
  var values = {
    dataAttr: 'pong-game', //code block attribute
    canvaBackground: "#111111",
    winMessage: "Yay! You won. :)",
    lostMessage: "Oh, no! You lost.",
    playAgainText: "Click here to play again.",
    playAgainFontSize: 12,
    wonOrLostMessagesFontSize: 20,
    scoresFontSize: 20,
    messagesColor: "#fff",
    ballSize: 17,
    ballColor: "#fff",
    paddleColor: "#fff",
    paddleHeight: 130,
    paddleThickness: 15,
    canvasHeight: 90,  // Fixed height
    ballSpeedX: 5,
    ballSpeedY: 3
};

function getParentEl(el, tagName) {
    let searchEl = el;
    while (searchEl.parentElement) {
        if (searchEl.parentElement.tagName.toLowerCase() === tagName.toLowerCase()) {
            return searchEl.parentElement;
        }
        searchEl = searchEl.parentElement;
    }
    return null;
}

function setAttrParents(attr, tag) {
    let list = document.querySelectorAll(`[${values.dataAttr}]`);
    list.forEach((el) => {
        const tagEl = getParentEl(el, tag);
        if (!tagEl) {
            return;
        }
        tagEl.setAttribute(attr, '');
    });
}

setAttrParents(values.dataAttr, 'section');

const section = document.querySelector(`section[${values.dataAttr}]`);
section.setAttribute('id', 'gameContainer');
section.style.minHeight = '0';

var ballX = 40, ballY = 5, player1Score = 0, player2Score = 0;
const WINNING_SCORE = 3;
var showingWinScreen = false, paddle1Y, paddle2Y;
var PADDLE_HEIGHT = values.paddleHeight, PADDLE_THICKNESS = values.paddleThickness;
var ballSize = values.ballSize;
var ballSpeedX = values.ballSpeedX, ballSpeedY = values.ballSpeedY;

function setup() {
    const canvasHeight = window.innerHeight * (values.canvasHeight / 100);
    let canvas = createCanvas(section.clientWidth, canvasHeight);
    canvas.parent('gameContainer');
    paddle2Y = height / 2 - PADDLE_HEIGHT / 2;
    textAlign(CENTER);
    adjustCanvasWidth();  // Initial adjustment
}

function adjustCanvasWidth() {
    let gameContainer = document.getElementById('gameContainer');
    let containerWidth = gameContainer.offsetWidth;
    resizeCanvas(containerWidth, height);
    adjustElements();  // Adjust elements based on new width
}

function adjustElements() {
    let screenSizeFactor = width / 800; // assuming 800 as the base width
    PADDLE_HEIGHT = values.paddleHeight * screenSizeFactor;
    PADDLE_THICKNESS = values.paddleThickness * screenSizeFactor;
    ballSize = values.ballSize * screenSizeFactor;
    ballSpeedX = values.ballSpeedX * screenSizeFactor;
    ballSpeedY = values.ballSpeedY * screenSizeFactor;
    values.playAgainFontSize = 12 * screenSizeFactor;
    values.wonOrLostMessagesFontSize = 20 * screenSizeFactor;
    values.scoresFontSize = 20 * screenSizeFactor;
}

function windowResized() {
    adjustCanvasWidth(); // Adjust width on window resize
}

function draw() {
    background(`${values.canvaBackground}`);
    moveEverything();
    drawEverything();
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;
    paddle1Y = mouseY - PADDLE_HEIGHT / 2;
    computerMovement();

    var b = 0.2;

    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
            ballSpeedX *= -1;
            var a = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
            ballSpeedY = a * b;
        } else {
            player2Score++;
            ballReset();
        }
    }

    if (ballX > width) {
        if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
            ballSpeedX *= -1;
            var a = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = a * b;
        } else {
            player1Score++;
            ballReset();
        }
    }

    if (ballY > height) {
        ballY = height;
        ballSpeedY *= -1;
    }

    if (ballY < 0) {
        ballY = 0;
        ballSpeedY *= -1;
    }
}

function computerMovement() {
    var a = paddle2Y + PADDLE_HEIGHT / 2;
    if (a < ballY - PADDLE_HEIGHT / 3) {
        paddle2Y += 6;
    } else if (a > ballY + PADDLE_HEIGHT / 3) {
        paddle2Y -= 6;
    }
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }
    ballSpeedX *= -1;
    ballX = width / 3;
    ballY = height / 3;
}

function drawEverything() {
    fill(values.messagesColor);
    noStroke();

    if (showingWinScreen) {
        textSize(values.wonOrLostMessagesFontSize);
        if (player1Score >= WINNING_SCORE) {
            text(`${values.winMessage}`, width / 2, height / 2);
        } else if (player2Score >= WINNING_SCORE) {
            text(values.lostMessage, width / 2, height / 2);
        }
        textSize(values.playAgainFontSize);
        text(`${values.playAgainText}`, width / 2, height - 200);
        return;
    }

    fill(values.paddleColor);
    for (var a = 0; a < height; a += 40) {
        rect(width / 2 - 1, a, 2, 20);
    }

    rect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT);
    rect(width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT);
    fill(`${values.ballColor}`);
    ellipse(ballX, ballY, ballSize, ballSize);
    textSize(values.scoresFontSize);
    text(player1Score, width / 4, 100);
    text(player2Score, width * 3 / 4, 100);
}

function mouseReleased() {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

</script>

<style>#defaultCanvas0{z-index:8!important;height:auto!important;width:100%!important;position:relative!important;}.layer-front .sqs-slide-layer-content{z-index:999999!important}</style>
<style>
  #gameContainer .content-wrapper, #gameContainer .section-border {
    	display: none;
    }
</style>
