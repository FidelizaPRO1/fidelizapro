import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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
    return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "#F9FAFB",
        padding: "50px 20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 750,
          background: "#1F2937",
          padding: "35px 25px",
          borderRadius: 16,
          border: "1px solid #374151",
          boxSizing: "border-box",
        }}
      >
      <h1>Gestión de puntos</h1>

<h2 style={{ color: "#14B8A6", marginTop: 30 }}>
  {cliente.full_name}
</h2>

<p style={{ fontSize: 22 }}>
  Puntos disponibles: <strong>{cliente.points_balance ?? 0}</strong>
</p>

<p style={{ color: "#9CA3AF" }}>
  Aquí podrás sumar puntos por compras o visitas.
</p>
<FormularioPuntos clienteId={cliente.id} />
      </div>
    </main>
  );
}
