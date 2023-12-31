import { useEffect, useState } from 'react';
import { Button } from './Button/Button';
import { GlobalStyle, Thumb } from './GlobalStyle';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';
import { Loader } from './Loader/Loader';
import { ToastContainer } from 'react-toastify';
import { success, error, warn, info, empty } from '../services/toasts';
import { fetchImages } from '../services/api';
import { nanoid } from 'nanoid';

export const App = () => {
  const [search, setSearch] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalImg, setTotalImg] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (search === '') {
      return;
    }

    const mainSearch = search.slice(9);
    setIsLoading(true);

    setTimeout(async () => {
      try {
        const { hits, totalHits } = await fetchImages(mainSearch, page);
        if (totalHits !== 0 && page === 1) {
          success(totalHits);
        } else if (totalHits === 0) {
          empty();
        }

        setImages(prevImages => [...prevImages, ...hits]);
        setTotalImg(totalHits);
      } catch (err) {
        console.error(err);
        error();
      } finally {
        setIsLoading(false);
      }
    }, 800);
  }, [search, page]);

  useEffect(() => {
    if (images.length === totalImg && totalImg > 0 && page !== 1) {
      info();
    }
  }, [images.length, page, totalImg]);

  const onSubmitSearch = e => {
    e.preventDefault();
    const currentSearch = e.target.elements.search.value.trim();

    if (currentSearch === '') {
      warn();
      return;
    }

    onChangeSearch(currentSearch);
  };

  const onChangeSearch = newSymbol => {
    setImages([]);
    setPage(1);
    setTotalImg(0);
    setSearch(`${nanoid(8)}/${newSymbol}`);
  };

  const onChangePage = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <Thumb>
      <Searchbar onSubmit={onSubmitSearch} />
      <ImageGallery images={images} />
      {isLoading && <Loader />}
      {images.length !== 0 && images.length < totalImg ? (
        <Button changePage={onChangePage} />
      ) : null}
      <ToastContainer />
      <GlobalStyle />
    </Thumb>
  );
};
