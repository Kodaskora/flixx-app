const global = {
  currentPage: window.location.pathname,
  id: window.location.search.split('=')[1],
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1
  }
};

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  createCard(results);
}

async function displayPopularTvShows() {
  const { results } = await fetchAPIData('tv/popular');
  createCard(results);
}

async function fetchAPIData(endpoint) {
  const API_KEY = '4f31f17183f3eb8eef8549af24b014ba';
  const API_URL = 'https://api.themoviedb.org/3/';

  showSpinner();

  const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
  const data = await response.json();

  hideSpinner();

  return data;
}

async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

function displayBackgroundImage(type, path) {
  console.log(type);
  console.log(path);
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${path})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '100vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';
  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  }else{
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

async function displaySlider() {
   const { results } = await fetchAPIData('movie/now_playing');
   results.forEach((result) => {
     const sliderDiv = document.createElement('div');
     sliderDiv.classList.add('swiper-slide');
     sliderDiv.innerHTML = `
     <a href="movie-details.html?id=${result.id}">
       <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title}" />
     </a>
     <h4 class="swiper-rating">
       <i class="fas fa-star text-secondary"></i> ${result.vote_average} / 10
     </h4>
     `;
     document.querySelector('.swiper-wrapper').appendChild(sliderDiv);
     initSwiper();
   });
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false
    },
    breakpoints: {
      500: {
        slidesPerView: 2
      },
      700: {
        slidesPerView: 3
      },
      1200: {
        slidesPerView: 4
      },
    }
  });
}

function createCard(results) {
  const popularMovies = document.getElementById('popular-movies');
  const popularTv = document.getElementById('popular-shows');
  results.forEach(result => {
    const div = document.createElement('div');
    div.classList.add('card');
    if (global.currentPage === '/' || global.currentPage === '/index.html') {
      div.innerHTML = `
    <a href="movie-details.html?id=${result.id}">
      ${
        result.poster_path 
        ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}"
        class="card-img-top" alt="${result.title}"/>` :
        `<img src="../images/no-image.jpg"
        class="card-img-top" alt="Movie Title"/>`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${result.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${result.release_date}</small>
      </p>
    </div>
    `;
      popularMovies.appendChild(div);
    }else{
      div.innerHTML = `
    <a href="tv-details.html?id=${result.id}">
      ${
        result.poster_path 
        ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}"
        class="card-img-top" alt="${result.name}"/>` :
        `<img src="../images/no-image.jpg"
        class="card-img-top" alt="Movie Title"/>`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${result.name}</h5>
      <p class="card-text">
        <small class="text-muted">Air date: ${result.first_air_date}</small>
      </p>
    </div>
    `;
      popularTv.appendChild(div);
    }
    
  });
}

async function showMovieDetails(id) {
  const result  = await fetchAPIData(`movie/${id}`);

  console.log(result);

  displayBackgroundImage('movie', result.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    result.poster_path 
    ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}"
    class="card-img-top" alt="${result.title}"/>` :
    `<img src="../images/no-image.jpg"
    class="card-img-top" alt="Movie Title"/>`
  }
  </div>
  <div>
    <h2>${result.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${result.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${result.release_date}</p>
    <p>
      ${result.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${
        result.genres.map((genre) => 
          `<li>${genre.name}</li>`
      ).join('')
      }
    </ul>
    <a href="${result.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addComasToNumber(result.budget)}</li>
    <li><span class="text-secondary">Revenue:</span> $${addComasToNumber(result.revenue)}</li>
    <li><span class="text-secondary">Runtime:</span> ${result.runtime} minutes</li>
    <li><span class="text-secondary">Status:</span> ${result.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${result.production_companies.map(company =>
    company.name).join(', ')}</div>
</div>
  `;
  document.querySelector("#movie-details").appendChild(div);
}

async function showTVDetails(id) {
  const result  = await fetchAPIData(`tv/${id}`);

  console.log(result);

  displayBackgroundImage('tv', result.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
  <div class="details-top">
        <div>
        ${
          result.poster_path 
          ? `<img src="https://image.tmdb.org/t/p/w500${result.poster_path}"
          class="card-img-top" alt="${result.name}"/>` :
          `<img src="../images/no-image.jpg"
          class="card-img-top" alt="Movie Title"/>`
        }
        </div>
        <div>
          <h2>${result.name}</h2>
          <p>
            <i class="fas fa-star text-primary"></i>
            ${result.vote_average.toFixed(1)} / 10
          </p>
          <p class="text-muted">Air Date: ${result.first_air_date}</p>
          <p>
          ${result.overview}
          </p>
          <h5>Genres</h5>
          <ul class="list-group">
          ${
            result.genres.map((genre) => 
              `<li>${genre.name}</li>`
          ).join('')
          }
          </ul>
          <a href="${result.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
        </div>
      </div>
      <div class="details-bottom">
        <h2>Show Info</h2>
        <ul>
          <li><span class="text-secondary">Number Of Episodes:</span> ${result.number_of_episodes}</li>
          <li>
            <span class="text-secondary">Last Episode To Air:</span>  ${result.last_episode_to_air.name}
          </li>
          <li><span class="text-secondary">Status:</span> ${result.status}</li>
        </ul>
        <h4>Production Companies</h4>
        <div class="list-group">${result.production_companies.map(company =>
          company.name).join(', ')}</div>
      </div>
  `;
  document.querySelector("#show-details").appendChild(div);
}

function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

function addComasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      displaySlider();
      displayPopularMovies();
      break;
    case '/shows.html':
      displayPopularTvShows();
      break;
    case '/movie-details.html':
      showMovieDetails(global.id);
      break;
    case '/tv-details.html':
      showTVDetails(global.id);
      break;
    case '/search.html':
      search();
      break;
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
