import { Box, Button, FormControl, FormLabel, Heading, GridItem, Select, SimpleGrid, useBreakpointValue, Grid, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import CustomInput from './CustomInput';

import commerce from '../lib/commerce';
import { useRouter } from 'next/router';

const ShippingAddressForm = ({checkoutToken, getShippingData}) => {

  const router = useRouter();

  /* Countries info to populate first Select's options */
  const [shippingCountries, setShippingCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');

  async function fetchShippingCountries(checkoutTokenId){
    const {countries} = await commerce.services.localeListShippingCountries(checkoutTokenId);
    setShippingCountries(countries);
    setSelectedCountry(Object.keys(countries)[0]);
  }

  useEffect(()=>{
    fetchShippingCountries(checkoutToken.id);
  }, [])

  const countries = Object.entries(shippingCountries).map(([code, name])=>({id: code, label: name}));

  /* Subdivisions info to populate second Select's options */
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [selectedSubdivision, setSelectedSubdivision] = useState('');

  async function fetchShippingSubdivisions(countryCode){
    const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);
    setShippingSubdivisions(subdivisions);
    setSelectedSubdivision(Object.keys(subdivisions)[0]);
  }

  useEffect(()=>{
    selectedCountry && fetchShippingSubdivisions(selectedCountry);
  }, [selectedCountry]);

  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name])=>({id: code, label: name}));
  
  /* Subdivisions info to populate third Select's options */
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [shippingOptionPrice, setShippingOptionPrice] = useState(0);

  async function fetchShippingOptions(checkoutTokenId, country, region = null){
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region});
    setShippingOptions(options);
    setShippingOptionPrice(options[0].price.raw);
    setSelectedOption(options[0].id);
  }

  useEffect(()=>{
    selectedSubdivision && fetchShippingOptions(checkoutToken.id, selectedCountry, selectedSubdivision);
  },[selectedSubdivision])

  const options = shippingOptions.map((option)=>({id: option.id, label: `${option.description} - (${option.price.formatted_with_symbol})`}))

  const methods = useForm();

  const responsiveColumns = useBreakpointValue({base: 2, sm: 1})
  
  return (
    <Box py={10} px={{base: 4, md: 6}}>
      <Heading fontSize={'3xl'} pb={8}>Your Details</Heading>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data)=>getShippingData({...data, selectedCountry, selectedSubdivision, selectedOption, shippingOptionPrice}))}>
          <SimpleGrid columns={2} columnGap={3} rowGap={6} w='full'>
            <CustomInput label='First Name' name='firstName' placeholder='Sherlock'/>
            <CustomInput label='Last Name' name='lastName' placeholder='Holmes'/>
            <CustomInput label='Address' name='address1' placeholder='Baker Street, 221B'/>
            <CustomInput label='Email' name='email' placeholder='sherlock.holmes@mail.com'/>
            <CustomInput label='City' name='city' placeholder='London'/>
            <CustomInput label='Zip / Postal Code' name='zip' placeholder='12345'/>
            <GridItem colSpan={responsiveColumns}>
              <FormControl>
                <FormLabel fontWeight={'semibold'}>Shipping Country</FormLabel>
                <Select
                  value={selectedCountry}
                  onChange={(e)=>setSelectedCountry(e.target.value)}
                >
                  {
                    countries.map(country=>(<option key={country.id} value={country.id}>{country.label}</option>))
                  }
                </Select>
              </FormControl>
            </GridItem>
            <GridItem colSpan={responsiveColumns}>
              <FormControl>
                <FormLabel fontWeight={'semibold'}>Shipping Subdivision</FormLabel>
                <Select
                  value={selectedSubdivision}
                  onChange={(e)=>setSelectedSubdivision(e.target.value)}
                >
                  {
                    subdivisions.map(subdivision=>(
                      <option key={subdivision.id} value={subdivision.label}>{subdivision.label}</option>
                    ))
                  }
                </Select>
              </FormControl>
            </GridItem>
            <GridItem colSpan={responsiveColumns}>
              <FormControl>
                <FormLabel fontWeight={'semibold'}>Shipping Options</FormLabel>
                <Select
                  value={selectedOption}
                  onChange={(e)=>setSelectedOption(e.target.value)}
                >
                  {
                    options.map(option=>(
                      <option key={option.id} value={option.label}>{option.label}</option>
                    ))
                  }
                </Select>
              </FormControl>
            </GridItem>
            <GridItem colSpan={2}>
              <Flex justifyContent='space-between'>
                <Button colorScheme={'red'} onClick={()=>router.push('/cart')}>Back to Cart</Button>
                <Button type='submit' colorScheme={'blue'}>Next</Button>
              </Flex>
            </GridItem>
          </SimpleGrid>
        </form>
      </FormProvider>
    </Box>
  )
};

export default ShippingAddressForm;