// Game settings
const canvas = document.getElementById("snakeGameCanvas");
const ctx = canvas.getContext("2d");
const box = 20; // Size of each box in the grid
let snake = [{ x: 9 * box, y: 9 * box }]; // Initial position of the snake
let direction; // Snake direction
let food; // Food position
let game; // Game interval
let appleCount = 0; // Counter for apples eaten
let personalRecord = localStorage.getItem("personalRecord") || 0; // Personal record
let gameOver = false; // Game over flag

// Update displayed personal record
document.getElementById("personalRecord").innerText = "Personal Record: " + personalRecord;

// Function to spawn food
function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

// Start the game
function startGame() {
    document.getElementById("snakeGameCanvas").style.display = "block"; // Show canvas
    document.getElementById("gameOverMessage").style.display = "none"; // Hide game over message
    gameOver = false; // Reset game over flag
    snake = [{ x: 9 * box, y: 9 * box }]; // Reset snake position
    direction = undefined; // Reset direction
    appleCount = 0; // Reset apple counter
    document.getElementById("appleCounter").innerText = "Apples Eaten: " + appleCount; // Reset apple counter display
    clearInterval(game); // Clear any previous game loop
    spawnFood(); // Spawn the first food
    document.addEventListener("keydown", changeDirection); // Listen for key presses
    game = setInterval(draw, 100); // Start the game loop
}

// Draw everything on the canvas
function draw() {
    if (gameOver) return; // Stop drawing if the game is over
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw food
    ctx.fillStyle = "red"; // Food color
    ctx.fillRect(food.x, food.y, box, box);

    // Move snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    // Check if snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        spawnFood(); // Spawn new food
        appleCount++; // Increment apple count
        document.getElementById("appleCounter").innerText = "Apples Eaten: " + appleCount; // Update display
    } else {
        snake.pop(); // Remove the tail
    }

    // Add new head
    const newHead = { x: snakeX, y: snakeY };

    // Game over conditions
    if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
        gameOver = true; // Set game over flag
        clearInterval(game); // Stop the game loop
        document.getElementById("gameOverMessage").style.display = "block"; // Show game over message

        // Update personal record if needed
        if (appleCount > personalRecord) {
            personalRecord = appleCount; // Update personal record
            localStorage.setItem("personalRecord", personalRecord); // Store new personal record
            document.getElementById("personalRecord").innerText = "Personal Record: " + personalRecord; // Update displayed record
        }
        return;
    }

    snake.unshift(newHead); // Add new head to the snake

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i % 2 === 0) ? "#007BFF" : "#1C1C1C"; // Colore alternato per i segmenti del serpente
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "black"; // Snake outline
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
}

// Function to check for collision with itself
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true; // Collision occurred
        }
    }
    return false; // No collision
}

// Function to change the direction of the snake based on key press
function changeDirection(event) {
    event.preventDefault(); // Prevent default arrow key behavior (scrolling)
    if (event.keyCode === 37 && direction !== "RIGHT") direction = "LEFT"; // Left arrow
    else if (event.keyCode === 38 && direction !== "DOWN") direction = "UP"; // Up arrow
    else if (event.keyCode === 39 && direction !== "LEFT") direction = "RIGHT"; // Right arrow
    else if (event.keyCode === 40 && direction !== "UP") direction = "DOWN"; // Down arrow
    else if (event.keyCode === 13 && gameOver) startGame(); // Enter to restart
    else if (event.keyCode === 27) window.location.href = "../index.html"; // ESC to exit to main page
}

// Restart the game on button click
document.getElementById("restartButton").onclick = function() {
    startGame(); // Restart the game
};

// Start the game on page load
startGame();