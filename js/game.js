import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDn6WbXzDYx-gZ1KInvzGD1bkLGdHdt9h0",
    authDomain: "login-with-firebase-data-84ad9.firebaseapp.com",
    projectId: "login-with-firebase-data-84ad9",
    storageBucket: "login-with-firebase-data-84ad9.appspot.com",
    messagingSenderId: "939532832658",
    appId: "1:939532832658:web:df10ae63062aabf692fb4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Game variables
let canvas, ctx;
let dino, obstacles;
let gameLoop;
let score = 0;
let highScore = 0;
let isJumping = false;
let isDucking = false;
let gameSpeed = 5;
let spawnTimer = 0;
let userId = null;

// Initialize game
function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 300;

    dino = {
        x: 50,
        y: canvas.height - 60,
        width: 40,
        height: 60,
        velocity: 0,
        gravity: 0.8,
        jumpForce: -15
    };

    obstacles = [];
    score = 0;
    updateScore();
}

// Game loop
function gameUpdate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update dino
    if (isJumping) {
        dino.y += dino.velocity;
        dino.velocity += dino.gravity;
        
        if (dino.y > canvas.height - 60) {
            dino.y = canvas.height - 60;
            isJumping = false;
            dino.velocity = 0;
        }
    }
    
    // Update obstacles
    spawnTimer++;
    if (spawnTimer > 60) {
        spawnObstacle();
        spawnTimer = 0;
    }
    
    obstacles = obstacles.filter(obstacle => {
        obstacle.x -= gameSpeed;
        return obstacle.x > -obstacle.width;
    });
    
    // Check collisions
    if (checkCollisions()) {
        gameOver();
        return;
    }
    
    // Draw everything
    drawDino();
    obstacles.forEach(drawObstacle);
    
    // Update score
    score++;
    updateScore();
    
    gameLoop = requestAnimationFrame(gameUpdate);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !isJumping) {
        jump();
    } else if (e.code === 'ArrowDown') {
        duck(true);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') {
        duck(false);
    }
});

document.getElementById('startButton').addEventListener('click', startGame);

// Game functions
function jump() {
    if (!isJumping) {
        isJumping = true;
        dino.velocity = dino.jumpForce;
    }
}

function duck(isDucking) {
    if (isDucking) {
        dino.height = 30;
        dino.y = canvas.height - 30;
    } else {
        dino.height = 60;
        dino.y = canvas.height - 60;
    }
}

function spawnObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 40,
        width: 20,
        height: 40
    });
}

function checkCollisions() {
    return obstacles.some(obstacle => {
        return (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        );
    });
}

function drawDino() {
    ctx.fillStyle = '#333';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
}

function drawObstacle(obstacle) {
    ctx.fillStyle = '#666';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

function updateScore() {
    document.getElementById('currentScore').textContent = Math.floor(score / 10);
}

async function gameOver() {
    cancelAnimationFrame(gameLoop);
    const finalScore = Math.floor(score / 10);
    
    if (userId && finalScore > highScore) {
        highScore = finalScore;
        document.getElementById('highScore').textContent = highScore;
        
        // Update score in Firebase
        try {
            await setDoc(doc(db, 'users', userId), {
                highScore: highScore,
                lastPlayed: new Date().toISOString()
            }, { merge: true });

            await setDoc(doc(db, 'scores', userId), {
                score: highScore,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating score:', error);
        }
    }
}

function startGame() {
    initGame();
    gameLoop = requestAnimationFrame(gameUpdate);
}

// Check authentication and load user data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        userId = user.uid;
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            highScore = userData.highScore || 0;
            document.getElementById('highScore').textContent = highScore;
            document.getElementById('loggedUserName').textContent = userData.firstName || 'Player';
        }
    } else {
        window.location.href = 'index.html';
    }
});