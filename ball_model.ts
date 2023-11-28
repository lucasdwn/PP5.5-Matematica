let my_screen = document.getElementById('game_screen') as HTMLCanvasElement;
const context = my_screen.getContext('2d') as CanvasRenderingContext2D;
let collisionSound = new Audio('collision.wav');
let gameoverSound = new Audio('gameover.mp3');

let centerX = my_screen.width / 2;
let centerY = my_screen.height / 2;

let baseX = my_screen.width / 2;
const baseY = my_screen.height - 20;
const baseWidth = 100;

let score = 0;
let gameRunning = false;
let ballColor = getRandomColor();

function draw_circle(x: number, y: number) {
    const radius = my_screen.height / 10;
    context.clearRect(0, 0, my_screen.width, my_screen.height);
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = ballColor;
    context.fill();
}

function draw_base(x: number) {
    context.fillStyle = 'blue';
    context.fillRect(x - baseWidth / 2, baseY, baseWidth, 10);
}


let isMovingLeft = false;
let isMovingRight = false;

document.addEventListener('keydown', function (event) {
    var name = event.key;
    if (name == 'ArrowRight') {
        isMovingRight = true;
    } else if (name == 'ArrowLeft') {
        isMovingLeft = true;
    }
});

document.addEventListener('keyup', function (event) {
    var name = event.key;
    if (name == 'ArrowRight') {
        isMovingRight = false;
    } else if (name == 'ArrowLeft') {
        isMovingLeft = false;
    }
});

function updateBasePosition() {
    if (isMovingRight && baseX < my_screen.width - baseWidth / 2) {
        baseX += 5;
    } else if (isMovingLeft && baseX > baseWidth / 2) {
        baseX -= 5;
    }
}

let particles: { x: number; y: number; vx: number; vy: number; color: string; lifetime: number }[] = [];
const particleCount = 20;
const particleLifetime = 30;

function draw_particles() {
    for (let i = 0; i < particles.length; i++) {
        context.beginPath();
        context.arc(particles[i].x, particles[i].y, 3, 0, 2 * Math.PI);
        context.fillStyle = particles[i].color;
        context.fill();

        particles[i].x += particles[i].vx;
        particles[i].y += particles[i].vy;

        particles[i].lifetime--;

        if (particles[i].lifetime <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
}


function clearOldParticles() {
    particles = particles.filter(p => p.lifetime > 0);
}



function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createExplosion(x: number, y: number) {
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: x,
            y: y,
            vx: Math.random() * 2 - 1,
            vy: Math.random() * 2 - 1,
            color: getRandomColor(),
            lifetime: particleLifetime,
        });
    }
}


function checkCollision() {
    if (
        centerX >= baseX - baseWidth / 2 &&
        centerX <= baseX + baseWidth / 2 &&
        centerY + my_screen.height / 10 >= baseY
    ) {

        score += 10;

        collisionSound.play();

        ballColor = getRandomColor();

        createExplosion(centerX, baseY);

        centerX = Math.random() * (my_screen.width - my_screen.height / 10);
        centerY = 0;
    }
}

function draw() {
    if (!gameRunning) return;

    draw_circle(centerX, centerY);
    draw_base(baseX);
    draw_particles();
    checkCollision();

    updateBasePosition();

    if (centerY < my_screen.height) {
        centerY += 2;
    } else {
        gameRunning = false;
        gameoverSound.play();
    }

    clearOldParticles();

    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.innerText = `Score: ${score}`;
    }

    if (gameRunning) {
        requestAnimationFrame(draw);
    } else {
        context.fillStyle = 'red';
        context.font = '30px Arial';
        context.fillText('Game Over', my_screen.width / 2 - 80, my_screen.height / 2);
    }
}


let my_button = document.getElementById('redraw_button') as HTMLElement;
my_button.onclick = function () {

    baseX = my_screen.width / 2;
    score = 0;
    gameRunning = true;

    centerX = Math.random() * (my_screen.width - my_screen.height / 10);
    centerY = 0;

    draw();
};

document.onkeydown = function (event) {
    var name = event.key;
    if (name == 'ArrowRight' && baseX < my_screen.width - baseWidth / 2) {
        baseX += 10;
    } else if (name == 'ArrowLeft' && baseX > baseWidth / 2) {
        baseX -= 10;
    }
};
