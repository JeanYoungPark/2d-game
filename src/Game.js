import { k } from "./kaboomCtx";
import { dialogueData, scaleFactor } from "./constants";

class Game {
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
                "idle-sword": 1010,
                "sword-side": { from: 1010, to: 1013, loop: false, speed: 8 },
            },
        });
    }
}
