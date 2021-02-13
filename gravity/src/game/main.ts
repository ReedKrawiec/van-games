import {Vector,obj_state,room_state} from "lib/state";
import {game,GetViewportDimensions,viewport,setPaused,PAUSED} from "../van";
import { gravity_mass } from "./objects/abstract/gravity_mass";
import { simulation } from "./rooms/simulation";
import {sun} from "./objects/sun";

let canvas_element:HTMLCanvasElement = document.getElementById("target") as HTMLCanvasElement;

declare global {
  interface Window { functions: any; }
}

interface globals{
  
}

window.functions = {
  setTrails:(bool:boolean)=>{
    let room = g.getRoom() as simulation;
    room.state.trails_enabled = bool;
  },
  setTrailsLifetime:(n:number)=>{
    let room = g.getRoom() as simulation;
    room.state.trail_lifetime = n;
  },
  setTrailsInterval:(n:number)=>{
    let room = g.getRoom() as simulation;
    let objs = room.getObjByTag("mass") as gravity_mass[];
    for(let o of objs){
      o.state.tick_timer = 0;
    }
    room.state.trail_interval = n;
  },
  togglePause(){
    setPaused(!PAUSED);
  }
}

export let g = new game<globals>(canvas_element.getContext("2d"),{});
main();

async function main(){
  await g.loadRoomString("simulation");
  let room = g.getRoom() as simulation;
  let s = room.getObjByTag("sun")[0] as sun;
  room.state.bound_mass = s;
}



