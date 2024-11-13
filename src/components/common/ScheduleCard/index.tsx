import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type Task = {
  id: number;
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  options: Record<string, unknown>;
  totalMembers: number;
  projectManager: {
    name: string;
    imageURL: string;
  };
};

type ApiResponse = {
  errorCode: number;
  errorMessage: string;
  resultData: Task[];
  size: number;
  page: number;
  pages: number;
  hasNext: boolean;
  total: number;
};

type User = {
  username: string;
  email: string;
  picture: string;
  role: string;
  createDate: string;
};

type UserApiResponse = {
  errorCode: number;
  errorMessage: string;
  resultData: User;
};

// Mock Data
const mockApiResponse: ApiResponse = {
  errorCode: 0,
  errorMessage: "Success",
  resultData: [
    {
      id: 1,
      name: "신규 서비스 기획 미팅",
      description: "2024년 1분기 신규 서비스 론칭 기획",
      startTime: "09:00",
      endTime: "11:00",
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      options: {},
      totalMembers: 5,
      projectManager: {
        name: "김철수",
        imageURL: ""
      }
    },
    {
      id: 2,
      name: "디자인 시스템 리뷰",
      description: "컴포넌트 디자인 검토",
      startTime: "14:00",
      endTime: "16:00",
      startDate: new Date().toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      options: {},
      totalMembers: 3,
      projectManager: {
        name: "김철수",
        imageURL: ""
      }
    },
    {
      id: 3,
      name: "백엔드 API 설계",
      description: "REST API 구조 설계",
      startTime: "10:00",
      endTime: "12:00",
      startDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      options: {},
      totalMembers: 4,
      projectManager: {
        name: "김철수",
        imageURL: ""
      }
    },
    {
      id: 4,
      name: "스프린트 회고",
      description: "1분기 스프린트 리뷰",
      startTime: "15:00",
      endTime: "17:00",
      startDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      options: {},
      totalMembers: 8,
      projectManager: {
        name: "김철수",
        imageURL: ""
      }
    }
  ],
  size: 10,
  page: 0,
  pages: 1,
  hasNext: false,
  total: 4
};

const mockUserResponse: UserApiResponse = {
  errorCode: 0,
  errorMessage: "Success",
  resultData: {
    username: "김철수",
    email: "cheolsu.kim@example.com",
    picture: "",
    role: "PM",
    createDate: "2024-01-01T00:00:00.000Z"
  }
};

const ScheduleCard: React.FC<{ date: string; tasks: Task[] }> = ({
  date,
  tasks,
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
        return "내일";
      case 2:
        return "모레";
      default:
        return `${targetDate.getMonth() + 1}월 ${targetDate.getDate()}일`;
    }
  };

  return (
    <Box>
      <Text fontSize="16px" mb={4}>
        {getDisplayDate(date)}
      </Text>
      <VStack spacing={2} align="stretch">
        {tasks.length === 0 ? (
          <Text fontSize="14px" color="gray.500">
            예정된 일정이 없습니다
          </Text>
        ) : (
          tasks.map((task) => (
            <Flex key={task.id} align="center">
              <Box w="4px" h="40px" bg="#95A4FC" mr={2} borderRadius="2px" />
              <VStack align="start" spacing={0}>
                <Text color="#95A4FC" fontSize="12px">
                  {`${task.startTime} - ${task.endTime}`}
                </Text>
                <Text fontSize="14px">{task.name}</Text>
                <Text fontSize="12px" color="gray.500">
                  {task.description}
                </Text>
              </VStack>
            </Flex>
          ))
        )}
      </VStack>
    </Box>
  );
};

export const ScheduleList: React.FC = () => {
  const [scheduleData, setScheduleData] = useState<ApiResponse | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // api 연동
        /*
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('사용자 정보를 가져오는데 실패했습니다.');
        }

        const data: UserApiResponse = await response.json();
        if (data.errorCode === 0) {
          setCurrentUser(data.resultData);
        } else {
          throw new Error(data.errorMessage);
        }
        */

        setCurrentUser(mockUserResponse.resultData);
      } catch (err) {
        console.error('사용자 정보 조회 실패:', err);
        setError('사용자 정보를 불러오는데 실패했습니다.');
      }
    };

    getCurrentUser();
  }, []);

  useEffect(() => {
    const getSchedules = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // api 연동
        /*
        const response = await fetch('/api/project', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('스케줄 데이터를 가져오는데 실패했습니다.');
        }

        const data: ApiResponse = await response.json();
        if (data.errorCode === 0) {
          setScheduleData(data);
        } else {
          throw new Error(data.errorMessage);
        }
        */

        setScheduleData(mockApiResponse);
      } catch (err) {
        console.error('스케줄 데이터 조회 실패:', err);
        setError('일정을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    getSchedules();
  }, []);

  const filterUserTasks = (tasks: Task[]): Task[] => {
    if (!currentUser) return [];
    return tasks.filter((task) => task.projectManager.name === currentUser.username);
  };

  const getTasksByDate = (date: string): Task[] => {
    if (!scheduleData) return [];

    const filteredTasks = filterUserTasks(scheduleData.resultData);
    return filteredTasks.filter((task) => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.endDate);
      const targetDate = new Date(date);

      taskStart.setHours(0, 0, 0, 0);
      taskEnd.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);

      return targetDate >= taskStart && targetDate <= taskEnd;
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

  if (error) {
    return (
      <Box p={6}>
        <Text fontSize="18px" fontWeight="bold" mb={6}>
          예정 일정
        </Text>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!currentUser) {
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
              <ScheduleCard date={dates[0]} tasks={getTasksByDate(dates[0])} />
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
                <ScheduleCard date={dates[1]} tasks={getTasksByDate(dates[1])} />
                <ScheduleCard date={dates[2]} tasks={getTasksByDate(dates[2])} />
              </VStack>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default ScheduleList;