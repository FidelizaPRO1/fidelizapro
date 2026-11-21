"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Recompensa = {
  id: string;
  name: string;
  points_required: number;
};

export default function FormularioCanje({
  clienteId,
  puntosDisponibles,
  recompensas,
}: {
  clienteId: string;
  puntosDisponibles: number;
  recompensas: Recompensa[];
}) {
  const router = useRouter();
  const [recompensaId, setRecompensaId] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);

  const recompensa = recompensas.find(
    (item) => item.id === recompensaId
  );

  async function realizarCanje() {
    if (guardando || !recompensa) return;

    if (puntosDisponibles < recompensa.points_required) {
      setEsError(true);
      setMensaje("El cliente no tiene puntos suficientes.");
      return;
    }

    const confirmado = window.confirm(
      `¿Confirmas el canje de "${recompensa.name}" por ${recompensa.points_required} puntos? Esta operación descontará puntos del cliente.`
    );

    if (!confirmado) return;

    setGuardando(true);
    setMensaje("");
    setEsError(false);

    try {
      const supabase = createClient();

      const { data, error } = await supabase.rpc(
        "canjear_recompensa",
        {
          p_customer_id: clienteId,
          p_reward_id: recompensa.id,
        }
      );

      if (error) {
        setEsError(true);
        setMensaje("Error: " + error.message);
        return;
      }

      setMensaje(
        `Canje realizado correctamente. Nuevo saldo: ${data} puntos.`
      );
      setRecompensaId("");
      router.refresh();
    } catch {
      setEsError(true);
      setMensaje("No fue posible completar el canje.");
    } finally {
      setGuardando(false);
    }
  }

  return (
  <section>

      <p style={{ color: "#9CA3AF" }}>
        Selecciona una recompensa disponible para este cliente.
      </p>

      {recompensas.length === 0 ? (
        <p style={{ color: "#F5B942" }}>
          Este negocio todavía no tiene recompensas activas.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void realizarCanje();
          }}
          style={{ display: "grid", gap: 16 }}
        >
          <label htmlFor="recompensa-canje">
            Recompensa
          </label>

          <select
            id="recompensa-canje"
            required
            value={recompensaId}
            onChange={(e) => {
              setRecompensaId(e.target.value);
              setMensaje("");
            }}
            style={{
              padding: 14,
              borderRadius: 8,
              border: "1px solid #374151",
              background: "#111827",
              color: "#FFFFFF",
              width: "100%",
            }}
          >
            <option value="">Seleccionar recompensa</option>

            {recompensas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} — {item.points_required} puntos
              </option>
            ))}
          </select>

          {recompensa && (
            <p style={{ color: "#14B8A6" }}>
              Costo: {recompensa.points_required} puntos.
              {" "}
              Saldo actual: {puntosDisponibles} puntos.
            </p>
          )}

          <button
            type="submit"
            disabled={
              guardando ||
              !recompensa ||
              puntosDisponibles <
                (recompensa?.points_required ?? 0)
            }
            style={{
              padding: 14,
              border: 0,
              borderRadius: 8,
              background: "#F5B942",
              color: "#111827",
              fontWeight: "bold",
              cursor: guardando ? "wait" : "pointer",
              opacity:
                guardando ||
                !recompensa ||
                puntosDisponibles <
                  (recompensa?.points_required ?? 0)
                  ? 0.6
                  : 1,
            }}
          >
            {guardando ? "Procesando..." : "Confirmar canje"}
          </button>
        </form>
      )}

      {mensaje && (
        <p
          role="status"
          style={{
            color: esError ? "#FCA5A5" : "#14B8A6",
            marginTop: 16,
          }}
        >
          {mensaje}
        </p>
      )}
    </section>
  );
}
