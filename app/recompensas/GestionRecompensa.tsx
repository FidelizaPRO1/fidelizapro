"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Props = {
  id: string;
  nombre: string;
  puntos: number;
  activa: boolean;
};

export default function GestionRecompensa({
  id,
  nombre,
  puntos,
  activa,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [estado, setEstado] = useState(activa);
  const [editando, setEditando] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState(nombre);
  const [nuevosPuntos, setNuevosPuntos] = useState(
    String(puntos)
  );
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  async function cambiarEstado() {
    if (guardando) return;

    setGuardando(true);
    setMensaje("");
    setError(false);

    const nuevoEstado = !estado;

    try {
      const { data, error: errorActualizacion } =
        await supabase
          .from("rewards")
          .update({ is_active: nuevoEstado })
          .eq("id", id)
          .select("id, is_active")
          .single();

      if (errorActualizacion || !data) {
        throw new Error();
      }

      setEstado(data.is_active);
      setMensaje(
        data.is_active
          ? "Recompensa activada correctamente."
          : "Recompensa desactivada correctamente."
      );

      router.refresh();
    } catch {
      setError(true);
      setMensaje("No fue posible cambiar el estado.");
    } finally {
      setGuardando(false);
    }
  }

  async function guardarCambios() {
    if (guardando) return;

    setMensaje("");
    setError(false);

    const nombreLimpio = nuevoNombre.trim();
    const cantidad = Number(nuevosPuntos);

    if (!nombreLimpio || nombreLimpio.length > 120) {
      setError(true);
      setMensaje("Ingresa un nombre válido.");
      return;
    }

    if (
      !Number.isSafeInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > 1000000
    ) {
      setError(true);
      setMensaje("Ingresa una cantidad válida de puntos.");
      return;
    }

    setGuardando(true);

    try {
      const { data, error: errorActualizacion } =
        await supabase
          .from("rewards")
          .update({
            name: nombreLimpio,
            points_required: cantidad,
          })
          .eq("id", id)
          .select("id")
          .single();

      if (errorActualizacion || !data) {
        throw new Error();
      }

      setEditando(false);
      setMensaje("Recompensa actualizada correctamente.");
      router.refresh();
    } catch {
      setError(true);
      setMensaje("No fue posible guardar los cambios.");
    } finally {
      setGuardando(false);
    }
  }
  async function eliminarRecompensa() {
    if (guardando) return;

    const confirmado = window.confirm(
      `¿Estás seguro de eliminar "${nombre}"?\n\n` +
      "La recompensa desaparecerá de la lista, " +
      "pero se conservará el historial de los clientes."
    );

    if (!confirmado) return;

    setGuardando(true);
    setMensaje("");
    setError(false);

    try {
      const { data, error: errorEliminacion } =
        await supabase.rpc("eliminar_recompensa", {
          p_reward_id: id,
        });

      if (errorEliminacion || data !== true) {
        throw new Error();
      }

      router.refresh();
    } catch {
      setError(true);
      setMensaje("No fue posible eliminar la recompensa.");
    } finally {
      setGuardando(false);
    }
  }
  return (
    <div
      style={{
        borderTop: "1px solid #374151",
        paddingTop: 14,
        marginTop: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <span style={{ color: "#9CA3AF" }}>
          Estado:
        </span>

        <button
          type="button"
          role="switch"
          aria-checked={estado}
          aria-label="Estado de la recompensa"
          disabled={guardando || editando}
          onClick={cambiarEstado}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: "none",
            minHeight: 44,
            padding: "8px 0 8px 8px",
            cursor: guardando || editando
              ? "not-allowed"
              : "pointer",
            color: estado ? "#14B8A6" : "#9CA3AF",
            fontWeight: "bold",
            fontSize: 14,
          }}
        >
          {estado ? "Activada" : "Desactivada"}

          <span
            style={{
              width: 48,
              height: 26,
              borderRadius: 20,
              background: estado
                ? "#14B8A6"
                : "#4B5563",
              position: "relative",
              display: "inline-block",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 3,
                left: estado ? 25 : 3,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "#FFFFFF",
                transition: "left 0.2s",
              }}
            />
          </span>
        </button>
      </div>

      {!editando && (
        <div
            style={{
            display: "flex",
            justifyContent: "flex-end",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 8,
          }}
        >
            <button
            type="button"
            disabled={guardando}
            onClick={eliminarRecompensa}
            style={{
              ...estiloBoton,
              background: "#DC2626",
              color: "#FFFFFF",
            }}
          >
            🗑 Eliminar recompensa
          </button>
          <button
            type="button"
            disabled={guardando}
            onClick={() => {
              setNuevoNombre(nombre);
              setNuevosPuntos(String(puntos));
              setMensaje("");
              setEditando(true);
            }}
            style={{
              ...estiloBoton,
              background: "#2563EB",
              color: "#FFFFFF",
            }}
          >
            ✎ Editar recompensa
          </button>
        </div>
      )}

      {editando && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void guardarCambios();
          }}
          style={{
            display: "grid",
            gap: 14,
            marginTop: 16,
          }}
        >
          <label>
            Nombre de la recompensa
            <input
              type="text"
              required
              maxLength={120}
              value={nuevoNombre}
              disabled={guardando}
              onChange={(e) =>
                setNuevoNombre(e.target.value)
              }
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
              value={nuevosPuntos}
              disabled={guardando}
              onChange={(e) =>
                setNuevosPuntos(e.target.value)
              }
              style={estiloCampo}
            />
          </label>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "flex-end",
            }}
          >
            <button
              type="button"
              disabled={guardando}
              onClick={() => {
                setEditando(false);
                setMensaje("");
              }}
              style={{
                ...estiloBoton,
                background: "#374151",
                color: "#FFFFFF",
              }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={guardando}
              style={{
                ...estiloBoton,
                background: "#14B8A6",
                color: "#111827",
              }}
            >
              {guardando
                ? "Guardando..."
                : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}

      {mensaje && (
        <p
          role="status"
          style={{
            color: error ? "#F87171" : "#14B8A6",
            fontSize: 14,
            marginTop: 12,
          }}
        >
          {mensaje}
        </p>
      )}
    </div>
  );
}

const estiloBoton = {
  minHeight: 44,
  padding: "10px 14px",
  border: "none",
  borderRadius: 8,
  fontSize: 14,
  fontWeight: "bold" as const,
  cursor: "pointer",
};

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
