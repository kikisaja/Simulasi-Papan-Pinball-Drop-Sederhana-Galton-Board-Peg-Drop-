# 🎯 Galton Board Pinball Drop (Simulasi Papan Pinball)

Aplikasi simulasi fisika papan Galton interaktif (*Galton Board / Peg Drop Simulator*) berbasis HTML5 Canvas & JavaScript murni di mana bola jatuh meluncur, memantul di antara paku-paku rintangan, dan mendarat di kantung skor bawah.

---

## 🎯 Konsep Pembelajaran RPL / Pemrograman Web

1. **HTML5 Canvas 2D Context:**
   Menggambar rintangan paku (*pegs*), kantung skor (*slots*), dan objek bola secara dinamis di atas canvas.
2. **Physics Collision Detection (Circle Bounce):**
   Menghitung jarak euclidean $\sqrt{\Delta x^2 + \Delta y^2}$ dan vektor sudut pantulan `Math.atan2()` antara bola dan paku rintangan.
3. **Gravity & Kinematics:**
   Simulasi gaya gravitasi bumi secara bertahap pada sumbu Y (`vy += GRAVITY`) serta redaman energi kecepatan (*restitution*) saat terjadi benturan.

---

## 📂 Struktur Folder Proyek

```text
├── index.html       # Elemen statistik skor, canvas arena Galton, & tombol kontrol
├── style.css        # Desain Neobrutalism biru-pop, framing canvas monokrom, & layout
└── script.js        # Engine fisika bola Canvas, matematika tabrakan, & animation loop
