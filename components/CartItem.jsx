import { useRef, useState } from 'react';
import NextLink from 'next/link';

import Image from 'next/image';
import { Box, Flex, Text, Link, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Button, IconButton, Tooltip, Tr, Td, useToast, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

import commerce from '../lib/commerce';

const CartItem = ({id, image, name, price, quantity, permalink, line_total, setCart}) => {

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const onAlertClose = () => setIsAlertOpen(false);
  const cancelRef = useRef();

  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

  const toast = useToast();

  async function removeItem(){
    let title='success', status='success', description;

    try{
      const {cart: updatedCart} = await commerce.cart.remove(id);
      setCart(updatedCart);
      description=`${name} has been succesfully removed.`
    }
    catch(error){
      console.log(error);
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

  async function updateItemQuantityOnClick(newQuantity){
    setIsUpdatingQuantity(true);
    if(newQuantity == 0) {setIsAlertOpen(true)}
    else{
      const {cart: updatedCart} = await commerce.cart.update(id, {quantity: newQuantity});
      setCart(updatedCart);
      setCurrentQuantity(quantity);
    }
    setIsUpdatingQuantity(false);
  }

  async function updateItemQuantityWithInput(){
    if(currentQuantity === quantity) return    
    if(currentQuantity == 0) return setIsAlertOpen(true);
    
    setIsUpdatingQuantity(true);
    const {cart: updatedCart} = await commerce.cart.update(id, {quantity: currentQuantity});
    setCart(updatedCart);
    setIsUpdatingQuantity(false);
  }

  function cancelRemoval(){
    setCurrentQuantity(quantity);
    onAlertClose();
  }

  return(
    <>
      <Tr bg='gray.800' rounded='md' px={4}>
        <Td maxW={'fit-content'}>
          <Flex pl={2} alignItems={'center'} gap={8}>
            <Tooltip label='Remove item'>
              <IconButton
                aria-label='Remove item' 
                icon={<CloseIcon/>} 
                size='sm'
                onClick={()=>setIsAlertOpen(true)}
              />
            </Tooltip>
            <Box display={{base: 'none', md: 'block'}}>
              <NextLink href={`products/${permalink}`} passHref>
                <Link as='a'>
                  <Box h={16} w={16} position={'relative'} overflow={'hidden'}>
                    <Image 
                      src={image.url} 
                      layout='fill'
                      alt={name}
                      objectFit='cover'
                    />
                  </Box>
                </Link>
              </NextLink>
            </Box>
          </Flex>
        </Td>
        <Td>
          <NextLink href={`products/${permalink}`} passHref>
            <Link as='a'>
              <Text color='orange.400' fontWeight={'bold'} textAlign={'left'}>{name}</Text>
            </Link>
          </NextLink>
        </Td>
        <Td>
          <Text color='orange.400' fontWeight={'bold'} textAlign={'left'}>{price.formatted_with_symbol}</Text>
        </Td>
        <Td>
          <Box>
            <NumberInput 
              bg={'gray.700'}
              mx={{base: 'auto', sm: '0'}} 
              maxW={{base: '4rem', sm: '6rem'}} 
              rounded='md' 
              min={0} 
              max={30}
              value={currentQuantity}
              isDisabled={isUpdatingQuantity}
              onBlur={updateItemQuantityWithInput}
            >
              <NumberInputField textAlign={'center'} color='white' fontWeight={'bold'} onChange={(e)=>setCurrentQuantity(e.target.value)}/>
              <NumberInputStepper bg='transparent'>
                <NumberIncrementStepper onClick={()=>{updateItemQuantityOnClick(quantity+1)}}/>
                <NumberDecrementStepper onClick={()=>{updateItemQuantityOnClick(quantity-1)}}/>
              </NumberInputStepper>
            </NumberInput>
          </Box>
        </Td>
        <Td>
          <Text color='orange.400' fontWeight={'bold'} textAlign={'left'}>{line_total.formatted_with_symbol}</Text>
        </Td>
      </Tr>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Remove {name}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={cancelRemoval}>
                Cancel
              </Button>
              <Button colorScheme='yellow' onClick={removeItem} ml={3}>
                Yes, remove it
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default CartItem;