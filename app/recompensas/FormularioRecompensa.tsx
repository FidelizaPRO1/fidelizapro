"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FormularioRecompensa() {
  const supabase = createClient();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [puntos, setPuntos] = useState("");
  const [activa, setActiva] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [exito, setExito] = useState(false);

  async function guardarRecompensa() {
    if (guardando) return;

    setMensaje("");
    setExito(false);

    const cantidad = Number(puntos);

    if (!nombre.trim() || nombre.trim().length > 120) {
      setMensaje("Ingresa un nombre válido para la recompensa.");
      return;
    }

    if (!Number.isSafeInteger(cantidad) || cantidad <= 0 || cantidad > 1000000) {
      setMensaje("Ingresa una cantidad válida de puntos.");
      return;
    }

    setGuardando(true);

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        setMensaje("Debes iniciar sesión.");
        return;
      }

      const { data: negocios, error: errorNegocios } =
        await supabase
          .from("business_members")
          .select("business_id")
          .eq("user_id", user.id)
          .limit(1);

      if (errorNegocios || !negocios || negocios.length === 0) {
        setMensaje("No tienes un negocio autorizado.");
        return;
      }

      const { error: errorRegistro } = await supabase
        .from("rewards")
        .insert({
          business_id: negocios[0].business_id,
          name: nombre.trim(),
          points_required: cantidad,
          is_active: activa,
        });

      if (errorRegistro) {
        setMensaje("No fue posible guardar la recompensa.");
        return;
      }

      setExito(true);
      setMensaje("Recompensa creada correctamente.");
      setNombre("");
      setPuntos("");
      setActiva(true);

      router.refresh();
    } catch {
      setMensaje("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void guardarRecompensa();
      }}
      style={{
        display: "grid",
        gap: 14,
        width: "100%",
        color: "#F9FAFB",
        textAlign: "left",
      }}
    >
      <label>
        Nombre de la recompensa
        <input
          type="text"
          required
          maxLength={120}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ejemplo: Corte de cabello gratis"
          style={estiloCampo}
        />
      </label>

      <label>
        Puntos necesarios
        <input
          type="number"
          required
          min={1}
          max={1000000}
          step={1}
          inputMode="numeric"
          value={puntos}
          onChange={(e) => setPuntos(e.target.value)}
          placeholder="Ejemplo: 100"
          style={estiloCampo}
        />
      </label>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          checked={activa}
          onChange={(e) => setActiva(e.target.checked)}
          style={{
            width: 18,
            height: 18,
            accentColor: "#14B8A6",
          }}
        />
        Recompensa activa
      </label>

      <button
        type="submit"
        disabled={guardando}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 10,
          border: "none",
          background: "#14B8A6",
          color: "#111827",
          fontWeight: "bold",
          cursor: guardando ? "not-allowed" : "pointer",
          opacity: guardando ? 0.6 : 1,
        }}
      >
        {guardando
          ? "Guardando recompensa..."
          : "Guardar recompensa"}
      </button>

      {mensaje && (
        <p
          role="status"
          style={{
            color: exito ? "#14B8A6" : "#F87171",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {mensaje}
        </p>
      )}
    </form>
  );
}

const estiloCampo = {
  display: "block",
  width: "100%",
  padding: 12,
  marginTop: 8,
  borderRadius: 8,
  border: "1px solid #374151",
  background: "#111827",
  color: "#FFFFFF",
  fontSize: 16,
  boxSizing: "border-box" as const,
};
