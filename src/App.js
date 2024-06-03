import './App.css';
import './scss/app.scss';

import React from 'react';
import Header from './components/Header';
import Categories from './components/Categories';
import Sort from './components/Sort';
import PizzaBlock from './components/PizzaBlock';
import Skeleton from './components/PizzaBlock/Skeleton';
// import pizzas from './assets/pizzas.json';

function App() {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('https://665da1fee88051d6040799ed.mockapi.io/pizzas')
      .then((res) => {
        return res.json();
      })
      .then((arr) => {
        setItems(arr);
        setIsLoading(false);
        console.log('Массив пицц', arr);
      });
  }, []);

  return (
    <div className="wrapper">
      <Header />
      <div className="content">
        <div className="container">
          <div className="content__top">
            <Categories />
            <Sort />
          </div>
          <h2 className="content__title">Все пиццы</h2>
          <div className="content__items">
            {isLoading
              ? [...new Array(8)].map((_, id) => <Skeleton key={id} />)
              : items.map((value) => <PizzaBlock key={value.id} {...value} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
