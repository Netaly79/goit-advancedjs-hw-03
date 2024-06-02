import SlimSelect from 'slim-select';
import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { fetchBreeds, fetchCatByBreed } from './js/cat-api.js';

axios.defaults.headers.common['x-api-key'] =
  'live_6vEYdyqrWWmlLRh7wTSmN9YmDqFWmsIhbvPTsjZaX3cBV3miKzP6vjBVaX6xAXlK';

const slimSelect = new SlimSelect({
  select: '#selectElement',
});

const breedSelect = document.querySelector('.breed-select');
const catInfoDiv = document.querySelector('.cat-info');
const loader = document.querySelector('.loader-text');

document.addEventListener('DOMContentLoaded', async () => {
  if (!breedSelect) {
    iziToast.error({
      title: 'Ой! Помилка!',
      message: `Щось зломалось під час отримання інформації`,
      position: 'topCenter',
      timeout: 5000,
    });
    return;
  }

  try {
    loader.style.display = 'block';
    
    const breeds = await fetchBreeds();

    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      slimSelect.addOption(option);
      
    });
    breedSelect.classList.toggle("hidden");
  } catch (error) {
    iziToast.error({
      title: 'Ой! Помилка!  ',
      message: `Щось зломалось під час додавання породи у перелік`,
      position: 'topCenter',
      timeout: 5000,
    });
    console.error('Error populating breed select:', error);
  } finally {
    loader.style.display = 'none';
    breedSelect.style.visibility = 'visible';
  }

  breedSelect.addEventListener('change', async event => {
    const breedId = event.target.value;
    if (!breedId) return;

    loader.style.display = 'block';
    catInfoDiv.style.display = 'none';

    try {
      const catData = await fetchCatByBreed(breedId);

      if (catData.length > 0) {
        const cat = catData[0];
        const breed = cat.breeds[0];
        catInfoDiv.innerHTML = `
              <h2 class="breed-name">${breed.name}</h2>
              <div class="breed-info">
              <div class="breed-img"><img src="${cat.url}" alt="${breed.name}"></div>
              <div class="desc">
              <p class="label">Description:</p> <p class="desc-text"> ${breed.description}</p>
              <p class="label">Temperament:</p> <p class="desc-text"> ${breed.temperament}</p>
              </div>
              </div>
          `;
        loader.style.display = 'none';
        catInfoDiv.style.display = 'block';
      } else {
        iziToast.error({
          title: 'Ой! Помилка!',
          message: `Схоже, що інформація про цю породу засекречена`,
          position: 'topCenter',
          timeout: 5000,
        });
        loader.style.display = 'none';
      }
    } catch (error) {
      console.error('Error fetching cat data:', error);
      iziToast.error({
        title: 'Ой! Помилка!',
        message: `Головний котоексперт не відповідає. Спробуй ще раз`,
        position: 'topCenter',
        timeout: 5000,
      });
    }
  });
});
