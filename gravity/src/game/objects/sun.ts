
import {obj} from "../../lib/object";
import { obj_state, Vector } from "../../lib/state";
import { gravity_mass } from "./abstract/gravity_mass";

interface sun_state extends obj_state{
    
}
    
interface sun_parameters{
  mass:number
}
    
export class sun extends gravity_mass{
  sprite_url = "./sprites/sun.png";
  height = 200;
  width = 200;
  params:sun_parameters;
  static default_params:sun_parameters = {
    mass:1.989 * 10**30
  }
  constructor(state:obj_state,params:sun_parameters = sun.default_params){
    super(state,params);
    this.tags.push("sun");
  }
  statef(time_delta:number){
    super.statef(time_delta);
  }
  renderf(time_delta:number){
   return super.renderf(time_delta); 
  }
  register_animations(){
    
  }
  register_audio(){
    
  }
  register_controls(){
        
  }
}
    