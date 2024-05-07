import { k } from "./kaboomCtx";
import { dialogueData, scaleFactor } from "./constants";

export class Game {
    constructor() {
        this.k = k;
        this.player = null;

        this.k.loadSprite("spritesheet", "./spritesheet.png", {
            sliceX: 39,
            sliceY: 31,
            anims: {
                "idle-down": 936,
                "walk-down": { from: 936, to: 939, loop: true, speed: 8 },
                "idle-side": 975,
                "walk-side": { from: 975, to: 978, loop: true, speed: 8 },
                "idle-up": 1014,
                "walk-up": { from: 1014, to: 1017, loop: true, speed: 8 },
                "no-idle": 14,
                "sword-right": { from: 1010, to: 1013, loop: false, speed: 8 },
                "sword-left": { from: 1049, to: 1052, loop: false, speed: 8 },
            },
        });
    }
}
