
    const menuHamburguesa =document.getElementById("menuHamburguesa");

    const barraIzq =document.querySelector(".barraIzq");

    const linksMenu =document.querySelectorAll(".menu a");

    /* ABRIR Y CERRAR */

    menuHamburguesa.addEventListener("click", (e) => {

        e.stopPropagation();

        barraIzq.classList.toggle("activo");

    });

    /* EVITAR CERRAR SI TOCAN EL MENU */

    barraIzq.addEventListener("click", (e) => {

        e.stopPropagation();

    });

    /* CERRAR SI TOCAN AFUERA */

    document.addEventListener("click", () => {

        barraIzq.classList.remove("activo");

    });

    /* CERRAR AL TOCAR LINKS */

    linksMenu.forEach((link) => {

        link.addEventListener("click", () => {

            barraIzq.classList.remove("activo");

        });

    });

    //CERRAR AL TOCAR ESCAPE

    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {
            barraIzq.classList.remove("activo");
        }
    });


const apiKey = "c970e78af465153ead65f9fecde4cc9c";

async function obtenerClima(ciudad) {
  try {
    const respuesta = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`
    );
    const data = await respuesta.json();

    console.log(data);

    const clima = data.weather[0].main;
    const temperatura = Math.round(data.main.temp);

    const icono = document.getElementById("iconoClima");
    document.getElementById("temperatura").textContent = `${temperatura}°C`;
    document.getElementById("estadoClima").textContent = clima;

    if (clima === "Clear") {
      icono.src = "img/sol.png";
    } else if (clima === "Rain") {
      icono.src = "img/lluvia.png";
    } else if (clima === "Clouds") {
      icono.src = "img/nubes.png";
    } else if (clima === "Thunderstorm") {
      icono.src = "img/tormenta.png";
    } else {
      icono.src = "img/default.png";
    }
  } catch (error) {
    console.log("Error:", error);
  }
}
