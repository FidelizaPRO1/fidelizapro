import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FormularioRecompensa from "./FormularioRecompensa";
import GestionRecompensa from "./GestionRecompensa";

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
    .is("deleted_at", null)
    .order("points_required", { ascending: true });

  const totalRecompensas = recompensas?.length ?? 0;
  const activadas =
    recompensas?.filter((r) => r.is_active).length ?? 0;
  const desactivadas = totalRecompensas - activadas;
  
  const disponibles = Math.max(0, 10 - totalRecompensas);

  
const { data: historialCanjes, error: errorHistorial } =
  await supabase
    .from("reward_redemptions")
    .select(`
      id,
      customer_id,
      reward_id,
      points_spent,
      created_at,
      customers!reward_redemptions_customer_id_fkey(full_name),
      rewards!reward_redemptions_reward_id_fkey(name)
    `)
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(20);

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
    
          {!errorRecompensas && (
            <div
              style={{
                background: "#111827",
                border: "1px solid #374151",
                borderRadius: 12,
                padding: 18,
                marginBottom: 26,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <strong>Recompensas creadas</strong>
                <strong
                  style={{
                    color: disponibles === 0 ? "#F5B942" : "#14B8A6",
                    fontSize: 26,
                  }}
                >
                  {totalRecompensas}/10
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  height: 10,
                  background: "#374151",
                  borderRadius: 20,
                  overflow: "hidden",
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    width: `${(activadas / 10) * 100}%`,
                    background: "#14B8A6",
                  }}
                />
                <div
                  style={{
                    width: `${(desactivadas / 10) * 100}%`,
                    background: "#6B7280",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 12,
                  marginTop: 16,
                  fontSize: 14,
                }}
              >
                <span>
                  <span style={{ color: "#14B8A6" }}>●</span>
                  {" "}{activadas} activadas
                </span>
                <span>
                  <span style={{ color: "#9CA3AF" }}>●</span>
                  {" "}{desactivadas} desactivadas
                </span>
              </div>

              <div
                style={{
                  borderTop: "1px solid #374151",
                  marginTop: 18,
                  paddingTop: 16,
                  color: disponibles === 0 ? "#F5B942" : "#14B8A6",
                  fontSize: 14,
                }}
              >
                {disponibles === 0
                  ? "Has alcanzado el límite de 10 recompensas. Elimina una para crear otra."
                  : `Puedes crear ${disponibles} ${
                      disponibles === 1
                        ? "recompensa más."
                        : "recompensas más."
                    }`}
              </div>
            </div>
          )}
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

                                   <GestionRecompensa
                    id={recompensa.id}
                    nombre={recompensa.name}
                    puntos={recompensa.points_required}
                    activa={recompensa.is_active}
                  />
                </div>
              ))}
              
            </div>
          ) : (
            <p style={{ color: "#9CA3AF" }}>
              Todavía no tienes recompensas registradas.
            </p>
          )}

          <div
            style={{
              borderTop: "1px solid #374151",
              marginTop: 32,
              paddingTop: 24,
            }}
          >
            <h2 style={{ fontSize: 22, marginTop: 0 }}>
              Historial de Canjes
            </h2>

            
            <p style={{ color: "#9CA3AF", lineHeight: 1.6 }}>
              Consulta las recompensas entregadas a tus clientes
              y los puntos utilizados en cada canje.
            </p>

            {errorHistorial ? (
              <p style={{ color: "#F87171" }}>
                No fue posible cargar el historial de canjes.
              </p>
            ) : historialCanjes && historialCanjes.length > 0 ? (
              <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
               
{historialCanjes.map((canje) => (
  <div
    key={canje.id}
    style={{
      background: "#111827",
      border: "1px solid #374151",
      borderRadius: 12,
      padding: 16,
    }}
  >
    <p style={{ marginTop: 0 }}>
      <strong>Cliente: </strong>
{canje.customers?.[0]?.full_name || "Sin nombre"}
    </p>

    <p>
      <strong>Recompensa: </strong> 
{canje.rewards?.[0]?.name || "No disponible"}
    </p>

    <p>
      <strong>Puntos utilizados: </strong>
      <span style={{ color: "#F5B942" }}>
        {canje.points_spent}
      </span>
    </p>

    <p
      style={{
        color: "#9CA3AF",
        fontSize: 14,
        marginBottom: 0,
      }}
    >
      Fecha:{" "}
      {new Date(canje.created_at).toLocaleString(
        "es-CO",
        { timeZone: "America/Bogota" }
      )}
    
    </p>
  </div>
))}
              </div>
            ) : (

              <p style={{ color: "#9CA3AF", marginTop: 20 }}>
                Todavía no hay canjes registrados.
              </p>
            )}
          </div>

        </section>

      </div>
    </main>
  );
}
