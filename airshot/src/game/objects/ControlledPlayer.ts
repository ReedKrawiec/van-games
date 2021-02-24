import { exec_type } from "../../lib/controls";
import { Goomba, direction, Player_Params } from "./Goomba";
import {obj_state} from "../../lib/state";


export class ControlledPlayer extends Goomba {
  constructor(state:obj_state,params:Player_Params){
    super(state,params);
    
  }
  tags = ["player"];
  registerControls() {
  }
}
