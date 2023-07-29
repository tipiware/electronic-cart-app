import { CircularProgress, Grid, Heading } from '@chakra-ui/react';

const Loading = () => {
  return (
    <Grid h='full' justifyItems={'center'} alignContent={'center'}>
      <Heading fontSize={'5xl'} textAlign={'center'}>Loading...</Heading>
      <CircularProgress isIndeterminate color='green.300' />
    </Grid>
  )
};

export default Loading;