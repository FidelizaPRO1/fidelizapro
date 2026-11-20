"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
export default function FormularioCliente() {
const supabase = createClient();
const [nombre, setNombre] = useState("");
const [telefono, setTelefono] = useState("");
const [correo, setCorreo] = useState("");
const [mensaje, setMensaje] = useState("");
const [guardando, setGuardando] = useState(false);
async function registrarCliente() {
  setGuardando(true);
  setMensaje("");

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      setMensaje("Debes iniciar sesión.");
      return;
    }

const { data: negocios, error: errorNegocios } = await supabase
  .from("business_members")
  .select("business_id")
  .eq("user_id", user.id)
  .limit(1);

if (errorNegocios || !negocios || negocios.length === 0) {
  setMensaje("No tienes un negocio autorizado.");
  return;
}

const businessId = negocios[0].business_id;

const datosCliente = {
  business_id: businessId,
  full_name: nombre.trim(),
  phone: telefono.trim() || null,
  email: correo.trim() || null,
};

const { error: errorRegistro } = await supabase
  .from("customers")
  .insert(datosCliente);

if (errorRegistro) {
  setMensaje("Error al registrar el cliente: " + errorRegistro.message);
  return;
}

setMensaje("Cliente registrado correctamente.");
setNombre("");
setTelefono("");
setCorreo("");
  } catch {
    setMensaje("No fue posible verificar la sesión.");
  } finally {
    setGuardando(false);
  }
}  
  return (
    <form
      onSubmit={(e) => {
  e.preventDefault();
  void registrarCliente();
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
        disabled={guardando}
        style={{
          padding: 14,
          borderRadius: 10,
          border: "none",
          background: "#14B8A6",
          color: "#111827",
          fontWeight: "bold",
          opacity: guardando ? 0.6 : 1,
          cursor: "pointer",
        }}
      >
        {guardando ? "Guardando cliente..." : "Guardar cliente"}
      </button>
    
    {mensaje && (
    <p
    role="status"
    style={{
      color: "#14B8A6",
      fontWeight: "bold",
      marginTop: 10,
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
  boxSizing: "border-box" as const,
};
