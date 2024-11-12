import { Badge, Card, CardBody, CardHeader, Flex } from "@chakra-ui/react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { TaskWithOwnerDetail } from "@/api/generated/data-contracts";
import type { TaskStatus } from "@/types/index";

import { KanbanTask } from "./KanbanTask";
import { AddTaskButton } from "./NewTaskButton";

interface ColumnProps {
  column: {
    id: string;
    status: TaskStatus;
    tasks: (TaskWithOwnerDetail & { id?: number })[];
  };
  onTaskAdded: (task: TaskWithOwnerDetail) => void;
}

const getStatusBadgeColor = (status: TaskStatus): string => {
  return statusBadgeColor[status] || "#D9D9D9";
};

export const KanbanColumn = ({ column }: ColumnProps) => {
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
              bg={getStatusBadgeColor(column.status)}
              p="1"
              width="90px"
              textAlign="center"
              borderRadius="10px"
              fontSize="16px"
            >
              {statusLabels[column.status]}
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

          <AddTaskButton projectId={2} />
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
