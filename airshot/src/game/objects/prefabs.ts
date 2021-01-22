
interface prefabs {
  [index:string]:any
}
import {box} from "./box";
import {bullet} from "./bullet";
import {ControlledPlayer} from "./ControlledPlayer";
import {Cursor} from "./Cursor";
import {Goomba} from "./Goomba";
import {Gun} from "./Gun";
import {placeholder} from "./placeholder";
import {Player} from "./Player";
import {VertBox} from "./VertBox";
export let prefabs:prefabs = {
	box:box,
	bullet:bullet,
	ControlledPlayer:ControlledPlayer,
	Cursor:Cursor,
	Goomba:Goomba,
	Gun:Gun,
	placeholder:placeholder,
	Player:Player,
	VertBox:VertBox,
}