import Product from './components/Product/Product';
import { products } from './products';
import './App.css';

function App() {
  const shopName = "Shop";

  return (
    <div className="app-container">
      <header>
        <h1>{shopName}</h1>
        <p>Ласкаво просимо до нашого магазину!</p>
      </header>

      <main className="product-list">
        {products.map((product) => (
          <Product 
            key={product.id} 
            title={product.title} 
            price={product.price} 
            img={product.img} 
          />
        ))}
      </main>
    </div>
  );
}

export default App;