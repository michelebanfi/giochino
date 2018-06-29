var array = [];
var hit = false;
var toc = false;
var larghezza = window.innerWidth;
var altezza = window.innerHeight;
function setup() {
    var myCanvas = createCanvas(larghezza, altezza);
    myCanvas.parent('container')
    for (var i = 0; i < 30; i++) {
        array.push({
            x: Math.floor(Math.random() * larghezza + 200),
            y: Math.floor(Math.random() * altezza),
            w: Math.floor((Math.random() * 300) + 15),
            h: Math.floor((Math.random() * 100) + 15),
            r: 0,
            g: 255,
            b: 0,
            limit: 0,
            id: String(Math.random())
        });
    }
}
var time;
var x = 500;
var y = 100;
var timing = 100;
var timer = 0;
var duration = 0;
var cont = true;
var d1 = [];
var dead = false;
var velocita = 1;
var alternanza = 0;
var decisione;
function draw() {
    aa();
    time = millis();
    background(102, 204, 255);
    fill(255, 0, 0);
    rect(x, y, 10, 10);
    check();
    space();
    if (time > timing + (500 - Math.pow(10 + velocita, 2))) {
        if (alternanza % 8 === 0) {
            decisione = y;
        } else {
            decisione = Math.floor(Math.random() * altezza);
        }
        array.push({
            x: larghezza + 200,
            y: decisione,
            w: Math.floor((Math.random() * 300) + 15),
            h: Math.floor((Math.random() * 100) + 15),
            r: 0,
            g: 255,
            b: 0,
            limit: 0,
            id: String(Math.random())
        });
        timing = time;
        alternanza++;
    }
    draw_();
    update();
    if (time > timer + (100 - velocita)) {
        duration++;
        timer = time;
    }
    fill(255, 0, 0);
    text(duration, 20, 20, 20, 20);
    if (duration % 100 === 0) {
        velocita += 0.1;
    }
}
function draw_() {
    for (var i = 0; i < array.length; i++) {
        fill(array[i].r, array[i].g, array[i].b);
        rect(array[i].x, array[i].y, array[i].w, array[i].h);
    }
}
function update() {
    for (var i = 0; i < array.length; i++) {
        array[i].x -= velocita;
        if (array[i].x <= -500) {
            del(array[i].id);
        } else if ((x <= 0 || y > altezza) && !dead) {
            dead = true
            localStorage.setItem("punteggio", duration);
            add_score().then(() => {
                window.open("re-start.html", "_self");
            });

        }
    }
}
function check() {
    for (var i = 0; i < array.length; i++) {
        if (x + 10 >= array[i].x - velocita && x <= (array[i].x - velocita) + array[i].w &&
            y + 10 >= array[i].y && y <= array[i].y + array[i].h && y + 10 >= array[i].y && x + 10 <= array[i].x) {
            x = (array[i].x - velocita) - 10;
        } else if (x + 10 >= array[i].x && x <= array[i].x + array[i].w && y + 10 >= array[i].y && y < array[i].y + array[i].h / 2) {
            y = array[i].y - 12;
        } else if (x + 10 >= array[i].x && x <= array[i].x + array[i].w && y >= array[i].y + array[i].h / 2 && y <= array[i].y + array[i].h) {
            y = array[i].y + array[i].h + 2;
        } else if (y <= 0) {
            y = 2;
        }
    }
}
function space() {
    check();
    if (keyIsPressed && keyCode === 32 || toc) {
        y -= 2;
    } else {
        y += 2;
    }
}
function del(id) {
    array = array.filter((element) => element.id != id);
}
function aa() {
    var d1 = [];
    for (var i = 0; i < array.length; i++) {
        for (var c = 0; c < array.length; c++) {
            if (i != c) {
                if (array[i].x >= array[c].x && array[i].y >= array[c].y &&
                    array[i].x + array[i].w <= array[c].x + array[c].w
                    && array[i].y + array[i].h <= array[c].y + array[c].h) {
                    d1.push(array[c].id);
                } else if (array[i].x + array[i].w >= array[c].x && array[i].x <= array[c].x + array[c].w &&
                    array[i].y + array[i].h >= array[c].y && array[i].y <= array[c].y + array[c].h) {
                    array[i].limit++;
                }
            }
        }
        if (array[i].limit === 4) {
            d1.push(array[i].id);
        } else {
            array[i].limit = 0;
        }
    }
    d1.forEach(del);
}
function add_score() {
    return fetch("https://api.airtable.com/v0/appZjrHlLCOkKwlym/classifica?api_key=key9NBIU4G4bjajYo", {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            fields: {
                Score: (duration),
                Nickname: localStorage.getItem("nickname"),
                Date: (new Date()).toISOString().slice(0, 10),
            }
        })
    })
}
function touchStarted() {
    toc = true;
}
function touchEnded() {
    toc = false;
}