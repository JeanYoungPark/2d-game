import { loadHomeScene } from "./home";
import { k } from "./kaboomCtx";
import { displayDialogue } from "./utils";
import { loadYardScene } from "./yard";

loadYardScene();
loadHomeScene();

k.go("home");
