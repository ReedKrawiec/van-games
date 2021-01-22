
interface prefabs {
  [index:string]:any
}
import {placeholder} from "./placeholder";
import {planet} from "./planet";
import {sun} from "./sun";
export let prefabs:prefabs = {
	placeholder:placeholder,
	planet:planet,
	sun:sun,
}