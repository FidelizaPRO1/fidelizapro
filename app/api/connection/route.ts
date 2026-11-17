
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("business_categories")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json(
        { connected: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      connected: true,
      message: "FidelizaPRO está conectado a Supabase.",
    });
  } catch {
    return NextResponse.json(
      { connected: false, error: "No se pudo conectar con Supabase." },
      { status: 500 }
    );
  }
}
