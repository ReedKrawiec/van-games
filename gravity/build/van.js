/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/game/main.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/game/main.ts":
/*!**************************!*\
  !*** ./src/game/main.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.g = void 0;
const van_1 = __webpack_require__(/*! ../van */ "./src/van.ts");
let canvas_element = document.getElementById("target");
window.functions = {
    setTrails: (bool) => {
        let room = exports.g.getRoom();
        room.state.trails_enabled = bool;
    },
    setTrailsLifetime: (n) => {
        let room = exports.g.getRoom();
        room.state.trail_lifetime = n;
    },
    setTrailsInterval: (n) => {
        let room = exports.g.getRoom();
        let objs = room.getObjByTag("mass");
        for (let o of objs) {
            o.state.tick_timer = 0;
        }
        room.state.trail_interval = n;
    }
};
exports.g = new van_1.game(canvas_element.getContext("2d"), {});
exports.g.loadRoomString("simulation");


/***/ }),

/***/ "./src/game/objects/abstract/gravity_mass.ts":
/*!***************************************************!*\
  !*** ./src/game/objects/abstract/gravity_mass.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.gravity_mass = void 0;
const object_1 = __webpack_require__(/*! ../../../lib/object */ "./src/lib/object.ts");
class gravity_mass extends object_1.obj {
    constructor(state, params = gravity_mass.default_params) {
        super(state, params);
        this.render = true;
        this.collision = false;
        this.particle = true;
        this.layer = 2;
        this.forces = {
            x: 0,
            y: 0
        };
        this.tags.push("mass");
        this.state.tick_timer = 0;
    }
    statef(time_delta) {
        let room = this.game.getRoom();
        if (this.state.tick_timer === 0 && room.state.trails_enabled) {
            //let mass_objects = this.game.getRoom().objects.length;
            //let lifetime = Math.max(10,((1 - (mass_objects/50)) * 5000));
            this.emitParticle("tracer", { x: 0, y: 0 }, room.state.trail_lifetime, 0);
        }
        this.state.tick_timer += 1;
        if (this.state.tick_timer === room.state.trail_interval)
            this.state.tick_timer = 0;
        this.forces.x = 0;
        this.forces.y = 0;
        for (let a of room.objects.filter((o) => o.id != this.id)) {
            let dist = Math.max(this.distance(a), 0.0001);
            let force = room.grav_const * (this.params.mass / room.div_const * a.params.mass / room.div_const) / dist;
            let angled_force = object_1.rotation_length(force, this.angleTowards(a));
            this.forces.x += angled_force.x;
            this.forces.y += angled_force.y;
        }
        this.state.velocity.x += (this.forces.x / this.params.mass) * time_delta / 16.66;
        this.state.velocity.y += (this.forces.y / this.params.mass) * time_delta / 16.66;
    }
    renderf(time_delta) {
        return super.renderf(time_delta);
    }
    register_animations() {
    }
    register_audio() {
    }
    register_controls() {
    }
}
exports.gravity_mass = gravity_mass;
gravity_mass.default_params = {
    mass: 1
};


/***/ }),

/***/ "./src/game/objects/placeholder.ts":
/*!*****************************************!*\
  !*** ./src/game/objects/placeholder.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.placeholder = void 0;
const object_1 = __webpack_require__(/*! ../../lib/object */ "./src/lib/object.ts");
class placeholder extends object_1.obj {
    constructor(state, params = placeholder.default_params) {
        super(state, params);
        this.sprite_url = "./sprites/Error.png";
        this.height = 100;
        this.width = 100;
        this.tags = [];
        this.collision = true;
        this.render = true;
    }
    statef(time_delta) {
    }
    renderf(time_delta) {
        return super.renderf(time_delta);
    }
    register_animations() {
    }
    register_audio() {
    }
    register_controls() {
    }
}
exports.placeholder = placeholder;
placeholder.default_params = {};


/***/ }),

/***/ "./src/game/objects/planet.ts":
/*!************************************!*\
  !*** ./src/game/objects/planet.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.planet = void 0;
const gravity_mass_1 = __webpack_require__(/*! ./abstract/gravity_mass */ "./src/game/objects/abstract/gravity_mass.ts");
class planet extends gravity_mass_1.gravity_mass {
    constructor(state, params = planet.default_params) {
        super(state, params);
        this.sprite_url = "./sprites/planet.png";
        this.height = 200;
        this.width = 200;
    }
    statef(time_delta) {
        super.statef(time_delta);
    }
    renderf(time_delta) {
        return super.renderf(time_delta);
    }
    register_animations() {
    }
    register_audio() {
    }
    register_controls() {
    }
}
exports.planet = planet;
planet.default_params = {
    mass: 5.97 * Math.pow(10, 24)
};


/***/ }),

/***/ "./src/game/objects/prefabs.ts":
/*!*************************************!*\
  !*** ./src/game/objects/prefabs.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.prefabs = void 0;
const placeholder_1 = __webpack_require__(/*! ./placeholder */ "./src/game/objects/placeholder.ts");
const planet_1 = __webpack_require__(/*! ./planet */ "./src/game/objects/planet.ts");
const sun_1 = __webpack_require__(/*! ./sun */ "./src/game/objects/sun.ts");
exports.prefabs = {
    placeholder: placeholder_1.placeholder,
    planet: planet_1.planet,
    sun: sun_1.sun,
};


/***/ }),

/***/ "./src/game/objects/sun.ts":
/*!*********************************!*\
  !*** ./src/game/objects/sun.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sun = void 0;
const gravity_mass_1 = __webpack_require__(/*! ./abstract/gravity_mass */ "./src/game/objects/abstract/gravity_mass.ts");
class sun extends gravity_mass_1.gravity_mass {
    constructor(state, params = sun.default_params) {
        super(state, params);
        this.sprite_url = "./sprites/sun.png";
        this.height = 200;
        this.width = 200;
        this.tags.push("sun");
    }
    statef(time_delta) {
        super.statef(time_delta);
    }
    renderf(time_delta) {
        return super.renderf(time_delta);
    }
    register_animations() {
    }
    register_audio() {
    }
    register_controls() {
    }
}
exports.sun = sun;
sun.default_params = {
    mass: 1.989 * Math.pow(10, 30)
};


/***/ }),

/***/ "./src/game/rooms/placeholder.json":
/*!*****************************************!*\
  !*** ./src/game/rooms/placeholder.json ***!
  \*****************************************/
/*! exports provided: objects, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"objects\":[]}");

/***/ }),

/***/ "./src/game/rooms/placeholder.ts":
/*!***************************************!*\
  !*** ./src/game/rooms/placeholder.ts ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.placeholder = void 0;
const room_1 = __webpack_require__(/*! ../../lib/room */ "./src/lib/room.ts");
const van_1 = __webpack_require__(/*! ../../van */ "./src/van.ts");
const config = __webpack_require__(/*! ./placeholder.json */ "./src/game/rooms/placeholder.json");
const render_1 = __webpack_require__(/*! ../../lib/render */ "./src/lib/render.ts");
let cfig = config;
class placeholder extends room_1.room {
    constructor(game) {
        super(game, cfig);
        this.background_url = "./sprites/Error.png";
        this.game.state.cameras.push(new render_1.Camera({
            x: 0,
            y: 0,
            dimensions: van_1.viewport,
            scaling: 1,
            debug: false
        }, {
            x: 0,
            y: 0,
            height: 1,
            width: 1
        }));
    }
    registerControls() {
    }
    registerParticles() {
    }
    statef(delta_time) {
        super.statef(delta_time);
    }
}
exports.placeholder = placeholder;


/***/ }),

/***/ "./src/game/rooms/rooms.ts":
/*!*********************************!*\
  !*** ./src/game/rooms/rooms.ts ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.rooms = void 0;
const placeholder_1 = __webpack_require__(/*! ./placeholder */ "./src/game/rooms/placeholder.ts");
const simulation_1 = __webpack_require__(/*! ./simulation */ "./src/game/rooms/simulation.ts");
exports.rooms = {
    placeholder: placeholder_1.placeholder,
    simulation: simulation_1.simulation,
};


/***/ }),

/***/ "./src/game/rooms/simulation.json":
/*!****************************************!*\
  !*** ./src/game/rooms/simulation.json ***!
  \****************************************/
/*! exports provided: objects, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"objects\":[{\"type\":\"sun\",\"state\":{\"position\":{\"x\":0.0024989290812856553,\"y\":0.0011795457981336153},\"velocity\":{\"x\":0.000016971113242088362,\"y\":0.000018071585846805204},\"rotation\":0,\"scaling\":{\"width\":2,\"height\":2},\"tick_timer\":1},\"parameters\":{\"mass\":1.9890000000000002e+30}},{\"type\":\"planet\",\"state\":{\"position\":{\"x\":2413.062366988216,\"y\":4398.44853717278},\"velocity\":{\"x\":-6.712805674472829,\"y\":15.446791086756889},\"rotation\":0,\"scaling\":{\"width\":1,\"height\":1},\"tick_timer\":0},\"parameters\":{\"mass\":5.969999999999999e+24}},{\"type\":\"planet\",\"state\":{\"position\":{\"x\":-3707.7988046356927,\"y\":3118.510152834376},\"velocity\":{\"x\":5.0426390830679875,\"y\":18.090111041500688},\"rotation\":0,\"scaling\":{\"width\":1,\"height\":1},\"tick_timer\":1},\"parameters\":{\"mass\":5.969999999999999e+24}},{\"type\":\"planet\",\"state\":{\"position\":{\"x\":1470.3471608519135,\"y\":1106.7632208520083},\"velocity\":{\"x\":-9.163731741285156,\"y\":20.57878459755152},\"rotation\":0,\"scaling\":{\"width\":1,\"height\":1},\"tick_timer\":1},\"parameters\":{\"mass\":5.969999999999999e+24}},{\"type\":\"planet\",\"state\":{\"position\":{\"x\":-2128.3785850163054,\"y\":-725.0137689803588},\"velocity\":{\"x\":5.181066861763641,\"y\":-20.223667430264612},\"rotation\":0,\"scaling\":{\"width\":1,\"height\":1},\"tick_timer\":0},\"parameters\":{\"mass\":5.969999999999999e+24}}]}");

/***/ }),

/***/ "./src/game/rooms/simulation.ts":
/*!**************************************!*\
  !*** ./src/game/rooms/simulation.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.simulation = void 0;
const room_1 = __webpack_require__(/*! ../../lib/room */ "./src/lib/room.ts");
const van_1 = __webpack_require__(/*! ../../van */ "./src/van.ts");
const render_1 = __webpack_require__(/*! ../../lib/render */ "./src/lib/render.ts");
const config = __webpack_require__(/*! ./simulation.json */ "./src/game/rooms/simulation.json");
const controls_1 = __webpack_require__(/*! ../../lib/controls */ "./src/lib/controls.ts");
const planet_1 = __webpack_require__(/*! ../objects/planet */ "./src/game/objects/planet.ts");
const sun_1 = __webpack_require__(/*! ../objects/sun */ "./src/game/objects/sun.ts");
const math_1 = __webpack_require__(/*! ../../lib/math */ "./src/lib/math.ts");
const hud_1 = __webpack_require__(/*! ../../lib/hud */ "./src/lib/hud.ts");
const main_1 = __webpack_require__(/*! ../main */ "./src/game/main.ts");
let cfig = config;
class sim_hud extends hud_1.HUD {
    setTextElements() {
        return [
            new hud_1.Text({
                position: {
                    x: 10,
                    y: van_1.viewport.height - 30
                },
                size: 15,
                font: "Alata",
                color: "white",
                align: "left",
                scaling: 1
            }, () => {
                return `Right click to spawn a sun`;
            }),
            new hud_1.Text({
                position: {
                    x: 10,
                    y: van_1.viewport.height - 50
                },
                size: 15,
                font: "Alata",
                color: "white",
                align: "left",
                scaling: 1
            }, () => {
                return `Left click to spawn a planet`;
            }),
            new hud_1.Text({
                position: {
                    x: 10,
                    y: van_1.viewport.height - 70
                },
                size: 15,
                font: "Alata",
                color: "white",
                align: "left",
                scaling: 1
            }, () => {
                return `Middle click to spawn a large sun`;
            }),
            new hud_1.Text({
                position: {
                    x: 10,
                    y: van_1.viewport.height - 90
                },
                size: 15,
                font: "Alata",
                color: "white",
                align: "left",
                scaling: 1
            }, () => {
                return `Number of objects:${main_1.g.getRoom().objects.length}`;
            })
        ];
    }
}
class simulation extends room_1.room {
    constructor(game) {
        super(game, cfig);
        this.render = false;
        this.background_url = "sprites/Error.png";
        this.grav_const = 6.67 * Math.pow(10, -11);
        this.div_const = 1000000000;
        this.state = {
            bound_mass: undefined,
            trail_interval: 2,
            trail_lifetime: 3000,
            trails_enabled: true
        };
        this.game.state.cameras.push(new render_1.Camera({
            x: 0,
            y: 0,
            dimensions: van_1.viewport,
            scaling: 0.05,
            debug: false
        }, {
            x: 0,
            y: 0,
            height: 1,
            width: 1
        }, new sim_hud()));
    }
    closestSun(pos) {
        let closest = undefined;
        let closest_dist = Number.MAX_SAFE_INTEGER;
        let suns = this.getObjByTag("sun");
        for (let s of suns) {
            let d = math_1.Distance(s.state.position, pos);
            if (d < closest_dist) {
                closest = s;
                closest_dist = d;
            }
        }
        return closest;
    }
    registerControls() {
        this.bindControl("KeyA", controls_1.exec_type.repeat, () => {
            let shift_held = controls_1.held_keys["ShiftLeft"] ? 1 : 0;
            let cam = this.game.state.cameras[0];
            cam.state.position.x = cam.state.position.x - ((5 + shift_held * 5) * (1 / cam.state.scaling));
        });
        this.bindControl("KeyD", controls_1.exec_type.repeat, () => {
            let shift_held = controls_1.held_keys["ShiftLeft"] ? 1 : 0;
            let cam = this.game.state.cameras[0];
            cam.state.position.x = cam.state.position.x + ((5 + shift_held * 5) * (1 / cam.state.scaling));
        });
        this.bindControl("KeyW", controls_1.exec_type.repeat, () => {
            let shift_held = controls_1.held_keys["ShiftLeft"] ? 1 : 0;
            let cam = this.game.state.cameras[0];
            cam.state.position.y = cam.state.position.y + ((5 + shift_held * 5) * (1 / cam.state.scaling));
        });
        this.bindControl("KeyS", controls_1.exec_type.repeat, () => {
            let shift_held = controls_1.held_keys["ShiftLeft"] ? 1 : 0;
            let cam = this.game.state.cameras[0];
            cam.state.position.y = cam.state.position.y - ((5 + shift_held * 5) * (1 / cam.state.scaling));
        });
        this.bindControl("mouse0up", controls_1.exec_type.once, () => {
            let mouse = controls_1.Poll_Mouse(this.game.state.cameras[0]);
            let objs = this.checkObjectsPointInclusive(mouse, ["mass"]);
            if (objs[0]) {
                if (this.state.bound_mass && objs[0].id === this.state.bound_mass.id) {
                    this.state.bound_mass = undefined;
                }
                else {
                    this.state.bound_mass = objs[0];
                }
            }
            else {
                let closest_sun = this.closestSun(mouse);
                let velocity = { x: 0, y: -20 };
                if (closest_sun.state.position.y > mouse.y)
                    velocity.y = 20;
                this.addItem(new planet_1.planet({
                    position: mouse,
                    velocity,
                    rotation: 0,
                    scaling: { width: 1, height: 1 }
                }));
            }
        });
        this.bindControl("mouse2up", controls_1.exec_type.once, () => {
            let mouse = controls_1.Poll_Mouse(this.game.state.cameras[0]);
            let closest_sun = this.closestSun(mouse);
            let velocity = { x: 0, y: -6 };
            if (closest_sun.state.position.y > mouse.y)
                velocity.y = 6;
            this.addItem(new sun_1.sun({
                position: mouse,
                velocity,
                rotation: 0,
                scaling: { width: 2, height: 2 }
            }));
        });
        this.bindControl("mouse1up", controls_1.exec_type.once, () => {
            let mouse = controls_1.Poll_Mouse(this.game.state.cameras[0]);
            let closest_sun = this.closestSun(mouse);
            let velocity = { x: 0, y: -6 };
            if (closest_sun.state.position.y > mouse.y)
                velocity.y = 6;
            this.addItem(new sun_1.sun({
                position: mouse,
                velocity,
                rotation: 0,
                scaling: { width: 5, height: 5 }
            }, {
                mass: 1.989 * Math.pow(10, 32)
            }));
        });
        this.bindControl("scrollup", controls_1.exec_type.once, () => {
            let cam = this.game.state.cameras[0];
            cam.state.scaling += 0.05;
            if (cam.state.scaling > 1)
                cam.state.scaling = 1;
        });
        this.bindControl("scrolldown", controls_1.exec_type.once, () => {
            let cam = this.game.state.cameras[0];
            if (cam.state.scaling > 0.01) {
                cam.state.scaling -= 0.01;
            }
        });
    }
    registerParticles() {
        this.particles["tracer"] = {
            sprite: "./sprites/tracer.png",
            width: 50,
            height: 50
        };
    }
    statef(delta_time) {
        super.statef(delta_time);
        if (this.state.bound_mass) {
            let cam = this.game.state.cameras[0];
            cam.state.position.y = this.state.bound_mass.state.position.y;
            cam.state.position.x = this.state.bound_mass.state.position.x;
        }
    }
}
exports.simulation = simulation;


/***/ }),

/***/ "./src/lib/audio.ts":
/*!**************************!*\
  !*** ./src/lib/audio.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.audio = void 0;
const debug_1 = __webpack_require__(/*! ./debug */ "./src/lib/debug.ts");
const van_1 = __webpack_require__(/*! ../van */ "./src/van.ts");
class audio {
    constructor() {
        this.sounds = {};
    }
    add(name, url) {
        let p = url;
        if (van_1.DEBUG) {
            p = debug_1.path.join(debug_1.root_path, url);
        }
        this.sounds[name] = new Audio(p);
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            let keys = Object.keys(this.sounds);
            let promises = keys.map((key) => {
                return new Promise((resolve, reject) => {
                    this.sounds[key].addEventListener("canplaythrough", (e) => {
                        resolve();
                    });
                });
            });
            try {
                let x = yield Promise.all(promises);
                return (x);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    play(name, volume) {
        let a = this.sounds[name];
        a.pause();
        a.currentTime = 0;
        a.volume = volume;
        a.play();
    }
}
exports.audio = audio;


/***/ }),

/***/ "./src/lib/collision.ts":
/*!******************************!*\
  !*** ./src/lib/collision.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.velocityCollisionCheck = exports.check_collisions = exports.check_all_collisions = exports.check_all_objects = exports.getEncompassingBox = void 0;
const object_1 = __webpack_require__(/*! ../lib/object */ "./src/lib/object.ts");
var direction;
(function (direction) {
    direction[direction["left"] = 0] = "left";
    direction[direction["right"] = 1] = "right";
    direction[direction["up"] = 2] = "up";
    direction[direction["down"] = 3] = "down";
})(direction || (direction = {}));
function getEncompassingBox(objects) {
    let first_object = objects[0].getBoundingBox();
    let max_y = first_object.top_right.y;
    let max_x = first_object.top_right.x;
    let min_y = first_object.bottom_left.y;
    let min_x = first_object.bottom_left.x;
    for (let a = 1; a < objects.length; a++) {
        let object = objects[a].getBoundingBox();
        if (object.top_right.y > max_y)
            max_y = object.top_right.y;
        if (object.top_right.x > max_x)
            max_x = object.top_right.x;
        if (object.bottom_left.y < min_y)
            min_y = object.bottom_left.y;
        if (object.bottom_left.x < min_x)
            min_x = object.bottom_left.x;
    }
    return {
        x: min_x + (max_x - min_x) / 2,
        y: min_y + (max_y - min_y) / 2,
        height: max_y - min_y,
        width: max_x - min_x
    };
}
exports.getEncompassingBox = getEncompassingBox;
function check_all_objects(c, objs, exemption = []) {
    return objs.filter((a) => (!exemption.some((b) => a.tags.indexOf(b) !== -1) && a.collidesWithBox(c)));
}
exports.check_all_objects = check_all_objects;
function check_all_collisions(c, objs, exemption = []) {
    let matched = [];
    for (let a of objs) {
        if (!exemption.some((b) => a.tags.indexOf(b) !== -1) && a.collision && a.collidesWithBox(c)) {
            matched.push(a);
        }
    }
    return matched;
}
exports.check_all_collisions = check_all_collisions;
//Checks up to the first collision
function check_collisions(c, objs, exemption) {
    for (let a of objs) {
        if (a.id !== exemption && a.collision && a.collidesWithBox(c)) {
            return a;
        }
    }
    return null;
}
exports.check_collisions = check_collisions;
function velocity_max(velocity, box, objs, exemption, dir) {
    let collision = check_collisions(box, objs, exemption);
    if (collision == null) {
        return velocity;
    }
    else {
        let collider = collision;
        let origin = object_1.getId(objs, exemption);
        let orig_st = origin.state;
        let collider_st = collider.state;
        let orig_col = origin.getFullCollisionBox();
        let collider_col = collider.getFullCollisionBox();
        if (dir == direction.left) {
            return (orig_col.x - orig_col.width / 2) - (collider_col.x + collider_col.width / 2);
        }
        else if (dir == direction.right) {
            return (collider_col.x - collider_col.width / 2) - (orig_col.x + orig_col.width / 2);
        }
        else if (dir == direction.down) {
            return (orig_col.y - orig_col.height / 2) - (collider_col.y + collider_col.height / 2);
        }
        else if (dir == direction.up) {
            return (collider_col.y - collider_col.height / 2) - (orig_col.y + orig_col.height / 2);
        }
    }
}
function velocityCollisionCheck(object, list) {
    list = [...list];
    let ob = object;
    let st = object.state;
    let x_vel = st.velocity.x;
    let y_vel = st.velocity.y;
    if (!ob.collision) {
        ob.state.position.x += ob.state.velocity.x;
        ob.state.position.y += ob.state.velocity.y;
        return;
    }
    let col_box = ob.getFullCollisionBox();
    if (x_vel > 0) {
        let box = {
            x: col_box.x + col_box.width / 2 + x_vel / 2,
            y: col_box.y,
            width: x_vel,
            height: col_box.height
        };
        let vel = velocity_max(st.velocity.x, box, list, ob.id, direction.right);
        if (vel > 0) {
            st.position.x += vel;
        }
        else {
            st.velocity.x = 0;
        }
    }
    else if (x_vel < 0) {
        let box = {
            x: x_vel / 2 + col_box.x - col_box.width / 2,
            y: col_box.y,
            width: -1 * x_vel,
            height: col_box.height
        };
        let vel = velocity_max(st.velocity.x, box, list, ob.id, direction.left);
        if (vel < 0) {
            st.position.x += vel;
        }
        else {
            st.velocity.x = 0;
        }
    }
    if (y_vel > 0) {
        let box = {
            x: col_box.x,
            y: col_box.y + col_box.height / 2 + y_vel / 2,
            width: col_box.width,
            height: y_vel
        };
        let vel = velocity_max(st.velocity.y, box, list, ob.id, direction.up);
        if (vel > 0) {
            st.position.y += vel;
        }
        else {
            st.velocity.y = 0;
        }
    }
    else if (y_vel < 0) {
        let box = {
            x: col_box.x,
            y: y_vel / 2 + col_box.y - col_box.height / 2,
            width: col_box.width,
            height: -1 * y_vel
        };
        let vel = velocity_max(st.velocity.y, box, list, ob.id, direction.down);
        if (vel < 0) {
            st.position.y += vel;
        }
        else {
            st.velocity.y = 0;
        }
    }
}
exports.velocityCollisionCheck = velocityCollisionCheck;


/***/ }),

/***/ "./src/lib/controls.ts":
/*!*****************************!*\
  !*** ./src/lib/controls.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Bind = exports.exec_type = exports.Unbind = exports.ExecuteRepeatBinds = exports.Poll_Mouse = exports.debug_binds = exports.btype = exports.held_keys = exports.init_click_handler = void 0;
const main_1 = __webpack_require__(/*! ../game/main */ "./src/game/main.ts");
const van_1 = __webpack_require__(/*! ../van */ "./src/van.ts");
const debug_1 = __webpack_require__(/*! ./debug */ "./src/lib/debug.ts");
let target = document.getElementById("target");
function init_click_handler(game) {
    window.addEventListener("click", (e) => {
        let mouse = Poll_Mouse(game.state.cameras[0]);
        if (!mouse) {
            return;
        }
        let box = {
            x: mouse.x,
            y: mouse.y,
            height: 1,
            width: 1
        };
        let d;
        if (van_1.DEBUG) {
            if (debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "debug_target") {
                d = [...exports.debug_binds];
            }
            else if (!van_1.PAUSED && debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "target") {
                d = [...all_binds];
            }
            else {
                d = [];
            }
        }
        else {
            d = [...all_binds];
        }
        for (let a = 0; a < d.length; a++) {
            let selected = d[a];
            if (selected.type === btype.mouse && selected.key === "mouse1" && selected.execute == exec_type.once) {
                if (selected.obj !== undefined) {
                    if (selected.obj.collidesWithBox(box)) {
                        selected.function();
                    }
                }
                else {
                    selected.function();
                }
            }
        }
    });
}
exports.init_click_handler = init_click_handler;
window.addEventListener("mousedown", (e) => {
    e.preventDefault();
    let d;
    if (van_1.DEBUG) {
        if (debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "debug_target") {
            d = [...exports.debug_binds];
        }
        else if (!van_1.PAUSED && debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "target") {
            d = [...all_binds];
        }
        else {
            d = [];
        }
    }
    else {
        d = [...all_binds];
    }
    for (let a = 0; a < d.length; a++) {
        let selected = d[a];
        if (selected.type === btype.mouse && selected.key === ("mouse" + e.button + "down") && !selected.executed) {
            if (selected.execute === exec_type.once) {
                selected.function();
            }
            else if (selected.execute === exec_type.repeat) {
                selected.repeat_timer.active = true;
            }
            selected.executed = true;
        }
        if (selected.type === btype.mouse && (selected.key === ("mouse" + e.button + "up") || selected.key == "mouseup") && selected.executed && selected.execute === exec_type.once) {
            selected.executed = false;
        }
        else if (selected.type === btype.mouse && (selected.key === ("mouse" + e.button + "up") || selected.key == "mouseup") && selected.executed && selected.execute === exec_type.repeat) {
            let g = [...repeat_binds];
            for (let a = 0; a < g.length; a++) {
                if (g[a].bind.id === selected.id) {
                    selected.executed = false;
                    g[a].active = false;
                    break;
                }
            }
        }
    }
});
window.addEventListener("mouseup", (e) => {
    e.preventDefault();
    let d;
    if (van_1.DEBUG) {
        if (debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "debug_target") {
            d = [...exports.debug_binds];
        }
        else if (!van_1.PAUSED && debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "target") {
            d = [...all_binds];
        }
        else {
            d = [];
        }
    }
    else {
        d = [...all_binds];
    }
    for (let a = 0; a < d.length; a++) {
        let selected = d[a];
        if (selected.type === btype.mouse && selected.key === ("mouse" + e.button + "up") && !selected.executed) {
            if (selected.execute === exec_type.once) {
                selected.function();
            }
            else if (selected.execute === exec_type.repeat) {
                selected.repeat_timer.active = true;
            }
            selected.executed = true;
        }
        if (selected.type === btype.mouse && (selected.key === ("mouse" + e.button + "down") || selected.key == "mousedown") && selected.executed && selected.execute === exec_type.once) {
            selected.executed = false;
        }
        else if (selected.type === btype.mouse && (selected.key === ("mouse" + e.button + "down") || selected.key == "mousedown") && selected.executed && selected.execute === exec_type.repeat) {
            let g = [...repeat_binds];
            for (let a = 0; a < g.length; a++) {
                if (g[a].bind.id === selected.id) {
                    selected.executed = false;
                    g[a].active = false;
                    break;
                }
            }
        }
    }
});
exports.held_keys = {};
window.addEventListener("wheel", (e) => {
    let code;
    if (e.deltaY < 0) {
        code = "scrollup";
    }
    else if (e.deltaY > 0) {
        code = "scrolldown";
    }
    let d;
    if (van_1.DEBUG) {
        if (debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "debug_target") {
            d = [...exports.debug_binds];
        }
        else if (!van_1.PAUSED && debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "target") {
            d = [...all_binds];
        }
        else {
            d = [];
        }
    }
    else {
        d = [...all_binds];
    }
    for (let a = 0; a < d.length; a++) {
        let selected = d[a];
        if (selected.type === btype.mouse && selected.key === code) {
            if (selected.execute === exec_type.once) {
                selected.function();
            }
        }
    }
});
window.addEventListener("keydown", (e) => {
    exports.held_keys[e.code] = true;
    let d;
    if (van_1.DEBUG) {
        if (debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "debug_target") {
            d = [...exports.debug_binds];
        }
        else if (!van_1.PAUSED && debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "target") {
            d = [...all_binds];
        }
        else {
            d = [];
        }
    }
    else {
        d = [...all_binds];
    }
    for (let a = 0; a < d.length; a++) {
        let selected = d[a];
        if (selected.type === btype.keyboard && selected.key === e.code && !selected.executed) {
            if (selected.execute === exec_type.once) {
                selected.function();
            }
            else if (selected.execute === exec_type.repeat) {
                for (let c of repeat_binds) {
                    if (c.bind.id == selected.id) {
                        c.active = true;
                        break;
                    }
                }
            }
            selected.executed = true;
        }
    }
});
window.addEventListener("keyup", (e) => {
    exports.held_keys[e.code] = false;
    let d;
    if (van_1.DEBUG) {
        if (debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "debug_target") {
            d = [...exports.debug_binds];
        }
        else if (!van_1.PAUSED && debug_1.debug_state.last_clicked && debug_1.debug_state.last_clicked.id == "target") {
            d = [...all_binds];
        }
        else {
            d = [];
        }
    }
    else {
        d = [...all_binds];
    }
    for (let a = 0; a < d.length; a++) {
        let selected = d[a];
        if (selected.type === btype.keyboard && selected.key === e.code && selected.executed) {
            if (selected.execute === exec_type.once) {
                selected.executed = false;
            }
            else if (selected.execute === exec_type.repeat) {
                let g = [...repeat_binds];
                for (let a = 0; a < g.length; a++) {
                    if (g[a].bind.id === selected.id) {
                        selected.executed = false;
                        g[a].active = false;
                        break;
                    }
                }
            }
        }
    }
});
let tracker = document.getElementById("target");
window.addEventListener("mousemove", (e) => {
    var rect = e.target.getBoundingClientRect();
    //console.log(e.target)
    last_x = x;
    last_y = y;
    x = e.clientX; //x position within the element.
    y = e.clientY; //y position within the element.
});
var btype;
(function (btype) {
    btype[btype["mouse"] = 0] = "mouse";
    btype[btype["keyboard"] = 1] = "keyboard";
})(btype = exports.btype || (exports.btype = {}));
let x = 0;
let y = 0;
let last_x = 0;
let last_y = 0;
let binds = {};
exports.debug_binds = [];
let mouseBinds = {};
let bind_count = 0;
let all_binds = [];
let repeat_binds = [];
function Poll_Mouse(camera, canvas = main_1.g.state.canvas) {
    let height = van_1.GetViewportDimensions().height;
    let wratio = parseFloat(window.getComputedStyle(canvas).width) / van_1.GetViewportDimensions().width;
    let vratio = parseFloat(window.getComputedStyle(canvas).height) / van_1.GetViewportDimensions().height;
    let bounds = canvas.getBoundingClientRect();
    if (x > bounds.left && x < bounds.right && y < bounds.bottom && y > bounds.top) {
        return ({
            x: ((x - bounds.left - camera.state.viewport.x) / wratio / camera.state.scaling + camera.state.position.x - camera.state.dimensions.width / camera.state.scaling / 2),
            y: ((height - (y - bounds.top) / vratio) / camera.state.scaling + camera.state.position.y - camera.state.dimensions.height / camera.state.scaling / 2 - camera.state.viewport.y)
        });
    }
    return undefined;
}
exports.Poll_Mouse = Poll_Mouse;
function ExecuteRepeatBinds(b) {
    for (let a of repeat_binds) {
        if (a.bind.execute === exec_type.repeat && a.timer == 0 && a.active) {
            a.bind.function();
        }
        if (a.active || (!a.active && a.timer != 0))
            a.timer += b;
        if (a.timer > a.interval) {
            a.timer = 0;
        }
    }
}
exports.ExecuteRepeatBinds = ExecuteRepeatBinds;
function Unbind(bind_id) {
    for (let a = 0; a < all_binds.length; a++) {
        if (all_binds[a].id == bind_id) {
            all_binds.splice(a, 1);
            break;
        }
    }
    for (let a = 0; a < repeat_binds.length; a++) {
        if (repeat_binds[a].bind.id == bind_id) {
            repeat_binds.splice(a, 1);
            break;
        }
    }
}
exports.Unbind = Unbind;
var exec_type;
(function (exec_type) {
    exec_type[exec_type["once"] = 0] = "once";
    exec_type[exec_type["repeat"] = 1] = "repeat";
})(exec_type = exports.exec_type || (exports.exec_type = {}));
let id = 0;
function Bind(keyname, func, type, interval, object) {
    if (keyname.slice(0, 5) === "mouse" || keyname.slice(0, 6) === "scroll") {
        let b = {
            key: keyname,
            type: btype.mouse,
            id,
            function: func,
            obj: object,
            execute: type,
            executed: false,
            interval
        };
        if (type == exec_type.repeat) {
            b.repeat_timer = {
                bind: b,
                timer: 0,
                interval,
                active: false
            };
            repeat_binds.push(b.repeat_timer);
        }
        all_binds.push(b);
    }
    else {
        let b = {
            key: keyname,
            type: btype.keyboard,
            id,
            function: func,
            execute: type,
            executed: false,
            interval
        };
        if (type == exec_type.repeat) {
            b.repeat_timer = {
                bind: b,
                timer: 0,
                interval,
                active: false
            };
            repeat_binds.push(b.repeat_timer);
        }
        all_binds.push(b);
    }
    id++;
    return id - 1;
}
exports.Bind = Bind;


/***/ }),

/***/ "./src/lib/debug.ts":
/*!**************************!*\
  !*** ./src/lib/debug.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.debug_setup = exports.debug_state = exports.debug_update_prefabs = exports.debug_update_obj_list = exports.debug_update_properties_element = exports.debug_update_room_list = exports.debug_statef = exports.Debug_hud = exports.root_path = exports.project_path = exports.path = void 0;
const van_1 = __webpack_require__(/*! ../van */ "./src/van.ts");
let fs;
let ipcRenderer;
const prefabs_1 = __webpack_require__(/*! ../game/objects/prefabs */ "./src/game/objects/prefabs.ts");
exports.project_path = "";
exports.root_path = "";
if (van_1.DEBUG) {
    exports.path = window.require("path");
    fs = window.require("fs");
    ipcRenderer = window.require("electron").ipcRenderer;
    exports.project_path = ipcRenderer.sendSync('path-request', 'ping')[0];
    exports.root_path = exports.path.join(exports.project_path, "..");
}
const object_template_1 = __webpack_require__(/*! ./templates/object_template */ "./src/lib/templates/object_template.ts");
const room_template_1 = __webpack_require__(/*! ./templates/room_template */ "./src/lib/templates/room_template.ts");
const main_1 = __webpack_require__(/*! ../game/main */ "./src/game/main.ts");
const rooms_1 = __webpack_require__(/*! ../game/rooms/rooms */ "./src/game/rooms/rooms.ts");
const controls_1 = __webpack_require__(/*! ../lib/controls */ "./src/lib/controls.ts");
const hud_1 = __webpack_require__(/*! ../lib/hud */ "./src/lib/hud.ts");
const render_1 = __webpack_require__(/*! ../lib/render */ "./src/lib/render.ts");
class Debug_hud extends hud_1.HUD {
    setTextElements() {
        return [
            new hud_1.Text({
                position: {
                    x: 10,
                    y: van_1.viewport.height - 24
                },
                size: 22,
                font: "Alata",
                color: "white",
                align: "left",
                scaling: 1
            }, () => exports.debug_state.render_delta_time > 0 ? Math.round(1000 / exports.debug_state.render_delta_time) + "" : ""),
            new hud_1.Text({
                position: {
                    x: 10,
                    y: 10
                },
                size: 22,
                font: "Alata",
                color: "white",
                align: "left",
                scaling: 1
            }, () => `X:${exports.debug_state.camera.state.position.x.toFixed(0)}`),
            new hud_1.Text({
                position: {
                    x: 10,
                    y: 32
                },
                size: 22,
                font: "Alata",
                color: "white",
                align: "left",
                scaling: 1
            }, () => `Y:${exports.debug_state.camera.state.position.y.toFixed(0)}`),
            new hud_1.Text({
                position: {
                    x: van_1.viewport.width - 10,
                    y: 32
                },
                size: 22,
                font: "Alata",
                color: "white",
                align: "right",
                scaling: 1
            }, () => {
                let mouse = controls_1.Poll_Mouse(exports.debug_state.camera, exports.debug_state.target);
                if (mouse) {
                    return `${mouse.x.toFixed(0)}:X`;
                }
                return `:X`;
            }),
            new hud_1.Text({
                position: {
                    x: van_1.viewport.width - 10,
                    y: 10
                },
                size: 22,
                font: "Alata",
                color: "white",
                align: "right",
                scaling: 1
            }, () => {
                let mouse = controls_1.Poll_Mouse(exports.debug_state.camera, exports.debug_state.target);
                if (mouse) {
                    return `${mouse.y.toFixed(0)}:Y`;
                }
                return `:Y`;
            }),
        ];
    }
}
exports.Debug_hud = Debug_hud;
function debug_statef(t) {
    let mouse = controls_1.Poll_Mouse(exports.debug_state.camera, exports.debug_state.target);
    if (exports.debug_state.camera.hud) {
        exports.debug_state.camera.hud.statef(t);
    }
    if (!van_1.PAUSED) {
        debug_update_properties_element();
    }
    if (mouse) {
        if (exports.debug_state.selected_element) {
            if (van_1.PAUSED && controls_1.held_keys["ControlLeft"] && exports.debug_state.current_action.property == "scaling") {
                let dist = {
                    x: Math.abs(mouse.x - exports.debug_state.selected_element.state.position.x),
                    y: Math.abs(mouse.y - exports.debug_state.selected_element.state.position.y)
                };
                exports.debug_state.selected_element.state.scaling.width = (2 * dist.x) / exports.debug_state.selected_element.width;
                exports.debug_state.selected_element.state.scaling.height = (2 * dist.y) / exports.debug_state.selected_element.height;
            }
            else {
                let st = exports.debug_state.selected_element.state;
                st.position.x = mouse.x - exports.debug_state.selected_element_offset.x,
                    st.position.y = mouse.y - exports.debug_state.selected_element_offset.y;
            }
        }
        if (van_1.PAUSED && exports.debug_state.rotation_element) {
            exports.debug_state.rotation_element.state.rotation = exports.debug_state.rotation_element.angleTowardsPoint(mouse);
        }
        if (exports.debug_state.middle_position) {
            let diff_y = mouse.y - exports.debug_state.middle_position.y;
            let diff_x = mouse.x - exports.debug_state.middle_position.x;
            exports.debug_state.camera.state.position.x = exports.debug_state.camera.state.position.x + -1 * diff_x;
            exports.debug_state.camera.state.position.y = exports.debug_state.camera.state.position.y + -1 * diff_y;
        }
    }
}
exports.debug_statef = debug_statef;
function debug_update_room_list() {
    let list = document.getElementById("room_list");
    list.textContent = '';
    for (let room_name of Object.keys(rooms_1.rooms)) {
        let para = document.createElement("p");
        para.appendChild(document.createTextNode(room_name));
        para.classList.add("room_list_item");
        para.addEventListener("click", (e) => {
            main_1.g.loadRoomString(room_name);
        });
        list.appendChild(para);
    }
}
exports.debug_update_room_list = debug_update_room_list;
let properties_elements = undefined;
if (van_1.DEBUG) {
    properties_elements = {
        pos_x: document.getElementById("pos_x"),
        pos_y: document.getElementById("pos_y"),
        vel_x: document.getElementById("vel_x"),
        vel_y: document.getElementById("vel_y"),
        rot: document.getElementById("rot"),
        sca_x: document.getElementById("sca_x"),
        sca_y: document.getElementById("sca_y"),
        render: document.getElementById("render"),
        collision: document.getElementById("collision")
    };
    let inputs = document.getElementsByTagName("input");
    for (let a = 0; a < inputs.length; a++) {
        inputs[a].addEventListener("click", (e) => {
            inputs[a].focus();
        });
    }
    let focused;
    let debug_target = document.getElementById("debug_target");
    debug_target.addEventListener("click", (e) => {
        for (let a = 0; a < inputs.length; a++) {
            inputs[a].blur();
        }
    });
    let target = document.getElementById("target");
    target.addEventListener("click", (e) => {
        for (let a = 0; a < inputs.length; a++) {
            inputs[a].blur();
        }
    });
    properties_elements.pos_x.addEventListener("input", (e) => {
        let ele = exports.debug_state.selected_properties_element;
        let new_val = parseFloat(properties_elements.pos_x.value) || 0;
        exports.debug_state.actions_stack.push({
            property: "position",
            element: ele,
            new: JSON.stringify({ x: new_val, y: ele.state.position.y }),
            old: JSON.stringify(ele.state.position)
        });
        ele.state.position.x = new_val;
    });
    properties_elements.pos_y.addEventListener("input", (e) => {
        let ele = exports.debug_state.selected_properties_element;
        let new_val = parseFloat(properties_elements.pos_y.value) || 0;
        exports.debug_state.actions_stack.push({
            property: "position",
            element: ele,
            new: JSON.stringify({ x: ele.state.position.x, y: new_val }),
            old: JSON.stringify(ele.state.position)
        });
        ele.state.position.y = new_val;
    });
    properties_elements.vel_x.addEventListener("input", (e) => {
        let ele = exports.debug_state.selected_properties_element;
        ele.state.velocity.x = parseFloat(properties_elements.vel_x.value) || 0;
    });
    properties_elements.vel_y.addEventListener("input", (e) => {
        let ele = exports.debug_state.selected_properties_element;
        ele.state.velocity.y = parseFloat(properties_elements.vel_y.value) || 0;
    });
    properties_elements.rot.addEventListener("input", (e) => {
        let ele = exports.debug_state.selected_properties_element;
        let new_val = parseFloat(properties_elements.rot.value) || 0;
        exports.debug_state.actions_stack.push({
            property: "rotation",
            element: ele,
            new: JSON.stringify(new_val),
            old: JSON.stringify(ele.state.rotation)
        });
        ele.state.rotation = new_val;
    });
    properties_elements.sca_x.addEventListener("input", (e) => {
        let ele = exports.debug_state.selected_properties_element;
        let new_val = parseFloat(properties_elements.sca_x.value) || 0;
        exports.debug_state.actions_stack.push({
            property: "scaling",
            element: ele,
            new: JSON.stringify({ width: new_val, height: ele.state.scaling.height }),
            old: JSON.stringify(ele.state.scaling)
        });
        ele.state.scaling.width = new_val;
    });
    properties_elements.sca_y.addEventListener("input", (e) => {
        let ele = exports.debug_state.selected_properties_element;
        let new_val = parseFloat(properties_elements.sca_y.value) || 0;
        exports.debug_state.actions_stack.push({
            property: "scaling",
            element: ele,
            new: JSON.stringify({ width: ele.state.scaling.width, height: new_val }),
            old: JSON.stringify(ele.state.scaling)
        });
        ele.state.scaling.height = new_val;
    });
    properties_elements.render.addEventListener("input", (e) => {
        let ele = exports.debug_state.selected_properties_element;
        ele.render = properties_elements.render.checked;
    });
    properties_elements.collision.addEventListener("input", (e) => {
        let ele = exports.debug_state.selected_properties_element;
        ele.collision = properties_elements.collision.checked;
    });
    document.getElementById("delete_element").addEventListener("click", (e) => {
        let ele = exports.debug_state.selected_properties_element;
        ele.delete();
    });
}
function debug_update_properties_element() {
    if (exports.debug_state.selected_properties_element) {
        let ele = exports.debug_state.selected_properties_element;
        document.getElementById("obj_name").innerHTML = ele.constructor.name;
        properties_elements.pos_x.value = "" + ele.state.position.x.toFixed(2);
        properties_elements.pos_y.value = "" + ele.state.position.y.toFixed(2);
        properties_elements.vel_x.value = "" + ele.state.velocity.x.toFixed(2);
        properties_elements.vel_y.value = "" + ele.state.velocity.y.toFixed(2);
        properties_elements.rot.value = "" + ele.state.rotation.toFixed(2);
        properties_elements.sca_x.value = "" + ele.state.scaling.width.toFixed(2);
        properties_elements.sca_y.value = "" + ele.state.scaling.height.toFixed(2);
        properties_elements.render.checked = ele.render;
        properties_elements.collision.checked = ele.collision;
        let list = document.getElementById("params_list");
        list.textContent = '';
        for (let k of Object.keys(ele.params)) {
            let p = document.createElement("p");
            let span = document.createElement("span");
            span.appendChild(document.createTextNode(k));
            let input = document.createElement("input");
            if (typeof ele.params[k] === "boolean") {
                input.setAttribute("type", "checkbox");
            }
            else if (typeof ele.params[k] === "number") {
                input.setAttribute("type", "number");
            }
            else if (typeof ele.params[k] === "string") {
                input.setAttribute("type", "text");
            }
            input.setAttribute("id", k);
            input.setAttribute("value", ele.params[k] + "");
            input.addEventListener("click", (e) => {
                input.focus();
            });
            input.addEventListener("input", (e) => {
                let ele = exports.debug_state.selected_properties_element;
                let val = input.value;
                if (!isNaN(val)) {
                    ele.params[k] = parseFloat(val);
                }
                else if (val == "true") {
                    ele.params[k] = true;
                }
                else if (val == "false") {
                    ele.params[k] = false;
                }
                else {
                    ele.params[k] = val;
                }
            });
            p.appendChild(span);
            p.append(input);
            list.append(p);
        }
    }
}
exports.debug_update_properties_element = debug_update_properties_element;
function debug_update_obj_list() {
    let list = document.getElementById("objects_list");
    list.textContent = '';
    if (main_1.g.getRoom()) {
        for (let obj of main_1.g.getRoom().objects.slice().reverse()) {
            let para = document.createElement("p");
            para.appendChild(document.createTextNode(obj.constructor.name));
            para.classList.add("object_list_item");
            para.addEventListener("click", (e) => {
                if (exports.debug_state.selected_properties_element == obj) {
                    exports.debug_state.camera.state.position = Object.assign({}, obj.state.position);
                }
                else {
                    exports.debug_state.selected_properties_element = obj;
                    debug_update_properties_element();
                }
            });
            list.appendChild(para);
        }
    }
}
exports.debug_update_obj_list = debug_update_obj_list;
function debug_update_prefabs() {
    return __awaiter(this, void 0, void 0, function* () {
        let pres = Object.keys(prefabs_1.prefabs).map((o) => __awaiter(this, void 0, void 0, function* () {
            let a = (new prefabs_1.prefabs[o]({
                position: { x: 0, y: 0 },
                velocity: { x: 0, y: 0 },
                rotation: 0,
                scaling: { width: 1, height: 1 }
            }));
            yield a.load();
            a.render = true;
            let objs = a.combinedObjects();
            for (let obj of objs) {
                obj.UnbindAll();
            }
            let filtered = objs.filter((a) => a.render);
            return {
                prefab: prefabs_1.prefabs[o],
                name: a.constructor.name,
                rendered: filtered.map((o) => {
                    return {
                        name: o.constructor.name,
                        render: o.renderf(0)
                    };
                })
            };
        }));
        let a = yield Promise.all(pres);
        let target = document.getElementById("prefab_target");
        target.textContent = '';
        for (let prefab of a) {
            let div = document.createElement("div");
            let para = document.createElement("p");
            para.appendChild(document.createTextNode(prefab.name));
            div.appendChild(para);
            if (Array.isArray(prefab.rendered[0].render)) {
            }
            else {
                div.append(prefab.rendered[0].render.sprite.sprite_sheet);
            }
            div.classList.add("prefab_box");
            div.addEventListener("mousedown", () => __awaiter(this, void 0, void 0, function* () {
                let val = {
                    position: { x: exports.debug_state.camera.state.position.x, y: exports.debug_state.camera.state.position.y },
                    velocity: { x: 0, y: 0 },
                    rotation: 0,
                    scaling: { width: 1, height: 1 }
                };
                let obj = (new prefab.prefab(val));
                yield main_1.g.state.current_room.addItems(obj.combinedObjects());
            }));
            target.append(div);
        }
    });
}
exports.debug_update_prefabs = debug_update_prefabs;
exports.debug_setup = () => {
    exports.debug_state = {
        target: document.getElementById("debug_target"),
        camera: new render_1.Camera({
            x: 0,
            y: 0,
            dimensions: {
                height: van_1.viewport.height,
                width: van_1.viewport.width
            },
            scaling: 1,
            debug: true
        }, {
            x: 1,
            y: 0,
            width: 1,
            height: 1
        }),
        last_clicked: undefined,
        selected_element: undefined,
        selected_element_offset: undefined,
        rotation_element: undefined,
        middle_position: undefined,
        click_position: undefined,
        selected_properties_element: undefined,
        selected_element_initial_scaling: { width: 1, height: 1 },
        actions_stack: [],
        render_delta_time: 0,
        current_action: undefined
    };
    exports.debug_state.camera.hud = new Debug_hud();
    controls_1.debug_binds.push({
        key: "mouse0down",
        type: controls_1.btype.mouse,
        id: 0,
        function: () => {
            if (exports.debug_state.selected_element) {
                exports.debug_state.selected_element = null;
            }
            else {
                let mouse = controls_1.Poll_Mouse(exports.debug_state.camera, exports.debug_state.target);
                if (!mouse) {
                    return;
                }
                exports.debug_state.click_position = mouse;
                let alL_clicked = main_1.g.getRoom().checkObjectsPoint(mouse);
                let clicked;
                let filtered = alL_clicked.filter((ele) => ele == exports.debug_state.selected_properties_element);
                if (filtered.length > 0) {
                    clicked = filtered[0];
                }
                else {
                    clicked = alL_clicked[0];
                }
                if (clicked) {
                    if (controls_1.held_keys["ControlLeft"]) {
                        exports.debug_state.current_action = {
                            element: clicked,
                            property: "scaling",
                            old: JSON.stringify(clicked.state.scaling),
                            new: undefined
                        };
                    }
                    else {
                        exports.debug_state.current_action = {
                            element: clicked,
                            property: "position",
                            old: JSON.stringify(clicked.state.position),
                            new: undefined
                        };
                    }
                    exports.debug_state.selected_properties_element = clicked;
                    debug_update_properties_element();
                    exports.debug_state.selected_element = clicked;
                    exports.debug_state.selected_element_initial_scaling = clicked.state.scaling;
                    exports.debug_state.selected_element_offset = {
                        x: mouse.x - clicked.state.position.x,
                        y: mouse.y - clicked.state.position.y
                    };
                }
            }
        },
        execute: controls_1.exec_type.once,
        camera: exports.debug_state.camera
    });
    controls_1.debug_binds.push({
        key: "mouse1up",
        type: controls_1.btype.mouse,
        id: 5,
        function: () => {
            exports.debug_state.middle_position = undefined;
        },
        execute: controls_1.exec_type.once,
        camera: exports.debug_state.camera
    });
    controls_1.debug_binds.push({
        key: "mouse1down",
        type: controls_1.btype.mouse,
        id: 6,
        function: () => {
            let mouse = controls_1.Poll_Mouse(exports.debug_state.camera, exports.debug_state.target);
            if (!mouse) {
                return;
            }
            exports.debug_state.middle_position = mouse;
        },
        execute: controls_1.exec_type.once,
        camera: exports.debug_state.camera
    });
    controls_1.debug_binds.push({
        key: "mouse0up",
        type: controls_1.btype.mouse,
        id: 1,
        function: () => {
            if (exports.debug_state.selected_element) {
                if (exports.debug_state.current_action.property == "scaling") {
                    exports.debug_state.current_action.new = JSON.stringify(exports.debug_state.selected_element.state.scaling);
                }
                else if (exports.debug_state.current_action.property == "position") {
                    exports.debug_state.current_action.new = JSON.stringify(exports.debug_state.selected_element.state.position);
                }
                exports.debug_state.actions_stack.push(exports.debug_state.current_action);
            }
            exports.debug_state.selected_element = undefined;
            debug_update_properties_element();
        },
        execute: controls_1.exec_type.once,
        camera: exports.debug_state.camera
    });
    controls_1.debug_binds.push({
        key: "mouse2down",
        type: controls_1.btype.mouse,
        id: 3,
        function: () => {
            if (exports.debug_state.rotation_element) {
                exports.debug_state.rotation_element = null;
            }
            else {
                let mouse = controls_1.Poll_Mouse(exports.debug_state.camera, exports.debug_state.target);
                if (!mouse) {
                    return;
                }
                let clicked = main_1.g.getRoom().checkObjectsPoint(mouse)[0];
                if (clicked) {
                    exports.debug_state.rotation_element = clicked;
                    exports.debug_state.current_action = {
                        element: exports.debug_state.rotation_element,
                        property: "rotation",
                        old: JSON.stringify(exports.debug_state.rotation_element.state.rotation),
                        new: undefined
                    };
                }
            }
        },
        execute: controls_1.exec_type.once,
        camera: exports.debug_state.camera
    });
    controls_1.debug_binds.push({
        key: "mouse2up",
        type: controls_1.btype.mouse,
        id: 4,
        function: () => {
            exports.debug_state.current_action.new = JSON.stringify(exports.debug_state.rotation_element.state.rotation);
            exports.debug_state.actions_stack.push(exports.debug_state.current_action);
            exports.debug_state.rotation_element = undefined;
        },
        execute: controls_1.exec_type.once,
        camera: exports.debug_state.camera
    });
    let left_func = () => {
        let shift_held = controls_1.held_keys["ShiftLeft"] ? 1 : 0;
        if (exports.debug_state.last_clicked.id == "debug_target")
            exports.debug_state.camera.state.position.x = exports.debug_state.camera.state.position.x - ((5 + shift_held * 5) * (1 / exports.debug_state.camera.state.scaling));
    };
    let right_func = () => {
        let shift_held = controls_1.held_keys["ShiftLeft"] ? 1 : 0;
        if (exports.debug_state.last_clicked.id == "debug_target")
            exports.debug_state.camera.state.position.x = exports.debug_state.camera.state.position.x + ((5 + shift_held * 5) * (1 / exports.debug_state.camera.state.scaling));
    };
    let down_func = () => {
        let shift_held = controls_1.held_keys["ShiftLeft"] ? 1 : 0;
        if (!controls_1.held_keys["ControlLeft"] && exports.debug_state.last_clicked.id == "debug_target")
            exports.debug_state.camera.state.position.y = exports.debug_state.camera.state.position.y - ((5 + shift_held * 5) * (1 / exports.debug_state.camera.state.scaling));
    };
    let up_func = () => {
        let shift_held = controls_1.held_keys["ShiftLeft"] ? 1 : 0;
        if (exports.debug_state.last_clicked.id == "debug_target")
            exports.debug_state.camera.state.position.y = exports.debug_state.camera.state.position.y + ((5 + shift_held * 5) * (1 / exports.debug_state.camera.state.scaling));
    };
    let scroll_up = () => {
        if (exports.debug_state.last_clicked.id == "debug_target" && exports.debug_state.camera.state.scaling < 0.05)
            exports.debug_state.camera.state.scaling = exports.debug_state.camera.state.scaling + 0.01;
        else if (exports.debug_state.last_clicked.id == "debug_target")
            exports.debug_state.camera.state.scaling = exports.debug_state.camera.state.scaling + 0.05;
    };
    let save_func = () => {
        let ctrl_held = controls_1.held_keys["ControlLeft"];
        if (ctrl_held && van_1.PAUSED) {
            let name = main_1.g.getRoom().constructor.name;
            let a = exports.path.join(`${exports.project_path}`, `../rooms/${name}.json`);
            try {
                fs.writeFileSync(a, JSON.stringify(main_1.g.getRoom().exportStateConfig()));
            }
            catch (e) {
                console.log("ERROR WRITING ROOM INFO FILE.");
            }
            alert("Saved");
        }
        else if (ctrl_held && !van_1.PAUSED) {
            alert("pause to enable saving.");
        }
    };
    let scroll_down = () => {
        if (exports.debug_state.last_clicked.id == "debug_target" && exports.debug_state.camera.state.scaling > 0.05)
            exports.debug_state.camera.state.scaling = exports.debug_state.camera.state.scaling - 0.05;
        else if (exports.debug_state.last_clicked.id == "debug_target" && exports.debug_state.camera.state.scaling > 0.01)
            exports.debug_state.camera.state.scaling = exports.debug_state.camera.state.scaling - 0.01;
    };
    let undo_func = () => {
        if (controls_1.held_keys["ControlLeft"]) {
            let curr = exports.debug_state.actions_stack.pop();
            if (curr) {
                if (curr.property == "position") {
                    curr.element.state.position = JSON.parse(curr.old);
                }
                else if (curr.property === "rotation") {
                    curr.element.state.rotation = JSON.parse(curr.old);
                }
                else if (curr.property === "scaling") {
                    curr.element.state.scaling = JSON.parse(curr.old);
                }
            }
        }
    };
    controls_1.debug_binds.push({
        key: "KeyA",
        type: controls_1.btype.keyboard,
        id: controls_1.Bind("KeyA", left_func, controls_1.exec_type.repeat, 1),
        function: left_func,
        execute: controls_1.exec_type.repeat
    });
    controls_1.debug_binds.push({
        key: "KeyD",
        type: controls_1.btype.keyboard,
        id: controls_1.Bind("KeyD", right_func, controls_1.exec_type.repeat, 1),
        function: right_func,
        execute: controls_1.exec_type.repeat
    });
    controls_1.debug_binds.push({
        key: "KeyW",
        type: controls_1.btype.keyboard,
        id: controls_1.Bind("KeyW", up_func, controls_1.exec_type.repeat, 1),
        function: up_func,
        execute: controls_1.exec_type.repeat
    });
    controls_1.debug_binds.push({
        key: "KeyS",
        type: controls_1.btype.keyboard,
        id: controls_1.Bind("KeyS", down_func, controls_1.exec_type.repeat, 1),
        function: down_func,
        execute: controls_1.exec_type.repeat
    });
    controls_1.debug_binds.push({
        key: "scrollup",
        type: controls_1.btype.mouse,
        id: controls_1.Bind("scrollup", scroll_up, controls_1.exec_type.once, 1),
        function: scroll_up,
        execute: controls_1.exec_type.once
    });
    controls_1.debug_binds.push({
        key: "scrolldown",
        type: controls_1.btype.mouse,
        id: controls_1.Bind("scrolldown", scroll_down, controls_1.exec_type.once, 1),
        function: scroll_down,
        execute: controls_1.exec_type.once
    });
    controls_1.debug_binds.push({
        key: "KeyS",
        type: controls_1.btype.keyboard,
        id: controls_1.Bind("KeyS", save_func, controls_1.exec_type.once, 1),
        function: save_func,
        execute: controls_1.exec_type.once
    });
    controls_1.debug_binds.push({
        key: "KeyZ",
        type: controls_1.btype.keyboard,
        id: controls_1.Bind("KeyZ", undo_func, controls_1.exec_type.once, 1),
        function: undo_func,
        execute: controls_1.exec_type.once
    });
    window.addEventListener("click", (e) => {
        if (e.target instanceof HTMLElement) {
            exports.debug_state.last_clicked = e.target;
        }
    });
    let pause_button = document.getElementById("pause_button");
    pause_button.addEventListener("click", (e) => {
        van_1.setPaused(!van_1.PAUSED);
        if (van_1.PAUSED) {
            pause_button.innerHTML = "UNPAUSE";
        }
        else {
            pause_button.innerHTML = "PAUSE";
        }
    });
    let obj_button = document.getElementById("new_object_button");
    let room_button = document.getElementById("new_room_button");
    room_button.addEventListener("click", (e) => {
        let file_path = ipcRenderer.sendSync('object-path-request', "rooms");
        if (file_path) {
            let full_name = exports.path.parse(file_path).base;
            let new_name = full_name.substr(0, full_name.length - 3);
            let path_to_write = exports.path.join(`${file_path}`, "..", new_name + ".ts");
            fs.writeFileSync(path_to_write, room_template_1.room_template.split("template").join(new_name));
            path_to_write = exports.path.join(`${file_path}`, "..", new_name + ".json");
            fs.writeFileSync(path_to_write, `
    {
      "objects":[]
    }
    `);
        }
    });
    obj_button.addEventListener("click", (e) => {
        let file_path = ipcRenderer.sendSync('object-path-request', "objects");
        if (file_path) {
            let full_name = exports.path.parse(file_path).base;
            let new_name = full_name.substr(0, full_name.length - 3);
            let path_to_write = exports.path.join(`${file_path}`, "..", new_name + ".ts");
            fs.writeFileSync(path_to_write, object_template_1.object_template.split("template").join(new_name));
        }
    });
};


/***/ }),

/***/ "./src/lib/hud.ts":
/*!************************!*\
  !*** ./src/lib/hud.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Text = exports.HUD = void 0;
class HUD {
    constructor() {
        this.graphic_elements = [];
        this.text_elements = [];
        this.text_elements.push(...this.setTextElements());
        this.graphic_elements.push(...this.setGraphicElements());
    }
    statef(a) {
        for (let x of this.graphic_elements) {
            x.statef(a);
        }
        for (let x of this.text_elements) {
            x.statef(a);
        }
    }
    setTextElements() {
        return [];
    }
    setGraphicElements() {
        return [];
    }
}
exports.HUD = HUD;
class Text {
    constructor(node, getFunc) {
        if (!node.align) {
            node.align = "center";
        }
        this.state = node;
        if (!this.state.text) {
            this.state.text = "";
        }
        this.getFunc = getFunc;
    }
    statef(a) {
        this.state.text = this.getFunc();
    }
    renderf(a) {
        let { size, color, font, text, max_width, align } = this.state;
        return {
            size,
            color,
            font,
            text,
            max_width,
            align
        };
    }
}
exports.Text = Text;


/***/ }),

/***/ "./src/lib/math.ts":
/*!*************************!*\
  !*** ./src/lib/math.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandInt = exports.Distance = void 0;
function Distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
exports.Distance = Distance;
function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.getRandInt = getRandInt;


/***/ }),

/***/ "./src/lib/object.ts":
/*!***************************!*\
  !*** ./src/lib/object.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gravity_obj = exports.static_obj = exports.composite_obj = exports.obj = exports.rotation_length = exports.getId = void 0;
const render_1 = __webpack_require__(/*! ./render */ "./src/lib/render.ts");
const controls_1 = __webpack_require__(/*! ./controls */ "./src/lib/controls.ts");
const audio_1 = __webpack_require__(/*! ./audio */ "./src/lib/audio.ts");
const van_1 = __webpack_require__(/*! ../van */ "./src/van.ts");
const math_1 = __webpack_require__(/*! ./math */ "./src/lib/math.ts");
const debug_1 = __webpack_require__(/*! ../lib/debug */ "./src/lib/debug.ts");
function getId(a, id) {
    for (let b = 0; b < a.length; b++) {
        if (a[b].id == id) {
            return a[b];
        }
    }
    return undefined;
}
exports.getId = getId;
//Finds the side lengths of a triangle if given the  angle (in degrees)
//along with the length of the hypotenuse
function rotation_length(length, degree) {
    let a_len = length * Math.sin(degree * Math.PI / 180);
    let b_len = length * Math.cos(degree * Math.PI / 180);
    return {
        x: a_len,
        y: b_len
    };
}
exports.rotation_length = rotation_length;
//This counter tracks the global number of objects created so far
//an object's id (if not overwritten) will be a unique integer, which
//uses this counter.
let counter = 0;
class animations {
    constructor() {
        this.animations = {};
        //Tracks the time passed since the current animation
        //has started playing
        this.animation_tracker = 0;
        this.animating = false;
    }
    //defines an animation that can be played using the play method
    //the keyframes are an array of tuples in the 
    //format of [(time for this sprite to show), sprite]
    add(name, keyframes, length) {
        this.animations[name] = [keyframes, length];
    }
    play(name, callback) {
        this.current = name;
        this.callback = callback;
        this.animation_tracker = 0;
    }
    renderf(t) {
        let curr_animation = this.animations[this.current][0];
        let length = this.animations[this.current][1];
        let index = 0;
        for (; index < curr_animation.length - 1; index++) {
            let keyframe_time = curr_animation[index][0];
            let next_keyframe_time = curr_animation[index + 1][0];
            if (this.animation_tracker >= keyframe_time && this.animation_tracker < next_keyframe_time) {
                this.animation_tracker = this.animation_tracker + t;
                this.animating = true;
                //Returns the raw sprite that's correct to show at this time
                return curr_animation[index][1];
            }
        }
        if (this.animation_tracker >= length) {
            this.animation_tracker = 0;
            this.animating = false;
            if (this.callback) {
                this.callback();
            }
        }
        else {
            this.animation_tracker += t;
        }
        //Returns the last appropriate frame until the animation is over.
        return curr_animation[index][1];
    }
}
class obj {
    constructor(state, params = obj.default_params) {
        //Url to the object's individual sprite, or all of its sprites
        //bundled into a spritesheet
        this.sprite_url = "";
        this.render_type = render_1.render_type.sprite;
        this.collision = false;
        this.tags = [];
        //tags are used to exclude or include objects when checking for collisions,
        //and for object identification / classification in scripts
        this.render = true;
        this.animations = new animations();
        this.audio = new audio_1.audio();
        //Last render time, used to calculate delta_time
        this.last_render = 0;
        //Params are options for the object, that do not rely on state
        // For example, the side of a piece in chess.
        this.params = {};
        this.layer = 1;
        this.save_to_file = true;
        this.tick_state = true;
        this.scale_type = render_1.scale_type.grow;
        this.opacity = 1;
        this.id = "" + counter;
        this.binds = [];
        counter++;
        this.params = params;
        this.registerControls();
        this.registerAudio();
        //Creates a copy of the passed in initial state to avoid 
        //Updating the saved state of the room
        this.state = JSON.parse(JSON.stringify(state));
        this.params = params;
    }
    getState() {
        return this.state;
    }
    //Animations should be registered using this.animations.add in this method
    registerAnimations() {
    }
    //Sounds should be registered using this.audio.add in this method.
    registerAudio() {
    }
    defaultParams() {
        return van_1.deep(this.defaultParams);
    }
    load() {
        let _this = this;
        return new Promise((resolve, reject) => {
            let a = new Image();
            let p = this.sprite_url;
            if (van_1.DEBUG) {
                p = debug_1.path.join(debug_1.root_path, this.sprite_url);
            }
            a.src = p;
            a.onload = (() => __awaiter(this, void 0, void 0, function* () {
                _this.sprite_sheet = a;
                _this.registerAnimations();
                yield this.audio.load();
                resolve();
            }));
        });
    }
    //Within normal objects, this just returns an array that contains the object.
    //This method is overwritten by composite objects, which returns every object
    //that the composite object contains. This simplifies the backend work, as each
    //object returns an array of atleast one object.
    combinedObjects() {
        return [this];
    }
    getBoundingBox() {
        let coll_box = this.getFullCollisionBox();
        return {
            top_right: {
                x: coll_box.x + coll_box.width / 2,
                y: coll_box.y + coll_box.height / 2
            },
            bottom_left: {
                x: coll_box.x - coll_box.width / 2,
                y: coll_box.y - coll_box.height / 2
            }
        };
    }
    //Distance from one object to another.
    distance(target) {
        return math_1.Distance(this.state.position, target.state.position);
    }
    applyForce(vel) {
        this.state.velocity.x += vel.x;
        this.state.velocity.y += vel.y;
    }
    angleTowards(a) {
        return this.angleTowardsPoint(a.state.position);
    }
    angleTowardsPoint(target) {
        return 90 - Math.atan2((target.y - this.state.position.y), (target.x - this.state.position.x)) * 180 / Math.PI;
    }
    bindControl(key, x, func, interval = 1) {
        this.binds.push(controls_1.Bind(key, func, x, interval, this));
    }
    //This method is where controls and keybinds should
    //be defined using bindControl
    registerControls() {
    }
    statef(time) {
    }
    delete() {
        for (let a of this.binds) {
            controls_1.Unbind(a);
        }
        this.game.getRoom().deleteItem(this.id);
    }
    UnbindAll() {
        for (let a of this.binds) {
            controls_1.Unbind(a);
        }
    }
    //Returns the collision box of the object
    //Does not have to correspond to the object's sprite's size 
    //A composite object instead returns the bounding box that 
    //contains every one of its contained objects
    getFullCollisionBox() {
        //If a developer defined hitbox exists, use that, otherwise
        //generate it using the sprite width / height
        if (this.hitbox) {
            return {
                x: this.state.position.x,
                y: this.state.position.y,
                width: this.hitbox.width * this.state.scaling.width,
                height: this.hitbox.height * this.state.scaling.height
            };
        }
        else {
            return {
                x: this.state.position.x,
                y: this.state.position.y,
                width: this.width * this.state.scaling.width,
                height: this.height * this.state.scaling.height
            };
        }
    }
    //This is another methods, similar to getCombined
    //Just returns an array containing the object's collision box
    //Overwritten in composite objects to return every object's collision box
    //within the composite obect.
    getAllCollisionBoxes() {
        return [this.getFullCollisionBox()];
    }
    //Checks to see if an object actually collides with the provided box.
    //A box represents an area within the game space
    //Checking for collisions is trivial currently, as all hitboxes are axis aligned
    //But implementing a more complicated physics engine would make this method's impl.
    //significatly more complex.
    collidesWithBox(other_object) {
        let collides_horrizontally = false, collides_vertically = false;
        let hbox = this.hitbox;
        if (!this.hitbox) {
            hbox = {
                x_offset: 0,
                y_offset: 0,
                width: this.width,
                height: this.height
            };
        }
        let object_bounds = {
            left: (this.state.position.x + hbox.x_offset - hbox.width * this.state.scaling.width / 2),
            right: (this.state.position.x + hbox.x_offset + hbox.width * this.state.scaling.width / 2),
            top: (this.state.position.y + hbox.y_offset + hbox.height * this.state.scaling.height / 2),
            bottom: (this.state.position.y + hbox.y_offset - hbox.height * this.state.scaling.height / 2)
        };
        let other_object_bounds = {
            left: (other_object.x - other_object.width / 2),
            right: (other_object.x + other_object.width / 2),
            top: (other_object.y + other_object.height / 2),
            bottom: (other_object.y - other_object.height / 2)
        };
        //We can compare the sides of the boxes to see if they overlap
        //We check once for hoizontal overlap, then vertical.
        if ((object_bounds.left >= other_object_bounds.left && object_bounds.left < other_object_bounds.right) || (other_object_bounds.left > object_bounds.left && other_object_bounds.left < object_bounds.right)) {
            collides_horrizontally = true;
        }
        else {
            return false;
        }
        if ((object_bounds.bottom >= other_object_bounds.bottom && object_bounds.bottom < other_object_bounds.top) || (other_object_bounds.bottom > object_bounds.bottom && other_object_bounds.bottom < object_bounds.top)) {
            collides_vertically = true;
        }
        else {
            return false;
        }
        return collides_horrizontally && collides_vertically;
    }
    //The particle must be registered in the room's registerParticles method 
    //The name parameter should correspond to the key of a particle
    emitParticle(name, offset, lifetime, range) {
        let room = this.game.getRoom();
        let st = this.state;
        let final_position = {
            x: st.position.x + offset.x,
            y: st.position.y + offset.y
        };
        room.emitParticle(name, final_position, lifetime, range);
    }
    //Internal method that keeps calculates the delta_time
    //Also converts individual sprites into arrays of one sprite.
    renderTrack(time) {
        let rendered = this.renderf(time - this.last_render);
        let final;
        this.last_render = time;
        if (Array.isArray(rendered))
            final = rendered;
        else {
            final = [rendered];
        }
        return final;
    }
    //Most objects should not be overwritting the renderf method
    //Returns the appropriate sprite for the object
    renderf(time) {
        //If the object doesn't have registered animations, or isn't playing one
        //We have to create the sprite here.
        if (Object.keys(this.animations.animations).length == 0 || !this.animations.current) {
            if (!this.sprite_sheet || !this.height || !this.width) {
                return {
                    sprite: undefined,
                    x: this.state.position.x,
                    y: this.state.position.y
                };
            }
            let sprite_height = this.height;
            let sprite_width = this.width;
            //Technically we don't need to define an object height and width
            //If the sprite_url points to a single static sprite, as we can just pull
            //the dimensions from the image
            if (this.height == undefined) {
                sprite_height = this.sprite_sheet.height;
            }
            if (this.width == undefined) {
                sprite_width = this.sprite_sheet.width;
            }
            return {
                sprite: {
                    sprite_sheet: this.sprite_sheet,
                    left: 0,
                    top: 0,
                    sprite_width: sprite_width,
                    sprite_height: sprite_height,
                    opacity: this.opacity
                },
                x: this.state.position.x,
                y: this.state.position.y
            };
        }
        return {
            sprite: this.animations.renderf(time),
            x: this.state.position.x,
            y: this.state.position.y
        };
    }
}
exports.obj = obj;
obj.default_params = {};
class composite_obj extends obj {
    constructor(pos) {
        super(pos);
        this.objects = [];
        this.render = false;
        this.registered = false;
        this.collision = false;
        this.statics = [];
    }
    load() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            yield Promise.all([...this.objects.map((a) => a.load()), ...this.statics.map(a => a.obj.load())]);
            resolve();
        }));
    }
    combinedObjects() {
        let combined = [...this.objects, ...this.statics.map(a => a.obj)];
        combined.forEach(a => a.parent = this);
        return [...combined, this];
    }
    getItemsByTag(tag) {
        return this.combinedObjects().filter((a) => a.tags.indexOf(tag) > -1);
    }
    addItem(a, list = this.objects) {
        list.push(a);
        a.parent = this;
        this.game.getRoom().addItem(a);
    }
    getAllCollisionBoxes() {
        let arr = [];
        for (let obj of [...this.statics.map(a => a.obj), ...this.objects]) {
            let created_box = obj.getAllCollisionBoxes();
            if (Array.isArray(created_box)) {
                arr.push(...created_box);
            }
            else {
                arr.push(created_box);
            }
        }
        return arr;
    }
    delete() {
        for (let a of this.objects) {
            a.delete();
        }
        for (let a of this.statics) {
            a.obj.delete();
        }
        super.delete();
    }
    collidesWithBox(a) {
        for (let obj of this.objects) {
            if (obj.collidesWithBox(a))
                return true;
        }
        for (let o of this.statics) {
            if (o.obj.collidesWithBox(a))
                return true;
        }
        return false;
    }
}
exports.composite_obj = composite_obj;
class static_obj {
    constructor() {
        this.sprite_url = "";
    }
}
exports.static_obj = static_obj;
class gravity_obj extends obj {
    constructor() {
        super(...arguments);
        this.gravity = true;
    }
}
exports.gravity_obj = gravity_obj;


/***/ }),

/***/ "./src/lib/render.ts":
/*!***************************!*\
  !*** ./src/lib/render.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.rect_renderer = exports.stroked_rect_renderer = exports.sprite_renderer = exports.text_renderer = exports.hud_text_renderer = exports.scale_type = exports.render_type = exports.Camera = void 0;
const van_1 = __webpack_require__(/*! ../van */ "./src/van.ts");
class Camera {
    constructor(props, v, hud = undefined) {
        this.state = {
            scaling: props.scaling,
            position: {
                x: props.x,
                y: props.y
            },
            dimensions: props.dimensions,
            viewport: {
                x: v.x,
                y: v.y,
                width: v.width * props.dimensions.width,
                height: v.height * props.dimensions.height
            },
            debug: props.debug,
            hud
        };
        this.hud = hud;
    }
    set x(x) {
        this.state.position.x = x;
    }
    set y(y) {
        this.state.position.y = y;
    }
    get x() {
        return this.state.position.x;
    }
    get y() {
        return this.state.position.y;
    }
}
exports.Camera = Camera;
var render_type;
(function (render_type) {
    render_type[render_type["text"] = 0] = "text";
    render_type[render_type["sprite"] = 1] = "sprite";
    render_type[render_type["rect"] = 2] = "rect";
    render_type[render_type["stroke_rect"] = 3] = "stroke_rect";
})(render_type = exports.render_type || (exports.render_type = {}));
var scale_type;
(function (scale_type) {
    scale_type[scale_type["grow"] = 0] = "grow";
    scale_type[scale_type["repeat"] = 1] = "repeat";
})(scale_type = exports.scale_type || (exports.scale_type = {}));
exports.hud_text_renderer = (r, s) => {
    let vheight = van_1.GetViewportDimensions().height;
    r.context.font = `${s.font.size}px ${s.font.font}`;
    r.context.fillStyle = s.font.color;
    r.context.textAlign = s.font.align;
    if (s.font.max_width) {
        r.context.fillText(s.font.text, s.x, vheight - s.y, s.font.max_width);
    }
    else {
        r.context.fillText(s.font.text, s.x, vheight - s.y);
    }
};
exports.text_renderer = (r, s) => {
    let camera = r.camera;
    let vheight = r.camera.state.dimensions.height;
    let width = r.context.measureText(s.font.text).width * r.camera.state.scaling;
    let height = s.font.size * 1.2 * r.camera.state.scaling;
    let final_x = ((s.x - camera.state.position.x + camera.state.dimensions.width * (1 / r.camera.state.scaling) / 2) * r.camera.state.scaling);
    let final_y = ((vheight - s.y * camera.state.scaling - camera.state.dimensions.height / 2 + camera.state.position.y * camera.state.scaling));
    r.context.font = `${s.font.size * r.camera.state.scaling}px ${s.font.font}`;
    r.context.fillStyle = s.font.color;
    r.context.textAlign = s.font.align;
    r.context.save();
    r.context.translate(final_x, final_y);
    if (s.font.max_width) {
        r.context.fillText(s.font.text, 0, 0, s.font.max_width);
    }
    else {
        r.context.fillText(s.font.text, 0, 0);
    }
    r.context.restore();
};
exports.sprite_renderer = (r, s) => {
    let camera = r.camera;
    let vheight = r.camera.state.dimensions.height / r.camera.state.scaling;
    let final_x = ((s.x - camera.state.position.x + camera.state.dimensions.width * (1 / r.camera.state.scaling) / 2 - s.sprite.sprite_width * s.scale.width / 2) * r.camera.state.scaling);
    let final_y = ((vheight - s.y - camera.state.dimensions.height * (1 / r.camera.state.scaling) / 2 - s.sprite.sprite_height * s.scale.height / 2 + camera.state.position.y) * r.camera.state.scaling);
    let height = s.sprite.sprite_height * r.camera.state.scaling * s.scale.height;
    let width = s.sprite.sprite_width * r.camera.state.scaling * s.scale.width;
    r.context.save();
    r.context.globalAlpha = s.sprite.opacity;
    r.context.translate(final_x + (width) / 2, final_y + height / 2);
    let radians = s.rotation * (Math.PI / 180);
    r.context.rotate(radians);
    if (s.scale_type == scale_type.grow) {
        r.context.drawImage(s.sprite.sprite_sheet, s.sprite.left, s.sprite.top, s.sprite.sprite_width, s.sprite.sprite_height, -(width) / 2, -height / 2, width, height);
    }
    else if (s.scale_type == scale_type.repeat) {
        let one_width = s.sprite.sprite_width * r.camera.state.scaling;
        let one_height = s.sprite.sprite_height * r.camera.state.scaling;
        let total_hor_sprites = width / one_width;
        let total_ver_sprites = height / one_height;
        for (let a = 0; a < total_hor_sprites; a += 1) {
            for (let b = 0; b < total_ver_sprites; b += 1) {
                let new_width = one_width;
                let new_height = one_height;
                if ((a + 1) * one_width - width > 0) {
                    new_width = width % one_width;
                }
                if ((b + 1) * one_height - height > 0) {
                    new_height = height % one_height;
                }
                r.context.drawImage(s.sprite.sprite_sheet, s.sprite.left, s.sprite.top, new_width / (r.camera.state.scaling), new_height / (r.camera.state.scaling), -width / 2 + a * one_width, -height / 2 + b * one_height, new_width, new_height);
            }
        }
    }
    r.context.restore();
};
exports.stroked_rect_renderer = (context, rect, x, y, color, lineWidth, camera) => {
    let vheight = camera.state.dimensions.height / camera.state.scaling;
    let final_x = ((x - camera.state.position.x + camera.state.dimensions.width * (1 / camera.state.scaling) / 2 - rect.width / 2) * camera.state.scaling);
    let final_y = ((vheight - y - rect.height / 2 - camera.state.dimensions.height * (1 / camera.state.scaling) / 2 + camera.state.position.y) * camera.state.scaling);
    let height = rect.height * camera.state.scaling;
    let width = rect.width * camera.state.scaling;
    context.strokeStyle = color;
    context.lineWidth = lineWidth * camera.state.scaling;
    context.strokeRect(final_x, final_y, width, height);
};
exports.rect_renderer = (context, rect, x, y, color, lineWidth, camera) => {
    let vheight = camera.state.dimensions.height / camera.state.scaling;
    let final_x = ((x - camera.state.position.x + camera.state.dimensions.width * (1 / camera.state.scaling) / 2 - rect.width / 2) * camera.state.scaling);
    let final_y = ((vheight - y - rect.height / 2 - camera.state.dimensions.height * (1 / camera.state.scaling) / 2 + camera.state.position.y) * camera.state.scaling);
    let height = rect.height * camera.state.scaling;
    let width = rect.width * camera.state.scaling;
    context.strokeStyle = color;
    context.fillRect(final_x, final_y, width, height);
};


/***/ }),

/***/ "./src/lib/room.ts":
/*!*************************!*\
  !*** ./src/lib/room.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.room = exports.applyGravity = void 0;
const sprite_1 = __webpack_require__(/*! ./sprite */ "./src/lib/sprite.ts");
const collision_1 = __webpack_require__(/*! ./collision */ "./src/lib/collision.ts");
const van_1 = __webpack_require__(/*! ../van */ "./src/van.ts");
const controls_1 = __webpack_require__(/*! ./controls */ "./src/lib/controls.ts");
const audio_1 = __webpack_require__(/*! ./audio */ "./src/lib/audio.ts");
const debug_1 = __webpack_require__(/*! ../lib/debug */ "./src/lib/debug.ts");
const prefabs_1 = __webpack_require__(/*! ../game/objects/prefabs */ "./src/game/objects/prefabs.ts");
function applyGravity(ob, grav_const, grav_max) {
    if (ob.gravity && ob.state.velocity.y > grav_max) {
        ob.state.velocity.y += grav_const;
    }
}
exports.applyGravity = applyGravity;
class room {
    constructor(game, config) {
        this.objects = [];
        //This object contains particle definitions
        this.particles = {};
        //This array is what actually contains the particles
        //that exists within the room.
        this.particles_arr = [];
        this.binds = [];
        this.audio = new audio_1.audio();
        //These text nodes exists in the actual room space, rather than
        //on the hud layer.
        this.render = true;
        this.text_nodes = [];
        this.game = game;
        for (let c of config.objects) {
            //This handles loading objects from the saved json file associated with each room.
            this.addItemStateConfig(c);
        }
    }
    exportStateConfig() {
        let config = { objects: [] };
        for (let o of this.objects.filter((obj) => obj.save_to_file)) {
            //If an object has a parent object, it's a descendent of a composite object
            //The parent will spawn this object when it's instantiated, so we do
            //not have to save this instance.
            if (!o.parent) {
                config.objects.push({
                    type: o.constructor.name,
                    state: o.state,
                    parameters: o.params
                });
            }
        }
        return config;
    }
    //This handles the loading of all room sprites, and
    //any objects it contains.
    load() {
        let _this = this;
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let a = new Image();
            let to_await = this.objects.map((a) => a.load());
            yield Promise.all(to_await);
            let p = this.background_url;
            if (van_1.DEBUG) {
                p = debug_1.path.join(debug_1.root_path, this.background_url);
            }
            a.src = p;
            a.onerror = (() => {
                throw new Error("Loading Error:" + this.background_url);
            });
            a.onload = (() => __awaiter(this, void 0, void 0, function* () {
                _this.background = a;
                yield this.audio.load();
                resolve();
            }));
        }));
    }
    //This is used while loading objects from file, it's used to dynamically load
    //objects from the room's json. If adding items within code, it's better to create
    //new instances of objects through addItem
    addItemStateConfig(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (prefabs_1.prefabs[config.type]) {
                let new_obj = (new prefabs_1.prefabs[config.type](Object.assign({}, config.state), config.parameters));
                this.addItems(new_obj.combinedObjects());
            }
            else {
                console.log("UNKNOWN TYPE ATTEMPTED TO LOAD: " + config.type);
            }
        });
    }
    //Adds the passed item to the room.
    addItem(o, list = this.objects) {
        return __awaiter(this, void 0, void 0, function* () {
            this.addItems([o], list);
        });
    }
    //Adds every item in the passed array to the room.
    addItems(o, list = this.objects) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let ob of o) {
                ob.game = this.game;
            }
            yield Promise.all(o.map((a) => a.load()));
            list.push(...o);
            if (van_1.DEBUG && list === this.objects) {
                debug_1.debug_update_obj_list();
            }
        });
    }
    //Deletes the item and removes it from the room's object list
    deleteItem(id, list = this.objects) {
        for (let a = 0; a < list.length; a++) {
            if (list[a].id === id) {
                list.splice(a, 1);
                a--;
            }
        }
        if (van_1.DEBUG && list === this.objects) {
            debug_1.debug_update_obj_list();
        }
    }
    //Any particles that are needed in the room should be added to the particle array here.
    registerParticles() {
    }
    //Adds a bind that is executed when the passed key is activated
    //key examples: mouse0down KeyAdown KeyLup
    bindControl(key, x, func, interval = 1) {
        this.binds.push(controls_1.Bind(key, func, x, interval));
    }
    //Checks for objects that have collision at the passed point
    checkCollisionsPoint(pos, exempt, list = this.objects) {
        return this.checkCollisions({ x: pos.x, y: pos.y, height: 0, width: 0 }, exempt, list);
    }
    //Checks for any objects at the passed point
    checkObjectsPoint(pos, exempt, list = this.objects) {
        return this.checkObjects({ x: pos.x, y: pos.y, height: 0, width: 0 }, exempt, list);
    }
    //Checks for collisions at the point that contain every tag within the second argument
    checkCollisionsPointInclusive(pos, tags, list = this.objects) {
        return this.checkCollisionsInclusive({ x: pos.x, y: pos.y, height: 0, width: 0 }, tags, list);
    }
    //Checks for any objects that contain every tag within the second argument
    checkObjectsPointInclusive(pos, tags, list = this.objects) {
        return this.checkObjectsInclusive({ x: pos.x, y: pos.y, height: 0, width: 0 }, tags, list);
    }
    //Checks for collisions in the box that contain the tags in the second argument
    checkCollisionsInclusive(box, tags, list = this.objects) {
        if (van_1.DEBUG) {
            van_1.render_collision_box(box);
        }
        return list.filter(obj => obj.collision && obj.collidesWithBox(box) && tags.every((val) => obj.tags.includes(val)));
    }
    //Checks for any objects in the box that contain all tags in the second argument
    checkObjectsInclusive(box, tags, list = this.objects) {
        if (van_1.DEBUG) {
            van_1.render_collision_box(box);
        }
        return list.filter((obj) => obj.collidesWithBox(box) && tags.every((val) => obj.tags.includes(val)));
    }
    //checks for objects with collision in the box that do not contain the tags in the second argument
    checkCollisions(box, exempt, list = this.objects) {
        if (van_1.DEBUG) {
            van_1.render_collision_box(box);
        }
        return collision_1.check_all_collisions(box, list, exempt);
    }
    //checks for  any objects in the box that do not contain the tags in the second argument
    checkObjects(box, exempt, list = this.objects) {
        if (van_1.DEBUG) {
            van_1.render_collision_box(box);
        }
        return collision_1.check_all_objects(box, list, exempt);
    }
    //This method should be used to call bindControl and create any needed keyBindings
    registerControls() {
    }
    cleanup() {
    }
    //The room's state updating function.
    statef(time) {
        for (let particle of this.particles_arr) {
            particle.statef(time);
        }
        for (let text_node of this.text_nodes) {
            text_node.statef(time);
        }
        let ticking_objects = this.objects.filter((o) => o.tick_state);
        for (let a = 0; a < ticking_objects.length; a++) {
            //This function checks the velocity of every object, and moves it into it's next location
            //provided that it can fit there.
            collision_1.velocityCollisionCheck(ticking_objects[a], this.objects);
            ticking_objects[a].statef(time);
        }
        if (this.game.state.cameras) {
            for (let cameras of this.game.state.cameras) {
                if (cameras.hud) {
                    cameras.hud.statef(time);
                }
            }
        }
    }
    emitParticle(name, pos, lifetime, pos_range) {
        let state = {
            position: pos,
            velocity: { x: 0, y: 0 },
            rotation: 0,
            scaling: { width: 1, height: 1 }
        };
        this.addItem(new sprite_1.Particle(this.particles[name], state, lifetime, pos_range), this.particles_arr);
    }
    getObj(id) {
        for (let a = 0; a < this.objects.length; a++) {
            if (this.objects[a].id == id) {
                return this.objects[a];
            }
        }
        return null;
    }
    //Gets any objects that have the passed tag
    getObjByTag(tag) {
        return this.objects.filter((a) => a.tags.indexOf(tag) > -1);
    }
    //renders the room's sprite
    renderf(time) {
        return {
            sprite_sheet: this.background,
            left: 0,
            top: 0,
            sprite_height: this.background.height,
            sprite_width: this.background.width,
            opacity: 1
        };
    }
}
exports.room = room;


/***/ }),

/***/ "./src/lib/sprite.ts":
/*!***************************!*\
  !*** ./src/lib/sprite.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sprite_gen = exports.Particle = void 0;
const object_1 = __webpack_require__(/*! ./object */ "./src/lib/object.ts");
const math_1 = __webpack_require__(/*! ./math */ "./src/lib/math.ts");
class Particle extends object_1.obj {
    constructor(part, state, lifetime, random_range) {
        super(state);
        this.collision = false;
        this.state.lifetime = 0;
        this.sprite_url = part.sprite;
        this.height = part.height;
        this.width = part.width;
        this.max_lifetime = lifetime;
        this.random_range = random_range;
        this.state.position.x += math_1.getRandInt(-random_range / 2, random_range / 2);
        this.state.position.y += math_1.getRandInt(-random_range / 2, random_range / 2);
    }
    delete() {
        let room = this.game.getRoom();
        room.deleteItem(this.id, room.particles_arr);
    }
    statef(time) {
        this.state.lifetime += time;
        if (this.state.lifetime > this.max_lifetime) {
            this.delete();
        }
    }
    renderf(time) {
        if (!this.selected_sprite) {
            let sprites = sprite_gen(this.sprite_sheet, this.width, this.height);
            let random_row = math_1.getRandInt(0, sprites.length);
            let random_col = math_1.getRandInt(0, sprites[random_row].length);
            this.selected_sprite = sprites[random_row][random_col];
        }
        this.selected_sprite.opacity = 1 - this.state.lifetime / this.max_lifetime;
        return {
            x: this.state.position.x,
            y: this.state.position.y,
            sprite: this.selected_sprite
        };
    }
}
exports.Particle = Particle;
function sprite_gen(sprite_sheet, sprite_width, sprite_height) {
    let width = sprite_sheet.width;
    let height = sprite_sheet.height;
    let sprites = [];
    for (let b = 0; b < height; b += sprite_height) {
        sprites.push([]);
        for (let a = 0; a < width; a += sprite_width) {
            sprites[b].push({
                sprite_sheet,
                left: a,
                top: b * sprite_height,
                sprite_height,
                sprite_width,
                opacity: 1
            });
        }
    }
    return sprites;
}
exports.sprite_gen = sprite_gen;


/***/ }),

/***/ "./src/lib/templates/object_template.ts":
/*!**********************************************!*\
  !*** ./src/lib/templates/object_template.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.object_template = void 0;
exports.object_template = `import {obj} from "lib/object";
import { obj_state, Vector } from "lib/state";

interface template_state extends obj_state{
    
}
    
interface template_parameters{
    
}
    
export class template extends obj{
  sprite_url = "./sprites/Error.png";
  height = 100;
  width = 100;
  tags:Array<string>;
  collision = true;
  render = true;
  state:template_state;
  params:template_parameters;
  static default_params:template_parameters = {}
  constructor(state:obj_state,params:template_parameters = template.default_params){
    super(state,params);
  }
  statef(time_delta:number){
    super.statef(time_delta);
  }
  renderf(time_delta:number){
   return super.renderf(time_delta); 
  }
  register_animations(){
    
  }
  register_audio(){
    
  }
  register_controls(){
        
  }
}`;


/***/ }),

/***/ "./src/lib/templates/room_template.ts":
/*!********************************************!*\
  !*** ./src/lib/templates/room_template.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.room_template = void 0;
exports.room_template = `import { room } from "lib/room";
import { game } from "src/van";
import { state_config } from "lib/room";
import * as config from "./template.json";
let cfig = config as unknown as state_config;
interface template_state {

}

export class template extends room<template_state>{
  background_url = "./sprites/Error.png";
  render = true;
  constructor(game: game<unknown>) {
    super(game, cfig);
  }
  registerControls() {

  }
  registerParticles() {

  }
  statef(delta_time: number) {
    super.statef(delta_time);
  }

}`;


/***/ }),

/***/ "./src/van.ts":
/*!********************!*\
  !*** ./src/van.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.game = exports.objects = exports.rooms = exports.deep = exports.render_collision_box = exports.setPaused = exports.setDebug = exports.viewport = exports.GetViewportDimensions = exports.GetScreenDimensions = exports.PAUSED = exports.DEBUG = void 0;
exports.DEBUG = 'production' === 'dev';
exports.PAUSED = 'production' === 'dev';
const render_1 = __webpack_require__(/*! ./lib/render */ "./src/lib/render.ts");
const controls_1 = __webpack_require__(/*! ./lib/controls */ "./src/lib/controls.ts");
const controls_2 = __webpack_require__(/*! ./lib/controls */ "./src/lib/controls.ts");
const debug_1 = __webpack_require__(/*! ./lib/debug */ "./src/lib/debug.ts");
const rooms_1 = __webpack_require__(/*! ./game/rooms/rooms */ "./src/game/rooms/rooms.ts");
let canvas_element = document.getElementById("target");
let context = canvas_element.getContext("2d");
let screen_width = window.innerWidth;
let screen_height = window.innerHeight;
//How often the game logic loop should run, in milliseconds
let logic_loop_interval = 1000 / 60;
let last_time = new Date();
let last_render_time = 0;
function GetScreenDimensions() {
    return ({
        width: screen_width,
        height: screen_height
    });
}
exports.GetScreenDimensions = GetScreenDimensions;
function GetViewportDimensions() {
    return ({
        height: canvas_element.height,
        width: canvas_element.width
    });
}
exports.GetViewportDimensions = GetViewportDimensions;
exports.viewport = {
    height: GetViewportDimensions().height,
    width: GetViewportDimensions().width
};
window.onresize = () => {
    exports.viewport.height = GetViewportDimensions().height;
    exports.viewport.width = GetViewportDimensions().width;
};
function setDebug(x) {
    exports.DEBUG = x;
}
exports.setDebug = setDebug;
function setPaused(x) {
    exports.PAUSED = x;
}
exports.setPaused = setPaused;
exports.render_collision_box = (a) => {
    boxes.push(a);
};
let boxes = [];
exports.deep = (a) => {
    return JSON.parse(JSON.stringify(a));
};
exports.rooms = [];
class game {
    constructor(ctx, init_state) {
        this.prototypes = [];
        this.rooms = [];
        this.isRendering = false;
        this.state = {
            canvas: canvas_element,
            logic: undefined,
            context: ctx,
            cameras: [],
            current_room: undefined,
            globals: init_state
        };
        this.offscreen_canvas = document.createElement("canvas");
        this.offscreen_context = this.offscreen_canvas.getContext("2d");
        //DEBUG determines whether the game is running within the editor
        if (exports.DEBUG) {
            //Sets up some global debug state and the editor keybindings
            debug_1.debug_setup();
            //Initializes a separate logic loop solely for the editor
            //This separation allows for the editor to interact with the environment while
            //the actual room's state loop is paused.
            setInterval(() => {
                if (this.getRoom()) {
                    //This functions handles the editor interactions with the game environment
                    debug_1.debug_statef(16.66);
                }
            }, 16.66);
        }
        //Creates a onclick function on the window that handles element onclick functions
        controls_2.init_click_handler(this);
    }
    render(t) {
        //t is current render time
        let delta_time = t - last_render_time;
        last_render_time = t;
        let all_cameras = this.state.cameras;
        let editor_camera_index = -1;
        if (exports.DEBUG) {
            debug_1.debug_state.render_delta_time = delta_time;
            all_cameras = [...all_cameras, debug_1.debug_state.camera];
            editor_camera_index = all_cameras.length - 1;
            if (all_cameras.length === 1) {
                this.state.context.fillStyle = "white";
                this.state.context.font = "50px Arial";
                this.state.context.textAlign = "center";
                this.state.context.fillText("NO CAMERA", exports.viewport.width / 2, exports.viewport.height / 2);
            }
            //The editor camera is always the last camera inside the cameras array
            //the editor camera is rendered to a different canvas than the main game canvas
            //so we use the camera's index to check what canvas to render to
        }
        for (let a = 0; a < all_cameras.length; a++) {
            let camera = all_cameras[a];
            //We render the cameras contents to an offscreen canvas, then copy its contents
            //to the main canvas.
            //This allows us to avoid any math needed to determine sprites that are partially offscreen
            //as any offscreen sections of the sprites will not be copied over, rather than explicitly 
            //calculating the cutoffs
            this.offscreen_canvas.height = camera.state.dimensions.height;
            this.offscreen_canvas.width = camera.state.dimensions.width;
            this.offscreen_context.clearRect(0, 0, camera.state.dimensions.width, camera.state.dimensions.height);
            this.offscreen_context.fillStyle = "black";
            this.offscreen_context.fillRect(0, 0, camera.state.dimensions.width, camera.state.dimensions.height);
            //This collision box represents the camera's field of view in the game space
            //We use the room's checkObjects function to find any object that exists within this area
            //These objects are the objects that need to be rendered for this camera
            let camera_box = {
                x: camera.state.position.x,
                y: camera.state.position.y,
                width: camera.state.dimensions.width * (1 / camera.state.scaling),
                height: camera.state.dimensions.height * (1 / camera.state.scaling)
            };
            //List of all particles within the camera's fov
            let particle_collides = this.state.current_room.checkObjects(camera_box, [], this.state.current_room.particles_arr);
            //List of all objects within the camera's fov
            let camera_colliders = [...this.state.current_room.checkObjects(camera_box), ...particle_collides];
            let render_args = {
                context: this.offscreen_context,
                camera: camera,
            };
            //Renders the room's background.
            if (this.state.current_room.render) {
                render_1.sprite_renderer(render_args, {
                    sprite: this.state.current_room.renderf(delta_time),
                    x: 0,
                    y: 0,
                    rotation: 0,
                    scale: {
                        width: 1,
                        height: 1
                    },
                    scale_type: render_1.scale_type.grow
                });
            }
            //Array of hitboxes for each item in the room
            let hitboxes = [];
            for (let a of camera_colliders.filter((b) => b.render).sort((a, b) => (a.layer - b.layer))) {
                let rendered = a.renderTrack(t);
                //Objects can return either a sprite, or an array of sprites to simplify the API
                //For the user, and for use in composite objects(object that bundles other objects together)
                //Internally, we convert any single sprite into an array of one sprite.
                for (let positioned_sprite of rendered)
                    render_1.sprite_renderer(render_args, {
                        sprite: positioned_sprite.sprite,
                        x: positioned_sprite.x,
                        y: positioned_sprite.y,
                        rotation: a.state.rotation,
                        scale: a.state.scaling,
                        scale_type: a.scale_type
                    });
                //Hitboxes are rendered late in the render loop, to ensure objects don't overlap them
                //As we render objects, we add their hitboxes to this list
                if (exports.DEBUG && a.collision) {
                    hitboxes.push(...a.getAllCollisionBoxes());
                }
            }
            //This is a special class of object that exists in the game world
            for (let node of this.state.current_room.text_nodes) {
                render_1.text_renderer(render_args, {
                    x: node.state.position.x,
                    y: node.state.position.y,
                    font: node.renderf(t)
                });
            }
            if (camera.hud) {
                let graphics = camera.hud.graphic_elements;
                let text_elements = camera.hud.text_elements;
                //Renders static graphics that are a part of the hud
                for (let graphic of graphics) {
                    let rendered = graphic.renderTrack(t);
                    if (graphic.render) {
                        for (let positioned_sprite of rendered) {
                            render_1.sprite_renderer(render_args, {
                                sprite: positioned_sprite.sprite,
                                x: positioned_sprite.x,
                                y: positioned_sprite.y,
                                rotation: graphic.state.rotation,
                                scale: graphic.state.scaling,
                                scale_type: graphic.scale_type
                            });
                        }
                    }
                }
                for (let text of text_elements) {
                    render_1.hud_text_renderer(render_args, {
                        x: text.state.position.x,
                        y: text.state.position.y,
                        font: text.renderf(t)
                    });
                }
            }
            //If a camera is marked as a debug camera, we render the
            //  hitboxes, and potentially update the editor
            if (camera.state.debug) {
                let box;
                let boxes_copy = [...boxes];
                while (boxes_copy.length > 0) {
                    let box = boxes_copy.pop();
                    let rect = {
                        width: box.width,
                        height: box.height
                    };
                    render_1.stroked_rect_renderer(this.offscreen_context, rect, box.x, box.y, "#FF0000", 1, camera);
                }
                while (hitboxes.length > 0) {
                    let box = hitboxes.pop();
                    let rect = {
                        width: box.width,
                        height: box.height
                    };
                    render_1.stroked_rect_renderer(this.offscreen_context, rect, box.x, box.y, "#008000", 1, camera);
                }
                //Draws a special box around the currently selected element
                //inside the editor UI
                if (exports.DEBUG && debug_1.debug_state.selected_properties_element) {
                    let coll = debug_1.debug_state.selected_properties_element.getFullCollisionBox();
                    render_1.rect_renderer(this.offscreen_context, { width: 25, height: 25 }, coll.x, coll.y, "skyblue", 10, camera);
                    render_1.stroked_rect_renderer(this.offscreen_context, coll, coll.x, coll.y, "blue", 1, camera);
                }
            }
            //Separate canvas for the editor camera
            if (a !== editor_camera_index) {
                this.state.context.drawImage(this.offscreen_canvas, camera.state.viewport.x, camera.state.viewport.y);
            }
            else {
                debug_1.debug_state.target.getContext("2d").drawImage(this.offscreen_canvas, camera.state.viewport.x, camera.state.viewport.y);
            }
        }
        if (exports.DEBUG)
            boxes = [];
        requestAnimationFrame((a) => { this.render(a); });
    }
    start_logic(a) {
        //this is the room's state loop
        return window.setInterval(() => {
            let new_time = new Date();
            if (!exports.PAUSED) {
                let time_since = new_time.getTime() - last_time.getTime();
                if (this.state.current_room) {
                    this.state.current_room.statef(time_since);
                    if (this.state.current_room.hud) {
                        this.state.current_room.hud.statef(time_since);
                    }
                }
            }
            last_time = new_time;
            //This functions handles binds that occur on an interval
            controls_1.ExecuteRepeatBinds(a);
        }, a);
    }
    getRoom() {
        return this.state.current_room;
    }
    loadRoomString(x) {
        return __awaiter(this, void 0, void 0, function* () {
            //room list is a object that contains each room's class,
            //with the room's name as the key for class
            //This object is populated at compile time
            for (let a of Object.keys(rooms_1.rooms)) {
                if (a == x) {
                    //this isn't particularly type-safe.
                    let new_room = new rooms_1.rooms[a](this);
                    yield this.loadRoom(new_room);
                }
            }
        });
    }
    loadRoom(x) {
        return __awaiter(this, void 0, void 0, function* () {
            //Clears the room's logic loop if one
            //Was already running
            if (this.state.logic) {
                window.clearInterval(this.state.logic);
            }
            //This reference is used during initialization
            x.game = this;
            //Deletes each object in the room (which also unbinds their binds),
            //and unbinds the room's bindings.
            if (this.state.current_room !== undefined) {
                while (this.state.current_room.objects.length > 0) {
                    this.state.current_room.objects[0].delete();
                }
                for (let id of this.state.current_room.binds) {
                    controls_1.Unbind(id);
                }
            }
            let new_room = yield x.load();
            x.registerControls();
            x.registerParticles();
            this.state.logic = this.start_logic(logic_loop_interval);
            this.state.current_room = x;
            if (exports.DEBUG) {
                debug_1.debug_update_room_list();
                debug_1.debug_update_prefabs();
                debug_1.debug_update_obj_list();
            }
            if (!this.isRendering) {
                //This starts the render loop for the room
                this.render(0);
                this.isRendering = true;
            }
        });
    }
}
exports.game = game;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWUvbWFpbi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS9vYmplY3RzL2Fic3RyYWN0L2dyYXZpdHlfbWFzcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS9vYmplY3RzL3BsYWNlaG9sZGVyLnRzIiwid2VicGFjazovLy8uL3NyYy9nYW1lL29iamVjdHMvcGxhbmV0LnRzIiwid2VicGFjazovLy8uL3NyYy9nYW1lL29iamVjdHMvcHJlZmFicy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS9vYmplY3RzL3N1bi50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS9yb29tcy9wbGFjZWhvbGRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS9yb29tcy9yb29tcy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtZS9yb29tcy9zaW11bGF0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy9saWIvYXVkaW8udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jb2xsaXNpb24udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9jb250cm9scy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2RlYnVnLnRzIiwid2VicGFjazovLy8uL3NyYy9saWIvaHVkLnRzIiwid2VicGFjazovLy8uL3NyYy9saWIvbWF0aC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL29iamVjdC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3JlbmRlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3Jvb20udHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi9zcHJpdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpYi90ZW1wbGF0ZXMvb2JqZWN0X3RlbXBsYXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9saWIvdGVtcGxhdGVzL3Jvb21fdGVtcGxhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3Zhbi50cyJdLCJu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QUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNyRDtBQUNILENBQUM7QUFFWSxxQkFBYSxHQUFHLENBQUMsQ0FBZSxFQUFDLENBQWEsRUFBRSxFQUFFO0lBQzdELElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQztJQUMvQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDOUUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUN4RCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzFJLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDM0ksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM1RSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNuQyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUs7SUFDbEMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdEMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNwQixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDekQ7U0FDSTtRQUNILENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUN2QztJQUNELENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdEIsQ0FBQztBQUVZLHVCQUFlLEdBQUcsQ0FBQyxDQUFnQixFQUFFLENBQWMsRUFBRSxFQUFFO0lBQ2xFLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDdEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDeEUsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEwsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ25NLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztJQUM5RSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxD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QyxDQUFDO2lCQUNaO2FBQ0Y7WUFDRCxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM5QixDQUFDLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUNyQixDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUV0QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDO1lBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztZQUM1QixJQUFJLGFBQUssRUFBRTtnQkFDVCw4QkFBc0IsRUFBRSxDQUFDO2dCQUN6Qiw0QkFBb0IsRUFBRSxDQUFDO2dCQUN2Qiw2QkFBcUIsRUFBRSxDQUFDO2FBQ3pCO1lBR0QsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3JCLDBDQUEwQztnQkFDMUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzthQUN6QjtRQUNILENBQUM7S0FBQTtDQUNGO0FBelJELG9CQXlSQyIsImZpbGUiOiJ2YW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9nYW1lL21haW4udHNcIik7XG4iLCJpbXBvcnQge1ZlY3RvcixvYmpfc3RhdGUscm9vbV9zdGF0ZX0gZnJvbSBcIi4uL2xpYi9zdGF0ZVwiO1xyXG5pbXBvcnQge2dhbWUsR2V0Vmlld3BvcnREaW1lbnNpb25zLHZpZXdwb3J0fSBmcm9tIFwiLi4vdmFuXCI7XHJcbmltcG9ydCB7IGdyYXZpdHlfbWFzcyB9IGZyb20gXCIuL29iamVjdHMvYWJzdHJhY3QvZ3Jhdml0eV9tYXNzXCI7XHJcbmltcG9ydCB7IHNpbXVsYXRpb24gfSBmcm9tIFwiLi9yb29tcy9zaW11bGF0aW9uXCI7XHJcblxyXG5sZXQgY2FudmFzX2VsZW1lbnQ6SFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhcmdldFwiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHJcbmRlY2xhcmUgZ2xvYmFsIHtcclxuICBpbnRlcmZhY2UgV2luZG93IHsgZnVuY3Rpb25zOiBhbnk7IH1cclxufVxyXG5cclxuaW50ZXJmYWNlIGdsb2JhbHN7XHJcbiAgXHJcbn1cclxuXHJcbndpbmRvdy5mdW5jdGlvbnMgPSB7XHJcbiAgc2V0VHJhaWxzOihib29sOmJvb2xlYW4pPT57XHJcbiAgICBsZXQgcm9vbSA9IGcuZ2V0Um9vbSgpIGFzIHNpbXVsYXRpb247XHJcbiAgICByb29tLnN0YXRlLnRyYWlsc19lbmFibGVkID0gYm9vbDtcclxuICB9LFxyXG4gIHNldFRyYWlsc0xpZmV0aW1lOihuOm51bWJlcik9PntcclxuICAgIGxldCByb29tID0gZy5nZXRSb29tKCkgYXMgc2ltdWxhdGlvbjtcclxuICAgIHJvb20uc3RhdGUudHJhaWxfbGlmZXRpbWUgPSBuO1xyXG4gIH0sXHJcbiAgc2V0VHJhaWxzSW50ZXJ2YWw6KG46bnVtYmVyKT0+e1xyXG4gICAgbGV0IHJvb20gPSBnLmdldFJvb20oKSBhcyBzaW11bGF0aW9uO1xyXG4gICAgbGV0IG9ianMgPSByb29tLmdldE9iakJ5VGFnKFwibWFzc1wiKSBhcyBncmF2aXR5X21hc3NbXTtcclxuICAgIGZvcihsZXQgbyBvZiBvYmpzKXtcclxuICAgICAgby5zdGF0ZS50aWNrX3RpbWVyID0gMDtcclxuICAgIH1cclxuICAgIHJvb20uc3RhdGUudHJhaWxfaW50ZXJ2YWwgPSBuO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGxldCBnID0gbmV3IGdhbWU8Z2xvYmFscz4oY2FudmFzX2VsZW1lbnQuZ2V0Q29udGV4dChcIjJkXCIpLHt9KTtcclxuXHJcbmcubG9hZFJvb21TdHJpbmcoXCJzaW11bGF0aW9uXCIpO1xyXG5cclxuIiwiXG5pbXBvcnQge29iaiwgcm90YXRpb25fbGVuZ3RofSBmcm9tIFwiLi4vLi4vLi4vbGliL29iamVjdFwiO1xuaW1wb3J0IHsgb2JqX3N0YXRlLCBWZWN0b3IgfSBmcm9tIFwiLi4vLi4vLi4vbGliL3N0YXRlXCI7XG5pbXBvcnQgeyBzaW11bGF0aW9uIH0gZnJvbSBcIi4uLy4uL3Jvb21zL3NpbXVsYXRpb25cIjtcblxuaW50ZXJmYWNlIGdyYXZpdHlfbWFzc19zdGF0ZSBleHRlbmRzIG9ial9zdGF0ZXtcbiAgdGlja190aW1lcjpudW1iZXI7XG59XG4gICAgXG5pbnRlcmZhY2UgZ3Jhdml0eV9tYXNzX3BhcmFtZXRlcnN7XG4gIG1hc3M6bnVtYmVyXG59XG4gICAgXG5leHBvcnQgY2xhc3MgZ3Jhdml0eV9tYXNzIGV4dGVuZHMgb2Jqe1xuICByZW5kZXIgPSB0cnVlO1xuICBjb2xsaXNpb24gPSBmYWxzZTtcbiAgcGFydGljbGUgPSB0cnVlO1xuICBsYXllciA9IDI7XG4gIGZvcmNlczpWZWN0b3IgPSB7XG4gICAgeDowLFxuICAgIHk6MFxuICB9XG4gIHBhcmFtczpncmF2aXR5X21hc3NfcGFyYW1ldGVycztcbiAgc3RhdGU6Z3Jhdml0eV9tYXNzX3N0YXRlO1xuICBzdGF0aWMgZGVmYXVsdF9wYXJhbXM6Z3Jhdml0eV9tYXNzX3BhcmFtZXRlcnMgPSB7XG4gICAgbWFzczoxXG4gIH1cbiAgY29uc3RydWN0b3Ioc3RhdGU6b2JqX3N0YXRlLHBhcmFtczpncmF2aXR5X21hc3NfcGFyYW1ldGVycyA9IGdyYXZpdHlfbWFzcy5kZWZhdWx0X3BhcmFtcyl7XG4gICAgc3VwZXIoc3RhdGUscGFyYW1zKTtcbiAgICB0aGlzLnRhZ3MucHVzaChcIm1hc3NcIik7XG4gICAgdGhpcy5zdGF0ZS50aWNrX3RpbWVyID0gMDtcbiAgfVxuICBzdGF0ZWYodGltZV9kZWx0YTpudW1iZXIpe1xuICAgIGxldCByb29tID0gdGhpcy5nYW1lLmdldFJvb20oKSBhcyBzaW11bGF0aW9uO1xuICAgIGlmKHRoaXMuc3RhdGUudGlja190aW1lciA9PT0gMCAmJiByb29tLnN0YXRlLnRyYWlsc19lbmFibGVkKXtcbiAgICAgIC8vbGV0IG1hc3Nfb2JqZWN0cyA9IHRoaXMuZ2FtZS5nZXRSb29tKCkub2JqZWN0cy5sZW5ndGg7XG4gICAgICAvL2xldCBsaWZldGltZSA9IE1hdGgubWF4KDEwLCgoMSAtIChtYXNzX29iamVjdHMvNTApKSAqIDUwMDApKTtcbiAgICAgIHRoaXMuZW1pdFBhcnRpY2xlKFwidHJhY2VyXCIse3g6MCx5OjB9LHJvb20uc3RhdGUudHJhaWxfbGlmZXRpbWUsMCk7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUudGlja190aW1lcis9MTtcbiAgICBpZih0aGlzLnN0YXRlLnRpY2tfdGltZXIgPT09IHJvb20uc3RhdGUudHJhaWxfaW50ZXJ2YWwpIHRoaXMuc3RhdGUudGlja190aW1lciA9IDA7XG4gICAgXG4gICAgdGhpcy5mb3JjZXMueCA9IDA7XG4gICAgdGhpcy5mb3JjZXMueSA9IDA7XG4gICAgZm9yKGxldCBhIG9mIChyb29tLm9iamVjdHMuZmlsdGVyKChvKT0+by5pZCE9dGhpcy5pZCkgYXMgZ3Jhdml0eV9tYXNzW10pKXtcbiAgICAgIGxldCBkaXN0ID0gTWF0aC5tYXgodGhpcy5kaXN0YW5jZShhKSwwLjAwMDEpO1xuICAgICAgbGV0IGZvcmNlID0gcm9vbS5ncmF2X2NvbnN0ICogKHRoaXMucGFyYW1zLm1hc3Mvcm9vbS5kaXZfY29uc3QgKiBhLnBhcmFtcy5tYXNzL3Jvb20uZGl2X2NvbnN0KS9kaXN0O1xuICAgICAgbGV0IGFuZ2xlZF9mb3JjZSA9IHJvdGF0aW9uX2xlbmd0aChmb3JjZSx0aGlzLmFuZ2xlVG93YXJkcyhhKSk7XG4gICAgICB0aGlzLmZvcmNlcy54ICs9IGFuZ2xlZF9mb3JjZS54O1xuICAgICAgdGhpcy5mb3JjZXMueSArPSBhbmdsZWRfZm9yY2UueTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZS52ZWxvY2l0eS54ICs9ICh0aGlzLmZvcmNlcy54L3RoaXMucGFyYW1zLm1hc3MpICogdGltZV9kZWx0YS8xNi42NlxuICAgIHRoaXMuc3RhdGUudmVsb2NpdHkueSArPSAodGhpcy5mb3JjZXMueS90aGlzLnBhcmFtcy5tYXNzKSAqIHRpbWVfZGVsdGEvMTYuNjZcbiAgfVxuICByZW5kZXJmKHRpbWVfZGVsdGE6bnVtYmVyKXtcbiAgIHJldHVybiBzdXBlci5yZW5kZXJmKHRpbWVfZGVsdGEpOyBcbiAgfVxuICByZWdpc3Rlcl9hbmltYXRpb25zKCl7XG4gICAgXG4gIH1cbiAgcmVnaXN0ZXJfYXVkaW8oKXtcbiAgICBcbiAgfVxuICByZWdpc3Rlcl9jb250cm9scygpe1xuICAgICAgICBcbiAgfVxufVxuICAgICIsIlxuaW1wb3J0IHtvYmp9IGZyb20gXCIuLi8uLi9saWIvb2JqZWN0XCI7XG5pbXBvcnQgeyBvYmpfc3RhdGUsIFZlY3Rvcn0gZnJvbSBcIi4uLy4uL2xpYi9zdGF0ZVwiO1xuXG5pbnRlcmZhY2UgcGxhY2Vob2xkZXJfc3RhdGUgZXh0ZW5kcyBvYmpfc3RhdGV7XG4gICAgXG59XG4gICAgXG5pbnRlcmZhY2UgcGxhY2Vob2xkZXJfcGFyYW1ldGVyc3tcbiAgICBcbn1cbiAgICBcbmV4cG9ydCBjbGFzcyBwbGFjZWhvbGRlciBleHRlbmRzIG9iantcbiAgc3ByaXRlX3VybCA9IFwiLi9zcHJpdGVzL0Vycm9yLnBuZ1wiO1xuICBoZWlnaHQgPSAxMDA7XG4gIHdpZHRoID0gMTAwO1xuICB0YWdzOkFycmF5PHN0cmluZz4gPSBbXTtcbiAgY29sbGlzaW9uID0gdHJ1ZTtcbiAgcmVuZGVyID0gdHJ1ZTtcbiAgcGFyYW1zOnBsYWNlaG9sZGVyX3BhcmFtZXRlcnM7XG4gIHN0YXRpYyBkZWZhdWx0X3BhcmFtczpwbGFjZWhvbGRlcl9wYXJhbWV0ZXJzID0ge31cbiAgY29uc3RydWN0b3Ioc3RhdGU6b2JqX3N0YXRlLHBhcmFtczpwbGFjZWhvbGRlcl9wYXJhbWV0ZXJzID0gcGxhY2Vob2xkZXIuZGVmYXVsdF9wYXJhbXMpe1xuICAgIHN1cGVyKHN0YXRlLHBhcmFtcyk7XG4gIH1cbiAgc3RhdGVmKHRpbWVfZGVsdGE6bnVtYmVyKXtcbiAgICBcbiAgfVxuICByZW5kZXJmKHRpbWVfZGVsdGE6bnVtYmVyKXtcbiAgIHJldHVybiBzdXBlci5yZW5kZXJmKHRpbWVfZGVsdGEpOyBcbiAgfVxuICByZWdpc3Rlcl9hbmltYXRpb25zKCl7XG4gICAgXG4gIH1cbiAgcmVnaXN0ZXJfYXVkaW8oKXtcbiAgICBcbiAgfVxuICByZWdpc3Rlcl9jb250cm9scygpe1xuICAgICAgICBcbiAgfVxufVxuICAgICIsIlxuaW1wb3J0IHtvYmp9IGZyb20gXCIuLi8uLi9saWIvb2JqZWN0XCI7XG5pbXBvcnQgeyBvYmpfc3RhdGUsIFZlY3RvciB9IGZyb20gXCIuLi8uLi9saWIvc3RhdGVcIjtcbmltcG9ydCB7IGdyYXZpdHlfbWFzcyB9IGZyb20gXCIuL2Fic3RyYWN0L2dyYXZpdHlfbWFzc1wiO1xuXG5pbnRlcmZhY2UgcGxhbmV0X3N0YXRlIGV4dGVuZHMgb2JqX3N0YXRle1xuICAgIFxufVxuICAgIFxuaW50ZXJmYWNlIHBsYW5ldF9wYXJhbWV0ZXJze1xuICBtYXNzOm51bWJlclxufVxuICAgIFxuZXhwb3J0IGNsYXNzIHBsYW5ldCBleHRlbmRzIGdyYXZpdHlfbWFzc3tcbiAgc3ByaXRlX3VybCA9IFwiLi9zcHJpdGVzL3BsYW5ldC5wbmdcIjtcbiAgaGVpZ2h0ID0gMjAwO1xuICB3aWR0aCA9IDIwMDtcbiAgcGFyYW1zOnBsYW5ldF9wYXJhbWV0ZXJzO1xuICBzdGF0aWMgZGVmYXVsdF9wYXJhbXM6cGxhbmV0X3BhcmFtZXRlcnMgPSB7XG4gICAgbWFzczo1Ljk3ICogMTAqKjI0XG4gIH1cbiAgY29uc3RydWN0b3Ioc3RhdGU6b2JqX3N0YXRlLHBhcmFtczpwbGFuZXRfcGFyYW1ldGVycyA9IHBsYW5ldC5kZWZhdWx0X3BhcmFtcyl7XG4gICAgc3VwZXIoc3RhdGUscGFyYW1zKTtcbiAgfVxuICBzdGF0ZWYodGltZV9kZWx0YTpudW1iZXIpe1xuICAgIHN1cGVyLnN0YXRlZih0aW1lX2RlbHRhKTtcbiAgfVxuICByZW5kZXJmKHRpbWVfZGVsdGE6bnVtYmVyKXtcbiAgIHJldHVybiBzdXBlci5yZW5kZXJmKHRpbWVfZGVsdGEpOyBcbiAgfVxuICByZWdpc3Rlcl9hbmltYXRpb25zKCl7XG4gICAgXG4gIH1cbiAgcmVnaXN0ZXJfYXVkaW8oKXtcbiAgICBcbiAgfVxuICByZWdpc3Rlcl9jb250cm9scygpe1xuICAgICAgICBcbiAgfVxufVxuICAgICIsIlxuaW50ZXJmYWNlIHByZWZhYnMge1xuICBbaW5kZXg6c3RyaW5nXTphbnlcbn1cbmltcG9ydCB7cGxhY2Vob2xkZXJ9IGZyb20gXCIuL3BsYWNlaG9sZGVyXCI7XG5pbXBvcnQge3BsYW5ldH0gZnJvbSBcIi4vcGxhbmV0XCI7XG5pbXBvcnQge3N1bn0gZnJvbSBcIi4vc3VuXCI7XG5leHBvcnQgbGV0IHByZWZhYnM6cHJlZmFicyA9IHtcblx0cGxhY2Vob2xkZXI6cGxhY2Vob2xkZXIsXG5cdHBsYW5ldDpwbGFuZXQsXG5cdHN1bjpzdW4sXG59IiwiXG5pbXBvcnQge29ian0gZnJvbSBcIi4uLy4uL2xpYi9vYmplY3RcIjtcbmltcG9ydCB7IG9ial9zdGF0ZSwgVmVjdG9yIH0gZnJvbSBcIi4uLy4uL2xpYi9zdGF0ZVwiO1xuaW1wb3J0IHsgZ3Jhdml0eV9tYXNzIH0gZnJvbSBcIi4vYWJzdHJhY3QvZ3Jhdml0eV9tYXNzXCI7XG5cbmludGVyZmFjZSBzdW5fc3RhdGUgZXh0ZW5kcyBvYmpfc3RhdGV7XG4gICAgXG59XG4gICAgXG5pbnRlcmZhY2Ugc3VuX3BhcmFtZXRlcnN7XG4gIG1hc3M6bnVtYmVyXG59XG4gICAgXG5leHBvcnQgY2xhc3Mgc3VuIGV4dGVuZHMgZ3Jhdml0eV9tYXNze1xuICBzcHJpdGVfdXJsID0gXCIuL3Nwcml0ZXMvc3VuLnBuZ1wiO1xuICBoZWlnaHQgPSAyMDA7XG4gIHdpZHRoID0gMjAwO1xuICBwYXJhbXM6c3VuX3BhcmFtZXRlcnM7XG4gIHN0YXRpYyBkZWZhdWx0X3BhcmFtczpzdW5fcGFyYW1ldGVycyA9IHtcbiAgICBtYXNzOjEuOTg5ICogMTAqKjMwXG4gIH1cbiAgY29uc3RydWN0b3Ioc3RhdGU6b2JqX3N0YXRlLHBhcmFtczpzdW5fcGFyYW1ldGVycyA9IHN1bi5kZWZhdWx0X3BhcmFtcyl7XG4gICAgc3VwZXIoc3RhdGUscGFyYW1zKTtcbiAgICB0aGlzLnRhZ3MucHVzaChcInN1blwiKTtcbiAgfVxuICBzdGF0ZWYodGltZV9kZWx0YTpudW1iZXIpe1xuICAgIHN1cGVyLnN0YXRlZih0aW1lX2RlbHRhKTtcbiAgfVxuICByZW5kZXJmKHRpbWVfZGVsdGE6bnVtYmVyKXtcbiAgIHJldHVybiBzdXBlci5yZW5kZXJmKHRpbWVfZGVsdGEpOyBcbiAgfVxuICByZWdpc3Rlcl9hbmltYXRpb25zKCl7XG4gICAgXG4gIH1cbiAgcmVnaXN0ZXJfYXVkaW8oKXtcbiAgICBcbiAgfVxuICByZWdpc3Rlcl9jb250cm9scygpe1xuICAgICAgICBcbiAgfVxufVxuICAgICIsImltcG9ydCB7IHJvb20gfSBmcm9tIFwiLi4vLi4vbGliL3Jvb21cIjtcbmltcG9ydCB7IGdhbWUsIHZpZXdwb3J0IH0gZnJvbSBcIi4uLy4uL3ZhblwiO1xuaW1wb3J0IHsgc3RhdGVfY29uZmlnIH0gZnJvbSBcIi4uLy4uL2xpYi9yb29tXCI7XG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSBcIi4vcGxhY2Vob2xkZXIuanNvblwiO1xuaW1wb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4uLy4uL2xpYi9yZW5kZXJcIjtcbmxldCBjZmlnID0gY29uZmlnIGFzIHVua25vd24gYXMgc3RhdGVfY29uZmlnO1xuaW50ZXJmYWNlIHBsYWNlaG9sZGVyX3N0YXRlIHtcblxufVxuXG5cbmV4cG9ydCBjbGFzcyBwbGFjZWhvbGRlciBleHRlbmRzIHJvb208cGxhY2Vob2xkZXJfc3RhdGU+e1xuICBiYWNrZ3JvdW5kX3VybCA9IFwiLi9zcHJpdGVzL0Vycm9yLnBuZ1wiO1xuICBjb25zdHJ1Y3RvcihnYW1lOiBnYW1lPHVua25vd24+KSB7XG4gICAgc3VwZXIoZ2FtZSwgY2ZpZyk7XG4gICAgdGhpcy5nYW1lLnN0YXRlLmNhbWVyYXMucHVzaChuZXcgQ2FtZXJhKHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwLFxuICAgICAgZGltZW5zaW9uczogdmlld3BvcnQsXG4gICAgICBzY2FsaW5nOiAxLFxuICAgICAgZGVidWc6IGZhbHNlXG4gICAgfSxcbiAgICAgIHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMCxcbiAgICAgICAgaGVpZ2h0OiAxLFxuICAgICAgICB3aWR0aDogMVxuICAgICAgfSkpXG4gIH1cbiAgcmVnaXN0ZXJDb250cm9scygpIHtcblxuICB9XG4gIHJlZ2lzdGVyUGFydGljbGVzKCkge1xuXG4gIH1cbiAgc3RhdGVmKGRlbHRhX3RpbWU6IG51bWJlcikge1xuICAgIHN1cGVyLnN0YXRlZihkZWx0YV90aW1lKTtcbiAgfVxuXG59XG5cbiIsIlxuaW50ZXJmYWNlIHJvb21fZGlyIHtcbiAgW2luZGV4OnN0cmluZ106YW55XG59XG5pbXBvcnQge3BsYWNlaG9sZGVyfSBmcm9tIFwiLi9wbGFjZWhvbGRlclwiO1xuaW1wb3J0IHtzaW11bGF0aW9ufSBmcm9tIFwiLi9zaW11bGF0aW9uXCI7XG5leHBvcnQgbGV0IHJvb21zOnJvb21fZGlyID0ge1xuXHRwbGFjZWhvbGRlcjpwbGFjZWhvbGRlcixcblx0c2ltdWxhdGlvbjpzaW11bGF0aW9uLFxufSIsIlxuXG5pbXBvcnQgeyByb29tIH0gZnJvbSBcIi4uLy4uL2xpYi9yb29tXCI7XG5pbXBvcnQgeyBnYW1lLHZpZXdwb3J0IH0gZnJvbSBcIi4uLy4uL3ZhblwiO1xuaW1wb3J0IHsgc3RhdGVfY29uZmlnIH0gZnJvbSBcIi4uLy4uL2xpYi9yb29tXCI7XG5pbXBvcnQge0NhbWVyYX0gZnJvbSBcIi4uLy4uL2xpYi9yZW5kZXJcIjtcblxuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gXCIuL3NpbXVsYXRpb24uanNvblwiO1xuaW1wb3J0IHsgZXhlY190eXBlLCBoZWxkX2tleXMsIFBvbGxfTW91c2UgfSBmcm9tIFwiLi4vLi4vbGliL2NvbnRyb2xzXCI7XG5pbXBvcnQgeyBwbGFuZXQgfSBmcm9tIFwiLi4vb2JqZWN0cy9wbGFuZXRcIjtcbmltcG9ydCB7c3VufSBmcm9tIFwiLi4vb2JqZWN0cy9zdW5cIjtcbmltcG9ydCB7IERpc3RhbmNlIH0gZnJvbSBcIi4uLy4uL2xpYi9tYXRoXCI7XG5pbXBvcnQge1ZlY3Rvcn0gZnJvbSBcIi4uLy4uL2xpYi9zdGF0ZVwiO1xuaW1wb3J0IHsgSFVELFRleHQgfSBmcm9tIFwiLi4vLi4vbGliL2h1ZFwiO1xuaW1wb3J0IHsgZyB9IGZyb20gXCIuLi9tYWluXCI7XG5pbXBvcnQgeyBncmF2aXR5X21hc3MgfSBmcm9tIFwiLi4vb2JqZWN0cy9hYnN0cmFjdC9ncmF2aXR5X21hc3NcIjtcbmxldCBjZmlnID0gY29uZmlnIGFzIHVua25vd24gYXMgc3RhdGVfY29uZmlnO1xuaW50ZXJmYWNlIHNpbXVsYXRpb25fc3RhdGUge1xuICBib3VuZF9tYXNzOmdyYXZpdHlfbWFzcyxcbiAgdHJhaWxzX2VuYWJsZWQ6Ym9vbGVhbixcbiAgdHJhaWxfbGlmZXRpbWU6bnVtYmVyLFxuICB0cmFpbF9pbnRlcnZhbDpudW1iZXJcbn1cblxuY2xhc3Mgc2ltX2h1ZCBleHRlbmRzIEhVRHtcbiAgc2V0VGV4dEVsZW1lbnRzKCl7XG4gICAgcmV0dXJuW1xuICAgICAgbmV3IFRleHQoe1xuICAgICAgICBwb3NpdGlvbjp7XG4gICAgICAgICAgeDoxMCxcbiAgICAgICAgICB5OnZpZXdwb3J0LmhlaWdodCAtIDMwXG4gICAgICAgIH0sXG4gICAgICAgIHNpemU6MTUsXG4gICAgICAgIGZvbnQ6XCJBbGF0YVwiLFxuICAgICAgICBjb2xvcjpcIndoaXRlXCIsXG4gICAgICAgIGFsaWduOlwibGVmdFwiLFxuICAgICAgICBzY2FsaW5nOjFcbiAgICAgIH0sKCk9PntcbiAgICAgICAgcmV0dXJuIGBSaWdodCBjbGljayB0byBzcGF3biBhIHN1bmA7XG4gICAgICB9KSxcbiAgICAgIG5ldyBUZXh0KHtcbiAgICAgICAgcG9zaXRpb246e1xuICAgICAgICAgIHg6MTAsXG4gICAgICAgICAgeTp2aWV3cG9ydC5oZWlnaHQgLSA1MFxuICAgICAgICB9LFxuICAgICAgICBzaXplOjE1LFxuICAgICAgICBmb250OlwiQWxhdGFcIixcbiAgICAgICAgY29sb3I6XCJ3aGl0ZVwiLFxuICAgICAgICBhbGlnbjpcImxlZnRcIixcbiAgICAgICAgc2NhbGluZzoxXG4gICAgICB9LCgpPT57XG4gICAgICAgIHJldHVybiBgTGVmdCBjbGljayB0byBzcGF3biBhIHBsYW5ldGA7XG4gICAgICB9KSxcbiAgICAgIG5ldyBUZXh0KHtcbiAgICAgICAgcG9zaXRpb246e1xuICAgICAgICAgIHg6MTAsXG4gICAgICAgICAgeTp2aWV3cG9ydC5oZWlnaHQgLSA3MFxuICAgICAgICB9LFxuICAgICAgICBzaXplOjE1LFxuICAgICAgICBmb250OlwiQWxhdGFcIixcbiAgICAgICAgY29sb3I6XCJ3aGl0ZVwiLFxuICAgICAgICBhbGlnbjpcImxlZnRcIixcbiAgICAgICAgc2NhbGluZzoxXG4gICAgICB9LCgpPT57XG4gICAgICAgIHJldHVybiBgTWlkZGxlIGNsaWNrIHRvIHNwYXduIGEgbGFyZ2Ugc3VuYDtcbiAgICAgIH0pLFxuICAgICAgbmV3IFRleHQoe1xuICAgICAgcG9zaXRpb246e1xuICAgICAgICB4OjEwLFxuICAgICAgICB5OnZpZXdwb3J0LmhlaWdodCAtIDkwXG4gICAgICB9LFxuICAgICAgc2l6ZToxNSxcbiAgICAgIGZvbnQ6XCJBbGF0YVwiLFxuICAgICAgY29sb3I6XCJ3aGl0ZVwiLFxuICAgICAgYWxpZ246XCJsZWZ0XCIsXG4gICAgICBzY2FsaW5nOjFcbiAgICB9LCgpPT57XG4gICAgICByZXR1cm4gYE51bWJlciBvZiBvYmplY3RzOiR7Zy5nZXRSb29tKCkub2JqZWN0cy5sZW5ndGh9YDtcbiAgICB9KV1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3Mgc2ltdWxhdGlvbiBleHRlbmRzIHJvb208c2ltdWxhdGlvbl9zdGF0ZT57XG4gIHJlbmRlciA9IGZhbHNlO1xuICBiYWNrZ3JvdW5kX3VybD1cInNwcml0ZXMvRXJyb3IucG5nXCI7XG4gIGdyYXZfY29uc3QgPSA2LjY3ICogMTAqKi0xMTtcbiAgZGl2X2NvbnN0ID0gMTAwMDAwMDAwMDtcbiAgY29uc3RydWN0b3IoZ2FtZTogZ2FtZTx1bmtub3duPikge1xuICAgIHN1cGVyKGdhbWUsIGNmaWcpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBib3VuZF9tYXNzOnVuZGVmaW5lZCxcbiAgICAgIHRyYWlsX2ludGVydmFsOjIsXG4gICAgICB0cmFpbF9saWZldGltZTozMDAwLFxuICAgICAgdHJhaWxzX2VuYWJsZWQ6dHJ1ZVxuICAgIH1cbiAgICB0aGlzLmdhbWUuc3RhdGUuY2FtZXJhcy5wdXNoKG5ldyBDYW1lcmEoe1xuICAgICAgeDogMCxcbiAgICAgIHk6IDAsXG4gICAgICBkaW1lbnNpb25zOiB2aWV3cG9ydCxcbiAgICAgIHNjYWxpbmc6IDAuMDUsXG4gICAgICBkZWJ1ZzogZmFsc2VcbiAgICB9LFxuICAgICAge1xuICAgICAgICB4OiAwLFxuICAgICAgICB5OiAwLFxuICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgIHdpZHRoOiAxXG4gICAgICB9LG5ldyBzaW1faHVkKCkpKTtcbiAgfVxuICBjbG9zZXN0U3VuKHBvczpWZWN0b3IpOnN1bntcbiAgICBsZXQgY2xvc2VzdDpzdW4gPSB1bmRlZmluZWQ7XG4gICAgbGV0IGNsb3Nlc3RfZGlzdDpOdW1iZXIgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcbiAgICBsZXQgc3VucyA9IHRoaXMuZ2V0T2JqQnlUYWcoXCJzdW5cIikgYXMgc3VuW107XG4gICAgZm9yKGxldCBzIG9mIHN1bnMpe1xuICAgICAgbGV0IGQgPSBEaXN0YW5jZShzLnN0YXRlLnBvc2l0aW9uLHBvcylcbiAgICAgIGlmKGQgPCBjbG9zZXN0X2Rpc3Qpe1xuICAgICAgICBjbG9zZXN0ID0gcztcbiAgICAgICAgY2xvc2VzdF9kaXN0ID0gZDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNsb3Nlc3Q7XG4gIH1cbiAgcmVnaXN0ZXJDb250cm9scygpIHtcbiAgICB0aGlzLmJpbmRDb250cm9sKFwiS2V5QVwiLGV4ZWNfdHlwZS5yZXBlYXQsKCk9PntcbiAgICAgIGxldCBzaGlmdF9oZWxkID0gaGVsZF9rZXlzW1wiU2hpZnRMZWZ0XCJdID8gMSA6IDA7XG4gICAgICBsZXQgY2FtID0gdGhpcy5nYW1lLnN0YXRlLmNhbWVyYXNbMF07XG4gICAgICBjYW0uc3RhdGUucG9zaXRpb24ueCA9IGNhbS5zdGF0ZS5wb3NpdGlvbi54IC0gKCg1ICsgc2hpZnRfaGVsZCAqIDUpICogKDEgLyBjYW0uc3RhdGUuc2NhbGluZykpO1xuICAgIH0pO1xuICAgIHRoaXMuYmluZENvbnRyb2woXCJLZXlEXCIsZXhlY190eXBlLnJlcGVhdCwoKT0+e1xuICAgICAgbGV0IHNoaWZ0X2hlbGQgPSBoZWxkX2tleXNbXCJTaGlmdExlZnRcIl0gPyAxIDogMDtcbiAgICAgIGxldCBjYW0gPSB0aGlzLmdhbWUuc3RhdGUuY2FtZXJhc1swXTtcbiAgICAgIGNhbS5zdGF0ZS5wb3NpdGlvbi54ID0gY2FtLnN0YXRlLnBvc2l0aW9uLnggKyAoKDUgKyBzaGlmdF9oZWxkICogNSkgKiAoMSAvIGNhbS5zdGF0ZS5zY2FsaW5nKSk7XG4gICAgfSk7XG4gICAgdGhpcy5iaW5kQ29udHJvbChcIktleVdcIixleGVjX3R5cGUucmVwZWF0LCgpPT57XG4gICAgICBsZXQgc2hpZnRfaGVsZCA9IGhlbGRfa2V5c1tcIlNoaWZ0TGVmdFwiXSA/IDEgOiAwO1xuICAgICAgbGV0IGNhbSA9IHRoaXMuZ2FtZS5zdGF0ZS5jYW1lcmFzWzBdO1xuICAgICAgY2FtLnN0YXRlLnBvc2l0aW9uLnkgPSBjYW0uc3RhdGUucG9zaXRpb24ueSArICgoNSArIHNoaWZ0X2hlbGQgKiA1KSAqICgxIC8gY2FtLnN0YXRlLnNjYWxpbmcpKTtcbiAgICB9KTtcbiAgICB0aGlzLmJpbmRDb250cm9sKFwiS2V5U1wiLGV4ZWNfdHlwZS5yZXBlYXQsKCk9PntcbiAgICAgIGxldCBzaGlmdF9oZWxkID0gaGVsZF9rZXlzW1wiU2hpZnRMZWZ0XCJdID8gMSA6IDA7XG4gICAgICBsZXQgY2FtID0gdGhpcy5nYW1lLnN0YXRlLmNhbWVyYXNbMF07XG4gICAgICBjYW0uc3RhdGUucG9zaXRpb24ueSA9IGNhbS5zdGF0ZS5wb3NpdGlvbi55IC0gKCg1ICsgc2hpZnRfaGVsZCAqIDUpICogKDEgLyBjYW0uc3RhdGUuc2NhbGluZykpO1xuICAgIH0pO1xuICAgIHRoaXMuYmluZENvbnRyb2woXCJtb3VzZTB1cFwiLGV4ZWNfdHlwZS5vbmNlLCgpPT57XG4gICAgICBsZXQgbW91c2UgPSBQb2xsX01vdXNlKHRoaXMuZ2FtZS5zdGF0ZS5jYW1lcmFzWzBdKTtcbiAgICAgIGxldCBvYmpzID0gdGhpcy5jaGVja09iamVjdHNQb2ludEluY2x1c2l2ZShtb3VzZSxbXCJtYXNzXCJdKSBhcyBncmF2aXR5X21hc3NbXTtcbiAgICAgIGlmKG9ianNbMF0pe1xuICAgICAgICBpZih0aGlzLnN0YXRlLmJvdW5kX21hc3MgJiYgb2Jqc1swXS5pZCA9PT0gdGhpcy5zdGF0ZS5ib3VuZF9tYXNzLmlkKXtcbiAgICAgICAgICB0aGlzLnN0YXRlLmJvdW5kX21hc3MgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICB0aGlzLnN0YXRlLmJvdW5kX21hc3MgPSBvYmpzWzBdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBsZXQgY2xvc2VzdF9zdW4gPSB0aGlzLmNsb3Nlc3RTdW4obW91c2UpO1xuICAgICAgICBsZXQgdmVsb2NpdHkgPSB7eDowLHk6LTIwfTtcbiAgICAgICAgaWYoY2xvc2VzdF9zdW4uc3RhdGUucG9zaXRpb24ueSA+IG1vdXNlLnkpXG4gICAgICAgICAgdmVsb2NpdHkueSA9IDIwO1xuICAgICAgICB0aGlzLmFkZEl0ZW0obmV3IHBsYW5ldCh7XG4gICAgICAgICAgcG9zaXRpb246bW91c2UsXG4gICAgICAgICAgdmVsb2NpdHksXG4gICAgICAgICAgcm90YXRpb246MCxcbiAgICAgICAgICBzY2FsaW5nOnt3aWR0aDoxLGhlaWdodDoxfVxuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLmJpbmRDb250cm9sKFwibW91c2UydXBcIixleGVjX3R5cGUub25jZSwoKT0+e1xuICAgICAgbGV0IG1vdXNlID0gUG9sbF9Nb3VzZSh0aGlzLmdhbWUuc3RhdGUuY2FtZXJhc1swXSk7XG4gICAgICBsZXQgY2xvc2VzdF9zdW4gPSB0aGlzLmNsb3Nlc3RTdW4obW91c2UpO1xuICAgICAgbGV0IHZlbG9jaXR5ID0ge3g6MCx5Oi02fTtcbiAgICAgIGlmKGNsb3Nlc3Rfc3VuLnN0YXRlLnBvc2l0aW9uLnkgPiBtb3VzZS55KVxuICAgICAgICB2ZWxvY2l0eS55ID0gNjtcbiAgICAgIHRoaXMuYWRkSXRlbShuZXcgc3VuKHtcbiAgICAgICAgcG9zaXRpb246bW91c2UsXG4gICAgICAgIHZlbG9jaXR5LFxuICAgICAgICByb3RhdGlvbjowLFxuICAgICAgICBzY2FsaW5nOnt3aWR0aDoyLGhlaWdodDoyfVxuICAgICAgfSkpO1xuICAgIH0pXG4gICAgdGhpcy5iaW5kQ29udHJvbChcIm1vdXNlMXVwXCIsZXhlY190eXBlLm9uY2UsKCk9PntcbiAgICAgIGxldCBtb3VzZSA9IFBvbGxfTW91c2UodGhpcy5nYW1lLnN0YXRlLmNhbWVyYXNbMF0pO1xuICAgICAgbGV0IGNsb3Nlc3Rfc3VuID0gdGhpcy5jbG9zZXN0U3VuKG1vdXNlKTtcbiAgICAgIGxldCB2ZWxvY2l0eSA9IHt4OjAseTotNn07XG4gICAgICBpZihjbG9zZXN0X3N1bi5zdGF0ZS5wb3NpdGlvbi55ID4gbW91c2UueSlcbiAgICAgICAgdmVsb2NpdHkueSA9IDY7XG4gICAgICB0aGlzLmFkZEl0ZW0obmV3IHN1bih7XG4gICAgICAgIHBvc2l0aW9uOm1vdXNlLFxuICAgICAgICB2ZWxvY2l0eSxcbiAgICAgICAgcm90YXRpb246MCxcbiAgICAgICAgc2NhbGluZzp7d2lkdGg6NSxoZWlnaHQ6NX1cbiAgICAgIH0se1xuICAgICAgICBtYXNzOjEuOTg5ICogMTAqKjMyXG4gICAgICB9KSk7XG4gICAgfSlcbiAgICB0aGlzLmJpbmRDb250cm9sKFwic2Nyb2xsdXBcIixleGVjX3R5cGUub25jZSwoKT0+e1xuICAgICAgbGV0IGNhbSA9IHRoaXMuZ2FtZS5zdGF0ZS5jYW1lcmFzWzBdIGFzIENhbWVyYTtcbiAgICAgIGNhbS5zdGF0ZS5zY2FsaW5nICs9IDAuMDU7XG4gICAgICBpZihjYW0uc3RhdGUuc2NhbGluZyA+IDEpIGNhbS5zdGF0ZS5zY2FsaW5nID0gMTtcbiAgICB9KVxuICAgIHRoaXMuYmluZENvbnRyb2woXCJzY3JvbGxkb3duXCIsZXhlY190eXBlLm9uY2UsKCk9PntcbiAgICAgIGxldCBjYW0gPSB0aGlzLmdhbWUuc3RhdGUuY2FtZXJhc1swXSBhcyBDYW1lcmE7XG4gICAgICBpZihjYW0uc3RhdGUuc2NhbGluZyA+IDAuMDEpe1xuICAgICAgICBjYW0uc3RhdGUuc2NhbGluZyAtPSAwLjAxO1xuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgcmVnaXN0ZXJQYXJ0aWNsZXMoKSB7XG4gICAgdGhpcy5wYXJ0aWNsZXNbXCJ0cmFjZXJcIl0gPSB7XG4gICAgICBzcHJpdGU6XCIuL3Nwcml0ZXMvdHJhY2VyLnBuZ1wiLFxuICAgICAgd2lkdGg6NTAsXG4gICAgICBoZWlnaHQ6NTBcbiAgICB9XG4gIH1cbiAgc3RhdGVmKGRlbHRhX3RpbWU6IG51bWJlcikge1xuICAgIHN1cGVyLnN0YXRlZihkZWx0YV90aW1lKTtcbiAgICBpZih0aGlzLnN0YXRlLmJvdW5kX21hc3Mpe1xuICAgICAgbGV0IGNhbSA9IHRoaXMuZ2FtZS5zdGF0ZS5jYW1lcmFzWzBdIGFzIENhbWVyYTtcbiAgICAgIGNhbS5zdGF0ZS5wb3NpdGlvbi55ID0gdGhpcy5zdGF0ZS5ib3VuZF9tYXNzLnN0YXRlLnBvc2l0aW9uLnk7XG4gICAgICBjYW0uc3RhdGUucG9zaXRpb24ueCA9IHRoaXMuc3RhdGUuYm91bmRfbWFzcy5zdGF0ZS5wb3NpdGlvbi54O1xuICAgIH1cbiAgfVxuXG59XG5cbiIsImltcG9ydCB7IHJvb3RfcGF0aCwgcGF0aCB9IGZyb20gXCIuL2RlYnVnXCI7XHJcbmltcG9ydCB7IERFQlVHIH0gZnJvbSBcIi4uL3ZhblwiO1xyXG5cclxuaW50ZXJmYWNlIHNvdW5kX3N0b3JhZ2Uge1xyXG4gIFtpbmRleDogc3RyaW5nXTogSFRNTEF1ZGlvRWxlbWVudFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgYXVkaW8ge1xyXG4gIHNvdW5kczogc291bmRfc3RvcmFnZSA9IHt9O1xyXG4gIGFkZChuYW1lOiBzdHJpbmcsIHVybDogc3RyaW5nKSB7XHJcbiAgICBsZXQgcCA9IHVybDtcclxuICAgIGlmIChERUJVRykge1xyXG4gICAgICBwID0gcGF0aC5qb2luKHJvb3RfcGF0aCwgdXJsKTtcclxuICAgIH1cclxuICAgIHRoaXMuc291bmRzW25hbWVdID0gbmV3IEF1ZGlvKHApO1xyXG4gIH1cclxuICBhc3luYyBsb2FkKCkge1xyXG4gICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLnNvdW5kcyk7XHJcbiAgICBsZXQgcHJvbWlzZXMgPSBrZXlzLm1hcCgoa2V5KSA9PiB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgdGhpcy5zb3VuZHNba2V5XS5hZGRFdmVudExpc3RlbmVyKFwiY2FucGxheXRocm91Z2hcIiwgKGUpID0+IHtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICAgIHRyeSB7XHJcbiAgICAgIGxldCB4ID0gYXdhaXQgUHJvbWlzZS5hbGwocHJvbWlzZXMpO1xyXG4gICAgICByZXR1cm4gKHgpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHBsYXkobmFtZTogc3RyaW5nLCB2b2x1bWU6IG51bWJlcikge1xyXG4gICAgbGV0IGEgPSB0aGlzLnNvdW5kc1tuYW1lXTtcclxuICAgIGEucGF1c2UoKVxyXG4gICAgYS5jdXJyZW50VGltZSA9IDA7XHJcbiAgICBhLnZvbHVtZSA9IHZvbHVtZTtcclxuICAgIGEucGxheSgpO1xyXG4gIH1cclxufSIsImltcG9ydCB7b2JqLGdldElkfSBmcm9tIFwiLi4vbGliL29iamVjdFwiO1xyXG5pbXBvcnQge29ial9zdGF0ZX0gZnJvbSBcIi4uL2xpYi9zdGF0ZVwiO1xyXG5pbXBvcnQge2RlZXB9IGZyb20gXCIuLi92YW5cIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgY29sbGlzaW9uX2JveHtcclxuICB4Om51bWJlcjtcclxuICB5Om51bWJlcjtcclxuICB3aWR0aDpudW1iZXI7XHJcbiAgaGVpZ2h0Om51bWJlcjtcclxufVxyXG5cclxuZW51bSBkaXJlY3Rpb257XHJcbiAgbGVmdCxcclxuICByaWdodCxcclxuICB1cCxcclxuICBkb3duXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRFbmNvbXBhc3NpbmdCb3gob2JqZWN0czpvYmpbXSk6Y29sbGlzaW9uX2JveHtcclxuICBsZXQgZmlyc3Rfb2JqZWN0ID0gb2JqZWN0c1swXS5nZXRCb3VuZGluZ0JveCgpO1xyXG4gIGxldCBtYXhfeSA9IGZpcnN0X29iamVjdC50b3BfcmlnaHQueTtcclxuICBsZXQgbWF4X3ggPSBmaXJzdF9vYmplY3QudG9wX3JpZ2h0Lng7XHJcbiAgbGV0IG1pbl95ID0gZmlyc3Rfb2JqZWN0LmJvdHRvbV9sZWZ0Lnk7XHJcbiAgbGV0IG1pbl94ID0gZmlyc3Rfb2JqZWN0LmJvdHRvbV9sZWZ0Lng7XHJcbiAgZm9yKGxldCBhID0gMTsgYSA8IG9iamVjdHMubGVuZ3RoO2ErKyl7XHJcbiAgICBsZXQgb2JqZWN0ID0gb2JqZWN0c1thXS5nZXRCb3VuZGluZ0JveCgpO1xyXG4gICAgaWYob2JqZWN0LnRvcF9yaWdodC55ID4gbWF4X3kpXHJcbiAgICAgIG1heF95ID0gb2JqZWN0LnRvcF9yaWdodC55O1xyXG4gICAgaWYob2JqZWN0LnRvcF9yaWdodC54ID4gbWF4X3gpXHJcbiAgICAgIG1heF94ID0gb2JqZWN0LnRvcF9yaWdodC54O1xyXG4gICAgaWYob2JqZWN0LmJvdHRvbV9sZWZ0LnkgPCBtaW5feSlcclxuICAgICAgbWluX3kgPSBvYmplY3QuYm90dG9tX2xlZnQueTtcclxuICAgIGlmKG9iamVjdC5ib3R0b21fbGVmdC54IDwgbWluX3gpXHJcbiAgICAgIG1pbl94ID0gb2JqZWN0LmJvdHRvbV9sZWZ0Lng7XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICB4Om1pbl94ICsgKG1heF94IC0gbWluX3gpLzIsXHJcbiAgICB5Om1pbl95ICsgKG1heF95IC0gbWluX3kpLzIsXHJcbiAgICBoZWlnaHQ6bWF4X3kgLSBtaW5feSxcclxuICAgIHdpZHRoOm1heF94IC0gbWluX3hcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja19hbGxfb2JqZWN0cyhjOiBjb2xsaXNpb25fYm94LG9ianM6b2JqW10sZXhlbXB0aW9uOnN0cmluZ1tdID0gW10pOm9ialtde1xyXG4gIHJldHVybiBvYmpzLmZpbHRlcigoYSk9PighZXhlbXB0aW9uLnNvbWUoKGIpPT5hLnRhZ3MuaW5kZXhPZihiKSAhPT0gLTEpICYmIGEuY29sbGlkZXNXaXRoQm94KGMpKSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja19hbGxfY29sbGlzaW9ucyhjOiBjb2xsaXNpb25fYm94LG9ianM6b2JqW10sZXhlbXB0aW9uOnN0cmluZ1tdID0gW10pOkFycmF5PG9iaj57XHJcbiAgbGV0IG1hdGNoZWQgPSBbXTtcclxuICBmb3IgKGxldCBhIG9mIG9ianMpIHtcclxuICAgIGlmICghZXhlbXB0aW9uLnNvbWUoKGIpPT5hLnRhZ3MuaW5kZXhPZihiKSAhPT0gLTEpICYmIGEuY29sbGlzaW9uICYmIGEuY29sbGlkZXNXaXRoQm94KGMpKSB7XHJcbiAgICAgIG1hdGNoZWQucHVzaChhKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG1hdGNoZWRcclxufVxyXG4vL0NoZWNrcyB1cCB0byB0aGUgZmlyc3QgY29sbGlzaW9uXHJcbmV4cG9ydCBmdW5jdGlvbiBjaGVja19jb2xsaXNpb25zKGM6IGNvbGxpc2lvbl9ib3gsIG9ianM6IG9ialtdLCBleGVtcHRpb246c3RyaW5nKSB7XHJcbiAgZm9yIChsZXQgYSBvZiBvYmpzKSB7XHJcbiAgICBpZiAoYS5pZCAhPT0gZXhlbXB0aW9uICYmIGEuY29sbGlzaW9uICYmIGEuY29sbGlkZXNXaXRoQm94KGMpKSB7XHJcbiAgICAgIHJldHVybiBhO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gbnVsbDtcclxufVxyXG5cclxuZnVuY3Rpb24gdmVsb2NpdHlfbWF4KHZlbG9jaXR5Om51bWJlcixib3g6Y29sbGlzaW9uX2JveCxvYmpzOm9ialtdLCBleGVtcHRpb246c3RyaW5nLGRpcjpkaXJlY3Rpb24pe1xyXG4gIGxldCBjb2xsaXNpb24gPSBjaGVja19jb2xsaXNpb25zKGJveCwgb2JqcywgZXhlbXB0aW9uKTtcclxuICBpZihjb2xsaXNpb24gPT0gbnVsbCl7XHJcbiAgICByZXR1cm4gdmVsb2NpdHk7XHJcbiAgfVxyXG4gIGVsc2V7XHJcbiAgICBsZXQgY29sbGlkZXIgPSBjb2xsaXNpb247XHJcbiAgICBsZXQgb3JpZ2luID0gZ2V0SWQob2JqcyxleGVtcHRpb24pO1xyXG4gICAgbGV0IG9yaWdfc3QgPSBvcmlnaW4uc3RhdGUgYXMgb2JqX3N0YXRlO1xyXG4gICAgbGV0IGNvbGxpZGVyX3N0ID0gY29sbGlkZXIuc3RhdGUgYXMgb2JqX3N0YXRlO1xyXG4gICAgbGV0IG9yaWdfY29sID0gb3JpZ2luLmdldEZ1bGxDb2xsaXNpb25Cb3goKTtcclxuICAgIGxldCBjb2xsaWRlcl9jb2wgPSBjb2xsaWRlci5nZXRGdWxsQ29sbGlzaW9uQm94KCk7XHJcbiAgICBpZihkaXIgPT0gZGlyZWN0aW9uLmxlZnQpe1xyXG4gICAgICByZXR1cm4gKG9yaWdfY29sLnggLSBvcmlnX2NvbC53aWR0aC8yKSAtIChjb2xsaWRlcl9jb2wueCArIGNvbGxpZGVyX2NvbC53aWR0aC8yKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYoZGlyID09IGRpcmVjdGlvbi5yaWdodCl7XHJcbiAgICAgIHJldHVybiAoY29sbGlkZXJfY29sLnggLSBjb2xsaWRlcl9jb2wud2lkdGgvMikgLSAob3JpZ19jb2wueCArIG9yaWdfY29sLndpZHRoLzIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZihkaXIgPT0gZGlyZWN0aW9uLmRvd24pe1xyXG4gICAgICByZXR1cm4gKG9yaWdfY29sLnkgLSBvcmlnX2NvbC5oZWlnaHQvMikgLSAoY29sbGlkZXJfY29sLnkgKyBjb2xsaWRlcl9jb2wuaGVpZ2h0LzIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZihkaXIgPT0gZGlyZWN0aW9uLnVwKXtcclxuICAgICAgcmV0dXJuIChjb2xsaWRlcl9jb2wueSAtIGNvbGxpZGVyX2NvbC5oZWlnaHQvMikgLSAob3JpZ19jb2wueSArIG9yaWdfY29sLmhlaWdodC8yKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB2ZWxvY2l0eUNvbGxpc2lvbkNoZWNrKG9iamVjdDpvYmosbGlzdDpvYmpbXSkge1xyXG4gIGxpc3QgPSBbLi4ubGlzdF07XHJcbiAgbGV0IG9iID0gb2JqZWN0O1xyXG4gIGxldCBzdCA9IG9iamVjdC5zdGF0ZSBhcyBvYmpfc3RhdGU7XHJcbiAgbGV0IHhfdmVsID0gc3QudmVsb2NpdHkueDtcclxuICBsZXQgeV92ZWwgPSBzdC52ZWxvY2l0eS55O1xyXG4gIGlmKCFvYi5jb2xsaXNpb24pe1xyXG4gICAgKDxvYmpfc3RhdGU+b2Iuc3RhdGUpLnBvc2l0aW9uLnggKz0gKDxvYmpfc3RhdGU+b2Iuc3RhdGUpLnZlbG9jaXR5Lng7XHJcbiAgICAoPG9ial9zdGF0ZT5vYi5zdGF0ZSkucG9zaXRpb24ueSArPSAoPG9ial9zdGF0ZT5vYi5zdGF0ZSkudmVsb2NpdHkueTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgbGV0IGNvbF9ib3ggPSBvYi5nZXRGdWxsQ29sbGlzaW9uQm94KCk7XHJcbiAgaWYgKHhfdmVsID4gMCkge1xyXG4gICAgbGV0IGJveCA9IHtcclxuICAgICAgeDogY29sX2JveC54ICsgY29sX2JveC53aWR0aC8yICsgeF92ZWwvMixcclxuICAgICAgeTogY29sX2JveC55LFxyXG4gICAgICB3aWR0aDogeF92ZWwsXHJcbiAgICAgIGhlaWdodDogY29sX2JveC5oZWlnaHRcclxuICAgIH07XHJcbiAgICBsZXQgdmVsID0gdmVsb2NpdHlfbWF4KHN0LnZlbG9jaXR5LngsYm94LGxpc3Qsb2IuaWQsZGlyZWN0aW9uLnJpZ2h0KTtcclxuICAgIGlmKHZlbCA+IDApe1xyXG4gICAgICBzdC5wb3NpdGlvbi54ICs9IHZlbDtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHN0LnZlbG9jaXR5LnggPSAwOyAgXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHhfdmVsIDwgMCkge1xyXG4gICAgbGV0IGJveCA9IHtcclxuICAgICAgeDogeF92ZWwvMiArIGNvbF9ib3gueCAtIGNvbF9ib3gud2lkdGgvMixcclxuICAgICAgeTogY29sX2JveC55LFxyXG4gICAgICB3aWR0aDogLTEgKiB4X3ZlbCxcclxuICAgICAgaGVpZ2h0OiBjb2xfYm94LmhlaWdodFxyXG4gICAgfVxyXG4gICAgbGV0IHZlbCA9IHZlbG9jaXR5X21heChzdC52ZWxvY2l0eS54LGJveCxsaXN0LG9iLmlkLGRpcmVjdGlvbi5sZWZ0KTtcclxuICAgIGlmKHZlbCA8IDApe1xyXG4gICAgICBzdC5wb3NpdGlvbi54ICs9IHZlbDtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHN0LnZlbG9jaXR5LnggPSAwOyBcclxuICAgIH1cclxuICB9XHJcbiAgaWYgKHlfdmVsID4gMCkge1xyXG4gICAgbGV0IGJveCA9IHtcclxuICAgICAgeDogY29sX2JveC54LFxyXG4gICAgICB5OiBjb2xfYm94LnkgKyBjb2xfYm94LmhlaWdodC8yICsgeV92ZWwvMixcclxuICAgICAgd2lkdGg6IGNvbF9ib3gud2lkdGgsXHJcbiAgICAgIGhlaWdodDogeV92ZWxcclxuICAgIH1cclxuICAgIGxldCB2ZWwgPSB2ZWxvY2l0eV9tYXgoc3QudmVsb2NpdHkueSxib3gsbGlzdCxvYi5pZCxkaXJlY3Rpb24udXApO1xyXG4gICAgaWYodmVsID4gMCl7XHJcbiAgICAgIHN0LnBvc2l0aW9uLnkgKz0gdmVsO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgc3QudmVsb2NpdHkueSA9IDA7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2UgaWYgKHlfdmVsIDwgMCkge1xyXG4gICAgbGV0IGJveCA9IHtcclxuICAgICAgeDogY29sX2JveC54LFxyXG4gICAgICB5OiB5X3ZlbC8yICsgY29sX2JveC55IC0gY29sX2JveC5oZWlnaHQvMixcclxuICAgICAgd2lkdGg6IGNvbF9ib3gud2lkdGgsXHJcbiAgICAgIGhlaWdodDogLTEgKiB5X3ZlbFxyXG4gICAgfVxyXG4gICAgbGV0IHZlbCA9IHZlbG9jaXR5X21heChzdC52ZWxvY2l0eS55LGJveCxsaXN0LG9iLmlkLGRpcmVjdGlvbi5kb3duKTtcclxuICAgIGlmKHZlbCA8IDApe1xyXG4gICAgICBzdC5wb3NpdGlvbi55ICs9IHZlbDtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHN0LnZlbG9jaXR5LnkgPSAwO1xyXG4gICAgfVxyXG4gIH1cclxufSIsImltcG9ydCB7IGcgfSBmcm9tIFwiLi4vZ2FtZS9tYWluXCI7XHJcbmltcG9ydCB7Z2FtZSxQQVVTRUQsREVCVUcsIEdldFNjcmVlbkRpbWVuc2lvbnMsR2V0Vmlld3BvcnREaW1lbnNpb25zfSBmcm9tIFwiLi4vdmFuXCI7XHJcbmltcG9ydCB7IGNvbGxpc2lvbl9ib3ggfSBmcm9tIFwiLi9jb2xsaXNpb25cIjtcclxuaW1wb3J0IHtvYmp9IGZyb20gXCIuL29iamVjdFwiO1xyXG5pbXBvcnQgeyBDYW1lcmEgfSBmcm9tIFwiLi9yZW5kZXJcIjtcclxuaW1wb3J0IHtWZWN0b3J9IGZyb20gXCIuL3N0YXRlXCI7XHJcbmltcG9ydCB7ZGVidWdfc3RhdGV9IGZyb20gXCIuL2RlYnVnXCI7XHJcblxyXG5pbnRlcmZhY2UgbW91c2VQb3N7XHJcbiAgeDpudW1iZXIsXHJcbiAgeTpudW1iZXIsXHJcbiAgbGFzdDp7XHJcbiAgICB4Om51bWJlcixcclxuICAgIHk6bnVtYmVyXHJcbiAgfVxyXG59XHJcblxyXG5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgY29udHJvbF9mdW5je1xyXG4gICgpOnZvaWRcclxufVxyXG5cclxuaW50ZXJmYWNlIG1vdXNlQmluZHN7XHJcbiAgW2tleTpzdHJpbmddOiBBcnJheTxbY29udHJvbF9mdW5jLG9ial0+XHJcbn1cclxuXHJcbmludGVyZmFjZSBrZXlCaW5kc3tcclxuICBba2V5OnN0cmluZ106IEFycmF5PGNvbnRyb2xfZnVuYz5cclxufVxyXG5sZXQgdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0YXJnZXRcIik7XHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0X2NsaWNrX2hhbmRsZXIoZ2FtZTpnYW1lPHVua25vd24+KXtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKGUpPT57XHJcbiAgICBcclxuICAgIGxldCBtb3VzZSA9IFBvbGxfTW91c2UoZ2FtZS5zdGF0ZS5jYW1lcmFzWzBdKTtcclxuICAgIGlmKCFtb3VzZSl7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgbGV0IGJveDpjb2xsaXNpb25fYm94ID0ge1xyXG4gICAgICB4Om1vdXNlLngsXHJcbiAgICAgIHk6bW91c2UueSxcclxuICAgICAgaGVpZ2h0OjEsXHJcbiAgICAgIHdpZHRoOjFcclxuICAgIH07XHJcbiAgICBcclxuICBsZXQgZDpiaW5kW107XHJcbiAgaWYoREVCVUcpe1xyXG4gICAgaWYoZGVidWdfc3RhdGUubGFzdF9jbGlja2VkICYmIGRlYnVnX3N0YXRlLmxhc3RfY2xpY2tlZC5pZCA9PSBcImRlYnVnX3RhcmdldFwiKXtcclxuICAgICAgZCA9IFsuLi5kZWJ1Z19iaW5kc107XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKCFQQVVTRUQgJiYgZGVidWdfc3RhdGUubGFzdF9jbGlja2VkICYmIGRlYnVnX3N0YXRlLmxhc3RfY2xpY2tlZC5pZCA9PSBcInRhcmdldFwiKXtcclxuICAgICAgZD0gWy4uLmFsbF9iaW5kc11cclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGQgPSBbXTtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZXtcclxuICAgIGQgPSBbLi4uYWxsX2JpbmRzXTtcclxuICB9XHJcbiAgICBmb3IobGV0IGEgPSAwO2EgPCBkLmxlbmd0aDthKyspe1xyXG4gICAgICBsZXQgc2VsZWN0ZWQgPSBkW2FdO1xyXG4gICAgICBpZihzZWxlY3RlZC50eXBlID09PSBidHlwZS5tb3VzZSAmJiBzZWxlY3RlZC5rZXkgPT09IFwibW91c2UxXCIgJiYgc2VsZWN0ZWQuZXhlY3V0ZSA9PSBleGVjX3R5cGUub25jZSl7XHJcbiAgICAgICAgaWYoc2VsZWN0ZWQub2JqICE9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgaWYoc2VsZWN0ZWQub2JqLmNvbGxpZGVzV2l0aEJveChib3gpKXtcclxuICAgICAgICAgICAgc2VsZWN0ZWQuZnVuY3Rpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgIHNlbGVjdGVkLmZ1bmN0aW9uKCk7ICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gIFxyXG4gIH0pXHJcbn1cclxuXHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZSkgPT4ge1xyXG4gIGUucHJldmVudERlZmF1bHQoKTtcclxuICBcclxuICBsZXQgZDpiaW5kW107XHJcbiAgaWYoREVCVUcpe1xyXG4gICAgaWYoZGVidWdfc3RhdGUubGFzdF9jbGlja2VkICYmIGRlYnVnX3N0YXRlLmxhc3RfY2xpY2tlZC5pZCA9PSBcImRlYnVnX3RhcmdldFwiKXtcclxuICAgICAgZCA9IFsuLi5kZWJ1Z19iaW5kc107XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKCFQQVVTRUQgJiYgZGVidWdfc3RhdGUubGFzdF9jbGlja2VkICYmICBkZWJ1Z19zdGF0ZS5sYXN0X2NsaWNrZWQuaWQgPT0gXCJ0YXJnZXRcIil7XHJcbiAgICAgIGQ9IFsuLi5hbGxfYmluZHNdXHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICBkID0gW107XHJcbiAgICB9XHJcbiAgfVxyXG4gIGVsc2V7XHJcbiAgICBkID0gWy4uLmFsbF9iaW5kc107XHJcbiAgfVxyXG4gIGZvciAobGV0IGEgPSAwOyBhIDwgZC5sZW5ndGg7IGErKykge1xyXG4gICAgbGV0IHNlbGVjdGVkID0gZFthXTtcclxuICAgIGlmIChzZWxlY3RlZC50eXBlID09PSBidHlwZS5tb3VzZSAmJiBzZWxlY3RlZC5rZXkgPT09IChcIm1vdXNlXCIgKyBlLmJ1dHRvbiArIFwiZG93blwiKSAgJiYgIXNlbGVjdGVkLmV4ZWN1dGVkKSB7XHJcbiAgICAgIGlmKHNlbGVjdGVkLmV4ZWN1dGUgPT09IGV4ZWNfdHlwZS5vbmNlKXtcclxuICAgICAgICBzZWxlY3RlZC5mdW5jdGlvbigpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYoc2VsZWN0ZWQuZXhlY3V0ZSA9PT0gZXhlY190eXBlLnJlcGVhdCl7XHJcbiAgICAgICAgc2VsZWN0ZWQucmVwZWF0X3RpbWVyLmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgc2VsZWN0ZWQuZXhlY3V0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKHNlbGVjdGVkLnR5cGUgPT09IGJ0eXBlLm1vdXNlICYmIChzZWxlY3RlZC5rZXkgPT09IChcIm1vdXNlXCIgKyBlLmJ1dHRvbiArIFwidXBcIikgfHwgc2VsZWN0ZWQua2V5ID09IFwibW91c2V1cFwiKSAmJiBzZWxlY3RlZC5leGVjdXRlZCAmJiBzZWxlY3RlZC5leGVjdXRlID09PSBleGVjX3R5cGUub25jZSkge1xyXG4gICAgICBzZWxlY3RlZC5leGVjdXRlZCA9IGZhbHNlO1xyXG4gICB9XHJcbiAgIGVsc2UgaWYoc2VsZWN0ZWQudHlwZSA9PT0gYnR5cGUubW91c2UgJiYgKHNlbGVjdGVkLmtleSA9PT0gKFwibW91c2VcIiArIGUuYnV0dG9uICsgXCJ1cFwiKSB8fCBzZWxlY3RlZC5rZXkgPT0gXCJtb3VzZXVwXCIpICYmIHNlbGVjdGVkLmV4ZWN1dGVkICYmIHNlbGVjdGVkLmV4ZWN1dGUgPT09IGV4ZWNfdHlwZS5yZXBlYXQpe1xyXG4gICAgIGxldCBnID0gWy4uLnJlcGVhdF9iaW5kc107XHJcbiAgICAgZm9yKGxldCBhID0gMDsgYSA8IGcubGVuZ3RoO2ErKyl7XHJcbiAgICAgICBpZihnW2FdLmJpbmQuaWQgPT09IHNlbGVjdGVkLmlkKXtcclxuICAgICAgICAgc2VsZWN0ZWQuZXhlY3V0ZWQgPSBmYWxzZTtcclxuICAgICAgICAgZ1thXS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgYnJlYWs7XHJcbiAgICAgICB9XHJcbiAgICAgfVxyXG4gICB9XHJcbiAgfVxyXG59KVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChlKSA9PiB7XHJcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGxldCBkOmJpbmRbXTtcclxuICBpZihERUJVRyl7XHJcbiAgICBpZihkZWJ1Z19zdGF0ZS5sYXN0X2NsaWNrZWQgJiYgZGVidWdfc3RhdGUubGFzdF9jbGlja2VkLmlkID09IFwiZGVidWdfdGFyZ2V0XCIpe1xyXG4gICAgICBkID0gWy4uLmRlYnVnX2JpbmRzXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYoIVBBVVNFRCAmJiBkZWJ1Z19zdGF0ZS5sYXN0X2NsaWNrZWQgJiYgZGVidWdfc3RhdGUubGFzdF9jbGlja2VkLmlkID09IFwidGFyZ2V0XCIpe1xyXG4gICAgICBkPSBbLi4uYWxsX2JpbmRzXVxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgZCA9IFtdO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNle1xyXG4gICAgZCA9IFsuLi5hbGxfYmluZHNdO1xyXG4gIH1cclxuICBmb3IgKGxldCBhID0gMDsgYSA8IGQubGVuZ3RoOyBhKyspIHtcclxuICAgIGxldCBzZWxlY3RlZCA9IGRbYV07XHJcbiAgICBpZiAoc2VsZWN0ZWQudHlwZSA9PT0gYnR5cGUubW91c2UgJiYgc2VsZWN0ZWQua2V5ID09PSAoXCJtb3VzZVwiICsgZS5idXR0b24gKyBcInVwXCIpICAmJiAhc2VsZWN0ZWQuZXhlY3V0ZWQpIHtcclxuICAgICAgaWYoc2VsZWN0ZWQuZXhlY3V0ZSA9PT0gZXhlY190eXBlLm9uY2Upe1xyXG4gICAgICAgIHNlbGVjdGVkLmZ1bmN0aW9uKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZihzZWxlY3RlZC5leGVjdXRlID09PSBleGVjX3R5cGUucmVwZWF0KXtcclxuICAgICAgICBzZWxlY3RlZC5yZXBlYXRfdGltZXIuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBzZWxlY3RlZC5leGVjdXRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBpZiAoc2VsZWN0ZWQudHlwZSA9PT0gYnR5cGUubW91c2UgJiYgKHNlbGVjdGVkLmtleSA9PT0gKFwibW91c2VcIiArIGUuYnV0dG9uICsgXCJkb3duXCIpIHx8IHNlbGVjdGVkLmtleSA9PSBcIm1vdXNlZG93blwiKSAmJiBzZWxlY3RlZC5leGVjdXRlZCAmJiBzZWxlY3RlZC5leGVjdXRlID09PSBleGVjX3R5cGUub25jZSkge1xyXG4gICAgICAgc2VsZWN0ZWQuZXhlY3V0ZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYoc2VsZWN0ZWQudHlwZSA9PT0gYnR5cGUubW91c2UgJiYgKHNlbGVjdGVkLmtleSA9PT0gKFwibW91c2VcIiArIGUuYnV0dG9uICsgXCJkb3duXCIpIHx8IHNlbGVjdGVkLmtleSA9PSBcIm1vdXNlZG93blwiKSAmJiBzZWxlY3RlZC5leGVjdXRlZCAmJiBzZWxlY3RlZC5leGVjdXRlID09PSBleGVjX3R5cGUucmVwZWF0KXtcclxuICAgICAgbGV0IGcgPSBbLi4ucmVwZWF0X2JpbmRzXTtcclxuICAgICAgZm9yKGxldCBhID0gMDsgYSA8IGcubGVuZ3RoO2ErKyl7XHJcbiAgICAgICAgaWYoZ1thXS5iaW5kLmlkID09PSBzZWxlY3RlZC5pZCl7XHJcbiAgICAgICAgICBzZWxlY3RlZC5leGVjdXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgZ1thXS5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcbmludGVyZmFjZSBoZWxkX2tleXN7XHJcbiAgW2luZGV4OnN0cmluZ106Ym9vbGVhblxyXG59XHJcblxyXG5leHBvcnQgbGV0IGhlbGRfa2V5czpoZWxkX2tleXMgPSB7fTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwoZSk9PntcclxuICBsZXQgY29kZTpzdHJpbmc7XHJcblxyXG4gIGlmKGUuZGVsdGFZIDwgMCl7XHJcbiAgICBjb2RlID0gXCJzY3JvbGx1cFwiO1xyXG4gIH1cclxuICBlbHNlIGlmKGUuZGVsdGFZID4gMCl7XHJcbiAgICBjb2RlID0gXCJzY3JvbGxkb3duXCI7XHJcbiAgfVxyXG5cclxuICBsZXQgZDpiaW5kW107XHJcbiAgaWYoREVCVUcpe1xyXG4gICAgaWYoZGVidWdfc3RhdGUubGFzdF9jbGlja2VkICYmIGRlYnVnX3N0YXRlLmxhc3RfY2xpY2tlZC5pZCA9PSBcImRlYnVnX3RhcmdldFwiKXtcclxuICAgICAgZCA9IFsuLi5kZWJ1Z19iaW5kc107XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKCFQQVVTRUQgJiYgZGVidWdfc3RhdGUubGFzdF9jbGlja2VkICYmIGRlYnVnX3N0YXRlLmxhc3RfY2xpY2tlZC5pZCA9PSBcInRhcmdldFwiKXtcclxuICAgICAgZD0gWy4uLmFsbF9iaW5kc11cclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGQgPSBbXTtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZXtcclxuICAgIGQgPSBbLi4uYWxsX2JpbmRzXTtcclxuICB9XHJcbiAgXHJcbiAgZm9yIChsZXQgYSA9IDA7IGEgPCBkLmxlbmd0aDsgYSsrKSB7XHJcbiAgICBsZXQgc2VsZWN0ZWQgPSBkW2FdO1xyXG4gICAgaWYgKHNlbGVjdGVkLnR5cGUgPT09IGJ0eXBlLm1vdXNlICYmIHNlbGVjdGVkLmtleSA9PT0gY29kZSkge1xyXG4gICAgICBpZihzZWxlY3RlZC5leGVjdXRlID09PSBleGVjX3R5cGUub25jZSl7XHJcbiAgICAgICAgc2VsZWN0ZWQuZnVuY3Rpb24oKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSlcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCAoZSkgPT4ge1xyXG4gIGhlbGRfa2V5c1tlLmNvZGVdID0gdHJ1ZTtcclxuICBsZXQgZDpiaW5kW107XHJcbiAgaWYoREVCVUcpe1xyXG4gICAgaWYoZGVidWdfc3RhdGUubGFzdF9jbGlja2VkICYmIGRlYnVnX3N0YXRlLmxhc3RfY2xpY2tlZC5pZCA9PSBcImRlYnVnX3RhcmdldFwiKXtcclxuICAgICAgZCA9IFsuLi5kZWJ1Z19iaW5kc107XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmKCFQQVVTRUQgJiYgZGVidWdfc3RhdGUubGFzdF9jbGlja2VkICYmIGRlYnVnX3N0YXRlLmxhc3RfY2xpY2tlZC5pZCA9PSBcInRhcmdldFwiKXtcclxuICAgICAgZD0gWy4uLmFsbF9iaW5kc11cclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIGQgPSBbXTtcclxuICAgIH1cclxuICB9XHJcbiAgZWxzZXtcclxuICAgIGQgPSBbLi4uYWxsX2JpbmRzXTtcclxuICB9XHJcbiAgZm9yIChsZXQgYSA9IDA7IGEgPCBkLmxlbmd0aDsgYSsrKSB7XHJcbiAgICBsZXQgc2VsZWN0ZWQgPSBkW2FdO1xyXG4gICAgaWYgKHNlbGVjdGVkLnR5cGUgPT09IGJ0eXBlLmtleWJvYXJkICYmIHNlbGVjdGVkLmtleSA9PT0gZS5jb2RlICAmJiAhc2VsZWN0ZWQuZXhlY3V0ZWQpIHtcclxuICAgICAgaWYoc2VsZWN0ZWQuZXhlY3V0ZSA9PT0gZXhlY190eXBlLm9uY2Upe1xyXG4gICAgICAgIHNlbGVjdGVkLmZ1bmN0aW9uKCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZihzZWxlY3RlZC5leGVjdXRlID09PSBleGVjX3R5cGUucmVwZWF0KXtcclxuICAgICAgICBmb3IobGV0IGMgb2YgcmVwZWF0X2JpbmRzKXtcclxuICAgICAgICAgIGlmKGMuYmluZC5pZCA9PSBzZWxlY3RlZC5pZCl7XHJcbiAgICAgICAgICAgIGMuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHNlbGVjdGVkLmV4ZWN1dGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgXHJcbn0pXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKGUpID0+IHtcclxuICBoZWxkX2tleXNbZS5jb2RlXSA9IGZhbHNlO1xyXG4gIFxyXG4gIGxldCBkOmJpbmRbXTtcclxuICBpZihERUJVRyl7XHJcbiAgICBpZihkZWJ1Z19zdGF0ZS5sYXN0X2NsaWNrZWQgJiYgZGVidWdfc3RhdGUubGFzdF9jbGlja2VkLmlkID09IFwiZGVidWdfdGFyZ2V0XCIpe1xyXG4gICAgICBkID0gWy4uLmRlYnVnX2JpbmRzXTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYoIVBBVVNFRCAmJiBkZWJ1Z19zdGF0ZS5sYXN0X2NsaWNrZWQgJiYgZGVidWdfc3RhdGUubGFzdF9jbGlja2VkLmlkID09IFwidGFyZ2V0XCIpe1xyXG4gICAgICBkPSBbLi4uYWxsX2JpbmRzXVxyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgZCA9IFtdO1xyXG4gICAgfVxyXG4gIH1cclxuICBlbHNle1xyXG4gICAgZCA9IFsuLi5hbGxfYmluZHNdO1xyXG4gIH1cclxuICBmb3IgKGxldCBhID0gMDsgYSA8IGQubGVuZ3RoOyBhKyspIHtcclxuICAgIGxldCBzZWxlY3RlZCA9IGRbYV07XHJcbiAgICBpZiAoc2VsZWN0ZWQudHlwZSA9PT0gYnR5cGUua2V5Ym9hcmQgJiYgc2VsZWN0ZWQua2V5ID09PSBlLmNvZGUgJiYgc2VsZWN0ZWQuZXhlY3V0ZWQpIHtcclxuICAgICAgaWYoc2VsZWN0ZWQuZXhlY3V0ZSA9PT0gZXhlY190eXBlLm9uY2UgKXtcclxuICAgICAgICBzZWxlY3RlZC5leGVjdXRlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2UgaWYoc2VsZWN0ZWQuZXhlY3V0ZSA9PT0gZXhlY190eXBlLnJlcGVhdCl7XHJcbiAgICAgICAgbGV0IGcgPSBbLi4ucmVwZWF0X2JpbmRzXTtcclxuICAgICAgICBmb3IobGV0IGEgPSAwOyBhIDwgZy5sZW5ndGg7YSsrKXtcclxuICAgICAgICAgIGlmKGdbYV0uYmluZC5pZCA9PT0gc2VsZWN0ZWQuaWQpe1xyXG4gICAgICAgICAgICBzZWxlY3RlZC5leGVjdXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBnW2FdLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG59KVxyXG5sZXQgdHJhY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFyZ2V0XCIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4ge1xyXG4gIHZhciByZWN0ID0gKGUudGFyZ2V0IGFzIEhUTUxDYW52YXNFbGVtZW50KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA7XHJcbiAgLy9jb25zb2xlLmxvZyhlLnRhcmdldClcclxuICBsYXN0X3ggPSB4O1xyXG4gIGxhc3RfeSA9IHk7XHJcbiAgeCA9IGUuY2xpZW50WDsgLy94IHBvc2l0aW9uIHdpdGhpbiB0aGUgZWxlbWVudC5cclxuICB5ID0gZS5jbGllbnRZOyAgLy95IHBvc2l0aW9uIHdpdGhpbiB0aGUgZWxlbWVudC5cclxuXHJcbn0pXHJcblxyXG5leHBvcnQgZW51bSBidHlwZXtcclxuICBtb3VzZSxcclxuICBrZXlib2FyZFxyXG59XHJcblxyXG5pbnRlcmZhY2UgYmluZHtcclxuICBrZXk6c3RyaW5nLFxyXG4gIHR5cGU6YnR5cGUsXHJcbiAgaWQ6bnVtYmVyLFxyXG4gIGZ1bmN0aW9uOmNvbnRyb2xfZnVuYyxcclxuICBleGVjdXRlOmV4ZWNfdHlwZSxcclxuICByZXBlYXRfdGltZXI/OnJlcGVhdF9iaW5kLFxyXG4gIG9iaj86b2JqLFxyXG4gIGV4ZWN1dGVkPzpib29sZWFuLFxyXG4gIGludGVydmFsPzpudW1iZXIsXHJcbiAgY2FtZXJhPzpDYW1lcmFcclxufVxyXG5cclxuaW50ZXJmYWNlIHJlcGVhdF9iaW5ke1xyXG4gIGJpbmQ6YmluZCxcclxuICB0aW1lcjpudW1iZXIsXHJcbiAgaW50ZXJ2YWw6bnVtYmVyLFxyXG4gIGFjdGl2ZTpib29sZWFuXHJcbn1cclxuXHJcbmxldCB4ID0gMDtcclxubGV0IHkgPSAwO1xyXG5sZXQgbGFzdF94ID0gMDtcclxubGV0IGxhc3RfeSA9IDA7XHJcbmxldCBiaW5kczprZXlCaW5kcyA9IHt9O1xyXG5leHBvcnQgbGV0IGRlYnVnX2JpbmRzOmJpbmRbXSA9IFtdO1xyXG5sZXQgbW91c2VCaW5kczptb3VzZUJpbmRzID0ge307XHJcbmxldCBiaW5kX2NvdW50ID0gMDtcclxuXHJcbmxldCBhbGxfYmluZHM6QXJyYXk8YmluZD4gPSBbXVxyXG5cclxubGV0IHJlcGVhdF9iaW5kczpBcnJheTxyZXBlYXRfYmluZD4gPSBbXTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBQb2xsX01vdXNlKGNhbWVyYTpDYW1lcmEsY2FudmFzOkhUTUxDYW52YXNFbGVtZW50ID0gZy5zdGF0ZS5jYW52YXMpOlZlY3RvcntcclxuICBsZXQgaGVpZ2h0ID0gR2V0Vmlld3BvcnREaW1lbnNpb25zKCkuaGVpZ2h0O1xyXG4gIGxldCB3cmF0aW8gPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNhbnZhcykud2lkdGgpL0dldFZpZXdwb3J0RGltZW5zaW9ucygpLndpZHRoO1xyXG4gIGxldCB2cmF0aW8gPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGNhbnZhcykuaGVpZ2h0KS9HZXRWaWV3cG9ydERpbWVuc2lvbnMoKS5oZWlnaHQ7XHJcbiAgbGV0IGJvdW5kcyA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICBpZih4ID4gYm91bmRzLmxlZnQgJiYgeCA8IGJvdW5kcy5yaWdodCAmJiB5IDwgYm91bmRzLmJvdHRvbSAmJiB5ID4gYm91bmRzLnRvcCl7XHJcbiAgICBcclxuICAgIHJldHVybiAoe1xyXG4gICAgICB4OiAoKHggLSBib3VuZHMubGVmdCAtIGNhbWVyYS5zdGF0ZS52aWV3cG9ydC54KS93cmF0aW8vY2FtZXJhLnN0YXRlLnNjYWxpbmcgKyBjYW1lcmEuc3RhdGUucG9zaXRpb24ueCAtIGNhbWVyYS5zdGF0ZS5kaW1lbnNpb25zLndpZHRoL2NhbWVyYS5zdGF0ZS5zY2FsaW5nLzIpICxcclxuICAgICAgeTogKChoZWlnaHQgLSAoeS1ib3VuZHMudG9wKS92cmF0aW8pL2NhbWVyYS5zdGF0ZS5zY2FsaW5nICsgY2FtZXJhLnN0YXRlLnBvc2l0aW9uLnkgLSBjYW1lcmEuc3RhdGUuZGltZW5zaW9ucy5oZWlnaHQvY2FtZXJhLnN0YXRlLnNjYWxpbmcvMiAtIGNhbWVyYS5zdGF0ZS52aWV3cG9ydC55KVxyXG4gICAgfSlcclxuICB9XHJcbiAgcmV0dXJuIHVuZGVmaW5lZDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEV4ZWN1dGVSZXBlYXRCaW5kcyhiOm51bWJlcil7XHJcbiAgZm9yKGxldCBhIG9mIHJlcGVhdF9iaW5kcyl7XHJcbiAgICBpZihhLmJpbmQuZXhlY3V0ZSA9PT0gZXhlY190eXBlLnJlcGVhdCAmJiBhLnRpbWVyID09IDAgJiYgYS5hY3RpdmUpe1xyXG4gICAgICBhLmJpbmQuZnVuY3Rpb24oKTtcclxuICAgIH1cclxuICAgIGlmKGEuYWN0aXZlIHx8ICghYS5hY3RpdmUgJiYgYS50aW1lciAhPSAwKSlcclxuICAgICAgYS50aW1lciArPSBiO1xyXG4gICAgaWYoYS50aW1lciA+IGEuaW50ZXJ2YWwpe1xyXG4gICAgICBhLnRpbWVyID0gMDsgXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gVW5iaW5kKGJpbmRfaWQ6bnVtYmVyKXtcclxuICBmb3IobGV0IGEgPSAwO2EgPCBhbGxfYmluZHMubGVuZ3RoOyBhKyspe1xyXG4gICAgaWYoYWxsX2JpbmRzW2FdLmlkID09IGJpbmRfaWQpe1xyXG4gICAgICBhbGxfYmluZHMuc3BsaWNlKGEsMSk7XHJcbiAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICBmb3IobGV0IGEgPSAwO2EgPCByZXBlYXRfYmluZHMubGVuZ3RoOyBhKyspe1xyXG4gICAgaWYocmVwZWF0X2JpbmRzW2FdLmJpbmQuaWQgPT0gYmluZF9pZCl7XHJcbiAgICAgIHJlcGVhdF9iaW5kcy5zcGxpY2UoYSwxKTtcclxuICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBleGVjX3R5cGV7XHJcbiAgb25jZSxcclxuICByZXBlYXRcclxufVxyXG5cclxubGV0IGlkID0gMDtcclxuZXhwb3J0IGZ1bmN0aW9uIEJpbmQoa2V5bmFtZTpzdHJpbmcsZnVuYzpjb250cm9sX2Z1bmMsdHlwZTpleGVjX3R5cGUsaW50ZXJ2YWw6bnVtYmVyLG9iamVjdD86b2JqKTpudW1iZXJ7XHJcbiAgaWYoa2V5bmFtZS5zbGljZSgwLDUpID09PSBcIm1vdXNlXCIgfHwga2V5bmFtZS5zbGljZSgwLDYpID09PSBcInNjcm9sbFwiKXtcclxuICAgIGxldCBiOmJpbmQgPSB7XHJcbiAgICAgIGtleTprZXluYW1lLFxyXG4gICAgICB0eXBlOmJ0eXBlLm1vdXNlLFxyXG4gICAgICBpZCxcclxuICAgICAgZnVuY3Rpb246ZnVuYyxcclxuICAgICAgb2JqOm9iamVjdCxcclxuICAgICAgZXhlY3V0ZTp0eXBlLFxyXG4gICAgICBleGVjdXRlZDpmYWxzZSxcclxuICAgICAgaW50ZXJ2YWxcclxuICAgIH07XHJcbiAgICBpZih0eXBlID09IGV4ZWNfdHlwZS5yZXBlYXQpe1xyXG4gICAgICBiLnJlcGVhdF90aW1lciA9IHtcclxuICAgICAgICBiaW5kOmIsXHJcbiAgICAgICAgdGltZXI6MCxcclxuICAgICAgICBpbnRlcnZhbCxcclxuICAgICAgICBhY3RpdmU6ZmFsc2VcclxuICAgICAgfVxyXG4gICAgICByZXBlYXRfYmluZHMucHVzaChiLnJlcGVhdF90aW1lcik7XHJcbiAgICB9XHJcbiAgICBhbGxfYmluZHMucHVzaChiKTtcclxuXHJcbiAgfVxyXG4gIGVsc2V7XHJcbiAgICBsZXQgYjpiaW5kID0ge1xyXG4gICAgICBrZXk6a2V5bmFtZSxcclxuICAgICAgdHlwZTpidHlwZS5rZXlib2FyZCxcclxuICAgICAgaWQsXHJcbiAgICAgIGZ1bmN0aW9uOmZ1bmMsXHJcbiAgICAgIGV4ZWN1dGU6dHlwZSxcclxuICAgICAgZXhlY3V0ZWQ6ZmFsc2UsXHJcbiAgICAgIGludGVydmFsXHJcbiAgICB9XHJcbiAgICBpZih0eXBlID09IGV4ZWNfdHlwZS5yZXBlYXQpe1xyXG4gICAgICBiLnJlcGVhdF90aW1lciA9IHtcclxuICAgICAgICBiaW5kOmIsXHJcbiAgICAgICAgdGltZXI6MCxcclxuICAgICAgICBpbnRlcnZhbCxcclxuICAgICAgICBhY3RpdmU6ZmFsc2VcclxuICAgICAgfVxyXG4gICAgICByZXBlYXRfYmluZHMucHVzaChiLnJlcGVhdF90aW1lcik7XHJcbiAgICB9XHJcbiAgICBhbGxfYmluZHMucHVzaChiKTtcclxuICB9XHJcbiAgaWQrKztcclxuICByZXR1cm4gaWQgLSAxO1xyXG59IiwiaW1wb3J0IHsgREVCVUcsIFBBVVNFRCwgc2V0UGF1c2VkLCB2aWV3cG9ydCB9IGZyb20gXCIuLi92YW5cIjtcclxuZXhwb3J0IGxldCBwYXRoOmFueTsgXHJcbmxldCBmczphbnk7XHJcbmxldCBpcGNSZW5kZXJlcjphbnk7XHJcbmltcG9ydCB7IHByZWZhYnMgfSBmcm9tIFwiLi4vZ2FtZS9vYmplY3RzL3ByZWZhYnNcIjtcclxuZXhwb3J0IGxldCBwcm9qZWN0X3BhdGggPSBcIlwiO1xyXG5leHBvcnQgbGV0IHJvb3RfcGF0aCA9IFwiXCI7XHJcbmlmKERFQlVHKXtcclxuIHBhdGggPSAgd2luZG93LnJlcXVpcmUoXCJwYXRoXCIpO1xyXG4gZnMgPSB3aW5kb3cucmVxdWlyZShcImZzXCIpO1xyXG4gaXBjUmVuZGVyZXIgID0gd2luZG93LnJlcXVpcmUoXCJlbGVjdHJvblwiKS5pcGNSZW5kZXJlcjtcclxuIHByb2plY3RfcGF0aCA9IGlwY1JlbmRlcmVyLnNlbmRTeW5jKCdwYXRoLXJlcXVlc3QnLCAncGluZycpWzBdXHJcbiByb290X3BhdGggPSBwYXRoLmpvaW4ocHJvamVjdF9wYXRoLFwiLi5cIilcclxufVxyXG5pbXBvcnQgeyBvYmosIHBhcmFtcyB9IGZyb20gXCIuL29iamVjdFwiO1xyXG5pbXBvcnQgeyBvYmpfc3RhdGUgfSBmcm9tIFwiLi9zdGF0ZVwiO1xyXG5pbXBvcnQge29iamVjdF90ZW1wbGF0ZX0gZnJvbSBcIi4vdGVtcGxhdGVzL29iamVjdF90ZW1wbGF0ZVwiO1xyXG5pbXBvcnQge3Jvb21fdGVtcGxhdGV9IGZyb20gXCIuL3RlbXBsYXRlcy9yb29tX3RlbXBsYXRlXCI7XHJcbmltcG9ydCB7IGcgfSBmcm9tIFwiLi4vZ2FtZS9tYWluXCI7XHJcbmltcG9ydCB7IHJvb21zIGFzIHJvb21fbGlzdCB9IGZyb20gXCIuLi9nYW1lL3Jvb21zL3Jvb21zXCI7XHJcbmltcG9ydCB7IEJpbmQsIGJ0eXBlLCBQb2xsX01vdXNlLCBleGVjX3R5cGUsIGhlbGRfa2V5cywgZGVidWdfYmluZHMgfSBmcm9tIFwiLi4vbGliL2NvbnRyb2xzXCI7XHJcbmltcG9ydCB7IEhVRCwgVGV4dCB9IGZyb20gXCIuLi9saWIvaHVkXCI7XHJcbmltcG9ydCB7IENhbWVyYSB9IGZyb20gXCIuLi9saWIvcmVuZGVyXCI7XHJcbmltcG9ydCB7IFZlY3RvciwgZGltZW5zaW9uc30gZnJvbSBcIi4uL2xpYi9zdGF0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERlYnVnX2h1ZCBleHRlbmRzIEhVRCB7XHJcbiAgc2V0VGV4dEVsZW1lbnRzKCkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgbmV3IFRleHQoe1xyXG4gICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICB4OiAxMCxcclxuICAgICAgICAgIHk6IHZpZXdwb3J0LmhlaWdodCAtIDI0XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzaXplOiAyMixcclxuICAgICAgICBmb250OiBcIkFsYXRhXCIsXHJcbiAgICAgICAgY29sb3I6IFwid2hpdGVcIixcclxuICAgICAgICBhbGlnbjogXCJsZWZ0XCIsXHJcbiAgICAgICAgc2NhbGluZzogMVxyXG4gICAgICB9LCAoKSA9PiBkZWJ1Z19zdGF0ZS5yZW5kZXJfZGVsdGFfdGltZSA+IDAgPyBNYXRoLnJvdW5kKDEwMDAvZGVidWdfc3RhdGUucmVuZGVyX2RlbHRhX3RpbWUpICsgXCJcIiA6IFwiXCIpLFxyXG4gICAgICBuZXcgVGV4dCh7XHJcbiAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgeDogMTAsXHJcbiAgICAgICAgeTogMTBcclxuICAgICAgfSxcclxuICAgICAgc2l6ZTogMjIsXHJcbiAgICAgIGZvbnQ6IFwiQWxhdGFcIixcclxuICAgICAgY29sb3I6IFwid2hpdGVcIixcclxuICAgICAgYWxpZ246IFwibGVmdFwiLFxyXG4gICAgICBzY2FsaW5nOiAxXHJcbiAgICB9LCAoKSA9PiBgWDoke2RlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5wb3NpdGlvbi54LnRvRml4ZWQoMCl9YCksXHJcbiAgICBuZXcgVGV4dCh7XHJcbiAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgeDogMTAsXHJcbiAgICAgICAgeTogMzJcclxuICAgICAgfSxcclxuICAgICAgc2l6ZTogMjIsXHJcbiAgICAgIGZvbnQ6IFwiQWxhdGFcIixcclxuICAgICAgY29sb3I6IFwid2hpdGVcIixcclxuICAgICAgYWxpZ246IFwibGVmdFwiLFxyXG4gICAgICBzY2FsaW5nOiAxXHJcbiAgICB9LCAoKSA9PiBgWToke2RlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5wb3NpdGlvbi55LnRvRml4ZWQoMCl9YCksXHJcbiAgICBuZXcgVGV4dCh7XHJcbiAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgeDogdmlld3BvcnQud2lkdGggLSAxMCxcclxuICAgICAgICB5OiAzMlxyXG4gICAgICB9LFxyXG4gICAgICBzaXplOiAyMixcclxuICAgICAgZm9udDogXCJBbGF0YVwiLFxyXG4gICAgICBjb2xvcjogXCJ3aGl0ZVwiLFxyXG4gICAgICBhbGlnbjogXCJyaWdodFwiLFxyXG4gICAgICBzY2FsaW5nOiAxXHJcbiAgICB9LCAoKSA9PiB7XHJcbiAgICAgIGxldCBtb3VzZSA9IFBvbGxfTW91c2UoZGVidWdfc3RhdGUuY2FtZXJhLGRlYnVnX3N0YXRlLnRhcmdldCk7XHJcbiAgICAgIGlmKG1vdXNlKXtcclxuICAgICAgICByZXR1cm4gYCR7bW91c2UueC50b0ZpeGVkKDApfTpYYFxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBgOlhgXHJcbiAgICB9KSxcclxuICAgIG5ldyBUZXh0KHtcclxuICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICB4OiB2aWV3cG9ydC53aWR0aCAtIDEwLFxyXG4gICAgICAgIHk6IDEwXHJcbiAgICAgIH0sXHJcbiAgICAgIHNpemU6IDIyLFxyXG4gICAgICBmb250OiBcIkFsYXRhXCIsXHJcbiAgICAgIGNvbG9yOiBcIndoaXRlXCIsXHJcbiAgICAgIGFsaWduOiBcInJpZ2h0XCIsXHJcbiAgICAgIHNjYWxpbmc6IDFcclxuICAgIH0sICgpID0+IHtcclxuICAgICAgbGV0IG1vdXNlID0gUG9sbF9Nb3VzZShkZWJ1Z19zdGF0ZS5jYW1lcmEsZGVidWdfc3RhdGUudGFyZ2V0KTtcclxuICAgICAgaWYobW91c2Upe1xyXG4gICAgICAgIHJldHVybiBgJHttb3VzZS55LnRvRml4ZWQoMCl9OllgXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGA6WWBcclxuICAgIH0pLFxyXG4gICAgXTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWJ1Z19zdGF0ZWYodDogbnVtYmVyKSB7XHJcbiAgbGV0IG1vdXNlID0gUG9sbF9Nb3VzZShkZWJ1Z19zdGF0ZS5jYW1lcmEsIGRlYnVnX3N0YXRlLnRhcmdldCk7XHJcbiAgaWYgKGRlYnVnX3N0YXRlLmNhbWVyYS5odWQpIHtcclxuICAgIGRlYnVnX3N0YXRlLmNhbWVyYS5odWQuc3RhdGVmKHQpO1xyXG4gIH1cclxuICBpZiAoIVBBVVNFRCkge1xyXG4gICAgZGVidWdfdXBkYXRlX3Byb3BlcnRpZXNfZWxlbWVudCgpO1xyXG4gIH1cclxuICBpZihtb3VzZSl7XHJcbiAgICBpZiAoZGVidWdfc3RhdGUuc2VsZWN0ZWRfZWxlbWVudCkge1xyXG4gICAgICBpZiAoUEFVU0VEICYmIGhlbGRfa2V5c1tcIkNvbnRyb2xMZWZ0XCJdICYmIGRlYnVnX3N0YXRlLmN1cnJlbnRfYWN0aW9uLnByb3BlcnR5ID09IFwic2NhbGluZ1wiKSB7XHJcbiAgICAgICAgbGV0IGRpc3QgPSB7XHJcbiAgICAgICAgICB4OiBNYXRoLmFicyhtb3VzZS54IC0gZGVidWdfc3RhdGUuc2VsZWN0ZWRfZWxlbWVudC5zdGF0ZS5wb3NpdGlvbi54KSxcclxuICAgICAgICAgIHk6IE1hdGguYWJzKG1vdXNlLnkgLSBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9lbGVtZW50LnN0YXRlLnBvc2l0aW9uLnkpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlYnVnX3N0YXRlLnNlbGVjdGVkX2VsZW1lbnQuc3RhdGUuc2NhbGluZy53aWR0aCA9ICgyICogZGlzdC54KSAvIGRlYnVnX3N0YXRlLnNlbGVjdGVkX2VsZW1lbnQud2lkdGg7XHJcbiAgICAgICAgZGVidWdfc3RhdGUuc2VsZWN0ZWRfZWxlbWVudC5zdGF0ZS5zY2FsaW5nLmhlaWdodCA9ICgyICogZGlzdC55KSAvIGRlYnVnX3N0YXRlLnNlbGVjdGVkX2VsZW1lbnQuaGVpZ2h0O1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCBzdCA9IGRlYnVnX3N0YXRlLnNlbGVjdGVkX2VsZW1lbnQuc3RhdGUgYXMgdW5rbm93biBhcyBvYmpfc3RhdGU7XHJcbiAgICAgICAgc3QucG9zaXRpb24ueCA9IG1vdXNlLnggLSBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9lbGVtZW50X29mZnNldC54LFxyXG4gICAgICAgICAgc3QucG9zaXRpb24ueSA9IG1vdXNlLnkgLSBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9lbGVtZW50X29mZnNldC55XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChQQVVTRUQgJiYgZGVidWdfc3RhdGUucm90YXRpb25fZWxlbWVudCkge1xyXG4gICAgICBkZWJ1Z19zdGF0ZS5yb3RhdGlvbl9lbGVtZW50LnN0YXRlLnJvdGF0aW9uID0gZGVidWdfc3RhdGUucm90YXRpb25fZWxlbWVudC5hbmdsZVRvd2FyZHNQb2ludChtb3VzZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZGVidWdfc3RhdGUubWlkZGxlX3Bvc2l0aW9uKSB7XHJcbiAgICAgIGxldCBkaWZmX3kgPSBtb3VzZS55IC0gZGVidWdfc3RhdGUubWlkZGxlX3Bvc2l0aW9uLnk7XHJcbiAgICAgIGxldCBkaWZmX3ggPSBtb3VzZS54IC0gZGVidWdfc3RhdGUubWlkZGxlX3Bvc2l0aW9uLng7XHJcbiAgICAgIGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5wb3NpdGlvbi54ID0gZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnBvc2l0aW9uLnggKyAtMSAqIGRpZmZfeDtcclxuICAgICAgZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnBvc2l0aW9uLnkgPSBkZWJ1Z19zdGF0ZS5jYW1lcmEuc3RhdGUucG9zaXRpb24ueSArIC0xICogZGlmZl95O1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnX3VwZGF0ZV9yb29tX2xpc3QoKSB7XHJcbiAgbGV0IGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb21fbGlzdFwiKTtcclxuICBsaXN0LnRleHRDb250ZW50ID0gJyc7XHJcbiAgZm9yIChsZXQgcm9vbV9uYW1lIG9mIE9iamVjdC5rZXlzKHJvb21fbGlzdCkpIHtcclxuICAgIGxldCBwYXJhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XHJcbiAgICBwYXJhLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHJvb21fbmFtZSkpO1xyXG4gICAgcGFyYS5jbGFzc0xpc3QuYWRkKFwicm9vbV9saXN0X2l0ZW1cIik7XHJcbiAgICBwYXJhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBnLmxvYWRSb29tU3RyaW5nKHJvb21fbmFtZSk7XHJcbiAgICB9KVxyXG4gICAgbGlzdC5hcHBlbmRDaGlsZChwYXJhKTtcclxuICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBwcm9wZXJ0aWVzX2VsZW1lbnQge1xyXG4gIHBvc194OiBIVE1MSW5wdXRFbGVtZW50LFxyXG4gIHBvc195OiBIVE1MSW5wdXRFbGVtZW50LFxyXG4gIHZlbF94OiBIVE1MSW5wdXRFbGVtZW50LFxyXG4gIHZlbF95OiBIVE1MSW5wdXRFbGVtZW50LFxyXG4gIHJvdDogSFRNTElucHV0RWxlbWVudCxcclxuICBzY2FfeDogSFRNTElucHV0RWxlbWVudCxcclxuICBzY2FfeTogSFRNTElucHV0RWxlbWVudCxcclxuICByZW5kZXI6IEhUTUxJbnB1dEVsZW1lbnQsXHJcbiAgY29sbGlzaW9uOiBIVE1MSW5wdXRFbGVtZW50XHJcbn1cclxubGV0IHByb3BlcnRpZXNfZWxlbWVudHM6IHByb3BlcnRpZXNfZWxlbWVudCA9IHVuZGVmaW5lZDtcclxuaWYgKERFQlVHKSB7XHJcbiAgcHJvcGVydGllc19lbGVtZW50cyA9IHtcclxuICAgIHBvc194OiAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwb3NfeFwiKSksXHJcbiAgICBwb3NfeTogKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicG9zX3lcIikpLFxyXG4gICAgdmVsX3g6ICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZlbF94XCIpKSxcclxuICAgIHZlbF95OiAoPEhUTUxJbnB1dEVsZW1lbnQ+ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2ZWxfeVwiKSksXHJcbiAgICByb3Q6ICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdFwiKSksXHJcbiAgICBzY2FfeDogKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2NhX3hcIikpLFxyXG4gICAgc2NhX3k6ICg8SFRNTElucHV0RWxlbWVudD5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNjYV95XCIpKSxcclxuICAgIHJlbmRlcjogKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVuZGVyXCIpKSxcclxuICAgIGNvbGxpc2lvbjogKDxIVE1MSW5wdXRFbGVtZW50PmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29sbGlzaW9uXCIpKVxyXG4gIH1cclxuXHJcbiAgbGV0IGlucHV0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW5wdXRcIik7XHJcbiAgZm9yIChsZXQgYSA9IDA7IGEgPCBpbnB1dHMubGVuZ3RoOyBhKyspIHtcclxuICAgIGlucHV0c1thXS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgKDxIVE1MRWxlbWVudD5pbnB1dHNbYV0pLmZvY3VzKCk7XHJcbiAgICB9KVxyXG4gIH1cclxuICBsZXQgZm9jdXNlZDtcclxuICBsZXQgZGVidWdfdGFyZ2V0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWJ1Z190YXJnZXRcIilcclxuICBkZWJ1Z190YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICBmb3IgKGxldCBhID0gMDsgYSA8IGlucHV0cy5sZW5ndGg7IGErKykge1xyXG4gICAgICBpbnB1dHNbYV0uYmx1cigpO1xyXG4gICAgfVxyXG4gIH0pXHJcbiAgbGV0IHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidGFyZ2V0XCIpO1xyXG4gIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgIGZvciAobGV0IGEgPSAwOyBhIDwgaW5wdXRzLmxlbmd0aDsgYSsrKSB7XHJcbiAgICAgIGlucHV0c1thXS5ibHVyKCk7XHJcbiAgICB9XHJcbiAgfSlcclxuICBwcm9wZXJ0aWVzX2VsZW1lbnRzLnBvc194LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG5cclxuICAgIGxldCBlbGUgPSBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9wcm9wZXJ0aWVzX2VsZW1lbnQ7XHJcbiAgICBsZXQgbmV3X3ZhbCA9IHBhcnNlRmxvYXQocHJvcGVydGllc19lbGVtZW50cy5wb3NfeC52YWx1ZSkgfHwgMDtcclxuICAgIGRlYnVnX3N0YXRlLmFjdGlvbnNfc3RhY2sucHVzaCh7XHJcbiAgICAgIHByb3BlcnR5OiBcInBvc2l0aW9uXCIsXHJcbiAgICAgIGVsZW1lbnQ6IGVsZSxcclxuICAgICAgbmV3OiBKU09OLnN0cmluZ2lmeSh7IHg6IG5ld192YWwsIHk6IGVsZS5zdGF0ZS5wb3NpdGlvbi55IH0pLFxyXG4gICAgICBvbGQ6IEpTT04uc3RyaW5naWZ5KGVsZS5zdGF0ZS5wb3NpdGlvbilcclxuICAgIH0pXHJcbiAgICBlbGUuc3RhdGUucG9zaXRpb24ueCA9IG5ld192YWw7XHJcbiAgfSlcclxuICBwcm9wZXJ0aWVzX2VsZW1lbnRzLnBvc195LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG4gICAgbGV0IGVsZSA9IGRlYnVnX3N0YXRlLnNlbGVjdGVkX3Byb3BlcnRpZXNfZWxlbWVudDtcclxuICAgIGxldCBuZXdfdmFsID0gcGFyc2VGbG9hdChwcm9wZXJ0aWVzX2VsZW1lbnRzLnBvc195LnZhbHVlKSB8fCAwO1xyXG4gICAgZGVidWdfc3RhdGUuYWN0aW9uc19zdGFjay5wdXNoKHtcclxuICAgICAgcHJvcGVydHk6IFwicG9zaXRpb25cIixcclxuICAgICAgZWxlbWVudDogZWxlLFxyXG4gICAgICBuZXc6IEpTT04uc3RyaW5naWZ5KHsgeDogZWxlLnN0YXRlLnBvc2l0aW9uLngsIHk6IG5ld192YWwgfSksXHJcbiAgICAgIG9sZDogSlNPTi5zdHJpbmdpZnkoZWxlLnN0YXRlLnBvc2l0aW9uKVxyXG4gICAgfSlcclxuICAgIGVsZS5zdGF0ZS5wb3NpdGlvbi55ID0gbmV3X3ZhbDtcclxuICB9KVxyXG4gIHByb3BlcnRpZXNfZWxlbWVudHMudmVsX3guYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChlKSA9PiB7XHJcbiAgICBsZXQgZWxlID0gZGVidWdfc3RhdGUuc2VsZWN0ZWRfcHJvcGVydGllc19lbGVtZW50O1xyXG4gICAgZWxlLnN0YXRlLnZlbG9jaXR5LnggPSBwYXJzZUZsb2F0KHByb3BlcnRpZXNfZWxlbWVudHMudmVsX3gudmFsdWUpIHx8IDA7XHJcbiAgfSlcclxuICBwcm9wZXJ0aWVzX2VsZW1lbnRzLnZlbF95LmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG4gICAgbGV0IGVsZSA9IGRlYnVnX3N0YXRlLnNlbGVjdGVkX3Byb3BlcnRpZXNfZWxlbWVudDtcclxuICAgIGVsZS5zdGF0ZS52ZWxvY2l0eS55ID0gcGFyc2VGbG9hdChwcm9wZXJ0aWVzX2VsZW1lbnRzLnZlbF95LnZhbHVlKSB8fCAwO1xyXG4gIH0pXHJcbiAgcHJvcGVydGllc19lbGVtZW50cy5yb3QuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChlKSA9PiB7XHJcbiAgICBsZXQgZWxlID0gZGVidWdfc3RhdGUuc2VsZWN0ZWRfcHJvcGVydGllc19lbGVtZW50O1xyXG4gICAgbGV0IG5ld192YWwgPSBwYXJzZUZsb2F0KHByb3BlcnRpZXNfZWxlbWVudHMucm90LnZhbHVlKSB8fCAwO1xyXG4gICAgZGVidWdfc3RhdGUuYWN0aW9uc19zdGFjay5wdXNoKHtcclxuICAgICAgcHJvcGVydHk6IFwicm90YXRpb25cIixcclxuICAgICAgZWxlbWVudDogZWxlLFxyXG4gICAgICBuZXc6IEpTT04uc3RyaW5naWZ5KG5ld192YWwpLFxyXG4gICAgICBvbGQ6IEpTT04uc3RyaW5naWZ5KGVsZS5zdGF0ZS5yb3RhdGlvbilcclxuICAgIH0pXHJcbiAgICBlbGUuc3RhdGUucm90YXRpb24gPSBuZXdfdmFsO1xyXG4gIH0pXHJcbiAgcHJvcGVydGllc19lbGVtZW50cy5zY2FfeC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcclxuICAgIGxldCBlbGUgPSBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9wcm9wZXJ0aWVzX2VsZW1lbnQ7XHJcbiAgICBsZXQgbmV3X3ZhbCA9IHBhcnNlRmxvYXQocHJvcGVydGllc19lbGVtZW50cy5zY2FfeC52YWx1ZSkgfHwgMDtcclxuICAgIGRlYnVnX3N0YXRlLmFjdGlvbnNfc3RhY2sucHVzaCh7XHJcbiAgICAgIHByb3BlcnR5OiBcInNjYWxpbmdcIixcclxuICAgICAgZWxlbWVudDogZWxlLFxyXG4gICAgICBuZXc6IEpTT04uc3RyaW5naWZ5KHsgd2lkdGg6IG5ld192YWwsIGhlaWdodDogZWxlLnN0YXRlLnNjYWxpbmcuaGVpZ2h0IH0pLFxyXG4gICAgICBvbGQ6IEpTT04uc3RyaW5naWZ5KGVsZS5zdGF0ZS5zY2FsaW5nKVxyXG4gICAgfSlcclxuICAgIGVsZS5zdGF0ZS5zY2FsaW5nLndpZHRoID0gbmV3X3ZhbDtcclxuICB9KVxyXG4gIHByb3BlcnRpZXNfZWxlbWVudHMuc2NhX3kuYWRkRXZlbnRMaXN0ZW5lcihcImlucHV0XCIsIChlKSA9PiB7XHJcbiAgICBsZXQgZWxlID0gZGVidWdfc3RhdGUuc2VsZWN0ZWRfcHJvcGVydGllc19lbGVtZW50O1xyXG4gICAgbGV0IG5ld192YWwgPSBwYXJzZUZsb2F0KHByb3BlcnRpZXNfZWxlbWVudHMuc2NhX3kudmFsdWUpIHx8IDA7XHJcbiAgICBkZWJ1Z19zdGF0ZS5hY3Rpb25zX3N0YWNrLnB1c2goe1xyXG4gICAgICBwcm9wZXJ0eTogXCJzY2FsaW5nXCIsXHJcbiAgICAgIGVsZW1lbnQ6IGVsZSxcclxuICAgICAgbmV3OiBKU09OLnN0cmluZ2lmeSh7IHdpZHRoOiBlbGUuc3RhdGUuc2NhbGluZy53aWR0aCwgaGVpZ2h0OiBuZXdfdmFsIH0pLFxyXG4gICAgICBvbGQ6IEpTT04uc3RyaW5naWZ5KGVsZS5zdGF0ZS5zY2FsaW5nKVxyXG4gICAgfSlcclxuICAgIGVsZS5zdGF0ZS5zY2FsaW5nLmhlaWdodCA9IG5ld192YWw7XHJcbiAgfSlcclxuICBwcm9wZXJ0aWVzX2VsZW1lbnRzLnJlbmRlci5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcclxuICAgIGxldCBlbGUgPSBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9wcm9wZXJ0aWVzX2VsZW1lbnQ7XHJcbiAgICBlbGUucmVuZGVyID0gcHJvcGVydGllc19lbGVtZW50cy5yZW5kZXIuY2hlY2tlZDtcclxuICB9KVxyXG4gIHByb3BlcnRpZXNfZWxlbWVudHMuY29sbGlzaW9uLmFkZEV2ZW50TGlzdGVuZXIoXCJpbnB1dFwiLCAoZSkgPT4ge1xyXG4gICAgbGV0IGVsZSA9IGRlYnVnX3N0YXRlLnNlbGVjdGVkX3Byb3BlcnRpZXNfZWxlbWVudDtcclxuICAgIGVsZS5jb2xsaXNpb24gPSBwcm9wZXJ0aWVzX2VsZW1lbnRzLmNvbGxpc2lvbi5jaGVja2VkO1xyXG4gIH0pXHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWxldGVfZWxlbWVudFwiKS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgIGxldCBlbGUgPSBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9wcm9wZXJ0aWVzX2VsZW1lbnQ7XHJcbiAgICBlbGUuZGVsZXRlKCk7XHJcbiAgfSlcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlYnVnX3VwZGF0ZV9wcm9wZXJ0aWVzX2VsZW1lbnQoKSB7XHJcbiAgaWYgKGRlYnVnX3N0YXRlLnNlbGVjdGVkX3Byb3BlcnRpZXNfZWxlbWVudCkge1xyXG4gICAgbGV0IGVsZSA9IGRlYnVnX3N0YXRlLnNlbGVjdGVkX3Byb3BlcnRpZXNfZWxlbWVudDtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib2JqX25hbWVcIikuaW5uZXJIVE1MID0gZWxlLmNvbnN0cnVjdG9yLm5hbWU7XHJcbiAgICBwcm9wZXJ0aWVzX2VsZW1lbnRzLnBvc194LnZhbHVlID0gXCJcIiArIGVsZS5zdGF0ZS5wb3NpdGlvbi54LnRvRml4ZWQoMik7XHJcbiAgICBwcm9wZXJ0aWVzX2VsZW1lbnRzLnBvc195LnZhbHVlID0gXCJcIiArIGVsZS5zdGF0ZS5wb3NpdGlvbi55LnRvRml4ZWQoMik7XHJcbiAgICBwcm9wZXJ0aWVzX2VsZW1lbnRzLnZlbF94LnZhbHVlID0gXCJcIiArIGVsZS5zdGF0ZS52ZWxvY2l0eS54LnRvRml4ZWQoMik7XHJcbiAgICBwcm9wZXJ0aWVzX2VsZW1lbnRzLnZlbF95LnZhbHVlID0gXCJcIiArIGVsZS5zdGF0ZS52ZWxvY2l0eS55LnRvRml4ZWQoMik7XHJcbiAgICBwcm9wZXJ0aWVzX2VsZW1lbnRzLnJvdC52YWx1ZSA9IFwiXCIgKyBlbGUuc3RhdGUucm90YXRpb24udG9GaXhlZCgyKTtcclxuICAgIHByb3BlcnRpZXNfZWxlbWVudHMuc2NhX3gudmFsdWUgPSBcIlwiICsgZWxlLnN0YXRlLnNjYWxpbmcud2lkdGgudG9GaXhlZCgyKTtcclxuICAgIHByb3BlcnRpZXNfZWxlbWVudHMuc2NhX3kudmFsdWUgPSBcIlwiICsgZWxlLnN0YXRlLnNjYWxpbmcuaGVpZ2h0LnRvRml4ZWQoMik7XHJcbiAgICBwcm9wZXJ0aWVzX2VsZW1lbnRzLnJlbmRlci5jaGVja2VkID0gZWxlLnJlbmRlcjtcclxuICAgIHByb3BlcnRpZXNfZWxlbWVudHMuY29sbGlzaW9uLmNoZWNrZWQgPSBlbGUuY29sbGlzaW9uO1xyXG4gICAgbGV0IGxpc3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhcmFtc19saXN0XCIpO1xyXG4gICAgbGlzdC50ZXh0Q29udGVudCA9ICcnO1xyXG4gICAgZm9yIChsZXQgayBvZiBPYmplY3Qua2V5cyhlbGUucGFyYW1zKSkge1xyXG5cclxuICAgICAgbGV0IHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcclxuICAgICAgc3Bhbi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShrKSk7XHJcbiAgICAgIGxldCBpbnB1dDogSFRNTElucHV0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcclxuICAgICAgaWYgKHR5cGVvZiAoPHBhcmFtcz5lbGUucGFyYW1zKVtrXSA9PT0gXCJib29sZWFuXCIpIHtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiY2hlY2tib3hcIik7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAodHlwZW9mICg8cGFyYW1zPmVsZS5wYXJhbXMpW2tdID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcIm51bWJlclwiKTtcclxuICAgICAgfVxyXG4gICAgICBlbHNlIGlmICh0eXBlb2YgKDxwYXJhbXM+ZWxlLnBhcmFtcylba10gPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwidGV4dFwiKTtcclxuICAgICAgfVxyXG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBrKVxyXG4gICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCAoPHBhcmFtcz5lbGUucGFyYW1zKVtrXSArIFwiXCIpO1xyXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgICAgICBpbnB1dC5mb2N1cygpO1xyXG4gICAgICB9KVxyXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKFwiaW5wdXRcIiwgKGUpID0+IHtcclxuICAgICAgICBsZXQgZWxlID0gZGVidWdfc3RhdGUuc2VsZWN0ZWRfcHJvcGVydGllc19lbGVtZW50O1xyXG4gICAgICAgIGxldCB2YWw6IHN0cmluZyA9IGlucHV0LnZhbHVlO1xyXG4gICAgICAgIGlmICghaXNOYU4odmFsIGFzIHVua25vd24gYXMgbnVtYmVyKSkge1xyXG4gICAgICAgICAgKDxwYXJhbXM+ZWxlLnBhcmFtcylba10gPSBwYXJzZUZsb2F0KHZhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHZhbCA9PSBcInRydWVcIikge1xyXG4gICAgICAgICAgKDxwYXJhbXM+ZWxlLnBhcmFtcylba10gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh2YWwgPT0gXCJmYWxzZVwiKSB7XHJcbiAgICAgICAgICAoPHBhcmFtcz5lbGUucGFyYW1zKVtrXSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICg8cGFyYW1zPmVsZS5wYXJhbXMpW2tdID0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgICAgcC5hcHBlbmRDaGlsZChzcGFuKTtcclxuICAgICAgcC5hcHBlbmQoaW5wdXQpO1xyXG4gICAgICBsaXN0LmFwcGVuZChwKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVidWdfdXBkYXRlX29ial9saXN0KCkge1xyXG4gIGxldCBsaXN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvYmplY3RzX2xpc3RcIik7XHJcbiAgbGlzdC50ZXh0Q29udGVudCA9ICcnO1xyXG4gIGlmIChnLmdldFJvb20oKSkge1xyXG4gICAgZm9yIChsZXQgb2JqIG9mIGcuZ2V0Um9vbSgpLm9iamVjdHMuc2xpY2UoKS5yZXZlcnNlKCkpIHtcclxuICAgICAgbGV0IHBhcmEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgICAgcGFyYS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShvYmouY29uc3RydWN0b3IubmFtZSkpO1xyXG4gICAgICBwYXJhLmNsYXNzTGlzdC5hZGQoXCJvYmplY3RfbGlzdF9pdGVtXCIpO1xyXG4gICAgICBwYXJhLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICAgIGlmIChkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9wcm9wZXJ0aWVzX2VsZW1lbnQgPT0gPG9iaj5vYmopIHtcclxuICAgICAgICAgIGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5wb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sICg8b2JqPm9iaikuc3RhdGUucG9zaXRpb24pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgZGVidWdfc3RhdGUuc2VsZWN0ZWRfcHJvcGVydGllc19lbGVtZW50ID0gPG9iaj5vYmo7XHJcbiAgICAgICAgICBkZWJ1Z191cGRhdGVfcHJvcGVydGllc19lbGVtZW50KClcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICAgIGxpc3QuYXBwZW5kQ2hpbGQocGFyYSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVidWdfdXBkYXRlX3ByZWZhYnMoKSB7XHJcbiAgbGV0IHByZXMgPSBPYmplY3Qua2V5cyhwcmVmYWJzKS5tYXAoYXN5bmMgKG86IHN0cmluZykgPT4ge1xyXG4gICAgbGV0IGEgPSA8b2JqPihuZXcgcHJlZmFic1tvXSh7XHJcbiAgICAgIHBvc2l0aW9uOiB7IHg6IDAsIHk6IDAgfSxcclxuICAgICAgdmVsb2NpdHk6IHsgeDogMCwgeTogMCB9LFxyXG4gICAgICByb3RhdGlvbjogMCxcclxuICAgICAgc2NhbGluZzogeyB3aWR0aDogMSwgaGVpZ2h0OiAxIH1cclxuICAgIH0pKTtcclxuICAgIGF3YWl0IGEubG9hZCgpO1xyXG4gICAgYS5yZW5kZXIgPSB0cnVlO1xyXG4gICAgbGV0IG9ianMgPSBhLmNvbWJpbmVkT2JqZWN0cygpO1xyXG4gICAgZm9yIChsZXQgb2JqIG9mIG9ianMpIHtcclxuICAgICAgb2JqLlVuYmluZEFsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBmaWx0ZXJlZCA9IG9ianMuZmlsdGVyKChhKSA9PiBhLnJlbmRlcik7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBwcmVmYWI6IHByZWZhYnNbb10sXHJcbiAgICAgIG5hbWU6IGEuY29uc3RydWN0b3IubmFtZSxcclxuICAgICAgcmVuZGVyZWQ6IGZpbHRlcmVkLm1hcCgobykgPT4ge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICBuYW1lOiBvLmNvbnN0cnVjdG9yLm5hbWUsXHJcbiAgICAgICAgICByZW5kZXI6IG8ucmVuZGVyZigwKVxyXG4gICAgICAgIH1cclxuICAgICAgfSlcclxuICAgIH07XHJcblxyXG4gIH0pXHJcbiAgbGV0IGEgPSBhd2FpdCBQcm9taXNlLmFsbChwcmVzKTtcclxuXHJcbiAgbGV0IHRhcmdldCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJlZmFiX3RhcmdldFwiKTtcclxuICB0YXJnZXQudGV4dENvbnRlbnQgPSAnJztcclxuICBmb3IgKGxldCBwcmVmYWIgb2YgYSkge1xyXG5cclxuICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgbGV0IHBhcmEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcclxuICAgIHBhcmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocHJlZmFiLm5hbWUpKTtcclxuICAgIGRpdi5hcHBlbmRDaGlsZChwYXJhKTtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KHByZWZhYi5yZW5kZXJlZFswXS5yZW5kZXIpKSB7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgZGl2LmFwcGVuZChwcmVmYWIucmVuZGVyZWRbMF0ucmVuZGVyLnNwcml0ZS5zcHJpdGVfc2hlZXQpO1xyXG4gICAgfVxyXG4gICAgZGl2LmNsYXNzTGlzdC5hZGQoXCJwcmVmYWJfYm94XCIpO1xyXG4gICAgZGl2LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICBsZXQgdmFsID0ge1xyXG4gICAgICAgIHBvc2l0aW9uOiB7IHg6IGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5wb3NpdGlvbi54LCB5OiBkZWJ1Z19zdGF0ZS5jYW1lcmEuc3RhdGUucG9zaXRpb24ueSB9LFxyXG4gICAgICAgIHZlbG9jaXR5OiB7IHg6IDAsIHk6IDAgfSxcclxuICAgICAgICByb3RhdGlvbjogMCxcclxuICAgICAgICBzY2FsaW5nOiB7IHdpZHRoOiAxLCBoZWlnaHQ6IDEgfVxyXG4gICAgICB9O1xyXG4gICAgICBsZXQgb2JqID0gPG9iaj4obmV3IHByZWZhYi5wcmVmYWIodmFsKSk7XHJcbiAgICAgIGF3YWl0IGcuc3RhdGUuY3VycmVudF9yb29tLmFkZEl0ZW1zKG9iai5jb21iaW5lZE9iamVjdHMoKSk7XHJcbiAgICB9KTtcclxuICAgIHRhcmdldC5hcHBlbmQoZGl2KTtcclxuICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBkZWJ1Z19hY3Rpb24ge1xyXG4gIHByb3BlcnR5OiBzdHJpbmcsXHJcbiAgb2xkOiBzdHJpbmcsXHJcbiAgbmV3OiBzdHJpbmcsXHJcbiAgZWxlbWVudDogb2JqXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgZGVidWdfdmFycyB7XHJcbiAgdGFyZ2V0OiBIVE1MQ2FudmFzRWxlbWVudCxcclxuICBjYW1lcmE6IENhbWVyYSxcclxuICBsYXN0X2NsaWNrZWQ6IEhUTUxFbGVtZW50LFxyXG4gIHNlbGVjdGVkX2VsZW1lbnRfaW5pdGlhbF9zY2FsaW5nOiBkaW1lbnNpb25zLFxyXG4gIHNlbGVjdGVkX2VsZW1lbnQ6IG9iaixcclxuICBzZWxlY3RlZF9lbGVtZW50X29mZnNldDogVmVjdG9yLFxyXG4gIHJvdGF0aW9uX2VsZW1lbnQ6IG9iaixcclxuICBzZWxlY3RlZF9wcm9wZXJ0aWVzX2VsZW1lbnQ6IG9iaixcclxuICBtaWRkbGVfcG9zaXRpb246IFZlY3RvcixcclxuICBjbGlja19wb3NpdGlvbjogVmVjdG9yLFxyXG4gIGFjdGlvbnNfc3RhY2s6IGRlYnVnX2FjdGlvbltdLFxyXG4gIGN1cnJlbnRfYWN0aW9uOiBkZWJ1Z19hY3Rpb24sXHJcbiAgcmVuZGVyX2RlbHRhX3RpbWU6bnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBsZXQgZGVidWdfc3RhdGU6IGRlYnVnX3ZhcnM7XHJcblxyXG5leHBvcnQgbGV0IGRlYnVnX3NldHVwID0gKCkgPT4ge1xyXG4gIGRlYnVnX3N0YXRlID0ge1xyXG4gICAgdGFyZ2V0OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlYnVnX3RhcmdldFwiKSBhcyBIVE1MQ2FudmFzRWxlbWVudCxcclxuICAgIGNhbWVyYTogbmV3IENhbWVyYSh7XHJcbiAgICAgIHg6IDAsXHJcbiAgICAgIHk6IDAsXHJcbiAgICAgIGRpbWVuc2lvbnM6IHtcclxuICAgICAgICBoZWlnaHQ6IHZpZXdwb3J0LmhlaWdodCxcclxuICAgICAgICB3aWR0aDogdmlld3BvcnQud2lkdGhcclxuICAgICAgfSxcclxuICAgICAgc2NhbGluZzogMSxcclxuICAgICAgZGVidWc6IHRydWVcclxuICAgIH1cclxuICAgICAgLCB7XHJcbiAgICAgICAgeDogMSxcclxuICAgICAgICB5OiAwLFxyXG4gICAgICAgIHdpZHRoOiAxLFxyXG4gICAgICAgIGhlaWdodDogMVxyXG4gICAgICB9KSxcclxuICAgIGxhc3RfY2xpY2tlZDogdW5kZWZpbmVkLFxyXG4gICAgc2VsZWN0ZWRfZWxlbWVudDogdW5kZWZpbmVkLFxyXG4gICAgc2VsZWN0ZWRfZWxlbWVudF9vZmZzZXQ6IHVuZGVmaW5lZCxcclxuICAgIHJvdGF0aW9uX2VsZW1lbnQ6IHVuZGVmaW5lZCxcclxuICAgIG1pZGRsZV9wb3NpdGlvbjogdW5kZWZpbmVkLFxyXG4gICAgY2xpY2tfcG9zaXRpb246IHVuZGVmaW5lZCxcclxuICAgIHNlbGVjdGVkX3Byb3BlcnRpZXNfZWxlbWVudDogdW5kZWZpbmVkLFxyXG4gICAgc2VsZWN0ZWRfZWxlbWVudF9pbml0aWFsX3NjYWxpbmc6IHsgd2lkdGg6IDEsIGhlaWdodDogMSB9LFxyXG4gICAgYWN0aW9uc19zdGFjazogW10sXHJcbiAgICByZW5kZXJfZGVsdGFfdGltZTowLFxyXG4gICAgY3VycmVudF9hY3Rpb246IHVuZGVmaW5lZFxyXG4gIH1cclxuICBkZWJ1Z19zdGF0ZS5jYW1lcmEuaHVkID0gbmV3IERlYnVnX2h1ZCgpO1xyXG4gIGRlYnVnX2JpbmRzLnB1c2goe1xyXG4gICAga2V5OiBcIm1vdXNlMGRvd25cIixcclxuICAgIHR5cGU6IGJ0eXBlLm1vdXNlLFxyXG4gICAgaWQ6IDAsXHJcbiAgICBmdW5jdGlvbjogKCkgPT4ge1xyXG4gICAgICBpZiAoZGVidWdfc3RhdGUuc2VsZWN0ZWRfZWxlbWVudCkge1xyXG4gICAgICAgIGRlYnVnX3N0YXRlLnNlbGVjdGVkX2VsZW1lbnQgPSBudWxsO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGxldCBtb3VzZSA9IFBvbGxfTW91c2UoZGVidWdfc3RhdGUuY2FtZXJhLCBkZWJ1Z19zdGF0ZS50YXJnZXQpO1xyXG4gICAgICAgIGlmKCFtb3VzZSl7XHJcbiAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgZGVidWdfc3RhdGUuY2xpY2tfcG9zaXRpb24gPSBtb3VzZTtcclxuICAgICAgICBsZXQgYWxMX2NsaWNrZWQgPSBnLmdldFJvb20oKS5jaGVja09iamVjdHNQb2ludChtb3VzZSk7XHJcbiAgICAgICAgbGV0IGNsaWNrZWQ7XHJcbiAgICAgICAgbGV0IGZpbHRlcmVkID0gYWxMX2NsaWNrZWQuZmlsdGVyKChlbGUpID0+IGVsZSA9PSBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9wcm9wZXJ0aWVzX2VsZW1lbnQpXHJcbiAgICAgICAgaWYgKGZpbHRlcmVkLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGNsaWNrZWQgPSBmaWx0ZXJlZFswXVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgIGNsaWNrZWQgPSBhbExfY2xpY2tlZFswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsaWNrZWQpIHtcclxuICAgICAgICAgIGlmIChoZWxkX2tleXNbXCJDb250cm9sTGVmdFwiXSkge1xyXG4gICAgICAgICAgICBkZWJ1Z19zdGF0ZS5jdXJyZW50X2FjdGlvbiA9IHtcclxuICAgICAgICAgICAgICBlbGVtZW50OiBjbGlja2VkLFxyXG4gICAgICAgICAgICAgIHByb3BlcnR5OiBcInNjYWxpbmdcIixcclxuICAgICAgICAgICAgICBvbGQ6IEpTT04uc3RyaW5naWZ5KGNsaWNrZWQuc3RhdGUuc2NhbGluZyksXHJcbiAgICAgICAgICAgICAgbmV3OiB1bmRlZmluZWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGRlYnVnX3N0YXRlLmN1cnJlbnRfYWN0aW9uID0ge1xyXG4gICAgICAgICAgICAgIGVsZW1lbnQ6IGNsaWNrZWQsXHJcbiAgICAgICAgICAgICAgcHJvcGVydHk6IFwicG9zaXRpb25cIixcclxuICAgICAgICAgICAgICBvbGQ6IEpTT04uc3RyaW5naWZ5KGNsaWNrZWQuc3RhdGUucG9zaXRpb24pLFxyXG4gICAgICAgICAgICAgIG5ldzogdW5kZWZpbmVkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGRlYnVnX3N0YXRlLnNlbGVjdGVkX3Byb3BlcnRpZXNfZWxlbWVudCA9IGNsaWNrZWQ7XHJcbiAgICAgICAgICBkZWJ1Z191cGRhdGVfcHJvcGVydGllc19lbGVtZW50KClcclxuICAgICAgICAgIGRlYnVnX3N0YXRlLnNlbGVjdGVkX2VsZW1lbnQgPSBjbGlja2VkO1xyXG4gICAgICAgICAgZGVidWdfc3RhdGUuc2VsZWN0ZWRfZWxlbWVudF9pbml0aWFsX3NjYWxpbmcgPSBjbGlja2VkLnN0YXRlLnNjYWxpbmc7XHJcbiAgICAgICAgICBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9lbGVtZW50X29mZnNldCA9IHtcclxuICAgICAgICAgICAgeDogbW91c2UueCAtIGNsaWNrZWQuc3RhdGUucG9zaXRpb24ueCxcclxuICAgICAgICAgICAgeTogbW91c2UueSAtIGNsaWNrZWQuc3RhdGUucG9zaXRpb24ueVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGV4ZWN1dGU6IGV4ZWNfdHlwZS5vbmNlLFxyXG4gICAgY2FtZXJhOiBkZWJ1Z19zdGF0ZS5jYW1lcmFcclxuICB9KTtcclxuICBkZWJ1Z19iaW5kcy5wdXNoKHtcclxuICAgIGtleTogXCJtb3VzZTF1cFwiLFxyXG4gICAgdHlwZTogYnR5cGUubW91c2UsXHJcbiAgICBpZDogNSxcclxuICAgIGZ1bmN0aW9uOiAoKSA9PiB7XHJcbiAgICAgIGRlYnVnX3N0YXRlLm1pZGRsZV9wb3NpdGlvbiA9IHVuZGVmaW5lZDtcclxuICAgIH0sXHJcbiAgICBleGVjdXRlOiBleGVjX3R5cGUub25jZSxcclxuICAgIGNhbWVyYTogZGVidWdfc3RhdGUuY2FtZXJhXHJcbiAgfSk7XHJcbiAgZGVidWdfYmluZHMucHVzaCh7XHJcbiAgICBrZXk6IFwibW91c2UxZG93blwiLFxyXG4gICAgdHlwZTogYnR5cGUubW91c2UsXHJcbiAgICBpZDogNixcclxuICAgIGZ1bmN0aW9uOiAoKSA9PiB7XHJcbiAgICAgIGxldCBtb3VzZSA9IFBvbGxfTW91c2UoZGVidWdfc3RhdGUuY2FtZXJhLCBkZWJ1Z19zdGF0ZS50YXJnZXQpO1xyXG4gICAgICBpZighbW91c2Upe1xyXG4gICAgICAgIHJldHVyblxyXG4gICAgICB9XHJcbiAgICAgIGRlYnVnX3N0YXRlLm1pZGRsZV9wb3NpdGlvbiA9IG1vdXNlO1xyXG4gICAgfSxcclxuICAgIGV4ZWN1dGU6IGV4ZWNfdHlwZS5vbmNlLFxyXG4gICAgY2FtZXJhOiBkZWJ1Z19zdGF0ZS5jYW1lcmFcclxuICB9KTtcclxuICBkZWJ1Z19iaW5kcy5wdXNoKHtcclxuICAgIGtleTogXCJtb3VzZTB1cFwiLFxyXG4gICAgdHlwZTogYnR5cGUubW91c2UsXHJcbiAgICBpZDogMSxcclxuICAgIGZ1bmN0aW9uOiAoKSA9PiB7XHJcbiAgICAgIGlmIChkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9lbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKGRlYnVnX3N0YXRlLmN1cnJlbnRfYWN0aW9uLnByb3BlcnR5ID09IFwic2NhbGluZ1wiKSB7XHJcbiAgICAgICAgICBkZWJ1Z19zdGF0ZS5jdXJyZW50X2FjdGlvbi5uZXcgPSBKU09OLnN0cmluZ2lmeShkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9lbGVtZW50LnN0YXRlLnNjYWxpbmcpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGRlYnVnX3N0YXRlLmN1cnJlbnRfYWN0aW9uLnByb3BlcnR5ID09IFwicG9zaXRpb25cIikge1xyXG4gICAgICAgICAgZGVidWdfc3RhdGUuY3VycmVudF9hY3Rpb24ubmV3ID0gSlNPTi5zdHJpbmdpZnkoKDxvYmpfc3RhdGU+ZGVidWdfc3RhdGUuc2VsZWN0ZWRfZWxlbWVudC5zdGF0ZSkucG9zaXRpb24pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWJ1Z19zdGF0ZS5hY3Rpb25zX3N0YWNrLnB1c2goZGVidWdfc3RhdGUuY3VycmVudF9hY3Rpb24pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9lbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICBkZWJ1Z191cGRhdGVfcHJvcGVydGllc19lbGVtZW50KClcclxuICAgIH0sXHJcbiAgICBleGVjdXRlOiBleGVjX3R5cGUub25jZSxcclxuICAgIGNhbWVyYTogZGVidWdfc3RhdGUuY2FtZXJhXHJcbiAgfSk7XHJcbiAgZGVidWdfYmluZHMucHVzaCh7XHJcbiAgICBrZXk6IFwibW91c2UyZG93blwiLFxyXG4gICAgdHlwZTogYnR5cGUubW91c2UsXHJcbiAgICBpZDogMyxcclxuICAgIGZ1bmN0aW9uOiAoKSA9PiB7XHJcbiAgICAgIGlmIChkZWJ1Z19zdGF0ZS5yb3RhdGlvbl9lbGVtZW50KSB7XHJcbiAgICAgICAgZGVidWdfc3RhdGUucm90YXRpb25fZWxlbWVudCA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgbGV0IG1vdXNlID0gUG9sbF9Nb3VzZShkZWJ1Z19zdGF0ZS5jYW1lcmEsIGRlYnVnX3N0YXRlLnRhcmdldCk7XHJcbiAgICAgICAgaWYoIW1vdXNlKXtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY2xpY2tlZCA9IGcuZ2V0Um9vbSgpLmNoZWNrT2JqZWN0c1BvaW50KG1vdXNlKVswXVxyXG4gICAgICAgIGlmIChjbGlja2VkKSB7XHJcbiAgICAgICAgICBkZWJ1Z19zdGF0ZS5yb3RhdGlvbl9lbGVtZW50ID0gY2xpY2tlZDtcclxuICAgICAgICAgIGRlYnVnX3N0YXRlLmN1cnJlbnRfYWN0aW9uID0ge1xyXG4gICAgICAgICAgICBlbGVtZW50OiBkZWJ1Z19zdGF0ZS5yb3RhdGlvbl9lbGVtZW50LFxyXG4gICAgICAgICAgICBwcm9wZXJ0eTogXCJyb3RhdGlvblwiLFxyXG4gICAgICAgICAgICBvbGQ6IEpTT04uc3RyaW5naWZ5KGRlYnVnX3N0YXRlLnJvdGF0aW9uX2VsZW1lbnQuc3RhdGUucm90YXRpb24pLFxyXG4gICAgICAgICAgICBuZXc6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuICAgIGV4ZWN1dGU6IGV4ZWNfdHlwZS5vbmNlLFxyXG4gICAgY2FtZXJhOiBkZWJ1Z19zdGF0ZS5jYW1lcmFcclxuICB9KTtcclxuICBkZWJ1Z19iaW5kcy5wdXNoKHtcclxuICAgIGtleTogXCJtb3VzZTJ1cFwiLFxyXG4gICAgdHlwZTogYnR5cGUubW91c2UsXHJcbiAgICBpZDogNCxcclxuICAgIGZ1bmN0aW9uOiAoKSA9PiB7XHJcbiAgICAgIGRlYnVnX3N0YXRlLmN1cnJlbnRfYWN0aW9uLm5ldyA9IEpTT04uc3RyaW5naWZ5KGRlYnVnX3N0YXRlLnJvdGF0aW9uX2VsZW1lbnQuc3RhdGUucm90YXRpb24pXHJcbiAgICAgIGRlYnVnX3N0YXRlLmFjdGlvbnNfc3RhY2sucHVzaChkZWJ1Z19zdGF0ZS5jdXJyZW50X2FjdGlvbik7XHJcbiAgICAgIGRlYnVnX3N0YXRlLnJvdGF0aW9uX2VsZW1lbnQgPSB1bmRlZmluZWQ7XHJcbiAgICB9LFxyXG4gICAgZXhlY3V0ZTogZXhlY190eXBlLm9uY2UsXHJcbiAgICBjYW1lcmE6IGRlYnVnX3N0YXRlLmNhbWVyYVxyXG4gIH0pO1xyXG5cclxuICBsZXQgbGVmdF9mdW5jID0gKCkgPT4ge1xyXG4gICAgbGV0IHNoaWZ0X2hlbGQgPSBoZWxkX2tleXNbXCJTaGlmdExlZnRcIl0gPyAxIDogMDtcclxuICAgIGlmIChkZWJ1Z19zdGF0ZS5sYXN0X2NsaWNrZWQuaWQgPT0gXCJkZWJ1Z190YXJnZXRcIilcclxuICAgICAgZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnBvc2l0aW9uLnggPSBkZWJ1Z19zdGF0ZS5jYW1lcmEuc3RhdGUucG9zaXRpb24ueCAtICgoNSArIHNoaWZ0X2hlbGQgKiA1KSAqICgxIC8gZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnNjYWxpbmcpKTtcclxuICB9O1xyXG4gIGxldCByaWdodF9mdW5jID0gKCkgPT4ge1xyXG4gICAgbGV0IHNoaWZ0X2hlbGQgPSBoZWxkX2tleXNbXCJTaGlmdExlZnRcIl0gPyAxIDogMDtcclxuICAgIGlmIChkZWJ1Z19zdGF0ZS5sYXN0X2NsaWNrZWQuaWQgPT0gXCJkZWJ1Z190YXJnZXRcIilcclxuICAgICAgZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnBvc2l0aW9uLnggPSBkZWJ1Z19zdGF0ZS5jYW1lcmEuc3RhdGUucG9zaXRpb24ueCArICgoNSArIHNoaWZ0X2hlbGQgKiA1KSAqICgxIC8gZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnNjYWxpbmcpKTtcclxuICB9O1xyXG4gIGxldCBkb3duX2Z1bmMgPSAoKSA9PiB7XHJcbiAgICBsZXQgc2hpZnRfaGVsZCA9IGhlbGRfa2V5c1tcIlNoaWZ0TGVmdFwiXSA/IDEgOiAwO1xyXG5cclxuICAgIGlmICghaGVsZF9rZXlzW1wiQ29udHJvbExlZnRcIl0gJiYgZGVidWdfc3RhdGUubGFzdF9jbGlja2VkLmlkID09IFwiZGVidWdfdGFyZ2V0XCIpXHJcbiAgICAgIGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5wb3NpdGlvbi55ID0gZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnBvc2l0aW9uLnkgLSAoKDUgKyBzaGlmdF9oZWxkICogNSkgKiAoMSAvIGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5zY2FsaW5nKSk7XHJcbiAgfTtcclxuICBsZXQgdXBfZnVuYyA9ICgpID0+IHtcclxuICAgIGxldCBzaGlmdF9oZWxkID0gaGVsZF9rZXlzW1wiU2hpZnRMZWZ0XCJdID8gMSA6IDA7XHJcbiAgICBpZiAoZGVidWdfc3RhdGUubGFzdF9jbGlja2VkLmlkID09IFwiZGVidWdfdGFyZ2V0XCIpXHJcbiAgICAgIGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5wb3NpdGlvbi55ID0gZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnBvc2l0aW9uLnkgKyAoKDUgKyBzaGlmdF9oZWxkICogNSkgKiAoMSAvIGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5zY2FsaW5nKSk7XHJcbiAgfTtcclxuICBsZXQgc2Nyb2xsX3VwID0gKCkgPT4ge1xyXG4gICAgaWYgKGRlYnVnX3N0YXRlLmxhc3RfY2xpY2tlZC5pZCA9PSBcImRlYnVnX3RhcmdldFwiICYmIGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5zY2FsaW5nIDwgMC4wNSlcclxuICAgICAgZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnNjYWxpbmcgPSBkZWJ1Z19zdGF0ZS5jYW1lcmEuc3RhdGUuc2NhbGluZyArIDAuMDE7XHJcbiAgICBlbHNlIGlmKGRlYnVnX3N0YXRlLmxhc3RfY2xpY2tlZC5pZCA9PSBcImRlYnVnX3RhcmdldFwiKVxyXG4gICAgICBkZWJ1Z19zdGF0ZS5jYW1lcmEuc3RhdGUuc2NhbGluZyA9IGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5zY2FsaW5nICsgMC4wNTtcclxuICB9XHJcbiAgbGV0IHNhdmVfZnVuYyA9ICgpID0+IHtcclxuICAgIGxldCBjdHJsX2hlbGQgPSBoZWxkX2tleXNbXCJDb250cm9sTGVmdFwiXTtcclxuICAgIGlmIChjdHJsX2hlbGQgJiYgUEFVU0VEKSB7XHJcbiAgICAgIGxldCBuYW1lID0gZy5nZXRSb29tKCkuY29uc3RydWN0b3IubmFtZTtcclxuICAgICAgbGV0IGEgPSBwYXRoLmpvaW4oYCR7cHJvamVjdF9wYXRofWAsIGAuLi9yb29tcy8ke25hbWV9Lmpzb25gKTtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBmcy53cml0ZUZpbGVTeW5jKGEsIEpTT04uc3RyaW5naWZ5KGcuZ2V0Um9vbSgpLmV4cG9ydFN0YXRlQ29uZmlnKCkpKTtcclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IgV1JJVElORyBST09NIElORk8gRklMRS5cIik7XHJcbiAgICAgIH1cclxuICAgICAgYWxlcnQoXCJTYXZlZFwiKTtcclxuXHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChjdHJsX2hlbGQgJiYgIVBBVVNFRCkge1xyXG4gICAgICBhbGVydChcInBhdXNlIHRvIGVuYWJsZSBzYXZpbmcuXCIpXHJcbiAgICB9XHJcbiAgfVxyXG4gIGxldCBzY3JvbGxfZG93biA9ICgpID0+IHtcclxuICAgIGlmIChkZWJ1Z19zdGF0ZS5sYXN0X2NsaWNrZWQuaWQgPT0gXCJkZWJ1Z190YXJnZXRcIiAmJiBkZWJ1Z19zdGF0ZS5jYW1lcmEuc3RhdGUuc2NhbGluZyA+IDAuMDUpXHJcbiAgICAgIGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5zY2FsaW5nID0gZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnNjYWxpbmcgLSAwLjA1O1xyXG4gICAgZWxzZSBpZiAoZGVidWdfc3RhdGUubGFzdF9jbGlja2VkLmlkID09IFwiZGVidWdfdGFyZ2V0XCIgJiYgZGVidWdfc3RhdGUuY2FtZXJhLnN0YXRlLnNjYWxpbmcgPiAwLjAxKVxyXG4gICAgICBkZWJ1Z19zdGF0ZS5jYW1lcmEuc3RhdGUuc2NhbGluZyA9IGRlYnVnX3N0YXRlLmNhbWVyYS5zdGF0ZS5zY2FsaW5nIC0gMC4wMTtcclxuICB9XHJcbiAgbGV0IHVuZG9fZnVuYyA9ICgpID0+IHtcclxuICAgIGlmIChoZWxkX2tleXNbXCJDb250cm9sTGVmdFwiXSkge1xyXG4gICAgICBsZXQgY3VycjogZGVidWdfYWN0aW9uID0gZGVidWdfc3RhdGUuYWN0aW9uc19zdGFjay5wb3AoKTtcclxuICAgICAgaWYgKGN1cnIpIHtcclxuICAgICAgICBpZiAoY3Vyci5wcm9wZXJ0eSA9PSBcInBvc2l0aW9uXCIpIHtcclxuICAgICAgICAgIGN1cnIuZWxlbWVudC5zdGF0ZS5wb3NpdGlvbiA9IEpTT04ucGFyc2UoY3Vyci5vbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjdXJyLnByb3BlcnR5ID09PSBcInJvdGF0aW9uXCIpIHtcclxuICAgICAgICAgIGN1cnIuZWxlbWVudC5zdGF0ZS5yb3RhdGlvbiA9IEpTT04ucGFyc2UoY3Vyci5vbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjdXJyLnByb3BlcnR5ID09PSBcInNjYWxpbmdcIikge1xyXG4gICAgICAgICAgY3Vyci5lbGVtZW50LnN0YXRlLnNjYWxpbmcgPSBKU09OLnBhcnNlKGN1cnIub2xkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgZGVidWdfYmluZHMucHVzaCh7XHJcbiAgICBrZXk6IFwiS2V5QVwiLFxyXG4gICAgdHlwZTogYnR5cGUua2V5Ym9hcmQsXHJcbiAgICBpZDogQmluZChcIktleUFcIiwgbGVmdF9mdW5jLCBleGVjX3R5cGUucmVwZWF0LCAxKSxcclxuICAgIGZ1bmN0aW9uOiBsZWZ0X2Z1bmMsXHJcbiAgICBleGVjdXRlOiBleGVjX3R5cGUucmVwZWF0XHJcbiAgfSlcclxuICBkZWJ1Z19iaW5kcy5wdXNoKHtcclxuICAgIGtleTogXCJLZXlEXCIsXHJcbiAgICB0eXBlOiBidHlwZS5rZXlib2FyZCxcclxuICAgIGlkOiBCaW5kKFwiS2V5RFwiLCByaWdodF9mdW5jLCBleGVjX3R5cGUucmVwZWF0LCAxKSxcclxuICAgIGZ1bmN0aW9uOiByaWdodF9mdW5jLFxyXG4gICAgZXhlY3V0ZTogZXhlY190eXBlLnJlcGVhdFxyXG4gIH0pXHJcbiAgZGVidWdfYmluZHMucHVzaCh7XHJcbiAgICBrZXk6IFwiS2V5V1wiLFxyXG4gICAgdHlwZTogYnR5cGUua2V5Ym9hcmQsXHJcbiAgICBpZDogQmluZChcIktleVdcIiwgdXBfZnVuYywgZXhlY190eXBlLnJlcGVhdCwgMSksXHJcbiAgICBmdW5jdGlvbjogdXBfZnVuYyxcclxuICAgIGV4ZWN1dGU6IGV4ZWNfdHlwZS5yZXBlYXRcclxuICB9KVxyXG4gIGRlYnVnX2JpbmRzLnB1c2goe1xyXG4gICAga2V5OiBcIktleVNcIixcclxuICAgIHR5cGU6IGJ0eXBlLmtleWJvYXJkLFxyXG4gICAgaWQ6IEJpbmQoXCJLZXlTXCIsIGRvd25fZnVuYywgZXhlY190eXBlLnJlcGVhdCwgMSksXHJcbiAgICBmdW5jdGlvbjogZG93bl9mdW5jLFxyXG4gICAgZXhlY3V0ZTogZXhlY190eXBlLnJlcGVhdFxyXG4gIH0pXHJcbiAgZGVidWdfYmluZHMucHVzaCh7XHJcbiAgICBrZXk6IFwic2Nyb2xsdXBcIixcclxuICAgIHR5cGU6IGJ0eXBlLm1vdXNlLFxyXG4gICAgaWQ6IEJpbmQoXCJzY3JvbGx1cFwiLCBzY3JvbGxfdXAsIGV4ZWNfdHlwZS5vbmNlLCAxKSxcclxuICAgIGZ1bmN0aW9uOiBzY3JvbGxfdXAsXHJcbiAgICBleGVjdXRlOiBleGVjX3R5cGUub25jZVxyXG4gIH0pXHJcbiAgZGVidWdfYmluZHMucHVzaCh7XHJcbiAgICBrZXk6IFwic2Nyb2xsZG93blwiLFxyXG4gICAgdHlwZTogYnR5cGUubW91c2UsXHJcbiAgICBpZDogQmluZChcInNjcm9sbGRvd25cIiwgc2Nyb2xsX2Rvd24sIGV4ZWNfdHlwZS5vbmNlLCAxKSxcclxuICAgIGZ1bmN0aW9uOiBzY3JvbGxfZG93bixcclxuICAgIGV4ZWN1dGU6IGV4ZWNfdHlwZS5vbmNlXHJcbiAgfSlcclxuICBkZWJ1Z19iaW5kcy5wdXNoKHtcclxuICAgIGtleTogXCJLZXlTXCIsXHJcbiAgICB0eXBlOiBidHlwZS5rZXlib2FyZCxcclxuICAgIGlkOiBCaW5kKFwiS2V5U1wiLCBzYXZlX2Z1bmMsIGV4ZWNfdHlwZS5vbmNlLCAxKSxcclxuICAgIGZ1bmN0aW9uOiBzYXZlX2Z1bmMsXHJcbiAgICBleGVjdXRlOiBleGVjX3R5cGUub25jZVxyXG4gIH0pXHJcbiAgZGVidWdfYmluZHMucHVzaCh7XHJcbiAgICBrZXk6IFwiS2V5WlwiLFxyXG4gICAgdHlwZTogYnR5cGUua2V5Ym9hcmQsXHJcbiAgICBpZDogQmluZChcIktleVpcIiwgdW5kb19mdW5jLCBleGVjX3R5cGUub25jZSwgMSksXHJcbiAgICBmdW5jdGlvbjogdW5kb19mdW5jLFxyXG4gICAgZXhlY3V0ZTogZXhlY190eXBlLm9uY2VcclxuICB9KVxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcclxuICAgIGlmIChlLnRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XHJcbiAgICAgIGRlYnVnX3N0YXRlLmxhc3RfY2xpY2tlZCA9IGUudGFyZ2V0O1xyXG4gICAgfVxyXG4gIH0pXHJcbiAgbGV0IHBhdXNlX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGF1c2VfYnV0dG9uXCIpXHJcbiAgcGF1c2VfYnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgc2V0UGF1c2VkKCFQQVVTRUQpO1xyXG4gICAgaWYgKFBBVVNFRCkge1xyXG4gICAgICBwYXVzZV9idXR0b24uaW5uZXJIVE1MID0gXCJVTlBBVVNFXCI7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgcGF1c2VfYnV0dG9uLmlubmVySFRNTCA9IFwiUEFVU0VcIjtcclxuICAgIH1cclxuICB9KTtcclxuICBsZXQgb2JqX2J1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibmV3X29iamVjdF9idXR0b25cIik7XHJcbiAgbGV0IHJvb21fYnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJuZXdfcm9vbV9idXR0b25cIik7XHJcbiAgcm9vbV9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICBsZXQgZmlsZV9wYXRoID0gaXBjUmVuZGVyZXIuc2VuZFN5bmMoJ29iamVjdC1wYXRoLXJlcXVlc3QnLCBcInJvb21zXCIpO1xyXG4gICAgaWYgKGZpbGVfcGF0aCkge1xyXG4gICAgICBsZXQgZnVsbF9uYW1lID0gcGF0aC5wYXJzZShmaWxlX3BhdGgpLmJhc2U7XHJcbiAgICAgIGxldCBuZXdfbmFtZSA9IGZ1bGxfbmFtZS5zdWJzdHIoMCwgZnVsbF9uYW1lLmxlbmd0aCAtIDMpO1xyXG4gICAgICBsZXQgcGF0aF90b193cml0ZSA9IHBhdGguam9pbihgJHtmaWxlX3BhdGh9YCwgXCIuLlwiLCBuZXdfbmFtZSArIFwiLnRzXCIpO1xyXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKHBhdGhfdG9fd3JpdGUsIHJvb21fdGVtcGxhdGUuc3BsaXQoXCJ0ZW1wbGF0ZVwiKS5qb2luKG5ld19uYW1lKSk7XHJcblxyXG4gICAgICBwYXRoX3RvX3dyaXRlID0gcGF0aC5qb2luKGAke2ZpbGVfcGF0aH1gLCBcIi4uXCIsIG5ld19uYW1lICsgXCIuanNvblwiKTtcclxuXHJcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aF90b193cml0ZSwgYFxyXG4gICAge1xyXG4gICAgICBcIm9iamVjdHNcIjpbXVxyXG4gICAgfVxyXG4gICAgYClcclxuICAgIH1cclxuICB9KVxyXG4gIG9ial9idXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XHJcbiAgICBsZXQgZmlsZV9wYXRoID0gaXBjUmVuZGVyZXIuc2VuZFN5bmMoJ29iamVjdC1wYXRoLXJlcXVlc3QnLCBcIm9iamVjdHNcIik7XHJcbiAgICBpZiAoZmlsZV9wYXRoKSB7XHJcbiAgICAgIGxldCBmdWxsX25hbWUgPSBwYXRoLnBhcnNlKGZpbGVfcGF0aCkuYmFzZTtcclxuICAgICAgbGV0IG5ld19uYW1lID0gZnVsbF9uYW1lLnN1YnN0cigwLCBmdWxsX25hbWUubGVuZ3RoIC0gMyk7XHJcbiAgICAgIGxldCBwYXRoX3RvX3dyaXRlID0gcGF0aC5qb2luKGAke2ZpbGVfcGF0aH1gLCBcIi4uXCIsIG5ld19uYW1lICsgXCIudHNcIik7XHJcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aF90b193cml0ZSxvYmplY3RfdGVtcGxhdGUuc3BsaXQoXCJ0ZW1wbGF0ZVwiKS5qb2luKG5ld19uYW1lKSk7XHJcbiAgICB9XHJcbiAgfSlcclxuXHJcbn0iLCJpbXBvcnQge29ian0gZnJvbSBcIi4vb2JqZWN0XCI7XHJcblxyXG5pbnRlcmZhY2UgSHVkVGV4dEdldEZ1bmN7XHJcbiAgKCk6c3RyaW5nXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGV4dFNldHRpbmd7XHJcbiAgeDpudW1iZXIsXHJcbiAgeTpudW1iZXIsXHJcbiAgZm9udDpGb250XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRm9udHtcclxuICBtYXhfd2lkdGg/Om51bWJlcixcclxuICBzaXplOm51bWJlcixcclxuICBmb250OnN0cmluZyxcclxuICBjb2xvcjpzdHJpbmcsXHJcbiAgdGV4dDpzdHJpbmcsXHJcbiAgYWxpZ246Q2FudmFzVGV4dEFsaWduXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgVGV4dF9Ob2Rle1xyXG4gIG1heF93aWR0aD86bnVtYmVyLFxyXG4gIHBvc2l0aW9uOntcclxuICAgIHg6bnVtYmVyLFxyXG4gICAgeTpudW1iZXJcclxuICB9XHJcbiAgc2l6ZTpudW1iZXI7XHJcbiAgc2NhbGluZzpudW1iZXI7XHJcbiAgZm9udDpzdHJpbmc7XHJcbiAgY29sb3I6c3RyaW5nO1xyXG4gIHRleHQ/OnN0cmluZztcclxuICBhbGlnbj86Q2FudmFzVGV4dEFsaWduO1xyXG59XHJcbmV4cG9ydCBjbGFzcyBIVUR7XHJcbiAgZ3JhcGhpY19lbGVtZW50czpvYmpbXSA9IFtdO1xyXG4gIHRleHRfZWxlbWVudHM6QXJyYXk8VGV4dD4gPSBbXTtcclxuICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgdGhpcy50ZXh0X2VsZW1lbnRzLnB1c2goLi4udGhpcy5zZXRUZXh0RWxlbWVudHMoKSk7XHJcbiAgICB0aGlzLmdyYXBoaWNfZWxlbWVudHMucHVzaCguLi50aGlzLnNldEdyYXBoaWNFbGVtZW50cygpKTsgXHJcbiAgfVxyXG4gIHN0YXRlZihhOm51bWJlcil7XHJcbiAgICBmb3IobGV0IHggb2YgdGhpcy5ncmFwaGljX2VsZW1lbnRzKXtcclxuICAgICAgeC5zdGF0ZWYoYSk7XHJcbiAgICB9XHJcbiAgICBmb3IobGV0IHggb2YgdGhpcy50ZXh0X2VsZW1lbnRzKXtcclxuICAgICAgeC5zdGF0ZWYoYSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHNldFRleHRFbGVtZW50cygpOlRleHRbXXtcclxuICAgIHJldHVybiBbXTtcclxuICB9XHJcbiAgc2V0R3JhcGhpY0VsZW1lbnRzKCk6b2JqW117XHJcbiAgICByZXR1cm4gW107XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGV4dHtcclxuICBnZXRGdW5jOkh1ZFRleHRHZXRGdW5jO1xyXG4gIHN0YXRlOlRleHRfTm9kZTtcclxuICBjb25zdHJ1Y3Rvcihub2RlOlRleHRfTm9kZSxnZXRGdW5jOkh1ZFRleHRHZXRGdW5jKXtcclxuICAgIGlmKCFub2RlLmFsaWduKXtcclxuICAgICAgbm9kZS5hbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN0YXRlID0gbm9kZTtcclxuICAgIGlmKCF0aGlzLnN0YXRlLnRleHQpe1xyXG4gICAgICB0aGlzLnN0YXRlLnRleHQgPSBcIlwiO1xyXG4gICAgfVxyXG4gICAgdGhpcy5nZXRGdW5jID0gZ2V0RnVuYztcclxuICB9XHJcbiAgc3RhdGVmKGE6bnVtYmVyKXtcclxuICAgdGhpcy5zdGF0ZS50ZXh0ID0gdGhpcy5nZXRGdW5jKCk7XHJcbiAgfVxyXG4gIHJlbmRlcmYoYTpudW1iZXIpOkZvbnR7XHJcbiAgICBsZXQge3NpemUsY29sb3IsZm9udCx0ZXh0LG1heF93aWR0aCxhbGlnbn0gPSB0aGlzLnN0YXRlO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc2l6ZSxcclxuICAgICAgY29sb3IsXHJcbiAgICAgIGZvbnQsXHJcbiAgICAgIHRleHQsXHJcbiAgICAgIG1heF93aWR0aCxcclxuICAgICAgYWxpZ25cclxuICAgIH07XHJcbiAgfVxyXG59IiwiaW1wb3J0IHtWZWN0b3J9IGZyb20gXCIuL3N0YXRlXCI7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gRGlzdGFuY2UoYTpWZWN0b3IsYjpWZWN0b3Ipe1xyXG4gIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coYS54IC0gYi54LDIpICsgTWF0aC5wb3coYS55IC0gYi55LDIpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhbmRJbnQobWluOm51bWJlciwgbWF4Om51bWJlcikge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSApICsgbWluO1xyXG59IiwiaW1wb3J0IHsgc3RhdGVfZnVuYywgb2JqX3N0YXRlLCBWZWN0b3IsIGRpbWVuc2lvbnMgfSBmcm9tIFwiLi9zdGF0ZVwiO1xyXG5pbXBvcnQgeyByZW5kZXJfZnVuYywgcmVuZGVyX3R5cGUgLHNjYWxlX3R5cGV9IGZyb20gXCIuL3JlbmRlclwiO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZSwgcG9zaXRpb25lZF9zcHJpdGUsIHNwcml0ZSwgc3ByaXRlX2dlbiB9IGZyb20gXCIuL3Nwcml0ZVwiO1xyXG5pbXBvcnQgeyBjb2xsaXNpb25fYm94IH0gZnJvbSBcIi4vY29sbGlzaW9uXCI7XHJcbmltcG9ydCB7IFVuYmluZCwgQmluZCwgY29udHJvbF9mdW5jLCBleGVjX3R5cGUgfSBmcm9tIFwiLi9jb250cm9sc1wiO1xyXG5pbXBvcnQge2F1ZGlvfSBmcm9tIFwiLi9hdWRpb1wiO1xyXG5pbXBvcnQge0RFQlVHLCBkZWVwLCBnYW1lfSBmcm9tIFwiLi4vdmFuXCI7XHJcbmltcG9ydCB7IERpc3RhbmNlIH0gZnJvbSBcIi4vbWF0aFwiO1xyXG5pbXBvcnQge3Jvb3RfcGF0aCxwYXRofSBmcm9tIFwiLi4vbGliL2RlYnVnXCI7IFxyXG5cclxuaW50ZXJmYWNlIG9ial9pPFQ+IHtcclxuICBzdGF0ZWY6IHN0YXRlX2Z1bmM8VD4sXHJcbiAgcmVuZGVyZjogcmVuZGVyX2Z1bmNcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldElkKGE6IG9ialtdLCBpZDogc3RyaW5nKTogb2JqIHtcclxuICBmb3IgKGxldCBiID0gMDsgYiA8IGEubGVuZ3RoOyBiKyspIHtcclxuICAgIGlmIChhW2JdLmlkID09IGlkKSB7XHJcbiAgICAgIHJldHVybiBhW2JdO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gdW5kZWZpbmVkO1xyXG59XHJcblxyXG4vL0ZpbmRzIHRoZSBzaWRlIGxlbmd0aHMgb2YgYSB0cmlhbmdsZSBpZiBnaXZlbiB0aGUgIGFuZ2xlIChpbiBkZWdyZWVzKVxyXG4vL2Fsb25nIHdpdGggdGhlIGxlbmd0aCBvZiB0aGUgaHlwb3RlbnVzZVxyXG5leHBvcnQgZnVuY3Rpb24gcm90YXRpb25fbGVuZ3RoKGxlbmd0aDogbnVtYmVyLCBkZWdyZWU6IG51bWJlcikge1xyXG4gIGxldCBhX2xlbiA9IGxlbmd0aCAqIE1hdGguc2luKGRlZ3JlZSAqIE1hdGguUEkgLyAxODApO1xyXG4gIGxldCBiX2xlbiA9IGxlbmd0aCAqIE1hdGguY29zKGRlZ3JlZSAqIE1hdGguUEkgLyAxODApO1xyXG4gIHJldHVybiB7XHJcbiAgICB4OiBhX2xlbixcclxuICAgIHk6IGJfbGVuXHJcbiAgfVxyXG59XHJcblxyXG4vL1RoaXMgY291bnRlciB0cmFja3MgdGhlIGdsb2JhbCBudW1iZXIgb2Ygb2JqZWN0cyBjcmVhdGVkIHNvIGZhclxyXG4vL2FuIG9iamVjdCdzIGlkIChpZiBub3Qgb3ZlcndyaXR0ZW4pIHdpbGwgYmUgYSB1bmlxdWUgaW50ZWdlciwgd2hpY2hcclxuLy91c2VzIHRoaXMgY291bnRlci5cclxubGV0IGNvdW50ZXIgPSAwO1xyXG5cclxuaW50ZXJmYWNlIGFuaW1fc3RvcmFnZSB7XHJcbiAgW2luZGV4OiBzdHJpbmddOiBbQXJyYXk8W251bWJlciwgc3ByaXRlXT4sIG51bWJlcl1cclxufVxyXG5cclxuaW50ZXJmYWNlIHZvaWRfZnVuYyB7XHJcbiAgKCk6IHZvaWRcclxufVxyXG5cclxuY2xhc3MgYW5pbWF0aW9ucyB7XHJcbiAgYW5pbWF0aW9uczogYW5pbV9zdG9yYWdlID0ge307XHJcbiAgLy9UcmFja3MgdGhlIHRpbWUgcGFzc2VkIHNpbmNlIHRoZSBjdXJyZW50IGFuaW1hdGlvblxyXG4gIC8vaGFzIHN0YXJ0ZWQgcGxheWluZ1xyXG4gIGFuaW1hdGlvbl90cmFja2VyID0gMDtcclxuICBjdXJyZW50OiBzdHJpbmc7XHJcbiAgY2FsbGJhY2s6IHZvaWRfZnVuYztcclxuICBhbmltYXRpbmc6Ym9vbGVhbiA9IGZhbHNlO1xyXG4gIC8vZGVmaW5lcyBhbiBhbmltYXRpb24gdGhhdCBjYW4gYmUgcGxheWVkIHVzaW5nIHRoZSBwbGF5IG1ldGhvZFxyXG4gIC8vdGhlIGtleWZyYW1lcyBhcmUgYW4gYXJyYXkgb2YgdHVwbGVzIGluIHRoZSBcclxuICAvL2Zvcm1hdCBvZiBbKHRpbWUgZm9yIHRoaXMgc3ByaXRlIHRvIHNob3cpLCBzcHJpdGVdXHJcbiAgYWRkKG5hbWU6IHN0cmluZywga2V5ZnJhbWVzOiBBcnJheTxbbnVtYmVyLCBzcHJpdGVdPiwgbGVuZ3RoOiBudW1iZXIpIHtcclxuICAgIHRoaXMuYW5pbWF0aW9uc1tuYW1lXSA9IFtrZXlmcmFtZXMsIGxlbmd0aF07XHJcbiAgfVxyXG4gIHBsYXkobmFtZTogc3RyaW5nLCBjYWxsYmFjaz86IHZvaWRfZnVuYykge1xyXG4gICAgdGhpcy5jdXJyZW50ID0gbmFtZTtcclxuICAgIHRoaXMuY2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIHRoaXMuYW5pbWF0aW9uX3RyYWNrZXIgPSAwO1xyXG4gIH1cclxuICByZW5kZXJmKHQ6IG51bWJlcik6IHNwcml0ZSB7XHJcbiAgICBsZXQgY3Vycl9hbmltYXRpb24gPSB0aGlzLmFuaW1hdGlvbnNbdGhpcy5jdXJyZW50XVswXTtcclxuICAgIGxldCBsZW5ndGg6IG51bWJlciA9IHRoaXMuYW5pbWF0aW9uc1t0aGlzLmN1cnJlbnRdWzFdO1xyXG4gICAgbGV0IGluZGV4ID0gMDtcclxuICAgIGZvciAoOyBpbmRleCA8IGN1cnJfYW5pbWF0aW9uLmxlbmd0aCAtIDE7IGluZGV4KyspIHtcclxuICAgICAgbGV0IGtleWZyYW1lX3RpbWUgPSBjdXJyX2FuaW1hdGlvbltpbmRleF1bMF07XHJcbiAgICAgIGxldCBuZXh0X2tleWZyYW1lX3RpbWUgPSBjdXJyX2FuaW1hdGlvbltpbmRleCArIDFdWzBdO1xyXG4gICAgICBpZiAodGhpcy5hbmltYXRpb25fdHJhY2tlciA+PSBrZXlmcmFtZV90aW1lICYmIHRoaXMuYW5pbWF0aW9uX3RyYWNrZXIgPCBuZXh0X2tleWZyYW1lX3RpbWUpIHtcclxuICAgICAgICB0aGlzLmFuaW1hdGlvbl90cmFja2VyID0gdGhpcy5hbmltYXRpb25fdHJhY2tlciArIHQ7XHJcbiAgICAgICAgdGhpcy5hbmltYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgIC8vUmV0dXJucyB0aGUgcmF3IHNwcml0ZSB0aGF0J3MgY29ycmVjdCB0byBzaG93IGF0IHRoaXMgdGltZVxyXG4gICAgICAgIHJldHVybiBjdXJyX2FuaW1hdGlvbltpbmRleF1bMV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICh0aGlzLmFuaW1hdGlvbl90cmFja2VyID49IGxlbmd0aCkge1xyXG4gICAgICB0aGlzLmFuaW1hdGlvbl90cmFja2VyID0gMDtcclxuICAgICAgdGhpcy5hbmltYXRpbmcgPSBmYWxzZTtcclxuICAgICAgaWYgKHRoaXMuY2FsbGJhY2spIHtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLmFuaW1hdGlvbl90cmFja2VyICs9IHQ7XHJcbiAgICB9XHJcbiAgICAvL1JldHVybnMgdGhlIGxhc3QgYXBwcm9wcmlhdGUgZnJhbWUgdW50aWwgdGhlIGFuaW1hdGlvbiBpcyBvdmVyLlxyXG4gICAgcmV0dXJuIGN1cnJfYW5pbWF0aW9uW2luZGV4XVsxXTtcclxuICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBoaXRib3h7XHJcbiAgd2lkdGg6bnVtYmVyLFxyXG4gIGhlaWdodDpudW1iZXIsXHJcbiAgeF9vZmZzZXQ6bnVtYmVyLFxyXG4gIHlfb2Zmc2V0Om51bWJlclxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIHBhcmFtc3tcclxuICBbaW5kZXg6c3RyaW5nXTpib29sZWFufHN0cmluZ3xudW1iZXJcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBib3VuZGluZ19ib3h7XHJcbiAgYm90dG9tX2xlZnQ6VmVjdG9yLFxyXG4gIHRvcF9yaWdodDpWZWN0b3JcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIG9iantcclxuICAvL1VybCB0byB0aGUgb2JqZWN0J3MgaW5kaXZpZHVhbCBzcHJpdGUsIG9yIGFsbCBvZiBpdHMgc3ByaXRlc1xyXG4gIC8vYnVuZGxlZCBpbnRvIGEgc3ByaXRlc2hlZXRcclxuICBzcHJpdGVfdXJsID0gXCJcIjtcclxuICAvL1RoaXMgaXMgdGhlIGxvYWRlZCBzcHJpdGUvc3ByaXRlc2hlZXQgb2YgdGhlIG9iamVjdFxyXG4gIC8vd2hpY2ggaXMgZmV0Y2hlZCBmcm9tIHRoZSB1cmwgYWJvdmVcclxuICBzcHJpdGVfc2hlZXQ6IEhUTUxJbWFnZUVsZW1lbnQ7XHJcbiAgc3RhdGU6IG9ial9zdGF0ZTtcclxuICByZW5kZXJfdHlwZSA9IHJlbmRlcl90eXBlLnNwcml0ZTtcclxuICAvL1RoZXNlIHNob3VsZCBjb3JyZXNwb25kIHRvIHRoZSBhY3R1YWwgb2JqZWN0J3Mgc3ByaXRlIGhlaWdodCBhbmQgd2lkdGhcclxuICAvL0lmIHVzaW5nIGEgc3ByaXRlIHNoZWV0LCB0aGVzZSBiZSBvbmUgc3ByaXRlJ3MgaGVpZ2h0IGFuZCB3aWR0aC5cclxuICBoZWlnaHQ6IG51bWJlcjtcclxuICB3aWR0aDogbnVtYmVyO1xyXG4gIFxyXG4gIGNvbGxpc2lvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGhpdGJveDogaGl0Ym94XHJcbiAgaWQ6IHN0cmluZztcclxuICAvL0FycmF5IG9mIGJpbmQgaWRzXHJcbiAgLy9CaW5kcyBhcmUgaW5kZW50aWZpZWQgYnkgYSB1bmlxdWUgbnVtYmVyIHRoYXQgaXMgcmV0dXJuIHdoZW5cclxuICAvL1RoZSBiaW5kIGlzIGNyZWF0ZWQuIFdlIG11c3Qgc3RvcmUgdGhlc2UgaWRzIGluIG9yZGVyIHRvIFxyXG4gIC8vZGVsZXRlIHRoZSBiaW5kcyB3aGVuIHRoZXkgYXJlIG1hbnVhbGx5IHVuYm91bmQsIG9yIHRoZSBvYmplY3QgaXMgZGVsZXRlZC5cclxuICBiaW5kczogQXJyYXk8bnVtYmVyPjtcclxuICB0YWdzOnN0cmluZ1tdID0gW107XHJcbiAgLy90YWdzIGFyZSB1c2VkIHRvIGV4Y2x1ZGUgb3IgaW5jbHVkZSBvYmplY3RzIHdoZW4gY2hlY2tpbmcgZm9yIGNvbGxpc2lvbnMsXHJcbiAgLy9hbmQgZm9yIG9iamVjdCBpZGVudGlmaWNhdGlvbiAvIGNsYXNzaWZpY2F0aW9uIGluIHNjcmlwdHNcclxuICByZW5kZXIgPSB0cnVlO1xyXG4gIGFuaW1hdGlvbnMgPSBuZXcgYW5pbWF0aW9ucygpO1xyXG4gIGF1ZGlvID0gbmV3IGF1ZGlvKCk7XHJcbiAgLy9MYXN0IHJlbmRlciB0aW1lLCB1c2VkIHRvIGNhbGN1bGF0ZSBkZWx0YV90aW1lXHJcbiAgbGFzdF9yZW5kZXI6bnVtYmVyID0gMDtcclxuICBnYW1lOmdhbWU8dW5rbm93bj47XHJcbiAgcGFyZW50OmNvbXBvc2l0ZV9vYmo7XHJcbiAgLy9QYXJhbXMgYXJlIG9wdGlvbnMgZm9yIHRoZSBvYmplY3QsIHRoYXQgZG8gbm90IHJlbHkgb24gc3RhdGVcclxuICAvLyBGb3IgZXhhbXBsZSwgdGhlIHNpZGUgb2YgYSBwaWVjZSBpbiBjaGVzcy5cclxuICBwYXJhbXM6dW5rbm93biA9IHt9O1xyXG4gIGxheWVyOm51bWJlciA9IDE7XHJcbiAgc2F2ZV90b19maWxlOmJvb2xlYW4gPSB0cnVlO1xyXG4gIHRpY2tfc3RhdGUgPSB0cnVlO1xyXG4gIHNjYWxlX3R5cGUgPSBzY2FsZV90eXBlLmdyb3c7XHJcbiAgc3RhdGljIGRlZmF1bHRfcGFyYW1zOnVua25vd24gPSB7fTtcclxuICBvcGFjaXR5Om51bWJlciA9IDE7XHJcbiAgZ2V0U3RhdGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdGF0ZTtcclxuICB9XHJcbiAgLy9BbmltYXRpb25zIHNob3VsZCBiZSByZWdpc3RlcmVkIHVzaW5nIHRoaXMuYW5pbWF0aW9ucy5hZGQgaW4gdGhpcyBtZXRob2RcclxuICByZWdpc3RlckFuaW1hdGlvbnMoKSB7XHJcblxyXG4gIH1cclxuICAvL1NvdW5kcyBzaG91bGQgYmUgcmVnaXN0ZXJlZCB1c2luZyB0aGlzLmF1ZGlvLmFkZCBpbiB0aGlzIG1ldGhvZC5cclxuICByZWdpc3RlckF1ZGlvKCkge1xyXG5cclxuICB9XHJcbiAgZGVmYXVsdFBhcmFtcygpOnVua25vd257XHJcbiAgICByZXR1cm4gZGVlcCh0aGlzLmRlZmF1bHRQYXJhbXMpO1xyXG4gIH1cclxuICBjb25zdHJ1Y3RvcihzdGF0ZTpvYmpfc3RhdGUscGFyYW1zID0gb2JqLmRlZmF1bHRfcGFyYW1zKSB7XHJcbiAgICBcclxuICAgIHRoaXMuaWQgPSBcIlwiICsgY291bnRlcjtcclxuICAgIHRoaXMuYmluZHMgPSBbXTtcclxuICAgIGNvdW50ZXIrKztcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgdGhpcy5yZWdpc3RlckNvbnRyb2xzKCk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyQXVkaW8oKTtcclxuICAgIC8vQ3JlYXRlcyBhIGNvcHkgb2YgdGhlIHBhc3NlZCBpbiBpbml0aWFsIHN0YXRlIHRvIGF2b2lkIFxyXG4gICAgLy9VcGRhdGluZyB0aGUgc2F2ZWQgc3RhdGUgb2YgdGhlIHJvb21cclxuICAgIHRoaXMuc3RhdGUgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHN0YXRlKSk7XHJcbiAgICBcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gIH1cclxuICBsb2FkKCkge1xyXG4gICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGxldCBhID0gbmV3IEltYWdlKCk7XHJcbiAgICAgIGxldCBwID0gdGhpcy5zcHJpdGVfdXJsO1xyXG4gICAgICBpZihERUJVRyl7XHJcbiAgICAgICAgcCA9IHBhdGguam9pbihyb290X3BhdGgsdGhpcy5zcHJpdGVfdXJsKTtcclxuICAgICAgfVxyXG4gICAgICBhLnNyYyA9IHA7XHJcbiAgICAgIGEub25sb2FkID0gKGFzeW5jICgpID0+IHtcclxuICAgICAgICBfdGhpcy5zcHJpdGVfc2hlZXQgPSBhO1xyXG4gICAgICAgIF90aGlzLnJlZ2lzdGVyQW5pbWF0aW9ucygpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMuYXVkaW8ubG9hZCgpO1xyXG4gICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gIH1cclxuICAvL1dpdGhpbiBub3JtYWwgb2JqZWN0cywgdGhpcyBqdXN0IHJldHVybnMgYW4gYXJyYXkgdGhhdCBjb250YWlucyB0aGUgb2JqZWN0LlxyXG4gIC8vVGhpcyBtZXRob2QgaXMgb3ZlcndyaXR0ZW4gYnkgY29tcG9zaXRlIG9iamVjdHMsIHdoaWNoIHJldHVybnMgZXZlcnkgb2JqZWN0XHJcbiAgLy90aGF0IHRoZSBjb21wb3NpdGUgb2JqZWN0IGNvbnRhaW5zLiBUaGlzIHNpbXBsaWZpZXMgdGhlIGJhY2tlbmQgd29yaywgYXMgZWFjaFxyXG4gIC8vb2JqZWN0IHJldHVybnMgYW4gYXJyYXkgb2YgYXRsZWFzdCBvbmUgb2JqZWN0LlxyXG4gIGNvbWJpbmVkT2JqZWN0cygpOm9ialtde1xyXG4gICAgcmV0dXJuIFt0aGlzXTtcclxuICB9XHJcbiAgZ2V0Qm91bmRpbmdCb3goKTpib3VuZGluZ19ib3h7XHJcbiAgICBsZXQgY29sbF9ib3ggPSB0aGlzLmdldEZ1bGxDb2xsaXNpb25Cb3goKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRvcF9yaWdodDp7XHJcbiAgICAgICAgeDpjb2xsX2JveC54ICsgY29sbF9ib3gud2lkdGgvMixcclxuICAgICAgICB5OmNvbGxfYm94LnkgKyBjb2xsX2JveC5oZWlnaHQvMlxyXG4gICAgICB9LFxyXG4gICAgICBib3R0b21fbGVmdDp7XHJcbiAgICAgICAgeDpjb2xsX2JveC54IC0gY29sbF9ib3gud2lkdGgvMixcclxuICAgICAgICB5OmNvbGxfYm94LnkgLSBjb2xsX2JveC5oZWlnaHQvMlxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vRGlzdGFuY2UgZnJvbSBvbmUgb2JqZWN0IHRvIGFub3RoZXIuXHJcbiAgZGlzdGFuY2UodGFyZ2V0Om9iaik6bnVtYmVye1xyXG4gICAgcmV0dXJuIERpc3RhbmNlKHRoaXMuc3RhdGUucG9zaXRpb24sdGFyZ2V0LnN0YXRlLnBvc2l0aW9uKTtcclxuICB9XHJcbiAgYXBwbHlGb3JjZSh2ZWw6VmVjdG9yKXtcclxuICAgIHRoaXMuc3RhdGUudmVsb2NpdHkueCArPSB2ZWwueDtcclxuICAgIHRoaXMuc3RhdGUudmVsb2NpdHkueSArPSB2ZWwueTtcclxuICB9XHJcbiAgYW5nbGVUb3dhcmRzKGE6IG9iaik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5hbmdsZVRvd2FyZHNQb2ludChhLnN0YXRlLnBvc2l0aW9uKTtcclxuICB9XHJcbiAgYW5nbGVUb3dhcmRzUG9pbnQodGFyZ2V0OlZlY3Rvcik6bnVtYmVye1xyXG4gICAgcmV0dXJuIDkwIC0gTWF0aC5hdGFuMigodGFyZ2V0LnkgLSB0aGlzLnN0YXRlLnBvc2l0aW9uLnkpLCh0YXJnZXQueCAtIHRoaXMuc3RhdGUucG9zaXRpb24ueCkpICogMTgwL01hdGguUEk7XHJcbiAgfVxyXG4gIGJpbmRDb250cm9sKGtleTogc3RyaW5nLCB4OiBleGVjX3R5cGUsIGZ1bmM6IGNvbnRyb2xfZnVuYywgaW50ZXJ2YWwgPSAxKSB7XHJcbiAgICB0aGlzLmJpbmRzLnB1c2goQmluZChrZXksIGZ1bmMsIHgsIGludGVydmFsLCB0aGlzKSk7XHJcbiAgfVxyXG4gIC8vVGhpcyBtZXRob2QgaXMgd2hlcmUgY29udHJvbHMgYW5kIGtleWJpbmRzIHNob3VsZFxyXG4gIC8vYmUgZGVmaW5lZCB1c2luZyBiaW5kQ29udHJvbFxyXG4gIHJlZ2lzdGVyQ29udHJvbHMoKXtcclxuXHJcbiAgfVxyXG4gIHN0YXRlZih0aW1lOm51bWJlcil7XHJcblxyXG4gIH1cclxuICBkZWxldGUoKSB7XHJcbiAgICBmb3IgKGxldCBhIG9mIHRoaXMuYmluZHMpIHtcclxuICAgICAgVW5iaW5kKGEpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5nYW1lLmdldFJvb20oKS5kZWxldGVJdGVtKHRoaXMuaWQpO1xyXG4gIH1cclxuICBVbmJpbmRBbGwoKXtcclxuICAgIGZvciAobGV0IGEgb2YgdGhpcy5iaW5kcykge1xyXG4gICAgICBVbmJpbmQoYSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vUmV0dXJucyB0aGUgY29sbGlzaW9uIGJveCBvZiB0aGUgb2JqZWN0XHJcbiAgLy9Eb2VzIG5vdCBoYXZlIHRvIGNvcnJlc3BvbmQgdG8gdGhlIG9iamVjdCdzIHNwcml0ZSdzIHNpemUgXHJcbiAgLy9BIGNvbXBvc2l0ZSBvYmplY3QgaW5zdGVhZCByZXR1cm5zIHRoZSBib3VuZGluZyBib3ggdGhhdCBcclxuICAvL2NvbnRhaW5zIGV2ZXJ5IG9uZSBvZiBpdHMgY29udGFpbmVkIG9iamVjdHNcclxuICBnZXRGdWxsQ29sbGlzaW9uQm94KCk6Y29sbGlzaW9uX2JveHtcclxuICAgIC8vSWYgYSBkZXZlbG9wZXIgZGVmaW5lZCBoaXRib3ggZXhpc3RzLCB1c2UgdGhhdCwgb3RoZXJ3aXNlXHJcbiAgICAvL2dlbmVyYXRlIGl0IHVzaW5nIHRoZSBzcHJpdGUgd2lkdGggLyBoZWlnaHRcclxuICAgIGlmKHRoaXMuaGl0Ym94KXtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICB4OnRoaXMuc3RhdGUucG9zaXRpb24ueCxcclxuICAgICAgICB5OnRoaXMuc3RhdGUucG9zaXRpb24ueSxcclxuICAgICAgICB3aWR0aDp0aGlzLmhpdGJveC53aWR0aCAqIHRoaXMuc3RhdGUuc2NhbGluZy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6dGhpcy5oaXRib3guaGVpZ2h0ICogdGhpcy5zdGF0ZS5zY2FsaW5nLmhlaWdodFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBlbHNle1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHg6dGhpcy5zdGF0ZS5wb3NpdGlvbi54LFxyXG4gICAgICAgIHk6dGhpcy5zdGF0ZS5wb3NpdGlvbi55LFxyXG4gICAgICAgIHdpZHRoOnRoaXMud2lkdGggKiB0aGlzLnN0YXRlLnNjYWxpbmcud2lkdGgsXHJcbiAgICAgICAgaGVpZ2h0OnRoaXMuaGVpZ2h0ICogdGhpcy5zdGF0ZS5zY2FsaW5nLmhlaWdodFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vVGhpcyBpcyBhbm90aGVyIG1ldGhvZHMsIHNpbWlsYXIgdG8gZ2V0Q29tYmluZWRcclxuICAvL0p1c3QgcmV0dXJucyBhbiBhcnJheSBjb250YWluaW5nIHRoZSBvYmplY3QncyBjb2xsaXNpb24gYm94XHJcbiAgLy9PdmVyd3JpdHRlbiBpbiBjb21wb3NpdGUgb2JqZWN0cyB0byByZXR1cm4gZXZlcnkgb2JqZWN0J3MgY29sbGlzaW9uIGJveFxyXG4gIC8vd2l0aGluIHRoZSBjb21wb3NpdGUgb2JlY3QuXHJcbiAgZ2V0QWxsQ29sbGlzaW9uQm94ZXMoKTpjb2xsaXNpb25fYm94W117XHJcbiAgICByZXR1cm4gW3RoaXMuZ2V0RnVsbENvbGxpc2lvbkJveCgpXVxyXG4gIH1cclxuICAvL0NoZWNrcyB0byBzZWUgaWYgYW4gb2JqZWN0IGFjdHVhbGx5IGNvbGxpZGVzIHdpdGggdGhlIHByb3ZpZGVkIGJveC5cclxuICAvL0EgYm94IHJlcHJlc2VudHMgYW4gYXJlYSB3aXRoaW4gdGhlIGdhbWUgc3BhY2VcclxuICAvL0NoZWNraW5nIGZvciBjb2xsaXNpb25zIGlzIHRyaXZpYWwgY3VycmVudGx5LCBhcyBhbGwgaGl0Ym94ZXMgYXJlIGF4aXMgYWxpZ25lZFxyXG4gIC8vQnV0IGltcGxlbWVudGluZyBhIG1vcmUgY29tcGxpY2F0ZWQgcGh5c2ljcyBlbmdpbmUgd291bGQgbWFrZSB0aGlzIG1ldGhvZCdzIGltcGwuXHJcbiAgLy9zaWduaWZpY2F0bHkgbW9yZSBjb21wbGV4LlxyXG4gIGNvbGxpZGVzV2l0aEJveChvdGhlcl9vYmplY3Q6IGNvbGxpc2lvbl9ib3gpOiBib29sZWFuIHtcclxuICAgIGxldCBjb2xsaWRlc19ob3JyaXpvbnRhbGx5ID0gZmFsc2UsIGNvbGxpZGVzX3ZlcnRpY2FsbHkgPSBmYWxzZTtcclxuICAgIGxldCBoYm94ID0gdGhpcy5oaXRib3g7XHJcbiAgICBpZighdGhpcy5oaXRib3gpe1xyXG4gICAgICBoYm94ID0ge1xyXG4gICAgICAgIHhfb2Zmc2V0OjAsXHJcbiAgICAgICAgeV9vZmZzZXQ6MCxcclxuICAgICAgICB3aWR0aDp0aGlzLndpZHRoLFxyXG4gICAgICAgIGhlaWdodDp0aGlzLmhlaWdodFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBsZXQgb2JqZWN0X2JvdW5kcyA9IHtcclxuICAgICAgbGVmdDogKHRoaXMuc3RhdGUucG9zaXRpb24ueCArIGhib3gueF9vZmZzZXQgLSBoYm94LndpZHRoICogdGhpcy5zdGF0ZS5zY2FsaW5nLndpZHRoIC8gMiksXHJcbiAgICAgIHJpZ2h0OiAodGhpcy5zdGF0ZS5wb3NpdGlvbi54ICsgaGJveC54X29mZnNldCArIGhib3gud2lkdGggKiB0aGlzLnN0YXRlLnNjYWxpbmcud2lkdGggLyAyKSxcclxuICAgICAgdG9wOiAodGhpcy5zdGF0ZS5wb3NpdGlvbi55ICsgaGJveC55X29mZnNldCArIGhib3guaGVpZ2h0ICogdGhpcy5zdGF0ZS5zY2FsaW5nLmhlaWdodCAvIDIpLFxyXG4gICAgICBib3R0b206ICh0aGlzLnN0YXRlLnBvc2l0aW9uLnkgKyBoYm94Lnlfb2Zmc2V0IC0gaGJveC5oZWlnaHQgKiB0aGlzLnN0YXRlLnNjYWxpbmcuaGVpZ2h0IC8gMilcclxuICAgIH1cclxuXHJcbiAgICBsZXQgb3RoZXJfb2JqZWN0X2JvdW5kcyA9IHtcclxuICAgICAgbGVmdDogKG90aGVyX29iamVjdC54IC0gb3RoZXJfb2JqZWN0LndpZHRoIC8gMiksXHJcbiAgICAgIHJpZ2h0OiAob3RoZXJfb2JqZWN0LnggKyBvdGhlcl9vYmplY3Qud2lkdGggLyAyKSxcclxuICAgICAgdG9wOiAob3RoZXJfb2JqZWN0LnkgKyBvdGhlcl9vYmplY3QuaGVpZ2h0IC8gMiksXHJcbiAgICAgIGJvdHRvbTogKG90aGVyX29iamVjdC55IC0gb3RoZXJfb2JqZWN0LmhlaWdodCAvIDIpXHJcbiAgICB9XHJcblxyXG4gICAgLy9XZSBjYW4gY29tcGFyZSB0aGUgc2lkZXMgb2YgdGhlIGJveGVzIHRvIHNlZSBpZiB0aGV5IG92ZXJsYXBcclxuICAgIC8vV2UgY2hlY2sgb25jZSBmb3IgaG9pem9udGFsIG92ZXJsYXAsIHRoZW4gdmVydGljYWwuXHJcbiAgICBpZiAoKG9iamVjdF9ib3VuZHMubGVmdCA+PSBvdGhlcl9vYmplY3RfYm91bmRzLmxlZnQgJiYgb2JqZWN0X2JvdW5kcy5sZWZ0IDwgb3RoZXJfb2JqZWN0X2JvdW5kcy5yaWdodCkgfHwgKG90aGVyX29iamVjdF9ib3VuZHMubGVmdCA+IG9iamVjdF9ib3VuZHMubGVmdCAmJiBvdGhlcl9vYmplY3RfYm91bmRzLmxlZnQgPCBvYmplY3RfYm91bmRzLnJpZ2h0KSkge1xyXG4gICAgICBjb2xsaWRlc19ob3JyaXpvbnRhbGx5ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmICgob2JqZWN0X2JvdW5kcy5ib3R0b20gPj0gb3RoZXJfb2JqZWN0X2JvdW5kcy5ib3R0b20gJiYgb2JqZWN0X2JvdW5kcy5ib3R0b20gPCBvdGhlcl9vYmplY3RfYm91bmRzLnRvcCkgfHwgKG90aGVyX29iamVjdF9ib3VuZHMuYm90dG9tID4gb2JqZWN0X2JvdW5kcy5ib3R0b20gJiYgb3RoZXJfb2JqZWN0X2JvdW5kcy5ib3R0b20gPCBvYmplY3RfYm91bmRzLnRvcCkpe1xyXG4gICAgICBjb2xsaWRlc192ZXJ0aWNhbGx5ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2V7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiBjb2xsaWRlc19ob3JyaXpvbnRhbGx5ICYmIGNvbGxpZGVzX3ZlcnRpY2FsbHk7XHJcbiAgfVxyXG4gIC8vVGhlIHBhcnRpY2xlIG11c3QgYmUgcmVnaXN0ZXJlZCBpbiB0aGUgcm9vbSdzIHJlZ2lzdGVyUGFydGljbGVzIG1ldGhvZCBcclxuICAvL1RoZSBuYW1lIHBhcmFtZXRlciBzaG91bGQgY29ycmVzcG9uZCB0byB0aGUga2V5IG9mIGEgcGFydGljbGVcclxuICBlbWl0UGFydGljbGUobmFtZTpzdHJpbmcsb2Zmc2V0OlZlY3RvcixsaWZldGltZTpudW1iZXIscmFuZ2U6bnVtYmVyKXtcclxuICAgIGxldCByb29tID0gdGhpcy5nYW1lLmdldFJvb20oKTtcclxuICAgIGxldCBzdCA9IHRoaXMuc3RhdGUgYXMgdW5rbm93biBhcyBvYmpfc3RhdGU7XHJcbiAgICBsZXQgZmluYWxfcG9zaXRpb246VmVjdG9yID0ge1xyXG4gICAgICB4OnN0LnBvc2l0aW9uLnggKyBvZmZzZXQueCxcclxuICAgICAgeTpzdC5wb3NpdGlvbi55ICsgb2Zmc2V0LnlcclxuICAgIH1cclxuICAgIHJvb20uZW1pdFBhcnRpY2xlKG5hbWUsZmluYWxfcG9zaXRpb24sbGlmZXRpbWUscmFuZ2UpXHJcbiAgfVxyXG4gIC8vSW50ZXJuYWwgbWV0aG9kIHRoYXQga2VlcHMgY2FsY3VsYXRlcyB0aGUgZGVsdGFfdGltZVxyXG4gIC8vQWxzbyBjb252ZXJ0cyBpbmRpdmlkdWFsIHNwcml0ZXMgaW50byBhcnJheXMgb2Ygb25lIHNwcml0ZS5cclxuICByZW5kZXJUcmFjayh0aW1lOm51bWJlcik6IHBvc2l0aW9uZWRfc3ByaXRlW10ge1xyXG4gICAgbGV0IHJlbmRlcmVkID0gdGhpcy5yZW5kZXJmKHRpbWUgLSB0aGlzLmxhc3RfcmVuZGVyKTtcclxuICAgIGxldCBmaW5hbDpwb3NpdGlvbmVkX3Nwcml0ZVtdO1xyXG4gICAgdGhpcy5sYXN0X3JlbmRlciA9IHRpbWU7XHJcbiAgICBpZihBcnJheS5pc0FycmF5KHJlbmRlcmVkKSlcclxuICAgICAgZmluYWwgPSByZW5kZXJlZFxyXG4gICAgZWxzZXtcclxuICAgICAgZmluYWwgPSBbcmVuZGVyZWRdXHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmluYWw7XHJcbiAgfVxyXG4gIC8vTW9zdCBvYmplY3RzIHNob3VsZCBub3QgYmUgb3ZlcndyaXR0aW5nIHRoZSByZW5kZXJmIG1ldGhvZFxyXG4gIC8vUmV0dXJucyB0aGUgYXBwcm9wcmlhdGUgc3ByaXRlIGZvciB0aGUgb2JqZWN0XHJcbiAgcmVuZGVyZih0aW1lOiBudW1iZXIpOiBwb3NpdGlvbmVkX3Nwcml0ZVtdIHwgcG9zaXRpb25lZF9zcHJpdGV7XHJcbiAgICAvL0lmIHRoZSBvYmplY3QgZG9lc24ndCBoYXZlIHJlZ2lzdGVyZWQgYW5pbWF0aW9ucywgb3IgaXNuJ3QgcGxheWluZyBvbmVcclxuICAgIC8vV2UgaGF2ZSB0byBjcmVhdGUgdGhlIHNwcml0ZSBoZXJlLlxyXG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuYW5pbWF0aW9ucy5hbmltYXRpb25zKS5sZW5ndGggPT0gMCB8fCAhdGhpcy5hbmltYXRpb25zLmN1cnJlbnQpIHtcclxuICAgICAgaWYoIXRoaXMuc3ByaXRlX3NoZWV0IHx8ICF0aGlzLmhlaWdodCB8fCAhdGhpcy53aWR0aCl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIHNwcml0ZTp1bmRlZmluZWQsXHJcbiAgICAgICAgICB4OnRoaXMuc3RhdGUucG9zaXRpb24ueCxcclxuICAgICAgICAgIHk6dGhpcy5zdGF0ZS5wb3NpdGlvbi55XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGxldCBzcHJpdGVfaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XHJcbiAgICAgIGxldCBzcHJpdGVfd2lkdGggPSB0aGlzLndpZHRoO1xyXG4gICAgICAvL1RlY2huaWNhbGx5IHdlIGRvbid0IG5lZWQgdG8gZGVmaW5lIGFuIG9iamVjdCBoZWlnaHQgYW5kIHdpZHRoXHJcbiAgICAgIC8vSWYgdGhlIHNwcml0ZV91cmwgcG9pbnRzIHRvIGEgc2luZ2xlIHN0YXRpYyBzcHJpdGUsIGFzIHdlIGNhbiBqdXN0IHB1bGxcclxuICAgICAgLy90aGUgZGltZW5zaW9ucyBmcm9tIHRoZSBpbWFnZVxyXG4gICAgICBpZiAodGhpcy5oZWlnaHQgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc3ByaXRlX2hlaWdodCA9IHRoaXMuc3ByaXRlX3NoZWV0LmhlaWdodDtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy53aWR0aCA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBzcHJpdGVfd2lkdGggPSB0aGlzLnNwcml0ZV9zaGVldC53aWR0aDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHNwcml0ZToge1xyXG4gICAgICAgICAgc3ByaXRlX3NoZWV0OiB0aGlzLnNwcml0ZV9zaGVldCxcclxuICAgICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgICB0b3A6IDAsXHJcbiAgICAgICAgICBzcHJpdGVfd2lkdGg6IHNwcml0ZV93aWR0aCxcclxuICAgICAgICAgIHNwcml0ZV9oZWlnaHQ6IHNwcml0ZV9oZWlnaHQsXHJcbiAgICAgICAgICBvcGFjaXR5OnRoaXMub3BhY2l0eVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgeDogdGhpcy5zdGF0ZS5wb3NpdGlvbi54LFxyXG4gICAgICAgIHk6IHRoaXMuc3RhdGUucG9zaXRpb24ueVxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3ByaXRlOnRoaXMuYW5pbWF0aW9ucy5yZW5kZXJmKHRpbWUpLFxyXG4gICAgICB4OiB0aGlzLnN0YXRlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6IHRoaXMuc3RhdGUucG9zaXRpb24ueVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBjb21wb3NpdGVfc3RhdGlje1xyXG4gIHg6bnVtYmVyLFxyXG4gIHk6bnVtYmVyLFxyXG4gIG9iajpvYmpcclxufVxyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIGNvbXBvc2l0ZV9vYmogZXh0ZW5kcyBvYmp7XHJcbiAgb2JqZWN0czpvYmpbXSA9IFtdO1xyXG4gIHJlbmRlciA9IGZhbHNlO1xyXG4gIHJlZ2lzdGVyZWQgPSBmYWxzZTtcclxuICBjb2xsaXNpb24gPSBmYWxzZTtcclxuICBzdGF0aWNzOmNvbXBvc2l0ZV9zdGF0aWNbXSA9IFtdO1xyXG4gIGNvbnN0cnVjdG9yKHBvczpvYmpfc3RhdGUpe1xyXG4gICAgc3VwZXIocG9zKTtcclxuICB9XHJcbiAgbG9hZCgpe1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KCBhc3luYyAocmVzb2x2ZSxyZWplY3QpPT57XHJcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKFsuLi50aGlzLm9iamVjdHMubWFwKChhKT0+YS5sb2FkKCkpLC4uLnRoaXMuc3RhdGljcy5tYXAoYT0+YS5vYmoubG9hZCgpKV0pO1xyXG4gICAgICByZXNvbHZlKCk7XHJcbiAgICB9KVxyXG4gIH1cclxuICBjb21iaW5lZE9iamVjdHMoKTpvYmpbXXtcclxuICAgIGxldCBjb21iaW5lZCA9IFsuLi50aGlzLm9iamVjdHMsLi4udGhpcy5zdGF0aWNzLm1hcChhPT5hLm9iaildO1xyXG4gICAgY29tYmluZWQuZm9yRWFjaChhPT5hLnBhcmVudCA9IHRoaXMpO1xyXG4gICAgcmV0dXJuIFsuLi5jb21iaW5lZCx0aGlzXTtcclxuICB9XHJcbiAgZ2V0SXRlbXNCeVRhZyh0YWc6c3RyaW5nKXtcclxuICAgIHJldHVybiB0aGlzLmNvbWJpbmVkT2JqZWN0cygpLmZpbHRlcigoYSk9PmEudGFncy5pbmRleE9mKHRhZykgPiAtMSk7XHJcbiAgfVxyXG4gIGFkZEl0ZW0oYTpvYmosbGlzdD10aGlzLm9iamVjdHMpe1xyXG4gICAgbGlzdC5wdXNoKGEpO1xyXG4gICAgYS5wYXJlbnQgPSB0aGlzO1xyXG4gICAgdGhpcy5nYW1lLmdldFJvb20oKS5hZGRJdGVtKGEpO1xyXG4gIH1cclxuICBnZXRBbGxDb2xsaXNpb25Cb3hlcygpOmNvbGxpc2lvbl9ib3hbXXtcclxuICAgIGxldCBhcnI6Y29sbGlzaW9uX2JveFtdID0gW107XHJcbiAgICBmb3IobGV0IG9iaiBvZiBbLi4udGhpcy5zdGF0aWNzLm1hcChhPT5hLm9iaiksLi4udGhpcy5vYmplY3RzXSl7XHJcbiAgICAgIGxldCBjcmVhdGVkX2JveCA9IG9iai5nZXRBbGxDb2xsaXNpb25Cb3hlcygpO1xyXG4gICAgICBpZihBcnJheS5pc0FycmF5KGNyZWF0ZWRfYm94KSl7XHJcbiAgICAgICAgYXJyLnB1c2goLi4uY3JlYXRlZF9ib3gpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2V7XHJcbiAgICAgICAgYXJyLnB1c2goY3JlYXRlZF9ib3gpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXJyO1xyXG4gIH1cclxuICBkZWxldGUoKXtcclxuICAgIGZvcihsZXQgYSBvZiB0aGlzLm9iamVjdHMpe1xyXG4gICAgICBhLmRlbGV0ZSgpO1xyXG4gICAgfVxyXG4gICAgZm9yKGxldCBhIG9mIHRoaXMuc3RhdGljcyl7XHJcbiAgICAgIGEub2JqLmRlbGV0ZSgpO1xyXG4gICAgfVxyXG4gICAgc3VwZXIuZGVsZXRlKCk7XHJcbiAgfVxyXG4gIGNvbGxpZGVzV2l0aEJveChhOiBjb2xsaXNpb25fYm94KTpib29sZWFue1xyXG4gICAgZm9yKGxldCBvYmogb2YgdGhpcy5vYmplY3RzKXtcclxuICAgICAgaWYob2JqLmNvbGxpZGVzV2l0aEJveChhKSlcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgbyBvZiB0aGlzLnN0YXRpY3Mpe1xyXG4gICAgICBpZihvLm9iai5jb2xsaWRlc1dpdGhCb3goYSkpXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSAgXHJcbn1cclxuXHJcblxyXG5leHBvcnQgY2xhc3Mgc3RhdGljX29iaiB7XHJcbiAgc3ByaXRlX3VybCA9IFwiXCI7XHJcbiAgc3ByaXRlOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG59XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgZ3Jhdml0eV9vYmogZXh0ZW5kcyBvYmp7XHJcbiAgZ3Jhdml0eSA9IHRydWVcclxufSIsImltcG9ydCB7IHNwcml0ZSB9IGZyb20gXCIuL3Nwcml0ZVwiO1xyXG5pbXBvcnQgeyBHZXRWaWV3cG9ydERpbWVuc2lvbnMgfSBmcm9tIFwiLi4vdmFuXCI7XHJcbmltcG9ydCB7IG9iaiB9IGZyb20gXCIuL29iamVjdFwiO1xyXG5pbXBvcnQgeyBkaW1lbnNpb25zLCBvYmpfc3RhdGUgfSBmcm9tIFwiLi9zdGF0ZVwiO1xyXG5pbXBvcnQgeyBUZXh0X05vZGUsIFRleHRTZXR0aW5nLEhVRCxUZXh0IH0gZnJvbSBcIi4vaHVkXCI7XHJcbmltcG9ydCB7cG9zaXRpb25lZF9zcHJpdGV9IGZyb20gXCIuL3Nwcml0ZVwiXHJcblxyXG5pbnRlcmZhY2UgY2FtZXJhX3N0YXRlIHtcclxuICBzY2FsaW5nOiBudW1iZXIsXHJcbiAgcG9zaXRpb246IHtcclxuICAgIHg6IG51bWJlcixcclxuICAgIHk6IG51bWJlclxyXG4gIH1cclxuICBkaW1lbnNpb25zOiB7XHJcbiAgICB3aWR0aDogbnVtYmVyLFxyXG4gICAgaGVpZ2h0OiBudW1iZXJcclxuICB9LFxyXG4gIHZpZXdwb3J0OiB2aWV3cG9ydCxcclxuICBkZWJ1Zzpib29sZWFuLFxyXG4gIGh1ZDpIVUQgIFxyXG59XHJcblxyXG5pbnRlcmZhY2Ugdmlld3BvcnQge1xyXG4gIHg6IG51bWJlcixcclxuICB5OiBudW1iZXIsXHJcbiAgd2lkdGg6IG51bWJlcixcclxuICBoZWlnaHQ6IG51bWJlclxyXG59XHJcblxyXG5pbnRlcmZhY2UgY2FtZXJhX3Byb3BlcnRpZXMge1xyXG4gIHg6bnVtYmVyLFxyXG4gIHk6bnVtYmVyLFxyXG4gIGRpbWVuc2lvbnM6e1xyXG4gICAgaGVpZ2h0Om51bWJlcixcclxuICAgIHdpZHRoOm51bWJlclxyXG4gIH1cclxuICBzY2FsaW5nOm51bWJlcixcclxuICBkZWJ1Zzpib29sZWFuXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDYW1lcmEge1xyXG4gIHN0YXRlOiBjYW1lcmFfc3RhdGU7XHJcbiAgaHVkOiBIVUQ7XHJcbiAgY29uc3RydWN0b3IocHJvcHM6Y2FtZXJhX3Byb3BlcnRpZXMsIHY6IHZpZXdwb3J0LCBodWQ6SFVEID0gdW5kZWZpbmVkKSB7XHJcbiAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICBzY2FsaW5nOnByb3BzLnNjYWxpbmcsXHJcbiAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgeDogcHJvcHMueCxcclxuICAgICAgICB5OiBwcm9wcy55XHJcbiAgICAgIH0sXHJcbiAgICAgIGRpbWVuc2lvbnM6IHByb3BzLmRpbWVuc2lvbnMsXHJcbiAgICAgIHZpZXdwb3J0OiB7XHJcbiAgICAgICAgeDp2LngsXHJcbiAgICAgICAgeTp2LnkgLFxyXG4gICAgICAgIHdpZHRoOiB2LndpZHRoICogcHJvcHMuZGltZW5zaW9ucy53aWR0aCxcclxuICAgICAgICBoZWlnaHQ6IHYuaGVpZ2h0ICogcHJvcHMuZGltZW5zaW9ucy5oZWlnaHRcclxuICAgICAgfSxcclxuICAgICAgZGVidWc6cHJvcHMuZGVidWcsXHJcbiAgICAgIGh1ZFxyXG4gICAgfVxyXG4gICAgdGhpcy5odWQgPSBodWQ7XHJcbiAgfVxyXG4gIHNldCB4KHg6IG51bWJlcikge1xyXG4gICAgdGhpcy5zdGF0ZS5wb3NpdGlvbi54ID0geDtcclxuICB9XHJcbiAgc2V0IHkoeTogbnVtYmVyKSB7XHJcbiAgICB0aGlzLnN0YXRlLnBvc2l0aW9uLnkgPSB5XHJcbiAgfVxyXG4gIGdldCB4KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RhdGUucG9zaXRpb24ueDtcclxuICB9XHJcbiAgZ2V0IHkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5wb3NpdGlvbi55O1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgcmVuZGVyX2Z1bmMge1xyXG4gICh4OiBudW1iZXIsIHk6IG51bWJlciwgc2NhbGluZzogbnVtYmVyKTogdm9pZFxyXG59XHJcblxyXG5pbnRlcmZhY2UgcmVjdGFuZ2xlIHtcclxuICB3aWR0aDogbnVtYmVyLFxyXG4gIGhlaWdodDogbnVtYmVyXHJcbn1cclxuXHJcbmludGVyZmFjZSBzcHJpdGVfYXJncyB7XHJcbiAgc3ByaXRlOiBzcHJpdGUsXHJcbiAgeDogbnVtYmVyLFxyXG4gIHk6IG51bWJlcixcclxuICByb3RhdGlvbjogbnVtYmVyLFxyXG4gIHNjYWxlOmRpbWVuc2lvbnMsXHJcbiAgc2NhbGVfdHlwZTpzY2FsZV90eXBlXHJcbn1cclxuXHJcbmludGVyZmFjZSByZW5kZXJlcl9hcmdzIHtcclxuICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcbiAgY2FtZXJhOiBDYW1lcmFcclxufVxyXG5cclxuZXhwb3J0IGVudW0gcmVuZGVyX3R5cGUge1xyXG4gIHRleHQsXHJcbiAgc3ByaXRlLFxyXG4gIHJlY3QsXHJcbiAgc3Ryb2tlX3JlY3RcclxufVxyXG5cclxuZXhwb3J0IGVudW0gc2NhbGVfdHlwZXtcclxuICBncm93LFxyXG4gIHJlcGVhdFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgaHVkX3RleHRfcmVuZGVyZXIgPSAocjogcmVuZGVyZXJfYXJncywgczogVGV4dFNldHRpbmcpID0+IHtcclxuICBsZXQgdmhlaWdodCA9IEdldFZpZXdwb3J0RGltZW5zaW9ucygpLmhlaWdodDtcclxuICByLmNvbnRleHQuZm9udCA9IGAke3MuZm9udC5zaXplfXB4ICR7cy5mb250LmZvbnR9YDtcclxuICByLmNvbnRleHQuZmlsbFN0eWxlID0gcy5mb250LmNvbG9yO1xyXG4gIHIuY29udGV4dC50ZXh0QWxpZ24gPSBzLmZvbnQuYWxpZ247XHJcbiAgaWYgKHMuZm9udC5tYXhfd2lkdGgpIHtcclxuICAgIHIuY29udGV4dC5maWxsVGV4dChzLmZvbnQudGV4dCwgcy54LCB2aGVpZ2h0IC0gcy55LCBzLmZvbnQubWF4X3dpZHRoKTtcclxuICB9XHJcbiAgZWxzZSB7XHJcbiAgICByLmNvbnRleHQuZmlsbFRleHQocy5mb250LnRleHQsIHMueCwgdmhlaWdodCAtIHMueSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdGV4dF9yZW5kZXJlciA9IChyOnJlbmRlcmVyX2FyZ3MsczpUZXh0U2V0dGluZykgPT4ge1xyXG4gIGxldCBjYW1lcmEgPSByLmNhbWVyYTtcclxuICBsZXQgdmhlaWdodCA9IHIuY2FtZXJhLnN0YXRlLmRpbWVuc2lvbnMuaGVpZ2h0O1xyXG4gIGxldCB3aWR0aCA9IHIuY29udGV4dC5tZWFzdXJlVGV4dChzLmZvbnQudGV4dCkud2lkdGggKiByLmNhbWVyYS5zdGF0ZS5zY2FsaW5nO1xyXG4gIGxldCBoZWlnaHQgPSBzLmZvbnQuc2l6ZSAqIDEuMiAqIHIuY2FtZXJhLnN0YXRlLnNjYWxpbmc7XHJcbiAgbGV0IGZpbmFsX3ggPSAoKHMueCAtIGNhbWVyYS5zdGF0ZS5wb3NpdGlvbi54ICsgY2FtZXJhLnN0YXRlLmRpbWVuc2lvbnMud2lkdGggKiAoMS9yLmNhbWVyYS5zdGF0ZS5zY2FsaW5nKSAvIDIpICogci5jYW1lcmEuc3RhdGUuc2NhbGluZyk7XHJcbiAgbGV0IGZpbmFsX3kgPSAoKHZoZWlnaHQgLSBzLnkgKiBjYW1lcmEuc3RhdGUuc2NhbGluZyAtIGNhbWVyYS5zdGF0ZS5kaW1lbnNpb25zLmhlaWdodC8yICsgY2FtZXJhLnN0YXRlLnBvc2l0aW9uLnkgKiBjYW1lcmEuc3RhdGUuc2NhbGluZykpO1xyXG4gIHIuY29udGV4dC5mb250ID0gYCR7cy5mb250LnNpemUgKiByLmNhbWVyYS5zdGF0ZS5zY2FsaW5nfXB4ICR7cy5mb250LmZvbnR9YDtcclxuICByLmNvbnRleHQuZmlsbFN0eWxlID0gcy5mb250LmNvbG9yO1xyXG4gIHIuY29udGV4dC50ZXh0QWxpZ24gPSBzLmZvbnQuYWxpZ25cclxuICByLmNvbnRleHQuc2F2ZSgpO1xyXG4gIHIuY29udGV4dC50cmFuc2xhdGUoZmluYWxfeCwgZmluYWxfeSk7XHJcbiAgaWYgKHMuZm9udC5tYXhfd2lkdGgpIHtcclxuICAgIHIuY29udGV4dC5maWxsVGV4dChzLmZvbnQudGV4dCwgMCwgMCwgcy5mb250Lm1heF93aWR0aCk7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgci5jb250ZXh0LmZpbGxUZXh0KHMuZm9udC50ZXh0LCAwLCAwKTtcclxuICB9XHJcbiAgci5jb250ZXh0LnJlc3RvcmUoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHNwcml0ZV9yZW5kZXJlciA9IChyOiByZW5kZXJlcl9hcmdzLCBzOiBzcHJpdGVfYXJncykgPT4ge1xyXG4gIGxldCBjYW1lcmEgPSByLmNhbWVyYTtcclxuICBsZXQgdmhlaWdodCA9IHIuY2FtZXJhLnN0YXRlLmRpbWVuc2lvbnMuaGVpZ2h0IC8gci5jYW1lcmEuc3RhdGUuc2NhbGluZztcclxuICBsZXQgZmluYWxfeCA9ICgocy54IC0gY2FtZXJhLnN0YXRlLnBvc2l0aW9uLnggKyBjYW1lcmEuc3RhdGUuZGltZW5zaW9ucy53aWR0aCAqICgxL3IuY2FtZXJhLnN0YXRlLnNjYWxpbmcpIC8gMiAtIHMuc3ByaXRlLnNwcml0ZV93aWR0aCAqIHMuc2NhbGUud2lkdGggLyAyKSAqIHIuY2FtZXJhLnN0YXRlLnNjYWxpbmcpO1xyXG4gIGxldCBmaW5hbF95ID0gKCh2aGVpZ2h0IC0gcy55IC0gY2FtZXJhLnN0YXRlLmRpbWVuc2lvbnMuaGVpZ2h0ICogKDEvci5jYW1lcmEuc3RhdGUuc2NhbGluZykgLyAyIC0gcy5zcHJpdGUuc3ByaXRlX2hlaWdodCAqIHMuc2NhbGUuaGVpZ2h0IC8gMiArIGNhbWVyYS5zdGF0ZS5wb3NpdGlvbi55KSAqIHIuY2FtZXJhLnN0YXRlLnNjYWxpbmcpO1xyXG4gIGxldCBoZWlnaHQgPSBzLnNwcml0ZS5zcHJpdGVfaGVpZ2h0ICogci5jYW1lcmEuc3RhdGUuc2NhbGluZyAqIHMuc2NhbGUuaGVpZ2h0O1xyXG4gIGxldCB3aWR0aCA9IHMuc3ByaXRlLnNwcml0ZV93aWR0aCAqIHIuY2FtZXJhLnN0YXRlLnNjYWxpbmcgKiBzLnNjYWxlLndpZHRoO1xyXG4gIHIuY29udGV4dC5zYXZlKCk7XHJcbiAgci5jb250ZXh0Lmdsb2JhbEFscGhhID0gcy5zcHJpdGUub3BhY2l0eTtcclxuICByLmNvbnRleHQudHJhbnNsYXRlKGZpbmFsX3ggICsgKHdpZHRoKSAvIDIsIGZpbmFsX3kgKyBoZWlnaHQgLyAyKVxyXG4gIGxldCByYWRpYW5zID0gcy5yb3RhdGlvbiAqIChNYXRoLlBJIC8gMTgwKTtcclxuICByLmNvbnRleHQucm90YXRlKHJhZGlhbnMpO1xyXG4gIGlmKHMuc2NhbGVfdHlwZSA9PSBzY2FsZV90eXBlLmdyb3cpe1xyXG4gICAgci5jb250ZXh0LmRyYXdJbWFnZShcclxuICAgICAgcy5zcHJpdGUuc3ByaXRlX3NoZWV0LFxyXG4gICAgICBzLnNwcml0ZS5sZWZ0LFxyXG4gICAgICBzLnNwcml0ZS50b3AsXHJcbiAgICAgIHMuc3ByaXRlLnNwcml0ZV93aWR0aCxcclxuICAgICAgcy5zcHJpdGUuc3ByaXRlX2hlaWdodCxcclxuICAgICAgLSh3aWR0aCApIC8gMixcclxuICAgICAgLWhlaWdodCAvIDIsXHJcbiAgICAgIHdpZHRoLFxyXG4gICAgICBoZWlnaHRcclxuICAgIClcclxuICB9XHJcbiAgZWxzZSBpZihzLnNjYWxlX3R5cGUgPT0gc2NhbGVfdHlwZS5yZXBlYXQpe1xyXG4gICAgbGV0IG9uZV93aWR0aCA9IHMuc3ByaXRlLnNwcml0ZV93aWR0aCAqIHIuY2FtZXJhLnN0YXRlLnNjYWxpbmc7XHJcbiAgICBsZXQgb25lX2hlaWdodCA9IHMuc3ByaXRlLnNwcml0ZV9oZWlnaHQgKiByLmNhbWVyYS5zdGF0ZS5zY2FsaW5nO1xyXG4gICAgbGV0IHRvdGFsX2hvcl9zcHJpdGVzID0gd2lkdGgvb25lX3dpZHRoXHJcbiAgICBsZXQgdG90YWxfdmVyX3Nwcml0ZXMgPSBoZWlnaHQvb25lX2hlaWdodDtcclxuICAgZm9yKGxldCBhID0gMDthIDwgdG90YWxfaG9yX3Nwcml0ZXM7YSArPSAxKXtcclxuICAgICBmb3IobGV0IGIgPSAwO2IgPCB0b3RhbF92ZXJfc3ByaXRlcztiICs9IDEpe1xyXG4gICAgICAgbGV0IG5ld193aWR0aCA9IG9uZV93aWR0aDtcclxuICAgICAgIGxldCBuZXdfaGVpZ2h0ID0gb25lX2hlaWdodDtcclxuICAgICAgIGlmKChhICsgMSkgKiBvbmVfd2lkdGggLSB3aWR0aCA+IDApe1xyXG4gICAgICAgICBuZXdfd2lkdGggPSB3aWR0aCAlIG9uZV93aWR0aDtcclxuICAgICAgIH1cclxuICAgICAgIGlmKChiICsgMSkgKiBvbmVfaGVpZ2h0IC0gaGVpZ2h0ID4gMCl7XHJcbiAgICAgICAgIG5ld19oZWlnaHQgPSBoZWlnaHQgJSBvbmVfaGVpZ2h0O1xyXG4gICAgICAgfVxyXG4gICAgICAgci5jb250ZXh0LmRyYXdJbWFnZShcclxuICAgICAgICBzLnNwcml0ZS5zcHJpdGVfc2hlZXQsXHJcbiAgICAgICAgcy5zcHJpdGUubGVmdCxcclxuICAgICAgICBzLnNwcml0ZS50b3AsXHJcbiAgICAgICAgbmV3X3dpZHRoIC8gKHIuY2FtZXJhLnN0YXRlLnNjYWxpbmcpLFxyXG4gICAgICAgIG5ld19oZWlnaHQgLyAoci5jYW1lcmEuc3RhdGUuc2NhbGluZyksXHJcbiAgICAgICAgLXdpZHRoLzIgKyBhICogb25lX3dpZHRoLFxyXG4gICAgICAgIC1oZWlnaHQvMiArIGIgKiBvbmVfaGVpZ2h0LFxyXG4gICAgICAgIG5ld193aWR0aCxcclxuICAgICAgICBuZXdfaGVpZ2h0XHJcbiAgICAgICApXHJcbiAgICAgfVxyXG5cclxuICAgfSBcclxuICB9XHJcbiAgXHJcbiAgXHJcbiAgci5jb250ZXh0LnJlc3RvcmUoKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHN0cm9rZWRfcmVjdF9yZW5kZXJlciA9IChjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHJlY3Q6IHJlY3RhbmdsZSwgeDogbnVtYmVyLCB5OiBudW1iZXIsIGNvbG9yOiBzdHJpbmcsIGxpbmVXaWR0aDpudW1iZXIsIGNhbWVyYTogQ2FtZXJhKSA9PiB7XHJcbiAgbGV0IHZoZWlnaHQgPSBjYW1lcmEuc3RhdGUuZGltZW5zaW9ucy5oZWlnaHQgLyBjYW1lcmEuc3RhdGUuc2NhbGluZztcclxuICBsZXQgZmluYWxfeCA9ICgoeCAtIGNhbWVyYS5zdGF0ZS5wb3NpdGlvbi54ICsgY2FtZXJhLnN0YXRlLmRpbWVuc2lvbnMud2lkdGggKiAoMS9jYW1lcmEuc3RhdGUuc2NhbGluZykgLyAyIC0gcmVjdC53aWR0aCAvIDIpICogY2FtZXJhLnN0YXRlLnNjYWxpbmcpO1xyXG4gIGxldCBmaW5hbF95ID0gKCh2aGVpZ2h0IC0geSAtIHJlY3QuaGVpZ2h0IC8gMiAtIGNhbWVyYS5zdGF0ZS5kaW1lbnNpb25zLmhlaWdodCAqICgxL2NhbWVyYS5zdGF0ZS5zY2FsaW5nKSAvIDIgKyBjYW1lcmEuc3RhdGUucG9zaXRpb24ueSkgKiBjYW1lcmEuc3RhdGUuc2NhbGluZyk7XHJcbiAgbGV0IGhlaWdodCA9IHJlY3QuaGVpZ2h0ICogY2FtZXJhLnN0YXRlLnNjYWxpbmc7XHJcbiAgbGV0IHdpZHRoID0gcmVjdC53aWR0aCAqIGNhbWVyYS5zdGF0ZS5zY2FsaW5nO1xyXG4gIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBjb2xvcjtcclxuICBjb250ZXh0LmxpbmVXaWR0aCA9IGxpbmVXaWR0aCAqIGNhbWVyYS5zdGF0ZS5zY2FsaW5nO1xyXG4gIGNvbnRleHQuc3Ryb2tlUmVjdChmaW5hbF94LCBmaW5hbF95LCB3aWR0aCwgaGVpZ2h0KTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlY3RfcmVuZGVyZXIgPSAoY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCByZWN0OiByZWN0YW5nbGUsIHg6IG51bWJlciwgeTogbnVtYmVyLCBjb2xvcjogc3RyaW5nLCBsaW5lV2lkdGg6bnVtYmVyLCBjYW1lcmE6IENhbWVyYSkgPT4ge1xyXG4gIGxldCB2aGVpZ2h0ID0gY2FtZXJhLnN0YXRlLmRpbWVuc2lvbnMuaGVpZ2h0IC8gY2FtZXJhLnN0YXRlLnNjYWxpbmc7XHJcbiAgbGV0IGZpbmFsX3ggPSAoKHggLSBjYW1lcmEuc3RhdGUucG9zaXRpb24ueCArIGNhbWVyYS5zdGF0ZS5kaW1lbnNpb25zLndpZHRoICogKDEvY2FtZXJhLnN0YXRlLnNjYWxpbmcpIC8gMiAtIHJlY3Qud2lkdGggLyAyKSAqIGNhbWVyYS5zdGF0ZS5zY2FsaW5nKTtcclxuICBsZXQgZmluYWxfeSA9ICgodmhlaWdodCAtIHkgLSByZWN0LmhlaWdodCAvIDIgLSBjYW1lcmEuc3RhdGUuZGltZW5zaW9ucy5oZWlnaHQgKiAoMS9jYW1lcmEuc3RhdGUuc2NhbGluZykgLyAyICsgY2FtZXJhLnN0YXRlLnBvc2l0aW9uLnkpICogY2FtZXJhLnN0YXRlLnNjYWxpbmcpO1xyXG4gIGxldCBoZWlnaHQgPSByZWN0LmhlaWdodCAqIGNhbWVyYS5zdGF0ZS5zY2FsaW5nO1xyXG4gIGxldCB3aWR0aCA9IHJlY3Qud2lkdGggKiBjYW1lcmEuc3RhdGUuc2NhbGluZztcclxuICBjb250ZXh0LnN0cm9rZVN0eWxlID0gY29sb3I7XHJcbiAgY29udGV4dC5maWxsUmVjdChmaW5hbF94LCBmaW5hbF95LCB3aWR0aCwgaGVpZ2h0KTtcclxufSIsImltcG9ydCB7IGdyYXZpdHlfb2JqLG9iaiB9IGZyb20gXCIuL29iamVjdFwiO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZSwgc3ByaXRlIH0gZnJvbSBcIi4vc3ByaXRlXCI7XHJcbmltcG9ydCB7IGRpbWVuc2lvbnMsIG9ial9zdGF0ZSwgVmVjdG9yIH0gZnJvbSBcIi4vc3RhdGVcIjtcclxuaW1wb3J0IHsgdmVsb2NpdHlDb2xsaXNpb25DaGVjayxjaGVja19jb2xsaXNpb25zLGNvbGxpc2lvbl9ib3gsY2hlY2tfYWxsX2NvbGxpc2lvbnMsY2hlY2tfYWxsX29iamVjdHN9IGZyb20gXCIuL2NvbGxpc2lvblwiO1xyXG5pbXBvcnQge3JlbmRlcl9jb2xsaXNpb25fYm94LERFQlVHfSBmcm9tIFwiLi4vdmFuXCI7XHJcbmltcG9ydCB7QmluZCxjb250cm9sX2Z1bmMsIGV4ZWNfdHlwZX0gZnJvbSBcIi4vY29udHJvbHNcIjtcclxuaW1wb3J0IHtIVUQsVGV4dCwgVGV4dF9Ob2RlfSBmcm9tIFwiLi9odWRcIjtcclxuaW1wb3J0IHthdWRpb30gZnJvbSBcIi4vYXVkaW9cIlxyXG5pbXBvcnQge2dhbWV9IGZyb20gXCIuLi92YW5cIjtcclxuaW1wb3J0IHtkZWJ1Z191cGRhdGVfb2JqX2xpc3Qscm9vdF9wYXRoLHBhdGh9IGZyb20gXCIuLi9saWIvZGVidWdcIjtcclxuaW1wb3J0IHtwcmVmYWJzfSBmcm9tIFwiLi4vZ2FtZS9vYmplY3RzL3ByZWZhYnNcIjtcclxuXHJcbmludGVyZmFjZSBwb3NpdGlvbntcclxuICB4Om51bWJlcixcclxuICB5Om51bWJlclxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlHcmF2aXR5KG9iOmdyYXZpdHlfb2JqLGdyYXZfY29uc3Q6bnVtYmVyLCBncmF2X21heDpudW1iZXIpe1xyXG4gIGlmKG9iLmdyYXZpdHkgJiYgb2Iuc3RhdGUudmVsb2NpdHkueSA+IGdyYXZfbWF4KXtcclxuICAgIG9iLnN0YXRlLnZlbG9jaXR5LnkgKz0gZ3Jhdl9jb25zdDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgcGFydGljbGVfZW50cnl7XHJcbiAgc3ByaXRlOnN0cmluZyxcclxuICBoZWlnaHQ6bnVtYmVyLFxyXG4gIHdpZHRoOm51bWJlclxyXG59XHJcblxyXG5pbnRlcmZhY2UgcGFydGljbGVze1xyXG4gIFtpbmRleDpzdHJpbmddOnBhcnRpY2xlX2VudHJ5XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2Ugcm9vbV9pPFQ+e1xyXG4gIGJhY2tncm91bmRfdXJsOnN0cmluZyxcclxuICBvYmplY3RzOm9ialtdXHJcbiAgc3RhdGU6VFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIG9iamVjdF9zdGF0ZV9jb25maWcge1xyXG4gIHR5cGU6c3RyaW5nLFxyXG4gIHN0YXRlOm9ial9zdGF0ZSxcclxuICBwYXJhbWV0ZXJzPzogdW5rbm93blxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIHN0YXRlX2NvbmZpZ3tcclxuICBvYmplY3RzOm9iamVjdF9zdGF0ZV9jb25maWdbXVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3Mgcm9vbTxUPntcclxuICAvL1VybCB0byBhbiBpbWFnZSB0byBiZSB1c2VkIGZvciB0aGUgcm9vbSBiYWNrZ3JvdW5kXHJcbiAgYmFja2dyb3VuZF91cmw6IHN0cmluZztcclxuICBiYWNrZ3JvdW5kOiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gIG9iamVjdHM6IG9ialtdID0gW107XHJcbiAgLy9UaGlzIG9iamVjdCBjb250YWlucyBwYXJ0aWNsZSBkZWZpbml0aW9uc1xyXG4gIHBhcnRpY2xlczpwYXJ0aWNsZXMgPSB7fTtcclxuICAvL1RoaXMgYXJyYXkgaXMgd2hhdCBhY3R1YWxseSBjb250YWlucyB0aGUgcGFydGljbGVzXHJcbiAgLy90aGF0IGV4aXN0cyB3aXRoaW4gdGhlIHJvb20uXHJcbiAgcGFydGljbGVzX2Fycjogb2JqW10gPSBbXTtcclxuICBzdGF0ZTogVDtcclxuICBiaW5kczpudW1iZXJbXSA9IFtdO1xyXG4gIGdhbWU6Z2FtZTx1bmtub3duPjtcclxuICBodWQ6SFVEO1xyXG4gIGF1ZGlvID0gbmV3IGF1ZGlvKCk7XHJcbiAgLy9UaGVzZSB0ZXh0IG5vZGVzIGV4aXN0cyBpbiB0aGUgYWN0dWFsIHJvb20gc3BhY2UsIHJhdGhlciB0aGFuXHJcbiAgLy9vbiB0aGUgaHVkIGxheWVyLlxyXG4gIHJlbmRlcjpib29sZWFuID0gdHJ1ZTtcclxuICB0ZXh0X25vZGVzOlRleHRbXSA9IFtdO1xyXG4gIGNvbnN0cnVjdG9yKGdhbWU6Z2FtZTx1bmtub3duPixjb25maWc6c3RhdGVfY29uZmlnKXtcclxuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICBmb3IobGV0IGMgb2YgY29uZmlnLm9iamVjdHMpe1xyXG4gICAgICAvL1RoaXMgaGFuZGxlcyBsb2FkaW5nIG9iamVjdHMgZnJvbSB0aGUgc2F2ZWQganNvbiBmaWxlIGFzc29jaWF0ZWQgd2l0aCBlYWNoIHJvb20uXHJcbiAgICAgIHRoaXMuYWRkSXRlbVN0YXRlQ29uZmlnKGMpXHJcbiAgICB9XHJcbiAgfVxyXG4gIGV4cG9ydFN0YXRlQ29uZmlnKCl7XHJcbiAgICBsZXQgY29uZmlnOnN0YXRlX2NvbmZpZyA9IHtvYmplY3RzOltdfTtcclxuICAgIGZvcihsZXQgbyBvZiB0aGlzLm9iamVjdHMuZmlsdGVyKChvYmopPT5vYmouc2F2ZV90b19maWxlKSl7XHJcbiAgICAgIC8vSWYgYW4gb2JqZWN0IGhhcyBhIHBhcmVudCBvYmplY3QsIGl0J3MgYSBkZXNjZW5kZW50IG9mIGEgY29tcG9zaXRlIG9iamVjdFxyXG4gICAgICAvL1RoZSBwYXJlbnQgd2lsbCBzcGF3biB0aGlzIG9iamVjdCB3aGVuIGl0J3MgaW5zdGFudGlhdGVkLCBzbyB3ZSBkb1xyXG4gICAgICAvL25vdCBoYXZlIHRvIHNhdmUgdGhpcyBpbnN0YW5jZS5cclxuICAgICAgICBpZighby5wYXJlbnQpe1xyXG4gICAgICAgIGNvbmZpZy5vYmplY3RzLnB1c2goe1xyXG4gICAgICAgICAgdHlwZTpvLmNvbnN0cnVjdG9yLm5hbWUsXHJcbiAgICAgICAgICBzdGF0ZTpvLnN0YXRlLFxyXG4gICAgICAgICAgcGFyYW1ldGVyczpvLnBhcmFtc1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBjb25maWc7XHJcbiAgfVxyXG4gIC8vVGhpcyBoYW5kbGVzIHRoZSBsb2FkaW5nIG9mIGFsbCByb29tIHNwcml0ZXMsIGFuZFxyXG4gIC8vYW55IG9iamVjdHMgaXQgY29udGFpbnMuXHJcbiAgbG9hZCgpIHtcclxuICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBsZXQgYSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICBsZXQgdG9fYXdhaXQgPSB0aGlzLm9iamVjdHMubWFwKChhKSA9PiBhLmxvYWQoKSk7XHJcbiAgICAgIGF3YWl0IFByb21pc2UuYWxsKHRvX2F3YWl0KTtcclxuICAgICAgbGV0IHAgPSB0aGlzLmJhY2tncm91bmRfdXJsO1xyXG4gICAgICBpZihERUJVRyl7XHJcbiAgICAgICAgcCA9IHBhdGguam9pbihyb290X3BhdGgsdGhpcy5iYWNrZ3JvdW5kX3VybCk7XHJcbiAgICAgIH1cclxuICAgICAgYS5zcmMgPSBwO1xyXG4gICAgICBhLm9uZXJyb3IgPSAoKCkgPT4ge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkxvYWRpbmcgRXJyb3I6XCIgKyB0aGlzLmJhY2tncm91bmRfdXJsKTtcclxuICAgICAgfSlcclxuICAgICAgYS5vbmxvYWQgPSAoYXN5bmMoKSA9PiB7XHJcbiAgICAgICAgX3RoaXMuYmFja2dyb3VuZCA9IGE7XHJcbiAgICAgICAgYXdhaXQgdGhpcy5hdWRpby5sb2FkKCk7XHJcbiAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgfVxyXG4gIC8vVGhpcyBpcyB1c2VkIHdoaWxlIGxvYWRpbmcgb2JqZWN0cyBmcm9tIGZpbGUsIGl0J3MgdXNlZCB0byBkeW5hbWljYWxseSBsb2FkXHJcbiAgLy9vYmplY3RzIGZyb20gdGhlIHJvb20ncyBqc29uLiBJZiBhZGRpbmcgaXRlbXMgd2l0aGluIGNvZGUsIGl0J3MgYmV0dGVyIHRvIGNyZWF0ZVxyXG4gIC8vbmV3IGluc3RhbmNlcyBvZiBvYmplY3RzIHRocm91Z2ggYWRkSXRlbVxyXG4gIGFzeW5jIGFkZEl0ZW1TdGF0ZUNvbmZpZyhjb25maWc6b2JqZWN0X3N0YXRlX2NvbmZpZyl7XHJcbiAgICBpZihwcmVmYWJzW2NvbmZpZy50eXBlXSl7XHJcbiAgICAgIGxldCBuZXdfb2JqID0gPG9iaj4obmV3IHByZWZhYnNbY29uZmlnLnR5cGVdKE9iamVjdC5hc3NpZ24oe30sY29uZmlnLnN0YXRlKSxjb25maWcucGFyYW1ldGVycykpO1xyXG4gICAgICB0aGlzLmFkZEl0ZW1zKG5ld19vYmouY29tYmluZWRPYmplY3RzKCkpO1xyXG4gICAgfVxyXG4gICAgZWxzZXtcclxuICAgICAgY29uc29sZS5sb2coXCJVTktOT1dOIFRZUEUgQVRURU1QVEVEIFRPIExPQUQ6IFwiICsgY29uZmlnLnR5cGUpXHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vQWRkcyB0aGUgcGFzc2VkIGl0ZW0gdG8gdGhlIHJvb20uXHJcbiAgYXN5bmMgYWRkSXRlbShvOm9iaiwgbGlzdCA9IHRoaXMub2JqZWN0cyl7XHJcbiAgICB0aGlzLmFkZEl0ZW1zKFtvXSxsaXN0KTtcclxuICB9XHJcbiAgLy9BZGRzIGV2ZXJ5IGl0ZW0gaW4gdGhlIHBhc3NlZCBhcnJheSB0byB0aGUgcm9vbS5cclxuICBhc3luYyBhZGRJdGVtcyhvOm9ialtdLCBsaXN0ID0gdGhpcy5vYmplY3RzKXtcclxuICAgIGZvcihsZXQgb2Igb2Ygbyl7XHJcbiAgICAgIG9iLmdhbWUgPSB0aGlzLmdhbWU7XHJcbiAgICB9XHJcbiAgICBhd2FpdCBQcm9taXNlLmFsbChvLm1hcCgoYSk9PmEubG9hZCgpKSk7XHJcbiAgICBsaXN0LnB1c2goLi4ubyk7XHJcbiAgICBpZihERUJVRyAmJiBsaXN0ID09PSB0aGlzLm9iamVjdHMpe1xyXG4gICAgICBkZWJ1Z191cGRhdGVfb2JqX2xpc3QoKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy9EZWxldGVzIHRoZSBpdGVtIGFuZCByZW1vdmVzIGl0IGZyb20gdGhlIHJvb20ncyBvYmplY3QgbGlzdFxyXG4gIGRlbGV0ZUl0ZW0oaWQ6c3RyaW5nLCBsaXN0ID0gdGhpcy5vYmplY3RzKXtcclxuICAgIGZvcihsZXQgYSA9IDA7YSA8IGxpc3QubGVuZ3RoO2ErKyl7XHJcbiAgICAgIGlmKGxpc3RbYV0uaWQgPT09IGlkKXtcclxuICAgICAgICBsaXN0LnNwbGljZShhLDEpXHJcbiAgICAgICAgYS0tO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZihERUJVRyAmJiBsaXN0ID09PSB0aGlzLm9iamVjdHMpe1xyXG4gICAgICBkZWJ1Z191cGRhdGVfb2JqX2xpc3QoKTtcclxuICAgIH1cclxuICB9XHJcbiAgLy9BbnkgcGFydGljbGVzIHRoYXQgYXJlIG5lZWRlZCBpbiB0aGUgcm9vbSBzaG91bGQgYmUgYWRkZWQgdG8gdGhlIHBhcnRpY2xlIGFycmF5IGhlcmUuXHJcbiAgcmVnaXN0ZXJQYXJ0aWNsZXMoKXtcclxuXHJcbiAgfVxyXG4gIC8vQWRkcyBhIGJpbmQgdGhhdCBpcyBleGVjdXRlZCB3aGVuIHRoZSBwYXNzZWQga2V5IGlzIGFjdGl2YXRlZFxyXG4gIC8va2V5IGV4YW1wbGVzOiBtb3VzZTBkb3duIEtleUFkb3duIEtleUx1cFxyXG4gIGJpbmRDb250cm9sKGtleTpzdHJpbmcseDpleGVjX3R5cGUsZnVuYzpjb250cm9sX2Z1bmMsaW50ZXJ2YWw6bnVtYmVyID0gMSl7XHJcbiAgICB0aGlzLmJpbmRzLnB1c2goQmluZChrZXksZnVuYyx4LGludGVydmFsKSk7IFxyXG4gIH1cclxuICAvL0NoZWNrcyBmb3Igb2JqZWN0cyB0aGF0IGhhdmUgY29sbGlzaW9uIGF0IHRoZSBwYXNzZWQgcG9pbnRcclxuICBjaGVja0NvbGxpc2lvbnNQb2ludChwb3M6VmVjdG9yLGV4ZW1wdD86c3RyaW5nW10sbGlzdCA9IHRoaXMub2JqZWN0cyk6b2JqW117XHJcbiAgICByZXR1cm4gdGhpcy5jaGVja0NvbGxpc2lvbnMoe3g6cG9zLngseTpwb3MueSxoZWlnaHQ6MCx3aWR0aDowfSxleGVtcHQsbGlzdCk7XHJcbiAgfVxyXG4gIC8vQ2hlY2tzIGZvciBhbnkgb2JqZWN0cyBhdCB0aGUgcGFzc2VkIHBvaW50XHJcbiAgY2hlY2tPYmplY3RzUG9pbnQocG9zOlZlY3RvcixleGVtcHQ/OnN0cmluZ1tdLGxpc3QgPSB0aGlzLm9iamVjdHMpOm9ialtde1xyXG4gICAgcmV0dXJuIHRoaXMuY2hlY2tPYmplY3RzKHt4OnBvcy54LHk6cG9zLnksaGVpZ2h0OjAsd2lkdGg6MH0sZXhlbXB0LGxpc3QpO1xyXG4gIH1cclxuICAvL0NoZWNrcyBmb3IgY29sbGlzaW9ucyBhdCB0aGUgcG9pbnQgdGhhdCBjb250YWluIGV2ZXJ5IHRhZyB3aXRoaW4gdGhlIHNlY29uZCBhcmd1bWVudFxyXG4gIGNoZWNrQ29sbGlzaW9uc1BvaW50SW5jbHVzaXZlKHBvczpWZWN0b3IsdGFncz86c3RyaW5nW10sbGlzdCA9IHRoaXMub2JqZWN0cyk6b2JqW117XHJcbiAgICByZXR1cm4gdGhpcy5jaGVja0NvbGxpc2lvbnNJbmNsdXNpdmUoe3g6cG9zLngseTpwb3MueSxoZWlnaHQ6MCx3aWR0aDowfSx0YWdzLGxpc3QpO1xyXG4gIH1cclxuICAvL0NoZWNrcyBmb3IgYW55IG9iamVjdHMgdGhhdCBjb250YWluIGV2ZXJ5IHRhZyB3aXRoaW4gdGhlIHNlY29uZCBhcmd1bWVudFxyXG4gIGNoZWNrT2JqZWN0c1BvaW50SW5jbHVzaXZlKHBvczpWZWN0b3IsdGFncz86c3RyaW5nW10sbGlzdCA9IHRoaXMub2JqZWN0cyk6b2JqW117XHJcbiAgICByZXR1cm4gdGhpcy5jaGVja09iamVjdHNJbmNsdXNpdmUoe3g6cG9zLngseTpwb3MueSxoZWlnaHQ6MCx3aWR0aDowfSx0YWdzLGxpc3QpO1xyXG4gIH1cclxuICAvL0NoZWNrcyBmb3IgY29sbGlzaW9ucyBpbiB0aGUgYm94IHRoYXQgY29udGFpbiB0aGUgdGFncyBpbiB0aGUgc2Vjb25kIGFyZ3VtZW50XHJcbiAgY2hlY2tDb2xsaXNpb25zSW5jbHVzaXZlKGJveDpjb2xsaXNpb25fYm94LHRhZ3M6c3RyaW5nW10sbGlzdD10aGlzLm9iamVjdHMpOm9ialtde1xyXG4gICAgaWYoREVCVUcpe1xyXG4gICAgICByZW5kZXJfY29sbGlzaW9uX2JveChib3gpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxpc3QuZmlsdGVyKG9iaj0+b2JqLmNvbGxpc2lvbiAmJiBvYmouY29sbGlkZXNXaXRoQm94KGJveCkgJiYgdGFncy5ldmVyeSgodmFsKT0+b2JqLnRhZ3MuaW5jbHVkZXModmFsKSkpO1xyXG4gICAgXHJcbiAgfVxyXG4gIC8vQ2hlY2tzIGZvciBhbnkgb2JqZWN0cyBpbiB0aGUgYm94IHRoYXQgY29udGFpbiBhbGwgdGFncyBpbiB0aGUgc2Vjb25kIGFyZ3VtZW50XHJcbiAgY2hlY2tPYmplY3RzSW5jbHVzaXZlKGJveDpjb2xsaXNpb25fYm94LHRhZ3M6c3RyaW5nW10sbGlzdD10aGlzLm9iamVjdHMpOm9ialtde1xyXG4gICAgaWYoREVCVUcpe1xyXG4gICAgICByZW5kZXJfY29sbGlzaW9uX2JveChib3gpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGxpc3QuZmlsdGVyKChvYmopPT5vYmouY29sbGlkZXNXaXRoQm94KGJveCkgJiYgdGFncy5ldmVyeSgodmFsKT0+b2JqLnRhZ3MuaW5jbHVkZXModmFsKSkpO1xyXG4gICAgXHJcbiAgfVxyXG4gIC8vY2hlY2tzIGZvciBvYmplY3RzIHdpdGggY29sbGlzaW9uIGluIHRoZSBib3ggdGhhdCBkbyBub3QgY29udGFpbiB0aGUgdGFncyBpbiB0aGUgc2Vjb25kIGFyZ3VtZW50XHJcbiAgY2hlY2tDb2xsaXNpb25zKGJveDpjb2xsaXNpb25fYm94LGV4ZW1wdD86c3RyaW5nW10sbGlzdD10aGlzLm9iamVjdHMpOm9ialtde1xyXG4gICAgaWYoREVCVUcpe1xyXG4gICAgICByZW5kZXJfY29sbGlzaW9uX2JveChib3gpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoZWNrX2FsbF9jb2xsaXNpb25zKGJveCxsaXN0LGV4ZW1wdCk7XHJcbiAgfVxyXG4gIC8vY2hlY2tzIGZvciAgYW55IG9iamVjdHMgaW4gdGhlIGJveCB0aGF0IGRvIG5vdCBjb250YWluIHRoZSB0YWdzIGluIHRoZSBzZWNvbmQgYXJndW1lbnRcclxuICBjaGVja09iamVjdHMoYm94OmNvbGxpc2lvbl9ib3gsZXhlbXB0PzpzdHJpbmdbXSxsaXN0PXRoaXMub2JqZWN0cyk6b2JqW117XHJcbiAgICBpZihERUJVRyl7XHJcbiAgICAgIHJlbmRlcl9jb2xsaXNpb25fYm94KGJveCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hlY2tfYWxsX29iamVjdHMoYm94LGxpc3QsZXhlbXB0KTtcclxuICB9XHJcbiAgLy9UaGlzIG1ldGhvZCBzaG91bGQgYmUgdXNlZCB0byBjYWxsIGJpbmRDb250cm9sIGFuZCBjcmVhdGUgYW55IG5lZWRlZCBrZXlCaW5kaW5nc1xyXG4gIHJlZ2lzdGVyQ29udHJvbHMoKXtcclxuXHJcbiAgfVxyXG4gIGNsZWFudXAoKXtcclxuXHJcbiAgfVxyXG4gIC8vVGhlIHJvb20ncyBzdGF0ZSB1cGRhdGluZyBmdW5jdGlvbi5cclxuICBzdGF0ZWYodGltZTogbnVtYmVyKSB7XHJcbiAgICBmb3IobGV0IHBhcnRpY2xlIG9mIHRoaXMucGFydGljbGVzX2Fycil7XHJcbiAgICAgIHBhcnRpY2xlLnN0YXRlZih0aW1lKTtcclxuICAgIH1cclxuICAgIGZvcihsZXQgdGV4dF9ub2RlIG9mIHRoaXMudGV4dF9ub2Rlcyl7XHJcbiAgICAgIHRleHRfbm9kZS5zdGF0ZWYodGltZSk7XHJcbiAgICB9XHJcbiAgICBsZXQgdGlja2luZ19vYmplY3RzID0gdGhpcy5vYmplY3RzLmZpbHRlcigobyk9Pm8udGlja19zdGF0ZSk7XHJcbiAgICBmb3IgKGxldCBhID0gMDsgYSA8IHRpY2tpbmdfb2JqZWN0cy5sZW5ndGg7IGErKykge1xyXG4gICAgICAvL1RoaXMgZnVuY3Rpb24gY2hlY2tzIHRoZSB2ZWxvY2l0eSBvZiBldmVyeSBvYmplY3QsIGFuZCBtb3ZlcyBpdCBpbnRvIGl0J3MgbmV4dCBsb2NhdGlvblxyXG4gICAgICAvL3Byb3ZpZGVkIHRoYXQgaXQgY2FuIGZpdCB0aGVyZS5cclxuICAgICAgdmVsb2NpdHlDb2xsaXNpb25DaGVjayh0aWNraW5nX29iamVjdHNbYV0sIHRoaXMub2JqZWN0cyk7XHJcbiAgICAgIHRpY2tpbmdfb2JqZWN0c1thXS5zdGF0ZWYodGltZSk7XHJcbiAgICB9XHJcbiAgICBpZih0aGlzLmdhbWUuc3RhdGUuY2FtZXJhcyl7XHJcbiAgICAgIGZvcihsZXQgY2FtZXJhcyBvZiB0aGlzLmdhbWUuc3RhdGUuY2FtZXJhcyl7XHJcbiAgICAgICAgaWYoY2FtZXJhcy5odWQpe1xyXG4gICAgICAgICAgY2FtZXJhcy5odWQuc3RhdGVmKHRpbWUpO1xyXG4gICAgICAgIH0gXHJcbiAgICAgIH0gXHJcbiAgICB9XHJcbiAgfVxyXG4gIGVtaXRQYXJ0aWNsZShuYW1lOnN0cmluZyxwb3M6cG9zaXRpb24sbGlmZXRpbWU6bnVtYmVyLHBvc19yYW5nZTpudW1iZXIpe1xyXG4gICAgbGV0IHN0YXRlID0ge1xyXG4gICAgICBwb3NpdGlvbjpwb3MsXHJcbiAgICAgIHZlbG9jaXR5Ont4OjAseTowfSxcclxuICAgICAgcm90YXRpb246MCxcclxuICAgICAgc2NhbGluZzp7d2lkdGg6MSxoZWlnaHQ6MX1cclxuICAgIH1cclxuICAgIHRoaXMuYWRkSXRlbShuZXcgUGFydGljbGUodGhpcy5wYXJ0aWNsZXNbbmFtZV0sc3RhdGUsbGlmZXRpbWUscG9zX3JhbmdlKSwgdGhpcy5wYXJ0aWNsZXNfYXJyKTtcclxuICB9XHJcbiAgZ2V0T2JqKGlkOnN0cmluZyl7XHJcbiAgICBmb3IobGV0IGEgPSAwOyBhIDwgdGhpcy5vYmplY3RzLmxlbmd0aDsgYSsrKXtcclxuICAgICAgaWYodGhpcy5vYmplY3RzW2FdLmlkID09IGlkKXtcclxuICAgICAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RzW2FdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcbiAgLy9HZXRzIGFueSBvYmplY3RzIHRoYXQgaGF2ZSB0aGUgcGFzc2VkIHRhZ1xyXG4gIGdldE9iakJ5VGFnKHRhZzpzdHJpbmcpOm9ialtde1xyXG4gICAgcmV0dXJuIHRoaXMub2JqZWN0cy5maWx0ZXIoKGEpPT5hLnRhZ3MuaW5kZXhPZih0YWcpID4gLTEpO1xyXG4gIH1cclxuICAvL3JlbmRlcnMgdGhlIHJvb20ncyBzcHJpdGVcclxuICByZW5kZXJmKHRpbWU6IG51bWJlcik6IHNwcml0ZSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBzcHJpdGVfc2hlZXQ6IHRoaXMuYmFja2dyb3VuZCxcclxuICAgICAgbGVmdDogMCxcclxuICAgICAgdG9wOiAwLFxyXG4gICAgICBzcHJpdGVfaGVpZ2h0OiB0aGlzLmJhY2tncm91bmQuaGVpZ2h0LFxyXG4gICAgICBzcHJpdGVfd2lkdGg6IHRoaXMuYmFja2dyb3VuZC53aWR0aCxcclxuICAgICAgb3BhY2l0eToxXHJcbiAgICB9XHJcbiAgfVxyXG59IiwiaW1wb3J0IHsgb2JqIH0gZnJvbSBcIi4vb2JqZWN0XCI7XHJcbmltcG9ydCB7IG9ial9zdGF0ZSwgVmVjdG9yLCBkaW1lbnNpb25zfSBmcm9tIFwiLi9zdGF0ZVwiO1xyXG5pbXBvcnQge2dldFJhbmRJbnR9IGZyb20gXCIuL21hdGhcIjtcclxuaW1wb3J0IHtwYXJ0aWNsZV9lbnRyeX0gZnJvbSBcIi4vcm9vbVwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBzcHJpdGV7XHJcbiAgc3ByaXRlX3NoZWV0OkhUTUxJbWFnZUVsZW1lbnQsXHJcbiAgbGVmdDpudW1iZXIsXHJcbiAgdG9wOm51bWJlcixcclxuICBzcHJpdGVfd2lkdGg6bnVtYmVyLFxyXG4gIHNwcml0ZV9oZWlnaHQ6bnVtYmVyLFxyXG4gIG9wYWNpdHk6bnVtYmVyXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgcG9zaXRpb25lZF9zcHJpdGV7XHJcbiAgc3ByaXRlOnNwcml0ZSxcclxuICB4Om51bWJlcixcclxuICB5Om51bWJlclxyXG59XHJcblxyXG5pbnRlcmZhY2UgUGFydGljbGVfaSBleHRlbmRzIG9ial9zdGF0ZXtcclxuICBsaWZldGltZTpudW1iZXI7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQYXJ0aWNsZSBleHRlbmRzIG9iantcclxuICBjb2xsaXNpb24gPSBmYWxzZTtcclxuICByYW5kb21fcmFuZ2U6bnVtYmVyO1xyXG4gIG1heF9saWZldGltZTpudW1iZXI7XHJcbiAgc3RhdGU6UGFydGljbGVfaTtcclxuICBzZWxlY3RlZF9zcHJpdGU6c3ByaXRlO1xyXG4gIGNvbnN0cnVjdG9yKHBhcnQ6cGFydGljbGVfZW50cnksc3RhdGU6b2JqX3N0YXRlLGxpZmV0aW1lOm51bWJlcixyYW5kb21fcmFuZ2U6bnVtYmVyKXtcclxuICAgIHN1cGVyKHN0YXRlKTtcclxuICAgIHRoaXMuc3RhdGUubGlmZXRpbWUgPSAwO1xyXG4gICAgdGhpcy5zcHJpdGVfdXJsID0gcGFydC5zcHJpdGU7XHJcbiAgICB0aGlzLmhlaWdodCA9IHBhcnQuaGVpZ2h0O1xyXG4gICAgdGhpcy53aWR0aCA9IHBhcnQud2lkdGg7XHJcbiAgICB0aGlzLm1heF9saWZldGltZSA9IGxpZmV0aW1lO1xyXG4gICAgdGhpcy5yYW5kb21fcmFuZ2UgPSByYW5kb21fcmFuZ2U7XHJcbiAgICB0aGlzLnN0YXRlLnBvc2l0aW9uLnggKz0gZ2V0UmFuZEludCgtcmFuZG9tX3JhbmdlLzIscmFuZG9tX3JhbmdlLzIpO1xyXG4gICAgdGhpcy5zdGF0ZS5wb3NpdGlvbi55ICs9IGdldFJhbmRJbnQoLXJhbmRvbV9yYW5nZS8yLHJhbmRvbV9yYW5nZS8yKTtcclxuICB9XHJcbiAgZGVsZXRlKCl7XHJcbiAgICBsZXQgcm9vbSA9IHRoaXMuZ2FtZS5nZXRSb29tKCk7XHJcbiAgICByb29tLmRlbGV0ZUl0ZW0odGhpcy5pZCxyb29tLnBhcnRpY2xlc19hcnIpO1xyXG4gIH1cclxuICBzdGF0ZWYodGltZTpudW1iZXIpe1xyXG4gICAgdGhpcy5zdGF0ZS5saWZldGltZSArPSB0aW1lO1xyXG4gICAgaWYodGhpcy5zdGF0ZS5saWZldGltZSA+IHRoaXMubWF4X2xpZmV0aW1lKXtcclxuICAgICAgdGhpcy5kZWxldGUoKTtcclxuICAgIH1cclxuICB9XHJcbiAgcmVuZGVyZih0aW1lOm51bWJlcik6cG9zaXRpb25lZF9zcHJpdGV7XHJcbiAgICBpZighdGhpcy5zZWxlY3RlZF9zcHJpdGUpe1xyXG4gICAgICBsZXQgc3ByaXRlcyA9IHNwcml0ZV9nZW4odGhpcy5zcHJpdGVfc2hlZXQsdGhpcy53aWR0aCx0aGlzLmhlaWdodClcclxuICAgICAgbGV0IHJhbmRvbV9yb3cgPSBnZXRSYW5kSW50KDAsc3ByaXRlcy5sZW5ndGgpO1xyXG4gICAgICBsZXQgcmFuZG9tX2NvbCA9IGdldFJhbmRJbnQoMCxzcHJpdGVzW3JhbmRvbV9yb3ddLmxlbmd0aCk7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRfc3ByaXRlID0gc3ByaXRlc1tyYW5kb21fcm93XVtyYW5kb21fY29sXTtcclxuICAgIH1cclxuICAgIHRoaXMuc2VsZWN0ZWRfc3ByaXRlLm9wYWNpdHkgPSAxIC0gdGhpcy5zdGF0ZS5saWZldGltZS90aGlzLm1heF9saWZldGltZTtcclxuICAgIHJldHVybntcclxuICAgICAgeDp0aGlzLnN0YXRlLnBvc2l0aW9uLngsXHJcbiAgICAgIHk6dGhpcy5zdGF0ZS5wb3NpdGlvbi55LFxyXG4gICAgICBzcHJpdGU6dGhpcy5zZWxlY3RlZF9zcHJpdGUgXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc3ByaXRlX2dlbihzcHJpdGVfc2hlZXQ6SFRNTEltYWdlRWxlbWVudCxzcHJpdGVfd2lkdGg6bnVtYmVyLHNwcml0ZV9oZWlnaHQ6bnVtYmVyKTpBcnJheTxBcnJheTxzcHJpdGU+PntcclxuICBsZXQgd2lkdGggPSBzcHJpdGVfc2hlZXQud2lkdGg7XHJcbiAgbGV0IGhlaWdodCA9IHNwcml0ZV9zaGVldC5oZWlnaHQ7XHJcbiAgbGV0IHNwcml0ZXM6QXJyYXk8QXJyYXk8c3ByaXRlPj4gPSBbXTtcclxuICBmb3IobGV0IGIgPSAwOyBiIDwgaGVpZ2h0O2IgKz0gc3ByaXRlX2hlaWdodCl7XHJcbiAgICBzcHJpdGVzLnB1c2goW10pO1xyXG4gICAgZm9yKGxldCBhID0gMDsgYSA8IHdpZHRoO2EgKz0gc3ByaXRlX3dpZHRoKXtcclxuICAgICAgc3ByaXRlc1tiXS5wdXNoKHtcclxuICAgICAgICBzcHJpdGVfc2hlZXQsXHJcbiAgICAgICAgbGVmdDphLFxyXG4gICAgICAgIHRvcDpiICogc3ByaXRlX2hlaWdodCxcclxuICAgICAgICBzcHJpdGVfaGVpZ2h0LFxyXG4gICAgICAgIHNwcml0ZV93aWR0aCxcclxuICAgICAgICBvcGFjaXR5OjFcclxuICAgICAgfSlcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHNwcml0ZXM7XHJcbn1cclxuXHJcbiIsImV4cG9ydCBsZXQgb2JqZWN0X3RlbXBsYXRlID0gXHJcbmBpbXBvcnQge29ian0gZnJvbSBcImxpYi9vYmplY3RcIjtcclxuaW1wb3J0IHsgb2JqX3N0YXRlLCBWZWN0b3IgfSBmcm9tIFwibGliL3N0YXRlXCI7XHJcblxyXG5pbnRlcmZhY2UgdGVtcGxhdGVfc3RhdGUgZXh0ZW5kcyBvYmpfc3RhdGV7XHJcbiAgICBcclxufVxyXG4gICAgXHJcbmludGVyZmFjZSB0ZW1wbGF0ZV9wYXJhbWV0ZXJze1xyXG4gICAgXHJcbn1cclxuICAgIFxyXG5leHBvcnQgY2xhc3MgdGVtcGxhdGUgZXh0ZW5kcyBvYmp7XHJcbiAgc3ByaXRlX3VybCA9IFwiLi9zcHJpdGVzL0Vycm9yLnBuZ1wiO1xyXG4gIGhlaWdodCA9IDEwMDtcclxuICB3aWR0aCA9IDEwMDtcclxuICB0YWdzOkFycmF5PHN0cmluZz47XHJcbiAgY29sbGlzaW9uID0gdHJ1ZTtcclxuICByZW5kZXIgPSB0cnVlO1xyXG4gIHN0YXRlOnRlbXBsYXRlX3N0YXRlO1xyXG4gIHBhcmFtczp0ZW1wbGF0ZV9wYXJhbWV0ZXJzO1xyXG4gIHN0YXRpYyBkZWZhdWx0X3BhcmFtczp0ZW1wbGF0ZV9wYXJhbWV0ZXJzID0ge31cclxuICBjb25zdHJ1Y3RvcihzdGF0ZTpvYmpfc3RhdGUscGFyYW1zOnRlbXBsYXRlX3BhcmFtZXRlcnMgPSB0ZW1wbGF0ZS5kZWZhdWx0X3BhcmFtcyl7XHJcbiAgICBzdXBlcihzdGF0ZSxwYXJhbXMpO1xyXG4gIH1cclxuICBzdGF0ZWYodGltZV9kZWx0YTpudW1iZXIpe1xyXG4gICAgc3VwZXIuc3RhdGVmKHRpbWVfZGVsdGEpO1xyXG4gIH1cclxuICByZW5kZXJmKHRpbWVfZGVsdGE6bnVtYmVyKXtcclxuICAgcmV0dXJuIHN1cGVyLnJlbmRlcmYodGltZV9kZWx0YSk7IFxyXG4gIH1cclxuICByZWdpc3Rlcl9hbmltYXRpb25zKCl7XHJcbiAgICBcclxuICB9XHJcbiAgcmVnaXN0ZXJfYXVkaW8oKXtcclxuICAgIFxyXG4gIH1cclxuICByZWdpc3Rlcl9jb250cm9scygpe1xyXG4gICAgICAgIFxyXG4gIH1cclxufWA7ICAgICIsImV4cG9ydCBsZXQgcm9vbV90ZW1wbGF0ZSA9IFxyXG5gaW1wb3J0IHsgcm9vbSB9IGZyb20gXCJsaWIvcm9vbVwiO1xyXG5pbXBvcnQgeyBnYW1lIH0gZnJvbSBcInNyYy92YW5cIjtcclxuaW1wb3J0IHsgc3RhdGVfY29uZmlnIH0gZnJvbSBcImxpYi9yb29tXCI7XHJcbmltcG9ydCAqIGFzIGNvbmZpZyBmcm9tIFwiLi90ZW1wbGF0ZS5qc29uXCI7XHJcbmxldCBjZmlnID0gY29uZmlnIGFzIHVua25vd24gYXMgc3RhdGVfY29uZmlnO1xyXG5pbnRlcmZhY2UgdGVtcGxhdGVfc3RhdGUge1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIHRlbXBsYXRlIGV4dGVuZHMgcm9vbTx0ZW1wbGF0ZV9zdGF0ZT57XHJcbiAgYmFja2dyb3VuZF91cmwgPSBcIi4vc3ByaXRlcy9FcnJvci5wbmdcIjtcclxuICByZW5kZXIgPSB0cnVlO1xyXG4gIGNvbnN0cnVjdG9yKGdhbWU6IGdhbWU8dW5rbm93bj4pIHtcclxuICAgIHN1cGVyKGdhbWUsIGNmaWcpO1xyXG4gIH1cclxuICByZWdpc3RlckNvbnRyb2xzKCkge1xyXG5cclxuICB9XHJcbiAgcmVnaXN0ZXJQYXJ0aWNsZXMoKSB7XHJcblxyXG4gIH1cclxuICBzdGF0ZWYoZGVsdGFfdGltZTogbnVtYmVyKSB7XHJcbiAgICBzdXBlci5zdGF0ZWYoZGVsdGFfdGltZSk7XHJcbiAgfVxyXG5cclxufWA7IiwiZXhwb3J0IGxldCBERUJVRyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2JztcclxuZXhwb3J0IGxldCBQQVVTRUQgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2Rldic7XHJcbmltcG9ydCB7IG9ian0gZnJvbSBcIi4vbGliL29iamVjdFwiO1xyXG5pbXBvcnQgeyByb29tIH0gZnJvbSBcIi4vbGliL3Jvb21cIjtcclxuaW1wb3J0IHsgY29sbGlzaW9uX2JveCB9IGZyb20gXCIuL2xpYi9jb2xsaXNpb25cIjtcclxuaW1wb3J0IHsgc3ByaXRlX3JlbmRlcmVyLCByZWN0X3JlbmRlcmVyLCBzdHJva2VkX3JlY3RfcmVuZGVyZXIsIGh1ZF90ZXh0X3JlbmRlcmVyLCBDYW1lcmEsIHRleHRfcmVuZGVyZXIgLHNjYWxlX3R5cGV9IGZyb20gXCIuL2xpYi9yZW5kZXJcIjtcclxuaW1wb3J0IHsgRXhlY3V0ZVJlcGVhdEJpbmRzLCBVbmJpbmQgfSBmcm9tIFwiLi9saWIvY29udHJvbHNcIjtcclxuaW1wb3J0IHsgaW5pdF9jbGlja19oYW5kbGVyIH0gZnJvbSBcIi4vbGliL2NvbnRyb2xzXCI7XHJcbmltcG9ydCB7IGRlYnVnX3N0YXRlLCBkZWJ1Z191cGRhdGVfcm9vbV9saXN0LCBkZWJ1Z191cGRhdGVfb2JqX2xpc3QsZGVidWdfdXBkYXRlX3ByZWZhYnMsIGRlYnVnX3N0YXRlZiwgZGVidWdfc2V0dXAgfSBmcm9tIFwiLi9saWIvZGVidWdcIjtcclxuaW1wb3J0IHsgcm9vbXMgYXMgcm9vbV9saXN0IH0gZnJvbSBcIi4vZ2FtZS9yb29tcy9yb29tc1wiO1xyXG5cclxuXHJcbmxldCBjYW52YXNfZWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRhcmdldFwiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxubGV0IGNvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IGNhbnZhc19lbGVtZW50LmdldENvbnRleHQoXCIyZFwiKTtcclxuXHJcblxyXG5sZXQgc2NyZWVuX3dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XHJcbmxldCBzY3JlZW5faGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xyXG5cclxuXHJcbi8vSG93IG9mdGVuIHRoZSBnYW1lIGxvZ2ljIGxvb3Agc2hvdWxkIHJ1biwgaW4gbWlsbGlzZWNvbmRzXHJcbmxldCBsb2dpY19sb29wX2ludGVydmFsOiBudW1iZXIgPSAxMDAwIC8gNjA7XHJcblxyXG5sZXQgbGFzdF90aW1lID0gbmV3IERhdGUoKTtcclxuXHJcbmxldCBsYXN0X3JlbmRlcl90aW1lID0gMDtcclxuXHJcbmludGVyZmFjZSBkaW1lbnNpb25zIHtcclxuICBoZWlnaHQ6IG51bWJlcixcclxuICB3aWR0aDogbnVtYmVyXHJcbn1cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gR2V0U2NyZWVuRGltZW5zaW9ucygpOiBkaW1lbnNpb25zIHtcclxuICByZXR1cm4gKHtcclxuICAgIHdpZHRoOiBzY3JlZW5fd2lkdGgsXHJcbiAgICBoZWlnaHQ6IHNjcmVlbl9oZWlnaHRcclxuICB9KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gR2V0Vmlld3BvcnREaW1lbnNpb25zKCk6IGRpbWVuc2lvbnMge1xyXG4gIHJldHVybiAoe1xyXG4gICAgaGVpZ2h0OiBjYW52YXNfZWxlbWVudC5oZWlnaHQsXHJcbiAgICB3aWR0aDogY2FudmFzX2VsZW1lbnQud2lkdGhcclxuICB9KVxyXG59XHJcblxyXG5leHBvcnQgbGV0IHZpZXdwb3J0ID0ge1xyXG4gIGhlaWdodDogR2V0Vmlld3BvcnREaW1lbnNpb25zKCkuaGVpZ2h0LFxyXG4gIHdpZHRoOiBHZXRWaWV3cG9ydERpbWVuc2lvbnMoKS53aWR0aFxyXG59XHJcblxyXG53aW5kb3cub25yZXNpemUgPSAoKSA9PiB7XHJcbiAgdmlld3BvcnQuaGVpZ2h0ID0gR2V0Vmlld3BvcnREaW1lbnNpb25zKCkuaGVpZ2h0XHJcbiAgdmlld3BvcnQud2lkdGggPSBHZXRWaWV3cG9ydERpbWVuc2lvbnMoKS53aWR0aFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0RGVidWcoeDogYm9vbGVhbikge1xyXG4gIERFQlVHID0geDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNldFBhdXNlZCh4OiBib29sZWFuKSB7XHJcbiAgUEFVU0VEID0geDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJlbmRlcl9jb2xsaXNpb25fYm94ID0gKGE6IGNvbGxpc2lvbl9ib3gpID0+IHtcclxuICBib3hlcy5wdXNoKGEpO1xyXG59XHJcblxyXG5sZXQgYm94ZXM6IEFycmF5PGNvbGxpc2lvbl9ib3g+ID0gW107XHJcblxyXG5leHBvcnQgbGV0IGRlZXAgPSAoYTogYW55KSA9PiB7XHJcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYSkpO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgZ2FtZV9zdGF0ZTxUPiB7XHJcbiAgbG9naWM6IG51bWJlcixcclxuICBjb250ZXh0OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsXHJcbiAgY3VycmVudF9yb29tOiByb29tPHVua25vd24+LFxyXG4gIGNhbWVyYXM6IEFycmF5PENhbWVyYT4sXHJcbiAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCxcclxuICBnbG9iYWxzOiBUXHJcbn1cclxuXHJcblxyXG5leHBvcnQgbGV0IHJvb21zOiBhbnlbXSA9IFtdO1xyXG5leHBvcnQgbGV0IG9iamVjdHM6IGFueVtdO1xyXG5cclxuZXhwb3J0IGNsYXNzIGdhbWU8VD57XHJcbiAgc3RhdGU6IGdhbWVfc3RhdGU8VD47XHJcbiAgY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIC8vVGhlIG9mZnNjcmVlbiBjYW52YXMgYW5kIGNvbnRleHQgYXJlIHVzZWQgaW4gcmVuZGVyaW5nIG11bHRpcGxlIENhbWVyYXNcclxuICAvL1RoZSBjb250ZW50cyBhcmUgcmVuZGVyZWQgdG8gdGhlIG9mZnNjcmVlbiBjYW52YXMsIHRoZW4gY29waWVkIHRvIHRoZSBcclxuICAvL29uc2NyZWVuIGNhbnZhcywgaW4gdGhlIHByb3BlciBwb3NpdGlvbiBpbiB0aGUgdmlld3BvcnRcclxuICBvZmZzY3JlZW5fY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICBvZmZzY3JlZW5fY29udGV4dDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gIHByb3RvdHlwZXM6IEFycmF5PG9iaj4gPSBbXTtcclxuICByb29tczogQXJyYXk8YW55PiA9IFtdO1xyXG4gIGlzUmVuZGVyaW5nID0gZmFsc2U7XHJcbiAgY29uc3RydWN0b3IoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIGluaXRfc3RhdGU6IFQpIHtcclxuICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgIGNhbnZhczogY2FudmFzX2VsZW1lbnQsXHJcbiAgICAgIGxvZ2ljOiB1bmRlZmluZWQsXHJcbiAgICAgIGNvbnRleHQ6IGN0eCxcclxuICAgICAgY2FtZXJhczogW1xyXG4gICAgICBdLFxyXG4gICAgICBjdXJyZW50X3Jvb206IHVuZGVmaW5lZCxcclxuICAgICAgZ2xvYmFsczogaW5pdF9zdGF0ZVxyXG4gICAgfVxyXG4gICAgdGhpcy5vZmZzY3JlZW5fY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgIHRoaXMub2Zmc2NyZWVuX2NvbnRleHQgPSB0aGlzLm9mZnNjcmVlbl9jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG4gICAgLy9ERUJVRyBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGdhbWUgaXMgcnVubmluZyB3aXRoaW4gdGhlIGVkaXRvclxyXG4gICAgaWYgKERFQlVHKSB7XHJcbiAgICAgIC8vU2V0cyB1cCBzb21lIGdsb2JhbCBkZWJ1ZyBzdGF0ZSBhbmQgdGhlIGVkaXRvciBrZXliaW5kaW5nc1xyXG4gICAgICBkZWJ1Z19zZXR1cCgpO1xyXG4gICAgICAvL0luaXRpYWxpemVzIGEgc2VwYXJhdGUgbG9naWMgbG9vcCBzb2xlbHkgZm9yIHRoZSBlZGl0b3JcclxuICAgICAgLy9UaGlzIHNlcGFyYXRpb24gYWxsb3dzIGZvciB0aGUgZWRpdG9yIHRvIGludGVyYWN0IHdpdGggdGhlIGVudmlyb25tZW50IHdoaWxlXHJcbiAgICAgIC8vdGhlIGFjdHVhbCByb29tJ3Mgc3RhdGUgbG9vcCBpcyBwYXVzZWQuXHJcbiAgICAgIHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5nZXRSb29tKCkpIHtcclxuICAgICAgICAgIC8vVGhpcyBmdW5jdGlvbnMgaGFuZGxlcyB0aGUgZWRpdG9yIGludGVyYWN0aW9ucyB3aXRoIHRoZSBnYW1lIGVudmlyb25tZW50XHJcbiAgICAgICAgICBkZWJ1Z19zdGF0ZWYoMTYuNjYpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSwgMTYuNjYpXHJcbiAgICB9XHJcbiAgICAvL0NyZWF0ZXMgYSBvbmNsaWNrIGZ1bmN0aW9uIG9uIHRoZSB3aW5kb3cgdGhhdCBoYW5kbGVzIGVsZW1lbnQgb25jbGljayBmdW5jdGlvbnNcclxuICAgIGluaXRfY2xpY2tfaGFuZGxlcih0aGlzKTtcclxuICB9XHJcbiAgcmVuZGVyKHQ6IG51bWJlcikge1xyXG4gICAgLy90IGlzIGN1cnJlbnQgcmVuZGVyIHRpbWVcclxuICAgIGxldCBkZWx0YV90aW1lID0gdCAtIGxhc3RfcmVuZGVyX3RpbWVcclxuICAgIGxhc3RfcmVuZGVyX3RpbWUgPSB0O1xyXG4gICAgbGV0IGFsbF9jYW1lcmFzID0gdGhpcy5zdGF0ZS5jYW1lcmFzO1xyXG4gICAgbGV0IGVkaXRvcl9jYW1lcmFfaW5kZXggPSAtMTtcclxuICAgIGlmIChERUJVRykge1xyXG4gICAgICBkZWJ1Z19zdGF0ZS5yZW5kZXJfZGVsdGFfdGltZSA9IGRlbHRhX3RpbWU7XHJcbiAgICAgIGFsbF9jYW1lcmFzID0gWy4uLmFsbF9jYW1lcmFzLCBkZWJ1Z19zdGF0ZS5jYW1lcmFdXHJcbiAgICAgIGVkaXRvcl9jYW1lcmFfaW5kZXggPSBhbGxfY2FtZXJhcy5sZW5ndGggLSAxO1xyXG4gICAgICBpZihhbGxfY2FtZXJhcy5sZW5ndGggPT09IDEpe1xyXG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5maWxsU3R5bGUgPSBcIndoaXRlXCJcclxuICAgICAgICB0aGlzLnN0YXRlLmNvbnRleHQuZm9udCA9IFwiNTBweCBBcmlhbFwiXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5jb250ZXh0LmZpbGxUZXh0KFwiTk8gQ0FNRVJBXCIsIHZpZXdwb3J0LndpZHRoLzIsIHZpZXdwb3J0LmhlaWdodC8yKTtcclxuICAgICAgfVxyXG4gICAgICAvL1RoZSBlZGl0b3IgY2FtZXJhIGlzIGFsd2F5cyB0aGUgbGFzdCBjYW1lcmEgaW5zaWRlIHRoZSBjYW1lcmFzIGFycmF5XHJcbiAgICAgIC8vdGhlIGVkaXRvciBjYW1lcmEgaXMgcmVuZGVyZWQgdG8gYSBkaWZmZXJlbnQgY2FudmFzIHRoYW4gdGhlIG1haW4gZ2FtZSBjYW52YXNcclxuICAgICAgLy9zbyB3ZSB1c2UgdGhlIGNhbWVyYSdzIGluZGV4IHRvIGNoZWNrIHdoYXQgY2FudmFzIHRvIHJlbmRlciB0b1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgYSA9IDA7IGEgPCBhbGxfY2FtZXJhcy5sZW5ndGg7IGErKykge1xyXG4gICAgICBsZXQgY2FtZXJhID0gYWxsX2NhbWVyYXNbYV07XHJcbiAgICAgIC8vV2UgcmVuZGVyIHRoZSBjYW1lcmFzIGNvbnRlbnRzIHRvIGFuIG9mZnNjcmVlbiBjYW52YXMsIHRoZW4gY29weSBpdHMgY29udGVudHNcclxuICAgICAgLy90byB0aGUgbWFpbiBjYW52YXMuXHJcbiAgICAgIC8vVGhpcyBhbGxvd3MgdXMgdG8gYXZvaWQgYW55IG1hdGggbmVlZGVkIHRvIGRldGVybWluZSBzcHJpdGVzIHRoYXQgYXJlIHBhcnRpYWxseSBvZmZzY3JlZW5cclxuICAgICAgLy9hcyBhbnkgb2Zmc2NyZWVuIHNlY3Rpb25zIG9mIHRoZSBzcHJpdGVzIHdpbGwgbm90IGJlIGNvcGllZCBvdmVyLCByYXRoZXIgdGhhbiBleHBsaWNpdGx5IFxyXG4gICAgICAvL2NhbGN1bGF0aW5nIHRoZSBjdXRvZmZzXHJcbiAgICAgIHRoaXMub2Zmc2NyZWVuX2NhbnZhcy5oZWlnaHQgPSBjYW1lcmEuc3RhdGUuZGltZW5zaW9ucy5oZWlnaHQ7XHJcbiAgICAgIHRoaXMub2Zmc2NyZWVuX2NhbnZhcy53aWR0aCA9IGNhbWVyYS5zdGF0ZS5kaW1lbnNpb25zLndpZHRoO1xyXG4gICAgICB0aGlzLm9mZnNjcmVlbl9jb250ZXh0LmNsZWFyUmVjdCgwLCAwLCBjYW1lcmEuc3RhdGUuZGltZW5zaW9ucy53aWR0aCwgY2FtZXJhLnN0YXRlLmRpbWVuc2lvbnMuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5vZmZzY3JlZW5fY29udGV4dC5maWxsU3R5bGUgPSBcImJsYWNrXCI7XHJcbiAgICAgIHRoaXMub2Zmc2NyZWVuX2NvbnRleHQuZmlsbFJlY3QoMCwgMCwgY2FtZXJhLnN0YXRlLmRpbWVuc2lvbnMud2lkdGgsIGNhbWVyYS5zdGF0ZS5kaW1lbnNpb25zLmhlaWdodCk7XHJcbiAgICAgIC8vVGhpcyBjb2xsaXNpb24gYm94IHJlcHJlc2VudHMgdGhlIGNhbWVyYSdzIGZpZWxkIG9mIHZpZXcgaW4gdGhlIGdhbWUgc3BhY2VcclxuICAgICAgLy9XZSB1c2UgdGhlIHJvb20ncyBjaGVja09iamVjdHMgZnVuY3Rpb24gdG8gZmluZCBhbnkgb2JqZWN0IHRoYXQgZXhpc3RzIHdpdGhpbiB0aGlzIGFyZWFcclxuICAgICAgLy9UaGVzZSBvYmplY3RzIGFyZSB0aGUgb2JqZWN0cyB0aGF0IG5lZWQgdG8gYmUgcmVuZGVyZWQgZm9yIHRoaXMgY2FtZXJhXHJcbiAgICAgIGxldCBjYW1lcmFfYm94ID0ge1xyXG4gICAgICAgIHg6IGNhbWVyYS5zdGF0ZS5wb3NpdGlvbi54LFxyXG4gICAgICAgIHk6IGNhbWVyYS5zdGF0ZS5wb3NpdGlvbi55LFxyXG4gICAgICAgIHdpZHRoOiBjYW1lcmEuc3RhdGUuZGltZW5zaW9ucy53aWR0aCAqICgxIC8gY2FtZXJhLnN0YXRlLnNjYWxpbmcpLFxyXG4gICAgICAgIGhlaWdodDogY2FtZXJhLnN0YXRlLmRpbWVuc2lvbnMuaGVpZ2h0ICogKDEgLyBjYW1lcmEuc3RhdGUuc2NhbGluZylcclxuICAgICAgfTtcclxuICAgICAgLy9MaXN0IG9mIGFsbCBwYXJ0aWNsZXMgd2l0aGluIHRoZSBjYW1lcmEncyBmb3ZcclxuICAgICAgbGV0IHBhcnRpY2xlX2NvbGxpZGVzID0gdGhpcy5zdGF0ZS5jdXJyZW50X3Jvb20uY2hlY2tPYmplY3RzKGNhbWVyYV9ib3gsIFtdLCB0aGlzLnN0YXRlLmN1cnJlbnRfcm9vbS5wYXJ0aWNsZXNfYXJyKTtcclxuICAgICAgLy9MaXN0IG9mIGFsbCBvYmplY3RzIHdpdGhpbiB0aGUgY2FtZXJhJ3MgZm92XHJcbiAgICAgIGxldCBjYW1lcmFfY29sbGlkZXJzID0gWy4uLnRoaXMuc3RhdGUuY3VycmVudF9yb29tLmNoZWNrT2JqZWN0cyhjYW1lcmFfYm94KSwgLi4ucGFydGljbGVfY29sbGlkZXNdO1xyXG5cclxuICAgICAgbGV0IHJlbmRlcl9hcmdzID0ge1xyXG4gICAgICAgIGNvbnRleHQ6IHRoaXMub2Zmc2NyZWVuX2NvbnRleHQsXHJcbiAgICAgICAgY2FtZXJhOiBjYW1lcmEsXHJcbiAgICAgIH07XHJcbiAgICAgIC8vUmVuZGVycyB0aGUgcm9vbSdzIGJhY2tncm91bmQuXHJcbiAgICAgIGlmKHRoaXMuc3RhdGUuY3VycmVudF9yb29tLnJlbmRlcil7XHJcbiAgICAgICAgc3ByaXRlX3JlbmRlcmVyKHJlbmRlcl9hcmdzLCB7XHJcbiAgICAgICAgICBzcHJpdGU6IHRoaXMuc3RhdGUuY3VycmVudF9yb29tLnJlbmRlcmYoZGVsdGFfdGltZSksXHJcbiAgICAgICAgICB4OiAwLFxyXG4gICAgICAgICAgeTogMCxcclxuICAgICAgICAgIHJvdGF0aW9uOiAwLFxyXG4gICAgICAgICAgc2NhbGU6IHtcclxuICAgICAgICAgICAgd2lkdGg6IDEsXHJcbiAgICAgICAgICAgIGhlaWdodDogMVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNjYWxlX3R5cGU6c2NhbGVfdHlwZS5ncm93XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgLy9BcnJheSBvZiBoaXRib3hlcyBmb3IgZWFjaCBpdGVtIGluIHRoZSByb29tXHJcbiAgICAgIGxldCBoaXRib3hlczogY29sbGlzaW9uX2JveFtdID0gW107XHJcbiAgICAgIGZvciAobGV0IGEgb2YgY2FtZXJhX2NvbGxpZGVycy5maWx0ZXIoKGIpID0+IGIucmVuZGVyKS5zb3J0KChhLCBiKSA9PiAoYS5sYXllciAtIGIubGF5ZXIpKSkge1xyXG4gICAgICAgIGxldCByZW5kZXJlZCA9IGEucmVuZGVyVHJhY2sodCk7XHJcblxyXG4gICAgICAgIC8vT2JqZWN0cyBjYW4gcmV0dXJuIGVpdGhlciBhIHNwcml0ZSwgb3IgYW4gYXJyYXkgb2Ygc3ByaXRlcyB0byBzaW1wbGlmeSB0aGUgQVBJXHJcbiAgICAgICAgLy9Gb3IgdGhlIHVzZXIsIGFuZCBmb3IgdXNlIGluIGNvbXBvc2l0ZSBvYmplY3RzKG9iamVjdCB0aGF0IGJ1bmRsZXMgb3RoZXIgb2JqZWN0cyB0b2dldGhlcilcclxuICAgICAgICAvL0ludGVybmFsbHksIHdlIGNvbnZlcnQgYW55IHNpbmdsZSBzcHJpdGUgaW50byBhbiBhcnJheSBvZiBvbmUgc3ByaXRlLlxyXG5cclxuXHJcbiAgICAgICAgZm9yIChsZXQgcG9zaXRpb25lZF9zcHJpdGUgb2YgcmVuZGVyZWQpXHJcbiAgICAgICAgICBzcHJpdGVfcmVuZGVyZXIocmVuZGVyX2FyZ3MsIHtcclxuICAgICAgICAgICAgc3ByaXRlOiBwb3NpdGlvbmVkX3Nwcml0ZS5zcHJpdGUsXHJcbiAgICAgICAgICAgIHg6IHBvc2l0aW9uZWRfc3ByaXRlLngsXHJcbiAgICAgICAgICAgIHk6IHBvc2l0aW9uZWRfc3ByaXRlLnksXHJcbiAgICAgICAgICAgIHJvdGF0aW9uOiBhLnN0YXRlLnJvdGF0aW9uLFxyXG4gICAgICAgICAgICBzY2FsZTogYS5zdGF0ZS5zY2FsaW5nLFxyXG4gICAgICAgICAgICBzY2FsZV90eXBlOmEuc2NhbGVfdHlwZVxyXG4gICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAvL0hpdGJveGVzIGFyZSByZW5kZXJlZCBsYXRlIGluIHRoZSByZW5kZXIgbG9vcCwgdG8gZW5zdXJlIG9iamVjdHMgZG9uJ3Qgb3ZlcmxhcCB0aGVtXHJcbiAgICAgICAgLy9BcyB3ZSByZW5kZXIgb2JqZWN0cywgd2UgYWRkIHRoZWlyIGhpdGJveGVzIHRvIHRoaXMgbGlzdFxyXG4gICAgICAgIGlmIChERUJVRyAmJiBhLmNvbGxpc2lvbikge1xyXG4gICAgICAgICAgaGl0Ym94ZXMucHVzaCguLi5hLmdldEFsbENvbGxpc2lvbkJveGVzKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL1RoaXMgaXMgYSBzcGVjaWFsIGNsYXNzIG9mIG9iamVjdCB0aGF0IGV4aXN0cyBpbiB0aGUgZ2FtZSB3b3JsZFxyXG4gICAgICBmb3IgKGxldCBub2RlIG9mIHRoaXMuc3RhdGUuY3VycmVudF9yb29tLnRleHRfbm9kZXMpIHtcclxuICAgICAgICB0ZXh0X3JlbmRlcmVyKHJlbmRlcl9hcmdzLCB7XHJcbiAgICAgICAgICB4OiBub2RlLnN0YXRlLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICB5OiBub2RlLnN0YXRlLnBvc2l0aW9uLnksXHJcbiAgICAgICAgICBmb250OiBub2RlLnJlbmRlcmYodClcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY2FtZXJhLmh1ZCkge1xyXG4gICAgICAgIGxldCBncmFwaGljcyA9IGNhbWVyYS5odWQuZ3JhcGhpY19lbGVtZW50cztcclxuICAgICAgICBsZXQgdGV4dF9lbGVtZW50cyA9IGNhbWVyYS5odWQudGV4dF9lbGVtZW50cztcclxuICAgICAgICAvL1JlbmRlcnMgc3RhdGljIGdyYXBoaWNzIHRoYXQgYXJlIGEgcGFydCBvZiB0aGUgaHVkXHJcbiAgICAgICAgZm9yIChsZXQgZ3JhcGhpYyBvZiBncmFwaGljcykge1xyXG4gICAgICAgICAgbGV0IHJlbmRlcmVkID0gZ3JhcGhpYy5yZW5kZXJUcmFjayh0KTtcclxuICAgICAgICAgIGlmIChncmFwaGljLnJlbmRlcikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBwb3NpdGlvbmVkX3Nwcml0ZSBvZiByZW5kZXJlZCkge1xyXG4gICAgICAgICAgICAgIHNwcml0ZV9yZW5kZXJlcihyZW5kZXJfYXJncywge1xyXG4gICAgICAgICAgICAgICAgc3ByaXRlOiBwb3NpdGlvbmVkX3Nwcml0ZS5zcHJpdGUsXHJcbiAgICAgICAgICAgICAgICB4OiBwb3NpdGlvbmVkX3Nwcml0ZS54LFxyXG4gICAgICAgICAgICAgICAgeTogcG9zaXRpb25lZF9zcHJpdGUueSxcclxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiBncmFwaGljLnN0YXRlLnJvdGF0aW9uLFxyXG4gICAgICAgICAgICAgICAgc2NhbGU6IGdyYXBoaWMuc3RhdGUuc2NhbGluZyxcclxuICAgICAgICAgICAgICAgIHNjYWxlX3R5cGU6Z3JhcGhpYy5zY2FsZV90eXBlXHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgdGV4dCBvZiB0ZXh0X2VsZW1lbnRzKSB7XHJcbiAgICAgICAgICBodWRfdGV4dF9yZW5kZXJlcihyZW5kZXJfYXJncywge1xyXG4gICAgICAgICAgICB4OiB0ZXh0LnN0YXRlLnBvc2l0aW9uLngsXHJcbiAgICAgICAgICAgIHk6IHRleHQuc3RhdGUucG9zaXRpb24ueSxcclxuICAgICAgICAgICAgZm9udDogdGV4dC5yZW5kZXJmKHQpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvL0lmIGEgY2FtZXJhIGlzIG1hcmtlZCBhcyBhIGRlYnVnIGNhbWVyYSwgd2UgcmVuZGVyIHRoZVxyXG4gICAgICAvLyAgaGl0Ym94ZXMsIGFuZCBwb3RlbnRpYWxseSB1cGRhdGUgdGhlIGVkaXRvclxyXG4gICAgICBpZiAoY2FtZXJhLnN0YXRlLmRlYnVnKSB7XHJcbiAgICAgICAgbGV0IGJveDogY29sbGlzaW9uX2JveDtcclxuICAgICAgICBsZXQgYm94ZXNfY29weSA9IFsuLi5ib3hlc11cclxuICAgICAgICB3aGlsZSAoYm94ZXNfY29weS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBsZXQgYm94ID0gYm94ZXNfY29weS5wb3AoKTtcclxuICAgICAgICAgIGxldCByZWN0ID0ge1xyXG4gICAgICAgICAgICB3aWR0aDogYm94LndpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IGJveC5oZWlnaHRcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHN0cm9rZWRfcmVjdF9yZW5kZXJlcih0aGlzLm9mZnNjcmVlbl9jb250ZXh0LCByZWN0LCBib3gueCwgYm94LnksIFwiI0ZGMDAwMFwiLCAxLCBjYW1lcmEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAoaGl0Ym94ZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgbGV0IGJveCA9IGhpdGJveGVzLnBvcCgpO1xyXG4gICAgICAgICAgbGV0IHJlY3QgPSB7XHJcbiAgICAgICAgICAgIHdpZHRoOiBib3gud2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogYm94LmhlaWdodFxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgc3Ryb2tlZF9yZWN0X3JlbmRlcmVyKHRoaXMub2Zmc2NyZWVuX2NvbnRleHQsIHJlY3QsIGJveC54LCBib3gueSwgXCIjMDA4MDAwXCIsIDEsIGNhbWVyYSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vRHJhd3MgYSBzcGVjaWFsIGJveCBhcm91bmQgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBlbGVtZW50XHJcbiAgICAgICAgLy9pbnNpZGUgdGhlIGVkaXRvciBVSVxyXG4gICAgICAgIGlmIChERUJVRyAmJiBkZWJ1Z19zdGF0ZS5zZWxlY3RlZF9wcm9wZXJ0aWVzX2VsZW1lbnQpIHtcclxuICAgICAgICAgIGxldCBjb2xsID0gZGVidWdfc3RhdGUuc2VsZWN0ZWRfcHJvcGVydGllc19lbGVtZW50LmdldEZ1bGxDb2xsaXNpb25Cb3goKTtcclxuICAgICAgICAgIHJlY3RfcmVuZGVyZXIodGhpcy5vZmZzY3JlZW5fY29udGV4dCwgeyB3aWR0aDogMjUsIGhlaWdodDogMjUgfSwgY29sbC54LCBjb2xsLnksIFwic2t5Ymx1ZVwiLCAxMCwgY2FtZXJhKTtcclxuICAgICAgICAgIHN0cm9rZWRfcmVjdF9yZW5kZXJlcih0aGlzLm9mZnNjcmVlbl9jb250ZXh0LCBjb2xsLCBjb2xsLngsIGNvbGwueSwgXCJibHVlXCIsIDEsIGNhbWVyYSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vU2VwYXJhdGUgY2FudmFzIGZvciB0aGUgZWRpdG9yIGNhbWVyYVxyXG4gICAgICBpZiAoYSAhPT0gZWRpdG9yX2NhbWVyYV9pbmRleCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5vZmZzY3JlZW5fY2FudmFzLCBjYW1lcmEuc3RhdGUudmlld3BvcnQueCwgY2FtZXJhLnN0YXRlLnZpZXdwb3J0LnkpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsc2Uge1xyXG4gICAgICAgIGRlYnVnX3N0YXRlLnRhcmdldC5nZXRDb250ZXh0KFwiMmRcIikuZHJhd0ltYWdlKHRoaXMub2Zmc2NyZWVuX2NhbnZhcywgY2FtZXJhLnN0YXRlLnZpZXdwb3J0LngsIGNhbWVyYS5zdGF0ZS52aWV3cG9ydC55KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKERFQlVHKVxyXG4gICAgICBib3hlcyA9IFtdO1xyXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKChhKSA9PiB7IHRoaXMucmVuZGVyKGEpIH0pO1xyXG4gIH1cclxuICBzdGFydF9sb2dpYyhhOiBudW1iZXIpIHtcclxuICAgIC8vdGhpcyBpcyB0aGUgcm9vbSdzIHN0YXRlIGxvb3BcclxuICAgIHJldHVybiB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBsZXQgbmV3X3RpbWUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICBpZiAoIVBBVVNFRCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCB0aW1lX3NpbmNlID0gbmV3X3RpbWUuZ2V0VGltZSgpIC0gbGFzdF90aW1lLmdldFRpbWUoKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50X3Jvb20pIHtcclxuICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudF9yb29tLnN0YXRlZih0aW1lX3NpbmNlKTtcclxuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRfcm9vbS5odWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50X3Jvb20uaHVkLnN0YXRlZih0aW1lX3NpbmNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgbGFzdF90aW1lID0gbmV3X3RpbWU7XHJcbiAgICAgIC8vVGhpcyBmdW5jdGlvbnMgaGFuZGxlcyBiaW5kcyB0aGF0IG9jY3VyIG9uIGFuIGludGVydmFsXHJcbiAgICAgIEV4ZWN1dGVSZXBlYXRCaW5kcyhhKTtcclxuICAgIH0sIGEpO1xyXG4gIH1cclxuICBnZXRSb29tKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuY3VycmVudF9yb29tO1xyXG4gIH1cclxuICBhc3luYyBsb2FkUm9vbVN0cmluZyh4OiBzdHJpbmcpIHtcclxuICAgIC8vcm9vbSBsaXN0IGlzIGEgb2JqZWN0IHRoYXQgY29udGFpbnMgZWFjaCByb29tJ3MgY2xhc3MsXHJcbiAgICAvL3dpdGggdGhlIHJvb20ncyBuYW1lIGFzIHRoZSBrZXkgZm9yIGNsYXNzXHJcbiAgICAvL1RoaXMgb2JqZWN0IGlzIHBvcHVsYXRlZCBhdCBjb21waWxlIHRpbWVcclxuICAgIGZvciAobGV0IGEgb2YgT2JqZWN0LmtleXMocm9vbV9saXN0KSkge1xyXG4gICAgICBpZiAoYSA9PSB4KSB7XHJcbiAgICAgICAgLy90aGlzIGlzbid0IHBhcnRpY3VsYXJseSB0eXBlLXNhZmUuXHJcbiAgICAgICAgbGV0IG5ld19yb29tID0gPHJvb208e30+Pm5ldyByb29tX2xpc3RbYV0odGhpcylcclxuICAgICAgICBhd2FpdCB0aGlzLmxvYWRSb29tKG5ld19yb29tKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgbG9hZFJvb20oeDogcm9vbTx1bmtub3duPikge1xyXG4gICAgLy9DbGVhcnMgdGhlIHJvb20ncyBsb2dpYyBsb29wIGlmIG9uZVxyXG4gICAgLy9XYXMgYWxyZWFkeSBydW5uaW5nXHJcbiAgICBpZiAodGhpcy5zdGF0ZS5sb2dpYykge1xyXG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlLmxvZ2ljKTtcclxuICAgIH1cclxuICAgIC8vVGhpcyByZWZlcmVuY2UgaXMgdXNlZCBkdXJpbmcgaW5pdGlhbGl6YXRpb25cclxuICAgIHguZ2FtZSA9IHRoaXM7XHJcbiAgICAvL0RlbGV0ZXMgZWFjaCBvYmplY3QgaW4gdGhlIHJvb20gKHdoaWNoIGFsc28gdW5iaW5kcyB0aGVpciBiaW5kcyksXHJcbiAgICAvL2FuZCB1bmJpbmRzIHRoZSByb29tJ3MgYmluZGluZ3MuXHJcbiAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50X3Jvb20gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB3aGlsZSAodGhpcy5zdGF0ZS5jdXJyZW50X3Jvb20ub2JqZWN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50X3Jvb20ub2JqZWN0c1swXS5kZWxldGUoKTtcclxuICAgICAgfVxyXG4gICAgICBmb3IgKGxldCBpZCBvZiB0aGlzLnN0YXRlLmN1cnJlbnRfcm9vbS5iaW5kcykge1xyXG4gICAgICAgIFVuYmluZChpZCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGxldCBuZXdfcm9vbSA9IGF3YWl0IHgubG9hZCgpO1xyXG4gICAgeC5yZWdpc3RlckNvbnRyb2xzKCk7XHJcbiAgICB4LnJlZ2lzdGVyUGFydGljbGVzKCk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5sb2dpYyA9IHRoaXMuc3RhcnRfbG9naWMobG9naWNfbG9vcF9pbnRlcnZhbClcclxuICAgIHRoaXMuc3RhdGUuY3VycmVudF9yb29tID0geDtcclxuICAgIGlmIChERUJVRykge1xyXG4gICAgICBkZWJ1Z191cGRhdGVfcm9vbV9saXN0KCk7XHJcbiAgICAgIGRlYnVnX3VwZGF0ZV9wcmVmYWJzKCk7XHJcbiAgICAgIGRlYnVnX3VwZGF0ZV9vYmpfbGlzdCgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBpZiAoIXRoaXMuaXNSZW5kZXJpbmcpIHtcclxuICAgICAgLy9UaGlzIHN0YXJ0cyB0aGUgcmVuZGVyIGxvb3AgZm9yIHRoZSByb29tXHJcbiAgICAgIHRoaXMucmVuZGVyKDApO1xyXG4gICAgICB0aGlzLmlzUmVuZGVyaW5nID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIifQ==