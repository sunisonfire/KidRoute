let editIndex = null;
let editRuta = document.getElementById("editRuta");
let editNombre = document.getElementById("editNombre");
let editId = document.getElementById("editId");
let editCurso = document.getElementById("editCurso");
let modal = document.getElementById("modal");
let formEditar = document.getElementById("formEditar");
let cerrarModal = document.getElementById("cerrarModal");


//se muestran los estudianyes que ya estaban guardados en el loocalStorage,
//  si es que hay alguno guardado, sino no hace nada

function cargarEstudiantes() {
  const data = localStorage.getItem("rutas");
  if (!data) return;

  const rutas = JSON.parse(data);
  const tbody = document.querySelector("#tablaEstudiantes tbody");
  tbody.innerHTML = "";
  //y lo muestra asi bien tierno 
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
  mostrarEstadisticas();
}

// Llamar al inicio
cargarEstudiantes();


// Abrir modal con datos
function abrirModal(idEstudiante) {
  const rutas = JSON.parse(localStorage.getItem("rutas")) || [];
  let estudianteEncontrado = null;
  let rutaIndex = null;
  let estIndex = null;
  //dentro del array de rutas, busca el estudiante que tenga el id que se le dio 
  // a la función, y si lo encuentra, guarda su información y los índices
  //  correspondientes para luego mostrarlo en el modal
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

  // Evitar estudiantes con el mismo ID
  const nuevoId = editId.value;
  if (rutas[rutaIndex].estudiantes.some((est, i) => est.id === nuevoId && i !== estIndex)) {
    alert("Ya existe un estudiante con esa identificación en esta ruta");
    return;
  }

  rutas[rutaIndex].estudiantes[estIndex] = {
    ...rutas[rutaIndex].estudiantes[estIndex],
    nombre: editNombre.value,
    id: nuevoId,
    curso: editCurso.value,
    ruta: editRuta.value || null
  };

  localStorage.setItem("rutas", JSON.stringify(rutas));
  cargarEstudiantes();
   
 // refresca la tabla
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
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

// Cargar rutas en los selects del otro place
function cargarRutas() {
  const rutas = JSON.parse(localStorage.getItem("rutas")) || [];
  editRuta.innerHTML = `<option value=""> Sin asignar </option>`;
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
 


// 🔎 Buscador que filtra la tabla en vivo
// 🔎 Buscador que filtra directamente la tabla
const busquedaEst = document.getElementById("busquedaEst");

busquedaEst.addEventListener("input", () => {
  const texto = busquedaEst.value.toLowerCase();
  const filas = document.querySelectorAll("#tablaEstudiantes tbody tr");

  filas.forEach(tr => {
    const nombre = tr.children[0].textContent.toLowerCase();
    const id = tr.children[1].textContent.toLowerCase();
    const curso = tr.children[2].textContent.toLowerCase();
    const ruta = tr.children[3].textContent.toLowerCase();

    // si el buscador está vacío, mostrar todo
    if (texto === "") {
      tr.style.display = "";
      return;
    }

    // si alguno de los campos contiene el texto buscado, se muestra
    if (
      nombre.includes(texto) ||
      id.includes(texto) ||
      curso.includes(texto) ||
      ruta.includes(texto)
    ) {
      tr.style.display = ""; // visible
      tr.style.backgroundColor = "#ffff99"; // resaltar
    } else {
      tr.style.display = "none"; // oculto
    }
  });
});
function mostrarEstadisticas() {
  const rutas = JSON.parse(localStorage.getItem("rutas")) || [];
  const contenedor = document.getElementById("estadisticas");
  contenedor.innerHTML = "";

  let totalGeneral = 0;

  rutas.forEach(ruta => {
    const total = ruta.estudiantes.length;
    totalGeneral += total;

    const cursos = {};
    ruta.estudiantes.forEach(est => {
      cursos[est.curso] = (cursos[est.curso] || 0) + 1;
    });

    const div = document.createElement("div");
    div.classList.add("estadistica");
    div.innerHTML = `
      <h3>${ruta.nombre}</h3>
      <p>Total estudiantes: ${total}</p>
      <ul>
        ${Object.entries(cursos).map(([curso, cantidad]) => `<li>${curso}: ${cantidad}</li>`).join("")}
      </ul>
    `;
    contenedor.appendChild(div);
  });
  const resumen = document.createElement("div");
  resumen.classList.add("resumen");
  resumen.innerHTML = `<h2>Total general de estudiantes: ${totalGeneral}</h2>`;
  contenedor.appendChild(resumen);
}
