const QUESTIONS_PER_LEVEL = 5;

const quizScreen = document.getElementById("quiz-screen");
const quizIntro = document.getElementById("quiz-intro");
const quizPlay = document.getElementById("quiz-play");
const quizResult = document.getElementById("quiz-result");
const quizScoreEl = document.getElementById("quiz-score");
const quizBestEl = document.getElementById("quiz-best");
const quizIntroBestEl = document.getElementById("quiz-intro-best");
const quizLivesEl = document.getElementById("quiz-lives");
const quizLevelLabel = document.getElementById("quiz-level-label");
const quizProgress = document.getElementById("quiz-progress");
const quizStreakEl = document.getElementById("quiz-streak");
const quizTimerFill = document.getElementById("quiz-timer-fill");
const quizTimerText = document.getElementById("quiz-timer-text");
const quizAiStatus = document.getElementById("quiz-ai-status");
const quizQuestionEl = document.getElementById("quiz-question");
const quizOptionsEl = document.getElementById("quiz-options");
const quizExplainEl = document.getElementById("quiz-explain");
const quizNextBtn = document.getElementById("quiz-next-btn");

let quizScore = 0;
let quizLives = 3;
let quizStreak = 0;
let quizLevelIndex = 0;
let quizQuestionIndex = 0;
let quizCorrectThisLevel = 0;
let quizMaxStreak = 0;
let quizAnswered = false;
let quizActive = false;
let quizTimerId = null;
let quizTimeLeft = 0;
let quizTimeMax = 20;
let quizTypeTimer = null;
let quizQueue = [];
let quizCurrent = null;

function quizHighScore() {
    return Number(localStorage.getItem("ganeshQuizHighScoreV2")) || 0;
}

function saveQuizHighScore() {
    const best = quizHighScore();

    if (quizScore > best) {
        localStorage.setItem("ganeshQuizHighScoreV2", String(quizScore));
    }

    const shown = Math.max(quizScore, quizHighScore());
    quizBestEl.innerText = shown;
    quizIntroBestEl.innerText = quizHighScore();
}

function shuffleList(list) {
    const copy = list.slice();

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
    }

    return copy;
}

function showQuizView(view) {
    quizIntro.classList.toggle("hidden", view !== "intro");
    quizPlay.classList.toggle("hidden", view !== "play");
    quizResult.classList.toggle("hidden", view !== "result");
}

function updateQuizHud() {
    quizScoreEl.innerText = quizScore;
    quizLivesEl.innerText = "❤️".repeat(Math.max(0, quizLives));
    quizStreakEl.innerText = `Streak ×${quizStreak}`;
    quizBestEl.innerText = Math.max(quizScore, quizHighScore());
}

function stopQuizTimers() {
    if (quizTimerId) {
        clearInterval(quizTimerId);
        quizTimerId = null;
    }

    if (quizTypeTimer) {
        clearTimeout(quizTypeTimer);
        quizTypeTimer = null;
    }
}

function stopFestivalQuiz() {
    quizActive = false;
    stopQuizTimers();
}

function startFestivalQuiz() {
    withCurtainTransition(() => {
    menuScreen.classList.remove("active");
    gameScreen.classList.remove("active");

    if (typeof aartiScreen !== "undefined" && aartiScreen) {
        aartiScreen.classList.remove("active");
    }

    quizScreen.classList.add("active");

    stopFestivalEffects();
    setFestivalPlayMode(true);
    stopFestivalQuiz();

    quizIntroBestEl.innerText = quizHighScore();
    quizBestEl.innerText = quizHighScore();
    showQuizView("intro");
    });
}

function beginFestivalQuiz() {
    stopQuizTimers();

    quizScore = 0;
    quizLives = 3;
    quizStreak = 0;
    quizMaxStreak = 0;
    quizLevelIndex = 0;
    quizQuestionIndex = 0;
    quizCorrectThisLevel = 0;
    quizActive = true;

    updateQuizHud();
    showQuizView("play");
    startQuizLevel();
}

function startQuizLevel() {
    const level = QUIZ_LEVELS[quizLevelIndex];

    quizQuestionIndex = 0;
    quizCorrectThisLevel = 0;
    quizQueue = shuffleList(level.questions).slice(0, QUESTIONS_PER_LEVEL);

    quizLevelLabel.innerText =
        `Level ${quizLevelIndex + 1} · ${level.name}`;

    askQuizQuestion();
}

function askQuizQuestion() {
    stopQuizTimers();
    quizAnswered = false;
    quizCurrent = quizQueue[quizQuestionIndex];

    quizProgress.innerText =
        `${quizQuestionIndex + 1} / ${QUESTIONS_PER_LEVEL}`;

    quizExplainEl.classList.add("hidden");
    quizNextBtn.classList.add("hidden");
    quizOptionsEl.innerHTML = "";
    quizQuestionEl.innerText = "";

    quizAiStatus.innerText = "Ganesha AI is thinking...";
    quizTimerFill.style.width = "100%";
    quizTimerFill.classList.remove("urgent");

    const level = QUIZ_LEVELS[quizLevelIndex];
    quizTimeMax = level.seconds;
    quizTimeLeft = quizTimeMax;
    quizTimerText.innerText = `${quizTimeMax}s`;

    quizTypeTimer = setTimeout(() => {
        quizAiStatus.innerText = "Ganesha AI asks:";
        typeQuizQuestion(quizCurrent.question, () => {
            renderQuizOptions(quizCurrent);
            startQuizCountdown();
        });
    }, 650);
}

function typeQuizQuestion(text, done) {
    let i = 0;
    quizQuestionEl.innerText = "";

    const tick = () => {
        quizQuestionEl.innerText = text.slice(0, i);
        i += 1;

        if (i <= text.length) {
            quizTypeTimer = setTimeout(tick, 16);
        } else if (done) {
            done();
        }
    };

    tick();
}

function renderQuizOptions(item) {
    const mixed = shuffleList(item.options);

    mixed.forEach((choice) => {
        const button = document.createElement("button");
        button.className = "quiz-option";
        button.innerText = choice;
        button.onclick = () => lockQuizAnswer(choice);
        quizOptionsEl.appendChild(button);
    });
}

function startQuizCountdown() {
    stopQuizTimers();

    quizTimerId = setInterval(() => {
        quizTimeLeft -= 0.1;

        const ratio = Math.max(0, quizTimeLeft / quizTimeMax);
        quizTimerFill.style.width = `${ratio * 100}%`;
        quizTimerText.innerText = `${Math.ceil(Math.max(0, quizTimeLeft))}s`;

        if (ratio < 0.28) {
            quizTimerFill.classList.add("urgent");
        }

        if (quizTimeLeft <= 0) {
            lockQuizAnswer(null);
        }
    }, 100);
}

function lockQuizAnswer(choice) {
    if (quizAnswered || !quizActive) {
        return;
    }

    quizAnswered = true;
    stopQuizTimers();

    const correct = quizCurrent.answer;
    const isRight = choice === correct;
    const buttons = quizOptionsEl.querySelectorAll(".quiz-option");

    buttons.forEach((button) => {
        button.disabled = true;

        if (button.innerText === correct) {
            button.classList.add("correct");
        } else if (choice && button.innerText === choice) {
            button.classList.add("wrong");
        }
    });

    if (isRight) {
        quizStreak += 1;
        quizMaxStreak = Math.max(quizMaxStreak, quizStreak);
        quizCorrectThisLevel += 1;

        const basePoints = [80, 110, 140, 170, 200][quizLevelIndex];
        const speedBonus = Math.round(
            (quizTimeLeft / quizTimeMax) * (15 + quizLevelIndex * 5)
        );
        const streakBonus = Math.min(quizStreak - 1, 3) * 10;
        const gained = basePoints + speedBonus + streakBonus;

        quizScore += gained;
        quizAiStatus.innerText = `Correct! +${gained}`;
    } else {
        quizStreak = 0;
        quizLives -= 1;
        quizAiStatus.innerText = choice
            ? "That was not the one."
            : "Time is up.";
    }

    quizExplainEl.innerText = quizCurrent.explain;
    quizExplainEl.classList.remove("hidden");

    updateQuizHud();
    saveQuizHighScore();

    if (quizLives <= 0) {
        quizNextBtn.innerText = "See results";
    } else if (
        quizQuestionIndex + 1 >= QUESTIONS_PER_LEVEL &&
        quizLevelIndex + 1 >= QUIZ_LEVELS.length
    ) {
        quizNextBtn.innerText = "Claim victory";
    } else if (quizQuestionIndex + 1 >= QUESTIONS_PER_LEVEL) {
        quizNextBtn.innerText = `Enter Level ${quizLevelIndex + 2}`;
    } else {
        quizNextBtn.innerText = "Next question";
    }

    quizNextBtn.classList.remove("hidden");
}

function advanceFestivalQuiz() {
    if (quizLives <= 0) {
        finishFestivalQuiz(false);
        return;
    }

    quizQuestionIndex += 1;

    if (quizQuestionIndex < QUESTIONS_PER_LEVEL) {
        askQuizQuestion();
        return;
    }

    quizScore += 40 * (quizLevelIndex + 1);

    if (quizCorrectThisLevel === QUESTIONS_PER_LEVEL) {
        quizScore += 20 * (quizLevelIndex + 1);
    }

    updateQuizHud();
    saveQuizHighScore();

    quizLevelIndex += 1;

    if (quizLevelIndex >= QUIZ_LEVELS.length) {
        finishFestivalQuiz(true);
        return;
    }

    startQuizLevel();
}

function quizRank(won) {
    if (won && quizScore >= 2800) {
        return "Vighnaharta Champion";
    }

    if (won) {
        return "Festival Scholar";
    }

    if (quizLevelIndex >= 3) {
        return "Temple Challenger";
    }

    if (quizLevelIndex >= 1) {
        return "Rising Devotee";
    }

    return "Little Learner";
}

function finishFestivalQuiz(won) {
    quizActive = false;
    stopQuizTimers();
    saveQuizHighScore();

    document.getElementById("quiz-result-title").innerText = won
        ? "All 5 levels cleared! 🪔"
        : "Quiz Over";

    document.getElementById("quiz-result-rank").innerText =
        `Rank: ${quizRank(won)}`;

    document.getElementById("quiz-final-score").innerText = quizScore;

    document.getElementById("quiz-result-detail").innerText =
        `Reached Level ${Math.min(quizLevelIndex + 1, 5)} · Best streak ×${quizMaxStreak} · High score ${quizHighScore()}`;

    showQuizView("result");
}

window.startFestivalQuiz = startFestivalQuiz;
window.beginFestivalQuiz = beginFestivalQuiz;
window.advanceFestivalQuiz = advanceFestivalQuiz;
window.stopFestivalQuiz = stopFestivalQuiz;
