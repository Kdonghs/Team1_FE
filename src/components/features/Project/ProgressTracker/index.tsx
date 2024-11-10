import { Box, Button, Stack, Text } from "@chakra-ui/react";

import type { MemberProgress } from "../../../../api/generated/data-contracts";
import { useGetTeamProgress } from "../../../../api/hooks/useGetTeamProgress";
import { TeamMemberProgress } from "./TeamMemberProgress";

export const ProgressTracker = ({
  projectId,
  size = 2,
  sort = "string",
  role = "",
}: {
  projectId: number;
  page?: number;
  size?: number;
  sort?: string;
  role?: string;
}) => {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetTeamProgress(projectId, size, sort, role);

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading data</Text>;

  const teamProgressData: MemberProgress[] =
    data?.pages
      .flatMap((page) => page.resultData)
      .filter((item): item is MemberProgress => item !== undefined) || [];

  return (
    <Box
      alignItems={"center"}
      borderRadius={"10px"}
      border={"1px solid #D8DADC"}
      borderColor="#D8DADC"
      p={8}
      overflow="hidden"
    >
      {teamProgressData.length > 0 && (
        <Stack spacing={1} align="center" width="100%">
          {teamProgressData.map((member) => (
            <TeamMemberProgress key={member.teamMember?.id} member={member} />
          ))}
        </Stack>
      )}

      <Stack spacing={4} direction="row" align="center" justify="center" mt={4}>
        <Button
          onClick={() => fetchNextPage()}
          isLoading={isFetchingNextPage}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading..."
            : hasNextPage
              ? "Load More"
              : "No more"}
        </Button>
      </Stack>
    </Box>
  );
};
