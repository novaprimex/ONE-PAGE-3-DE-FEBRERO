// Fetch de API
document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "7bb369f54ca4e707b849bde99cb58a77"; // Reemplaza con tu propia API Key
  const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-ES`;

  fetch(API_URL)
    .then((response) => response.json())
    .then((data) => {
      const movies = data.results;
      const movieList = document.getElementById("movie-list");
      movieList.innerHTML = "";

      movies.forEach((movie) => {
        const div = document.createElement("div");
        div.className = "movie-item";

        div.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
               alt="${movie.title}" 
               class="movie-poster">
          <h3>${movie.title}</h3>
          <p>⭐ ${movie.vote_average}</p>
          <button class="trailer-btn" data-id="${movie.id}" data-title="${movie.title}">Ver Tráiler</button>
        `;
        movieList.appendChild(div);
      });

      // Añadimos eventos a los botones de tráiler
      document.querySelectorAll(".trailer-btn").forEach((button) => {
        button.addEventListener("click", (e) => {
          const movieId = e.target.dataset.id;
          const movieTitle = e.target.dataset.title;

          // Llamar a la API para obtener el tráiler
          fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
          )
            .then((response) => response.json())
            .then((data) => {
              const trailer = data.results.find(
                (video) => video.type === "Trailer" && video.site === "YouTube"
              );
              if (trailer) {
                showTrailerModal(trailer.key, movieTitle);
              } else {
                alert("No se encontró un tráiler para esta película.");
              }
            })
            .catch((error) =>
              console.error("Error al cargar el tráiler:", error)
            );
        });
      });
    })
    .catch((error) => console.error("Error al cargar las películas:", error));
});

// Mostrar ventana modal con el tráiler
function showTrailerModal(videoKey, movieTitle) {
  const modal = document.getElementById("trailer-modal");
  const iframe = modal.querySelector("iframe");
  const modalTitle = modal.querySelector(".modal-title");

  // Configurar el contenido del modal
  iframe.src = `https://www.youtube.com/embed/${videoKey}`;
  modalTitle.textContent = movieTitle;

  // Mostrar el modal
  modal.style.display = "block";

  // Cerrar el modal al hacer clic en el botón de cerrar
  document.getElementById("close-modal").addEventListener("click", () => {
    modal.style.display = "none";
    iframe.src = ""; // Detener el video
  });
}
// Selección del formulario
const form = document.getElementById("contactForm");

// Agregar evento de envío al formulario
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Evita el envío automático del formulario

  // Limpiar mensajes de error anteriores
  clearErrors();

  // Obtener valores de los campos
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  let isValid = true;

  // Validar el campo de nombre
  if (name === "") {
    showError("nameError", "El nombre es obligatorio.");
    isValid = false;
  } else if (name.length < 3) {
    showError("nameError", "El nombre debe tener al menos 3 caracteres.");
    isValid = false;
  }

  // Validar el campo de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email === "") {
    showError("emailError", "El correo electrónico es obligatorio.");
    isValid = false;
  } else if (!emailRegex.test(email)) {
    showError("emailError", "Ingrese un correo electrónico válido.");
    isValid = false;
  }

  // Validar el campo de mensaje
  if (message === "") {
    showError("messageError", "El mensaje es obligatorio.");
    isValid = false;
  } else if (message.length < 10) {
    showError("messageError", "El mensaje debe tener al menos 10 caracteres.");
    isValid = false;
  }

  // Si todo es válido, mostrar un mensaje de éxito
  if (isValid) {
    alert("Formulario enviado correctamente. ¡Gracias por contactarnos!");
    form.reset(); // Limpiar el formulario
  }
});

// Función para mostrar mensajes de error
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.color = "red";
}

// Función para limpiar mensajes de error
function clearErrors() {
  const errorElements = document.querySelectorAll(".error");
  errorElements.forEach((element) => {
    element.textContent = "";
  });
}
