import kaplay from "kaplay";

const K = kaplay();
const WALL_THICKNESS = 10;
const WIDTH = document.documentElement.clientWidth;
const HEIGHT = document.documentElement.clientHeight;
const PLAYER_SPEED = 1200;
const FALL_SPEED = PLAYER_SPEED / 2;

let score = 0;
let scoreText = null;

let time = 60;
let timeText = null;
let TIMER = null;

K.loadRoot("./sprites/");
K.loadSprite("grass", "background.jpg");
K.loadSprite("mimi", "mimi.png");
K.loadSprite("fly", "fly.png");
K.loadSprite("btfly", "btfly.png");
K.loadSprite("cricket", "cricket.png");
K.loadSprite("squirrel", "squirrel.png");
K.loadSprite("lightening", "lightening.png");
K.loadSprite("bean", "bean.png");

function drawBackGround(){
    for (let i = 0; i < Math.round(HEIGHT / 360); i++) {
        for (let j = 0; j < Math.round(WIDTH / 720); j++) {
            K.add([K.pos(720 * j, 360 * i), K.sprite("grass")]);
        }
    }
}

function updateScore(delta) {
    score += delta;
    scoreText.text = "Score: " + score;
    if (score < -75) {
        alert("Game Over!");
        window.location.reload();
    }
}

function updateTime(){
    time--;
    timeText.text = "time: " + time;
    if (time == 0) {
        clearInterval(TIMER);
        alert("HAI FATTO " + score + " PUNTI");
        window.location.reload();
    }
}

function createGameObject(name) {
    return K.add([
        K.pos(Math.random() * (WIDTH - WALL_THICKNESS * 2), Math.random()*(-200)),
        K.sprite(name),
        K.area(),
        K.body(),
        K.scale(1.5),
        { type: name }
    ]);
}

K.scene("title", () => {
    // Disegna lo sfondo
    drawBackGround();

    // Titolo del gioco
    K.add([
        K.text("Titolo del Gioco", { size: 48 }),
        K.pos(WIDTH / 2.1, HEIGHT / 2 - 60),
        K.anchor("center"),
        K.color(205,133,63), // giallo dorato
    ]);

    // Sottotitolo
    K.add([
        K.text("Un'avventura epica ti aspetta!", { size: 24 }),
        K.pos(WIDTH / 2.1, HEIGHT / 2),
        K.anchor("center"),
        K.color(205,133,63), // colore chiaro
    ]);

    // Posizione verticale del bottone
    const btnPosY = HEIGHT / 2 + 140;

    // Bottone: crea un rettangolo con area cliccabile e aggiungi un tag "startBtn"
    K.add([
        K.rect(200, 60, { radius: 12 }),
        K.pos(WIDTH / 2 - 50, btnPosY),
        K.anchor("center"),
        K.area(), // rende l'oggetto interattivo
        K.color(0, 123, 255), // blu per il bottone
        "startBtn", // tag per identificare il bottone
    ]);

    // Testo del bottone, centrato sullo stesso punto
    K.add([
        K.text("Inizia", { size: 28 }),
        K.pos(WIDTH / 2 - 50, btnPosY),
        K.anchor("center"),
        K.color(255, 255, 255),
    ]);

    // Gestore del click: utilizziamo l'handler globale per gli oggetti con tag "startBtn"
    K.onClick("startBtn", () => {
        K.go("game");
    });
});

K.scene("game", ()=>{
    //aggiunta dei muri e del campo
    K.add([K.pos(0, 0),
        K.rect(WALL_THICKNESS, HEIGHT),
        K.area(),
        K.body({ isStatic: true }),
        { isWall: true }
    ]);
    
    K.add([K.pos(WIDTH - WALL_THICKNESS, 0),
        K.rect(WALL_THICKNESS, HEIGHT),
        K.area(),
        K.body({ isStatic: true }),
        { isWall: true }
    ]);

    drawBackGround();

    //aggiunta personaggio principale e dei nemici
    const KAT = K.add([
        K.pos(WIDTH / 2.2, HEIGHT * 5 / 6),
        K.sprite("mimi"),
        K.area(),
        K.body(),
        K.scale(1.7)
    ]);
    
    K.onKeyDown("left", () => KAT.move(-PLAYER_SPEED, 0));
    K.onKeyDown("right", () => KAT.move(PLAYER_SPEED, 0));

    const OBJECTS = ["fly", "btfly", "cricket", "squirrel", "lightening", "bean"].map(createGameObject);

    //aggiunta dati partita
    scoreText = K.add([
        K.text("Score: " + score, { size: 36, font: "sans-serif" }),
        K.pos(20, 20),
        K.color(205,133,63)
    ]);

    timeText = K.add([
        K.text("time: " + time, { size: 36, font: "sans-serif" }),
        K.pos(WIDTH - WALL_THICKNESS - 150, 20),
        K.color(205,133,63)
    ]);
    
    TIMER = setInterval(updateTime, 1000);

    //LOOP
    K.onUpdate(() => {
        OBJECTS.forEach((obj, index) => {
            if (!obj.exists()) {
                OBJECTS[index] = createGameObject(obj.type);
            }
            else {
                obj.move(0, FALL_SPEED);
                if (obj.pos.y > HEIGHT) {
                    if(obj.name != "bean" && obj.name != "lightening"){
                        updateScore(-20);
                    }
                    else{
                        updateScore(10);    
                    }
                    K.destroy(obj);
                }
                else if (obj.isColliding(KAT)) {
                    switch (obj.type) {
                        case "fly": updateScore(10); break;
                        case "btfly": updateScore(15); break;
                        case "cricket": updateScore(20); break;
                        case "squirrel": updateScore(25); break;
                        case "lightening": updateScore(-25); break;
                        case "bean": updateScore(-20); break;
                    }
                    K.destroy(obj);
                }
            }
        });
    });
});

K.go("title");
