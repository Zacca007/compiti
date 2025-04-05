import kaplay from "kaplay";

const K = kaplay();
const WALL_THICKNESS = 10;
const WIDTH = document.documentElement.clientWidth;
const HEIGHT = document.documentElement.clientHeight;
const PLAYER_SPEED = 1000;
const FALL_SPEED = PLAYER_SPEED / 2;

let score = 0;

K.loadRoot("./sprites/");
K.loadSprite("grass", "background.jpg");
K.loadSprite("kat", "pxArt.png");
K.loadSprite("bean", "bean.png");
K.loadSprite("butterfly", "pxArt(1).png");
K.loadSprite("apple", "pxArt(2).png");
K.loadSprite("coin", "pxArt(3).png");
K.loadSprite("egg", "pxArt(4).png");
K.loadSprite("lightening", "lightening.png");

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

for (let i = 0; i < Math.round(HEIGHT / 360); i++) {
    for (let j = 0; j < Math.round(WIDTH / 720); j++) {
        K.add([K.pos(720 * j, 360 * i), K.sprite("grass")]);
    }
}

const KAT = K.add([
    K.pos(WIDTH / 2.2, HEIGHT * 4 / 5),
    K.sprite("kat"),
    K.area(),
    K.body(),
    K.scale(1.7)
]);

K.onKeyDown("left", () => KAT.move(-PLAYER_SPEED, 0));
K.onKeyDown("right", () => KAT.move(PLAYER_SPEED, 0));

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

let objects = ["butterfly", "bean", "apple", "coin", "egg", "lightening"].map(createGameObject);

const scoreText = K.add([
    K.text("Score: " + score, { size: 36, font: "sans-serif" }),
    K.pos(20, 20)
]);

function updateScore(delta) {
    score += delta;
    scoreText.text = "Score: " + score;
    if (score < -50) {
        alert("Game Over!");
        window.location.reload();
    }
}

K.onUpdate(() => {
    objects.forEach((obj, index) => {
        if (!obj.exists()) {
            objects[index] = createGameObject(obj.type);
        } else {
            obj.move(0, FALL_SPEED);
            if (obj.pos.y > HEIGHT) {
                if(obj != objects[1] && obj != objects[5]){
                    updateScore(-20)
                }
                K.destroy(obj);
            } else if (obj.isColliding(KAT)) {
                switch (obj.type) {
                    case "butterfly": updateScore(10); break;
                    case "apple": updateScore(15); break;
                    case "coin": updateScore(20); break;
                    case "egg": updateScore(25); break;
                    case "bean": updateScore(-30); break;
                    case "lightening": updateScore(-50); break;
                }
                K.destroy(obj);
            }
        }
    });
});