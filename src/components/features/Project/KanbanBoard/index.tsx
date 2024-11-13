import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import type { TaskStatus } from "@/types";

import type { TaskWithOwnerDetail } from "../../../../api/generated/data-contracts";
import { useGetProjectTaskList } from "../../../../api/hooks/useGetProjectTaskList";
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
  owner?: string;
}) => {
  const { data: pendingData } = useGetProjectTaskList(
    projectId,
    size,
    sort,
    "PENDING"
  );
  const { data: inProgressData } = useGetProjectTaskList(
    projectId,
    size,
    sort,
    "IN_PROGRESS"
  );
  const { data: completedData } = useGetProjectTaskList(
    projectId,
    size,
    sort,
    "COMPLETED"
  );

  const [pendingTasks, setPendingTasks] = useState<TaskWithOwnerDetail[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<TaskWithOwnerDetail[]>(
    []
  );
  const [completedTasks, setCompletedTasks] = useState<TaskWithOwnerDetail[]>(
    []
  );

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

  //TODO: 정렬 기능 추가, 멤버별 필터링 기능 추가(주소에 쿼리스트링 넣어서?)
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      borderRadius="10px"
      border="1px solid #D8DADC"
      borderColor="#D8DADC"
    >
      <SimpleGrid columns={3} spacing={4} width="100%" p={4}>
        {getColumns.map((column) => (
          <KanbanColumn column={column} onDeleteTask={removeTaskFromColumn} />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
