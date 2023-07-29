import NextLink from 'next/link';
import Image from 'next/image';
import {Text, Box, Tooltip, Link, Flex} from '@chakra-ui/react';
import {StarIcon} from '@chakra-ui/icons';

const Product = ({name, price, image, permalink}) => {

  return (
    <Box as='article' boxShadow={'lg'} p={3} bg={'gray.800'} rounded='md'>
      <NextLink href={`products/${permalink}`} passHref>
        <Link as='a'>
          <Box minH={'xs'} position={'relative'} rounded={'md'} overflow={'hidden'}>
            <Image 
              src={image.url} 
              layout='fill'
              alt={name}
              objectFit='cover'
            />
          </Box>
        </Link>
      </NextLink>
      <Flex justifyContent='space-between' mt={2} mb={1}>
        <NextLink href={`products/${permalink}`} passHref>
          <Link as='a' color='red.400' fontSize={'xl'} fontWeight={'bold'}>
            {name}
          </Link>
        </NextLink>
        <NextLink href={`products/${permalink}`} passHref>
          <Link as='a' _hover={{textDecoration: 'none'}}>
            <Text color='red.400' fontSize={'lg'} fontWeight={'semibold'}>{price.formatted_with_symbol}</Text>
          </Link>
        </NextLink>
      </Flex>
      <Box maxW='fit-content'>
        <NextLink href={`products/${permalink}`} passHref>
          <Link as='a'>        
            <Tooltip label={`5 out of 5 stars`}>
              <Box display='flex' mb={3} alignItems='center' maxW={'fit-content'}>
                {Array(5)
                  .fill('')
                  .map((_, i) => (
                    <StarIcon
                      key={i}
                      color={'orange.400'}
                    />
                  ))
                }
              </Box>
            </Tooltip>
          </Link>
        </NextLink>
      </Box>
    </Box>
  )
};

export default Product;