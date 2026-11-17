
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function registrar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: nombre },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setCargando(false);

    if (error) {
      setMensaje(error.message);
      return;
    }

    setMensaje(
      "¡Registro recibido! Revisa tu correo para confirmar tu cuenta."
    );
  }

  return (
    <main style={estiloPagina}>
      <div style={estiloTarjeta}>
        <h1 style={estiloLogo}>
          <span style={{ color: "#2563EB" }}>Fideliza</span>
          <span style={{ color: "#14B8A6" }}>PRO</span>
        </h1>

        <h2 style={{ textAlign: "center" }}>Crea tu cuenta</h2>

        <p style={estiloDescripcion}>
          Comienza a fidelizar los clientes de tu negocio.
        </p>

        <form onSubmit={registrar}>
          <label>Nombre completo</label>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            style={estiloInput}
          />

          <label>Correo electrónico</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@ejemplo.com"
            style={estiloInput}
          />

          <label>Contraseña</label>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            style={estiloInput}
          />

          <button
            type="submit"
            disabled={cargando}
            style={estiloBoton}
          >
            {cargando ? "Creando cuenta..." : "Crear mi cuenta"}
          </button>
        </form>

        {mensaje && (
          <p style={{ color: "#14B8A6", textAlign: "center" }}>
            {mensaje}
          </p>
        )}

        <p style={estiloPie}>
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" style={{ color: "#14B8A6" }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}

const estiloPagina = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#111827",
  color: "#F9FAFB",
  padding: "24px",
  fontFamily: "Arial, sans-serif",
};

const estiloTarjeta = {
  width: "100%",
  maxWidth: "420px",
  padding: "32px",
  borderRadius: "18px",
  background: "#1F2937",
  border: "1px solid #374151",
  boxSizing: "border-box" as const,
};

const estiloLogo = {
  textAlign: "center" as const,
  fontSize: "30px",
};

const estiloDescripcion = {
  textAlign: "center" as const,
  color: "#9CA3AF",
  marginBottom: "28px",
};

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
  boxSizing: "border-box" as const,
};

const estiloBoton = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "8px",
  background: "#2563EB",
  color: "#FFFFFF",
  fontWeight: "bold",
  cursor: "pointer",
};

const estiloPie = {
  textAlign: "center" as const,
  marginTop: "24px",
  color: "#9CA3AF",
};
