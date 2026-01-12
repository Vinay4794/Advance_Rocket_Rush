# Aurora Rocket 🚀✨

Aurora Rocket is a smooth neon-style arcade rocket game built using **HTML5 Canvas, CSS, and Vanilla JavaScript**.  
Dodge obstacles, collect coins, unlock premium skins & themes, and survive as long as you can.

The game is optimized for both **desktop and mobile**, including **fullscreen landscape mode** for mobile devices.

---

## 🎮 Features

### Core Gameplay
- Fast arcade-style rocket flying & obstacle dodging
- Progressive difficulty system (Level-based scaling)
- Smooth animations with `requestAnimationFrame`
- Fair obstacle spawning system

### Powerups
- 🛡 Shield (manual toggle + energy + recharge)
- ⚡ Boost (speed/score multiplier)
- ❄ Slow Motion (temporary slowdown)
- 🧲 Magnet (pulls nearby coins)

### Shop System
- Coin-based economy (collect coins during gameplay)
- Premium **skins** (rocket types like UFO, Jet, Cyber Blade, Dragon Ship, etc.)
- Premium **themes** (Space, Aurora, Sunset, Cyber)
- Save progress using `localStorage`

### Mobile Experience
- Mobile on-screen controls (up/down)
- Fullscreen + landscape orientation lock support
- DPR (device pixel ratio) capped for mobile performance

---

## 🕹 Controls

### Desktop
- Move: **W/S** or **Arrow Up / Arrow Down**
- Fullscreen: **F**
- Start: **Enter / Space**
- Pause: UI button

### Mobile
- Use on-screen buttons
- Tap the canvas / Start button to begin
- Fullscreen landscape is triggered automatically when supported

---

## 📁 Project Structure

aurora-rocket/
│
├── index.html
├── static/
│ ├── style.css
│ └── game.js
└── README.md

### 💾 Save System

Aurora Rocket automatically saves:
Coins
Owned skins/themes
Equipped skin/theme
High score
All data is stored locally using localStorage.

### 🚀 Future Improvements (Ideas)

More enemy patterns + boss obstacles
Daily rewards / missions
More themes with theme-specific obstacle designs
Online leaderboard

### 📜 License

This project is open-source and free to use.
You may modify and publish your own version with credit.
