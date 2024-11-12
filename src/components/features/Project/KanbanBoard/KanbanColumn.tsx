import { Badge, Card, CardBody, CardHeader, Flex } from "@chakra-ui/react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useParams } from "react-router-dom";

import type { TaskWithOwnerDetail } from "@/api/generated/data-contracts";
import type { TaskStatus } from "@/types/index";

import { KanbanTask } from "./KanbanTask";
import { AddTaskButton } from "./NewTaskButton";

interface ColumnProps {
  column: {
    id: string;
    taskStatus: TaskStatus;
    tasks: (TaskWithOwnerDetail & { id?: number })[];
  };
  onTaskAdded: (task: TaskWithOwnerDetail) => void;
}

const getStatusBadgeColor = (taskStatus: TaskStatus): string => {
  return statusBadgeColor[taskStatus] || "#D9D9D9";
};

export const KanbanColumn = ({ column }: ColumnProps) => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : 0;

  const filteredTasks = column.tasks.filter(
    (task): task is TaskWithOwnerDetail & { id: number } =>
      task.id !== undefined
  );

  return (
    <Card key={column.id}>
      <Flex direction="column">
        <CardHeader>
          <Flex>
            <Badge
              bg={getStatusBadgeColor(column.taskStatus)}
              p="1"
              width="90px"
              textAlign="center"
              borderRadius="10px"
              fontSize="16px"
            >
              {statusLabels[column.taskStatus]}
            </Badge>
          </Flex>
        </CardHeader>
        <CardBody>
          <SortableContext
            items={filteredTasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredTasks.map((task) => (
              <KanbanTask key={task.id} task={task} />
            ))}
          </SortableContext>

          <AddTaskButton projectId={projectId} />
        </CardBody>
      </Flex>
    </Card>
  );
};

const statusLabels: Record<TaskStatus, string> = {
  PENDING: "시작 전",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

const statusBadgeColor: Record<TaskStatus, string> = {
  PENDING: "#D9D9D9",
  IN_PROGRESS: "#D3E5EF",
  COMPLETED: "#DBEDDB",
};
