import { Flex, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";

import type { TaskStatus } from "@/types";

import type { TaskWithOwnerDetail } from "../../../../api/generated/data-contracts";
import { useGetProjectTaskList } from "../../../../api/hooks/useGetProjectTaskList";
import { KanbanColumn } from "./KanbanColumn";

interface Column {
  id: string;
  status: TaskStatus;
  tasks: TaskWithOwnerDetail[];
}

export const KanbanBoard = ({
  projectId = 1,
  size = 0,
  sort = "string",
  priority,
  owner,
}: {
  projectId: number;
  page?: number;
  size?: number;
  sort?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  priority?: string;
  owner?: string;
}) => {
  const { data } = useGetProjectTaskList(
    projectId,
    size,
    sort,
    priority,
    owner
  );

  const [tasks, setTasks] = useState<TaskWithOwnerDetail[]>([]);

  useEffect(() => {
    if (data && data.pages[0].resultData) {
      setTasks(data.pages[0].resultData);
    }
  }, [data]);

  const handleTaskAdded = (newTask: TaskWithOwnerDetail) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const getColumns: Column[] = useMemo(() => {
    return [
      {
        id: "pending",
        status: "PENDING",
        tasks: tasks.filter((task) => task.status === "PENDING"),
      },
      {
        id: "in-progress",
        status: "IN_PROGRESS",
        tasks: tasks.filter((task) => task.status === "IN_PROGRESS"),
      },
      {
        id: "completed",
        status: "COMPLETED",
        tasks: tasks.filter((task) => task.status === "COMPLETED"),
      },
    ];
  }, [tasks]);

  console.log(getColumns);
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
          <KanbanColumn column={column} onTaskAdded={handleTaskAdded} />
        ))}
      </SimpleGrid>
    </Flex>
  );
};
