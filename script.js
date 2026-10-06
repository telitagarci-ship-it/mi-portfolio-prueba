// ===== MODO OSCURO CON LOCALSTORAGE =====
const toggleBtn = document.getElementById('toggle-tema');
const body = document.body;

// ===== COTIZACIÓN DEL DÓLAR BLUE =====
const compraDolar = document.getElementById('cotizacion-compra');
const ventaDolar = document.getElementById('cotizacion-venta');
const actualizacionDolar = document.getElementById('cotizacion-actualizacion');

fetch('https://dolarapi.com/v1/dolares/blue')
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo consultar la cotización');
    }
    return response.json();
  })
  .then(cotizacion => {
    const formatoPesos = new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 2
    });

    compraDolar.textContent = formatoPesos.format(cotizacion.compra);
    ventaDolar.textContent = formatoPesos.format(cotizacion.venta);

    const fecha = new Date(cotizacion.fechaActualizacion);
    actualizacionDolar.textContent = Number.isNaN(fecha.getTime())
      ? 'Cotización actualizada desde DolarAPI'
      : `Actualizado: ${fecha.toLocaleString('es-AR')}`;
  })
  .catch(() => {
    compraDolar.textContent = 'No disponible';
    ventaDolar.textContent = 'No disponible';
    actualizacionDolar.textContent = 'No se pudo cargar la cotización. Probá de nuevo más tarde.';
  });

// Cargar preferencia guardada al iniciar
if (localStorage.getItem('tema') === 'oscuro') {
  body.classList.add('dark-mode');
  toggleBtn.textContent = '☀️';
  toggleBtn.setAttribute('aria-label', 'Cambiar a modo claro');
}

// Event listener para el botón de tema
toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const esOscuro = body.classList.contains('dark-mode');
  
  // Actualizar icono y atributo aria
  toggleBtn.textContent = esOscuro ? '☀️' : '';
  toggleBtn.setAttribute('aria-label', esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  
  // Guardar preferencia en localStorage
  localStorage.setItem('tema', esOscuro ? 'oscuro' : 'claro');
});

// ===== VALIDACIÓN DE FORMULARIO =====
const form = document.getElementById('form-contacto');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Obtener valores
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  
  // Array para almacenar errores
  let errores = [];
  
  // Validar nombre
  if (!nombre) {
    errores.push('El nombre es obligatorio');
  } else if (nombre.length < 3) {
    errores.push('El nombre debe tener al menos 3 caracteres');
  }
  
  // Validar email
  if (!email) {
    errores.push('El email es obligatorio');
  } else if (!email.includes('@') || !email.includes('.')) {
    errores.push('Ingresá un email válido (ejemplo: tu@email.com)');
  }
  
  // Validar mensaje
  if (!mensaje) {
    errores.push('El mensaje es obligatorio');
  } else if (mensaje.length < 10) {
    errores.push('El mensaje debe tener al menos 10 caracteres');
  }
  
  // Mostrar errores o éxito
  if (errores.length > 0) {
    alert('⚠️ Errores en el formulario:\n\n' + errores.join('\n'));
  } else {
    alert('✅ ¡Mensaje enviado con éxito!\n\nGracias ' + nombre + ', te contactaré pronto.');
    form.reset();
  }
});

// ===== SMOOTH SCROLL PARA NAVEGACIÓN =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    
    const href = link.getAttribute('href');
    
    // Si es solo #, ir al inicio
    if (href === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const destino = document.querySelector(href);
    
    if (destino) {
      // Calcular la posición considerando el header sticky
      const headerOffset = 80;
      const elementPosition = destino.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Cerrar menú en móvil si está abierto (opcional)
      // Aquí podrías agregar lógica para cerrar un menú hamburguesa
    }
  });
});

// ===== EFECTO DE HEADER AL SCROLLEAR =====
const header = document.querySelector('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    return;
  }
  
  header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  
  lastScroll = currentScroll;
});

// ===== ANIMACIÓN DE ENTRADA PARA SECCIONES =====
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observar todas las secciones
document.querySelectorAll('.section').forEach(section => {
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';
  section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(section);
});

// ===== VALIDACIÓN EN TIEMPO REAL (OPCIONAL) =====
const inputs = form.querySelectorAll('input, textarea');

inputs.forEach(input => {
  input.addEventListener('blur', () => {
    validarCampo(input);
  });
  
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) {
      validarCampo(input);
    }
  });
});

function validarCampo(campo) {
  const valor = campo.value.trim();
  let valido = true;
  
  if (campo.id === 'nombre' && valor.length < 3) {
    valido = false;
  } else if (campo.id === 'email' && (!valor.includes('@') || !valor.includes('.'))) {
    valido = false;
  } else if (campo.id === 'mensaje' && valor.length < 10) {
    valido = false;
  }
  
  if (!valido && valor !== '') {
    campo.classList.add('error');
    campo.style.borderColor = '#ef4444';
  } else {
    campo.classList.remove('error');
    campo.style.borderColor = '';
  }
}

// ===== MENSAJE DE BIENVENIDA EN CONSOLA =====
console.log('%c👋 ¡Hola!', 'font-size: 24px; font-weight: bold; color: #10b981;');
console.log('%cPortfolio de Stella Maris García - Desarrolladora Web Front-End', 'font-size: 14px; color: #334155;');
console.log('%c💻 Tecnologías: HTML5, CSS3, JavaScript', 'font-size: 12px; color: #64748b;');