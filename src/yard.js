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

        yard.k.onUpdate(() => {
            yard.k.camPos(yard.player.pos.x, yard.player.pos.y + 100);
        });

        yard.k.onMouseDown((mouseBtn) => {
            yard.handlePlayerMove(mouseBtn);
        });

        yard.k.onMouseRelease(() => {
            yard.handleCommonReleaseMove("player");
        });

        yard.k.onKeyPress("z", () => {
            yard.handleAttack();
        });

        yard.k.onKeyRelease("z", () => {
            yard.handleCommonReleaseMove("player");
        });

        yard.handleCommonCollide();
        yard.handleMonsterState();
        yard.handleMonsterStateChange();
    });
};
