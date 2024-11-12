import "dayjs/locale/ko";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { EllipsisVertical } from "lucide-react";
import { useParams } from "react-router-dom";

import type {
  TaskUpdate,
  TaskWithOwnerDetail,
} from "@/api/generated/data-contracts";
import type { TaskPriority } from "@/types/index";

import { TaskModal } from "./modal/TaskModal";
interface TaskProps {
  task: TaskWithOwnerDetail;
}

export const KanbanTask = ({ task }: TaskProps) => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : 0;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const taskForModal: TaskUpdate = {
    name: task.name || "",
    description: task.description,
    ownerId: task.owner?.id || undefined,
    priority: task.priority || "LOW",
    progress: task.progress || 0,
    startDate:
      task.startDate || dayjs().startOf("day").format("YYYY-MM-DDTHH:mm"),
    endDate:
      task.endDate ||
      dayjs().add(7, "day").startOf("day").format("YYYY-MM-DDTHH:mm"),
    status: task.status || "PENDING",
  };

  return (
    <Card
      key={task.id}
      size="sm"
      mb={10}
      borderRadius="30px"
      p={2}
      _hover={{ ".menu-icon": { visibility: "visible" } }}
    >
      <CardHeader pb={1}>
        <Flex direction="column" gap={2}>
          <HStack justifyContent={"space-between"}>
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
            <Menu>
              <MenuButton
                as={IconButton}
                className="menu-icon"
                bgColor="transparent"
                aria-label="More member options"
                icon={<EllipsisVertical color="#5A5A5A" />}
                size="sm"
                m={1}
                visibility="hidden"
              />
              <MenuList
                minW="120px"
                boxShadow="md"
                border="1px solid"
                borderColor="gray.100"
                zIndex={10}
              >
                <MenuItem
                  textAlign="center"
                  onClick={onOpen}
                  icon={<EditIcon />}
                >
                  태스크 수정
                </MenuItem>

                <TaskModal
                  isOpen={isOpen}
                  onClose={onClose}
                  projectId={projectId}
                  taskId={task.id}
                  initialData={taskForModal}
                />

                <MenuItem
                  textAlign="center"
                  icon={<DeleteIcon />}
                  _hover={{ color: "red.500" }}
                >
                  태스크 삭제
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
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
