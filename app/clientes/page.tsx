
export default function ClientesPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <a
          href="/"
          className="text-sm text-teal-400 hover:underline"
        >
          ← Volver al inicio
        </a>

        <h1 className="mt-8 text-3xl font-bold">
          Clientes
        </h1>

        <p className="mt-3 text-slate-300">
          Administra los clientes de tu negocio
          desde FidelizaPRO.
        </p>

        <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Gestión de clientes
          </h2>

          <p className="mt-3 text-slate-400">
            Próximamente podrás registrar clientes,
            consultar sus puntos y administrar
            su historial de fidelización.
          </p>
        </section>
      </div>
    </main>
  );
}
