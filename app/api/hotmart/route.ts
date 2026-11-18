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
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido" },
      { status: 400 }
    );
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    Array.isArray(payload)
  ) {
    return NextResponse.json(
      { error: "Formato de notificación inválido" },
      { status: 400 }
    );
  }

  
  const notification = payload as Record<string, unknown>;

  
  const eventId =
    typeof notification.id === "string"
      ? notification.id
      : "";

  const eventName =
    typeof notification.event === "string"
      ? notification.event
      : "";


  if (
    typeof eventId !== "string" ||
    !eventId.trim() ||
    typeof eventName !== "string" ||
    !eventName.trim()
  ) {
    return NextResponse.json(
      { error: "Identificador o evento no válido" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("payment_events")
    .insert({
      provider: "hotmart",
      event_id: eventId,
      event: eventName,
      payload: notification
    });


  if (error) { 
    if (error.code === "23505") {
      return NextResponse.json({
        received: true,
        message: "Notificación duplicada. Ya estaba registrada."
      });
    }

    console.error("Error al registrar notificación:", error.message);

    return NextResponse.json(
      { error: "No se pudo registrar la notificación" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    received: true,
    message: "Notificación registrada. Procesamiento pendiente."
  });
}
