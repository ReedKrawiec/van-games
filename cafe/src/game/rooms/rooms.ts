
interface room_dir {
  [index:string]:any
}
import {resturant} from "./resturant";
export let rooms:room_dir = {
	resturant:resturant,
}