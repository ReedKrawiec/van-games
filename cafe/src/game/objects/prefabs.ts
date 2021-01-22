
interface prefabs {
  [index:string]:any
}
import {box} from "./box";
import {coffee} from "./coffee";
import {corner} from "./corner";
import {Pather} from "./Pather";
import {Planks} from "./Planks";
import {progress_bar} from "./progress_bar";
import {side_wall} from "./side_wall";
import {stove} from "./stove";
import {wall} from "./wall";
import {Worker} from "./Worker";
export let prefabs:prefabs = {
	box:box,
	coffee:coffee,
	corner:corner,
	Pather:Pather,
	Planks:Planks,
	progress_bar:progress_bar,
	side_wall:side_wall,
	stove:stove,
	wall:wall,
	Worker:Worker,
}