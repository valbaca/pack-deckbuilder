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
    <div className="p-4">
      <pre className="text-lg font-bold">{`Game id ${data.gameState.id}`}</pre>
      <Bones bones={data.gameState.bones} />
      <Hand hand={data.gameState.hand} />

      <Active active={data.gameState.active} />

      <Discard discard={data.gameState.discard} />
    </div>
  );
}

function Bones(prop: { bones: number }) {
  return (
    <div className="text-xl text-yellow-600">Total Bones: {prop.bones}</div>
  );
}

function Hand(prop: { hand: Card[] }) {
  return (
    <>
      <h2 className="mt-4 text-xl font-bold">Your Hand:</h2>
      <div className="space-y-2">
        {prop.hand.map((card, idx) => (
          <HandCard card={card} key={idx} index={idx} />
        ))}
      </div>
    </>
  );
}

function HandCard(prop: { card: Card; index: number }) {
  return (
    <div className="rounded border p-2 shadow">
      <Form method="post" className="space-y-2">
        <input
          type="text"
          name="cardName"
          id="cardName"
          required
          value={prop.card.name}
          readOnly
          className="rounded border p-1 text-lg font-bold"
        />
        <div className="rounded border p-1">{prop.card.text}</div>
        <div className="font-extralight italic">{prop.card.flavor}</div>
        <input
          type="number"
          name="index"
          id="index"
          required
          hidden
          value={prop.index}
        />
        <button
          type="submit"
          className="rounded bg-blue-500 p-1 text-white hover:bg-blue-600"
        >
          Play!
        </button>
      </Form>
    </div>
  );
}

function Active(prop: { active: Cards }) {
  return (
    <>
      <h2 className="mt-4 text-xl font-bold">Your Active cards:</h2>
      <div>
        {prop.active.map((active, i) => (
          <div key={i}>{active.name}</div>
        ))}
      </div>
    </>
  );
}

function Discard(prop: { discard: Cards }) {
  return (
    <>
      <h2 className="mt-4 text-xl font-bold">Your Discard:</h2>
      <div>
        {prop.discard.map((disc, i) => (
          <div key={i}>{disc.name}</div>
        ))}
      </div>
    </>
  );
}
