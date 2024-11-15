import { Flex, Select, SimpleGrid, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import type { TaskStatus } from "@/types";

import type {
  MemberResponseDTO,
  TaskWithOwnerDetail,
} from "../../../../api/generated/data-contracts";
import {
  useGetProjectMembers,
  useGetProjectTaskList,
} from "../../../../api/hooks/project.api";
import { KanbanColumn } from "./KanbanColumn";

interface Column {
  id: string;
  taskStatus: TaskStatus;
  tasks: TaskWithOwnerDetail[];
}

export const KanbanBoard = ({
  projectId = 1,
  size = 0,
  sort = "",
}: {
  projectId: number;
  page?: number;
  size?: number;
  sort?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority?: string;
  owner?: number;
}) => {
  const [selectedOwner, setSelectedOwner] = useState<number | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const location = useLocation();

  const { data: pendingData } = useGetProjectTaskList(
    projectId,
    size,
    sort,
    "PENDING",
    undefined,
    selectedOwner
  );
  const { data: inProgressData } = useGetProjectTaskList(
    projectId,
    size,
    sort,
    "IN_PROGRESS",
    undefined,
    selectedOwner
  );
  const { data: completedData } = useGetProjectTaskList(
    projectId,
    size,
    sort,
    "COMPLETED",
    undefined,
    selectedOwner
  );

  const [pendingTasks, setPendingTasks] = useState<TaskWithOwnerDetail[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<TaskWithOwnerDetail[]>(
    []
  );
  const [completedTasks, setCompletedTasks] = useState<TaskWithOwnerDetail[]>(
    []
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const ownerParam = queryParams.get("owner");
    if (ownerParam) {
      setSelectedOwner(parseInt(ownerParam));
    }
  }, [location.search]);

  useEffect(() => {
    if (pendingData && pendingData.pages[0].resultData) {
      setPendingTasks(pendingData.pages[0].resultData);
    }
  }, [pendingData]);

  useEffect(() => {
    if (inProgressData && inProgressData.pages[0].resultData) {
      setInProgressTasks(inProgressData.pages[0].resultData);
    }
  }, [inProgressData]);

  useEffect(() => {
    if (completedData && completedData.pages[0].resultData) {
      setCompletedTasks(completedData.pages[0].resultData);
    }
  }, [completedData]);

  const removeTaskFromColumn = (taskId: number, taskStatus: TaskStatus) => {
    if (taskStatus === "PENDING") {
      setPendingTasks((prev) => prev.filter((task) => task.id !== taskId));
    } else if (taskStatus === "IN_PROGRESS") {
      setInProgressTasks((prev) => prev.filter((task) => task.id !== taskId));
    } else if (taskStatus === "COMPLETED") {
      setCompletedTasks((prev) => prev.filter((task) => task.id !== taskId));
    }
  };

  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useGetProjectMembers(projectId, 0, "name");

  if (membersLoading) {
    return <div>로딩 중</div>;
  }

  if (membersError) {
    return <div>팀원 목록을 불러올 수 없습니다.</div>;
  }

  const members = membersData?.pages[0].resultData as MemberResponseDTO[];

  const handleSelectChange = (value: string) => {
    const ownerId = value ? parseInt(value) : undefined;
    setSelectedOwner(ownerId);
    navigate(`?owner=${value}`, { replace: true });
  };

  const getColumns: Column[] = [
    {
      id: "pending",
      taskStatus: "PENDING",
      tasks: pendingTasks,
    },
    {
      id: "in-progress",
      taskStatus: "IN_PROGRESS",
      tasks: inProgressTasks,
    },
    {
      id: "completed",
      taskStatus: "COMPLETED",
      tasks: completedTasks,
    },
  ];

  return (
    <Flex
      justifyContent="space-between"
      borderRadius="10px"
      border="1px solid #D8DADC"
      borderColor="#D8DADC"
    >
      <VStack width="100%" alignItems="flex-start">
        <Select
          width="200px"
          height="50px"
          color="#727272"
          border="#E3E3E3 solid 1.3px"
          value={selectedOwner}
          onChange={(e) => handleSelectChange(e.target.value)}
          mt={3}
          ml={4}
        >
          <option value="">전체</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </Select>
        <SimpleGrid columns={3} spacing={4} width="100%" p={4}>
          {getColumns.map((column) => (
            <KanbanColumn column={column} onDeleteTask={removeTaskFromColumn} />
          ))}
        </SimpleGrid>
      </VStack>
    </Flex>
  );
};
