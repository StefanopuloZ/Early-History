document.getElementById("form-1-btn").addEventListener("click", function(){
    var ime = document.getElementById("form-1-input").value;
    document.getElementById("form-1-output").innerHTML = "Vaše ime je " + ime + ".";
})

document.getElementById("form-2-btn").addEventListener("click", function(){
    var godine = document.getElementById("form-2-input").value;
    document.getElementById("form-2-output").innerHTML = "Ti imaš " + godine + " godina.";
})

document.getElementById("form-3-btn").addEventListener("click", function(){
    var ime = document.querySelector("#form-3-input").value;
    var godine = document.getElementById("form-3-input-b").value;
    document.getElementById("form-3-output").innerHTML = "Ti se zoveš " + ime + " i imaš " + godine + " godina.";
})

document.getElementById("form-4-btn").addEventListener("click", function(){
    var godiste = document.getElementById("form-4-input").value;
    var godine = 2018 - godiste;
    document.getElementById("form-4-output").innerHTML = "Ti imaš " + godine + " godina.";
})

document.getElementById("form-5-btn").addEventListener("click", function(){
    var godine = document.getElementById("form-5-input").value;
    var godiste = 2018 - godine;
    document.getElementById("form-5-output").innerHTML = "Ti si rođen " + godiste + " godine.";
})

document.getElementById("form-6-btn").addEventListener("click", function(){
    var ime = document.getElementById("form-6-input").value;
    var cena1 = document.getElementById("form-6-input-b").value;
    var cena2 = document.getElementById("form-6-input-c").value;
    var procenat = (((cena2 - cena1) / cena1) * 100).toFixed(2);
    document.getElementById("form-6-output").innerHTML = ime + " je poskupeo za " + procenat + " posto.";
})

document.getElementById("form-7-btn").addEventListener("click", function(){
    var a = document.getElementById("form-7-input").value;
    var b = document.getElementById("form-7-input-b").value;
    var p = b*a;
    document.getElementById("form-7-output").innerHTML = "Površina sobe je " + p + "m<sup>2<sup>";
})
