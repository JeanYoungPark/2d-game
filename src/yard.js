import { Game } from "./Game";
import { scaleFactor } from "./constants";
import { setCamScale } from "./utils";

export const loadYardScene = () => {
    const yard = new Game();

    yard.k.scene("yard", async () => {
        yard.k.loadSprite("yard", "./yardMap.png");
        yard.k.setBackground(yard.k.Color.fromHex("#424E1E"));
        const mapData = await (await fetch("./yardMap.json")).json();
        const layers = mapData.layers;

        const map = yard.k.add([yard.k.sprite("yard"), yard.k.pos(0), yard.k.scale(scaleFactor)]);

        const player = yard.k.make([
            yard.k.sprite("spritesheet", { anim: "idle-down" }),
            yard.k.area({
                shape: new yard.k.Rect(yard.k.vec2(0, 3), 10, 10),
            }),
            yard.k.body(),
            yard.k.anchor("center"),
            yard.k.pos(),
            yard.k.scale(scaleFactor),
            {
                speed: 250,
                direction: "down",
                isInDialogue: false,
                isSwordVisible: false,
            },
            "player",
        ]);

        const sword = player.add([
            yard.k.sprite("spritesheet", { anim: "no-idle" }),
            yard.k.pos(),
            yard.k.scale(0.5),
            yard.k.area(),
            {
                layer: "objects",
            },
        ]);

        for (const layer of layers) {
            if (layer.name === "boundaries") {
                for (const boundary of layer.objects) {
                    map.add([
                        yard.k.area({
                            shape: new yard.k.Rect(yard.k.vec2(0), boundary.width, boundary.height),
                        }),
                        yard.k.body({ isStatic: true }),
                        yard.k.pos(boundary.x, boundary.y),
                        boundary.name,
                    ]);
                }
                continue;
            }

            if (layer.name === "spawnpoint") {
                for (const entity of layer.objects) {
                    if (entity.name === "player") {
                        player.pos = yard.k.vec2((map.pos.x + entity.x) * scaleFactor, (map.pos.y + entity.y) * scaleFactor);
                        yard.k.add(player);
                        continue;
                    }
                }
            }

            if (layer.name === "home") {
                for (const entity of layer.objects) {
                    if (entity.name === "home") {
                        map.add([
                            yard.k.area({
                                shape: new yard.k.Rect(yard.k.vec2(0), entity.width, entity.height),
                            }),
                            yard.k.body({ isStatic: true }),
                            yard.k.pos(entity.x, entity.y),
                            entity.name,
                        ]);

                        player.onCollide(entity.name, () => {
                            yard.k.go("home");
                        });
                    }
                    continue;
                }
            }
        }

        setCamScale(k);

        yard.k.onResize(() => {
            setCamScale(k);
        });

        yard.k.onUpdate(() => {
            yard.k.camPos(player.pos.x, player.pos.y + 100);
        });

        yard.k.onMouseDown((mouseBtn) => {
            if (mouseBtn !== "left" || player.isInDialogue) return;

            const worldMousePos = yard.k.toWorld(yard.k.mousePos());
            player.moveTo(worldMousePos, player.speed);

            const mouseAngle = player.pos.angle(worldMousePos);

            const lowerBound = 50;
            const upperBound = 125;

            if (mouseAngle > lowerBound && mouseAngle < upperBound && player.curAnim() !== "walk-up") {
                player.play("walk-up");
                player.direction = "up";
                return;
            }

            if (mouseAngle > -lowerBound && mouseAngle < -upperBound && player.curAnim() !== "walk-down") {
                player.play("walk-down");
                player.direction = "down";
                return;
            }

            if (Math.abs(mouseAngle) > upperBound) {
                player.flipX = false;
                if (player.curAnim() !== "walk-side") player.play("walk-side");
                player.direction = "right";
                return;
            }

            if (Math.abs(mouseAngle) < lowerBound) {
                player.flipX = true;
                if (player.curAnim() !== "walk-side") player.play("walk-side");
                player.direction = "left";
                return;
            }
        });

        yard.k.onMouseRelease(() => {
            if (player.direction === "down") {
                player.play("idle-down");
                return;
            }

            if (player.direction === "up") {
                player.play("idle-up");
                return;
            }

            player.play("idle-side");
        });

        yard.k.onKeyPress("z", () => {
            if (player.direction === "left") {
                sword.pos = yard.k.vec2(-10, -5);
                sword.flipX = true;
                sword.play("sword-side");
            }

            if (player.direction === "right") {
                sword.pos = yard.k.vec2(3, -5);
                sword.flipX = false;
                sword.play("sword-side");
            }
        });

        yard.k.onKeyRelease("z", () => {
            sword.play("no-idle");
        });
    });
};
