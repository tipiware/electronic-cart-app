import { FormControl, FormLabel, GridItem, Input, useBreakpointValue } from '@chakra-ui/react';
import { useFormContext, Controller } from 'react-hook-form';

const CustomInput = ({label, name, placeholder}) => {

  const {control} = useFormContext();

  const responsiveColumns = useBreakpointValue({base: 2, sm: 1});

  return (
    <GridItem colSpan={responsiveColumns}>
      <FormControl>
        <FormLabel fontWeight={'semibold'}>{label}</FormLabel>
        <Controller
          render={({field})=>(
            <Input {...field} placeholder={placeholder} isRequired/>
          )}
          defaultValue=''
          control={control}
          fullWidth
          name={name}
          label={label}
          required
        >
        </Controller>
      </FormControl>
    </GridItem>
  )
};

export default CustomInput;