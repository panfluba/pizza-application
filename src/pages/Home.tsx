import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Categories from '../components/Categories';
import Sort, { list } from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination/Pagination';
import {
  selectFilter,
  setCategoryId,
  setCurrentPage,
  setFilters,
} from '../redux/slices/filterSlice';
import { TSearchPizzasParams, fetchPizzas, selectPizzaData } from '../redux/slices/pizzaSlice';
import { useAppDispatch } from '../redux/store';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  //хук доставания dispatch вместо store.dispatch и импорта
  //вытаскиваем значение categoryId и передаем в переменную
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  const sortType = sort.sortProperty;

  const onChangeCategory = React.useCallback((index: number) => {
    dispatch(setCategoryId(index));
  }, []);
  //  при клике на категорию получаем id, передаем в хранилище redux возращаемый setCategory(id) объект
  // {type: 'filter/setCategoryId', payload: id}

  const onChangePage = (num: number) => {
    dispatch(setCurrentPage(num));
  };

  const getPizzas = async () => {
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchPizzas({
        sortType,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );
    window.scrollTo(0, 0);
  };

  // React.useEffect(() => {
  //   if (isMounted.current) {
  //     const queryString = qs.stringify(
  //       {
  //         sortProperty: sort.sortProperty,
  //         categoryId: categoryId > 0 ? categoryId : null,
  //         currentPage,
  //       },
  //       { skipNulls: true },
  //     );

  //     navigate(`?${queryString}`);
  //   }

  //   if (!window.location.search) dispatch(fetchPizzas({} as TSearchPizzasParams));
  // }, [categoryId, sortType, searchValue, currentPage]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    getPizzas();
  }, [categoryId, sortType, searchValue, currentPage]);

  // React.useEffect(() => {
  //   //сохранение URL параметров в redux
  //   if (window.location.search) {
  //     const params = qs.parse(
  //       window.location.search.substring(1) as unknown as TSearchPizzasParams,
  //     );
  //     const sort = list.find((obj) => obj.sortProperty === params.sortType);

  //     dispatch(
  //       setFilters({
  //         searchValue: params.search,
  //         categoryId: Number(params.category),
  //         currentPage: Number(params.currentPage),
  //         sort: sort || list[0],
  //       }),
  //     );
  //   }

  //   isMounted.current = true;
  // }, []);

  const skeletons = [...new Array(12)].map((_, id) => <Skeleton key={id} />);
  const pizzas = items
    .filter((obj: any) => obj.title.toLowerCase().includes(searchValue.trim().toLowerCase()))
    .map((value: any) => <PizzaBlock key={value.id} {...value} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort value={sort} />
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
      {categoryId === 0 && <Pagination currentPage={currentPage} onChangePage={onChangePage} />}
    </div>
  );
};

export default Home;
