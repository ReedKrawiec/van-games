import {obj} from "lib/object";
import { obj_state, Vector } from "lib/state";
import {ControlledPlayer} from "game/objects/ControlledPlayer";
import {copy} from "src/van";

export interface capture_area_state extends obj_state{
    
}
    
export interface capture_area_parameters{
    
}
    
export class capture_area extends obj{
  sprite_url = "./sprites/Error.png";
  height = 100;
  width = 100;
  tags:Array<string>;
  collision = false;
  render = false;
  state:capture_area_state;
  params:capture_area_parameters;
  tick_state = false;
  static default_params:capture_area_parameters = {}
  constructor(state:obj_state,params:capture_area_parameters = copy(capture_area.default_params)){
    super(state,params);
    this.tags.push("capture_area")
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