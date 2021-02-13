
import {composite_obj, obj} from "../../lib/object";
import { obj_state} from "../../lib/state";
import { cooker } from "./abstract/cooker";
import { Pather } from "./Pather";
import { progress_bar } from "./progress_bar";
import {Vector} from "../../lib/state";

interface Worker_state extends obj_state{
  current_task:timed_task,
  task_counter:number,
  work_station:cooker
}
    
interface Worker_parameters{
    
}

interface void_func{
  ():void
}

interface timed_task{
  length:number,
  callback: void_func
}

export class Worker extends composite_obj{
  tags:Array<string> = [];
  state:Worker_state;
  params:Worker_parameters;
  static default_params:Worker_parameters = {}
  constructor(state:obj_state,params:Worker_parameters = Worker.default_params){
    super(state,params);
    Object.assign(this.state,{
      current_task:undefined,
      task_counter:0,
      work_station:undefined
    });
    this.addItem(new Pather(state));
    this.addItem(new progress_bar(state,{
      width:70,
      height:10,
      vert_offset:60
    }))
  }
  setGoal(pos:Vector){
    
    let pather = this.objects[0] as Pather;
    pather.setGoal(pos);
    if(this.state.work_station){
      this.state.work_station.state.pather_id = undefined;
      this.state.work_station.state.in_use = false;
      this.state.work_station = undefined;
      this.setTask(undefined);
    }
  }
  setTask(task:timed_task){
    let prog_bar = this.objects[1] as progress_bar;
    this.state.current_task = task;
    this.state.task_counter = 0;
    prog_bar.state.percentage = 1;
  }
  statef(time_delta:number){
    let prog_bar = this.objects[1] as progress_bar;
    super.statef(time_delta);
    this.state.position = this.objects[0].state.position;
    if(this.state.current_task){
      prog_bar.render = true;
      this.state.task_counter += time_delta;
      prog_bar.state.percentage = 1 - (this.state.task_counter / this.state.current_task.length);
      if(this.state.task_counter >= this.state.current_task.length){
        this.state.current_task.callback();
        this.state.task_counter = 0;
        this.state.current_task = undefined;
        this.state.work_station.state.in_use = false;
        this.state.work_station.state.pather_id = undefined;
        this.state.work_station = undefined;
      }
    }
    else{
      prog_bar.render = false;
    }
  }
}
 