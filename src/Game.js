import { k } from "./kaboomCtx";
import { dialogueData, scaleFactor } from "./constants";
import { displayDialogue, setCamScale } from "./utils";

export class Game {
    constructor() {
        this.k = k;
        this.map = null;
        this.player = null;
        this.frogs = [];
        this.slimes = [];

        this.k.loadSprite("spritesheet", "./spritesheet.png", {
            sliceX: 39,
            sliceY: 31,
            anims: {
                "idle-down-player": 936,
                "idle-side-player": 975,
                "idle-up-player": 1014,
                "idle-attack-side-player": 1093,
                "idle-attack-down-player": 1092,
                "idle-attack-up-player": 1094,
                "walk-down-player": { from: 936, to: 939, loop: true, speed: 8 },
                "walk-side-player": { from: 975, to: 978, loop: true, speed: 8 },
                "walk-up-player": { from: 1014, to: 1017, loop: true, speed: 8 },

                "idle-monster-attack": 14,
                "monster-attack-side": { from: 1010, to: 1013, loop: true, speed: 8 },

                "walk-down-frog": { from: 788, to: 789, loop: true, speed: 4 },
                "walk-side-frog": { from: 790, to: 791, loop: true, speed: 4 },
                "walk-up-frog": { from: 827, to: 828, loop: true, speed: 4 },
                "walk-down-slime": { from: 858, to: 859, loop: true, speed: 4 },
                "walk-side-slime": { from: 860, to: 861, loop: true, speed: 4 },
                "walk-up-slime": { from: 897, to: 898, loop: true, speed: 4 },
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
            this.k.sprite("spritesheet", { anim: "idle-down-player" }),
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

    monsterSetup(entity) {
        const enemy = this.k.add([
            this.k.sprite("spritesheet", { anim: `walk-down-${entity.name}` }),
            this.k.pos(this.k.vec2((this.map.pos.x + entity.x) * scaleFactor, (this.map.pos.y + entity.y) * scaleFactor)),
            this.k.area(),
            this.k.body(),
            this.k.anchor("center"),
            this.k.scale(scaleFactor),
            this.k.state("idle", ["idle", "attack", "move"]),
            `${entity.name}s`,
            {
                direction: "down",
                layer: "object",
            },
        ]);

        enemy.add([
            this.k.sprite("spritesheet", { anim: "idle-monster-attack" }),
            this.k.pos(),
            this.k.area(),
            {
                layer: "objects",
            },
            `${entity.name}s`,
        ]);
    }

    layerSetup(layers, map) {
        this.map = map;

        for (const layer of layers) {
            //  외벽
            if (layer.name === "boundaries") {
                for (const boundary of layer.objects) {
                    this.map.add([
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
                        this.player.pos = this.k.vec2((this.map.pos.x + entity.x) * scaleFactor, (this.map.pos.y + entity.y) * scaleFactor);
                        this.k.add(this.player);
                        continue;
                    }
                }
            }

            if (layer.name === "frogs") {
                for (const entity of layer.objects) {
                    this.monsterSetup(entity);
                    this.frogs.push(entity); // constructor에서 배열 생성 필요
                }
            }

            if (layer.name === "slimes") {
                for (const entity of layer.objects) {
                    this.monsterSetup(entity);
                    this.slimes.push(entity); // constructor에서 배열 생성 필요
                }
            }

            // yard로 나가는 출구
            if (layer.name === "exit") {
                for (const entity of layer.objects) {
                    if (entity.name === "exit") {
                        this.map.add([
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
                        this.map.add([
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

    handleCommonReleaseMove(obj) {
        if (this.player.state === "attack") {
            this.player.enterState("idle");
        }

        if (this.player.direction === "down") {
            this.player.play(`idle-down-${obj}`);
            return;
        }

        if (this.player.direction === "up") {
            this.player.play(`idle-up-${obj}`);
            return;
        }
        this.player.play(`idle-side-${obj}`);
    }

    handlePlayerMove(mouseBtn) {
        // 좌클릭이 아니거나 다이얼로그가 띄어져 있다면 return
        if (mouseBtn !== "left" || this.player.isInDialogue) return;

        // 마우스 좌표
        const worldMousePos = this.k.toWorld(this.k.mousePos());
        this.player.moveTo(worldMousePos, this.player.speed);

        // 마우스 각도
        const mouseAngle = this.player.pos.angle(worldMousePos);
        this.handleCommonMove(mouseAngle, "player");
    }

    handleMonsterMove(enemy) {
        // 플레이어 각도
        const playerAngle = enemy.pos.angle(this.player.pos);
        handleCommonMove(playerAngle, enemy.name);
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

    handleMonsterStateChange() {
        for (const enemy of this.frogs) {
            enemy.onStateUpdate("move", () => {
                this.handleMonsterMove(enemy);

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

            enemy.onStateUpdate("idle", () => {
                enemy.play("walk-down-frog");
            });

            enemy.onStateEnter("attack", () => {
                enemy.children[0].play("monster-attack-side");
            });

            enemy.onStateEnd("attack", () => {
                enemy.children[0].play("idle-monster-attack");
            });
        }

        for (const enemy of this.slimes) {
            enemy.onStateUpdate("move", () => {
                this.handleMonsterMove(enemy);

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

            enemy.onStateUpdate("idle", () => {
                enemy.play("walk-down-slime");
            });
        }
    }

    handleMonsterState() {
        this.k.onUpdate("player", () => {
            for (const enemy of this.frogs) {
                handleMonsterDir(enemy);
            }

            for (const enemy of this.slimes) {
                handleMonsterDir(enemy);
            }
        });
    }

    // 상하 좌우 공통 움직임 처리
    handleCommonMove(angle, obj) {
        const lowerBound = 50;
        const upperBound = 125;

        if (angle > lowerBound && angle < upperBound && this.player.curAnim() !== `walk-up-${obj}`) {
            this.player.play(`walk-up-${obj}`);
            this.player.direction = "up";
            return;
        }

        if (angle < -lowerBound && angle > -upperBound && this.player.curAnim() !== `walk-down-${obj}`) {
            this.player.play(`walk-down-${obj}`);
            this.player.direction = "down";
            return;
        }

        if (Math.abs(angle) > upperBound) {
            this.player.flipX = false;
            if (this.player.curAnim() !== `walk-side-${obj}`) this.player.play(`walk-side-${obj}`);
            this.player.direction = "right";
            return;
        }

        if (Math.abs(angle) < lowerBound) {
            this.player.flipX = true;
            if (this.player.curAnim() !== `walk-side-${obj}`) this.player.play(`walk-side-${obj}`);
            this.player.direction = "left";
            return;
        }
    }

    // player 위치에 따라 몬스터 방향 결정
    handleMonsterDir(enemy) {
        if (this.player.pos.dist(enemy.pos) > 90 && this.player.pos.dist(enemy.pos) < 120) {
            if (enemy.state !== "move") enemy.enterState("move");
        }

        if (this.player.pos.dist(enemy.pos) > 140) {
            if (enemy.state !== "idle") enemy.enterState("idle");
        }

        if (this.player.pos.dist(enemy.pos) < 90) {
            if (enemy.state !== "attack") {
                enemy.enterState("attack");
            }
        }
    }
}
