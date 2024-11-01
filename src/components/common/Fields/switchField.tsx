import { FormControl, FormLabel, HStack, Switch, Text } from "@chakra-ui/react";

interface SwitchFieldProps {
  title: string;
  description?: string;
}

export const SwitchField = ({ title, description }: SwitchFieldProps) => {
  return (
    <FormControl>
      <HStack width="100%" justifyContent="space-between" alignItems="center">
        <FormLabel fontWeight="bold" mb="0">
          {title}
        </FormLabel>
        <Switch id="isRequired" isRequired size="md" />
      </HStack>
      {description && (
        <Text fontSize="sm" color="gray.500" mt={2}>
          {description}
        </Text>
      )}
    </FormControl>
  );
};
