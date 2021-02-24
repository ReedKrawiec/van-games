
interface room_dir {
  [index:string]:any
}
import {loading} from "./loading";
import {Overworld} from "./Overworld";
export let rooms:room_dir = {
	loading:loading,
	Overworld:Overworld,
}