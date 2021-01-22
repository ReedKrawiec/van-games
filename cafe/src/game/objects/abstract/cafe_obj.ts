
import {obj} from "../../../lib/object";
import { obj_state, Vector } from "../../../lib/state";

export interface cafe_obj_state extends obj_state{
  in_use:boolean
}
    
interface cafe_obj_parameters{
    
}
    
export class cafe_obj extends obj{
  sprite_url = "./sprites/Error.png";
  height = 100;
  width = 100;
  tags:Array<string> = [];
  collision = true;
  render = true;
  params:cafe_obj_parameters;
  state:cafe_obj_state;
  static default_params:cafe_obj_parameters = {}
  constructor(state:obj_state,params:cafe_obj_parameters = cafe_obj.default_params){
    super(state,params);
    
  }
  click(){
    
  }
}
    