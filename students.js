let editIndex = null;
let editRuta = document.getElementById("editRuta");
let editNombre = document.getElementById("editNombre");
let editId = document.getElementById("editId");
let editCurso = document.getElementById("editCurso");
let modal = document.getElementById("modal");
let formEditar = document.getElementById("formEditar");
let cerrarModal = document.getElementById("cerrarModal");


function cargarEstudiantes() {
  const data = localStorage.getItem("rutas");
  if (!data) return;

  const rutas = JSON.parse(data);
  const tbody = document.querySelector("#tablaEstudiantes tbody");
  tbody.innerHTML = "";

  rutas.forEach(ruta => {
    ruta.estudiantes.forEach(est => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="lal">${est.nombre}</td>
        <td class="lol">${est.id}</td>
        <td class="lal">${est.curso}</td>
        <td class="lol">${ruta.nombre}</td>
        <td id="separense"><button onclick="abrirModal(${est.id})">Editar</button>    <button onclick="eliminarEstudiante(${est.id})">Eliminar</button></td>
      `;
      tbody.appendChild(tr);
    });
  });
}

// Llamar al inicio
cargarEstudiantes();

// Abrir modal con datos
function abrirModal(idEstudiante) {
  const rutas = JSON.parse(localStorage.getItem("rutas")) || [];
  let estudianteEncontrado = null;
  let rutaIndex = null;
  let estIndex = null;

  rutas.forEach((ruta, i) => {
    ruta.estudiantes.forEach((est, j) => {
      if (est.id == idEstudiante) {
        estudianteEncontrado = est;
        rutaIndex = i;
        estIndex = j;
      }
    });
  });

  if (!estudianteEncontrado) return;

  editIndex = { rutaIndex, estIndex };

  editNombre.value = estudianteEncontrado.nombre;
  editId.value = estudianteEncontrado.id;
  editCurso.value = estudianteEncontrado.curso;
  editRuta.value = estudianteEncontrado.ruta || "";

  modal.style.display = "block";
}

// Guardar cambios desde modal
formEditar.addEventListener("submit", e => {
  e.preventDefault();
  const rutas = JSON.parse(localStorage.getItem("rutas")) || [];
  const { rutaIndex, estIndex } = editIndex;

  rutas[rutaIndex].estudiantes[estIndex] = {
    ...rutas[rutaIndex].estudiantes[estIndex],
    nombre: editNombre.value,
    id: editId.value,
    curso: editCurso.value,
    ruta: editRuta.value || null
  };

  localStorage.setItem("rutas", JSON.stringify(rutas));
  cargarEstudiantes(); // refresca la tabla
  modal.style.display = "none";
});

// Eliminar estudiante
function eliminarEstudiante(idEstudiante) {
  const rutas = JSON.parse(localStorage.getItem("rutas")) || [];
  rutas.forEach(ruta => {
    ruta.estudiantes = ruta.estudiantes.filter(est => est.id != idEstudiante);
  });
  localStorage.setItem("rutas", JSON.stringify(rutas));
  cargarEstudiantes();
}

// Cerrar modal
cerrarModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if(e.target === modal) modal.style.display = "none"; });

// 🔥 Cargar rutas en los selects
function cargarRutas() {
  const rutas = JSON.parse(localStorage.getItem("rutas")) || [];
  editRuta.innerHTML = `<option value="">-- Sin asignar --</option>`;
  rutas.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r.nombre;
    opt.textContent = r.nombre;
    editRuta.appendChild(opt);
  });
}

// Inicializar
cargarRutas();
cargarEstudiantes();