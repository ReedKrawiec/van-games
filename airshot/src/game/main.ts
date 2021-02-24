import {Vector,obj_state,room_state} from "../lib/state";
import {game,GetViewportDimensions,peer_to_peer_game,viewport} from "../van";

let canvas_element:HTMLCanvasElement = document.getElementById("target") as HTMLCanvasElement;

export let g = new peer_to_peer_game<{}>(canvas_element.getContext("2d"),{});



g.loadRoomString("loading");

