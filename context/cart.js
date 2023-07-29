import { createContext, useContext, useEffect, useState } from 'react';
import commerce from '../lib/commerce';

const cartContext = createContext();

export const CartProvider = ({children}) => {

  const [cart, setCart] = useState();
  const [isLoading, setIsLoading] = useState(true);
  
  async function getCart(){

    try{
      const cart = await commerce.cart.retrieve();
      setCart(cart);
    }
    catch(error){
      console.log(error);
    }

    setIsLoading(false);
  }

  useEffect(()=>{
    getCart();
  },[])

  return(
    <cartContext.Provider value={
      {
        cart,
        setCart,
        isLoading
      }
    }
    >
      {children}
    </cartContext.Provider>
  )
}

export const useCart = () => useContext(cartContext);