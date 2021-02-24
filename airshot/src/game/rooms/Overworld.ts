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
interface overworld_i {
  player: gravity_obj,
  paused: boolean,
  locked_bullet:bullet
}

class Overworld_HUD extends HUD {
  setTextElements(){
    return [new Text({
      position: {
        x: 10,
        y: GetViewportDimensions().height * 7/8
      },
      size: 44,
      font: "Alata",
      color: "white",
      align:"left",
      scaling:1
    }, () => {
      let x = g.getRoom().getObjByTag("dummy")[0] as Goomba;
      return `Times Airshot:${x.state.times_airshot}`;
    }),
    new Text({
      position: {
        x: 10,
        y: GetViewportDimensions().height * 6/8
      },
      size: 44,
      font: "Alata",
      color: "white",
      align: "left",
      scaling:1
    }, () => {
      let x = g.getRoom().getObjByTag("dummy")[0] as Goomba;
      if(x)
        return `Max Times Airshot:${Math.max(x.state.times_airshot,x.state.max_times_airshot)}`;
      return ""
    })];
  }
}

export class Overworld extends room<overworld_i> implements p2p{
  background_url = "./sprites/imD41l.jpg";
  objects:gravity_obj[];
  proximity_map = new map_matrix(10000,2500)
  players:ControlledPlayer[] = [];
  player_index:number = 0;
  constructor(game:game<unknown>) {
    super(game,json as unknown as state_config);
    
    this.state = {
      player: undefined,
      paused: false,
      locked_bullet:null
    };
    game.state.cameras = [
      new Camera({
        x:0,
        y:0,
        dimensions:{
          height:viewport.height,
          width:viewport.width * 4/5
        },
        scaling:0.5,
        debug:false
      }
      ,{
        x:1,
        y:0,
        width:0.8,
        height:1
      }),
      new Camera({
        x:0,
        y:0,
        dimensions:{
          width:viewport.width/5,
          height:viewport.height
        },
        scaling:0.2,
        debug:false
      },{
        x:viewport.width * 4/5,
        y:0,
        width:0.2,
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
      case "mouse_position":{
        target.state.pointing_towards = JSON.parse(data);
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
  }
  send_packet(type:string,data:string){
    let g = this.game as peer_to_peer_game<unknown>;
    if(g.type == peer_connection.child){
      g.send_to_host(type,data);
    } else {
      g.send_to_all_peers(type,data);
    }
  }
  registerControls() {
    /*
    this.bindControl("mouse0down", exec_type.repeat,() => {
      let gun = this.getObjByTag("gun")[0] as Gun;
      //this.players[this.player_index].play("explosion", 0.4);
      if(gun){
        let muzzle = rotation_length(30,gun.state.rotation);
        let position = {
          x:gun.state.position.x + muzzle.x,
          y:gun.state.position.y + muzzle.y
        }
        let bullets:bullet[] = [];
        for(let a = 0;a < 1;a ++){
          bullets.push(new Rocket({
            position:{x:position.x,y:position.y},
            velocity:{x:0,y:0},
            rotation:gun.state.rotation,
            scaling:{width:1,height:1}
          },{owner:this.players[this.player_index].id}));
        }
        
        if(this.state.locked_bullet == null)
          this.state.locked_bullet = bullets[0];
        this.addItems(bullets);
      }
    },400)
    */
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
    this.bindControl("mouse0down", exec_type.repeat, () => {
      
    }, 400);
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
    /*
    this.bindControl("Space", exec_type.once, () => {
      if (!this.players[this.player_index].state.jumping) {
        this.players[this.player_index].state.velocity.y += 25;
        this.players[this.player_index].audio.play("slime", 0.1);
        this.send_packet("jump","");
      }
    });
    */
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
      let player = this.getObjByTag("player")[0] as Goomba;
      let target = this.getObjByTag("dummy")[0] as Goomba;
      let cursor = this.getObjByTag("Cursor")[0] as Cursor;
      let cameras = g.state.cameras;
      
      if (player) {        
        cameras[0].state.position.x = this.players[this.player_index].state.position.x;
        cameras[0].state.position.y = this.players[this.player_index].state.position.y + (cameras[0].state.dimensions.height/2 - this.players[this.player_index].height/2);     
      }
      
      if(target){
        cameras[1].state.position.x = target.state.position.x;
        cameras[1].state.position.y = target.state.position.y;
      }
      
      if (cursor) {
        cursor.collision = false;
        cursor.gravity = false;
        
        let mouse = Poll_Mouse(this.game.state.cameras[0]);
        if(player){
          this.players[this.player_index].state.pointing_towards = cursor.state.position;
          this.send_packet("mouse_position",JSON.stringify(cursor.state.position));
        }
        if(mouse){
          
          cursor.state.position.x = mouse.x;
          cursor.state.position.y = mouse.y;
        }
      }
      
    }
    super.statef(time);
  }

}
