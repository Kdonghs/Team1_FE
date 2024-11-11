import "dayjs/locale/ko";

import {
  Avatar,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Spacer,
  Text,
} from "@chakra-ui/react";
import dayjs from "dayjs";

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
        <Spacer h={1} />
        <Text fontSize="xs" color="#666666">
          {dayjs(task.endDate).locale("ko").format("YYYY.M.D H시 m분")}
        </Text>
        <Spacer h={1} />
        <Flex gap={1}>
          <Avatar name={task.owner?.name} size="xs" />
          <Text
            textAlign={"right"}
            alignContent="center"
            fontSize="sm"
            color="#666666"
          >
            {task.owner?.name}
          </Text>
        </Flex>
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
