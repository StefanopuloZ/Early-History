/////////////// global variables ///////////////

let selectedPiece = "",
    plannedMove = "",
    playerColor = "white",
    validMoves = [],
    ampasant = null,
    castlingTrack = [
        {
            king: true,
            left: true,
            right: true
        },
        {
            king: true,
            left: true,
            right: true
        },
    ];

/////////////// main code ///////////////

drawBoard();
document.getElementById("table-area").addEventListener("click", moveFlow);

/////////////// methods ///////////////

///// Start of main function ///////

function moveFlow(event) {
    let cell = (event.target.tagName !== "TD") ? event.target.parentNode : event.target;
    let id = cell.id.slice(5);
    if (table[id].color !== playerColor && selectedPiece === "" && Object.keys(table[id]).length > 0) {
        console.log("Invalid piece selected");
        return false
    }
    if (selectedPiece === "") {
        if (!table[id].color) {
            return false;
        }
        selectedPiece = id;
    } else {
        plannedMove = id;
        if (validMove(selectedPiece, plannedMove)) {
            table[plannedMove] = table[selectedPiece];
            checkPromotion(selectedPiece, plannedMove);
            updateCastling(selectedPiece);
            table[selectedPiece] = {};
            selectedPiece = "";
            playerColor = (playerColor === "white") ? "black" : "white";
            validMoves = [];
            if (checkMate()) {
                alert("Checkmate!");
            } else if (check(plannedMove, plannedMove, true)) {
                console.log("Check!");
            }
        } else {
            selectedPiece = "";
            validMoves = [];
        }
    }
    drawBoard();
    if (selectedPiece !== "") {
        document.getElementById("cell-" + id).classList.add("active");
        validMoves.push(...showValidMoves(id));
        drawMoves(validMoves);
    }
};
/////// End of main function ////

function showValidMoves(id) {
    if (table[id].piece === "rook") return rookMoves(id)
    else if (table[id].piece === "king") return kingMoves(id)
    else if (table[id].piece === "queen") return queenMoves(id)
    else if (table[id].piece === "bishop") return bishopMoves(id)
    else if (table[id].piece === "knight") return knightMoves(id)
    else if (table[id].piece === "pawn") return pawnMoves(id)
}

function validMove(start, end) {
    if (validMoves.indexOf(parseInt(end)) === -1) {
        return false
    } else if (!checkCastle(start, end)) {
        console.log("Can't castle. Figures are not free to move.");
        return false;
    } else if (check(start, end, false)) {
        console.log("Must prevent check!");
        return false
    };
    checkAmpasant(start, end);
    return true;
}

/////////////// figure rules ///////////////

//rook

function rookMoves(id) {
    id = parseInt(id);
    let color = table[id].color;
    let opponentColor = (color === "white") ? "black" : "white"
    let x = convertCell(id)[0];
    let y = convertCell(id)[1];
    let moves = [];
    let directions = [[x + 1, -1], [8 - x, 1], [y + 1, -8], [8 - y, 8]];

    for (let i = 0; i < directions.length; i++) {
        for (let j = 1; j < directions[i][0]; j++) {
            if (table[id + j * directions[i][1]].color === color) break
            moves.push(id + j * directions[i][1]);
            if (table[id + j * directions[i][1]].color === opponentColor) break
            if (table[id].piece === "king") break
        }
    };
    return moves
}

//king

function kingMoves(id) {
    id = parseInt(id);
    let moves = [];
    moves = rookMoves(id).concat(bishopMoves(id));

    // castling
    if (table[id].color === "white" && castlingTrack[0].king) {
        if (castlingTrack[0].left && checkEmpty(57, 59)) {
            moves.push(58);
        }
        if (castlingTrack[0].right && checkEmpty(61, 62)) {
            moves.push(62);
        }
    } else {
        if (castlingTrack[1].king) {
            if (castlingTrack[1].left && checkEmpty(1, 3)) {
                moves.push(2);
            }
            if (castlingTrack[1].right && checkEmpty(5, 6)) {
                moves.push(6);
            }
        }
    }

    return moves
}

//queen

function queenMoves(id) {
    return rookMoves(id).concat(bishopMoves(id))
}

//bishop

function bishopMoves(id) {
    id = parseInt(id);
    let color = table[id].color;
    let opponentColor = (color === "white") ? "black" : "white"
    let moves = [];
    let directions = [-7, 7, -9, 9];

    for (let i = 0; i < directions.length; i++) {
        for (let j = 1; j < 9; j++) {
            if (table[id + (j * directions[i])] === undefined) break
            if (table[id + (j * directions[i])].color === color) break
            if (!validDiagnoal(id, id + (j * directions[i]))) break
            moves.push(id + (j * directions[i]));
            if (table[id + (j * directions[i])].color === opponentColor) break
            if (table[id].piece === "king") break
        }
    }
    return moves
}

//knight

function knightMoves(id) {
    id = parseInt(id);
    let color = table[id].color;
    let moves = [];
    let directions = [6, 15, 10, 17, -6, -15, -10, -17];
    for (let i = 0; i < directions.length; i++) {
        if (table[id + directions[i]] === undefined) continue
        if (table[id + directions[i]].color === color) continue
        if (!validJump(id, id + directions[i])) continue
        moves.push(id + directions[i]);
    }
    return moves
}

//pawn

function pawnMoves(id) {
    id = parseInt(id);
    let color = table[id].color;
    let opponentColor = (color === "white") ? "black" : "white";
    let moves = [];
    let directions = [[-7, -9, -8, -16], [7, 9, 8, 16]];
    let side = (color === "white") ? 0 : 1;

    for (let i = 0; i < directions[side].length; i++) {
        if (table[id + directions[side][i]] === undefined) continue
        if (i > 1) {
            if (table[id + directions[side][i]].color === color || table[id + directions[side][i]].color === opponentColor) break
        } else {
            if (table[id + directions[side][i]].color !== opponentColor && id + directions[side][i] !== ampasant) continue
            if (!validDiagnoal(id, id + directions[side][i])) continue
        }
        moves.push(id + directions[side][i]);
        if (!firstPawnMove(id, color) && i > 1) break
    }
    return moves
}

// other functions

function checkMate() {
    let validMoves = [];
    let pieceMoves = [];
    table.forEach((cell, id) => {
        if (cell.color === playerColor) {
            pieceMoves = showValidMoves(id);
            pieceMoves = pieceMoves.filter((element, index, arr) => {
                return !check(id, element, false)
            });
            validMoves.push(...pieceMoves);
        }
    });
    if (validMoves.length === 0) return true
    else return false
}

function drawMoves(moves) {
    moves.map(element => {
        document.getElementById(`cell-${element}`).classList.add("avilable-moves");
    })
}

function checkFigures(moves, color) {
    return moves.filter(element => {
        return table[element].piece === "king" && table[element].color === color
    });
}

function check(start, end, justCheck) {
    let checkingFigures = [];
    let before = table[start];
    let after = table[end];
    let color = before.color;
    if (justCheck) {
        color = (color === "white") ? "black" : "white";
    }
    table[end] = before;
    table[start] = {};
    table.forEach((cell, id) => {
        if (Object.keys(cell).length > 0 && cell.color !== color) {
            checkingFigures.push(...showValidMoves(id));
        }
    });
    checkingFigures = checkFigures(checkingFigures, color);
    table[end] = after;
    table[start] = before;
    if (checkingFigures.length > 0) {
        checkingFigures = [];
        return true
    }
    return false
}

function convertCell(id) {
    return [id % 8, Math.floor(id / 8)]
}

function isAttacked(arr, id) {
    for (let i = 0; i < arr.length; i++) {
        if (check(id, arr[i], false)) return true
    }
    return false
}

function updateCastling(start) {
    start = parseInt(start);
    if (table[start].piece !== "rook" && table[start].piece !== "king") {
        return
    }
    if (table[start].color === "white") {
        if (start === 56) castlingTrack[0].left = false
        if (start === 63) castlingTrack[0].right = false
        if (start === 60) castlingTrack[0].king = false
    } else {
        if (start === 0) castlingTrack[1].left = false
        if (start === 7) castlingTrack[1].right = false
        if (start === 4) castlingTrack[1].king = false
    }
}

function checkCastle(start, end) {
    start = parseInt(start);
    end = parseInt(end);
    if (table[start].piece !== "king" || Math.abs(start - end) < 2) return true
    if (table[start].color === "white") {
        if (end === 58) {
            if (isAttacked([56, 57, 58, 59, 60], start)) return false
            table[56] = {};
            table[59] = {
                color: "white",
                piece: "rook"
            }
        }
        if (end === 62) {
            if (isAttacked([60, 61, 62, 63], start)) return false
            table[63] = {};
            table[61] = {
                color: "white",
                piece: "rook"
            }
        }
    } else {
        if (end === 2) {
            if (isAttacked([0, 1, 2, 3, 4], start)) return false
            table[0] = {};
            table[3] = {
                color: "black",
                piece: "rook"
            }
        }
        if (end === 6) {
            if (isAttacked([4, 5, 6, 7], start)) return false
            table[7] = {};
            table[5] = {
                color: "black",
                piece: "rook"
            }
        }
    }
    return true
}

function checkEmpty(start, end) {
    for (let i = start; i <= end; i++) {
        if (Object.keys(table[i]).length !== 0) {
            return false
        }
    }
    return true
}

function checkPromotion(start, end) {
    let a = convertCell(end);
    if (table[start].piece !== "pawn") {
        return
    }
    if (table[start].color === "white") {
        if (a[1] === 0) {
            table[end] = {
                color: "white",
                piece: "queen"
            }
        }
    } else {
        if (a[1] === 7) {
            table[end] = {
                color: "black",
                piece: "queen"
            }
        }
    }
}

function checkAmpasant(start, end) {
    end = parseInt(end);
    if (table[start].piece === "pawn" && end === ampasant) {
        if (table[start].color === "white") {
            table[end + 8] = {}
        } else {
            table[end - 8] = {}
        }
    }
    if (table[start].piece === "pawn" && Math.abs(start - end) > 8) {
        ampasant = setAmpasant(start);
    } else {
        ampasant = null;
    }
}

function setAmpasant(id) {
    id = parseInt(id);
    return (table[id].color === "white") ? id - 8 : id + 8
}

function firstPawnMove(id, color) {
    let a = convertCell(id);
    if (color === "white") {
        return (a[1] === 6) ? true : false
    } else {
        return (a[1] === 1) ? true : false
    }
}

function validDiagnoal(start, end) {
    let a = convertCell(start);
    let b = convertCell(end);
    return Math.abs(a[0] - b[0]) === Math.abs(a[1] - b[1])
}

function validJump(start, end) {
    let a = convertCell(start);
    let b = convertCell(end);
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 3
}

function drawBoard() {
    let html = '<table id="chessTable">';
    for (let i = 0; i < table.length; i++) {
        if (i % 8 == 0) {
            html += "<tr>";
        }
        if (Object.keys(table[i]).length > 0) {
            let color = table[i].color;
            let piece = table[i].piece;
            html += `<td id="cell-${i}">${pieces[piece][color]} <span class="cell-number">${i}</span>
            <span class="cell-cooridantes">${convertCell(i)}</span></td>`;
        } else {
            html += `<td id="cell-${i}"><span class="cell-number">${i}</span>
            <span class="cell-cooridantes">${convertCell(i)}</span></td>`;
        }
        if (i % 8 == 7) {
            html += "</tr>";
        }
    }
    html += '</table>';
    document.getElementById("table-area").innerHTML = html;
}
