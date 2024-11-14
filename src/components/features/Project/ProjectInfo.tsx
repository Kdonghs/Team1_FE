import { Avatar, Box, Flex, Text, VStack } from "@chakra-ui/react";
import dayjs from "dayjs";

import type { ProjectDetail } from "@/api/generated/data-contracts";

export const ProjectInfo = ({
  projectDetail,
}: {
  projectDetail: ProjectDetail;
}) => {
  return (
    <Box
      border="1px solid #D8DADC"
      borderColor="#D8DADC"
      borderRadius="10px"
      p={4}
      width="100%"
    >
      <VStack align="start" spacing={2}>
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
    </Box>
  );
};
