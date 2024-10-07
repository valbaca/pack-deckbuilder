import { Suspense } from "react";
import ConfettiExplosion from "react-confetti-explosion";

export default function Victory() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <>
        <ConfettiExplosion
          duration={6000}
          particleCount={100}
          force={0.75}
          width={1600}
        />
        <div className="center text-center align-middle text-9xl text-emerald-600">
          YOU WON!
        </div>
        <ConfettiExplosion
          duration={6000}
          particleCount={100}
          force={0.75}
          width={1600}
        />
      </>
    </Suspense>
  );
}
