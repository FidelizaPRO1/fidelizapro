import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FormularioPuntos from "./FormularioPuntos";
import FormularioCanje from "./FormularioCanje";
import styles from "./Puntos.module.css";

export default async function PuntosPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
const { id } = await params;
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }
const { data: cliente, error: errorCliente } = await supabase
  .from("customers")
  .select("id, business_id, full_name, points_balance")
  .eq("id", id)
  .single();

if (errorCliente || !cliente) {
  redirect("/clientes");
}

const { data: membresia, error: errorMembresia } = await supabase
  .from("business_members")
  .select("business_id")
  .eq("user_id", user.id)
  .eq("business_id", cliente.business_id)
  .limit(1);

if (errorMembresia || !membresia || membresia.length === 0) {
  redirect("/clientes");
}
  const { data: recompensas, error: errorRecompensas } = await supabase
  .from("rewards")
  .select("id, name, points_required")
  .eq("business_id", cliente.business_id)
  .eq("is_active", true)
  .order("points_required", { ascending: true });

if (errorRecompensas) {
  throw new Error("No fue posible cargar las recompensas.");
}
const { data: historial, error: errorHistorial } = await supabase
  .from("points_logs")
  .select("id, points_change, reason, created_at")
  .eq("business_id", cliente.business_id)
  .eq("customer_id", cliente.id)
  .order("created_at", { ascending: false })
  .limit(50);

if (errorHistorial) {
  throw new Error("No fue posible cargar el historial de puntos.");
}
    return (
   <main className={styles.contenedor}>
      <div className={styles.panel}>
        <a
          href="/clientes"
          style={{
            display: "inline-block",
            color: "#14B8A6",
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          ← Volver a clientes
        </a>
    <h1 className={styles.titulo}>Gestión de puntos</h1>

  <h2 className={styles.cliente}>
  {cliente.full_name}
</h2>

<div className={styles.saldo}>
  <strong className={styles.saldoNumero}>
    {cliente.points_balance ?? 0}
  </strong>
  <span className={styles.saldoTexto}>
    Puntos disponibles
  </span>
</div>

<div className={styles.acciones}>
  <section className={styles.seccion}>
    <h2 className={styles.seccionTitulo}>Sumar puntos</h2>
    <FormularioPuntos clienteId={cliente.id} />
  </section>

  <section className={styles.seccion}>
    <h2 className={styles.seccionTitulo}>Canjear recompensa</h2>
    <FormularioCanje
      clienteId={cliente.id}
      puntosDisponibles={cliente.points_balance ?? 0}
      recompensas={recompensas ?? []}
    />
  </section>
</div>
        
<section className={styles.historial}>
  <h2 style={{ fontSize: 22, marginBottom: 8 }}>
    Historial de puntos
  </h2>

  <p style={{ color: "#9CA3AF", marginBottom: 20 }}>
    Últimos movimientos registrados del cliente.
  </p>

  {!historial || historial.length === 0 ? (
    <p style={{ color: "#9CA3AF" }}>
      Este cliente todavía no tiene movimientos.
    </p>
  ) : (
    <div style={{ display: "grid", gap: 12 }}>
      {historial.map((movimiento) => (
    <div
  key={movimiento.id}
  className={styles.movimiento}
>
          <div>
            <p style={{ margin: "0 0 8px", fontWeight: 600 }}>
              {movimiento.reason}
            </p>

            <span style={{ color: "#9CA3AF", fontSize: 13 }}>
              {new Date(movimiento.created_at).toLocaleString(
                "es-CO",
                { timeZone: "America/Bogota" }
              )}
            </span>
          </div>

          <strong
            style={{
              fontSize: 20,
              color:
                movimiento.points_change > 0
                  ? "#14B8A6"
                  : "#F5B942",
            }}
          >
            {movimiento.points_change > 0 ? "+" : ""}
            {movimiento.points_change}
          </strong>
        </div>
      ))}
    </div>
  )}
</section>
      </div>
    </main>
  );
}
