// ======================================================
// AURORA ROCKET — FINAL 10/10
// - Neon Blue collision walls
// - Shield pickup + Magnet powerup
// - Fullscreen fixed (no collapse)
// - GameOver: only Restart
// - ✅ Mobile Fullscreen Landscape added
// ======================================================

function $(id){ return document.getElementById(id); }

// =====================
// DOM
// =====================
let rocketTilt = 0;

const canvas = $("game");
const ctx = canvas.getContext("2d");

const stageShell = $("stageShell");         // fullscreen target wrapper
const stage = $("stageContainer");          // size measurement container

const difficultyProgress = $("difficultyProgress");
const difficultyText = $("difficultyText");
const tipText = $("tipText");
const statusText = $("statusText");
const scoreEl = $("scoreEl");
const highScoreEl = $("highScoreEl");
const speedEl = $("speedEl");
const levelEl = $("levelEl");
// ✅ Mobile HUD mirrors
const mLevelEl = $("mLevelEl");
const mDifficultyText = $("mDifficultyText");
const mDifficultyProgress = $("mDifficultyProgress");


const modeSelect = $("modeSelect");
const shieldBtn = $("shieldBtn");
const startBtn = $("startBtn");

const soundBtn = $("soundBtn");
const pauseBtn = $("pauseBtn");
const restartBtn = $("restartBtn");
const fullscreenBtn = $("fullscreenBtn");

const overlay = $("overlay");

// Power status
const shieldText = $("shieldText");
const boostText = $("boostText");
const slowText = $("slowText");
const magnetText = $("magnetText");

// Mobile controls
const upBtn = $("btnUp");
const downBtn = $("btnDown");

const leftBtn = $("leftBtn");
const rightBtn = $("rightBtn");

// Coins UI
const coinsEl = $("coinsEl");
const themeSelect = $("themeSelect");
const skinSelect = $("skinSelect");

// Shop
const shopBtn = $("shopBtn");
const shopModal = $("shopModal");
const closeShopBtn = $("closeShopBtn");
const walletCoins = $("walletCoins");
const shopContent = $("shopContent");
const tabBtns = document.querySelectorAll(".tabBtn");

// GameOver UI
const gameOverUI = $("gameOverUI");
const finalScore = $("finalScore");
const finalHigh = $("finalHigh");
const finalLevel = $("finalLevel");
const restartOnlyBtn = $("restartOnlyBtn");


// =====================
// Save
// =====================
const SAVE_KEY = "auroraRocketSave_v3";

function loadSave(){
  try{ return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; }
  catch{ return {}; }
}
function saveData(obj){
  localStorage.setItem(SAVE_KEY, JSON.stringify(obj));
}
let SAVE = loadSave();

let coins = Number(SAVE.coins || 0);
let ownedSkins = new Set(SAVE.ownedSkins || ["classic"]);
let ownedThemes = new Set(SAVE.ownedThemes || ["space"]);
let equippedSkin = SAVE.skin || "classic";
let equippedTheme = SAVE.theme || "space";

if (!ownedSkins.has(equippedSkin)) equippedSkin = "classic";
if (!ownedThemes.has(equippedTheme)) equippedTheme = "space";

const SKINS = [
  // ----- Free / cheap -----
  { id:"classic", name:"Classic Rocket", price:0, icon:"🚀", desc:"Default ship skin." },
  { id:"cute", name:"Cute Rocket", price:120, icon:"🎀", desc:"Round adorable rocket with big window." },
  { id:"emerald", name:"Emerald Engine", price:220, icon:"💚", desc:"Green neon engine glow." },
  { id:"phantom", name:"Phantom Stealth", price:360, icon:"👻", desc:"Stealth aura & ghost glow." },
  { id:"ghost", name:"Ghost Rider", price:500, icon:"🌫️", desc:"Transparent ghost ship with mist tail." },

  // ----- Mid tier -----
  { id:"jet", name:"Neon Jet", price:650, icon:"✈️", desc:"Fast-looking futuristic jet." },
  { id:"ufo", name:"UFO Saucer", price:850, icon:"🛸", desc:"Hover saucer with beam glow." },
  { id:"shuttleMini", name:"Mini Shuttle", price:1800, icon:"🛰️", desc:"Shuttle with boosters." },

  // ----- Premium -----
  { id:"cometSpear", name:"Comet Spear", price:2600, icon:"☄️", desc:"Spear rocket with comet trail." },
  { id:"twinFighter", name:"Twin Fighter", price:3200, icon:"🛩️", desc:"Twin engines + wings." },
  { id:"satDrone", name:"Satellite Drone", price:2400, icon:"📡", desc:"Orbital drone craft." },
  { id:"octoUfo", name:"Octo UFO", price:5000, icon:"👾", desc:"Cute UFO with legs." },

  { id:"dragonShip", name:"Dragon Ship", price:4200, icon:"🐉", desc:"Dragon core flame ship." },
  { id:"cyberBlade", name:"Cyber Blade", price:6500, icon:"⚡", desc:"Sharp cyber craft." },
  { id:"diamondElite", name:"Diamond Elite", price:12000, icon:"💎", desc:"Elite futuristic craft." },
];

const THEME_STYLES = {
  space: {
    bgTop: "#000000",
    bgBottom: "#050512",
    star: "rgba(255,255,255,0.90)",
    microStar: "rgba(255,255,255,0.55)",

    gateFill: "rgba(255, 0, 70, 0.18)",
    gateStroke: "rgba(255, 0, 70, 0.95)",

    laserCore: "rgba(255, 50, 50, 0.62)",
    laserGlow: "rgba(248, 56, 56, 0.14)",

    droneGlow: "rgba(56,189,248,1)",

    coinGlow: "rgba(255,198,88,1)"
  },

  aurora: {
    bgTop: "#02020b",
    bgBottom: "#061223",
    star: "rgba(210,255,255,0.85)",
    microStar: "rgba(120,255,220,0.45)",

    gateFill: "rgba(56,189,248,0.12)",
    gateStroke: "rgba(56,189,248,0.90)",

    laserCore: "rgba(167,139,250,0.70)",
    laserGlow: "rgba(167,139,250,0.18)",

    droneGlow: "rgba(167,139,250,1)",

    coinGlow: "rgba(56,189,248,1)"
  },

  sunset: {
    bgTop: "#08020a",
    bgBottom: "#2a0b2d",
    star: "rgba(255,230,210,0.85)",
    microStar: "rgba(255,180,160,0.35)",

    gateFill: "rgba(255, 140, 70, 0.14)",
    gateStroke: "rgba(255, 140, 70, 0.95)",

    laserCore: "rgba(255, 90, 120, 0.70)",
    laserGlow: "rgba(255, 90, 120, 0.18)",

    droneGlow: "rgba(255,140,70,1)",

    coinGlow: "rgba(255,198,88,1)"
  },

  cyber: {
    bgTop: "#000000",
    bgBottom: "#06131a",
    star: "rgba(120,255,250,0.85)",
    microStar: "rgba(56,189,248,0.40)",

    gateFill: "rgba(0,255,180,0.08)",
    gateStroke: "rgba(0,255,180,0.95)",

    laserCore: "rgba(0,255,220,0.65)",
    laserGlow: "rgba(0,255,220,0.16)",

    droneGlow: "rgba(0,255,200,1)",

    coinGlow: "rgba(0,255,220,1)"
  }
};

function getThemeStyle(){
  return THEME_STYLES[equippedTheme] || THEME_STYLES.space;
}


const THEMES = [
  { id:"space", name:"Space", price:0, icon:"🪐", desc:"Deep space theme." },
  { id:"aurora", name:"Aurora", price:150, icon:"🌈", desc:"Aurora colors." },
  { id:"sunset", name:"Sunset", price:220, icon:"🌇", desc:"Warm gradient theme." },
  { id:"cyber", name:"Cyber", price:300, icon:"🤖", desc:"Cyber futuristic." },
];

function persist(){
  SAVE = {
    coins,
    ownedSkins: Array.from(ownedSkins),
    ownedThemes: Array.from(ownedThemes),
    skin: equippedSkin,
    theme: equippedTheme,
  };
  saveData(SAVE);
}
function updateWalletUI(){
  if(coinsEl) coinsEl.textContent = String(coins);
  if(walletCoins) walletCoins.textContent = String(coins);
}
function applyTheme(id){
  equippedTheme = id;
  document.body.classList.remove("theme-space","theme-aurora","theme-sunset","theme-cyber");
  document.body.classList.add(`theme-${id}`);
  persist();
}
function applySkin(id){
  equippedSkin = id;
  persist();
}

applyTheme(equippedTheme);
if(themeSelect) themeSelect.value = equippedTheme;
if(skinSelect) skinSelect.value = equippedSkin;
updateWalletUI();

// =====================
// Utils
// =====================
function syncMobileHud(){
  // only for mobile layouts
  if(!isMobileUI()) return;

  if(levelEl && mLevelEl) mLevelEl.textContent = levelEl.textContent;
  if(difficultyText && mDifficultyText) mDifficultyText.textContent = difficultyText.textContent;

  if(difficultyProgress && mDifficultyProgress){
    mDifficultyProgress.style.width = difficultyProgress.style.width || "0%";
  }
}

function isMobileUI(){
  return matchMedia("(max-width: 980px)").matches;
}

function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
function rand(min,max){ return Math.random()*(max-min)+min; }
let tipCooldown = 0;

function setTip(msg, force=false){
  if(!tipText) return;

  if(!force && performance.now() < tipCooldown) return;
  tipCooldown = performance.now() + 120;

  tipText.classList.add("sysChange");
  setTimeout(()=>{
    tipText.textContent = msg;
    tipText.classList.remove("sysChange");
  }, 120);
}

function setStatus(msg){ if(statusText) statusText.textContent = msg; }
function setOverlay(show){ if(overlay) overlay.classList.toggle("hidden", !show); }
function showGameOverUI(show){ if(gameOverUI) gameOverUI.classList.toggle("hidden", !show); }

function rectsCollide(a,b){
  return (a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y);
}
function circleRectCollide(cx,cy,r,rect){
  const x = clamp(cx, rect.x, rect.x+rect.w);
  const y = clamp(cy, rect.y, rect.y+rect.h);
  const dx = cx-x, dy = cy-y;
  return dx*dx + dy*dy <= r*r;
}

// =====================
// Fullscreen + Landscape (NEW)
// =====================
function isFullscreen(){ return !!document.fullscreenElement; }

async function goFullscreenLandscape(){
  try{
    const el = stageShell || stage || document.documentElement;

    // fullscreen request
    if(!document.fullscreenElement && el && el.requestFullscreen){
      await el.requestFullscreen({ navigationUI:"hide" });
    }

    // try lock landscape
    if(screen.orientation && screen.orientation.lock){
      await screen.orientation.lock("landscape");
    }
  }catch(e){
    console.log(e);
    setTip("Landscape fullscreen may be blocked on this device/browser.", true);
  }
}

async function toggleFullscreen(){
  try{
    const el = stageShell || stage || document.documentElement;

    if(!isFullscreen()){
      if(!el.requestFullscreen){
        setTip("Fullscreen not supported in this browser.");
        return;
      }
      await el.requestFullscreen({ navigationUI:"hide" });
    }else{
      await document.exitFullscreen();
    }
  }catch(e){
    console.log(e);
    setTip("Fullscreen blocked. Tap once and try again.");
  }
}

document.addEventListener("fullscreenchange", async ()=>{
  if(fullscreenBtn) fullscreenBtn.textContent = isFullscreen() ? "⤢" : "⛶";

  // unlock orientation on exit fullscreen
  if(!isFullscreen() && screen.orientation && screen.orientation.unlock){
    try{ screen.orientation.unlock(); }catch{}
  }

  setTimeout(()=>resizeCanvas(true), 180);
});

// =====================
// Canvas Resize
// =====================
let W=900, H=600;

function resizeCanvas(force=false){
  if(!stage) return;

  const rect = stage.getBoundingClientRect();
  const cssW = Math.max(320, Math.floor(rect.width));
  const cssH = Math.max(320, Math.floor(rect.height));

  // ✅ Cap DPR for mobile performance
  const rawDpr = window.devicePixelRatio || 1;
  const isMobile = matchMedia("(max-width: 980px)").matches;
  const dpr = isMobile ? Math.min(rawDpr, 2) : Math.min(rawDpr, 2.25);

  if(!force && canvas._lastW===cssW && canvas._lastH===cssH) return;

  canvas._lastW = cssW;
  canvas._lastH = cssH;

  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  canvas.width = Math.floor(cssW*dpr);
  canvas.height = Math.floor(cssH*dpr);

  ctx.setTransform(dpr,0,0,dpr,0,0);
  W = cssW; H = cssH;
}

// =====================
// Game State
// =====================
let running=false, paused=false, soundOn=true;
let lastTime=0;

let score=0;
let highScore = Number(localStorage.getItem("rocketHighScore") || "0");
if(highScoreEl) highScoreEl.textContent = highScore;

const keys = { up:false, down:false, left:false, right:false };

const modeConfig = {
  easy:    { spawnEvery: 1.15, obstacleSpeed: 260, scoreRate: 11, coinMult: 1.00, coinValue: 5 },
  normal:  { spawnEvery: 0.98, obstacleSpeed: 315, scoreRate: 16, coinMult: 1.10, coinValue: 5 },
  hard:    { spawnEvery: 0.84, obstacleSpeed: 370, scoreRate: 22, coinMult: 1.25, coinValue: 7 },
  extreme: { spawnEvery: 0.74, obstacleSpeed: 450, scoreRate: 30, coinMult: 1.45, coinValue: 9 }, // ✅ NEW
};

let config = modeConfig.normal;

let level=1;
let difficulty=0;

// Objects
let stars = [];
let microStars = [];
let obstacles=[];
let powerups=[];
let coinDrops=[];
let particles=[];

let spawnTimer=0, powerSpawnTimer=0, coinSpawnTimer=0;

function difficultyFactor(){
  return 1 + (level - 1) * 0.06;
}

// =====================
// Audio
// =====================
let audioCtx=null;
function beep(freq=440,time=0.05){
  if(!soundOn) return;
  try{
    if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    const o=audioCtx.createOscillator();
    const g=audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.frequency.value=freq; o.type="sine";
    g.gain.value=0.05;
    o.start();
    o.stop(audioCtx.currentTime+time);
  }catch{}
}

// =====================
// Player
// =====================
const rocket = {
  x:120,y:200,w:49,h:26,
  vx:0, vy:0,

  accelX: 1900,
  accelY: 2600,      // ✅ faster vertical movement

  maxSpeedX: 760,
  maxSpeedY: 920,    // ✅ higher vertical top speed

  friction: 0.50
};

function rocketRect(){ return {x:rocket.x,y:rocket.y,w:rocket.w,h:rocket.h}; }

function applyMobileTuning(){
  const isMobile = matchMedia("(max-width: 980px)").matches;

  if(isMobile){
    // ✅ smoother + less sensitive on mobile
    rocket.accelX = 1400;
    rocket.accelY = 1700;

    rocket.maxSpeedX = 520;
    rocket.maxSpeedY = 620;

    rocket.friction = 0.82;
  }else{
    // ✅ DESKTOP: FAST + CRISP
    rocket.accelX = 2800;     // faster horizontal response
    rocket.accelY = 3600;     // faster vertical response

    rocket.maxSpeedX = 820;   // higher top speed
    rocket.maxSpeedY = 950;  // higher top speed

    rocket.friction = 0.79;   // keep some glide but still sharp
  }
}



function resetRocket(){
  rocket.x = Math.max(90, W*0.14);
  rocket.y = H*0.5;
  rocket.vx=0; rocket.vy=0;
}

function applyControls(dt){
  // ✅ Separate accel
  const ax = rocket.accelX;
  const ay = rocket.accelY;

  if(keys.up)    rocket.vy -= ay * dt;  // ✅ FAST
  if(keys.down)  rocket.vy += ay * dt;  // ✅ FAST

  // ✅ Separate max speeds
  rocket.vx = clamp(rocket.vx, -rocket.maxSpeedX, rocket.maxSpeedX);
  rocket.vy = clamp(rocket.vy, -rocket.maxSpeedY, rocket.maxSpeedY);
  const isMobile = matchMedia("(max-width: 980px)").matches;
if(isMobile){
  rocket.vy *= 0.92; // ✅ smooth tiny jitter
}
 
  rocket.vy *= rocket.friction;

  rocket.y += rocket.vy * dt;

  rocket.x = clamp(rocket.x, 20, W-rocket.w-20);
  rocket.y = clamp(rocket.y, 18, H-rocket.h-18);
}


// =====================
// Powers
// =====================
const powers = {
  shield:{ available:true, active:false, energy:100, rechargeMs:6500, drainPerSec:40 },
  boost:{ active:false, t:0, duration:4.2 },
  slow:{ active:false, t:0, duration:4.8 },
  magnet:{ active:false, t:0, duration:8.0, radius:260 }
};

let globalObstacleTimeScale=1;

function uiPowerStatus(){
  if(shieldText){
    shieldText.textContent = powers.shield.available
      ? (powers.shield.active ? `ON (${Math.floor(powers.shield.energy)}%)` : "READY")
      : "RECHARGING";
  }
  if(boostText) boostText.textContent = powers.boost.active ? `ON (${powers.boost.t.toFixed(1)}s)` : "—";
  if(slowText) slowText.textContent = powers.slow.active ? `ON (${powers.slow.t.toFixed(1)}s)` : "—";
  if(magnetText) magnetText.textContent = powers.magnet.active ? `ON (${powers.magnet.t.toFixed(1)}s)` : "—";
}

function activateShield(){
  const sh=powers.shield;
  if(!sh.available){ setTip("Shield recharging..."); return; }
  if(sh.energy<=0){ sh.available=false; setTip("Shield depleted."); return; }

  sh.active=!sh.active;
  setStatus(sh.active ? "SHIELD ONLINE" : "ENGINE STABLE");
  beep(640,0.05);
}

function startBoost(){ powers.boost.active=true; powers.boost.t=powers.boost.duration; setStatus("BOOST ACTIVE"); beep(820,0.06); }
function startSlow(){ powers.slow.active=true; powers.slow.t=powers.slow.duration; setStatus("TIME SLOW"); beep(520,0.06); }
function startMagnet(){ powers.magnet.active=true; powers.magnet.t=powers.magnet.duration; setStatus("MAGNET ONLINE"); beep(900,0.06); }

function tickPowers(dt){
  const sh=powers.shield;

  if(sh.active){
    sh.energy -= dt * sh.drainPerSec;
    if(sh.energy<=0){
      sh.energy=0; sh.active=false; sh.available=false;
      setStatus("SHIELD OFFLINE");
      setTip("Shield depleted. Recharging...");
      setTimeout(()=>{
        sh.energy=100; sh.available=true;
        setTip("Shield recharged!");
        setStatus("ENGINE STABLE");
      }, sh.rechargeMs);
    }
  }

  if(powers.boost.active){
    powers.boost.t -= dt;
    if(powers.boost.t<=0){
      powers.boost.active=false;
      powers.boost.t=0;
      setStatus("ENGINE STABLE");
    }
  }

  if(powers.slow.active){
    powers.slow.t -= dt;
    globalObstacleTimeScale = 0.60;
    if(powers.slow.t<=0){
      powers.slow.active=false;
      powers.slow.t=0;
      globalObstacleTimeScale=1;
      setStatus("ENGINE STABLE");
    }
  } else {
    globalObstacleTimeScale=1;
  }

  if(powers.magnet.active){
    powers.magnet.t -= dt;
    if(powers.magnet.t<=0){
      powers.magnet.active=false;
      powers.magnet.t=0;
      setStatus("ENGINE STABLE");
    }
  }

  uiPowerStatus();
}
// =====================
// Stars
// =====================
function initStars(){
  stars=[]; microStars=[];
  const count = Math.floor((W*H)/14000);
  const microCount = Math.floor((W*H)/4500);

  for(let i=0;i<count;i++){
    stars.push({ x:Math.random()*W, y:Math.random()*H, r:rand(0.7,2.1), s:rand(40,150), a:rand(0.25,0.85) });
  }
  for(let i=0;i<microCount;i++){
    microStars.push({ x:Math.random()*W, y:Math.random()*H, r:rand(0.3,1.0), s:rand(20,110), a:rand(0.10,0.55) });
  }
}

// =====================
// Spawn Systems
// =====================
function spawnObstacle(){
  const roll=Math.random();
  let kind="gate";
  if(roll>0.55 && roll<=0.75) kind="laser";
  else if(roll>0.75 && roll<=0.92) kind="drone";
  else if(roll>0.92) kind="movingGate";

  const df = difficultyFactor();
  const speed = config.obstacleSpeed * df;

  if(kind==="gate"||kind==="movingGate"){
    const gap = rand(clamp(H*0.23,145,220), clamp(H*0.34,180,290));
    const topH = rand(40, H-gap-80);
    const bottomY = topH+gap;

    obstacles.push({
      kind, x:W+80, w:rand(54,78),
      speed,
      topH, bottomY, bottomH:H-bottomY,
      passed:false,
      oscT:Math.random()*Math.PI*2,
      oscSpeed:rand(0.7,1.0),
      oscAmp:rand(14,42)
    });
  }

  if(kind==="laser"){
    obstacles.push({
      kind:"laser",
      x:W+80,
      y:rand(90,H-90),
      w:rand(220,320),
      h:rand(10,14),
      speed:speed+45,
      passed:false,
      blink:rand(0,Math.PI*2)
    });
  }

  if(kind==="drone"){
    obstacles.push({
      kind:"drone",
      x:W+80,
      y:rand(90,H-90),
      r:rand(20,28),
      speed:speed+25,
      rot:0,
      rotSpeed:rand(2.6,4.5),
      passed:false
    });
  }
}

function spawnPowerup(){
  const roll=Math.random();
  let kind="boost";
  if(roll < 0.32) kind="boost";
  else if(roll < 0.57) kind="slow";
  else if(roll < 0.80) kind="magnet";
  else kind="shieldPickup";

  powerups.push({
    kind,
    x:W+60,
    y:rand(80,H-80),
    r:16,
    speed: config.obstacleSpeed - 55,
    t: Math.random() * Math.PI * 2
  });
}

function spawnCoin(){
  const coinVal = config.coinValue || 5;

  // slightly more clusters in extreme
  const clusterChance =
    (modeSelect.value === "extreme") ? 0.55 :
    (modeSelect.value === "hard") ? 0.42 :
    0.35;

  const cluster = Math.random() < clusterChance ? 3 : 1;

  for(let i=0;i<cluster;i++){
    coinDrops.push({
      x: W+60+i*26,
      y: rand(80, H-80),
      r: 12,
      speed: config.obstacleSpeed - 75,
      value: coinVal
    });
  }
}


// =====================
// Difficulty
// =====================
function updateDifficulty(dt){
  difficulty += dt * 1.35;
  if(difficulty>=100){
    difficulty=0;
    level += 1;
    setStatus("LEVEL UP");
    setTimeout(()=>setStatus("ENGINE STABLE"), 520);
    beep(580,0.08);
  }
  if(difficultyProgress) difficultyProgress.style.width = `${difficulty}%`;
  if(difficultyText) difficultyText.textContent = `${Math.floor(difficulty)}%`;
  if(levelEl) levelEl.textContent = String(level);
    // ✅ mirror bottom bar HUD -> mobile HUD
  syncMobileHud();

}

// =====================
// Particles
// =====================
function burstParticles(x,y,n=12){
  for(let i=0;i<n;i++){
    particles.push({ x,y, vx:rand(-260,260), vy:rand(-260,260), r:rand(1.2,3.0), life:rand(0.35,0.95) });
  }
}
function tickParticles(dt){
  particles = particles.filter(p=>p.life>0);
  for(const p of particles){
    p.life -= dt;
    p.x += p.vx*dt;
    p.y += p.vy*dt;
    p.vx *= 0.98;
    p.vy *= 0.98;
  }
}

// =====================
// Tick Powerups + Coins
// =====================
function tickPowerups(dt){
  for(const p of powerups){
    p.x -= p.speed * dt * globalObstacleTimeScale;
    p.t += dt*2.2;
  }
  powerups = powerups.filter(p=>p.x>-80);

  const rr=rocketRect();
  for(let i=powerups.length-1;i>=0;i--){
    const p=powerups[i];
    if(circleRectCollide(p.x,p.y,p.r,rr)){
      powerups.splice(i,1);
      burstParticles(rocket.x+rocket.w/2, rocket.y+rocket.h/2, 12);
      beep(760,0.05);

      if(p.kind==="boost") startBoost();
      if(p.kind==="slow") startSlow();
      if(p.kind==="magnet") startMagnet();

      if(p.kind==="shieldPickup"){
        powers.shield.available=true;
        powers.shield.energy=100;
        powers.shield.active=true;
        setStatus("SHIELD ONLINE");
        setTip("Shield picked up!");
        beep(640,0.06);
      }
    }
  }
}

function tickCoins(dt){
  const rr = rocketRect();
  const rx = rocket.x + rocket.w/2;
  const ry = rocket.y + rocket.h/2;

  for(const c of coinDrops){
    c.x -= c.speed * dt * globalObstacleTimeScale;

    if(powers.magnet.active){
      const dx = rx - c.x;
      const dy = ry - c.y;
      const dist = Math.hypot(dx, dy);

      if(dist < powers.magnet.radius){
        const pull = (1 - dist / powers.magnet.radius) * 1100;
        c.x += (dx / (dist || 1)) * pull * dt;
        c.y += (dy / (dist || 1)) * pull * dt;
      }
    }
  }

  coinDrops = coinDrops.filter(c=>c.x>-120);

  for(let i=coinDrops.length-1;i>=0;i--){
    const c=coinDrops[i];
    if(circleRectCollide(c.x,c.y,c.r,rr)){
      coinDrops.splice(i,1);
      coins += c.value;
      updateWalletUI();
      persist();
      beep(860,0.04);
    }
  }
}

// =====================
// Collision
// =====================
function checkCollision(){
  if(powers.shield.active) return false;
  const r=rocketRect();

  for(const ob of obstacles){
    if(ob.kind==="gate"||ob.kind==="movingGate"){
      const top={x:ob.x,y:0,w:ob.w,h:ob.topH};
      const bot={x:ob.x,y:ob.bottomY,w:ob.w,h:ob.bottomH};
      if(rectsCollide(r,top)||rectsCollide(r,bot)) return true;
    }
    if(ob.kind==="laser"){
      const laser={x:ob.x,y:ob.y-ob.h/2,w:ob.w,h:ob.h};
      if(rectsCollide(r,laser)) return true;
    }
    if(ob.kind==="drone"){
      if(circleRectCollide(ob.x,ob.y,ob.r,r)) return true;
    }
  }
  return false;
}

// =====================
// Draw Helpers
// =====================
function drawGlowCircle(x,y,r,color,alpha=0.28){
  ctx.save();
  ctx.globalAlpha=alpha;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fillStyle=color;
  ctx.fill();
  ctx.restore();
}
function drawHex(x,y,r,fill,stroke,sw=2){
  ctx.save();
  ctx.translate(x,y);
  ctx.beginPath();
  for(let i=0;i<6;i++){
    const a = (Math.PI/3)*i + Math.PI/6;
    const px = Math.cos(a)*r;
    const py = Math.sin(a)*r;
    if(i===0) ctx.moveTo(px,py);
    else ctx.lineTo(px,py);
  }
  ctx.closePath();
  ctx.fillStyle=fill; ctx.fill();
  ctx.strokeStyle=stroke; ctx.lineWidth=sw; ctx.stroke();
  ctx.restore();
}
function drawGhostRocket(){
  const cx = rocket.x + rocket.w/2;
  const cy = rocket.y + rocket.h/2;
  const skin = getSkinColors();

  const maxS = (rocket.maxSpeedY || rocket.maxSpeed || 650);
  const speed = Math.min(1, Math.abs(rocket.vy) / maxS);

  // ✅ Tilt EXACTLY like Cute Rocket
  const targetTilt = clamp(rocket.vy / maxS, -1, 1) * 1.95;
  rocketTilt += (targetTilt - rocketTilt) * 0.88;

  const w = rocket.w * 1.35;
  const h = rocket.h * 1.35;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rocketTilt);

  // ghost aura
  drawGlowCircle(0, 0, w*0.90, skin.flame, 0.10 + speed*0.10);

  // ghost body (soft capsule)
  ctx.fillStyle = skin.body;
  ctx.strokeStyle = skin.stroke;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(-w*0.36, -h*0.24, w*0.72, h*0.48, 999);
  ctx.fill();
  ctx.stroke();

  // ghost tail waves (back)
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(230,245,255,0.42)";
  ctx.beginPath();
  ctx.moveTo(-w*0.36, -h*0.12);
  ctx.quadraticCurveTo(-w*0.62, -h*0.10, -w*0.70, 0);
  ctx.quadraticCurveTo(-w*0.62,  h*0.10, -w*0.36, h*0.12);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // cute ghost eyes
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(5,10,20,0.55)";
  ctx.beginPath(); ctx.arc(w*0.16, -h*0.03, 3.4, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.28, -h*0.03, 3.4, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;

  // small mouth
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = "rgba(5,10,20,0.45)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(w*0.22, h*0.06, 3.2, 0, Math.PI);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // soft inner core glow
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.beginPath();
  ctx.roundRect(-w*0.10, -h*0.14, w*0.32, h*0.28, 999);
  ctx.fill();
  ctx.globalAlpha = 1;

  // ghost flame (misty)
  const flameLen = 24 + speed*32 + (powers.boost.active ? 18 : 0);
  const col = powers.boost.active ? "rgba(34,197,94,0.95)" : skin.flame;

  drawGlowCircle(-w*0.50, 0, 16 + speed*12, col, 0.16 + speed*0.12);

  ctx.globalAlpha = 0.75;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(-w*0.40, 0);
  ctx.quadraticCurveTo(-w*0.40 - flameLen, -14 - speed*7, -w*0.40 - flameLen, 0);
  ctx.quadraticCurveTo(-w*0.40 - flameLen,  14 + speed*7, -w*0.40, 0);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // shield bubble
  if(powers.shield.active){
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = col;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0,0,w*0.76,h*0.58,0,0,Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawCuteRocket(){
  const cx = rocket.x + rocket.w/2;
  const cy = rocket.y + rocket.h/2;
  const skin = getSkinColors();

  const maxS = (rocket.maxSpeedY || rocket.maxSpeed || 650);
  const speed = Math.min(1, Math.abs(rocket.vy) / maxS);

  const targetTilt = clamp(rocket.vy / maxS, -1, 1) * 1.95;
  rocketTilt += (targetTilt - rocketTilt) * 0.88;

  const w = rocket.w * 1.05;
  const h = rocket.h * 1.20;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rocketTilt);

  drawGlowCircle(-w*0.45, 0, w*0.55, skin.flame, 0.12 + speed*0.12);

  // puff trail
  ctx.save();
  ctx.globalAlpha = 0.20 + speed*0.20;
  ctx.fillStyle = skin.flame;
  ctx.beginPath();
  ctx.ellipse(-w*0.75 - 18, 0, 28 + speed*18, 12 + speed*8, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  // body
  const bodyGrad = ctx.createLinearGradient(0, -h, 0, h);
  bodyGrad.addColorStop(0, "rgba(255,255,255,0.10)");
  bodyGrad.addColorStop(0.40, skin.body);
  bodyGrad.addColorStop(1, "rgba(255,255,255,0.07)");

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = "rgba(255,255,255,0.20)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(-w*0.48, -h*0.34, w*0.96, h*0.68, 999);
  ctx.fill();
  ctx.stroke();

  // nose
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(255,130,170,0.25)";
  ctx.strokeStyle = "rgba(255,160,200,0.45)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(w*0.26, -h*0.20, w*0.30, h*0.40, 999);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // big window
  ctx.save();
  const wx = w*0.12, wy = 0, wr = Math.min(w,h)*0.18;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(wx, wy, wr, 0, Math.PI*2);
  ctx.fill(); ctx.stroke();

  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "rgba(255,255,255,0.20)";
  ctx.beginPath();
  ctx.ellipse(wx - wr*0.22, -wr*0.25, wr*0.35, wr*0.22, -0.5, 0, Math.PI*2);
  ctx.fill();

  drawGlowCircle(wx, wy, wr*0.85, skin.flame, 0.12 + speed*0.10);
  ctx.restore();

  // nozzle
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.78)";
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-w*0.62, -h*0.12, w*0.14, h*0.24, 10);
  ctx.fill(); ctx.stroke();
  ctx.restore();

  // flame
  const flameLen = 18 + speed*22 + (powers.boost.active ? 12 : 0);
  const flameCol = powers.boost.active ? "rgba(34,197,94,0.92)" : skin.flame;

  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = flameCol;

  ctx.beginPath();
  ctx.moveTo(-w*0.62, 0);
  ctx.quadraticCurveTo(-w*0.62 - flameLen, -10 - speed*6, -w*0.62 - flameLen, 0);
  ctx.quadraticCurveTo(-w*0.62 - flameLen,  10 + speed*6, -w*0.62, 0);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.60;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.moveTo(-w*0.62, 0);
  ctx.quadraticCurveTo(-w*0.62 - flameLen*0.55, -6, -w*0.62 - flameLen*0.55, 0);
  ctx.quadraticCurveTo(-w*0.62 - flameLen*0.55,  6, -w*0.62, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // shield bubble
  if(powers.shield.active){
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = skin.flame;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0,0,w*0.78,0,Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
function drawEmeraldRocket(){
  const cx = rocket.x + rocket.w/2;
  const cy = rocket.y + rocket.h/2;
  const skin = getSkinColors();

  const maxS = (rocket.maxSpeedY || rocket.maxSpeed || 650);
  const speed = Math.min(1, Math.abs(rocket.vy) / maxS);

  // ✅ Tilt like Cute Rocket
  const targetTilt = clamp(rocket.vy / maxS, -1, 1) * 1.95;
  rocketTilt += (targetTilt - rocketTilt) * 0.88;

  const w = rocket.w * 1.40;
  const h = rocket.h * 1.30;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rocketTilt);

  // emerald aura
  drawGlowCircle(0, 0, w*0.80, skin.flame, 0.10 + speed*0.12);

  // body (diamond tech hull)
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.strokeStyle = "rgba(34,197,94,0.70)";
  ctx.lineWidth = 2.4;

  ctx.beginPath();
  ctx.moveTo(w*0.70, 0);
  ctx.lineTo(w*0.20, -h*0.45);
  ctx.lineTo(-w*0.55, 0);
  ctx.lineTo(w*0.20,  h*0.45);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // inner core
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(0,0,0,0.48)";
  ctx.beginPath();
  ctx.moveTo(w*0.36, 0);
  ctx.lineTo(w*0.08, -h*0.22);
  ctx.lineTo(-w*0.22, 0);
  ctx.lineTo(w*0.08,  h*0.22);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // emerald stripes
  ctx.globalAlpha = 0.70;
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(w*0.14, -h*0.38);
  ctx.lineTo(-w*0.38, 0);
  ctx.lineTo(w*0.14, h*0.38);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // engine glow + flame
  const flameLen = 26 + speed*34 + (powers.boost.active ? 20 : 0);
  const col = powers.boost.active ? "rgba(34,197,94,0.95)" : skin.flame;

  drawGlowCircle(-w*0.45, 0, 16+speed*10, col, 0.22 + speed*0.18);

  ctx.fillStyle = col;
  ctx.globalAlpha = 0.95;
  ctx.beginPath();
  ctx.moveTo(-w*0.52, 0);
  ctx.quadraticCurveTo(-w*0.52-flameLen, -14 - speed*8, -w*0.52-flameLen, 0);
  ctx.quadraticCurveTo(-w*0.52-flameLen,  14 + speed*8, -w*0.52, 0);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // shield
  if(powers.shield.active){
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = col;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0,0,w*0.70,0,Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}
function drawPhantomRocket(){
  const cx = rocket.x + rocket.w/2;
  const cy = rocket.y + rocket.h/2;
  const skin = getSkinColors();

  const maxS = (rocket.maxSpeedY || rocket.maxSpeed || 650);
  const speed = Math.min(1, Math.abs(rocket.vy) / maxS);

  // ✅ Tilt like Cute Rocket
  const targetTilt = clamp(rocket.vy / maxS, -1, 1) * 1.95;
  rocketTilt += (targetTilt - rocketTilt) * 0.88;

  const w = rocket.w * 1.35;
  const h = rocket.h * 1.35;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rocketTilt);

  // stealth mist aura
  drawGlowCircle(0, 0, w*0.85, "rgba(167,139,250,1)", 0.08 + speed*0.10);

  // ghost body (capsule)
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.roundRect(-w*0.35, -h*0.24, w*0.74, h*0.48, 999);
  ctx.fill(); ctx.stroke();

  // dark inner fog
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.beginPath();
  ctx.roundRect(-w*0.20, -h*0.17, w*0.40, h*0.34, 999);
  ctx.fill();
  ctx.globalAlpha = 1;

  // phantom eyes (ghost)
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath(); ctx.arc(w*0.18, -h*0.05, 3.2, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.28, -h*0.05, 3.2, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha = 1;

  // tail fade at back
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "rgba(167,139,250,0.22)";
  ctx.beginPath();
  ctx.moveTo(-w*0.35, -h*0.12);
  ctx.quadraticCurveTo(-w*0.75, 0, -w*0.35, h*0.12);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // phantom flame (thin)
  const flameLen = 22 + speed*28 + (powers.boost.active ? 18 : 0);
  const col = powers.boost.active ? "rgba(34,197,94,0.95)" : skin.flame;

  drawGlowCircle(-w*0.50, 0, 14+speed*10, col, 0.18 + speed*0.18);

  ctx.globalAlpha = 0.85;
  ctx.fillStyle = col;
  ctx.beginPath();
  ctx.moveTo(-w*0.42, 0);
  ctx.quadraticCurveTo(-w*0.42 - flameLen, -12, -w*0.42 - flameLen, 0);
  ctx.quadraticCurveTo(-w*0.42 - flameLen,  12, -w*0.42, 0);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // shield
  if(powers.shield.active){
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = col;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0,0,w*0.72,h*0.55,0,0,Math.PI*2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  ctx.restore();
}

function drawUFO(){
  const cx = rocket.x + rocket.w/2;
  const cy = rocket.y + rocket.h/2;
  const skin = getSkinColors();

  const maxS = (rocket.maxSpeedY || rocket.maxSpeed || 650);
  const speed = Math.min(1, Math.abs(rocket.vy) / maxS);

  // UFO tilts a bit less (feels floaty)
  const targetTilt = clamp(rocket.vy / maxS, -1, 1) * 1.55;
  rocketTilt += (targetTilt - rocketTilt) * 0.80;

  const w = rocket.w*1.35;
  const h = rocket.h*1.15;

  // hover wobble
  const wob = Math.sin(performance.now()*0.006) * (2 + speed*2);

  ctx.save();
  ctx.translate(cx, cy + wob);
  ctx.rotate(rocketTilt);

  // beam glow
  drawGlowCircle(0, h*0.42, w*0.60, skin.flame, 0.08 + speed*0.08);

  // bottom disc
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, w*0.58, h*0.38, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  // neon ring
  ctx.globalAlpha = 0.45 + speed*0.25;
  ctx.strokeStyle = skin.flame;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, h*0.04, w*0.52, h*0.30, 0, 0, Math.PI*2);
  ctx.stroke();
  ctx.restore();

  // dome
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.45)";
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, -h*0.12, w*0.26, h*0.24, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  // dome shine
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.beginPath();
  ctx.ellipse(-w*0.10, -h*0.22, w*0.10, h*0.08, -0.4, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  // shield
  if(powers.shield.active){
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = skin.flame;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0,0,w*0.70,h*0.50,0,0,Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
function drawJet(){
  const cx = rocket.x + rocket.w/2;
  const cy = rocket.y + rocket.h/2;
  const skin = getSkinColors();

  const maxS = (rocket.maxSpeedY || rocket.maxSpeed || 650);
  const speed = Math.min(1, Math.abs(rocket.vy) / maxS);

  // sharp aggressive tilt
  const targetTilt = clamp(rocket.vy / maxS, -1, 1) * 1.15;
  rocketTilt += (targetTilt - rocketTilt) * 0.72;

  const w = rocket.w*1.35;
  const h = rocket.h*1.05;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rocketTilt);

  // body
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(w*0.70, 0);              // nose
  ctx.lineTo(w*0.10, -h*0.45);        // top
  ctx.lineTo(-w*0.65, -h*0.18);       // tail-top
  ctx.lineTo(-w*0.65,  h*0.18);       // tail-bottom
  ctx.lineTo(w*0.10,   h*0.45);       // bottom
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // wing
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = skin.flame;
  ctx.beginPath();
  ctx.moveTo(w*0.05, 0);
  ctx.lineTo(-w*0.10, -h*0.75);
  ctx.lineTo(-w*0.30, 0);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w*0.05, 0);
  ctx.lineTo(-w*0.10,  h*0.75);
  ctx.lineTo(-w*0.30, 0);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;

  // cockpit stripe
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(0,0,0,0.50)";
  ctx.beginPath();
  ctx.roundRect(w*0.08, -h*0.20, w*0.28, h*0.40, 12);
  ctx.fill();
  ctx.globalAlpha = 1;

  // jet flame
  const flameLen = 22 + speed*30 + (powers.boost.active ? 18 : 0);
  const flameCol = powers.boost.active ? "rgba(34,197,94,0.92)" : skin.flame;

  drawGlowCircle(-w*0.65,0,14+speed*10,flameCol,0.18+speed*0.2);

  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = flameCol;
  ctx.beginPath();
  ctx.moveTo(-w*0.65, 0);
  ctx.quadraticCurveTo(-w*0.65 - flameLen, -12, -w*0.65 - flameLen, 0);
  ctx.quadraticCurveTo(-w*0.65 - flameLen,  12, -w*0.65, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // shield ring
  if(powers.shield.active){
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = flameCol;
    ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0,0,w*0.55,0,Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}
function drawMiniShuttle(){
  const cx=rocket.x+rocket.w/2, cy=rocket.y+rocket.h/2;
  const skin=getSkinColors();

  const maxS=(rocket.maxSpeedY||rocket.maxSpeed||650);
  const speed=Math.min(1, Math.abs(rocket.vy)/maxS);

  const targetTilt = clamp(rocket.vy/maxS, -1, 1) * 1.85;
  rocketTilt += (targetTilt-rocketTilt)*0.88;

  const w=rocket.w*1.45, h=rocket.h*1.25;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rocketTilt);

  // body
  ctx.fillStyle="rgba(255,255,255,0.10)";
  ctx.strokeStyle="rgba(255,255,255,0.18)";
  ctx.lineWidth=2;

  ctx.beginPath();
  ctx.roundRect(-w*0.35, -h*0.25, w*0.78, h*0.50, 18);
  ctx.fill(); ctx.stroke();

  // nose
  ctx.fillStyle="rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.moveTo(w*0.43,0);
  ctx.lineTo(w*0.25,-h*0.25);
  ctx.lineTo(w*0.25, h*0.25);
  ctx.closePath();
  ctx.fill();

  // cockpit
  ctx.globalAlpha=0.9;
  ctx.fillStyle="rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.roundRect(w*0.05, -h*0.14, w*0.22, h*0.28, 12);
  ctx.fill();
  ctx.globalAlpha=1;

  // wings
  ctx.globalAlpha=0.55;
  ctx.fillStyle=skin.flame;
  ctx.beginPath();
  ctx.moveTo(-w*0.05,0);
  ctx.lineTo(-w*0.22,-h*0.55);
  ctx.lineTo(w*0.08,-h*0.14);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-w*0.05,0);
  ctx.lineTo(-w*0.22,h*0.55);
  ctx.lineTo(w*0.08,h*0.14);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha=1;

  // twin boosters
  for(const sy of [-1, 1]){
    ctx.fillStyle="rgba(0,0,0,0.72)";
    ctx.beginPath();
    ctx.roundRect(-w*0.48, sy*h*0.10 - h*0.10, w*0.14, h*0.20, 10);
    ctx.fill();

    const flameLen = 20 + speed*24 + (powers.boost.active?14:0);
    const col = powers.boost.active ? "rgba(34,197,94,0.92)" : skin.flame;

    drawGlowCircle(-w*0.52, sy*h*0.10, 10+speed*6, col, 0.16+speed*0.2);
    ctx.fillStyle=col;
    ctx.beginPath();
    ctx.moveTo(-w*0.55, sy*h*0.10);
    ctx.quadraticCurveTo(-w*0.55-flameLen, sy*h*0.10-10, -w*0.55-flameLen, sy*h*0.10);
    ctx.quadraticCurveTo(-w*0.55-flameLen, sy*h*0.10+10, -w*0.55, sy*h*0.10);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}
function drawCyberBlade(){
  const cx=rocket.x+rocket.w/2, cy=rocket.y+rocket.h/2;
  const skin=getSkinColors();

  const maxS=(rocket.maxSpeedY||rocket.maxSpeed||650);
  const speed=Math.min(1, Math.abs(rocket.vy)/maxS);

  const targetTilt = clamp(rocket.vy/maxS, -1, 1) * 1.25;
  rocketTilt += (targetTilt-rocketTilt)*0.75;

  const w=rocket.w*1.55, h=rocket.h*1.15;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rocketTilt);

  // neon outline glow
  drawGlowCircle(0,0,w*0.70, skin.flame, 0.08+speed*0.12);

  // blade hull
  ctx.fillStyle="rgba(255,255,255,0.08)";
  ctx.strokeStyle=skin.flame;
  ctx.globalAlpha=0.95;
  ctx.lineWidth=2.2;

  ctx.beginPath();
  ctx.moveTo(w*0.70, 0);
  ctx.lineTo(w*0.15, -h*0.42);
  ctx.lineTo(-w*0.60, -h*0.12);
  ctx.lineTo(-w*0.42, 0);
  ctx.lineTo(-w*0.60,  h*0.12);
  ctx.lineTo(w*0.15,   h*0.42);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha=1;

  // cockpit strip
  ctx.fillStyle="rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.roundRect(w*0.05, -h*0.12, w*0.22, h*0.24, 12);
  ctx.fill();

  // blade fins
  ctx.globalAlpha=0.65;
  ctx.fillStyle=skin.flame;
  ctx.beginPath();
  ctx.moveTo(-w*0.05, 0);
  ctx.lineTo(-w*0.18, -h*0.80);
  ctx.lineTo(-w*0.35, 0);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-w*0.05, 0);
  ctx.lineTo(-w*0.18,  h*0.80);
  ctx.lineTo(-w*0.35, 0);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha=1;

  // flame
  const flameLen=30+speed*34+(powers.boost.active?18:0);
  const col = powers.boost.active ? "rgba(34,197,94,0.92)" : skin.flame;

  drawGlowCircle(-w*0.55,0,14+speed*8,col,0.2+speed*0.2);
  ctx.fillStyle=col;
  ctx.beginPath();
  ctx.moveTo(-w*0.60,0);
  ctx.quadraticCurveTo(-w*0.60-flameLen, -14, -w*0.60-flameLen, 0);
  ctx.quadraticCurveTo(-w*0.60-flameLen,  14, -w*0.60, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
function drawDiamondElite(){
  const cx=rocket.x+rocket.w/2, cy=rocket.y+rocket.h/2;
  const skin=getSkinColors();

  const maxS=(rocket.maxSpeedY||rocket.maxSpeed||650);
  const speed=Math.min(1, Math.abs(rocket.vy)/maxS);

  const targetTilt = clamp(rocket.vy/maxS, -1, 1) * 0.75;
  rocketTilt += (targetTilt-rocketTilt)*0.32;

  const w=rocket.w*1.45, h=rocket.h*1.20;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rocketTilt);

  // crystal aura
  drawGlowCircle(0,0,w*0.85, "rgba(255,255,255,1)", 0.05+speed*0.06);
  drawGlowCircle(0,0,w*0.70, skin.flame, 0.08+speed*0.10);

  // diamond hull
  ctx.fillStyle="rgba(255,255,255,0.10)";
  ctx.strokeStyle="rgba(255,255,255,0.22)";
  ctx.lineWidth=2;

  ctx.beginPath();
  ctx.moveTo(w*0.65, 0);
  ctx.lineTo(w*0.15, -h*0.45);
  ctx.lineTo(-w*0.55, 0);
  ctx.lineTo(w*0.15,  h*0.45);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // inner facets
  ctx.globalAlpha=0.55;
  ctx.strokeStyle=skin.flame;
  ctx.lineWidth=1.6;
  ctx.beginPath();
  ctx.moveTo(w*0.15,-h*0.45);
  ctx.lineTo(w*0.15, h*0.45);
  ctx.moveTo(w*0.15,0);
  ctx.lineTo(-w*0.55,0);
  ctx.stroke();
  ctx.globalAlpha=1;

  // engine core
  drawGlowCircle(-w*0.40,0,14+speed*8,skin.flame,0.18+speed*0.18);

  const flameLen=20+speed*26+(powers.boost.active?12:0);
  ctx.fillStyle = powers.boost.active ? "rgba(34,197,94,0.92)" : skin.flame;
  ctx.beginPath();
  ctx.moveTo(-w*0.55,0);
  ctx.quadraticCurveTo(-w*0.55-flameLen,-10,-w*0.55-flameLen,0);
  ctx.quadraticCurveTo(-w*0.55-flameLen, 10,-w*0.55,0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
function drawDragonShip(){
  const cx=rocket.x+rocket.w/2, cy=rocket.y+rocket.h/2;
  const skin=getSkinColors();

  const maxS=(rocket.maxSpeedY||rocket.maxSpeed||650);
  const speed=Math.min(1, Math.abs(rocket.vy)/maxS);

  const targetTilt = clamp(rocket.vy/maxS, -1, 1) * 1.10;
  rocketTilt += (targetTilt-rocketTilt)*0.46;

  const w=rocket.w*1.55, h=rocket.h*1.15;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rocketTilt);

  // core glow
  drawGlowCircle(w*0.05,0,w*0.85, "rgba(255,60,60,1)", 0.08);
  drawGlowCircle(w*0.05,0,w*0.60, skin.flame, 0.10+speed*0.12);

  // hull (dragon head shape)
  ctx.fillStyle="rgba(255,255,255,0.07)";
  ctx.strokeStyle="rgba(255,80,80,0.65)";
  ctx.lineWidth=2.2;

  ctx.beginPath();
  ctx.moveTo(w*0.70,0);
  ctx.quadraticCurveTo(w*0.40,-h*0.55,-w*0.10,-h*0.30);
  ctx.lineTo(-w*0.60,-h*0.10);
  ctx.lineTo(-w*0.45,0);
  ctx.lineTo(-w*0.60, h*0.10);
  ctx.quadraticCurveTo(-w*0.10, h*0.30, w*0.40, h*0.55);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // horns
  ctx.globalAlpha=0.75;
  ctx.fillStyle="rgba(255,80,80,0.70)";
  ctx.beginPath();
  ctx.moveTo(w*0.42,-h*0.20);
  ctx.lineTo(w*0.62,-h*0.45);
  ctx.lineTo(w*0.48,-h*0.05);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w*0.42, h*0.20);
  ctx.lineTo(w*0.62, h*0.45);
  ctx.lineTo(w*0.48, h*0.05);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha=1;

  // flame = fire breath
  const flameLen=34+speed*44+(powers.boost.active?22:0);
  const col = powers.boost.active ? "rgba(34,197,94,0.92)" : "rgba(255,70,60,0.95)";

  drawGlowCircle(-w*0.55,0,18+speed*10,col,0.25);
  ctx.fillStyle=col;
  ctx.beginPath();
  ctx.moveTo(-w*0.65,0);
  ctx.quadraticCurveTo(-w*0.65-flameLen,-18,-w*0.65-flameLen,0);
  ctx.quadraticCurveTo(-w*0.65-flameLen, 18,-w*0.65,0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
function drawCometSpear(){
  const cx=rocket.x+rocket.w/2, cy=rocket.y+rocket.h/2;
  const skin=getSkinColors();

  const maxS=(rocket.maxSpeedY||rocket.maxSpeed||650);
  const speed=Math.min(1, Math.abs(rocket.vy)/maxS);

  const targetTilt = clamp(rocket.vy/maxS, -1, 1) * 1.20;
  rocketTilt += (targetTilt-rocketTilt)*0.45;

  const w=rocket.w*1.65, h=rocket.h*0.95;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rocketTilt);

  // comet glow tail
  ctx.globalAlpha=0.22 + speed*0.20;
  ctx.fillStyle=skin.flame;
  ctx.beginPath();
  ctx.ellipse(-w*0.55-20,0, 46+speed*30, 10+speed*8, 0,0,Math.PI*2);
  ctx.fill();
  ctx.globalAlpha=1;

  // spear hull
  ctx.fillStyle="rgba(255,255,255,0.09)";
  ctx.strokeStyle="rgba(255,255,255,0.18)";
  ctx.lineWidth=2;

  ctx.beginPath();
  ctx.moveTo(w*0.75,0);
  ctx.lineTo(-w*0.45,-h*0.22);
  ctx.lineTo(-w*0.65,0);
  ctx.lineTo(-w*0.45, h*0.22);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // cockpit gem
  ctx.fillStyle="rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.roundRect(w*0.05,-h*0.14,w*0.18,h*0.28,10);
  ctx.fill();

  // flame
  const flameLen=26+speed*30+(powers.boost.active?18:0);
  const col = powers.boost.active ? "rgba(34,197,94,0.92)" : skin.flame;
  drawGlowCircle(-w*0.65,0,12+speed*10,col,0.18+speed*0.22);

  ctx.fillStyle=col;
  ctx.beginPath();
  ctx.moveTo(-w*0.65,0);
  ctx.quadraticCurveTo(-w*0.65-flameLen,-12,-w*0.65-flameLen,0);
  ctx.quadraticCurveTo(-w*0.65-flameLen, 12,-w*0.65,0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
function drawTwinFighter(){
  const cx=rocket.x+rocket.w/2, cy=rocket.y+rocket.h/2;
  const skin=getSkinColors();

  const maxS=(rocket.maxSpeedY||rocket.maxSpeed||650);
  const speed=Math.min(1, Math.abs(rocket.vy)/maxS);

  const targetTilt = clamp(rocket.vy/maxS, -1, 1) * 1.05;
  rocketTilt += (targetTilt-rocketTilt)*0.42;

  const w=rocket.w*1.60, h=rocket.h*1.10;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rocketTilt);

  // center hull
  ctx.fillStyle="rgba(255,255,255,0.09)";
  ctx.strokeStyle="rgba(255,255,255,0.18)";
  ctx.lineWidth=2;

  ctx.beginPath();
  ctx.roundRect(-w*0.20,-h*0.22,w*0.72,h*0.44,16);
  ctx.fill(); ctx.stroke();

  // wings
  ctx.globalAlpha=0.60;
  ctx.fillStyle=skin.flame;
  ctx.beginPath();
  ctx.moveTo(w*0.08,0);
  ctx.lineTo(-w*0.10,-h*0.78);
  ctx.lineTo(-w*0.30,0);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(w*0.08,0);
  ctx.lineTo(-w*0.10, h*0.78);
  ctx.lineTo(-w*0.30,0);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha=1;

  // cockpit
  ctx.fillStyle="rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.roundRect(w*0.22,-h*0.12,w*0.20,h*0.24,12);
  ctx.fill();

  // twin engines
  const engines=[-h*0.16, h*0.16];
  const col = powers.boost.active ? "rgba(34,197,94,0.92)" : skin.flame;
  for(const ey of engines){
    drawGlowCircle(-w*0.32, ey, 10+speed*6, col, 0.18+speed*0.18);

    const flameLen=22+speed*26+(powers.boost.active?14:0);
    ctx.fillStyle=col;
    ctx.beginPath();
    ctx.moveTo(-w*0.30, ey);
    ctx.quadraticCurveTo(-w*0.30-flameLen, ey-10, -w*0.30-flameLen, ey);
    ctx.quadraticCurveTo(-w*0.30-flameLen, ey+10, -w*0.30, ey);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}
function drawSatelliteDrone(){
  const cx=rocket.x+rocket.w/2, cy=rocket.y+rocket.h/2;
  const skin=getSkinColors();

  const maxS=(rocket.maxSpeedY||rocket.maxSpeed||650);
  const speed=Math.min(1, Math.abs(rocket.vy)/maxS);

  const targetTilt = clamp(rocket.vy/maxS, -1, 1) * 0.55;
  rocketTilt += (targetTilt-rocketTilt)*0.28;

  const w=rocket.w*1.35, h=rocket.h*1.20;

  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate(rocketTilt);

  // core orb
  drawGlowCircle(0,0,w*0.65,skin.flame,0.10+speed*0.10);

  ctx.fillStyle="rgba(255,255,255,0.10)";
  ctx.strokeStyle="rgba(255,255,255,0.18)";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.arc(0,0,w*0.22,0,Math.PI*2);
  ctx.fill(); ctx.stroke();

  // solar panels
  ctx.globalAlpha=0.85;
  ctx.fillStyle="rgba(56,189,248,0.14)";
  ctx.strokeStyle="rgba(56,189,248,0.30)";
  ctx.lineWidth=2;

  ctx.beginPath();
  ctx.roundRect(-w*0.65,-h*0.16,w*0.32,h*0.32,12);
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(w*0.33,-h*0.16,w*0.32,h*0.32,12);
  ctx.fill(); ctx.stroke();
  ctx.globalAlpha=1;

  // thruster (small)
  const flameLen=18+speed*22+(powers.boost.active?10:0);
  const col = powers.boost.active ? "rgba(34,197,94,0.92)" : skin.flame;
  drawGlowCircle(-w*0.22,0,10+speed*6,col,0.16+speed*0.18);

  ctx.fillStyle=col;
  ctx.beginPath();
  ctx.moveTo(-w*0.24,0);
  ctx.quadraticCurveTo(-w*0.24-flameLen,-10,-w*0.24-flameLen,0);
  ctx.quadraticCurveTo(-w*0.24-flameLen, 10,-w*0.24,0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
function drawOctoUFO(){
  const cx=rocket.x+rocket.w/2, cy=rocket.y+rocket.h/2;
  const skin=getSkinColors();

  const maxS=(rocket.maxSpeedY||rocket.maxSpeed||650);
  const speed=Math.min(1, Math.abs(rocket.vy)/maxS);

  const targetTilt = clamp(rocket.vy/maxS, -1, 1) * 0.35;
  rocketTilt += (targetTilt-rocketTilt)*0.22;

  const w=rocket.w*1.45, h=rocket.h*1.25;
  const wob = Math.sin(performance.now()*0.006) * (2 + speed*2);

  ctx.save();
  ctx.translate(cx, cy+wob);
  ctx.rotate(rocketTilt);

  // disc
  ctx.fillStyle="rgba(255,255,255,0.08)";
  ctx.strokeStyle="rgba(255,255,255,0.18)";
  ctx.lineWidth=2;

  ctx.beginPath();
  ctx.ellipse(0,0,w*0.55,h*0.32,0,0,Math.PI*2);
  ctx.fill(); ctx.stroke();

  // dome
  ctx.fillStyle="rgba(0,0,0,0.45)";
  ctx.beginPath();
  ctx.ellipse(0,-h*0.10,w*0.22,h*0.22,0,0,Math.PI*2);
  ctx.fill();

  // cute eyes inside dome
  ctx.globalAlpha=0.9;
  ctx.fillStyle="rgba(255,255,255,0.80)";
  ctx.beginPath(); ctx.arc(-w*0.07, -h*0.10, 4.2, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(w*0.03, -h*0.10, 4.2, 0, Math.PI*2); ctx.fill();
  ctx.globalAlpha=1;

  // legs (octo!)
  ctx.strokeStyle=skin.flame;
  ctx.lineWidth=3;
  ctx.globalAlpha=0.45;
  for(let i=0;i<6;i++){
    const x = (-w*0.34) + i*(w*0.68/5);
    ctx.beginPath();
    ctx.moveTo(x, h*0.20);
    ctx.quadraticCurveTo(x-6, h*0.42, x+4, h*0.55);
    ctx.stroke();
  }
  ctx.globalAlpha=1;

  // beam glow
  drawGlowCircle(0, h*0.46, w*0.70, skin.flame, 0.06+speed*0.10);

  ctx.restore();
}


// =====================
// Render
// =====================
function getSkinColors(){
  switch(equippedSkin){
    case "phantom": return { body:"rgba(235,235,255,0.88)", stroke:"rgba(255,255,255,0.14)", flame:"rgba(167,139,250,0.90)" };
    case "emerald": return { body:"rgba(240,255,245,0.92)", stroke:"rgba(34,197,94,0.45)", flame:"rgba(34,197,94,0.92)" };
    case "gold": return { body:"rgba(255,248,225,0.92)", stroke:"rgba(255,198,88,0.55)", flame:"rgba(255,198,88,0.92)" };
    case "nebula": return { body:"rgba(245,246,255,0.92)", stroke:"rgba(167,139,250,0.65)", flame:"rgba(56,189,248,0.95)" };
      case "ghost":
  return {
    body: "rgba(230,245,255,0.62)",
    stroke: "rgba(255,255,255,0.18)",
    flame: "rgba(200,230,255,0.95)"
  };

    default: return { body:"rgba(245,246,255,0.92)", stroke:"rgba(167,139,250,0.50)", flame:"rgba(56,189,248,0.95)" };
  }
}

function drawStars(){
  const th = getThemeStyle();

  // gradient background
  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0, th.bgTop);
  g.addColorStop(1, th.bgBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0,0,W,H);

  // stars
  for(const s of microStars){
    ctx.globalAlpha = s.a;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle = th.microStar;
    ctx.fill();
  }

  for(const s of stars){
    ctx.globalAlpha = s.a;
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle = th.star;
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

function drawClassicRocket(){
  const cx = rocket.x + rocket.w/2;
  const cy = rocket.y + rocket.h/2;

  const maxS = (rocket.maxSpeedY || rocket.maxSpeed || 650);
  const speed = Math.min(1, Math.abs(rocket.vy) / maxS);

  // controlled tilt
  const targetTilt = clamp(rocket.vy / maxS, -1, 1) * 0.75;
  rocketTilt += (targetTilt - rocketTilt) * 0.20;

  const w = rocket.w * 1.35;
  const h = rocket.h * 1.45;

  // flame
  const flameLen = 22 + speed*28 + (powers.boost.active ? 16 : 0);
  const flameCol = powers.boost.active
    ? "rgba(34,197,94,0.95)"
    : "rgba(255,140,40,0.95)";

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rocketTilt);

  // --- flame glow ---
  drawGlowCircle(-w*0.60, 0, 18 + speed*12, flameCol, 0.18 + speed*0.08);

  // --- flame ---
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = flameCol;
  ctx.beginPath();
  ctx.moveTo(-w*0.58, 0);
  ctx.quadraticCurveTo(-w*0.58 - flameLen, -12 - speed*7, -w*0.58 - flameLen, 0);
  ctx.quadraticCurveTo(-w*0.58 - flameLen,  12 + speed*7, -w*0.58, 0);
  ctx.closePath();
  ctx.fill();

  // inner flame
  ctx.globalAlpha = 0.75;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.moveTo(-w*0.58, 0);
  ctx.quadraticCurveTo(-w*0.58 - flameLen*0.55, -6, -w*0.58 - flameLen*0.55, 0);
  ctx.quadraticCurveTo(-w*0.58 - flameLen*0.55,  6, -w*0.58, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // =========================
  // BODY (colored classic)
  // =========================
  ctx.save();

  // main metallic body gradient
  const bodyGrad = ctx.createLinearGradient(-w*0.25, 0, w*0.55, 0);
  bodyGrad.addColorStop(0, "rgba(230,235,245,0.95)");
  bodyGrad.addColorStop(0.35, "rgba(255,255,255,0.70)");
  bodyGrad.addColorStop(0.70, "rgba(200,210,225,0.95)");
  bodyGrad.addColorStop(1, "rgba(160,170,190,0.85)");

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 2;

  // fuselage
  ctx.beginPath();
  ctx.roundRect(-w*0.20, -h*0.22, w*0.72, h*0.44, 999);
  ctx.fill();
  ctx.stroke();

  // yellow warning stripe
  ctx.save();
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = "rgba(255,220,80,0.85)";
  ctx.beginPath();
  ctx.roundRect(w*0.02, -h*0.18, w*0.08, h*0.36, 10);
  ctx.fill();

  // stripe border
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = "rgba(0,0,0,0.45)";
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  // thin blue stripe
  ctx.save();
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(56,189,248,0.65)";
  ctx.beginPath();
  ctx.roundRect(w*0.12, -h*0.20, w*0.03, h*0.40, 8);
  ctx.fill();
  ctx.restore();

  ctx.restore();

  // =========================
  // RED NOSE CONE
  // =========================
  ctx.save();
  const noseGrad = ctx.createLinearGradient(w*0.20, 0, w*0.60, 0);
  noseGrad.addColorStop(0, "rgba(255,80,100,0.95)");
  noseGrad.addColorStop(1, "rgba(200,30,60,0.95)");

  ctx.fillStyle = noseGrad;
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = 1.6;

  ctx.beginPath();
  ctx.moveTo(w*0.56, 0);
  ctx.lineTo(w*0.28, -h*0.22);
  ctx.lineTo(w*0.28,  h*0.22);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // =========================
  // WINDOW (blue glass)
  // =========================
  ctx.save();
  const wx = w*0.18;
  const wy = -h*0.03;
  const wr = Math.min(w,h)*0.11;

  const winGrad = ctx.createLinearGradient(wx-wr, wy-wr, wx+wr, wy+wr);
  winGrad.addColorStop(0, "rgba(40,160,255,0.55)");
  winGrad.addColorStop(1, "rgba(0,40,80,0.55)");

  ctx.fillStyle = winGrad;
  ctx.strokeStyle = "rgba(255,255,255,0.20)";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.ellipse(wx, wy, wr*1.10, wr*0.85, 0, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();

  // shine
  ctx.globalAlpha = 0.85;
  ctx.fillStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.ellipse(wx-wr*0.20, wy-wr*0.20, wr*0.50, wr*0.28, -0.4, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  // =========================
  // RED FINS
  // =========================
  ctx.save();
  ctx.fillStyle = "rgba(255,60,90,0.90)";

  // top fin
  ctx.beginPath();
  ctx.moveTo(-w*0.02, -h*0.02);
  ctx.lineTo(-w*0.28, -h*0.34);
  ctx.lineTo(-w*0.32, -h*0.06);
  ctx.closePath();
  ctx.fill();

  // bottom fin
  ctx.beginPath();
  ctx.moveTo(-w*0.02,  h*0.02);
  ctx.lineTo(-w*0.28,  h*0.34);
  ctx.lineTo(-w*0.32,  h*0.06);
  ctx.closePath();
  ctx.fill();

  // small gray fin shadow
  ctx.globalAlpha = 0.35;
  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.beginPath();
  ctx.moveTo(-w*0.06, -h*0.02);
  ctx.lineTo(-w*0.22, -h*0.22);
  ctx.lineTo(-w*0.26, -h*0.06);
  ctx.closePath();
  ctx.fill();

  ctx.restore();

  // =========================
  // ENGINE NOZZLE
  // =========================
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,0.82)";
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-w*0.42, -h*0.10, w*0.18, h*0.20, 10);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // =========================
  // SHIELD
  // =========================
  if(powers.shield.active){
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "rgba(56,189,248,0.95)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.ellipse(0,0,w*0.72,h*0.55,0,0,Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}


// ✅ COOL ROCKET

// global tilt (keep)

function drawRocket(){
  switch(equippedSkin){

    case "classic":      return drawClassicRocket();
    case "cute":         return drawCuteRocket();
    case "ghost":        return drawGhostRocket();

    // ✅ ADD THESE TWO
    case "emerald":      return drawEmeraldRocket();
    case "phantom":      return drawPhantomRocket();

    case "ufo":          return drawUFO();
    case "jet":          return drawJet();

    case "shuttleMini":  return drawMiniShuttle();
    case "cyberBlade":   return drawCyberBlade();
    case "diamondElite": return drawDiamondElite();
    case "dragonShip":   return drawDragonShip();
    case "cometSpear":   return drawCometSpear();
    case "twinFighter":  return drawTwinFighter();
    case "satDrone":     return drawSatelliteDrone();
    case "octoUfo":      return drawOctoUFO();

    default:
      return drawClassicRocket();
  }
}



/* ✅ RED GATE WALLS */
function drawGate(ob){
  const th = getThemeStyle();

  ctx.save();
  ctx.fillStyle = th.gateFill;
  ctx.strokeStyle = th.gateStroke;
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.roundRect(ob.x, 0, ob.w, ob.topH, 18);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(ob.x, ob.bottomY, ob.w, ob.bottomH, 18);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}


/* ✅ Red LASER */
function drawLaser(ob){
  const pulse = 0.35 + 0.55*(Math.sin(ob.blink)*0.5+0.5);

  ctx.save();
  ctx.globalAlpha = pulse;

  ctx.fillStyle="rgba(248, 56, 56, 0.12)";
  ctx.beginPath();
  ctx.roundRect(ob.x-16, ob.y-ob.h*2.2, ob.w+32, ob.h*4.4, 999);
  ctx.fill();

  ctx.fillStyle="rgba(255, 50, 50, 0.55)";
  ctx.beginPath();
  ctx.roundRect(ob.x, ob.y-ob.h/2, ob.w, ob.h, 999);
  ctx.fill();

  ctx.globalAlpha = clamp(pulse+0.2,0,1);
  ctx.fillStyle="rgba(254, 37, 37, 0.65)";
  ctx.beginPath();
  ctx.roundRect(ob.x+6, ob.y-ob.h/5, ob.w-12, ob.h/2.5, 999);
  ctx.fill();

  ctx.restore();
}

function drawDrone(ob){
  ctx.save();
  ctx.translate(ob.x,ob.y);
  ctx.rotate(ob.rot);

  drawGlowCircle(0,0,ob.r+18,"rgba(56,189,248,1)",0.18);

  ctx.beginPath();
  ctx.arc(0,0,ob.r,0,Math.PI*2);
  ctx.fillStyle="rgba(255,255,255,0.05)";
  ctx.fill();
  ctx.strokeStyle="rgba(56,189,248,0.60)";
  ctx.lineWidth=2;
  ctx.stroke();

  ctx.globalAlpha=0.55;
  ctx.fillStyle="rgba(167,139,250,0.75)";
  ctx.fillRect(-ob.r-14,-3,ob.r+24,6);
  ctx.fillRect(-8,-ob.r-20,16,ob.r+28);

  ctx.restore();
}

function drawPowerups(){
  for(const p of powerups){
    const x=p.x, y=p.y, r=p.r;

    if(p.kind==="boost"){
      drawGlowCircle(x,y,r+18,"rgba(34,197,94,1)",0.12);
      ctx.beginPath(); ctx.arc(x,y,r+2,0,Math.PI*2);
      ctx.fillStyle="rgba(0,0,0,0.74)"; ctx.fill();
      ctx.strokeStyle="rgba(34,197,94,0.70)"; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.95)";
      ctx.font="900 15px system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText("⚡", x, y+1);
    }

    if(p.kind==="slow"){
      drawGlowCircle(x,y,r+18,"rgba(56,189,248,1)",0.12);
      ctx.beginPath(); ctx.arc(x,y,r+2,0,Math.PI*2);
      ctx.fillStyle="rgba(0,0,0,0.74)"; ctx.fill();
      ctx.strokeStyle="rgba(56,189,248,0.70)"; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.95)";
      ctx.font="900 15px system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText("❄", x, y+1);
    }

    if(p.kind==="magnet"){
      drawGlowCircle(x,y,r+18,"rgba(255,198,88,1)",0.12);
      ctx.beginPath(); ctx.arc(x,y,r+2,0,Math.PI*2);
      ctx.fillStyle="rgba(0,0,0,0.74)"; ctx.fill();
      ctx.strokeStyle="rgba(255,198,88,0.70)"; ctx.lineWidth=2; ctx.stroke();
      ctx.fillStyle="rgba(255,255,255,0.95)";
      ctx.font="900 15px system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText("🧲", x, y+1);
    }

    if(p.kind==="shieldPickup"){
      drawGlowCircle(x,y,r+18,"rgba(167,139,250,1)",0.14);
      drawHex(x,y,r+2,"rgba(10,10,18,0.90)","rgba(167,139,250,0.70)",2);
      ctx.fillStyle="rgba(255,255,255,0.95)";
      ctx.font="900 15px system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText("🛡", x, y+1);
    }
  }
}

function drawCoins(){
  for(const c of coinDrops){
    drawGlowCircle(c.x,c.y,c.r+14,"rgba(255,198,88,1)",0.10);
    ctx.beginPath();
    ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
    ctx.fillStyle="rgba(255,198,88,0.92)";
    ctx.fill();
    ctx.strokeStyle="rgba(255,255,255,0.15)";
    ctx.lineWidth=2;
    ctx.stroke();

    ctx.fillStyle="rgba(0,0,0,0.75)";
    ctx.font="900 13px system-ui";
    ctx.textAlign="center";
    ctx.textBaseline="middle";
    ctx.fillText("C", c.x, c.y+1);
  }
}

function drawParticles(){
  for(const p of particles){
    ctx.globalAlpha = clamp(p.life,0,1);
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = getSkinColors().flame;
    ctx.fill();
  }
  ctx.globalAlpha=1;
}

function render(){
  drawStars();
  drawParticles();

  for(const ob of obstacles){
    if(ob.kind==="gate"||ob.kind==="movingGate") drawGate(ob);
    if(ob.kind==="laser") drawLaser(ob);
    if(ob.kind==="drone") drawDrone(ob);
  }

  drawPowerups();
  drawCoins();
  drawRocket();
}

// =====================
// Update Loop
// =====================
function update(dt){
  if(!running || paused) return;

  const df = difficultyFactor();
  for(const s of microStars){
    s.x -= s.s*dt*(1 + (df-1)*0.65);
    if(s.x < -5){ s.x=W+rand(10,60); s.y=Math.random()*H; }
  }
  for(const s of stars){
    s.x -= s.s*dt*(1 + (df-1)*0.65);
    if(s.x < -5){ s.x=W+rand(10,60); s.y=Math.random()*H; }
  }

  tickPowers(dt);
  updateDifficulty(dt);

  spawnTimer += dt;
  const base = config.spawnEvery;
  const fairSpawnEvery = clamp(base - (level-1)*0.018, 0.52, base);
  if(spawnTimer >= fairSpawnEvery){
    spawnTimer = 0;
    spawnObstacle();
  }

  powerSpawnTimer += dt;
  if(powerSpawnTimer >= clamp(4.2 - level*0.08, 2.3, 5.0)){
    powerSpawnTimer = 0;
    spawnPowerup();
  }

 coinSpawnTimer += dt;

// base coin interval reduces with level + depends on mode coinMult
const baseCoinInterval = clamp(2.7 - level*0.05, 1.2, 3.0);
const modeCoinInterval = baseCoinInterval / (config.coinMult || 1);

if(coinSpawnTimer >= modeCoinInterval){
  coinSpawnTimer = 0;

  spawnCoin();

  // ✅ extra coins in harder levels
  const bonusChance = clamp((level - 1) * 0.035, 0, 0.65); // max 65%
  if(modeSelect.value === "hard" && Math.random() < bonusChance) spawnCoin();
  if(modeSelect.value === "extreme" && Math.random() < (0.25 + bonusChance)) spawnCoin();
}


  for(const ob of obstacles){
    if(ob.kind==="gate"||ob.kind==="movingGate"){
      if(ob.kind==="movingGate"){
        ob.oscT += dt*ob.oscSpeed;
        const shift = Math.sin(ob.oscT)*ob.oscAmp;
        ob.topH = clamp(ob.topH + shift*dt, 40, H-170);
        ob.bottomY = clamp(ob.bottomY + shift*dt, 130, H-70);
        ob.bottomH = H-ob.bottomY;
      }
      ob.x -= ob.speed*dt*globalObstacleTimeScale;
      if(!ob.passed && ob.x+ob.w<rocket.x){ ob.passed=true; score += 24; }
    }
    if(ob.kind==="laser"){
      ob.blink += dt*6;
      ob.x -= ob.speed*dt*globalObstacleTimeScale;
      if(!ob.passed && ob.x+ob.w<rocket.x){ ob.passed=true; score += 18; }
    }
    if(ob.kind==="drone"){
      ob.rot += dt*ob.rotSpeed;
      ob.x -= ob.speed*dt*globalObstacleTimeScale;
      if(!ob.passed && ob.x+ob.r<rocket.x){ ob.passed=true; score += 20; }
    }
  }

  obstacles = obstacles.filter(ob=>{
    const right = ob.kind==="drone" ? ob.x+ob.r : ob.x+(ob.w||0);
    return right>-160;
  });

  tickPowerups(dt);
  tickCoins(dt);
  applyControls(dt);
rocket.vx = 0; // ✅ disable horizontal drift completely
  // rocket engine particles
  if(running && !paused){
    const ex = rocket.x - 6;
    const ey = rocket.y + rocket.h/2;
    const count = 1 + Math.floor(Math.hypot(rocket.vx, rocket.vy) / 220);
    for(let i=0;i<count;i++){
      particles.push({
        x: ex + rand(-2,2),
        y: ey + rand(-6,6),
        vx: rand(-420,-140),
        vy: rand(-120,120),
        r: rand(1.0,2.4),
        life: rand(0.15,0.35)
      });
    }
  }

  tickParticles(dt);

  const scoreMult = powers.boost.active ? 1.40 : 1;
  score += config.scoreRate * dt * difficultyFactor() * scoreMult;

  if(scoreEl) scoreEl.textContent = String(Math.floor(score));

  const spd = difficultyFactor() * (powers.boost.active ? 1.20 : 1);
  if(speedEl) speedEl.textContent = `${spd.toFixed(1)}x`;

  if(score>highScore){
    highScore=Math.floor(score);
    if(highScoreEl) highScoreEl.textContent=String(highScore);
    localStorage.setItem("rocketHighScore", String(highScore));
  }

  if(checkCollision()) gameOver();
}

function loop(ts){
  if(!lastTime) lastTime=ts;
  const dt = clamp((ts-lastTime)/1000, 0, 0.033);
  lastTime=ts;

  resizeCanvas(false);
  update(dt);
  render();
  requestAnimationFrame(loop);
}

// =====================
// Game lifecycle
// =====================
let isGameOver = false;

function applyMode(){
  config = modeConfig[modeSelect.value] || modeConfig.normal;
  setTip(`Mode: ${modeSelect.value.toUpperCase()} | Premium powers enabled`);
}

function resetGame(){
  isGameOver = false;
  score=0; level=1; difficulty=0;
  spawnTimer=0; powerSpawnTimer=0; coinSpawnTimer=0;

  powers.shield.available=true;
  powers.shield.active=false;
  powers.shield.energy=100;
  powers.boost.active=false; powers.boost.t=0;
  powers.slow.active=false; powers.slow.t=0;
  powers.magnet.active=false; powers.magnet.t=0;

  obstacles=[]; powerups=[]; particles=[]; coinDrops=[];
  resizeCanvas(true);
  resetRocket();
  initStars();

  if(scoreEl) scoreEl.textContent="0";
  if(speedEl) speedEl.textContent="1.0x";
  if(levelEl) levelEl.textContent="1";
  if(difficultyProgress) difficultyProgress.style.width="0%";
  if(difficultyText) difficultyText.textContent="0%";

  setStatus("ENGINE STABLE");
  setTip("Neon walls enabled: obstacles are visible now.");
  uiPowerStatus();

  setOverlay(true);
  showGameOverUI(false);
}

function startGame(){
  running=true;
  paused=false;

  showGameOverUI(false);
  setOverlay(false);

  setStatus("FLIGHT ACTIVE");
  beep(520,0.08);

  setTimeout(()=>resizeCanvas(true), 120);
}

function gameOver(){
  running=false;
  paused=false;
  isGameOver = true;

  setOverlay(false);

  setStatus("CRITICAL DAMAGE");
  setTip("Game Over. Restart?");

  burstParticles(rocket.x+rocket.w/2, rocket.y+rocket.h/2, 26);
  beep(180,0.18);
  beep(120,0.18);

  if(finalScore) finalScore.textContent = String(Math.floor(score));
  if(finalHigh) finalHigh.textContent = String(Math.floor(highScore));
  if(finalLevel) finalLevel.textContent = String(level);

  showGameOverUI(true);
}

// =====================
// Shop
// =====================
let activeTab="skins";

function openShop(){
  if(!shopModal) return;
  shopModal.classList.remove("hidden");
  renderShop();
}
function closeShop(){
  if(!shopModal) return;
  shopModal.classList.add("hidden");
}
function canBuy(p){ return coins>=p; }

function renderShop(){
  updateWalletUI();
  tabBtns.forEach(b=>b.classList.toggle("active", b.dataset.tab===activeTab));
  shopContent.innerHTML="";

  const list = activeTab==="skins" ? SKINS : THEMES;

  for(const item of list){
    const owned = activeTab==="skins" ? ownedSkins.has(item.id) : ownedThemes.has(item.id);
    const equipped = activeTab==="skins" ? equippedSkin===item.id : equippedTheme===item.id;

    const card=document.createElement("div");
    card.className="shopItem";
    card.innerHTML=`
      <div class="shopPreview">${item.icon}</div>
      <div class="shopName">${item.name}</div>
      <div class="shopDesc">${item.desc}</div>
      <div class="shopBottom">
        <div class="priceTag">🪙 ${item.price}</div>
        <button class="buyBtn ${equipped ? "primary":""} ${(!owned && !canBuy(item.price))?"locked":""}">
          ${equipped ? "EQUIPPED" : (owned ? "EQUIP":"BUY")}
        </button>
      </div>
    `;

    const btn=card.querySelector("button");
    btn.addEventListener("click", ()=>{
      if(equipped) return;

      if(!owned){
        if(!canBuy(item.price)){
          setTip("Not enough coins. Collect more.");
          return;
        }
        coins -= item.price;
        if(activeTab==="skins") ownedSkins.add(item.id);
        else ownedThemes.add(item.id);
      }

      if(activeTab==="skins"){
        equippedSkin=item.id;
        if(skinSelect) skinSelect.value=item.id;
      }else{
        applyTheme(item.id);
        if(themeSelect) themeSelect.value=item.id;
      }

      persist();
      renderShop();
    });

    shopContent.appendChild(card);
  }
}

// =====================
// Controls / Events
// =====================
window.addEventListener("keydown",(e)=>{
  const k=e.key.toLowerCase();
  if(k==="arrowup"||k==="w") keys.up=true;
  if(k==="arrowdown"||k==="s") keys.down=true;
  if(k==="arrowleft"||k==="a") keys.left=true;
  if(k==="arrowright"||k==="d") keys.right=true;

  if(k===" " || k==="enter"){
    if(isGameOver){
      resetGame();
      startGame();
    } else if(!running){
      startGame();
    }
  }

  if(k==="f") toggleFullscreen();
});

window.addEventListener("keyup",(e)=>{
  const k=e.key.toLowerCase();
  if(k==="arrowup"||k==="w") keys.up=false;
  if(k==="arrowdown"||k==="s") keys.down=false;
  if(k==="arrowleft"||k==="a") keys.left=false;
  if(k==="arrowright"||k==="d") keys.right=false;
});

if(modeSelect){
  modeSelect.addEventListener("change", ()=>{ applyMode(); resetGame(); });
}
if(shieldBtn) shieldBtn.addEventListener("click", ()=>activateShield());

// ✅ START button now requests fullscreen+landscape on mobile
if(startBtn){
  startBtn.addEventListener("click", async ()=>{
    await goFullscreenLandscape();
    resetGame();
    startGame();
  });
}

if(soundBtn){
  soundBtn.addEventListener("click", ()=>{
    soundOn=!soundOn;
    soundBtn.textContent = soundOn ? "🔊" : "🔇";
  });
}

if(pauseBtn){
  pauseBtn.addEventListener("click", ()=>{
    if(!running) return;
    paused=!paused;
    pauseBtn.textContent = paused ? "▶" : "⏸";
    setStatus(paused ? "SYSTEM PAUSED" : "FLIGHT ACTIVE");
    beep(paused ? 340 : 540, 0.05);
  });
}

if(restartBtn){
  restartBtn.addEventListener("click", ()=>{
    resetGame();
    startGame();
  });
}

if(fullscreenBtn){
  fullscreenBtn.addEventListener("click", ()=>toggleFullscreen());
}

// ✅ canvas tap also goes fullscreen landscape
canvas.addEventListener("pointerdown", async ()=>{
  if(!running){
    await goFullscreenLandscape();
    resetGame();
    startGame();
  }
});

// mobile hold
function bindHold(btn, onDown, onUp){
  if(!btn) return;
  const down=(e)=>{ e.preventDefault(); onDown(); };
  const up=(e)=>{ e.preventDefault(); onUp(); };
  btn.addEventListener("pointerdown", down, {passive:false});
  btn.addEventListener("pointerup", up, {passive:false});
  btn.addEventListener("pointercancel", up, {passive:false});
  btn.addEventListener("pointerleave", up, {passive:false});
}
bindHold(upBtn, ()=>keys.up=true, ()=>keys.up=false);
bindHold(downBtn, ()=>keys.down=true, ()=>keys.down=false);

// Theme/Skin select (locked check)
if(themeSelect){
  themeSelect.addEventListener("change", ()=>{
    const t = themeSelect.value;
    if(!ownedThemes.has(t)){
      themeSelect.value = equippedTheme;
      setTip("Theme locked. Buy it in shop.");
      return;
    }
    applyTheme(t);
  });
}
if(skinSelect){
  skinSelect.addEventListener("change", ()=>{
    const s = skinSelect.value;
    if(!ownedSkins.has(s)){
      skinSelect.value = equippedSkin;
      setTip("Skin locked. Buy it in shop.");
      return;
    }
    equippedSkin=s;
    persist();
  });
}

// Shop events
if(shopBtn) shopBtn.addEventListener("click", openShop);
if(closeShopBtn) closeShopBtn.addEventListener("click", closeShop);

if(shopModal){
  const backdrop = shopModal.querySelector(".shopBackdrop");
  if(backdrop) backdrop.addEventListener("click", closeShop);
}
tabBtns.forEach(btn=>btn.addEventListener("click", ()=>{
  activeTab=btn.dataset.tab;
  renderShop();
}));

// ✅ Restart-only GameOver button
if(restartOnlyBtn){
  restartOnlyBtn.addEventListener("click", ()=>{
    resetGame();
    startGame();
  });
}

// =====================
// Tip rotation (bug fixed)
// =====================
const SYSTEM_TIPS = [
  "Collect coins to unlock skins/themes in Shop.",
  "Tip: Use Shield before tight gates.",
  "Boost increases score rate.",
  "Slow gives more reaction time.",
  "Magnet pulls nearby coins!",
  "Press F for fullscreen."
];

let tipIndex = 0;

function startTipRotation(){
  setInterval(()=>{
    // ✅ If GameOver UI is visible -> don't rotate tips
    if(gameOverUI && !gameOverUI.classList.contains("hidden")) return;

    tipIndex = (tipIndex + 1) % SYSTEM_TIPS.length;
    setTip(SYSTEM_TIPS[tipIndex], true);
  }, 4200);
}

// =====================
// Init
// =====================
function init(){
  // roundRect polyfill
  if(!CanvasRenderingContext2D.prototype.roundRect){
    CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){
      const radius=typeof r==="number"
        ? {tl:r,tr:r,br:r,bl:r}
        : {tl:r.tl||0,tr:r.tr||0,br:r.br||0,bl:r.bl||0};

      this.beginPath();
      this.moveTo(x+radius.tl,y);
      this.lineTo(x+w-radius.tr,y);
      this.quadraticCurveTo(x+w,y,x+w,y+radius.tr);
      this.lineTo(x+w,y+h-radius.br);
      this.quadraticCurveTo(x+w,y+h,x+w-radius.br,y+h);
      this.lineTo(x+radius.bl,y+h);
      this.quadraticCurveTo(x,y+h,x,y+h-radius.bl);
      this.lineTo(x,y+radius.tl);
      this.quadraticCurveTo(x,y,x+radius.tl,y);
      this.closePath();
      return this;
    };
  }

  resizeCanvas(true);
  initStars();
  applyMode();
  resetGame();
  applyMobileTuning();

  startTipRotation();

  window.addEventListener("resize", ()=>{
    applyMobileTuning();
    resizeCanvas(true);
  });

  requestAnimationFrame(loop);
}

init();
