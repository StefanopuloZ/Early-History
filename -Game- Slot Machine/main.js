// global variables

let slotNumbers = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
],
    rowNumbers = []; 

//main code

let rotation = false;
setUp();

document.getElementById("pull-btn").addEventListener("click", pullMachine); 

// methods

function pullMachine() { 
    startRotation(0, randomNumber(50, 65));
    startRotation(1, randomNumber(65, 80));
    startRotation(2, randomNumber(80, 90));

    setTimeout(() => {
        alert(rowNumbers);
    }, 13000)
}

function startRotation(row, rotationNumber) { 
    rotation = true;
    let time = 10;
    for (let i = 0; i < rotationNumber; i++) {
        setTimeout(() => {
            rotateDown(row);
            setUpRow(row, 10 + i * 3);
        }, time); 
        time += 10 + i * 3;
    };
}

function setUpRow(row, animTime) { 
    let rows = ["a", "b", "c"];
    for (let i = 0; i < 5; i++) {
        showNumber(i + 1, rows[row], slotNumbers[row][i + 2], animTime);
        rowNumbers[row] = slotNumbers[row][4];
    }
}

function setUp() { 
    let rows = ["a", "b", "c"];
    for (let j = 0; j < rows.length; j++) {
        for (let i = 0; i < 5; i++) {
            showNumber(i + 1, rows[j], slotNumbers[j][i + 2]);
            rowNumbers[j] = slotNumbers[j][4];
        }
    }
}

function rotateDown(row) { 
    let firstNumber = slotNumbers[row].pop();
    slotNumbers[row].unshift(firstNumber);
}

// helper functions

function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showNumber(cellNumber, row, number, animTime) { 
    document.getElementById(`cell-${row}-${cellNumber}`).innerHTML = `<div id="text-${row}-${cellNumber}" class="cell-x">${number}</div>`;
    if (rotation) {
        document.getElementById(`text-${row}-${cellNumber}`).classList.add("roll");
        document.getElementById(`text-${row}-${cellNumber}`).style.animationDuration = animTime + "ms";
    }
}































