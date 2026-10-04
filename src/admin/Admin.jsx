import { useState } from "react";
import {
  supabase,
  supabaseConfigurado,
} from "../lib/supabase";
import "./Admin.css";

function Admin() {
  const [email, setEmail] = useState("magicstorehyo@gmail.com");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [usuario, setUsuario] = useState(null);

  const iniciarSesion = async (e) => {
    e.preventDefault();

    if (!supabase) {
      setMensaje(
        "❌ Supabase todavía no está configurado correctamente."
      );
      return;
    }

    setMensaje("Conectando...");

    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        setMensaje(
          "❌ " + error.message
        );
        return;
      }

      setUsuario(data.user);
      setPassword("");
      setMensaje("");
    } catch (error) {
      console.error(error);

      setMensaje(
        "❌ Error conectando con Supabase."
      );
    }
  };

  const cerrarSesion = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setUsuario(null);
  };

  if (!supabaseConfigurado) {
    return (
      <div className="admin-prueba">
        <div className="admin-prueba-card">
          <div className="admin-gato">
            🐱🌸
          </div>

          <h1>MAGIC STORE</h1>

          <h2>
            Falta conectar Supabase
          </h2>

          <p>
            La página funciona, pero los datos de
            <strong> .env.local </strong>
            todavía no están siendo detectados.
          </p>

          <p>
            Revisa VITE_SUPABASE_URL y
            VITE_SUPABASE_ANON_KEY.
          </p>

          <a href="/">
            ← Volver a la tienda
          </a>
        </div>
      </div>
    );
  }

  if (usuario) {
    return (
      <div className="admin-prueba">
        <div className="admin-prueba-card">
          <div className="admin-gato">
            🐱🌸
          </div>

          <h1>MAGIC STORE</h1>

          <h2>
            ✅ Inicio de sesión correcto
          </h2>

          <p>
            Bienvenido:
          </p>

          <strong>
            {usuario.email}
          </strong>

          <div className="admin-opciones">
            <div>🎁 Productos</div>
            <div>📷 Fotografías</div>
            <div>✏️ Editar</div>
            <div>🛒 Pedidos</div>
          </div>

          <button
            className="cerrar-sesion"
            onClick={cerrarSesion}
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login">
      <div className="login-card">
        <div className="admin-gato">
          🐱🌸
        </div>

        <h1>MAGIC STORE</h1>

        <h2>
          Panel Administrativo
        </h2>

        <p>
          Ingresa con tu cuenta de propietario.
        </p>

        <form onSubmit={iniciarSesion}>
          <label>
            Correo electrónico
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <label>
            Contraseña
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Tu contraseña"
          />

          {mensaje && (
            <div className="login-mensaje">
              {mensaje}
            </div>
          )}

          <button type="submit">
            🔐 Iniciar sesión
          </button>
        </form>

        <a href="/">
          ← Volver a la tienda
        </a>
      </div>
    </div>
  );
}

export default Admin;