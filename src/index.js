import './css/styles.css';
import ImgApiService from './api-service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import InfiniteScroll from 'infinite-scroll';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');

const imgApi = new ImgApiService();

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(e) {
  e.preventDefault();
  clearGallery();
  hideLoadMoreBtn();
  imgApi.resetPage();

  imgApi.searchQuery = e.currentTarget.elements.searchQuery.value.trim();

  if (imgApi.searchQuery === '') {
    Notify.info('Enter your search query');
    return;
  }
  try {
    const gallery = await imgApi.fetchImages();

    if (gallery.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      showTotalHits(gallery.totalHits);
      createGallery(gallery);
      showLoadMoreBtn();
    }
  } catch (err) {
    console.log(err);
  } finally {
    form.reset();
  }
}

function createMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<a href =${largeImageURL} class="photo-card gallery__item">
  <img src=${webformatURL} alt=${tags} loading="lazy" class="gallery__image"/>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${downloads}
    </p>
  </div>
</a>`;
}

function createGallery(gallery) {
  const markup = gallery.hits.reduce(
    (markup, element) => createMarkup(element) + markup,
    ''
  );
  document.querySelector('.gallery').insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearGallery() {
  document.querySelector('.gallery').innerHTML = '';
}

function showLoadMoreBtn() {
  loadMoreBtn.classList.remove('is-hidden');
}

function hideLoadMoreBtn() {
  loadMoreBtn.classList.add('is-hidden');
}

function showTotalHits(totalHits) {
  Notify.success(`'Hooray! We found ${totalHits} images.'`);
}

async function onLoadMoreBtnClick() {
  const gallery = await imgApi.fetchImages();
  createGallery(gallery);

  const lastPage = Math.ceil(gallery.totalHits / imgApi.perPage + 1);

  if (imgApi.page >= lastPage) {
    hideLoadMoreBtn();
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
