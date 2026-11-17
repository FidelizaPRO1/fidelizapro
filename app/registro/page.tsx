
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
      "¡Registro recibido! Revisa tu correo electrónico para confirmar tu cuenta."
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#111827] px-5 py-12 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1F2937] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            <span className="text-[#2563EB]">Fideliza</span>
            <span className="text-[#14B8A6]">PRO</span>
          </h1>
          <h2 className="mt-6 text-2xl font-bold">Crea tu cuenta</h2>
          <p className="mt-2 text-gray-400">
            Comienza a fidelizar los clientes de tu negocio.
          </p>
        </div>

        <form onSubmit={registrar} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm">Nombre completo</label>
            <input
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-[#111827] p-3 outline-none focus:border-[#14B8A6]"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Correo electrónico</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-[#111827] p-3 outline-none focus:border-[#14B8A6]"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">Contraseña</label>
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-600 bg-[#111827] p-3 outline-none focus:border-[#14B8A6]"
              placeholder="Mínimo 8 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-[#2563EB] p-3 font-semibold transition hover:bg-blue-700 disabled:opacity-50"
          >
            {cargando ? "Creando cuenta..." : "Crear mi cuenta"}
          </button>
        </form>

        {mensaje && (
          <p className="mt-5 rounded-lg bg-[#111827] p-3 text-center text-sm text-[#14B8A6]">
            {mensaje}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-[#14B8A6] hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
