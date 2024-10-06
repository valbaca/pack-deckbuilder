import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { enact, getGameState, toAction, toGameStateView } from "~/game.server";
import { Card, Cards } from "~/game.util";
import { validateNumber, validateString } from "~/utils";

export async function action({ params, request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const cardName = validateString(formData.get("cardName"));
  const index = validateNumber(formData.get("index"));

  const { id } = params;
  invariant(id, `Require game id, given ${id}`);
  enact(id, toAction(cardName, index));
  return null;
}

export function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;
  invariant(id, `Require game id, given ${id}`);
  const gameState = getGameState(id);

  return json({ gameState: toGameStateView(gameState) });
}

export default function Game() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <pre>{`Game id ${data.gameState.id}`}</pre>
      <Power power={data.gameState.power} />
      <h2>Your Hand:</h2>
      <Hand hand={data.gameState.hand} />

      <h2>Your Active cards:</h2>
      <Active active={data.gameState.active} />

      <h2>Your Discard:</h2>
      <Discard discard={data.gameState.discard} />
    </div>
  );
}

function Power(prop: { power: number }) {
  return <div>Power: {prop.power}</div>;
}

function Hand(prop: { hand: Card[] }) {
  return (
    <div>
      {prop.hand.map((card, idx) => (
        <HandCard card={card} key={idx} index={idx} />
      ))}
    </div>
  );
}

function HandCard(prop: { card: Card; index: number }) {
  return (
    <div>
      🃏 Card: {prop.card.name}
      <Form method="post">
        <input
          type="text"
          name="cardName"
          id="cardName"
          required
          value={prop.card.name}
          readOnly
        />
        <div>{prop.card.text}</div>
        <div className="italic">{prop.card.flavor}</div>
        <input
          type="number"
          name="index"
          id="index"
          required
          hidden
          value={prop.index}
        />
        <button type="submit">Play!</button>
      </Form>
    </div>
  );
}

function Active(prop: { active: Cards }) {
  return (
    <div>
      {prop.active.map((active, i) => (
        <div key={i}>{active.name}</div>
      ))}
    </div>
  );
}

function Discard(prop: { discard: Cards }) {
  return (
    <div>
      {prop.discard.map((disc, i) => (
        <div key={i}>{disc.name}</div>
      ))}
    </div>
  );
}
