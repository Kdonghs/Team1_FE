import { AddIcon } from "@chakra-ui/icons";
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { TaskWithOwnerDetail } from "@/api/generated/data-contracts";
import type { TaskStatus } from "@/types/index";

import { KanbanTask } from "./KanbanTask";

interface ColumnProps {
  column: {
    id: string;
    status: TaskStatus;
    tasks: (TaskWithOwnerDetail & { id?: number })[]; // id는 옵셔널로 처리
  };
}

// Status와 Badge Color 매핑
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

// Badge Color 가져오기 함수
const getStatusBadgeColor = (status: TaskStatus): string => {
  return statusBadgeColor[status] || "#D9D9D9";
};

export const KanbanColumn = ({ column }: ColumnProps) => {
  // id가 undefined가 아닌 task들만 필터링
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
            items={filteredTasks.map((task) => task.id)} // id는 이제 확실히 존재하므로 단언이 필요 없음
            strategy={verticalListSortingStrategy}
          >
            {filteredTasks.map((task) => (
              <KanbanTask key={task.id} task={task} />
            ))}
          </SortableContext>

          <Flex justifyContent="center">
            <IconButton
              isRound={true}
              variant="solid"
              aria-label="AddTask"
              fontSize="20px"
              icon={<AddIcon />}
              bg="transparent"
              color="#727272"
            />
          </Flex>
        </CardBody>
      </Flex>
    </Card>
  );
};
