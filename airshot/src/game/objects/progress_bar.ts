
import {composite_obj, obj} from "../../lib/object";
import { scale_type } from "../../lib/render";
import { obj_state, Vector } from "../../lib/state";
import { Player } from "./Player";

interface progress_bar_state extends obj_state{
  percentage:number
}
    
interface progress_bar_parameters{
  width:number,
  height:number,
  vert_offset:number
}

export class progress_bar extends obj{
  sprite_url = "./sprites/green.png";
  height = 1;
  width = 1;
  tags:Array<string> = [];
  collision = false;
  render = true;
  layer = 3;
  params:progress_bar_parameters;
  state:progress_bar_state;
  scale_type = scale_type.grow;
  static default_params:progress_bar_parameters = {
    width:70,
    height:10,
    vert_offset:40
  }
  constructor(state:obj_state,params:progress_bar_parameters = progress_bar.default_params){
    super(state,params);
    this.state.percentage = 1;
    this.tags.push("health_bar");
  }
  statef(time_delta:number){
    let parent = this.parent as Player;
    this.state.position.y = parent.state.position.y + this.params.vert_offset;
    this.state.position.x =  parent.state.position.x - ( (1 - this.state.percentage) * this.params.width/2);
    this.state.scaling.width = this.state.percentage * this.params.width;
    this.state.scaling.height = this.params.height;
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
    