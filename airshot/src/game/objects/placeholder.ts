
import {obj} from "../../lib/object";
import { obj_state, Vector} from "../../lib/state";

interface placeholder_state extends obj_state{
    
}
    
interface placeholder_parameters{
    
}
    
export class placeholder extends obj{
  sprite_url = "./sprites/Error.png";
  height = 100;
  width = 100;
  tags:Array<string> = [];
  collision = true;
  render = true;
  params:placeholder_parameters;
  static default_params:placeholder_parameters = {}
  constructor(state:obj_state,params:placeholder_parameters = placeholder.default_params){
    super(state,params);
  }
  statef(time_delta:number){
    
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
    