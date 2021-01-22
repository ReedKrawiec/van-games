
interface room_dir {
  [index:string]:any
}
import {placeholder} from "./placeholder";
import {simulation} from "./simulation";
export let rooms:room_dir = {
	placeholder:placeholder,
	simulation:simulation,
}