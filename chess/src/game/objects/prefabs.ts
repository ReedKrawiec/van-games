
interface prefabs {
  [index:string]:any
}
import {Bishop} from "./Bishop";
import {Board_Label} from "./Board_Label";
import {King} from "./King";
import {Knight} from "./Knight";
import {Move} from "./Move";
import {Pawn} from "./Pawn";
import {placeholder} from "./placeholder";
import {Queen} from "./Queen";
import {Rook} from "./Rook";
export let prefabs:prefabs = {
	Bishop:Bishop,
	Board_Label:Board_Label,
	King:King,
	Knight:Knight,
	Move:Move,
	Pawn:Pawn,
	placeholder:placeholder,
	Queen:Queen,
	Rook:Rook,
}