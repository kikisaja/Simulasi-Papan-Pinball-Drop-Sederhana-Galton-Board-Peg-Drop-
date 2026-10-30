// --- ELEMENT & CANVAS SETUP ---
const canvas = document.getElementById("pinball-canvas");
const ctx = canvas.getContext("2d");

const ballCountEl = document.getElementById("ball-count");
const totalScoreEl = document.getElementById("total-score");
const btnDrop = document.getElementById("btn-drop");
const btnReset = document.getElementById("btn-reset");

// --- GAME CONFIG & CONSTANTS ---
const GRAVITY = 0.25;
const BOUNCE = 0.55;
const PEG_RADIUS = 6;
const BALL_RADIUS = 8;

let totalBallsDropped = 0;
let totalScore = 0;

let balls = [];
let pegs = [];
let slots = [];

// Nilai Skor Tiap Kantung (Simetris)
const slotScores = [10, 50, 100, 250, 100, 50, 10];
const slotColors = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#facc15", "#fb923c", "#f87171"];

// --- 1. INISIALISASI PAKU (PEGS) DAN KANTUNG (SLOTS) ---
function initBoard() {
    pegs = [];
    slots = [];

    const rows = 6;
    const startY = 70;
    const rowSpacing = 42;
    const colSpacing = 44;

    // Generate Pegs dalam pola Segitiga / Selang-Seling
    for (let r = 0; r < rows; r++) {
        const count = r + 3;
        const startX = (canvas.width - (count - 1) * colSpacing) / 2;

        for (let c = 0; c < count; c++) {
            pegs.push({
                x: startX + c * colSpacing,
                y: startY + r * rowSpacing
            });
        }
    }

    // Generate Kantung Skor (Slots) di Bagian Bawah
    const slotWidth = canvas.width / slotScores.length;
    const slotY = canvas.height - 50;

    for (let i = 0; i < slotScores.length; i++) {
        slots.push({
            x: i * slotWidth,
            y: slotY,
            width: slotWidth,
            height: 50,
            score: slotScores[i],
            color: slotColors[i]
        });
    }
}

// --- 2. KELAS BOLA (BALL CLASS) ---
class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 1.5; // Sedikit simpangan horizontal acak
        this.vy = 0;
        this.radius = BALL_RADIUS;
        this.color = "#f472b6"; // Merah muda pop
        this.isDone = false;
    }

    update() {
        if (this.isDone) return;

        // Terapkan Gravitasi
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;

        // Pantulan Dinding Samping
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -BOUNCE;
        } else if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -BOUNCE;
        }

        // Cek Tabrakan dengan Paku (Pegs)
        pegs.forEach((peg) => {
            const dx = this.x - peg.x;
            const dy = this.y - peg.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < this.radius + PEG_RADIUS) {
                // Hitung Sudut Pantulan Fisika Lingkaran
                const angle = Math.atan2(dy, dx);
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy) * BOUNCE;

                // Berikan sedikit dorongan acak agar hasil bervariasi
                const randomAngle = angle + (Math.random() - 0.5) * 0.2;

                this.vx = Math.cos(randomAngle) * (speed + 0.5);
                this.vy = Math.sin(randomAngle) * (speed + 0.5);

                // Geser bola keluar dari paku agar tidak menempel
                this.x = peg.x + Math.cos(angle) * (this.radius + PEG_RADIUS + 1);
                this.y = peg.y + Math.sin(angle) * (this.radius + PEG_RADIUS + 1);
            }
        });

        // Cek Masuk Kantung Skor
        if (this.y + this.radius >= canvas.height - 50) {
            this.isDone = true;
            this.calculateScore();
        }
    }

    calculateScore() {
        // Cari kantung di mana bola mendarat
        slots.forEach((slot) => {
            if (this.x >= slot.x && this.x <= slot.x + slot.width) {
                totalScore += slot.score;
                totalScoreEl.textContent = totalScore;
            }
        });
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0f172a";
        ctx.stroke();
        ctx.closePath();
    }
}

// --- 3. RENDERING & ANIMATION LOOP ---
function drawBoard() {
    // Gambar Paku (Pegs)
    pegs.forEach((peg) => {
        ctx.beginPath();
        ctx.arc(peg.x, peg.y, PEG_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        ctx.closePath();
    });

    // Gambar Kantung Skor (Slots)
    slots.forEach((slot) => {
        ctx.fillStyle = slot.color;
        ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0f172a";
        ctx.strokeRect(slot.x, slot.y, slot.width, slot.height);

        // Teks Skor Kantung
        ctx.fillStyle = "#0f172a";
        ctx.font = "900 12px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`+${slot.score}`, slot.x + slot.width / 2, slot.y + 30);
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBoard();

    // Update dan Gambar Semua Bola
    balls.forEach((ball) => {
        ball.update();
        ball.draw();
    });

    // Hapus bola yang sudah mendarat setelah beberapa saat
    balls = balls.filter((ball) => !ball.isDone);

    requestAnimationFrame(animate);
}

// --- 4. EVENT LISTENERS ---
btnDrop.addEventListener("click", () => {
    // Release Bola dari Tengah Atas
    const spawnX = canvas.width / 2 + (Math.random() - 0.5) * 10;
    balls.push(new Ball(spawnX, 25));

    totalBallsDropped++;
    ballCountEl.textContent = totalBallsDropped;
});

btnReset.addEventListener("click", () => {
    balls = [];
    totalBallsDropped = 0;
    totalScore = 0;
    ballCountEl.textContent = "0";
    totalScoreEl.textContent = "0";
});

// Inisialisasi awal
initBoard();
animate();
