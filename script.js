/* ============================================================
   MESAS DULCES · CATERING GIL & ROMÁN
   JavaScript principal
   Archivo: script.js

   Adaptado al index.html y style.css actuales:
   - Cabecera .site-header
   - Botón #menuToggle y navegación #mainNavigation
   - Catálogo de mesas dulces
   - Sección de animación infantil
   - Enlaces directos a WhatsApp
   - Año automático en el pie de página

   No necesita librerías externas.
   ============================================================ */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================================
     1. CONFIGURACIÓN
     ========================================================== */

  const CONFIG = {
    whatsapp: "34643213578",
    nombreContacto: "Vanesa",
    selectorCabecera: ".site-header",
    selectorBotonMenu: "#menuToggle",
    selectorMenu: "#mainNavigation",
    selectorAnio: "#currentYear",
    anchoEscritorio: 850
  };

  const reducirMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const cabecera = document.querySelector(CONFIG.selectorCabecera);
  const botonMenu = document.querySelector(CONFIG.selectorBotonMenu);
  const menu = document.querySelector(CONFIG.selectorMenu);

  const seleccionarTodos = (selector, contexto = document) =>
    Array.from(contexto.querySelectorAll(selector));


  /* ==========================================================
     2. AÑO AUTOMÁTICO DEL PIE DE PÁGINA
     ========================================================== */

  const anioActual = String(new Date().getFullYear());

  seleccionarTodos(
    "#currentYear, [data-current-year], .current-year"
  ).forEach((elemento) => {
    elemento.textContent = anioActual;
  });


  /* ==========================================================
     3. MENÚ DE NAVEGACIÓN RESPONSIVE
     ========================================================== */

  function actualizarEstadoMenu() {
    if (!menu || !botonMenu) return;

    const esMovil = window.innerWidth <= CONFIG.anchoEscritorio;
    const estaAbierto = menu.classList.contains("is-open");

    if (esMovil) {
      menu.setAttribute("aria-hidden", String(!estaAbierto));
    } else {
      // En escritorio el menú permanece visible.
      menu.setAttribute("aria-hidden", "false");
    }
  }

  function abrirMenu() {
    if (!menu || !botonMenu) return;

    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");

    botonMenu.setAttribute("aria-expanded", "true");
    botonMenu.setAttribute(
      "aria-label",
      "Cerrar menú de navegación"
    );

    document.body.classList.add("menu-open");
  }

  function cerrarMenu({ devolverFoco = false } = {}) {
    if (menu) {
      menu.classList.remove("is-open");
    }

    if (botonMenu) {
      botonMenu.setAttribute("aria-expanded", "false");
      botonMenu.setAttribute(
        "aria-label",
        "Abrir menú de navegación"
      );

      if (devolverFoco) {
        botonMenu.focus();
      }
    }

    document.body.classList.remove("menu-open");

    actualizarEstadoMenu();
  }

  function alternarMenu() {
    if (!menu || !botonMenu) return;

    const abierto = menu.classList.contains("is-open");

    if (abierto) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  }

  if (botonMenu && menu) {

    botonMenu.setAttribute("aria-controls", "mainNavigation");
    botonMenu.setAttribute("aria-expanded", "false");

    actualizarEstadoMenu();

    botonMenu.addEventListener("click", alternarMenu);

    // Cerrar al seleccionar un enlace del menú.
    seleccionarTodos("a", menu).forEach((enlace) => {
      enlace.addEventListener("click", () => {
        cerrarMenu();
      });
    });

    // Cerrar al hacer clic fuera del menú y del botón.
    document.addEventListener("click", (evento) => {
      if (!menu.classList.contains("is-open")) return;

      const clicDentroMenu = menu.contains(evento.target);
      const clicEnBoton = botonMenu.contains(evento.target);

      if (!clicDentroMenu && !clicEnBoton) {
        cerrarMenu();
      }
    });

    // Cerrar con Escape y devolver el foco al botón.
    document.addEventListener("keydown", (evento) => {
      if (
        evento.key === "Escape" &&
        menu.classList.contains("is-open")
      ) {
        cerrarMenu({ devolverFoco: true });
      }
    });

    // Adaptar el menú al cambiar el tamaño de la ventana.
    window.addEventListener("resize", () => {
      if (window.innerWidth > CONFIG.anchoEscritorio) {
        cerrarMenu();
      } else {
        actualizarEstadoMenu();
      }
    });
  }


  /* ==========================================================
     4. CABECERA AL DESPLAZARSE
     ========================================================== */

  function actualizarCabecera() {
    if (!cabecera) return;

    cabecera.classList.toggle(
      "scrolled",
      window.scrollY > 40
    );
  }

  actualizarCabecera();

  window.addEventListener("scroll", actualizarCabecera, {
    passive: true
  });


  /* ==========================================================
     5. DESPLAZAMIENTO A SECCIONES
     ========================================================== */

  seleccionarTodos('a[href^="#"]').forEach((enlace) => {

    enlace.addEventListener("click", (evento) => {

      const href = enlace.getAttribute("href");

      if (!href || href === "#") return;

      let destino;

      try {
        destino = document.querySelector(href);
      } catch {
        // Ignorar fragmentos que no sean selectores válidos.
        return;
      }

      if (!destino) return;

      evento.preventDefault();

      cerrarMenu();

      const alturaCabecera = cabecera
        ? cabecera.getBoundingClientRect().height
        : 0;

      const posicion =
        destino.getBoundingClientRect().top +
        window.scrollY -
        alturaCabecera -
        10;

      window.scrollTo({
        top: Math.max(0, posicion),
        behavior: reducirMovimiento ? "auto" : "smooth"
      });

      // Actualizar el fragmento sin provocar un segundo salto.
      if (
        window.history &&
        typeof window.history.replaceState === "function"
      ) {
        window.history.replaceState(null, "", href);
      }
    });

  });


  /* ==========================================================
     6. ENLACES DE WHATSAPP
     ========================================================== */

  // Conservamos los mensajes personalizados que ya están
  // definidos en el HTML para cada mesa y servicio.

  const enlacesWhatsApp = seleccionarTodos(
    'a[href*="wa.me/"], a[href*="api.whatsapp.com/"]'
  );

  enlacesWhatsApp.forEach((enlace) => {

    // Añadir protección a los enlaces que abren otra pestaña.
    if (enlace.target === "_blank") {

      const relActual = new Set(
        (enlace.getAttribute("rel") || "")
          .split(/\s+/)
          .filter(Boolean)
      );

      relActual.add("noopener");
      relActual.add("noreferrer");

      enlace.setAttribute(
        "rel",
        Array.from(relActual).join(" ")
      );
    }

  });


  /* ==========================================================
     7. CARGA Y COMPROBACIÓN DE IMÁGENES
     ========================================================== */

  seleccionarTodos("img").forEach((imagen) => {

    // Evitar la carga diferida en imágenes de la zona principal.
    const estaEnZonaPrincipal = imagen.closest(
      ".hero, .hero-background"
    );

    if (
      !estaEnZonaPrincipal &&
      !imagen.hasAttribute("loading")
    ) {
      imagen.loading = "lazy";
    }

    // Mejorar la carga de imágenes cuando el navegador lo admite.
    if (!imagen.hasAttribute("decoding")) {
      imagen.decoding = "async";
    }

    // Avisar en la consola si alguna imagen no se encuentra.
    imagen.addEventListener("error", () => {

      imagen.classList.add("imagen-no-disponible");

      console.warn(
        "[Mesas Dulces] No se pudo cargar la imagen:",
        imagen.getAttribute("src")
      );

    });

  });


  /* ==========================================================
     8. PREGUNTAS FRECUENTES
     ========================================================== */

  // Los elementos <details> funcionan de forma nativa.
  // Si se utiliza data-acordeon-unico, solo una pregunta del
  // mismo contenedor permanecerá abierta.

  seleccionarTodos("details[data-acordeon-unico]").forEach(
    (detalle) => {

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

    }
  );


  /* ==========================================================
     9. FECHAS DE FORMULARIOS
     ========================================================== */

  // Si se añade un campo de fecha en el futuro, impedir que
  // se pueda seleccionar una fecha anterior al día actual.

  seleccionarTodos('input[type="date"]').forEach((campoFecha) => {

    const hoy = new Date();

    const anio = hoy.getFullYear();

    const mes = String(hoy.getMonth() + 1).padStart(2, "0");

    const dia = String(hoy.getDate()).padStart(2, "0");

    const fechaHoy = `${anio}-${mes}-${dia}`;

    campoFecha.min = fechaHoy;

  });


  /* ==========================================================
     10. COMPROBACIÓN FINAL
     ========================================================== */

  console.info(
    "Mesas Dulces: JavaScript inicializado correctamente.",
    {
      menuDisponible: Boolean(menu && botonMenu),
      enlacesWhatsApp: enlacesWhatsApp.length,
      contacto: CONFIG.nombreContacto,
      telefonoWhatsApp: CONFIG.whatsapp
    }
  );

});