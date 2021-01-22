
import {obj} from "../../../lib/object";
import { obj_state, Vector } from "../../../lib/state";
import { cafe_obj,cafe_obj_state } from "./cafe_obj";
import {resturant} from "../../rooms/resturant";
import {Worker} from "../Worker";
import {sprite_gen} from "../../../lib/sprite";
import {Pather} from "../Pather";

export interface cooker_state extends cafe_obj_state{
  pather_id:string
}
    
interface cooker_parameters{
    
}
    
export class cooker extends cafe_obj{
  sprite_url = "./sprites/Error.png";
  height = 100;
  width = 100;
  collision = true;
  render = true;
  params:cooker_parameters;
  state:cooker_state;
  static default_params:cooker_parameters = {}
  constructor(state:obj_state,params:cooker_parameters = cooker.default_params){
    super(state,params);
    this.state.pather_id = undefined;
    this.state.in_use = false;
    this.tags.push("clickable");
  }
  click(){
    let room = this.game.getRoom() as resturant;
    room.state.selected.setGoal({x:this.state.position.x,y:this.state.position.y - 100});
    let pather = room.state.selected.objects[0] as Pather;
    this.state.pather_id = pather.id;
    room.state.selected.state.work_station = this;
    room.state.selected = undefined;
  }
  statef(time_delta:number){
    let room = this.game.getRoom() as resturant;
    let coll = this.getFullCollisionBox();
    if(this.state.pather_id && !this.state.in_use){
      coll.y = coll.y - coll.height;
      let worker = room.checkObjects(coll).filter((o)=>o.id == this.state.pather_id);
      if(worker.length > 0){
        this.state.in_use = true;
        let w = worker[0].parent as Worker;
        this.setTask(w);
        w.state.work_station = this;
      }
    } 
  }
  setTask(w:Worker){
    w.setTask({
      length:10000,
      callback:()=>{
        console.log("done2");
      }
    })
  }
  renderf(time_delta:number){
    let sprites = sprite_gen(this.sprite_sheet,this.width,this.height);
    let selected_sprite;
    if(this.state.in_use){
      selected_sprite = sprites[0][1];
    }
    else{
      selected_sprite = sprites[0][0];
    }
    return {
      x:this.state.position.x,
      y:this.state.position.y,
      sprite:selected_sprite
    }; 
  }
  register_animations(){
    
  }
  register_audio(){
    
  }
  register_controls(){
        
  }
}
    