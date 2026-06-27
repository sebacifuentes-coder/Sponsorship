import { Button } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";
import { ROLES } from "@/core/shared/roles";

export default function Home() {
  const supabaseListo = isSupabaseConfigured();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center gap-8 px-6 py-16">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Fase 4 · Cimientos
        </span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Copiloto de Patrocinio Deportivo
        </h1>
        <p className="text-balance text-muted-foreground">
          Capa de inteligencia y orquestación que ayuda al CMO a maximizar el ROI
          del patrocinio y demostrarlo ante el board. Monolito modular de doble
          plano con puertos y adaptadores.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border p-4">
          <h2 className="text-sm font-medium">Plano ligero</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Datos públicos → oportunidades + generación IA. Primer valor en
            &lt; 10 min, sin PII ni integración profunda.
          </p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <h2 className="text-sm font-medium">Plano profundo</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Clean Room (PII aislada), conectores martech y motor de valor
            medible. Progresivo; nunca bloquea el plano ligero.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border p-4">
        <h2 className="text-sm font-medium">Estado del montaje</h2>
        <dl className="grid gap-2 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Roles (RBAC básico)</dt>
            <dd className="font-mono">{ROLES.join(" · ")}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Supabase (auth + RLS)</dt>
            <dd className="font-mono">
              {supabaseListo ? "configurado" : "pendiente de credenciales"}
            </dd>
          </div>
        </dl>
        {!supabaseListo && (
          <p className="text-xs text-muted-foreground">
            Copia <code className="font-mono">.env.example</code> a{" "}
            <code className="font-mono">.env.local</code> y rellena las claves de
            Supabase para activar auth y RLS. La app corre en local sin ellas.
          </p>
        )}
      </section>

      <div className="flex gap-3">
        <Button>Empezar (próx. Historia 1.5)</Button>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/sebacifuentes-coder/Sponsorship"
            target="_blank"
            rel="noreferrer"
          >
            Repositorio
          </a>
        </Button>
      </div>
    </main>
  );
}
