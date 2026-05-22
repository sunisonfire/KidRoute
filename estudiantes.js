"use strict";

const productos = [];
const editID = null

const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const descripcion = document.getElementById("descripcion");
const imagen = document.getElementById("imagen");
const agregar = document.getElementById("agregar");
const contenedor = document.getElementById("contenedorCards");

agregar.addEventListener("click", ()=>{

    if(
        nombre.value.trim() === "" ||
        precio.value.trim() === "" ||
        descripcion.value.trim() === "" ||
        imagen.files.length === 0                           //imagen: imagen.value  →  "C:\fakepath\manzana.jpg" 
    ){                                                      //imagen: e.target.result  →  "data:image/jpg;base64,iVBOR..."
        alert("Completa todos los campos");
        return;
    };


    const reader = new FileReader();
    reader.readAsDataURL(imagen.files[0]);
    reader.onload = (e) =>{


    const producto = {
        id : editID || Date.now() ,
        nombre: nombre.value,
        precio: precio.value,
        descripcion: descripcion.value,
        imagen: e.target.result
    };

    productos.push(producto);

    renderProductos();

    nombre.value = "";
    precio.value = "";
    descripcion.value = "";
    imagen.value = "";
  };
});         

function renderProductos(){

    contenedor.innerHTML = "";

    productos.forEach(producto =>{

        const card = document.createElement("div");

        card.classList.add("card");

        
        card.innerHTML = `
            <img src="${producto.imagen}">

            <div class="content">
                <h2>${producto.nombre}</h2>

                <p>${producto.descripcion}</p>

                <span class="precio">
                    $${producto.precio}
                </span>

                <button>
                    Comprar
                </button>

                <button
                    class="eliminar"
                    data-id="${producto.id}">
                    Eliminar
                </button>

            </div>
        `;

        contenedor.appendChild(card);
    });
}




contenedor.addEventListener("click", (evento) => {
    const botonEliminar = evento.target.closest("button.eliminar");
    if (!botonEliminar) return;

    const id = Number(botonEliminar.dataset.id);
    if (Number.isNaN(id)) return;

    const indice = productos.findIndex(p => p.id === id);
    if (indice !== -1) {
        productos.splice(indice, 1);
        renderProductos();
    }
});