import { Game } from "./Game";
import { scaleFactor } from "./constants";

export const loadYardScene = () => {
    const yard = new Game();
    ß;
    yard.k.scene("yard", async () => {
        yard.k.loadSprite("yard", "./yardMap.png");
        yard.k.setBackground(yard.k.Color.fromHex("#424E1E"));
        const mapData = await (await fetch("./yardMap.json")).json();
        const layers = mapData.layers;
        const map = yard.k.add([yard.k.sprite("yard"), yard.k.pos(0), yard.k.scale(scaleFactor)]);

        yard.playerSetup();
        yard.layerSetup(layers, map);
        yard.scaleSetup();

        yard.k.onUpdate(() => {
            yard.k.camPos(yard.player.pos.x, yard.player.pos.y + 100);
        });

        yard.k.onKeyDown((KeyCode) => {
            if (KeyCode === "control") {
                yard.handlePlayerAttack();
            } else {
                yard.handlePlayerMoveByKey(KeyCode);
            }
        });

        yard.k.onKeyRelease(() => {
            yard.handleCommonReleaseMove(yard.player, "player");
        });

        yard.handleCommonCollide();
        yard.handleMonsterState();
        yard.handleMonsterStateChange();
    });
};
