import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { useState } from "react";

import type { ProjectDetail } from "@/api/generated/data-contracts";

export const ProjectInfo = ({
  projectDetail,
}: {
  projectDetail: ProjectDetail;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <Box p={2} width="100%">
      <Button onClick={toggleOpen} variant="ghost" size="sm" mb={2} p={0}>
        <Text mr={2}>프로젝트 정보</Text>
        <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} />
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold" fontSize="lg">
            {projectDetail.name}
          </Text>
          <Text>
            시작일: {dayjs(projectDetail.startDate).format("YYYY-MM-DD HH:mm")}
          </Text>
          <Text>
            종료일: {dayjs(projectDetail.endDate).format("YYYY-MM-DD HH:mm")}
          </Text>
          <Text>멤버 수: {projectDetail.totalMembers}</Text>
          <Flex>
            <Text>매니저: </Text>
            <Avatar
              size="xs"
              src={projectDetail.projectManager?.imageURL}
              mb={1}
              mx={1}
            />
            <Text>{projectDetail.projectManager?.name}</Text>
          </Flex>
        </VStack>
      </Collapse>
    </Box>
  );
};
