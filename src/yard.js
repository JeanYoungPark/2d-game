import { scaleFactor } from "./constants";
import { k } from "./kaboomCtx";
import { setCamScale } from "./utils";

export const loadYardScene = () => {
    k.scene("yard", async () => {
        k.loadSprite("yard", "./yardMap.png");
        k.setBackground(k.Color.fromHex("#424E1E"));
        const mapData = await (await fetch("./yardMap.json")).json();
        const layers = mapData.layers;

        const map = k.add([k.sprite("yard"), k.pos(0), k.scale(scaleFactor)]);

        const player = k.make([
            k.sprite("spritesheet", { anim: "idle-down" }),
            k.area({
                shape: new k.Rect(k.vec2(0, 3), 10, 10),
            }),
            k.body(),
            k.anchor("center"),
            k.pos(),
            k.scale(scaleFactor),
            {
                speed: 250,
                direction: "down",
                isInDialogue: false,
            },
            "player",
        ]);

        player.add([
            k.sprite("spritesheet", { anim: "idle-sword" }),
            k.pos(player.pos.x - 10, player.pos.y - 5),
            k.scale(0.5),
            {
                layer: "objects",
                tag: "sword",
            },
        ]);

        for (const layer of layers) {
            if (layer.name === "boundaries") {
                for (const boundary of layer.objects) {
                    map.add([
                        k.area({
                            shape: new k.Rect(k.vec2(0), boundary.width, boundary.height),
                        }),
                        k.body({ isStatic: true }),
                        k.pos(boundary.x, boundary.y),
                        boundary.name,
                    ]);
                }
                continue;
            }

            if (layer.name === "spawnpoint") {
                for (const entity of layer.objects) {
                    if (entity.name === "player") {
                        player.pos = k.vec2((map.pos.x + entity.x) * scaleFactor, (map.pos.y + entity.y) * scaleFactor);
                        k.add(player);
                        continue;
                    }
                }
            }

            if (layer.name === "home") {
                for (const entity of layer.objects) {
                    if (entity.name === "home") {
                        map.add([
                            k.area({
                                shape: new k.Rect(k.vec2(0), entity.width, entity.height),
                            }),
                            k.body({ isStatic: true }),
                            k.pos(entity.x, entity.y),
                            entity.name,
                        ]);

                        player.onCollide(entity.name, () => {
                            k.go("home");
                        });
                    }
                    continue;
                }
            }
        }

        setCamScale(k);

        k.onResize(() => {
            setCamScale(k);
        });

        k.onUpdate(() => {
            k.camPos(player.pos.x, player.pos.y + 100);
        });

        k.onMouseDown((mouseBtn) => {
            if (mouseBtn !== "left" || player.isInDialogue) return;

            const worldMousePos = k.toWorld(k.mousePos());
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

        k.onMouseRelease(() => {
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

        k.onKeyPress("alt", () => {
            console.log(player.getCollisions());
            // console.log(player.children[0].play("sword-side"));
            // player.play("sword-side");
        });
    });
};
