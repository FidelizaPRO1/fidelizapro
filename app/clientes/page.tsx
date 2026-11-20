import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ClientesPage() {
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
  return (

    <main
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "#F9FAFB",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <a
          href="/"
          style={{ color: "#14B8A6", textDecoration: "none" }}
        >
          ← Volver al inicio
        </a>

        <div style={{ marginTop: 45, marginBottom: 35 }}>
          <p style={{ color: "#14B8A6", fontWeight: "bold" }}>
            FIDELIZAPRO | PANEL DE GESTIÓN
          </p>

          <h1 style={{ fontSize: 36, marginBottom: 12 }}>
            Gestión de Clientes
          </h1>

          <p style={{ color: "#9CA3AF", lineHeight: 1.6 }}>
            Administra los clientes de tu negocio,
            consulta sus puntos y fortalece su fidelidad.
          </p>
        </div>

        <section
          style={{
            background: "#1F2937",
            padding: 30,
            borderRadius: 16,
            border: "1px solid #374151",
          }}
        >
          <h2 style={{ fontSize: 24, marginTop: 0 }}>
            Mis clientes
          </h2>

          <p style={{ color: "#9CA3AF", lineHeight: 1.6 }}>
            Aquí podrás registrar nuevos clientes,
            consultar su información y administrar
            sus puntos de fidelización.
          </p>

          <div
            style={{
              marginTop: 25,
              padding: 20,
              background: "#111827",
              borderRadius: 12,
              textAlign: "center",
              color: "#14B8A6",
            }}
          >
            Próximamente: Registro y administración de clientes
          </div>
        </section>
      </div>
    </main>
  );
}

