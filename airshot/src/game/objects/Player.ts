import { obj_state, Vector } from "../../lib/state";
import { composite_obj } from "../../lib/object";
import { ControlledPlayer } from "./ControlledPlayer";
import { Gun } from "./Gun";
import { Vec } from "lib/math";
import { progress_bar } from "./progress_bar";
import {copy} from "src/van";


interface Player_state extends obj_state{
  health:number;
  isRespawning:boolean;
}

export interface Player_Params{
  id:string
  respawn_point:Vector,
  respawn_time:number
}

export class Player extends composite_obj{
  enemy = true;
  state:Player_state;
  params:Player_Params;
  static default_params:Player_Params = {
    respawn_point:Vec.create(0,0),
    respawn_time:3000,
    id:"test"
  }
  constructor(state:obj_state, parameters: Player_Params = copy(Player.default_params)) {
    super(state,parameters);
    this.state.health = 100;
    this.state.isRespawning = false;
    this.addItem(new ControlledPlayer(state, parameters));
    this.addItem(new Gun({
      position:{x: state.position.x, y: state.position.y + 100},
    },parameters));
    this.addItem(new progress_bar({
      position:Vec.create(0,0)
    },{
      width:100,
      height:20,
      vert_offset:0
    }))
  }
  statef(delta_time:number){
    
    let controlled = this.cache("player",this.getItemsByTag("player")[0]) as ControlledPlayer;
    let health_bar = this.cache("health_bar",this.getItemsByTag("health_bar")[0]) as progress_bar;
    let gun = this.cache("gun",this.getItemsByTag("gun")[0]) as Gun;
    super.statef(delta_time);
    this.state.position = Vec.from(controlled.state.position);
    health_bar.state.position = Vec.add(this.state.position,Vec.create(0,90));
    health_bar.state.percentage = this.state.health/100;
    if(this.state.health <= 0 && !this.state.isRespawning){
      this.render = false;
      controlled.render = false;
      controlled.collision = false;
      controlled.gravity = false;
      health_bar.render = false;
      gun.render = false;
      this.state.isRespawning = true;
      setTimeout(()=>{
        controlled.state.position = Vec.from(this.params.respawn_point);

        this.state.health = 100;
        this.state.isRespawning = false;
        this.render = true;
        controlled.render = true;
        controlled.collision = true;
        controlled.gravity = true;
        health_bar.render = true;
        gun.render = true;
      },this.params.respawn_time)
    }
  }
}
