import { box } from "./box";

export class VertBox extends box {
  sprite_url = "./sprites/box2.png";
  width = 64;
  height = 500;
  static = false;
  tick_state = false;
}
