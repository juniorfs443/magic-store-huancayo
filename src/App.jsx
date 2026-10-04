import { useEffect, useState } from "react";
import "./App.css";
import logo from "./assets/logo-magic-store.jpg";
import { supabase } from "./lib/supabase";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);

  const [personalizacion, setPersonalizacion] = useState({
    para: "",
    ocasion: "",
    dedicatoria: "",
    firma: "",
    fecha: "",
    horario: "",
    direccion: "",
    observaciones: "",
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setCargando(true);

    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("disponible", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando productos:", error);
      setProductos([]);
    } else {
      setProductos(data || []);
    }

    setCargando(false);
  };

  const emojiCategoria = (categoria) => {
    if (categoria === "Amor") return "💝";
    if (categoria === "Cumpleaños") return "🎂";
    if (categoria === "Flores") return "🌷";
    if (categoria === "Aniversario") return "💕";
    if (categoria === "Sorpresas") return "🎉";
    return "🎁";
  };

  const abrirProducto = (producto) => {
    setProductoSeleccionado(producto);

    setPersonalizacion({
      para: "",
      ocasion: "",
      dedicatoria: "",
      firma: "",
      fecha: "",
      horario: "",
      direccion: "",
      observaciones: "",
    });
  };

  const agregarCarrito = () => {
    if (!productoSeleccionado) return;

    setCarrito((actual) => [
      ...actual,
      {
        ...productoSeleccionado,
        carritoId: Date.now(),
        cantidad: 1,
        personalizacion: { ...personalizacion },
      },
    ]);

    setProductoSeleccionado(null);
  };

  const eliminarCarrito = (carritoId) => {
    setCarrito((actual) =>
      actual.filter((item) => item.carritoId !== carritoId)
    );
  };

  const aumentarCantidad = (carritoId) => {
    setCarrito((actual) =>
      actual.map((item) =>
        item.carritoId === carritoId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const disminuirCantidad = (carritoId) => {
    setCarrito((actual) =>
      actual
        .map((item) =>
          item.carritoId === carritoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const total = carrito.reduce(
    (suma, item) => suma + Number(item.precio) * item.cantidad,
    0
  );

  const cantidadTotal = carrito.reduce(
    (suma, item) => suma + item.cantidad,
    0
  );

  const enviarWhatsApp = () => {
    if (carrito.length === 0) {
      alert("Primero agrega algún regalo al carrito 🐱🌸");
      return;
    }

    let mensaje = "🌸🐱 *MAGIC STORE HUANCAYO* 🐱🌸\n\n";
    mensaje += "Hola 👋 Quiero realizar el siguiente pedido:\n\n";

    carrito.forEach((item, index) => {
      mensaje += `🎁 *${index + 1}. ${item.nombre}*\n`;
      mensaje += `🔢 Cantidad: ${item.cantidad}\n`;
      mensaje += `💰 Precio: S/ ${Number(item.precio).toFixed(2)}\n`;

      if (item.personalizacion.para) {
        mensaje += `💕 Para: ${item.personalizacion.para}\n`;
      }

      if (item.personalizacion.ocasion) {
        mensaje += `🎉 Ocasión: ${item.personalizacion.ocasion}\n`;
      }

      if (item.personalizacion.dedicatoria) {
        mensaje += `💌 Dedicatoria: ${item.personalizacion.dedicatoria}\n`;
      }

      if (item.personalizacion.firma) {
        mensaje += `✍️ Firma: ${item.personalizacion.firma}\n`;
      }

      if (item.personalizacion.fecha) {
        mensaje += `📅 Fecha: ${item.personalizacion.fecha}\n`;
      }

      if (item.personalizacion.horario) {
        mensaje += `🕐 Horario: ${item.personalizacion.horario}\n`;
      }

      if (item.personalizacion.direccion) {
        mensaje += `📍 Dirección: ${item.personalizacion.direccion}\n`;
      }

      if (item.personalizacion.observaciones) {
        mensaje += `📝 Observaciones: ${item.personalizacion.observaciones}\n`;
      }

      mensaje += "\n";
    });

    mensaje += `💖 *TOTAL: S/ ${total.toFixed(2)}*\n\n`;
    mensaje += "Quisiera confirmar disponibilidad y coordinar la entrega. 🌷";

    const telefono = "51929670208";

    window.open(
      `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  return (
    <div className="pagina">
      <header className="navbar">
        <a href="#inicio" className="marca">
          <img src={logo} alt="Magic Store Huancayo" />

          <div className="marca-texto">
            <strong>MAGIC STORE</strong>
            <span>Regalos & Flores 🌸</span>
          </div>
        </a>

        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#productos">Catálogo</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <a href="#carrito" className="carrito-nav">
          🛒
          <span>{cantidadTotal}</span>
        </a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="decoracion decoracion-1">🌸</div>
          <div className="decoracion decoracion-2">🌺</div>
          <div className="decoracion decoracion-3">🌼</div>

          <div className="hero-contenido">
            <div className="etiqueta">
              🐾 Detalles preparados con mucho amor
            </div>

            <h1>
              Regalos que hacen
              <span> sonreír el corazón</span>
            </h1>

            <p>
              Sorprende a esa persona especial con regalos, flores y detalles
              personalizados preparados especialmente para cada ocasión.
            </p>

            <div className="hero-botones">
              <a href="#productos" className="boton-principal">
                🎁 Ver catálogo
              </a>

              <a
                href="https://wa.me/51929670208"
                target="_blank"
                rel="noreferrer"
                className="boton-whatsapp"
              >
                💬 WhatsApp
              </a>
            </div>

            <div className="beneficios">
              <span>🌷 Regalos personalizados</span>
              <span>💌 Tarjetas con dedicatoria</span>
              <span>🎀 Preparados con cariño</span>
            </div>
          </div>

          <div className="hero-derecha">
            <div className="circulo-logo">
              <img src={logo} alt="Magic Store" />
            </div>

            <div className="mensaje-gato">
              <span className="gato">🐱</span>

              <div>
                <strong>¡Hola! 🌸</strong>
                <p>Encuentra aquí el regalo perfecto.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="categorias">
          <a href="#productos">
            <span>🎂</span>
            <strong>Cumpleaños</strong>
            <small>Detalles especiales</small>
          </a>

          <a href="#productos">
            <span>💖</span>
            <strong>Amor</strong>
            <small>Para alguien especial</small>
          </a>

          <a href="#productos">
            <span>🌷</span>
            <strong>Flores</strong>
            <small>Regala emociones</small>
          </a>

          <a href="#productos">
            <span>🎁</span>
            <strong>Sorpresas</strong>
            <small>Momentos inolvidables</small>
          </a>
        </section>

        <section className="productos" id="productos">
          <div className="titulo-seccion">
            <span>🌸 NUESTRO CATÁLOGO 🌸</span>
            <h2>Detalles para cada momento</h2>

            <p>
              Escoge tu regalo favorito y personalízalo con una dedicatoria
              especial.
            </p>

            <div className="patitas">🐾　🐾　🐾</div>
          </div>

          {cargando ? (
            <div className="cargando-productos">
              🐱🌸
              <p>Cargando nuestras creaciones...</p>
            </div>
          ) : productos.length === 0 ? (
            <div className="sin-catalogo">
              <div>🐱🎁</div>
              <h3>Pronto tendremos nuevas creaciones</h3>
              <p>Agrega tus productos desde el panel administrador.</p>
            </div>
          ) : (
            <div className="grid-productos">
              {productos.map((producto) => (
                <article className="producto" key={producto.id}>
                  <div className="producto-imagen">
                    <img
                      src={producto.imagenes?.[0] || logo}
                      alt={producto.nombre}
                    />

                    <span className="categoria">
                      {emojiCategoria(producto.categoria)} {producto.categoria}
                    </span>

                    <span className="patita-producto">🐾</span>
                  </div>

                  <div className="producto-contenido">
                    <h3>{producto.nombre}</h3>

                    <p>{producto.descripcion}</p>

                    <div className="precio">
                      S/ {Number(producto.precio).toFixed(2)}
                    </div>

                    <button onClick={() => abrirProducto(producto)}>
                      💕 Ver detalle y personalizar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="nosotros" id="nosotros">
          <div className="nosotros-imagen">
            <div className="gato-grande">🐱</div>
            <div className="flores-gato">🌸 🌷 🌸</div>
          </div>

          <div className="nosotros-texto">
            <span>MAGIC STORE HUANCAYO</span>

            <h2>Detalles que hablan por ti 💕</h2>

            <p>
              Personaliza tu regalo, escribe tu dedicatoria y nosotros te
              ayudamos a preparar una sorpresa inolvidable.
            </p>

            <div className="ventajas">
              <div>🌸 <strong>Diseños especiales</strong></div>
              <div>💌 <strong>Tarjetas personalizadas</strong></div>
              <div>🎁 <strong>Regalos para toda ocasión</strong></div>
              <div>💬 <strong>Pedidos por WhatsApp</strong></div>
            </div>
          </div>
        </section>

        <section className="carrito-seccion" id="carrito">
          <div className="titulo-seccion">
            <span>🐱 TU PEDIDO 🐱</span>
            <h2>Mi carrito mágico</h2>
          </div>

          {carrito.length === 0 ? (
            <div className="carrito-vacio">
              <div className="gato-vacio">🐱</div>

              <h3>Tu carrito está esperando regalos</h3>
              <p>Agrega algún detalle para comenzar tu pedido.</p>

              <a href="#productos">🌷 Explorar catálogo</a>
            </div>
          ) : (
            <div className="contenido-carrito">
              {carrito.map((item) => (
                <div className="item-carrito" key={item.carritoId}>
                  <img
                    src={item.imagenes?.[0] || logo}
                    alt={item.nombre}
                  />

                  <div className="item-carrito-info">
                    <h3>{item.nombre}</h3>

                    <strong>
                      S/ {Number(item.precio).toFixed(2)}
                    </strong>

                    {item.personalizacion.para && (
                      <p>💕 Para: {item.personalizacion.para}</p>
                    )}

                    {item.personalizacion.dedicatoria && (
                      <p>💌 "{item.personalizacion.dedicatoria}"</p>
                    )}

                    <div className="cantidad">
                      <button
                        onClick={() => disminuirCantidad(item.carritoId)}
                      >
                        −
                      </button>

                      <span>{item.cantidad}</span>

                      <button
                        onClick={() => aumentarCantidad(item.carritoId)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    className="eliminar"
                    onClick={() => eliminarCarrito(item.carritoId)}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <div className="resumen-carrito">
                <span>Total</span>
                <strong>S/ {total.toFixed(2)}</strong>
              </div>

              <button
                className="pedido-whatsapp"
                onClick={enviarWhatsApp}
              >
                💬 Realizar pedido por WhatsApp
              </button>
            </div>
          )}
        </section>

        <section className="contacto" id="contacto">
          <div className="contacto-contenido">
            <span className="gato-contacto">🐱🌸</span>

            <h2>¿Tienes una idea especial?</h2>

            <p>
              Escríbenos y cuéntanos cómo quieres personalizar tu regalo.
            </p>

            <a
              href="https://wa.me/51929670208"
              target="_blank"
              rel="noreferrer"
            >
              💬 Hablar con Magic Store
            </a>

            <strong>📱 929 670 208</strong>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-marca">
          <img src={logo} alt="Magic Store" />

          <div>
            <h3>MAGIC STORE HUANCAYO</h3>
            <p>Regalos y Flores 🌸</p>
          </div>
        </div>

        <p>🐾 Regalos preparados con mucho cariño.</p>
        <p>📱 929 670 208</p>

        <a className="admin-link" href="/admin">
          🔐 Administración
        </a>

        <small>© 2026 Magic Store Huancayo</small>
      </footer>

      {productoSeleccionado && (
        <div className="modal-fondo">
          <div className="modal">
            <button
              className="cerrar-modal"
              onClick={() => setProductoSeleccionado(null)}
            >
              ✕
            </button>

            <div className="modal-imagen">
              <img
                src={productoSeleccionado.imagenes?.[0] || logo}
                alt={productoSeleccionado.nombre}
              />

              <div className="modal-gatito">🐱🌸</div>
            </div>

            <span className="modal-categoria">
              {emojiCategoria(productoSeleccionado.categoria)}{" "}
              {productoSeleccionado.categoria}
            </span>

            <h2>{productoSeleccionado.nombre}</h2>

            <div className="modal-precio">
              S/ {Number(productoSeleccionado.precio).toFixed(2)}
            </div>

            <p>{productoSeleccionado.descripcion}</p>

            <div className="incluye">
              <strong>🎁 Este detalle incluye:</strong>

              <ul>
                {(productoSeleccionado.incluye || []).map(
                  (elemento, index) => (
                    <li key={index}>{elemento}</li>
                  )
                )}
              </ul>
            </div>

            {productoSeleccionado.imagenes?.length > 1 && (
              <div className="galeria-modal">
                {productoSeleccionado.imagenes.map((imagen, index) => (
                  <img
                    key={index}
                    src={imagen}
                    alt={`${productoSeleccionado.nombre} ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="separador">
              🌸　🐾　🌸　🐾　🌸
            </div>

            <h3>💌 Personaliza tu regalo</h3>

            <label>💕 ¿Para quién es?</label>

            <input
              type="text"
              value={personalizacion.para}
              onChange={(e) =>
                setPersonalizacion({
                  ...personalizacion,
                  para: e.target.value,
                })
              }
            />

            <label>🎉 Ocasión</label>

            <select
              value={personalizacion.ocasion}
              onChange={(e) =>
                setPersonalizacion({
                  ...personalizacion,
                  ocasion: e.target.value,
                })
              }
            >
              <option value="">Seleccionar</option>
              <option>Cumpleaños</option>
              <option>Aniversario</option>
              <option>Amor</option>
              <option>Amistad</option>
              <option>Graduación</option>
              <option>Otro</option>
            </select>

            <label>💌 Dedicatoria para la tarjeta</label>

            <textarea
              maxLength="300"
              value={personalizacion.dedicatoria}
              onChange={(e) =>
                setPersonalizacion({
                  ...personalizacion,
                  dedicatoria: e.target.value,
                })
              }
            />

            <div className="contador">
              {personalizacion.dedicatoria.length}/300 caracteres
            </div>

            <label>✍️ ¿Quién envía el regalo?</label>

            <input
              type="text"
              value={personalizacion.firma}
              onChange={(e) =>
                setPersonalizacion({
                  ...personalizacion,
                  firma: e.target.value,
                })
              }
            />

            <div className="fila-formulario">
              <div>
                <label>📅 Fecha de entrega</label>

                <input
                  type="date"
                  value={personalizacion.fecha}
                  onChange={(e) =>
                    setPersonalizacion({
                      ...personalizacion,
                      fecha: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label>🕐 Horario</label>

                <select
                  value={personalizacion.horario}
                  onChange={(e) =>
                    setPersonalizacion({
                      ...personalizacion,
                      horario: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccionar</option>
                  <option>9:00 a.m. - 12:00 p.m.</option>
                  <option>12:00 p.m. - 3:00 p.m.</option>
                  <option>3:00 p.m. - 6:00 p.m.</option>
                  <option>6:00 p.m. - 9:00 p.m.</option>
                  <option>A coordinar</option>
                </select>
              </div>
            </div>

            <label>📍 Dirección de entrega</label>

            <input
              type="text"
              value={personalizacion.direccion}
              onChange={(e) =>
                setPersonalizacion({
                  ...personalizacion,
                  direccion: e.target.value,
                })
              }
            />

            <label>📝 Observaciones</label>

            <textarea
              value={personalizacion.observaciones}
              onChange={(e) =>
                setPersonalizacion({
                  ...personalizacion,
                  observaciones: e.target.value,
                })
              }
            />

            <button
              className="agregar-carrito"
              onClick={agregarCarrito}
            >
              🛒 Agregar al carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;