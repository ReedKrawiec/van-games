
interface room_dir {
  [index:string]:any
}
import {Overworld} from "./Overworld";
export let rooms:room_dir = {
	Overworld:Overworld,
}