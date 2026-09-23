/* ============================================================
   ARCHIVO: funcionalidades.js
   DESCRIPCIÓN: Comportamientos dinámicos de la landing page.
   Contiene la animación del hero, el año automático
   en el footer y el efecto de aparición al hacer scroll.
   ============================================================ */


/* ────────────────────────────────────────────────────────────
   ANIMACIÓN DE LÍNEAS CONVERGENTES — HERO
   Dibuja líneas que se mueven desde los bordes hacia el
   centro del canvas, generando un efecto de movimiento
   tecnológico en el fondo del hero.
   ──────────────────────────────────────────────────────────── */
(function () {

  /* Referencia al elemento canvas del hero (opcional si se quitó del HTML) */
  const lienzo = document.getElementById('lienzo-hero');
  if (!lienzo) {
    return;
  }
  const contexto = lienzo.getContext('2d');

  /* Color de las líneas: debe coincidir con --color-acento en estilos.css (primary v2) */
  const COLOR_ACENTO = '#FFB5A0';

  /* Cantidad de líneas que se dibujan simultáneamente */
  const CANTIDAD_LINEAS = 18;

  /* Almacena el ancho y alto actuales del canvas */
  let anchoPantalla, altoPantalla;

  /* Array que contiene la configuración de cada línea */
  let lineas;

  /* ID del frame de animación actual (para cancelarlo si hace falta) */
  let idAnimacion;


  /* ── Ajusta el tamaño del canvas al tamaño real del contenedor ── */
  function ajustarTamano() {
    anchoPantalla = lienzo.width  = lienzo.offsetWidth;
    altoPantalla  = lienzo.height = lienzo.offsetHeight;
    inicializarLineas();
  }


  /* ── Crea o reinicia el array de líneas con posiciones aleatorias ── */
  function inicializarLineas() {
    lineas = Array.from({ length: CANTIDAD_LINEAS }, function () {
      /* Ángulo de partida aleatorio (en radianes) */
      const angulo = Math.random() * Math.PI * 2;
      /* Distancia desde el centro hasta el punto de origen */
      const distancia = 0.3 + Math.random() * 0.5;

      return {
        /* Coordenada X de origen (en el borde del canvas) */
        origenX: anchoPantalla / 2 + Math.cos(angulo) * anchoPantalla * distancia,
        /* Coordenada Y de origen */
        origenY: altoPantalla  / 2 + Math.sin(angulo) * altoPantalla  * distancia,
        /* Velocidad de desplazamiento hacia el centro */
        velocidad: 0.3 + Math.random() * 0.5,
        /* Longitud visual de la estela de la línea */
        longitud: 0.1 + Math.random() * 0.5,
        /* Desfase de fase para que las líneas no estén sincronizadas */
        fase: Math.random() * Math.PI * 2
      };
    });
  }


  /* ── Dibuja un frame de la animación y solicita el siguiente ── */
  function dibujarFrame(tiempoActual) {
    /* Limpia el canvas antes de redibujar */
    contexto.clearRect(0, 0, anchoPantalla, altoPantalla);

    /* Centro del canvas (destino de todas las líneas) */
    const centroX = anchoPantalla / 2;
    const centroY = altoPantalla  / 2;

    lineas.forEach(function (linea) {
      /* Progreso de 0 a 1 basado en el tiempo y la velocidad de la línea */
      const progreso = ((tiempoActual * linea.velocidad * 0.0003 + linea.fase) % 1);

      /* Posición actual del punto inicial de la estela */
      const puntoInicioX = linea.origenX + (centroX - linea.origenX) * progreso;
      const puntoInicioY = linea.origenY + (centroY - linea.origenY) * progreso;

      /* Posición actual del punto final de la estela (ligeramente adelantado) */
      const progresoFinal = Math.min(progreso + linea.longitud * 0.3, 1);
      const puntoFinX = linea.origenX + (centroX - linea.origenX) * progresoFinal;
      const puntoFinY = linea.origenY + (centroY - linea.origenY) * progresoFinal;

      /* Transparencia: máxima en el medio del recorrido, nula en los extremos */
      const transparencia = Math.sin(progreso * Math.PI) * 0.6;

      /* Dibuja el segmento de línea */
      contexto.beginPath();
      contexto.moveTo(puntoInicioX, puntoInicioY);
      contexto.lineTo(puntoFinX, puntoFinY);
      contexto.strokeStyle = COLOR_ACENTO;
      contexto.globalAlpha = transparencia;
      contexto.lineWidth   = 0.8;
      contexto.stroke();
    });

    /* Restablece opacidad antes de dibujar el punto central */
    contexto.globalAlpha = 1;

    /* Punto circular en el centro que representa el destino de las líneas */
    contexto.beginPath();
    contexto.arc(centroX, centroY, 2.5, 0, Math.PI * 2);
    contexto.fillStyle   = COLOR_ACENTO;
    contexto.globalAlpha = 0.7;
    contexto.fill();
    contexto.globalAlpha = 1;

    /* Solicita el siguiente frame de animación */
    idAnimacion = requestAnimationFrame(dibujarFrame);
  }


  /* ── Inicialización: ajusta tamaño y arranca la animación ── */
  window.addEventListener('resize', ajustarTamano);
  ajustarTamano();
  idAnimacion = requestAnimationFrame(dibujarFrame);

})();


/* ────────────────────────────────────────────────────────────
   AÑO AUTOMÁTICO EN EL FOOTER
   Inserta el año actual en el elemento con id "anio-actual"
   para que el copyright siempre esté actualizado.
   ──────────────────────────────────────────────────────────── */
(function () {

  const elementoAnio = document.getElementById('anio-actual');

  if (elementoAnio) {
    elementoAnio.textContent = new Date().getFullYear();
  }

})();


/* ────────────────────────────────────────────────────────────
   EFECTO DE APARICIÓN AL SCROLL
   Observa los elementos con clase "aparecer". Cuando uno
   entra al viewport, se le agrega la clase "visible" que
   dispara su transición CSS de entrada.
   ──────────────────────────────────────────────────────────── */
(function () {

  const elementosAnimados = document.querySelectorAll('.aparecer');
  if (!elementosAnimados.length) {
    return;
  }

  function marcarVisible(elemento) {
    elemento.classList.add('visible');
  }

  function revelarEnViewport() {
    const altoVentana = window.innerHeight || document.documentElement.clientHeight;

    elementosAnimados.forEach(function (elemento) {
      if (elemento.classList.contains('visible')) {
        return;
      }

      const rect = elemento.getBoundingClientRect();
      const visible = rect.top < altoVentana * 0.92 && rect.bottom > altoVentana * 0.08;

      if (visible) {
        marcarVisible(elemento);
      }
    });
  }

  /* Sin observer: todo visible (CSS ya lo permite) */
  if (typeof IntersectionObserver === 'undefined') {
    elementosAnimados.forEach(marcarVisible);
    return;
  }

  document.documentElement.classList.add('js-reveal');
  revelarEnViewport();

  const observador = new IntersectionObserver(
    function (entradas, obs) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          marcarVisible(entrada.target);
          obs.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -8% 0px' }
  );

  elementosAnimados.forEach(function (elemento) {
    if (!elemento.classList.contains('visible')) {
      observador.observe(elemento);
    }
  });

  window.addEventListener('load', revelarEnViewport);
  window.addEventListener('scroll', revelarEnViewport, { passive: true });

})();


/* ────────────────────────────────────────────────────────────
   MODAL — INSTRUCTIVO DE GESTIÓN DE CONTENIDO (PASO 04)
   Abre un diálogo con 5 enlaces a videos; se cierra con X,
   clic fuera del panel o tecla Escape.
   ──────────────────────────────────────────────────────────── */
(function () {

  const botonAbrir = document.getElementById('abrir-modal-gestion-contenido');
  const modal = document.getElementById('modal-gestion-contenido');

  if (!botonAbrir || !modal) {
    return;
  }

  const botonCerrar = modal.querySelector('.modal-gestion__cerrar');
  let elementoConFocoPrevio = null;
  let cerrando = false;
  let scrollAlAbrir = 0;

  function bloquearScrollPagina() {
    scrollAlAbrir = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.classList.add('modal-gestion-abierto');
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollAlAbrir + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function desbloquearScrollPagina() {
    document.body.classList.remove('modal-gestion-abierto');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollAlAbrir);
  }

  function abrirModal() {
    cerrando = false;
    elementoConFocoPrevio = document.activeElement;
    bloquearScrollPagina();
    modal.hidden = false;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        modal.classList.add('modal-gestion--visible');
      });
    });
    if (botonCerrar) {
      botonCerrar.focus({ preventScroll: true });
    }
  }

  function cerrarModal() {
    if (modal.hidden || cerrando) {
      return;
    }
    cerrando = true;
    modal.classList.remove('modal-gestion--visible');

    window.setTimeout(function () {
      modal.hidden = true;
      desbloquearScrollPagina();
      cerrando = false;
      if (elementoConFocoPrevio && typeof elementoConFocoPrevio.focus === 'function') {
        elementoConFocoPrevio.focus({ preventScroll: true });
      }
    }, 260);
  }

  botonAbrir.addEventListener('click', function (evento) {
    evento.preventDefault();
    abrirModal();
  });

  modal.querySelectorAll('[data-cerrar-modal]').forEach(function (elemento) {
    elemento.addEventListener('click', cerrarModal);
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && !modal.hidden) {
      cerrarModal();
    }
  });

})();
