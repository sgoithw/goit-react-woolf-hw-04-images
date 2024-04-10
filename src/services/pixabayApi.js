import axios from 'axios';

const API_KEY = '42188159-1454a2852e4ff5c9e0320bde0';
const BASE_URL = 'https://pixabay.com/api/';

function searchImages({ query, page = 1, per_page = 40 }) {
  const apiQuery = new URLSearchParams({
    q: query,
    page,
    per_page,
    key: API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  return axios.get(`${BASE_URL}?${apiQuery}`);
}

export { searchImages };
