"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SolicitudPendiente = {
  requestId: string;
  puntos: number;
  motivo: string;
};

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
  const [esError, setEsError] = useState(false);
  const [preparado, setPreparado] = useState(false);

  const [solicitudPendiente, setSolicitudPendiente] =
    useState<SolicitudPendiente | null>(null);

  const bloqueo = useRef(false);

  const claveSolicitud =
    `fidelizapro-puntos-pendientes-${clienteId}`;

  useEffect(() => {
    setPreparado(false);

    try {
      const guardada = localStorage.getItem(claveSolicitud);

      if (guardada) {
        const solicitud = JSON.parse(
          guardada
        ) as SolicitudPendiente;

        if (
          typeof solicitud.requestId !== "string" ||
          !Number.isSafeInteger(solicitud.puntos) ||
          solicitud.puntos <= 0 ||
          !["Compra", "Visita"].includes(solicitud.motivo)
        ) {
          throw new Error("Solicitud inválida");
        }

        setSolicitudPendiente(solicitud);
        setCantidad(String(solicitud.puntos));
        setMotivo(solicitud.motivo);
        setEsError(true);

        setMensaje(
          "Existe una solicitud pendiente. Reintenta para confirmar su resultado sin duplicar los puntos."
        );
      } else {
        setSolicitudPendiente(null);
        setCantidad("");
        setMotivo("Compra");
        setMensaje("");
        setEsError(false);
      }

      setPreparado(true);
    } catch {
      setEsError(true);
      setMensaje(
        "No fue posible recuperar las solicitudes guardadas. No registres nuevos puntos hasta resolverlo."
      );
    }
  }, [claveSolicitud]);

  async function sumarPuntos() {
    if (bloqueo.current || !preparado) return;

    bloqueo.current = true;

    setGuardando(true);
    setMensaje("");
    setEsError(false);

    try {
      const guardada = localStorage.getItem(claveSolicitud);

      let solicitud: SolicitudPendiente | null =
        guardada ? JSON.parse(guardada) : solicitudPendiente;

      if (!solicitud) {
        const puntos = Number(cantidad);

        if (!Number.isSafeInteger(puntos) || puntos <= 0) {
          setEsError(true);
          setMensaje("Ingresa una cantidad válida de puntos.");
          return;
        }

        solicitud = {
          requestId: crypto.randomUUID(),
          puntos,
          motivo,
        };
      }

      localStorage.setItem(
        claveSolicitud,
        JSON.stringify(solicitud)
      );

      setSolicitudPendiente(solicitud);
      setCantidad(String(solicitud.puntos));
      setMotivo(solicitud.motivo);

      const supabase = createClient();

      const { data, error } = await supabase.rpc(
        "registrar_movimiento_puntos",
        {
          p_customer_id: clienteId,
          p_points_change: solicitud.puntos,
          p_reason: solicitud.motivo,
          p_request_id: solicitud.requestId,
        }
      );

      if (error) {
        setEsError(true);

        setMensaje(
          "No se pudo confirmar la solicitud. " +
          "Reintenta la misma operación. Detalle: " +
          error.message
        );

        return;
      }

      localStorage.removeItem(claveSolicitud);

      setSolicitudPendiente(null);
      setCantidad("");
      setEsError(false);

      setMensaje(
        `Puntos agregados correctamente. Saldo actual: ${data} puntos.`
      );

      router.refresh();
    } catch {
      setEsError(true);

      setMensaje(
        "No fue posible confirmar la operación. Verifica la conexión y vuelve a intentarlo."
      );
    } finally {
      bloqueo.current = false;
      setGuardando(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void sumarPuntos();
      }}
      style={{ display: "grid", gap: 10, marginTop: 0 }}
    >
      <label htmlFor="cantidad-puntos">
        Cantidad de puntos
      </label>

      <input
        id="cantidad-puntos"
        type="number"
        min="1"
        step="1"
        required
        value={cantidad}
        disabled={
          guardando || !!solicitudPendiente || !preparado
        }
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
        disabled={
          guardando || !!solicitudPendiente || !preparado
        }
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
        disabled={guardando || !preparado}
        style={{
          padding: 14,
          border: 0,
          borderRadius: 8,
          background: "#14B8A6",
          color: "#111827",
          fontWeight: "bold",
          cursor:
            guardando || !preparado
              ? "not-allowed"
              : "pointer",
          opacity: guardando || !preparado ? 0.6 : 1,
        }}
      >
        {guardando
          ? "Guardando..."
          : solicitudPendiente
          ? "Reintentar solicitud"
          : "Sumar puntos"}
      </button>

      {mensaje && (
        <p
          role="status"
          style={{
            color: esError ? "#F87171" : "#14B8A6",
          }}
        >
          {mensaje}
        </p>
      )}
    </form>
  );
}
