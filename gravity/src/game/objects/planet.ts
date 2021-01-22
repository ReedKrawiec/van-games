
import {obj} from "../../lib/object";
import { obj_state, Vector } from "../../lib/state";
import { gravity_mass } from "./abstract/gravity_mass";

interface planet_state extends obj_state{
    
}
    
interface planet_parameters{
  mass:number
}
    
export class planet extends gravity_mass{
  sprite_url = "./sprites/planet.png";
  height = 200;
  width = 200;
  params:planet_parameters;
  static default_params:planet_parameters = {
    mass:5.97 * 10**24
  }
  constructor(state:obj_state,params:planet_parameters = planet.default_params){
    super(state,params);
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
    