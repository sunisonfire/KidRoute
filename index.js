/*Pa menu hambruguesa las constantes, llamar por id*/

const menuHamburguesa = document.getElementById("menuHamburguesa");

const barraIzq = document.querySelector(".barraIzq");

const linksMenu = document.querySelectorAll(".menu a");

/* abirir y cerrar */

menuHamburguesa.addEventListener("click", (e) => {

    e.stopPropagation();

    barraIzq.classList.toggle("activo");

});

/* que no se cierre si se toca el menu */

barraIzq.addEventListener("click", (e) => {

    e.stopPropagation();

});

/* si se toca fuera, se cierra */

document.addEventListener("click", () => {

    barraIzq.classList.remove("activo");

});

/* eliminar activo si se toca un link*/

linksMenu.forEach((link) => {

    link.addEventListener("click", () => {

        barraIzq.classList.remove("activo");

    });

});

/* cerrar al poner ESC */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {
        barraIzq.classList.remove("activo");
    }
});

// API clima
const apiKey = "c970e78af465153ead65f9fecde4cc9c";

// lista de ciudades que quieres mostrar que estan dentro de la api
//para que cambie cada cierto tiempito
const ciudades = ["Bogota", "Medellin", "Cali", "Cartagena", "Barranquilla"];
let indice = 0;

//asincronia
async function obtenerClima(ciudad) {
    try {
        const respuesta = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`
        );
        const data = await respuesta.json();
        console.log("Datos:", data);
        //si no encuentra la ciudad o los datos estan incompletos, que no haga nada y tire mensajito en consola
        if (!data.weather || !data.main) {
            console.log("Ciudad no encontrada o datos incompletos");
            return;
        }
        //para empezar del 0 de la lista de ciudades cuando llegue al final
        setInterval(() => {
            indice = (indice + 1) % ciudades.length; // avanzar en la lista
            obtenerClima(ciudades[indice]);
        }, 60000);
        // Cambiar de ciudad cada 60 segundos (60000 ms)
        const clima = data.weather[0].main;
        const temperatura = Math.round(data.main.temp);

        //para ponerle iconitos segun el clima, y mostrar la info en el html
        const icono = document.getElementById("iconoClima");
        document.getElementById("temperatura").textContent = `${temperatura}°C`;
        document.getElementById("estadoClima").textContent = `${ciudad}: ${clima}`;
        //imageness y una por si no es ninguna de las anteriores
        if (clima === "Clear") icono.src = "img/sol.png";
        else if (clima === "Rain") icono.src = "img/lluvia.png";
        else if (clima === "Clouds") icono.src = "img/nubes.png";
        else if (clima === "Thunderstorm") icono.src = "img/tormenta.png";
        else icono.src = "img/default.png";
    } catch (error) {
        console.log("Error:", error);
    }
}

// Mostrar la primera ciudad al cargar
obtenerClima(ciudades[indice]);


