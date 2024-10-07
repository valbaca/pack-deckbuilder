import { GameState } from "./game.server";

export interface Card {
  name: string;
  text: string;
  flavor?: string;
}
export type Cards = Card[];

export type Action = Play; //| Draft | OncePerGame | OncePerTurn

export type GameArea =
  | "hand"
  | "played"
  | "discard"
  | "draft"
  | "deck"
  | "main-deck";

export interface Locator {
  area: GameArea;
  index: number;
}

export interface Play {
  type: "Play";
  name: string;
  index: number;
  from: GameArea;
  target?: {
    name: string;
    locator: Locator;
  };
}

export type GameStateView = Omit<GameState, "deck" | "mainDeck">;
