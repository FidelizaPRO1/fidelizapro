"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function FormularioPuntos({
  clienteId,
}: {
  clienteId: string;
}) {
  const router = useRouter();
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("Compra");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function sumarPuntos() {
    const puntos = Number(cantidad);

    if (!Number.isSafeInteger(puntos) || puntos <= 0) {
      setMensaje("Ingresa una cantidad válida de puntos.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    try {
      const supabase = createClient();

      const { error } = await supabase.rpc(
        "registrar_movimiento_puntos",
        {
          p_customer_id: clienteId,
          p_points_change: puntos,
          p_reason: motivo,
        }
      );

      if (error) {
        setMensaje("Error: " + error.message);
        return;
      }

      setMensaje("Puntos agregados correctamente.");
      setCantidad("");
      router.refresh();
    } catch {
      setMensaje("No fue posible registrar los puntos.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void sumarPuntos();
      }}
      style={{ display: "grid", gap: 16, marginTop: 25 }}
    >
      <label htmlFor="cantidad-puntos">Cantidad de puntos</label>
      <input
        id="cantidad-puntos"
        type="number"
        min="1"
        step="1"
        required
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        placeholder="Ejemplo: 1"
        style={{
          padding: 14,
          borderRadius: 8,
          border: "1px solid #374151",
          background: "#111827",
          color: "#FFFFFF",
        }}
      />

      <label htmlFor="motivo-puntos">Motivo</label>
      <select
        id="motivo-puntos"
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
        style={{
          padding: 14,
          borderRadius: 8,
          border: "1px solid #374151",
          background: "#111827",
          color: "#FFFFFF",
        }}
      >
        <option value="Compra">Compra</option>
        <option value="Visita">Visita</option>
      </select>

      <button
        type="submit"
        disabled={guardando}
        style={{
          padding: 14,
          border: 0,
          borderRadius: 8,
          background: "#14B8A6",
          color: "#111827",
          fontWeight: "bold",
          cursor: guardando ? "not-allowed" : "pointer",
          opacity: guardando ? 0.6 : 1,
        }}
      >
        {guardando ? "Guardando..." : "Sumar puntos"}
      </button>

      {mensaje && (
        <p role="status" style={{ color: "#14B8A6" }}>
          {mensaje}
        </p>
      )}
    </form>
  );
}
