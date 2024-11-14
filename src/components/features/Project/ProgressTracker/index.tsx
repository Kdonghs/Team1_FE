import { Box, Stack, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

import type { MemberProgress } from "../../../../api/generated/data-contracts";
import { useGetTeamProgress } from "../../../../api/hooks/project.api";
import { TeamMemberProgress } from "./TeamMemberProgress";

export const ProgressTracker = ({
  projectId,
  size = 10,
  sort = "string",
  role = "",
}: {
  projectId: number;
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

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentLoader = loaderRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) return <Text>로딩 중...</Text>;
  if (isError) return <Text>프로젝트를 불러올 수 없습니다.</Text>;

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
      {teamProgressData.length > 0 ? (
        <Stack spacing={1} align="center" width="100%">
          {teamProgressData.map((member) => (
            <TeamMemberProgress key={member.teamMember?.id} member={member} />
          ))}
        </Stack>
      ) : (
        <Text textAlign="center">
          아직 팀원이 없습니다. 팀원을 초대해보세요!
        </Text>
      )}

      <div ref={loaderRef} />
      {isFetchingNextPage && (
        <Text mt={4} textAlign="center">
          Loading more...
        </Text>
      )}
    </Box>
  );
};
