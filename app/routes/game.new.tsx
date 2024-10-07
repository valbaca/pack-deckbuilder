import { redirect } from "@remix-run/node";

import { generateNewGameId } from "~/game.server";

export function loader() {
  const id = generateNewGameId();
  return redirect(`/game/${id}`);
}
