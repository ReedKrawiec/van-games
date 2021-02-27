import { room, applyGravity,object_state_config, state_config, map_matrix, p2p } from "../../lib/room";
import { Goomba } from "../objects/Goomba";
import { ControlledPlayer } from "../objects/ControlledPlayer";
import { Gun } from "../objects/Gun";
import { Player } from "../objects/Player";
import { Cursor } from "../objects/Cursor";
import { box } from "../objects/box";
import { VertBox } from "../objects/VertBox";
import { velocityCollisionCheck as velocityCollisionCheck } from "../../lib/collision";
import { gravity_obj} from "../../lib/object";
import {rotation_length} from "lib/math";
import { Poll_Mouse, exec_type } from "../../lib/controls";
import { HUD, Text } from "../../lib/hud";
import { DEBUG, game, GetViewportDimensions, peer_connection, peer_to_peer_game, setDebug,viewport } from "../../van";
import {bullet, Rocket} from "../objects/bullet";
import {g} from "../main";
import {Camera} from "../../lib/render";
import * as json from "./Overworld.json";
import {direction} from "game/objects/Goomba";
import {Vec} from "lib/math";
interface overworld_i {
  player: gravity_obj,
  paused: boolean,
  state_update_tick_counter:number
  player_captures:number[]
}

class Overworld_HUD extends HUD {
  setTextElements(){
    return [new Text({
      position: {
        x: 10,
        y: GetViewportDimensions().height * 7/8
      },
      size: 30,
      font: "Alata",
      color: "white",
      align:"left",
      scaling:1
    }, () => {
      return `Player 1:${((g.getRoom() as Overworld).state.player_captures[0]/1000).toFixed(1)}`;
    }),
    new Text({
      position: {
        x: GetViewportDimensions().width - 100,
        y: GetViewportDimensions().height * 7/8
      },
      size: 30,
      font: "Alata",
      color: "white",
      align: "right",
      scaling:1
    }, () => {
      return `Player 1:${((g.getRoom() as Overworld).state.player_captures[1]/1000).toFixed(1)}`;
    })];
  }
}

export class Overworld extends room<overworld_i> implements p2p{
  background_url = "./sprites/imD41l.jpg";
  objects:gravity_obj[];
  proximity_map = new map_matrix(10000,2500)
  players:ControlledPlayer[] = [];
  player_index:number = 0;
  constructor(game:peer_to_peer_game<unknown>) {
    super(game,json as unknown as state_config);
    
    this.state = {
      player: undefined,
      paused: false,
      state_update_tick_counter:0,
      player_captures:[150000,150000]
    };
    game.state.cameras = [
      new Camera({
        x:0,
        y:0,
        dimensions:{
          height:viewport.height,
          width:viewport.width
        },
        scaling:0.3,
        debug:false
      }
      ,{
        x:1,
        y:0,
        width:1,
        height:1
      })
    ]
    game.state.cameras[0].hud = new Overworld_HUD();
  }
  parse_packet(type:string,data:string){
    let other_player = 0;
    if(this.player_index == 0){
      other_player = 1;
    }
    let target = this.players[other_player];
    switch(type){
      case "rocket":{
        let {position,rotation,owner} = JSON.parse(data);
        this.addItem(new Rocket({
          position,
          rotation
        },{
          owner
        }))
        break;
      }
      case "mouse_position":{
        target.state.pointing_towards = JSON.parse(data);
        break;
      }
      case "status":{
        let {id,position,rotation,capture,player_id,health} = JSON.parse(data);
        let obj = this.getObj(id);
        let Player = obj.parent as Player;
        Player.state.health = health;
        this.state.player_captures[player_id] = capture;
        obj.state.position = position;
        obj.state.rotation = rotation;
        break;
      }
      case "move":{
        let velocity;
        if(data == "left"){
          if(target.state.velocity.x < -10){
            velocity = 0;
          }
          else{
            velocity = -1;
          }
        }
        else{
          if(target.state.velocity.x > 10){
            velocity = 0;
          }
          else{
            velocity = 1;
          }
        }
        target.state.velocity.x += velocity;
        break;
      }
      case "inital_move":{
        if(data == "left"){
          target.state.velocity.x -= 0.1;
        }
        else {
          target.state.velocity.x += 0.1;
        }
        break;
      }
      case "jump":{
        target.state.velocity.y += 25;
        break;
      }
    }
  }
  initialize(){
    let controlled_players = this.getObjByTag("player") as ControlledPlayer[];
    this.players = controlled_players;
    if((this.game as peer_to_peer_game<unknown>).type == peer_connection.child){
      this.player_index = 1;
    }
    this.players[this.player_index].tags.push("local");
  }
  getGame():peer_to_peer_game<{}>{
    return this.game as peer_to_peer_game<{}>;
  }
  send_packet(type:string,data:string,id?:number){
    let g = this.game as peer_to_peer_game<unknown>;
    if(g.type == peer_connection.child){
      g.send_to_host(type,data);
    } else {
        g.send_to_all_peers(type,data);
    }
  }
  registerControls() {
    this.bindControl("Escape",exec_type.once,() => {
      this.objects.forEach((e)=>{
        e.state.position = Vec.scalar_sub(e.state.position,200);
      })
    })
    this.bindControl("mouse0down", exec_type.repeat,() => {
      
      let gun_inst = (this.players[this.player_index].parent.getItemsByTag("gun")[0]) as Gun;
      //this.players[this.player_index].play("explosion", 0.4);
      if(gun_inst){
        let muzzle = rotation_length(30,gun_inst.state.rotation);
        let position = {
          x:gun_inst.state.position.x + muzzle.x,
          y:gun_inst.state.position.y + muzzle.y
        }
        let bullet = new Rocket({
          position:{x:position.x,y:position.y},
          rotation:gun_inst.state.rotation,
        },{owner:this.players[this.player_index].id});
        this.addItem(bullet);
        this.send_packet("rocket",JSON.stringify({
          rotation:bullet.state.rotation,
          position:bullet.state.position,
          owner:this.players[this.player_index].id
        }))
      }
      
    },400)
    
    this.bindControl("KeyA", exec_type.repeat, () => {
      if (this.players[this.player_index].state.velocity.x > -10) {

          this.players[this.player_index].state.velocity.x = this.players[this.player_index].state.velocity.x - 1;
        
        this.send_packet("move","left");
      }
    });
    this.bindControl("KeyA", exec_type.once, () => {
      
        this.players[this.player_index].state.direction = direction.left;
        this.players[this.player_index].state.velocity.x = this.players[this.player_index].state.velocity.x - 0.1;
      
      this.send_packet("initial_move","left");
    });
    this.bindControl("KeyD", exec_type.repeat, () => {
      if (this.players[this.player_index].state.velocity.x < 10) {
        
          this.players[this.player_index].state.velocity.x = this.players[this.player_index].state.velocity.x + 1;
        
        this.send_packet("move","right");
      }
    });
    this.bindControl("KeyD", exec_type.once, () => {
      
        this.players[this.player_index].state.direction = direction.right;
        this.players[this.player_index].state.velocity.x = this.players[this.player_index].state.velocity.x + 0.1;
      
      this.send_packet("initial_move","right");
    });
    
    this.bindControl("Space", exec_type.once, () => {
      if (!this.players[this.player_index].state.jumping) {
        
          this.players[this.player_index].state.velocity.y += 25;
        
        this.players[this.player_index].audio.play("slime", 0.1);
        this.send_packet("jump","");
      }
    });
    
  }
  registerParticles(){
    this.particles["smoke"] = {
      sprite:"./sprites/folder/smoke.png",
      height:64,
      width:64
    };
    this.particles["explosion"] = {
      sprite:"./sprites/folder/explosion.png",
      height:128,
      width:128
    }
  }
  statef(time: number) {
    if (!this.state.paused) {
      for (let a = 0; a < this.objects.length; a++) {
        applyGravity(this.objects[a], -1 * time/16, -15);
      }
      let target = this.cache("target",this.getObjByTag("dummy")[0]) as Goomba;
      let cursor = this.cache("Cursor",this.getObjByTag("Cursor")[0],) as Cursor;
      let cameras = g.state.cameras;
      
      
        cameras[0].state.position.x = this.players[this.player_index].state.position.x;
        cameras[0].state.position.y = this.players[this.player_index].state.position.y + (cameras[0].state.dimensions.height/2 - this.players[this.player_index].height/2);     
      
      
      if (cursor) {
        cursor.collision = false;
        cursor.gravity = false;
        
        let mouse = Poll_Mouse(this.game.state.cameras[0]);
    
          this.players[this.player_index].state.pointing_towards = cursor.state.position;
          this.send_packet("mouse_position",JSON.stringify(cursor.state.position));
        
        if(mouse){
          
          cursor.state.position.x = mouse.x;
          cursor.state.position.y = mouse.y;
        }
      }
      let capture_area = this.cache("capture", this.getObjByTag("capture_area")[0]);
      
      for(let [index,player] of this.players.entries()){
        if(player.collidesWithBox(capture_area.getFullCollisionBox())){
          this.state.player_captures[index] -= time;
        }
      }
      let game = this.game as peer_to_peer_game<{}>;

        if(this.state.state_update_tick_counter == 0){

          let player = this.players[this.player_index]
          this.send_packet("status", JSON.stringify({
            id:player.id,
            player_id:this.player_index,
            capture:this.state.player_captures[this.player_index],
            health:(player.parent as Player).state.health,
            position:player.state.position,
            rotation:player.state.rotation
          }));
          
        
        this.state.state_update_tick_counter += time;
        if(this.state.state_update_tick_counter > 0){
          this.state.state_update_tick_counter = 0;
        }
      }
    }
    
    super.statef(time);
  }

}
