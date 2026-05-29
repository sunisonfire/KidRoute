  const apiKey = "c970e78af465153ead65f9fecde4cc9c"; // pon aquí tu clave de OpenWeather

    async function buscarClima() {
      const ciudad = document.getElementById("ciudadInput").value.trim();
      if (!ciudad) {
        alert("Por favor escribe una ciudad");
        return;
      }

      try {
        const respuesta = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`
        );
        const data = await respuesta.json();

        if (data.cod !== 200) {
          document.getElementById("resultado").innerHTML = "Ciudad no encontrada ❌";
          return;
        }

        const clima = data.weather[0].description;
        const temperatura = Math.round(data.main.temp);

        document.getElementById("resultado").innerHTML = `
          <h2>${ciudad}</h2>
          <p>Clima: ${clima}</p>
          <p>Temperatura: ${temperatura}°C</p>
        `;
        
      } catch (error) {
        document.getElementById("resultado").innerHTML = "Error al consultar el clima ⚠️";
        console.error(error);
      }
    }