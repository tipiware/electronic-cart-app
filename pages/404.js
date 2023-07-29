import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';

import { Box, Button, Flex, Heading, SimpleGrid, Text, useBreakpointValue } from '@chakra-ui/react';

import pageNotFound from '../public/images/page_not_found.svg'

const ErrorPage = () => {

  const router = useRouter();

  return (
    <SimpleGrid h='full' w='full' columns={{base: 1, lg: 2}}>
      <Head>
        <title>Page Not Found</title>
        <meta name="description" content="Page Not Found!" />
      </Head>

      <Box bg='white' h='full' position={'relative'} display={{base: 'none', lg: 'block'}}>
        <Image 
          src={pageNotFound}
          alt='Error 404! Page not found.'
          layout='fill'
          objectFit='contain'
        />
      </Box>

      <Flex px={4} direction={'column'} alignItems={'center'} justifyContent={'space-evenly'}>
        <Heading
          as='h1'
          textAlign={'center'}
          textTransform={'uppercase'}
          size={useBreakpointValue({ base: 'xl', sm: '2xl' })}
        >
          Page Not Found
        </Heading>

        <Text
          fontWeight={'semibold'}
          fontSize={{ base: 'lg', sm: 'xl' }}
          textAlign={'center'}
        >
          Ops! The page you were looking for doesn't exist.
        </Text>
        <Button colorScheme={'red'} onClick={()=>router.push('/')}>Back to Home</Button>
      </Flex>
    </SimpleGrid>
  )
};

export default ErrorPage;