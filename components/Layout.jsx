import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import Navbar from './Navbar';

const Layout = ({children}) => {
  return (
    <Grid 
      minH={'100vh'}
      templateRows={'auto 1fr auto'}
      bg={'whiteAlpha.50'}
    >
      <Navbar />

      <main>{children}</main>

      <Flex 
        as='footer' 
        bg={'gray.900'}
        p={4}
        direction={'column'} 
        alignItems={'center'}
        fontWeight={'bold'} fontSize={'sm'}
      >
        <Text>
          &copy; {' '}
          <Box as='span' display={'inline'} color='orange.400'>Copyright is all rights reserved. Creative Commons is some rights reserved.</Box>
        </Text>
      </Flex>
    </Grid>
  )
};

export default Layout;