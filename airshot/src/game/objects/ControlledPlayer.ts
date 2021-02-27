import { exec_type } from "../../lib/controls";
import { Goomba, direction, goomba_state } from "./Goomba";
import {obj_state} from "../../lib/state";
import {Player_Params} from "game/objects/Player";




export class ControlledPlayer extends Goomba {
  constructor(state:obj_state,params:Player_Params){
    super(state,params);
  }
  tags = ["player"];

}
