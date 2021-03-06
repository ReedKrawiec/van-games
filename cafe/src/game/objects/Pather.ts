
import { Poll_Mouse } from "../../lib/controls";
import { obj } from "../../lib/object";
import { sprite_gen } from "../../lib/sprite";
import { obj_state, Vector } from "../../lib/state";
import { Pathing_Room } from "../rooms/abstract/Pathing_Room";
import { Pathing_Object, Pathing_Object_state} from "./abstract/Pathing_Object";
import {Worker} from "./Worker";

interface Pather_state extends Pathing_Object_state {

}

interface Pather_parameters {

}

export class Pather extends Pathing_Object {
  sprite_url = "./sprites/player.png";
  tags: Array<string> = ["pather"];
  height = 100;
  width = 100
  collision = false;
  render = true;
  speed = 5;
  params: Pather_parameters;
  layer = 2;
  static default_params: Pather_parameters = {}
  constructor(state: obj_state, params: Pather_parameters = Pather.default_params) {
    super(state, params);
  }
  statef(time_delta: number) {
    super.statef(time_delta);
    let room = this.game.getRoom() as Pathing_Room<unknown>;
  }
  setGoal(pos:Vector){
    super.setGoal(pos);
  }
  renderf(time_delta: number) {
    let sprites = sprite_gen(this.sprite_sheet, this.width, this.height);
    let selected_sprite;
    if (this.currentFullPath && this.currentFullPath.length > 0 && this.currentPath && this.currentGoalPos) {
      let index = this.currentFullPath.length - this.currentPath.length + 1;
      let delta_x = 0;
      let delta_y = 0;
      if (index !== 0) {
        delta_x = this.currentGoalPos.x - this.currentFullPath[index - 1].x;
        delta_y = this.currentGoalPos.y - this.currentFullPath[index - 1].y;
      }
      if (index !== this.currentFullPath.length) {
        if(delta_x !== 0){
          if (delta_x < 0) {
            selected_sprite = sprites[0][3];
          }
          else {
            selected_sprite = sprites[0][2];
          }
        }
        else if(delta_y !== 0){
          if (delta_y < 0) {
            selected_sprite = sprites[0][1]
          }
          else {
            selected_sprite = sprites[0][0]
          }
        }
        
      } else {
        selected_sprite = sprites[0][0]
      }

    }
    else {
      selected_sprite = sprites[0][0];
    }
    return {
      x: this.state.position.x,
      y: this.state.position.y,
      sprite: selected_sprite
    }
  }
  register_animations() {

  }
  register_audio() {

  }
  register_controls() {

  }
}
