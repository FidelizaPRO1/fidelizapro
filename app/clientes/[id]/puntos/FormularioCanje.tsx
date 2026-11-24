"use client";

import { useState, useRef, useEffect } from "react";
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
  const bloqueoCanje = useRef(false);
  const [recompensaId, setRecompensaId] = useState("");
  
const [guardando, setGuardando] = useState(false);
const [mensaje, setMensaje] = useState("");
const [esError, setEsError] = useState(false);
const [solicitudPendiente, setSolicitudPendiente] = useState<{
  recompensaId: string;
  requestId: string;
} | null>(null);

const claveSolicitud = `fidelizapro-canje-pendiente-${clienteId}`;
const [solicitudCargada, setSolicitudCargada] = useState(false);

   useEffect(() => {
    setSolicitudCargada(false);

    try {
      const guardada = localStorage.getItem(claveSolicitud);

      if (guardada) {
        const solicitud = JSON.parse(guardada);

        if (
          typeof solicitud.recompensaId !== "string" ||
          typeof solicitud.requestId !== "string"
        ) {
          throw new Error("Solicitud pendiente inválida");
        }

        setSolicitudPendiente(solicitud);
        setRecompensaId(solicitud.recompensaId);
        setEsError(true);
        setMensaje(
          "Existe un canje pendiente de confirmación. Reintenta la misma solicitud para verificar su resultado."
        );
      } else {
        setSolicitudPendiente(null);
        setRecompensaId("");
      }

      setSolicitudCargada(true);
    } catch {
      setEsError(true);
      setMensaje(
        "No fue posible recuperar la solicitud pendiente. No realices otro canje hasta verificar el historial."
      );
    }
  }, [claveSolicitud]);

  const recompensa = recompensas.find(
    (item) => item.id === recompensaId
  );

     async function realizarCanje() {
    if (
      bloqueoCanje.current ||
      guardando ||
      !solicitudCargada
    ) return;

    if (!solicitudPendiente) {
      if (!recompensa) return;

      if (puntosDisponibles < recompensa.points_required) {
        setEsError(true);
        setMensaje("El cliente no tiene puntos suficientes.");
        return;
      }

      const confirmado = window.confirm(
        `¿Confirmas el canje de "${recompensa.name}" por ${recompensa.points_required} puntos? Esta operación descontará puntos del cliente.`
      );

      if (!confirmado) return;
    }

    bloqueoCanje.current = true;
    setGuardando(true);
    setMensaje("");
    setEsError(false);

        try {
      const supabase = createClient();

      const idRecompensa =
        solicitudPendiente?.recompensaId ?? recompensa?.id;

      if (!idRecompensa) return;

      const requestId =
        solicitudPendiente?.requestId ?? crypto.randomUUID();

const nuevaSolicitud = {
  recompensaId: idRecompensa,
  requestId,
};

localStorage.setItem(
  claveSolicitud,
  JSON.stringify(nuevaSolicitud)
);

setSolicitudPendiente(nuevaSolicitud);

const { data, error } = await supabase.rpc(
  "canjear_recompensa",
  {
    p_customer_id: clienteId,
    p_reward_id: idRecompensa,
    p_request_id: requestId,
  }
);
 
           if (error) {
        const erroresDefinitivos = [
          "El cliente no tiene puntos suficientes",
          "Recompensa no disponible",
        ];

        const errorDefinitivo =
          error.code === "P0001" &&
          erroresDefinitivos.includes(error.message);

        if (errorDefinitivo) {
          localStorage.removeItem(claveSolicitud);
          setSolicitudPendiente(null);
        }

        setEsError(true);
        setMensaje(
          errorDefinitivo
            ? "Error: " + error.message
            : "No se pudo confirmar el resultado del canje. Reintenta la misma solicitud. No inicies otro canje."
        );
        return;
      }
 
            localStorage.removeItem(claveSolicitud);
      setSolicitudPendiente(null);
      setMensaje(
        `Canje realizado correctamente. Nuevo saldo: ${data} puntos.`
      );
      setRecompensaId("");
      router.refresh();

    } catch {
      setEsError(true);
      setMensaje("No fue posible completar el canje.");
        } finally {
      bloqueoCanje.current = false;
      setGuardando(false);
    }
  }

  return (
  <section>

      <p style={{ color: "#9CA3AF" }}>
        Selecciona una recompensa disponible para este cliente.
      </p>

      {recompensas.length === 0 && !solicitudPendiente ? (
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
            required={!solicitudPendiente}
            disabled={
              guardando ||
              !solicitudCargada ||
              solicitudPendiente !== null
            }
            value={recompensaId}
            onChange={(e) => {
              if (
                bloqueoCanje.current ||
                solicitudPendiente ||
                !solicitudCargada
              ) return;

              setRecompensaId(e.target.value);
              setMensaje("");
              setEsError(false);
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
              !solicitudCargada ||
              (!solicitudPendiente &&
                (!recompensa ||
                  puntosDisponibles <
                    (recompensa?.points_required ?? 0)))
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
                !solicitudCargada ||
                (!solicitudPendiente &&
                  (!recompensa ||
                    puntosDisponibles <
                      (recompensa?.points_required ?? 0)))
                  ? 0.6
                  : 1,
            }}
          >
            {guardando
              ? "Procesando..."
              : solicitudPendiente
                ? "Recuperar canje pendiente"
                                : "Confirmar canje"}
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
