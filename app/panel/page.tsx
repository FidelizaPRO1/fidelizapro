import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export default async function PanelPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const herramientas = [
    {
      titulo: "Clientes",
      descripcion: "Administra los clientes de tu negocio.",
      icono: "👥",
    },
    {
      titulo: "Puntos",
      descripcion: "Consulta y administra los puntos.",
      icono: "⭐",
    },
    {
      titulo: "Recompensas",
      descripcion: "Configura premios para tus clientes.",
      icono: "🎁",
    },
    {
      titulo: "Promociones",
      descripcion: "Prepara ofertas y campañas.",
      icono: "📣",
    },
    {
      titulo: "Estadísticas",
      descripcion: "Conoce la actividad de tu negocio.",
      icono: "📊",
    },
    {
      titulo: "Configuración",
      descripcion: "Personaliza tu negocio.",
      icono: "⚙️",
    },
  ];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#111827",
        color: "#F9FAFB",
        padding: "32px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "48px",
          }}
        >
          <h1 style={{ fontSize: "30px" }}>
            <span style={{ color: "#2563EB" }}>Fideliza</span>
            <span style={{ color: "#14B8A6" }}>PRO</span>
          </h1>

          <Link href="/" style={{ color: "#14B8A6" }}>
            Volver al inicio
          </Link>
        </header>

        <h2 style={{ fontSize: "28px", marginBottom: "12px" }}>
          Panel de tu negocio
        </h2>

        <p style={{ color: "#9CA3AF", marginBottom: "36px" }}>
          Bienvenido a tu espacio de fidelización.
          Aquí podrás administrar las herramientas de tu negocio.
        </p>

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {herramientas.map((herramienta) => (
            <div
              key={herramienta.titulo}
              style={{
                background: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "16px",
                padding: "26px",
              }}
            >
              <div style={{ fontSize: "34px", marginBottom: "16px" }}>
                {herramienta.icono}
              </div>

              <h3 style={{ fontSize: "20px", marginBottom: "12px" }}>
                {herramienta.titulo}
              </h3>

              <p style={{ color: "#9CA3AF", lineHeight: "1.6" }}>
                {herramienta.descripcion}
              </p>
            </div>
          ))}
        </section>

        <p
          style={{
            marginTop: "40px",
            color: "#F5B942",
            textAlign: "center",
          }}
        >
          Estamos preparando las funciones de tu negocio.
        </p>
      </div>
    </main>
  );
}
