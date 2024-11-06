import { Text } from "@chakra-ui/react";

export const ProgressLabel = ({
  progress,
  label,
}: {
  progress: number;
  label: string;
}) => (
  <Text
    position="absolute"
    left={`${progress / 2}%`}
    top="50%"
    transform="translate(-50%, -50%)"
    fontWeight="bold"
    color="white"
    whiteSpace="nowrap"
    overflow="hidden"
    textOverflow="ellipsis"
    maxWidth={`${progress}%`}
    p={1}
  >
    {label}
  </Text>
);
