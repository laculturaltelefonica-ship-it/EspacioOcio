
/* ============================================================
   MESAS DULCES — JAVASCRIPT PRINCIPAL
   Archivo: script.js

   Compatible con:
   - index.html
   - style.css
   - images/

   Contacto directo: Vanesa
   WhatsApp: +34 643 213 578

   No necesita librerías externas.
   ============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================
     1. CONFIGURACIÓN GENERAL
     ========================================================== */

  const CONFIG = {
    nombreNegocio: "Mesas Dulces",
    nombreContacto: "Vanesa",
    whatsapp: "34643213578",
    rutaImagenes: "images/",
    selectorNavbar: ".navbar",
    selectorMenu: "#navMenu",
    selectorBotonMenu: "#menuToggle",
    selectorAnio: "#currentYear"
  };

  const WHATSAPP_URL = "https://wa.me/" + CONFIG.whatsapp;

  const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const normalizarTexto = (texto) =>
    String(texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const seleccionar = (selector, contexto = document) =>
    contexto.querySelector(selector);

  const seleccionarTodos = (selector, contexto = document) =>
    Array.from(contexto.querySelectorAll(selector));

  /* ==========================================================
     2. AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
     ========================================================== */

  const actualizarAnio = () => {
    seleccionarTodos(
      "#currentYear, [data-current-year], .current-year"
    ).forEach((elemento) => {
      elemento.textContent = new Date().getFullYear();
    });
  };

  actualizarAnio();

  /* ==========================================================
     3. UTILIDADES DE WHATSAPP
     ========================================================== */

  /**
   * Abre WhatsApp con un mensaje previamente preparado.
   * El usuario deberá pulsar Enviar dentro de WhatsApp.
   */

  function abrirWhatsApp(mensaje) {
    const texto = String(mensaje || "").trim();

    const url = WHATSAPP_URL + "?text=" + encodeURIComponent(
      texto ||
      "Hola Vanesa, quiero información para contratar una mesa dulce."
    );

    window.open(url, "_blank", "noopener,noreferrer");
  }

  function crearMensajeContacto(datos = {}) {
    const nombre = datos.nombre || "";
    const tipo = datos.tipo || "";
    const mesa = datos.mesa || "";
    const precio = datos.precio || "";
    const fecha = datos.fecha || "";
    const invitados = datos.invitados || "";
    const lugar = datos.lugar || "";
    const presupuesto = datos.presupuesto || "";
    const detalles = datos.detalles || "";

    let mensaje = "¡Hola Vanesa! 😊\n\n";
    mensaje += "Me gustaría solicitar información para ";
    mensaje += "contratar una mesa dulce.\n\n";

    if (nombre) {
      mensaje += "Nombre: " + nombre + "\n";
    }

    if (tipo) {
      mensaje += "Celebración: " + tipo + "\n";
    }

    if (mesa) {
      mensaje += "Mesa o catálogo elegido: " + mesa + "\n";
    }

    if (precio) {
      mensaje += "Precio orientativo anunciado: " + precio + "\n";
    }

    if (fecha) {
      mensaje += "Fecha del evento: " + fecha + "\n";
    }

    if (invitados) {
      mensaje += "Número de invitados: " + invitados + "\n";
    }

    if (lugar) {
      mensaje += "Lugar del evento: " + lugar + "\n";
    }

    if (presupuesto) {
      mensaje += "Presupuesto aproximado: " + presupuesto + "\n";
    }

    if (detalles) {
      mensaje += "Detalles adicionales: " + detalles + "\n";
    }

    mensaje += "\n¿Podrías indicarme disponibilidad, ";
    mensaje += "condiciones de contratación y presupuesto final?";

    return mensaje;
  }

  /* ==========================================================
     4. BARRA DE NAVEGACIÓN Y MENÚ MÓVIL
     ========================================================== */

  const navbar = seleccionar(CONFIG.selectorNavbar);

  const menu = seleccionar(CONFIG.selectorMenu);

  const botonMenu = seleccionar(CONFIG.selectorBotonMenu);

  function cerrarMenu() {
    if (menu) {
      menu.classList.remove("active");
      menu.classList.remove("open");
      menu.classList.remove("is-open");

      menu.removeAttribute("data-open");

      menu.setAttribute("aria-hidden", "true");
    }

    if (botonMenu) {
      botonMenu.classList.remove("active");
      botonMenu.classList.remove("open");

      botonMenu.setAttribute("aria-expanded", "false");
    }

    document.body.classList.remove("menu-open");
  }

  function alternarMenu() {
    if (!menu || !botonMenu) return;

    const estaAbierto =
      menu.classList.contains("active") ||
      menu.classList.contains("open") ||
      menu.classList.contains("is-open");

    if (estaAbierto) {
      cerrarMenu();
      return;
    }

    menu.classList.add("active");
    menu.setAttribute("aria-hidden", "false");

    botonMenu.classList.add("active");
    botonMenu.setAttribute("aria-expanded", "true");

    document.body.classList.add("menu-open");
  }

  if (botonMenu && menu) {
    botonMenu.addEventListener("click", alternarMenu);
  }

  // También admite enlaces de menú con otras clases habituales.
  seleccionarTodos(
    "#navMenu a, .nav-menu a, .navbar-menu a, .menu a"
  ).forEach((enlace) => {
    enlace.addEventListener("click", () => {
      cerrarMenu();
    });
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      cerrarMenu();
      cerrarVisor();
    }
  });

  // Cierra el menú cuando se cambia a una pantalla de escritorio.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      cerrarMenu();
    }
  });

  /* ==========================================================
     5. NAVBAR AL HACER SCROLL
     ========================================================== */

  function actualizarNavbar() {
    if (!navbar) return;

    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }

  actualizarNavbar();

  window.addEventListener(
    "scroll",
    actualizarNavbar,
    { passive: true }
  );

  /* ==========================================================
     6. DESPLAZAMIENTO SUAVE ENTRE SECCIONES
     ========================================================== */

  seleccionarTodos('a[href^="#"]').forEach((enlace) => {
    enlace.addEventListener("click", (evento) => {
      const destinoId = enlace.getAttribute("href");

      if (!destinoId || destinoId === "#") return;

      let destino;

      try {
        destino = document.querySelector(destinoId);
      } catch {
        return;
      }

      if (!destino) return;

      evento.preventDefault();

      cerrarMenu();

      const alturaNavbar = navbar
        ? navbar.getBoundingClientRect().height
        : 0;

      const posicion =
        destino.getBoundingClientRect().top +
        window.scrollY -
        alturaNavbar -
        12;

      window.scrollTo({
        top: Math.max(0, posicion),
        behavior: reducirMovimiento ? "auto" : "smooth"
      });

      // Actualiza el fragmento de URL sin provocar otro salto.
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", destinoId);
      }
    });
  });

  /* ==========================================================
     7. ANIMACIONES DE ENTRADA
     ========================================================== */

  const elementosAnimados = seleccionarTodos(
    ".reveal, .service-card, .price-card, " +
    ".mesa-card, .gallery-item, .highlight-card, " +
    ".about-card, .faq-item, .contact-card"
  );

  if ("IntersectionObserver" in window && !reducirMovimiento) {
    const observadorAnimaciones = new IntersectionObserver(
      (entradas, observador) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;

          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    elementosAnimados.forEach((elemento) => {
      elemento.classList.add("reveal");
      observadorAnimaciones.observe(elemento);
    });
  } else {
    elementosAnimados.forEach((elemento) => {
      elemento.classList.add("visible");
    });
  }

  /* ==========================================================
     8. CATÁLOGO DE MESAS DULCES Y FILTROS
     ========================================================== */

  /**
   * Admite tarjetas con clases como:
   * .mesa-card
   * .catalogo-card
   * .package-card
   *
   * Para filtrar, los botones pueden llevar:
   * data-filter="cumpleanos"
   *
   * Y las tarjetas:
   * data-category="cumpleanos infantil"
   *
   * También admite:
   * data-categoria="bodas"
   */

  const tarjetasCatalogo = seleccionarTodos(
    ".mesa-card, .catalogo-card, .package-card, " +
    "[data-mesa-card]"
  );

  const botonesFiltro = seleccionarTodos(
    "[data-filter], [data-filtro]"
  );

  function filtrarCatalogo(categoria) {
    const categoriaNormalizada = normalizarTexto(categoria);

    tarjetasCatalogo.forEach((tarjeta) => {
      const categorias = normalizarTexto(
        tarjeta.dataset.category ||
        tarjeta.dataset.categoria ||
        tarjeta.dataset.tipo ||
        "todos"
      );

      const mostrar =
        !categoriaNormalizada ||
        categoriaNormalizada === "todos" ||
        categoriaNormalizada === "*" ||
        categorias === "todos" ||
        categorias
          .split(/[\s,;|]+/)
          .includes(categoriaNormalizada);

      tarjeta.hidden = !mostrar;

      tarjeta.setAttribute(
        "aria-hidden",
        mostrar ? "false" : "true"
      );
    });
  }

  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      const categoria =
        boton.dataset.filter ||
        boton.dataset.filtro ||
        "todos";

      filtrarCatalogo(categoria);

      botonesFiltro.forEach((otroBoton) => {
        const activo = otroBoton === boton;

        otroBoton.classList.toggle("active", activo);
        otroBoton.classList.toggle("is-active", activo);

        otroBoton.setAttribute(
          "aria-pressed",
          activo ? "true" : "false"
        );
      });
    });
  });

  /* ==========================================================
     9. BOTONES PARA CONTRATAR UNA MESA CON WHATSAPP
     ========================================================== */

  /**
   * Cada botón puede incluir estos atributos opcionales:
   *
   * data-whatsapp
   * data-mesa="Mesa elegante morada"
   * data-precio="Consultar"
   * data-tipo="Boda"
   *
   * Si están dentro de una tarjeta, también se intenta
   * obtener automáticamente su título y precio.
   */

  document.addEventListener("click", (evento) => {
    const boton = evento.target.closest(
      "[data-whatsapp], [data-contratar], " +
      ".btn-whatsapp, .btn-contratar, " +
      ".solicitar-presupuesto, .btn-presupuesto"
    );

    if (!boton) return;

    // No intercepta botones destinados a otros servicios.
    if (
      boton.tagName === "A" &&
      boton.getAttribute("href") &&
      boton.getAttribute("href").startsWith("tel:")
    ) {
      return;
    }

    const tarjeta = boton.closest(
      ".mesa-card, .catalogo-card, .package-card, " +
      ".service-card, .price-card, [data-mesa-card]"
    );

    const tituloTarjeta = tarjeta
      ? seleccionar(
          "h2, h3, h4, .card-title, .mesa-title, " +
          ".package-title, [data-mesa-nombre]",
          tarjeta
        )
      : null;

    const precioTarjeta = tarjeta
      ? seleccionar(
          ".price, .precio, .card-price, " +
          ".mesa-price, [data-precio]",
          tarjeta
        )
      : null;

    const mesa =
      boton.dataset.mesa ||
      boton.dataset.nombre ||
      (tituloTarjeta ? tituloTarjeta.textContent.trim() : "") ||
      "Mesa dulce personalizada";

    const precio =
      boton.dataset.precio ||
      (precioTarjeta ? precioTarjeta.textContent.trim() : "");

    const tipo =
      boton.dataset.tipo ||
      (tarjeta
        ? tarjeta.dataset.category || tarjeta.dataset.categoria || ""
        : "");

    const mensaje = crearMensajeContacto({
      mesa,
      precio,
      tipo
    });

    evento.preventDefault();
    abrirWhatsApp(mensaje);
  });

  /* ==========================================================
     10. BOTONES GENERALES DE CONTACTO
     ========================================================== */

  /**
   * Para botones de contacto general se puede usar:
   *
   * data-contacto-whatsapp
   *
   * Los enlaces directos a wa.me ya existentes en el HTML
   * se conservan sin interferir con su funcionamiento.
   */

  seleccionarTodos("[data-contacto-whatsapp]").forEach((boton) => {
    boton.addEventListener("click", (evento) => {
      evento.preventDefault();

      abrirWhatsApp(
        "Hola Vanesa, me gustaría recibir información sobre " +
        "las mesas dulces disponibles y solicitar presupuesto."
      );
    });
  });

  /* ==========================================================
     11. FORMULARIO DE SOLICITUD DE PRESUPUESTO
     ========================================================== */

  /**
   * Formulario recomendado:
   *
   * <form id="formPresupuesto">
   *
   * Campos reconocidos por name o id:
   * nombre, email, telefono, tipo, fecha, invitados,
   * lugar, presupuesto y detalles.
   *
   * El formulario prepara un mensaje para WhatsApp.
   * No envía correos ni almacena datos en un servidor.
   */

  const formulario = seleccionar(
    "#formPresupuesto, #formContacto, #contactForm, " +
    "form[data-whatsapp-form]"
  );

  if (formulario) {
    formulario.addEventListener("submit", (evento) => {
      evento.preventDefault();

      if (!formulario.reportValidity()) return;

      const obtenerValor = (...selectores) => {
        for (const selector of selectores) {
          const campo = seleccionar(selector, formulario);

          if (campo && typeof campo.value === "string") {
            return campo.value.trim();
          }
        }

        return "";
      };

      const nombre = obtenerValor(
        '[name="nombre"]',
        "#nombre",
        '[name="name"]'
      );

      const email = obtenerValor(
        '[name="email"]',
        "#email",
        '[name="correo"]'
      );

      const telefono = obtenerValor(
        '[name="telefono"]',
        "#telefono",
        '[name="phone"]'
      );

      const tipo = obtenerValor(
        '[name="tipo"]',
        "#tipoEvento",
        "#tipo",
        '[name="celebracion"]',
        '[name="evento"]'
      );

      const fecha = obtenerValor(
        '[name="fecha"]',
        "#fechaEvento",
        "#fecha",
        '[name="fechaEvento"]'
      );

      const invitados = obtenerValor(
        '[name="invitados"]',
        "#invitados",
        '[name="personas"]',
        "#personas"
      );

      const lugar = obtenerValor(
        '[name="lugar"]',
        "#lugar",
        '[name="ubicacion"]',
        "#ubicacion"
      );

      const presupuesto = obtenerValor(
        '[name="presupuesto"]',
        "#presupuesto"
      );

      const detalles = obtenerValor(
        '[name="detalles"]',
        "#detalles",
        '[name="mensaje"]',
        "#mensaje",
        '[name="comentarios"]'
      );

      let mensaje = crearMensajeContacto({
        nombre,
        tipo,
        fecha,
        invitados,
        lugar,
        presupuesto,
        detalles
      });

      if (telefono) {
        mensaje += "\nTeléfono de contacto: " + telefono;
      }

      if (email) {
        mensaje += "\nCorreo electrónico: " + email;
      }

      abrirWhatsApp(mensaje);
    });
  }

  /* ==========================================================
     12. GALERÍA DE IMÁGENES CON AMPLIACIÓN
     ========================================================== */

  /**
   * Permite ampliar las imágenes de la galería.
   *
   * Funciona con:
   * .gallery-item img
   * .galeria img
   * .gallery img
   * [data-lightbox]
   *
   * También reconoce el visor:
   * #visorImagen
   * #imagenGrande
   */

  let visor = seleccionar("#visorImagen");
  let imagenAmpliada = seleccionar("#imagenGrande", visor || document);

  let visorCreadoPorScript = false;

  function prepararVisor() {
    if (visor && imagenAmpliada) return;

    visor = document.createElement("div");
    visor.id = "visorImagen";
    visor.className = "visor-imagen";
    visor.setAttribute("role", "dialog");
    visor.setAttribute("aria-modal", "true");
    visor.setAttribute("aria-label", "Imagen ampliada");
    visor.setAttribute("aria-hidden", "true");

    const cerrar = document.createElement("button");
    cerrar.type = "button";
    cerrar.className = "cerrar-visor";
    cerrar.setAttribute("aria-label", "Cerrar imagen ampliada");
    cerrar.textContent = "×";

    imagenAmpliada = document.createElement("img");
    imagenAmpliada.id = "imagenGrande";
    imagenAmpliada.alt = "";

    visor.append(cerrar, imagenAmpliada);
    document.body.appendChild(visor);

    cerrar.addEventListener("click", cerrarVisor);

    visor.addEventListener("click", (evento) => {
      if (evento.target === visor) {
        cerrarVisor();
      }
    });

    visorCreadoPorScript = true;
  }

  function abrirVisor(imagen) {
    if (!imagen || !imagen.src) return;

    prepararVisor();

    imagenAmpliada.src = imagen.currentSrc || imagen.src;
    imagenAmpliada.alt = imagen.alt || "Mesa dulce ampliada";

    visor.classList.add("active", "visible");
    visor.setAttribute("aria-hidden", "false");

    document.body.classList.add("visor-abierto");

    const botonCerrar = seleccionar(".cerrar-visor", visor);

    if (botonCerrar) {
      botonCerrar.focus();
    }
  }

  function cerrarVisor() {
    if (!visor) return;

    visor.classList.remove("active", "visible");
    visor.setAttribute("aria-hidden", "true");

    document.body.classList.remove("visor-abierto");

    if (imagenAmpliada) {
      imagenAmpliada.removeAttribute("src");
    }
  }

  document.addEventListener("click", (evento) => {
    const imagen = evento.target.closest(
      ".gallery-item img, .galeria img, .gallery img, " +
      "[data-lightbox]"
    );

    if (!imagen) return;

    // Evita ampliar logotipos o imágenes decorativas marcadas.
    if (imagen.dataset.lightbox === "false") return;

    // Respeta enlaces que conducen a otra página.
    const enlace = imagen.closest("a");

    if (
      enlace &&
      enlace.getAttribute("href") &&
      !enlace.getAttribute("href").startsWith("#") &&
      !enlace.getAttribute("href").startsWith("javascript:")
    ) {
      return;
    }

    evento.preventDefault();
    abrirVisor(imagen);
  });

  if (visor && !visorCreadoPorScript) {
    visor.addEventListener("click", (evento) => {
      if (evento.target === visor) {
        cerrarVisor();
      }
    });

    const botonCerrar = seleccionar(
      ".cerrar-visor, [data-cerrar-visor], .close",
      visor
    );

    if (botonCerrar) {
      botonCerrar.addEventListener("click", cerrarVisor);
    }
  }

  /* ==========================================================
     13. CARGA DIFERIDA Y CONTROL DE IMÁGENES
     ========================================================== */

  seleccionarTodos("img").forEach((imagen) => {
    if (
      !imagen.hasAttribute("loading") &&
      !imagen.closest("header, .hero, .portada")
    ) {
      imagen.loading = "lazy";
    }

    if (!imagen.hasAttribute("decoding")) {
      imagen.decoding = "async";
    }

    imagen.addEventListener("error", () => {
      imagen.classList.add("imagen-no-disponible");

      console.warn(
        "No se ha podido cargar una imagen:",
        imagen.getAttribute("src")
      );
    });
  });

  /* ==========================================================
     14. ACORDEONES Y PREGUNTAS FRECUENTES
     ========================================================== */

  /**
   * Los elementos <details> funcionan de forma nativa.
   * Este bloque añade una opción para cerrar las demás
   * preguntas al abrir una nueva dentro de la misma sección.
   *
   * Para activarlo, usa:
   * <details data-acordeon-unico>
   */

  seleccionarTodos("details[data-acordeon-unico]").forEach((detalle) => {
    detalle.addEventListener("toggle", () => {
      if (!detalle.open) return;

      const contenedor = detalle.parentElement;

      if (!contenedor) return;

      seleccionarTodos(
        "details[data-acordeon-unico]",
        contenedor
      ).forEach((otroDetalle) => {
        if (otroDetalle !== detalle) {
          otroDetalle.open = false;
        }
      });
    });
  });

  /* ==========================================================
     15. BOTÓN VOLVER ARRIBA
     ========================================================== */

  const botonArriba = seleccionar(
    "#backToTop, .back-to-top, [data-back-to-top]"
  );

  function actualizarBotonArriba() {
    if (!botonArriba) return;

    botonArriba.classList.toggle("visible", window.scrollY > 450);
    botonArriba.classList.toggle("show", window.scrollY > 450);
  }

  actualizarBotonArriba();

  window.addEventListener(
    "scroll",
    actualizarBotonArriba,
    { passive: true }
  );

  if (botonArriba) {
    botonArriba.addEventListener("click", (evento) => {
      evento.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: reducirMovimiento ? "auto" : "smooth"
      });
    });
  }

  /* ==========================================================
     16. VALIDACIÓN DE FECHA DEL EVENTO
     ========================================================== */

  const campoFecha = seleccionar(
    '#formPresupuesto [name="fecha"], ' +
    '#formPresupuesto [name="fechaEvento"], ' +
    "#formPresupuesto #fechaEvento, " +
    '#formContacto [name="fecha"], ' +
    '#contactForm [name="fecha"]'
  );

  if (campoFecha && campoFecha.type === "date") {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    const fechaHoy = `${anio}-${mes}-${dia}`;

    campoFecha.min = fechaHoy;
  }

  /* ==========================================================
     17. AÑO, ACCESIBILIDAD Y DETALLES FINALES
     ========================================================== */

  // Permite cerrar la navegación móvil al pulsar fuera.
  document.addEventListener("click", (evento) => {
    if (!menu || !botonMenu) return;

    const menuAbierto =
      menu.classList.contains("active") ||
      menu.classList.contains("open") ||
      menu.classList.contains("is-open");

    if (!menuAbierto) return;

    if (
      !menu.contains(evento.target) &&
      !botonMenu.contains(evento.target)
    ) {
      cerrarMenu();
    }
  });

  // Las imágenes que se pueden ampliar reciben una indicación
  // visual de que son interactivas.
  seleccionarTodos(
    ".gallery-item img, .galeria img, .gallery img, [data-lightbox]"
  ).forEach((imagen) => {
    if (imagen.dataset.lightbox === "false") return;

    imagen.style.cursor = "zoom-in";
  });

  // Permite activar mediante teclado el menú si se ha definido
  // como botón nativo; no se modifica su contenido HTML.
  if (botonMenu && botonMenu.tagName !== "BUTTON") {
    if (!botonMenu.hasAttribute("role")) {
      botonMenu.setAttribute("role", "button");
    }

    if (!botonMenu.hasAttribute("tabindex")) {
      botonMenu.setAttribute("tabindex", "0");
    }

    botonMenu.addEventListener("keydown", (evento) => {
      if (evento.key === "Enter" || evento.key === " ") {
        evento.preventDefault();
        alternarMenu();
      }
    });
  }

  console.info(
    "Web de mesas dulces inicializada correctamente."
  );
});
