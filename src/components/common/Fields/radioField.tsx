import {
  FormControl,
  FormLabel,
  HStack,
  RadioGroup,
  VStack,
} from "@chakra-ui/react";
import { useRadioGroup } from "@chakra-ui/react";

import { RadioCard } from "./radioCard";

interface RadioFieldProps {
  label: string;
  options: { label: string; value: string }[];
  value: string | undefined;
  onChange: (value: string) => void;
  isInvalid?: boolean;
  errorMessage?: string;
}

const RadioField = ({
  label,
  options,
  value,
  onChange,
  isInvalid,
}: RadioFieldProps) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: label,
    value,
    onChange,
  });

  const groupProps = getRootProps();

  return (
    <FormControl
      display="flex"
      alignItems="center"
      gap={3}
      isInvalid={isInvalid}
    >
      <FormLabel
        as="legend"
        minWidth="25%"
        m="0"
        color="#727272"
        fontSize={18}
        height="50px"
        fontWeight={800}
      >
        {label}
      </FormLabel>
      <VStack width="100%" height="70px">
        <RadioGroup width="100%">
          <HStack spacing={4} {...groupProps}>
            {options.map((option) => {
              const radioProps = getRadioProps({ value: option.value });
              const inputId = `radio-${option.value}`;
              return (
                <RadioCard {...radioProps} key={inputId} id={inputId}>
                  {option.label}
                </RadioCard>
              );
            })}
          </HStack>
        </RadioGroup>
      </VStack>
    </FormControl>
  );
};

export { RadioField };
