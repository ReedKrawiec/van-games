
interface room_dir {
  [index:string]:any
}
import {Board} from "./Board";
export let rooms:room_dir = {
	Board:Board,
}