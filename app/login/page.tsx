
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");
    setCargando(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setCargando(false);

    if (error) {
      setMensaje("No se pudo iniciar sesión. Revisa tu correo y contraseña.");
      return;
    }

        router.replace("/clientes");
    router.refresh();
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#111827",
      color: "#F9FAFB",
      padding: "24px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        padding: "32px",
        borderRadius: "18px",
        background: "#1F2937",
        border: "1px solid #374151"
      }}>
        <h1 style={{ textAlign: "center", fontSize: "30px" }}>
          <span style={{ color: "#2563EB" }}>Fideliza</span>
          <span style={{ color: "#14B8A6" }}>PRO</span>
        </h1>

        <h2 style={{ textAlign: "center" }}>Iniciar sesión</h2>

        <p style={{ textAlign: "center", color: "#9CA3AF" }}>
          Ingresa a la plataforma de tu negocio.
        </p>

        <form onSubmit={iniciarSesion}>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            style={estiloInput}
          />

          <button
            type="submit"
            disabled={cargando}
            style={estiloBoton}
          >
            {cargando ? "Ingresando..." : "Entrar a mi cuenta"}
          </button>
        </form>

        {mensaje && (
          <p style={{ color: "#F87171", textAlign: "center" }}>
            {mensaje}
          </p>
        )}

        <p style={{ textAlign: "center", marginTop: "24px", color: "#9CA3AF" }}>
          ¿Todavía no tienes cuenta?{" "}
          <Link href="/registro" style={{ color: "#14B8A6" }}>
            Regístrate aquí
          </Link>
        </p>
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
