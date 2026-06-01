import { useState } from 'react';
import ProductTitle from '../ProductTitle/ProductTitle';

function Product({ title, price, img }) {
  const [count, setCount] = useState(0);

  const handleBuy = () => {
    setCount(count + 1);
  };

  return (
    <div className="product-card">
      <img src={img} alt={title} className="product-image" />
      <ProductTitle title={title} />
      <p className="product-price">Ціна: {price} грн</p>
      
      <p className="product-count">Куплено: <strong>{count}</strong></p>
      
      <button className="buy-button" onClick={handleBuy}>
        Купити
      </button>
    </div>
  );
}

export default Product;