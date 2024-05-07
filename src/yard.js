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

        yard.playerSetup();
        yard.layerSetup(layers, map);
        yard.scaleSetup();

        const sword = yard.player.add([
            yard.k.sprite("spritesheet", { anim: "no-idle" }),
            yard.k.pos(),
            yard.k.scale(0.5),
            yard.k.area(),
            {
                layer: "objects",
            },
        ]);

        yard.k.onUpdate(() => {
            yard.k.camPos(yard.player.pos.x, yard.player.pos.y + 100);
        });

        yard.k.onMouseDown((mouseBtn) => {
            yard.handleCommonMouseDown(mouseBtn);
        });

        yard.k.onMouseRelease(() => {
            yard.handleCommonMouseRelease();
        });

        yard.k.onKeyPress("z", () => {
            if (yard.player.direction === "left") {
                sword.pos = yard.k.vec2(-10, -5);
                sword.flipX = true;
                sword.play("sword-side");
            }

            if (yard.player.direction === "right") {
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
