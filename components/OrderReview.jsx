import Image from 'next/image';
import { Box, Heading, Flex, Text, Badge, Stack, Divider} from '@chakra-ui/react';

const OrderReview = ({checkoutToken, shippingData}) => {
  return (
    <Stack 
      as='section' 
      direction='column'
      w='full'
      py={10}
      px={{base: 4, md: 6}}
      spacing={10} 
      alignItems={'flex-start'}
    >
      <Heading fontSize={'2xl'}>Order Summary</Heading>
      <Stack direction='column' w='full' spacing={3}>
        {
          checkoutToken.live.line_items.map(item=>(
            <Box w='full' key={item.id}>
              <Flex w='full' justifyContent={'space-between'} alignItems={'center'}>
                <Stack direction={'row'} spacing={3} alignItems={'center'}>
                  <Box h={12} w={12} position={'relative'} overflow={'hidden'}>
                    <Image 
                      src={item.image.url} 
                      layout='fill'
                      alt={item.name}
                      objectFit='cover'
                    />
                  </Box>
                  <Badge colorScheme={'yellow'} fontSize={'xl'}>{item.quantity}</Badge>
                  <Text fontWeight={'bold'}>{item.name}</Text>
                </Stack>
                <Text fontWeight={'bold'}>{item.line_total.formatted_with_symbol}</Text>
              </Flex>
              <Divider />
            </Box>
          ))
        }
        <Flex w='full' justifyContent={'space-between'} fontWeight={'bold'}>
          <Text>Subtotal</Text>
          <Text>{checkoutToken.live.subtotal.formatted_with_symbol}</Text>
        </Flex>
        <Flex w='full' justifyContent={'space-between'} fontWeight={'bold'}>
          <Text>Shipping</Text>
          <Text>{`$${Number(shippingData.shippingOptionPrice).toFixed(2)}`}</Text>
        </Flex>
        <Flex w='full' justifyContent={'space-between'} fontWeight={'bold'}>
          <Text fontWeight={'bold'}>Taxes (estimated)</Text>
          <Text>$0.00</Text>
        </Flex>
        <Divider />
        <Flex w='full' fontSize={'2xl'} justifyContent={'space-between'} fontWeight={'bold'}>
          <Text>Total</Text>
          <Text>
            {
              shippingData.shippingOptionPrice === 0
              ? checkoutToken.live.subtotal.formatted_with_symbol
              : `$${Number(checkoutToken.live.subtotal.raw + shippingData.shippingOptionPrice).toFixed(2)}`
            }
          </Text>
        </Flex>
      </Stack>
    </Stack>
  )
};

export default OrderReview;