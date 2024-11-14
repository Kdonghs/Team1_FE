import type { SliderProps } from "@chakra-ui/react";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { forwardRef, useState } from "react";

interface SliderFieldProps extends SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  isInvalid?: boolean;
  errorMessage?: string;
}

export const SliderField = forwardRef<HTMLInputElement, SliderFieldProps>(
  (
    {
      label = "",
      min,
      max,
      step = 1,
      value,
      onChange,
      isInvalid,
      errorMessage = "",
      ...sliderProps
    },
    ref
  ) => {
    const [showTooltip, setShowTooltip] = useState(false);

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
          height="30px"
          fontWeight={800}
        >
          {label}
        </FormLabel>
        <VStack width="100%" height="50px" justifyContent="center">
          <Slider
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={onChange}
            ref={ref}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            {...sliderProps}
          >
            <SliderTrack height={2} borderRadius="full">
              <SliderFilledTrack bg="#95A4FC " boxShadow="md" />
            </SliderTrack>
            <SliderThumb boxShadow="lg" borderColor="#95A4FC">
              <Tooltip
                bg="#95A4FC"
                color="white"
                placement="top"
                isOpen={showTooltip}
                label={`${value}%`}
                borderRadius={10}
              >
                <div />
              </Tooltip>
            </SliderThumb>
          </Slider>
          {errorMessage && (
            <FormErrorMessage
              m={-1}
              fontSize="13px"
              width="100%"
              textAlign="left"
            >
              {errorMessage}
            </FormErrorMessage>
          )}
        </VStack>
      </FormControl>
    );
  }
);
