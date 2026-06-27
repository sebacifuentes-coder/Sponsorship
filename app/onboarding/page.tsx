import Link from "next/link";

import { OnboardingWizard } from "@/components/onboarding-wizard";

export const metadata = {
  title: "Primer valor · Copiloto de Patrocinio",
};

export default function OnboardingPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-12">
      <header className="flex flex-col gap-2">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:underline"
        >
          ← Inicio
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Tu primer valor en 3 pasos
        </h1>
        <p className="text-sm text-muted-foreground">
          Sin integraciones ni carga de datos del fan. Elige un club, define la
          marca y el objetivo, y obtén un mapa de oportunidades + un concepto de
          activación en minutos.
        </p>
      </header>

      <OnboardingWizard />
    </main>
  );
}
