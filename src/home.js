import { Game } from "./Game";
import { scaleFactor } from "./constants";

export const loadHomeScene = () => {
    const home = new Game();

    home.k.scene("home", async () => {
        home.k.loadSprite("map", "./map.png");
        home.k.setBackground(home.k.Color.fromHex("#311047"));
        const mapData = await (await fetch("./map.json")).json();
        const layers = mapData.layers;
        const map = home.k.add([home.k.sprite("map"), home.k.pos(0), home.k.scale(scaleFactor)]);

        home.playerSetup();
        home.layerSetup(layers, map);
        home.scaleSetup();

        home.k.onUpdate(() => {
            home.k.camPos(home.player.pos.x, home.player.pos.y + 100);
        });

        home.k.onMouseDown((mouseBtn) => {
            home.handlePlayerMove(mouseBtn);
        });

        home.k.onMouseRelease(() => {
            home.handleReleaseMove();
        });
    });
};
