import { loadHomeScene } from "./home";
import { k } from "./kaboomCtx";
import { loadYardScene } from "./yard";

loadYardScene();
loadHomeScene();

k.go("home");
