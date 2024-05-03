import { loadHomeScene } from "./home";
import { k } from "./kaboomCtx";
import { loadYardScene } from "./yard";
import { setCamScale } from "./utils";

k.loadSprite("spritesheet", "./spritesheet.png", {
    sliceX: 39,
    sliceY: 31,
    anims: {
        "idle-down": 936,
        "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
        "idle-side": 975,
        "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
        "idle-up": 1014,
        "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
        "idle-sword": 1010,
        "sword-side": { from: 1010, to: 1013, loop: false, speed: 8 },
    },
});

// setCamScale(k);

// k.onResize(() => {
//     setCamScale(k);
// });

// k.onUpdate(() => {
//     k.camPos(player.pos.x, player.pos.y + 100);
// });

// k.onMouseDown((mouseBtn) => {
//     if (mouseBtn !== "left" || player.isInDialogue) return;

//     const worldMousePos = k.toWorld(k.mousePos());
//     player.moveTo(worldMousePos, player.speed);

//     const mouseAngle = player.pos.angle(worldMousePos);

//     const lowerBound = 50;
//     const upperBound = 125;

//     if (mouseAngle > lowerBound && mouseAngle < upperBound && player.curAnim() !== "walk-up") {
//         player.play("walk-up");
//         player.direction = "up";
//         return;
//     }

//     if (mouseAngle > -lowerBound && mouseAngle < -upperBound && player.curAnim() !== "walk-down") {
//         player.play("walk-down");
//         player.direction = "down";
//         return;
//     }

//     if (Math.abs(mouseAngle) > upperBound) {
//         player.flipX = false;
//         if (player.curAnim() !== "walk-side") player.play("walk-side");
//         player.direction = "right";
//         return;
//     }

//     if (Math.abs(mouseAngle) < lowerBound) {
//         player.flipX = true;
//         if (player.curAnim() !== "walk-side") player.play("walk-side");
//         player.direction = "left";
//         return;
//     }
// });

// k.onMouseRelease(() => {
//     if (player.direction === "down") {
//         player.play("idle-down");
//         return;
//     }

//     if (player.direction === "up") {
//         player.play("idle-up");
//         return;
//     }

//     player.play("idle-side");
// });

loadYardScene();
loadHomeScene();

k.go("home");
