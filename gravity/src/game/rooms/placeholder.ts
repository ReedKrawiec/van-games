import { room } from "../../lib/room";
import { game, viewport } from "../../van";
import { state_config } from "../../lib/room";
import * as config from "./placeholder.json";
import { Camera } from "../../lib/render";
let cfig = config as unknown as state_config;
interface placeholder_state {

}


export class placeholder extends room<placeholder_state>{
  background_url = "./sprites/Error.png";
  constructor(game: game<unknown>) {
    super(game, cfig);
    this.game.state.cameras.push(new Camera({
      x: 0,
      y: 0,
      dimensions: viewport,
      scaling: 1,
      debug: false
    },
      {
        x: 0,
        y: 0,
        height: 1,
        width: 1
      }))
  }
  registerControls() {

  }
  registerParticles() {

  }
  statef(delta_time: number) {
    super.statef(delta_time);
  }

}

