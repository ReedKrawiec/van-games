
import {obj, rotation_length} from "../../../lib/object";
import { obj_state, Vector } from "../../../lib/state";
import { simulation } from "../../rooms/simulation";

interface gravity_mass_state extends obj_state{
  tick_timer:number;
}
    
interface gravity_mass_parameters{
  mass:number
}
    
export class gravity_mass extends obj{
  render = true;
  collision = false;
  particle = true;
  layer = 2;
  forces:Vector = {
    x:0,
    y:0
  }
  params:gravity_mass_parameters;
  state:gravity_mass_state;
  static default_params:gravity_mass_parameters = {
    mass:1
  }
  constructor(state:obj_state,params:gravity_mass_parameters = gravity_mass.default_params){
    super(state,params);
    this.tags.push("mass");
    this.state.tick_timer = 0;
  }
  statef(time_delta:number){
    let room = this.game.getRoom() as simulation;
    if(this.state.tick_timer === 0 && room.state.trails_enabled){
      //let mass_objects = this.game.getRoom().objects.length;
      //let lifetime = Math.max(10,((1 - (mass_objects/50)) * 5000));
      this.emitParticle("tracer",{x:0,y:0},room.state.trail_lifetime,0);
    }
    this.state.tick_timer+=1;
    if(this.state.tick_timer === room.state.trail_interval) this.state.tick_timer = 0;
    
    this.forces.x = 0;
    this.forces.y = 0;
    for(let a of (room.objects.filter((o)=>o.id!=this.id) as gravity_mass[])){
      let dist = Math.max(this.distance(a),0.0001);
      let force = room.grav_const * (this.params.mass/room.div_const * a.params.mass/room.div_const)/dist;
      let angled_force = rotation_length(force,this.angleTowards(a));
      this.forces.x += angled_force.x;
      this.forces.y += angled_force.y;
    }
    this.state.velocity.x += (this.forces.x/this.params.mass) * time_delta/16.66
    this.state.velocity.y += (this.forces.y/this.params.mass) * time_delta/16.66
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
    