import type { UseRadioProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";
import { useRadio } from "@chakra-ui/react";

interface RadioCardProps extends UseRadioProps {
  children: React.ReactNode;
}

export const RadioCard = (props: RadioCardProps) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Flex as="label" width="100%" align="center">
      <input {...input} style={{ display: "none" }} />
      <Flex
        {...checkbox}
        flex="1"
        cursor="pointer"
        border="#E3E3E3 solid 1.3px"
        borderRadius="md"
        boxShadow="md"
        backgroundColor="white"
        color="#727272"
        _checked={{
          bg: "#95A4FC",
          color: "white",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        py={3}
        justify="center"
      >
        {props.children}
      </Flex>
    </Flex>
  );
};
