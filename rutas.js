"use strict";
/*variables de formularios*/
const FormularioRuta = document.getElementById("FormularioRuta");
const FormularioEstudiante = document.getElementById("FormularioEstudiante");
const seleccionarRuta = document.getElementById("seleccionarRuta");
const contenedorRutas = document.getElementById("contenedorRutas");

// Variables del modal
const modal = document.getElementById("modal");
const formRuta = document.getElementById("formRuta");
const nombre = document.getElementById("nombre");
const conductor = document.getElementById("conductor");
const hora = document.getElementById("hora");
const listaEstudiantesModal = document.getElementById("listaEstudiantesModal");
const nuevoEstudiante = document.getElementById("nuevoEstudiante");
const IDEstudiante = document.getElementById("IDEstudiante");
const cursoEstudiante = document.getElementById("cursoEstudiante");
const btnAgregarEst = document.getElementById("btnAgregarEst");
const btnCerrar = document.getElementById("btnCerrar");
/*para empezar a meter las rutas*/
let rutas = [];
let editId = null;

// Web Component con plantilla html y css
const template = document.createElement("template");
template.innerHTML = `
  <style>
.card {
  width: 100%;          /* antes era fijo en 600px */
  max-width: 600px;     /* límite en pantallas grandes */
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  font-family: "Pixelify Sans", sans-serif;
}


/* Franja superior */
.top-bar {
  background: #85c972;
  color: white;
  text-align: center;
  padding: 10px;
  font-size: 20px;
  font-weight: bold;
  border-bottom: 2px solid #0a1e12;
}

/* Contenido principal */
.contenido {
  display: flex;
  flex-direction: row;
  background: #fff;
  padding: 15px;
}

/* Columna izquierda */
.izquierda {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.izquierda img {
  width: 100%;
  max-width: 200px;
  border-radius: 8px;
}

/* Columna derecha */
.derecha {
background: #f9f9f9;
  flex: 2;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.info {
  font-size: 15px;
  color: #333;
}
p {
  line-height: 0; /* más pequeño = menos espacio */
}

.label {
  color:#4a9e53;
  font-weight: bold;
}
/* Estudiantes estilo chips */
.lista-estudiantes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.estudiante {
  background: #eee;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  text-align: center;
  min-width: 40px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Franja inferior */
.bottom-bar {
border-top: 2px solid #0a1e12;
  background: #85c972;
  display: flex;
  justify-content: space-around;
  padding: 12px;
}
.bottom-bar button {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: white;
}
.editar { background: #0a1e12; }
.eliminar { background: #0a1e12; }
.bottom-bar button:hover { background: #e8fa74;color:#0a1e12; }

/*responsive*/
@media (max-width:768px) {
  .contenido {
    flex-direction: column;   /* imagen arriba, info abajo */
    align-items: center;
  }
  .izquierda img {
    max-width: 40%;          /* imagen ocupa todo el ancho */
  }
  .derecha {
    padding-left: 0;
    width: 100%;
  }
}

@media (max-width:480px) {
  .top-bar { font-size: 16px; }
  .info { font-size: 12px; }
  .estudiante { font-size: 12px; padding: 6px 10px; }
  .bottom-bar {
    flex-direction: column;   /* botones apilados */
    gap: 10px;
  }
  .bottom-bar button {
    width: 100%;
  }
}
  </style>
  <section>
    <div class="card">
      <div class="top-bar">
        <h3 class="nombre">Ruta Escolar</h3>
      </div>
      <div class="contenido">
        <div class="izquierda">
          <img src="img/imgConducir.jpg" alt="verde">
        </div>
        <div class="derecha">
          <p class="info conductor"></p>
          <p class="info hora"></p>
          <p class="info ciudad"></p>
          <div class="estudiantes">
            <h4>Estudiantes</h4>
            <div class="lista-estudiantes"></div>
          </div>
        </div>
      </div>
      <div class="bottom-bar">
        <button class="editar">Editar</button>
        <button class="eliminar">Eliminar</button>
      </div>
    </div>
  </section>
`;
/*validaciones*/
function soloLetras(valor) {
  return /^[A-Za-z\s]+$/.test(valor); // solo letras y espacios
}

function soloNumeros(valor) {
  return /^\d+$/.test(valor); // solo dígitos
}

/*crear etiquetas heredadas del html*/
class RouteCard extends HTMLElement {
  constructor() {
    super();
    /*crea un Shadow DOM para encapsular estilos y estructura.*/
    this.attachShadow({ mode: "open" });
    /*clonar la plantilla y la mete en el dom*/
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  /*Se ejecuta automáticamente cuando el elemento <route-card>
  * aparece en el DOM. Llama al método render() para mostrar la información.*/
  connectedCallback() { this.render(); }
  /* Obtiene los atributos que puse en el HTML*/
  render() {
    const nombre = this.getAttribute("nombre");
    const conductor = this.getAttribute("conductor");
    const hora = this.getAttribute("hora");
    const ciudad = this.getAttribute("ciudad");
    /*el atributo estudiantes es un JSON string, lo parseamos para obtener el array de objetos*/
    const estudiantes = JSON.parse(this.getAttribute("estudiantes") || "[]");
    /*como aparecerian en la tarjeta ... Inserta los valores en el HTML dentro del Shadow */
    this.shadowRoot.querySelector("h3").textContent = nombre;
    this.shadowRoot.querySelector(".conductor").innerHTML = `<span class="label">Conductor:</span> ${conductor}`;
    this.shadowRoot.querySelector(".hora").innerHTML = `<span class="label">Hora de salida:</span> ${hora}`;
    this.shadowRoot.querySelector(".ciudad").innerHTML = `<span class="label">Ciudad:</span> ${ciudad}`;

    const lista = this.shadowRoot.querySelector(".lista-estudiantes");
    /*limpia la lista y luego recorre el array de estudiantes.*/
    /*muestra solo el nombre y guarda lo demas .*/
    lista.innerHTML = "";
    estudiantes.forEach(est => {
      const div = document.createElement("div");
      div.classList.add("estudiante");
      div.textContent = est.nombre;
      lista.appendChild(div);
    });
    /*al hacer clic en los botones, pasa tal y tal cosa*/
    this.shadowRoot.querySelector(".eliminar").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("route:delete", { detail: { nombre }, bubbles: true }));
    }); /* la burbuja permite que el evento suba al DOM y lo capture tu app. */
    this.shadowRoot.querySelector(".editar").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("route:edit", { detail: { nombre }, bubbles: true }));
    });
  }
}
/*tomar datos y mostrarlos en pantalla con un formato visual */
customElements.define("route-card", RouteCard);

// Guardar en localStorage
function guardarRutas() {
  localStorage.setItem("rutas", JSON.stringify(rutas));
}

// Cargar desde localStorage
function cargarRutas() {
  const data = localStorage.getItem("rutas");
  if (data) {
    rutas = JSON.parse(data);
    actualizarSelect();
    renderRutas();
  }
}

// tomar datos y mostrarlos en pantalla de las rutas
function renderRutas() {
  contenedorRutas.innerHTML = "";
  rutas.forEach(r => {
    const card = document.createElement("route-card");
    card.setAttribute("nombre", r.nombre);
    card.setAttribute("conductor", r.conductor);
    card.setAttribute("hora", r.hora);
    card.setAttribute("ciudad", r.ciudad);
    card.setAttribute("estudiantes", JSON.stringify(r.estudiantes));
    contenedorRutas.appendChild(card);
  });
}

// Actualizar select
function actualizarSelect() {
  seleccionarRuta.innerHTML = "";
  rutas.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.nombre;
    opt.textContent = r.nombre;
    seleccionarRuta.appendChild(opt);
  });
}

// Escuchar eventos personalizados
contenedorRutas.addEventListener("route:delete", e => {
  rutas = rutas.filter(r => r.nombre !== e.detail.nombre);
  guardarRutas();
  actualizarSelect();
  renderRutas();
});

FormularioRuta.addEventListener("submit", e => {
  e.preventDefault();

  const nombreRuta = FormularioRuta.nombreRuta.value.trim();
  const conductorRuta = FormularioRuta.conductor.value.trim();
  const horaSalida = FormularioRuta.horaSalida.value.trim();
  const ciudadRuta = FormularioRuta.ciudad.value.trim();

  // Validaciones
  if (!soloLetras(nombreRuta)) {
    alert("El nombre de la ruta solo puede contener letras");
    return;
  }
  if (!soloLetras(conductorRuta)) {
    alert("El nombre del conductor solo puede contener letras");
    return;
  }
  if (!soloLetras(ciudadRuta)) {
    alert("La ciudad solo puede contener letras");
    return;
  }

  // Si pasa las validaciones, se guarda
  const ruta = {
    id: Date.now(),
    nombre: nombreRuta,
    conductor: conductorRuta,
    hora: horaSalida,
    ciudad: ciudadRuta,
    estudiantes: []
  };

  rutas.push(ruta);
  guardarRutas();
  actualizarSelect();
  renderRutas();
  FormularioRuta.reset();
});

// Asignar estudiante con ruta seleccionada
FormularioEstudiante.addEventListener("submit", e => {
  e.preventDefault();
  const nombreEst = document.getElementById("nombreEstudiante").value.trim();
  const idEst = document.getElementById("IDEstudianteForm").value.trim();
  const cursoEst = document.getElementById("cursoEstudianteForm").value.trim();
  const rutaNombre = seleccionarRuta.value;

  if (!soloLetras(nombreEst)) {
    alert("El nombre solo puede contener letras");
    return;
  }
  if (!soloNumeros(idEst)) {
    alert("La identificación solo puede contener números");
    return;
  }
  if (!soloLetras(cursoEst)) {
    alert("El curso solo puede contener letras");
    return;
  }
  if (nombreEst && idEst && cursoEst && rutaNombre) {
    const estudiante = {
      nombre: nombreEst,
      id: idEst,
      curso: cursoEst,
      ruta: rutaNombre
    };
    /*y si cumple todo*/
    const ruta = rutas.find(r => r.nombre === rutaNombre);
    if (ruta) {
      ruta.estudiantes.push(estudiante);
      guardarRutas();
      renderRutas();
    }
  }
  FormularioEstudiante.reset();
});

// Llamar al inicio
cargarRutas();

//EL MODAL
contenedorRutas.addEventListener("route:edit", e => {
  const ruta = rutas.find(r => r.nombre === e.detail.nombre);
  editId = ruta.id;
  /*muestra el modal */
  modal.classList.add("show");
  /*agarra los datos y los muestra en el formulario */
  nombre.value = ruta.nombre;
  conductor.value = ruta.conductor;
  hora.value = ruta.hora;
  ciudad.value = ruta.ciudad;

  listaEstudiantesModal.innerHTML = "";
  ruta.estudiantes.forEach((est, i) => {
    const div = document.createElement("div");
    div.classList.add("estudiante"); //  clase para estilo
    div.innerHTML = `
    <span>${est.nombre}</span>
    <button class="btnDel">❌</button>
  `;
    const btnDel = div.querySelector(".btnDel");
    btnDel.addEventListener("click", () => {
      /*borra al estudiante que corresponde al índice i dentro del array. */
      ruta.estudiantes.splice(i, 1);
      guardarRutas();
      renderRutas();
      div.remove();
    });
    listaEstudiantesModal.appendChild(div);
  });
});

btnAgregarEst.addEventListener("click", () => {
  const ruta = rutas.find(r => r.id === editId);
  if (ruta) {
    const estudiante = {
      nombre: nuevoEstudiante.value.trim(),
      id: IDEstudiante.value.trim(),
      curso: cursoEstudiante.value.trim(),
      ruta: ruta.nombre
    };
    if (estudiante.nombre && estudiante.id && estudiante.curso) {
      ruta.estudiantes.push(estudiante);
      guardarRutas();
      renderRutas();
      nuevoEstudiante.value = "";
      IDEstudiante.value = "";
      cursoEstudiante.value = "";
    }
  }
});
/*si todo esta, que se quite el modal y se guarden los datos */
formRuta.addEventListener("submit", e => {
  e.preventDefault();
  const ruta = rutas.find(r => r.id === editId);
  if (ruta) {
    ruta.nombre = nombre.value;
    ruta.conductor = conductor.value;
    ruta.hora = hora.value;
    guardarRutas();
    renderRutas();
    modal.classList.remove("show");
  }
});
/*y para que se cierre */
btnCerrar.addEventListener("click", () => {
  modal.classList.remove("show");
});


/*COMO ANTESSS BABY VAMO' A HACERLO COMO ANTES, CUANDO YO NO ERA CANTANTE
*ANTES DE QUE YO ME HICIERA UN HAMSTER */
const gato = document.getElementById("gato");
const hamster = document.getElementById("hamster");

gato.addEventListener("mouseenter", () => {
  gato.src = "img/gato3.png";
  hamster.currentTime = 0;
  hamster.play();
});

gato.addEventListener("mouseleave", () => {
  gato.src = "img/gato.png";
  hamster.pause();
  hamster.currentTime = 0;
});