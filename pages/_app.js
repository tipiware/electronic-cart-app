import { ChakraProvider } from '@chakra-ui/react';
import Layout from '../components/Layout';
import { CartProvider } from '../context/cart';

export default function App({Component, pageProps}){


  return (
    <CartProvider>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps}/>
        </Layout>
      </ChakraProvider>
    </CartProvider> 
  )
};