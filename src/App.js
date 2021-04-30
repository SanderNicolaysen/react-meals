import { useState } from 'react';
import Header from './components/Layout/Header';
import Meals from './components/Meals/Meals';
import Cart from './components/Cart/Cart';

function App() {
  const [cartIsShown, setCartIsShown] = useState(false);

  const showCartHandler = () => {
    setCartIsShown(true);
  }

  const closeCartHandler = () => {
    setCartIsShown(false);
  }

  return (
    <>
        {cartIsShown && <Cart onCloseCart={closeCartHandler}/>}
        <Header onShowCart={showCartHandler}/>
        <main>
          <Meals />
        </main>
    </>
  );
}

export default App;
