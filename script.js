/* =========================================================
   GANESH CHATURTHI - MODAK CATCHER
   COMPETITIVE SCORE + HIGH SCORE VERSION
   ========================================================= */

let score = 0;
let lives = 3;

let highScore =
    Number(localStorage.getItem("ganeshHighScore")) || 0;

let gameRunning = false;

let animationFrame = null;
let spawnTimer = null;

let activeItems = [];

let lastTime = 0;

let controlsReady = false;


/* =========================================================
   DOM
   ========================================================= */

const landingScreen =
    document.getElementById("landing-screen");

const menuScreen =
    document.getElementById("menu-screen");

const gameScreen =
    document.getElementById("game-screen");

const gameContainer =
    document.getElementById("game-container");

const basket =
    document.getElementById("player-basket");

const scoreDisplay =
    document.getElementById("score");

const livesDisplay =
    document.getElementById("lives");

const gameOverModal =
    document.getElementById("game-over-modal");

const finalScore =
    document.getElementById("final-score");


/* =========================================================
   SWEETS
   ========================================================= */

const sweetTypes = [

    {
        emoji: "🥟",
        points: 10,
        name: "Modak"
    },

    {
        emoji: "🟡",
        points: 15,
        name: "Laddu"
    },

    {
        emoji: "🟠",
        points: 20,
        name: "Peda"
    },

    {
        emoji: "🌀",
        points: 25,
        name: "Jalebi"
    }

];


/* =========================================================
   PAGE LOAD
   ========================================================= */

let landingIntroPlayed = false;

function revealLandingIntro() {

    if (landingIntroPlayed) {
        return;
    }

    landingIntroPlayed = true;

    document.body.classList.remove("booting");

    const bootScreen =
        document.getElementById("boot-screen");

    if (bootScreen) {

        bootScreen.classList.add("hidden");

        setTimeout(() => {
            bootScreen.remove();
        }, 600);

    }

    gsap.fromTo(
        "#landing-screen .title",
        { y: -28, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: "power3.out"
        }
    );

    gsap.fromTo(
        "#landing-screen .three-container",
        { scale: 0.94, opacity: 0 },
        {
            scale: 1,
            opacity: 1,
            duration: 1.05,
            ease: "power3.out",
            delay: 0.05
        }
    );

    gsap.fromTo(
        "#interactive-subtitle",
        { y: 12, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.75,
            delay: 0.18
        }
    );

    gsap.fromTo(
        "#start-btn, #chant-btn",
        { y: 18, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: 0.24,
            stagger: 0.08
        }
    );

    gsap.fromTo(
        ".left-diya, .right-diya",
        { scale: 0.7, opacity: 0 },
        {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: 0.3,
            ease: "back.out(1.6)"
        }
    );

    // createMarigoldPetals(); // Disabled to improve model loading performance

}


function waitForLandingReady() {

    setupInteractiveText();
    setupParallaxSpotlight();
    applyGoldMaterialToGanesha();

    const nameInput = document.getElementById("devotee-name");
    if (nameInput) {
        nameInput.value = localStorage.getItem("ganeshDevoteeName") || "";
    }

    const reveal = () => {
        requestAnimationFrame(revealLandingIntro);
    };

    const startWatchingModel = () => {

        const model =
            document.getElementById("ganesha-model");

        if (!model) {
            reveal();
            return;
        }

        if (model.loaded) {
            reveal();
            return;
        }

        model.addEventListener("load", reveal, { once: true });

    };

    if (window.customElements) {

        customElements
            .whenDefined("model-viewer")
            .then(startWatchingModel)
            .catch(reveal);

    } else {

        startWatchingModel();

    }

    setTimeout(reveal, 5000);

}


if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        waitForLandingReady
    );

} else {

    waitForLandingReady();

}

// Hide loading indicator when 3D model loads
const ganeshaModel = document.getElementById('ganesha-model');
const modelLoading = document.getElementById('model-loading');

if (ganeshaModel && modelLoading) {
    // Hide loading indicator immediately since model shows with reveal="auto"
    modelLoading.classList.add('hidden');
    
    ganeshaModel.addEventListener('load', () => {
        modelLoading.classList.add('hidden');
    });
}


/* =========================================================
   SPOTLIGHT
   ========================================================= */

function setupParallaxSpotlight() {

    const spotlight =
        document.getElementById("spotlight");

    if (!spotlight) return;

    window.addEventListener(
        "mousemove",
        (event) => {

            spotlight.style.background =
                `radial-gradient(
                    180px circle at
                    ${event.clientX}px
                    ${event.clientY}px,
                    rgba(255,215,0,0.6),
                    transparent 70%
                )`;

        }
    );

}


/* =========================================================
   AARTI
   ========================================================= */

function triggerAarti(diyaElement) {

    const aura =
        document.getElementById("aura");

    if (aura) {

        gsap.to(aura, {

            scale: 1.4,

            filter:
                "brightness(1.8)",

            duration: 0.4,

            yoyo: true,

            repeat: 1

        });

    }

    const rect =
        diyaElement.getBoundingClientRect();

    for (let i = 0; i < 12; i++) {

        const spark =
            document.createElement("div");

        spark.className =
            "aarti-spark";

        document.body.appendChild(
            spark
        );

        const startX =
            rect.left +
            rect.width / 2;

        const startY =
            rect.top;

        spark.style.left =
            `${startX}px`;

        spark.style.top =
            `${startY}px`;

        const targetX =
            window.innerWidth / 2 +
            (Math.random() * 80 - 40);

        const targetY =
            window.innerHeight / 2 +
            (Math.random() * 80 - 40);

        gsap.to(spark, {

            x:
                targetX - startX,

            y:
                targetY - startY,

            opacity: 0,

            scale:
                Math.random() * 1.5 +
                0.5,

            duration:
                Math.random() * 0.8 +
                0.6,

            ease:
                "power2.out",

            onComplete:
                () => spark.remove()

        });

    }

}


/* =========================================================
   PETALS (DISABLED FOR PERFORMANCE)
   ========================================================= */

function createMarigoldPetals() {
    // Disabled to improve 3D model loading performance
    // Falling petals were causing performance issues
    return;
}


/* =========================================================
   STOP FESTIVAL EFFECTS
   ========================================================= */

function stopFestivalEffects() {

    document
        .querySelectorAll(".petal")
        .forEach(
            petal => {

                petal.style.display =
                    "none";

            }
        );

    const spotlight =
        document.getElementById(
            "spotlight"
        );

    if (spotlight) {

        spotlight.style.display =
            "none";

    }

}


/* =========================================================
   RESTORE FESTIVAL EFFECTS
   ========================================================= */

function restoreFestivalEffects() {

    document
        .querySelectorAll(".petal")
        .forEach(
            petal => {

                petal.style.display =
                    "block";

            }
        );

    const spotlight =
        document.getElementById(
            "spotlight"
        );

    if (spotlight) {

        spotlight.style.display =
            "block";

    }

}


function setFestivalPlayMode(on) {
    document.body.classList.toggle("play-mode", !!on);
}

function chantMorya() {
    const flash = document.getElementById("morya-flash");

    if (flash) {
        flash.classList.remove("show");
        void flash.offsetWidth;
        flash.classList.add("show");
    }

    if (navigator.vibrate) {
        navigator.vibrate([80, 40, 80, 40, 160]);
    }

    if (typeof playTempleTone === "function") {
        playTempleTone(392);
        setTimeout(() => playTempleTone(523), 140);
        setTimeout(() => playTempleTone(784), 280);
    }
}

function showFestivalBlessing() {
    const nameInput = document.getElementById("devotee-name");
    const name = (nameInput && nameInput.value.trim()) ||
        localStorage.getItem("ganeshDevoteeName") ||
        "Devotee";

    if (nameInput && nameInput.value.trim()) {
        localStorage.setItem("ganeshDevoteeName", name);
    }

    const modakBest = Number(localStorage.getItem("ganeshHighScore")) || 0;
    const quizBest = Number(localStorage.getItem("ganeshQuizHighScoreV2")) || 0;
    const echoBest = Number(localStorage.getItem("ganeshAartiHighScore")) || 0;
    const sweetsCrushBest = Number(localStorage.getItem("sweetsCrushBest")) || 0;
    const aura = modakBest + quizBest + echoBest + sweetsCrushBest;

    document.getElementById("blessing-name").innerText =
        `Blessings upon ${name}`;

    document.getElementById("blessing-stats").innerHTML =
        `Modak Catcher best: <b>${modakBest}</b><br>` +
        `Festival Quiz best: <b>${quizBest}</b><br>` +
        `Aarti Echo best: <b>${echoBest}</b><br>` +
        `Sweets Crush best: <b>${sweetsCrushBest}</b> (Highest Level: ${Math.floor(sweetsCrushBest / 500) + 1})`;

    document.getElementById("blessing-aura").innerText = aura;
    document.getElementById("blessing-modal").classList.remove("hidden");
}

function closeFestivalBlessing() {
    document.getElementById("blessing-modal").classList.add("hidden");
}


/* =========================================================
   GOLD GANESHA
   ========================================================= */

function applyGoldMaterialToGanesha() {

    const models = [

        document.getElementById(
            "ganesha-model"
        ),

        document.getElementById(
            "ganesha-menu-model"
        )

    ];

    models.forEach(viewer => {

        if (!viewer) return;

        viewer.addEventListener(
            "load",
            () => {

                if (
                    !viewer.model ||
                    !viewer.model.materials
                ) {

                    return;

                }

                viewer.model.materials
                    .forEach(
                        material => {

                            material
                                .pbrMetallicRoughness
                                .setBaseColorFactor(
                                    [
                                        0.95,
                                        0.75,
                                        0.2,
                                        1
                                    ]
                                );

                            material
                                .pbrMetallicRoughness
                                .setMetallicFactor(
                                    0.8
                                );

                            material
                                .pbrMetallicRoughness
                                .setRoughnessFactor(
                                    0.3
                                );

                        }
                    );

            }
        );

    });

}


/* =========================================================
   INTERACTIVE TEXT
   ========================================================= */

function setupInteractiveText() {

    const subtitle =
        document.getElementById(
            "interactive-subtitle"
        );

    if (!subtitle) return;

    const text =
        subtitle.innerText.trim();

    subtitle.innerHTML = "";

    for (const char of text) {

        const span =
            document.createElement(
                "span"
            );

        span.innerText =
            char === " "
                ? "\u00A0"
                : char;

        subtitle.appendChild(
            span
        );

    }

}


/* =========================================================
   GO TO MENU
   ========================================================= */

function ensureMenuModel() {

    const menuModel =
        document.getElementById("ganesha-menu-model");

    if (
        menuModel &&
        !menuModel.getAttribute("src")
    ) {

        menuModel.setAttribute("src", "ganesha.glb");

    }

}


let curtainBusy = false;

function withCurtainTransition(action, afterOpen) {
    const stage = document.getElementById("mandap-curtains");

    if (!stage) {
        action();
        if (afterOpen) {
            afterOpen();
        }
        return;
    }

    if (curtainBusy) {
        return;
    }

    curtainBusy = true;
    stage.classList.remove("is-opening");
    stage.classList.add("is-closing");

    setTimeout(() => {
        action();

        stage.classList.remove("is-closing");
        void stage.offsetWidth;
        stage.classList.add("is-opening");

        if (afterOpen) {
            setTimeout(afterOpen, 180);
        }

        setTimeout(() => {
            stage.classList.remove("is-opening");
            curtainBusy = false;
        }, 700);
    }, 560);
}


function goToMenu() {
    withCurtainTransition(() => {
        ensureMenuModel();

        landingScreen.classList.remove("active");
        landingScreen.style.opacity = "";
        landingScreen.style.transform = "";
        menuScreen.classList.add("active");
        menuScreen.style.opacity = "1";
        menuScreen.style.transform = "";
    }, () => {
        gsap.from(".menu-model-container", {
            duration: 0.9,
            scale: 0.2,
            opacity: 0,
            ease: "back.out(1.7)"
        });

        gsap.from(".card", {
            duration: 0.7,
            scale: 0.8,
            opacity: 0,
            stagger: 0.12,
            ease: "back.out(1.7)"
        });
    });
}


/* =========================================================
   START GAME
   ========================================================= */

function startModakGame() {
    withCurtainTransition(startModakGameNow);
}

function startModakGameNow() {

    stopGameLoop();

    clearTimeout(
        spawnTimer
    );

    activeItems.forEach(
        item => {

            if (item.element) {
                item.element.remove();
            }

        }
    );

    activeItems = [];


    menuScreen
        .classList
        .remove("active");

    if (typeof quizScreen !== "undefined" && quizScreen) {
        quizScreen.classList.remove("active");
    }

    if (typeof aartiScreen !== "undefined" && aartiScreen) {
        aartiScreen.classList.remove("active");
    }

    const sweetsCrushScreen = document.getElementById('sweets-crush-screen');
    if (sweetsCrushScreen) {
        sweetsCrushScreen.classList.remove("active");
    }

    gameScreen
        .classList
        .add("active");


    stopFestivalEffects();
    setFestivalPlayMode(true);


    /*
       NEW GAME = SCORE RESET
    */

    score = 0;

    lives = 3;


    scoreDisplay.innerText =
        "0";

    updateLives();

    gameOverModal
        .classList
        .add("hidden");


    requestAnimationFrame(
        () => {

            positionBasket(
                gameContainer
                    .clientWidth / 2
            );

        }
    );


    if (!controlsReady) {

        setupGameControls();

        controlsReady = true;

    }


    gameRunning = true;

    lastTime =
        performance.now();


    createInitialItems();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );


    scheduleSpawning();

}


/* =========================================================
   GET MAX HAZARDS
   ========================================================= */

function getMaxHazards() {

    /*
       Score-based hazard progression.

       0-199     = 1
       200-399   = 2
       400-599   = 2
       600-799   = 3
       800-999   = 3
       1000+     = 4
    */

    if (score >= 1000) {
        return 4;
    }

    if (score >= 600) {
        return 3;
    }

    if (score >= 200) {
        return 2;
    }

    return 1;

}


/* =========================================================
   INITIAL ITEMS
   ========================================================= */

function createInitialItems() {

    /*
       6 objects at the start.

       ONE hazard maximum at beginning.
    */

    const count = 6;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        /*
           Only one initial hazard.
        */

        const type =
            i === 0
                ? "hazard"
                : "sweet";

        spawnItem(
            type,
            true,
            i
        );

    }

}


/* =========================================================
   SPAWN SYSTEM
   ========================================================= */

function scheduleSpawning() {

    if (!gameRunning) return;


    /*
       Spawning gradually speeds up.

       Minimum interval = 400ms.
    */

    const interval =
        Math.max(
            400,
            850 -
            score * 0.45
        );


    spawnTimer =
        setTimeout(
            () => {

                if (!gameRunning) {
                    return;
                }


                /*
                   Keep 10 objects max.
                */

                if (
                    activeItems.length <
                    10
                ) {

                    const hazardCount =
                        activeItems.filter(
                            item =>
                                item.type ===
                                "hazard"
                        ).length;


                    const maxHazards =
                        getMaxHazards();


                    /*
                       Chance of spawning
                       a hazard.

                       Gets slightly higher
                       with score.
                    */

                    const hazardChance =
                        Math.min(
                            0.45,
                            0.18 +
                            score * 0.0002
                        );


                    if (
                        hazardCount <
                            maxHazards &&

                        Math.random() <
                            hazardChance
                    ) {

                        spawnItem(
                            "hazard"
                        );

                    } else {

                        spawnItem(
                            "sweet"
                        );

                    }

                }


                scheduleSpawning();

            },

            interval
        );

}


/* =========================================================
   SPAWN ITEM
   ========================================================= */

function spawnItem(
    type,
    initial = false,
    index = 0
) {

    if (!gameRunning) return;


    const item =
        document.createElement(
            "div"
        );

    item.className =
        "falling-item";


    /* =========================================
       HAZARD
       ========================================= */

    if (type === "hazard") {

        item.innerText = "⚡";

        item.classList.add(
            "hazard-item"
        );

    }


    /* =========================================
       SWEET
       ========================================= */

    else {

        const sweet =
            sweetTypes[
                Math.floor(
                    Math.random() *
                    sweetTypes.length
                )
            ];

        item.innerText =
            sweet.emoji;

        item.classList.add(
            "sweet-item"
        );

        item.dataset.points =
            sweet.points;

        item.dataset.name =
            sweet.name;

    }


    /* =========================================
       X POSITION
       ========================================= */

    const width =
        gameContainer.clientWidth;

    const itemWidth = 48;

    const maxX =
        Math.max(
            10,
            width -
            itemWidth -
            10
        );

    const x =
        10 +
        Math.random() *
        (maxX - 10);


    /* =========================================
       Y POSITION
       ========================================= */

    let y;

    if (initial) {

        y =
            -70 -
            index *
            (
                90 +
                Math.random() *
                90
            );

    } else {

        y =
            -70 -
            Math.random() *
            80;

    }


    gameContainer.appendChild(
        item
    );


    /* =========================================
       BASE SPEED
       ========================================= */

    const baseSpeed =
        230 +
        Math.random() *
        60;


    /*
       Current score increases speed.

       0     = +0
       100   = +35
       500   = +175
       1000  = +350
    */

    const scoreSpeedBonus =
        score * 0.35;


    const speed =
        baseSpeed +
        scoreSpeedBonus;


    /* =========================================
       OBJECT
       ========================================= */

    const object = {

        element: item,

        x: x,

        y: y,

        width: 48,

        height: 48,

        baseSpeed: speed,

        type: type,

        points:
            type === "sweet"
                ? Number(
                    item.dataset.points
                )
                : 0

    };


    item.style.transform =
        `translate3d(
            ${x}px,
            ${y}px,
            0
        )`;


    activeItems.push(
        object
    );

}


/* =========================================================
   GAME LOOP
   ========================================================= */

function gameLoop(timestamp) {

    if (!gameRunning) {
        return;
    }


    const delta =
        Math.min(
            (
                timestamp -
                lastTime
            ) / 1000,

            0.033
        );


    lastTime =
        timestamp;


    updateItems(
        delta
    );


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =========================================================
   UPDATE ITEMS
   ========================================================= */

function updateItems(delta) {

    const containerHeight =
        gameContainer.clientHeight;

    const basketRect =
        getBasketRect();


    for (
        let i =
            activeItems.length - 1;

        i >= 0;

        i--
    ) {

        const item =
            activeItems[i];


        /* =========================================
           SCORE-BASED SPEED
           ========================================= */

        const currentSpeed =
            item.baseSpeed +
            score * 0.20;


        item.y +=
            currentSpeed *
            delta;


        item.element.style.transform =
            `translate3d(
                ${item.x}px,
                ${item.y}px,
                0
            )`;


        /* =========================================
           COLLISION
           ========================================= */

        const itemLeft =
            item.x;

        const itemRight =
            item.x +
            item.width;

        const itemTop =
            item.y;

        const itemBottom =
            item.y +
            item.height;


        const horizontal =
            itemRight >
                basketRect.left &&

            itemLeft <
                basketRect.right;


        const vertical =
            itemBottom >=
                basketRect.top &&

            itemTop <=
                basketRect.bottom;


        if (
            horizontal &&
            vertical
        ) {

            collectItem(
                item,
                i
            );

            continue;

        }


        /* =========================================
           REMOVE MISSED
           ========================================= */

        if (
            itemTop >
            containerHeight + 30
        ) {

            item.element.remove();

            activeItems.splice(
                i,
                1
            );

        }

    }

}


/* =========================================================
   BASKET COLLISION
   ========================================================= */

function getBasketRect() {

    const basketLeft =
        basket.offsetLeft;

    const basketTop =
        basket.offsetTop;


    /*
       Tight collision box.
    */

    const width = 60;

    const height = 32;

    const left =
        basketLeft -
        width / 2;

    const top =
        basketTop +
        basket.offsetHeight -
        height;


    return {

        left: left,

        right:
            left + width,

        top: top,

        bottom:
            top + height

    };

}


/* =========================================================
   COLLECT ITEM
   ========================================================= */

function collectItem(
    item,
    index
) {

    if (
        !activeItems[index]
    ) {
        return;
    }


    item.element.remove();

    activeItems.splice(
        index,
        1
    );


    /* =========================================
       SWEET
       ========================================= */

    if (
        item.type === "sweet"
    ) {

        score +=
            item.points;


        scoreDisplay.innerText =
            score;


        /*
           HIGH SCORE UPDATE
        */

        if (
            score >
            highScore
        ) {

            highScore =
                score;

            localStorage.setItem(
                "ganeshHighScore",
                highScore
            );


            updateHighScoreDisplay();

        }

    }


    /* =========================================
       HAZARD
       ========================================= */

    else {

    lives--;

    updateLives();

    // SHAKE THE LIVES INDICATOR
    livesDisplay.classList.remove("life-lost");

    // Restart animation every time
    void livesDisplay.offsetWidth;

    livesDisplay.classList.add("life-lost");

    shakeOnThunderHit();

    /*
       Tiny visual flash.
       No GSAP = no lag.
    */

        gameContainer.style.borderColor =
            "#FF3333";


        setTimeout(
            () => {

                if (gameRunning) {

                    gameContainer.style.borderColor =
                        "#FFD700";

                }

            },

            100
        );


        if (
            lives <= 0
        ) {

            endGame();

        }

    }

}


/* =========================================================
   HIGH SCORE DISPLAY
   ========================================================= */

function updateHighScoreDisplay() {

    /*
       Create it automatically if
       it doesn't exist in HTML.
    */

    let highScoreElement =
        document.getElementById(
            "high-score"
        );


    if (!highScoreElement) {

        highScoreElement =
            document.createElement(
                "div"
            );

        highScoreElement.id =
            "high-score";

        highScoreElement.innerText =
            `🏆 Best: ${highScore}`;

        /*
           Put it inside game header.
        */

        const header =
            document.querySelector(
                ".game-header"
            );

        if (header) {

            header.appendChild(
                highScoreElement
            );

        }

    } else {

        highScoreElement.innerText =
            `🏆 Best: ${highScore}`;

    }

}


/* =========================================================
   THUNDER HIT FEEDBACK
   ========================================================= */

function shakeOnThunderHit() {

    gameScreen.classList.remove("thunder-shake");
    gameContainer.classList.remove("thunder-flash");

    void gameScreen.offsetWidth;

    gameScreen.classList.add("thunder-shake");
    gameContainer.classList.add("thunder-flash");

    if (navigator.vibrate) {
        navigator.vibrate(160);
    }

    setTimeout(() => {
        gameScreen.classList.remove("thunder-shake");
        gameContainer.classList.remove("thunder-flash");
    }, 450);

}


/* =========================================================
   LIVES
   ========================================================= */

function updateLives() {

    livesDisplay.innerText =
        "Lives: " +
        lives.toString();

}


/* =========================================================
   STOP GAME
   ========================================================= */

function stopGameLoop() {

    gameRunning =
        false;


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;

    }


    clearTimeout(
        spawnTimer
    );

    spawnTimer = null;

}


/* =========================================================
   GAME OVER
   ========================================================= */

function endGame() {

    stopGameLoop();


    activeItems.forEach(
        item => {

            if (item.element) {

                item.element.remove();

            }

        }
    );


    activeItems = [];


    finalScore.innerText =
        score;


    updateHighScoreDisplay();


    gameOverModal
        .classList
        .remove("hidden");

}


/* =========================================================
   RESTART GAME
   ========================================================= */

function restartGame() {

    gameOverModal
        .classList
        .add("hidden");


    activeItems.forEach(
        item => {

            if (item.element) {

                item.element.remove();

            }

        }
    );


    activeItems = [];


    /*
       NEW ATTEMPT
       SCORE RESETS
    */

    score = 0;

    lives = 3;


    scoreDisplay.innerText =
        "0";

    updateLives();


    gameRunning =
        true;


    lastTime =
        performance.now();


    createInitialItems();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );


    scheduleSpawning();

}


/* =========================================================
   BACK TO MENU
   ========================================================= */

function backToMenu() {
    withCurtainTransition(backToMenuNow);
}

function backToMenuNow() {

    ensureMenuModel();

    stopGameLoop();

    if (typeof stopFestivalQuiz === "function") {
        stopFestivalQuiz();
    }

    if (typeof stopAartiEcho === "function") {
        stopAartiEcho();
    }

    if (typeof stopSweetsCrush === "function") {
        stopSweetsCrush();
    }

    closeFestivalBlessing();


    activeItems.forEach(
        item => {

            if (item.element) {

                item.element.remove();

            }

        }
    );


    activeItems = [];


    gameOverModal
        .classList
        .add("hidden");


    gameScreen
        .classList
        .remove("active");


    if (typeof quizScreen !== "undefined" && quizScreen) {
        quizScreen.classList.remove("active");
    }

    if (typeof aartiScreen !== "undefined" && aartiScreen) {
        aartiScreen.classList.remove("active");
    }

    const sweetsCrushScreen = document.getElementById('sweets-crush-screen');
    if (sweetsCrushScreen) {
        sweetsCrushScreen.classList.remove("active");
    }


    menuScreen
        .classList
        .add("active");


    setFestivalPlayMode(false);

    restoreFestivalEffects();

}


/* =========================================================
   BASKET POSITION
   ========================================================= */

function positionBasket(
    clientX
) {

    const rect =
        gameContainer
            .getBoundingClientRect();


    let x;


    if (
        clientX >= rect.left &&
        clientX <= rect.right
    ) {

        x =
            clientX -
            rect.left;

    } else {

        x = clientX;

    }


    const half =
        basket.offsetWidth / 2;


    x =
        Math.max(
            half,

            Math.min(
                rect.width -
                half,

                x
            )
        );


    basket.style.left =
        `${x}px`;

}


/* =========================================================
   MOUSE
   ========================================================= */

function mouseMoveHandler(
    event
) {

    if (!gameRunning) return;

    positionBasket(
        event.clientX
    );

}


/* =========================================================
   TOUCH
   ========================================================= */

function touchMoveHandler(
    event
) {

    if (!gameRunning) return;


    if (
        event.touches.length === 0
    ) {
        return;
    }


    event.preventDefault();


    positionBasket(
        event.touches[0].clientX
    );

}


/* =========================================================
   KEYBOARD
   ========================================================= */

function keyboardHandler(
    event
) {

    if (!gameRunning) return;


    const current =
        basket.offsetLeft;

    const move = 40;


    const rect =
        gameContainer
            .getBoundingClientRect();


    if (
        event.key ===
            "ArrowLeft" ||

        event.key.toLowerCase() ===
            "a"
    ) {

        positionBasket(
            rect.left +
            current -
            move
        );

    }


    if (
        event.key ===
            "ArrowRight" ||

        event.key.toLowerCase() ===
            "d"
    ) {

        positionBasket(
            rect.left +
            current +
            move
        );

    }

}


/* =========================================================
   CONTROLS
   ========================================================= */

function setupGameControls() {

    gameContainer.addEventListener(
        "mousemove",
        mouseMoveHandler
    );


    gameContainer.addEventListener(
        "touchmove",
        touchMoveHandler,
        {
            passive: false
        }
    );


    document.addEventListener(
        "keydown",
        keyboardHandler
    );


    /*
       Show high score when controls
       are initialized.
    */

    updateHighScoreDisplay();

}