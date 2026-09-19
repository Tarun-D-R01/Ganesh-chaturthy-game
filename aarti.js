const AARTI_INSTRUMENTS = [
    { icon: "🪔", name: "Diya", freq: 392 },
    { icon: "🔔", name: "Ghanta", freq: 784 },
    { icon: "🐚", name: "Shankh", freq: 247 },
    { icon: "🌸", name: "Pushpa", freq: 523 }
];

const aartiScreen = document.getElementById("aarti-screen");
const aartiGrid = document.getElementById("aarti-grid");
const aartiStatus = document.getElementById("aarti-status");
const aartiRoundEl = document.getElementById("aarti-round");
const aartiScoreEl = document.getElementById("aarti-score");
const aartiBestEl = document.getElementById("aarti-best");
const aartiLivesEl = document.getElementById("aarti-lives");
const aartiStartBtn = document.getElementById("aarti-start-btn");

let aartiAudio = null;
let aartiScore = 0;
let aartiLives = 3;
let aartiRound = 1;
let aartiSequence = [];
let aartiStep = 0;
let aartiListening = false;
let aartiBusy = false;
let aartiTimers = [];

function aartiBest() {
    return Number(localStorage.getItem("ganeshAartiHighScore")) || 0;
}

function saveAartiBest() {
    if (aartiScore > aartiBest()) {
        localStorage.setItem("ganeshAartiHighScore", String(aartiScore));
    }

    aartiBestEl.innerText = Math.max(aartiScore, aartiBest());
}

function playTempleTone(freq) {
    try {
        const AudioKit = window.AudioContext || window.webkitAudioContext;
        if (!AudioKit) {
            return;
        }

        aartiAudio = aartiAudio || new AudioKit();
        aartiAudio.resume();

        const osc = aartiAudio.createOscillator();
        const gain = aartiAudio.createGain();

        osc.type = "triangle";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, aartiAudio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.14, aartiAudio.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, aartiAudio.currentTime + 0.32);

        osc.connect(gain);
        gain.connect(aartiAudio.destination);
        osc.start();
        osc.stop(aartiAudio.currentTime + 0.34);
    } catch (error) {
        // Audio is optional if the browser blocks it.
    }
}

function clearAartiTimers() {
    aartiTimers.forEach((id) => clearTimeout(id));
    aartiTimers = [];
}

function stopAartiEcho() {
    aartiListening = false;
    aartiBusy = false;
    clearAartiTimers();
}

function updateAartiHud() {
    aartiScoreEl.innerText = aartiScore;
    aartiLivesEl.innerText = "❤️".repeat(Math.max(0, aartiLives));
    aartiRoundEl.innerText = `Round ${aartiRound}`;
    saveAartiBest();
}

function buildAartiPads() {
    aartiGrid.innerHTML = "";

    AARTI_INSTRUMENTS.forEach((item, index) => {
        const button = document.createElement("button");
        button.className = "aarti-pad";
        button.innerHTML = `${item.icon}<br><small>${item.name}</small>`;
        button.onclick = () => handleAartiPad(index);
        aartiGrid.appendChild(button);
    });
}

function getAartiPads() {
    return aartiGrid.querySelectorAll(".aarti-pad");
}

function lightAartiPad(index, on) {
    const pad = getAartiPads()[index];
    if (!pad) {
        return;
    }

    pad.classList.toggle("lit", on);
}

function startAartiEcho() {
    withCurtainTransition(() => {
    menuScreen.classList.remove("active");
    gameScreen.classList.remove("active");

    if (typeof quizScreen !== "undefined" && quizScreen) {
        quizScreen.classList.remove("active");
    }

    aartiScreen.classList.add("active");
    stopFestivalEffects();
    setFestivalPlayMode(true);
    stopAartiEcho();
    buildAartiPads();
    aartiBestEl.innerText = aartiBest();
    aartiStatus.innerText = "Repeat the sacred sequence Ganesha shows you.";
    aartiStartBtn.classList.remove("hidden");
    });
}

function beginAartiEcho() {
    stopAartiEcho();
    aartiScore = 0;
    aartiLives = 3;
    aartiRound = 1;
    aartiSequence = [];
    aartiStartBtn.classList.add("hidden");
    updateAartiHud();
    nextAartiRound(true);
}

function nextAartiRound(freshPad) {
    if (freshPad) {
        aartiSequence.push(
            Math.floor(Math.random() * AARTI_INSTRUMENTS.length)
        );
    }

    aartiStep = 0;
    aartiListening = false;
    aartiBusy = true;
    aartiStatus.innerText = "Watch the aarti...";
    updateAartiHud();
    playAartiSequence(0);
}

function playAartiSequence(i) {
    if (i >= aartiSequence.length) {
        aartiBusy = false;
        aartiListening = true;
        aartiStatus.innerText = "Your turn — echo the aarti!";
        return;
    }

    const index = aartiSequence[i];
    const wait = setTimeout(() => {
        lightAartiPad(index, true);
        playTempleTone(AARTI_INSTRUMENTS[index].freq);

        const off = setTimeout(() => {
            lightAartiPad(index, false);
            playAartiSequence(i + 1);
        }, 320);

        aartiTimers.push(off);
    }, 220);

    aartiTimers.push(wait);
}

function handleAartiPad(index) {
    if (!aartiListening || aartiBusy) {
        return;
    }

    lightAartiPad(index, true);
    playTempleTone(AARTI_INSTRUMENTS[index].freq);

    setTimeout(() => lightAartiPad(index, false), 180);

    if (index === aartiSequence[aartiStep]) {
        aartiStep += 1;

        if (aartiStep >= aartiSequence.length) {
            aartiListening = false;
            aartiScore += 40 + aartiRound * 15;
            aartiRound += 1;
            aartiStatus.innerText = "Shubh! The aarti grows...";
            updateAartiHud();

            const nxt = setTimeout(() => nextAartiRound(true), 700);
            aartiTimers.push(nxt);
        }

        return;
    }

    aartiListening = false;
    aartiLives -= 1;
    const pad = getAartiPads()[index];
    if (pad) {
        pad.classList.add("wrong");
        setTimeout(() => pad.classList.remove("wrong"), 400);
    }

    if (aartiLives <= 0) {
        aartiStatus.innerText =
            `Aarti complete. Score ${aartiScore}. Best ${Math.max(aartiScore, aartiBest())}.`;
        aartiStartBtn.innerText = "Play Again";
        aartiStartBtn.classList.remove("hidden");
        updateAartiHud();
        return;
    }

    aartiStatus.innerText = "Almost — watch once more.";
    updateAartiHud();
    const replay = setTimeout(() => nextAartiRound(false), 800);
    aartiTimers.push(replay);
}

window.playTempleTone = playTempleTone;
window.startAartiEcho = startAartiEcho;
window.beginAartiEcho = beginAartiEcho;
window.stopAartiEcho = stopAartiEcho;
