import React from 'react';

import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination/Pagination';

const Home = ({ searchValue }) => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [categoryId, setCategoryId] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortType, setSortType] = React.useState({ name: 'популярности', sortProperty: 'rating' });

  React.useEffect(() => {
    setIsLoading(true);

    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';
    fetch(
      `https://665da1fee88051d6040799ed.mockapi.io/pizzas?page=${currentPage}&limit=8&${category}&sortBy=${sortType.sortProperty}&order=desc${search}`,
    )
      .then((res) => {
        return res.json();
      })
      .then((arr) => {
        setItems(arr);
        setIsLoading(false);
        console.log('Массив пицц', arr);
      });
    window.scrollTo(0, 0);
  }, [categoryId, sortType, currentPage, searchValue]);

  const skeletons = [...new Array(8)].map((_, id) => <Skeleton key={id} />);
  const pizzas = items
    .filter((obj) => obj.title.toLowerCase().includes(searchValue.trim().toLowerCase()))
    .map((value) => <PizzaBlock key={value.id} {...value} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={(id) => setCategoryId(id)} />
        <Sort value={sortType} onChangeSort={(id) => setSortType(id)} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination onChangePage={(num) => setCurrentPage(num)} />
    </div>
  );
};

export default Home;
