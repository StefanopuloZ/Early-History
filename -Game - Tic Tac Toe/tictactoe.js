// Global variables

let gameInfo = {
    time: 0, // newDate
    winner: "", // gameInfo.player1 || gameInfo.player2
    turn: 0,
    playerTurn: "", // gameInfo.player1 || gameInfo.player2
    sign: "X",
    player: "Player1",
},
    player1Score = 0,
    player2Score = 0,
    gameInProgress,
    moveHistory,
    numberOfGames = 1,
    currentPlayer,
    firstPlayer,
    player1Name,
    player2Name,
    currentSign,
    seconds,
    minutes,
    totalTime,
    timeFlow,
    tableCheck = [];



// Main Code

document.getElementById("new-game").addEventListener("click", startGame);
document.getElementById("set-name1").addEventListener("click", setPlayerName.bind(null, "player1"));
document.getElementById("set-name2").addEventListener("click", setPlayerName.bind(null, "player2"));
document.getElementById("surrender").addEventListener("click", surrenderGame);
document.getElementById("reset").addEventListener("click",resetScoreNames);


// Methods

function startGame() {
    if (gameInProgress) return alert("Finish current game first.")
    gameInProgress = true;
    clearTable();
    document.getElementById("play-area").addEventListener("click", moveFlow);
    moveHistory = [];
    totalTime = "";
    seconds = 0;
    minutes = 0;
    gameInfo.turn = 0;
    document.getElementById("turn").innerHTML = setTurn();
    gameInfo.time = new Date();
    currentSign = "X";
    player1Name = document.getElementById("player1").innerHTML;
    player2Name = document.getElementById("player2").innerHTML;
    if (numberOfGames === 1) firstPlayer = player1Name
    else changeFirstPlayer()
    currentPlayer = firstPlayer;
    showCurrentPlayer(currentPlayer);
    for (let i = 0; i < 9; i++) {
        tableCheck[i] = i;
    }

    if (document.getElementById("stamp") !== null) removeElement("stamp");
    addStamp("Start!");
    setTimeout(stampFade, 1000);
    timeFlow = setInterval(startTime, 1000);
};

function moveFlow(event) {
    let cell = parseInt(event.target.id.match(/\d+/));
    if (!checkIfValidMove(cell)) return
    drawMove(cell);
    ++gameInfo.turn;
    document.getElementById("turn").innerHTML = setTurn();
    currentSign = (currentSign === "X") ? "O" : "X";
    if (checkWinner()) {
        addStamp(currentPlayer);
        gameInfo.winner = currentPlayer;
        if (gameInfo.winner === player1Name)++player1Score
        else ++player2Score
        setScore();
        endGame();
        return
    };
    if (gameInfo.turn === 9) {
        addStamp("Draw!");
        gameInfo.winner = "Draw";
        endGame();
        return
    }
    currentPlayer = (currentPlayer === player1Name) ? player2Name : player1Name;
    showCurrentPlayer(currentPlayer);
}

function endGame() {
    gameInProgress = false;
    ++numberOfGames;
    clearInterval(timeFlow);
    document.getElementById("play-area").removeEventListener("click", moveFlow);
    setTimeout(stampFade, 1000);
    setTimeout(removeElement.bind(null, "stamp"), 3000);
};

function clearTable() {
    for (let i = 0; i < 9; i++) {
        document.getElementById(`cell${i}`).classList.remove("signX");
        document.getElementById(`cell${i}`).classList.remove("signO");
    }
}

function changeFirstPlayer() {
    let player1 = document.getElementById("player1");
    let player1Score = document.getElementById("player1-score");
    let player2 = document.getElementById("player2");
    let player2Score = document.getElementById("player2-score");
    if (firstPlayer === player1Name) {
        firstPlayer = player2Name;
        player2.classList.add("text-red");
        player2Score.classList.add("text-red");
        player2.classList.remove("text-green");
        player2Score.classList.remove("text-green");
        player1.classList.remove("text-red");
        player1Score.classList.remove("text-red");
        player1.classList.add("text-green");
        player1Score.classList.add("text-green");
    } else {
        firstPlayer = player1Name;
        player1.classList.add("text-red");
        player1Score.classList.add("text-red");
        player1.classList.remove("text-green");
        player1Score.classList.remove("text-green");
        player2.classList.remove("text-red");
        player2Score.classList.remove("text-red");
        player2.classList.add("text-green");
        player2Score.classList.add("text-green");
    }
}

function surrenderGame() {
    if (!gameInProgress) return alert("Game not started!")
    gameInfo.winner = (currentPlayer === player1Name) ? player2Name : player1Name;
    addStamp(gameInfo.winner);
    if (gameInfo.winner === player1Name)++player1Score
    else ++player2Score
    setScore();
    endGame();
};

function startTime() {
    ++seconds;
    if (seconds >= 60) {
        seconds = 0;
        ++minutes;
    }
    let displayMinutes = minutes.toString().padStart(2, "0");
    let displaySeconds = seconds.toString().padStart(2, "0");
    totalTime = displayMinutes + ":" + displaySeconds;
    document.getElementById("time").innerHTML = `Time: ${displayMinutes}:${displaySeconds}`;
};

function setPlayerName(id) {
    if (gameInProgress) return alert("Names can not be changed while game is in progress!")
    document.getElementById(id).innerHTML = prompt("Enter name: ");
};

function checkIfValidMove(cell) {
    if (!moveHistory.reduce(function (acc, item, index) {
        if (cell === item.cell) acc = true
        return acc
    }, false)) return true
    else return false
}

function drawMove(cell) {
    moveHistory[gameInfo.turn] = {
        cell: cell,
        sign: currentSign,
        turn: gameInfo.turn + 1,
        playerName: currentPlayer
    };
    tableCheck[cell] = currentSign;
    document.getElementById(`cell${cell}`).classList.add(`sign${currentSign}`);
}

function checkWinner() {
    if (tableCheck[0] === tableCheck[1] && tableCheck[0] === tableCheck[2]) return true
    else if (tableCheck[3] === tableCheck[4] && tableCheck[3] === tableCheck[5]) return true
    else if (tableCheck[6] === tableCheck[7] && tableCheck[6] === tableCheck[8]) return true
    else if (tableCheck[0] === tableCheck[3] && tableCheck[0] === tableCheck[6]) return true
    else if (tableCheck[1] === tableCheck[4] && tableCheck[1] === tableCheck[7]) return true
    else if (tableCheck[2] === tableCheck[5] && tableCheck[2] === tableCheck[8]) return true
    else if (tableCheck[0] === tableCheck[4] && tableCheck[0] === tableCheck[8]) return true
    else if (tableCheck[2] === tableCheck[4] && tableCheck[2] === tableCheck[6]) return true
};

function addStamp(name) {
    let text = "<p>Winner is</p>";
    if (name === "Start!" || name === "Draw!") text = "";
    document.getElementById("play-area").innerHTML += `<div id='stamp'>${text}<p>${name}</p></div>`;
    document.getElementById("stamp").classList.add("stamp");
}

function removeElement(id) {
    document.getElementById(id).remove();
}

function stampFade() {
    document.getElementById("stamp").classList.remove("stamp");
    document.getElementById("stamp").classList.add("fade");
    setTimeout(removeElement.bind(null, "stamp"), 2000);
}

function showCurrentPlayer(player) {
    if (player === player1Name) {
        document.getElementById("player1").classList.add("move-indicator");
        document.getElementById("player2").classList.remove("move-indicator");
    } else {
        document.getElementById("player2").classList.add("move-indicator");
        document.getElementById("player1").classList.remove("move-indicator");
    }
}

function setScore() {
    document.getElementById("player1-score").innerHTML = player1Score;
    document.getElementById("player2-score").innerHTML = player2Score;
};

function setTurn() {
    return "Turn: " + gameInfo.turn
}

function resetScoreNames() {
    if (gameInProgress) return alert("Finish current game first!")
    numberOfGames = 1;
    player1Score = 0;
    player2Score = 0;
    gameInfo.time = 0;
    gameInfo.turn = 0;
    document.getElementById("time").innerHTML = "Time: 0";
    document.getElementById("turn").innerHTML = setTurn();
    setScore();
    document.getElementById("player1").innerHTML = "Player1";
    document.getElementById("player2").innerHTML = "Player2";

    let player1S = document.getElementById("player1");
    let player1ScoreS = document.getElementById("player1-score");
    let player2S = document.getElementById("player2");
    let player2ScoreS = document.getElementById("player2-score");
        player1S.classList.add("text-red");
        player1ScoreS.classList.add("text-red");
        player1S.classList.remove("text-green");
        player1ScoreS.classList.remove("text-green");
        player2S.classList.remove("text-red");
        player2ScoreS.classList.remove("text-red");
        player2S.classList.add("text-green");
        player2ScoreS.classList.add("text-green");
};

function storeFinishedGame() {

};

function saveGame() {

};

function loadGame() {

};

// Replay methods

function viewHistory() {

};

function showReplay() {

};

function playReplay() {

};

function stopReplay() {

};

function nextReplayMove() {

};

function previousReplayMove() {

};

function pauseReplay() {

};































