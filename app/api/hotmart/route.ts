import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);
export async function POST(request: NextRequest) {
  const expectedHottok = process.env.HOTMART_HOTTOK;

  if (!expectedHottok) {
    console.error("HOTMART_HOTTOK no está configurado");

    return NextResponse.json(
      { error: "Servicio no configurado" },
      { status: 503 }
    );
  }

  const receivedHottok = request.headers.get("x-hotmart-hottok");

  if (!receivedHottok || receivedHottok !== expectedHottok) {
    return NextResponse.json(
      { error: "Notificación no autorizada" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    received: true,
    message: "Notificación recibida. Procesamiento pendiente."
  });
}
