import { Button, ButtonGroup, FormControl, FormLabel } from "@chakra-ui/react";
import styled from "@emotion/styled";

interface ToggleButtonGroupProps {
  label: string;
  options: string[];
  selectedOption: string;
  onChange: (option: string) => void;
}

export const ToggleButtonGroup = ({
  label,
  options,
  selectedOption,
  onChange,
}: ToggleButtonGroupProps) => {
  return (
    <FormControl display="flex" alignItems="center" gap={3}>
      <FormLabel
        minWidth="25%"
        m="0"
        color="#727272"
        fontSize={18}
        fontWeight={800}
      >
        {label}
      </FormLabel>
      <ButtonGroup variant="outline" width="100%" minW="50%">
        {options.map((option) => (
          <StyledButton
            key={option}
            flex={1}
            isActive={selectedOption === option}
            onClick={() => onChange(option)}
          >
            {option}
          </StyledButton>
        ))}
      </ButtonGroup>
    </FormControl>
  );
};

const StyledButton = styled(Button)<{ isActive: boolean }>`
  height: 50px;
  padding: 4px 8px;
  background-color: ${({ isActive }) =>
    isActive ? "#95a4fc !important" : "transparent"};
  color: ${({ isActive }) => (isActive ? "white" : "#727272")};
  borderColor = 1.3px solid #E3E3E3;
  white-space: normal;
`;
