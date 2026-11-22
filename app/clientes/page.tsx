import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FormularioCliente from "./FormularioCliente";
import styles from "./Clientes.module.css";
export default async function ClientesPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }
const { data: negocios, error: errorNegocios } = await supabase
  .from("business_members")
  .select("business_id")
  .eq("user_id", user.id)
  .limit(1);

if (errorNegocios || !negocios || negocios.length === 0) {
  redirect("/panel");
}
const businessId = negocios[0].business_id;

const { data: clientes, error: errorClientes } = await supabase
  .from("customers")
  .select("id, full_name, phone, email, points_balance")
  .eq("business_id", businessId)
  .order("created_at", { ascending: false });
  return (

       <main className={styles.contenedor}>
      <div className={styles.panel}>
                <a href="/" className={styles.volver}>
          ← Volver al inicio
        </a>

        <div className={styles.encabezado}>
          <p className={styles.marca}>
            FIDELIZAPRO | PANEL DE GESTIÓN
          </p>

          <h1 className={styles.titulo}>
            Gestión de Clientes
          </h1>

          <p className={styles.descripcion}>
            Administra los clientes de tu negocio,
            consulta sus puntos y fortalece su fidelidad.
          </p>
        </div>

             <section className={styles.seccion}>
          <h2 className={styles.subtitulo}>
            Mis clientes
          </h2>

          <p className={styles.descripcion}>
            Aquí podrás registrar nuevos clientes,
            consultar su información y administrar
            sus puntos de fidelización.
          </p>

          <div className={styles.formulario}>
            <FormularioCliente />
            <div className={styles.listado}>
              <h3 style={{ color: "#14B8A6" }}>
                Clientes registrados
              </h3>

              {errorClientes ? (
                <p>No fue posible cargar los clientes.</p>
              ) : clientes && clientes.length > 0 ? (
                <div className={styles.listaClientes}>
                  {clientes.map((cliente) => (
                    <div
                      key={cliente.id}
                      className={styles.tarjeta}
                    >
                      <p>
                        <strong>Nombre:</strong> {cliente.full_name}
                      </p>

                      <p>
                        <strong>Teléfono:</strong> {cliente.phone || "No registrado"}
                      </p>

                      <p>
                        <strong>Correo:</strong> {cliente.email || "No registrado"}
                      </p>

                      <p>
                        <strong>Puntos:</strong> {cliente.points_balance ?? 0}
                      </p>

                      <a
                        href={`/clientes/${cliente.id}/puntos`}
                        className={styles.botonPuntos}
                      >
                        Gestionar puntos
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Todavía no hay clientes registrados.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
