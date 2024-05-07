import { Game } from "./Game";
import { dialogueData, scaleFactor } from "./constants";
import { displayDialogue, setCamScale } from "./utils";

export const loadHomeScene = () => {
    const home = new Game();

    home.k.scene("home", async () => {
        home.k.loadSprite("map", "./map.png");
        home.k.setBackground(home.k.Color.fromHex("#311047"));
        const mapData = await (await fetch("./map.json")).json();

        const layers = mapData.layers;

        const map = home.k.add([home.k.sprite("map"), home.k.pos(0), home.k.scale(scaleFactor)]);

        home.player = home.k.make([
            home.k.sprite("spritesheet", { anim: "idle-down" }),
            home.k.area({
                shape: new home.k.Rect(home.k.vec2(0, 3), 10, 10),
            }),
            home.k.body(),
            home.k.anchor("center"),
            home.k.pos(),
            home.k.scale(scaleFactor),
            {
                speed: 250,
                direction: "down",
                isInDialogue: false,
            },
            "player",
        ]);

        for (const layer of layers) {
            if (layer.name === "boundaries") {
                for (const boundary of layer.objects) {
                    map.add([
                        home.k.area({
                            shape: new home.k.Rect(home.k.vec2(0), boundary.width, boundary.height),
                        }),
                        home.k.body({ isStatic: true }),
                        home.k.pos(boundary.x, boundary.y),
                        boundary.name,
                    ]);

                    if (boundary.name) {
                        player.onCollide(boundary.name, () => {
                            player.isInDialogue = true;
                            displayDialogue(dialogueData[boundary.name], () => (player.isInDialogue = false));
                        });
                    }
                }
                continue;
            }

            if (layer.name === "spawnpoints") {
                for (const entity of layer.objects) {
                    if (entity.name === "player") {
                        player.pos = home.k.vec2((map.pos.x + entity.x) * scaleFactor, (map.pos.y + entity.y) * scaleFactor);
                        home.k.add(player);
                        continue;
                    }
                }
            }

            if (layer.name === "exit") {
                for (const entity of layer.objects) {
                    if (entity.name === "exit") {
                        map.add([
                            home.k.area({
                                shape: new home.k.Rect(home.k.vec2(0), entity.width, entity.height),
                            }),
                            home.k.body({ isStatic: true }),
                            home.k.pos(entity.x, entity.y),
                            entity.name,
                        ]);

                        player.onCollide(entity.name, () => {
                            home.k.go("yard");
                        });
                    }
                    continue;
                }
            }
        }

        setCamScale(home.k);

        home.k.onResize(() => {
            setCamScale(home.k);
        });

        home.k.onUpdate(() => {
            home.k.camPos(home.player.pos.x, home.player.pos.y + 100);
        });

        home.k.onMouseDown((mouseBtn) => {
            if (mouseBtn !== "left" || player.isInDialogue) return;

            const worldMousePos = home.k.toWorld(home.k.mousePos());
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

        home.k.onMouseRelease(() => {
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
    });
};
