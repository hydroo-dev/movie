
    const apiKey = "b6033a75";
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const moviesContainer = document.getElementById("moviesContainer");
    const popularContainer = document.getElementById("popularMovies");
    const recommendedContainer = document.getElementById("recommendedMovies");
    const homepage = document.getElementById("homepage");
    const searchResultsSection = document.getElementById("searchResultsSection");
    const searchTitle = document.getElementById("searchTitle");
    const header = document.getElementById("header");

    // Header scroll effect
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });

    // Fade in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

    // Show/Hide Pages
    function showHomepage() {
      homepage.classList.remove("hidden");
      searchResultsSection.classList.remove("active");
      searchInput.value = "";
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showSearchResults() {
      homepage.classList.add("hidden");
      searchResultsSection.classList.add("active");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Search Events
    searchBtn.addEventListener("click", performSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") performSearch();
    });

    function performSearch() {
      const query = searchInput.value.trim();
      if (query) {
        searchTitle.textContent = `Search Results for "${query}"`;
        showSearchResults();
        fetchMovies(query, moviesContainer, true);
      }
    }

    // Fetch Movies
    async function fetchMovies(query, container, isSearch = false) {
      if (isSearch) {
        container.innerHTML = '<div class="loading">Loading amazing content...</div>';
      }

      try {
        const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
        const data = await response.json();
        
        if (data.Response === "True") {
          displayMovies(data.Search, container);
        } else {
          container.innerHTML = `<div class="error-message">${data.Error}</div>`;
        }
      } catch (err) {
        container.innerHTML = '<div class="error-message">Oops! Something went wrong. Please try again.</div>';
        console.error(err);
      }
    }

    // Display Movies
    function displayMovies(movies, container) {
      container.innerHTML = "";
      
      movies.forEach(movie => {
        const card = document.createElement("div");
        card.className = "movie-card";

        const posterURL = movie.Poster && movie.Poster !== "N/A" 
          ? movie.Poster 
          : "https://dummyimage.com/280x420/141414/666&text=No+Image";

        const imgWrapper = document.createElement("div");
        imgWrapper.className = "movie-card-img-wrapper";

        const img = document.createElement("img");
        img.dataset.src = posterURL;
        img.alt = movie.Title;

        const overlay = document.createElement("div");
        overlay.className = "movie-card-overlay";

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(overlay);

        const cardInfo = document.createElement("div");
        cardInfo.className = "movie-card-info";

        const title = document.createElement("h3");
        title.textContent = movie.Title;

        const meta = document.createElement("div");
        meta.className = "movie-card-meta";
        
        const year = document.createElement("span");
        year.textContent = movie.Year;
        
        meta.appendChild(year);
        
        cardInfo.appendChild(title);
        cardInfo.appendChild(meta);
        
        card.appendChild(imgWrapper);
        card.appendChild(cardInfo);

        card.addEventListener("click", () => {
          window.open(`https://www.imdb.com/title/${movie.imdbID}/`, "_blank");
        });

        container.appendChild(card);
      });

      // Lazy Load Images
      const lazyImages = container.querySelectorAll("img");
      const imgObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.onload = () => img.classList.add("loaded");
            obs.unobserve(img);
          }
        });
      }, { rootMargin: "100px" });

      lazyImages.forEach(img => imgObserver.observe(img));
    }

    // Load Homepage Carousels
    const popularMovies = ["Avengers", "Batman", "Inception", "Spider-Man"];
    const recommendedMovies = ["Joker", "Interstellar", "Frozen", "Titanic"];

    async function loadCarousel(titles, container) {
      for (const title of titles) {
        await fetchMovies(title, container, false);
      }
    }

    loadCarousel(popularMovies, popularContainer);
    loadCarousel(recommendedMovies, recommendedContainer);

    // Hero Slider
    const heroSlider = document.getElementById("heroSlider");
    const heroImages = heroSlider.querySelectorAll("img");
    let currentHero = 0;

    function changeHeroImage() {
      heroImages[currentHero].classList.remove("active");
      currentHero = (currentHero + 1) % heroImages.length;
      heroImages[currentHero].classList.add("active");
    }

    setInterval(changeHeroImage, 5000);
