import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../context/cart';

import { Box, Flex, Container, Heading, Text, Button, Table, Thead, Tr, Tbody, Th, useBreakpointValue, useToast, CircularProgress, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Grid, SimpleGrid } from '@chakra-ui/react';
import CartItem from '../components/CartItem';

import emptyCart from '../public/images/empty_cart.svg';

import commerce from '../lib/commerce';
import Head from 'next/head';
import Image from 'next/image';
import Loading from '../components/Loading';

const CartPage = () => {

  const {cart, setCart, isLoading} = useCart();
  const toast = useToast();
  const router = useRouter();

  const responsiveQuantityWord = useBreakpointValue({base: 'Qty', sm: 'Quantity'});

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onAlertClose = () => setIsAlertOpen(false);
  const cancelRef = useRef();

  async function refreshCart(){
    let title, status, description;

    try{
      const {cart: newCart} = await commerce.cart.refresh();
      setCart(newCart);

      title='Cart Emptied';
      status='success';
      description='The cart has been reset successfully.';
    }
    catch(error){
      title = 'Error!';
      status = 'error';
      description = 'An error has ocurred. Pleaase, try again later.'
    }
    
    toast({
      title,
      status,
      description,
      duration: 3000,
      isClosable: true,
    })
  }

  const isEmpty = !isLoading && !cart?.line_items.length;

  if(isLoading) return (
    <Loading />
  )

  const EmptyCart = () => {
    return (
      <SimpleGrid h='full' w='full' columns={{base: 1, lg: 2}}>
        <Box 
          bg='white' 
          h='full' 
          position={'relative'} 
          display={{base: 'none', lg: 'block'}}
        >
          <Image 
            src={emptyCart}
            alt='Empty cart'
            layout='fill'
            objectFit='contain'
          />
        </Box>

        <Flex px={4} direction={'column'} alignItems={'center'} justifyContent={'space-evenly'}>
          <Heading
            as='h1'
            textAlign={'center'}
            size={useBreakpointValue({ base: 'xl', sm: '2xl' })}
          >
            Your cart is empty
          </Heading>
          <Text
            fontSize={{ base: 'lg', sm: 'xl' }}
            textAlign={'center'}
          >
            Return home to start adding some products!
          </Text>
          <Button colorScheme={'red'} onClick={()=>router.push('/')}>Back to Home</Button>
        </Flex>
      </SimpleGrid>
    )
  }

  const FilledCart = () => (
    <>
    <Grid minH={'full'} gap={8}>  
      <Box h={'4.5rem'} bg={'whiteAlpha.200'} rounded={'sm'}>
        <Container h='full' maxW={{base: 'container.xl', md: 'container.lg'}} display={'flex'} alignItems={'center'}>
          <Heading size={'lg'}>Your Cart</Heading>
        </Container>
      </Box>

      <Flex flex={1} direction={'column'} justifyContent={'space-around'} gap={8}>  
        <Container maxW={{base: 'container.xl', md: 'container.lg'}}>
          <Table p={4} size={{base: 'sm', md: 'md'}}>
            <Thead>
              <Tr bg='orange.600'>
                <Th></Th>
                <Th textAlign={'left'} color='white'>Product</Th>
                <Th textAlign={'left'} color='white'>Price</Th>
                <Th textAlign={{base: 'center', sm: 'left'}} color='white'>{responsiveQuantityWord}</Th>
                <Th textAlign={'left'} color='white'>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cart?.line_items.map(item =><CartItem key={item.id} {...item} setCart={setCart}/>)}
            </Tbody>
          </Table>
        </Container>

        <Container maxW={{base: 'container.xl', md: 'container.lg'}}>
          <Flex 
            justifyContent={'space-between'} 
            bg={'whiteAlpha.200'}
            py={4}
            px={{base: 2, sm: 4, md: 8}}
            rounded={'md'}
            fontSize={'xl'}
            fontWeight={'bold'}
          >
            <Text>Subtotal:</Text>
            <Text>{cart?.subtotal.formatted_with_symbol}</Text>
          </Flex>
        </Container>

        <Container maxW={{base: 'container.xl', md: 'container.lg'}} mb={8}>
          <Flex direction={{base: 'column', sm: 'row'}} justifyContent={{base: 'initial', sm: 'space-between'}} gap={2}>
            <Button 
              w={{base: 'full', sm: 'fit-content'}}
              colorScheme={'yellow'}
              onClick={()=>{setIsAlertOpen(true)}}
            >
              Empty Cart
            </Button>
            <Button 
              w={{base: 'full', sm: 'fit-content'}} 
              colorScheme={'blue'} 
              onClick={()=>{router.push('/checkout')}}
            >
              Go to Checkout
            </Button>
          </Flex>
        </Container>

        <AlertDialog
          isOpen={isAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={onAlertClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Empty Cart
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onAlertClose}>
                  Cancel
                </Button>
                <Button colorScheme='yellow' onClick={refreshCart} ml={3}>
                  Yes, empty it
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>
    </Grid>
  </>
)

  return (
    <Box h='full' w='full'>
      <Head>
        <title>Kommerce | Cart</title>
        <meta name="description" content="Your Kommerce Shopping Cart." />
      </Head>
      {isEmpty ? <EmptyCart /> : <FilledCart />}
    </Box>
  )
};

export default CartPage;