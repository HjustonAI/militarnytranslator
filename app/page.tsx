export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-8 py-20">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-accent">
        Faza 0 · Szkielet projektu
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-ink-900">
        Militaria Translation Studio
      </h1>
      <p className="mt-3 max-w-xl text-ink-700">
        Kontekstowe tłumaczenie treści e-commerce z kontrolą jakości.
      </p>
      <div className="mt-8 rounded-lg border border-border-soft bg-surface px-5 py-4 shadow-sm">
        <p className="text-sm text-ink-600">
          Szkielet aplikacji (Next.js · TypeScript · Tailwind) jest gotowy.
          Interfejs, profile tłumaczeniowe, pipeline promptów i endpoint
          tłumaczenia zostaną dodane w kolejnych fazach implementacji.
        </p>
      </div>
    </main>
  );
}
