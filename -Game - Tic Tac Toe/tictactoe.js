// Global variables

let gameInfo = {
    time: 0, // newDate
    winner: "", // gameInfo.player1 || gameInfo.player2
    turn: 0,
    playerTurn: "", // gameInfo.player1 || gameInfo.player2
    sign: "X",
    player: "Player1",
},
    replay = false,
    replayMoves,
    savedGames,
    playReplay,
    gameInReplay,
    tableMark = 0,
    tableMarkLoad = 0,
    gameLog = {},
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
document.getElementById("reset").addEventListener("click", resetScoreNames);
document.getElementById("high-score").addEventListener("click", showGameLog);
document.getElementById("play").addEventListener("click", playReplayBtn);
document.getElementById("pause").addEventListener("click", pauseReplay);
document.getElementById("forward").addEventListener("click", nextReplayMove);
document.getElementById("backward").addEventListener("click", previousReplayMove);
document.getElementById("save").addEventListener("click", saveGame);
document.getElementById("load").addEventListener("click", loadGame);


// Methods

function startGame() {
    if (gameInProgress || replay) return popUp("Can not start new game.")
    gameInProgress = true;
    clearTable();
    document.getElementById("play-area").addEventListener("click", moveFlow);
    moveHistory = [];
    gameLog = {};
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
    gameLog = logGame();
    drawMove(cell);
    ++gameInfo.turn;
    document.getElementById("turn").innerHTML = setTurn();
    currentSign = (currentSign === "X") ? "O" : "X";
    if (checkWinner()) {
        addStamp(currentPlayer);
        gameInfo.winner = currentPlayer;
        gameLog.winner = currentPlayer;
        if (gameInfo.winner === player1Name)++player1Score
        else ++player2Score
        setScore();
        endGame();
        return
    };
    if (gameInfo.turn === 9) {
        addStamp("Draw!");
        gameInfo.winner = "Draw";
        gameLog.winner = "Draw";
        endGame();
        return
    }
    currentPlayer = (currentPlayer === player1Name) ? player2Name : player1Name;
    showCurrentPlayer(currentPlayer);
}

function endGame() {
    saveGameLog("Game Log");
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
    if (!gameInProgress || replay || gameInfo.turn === 0) return popUp("Can not surrender game.")
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
    if (gameInProgress || replay) return popUp("Names can not be changed now.")
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
    if (name === "Start!" || name === "Draw!" || name === "Not finished") text = "";
    document.getElementById("play-area").innerHTML += `<div id='stamp'>${text}<p>${name}</p></div>`;
    document.getElementById("stamp").classList.add("stamp");
}

function removeElement(id) {
    if (document.getElementById(id) === null) return
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

function resetScoreNames() {
    if (gameInProgress || replay) return popUp("Can not reset now.")
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

function setTurn() {
    return "Turn: " + gameInfo.turn
}

function logGame() {
    return {
        time: gameInfo.time.getDate() + "-" + (gameInfo.time.getMonth() + 1) + "-" +
            gameInfo.time.getFullYear() + " " + gameInfo.time.getHours() +
            ":" + gameInfo.time.getMinutes(),
        gameDuration: totalTime,
        winner: "Not finished",
        player1: player1Name,
        player2: player2Name,
        numberOfTurns: gameInfo.turn + 1,
        turnHistory: moveHistory
    }
}

function saveGameLog(storageName) {
    if (localStorage.getItem(storageName) === null) localStorage.setItem(storageName, `{ "games": [] }`);
    let obj = JSON.parse(localStorage.getItem(storageName));
    obj.games.unshift(gameLog);
    localStorage.setItem(storageName, JSON.stringify(obj));
}

function pullGameLog(storageName) {
    if (localStorage.getItem(storageName) === null) return false
    return JSON.parse(localStorage.getItem(storageName));
}

function showGameLog() {
    if (document.getElementById("gamelog-table") !== null) {
        tableMark = 0;
        replay = false;
        document.getElementById("game-log").classList.remove("from-right");
        document.getElementById("game-log").classList.add("fade-to-right");
        document.getElementById("controls").classList.add("controls-hide");
        document.getElementById("controls").classList.remove("controls-show");
        return setTimeout(removeElement.bind(null, "game-log"), 1500);
    }
    if (!pullGameLog("Game Log")) return popUp("No games present!")
    document.getElementById("side-area").insertAdjacentHTML("beforeend", `<div id="game-log" class="from-right"></div>`);
    let obj = pullGameLog("Game Log");
    let rows = (obj.games.length <= 10) ? obj.games.length : 10;
    let tableHTML = "<table id=gamelog-table><tr><th>Date: </th><th>Winner: </th><th>Duration: </th><th>Turns: </th></tr>";
    for (let i = 0; i < rows; i++) {
        tableHTML += `<tr id="game-${i}" onclick="selectGame(event)"><td>${obj.games[i].time}</td><td>${obj.games[i].winner}</td>` +
            `<td>${obj.games[i].gameDuration}</td><td>${obj.games[i].numberOfTurns}</td></tr>`;
        tableMark = i;
    }
    tableHTML += "</table>";
    document.getElementById("game-log").innerHTML = tableHTML + `<div id="table-control">` +
        `<button id="previous" class="table-button">Previous</button>` +
        `<button id="next" class="table-button">Next</button></div>`;
    document.getElementById("next").addEventListener("click", tableNav.bind(null, "next"));
    document.getElementById("previous").addEventListener("click", tableNav.bind(null, "previous"));
    document.getElementById("controls").classList.add("controls-show");
    document.getElementById("controls").classList.remove("controls-hide");
};

function tableNav(button) {
    let tableHTML = "<table id=gamelog-table><tr><th>Date: </th><th>Winner: </th><th>Duration: </th><th>Turns: </th></tr>";
    let obj = pullGameLog("Game Log");
    let rows;
    if (button === "next" && tableMark + 1 >= obj.games.length) return
    else if (button === "next") {
        rows = (tableMark + 11 <= obj.games.length) ? tableMark + 10 : obj.games.length - 1;
        for (let i = tableMark + 1; i <= rows; i++) {
            tableHTML += `<tr id="game-${i}" onclick="selectGame(event)"><td>${obj.games[i].time}</td><td>${obj.games[i].winner}</td>` +
                `<td>${obj.games[i].gameDuration}</td><td>${obj.games[i].numberOfTurns}</td></tr>`;
        }
        tableMark += 9;
        document.getElementById("gamelog-table").innerHTML = tableHTML + `<div id="table-control">`;
    }
    else if (button === "previous" && tableMark <= 9) return
    else {
        rows = tableMark - 18;
        for (let i = rows; i < rows + 10; i++) {
            tableHTML += `<tr id="game-${i}" onclick="selectGame(event)"><td>${obj.games[i].time}</td><td>${obj.games[i].winner}</td>` +
                `<td>${obj.games[i].gameDuration}</td><td>${obj.games[i].numberOfTurns}</td></tr>`;
        }
        tableMark -= 9;
        tableHTML += `<div id="table-control">`;
        document.getElementById("gamelog-table").innerHTML = tableHTML;
    }
}

function selectGame(event) {
    let obj = pullGameLog("Game Log");
    let gameNumber = parseInt(event.currentTarget.id.match(/\d+/));
    gameInReplay = obj.games[gameNumber];
    replayGame();
}

function replayGame() {
    if (replay) return popUp("Can not start replay now.")
    replay = true;
    clearTable();
    document.getElementById("player1").innerHTML = gameInReplay.player1;
    document.getElementById("player2").innerHTML = gameInReplay.player2;
    replayMoves = 0;
    playReplay = setInterval(drawMoves, 1000);
    replay = true;
}

function drawMoves() {
    if (replayMoves === gameInReplay.turnHistory.length) {
        clearTimeout(playReplay);
        replay = false;
        addStamp(gameInReplay.winner);
        setTimeout(stampFade, 1000);
        setTimeout(function () {
            replay = false
        }, 1000);
        return
    }
    let sign = (replayMoves % 2 === 0) ? "X" : "O";
    document.getElementById(`cell${gameInReplay.turnHistory[replayMoves].cell}`).classList.add(`sign${sign}`);
    replayMoves++;
}
function nextReplayMove() {
    clearInterval(playReplay);
    drawMoves();
};

function previousReplayMove() {
    if (replayMoves === 0) return
    clearInterval(playReplay);
    --replayMoves;
    sign = (replayMoves % 2 === 0) ? "X" : "O";
    document.getElementById(`cell${gameInReplay.turnHistory[replayMoves].cell}`).classList.remove(`sign${sign}`);
};

function pauseReplay() {
    clearInterval(playReplay);
};

function playReplayBtn() {
    clearInterval(playReplay);
    playReplay = setInterval(drawMoves, 1000);
}

function popUp(msg) {
    let firstChild = document.body.firstChild;
    let popWindow = document.createElement("div");
    popWindow.classList.add("pop-up");
    let button = document.createElement("div");
    button.innerHTML = "OK";
    button.classList.add("pop-btn");
    popWindow.innerHTML = msg;
    popWindow.appendChild(button);
    document.body.insertBefore(popWindow, firstChild);
    document.querySelector(".pop-btn").addEventListener("click", killPop);
}

function killPop(event) {
    document.querySelector("." + event.target.parentElement.className).remove();
}

function saveGame() {
    saveGameLog("Saved Games");
    console.log("game saved");
}

function loadGame() {
    if (document.getElementById("gamelog-table-load") !== null) {
        tableMarkLoad = 0;
        document.getElementById("game-log-load").classList.remove("from-right");
        document.getElementById("game-log-load").classList.add("fade-to-right");
        return setTimeout(removeElement.bind(null, "game-log-load"), 1500);
    }
    if (!pullGameLog("Saved Games")) return popUp("No games present!")
    document.getElementById("side-area").insertAdjacentHTML("beforeend", `<div id="game-log-load" class="from-right"></div>`);
    let obj = pullGameLog("Saved Games");
    let rows = (obj.games.length <= 10) ? obj.games.length : 10;
    let tableHTML = "<table id=gamelog-table-load><tr><th>Date: </th><th>Winner: </th><th>Duration: </th><th>Turns: </th></tr>";
    for (let i = 0; i < rows; i++) {
        tableHTML += `<tr id="saved-game-${i}" onclick="selectSavedGame(event)"><td>${obj.games[i].time}</td><td>${obj.games[i].winner}</td>` +
            `<td>${obj.games[i].gameDuration}</td><td>${obj.games[i].numberOfTurns}</td></tr>`;
        tableMarkLoad = i;
    }
    tableHTML += "</table>";
    document.getElementById("game-log-load").innerHTML = tableHTML + `<div id="table-control-load">` +
        `<button id="previous-load" class="table-button">Previous</button>` +
        `<button id="next-load" class="table-button">Next</button></div>`;
    document.getElementById("next-load").addEventListener("click", tableNavLoad.bind(null, "next-load"));
    document.getElementById("previous-load").addEventListener("click", tableNavLoad.bind(null, "previous-load"));
};

function tableNavLoad(button) {
    let tableHTML = "<table id=gamelog-table-load><tr><th>Date: </th><th>Winner: </th><th>Duration: </th><th>Turns: </th></tr>";
    let obj = pullGameLog("Saved Games");
    let rows;
    if (button === "next-load" && tableMarkLoad + 1 >= obj.games.length) return
    else if (button === "next-load") {
        rows = (tableMarkLoad + 11 <= obj.games.length) ? tableMarkLoad + 10 : obj.games.length - 1;
        for (let i = tableMarkLoad + 1; i <= rows; i++) {
            tableHTML += `<tr id="saved-game-${i}" onclick="selectSavedGame(event)"><td>${obj.games[i].time}</td><td>${obj.games[i].winner}</td>` +
                `<td>${obj.games[i].gameDuration}</td><td>${obj.games[i].numberOfTurns}</td></tr>`;
        }
        tableMarkLoad += 9;
        document.getElementById("gamelog-table-load").innerHTML = tableHTML + `<div id="table-control-load">`;
    }
    else if (button === "previous-load" && tableMarkLoad <= 9) return
    else {
        rows = tableMarkLoad - 18;
        for (let i = rows; i < rows + 10; i++) {
            tableHTML += `<tr id="saved-game-${i}" onclick="selectSavedGame(event)"><td>${obj.games[i].time}</td><td>${obj.games[i].winner}</td>` +
                `<td>${obj.games[i].gameDuration}</td><td>${obj.games[i].numberOfTurns}</td></tr>`;
        }
        tableMarkLoad -= 9;
        tableHTML += `<div id="table-control-load">`;
        document.getElementById("gamelog-table-load").innerHTML = tableHTML;
    }
}

function selectSavedGame(event) {
    if (gameInProgress) return popUp("Cannot load game right now.");
    let obj = pullGameLog("Saved Games");
    let gameNumber = parseInt(event.currentTarget.id.match(/\d+/));
    let loadedGame = obj.games[gameNumber];
    gameInProgress = true;
    clearTable();
    document.getElementById("play-area").addEventListener("click", moveFlow);
    moveHistory = loadedGame.turnHistory;
    console.log(loadedGame);
    console.log(moveHistory);
    gameLog = loadedGame;
    totalTime = loadGame.time;
    seconds = 0;
    minutes = 0;
    gameInfo.turn = loadedGame.turn;
    document.getElementById("turn").innerHTML = setTurn();
    gameInfo.time = new Date();
    currentSign = (loadedGame.length % 2 === 0) ? "O" : "X";
    player1Name = loadedGame.player1;
    player2Name = loadedGame.player2;
    document.getElementById("player1").innerHTML = player1Name;
    document.getElementById("player2").innerHTML = player2Name;
    currentPlayer = (moveHistory[moveHistory.length - 1].playerName === player1Name) ? player2Name : player1Name;
    showCurrentPlayer(currentPlayer);
    for (let i = 0; i < 9; i++) {
        tableCheck[i] = i;
    }
    for (let j = 0; j < moveHistory.length; j++) {
        let sign = (j % 2 === 0) ? "X" : "O";
        setTimeout(function () {
            document.getElementById(`cell${moveHistory[j].cell}`).classList.add(`sign${sign}`); 
            tableCheck[moveHistory[j].cell] = sign;
        }, 400 * (j + 1)) 
    }
    if (document.getElementById("stamp") !== null) removeElement("stamp");
    addStamp("Start!");
    setTimeout(stampFade, 1000);
    timeFlow = setInterval(startTime, 1000);
}

































