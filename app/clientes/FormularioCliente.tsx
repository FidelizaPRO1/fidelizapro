"use client";

import { useState } from "react";

export default function FormularioCliente() {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      style={{
        display: "grid",
        gap: 16,
        maxWidth: 500,
        marginTop: 24,
      }}
    >
      <label>
        Nombre completo
        <input
          type="text"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del cliente"
          style={estiloCampo}
        />
      </label>

      <label>
        Teléfono
        <input
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          placeholder="Número de teléfono"
          style={estiloCampo}
        />
      </label>

      <label>
        Correo electrónico
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="correo@ejemplo.com"
          style={estiloCampo}
        />
      </label>

      <button
        type="submit"
        disabled
        style={{
          padding: 14,
          borderRadius: 10,
          border: "none",
          background: "#14B8A6",
          color: "#111827",
          fontWeight: "bold",
          opacity: 0.6,
          cursor: "not-allowed",
        }}
      >
        Guardar cliente (próximamente)
      </button>
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
  boxSizing: "border-box" as const,
};
