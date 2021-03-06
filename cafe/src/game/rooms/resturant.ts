

import { room } from "../../lib/room";
import { game, viewport } from "../../van";
import { state_config } from "../../lib/room";
import {Pathing_Room} from "./abstract/Pathing_Room";
import {exec_type, Poll_Mouse} from "../../lib/controls";
import * as config from "./resturant.json";

import { Camera } from "../../lib/render";
import { Pathing_Object } from "../objects/abstract/Pathing_Object";
import { Pather } from "../objects/Pather";
import { cafe_obj } from "../objects/abstract/cafe_obj";
import { cooker } from "../objects/abstract/cooker";
import {Worker} from "../objects/Worker";
let cfig = config as unknown as state_config;
export interface resturant_state {
  pathfind_counter:number
  selected:Worker
}


export class resturant extends Pathing_Room<resturant_state>{
  background_url = "./sprites/Error.png";
  nav_node_diameter = 20;
  nav_recalculation_interval = 20000;
  nav_padding = 45;
  floor_tag = "floor";
  constructor(game: game<unknown>) {
    super(game, cfig);
    this.state = {
      pathfind_counter:0,
      selected:undefined
    }
    this.game.state.cameras = [];
    this.game.state.cameras[0] = (new Camera({
      x: 1000,
      y: 400,
      dimensions: viewport,
      scaling: 0.5,
      debug: false
    },
      {
        x: 0,
        y: 0,
        width: 1,
        height: 1
      }));
    this.game.state.cameras[0].hud = undefined;
  }
  registerControls() {
    this.bindControl("mouse0down",exec_type.once,()=>{
      let mouse = Poll_Mouse(this.game.state.cameras[0]);
      
      if(mouse){
        let pathers = this.checkObjectsPointInclusive(mouse,["pather"]) as Pather[];
        if(!this.state.selected && pathers[0]){
          this.state.selected = pathers[0].parent as Worker;
        }
        else{
          let clicked = this.checkObjectsPointInclusive(mouse,["clickable"]) as cooker[];
          if(clicked[0] && !clicked[0].state.in_use){
            clicked[0].click();
          }
          else{
            this.state.selected.setGoal(mouse);
            this.state.selected = undefined;
          }
        }
      } 
    })
  }
  registerParticles() {

  }
  statef(delta_time: number) {
    
    super.statef(delta_time);

  }

}

