import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Progress,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

import type { ProjectDetail } from "../../../api/generated/data-contracts";
import { useGetProjectProgress } from "../../../api/hooks/useGetProjectProgress";
import { ProgressTree } from "./ProgressTree";

export const ProgressAccordion = (props: { projectDetail: ProjectDetail }) => {
  const { projectDetail } = props;
  const [confettiVisible, setConfettiVisible] = useState(false);
  const toast = useToast();
  const { data } = useGetProjectProgress(projectDetail?.id || 0);
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("accordionState");
    return savedState === "open";
  });
  const progressData = data?.resultData?.projectProgress || 0;

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("accordionState", newState ? "open" : "closed");
  };

  useEffect(() => {
    if (progressData >= 50 && projectDetail?.optionIds?.includes(3)) {
      if (!localStorage.getItem("celebration")) {
        setConfettiVisible(true);
        localStorage.setItem("celebration", "true");

        setTimeout(() => {
          setConfettiVisible(false);
        }, 10000);

        toast({
          title: `축하합니다!`,
          description:
            "프로젝트 진행률이 50%를 넘었습니다! 지금 이 순간을 놓치지 마시고, 계속해서 힘차게 나아가세요!",
          duration: 8000,
          position: "bottom-right",
          isClosable: true,
        });
      }
    }
  }, [progressData, projectDetail, toast]);

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      borderRadius={"10px"}
      border={"1px solid #D8DADC"}
      borderColor="#D8DADC"
    >
      <Accordion defaultIndex={isOpen ? [0] : undefined} allowToggle flex="1">
        <AccordionItem>
          <AccordionButton flex="1" onClick={handleToggle}>
            <AccordionIcon boxSize={10} />
            <Box minW="100px" flex="1">
              <Text fontSize="xl" fontWeight="bold">
                {projectDetail.name}
              </Text>
            </Box>
            <Progress
              value={progressData}
              size="lg"
              colorScheme="gray"
              width="80%"
              height={5}
              borderRadius="full"
              margin={3}
            />
          </AccordionButton>

          <AccordionPanel pb={4}>
            {/* TODO: 바로 적용이 안되는데 강제 새로고침을 할지, 아니면 바로 렌더링시킬 방법이 있는지 고민 */}
            {data?.resultData?.projectId &&
              projectDetail?.optionIds?.includes(1) && (
                <ProgressTree projectId={data.resultData.projectId} />
              )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {confettiVisible && (
        <Fireworks
          width={window.innerWidth}
          height={window.innerHeight}
          autorun={{ speed: 1 }}
        />
      )}
    </Flex>
  );
};
