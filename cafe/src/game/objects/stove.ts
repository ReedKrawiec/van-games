
import { resolveModuleNameFromCache } from "typescript";
import { exec_type } from "../../lib/controls";
import {obj} from "../../lib/object";
import { obj_state, Vector } from "../../lib/state";
import { resturant,resturant_state} from "../rooms/resturant";
import {cafe_obj, cafe_obj_state} from "./abstract/cafe_obj";
import {sprite_gen} from "../../lib/sprite"; 
import {Worker} from "./Worker";
import { cooker,cooker_state } from "./abstract/cooker";

interface stove_state extends cooker_state{
  pather_id:string
}
    
interface stove_parameters{
    
}
    
export class stove extends cooker{
  sprite_url = "./sprites/stove.png";
  height = 100;
  width = 100;
  collision = true;
  render = true;
  params:stove_parameters;
  state:stove_state;
  static default_params:stove_parameters = {}
  setTask(w:Worker){
    w.setTask({
      length:5000,
      callback:()=>{
        console.log("done");
      }
    })
  }
  register_animations(){
    
  }
  register_audio(){
    
  }
  register_controls(){

  }
}
    