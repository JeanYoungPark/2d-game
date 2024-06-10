import { k } from "./kaboomCtx";
import { anims, dialogueData, scaleFactor } from "./constants";
import { displayDialogue } from "./utils";
import { CommonSetup } from "./CommonSetup";

export class Game extends CommonSetup {
    constructor() {
        super();

        this.k = k;
        this.map = null;
        this.player = null;
        this.frogs = [];
        this.slimes = [];

        this.k.loadSprite("spritesheet", "./spritesheet.png", {
            sliceX: 39,
            sliceY: 31,
            anims: anims,
        });
    }

    scaleSetup() {
        super.setCamScale(this.k);

        this.k.onResize(() => {
            super.setCamScale(this.k);
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
        const enemy = this.k.make([
            this.k.sprite("spritesheet", { anim: `walk-down-${entity.name}` }),
            this.k.pos(this.k.vec2((this.map.pos.x + entity.x) * scaleFactor, (this.map.pos.y + entity.y) * scaleFactor)),
            this.k.area(),
            this.k.body(),
            this.k.anchor("center"),
            this.k.scale(scaleFactor),
            this.k.state("idle", ["idle", "attack", "move"]),
            `enemies`,
            {
                direction: "down",
                layer: "object",
            },
        ]);

        enemy.add([
            this.k.sprite("spritesheet", { anim: "idle-attack-enemy" }),
            this.k.pos(),
            this.k.area(),
            {
                layer: "objects",
            },
            `${entity.name}s`,
            "additional-sprite",
        ]);

        return enemy;
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

            if (layer.name == "npc") {
                for (const entity of layer.objects) {
                    this.map.add([
                        this.k.area({
                            shape: new this.k.Rect(this.k.vec2(0), entity.width, entity.height),
                        }),
                        this.k.body({ isStatic: true }),
                        this.k.pos(entity.x, entity.y),
                        entity.name,
                    ]);

                    if (entity.name) {
                        this.player.onCollide(entity.name, () => {
                            this.player.isInDialogue = true;
                            displayDialogue(dialogueData[entity.name], () => (this.player.isInDialogue = false));
                        });
                    }
                }
            }

            if (layer.name === "frogs") {
                for (const entity of layer.objects) {
                    const enemy = this.monsterSetup(entity);
                    this.k.add(enemy);
                    this.frogs.push(enemy); // constructor에서 배열 생성 필요
                }
            }

            if (layer.name === "slimes") {
                for (const entity of layer.objects) {
                    const enemy = this.monsterSetup(entity);
                    this.k.add(enemy);
                    this.slimes.push(enemy); // constructor에서 배열 생성 필요
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

    // 플레이어 방향 설정 (키)
    handlePlayerMoveByKey(dir) {
        if (this.player.isInDialogue) return;

        let dirX = 0;
        let dirY = 0;

        const dirList = ["up", "down", "left", "right"];

        if (dirList.includes(dir)) {
            if (dir === "up") {
                dirY = -1;
            }

            if (dir === "down") {
                dirY = 1;
            }

            if (dir === "right") {
                dirX = 1;
            }

            if (dir === "left") {
                dirX = -1;
            }

            this.player.move(dirX * this.player.speed, dirY * this.player.speed);
            super.handleCommonMove(dir, this.player, "player");
        }
    }

    // 몬스터 방향 설정
    handleMonsterMove(enemy, name) {
        const playerAngle = enemy.pos.angle(this.player.pos);
        const dir = super.handleAngleToDir(playerAngle);
        super.handleCommonMove(dir, enemy, name);
    }

    // 플레이어 공격상태 진입
    handlePlayerAttack() {
        this.player.enterState("attack");

        if (this.player.direction === "down") {
            this.player.play("idle-attack-down-player");
            return;
        }

        if (this.player.direction === "up") {
            this.player.play("idle-attack-up-player");
            return;
        }

        this.player.play("idle-attack-side-player");
    }

    // enemy 공격상태 진입
    handleAttack(obj, name) {
        const attackAction = obj.children[0];

        if (obj.direction === "down" && attackAction.curAnim() !== `attack-down-${name}`) {
            attackAction.pos = this.k.vec2(-5, 0);
            attackAction.play(`attack-down-${name}`);
            return;
        }

        if (obj.direction === "up" && attackAction.curAnim() !== `attack-up-${name}`) {
            attackAction.pos = this.k.vec2(-5, -15);
            attackAction.play(`attack-up-${name}`);
            return;
        }

        if (obj.direction === "right" && attackAction.curAnim() !== `attack-side-${name}`) {
            attackAction.flipX = false;
            attackAction.pos = this.k.vec2(0, -10);
            attackAction.play(`attack-side-${name}`);
            return;
        }

        if (obj.direction === "left" && attackAction.curAnim() !== `attack-side-${name}`) {
            attackAction.flipX = true;
            attackAction.pos = this.k.vec2(-15, -10);
            attackAction.play(`attack-side-${name}`);
            return;
        }
    }

    // enemies tag를 가진 모든 요소에 부딪힌 상태에서 attack 상태가 되었을 때
    handleCommonCollide() {
        this.player.onCollide("enemies", (e) => {
            this.player.onStateEnter("attack", () => {
                k.destroy(e);
            });
        });

        this.player.onCollide("additional-sprite", () => {
            console.log("attack");
        });
    }

    handleEnemyMovement(enemy, name) {
        enemy.onStateUpdate("move", () => {
            this.handleMonsterMove(enemy, name);

            let dirX = 0;
            let dirY = 0;

            if (this.player.pos.x < enemy.pos.x) {
                dirX = -1;
            }

            if (this.player.pos.x > enemy.pos.x) {
                dirX = 1;
            }

            if (this.player.pos.y < enemy.pos.y) {
                dirY = -1;
            }

            if (this.player.pos.y > enemy.pos.y) {
                dirY = 1;
            }

            enemy.move(100 * dirX, 100 * dirY);
        });

        enemy.onStateUpdate("idle", () => {
            super.handleCommonReleaseMove(enemy, name);
        });

        enemy.onStateEnter("attack", () => {
            this.handleAttack(enemy, "enemy");
            super.handleCommonMove(enemy.direction, enemy, name);
        });

        enemy.onStateEnd("attack", () => {
            enemy.children[0].play("idle-attack-enemy");
        });
    }

    // enemies 움직임 설정
    handleMonsterStateChange() {
        for (const enemy of this.frogs) {
            this.handleEnemyMovement(enemy, "frog");
        }

        for (const enemy of this.slimes) {
            this.handleEnemyMovement(enemy, "slime");
        }
    }

    // player 위치에 따라 몬스터 방향 결정
    handleMonsterState() {
        this.k.onUpdate("player", () => {
            for (const enemy of this.frogs) {
                this.handleMonsterDir(enemy);
            }

            for (const enemy of this.slimes) {
                this.handleMonsterDir(enemy);
            }
        });
    }

    handleMonsterDir(enemy) {
        // 몬스터가 움직이는 플레이어와의 거리 조건
        if (this.player.pos.dist(enemy.pos) >= 90 && this.player.pos.dist(enemy.pos) < 140) {
            if (enemy.state !== "move") {
                enemy.enterState("move");
            }
        } else if (this.player.pos.dist(enemy.pos) >= 140) {
            // 몬스터가 멈추는 플레이어와의 거리 조건
            if (enemy.state !== "idle") {
                enemy.enterState("idle");
            }
        } else if (this.player.pos.dist(enemy.pos) < 90) {
            // 몬스터가 공격하는 플레이어와의 거리 조건
            if (enemy.state !== "attack") {
                enemy.enterState("attack");
            }
        }
    }
}
