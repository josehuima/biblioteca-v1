import { Suspense } from "react";
import Home from "./Home"; // move your current code to components/Home.tsx

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando a página inicial...</div>}>
      <Home />
    </Suspense>
  );
}
