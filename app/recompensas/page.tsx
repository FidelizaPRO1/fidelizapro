import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FormularioRecompensa from "./FormularioRecompensa";

export default async function RecompensasPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const { data: negocios, error: errorNegocios } = await supabase
    .from("business_members")
    .select("business_id")
    .eq("user_id", user.id)
    .limit(1);

  if (errorNegocios || !negocios || negocios.length === 0) {
    redirect("/panel");
  }

  const businessId = negocios[0].business_id;

  const { data: recompensas, error: errorRecompensas } = await supabase
    .from("rewards")
    .select("id, name, points_required, is_active")
    .eq("business_id", businessId)
    .order("points_required", { ascending: true });

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "#F9FAFB",
        padding: 16,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <a
          href="/"
          style={{
            color: "#14B8A6",
            textDecoration: "none",
          }}
        >
          ← Volver al inicio
        </a>

        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <p
            style={{
              color: "#14B8A6",
              fontSize: 13,
              fontWeight: "bold",
            }}
          >
            FIDELIZAPRO | PANEL DE GESTIÓN
          </p>

          <h1 style={{ fontSize: 28 }}>
            Gestión de Recompensas
          </h1>

          <p style={{ color: "#9CA3AF", lineHeight: 1.6 }}>
            Crea y administra recompensas para premiar
            la fidelidad de tus clientes.
          </p>
        </div>

        <section
          style={{
            background: "#1F2937",
            padding: 20,
            borderRadius: 16,
            border: "1px solid #374151",
          }}
        >
                   <h2 style={{ fontSize: 22, marginTop: 0 }}>
            Crear nueva recompensa
          </h2>

          <p style={{ color: "#9CA3AF", lineHeight: 1.6 }}>
            Configura los premios que podrán obtener
            tus clientes al acumular puntos.
          </p>

          <div
            style={{
              background: "#111827",
              padding: 16,
              borderRadius: 12,
              marginTop: 16,
            }}
          >
            <FormularioRecompensa />
          </div>

          <div
            style={{
              borderTop: "1px solid #374151",
              marginTop: 30,
              marginBottom: 24,
            }}
          />

          <h2 style={{ fontSize: 22, marginTop: 0 }}>
            Mis recompensas
          </h2>

          {errorRecompensas ? (
            <p>No fue posible cargar las recompensas.</p>
          ) : recompensas && recompensas.length > 0 ? (
            <div style={{ display: "grid", gap: 12 }}>
              {recompensas.map((recompensa) => (
                <div
                  key={recompensa.id}
                  style={{
                    background: "#111827",
                    padding: 16,
                    borderRadius: 10,
                    border: "1px solid #374151",
                    overflowWrap: "anywhere",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>
                    {recompensa.name}
                  </h3>

                  <p>
                    <strong>Puntos necesarios: </strong>
                    <span style={{ color: "#F5B942" }}>
                      {recompensa.points_required}
                    </span>
                  </p>

                  <p>
                    <strong>Estado: </strong>
                    <span
                      style={{
                        color: recompensa.is_active
                          ? "#14B8A6"
                          : "#9CA3AF",
                      }}
                    >
                      {recompensa.is_active
                        ? "Activa"
                        : "Inactiva"}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#9CA3AF" }}>
              Todavía no tienes recompensas registradas.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
