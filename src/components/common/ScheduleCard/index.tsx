import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import axios from "axios";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import React from "react";

import { authSessionStorage } from "../../../utils/storage";

type Project = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
};

interface ProjectDateResponse {
  errorCode: number;
  errorMessage: string;
  resultData: Project[];
  size: number;
  page: number;
  pages: number;
  hasNext: boolean;
  total: number;
}

interface UserResponse {
  errorCode: number;
  errorMessage: string;
  resultData: {
    username: string;
    email: string;
    picture: string;
    role: string;
    createDate: string;
  };
}

const useGetUser = () => {
  return useQuery<UserResponse, AxiosError>({
    queryKey: ["user"],
    queryFn: async () => {
      const accessToken = authSessionStorage.get();

      if (!accessToken) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await axios.get<UserResponse>("/api/user", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    staleTime: 300000,
    retry: 1,
  });
};

const useGetProjectDates = () => {
  return useQuery<ProjectDateResponse, AxiosError>({
    queryKey: ["projectDates"],
    queryFn: async () => {
      const accessToken = authSessionStorage.get();

      if (!accessToken) {
        throw new Error("인증 토큰이 없습니다.");
      }

      const response = await axios.get<ProjectDateResponse>(
        "/api/project/date",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("프로젝트 일정 조회 응답:", response.data);
      return response.data;
    },
    staleTime: 0,
    refetchOnMount: true,
    retry: 1,
  });
};

const ScheduleCard: React.FC<{ date: string; projects: Project[] }> = ({
  date,
  projects,
}) => {
  const getDisplayDate = (dateStr: string): string => {
    const today = new Date();
    const targetDate = new Date(dateStr);

    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    switch (diffDays) {
      case 0:
        return "오늘";
      case 1:
        return format(targetDate, "EEE요일", { locale: ko });
      case 2:
        return format(targetDate, "EEE요일", { locale: ko });
      default:
        return `${targetDate.getMonth() + 1}월 ${targetDate.getDate()}일`;
    }
  };

  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toDateString() === end.toDateString()) {
      return format(start, "M.d(EEE)", { locale: ko });
    }

    return `${format(start, "M.d(EEE)", { locale: ko })} - ${format(end, "M.d(EEE)", { locale: ko })}`;
  };

  return (
    <Box>
      <Text fontSize="16px" mb={4}>
        {getDisplayDate(date)}
      </Text>
      <VStack spacing={2} align="stretch">
        {projects.length === 0 ? (
          <Text fontSize="14px" color="gray.500">
            예정된 일정이 없습니다
          </Text>
        ) : (
          projects.map((project) => (
            <Flex key={project.id} align="center">
              <Box w="4px" h="40px" bg="#95A4FC" mr={2} borderRadius="2px" />
              <VStack align="start" spacing={0}>
                <Text color="#95A4FC" fontSize="12px">
                  {formatDateRange(project.startDate, project.endDate)}
                </Text>
                <Text fontSize="14px">{project.name}</Text>
              </VStack>
            </Flex>
          ))
        )}
      </VStack>
    </Box>
  );
};

export const ScheduleList: React.FC = () => {
  const {
    data: userData,
    isError: isUserError,
    error: userError,
  } = useGetUser();
  const {
    data: scheduleData,
    isError: isScheduleError,
    error: scheduleError,
    isLoading,
  } = useGetProjectDates();

  const getProjectsByDate = (date: string): Project[] => {
    if (!scheduleData?.resultData) return [];

    return scheduleData.resultData.filter((project) => {
      const projectStart = new Date(project.startDate);
      const projectEnd = new Date(project.endDate);
      const targetDate = new Date(date);

      projectStart.setHours(0, 0, 0, 0);
      projectEnd.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);

      return targetDate >= projectStart && targetDate <= projectEnd;
    });
  };

  const getDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }

    return dates;
  };

  const dates = getDates();

  if (isLoading) {
    return (
      <Box p={6}>
        <Text fontSize="18px" fontWeight="bold" mb={6}>
          예정 일정
        </Text>
        <Text>로딩 중...</Text>
      </Box>
    );
  }

  if (isUserError || isScheduleError) {
    return (
      <Box p={6}>
        <Text fontSize="18px" fontWeight="bold" mb={6}>
          예정 일정
        </Text>
        <Text color="red.500">
          {(userError as AxiosError)?.message ||
            (scheduleError as AxiosError)?.message ||
            "데이터를 불러오는데 실패했습니다."}
        </Text>
      </Box>
    );
  }

  if (!userData?.resultData) {
    return (
      <Box p={6}>
        <Text fontSize="18px" fontWeight="bold" mb={6}>
          예정 일정
        </Text>
        <Text color="red.500">사용자 정보를 불러올 수 없습니다.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box px={6}>
        <Text fontSize="18px" fontWeight="bold" mb={6}>
          예정 일정
        </Text>
        <Box
          border="1px solid #D9D9D9"
          borderRadius="lg"
          bg="white"
          overflow="hidden"
        >
          <Flex position="relative">
            <Box flex="1" p={6}>
              <ScheduleCard
                date={dates[0]}
                projects={getProjectsByDate(dates[0])}
              />
            </Box>

            <Box
              position="absolute"
              left="50%"
              top={6}
              bottom={6}
              width="1px"
              bg="#D9D9D9"
              transform="translateX(-50%)"
            />

            <Box flex="1" p={6}>
              <VStack spacing={6} align="stretch">
                <ScheduleCard
                  date={dates[1]}
                  projects={getProjectsByDate(dates[1])}
                />
                <ScheduleCard
                  date={dates[2]}
                  projects={getProjectsByDate(dates[2])}
                />
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default ScheduleList;
