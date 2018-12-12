// global variables

// svaki niz u nizu predstavlja jedan "tocak" na slot masini
let slotNumbers = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
],
    rowNumbers = []; // ovde se cuvaju izvuceni brojevi

//main code

let rotation = false;
setUp();

document.getElementById("pull-btn").addEventListener("click", pullMachine); // ovo je browser method. dodaje funkciju na klik dugmeta

// methods

function pullMachine() { // pokrece rotaciju svih "tockova"
    startRotation(0, randomNumber(70, 85));
    startRotation(1, randomNumber(85, 100));
    startRotation(2, randomNumber(105, 115));
}

function startRotation(row, rotationNumber) { // rotacija jednog tocka. setTimeout je javascript method koji odlaze izvrsenje funkcije
    rotation = true;
    let time = 10;
    for (let i = 0; i < rotationNumber; i++) {
        setTimeout(() => {
            rotateDown(row);
            setUpRow(row, 10 + i * 3);
        }, time); // time promenljiva odlaze izvrsenje funkcije u milisekundama
        time += 10 + i * 3;
    };
}

function setUpRow(row, animTime) { // postavlja brojeve u polja u browseru, preko showNumber funkcije. opet...browser methodi. nije ti preterano bitno za logiku
    let rows = ["a", "b", "c"];
    for (let i = 0; i < 5; i++) {
        showNumber(i + 1, rows[row], slotNumbers[row][i + 2], animTime);
        rowNumbers[row] = slotNumbers[row][4];
    }
}

function setUp() { // postavlja pocetnu poziciju svih "tockova"
    let rows = ["a", "b", "c"];
    for (let j = 0; j < rows.length; j++) {
        for (let i = 0; i < 5; i++) {
            showNumber(i + 1, rows[j], slotNumbers[j][i + 2]);
            rowNumbers[j] = slotNumbers[j][4];
        }
    }
}

function rotateDown(row) { // "rotira" "tocak" tako sto menja i dodaje clanove niza
    let firstNumber = slotNumbers[row].pop();
    slotNumbers[row].unshift(firstNumber);
}

// helper functions

function randomNumber(min, max) { // u js se mora pravi funkcija za random :)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showNumber(cellNumber, row, number, animTime) { // browser method. ubacuje brojeve u polja u browseru
    document.getElementById(`cell-${row}-${cellNumber}`).innerHTML = `<div id="text-${row}-${cellNumber}" class="cell-x">${number}</div>`;
    if (rotation) {
        document.getElementById(`text-${row}-${cellNumber}`).classList.add("roll");
        document.getElementById(`text-${row}-${cellNumber}`).style.animationDuration = animTime + "ms";
    }
}


// nema provere da li su brojevi isti. ne zato sto je tesko, nego zato sto je rogobatno uraditi u js-u i samo bi te
// bunilo u kodu bespotrebno. poenta je da setTimout u js-u radi retardirano. on prvo izvrsi ceo kod sa datim vrednostima u
// pozadini, pa tek onda prikazuje implementaciju toga. na kraju, ja cu sa ovim kodom za proveru vrednosti uvek dobiti
// centralne brojeve sa kojima je kod zapoceo. cenim da kod tebe to moze bolje, jer se radi po frejmovima.
// ja bih to ovde resio sa dupliranjem svih rotacija, na novim promenljivima, koje bi imale istu vrednost i sluzile bi
// samo da mogu da ih povucem za proveru rezultata. ko sto rekoh, smaranje, ali za logiku nije bitno, jer je to 
// problem js-a. ovo ti radi sve sto treba i nije preterano komplikovano. kratak je kod ko sto vidis.































