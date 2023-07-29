import Head from 'next/head';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/cart';

import { Box, Heading, Grid, CircularProgress, Container, Button, Divider, Text} from '@chakra-ui/react';

import CheckoutStepper from '../components/CheckoutStepper';
import ShippingAddressForm from '../components/ShippingAddressForm';
import PaymentForm from '../components/PaymentForm';
import Loading from '../components/Loading';

import commerce from '../lib/commerce';

const Checkout = () => {

  const router = useRouter();
  
  const {cart, setCart, isLoading} = useCart();
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [activeStep, setActiveStep] = useState(1);
  const [shippingData, setShippingData] = useState({});
  const [order, setOrder] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  async function generateToken(){
    try {
      const token = await commerce.checkout.generateToken(cart.id, {type: 'cart'});
      setCheckoutToken(token);
    } catch (error) {
      router.push('/');
    }
  }
  
  async function refreshCart(){
    const newCart = await commerce.cart.refresh();
    setCart(newCart);
  }

  async function onCaptureCheckout(checkoutTokenId, newOrder){
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);
      setOrder(incomingOrder);
      refreshCart();
    } 
    catch (error) {
      setErrorMessage(error.data.error.message);
    }
  }
  
  const nextStep = () => setActiveStep(prevActiveStep=>prevActiveStep + 1);
  const backStep = () => setActiveStep(prevActiveStep=>prevActiveStep - 1);
  
  function getShippingData(data){
    setShippingData(data);
    nextStep();
  }

  useEffect(()=>{
    generateToken();
  }, [cart]);

  function timeout(){
    setTimeout(()=>{
      setIsFinished(true);
      refreshCart();
    }, 7000);
  }

  if(isLoading || !checkoutToken) return (
    <Loading />
  )

  let Confirmation = () => order.customer ? 
  (
    <>
      <div>
        <Heading>Thank you for your purchase, {order.customer.firstname}</Heading>
        <Divider />
        <Text>Order ref: {order.customer_reference}</Text>
        <br/>
        <Button type='button' onClick={()=>{router.push('/')}}>Back to Home</Button>
      </div>
    </>
  )
  :
  isFinished ?
  (
    <>
      <div>
        <Heading fontSize={'2xl'}>Thank you for your purchase, {shippingData.firstName}!</Heading>
        <Divider />
        <Text mt={4}>Order ref: CMMRCJS-123192</Text>
        <br/>
        <Button type='button' colorScheme={'red'} onClick={()=>{router.push('/')}}>Back to Home</Button>
      </div>
    </>
  )
  :
  (
    <Grid w='full' justifyItems={'center'}>
      <CircularProgress isIndeterminate color='green.300' />
    </Grid>
  )

  if(errorMessage){
    <>
      <Heading>Error: {errorMessage}</Heading>
      <br/>
      <Button type='button' onClick={()=>{router.push('/')}}>Back to Home</Button>
    </>
  }

  const CheckoutStep = () => {
    switch(activeStep){
      case 2:
        return (
          <PaymentForm 
            checkoutToken={checkoutToken} 
            shippingData={shippingData}
            onCaptureCheckout={onCaptureCheckout}
            backStep={backStep}
            nextStep={nextStep}
            timeout={timeout}
        />)

      case 3:
        return (
          <Box py={10} px={{base: 4, md: 6}}>
            <Confirmation />
          </Box>
        )
      
      default:
        return (
          <ShippingAddressForm 
            checkoutToken={checkoutToken} 
            getShippingData={getShippingData}
            nextStep={nextStep}
          />
      )
    }
  }

  return (
    <Container maxW='container.xl'>
      <Box w='full' h='full' mb={12}>
        <Head>
          <title>Kommerce | Checkout</title>
          <meta name="description" content="Kommerce checkout page" />
        </Head>
        <Heading textAlign={'center'} fontSize={'4xl'} py={8}>
          Checkout
        </Heading>

        <CheckoutStepper activeStep={activeStep}/>
        
        <Box bg={'whiteAlpha.200'} h='full' rounded='md' maxW={'40rem'} mx='auto'>
          <CheckoutStep />
        </Box>
      </Box>
    </Container>
  )
};

export default Checkout;