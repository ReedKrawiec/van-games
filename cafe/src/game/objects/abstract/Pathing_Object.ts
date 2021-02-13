
import { obj, rotation_length } from "../../../lib/object";
import { obj_state, Vector } from "../../../lib/state";
import { nav_mesh, Pathing_Room } from "../../rooms/abstract/Pathing_Room";
import { AStarFinder } from "astar-typescript";
import { Vec } from "../../../lib/math";
import { DEBUG, render_collision_box, render_line } from "src/van";
export interface Pathing_Object_state extends obj_state {
  last_pos:Vector;
  pathing_timer:number;
}

interface Pathing_Object_parameters {

}

export class Pathing_Object extends obj {
  hasGoal: boolean = false;
  currentPath: Vector[];
  currentFullPath: Vector[];
  currentGoalPos: Vector;
  collision = false;
  state:Pathing_Object_state;
  speed: number = 1;
  path_recalc_interval:number = 1000;
  constructor(state:obj_state,params?:unknown){
    super(state,params);
    this.state.last_pos = {
      x:undefined,
      y:undefined
    };
    this.state.pathing_timer = 0;
  }
  posToCord(nav_mesh: nav_mesh, pos: Vector): Vector {
    let room = this.game.getRoom() as Pathing_Room<unknown>;
    let x = Math.floor((pos.x - nav_mesh.box.x + nav_mesh.box.width / 2) / nav_mesh.box.width * (nav_mesh.box.width / room.nav_node_diameter));
    let y = Math.floor((pos.y - nav_mesh.box.y + nav_mesh.box.height / 2) / nav_mesh.box.height * (nav_mesh.box.height / room.nav_node_diameter));
    return { x, y };
  }
  cordOnGrid(nav_mesh:nav_mesh, pos:Vector){
    return(pos.x >= 0 && pos.y >= 0 && pos.y < nav_mesh.grid.length && pos.x < nav_mesh.grid[0].length);
  }
  setGoal(pos:Vector){
    let room = this.game.getRoom() as Pathing_Room<unknown>;
    let mesh = room.computerNavMesh(room.floor_tag,this.id);
    let instance = new AStarFinder({
      grid: {
        matrix: mesh.grid
      }
    });

    let start = this.posToCord(mesh, this.state.position);
    let goal = this.posToCord(mesh, pos);
    if(this.cordOnGrid(mesh,start) && this.cordOnGrid(mesh,goal)){
      let start_pos = this.state.position;
      let bottom_left: Vector = {
        x: mesh.box.x - mesh.box.width / 2,
        y: mesh.box.y - mesh.box.height / 2
      }
      this.hasGoal = true;
      let raw_path = instance.findPath(start, goal);
      this.currentPath = raw_path.map((cord) => {
        return {
          x: bottom_left.x + room.nav_node_diameter * cord[0] + room.nav_node_diameter/2,
          y: bottom_left.y + room.nav_node_diameter * cord[1] + room.nav_node_diameter/2
        }
      });
      this.currentFullPath = Array.from(this.currentPath);
      this.currentGoalPos = start_pos;
    }
  }
  statef(delta_time: number) {
    super.statef(delta_time);
    if (this.currentGoalPos) {
      if(DEBUG){
        let last_pos = this.state.position;
        for(let a of this.currentPath){
          render_line({
            start:last_pos,
            end:a
          });
          last_pos = a;
        }
        
      }
      let speed = this.speed;
      let dist = Vec.distance(this.state.position,this.currentGoalPos);
      let angle = this.angleTowardsPoint(this.currentGoalPos);
      let vel = rotation_length(this.speed, angle);
      this.state.velocity = Vec.scalar_mult(vel,delta_time/16.66);
      
      if (dist < this.speed) {
        if (this.currentPath.length > 0) {
          this.currentGoalPos = this.currentPath.shift();
        }
        else{
          this.state.position = this.currentGoalPos;
          this.hasGoal = false;
          this.currentGoalPos = undefined;
          this.currentFullPath = undefined;
          this.currentPath = undefined;
        }
        this.state.velocity = { x: 0, y: 0 };
      }
      if(this.state.pathing_timer == 0){
        
        if(this.state.last_pos.x == this.state.position.x && this.state.last_pos.y == this.state.position.y){
          let goal = this.currentFullPath[this.currentFullPath.length - 1];
          this.setGoal(goal);

        }
      }
      this.state.pathing_timer += delta_time;
      if(this.state.pathing_timer > this.path_recalc_interval){
        this.state.pathing_timer = 0;
      }
    }
    else{
      this.state.pathing_timer = 0;
    }
    this.state.last_pos.x  = this.state.position.x;
    this.state.last_pos.y = this.state.position.y;   
  }
}
