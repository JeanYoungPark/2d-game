import { k } from "./kaboomCtx";
import { dialogueData, scaleFactor } from "./constants";
import { displayDialogue, setCamScale } from "./utils";

export class Game {
    constructor() {
        this.k = k;
        this.player = null;
        this.sword = null;
        this.frogs = [];

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
                "idle-attack-side": 1093,
                "idle-attack-down": 1092,
                "idle-attack-up": 1094,
                "walk-down-frog": { from: 788, to: 789, loop: true, speed: 4 },
                "walk-side-frog": { from: 790, to: 791, loop: true, speed: 4 },
                "walk-up-frog": { from: 827, to: 828, loop: true, speed: 4 },
                "walk-down-slime": { from: 858, to: 859, loop: true, speed: 4 },
                "walk-side-slime": { from: 860, to: 861, loop: true, speed: 4 },
                "walk-up-slime": { from: 897, to: 898, loop: true, speed: 4 },
                "monster-attack-side": { from: 1010, to: 1013, loop: true, speed: 8 },
            },
        });
    }

    scaleSetup() {
        setCamScale(this.k);

        this.k.onResize(() => {
            setCamScale(this.k);
        });
    }

    playerSetup() {
        this.player = this.k.make([
            this.k.sprite("spritesheet", { anim: "idle-down" }),
            this.k.area({
                shape: new this.k.Rect(this.k.vec2(0, 3), 10, 10),
            }),
            this.k.body(),
            this.k.anchor("center"),
            this.k.pos(),
            this.k.scale(scaleFactor),
            {
                speed: 250,
                direction: "down",
                isInDialogue: false,
                layer: "object",
            },
            this.k.state("idle", ["idle", "attack"]),
            "player",
        ]);
    }

    layerSetup(layers, map) {
        for (const layer of layers) {
            //  외벽
            if (layer.name === "boundaries") {
                for (const boundary of layer.objects) {
                    map.add([
                        this.k.area({
                            shape: new this.k.Rect(this.k.vec2(0), boundary.width, boundary.height),
                        }),
                        this.k.body({ isStatic: true }),
                        this.k.pos(boundary.x, boundary.y),
                        boundary.name,
                    ]);

                    if (boundary.name) {
                        this.player.onCollide(boundary.name, () => {
                            this.player.isInDialogue = true;
                            displayDialogue(dialogueData[boundary.name], () => (this.player.isInDialogue = false));
                        });
                    }
                }
                continue;
            }

            // 스폰 장소
            if (layer.name === "spawnpoints") {
                for (const entity of layer.objects) {
                    if (entity.name === "player") {
                        this.player.pos = this.k.vec2((map.pos.x + entity.x) * scaleFactor, (map.pos.y + entity.y) * scaleFactor);
                        this.k.add(this.player);
                        continue;
                    }
                }
            }

            if (layer.name === "frogs") {
                for (const entity of layer.objects) {
                    const enemy = this.k.add([
                        this.k.sprite("spritesheet", { anim: `walk-down-frog` }),
                        this.k.area(),
                        this.k.pos(this.k.vec2((map.pos.x + entity.x) * scaleFactor, (map.pos.y + entity.y) * scaleFactor)),
                        this.k.body(),
                        this.k.anchor("center"),
                        this.k.scale(scaleFactor),
                        this.k.state("idle", ["idle", "attack", "move"]),
                        "frogs",
                        {
                            direction: "down",
                            layer: "object",
                        },
                    ]);

                    this.frogs.push(enemy);
                }
            }

            if (layer.name === "slimes") {
                for (const entity of layer.objects) {
                    const enemy = this.k.add([
                        this.k.sprite("spritesheet", { anim: `walk-down-slime` }),
                        this.k.area(),
                        this.k.pos(this.k.vec2((map.pos.x + entity.x) * scaleFactor, (map.pos.y + entity.y) * scaleFactor)),
                        this.k.body(),
                        this.k.anchor("center"),
                        this.k.scale(scaleFactor),
                        this.k.state("idle", ["idle", "attack", "move"]),
                        "slimes",
                        {
                            direction: "down",
                            layer: "object",
                        },
                    ]);
                }
            }

            // yard로 나가는 출구
            if (layer.name === "exit") {
                for (const entity of layer.objects) {
                    if (entity.name === "exit") {
                        map.add([
                            this.k.area({
                                shape: new this.k.Rect(this.k.vec2(0), entity.width, entity.height),
                            }),
                            this.k.body({ isStatic: true }),
                            this.k.pos(entity.x, entity.y),
                            entity.name,
                        ]);

                        this.player.onCollide(entity.name, () => {
                            this.k.go("yard");
                        });
                    }
                    continue;
                }
            }

            // 집으로 들어가는 입구
            if (layer.name === "home") {
                for (const entity of layer.objects) {
                    if (entity.name === "home") {
                        map.add([
                            this.k.area({
                                shape: new this.k.Rect(this.k.vec2(0), entity.width, entity.height),
                            }),
                            this.k.body({ isStatic: true }),
                            this.k.pos(entity.x, entity.y),
                            entity.name,
                        ]);

                        this.player.onCollide(entity.name, () => {
                            this.k.go("home");
                        });
                    }
                    continue;
                }
            }
        }
    }

    handleCommonMouseDown(mouseBtn) {
        // 좌클릭이 아니거나 다이얼로그가 띄어져 있다면 return
        if (mouseBtn !== "left" || this.player.isInDialogue) return;

        // 마우스 좌표
        const worldMousePos = this.k.toWorld(this.k.mousePos());
        this.player.moveTo(worldMousePos, this.player.speed);

        // 마우스 각도
        const mouseAngle = this.player.pos.angle(worldMousePos);
        const lowerBound = 50;
        const upperBound = 125;

        if (mouseAngle > lowerBound && mouseAngle < upperBound && this.player.curAnim() !== "walk-up") {
            this.player.play("walk-up");
            this.player.direction = "up";
            return;
        }

        if (mouseAngle < -lowerBound && mouseAngle > -upperBound && this.player.curAnim() !== "walk-down") {
            this.player.play("walk-down");
            this.player.direction = "down";
            return;
        }

        if (Math.abs(mouseAngle) > upperBound) {
            this.player.flipX = false;
            if (this.player.curAnim() !== "walk-side") this.player.play("walk-side");
            this.player.direction = "right";
            return;
        }

        if (Math.abs(mouseAngle) < lowerBound) {
            this.player.flipX = true;
            if (this.player.curAnim() !== "walk-side") this.player.play("walk-side");
            this.player.direction = "left";
            return;
        }
    }

    handleCommonRelease() {
        if (this.player.state === "attack") {
            this.player.enterState("idle");
        }

        if (this.player.direction === "down") {
            this.player.play("idle-down");
            return;
        }

        if (this.player.direction === "up") {
            this.player.play("idle-up");
            return;
        }

        this.player.play("idle-side");
    }

    handleSwordKeyPress() {
        this.player.enterState("attack");

        if (this.player.direction === "down") {
            this.player.play("idle-attack-down");
            return;
        }

        if (this.player.direction === "up") {
            this.player.play("idle-attack-up");
            return;
        }

        this.player.play("idle-attack-side");
    }

    handleCommonCollide() {
        this.player.onCollide("frogs", (e) => {
            this.player.onStateEnter("attack", () => {
                k.destroy(e);
            });
        });
    }

    handleMonsterState() {
        for (const enemy of this.frogs) {
            enemy.onStateUpdate("move", () => {
                this.handleMonsterDir(enemy, "frog");

                let dirX = 1;
                let dirY = 1;

                if (this.player.pos.x < enemy.pos.x) {
                    dirX = -1;
                }

                if (this.player.pos.y < enemy.pos.y) {
                    dirY = -1;
                }

                enemy.move(100 * dirX, 100 * dirY);
            });

            enemy.onStateUpdate("idle", () => {});
        }
    }

    handleMonsterMove() {
        this.k.onUpdate("player", (player) => {
            for (const enemy of this.frogs) {
                if (player.pos.dist(enemy.pos) < 90) {
                    enemy.enterState("move");
                }

                if (player.pos.dist(enemy.pos) > 120) {
                    enemy.enterState("idle");
                }

                if (enemy.pos.dist(player.pos) < 70) {
                    enemy.enterState("attack");
                }
            }
        });
    }

    handleMonsterDir(enemy, name) {
        console.log(enemy);
        // 플레이어 각도
        const playerAngle = enemy.pos.angle(this.player.pos);
        const lowerBound = 50;
        const upperBound = 125;

        if (playerAngle > lowerBound && playerAngle < upperBound && enemy.curAnim() !== `walk-up-${name}`) {
            enemy.play(`walk-up-${name}`);
            enemy.direction = "up";
            return;
        }

        if (playerAngle < -lowerBound && playerAngle > -upperBound && enemy.curAnim() !== `walk-down-${name}`) {
            enemy.play(`walk-down-${name}`);
            enemy.direction = "down";
            return;
        }

        // if (Math.abs(playerAngle) > upperBound) {
        //     enemy.flipX = false;
        //     if (enemy.curAnim() !== "walk-side") enemy.play("walk-side");
        //     enemy.direction = "right";
        //     return;
        // }

        // if (Math.abs(playerAngle) < lowerBound) {
        //     enemy.flipX = true;
        //     if (enemy.curAnim() !== "walk-side") enemy.play("walk-side");
        //     enemy.direction = "left";
        //     return;
        // }
    }
}
