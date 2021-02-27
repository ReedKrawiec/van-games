
interface prefabs {
  [index:string]:any
}
import {box} from "./box";
import {bullet} from "./bullet";
import {capture_area} from "./capture_area";
import {ControlledPlayer} from "./ControlledPlayer";
import {Cursor} from "./Cursor";
import {Goomba} from "./Goomba";
import {Gun} from "./Gun";
import {placeholder} from "./placeholder";
import {Player} from "./Player";
import {progress_bar} from "./progress_bar";
import {VertBox} from "./VertBox";
export let prefabs:prefabs = {
	box:box,
	bullet:bullet,
	capture_area:capture_area,
	ControlledPlayer:ControlledPlayer,
	Cursor:Cursor,
	Goomba:Goomba,
	Gun:Gun,
	placeholder:placeholder,
	Player:Player,
	progress_bar:progress_bar,
	VertBox:VertBox,
}