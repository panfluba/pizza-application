import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';
import { Link, useNavigate } from 'react-router-dom';

import Categories from '../components/Categories';
import Sort, { list } from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination/Pagination';
import { SearchContext } from '../App';
import {
  selectFilter,
  setCategoryId,
  setCurrentPage,
  setFilters,
} from '../redux/slices/filterSlice';
import { fetchPizzas, selectPizzaData } from '../redux/slices/pizzaSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //хук доставания dispatch вместо store.dispatch и импорта
  //вытаскиваем значение categoryId и передаем в переменную
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  const sortType = sort.sortProperty;

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id)); //  при клике на категорию получаем id, передаем в хранилище redux возращаемый setCategory(id) объект
    // {type: 'filter/setCategoryId', payload: id}
  };

  const onChangePage = (num) => {
    dispatch(setCurrentPage(num));
  };

  const getPizzas = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        category,
        search,
        currentPage,
        sortType,
      }),
    );
    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    //сохранение URL параметров в redux
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));
      const sort = list.find((obj) => obj.sortProperty === params.sortProperty);

      dispatch(
        setFilters({
          ...params,
          sort,
        }),
      );
      isSearch.current = true;
    }
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    getPizzas();
  }, [categoryId, sortType, searchValue, currentPage]);

  React.useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });

      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sortType, searchValue, currentPage]);

  const skeletons = [...new Array(12)].map((_, id) => <Skeleton key={id} />);
  const pizzas = items
    .filter((obj) => obj.title.toLowerCase().includes(searchValue.trim().toLowerCase()))
    .map((value) => (
      <Link key={value.id} to={`/pizzas/${value.id}`}>
        <PizzaBlock {...value} />
      </Link>
    ));

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="cart--empty">
          <h2>
            Ошибка <>😕</>
          </h2>
          <p>
            К сожалению, не удалось получить пиццы.
            <br />
            Попробуйте повторить попытку позже.
          </p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
