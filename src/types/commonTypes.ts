import { Images } from "./Images";

export type GameObject = Extract<Images, "BLACK_STAR" | "RED_STAR" | "GREEN_STAR" | "YELLOW_STAR" | "WHITE_STAR" | "BLACK_STAR"> | null;
export type Gameboard = [GameColumn, GameColumn, GameColumn, GameColumn];
export type GameColumn = [GameObject, GameObject, GameObject, GameObject, GameObject, GameObject, GameObject];
export type NextObjects = [GameObject, GameObject, GameObject, GameObject];
export type PreloadedImages = Map<Images, HTMLImageElement>;


export enum GameEndStatus {
  WIN_STATUS = 'WIN',
  LOST_STATUS = 'LOST',
}

