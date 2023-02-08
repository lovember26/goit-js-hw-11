const API = 'https://pixabay.com/api/';
const API_KEY = '33416978-83b6039768e3c677abe323884';
import axios from 'axios';

export default class ImgApiService {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.perPage = 40;
  }
  async fetchImages() {
    const response = await axios.get(
      `${API}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`
    );
    this.incrementPage();
    return response.data;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
