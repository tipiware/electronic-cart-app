import { CheckIcon } from '@chakra-ui/icons';
import { Divider, Flex, Grid, Text } from '@chakra-ui/react';

const CheckoutStepper = ({activeStep}) => {

  return (
    <Flex
      bg={'whiteAlpha.300'} 
      w='full' 
      maxW={'40rem'} 
      mx='auto' 
      mb={8}
      p={2}
      justifyContent={'space-between'}
      rounded='md'
    >
      <Flex p={2} px={4} gap={2} alignItems={'center'}>
        <Grid placeItems={'center'} bg={'blue.600'} w={7} h={7} rounded='full'>
          {activeStep > 1 ? <CheckIcon /> : 1}
        </Grid>
        <Text mt={1} fontWeight={'semibold'}>Shipping Address</Text>
      </Flex>
      <Grid placeItems={'center'} flex={1}>
        <Divider />
      </Grid>
      <Flex p={2} px={4} gap={2} alignItems={'center'}>
        <Grid placeItems={'center'} bg={activeStep > 1 ? 'blue.600' : 'whiteAlpha.400'} w={7} h={7} rounded='full'>
          {activeStep > 2 ? <CheckIcon/> : 2 }
        </Grid>
        <Text mt={1} fontWeight={'semibold'}>Payment details</Text>
      </Flex>
    </Flex>
  )
};

export default CheckoutStepper;