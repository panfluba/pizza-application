import React from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination/Pagination';
import { SearchContext } from '../App';
import { setCategoryId, setCurrentPage } from '../redux/slices/filterSlice';

const Home = () => {
  const dispatch = useDispatch(); //хук доставания dispatch вместо store.dispatch и импорта
  //вытаскиваем значение categoryId и передаем в переменную
  const { categoryId, sort, currentPage } = useSelector((state) => state.filter);
  const sortType = sort.sortProperty;

  const onChangeCategory = (id) => {
    // при клике на категорию получаем id
    dispatch(setCategoryId(id)); // передаем в хранилище redux возращаемый setCategory(id) объект
    // {type: 'filter/setCategoryId', payload: id}
  };

  const onChangePage = (num) => {
    dispatch(setCurrentPage(num));
  };

  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const { searchValue } = React.useContext(SearchContext);

  React.useEffect(() => {
    setIsLoading(true);
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    axios
      .get(
        `https://665da1fee88051d6040799ed.mockapi.io/pizzas?page=${currentPage}&limit=12&${category}&sortBy=${sortType}&order=desc${search}`,
      )
      .then((responce) => {
        setItems(responce.data);
        setIsLoading(false);
      });

    window.scrollTo(0, 0);
  }, [categoryId, sortType, searchValue, currentPage]);

  const skeletons = [...new Array(12)].map((_, id) => <Skeleton key={id} />);
  const pizzas = items
    .filter((obj) => obj.title.toLowerCase().includes(searchValue.trim().toLowerCase()))
    .map((value) => <PizzaBlock key={value.id} {...value} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
