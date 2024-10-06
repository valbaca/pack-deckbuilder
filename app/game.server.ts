import { produce } from "immer";
import invariant from "tiny-invariant";
import { Action, Cards, GameArea, GameStateView } from "./game.util";

export function generateNewGameId(): string {
  // TODO hook into DB
  globalGameState = initGameState;
  return crypto.randomUUID();
}

export function toAction(
  name: string,
  index: number,
  from: GameArea = "hand",
): Action {
  return {
    type: "Play",
    name,
    index,
    from,
  };
}

export function validateAction(gid: GameState, a: Action) {
  invariant(a.name, "Invalid Game Action");
  return true;
}

export function enact(gid: string, a: Action) {
  let gameState = getGameState(gid);
  console.dir({ gameState });
  validateAction(gameState, a);
  gameState = preEffect(gameState, a);
  const newGameState = effects[a.name](gameState);
  console.dir({ newGameState });
  globalGameState = newGameState;
}

export interface GameState {
  id: string;
  bones: number;
  draft: Cards;
  hand: Cards;
  active: Cards;
  deck: Cards;
  discard: Cards;
  mainDeck: Cards;
}

export function getGameState(gid: string): GameState {
  return {
    ...globalGameState,
    id: gid,
  };
}

export function toGameStateView(gs: GameState): GameStateView {
  return pick(gs, "id", "bones", "draft", "hand", "active", "discard");
}

function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) result[key] = obj[key];
  return result;
}

function preEffect(gs: GameState, a: Action): GameState {
  if (a.type == "Play") {
    return produce(gs, (d) => {
      const card = d.hand[a.index];
      d.hand.splice(a.index, 1);
      d.active.push(card);
    });
  }
  return gs;
}

const cards: Cards = [
  {
    name: "Bark",
    text: "+1 bones",
    flavor: "BARK! --every dog, ever, all the time",
  },
  {
    name: "Nap",
    text: "+0 bones",
    flavor: "It's best to let sleeping dogs lie",
  },
];

const Bark = cards[0];
const Nap = cards[1];

type Effect = (gs: GameState) => GameState;

const inc: (n: number) => Effect = (n) => (gs) => {
  return {
    ...gs,
    bones: Math.max(0, gs.bones + n),
  };
};

const effects: Record<string, Effect> = {
  Bark: inc(1),
  Nap: (gs) => gs,
};

const initGameState: GameState = {
  id: "",
  bones: 0,
  draft: [] as Cards,
  hand: [Bark, Bark, Bark, Nap, Nap] as Cards,
  active: [] as Cards,
  deck: [] as Cards,
  discard: [] as Cards,
  mainDeck: [] as Cards,
};

let globalGameState = {
  ...initGameState,
};
