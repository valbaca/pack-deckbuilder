import { Link, Outlet } from "@remix-run/react";

export default function Games() {
  return (
    <div>
      <Link to="new" className="mt-4 rounded bg-green-400 p-1 text-lg">
        New Game
      </Link>
      <Outlet />
    </div>
  );
}
