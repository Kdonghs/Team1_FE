import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";

import type { TaskWithOwnerDetail } from "@/api/generated/data-contracts";
import type { TaskPriority } from "@/types/index";

interface TaskProps {
  task: TaskWithOwnerDetail;
}

export const KanbanTask = ({ task }: TaskProps) => {
  return (
    <Card key={task.id} size="sm" mb={10} borderRadius="30px" p={2}>
      <CardHeader pb={1}>
        <Flex direction="column" gap={2}>
          <Badge
            bg={getPriorityBadgeColor(task.priority || "LOW")}
            p="1"
            maxW="65px"
            textAlign="center"
            borderRadius="20px"
            fontSize="11px"
          >
            {task.priority}
          </Badge>
          <Heading size="15px">{task.name}</Heading>
        </Flex>
      </CardHeader>
      <CardBody pt={1}>
        <Text fontSize="sm" color="#6D7280">
          {task.description}
        </Text>
        <Text fontSize="sm" color="#666666">
          {task.startDate}
        </Text>
      </CardBody>
    </Card>
  );
};

const priorityBadgeColor: Record<TaskPriority, string> = {
  HIGH: "#FEC4B1",
  MEDIUM: "#FEEBB5",
  LOW: "#ECFAE9",
};

const getPriorityBadgeColor = (priority: TaskPriority): string => {
  return priorityBadgeColor[priority] || "#D9D9D9";
};
