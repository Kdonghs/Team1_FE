import { Avatar, Box, Flex, Progress, Text, Tooltip } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useRef, useState } from "react";

import type { MemberProgress } from "@/api/generated/data-contracts";

import { ProgressLabel } from "./ProgressLabel";

const createFillAnimation = (progress: number) => keyframes`
  0% { width: 0%; }
  100% { width: ${progress}%; }
`;

export const TeamMemberProgress = ({ member }: { member: MemberProgress }) => {
  const { teamMember, progress } = member;
  const activeTasks = member.activeTasks || [];

  const fillAnimation = createFillAnimation(progress || 0);

  const [tooltipX, setTooltipX] = useState<number>(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (boxRef.current) {
      const { left } = boxRef.current.getBoundingClientRect();
      const offsetX = e.clientX - left;
      setTooltipX(offsetX);
    }
  };

  return (
    <Flex
      mt={2}
      mb={2}
      width="100%"
      justifyContent="space-between"
      alignItems="center"
    >
      <Flex alignItems="center">
        <Avatar name={teamMember?.name} src={teamMember?.imageURL} size="sm" />
        <Text fontWeight="bold" ml={4} width="100px" align="center">
          {teamMember?.name}
        </Text>
      </Flex>
      <Tooltip
        label={`${activeTasks[0]?.name ? `${activeTasks[0]?.name}${activeTasks.length > 1 ? `외 ${activeTasks.length - 1}건 진행 중` : " 진행 중"}` : "진행 중인 태스크 없음"}`}
        placement="top-start"
        aria-label="activeTask"
        offset={[tooltipX, 0]}
        borderRadius={5}
        bgColor="gray.600"
      >
        <Box
          flex="1"
          position="relative"
          mx={4}
          ref={boxRef}
          onMouseMove={handleMouseMove}
        >
          <Progress
            value={progress || 0}
            height={9}
            borderRadius="full"
            sx={{
              "& > div": {
                animation: `${fillAnimation} 2s ease-in-out forwards`,
                width: `${progress || 0}%`,
                backgroundColor: `rgba(49, 130, 206, ${0.5 + (progress || 0) / 200})`,
              },
            }}
          />

          {activeTasks && activeTasks.length > 0 && (
            <ProgressLabel
              progress={progress || 0}
              label={activeTasks[0].name || ""}
            />
          )}

          <Text
            position="absolute"
            right="10px"
            top="50%"
            width={12}
            height={7}
            display="flex"
            alignItems="center"
            justifyContent="center"
            transform="translateY(-50%)"
            fontWeight="bold"
            color="black"
            backgroundColor="rgba(255, 255, 255, 0.8)"
            borderRadius="full"
          >
            {progress}%
          </Text>
        </Box>
      </Tooltip>
    </Flex>
  );
};
