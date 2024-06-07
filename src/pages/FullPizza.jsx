import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const FullPizza = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pizza, setPizza] = React.useState('');

  React.useEffect(() => {
    async function fetchPizza() {
      try {
        const { data } = await axios.get(
          'https://665da1fee88051d6040799ed.mockapi.io/pizzas/' + id,
        );
        setPizza(data);
      } catch (error) {
        navigate('/');
      }
    }
    fetchPizza();
  }, []);
  if (!pizza) {
    return <h2>Загрузка...</h2>;
  }

  return (
    <div className="container">
      <img src={pizza.image} alt="pizza" />
      <h2>{pizza.title}</h2>
      <p>{pizza.description}</p>
      <h4>{pizza.price} р.</h4>
    </div>
  );
};

export default FullPizza;
