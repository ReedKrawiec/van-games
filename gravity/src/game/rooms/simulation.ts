

import { map_matrix, room } from "../../lib/room";
import { game,viewport } from "../../van";
import { state_config } from "../../lib/room";
import {Camera} from "../../lib/render";

import * as config from "./simulation.json";
import { exec_type, held_keys, Poll_Mouse } from "../../lib/controls";
import { planet } from "../objects/planet";
import {sun} from "../objects/sun";
import { Vec } from "../../lib/math";
import {Vector} from "../../lib/state";
import { HUD,Text } from "../../lib/hud";
import { g } from "../main";
import { gravity_mass } from "../objects/abstract/gravity_mass";
let cfig = config as unknown as state_config;
interface simulation_state {
  bound_mass:gravity_mass,
  trails_enabled:boolean,
  trail_lifetime:number,
  trail_interval:number
}

class sim_hud extends HUD{
  setTextElements(){
    return[
      new Text({
        position:{
          x:10,
          y:viewport.height - 30
        },
        size:15,
        font:"Alata",
        color:"white",
        align:"left",
        scaling:1
      },()=>{
        return `Right click to spawn a sun`;
      }),
      new Text({
        position:{
          x:10,
          y:viewport.height - 50
        },
        size:15,
        font:"Alata",
        color:"white",
        align:"left",
        scaling:1
      },()=>{
        return `Left click to spawn a planet`;
      }),
      new Text({
        position:{
          x:10,
          y:viewport.height - 70
        },
        size:15,
        font:"Alata",
        color:"white",
        align:"left",
        scaling:1
      },()=>{
        return `Middle click to spawn a large sun`;
      }),
      new Text({
      position:{
        x:10,
        y:viewport.height - 90
      },
      size:15,
      font:"Alata",
      color:"white",
      align:"left",
      scaling:1
    },()=>{
      return `Number of objects:${g.getRoom().objects.length}`;
    })]
  }
}

export class simulation extends room<simulation_state>{
  render = false;
  background_url="sprites/Error.png";
  grav_const = 6.67 * 10**-11;
  div_const = 1000000000;
  proximity_map = new map_matrix(1000000,1000000);
  constructor(game: game<unknown>) {
    super(game, cfig);
    this.state = {
      bound_mass:undefined,
      trail_interval:5,
      trail_lifetime:1500,
      trails_enabled:true
    }
    this.game.state.cameras.push(new Camera({
      x: 0,
      y: 0,
      dimensions: viewport,
      scaling: 0.05,
      debug: false
    },
      {
        x: 0,
        y: 0,
        height: 1,
        width: 1
      },new sim_hud()));
  }
  closestSun(pos:Vector):sun{
    let closest:sun = undefined;
    let closest_dist:Number = Number.MAX_SAFE_INTEGER;
    let suns = this.getObjByTag("sun") as sun[];
    for(let s of suns){
      let d = Vec.distance(s.state.position,pos)
      if(d < closest_dist){
        closest = s;
        closest_dist = d;
      }
    }
    return closest;
  }
  registerControls() {
    this.bindControl("KeyA",exec_type.repeat,()=>{
      let shift_held = held_keys["ShiftLeft"] ? 1 : 0;
      let cam = this.game.state.cameras[0];
      cam.state.position.x = cam.state.position.x - ((5 + shift_held * 5) * (1 / cam.state.scaling));
    });
    this.bindControl("KeyD",exec_type.repeat,()=>{
      let shift_held = held_keys["ShiftLeft"] ? 1 : 0;
      let cam = this.game.state.cameras[0];
      cam.state.position.x = cam.state.position.x + ((5 + shift_held * 5) * (1 / cam.state.scaling));
    });
    this.bindControl("KeyW",exec_type.repeat,()=>{
      let shift_held = held_keys["ShiftLeft"] ? 1 : 0;
      let cam = this.game.state.cameras[0];
      cam.state.position.y = cam.state.position.y + ((5 + shift_held * 5) * (1 / cam.state.scaling));
    });
    this.bindControl("KeyS",exec_type.repeat,()=>{
      let shift_held = held_keys["ShiftLeft"] ? 1 : 0;
      let cam = this.game.state.cameras[0];
      cam.state.position.y = cam.state.position.y - ((5 + shift_held * 5) * (1 / cam.state.scaling));
    });
    this.bindControl("mouse0up",exec_type.once,()=>{
      let mouse = Poll_Mouse(this.game.state.cameras[0]);
      let objs = this.checkObjectsPointInclusive(mouse,["mass"]) as gravity_mass[];
      if(objs[0]){
        if(this.state.bound_mass && objs[0].id === this.state.bound_mass.id){
          this.state.bound_mass = undefined;
        }
        else{
          this.state.bound_mass = objs[0];
        }
      }
      else{
        let closest_sun = this.closestSun(mouse);
        let velocity = {x:0,y:-20};
        if(closest_sun.state.position.y > mouse.y)
          velocity.y = 20;
        this.addItem(new planet({
          position:mouse,
          velocity,
          rotation:0,
          scaling:{width:1,height:1}
        }));
      }
    })
    this.bindControl("mouse2up",exec_type.once,()=>{
      let mouse = Poll_Mouse(this.game.state.cameras[0]);
      let closest_sun = this.closestSun(mouse);
      let velocity = {x:0,y:-6};
      if(closest_sun.state.position.y > mouse.y)
        velocity.y = 6;
      this.addItem(new sun({
        position:mouse,
        velocity,
        rotation:0,
        scaling:{width:2,height:2}
      }));
    })
    this.bindControl("mouse1up",exec_type.once,()=>{
      let mouse = Poll_Mouse(this.game.state.cameras[0]);
      let closest_sun = this.closestSun(mouse);
      let velocity = {x:0,y:-6};
      if(closest_sun.state.position.y > mouse.y)
        velocity.y = 6;
      this.addItem(new sun({
        position:mouse,
        velocity,
        rotation:0,
        scaling:{width:5,height:5}
      },{
        mass:1.989 * 10**32
      }));
    })
    this.bindControl("scrollup",exec_type.once,()=>{
      let cam = this.game.state.cameras[0] as Camera;
      cam.state.scaling += 0.05;
      if(cam.state.scaling > 1) cam.state.scaling = 1;
    })
    this.bindControl("scrolldown",exec_type.once,()=>{
      let cam = this.game.state.cameras[0] as Camera;
      if(cam.state.scaling > 0.01){
        cam.state.scaling -= 0.01;
      }
    })
  }
  registerParticles() {
    this.particles["tracer"] = {
      sprite:"./sprites/tracer.png",
      width:50,
      height:50
    }
  }
  statef(delta_time: number) {
    super.statef(delta_time);
    if(this.state.bound_mass){
      let cam = this.game.state.cameras[0] as Camera;
      cam.state.position.y = this.state.bound_mass.state.position.y;
      cam.state.position.x = this.state.bound_mass.state.position.x;
    }
  }

}

