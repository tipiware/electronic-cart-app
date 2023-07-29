import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '../../context/cart';

import Head from 'next/head';
import Image from 'next/image';
import {Box, Grid, Heading, Text, Flex, Button, useToast, Tooltip, Badge, Icon, Container, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, CircularProgress} from '@chakra-ui/react';
import Loading from '../../components/Loading';

import { StarIcon } from '@chakra-ui/icons';
import { FaShoppingCart } from 'react-icons/fa';

import commerce from '../../lib/commerce';


export async function getStaticProps({params}){

  const {permalink} = params;

  const product = await commerce.products.retrieve(permalink, {
    type: "permalink",
  })

  return {
    props:{
      product,
    }
  }
}

export async function getStaticPaths(){
  const {data: products} = await commerce.products.list();

  return {
    paths: products.map(product=>({
      params: {
        permalink: product.permalink,
      }
    })),

    fallback: false,
  }
}

const ProductPage = ({product: {id, name, description, price, image, categories}}) => {
  const router = useRouter();
  const toast = useToast();
  
  const {cart, setCart, isLoading} = useCart();
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(true); 

  useEffect(()=>{
    if(!isLoading){
      const cartContainsProduct = cart?.line_items.some(p=>p.product_id === id);
      const productQuantity = (
        cartContainsProduct ? cart?.line_items.find(p=>p.product_id === id).quantity : 0
      );
      setCurrentQuantity(productQuantity);
      setIsPageLoading(false);
    }
  }, [isLoading])    

  async function addToCart() {
    let title='Success', status='success', description;

    const product = cart?.line_items?.find(item=>item.product_id === id) ?? null;
    const storedQuantity = product?.quantity ?? 0;
    const item = product?.id;

    if(currentQuantity === 0){
      title = 'Error!';
      status = 'error';
      description = `You need to specify a quantity (greater than 0) of this product before add to cart.`
      setCurrentQuantity(storedQuantity)
    }

    else if(storedQuantity > 0 && currentQuantity === storedQuantity){
      title='Warning!';
      status='warning';
      description='Quantity has not been changed!';
    }

    else if(storedQuantity === 0 && currentQuantity > 0){
      const {cart} = await commerce.cart.add(id, currentQuantity);
      setCart(cart);
      description = `${name} has been added to your cart.`;
    }

    else if(storedQuantity > 0 && currentQuantity !== storedQuantity){
      const {cart} = await commerce.cart.update(item, { quantity: currentQuantity });
      setCart(cart);
      description = `Your cart has been successfully updated!`
    }

    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    })

    currentQuantity > 0 && router.push('/cart');
  }

  if(isPageLoading) return <Loading />

  return(
    <Container h='full' maxW='container.xl' py={{base: 4, md: 0}}>
      <Head>
        <title>Kommerce | {name}</title>
        <meta name="description" content='Kommerce product page' />
      </Head>
      <Grid h='full' templateColumns={{base: '1fr', md: '1fr 1fr'}} rounded='md' bg={'whiteAlpha.100'}>
        <Box minH={{base: 'xs', md: 'full'}} position={'relative'} overflow={'hidden'} roundedLeft={'md'} roundedRight={{base: 'md', md: 'none'}}>
          <Image
            src={image.url}
            layout='fill'
            alt={name}
            objectFit='cover'
          />
        </Box>
        <Container maxW={{base: 'full', md: 'container.xl'}} p={4}>
          <Flex h={{base: 'full'}} py={{base: 4, md: 8}} px={0} direction={'column'}>
            <Box mb={8}>
              <Heading as='h1' size={'xl'}>{name}</Heading>
              <Badge maxW='fit-content' colorScheme='orange' variant='solid' pt={0.5}>{categories[0]?.name}</Badge>
              <Box maxW='fit-content'>
                <Tooltip label='5 out of 5 stars'>
                  <Box display='flex' alignItems='center' maxW={'fit-content'} h='full'>
                    {Array(5)
                      .fill('')
                      .map((_, i) => (
                        <StarIcon
                          key={i}
                          color={'orange.400'}
                        />
                      ))
                    }
                    <Text mt={2} ml={2}>10 reviews</Text>
                  </Box>
                </Tooltip>
              </Box>
            </Box>
      
            <Box mb={8} color={'gray.300'} fontSize={'lg'}>
              <Box dangerouslySetInnerHTML={{__html: description}}/>
              <Box maxW={{base: 'full', sm: 'md'}}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor veniam repellendus cupiditate autem, ab laudantium in. Corporis provident obcaecati aut.
              </Box>
            </Box>
      
            <Box mb={{base: 8, md: 16}}>
              <Flex justifyContent={'space-between'} direction={{base: 'row', md: 'column'}}>
                <Flex gap={2} alignItems={'center'}>
                  <Text pt={0.5} fontSize='2xl' color={'orange.300'}>{price.formatted_with_symbol}</Text>
                  <Badge colorScheme='orange' fontSize={'lg'}>50%</Badge>
                </Flex>
                <Text as='del' color='gray.400' display={'block'} fontSize={'lg'} fontWeight={'semibold'}>{`$${(price.raw * 2).toFixed(2)}`}</Text>
              </Flex>
            </Box>
            <Flex direction={{base: 'column', md: 'row'}} gap={2} mb={4}>
              <NumberInput value={currentQuantity} max={30} min={0} rounded='md' bg={'gray.600'}>
                <NumberInputField textAlign={'center'} color='white' fontWeight={'bold'} onChange={(e)=>setCurrentQuantity(Number(e.target.value))}/>
                <NumberInputStepper bg='transparent'>
                  <NumberIncrementStepper onClick={()=>{setCurrentQuantity(prevQt=>prevQt + 1)}}/>
                  <NumberDecrementStepper onClick={()=>{currentQuantity > 0 && setCurrentQuantity(prevQt=>prevQt - 1)}}/>
                </NumberInputStepper>
              </NumberInput>
              <Button colorScheme={'yellow'} onClick={addToCart} w='full'>
                <Flex gap={2} alignItems={'center'}>
                  <Icon as={FaShoppingCart} h={5} w={5}/>
                  <Text mt={1}>Add to Cart</Text>
                </Flex>
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Grid>
    </Container>
  )
}

export default ProductPage;