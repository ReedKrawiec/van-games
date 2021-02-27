import { p2p, room } from "lib/room";
import { game, viewport } from "src/van";
import { state_config } from "lib/room";
import * as config from "./loading.json";
import { HUD,Text } from "lib/hud";
import {Vec} from "lib/math";
import { Camera } from "lib/render";
import {exec_type} from "lib/controls";
import { g } from "game/main";
import {peer_to_peer_game} from "src/van";
let cfig = config as unknown as state_config;
interface loading_state {
  input:string,
  connected_peers:number,
  hosting:boolean
}

class loading_hud extends HUD{
  setTextElements():Text[]{
    return [
      new Text({
        position:Vec.create(viewport.width/2,2 * viewport.height/6),
        size:33,
        scaling:1,
        font:"Arial",
        color:"white"

      },()=>(g.state.current_room as loading).state.input),
      new Text({
        position:Vec.create(viewport.width/2,4 * viewport.height/6),
        size:33,
        scaling:1,
        font:"Arial",
        color:"white"

      },()=>("Entering code:"))
    ]
  }
}

class hosting_hud extends HUD{
  setTextElements():Text[]{
    return [
      new Text({
        position:Vec.create(viewport.width/2,4 * viewport.height/6),
        size:33,
        scaling:1,
        font:"Arial",
        color:"white"

      },()=>(g.state.current_room as loading).state.input),
      new Text({
        position:Vec.create(viewport.width/2,2 * viewport.height/6),
        size:33,
        scaling:1,
        font:"Arial",
        color:"white"

      },()=>(`Peers Connected:${(g.getRoom() as loading).state.connected_peers}`))
    ]
  }
}

export class loading extends room<loading_state> implements p2p{
  background_url = "./sprites/Error.png";
  render = false;
  state:loading_state;
  constructor(game: game<unknown>) {
    super(game, cfig);
    this.state = {
      input:"",
      connected_peers:0,
      hosting:false
    };
    this.cameras.push(new Camera({
      x:0,
      y:0,
      dimensions:viewport,
      scaling:1
    },{
      x:0,
      y:0,
      height:1,
      width:1
    },new loading_hud()))
  }
  parse_packet(type:string,data:string){
    switch(type){
      case "connection":{
        if(data == "success"){
          this.state.connected_peers++;
        }
      }
    }
  }
  registerControls() {
    let keys = [
      {key:"A",char:"a"},
      {key:"B",char:"b"},
      {key:"C",char:"c"},
      {key:"D",char:"d"},
      {key:"E",char:"e"},
      {key:"F",char:"f"},
      {key:"G",char:"g"},
      {key:"H",char:"h"},
      {key:"I",char:"i"},
      {key:"J",char:"j"},
      {key:"K",char:"k"},
      {key:"L",char:"l"},
      {key:"M",char:"m"},
      {key:"N",char:"n"},
      {key:"O",char:"o"},
      {key:"P",char:"p"},
      {key:"Q",char:"q"},
      {key:"R",char:"r"},
      {key:"S",char:"s"},
      {key:"T",char:"t"},
      {key:"U",char:"u"},
      {key:"V",char:"v"},
      {key:"W",char:"w"},
      {key:"X",char:"x"},
      {key:"Y",char:"y"},
      {key:"Z",char:"z"}
    ];
    let digits = [0,1,2,3,4,5,6,7,8,9];
    for(let e of keys){
      this.bindControl(`Key${e.key}`,exec_type.once,()=>{
        this.state.input += e.char;
      })
    }
    for(let d of digits){
      this.bindControl(`Digit${d}`,exec_type.once,()=>{
        this.state.input += d;
      })
    }
    this.bindControl("Backspace",exec_type.once,()=>{
      if(this.state.input.length > 0)
        this.state.input = this.state.input.slice(0,this.state.input.length - 1);
    })
    this.bindControl("Enter",exec_type.once,async ()=>{
      let g = (this.game as peer_to_peer_game<{}>);
      if(this.state.hosting){
        console.log("loading");
        await g.loadRoomString("Overworld");
      }
      else{
        g.connect(this.state.input);
      }
    })
    this.bindControl("Tab",exec_type.once,()=>{
      let g = (this.game as peer_to_peer_game<{}>);
      g.host();
      this.state.input = g.hosting_peer.id;
      this.state.hosting = true;
      this.cameras[0].hud = new hosting_hud();
    })
  }
  registerParticles() {

  }
  statef(delta_time: number) {
    super.statef(delta_time);
  }

}