"use strict";

const FormularioRuta = document.getElementById("FormularioRuta");
const FormularioEstudiante = document.getElementById("FormularioEstudiante");
const seleccionarRuta = document.getElementById("seleccionarRuta");
const contenedorRutas = document.getElementById("contenedorRutas");

// 🔧 Variables del modal
const modal = document.getElementById("modal");
const formRuta = document.getElementById("formRuta");
const nombre = document.getElementById("nombre");
const conductor = document.getElementById("conductor");
const hora = document.getElementById("hora");
const listaEstudiantesModal = document.getElementById("listaEstudiantesModal");
const nuevoEstudiante = document.getElementById("nuevoEstudiante");
const btnAgregarEst = document.getElementById("btnAgregarEst");
const btnCerrar = document.getElementById("btnCerrar");

let rutas = [];
let editId = null;

// Web Component
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
  font-size: 14px;
  color: #333;
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
@media (max-width:768px) {
  .contenido {
    flex-direction: column;   /* imagen arriba, info abajo */
    align-items: center;
  }
  .izquierda img {
    max-width: 100%;          /* imagen ocupa todo el ancho */
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

class RouteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:"open"});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback() { this.render(); }
  render() {
    const nombre = this.getAttribute("nombre");
    const conductor = this.getAttribute("conductor");
    const hora = this.getAttribute("hora");
    const estudiantes = JSON.parse(this.getAttribute("estudiantes") || "[]");

    this.shadowRoot.querySelector("h3").textContent = nombre;
    this.shadowRoot.querySelector(".conductor").innerHTML = `<span class="label">Conductor:</span> ${conductor}`;
    this.shadowRoot.querySelector(".hora").innerHTML = `<span class="label">Hora de salida:</span> ${hora}`;

    const lista = this.shadowRoot.querySelector(".lista-estudiantes");
    lista.innerHTML="";
    estudiantes.forEach(est=>{
      const div=document.createElement("div");
      div.classList.add("estudiante");
      div.textContent=est;
      lista.appendChild(div);
    });

    this.shadowRoot.querySelector(".eliminar").addEventListener("click", ()=>{
      this.dispatchEvent(new CustomEvent("route:delete",{detail:{nombre},bubbles:true}));
    });
    this.shadowRoot.querySelector(".editar").addEventListener("click", ()=>{
      this.dispatchEvent(new CustomEvent("route:edit",{detail:{nombre},bubbles:true}));
    });
  }
}
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

// Renderizar rutas
function renderRutas(){
  contenedorRutas.innerHTML="";
  rutas.forEach(r=>{
    const card=document.createElement("route-card");
    card.setAttribute("nombre",r.nombre);
    card.setAttribute("conductor",r.conductor);
    card.setAttribute("hora",r.hora);
    card.setAttribute("estudiantes",JSON.stringify(r.estudiantes));
    contenedorRutas.appendChild(card);
  });
}

// Actualizar select
function actualizarSelect(){
  seleccionarRuta.innerHTML="";
  rutas.forEach(r=>{
    const opt=document.createElement("option");
    opt.value=r.nombre;
    opt.textContent=r.nombre;
    seleccionarRuta.appendChild(opt);
  });
}

// Escuchar eventos personalizados
contenedorRutas.addEventListener("route:delete", e=>{
  rutas = rutas.filter(r=>r.nombre!==e.detail.nombre);
  guardarRutas();
  actualizarSelect();
  renderRutas();
});

// Agregar ruta
FormularioRuta.addEventListener("submit", e=>{
  e.preventDefault();
  const ruta = {
    id: Date.now(), // 🔥 id único
    nombre: FormularioRuta.nombreRuta.value,
    conductor: FormularioRuta.conductor.value,
    hora: FormularioRuta.horaSalida.value,
    estudiantes:[]
  };
  rutas.push(ruta);
  guardarRutas();
  actualizarSelect();
  renderRutas();
  FormularioRuta.reset();
});

// Asignar estudiante
FormularioEstudiante.addEventListener("submit", e=>{
  e.preventDefault();
  const nombreEst = FormularioEstudiante.nombreEstudiante.value;
  const rutaNombre = seleccionarRuta.value;
  const ruta = rutas.find(r=>r.nombre===rutaNombre);
  if(ruta){
    ruta.estudiantes.push(nombreEst);
    guardarRutas();
    renderRutas();
  }
  FormularioEstudiante.reset();
});

// Llamar al inicio
cargarRutas();

//EL MODAL

contenedorRutas.addEventListener("route:edit", e=>{
  const ruta = rutas.find(r=>r.nombre === e.detail.nombre);
  editId = ruta.id;
  modal.classList.add("show");

  nombre.value = ruta.nombre;
  conductor.value = ruta.conductor;
  hora.value = ruta.hora;

  listaEstudiantesModal.innerHTML = "";
  ruta.estudiantes.forEach((est,i)=>{
    const div = document.createElement("div");
    div.textContent = est;
    const btnDel = document.createElement("button");
    btnDel.textContent = "❌";
    btnDel.addEventListener("click", ()=>{
      ruta.estudiantes.splice(i,1);
      guardarRutas();
      renderRutas();
      div.remove();
    });
    div.appendChild(btnDel);
    listaEstudiantesModal.appendChild(div);
  });
});

btnAgregarEst.addEventListener("click", ()=>{
  const ruta = rutas.find(r=>r.id === editId);
  if(nuevoEstudiante.value && ruta){
    ruta.estudiantes.push(nuevoEstudiante.value);
    guardarRutas();
    renderRutas();
    nuevoEstudiante.value = "";
  }
});

formRuta.addEventListener("submit", e=>{
  e.preventDefault();
  const ruta = rutas.find(r=>r.id === editId);
  if(ruta){
    ruta.nombre = nombre.value;
    ruta.conductor = conductor.value;
    ruta.hora = hora.value;
    guardarRutas();
    renderRutas();
    modal.classList.remove("show");
  }
});

btnCerrar.addEventListener("click", ()=>{
  modal.classList.remove("show");
});
