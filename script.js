const apiKey = "b6033a75"; // OMDb API key
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("moviesContainer");

const popularContainer = document.getElementById("popularMovies");
const recommendedContainer = document.getElementById("recommendedMovies");
const heroSlider = document.getElementById("heroSlider");

// Event listener for search
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if(query) fetchMovies(query, moviesContainer);
});

// Fetch movies function
async function fetchMovies(query, container) {
  container.innerHTML = "Loading...";
  try {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = await response.json();
    if(data.Response === "True") {
      displayMovies(data.Search, container);
    } else {
      container.innerHTML = `<p>${data.Error}</p>`;
    }
  } catch (err) {
    container.innerHTML = "<p>Error fetching movies</p>";
    console.error(err);
  }
}

// Display movies with lazy load
function displayMovies(movies, container) {
  container.innerHTML = "";
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";

    // Lazy load image
    const posterURL = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "https://dummyimage.com/200x300/000/fff&text=No+Image";
    const img = document.createElement("img");
    img.dataset.src = posterURL;
    img.alt = movie.Title;

    card.appendChild(img);
    const title = document.createElement("h3");
    title.textContent = movie.Title;
    card.appendChild(title);
    const year = document.createElement("p");
    year.textContent = movie.Year;
    card.appendChild(year);

    // Click opens IMDB
    card.addEventListener("click", () => {
      window.open(`https://www.imdb.com/title/${movie.imdbID}/`, "_blank");
    });

    container.appendChild(card);
  });

  // Lazy load observer
  const lazyImages = container.querySelectorAll("img");
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const img = entry.target;
        img.src = img.dataset.src;
        img.onload = () => img.classList.add("loaded");
        obs.unobserve(img);
      }
    });
  }, {rootMargin: "50px"});
  lazyImages.forEach(img => observer.observe(img));
}

// Preload Popular & Recommended Movies
const samplePopular = ["Avengers", "Batman", "Inception", "Spider-Man"];
const sampleRecommended = ["Joker", "Interstellar", "Frozen", "Titanic"];
samplePopular.forEach(title => fetchMovies(title, popularContainer));
sampleRecommended.forEach(title => fetchMovies(title, recommendedContainer));

// Hero Images Slider
const heroImages = [
  "https://wallpaperbat.com/img/346050-dark-netflix-tv-show-minimal-poster-1440p-resolution.jpg",
  "https://wallpaperbat.com/img/306398-castlevania-netflix-s2-wallpaper-hd-castlevania.png",
  "https://wallpaperbat.com/img/95493-the-witcher-netflix-wallpaper-and-background-download-hd.jpg"
];
let currentHero = 0;
function changeHeroImage(){
  heroSlider.querySelector("img").src = heroImages[currentHero];
  currentHero = (currentHero + 1) % heroImages.length;
}
setInterval(changeHeroImage, 5000);
