import { Link, Outlet } from "@remix-run/react";

export default function Games() {
  return (
    <div>
      Games
      <Link to="new">New Game</Link>
      <Outlet />
    </div>
  );
}
