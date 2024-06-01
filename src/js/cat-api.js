import axios from 'axios';
axios.defaults.headers.common['x-api-key'] =
  'live_6vEYdyqrWWmlLRh7wTSmN9YmDqFWmsIhbvPTsjZaX3cBV3miKzP6vjBVaX6xAXlK';

export async function fetchBreeds() {
  const url = 'https://api.thecatapi.com/v1/breeds';

  try {
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.error('Сталася помилка при отриманні:', error);
    throw error;
  }
}

export async function fetchCatByBreed(breedId) {
  try {
    const response = await axios.get(
      'https://api.thecatapi.com/v1/images/search',
      {
        params: { breed_ids: breedId },
      }
    );
  
    return response.data;
  } catch (error) {
    console.error('Failed to fetch cat by breed:', error);
    throw error;
  }
}
