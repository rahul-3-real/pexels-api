const gallery = document.querySelector(".gallery");
const searchForm = document.querySelector(".search");
const searchInput = document.querySelector(".search input");
const moreBtn = document.querySelector(".btn");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;

const API_KEY = `563492ad6f917000010000013bbb44b94bd840c1936263d7c49e7c36`;

const fetchApi = async (url) => {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: API_KEY,
    },
  });

  const data = await dataFetch.json();
  return data;
};

const generateImages = (data) => {
  data.photos.forEach((photo) => {
    const image = document.createElement("div");
    image.classList.add("item");
    image.innerHTML = `
      <div class="image">
        <img src="${photo.src.large}" alt="${photo.photographer} - ${photo.id}" />
      </div>
      <div class="info">
        <h6>
          ${photo.photographer}
        </h6>
        <a href="${photo.src.original}" target="_blank" download>
          Download
        </a>
      </div>
    `;
    gallery.appendChild(image);
  });
};

const clearGallery = () => {
  gallery.innerHTML = "";
  searchInput.value = "";
};

const curatedPhotos = async () => {
  clearGallery();
  fetchLink = "https://api.pexels.com/v1/curated?per_page=16&page=1";
  const data = await fetchApi(fetchLink);
  generateImages(data);
};

const searchPhotos = async (query) => {
  clearGallery();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=16&page=1`;
  const data = await fetchApi(fetchLink);
  generateImages(data);
};

const updateInput = (e) => {
  searchValue = e.target.value;
};

const loadMore = async () => {
  page++;
  if (currentSearch) {
    query = currentSearch;
    fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=16&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=16&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generateImages(data);
};

curatedPhotos();
searchInput.addEventListener("input", updateInput);
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});
moreBtn.addEventListener("click", loadMore);
