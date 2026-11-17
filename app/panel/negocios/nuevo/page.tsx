
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NuevoNegocioPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [categorias, setCategorias] = useState<
    { id: string; name: string }[]
  >([]);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);

  
const supabase = createClient();

async function cargarCategorias() {
  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (authError || !user) {
    router.replace("/login");
    return;
  }

    const { data, error } = await supabase
      .from("business_categories") 
.select("id, name")
.eq("active", true)
.order("name");
    if (error) {
      setMensaje("No se pudieron cargar las categorías.");
      return;
    }

    setCategorias(data || []);
  }

  async function guardarNegocio(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");
    setGuardando(true);

    const { data: usuario, error: errorUsuario } =
      await supabase.auth.getUser();

    if (errorUsuario || !usuario.user) {
      setGuardando(false);
      router.push("/login");
      return;
    }

    const slug =
      nombre
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") +
      "-" +
      crypto.randomUUID().slice(0, 8);

    const { error } = await supabase.from("businesses").insert({
      owner_id: usuario.user.id,
      category_id: categoria,
      name: nombre.trim(),
      slug,
      primary_color: "#2563EB",
      active: true,
    });

    setGuardando(false);

    if (error) {
      setMensaje("No se pudo registrar el negocio: " + error.message);
      return;
    }

    setMensaje("¡Negocio registrado correctamente!");
    router.push("/panel");
    router.refresh();
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#111827",
      color: "#F9FAFB",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        maxWidth: "480px",
        margin: "0 auto",
        background: "#1F2937",
        padding: "30px",
        borderRadius: "16px",
        border: "1px solid #374151"
      }}>
        <h1 style={{ color: "#14B8A6" }}>
          FidelizaPRO
        </h1>

        <h2>Registrar mi negocio</h2>

        <p style={{ color: "#9CA3AF" }}>
          Configura tu negocio para comenzar a fidelizar clientes.
        </p>

        <form onSubmit={guardarNegocio}>
          <label>Nombre del negocio</label>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ejemplo: Templo Barber"
            style={estiloInput}
          />

          <label>Categoría</label>
          <select
            required
            value={categoria}
            onFocus={() => {
              if (categorias.length === 0) cargarCategorias();
            }}
            onChange={(e) => setCategoria(e.target.value)}
            style={estiloInput}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={guardando}
            style={{
              width: "100%",
              padding: "14px",
              background: "#2563EB",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {guardando ? "Guardando..." : "Registrar negocio"}
          </button>
        </form>

        {mensaje && (
          <p style={{ color: "#14B8A6", marginTop: "20px" }}>
            {mensaje}
          </p>
        )}
      </div>
    </main>
  );
}

const estiloInput = {
  display: "block",
  width: "100%",
  padding: "13px",
  marginTop: "8px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #4B5563",
  background: "#111827",
  color: "#FFFFFF",
  boxSizing: "border-box" as const
};
