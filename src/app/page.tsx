import { Suspense } from "react";
import { HomePage } from "./HomePage";

export default function HomeRoutePage() {
  return (
    <Suspense fallback={null}>
      <HomePage />
    </Suspense>
  );
}
