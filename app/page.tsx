
export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#111827",
      color: "white",
      fontFamily: "Arial, sans-serif",
      padding: "40px 20px"
    }}>
      <header style={{
        maxWidth: "1100px",
        margin: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ color: "#14B8A6", fontSize: "28px" }}>
          FidelizaPRO
        </h1>
        <span style={{ color: "#9CA3AF" }}>
          Fideliza clientes. Haz crecer tu negocio.
        </span>
      </header>

      <section style={{
        maxWidth: "1100px",
        margin: "100px auto",
        textAlign: "center"
      }}>
        <p style={{ color: "#14B8A6", fontWeight: "bold" }}>
          LA FIDELIZACIÓN DE CLIENTES, MÁS FÁCIL
        </p>

        <h2 style={{
          fontSize: "clamp(36px, 6vw, 64px)",
          lineHeight: 1.1
        }}>
          Convierte cada compra<br />
          en una relación duradera.
        </h2>

        <p style={{
          color: "#D1D5DB",
          fontSize: "18px",
          maxWidth: "650px",
          margin: "25px auto"
        }}>
          Administra clientes, acumula puntos, entrega premios
          y crea experiencias que hacen que tus clientes quieran volver.
        </p>

        <button style={{
          background: "#2563EB",
          color: "white",
          border: "none",
          padding: "16px 30px",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: "bold"
        }}>
          Próximamente
        </button>
      </section>

      <section style={{
        maxWidth: "1100px",
        margin: "auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
      }}>
        {[
          ["01", "Clientes", "Organiza y conoce a tus clientes."],
          ["02", "Puntos", "Premia las compras y visitas."],
          ["03", "Recompensas", "Crea premios y promociones."],
          ["04", "Estadísticas", "Consulta el crecimiento de tu negocio."]
        ].map(([number, title, description]) => (
          <article key={number} style={{
            background: "#1F2937",
            border: "1px solid #374151",
            borderRadius: "16px",
            padding: "25px"
          }}>
            <span style={{ color: "#14B8A6", fontSize: "14px" }}>
              {number}
            </span>
            <h3 style={{ fontSize: "22px" }}>{title}</h3>
            <p style={{ color: "#9CA3AF" }}>{description}</p>
          </article>
        ))}
      </section>

      <footer style={{
        textAlign: "center",
        color: "#6B7280",
        marginTop: "80px"
      }}>
        © 2026 FidelizaPRO. Todos los derechos reservados.
      </footer>
    </main>
  );
}
