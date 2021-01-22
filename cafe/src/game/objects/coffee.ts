
import {obj} from "../../lib/object";
import { obj_state, Vector } from "../../lib/state";
import { cooker, cooker_state} from "./abstract/cooker";
import {Worker} from "./Worker";
interface coffee_state extends cooker_state{
    
}
    
interface coffee_parameters{
    
}
    
export class coffee extends cooker{
  sprite_url = "./sprites/coffee.png";
  height = 100;
  width = 100;
  tags:Array<string>;
  collision = true;
  render = true;
  params:coffee_parameters;
  static default_params:coffee_parameters = {}
  constructor(state:obj_state,params:coffee_parameters = coffee.default_params){
    super(state,params);
  }
  setTask(w:Worker){
    w.setTask({
      length:10000,
      callback:()=>{
        console.log("coffee2");
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
    