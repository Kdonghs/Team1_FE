import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import type { TaskStatus } from "@/types";

import type {
  TaskCreate,
  TaskUpdate,
  TaskWithOwnerDetail,
} from "../../../../../api/generated/data-contracts";
import { usePostProjectTask } from "../../../../../api/hooks/usePostProjectTask";
import { useUpdateProjectTask } from "../../../../../api/hooks/useUpdateProjectTask";
import { DateField } from "../../../../../components/common/Fields/dateField";
import { RadioField } from "../../../../../components/common/Fields/radioField";
import { SelectProjectMemberField } from "../../../../../components/common/Fields/selectProjectMemberField";
import { SliderField } from "../../../../../components/common/Fields/sliderField";
import { TextField } from "../../../../../components/common/Fields/textField";

interface TaskModalProps {
  projectId: number;
  taskId?: number;
  initialData?: TaskUpdate;
  onClose: () => void;
  isOpen: boolean;
  onUpdateTask?: (updatedTask: TaskWithOwnerDetail) => void;
  onAddTask?: (newTask: TaskWithOwnerDetail) => void;
  taskStatus?: TaskStatus;
}

export const TaskModal = ({
  projectId,
  taskId = 0,
  initialData,
  onClose,
  isOpen,
  taskStatus,
}: TaskModalProps) => {
  const { mutate: createTask } = usePostProjectTask(projectId);
  const { mutate: updateTask } = useUpdateProjectTask(taskId);
  const queryClient = useQueryClient();

  const toast = useToast();
  const { control, handleSubmit, reset, watch } = useForm<TaskCreate>({
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      ownerId: initialData?.ownerId || undefined,
      priority: initialData?.priority || "LOW",
      progress: initialData?.progress || 0,
      startDate:
        initialData?.startDate ||
        dayjs().startOf("day").format("YYYY-MM-DDTHH:mm"),
      endDate:
        initialData?.endDate ||
        dayjs().add(7, "day").startOf("day").format("YYYY-MM-DDTHH:mm"),
      taskStatus: initialData?.status || taskStatus,
    },
  });
  const [previousStatus, setPreviousStatus] = useState<TaskStatus>(
    initialData?.status || "PENDING"
  );

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const handleUpdateTask = (data: TaskCreate, prevStatus: TaskStatus) => {
    if (taskId) {
      updateTask(
        { ...data },
        {
          onSuccess: () => {
            toast({
              title: "태스크 수정 성공",
              description: "태스크가 성공적으로 수정되었습니다.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });

            const updatedStatus = data.taskStatus;

            const statusesToRefetch: TaskStatus[] = [prevStatus, updatedStatus];

            statusesToRefetch.forEach((status) => {
              queryClient.refetchQueries({
                queryKey: ["taskList", projectId, status],
              });
            });

            onClose();
            reset();
          },
          onError: () => {
            toast({
              title: "수정 실패",
              description: "태스크 수정 중 오류가 발생했습니다.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          },
        }
      );
    }
  };

  const handleCreateTask = (data: TaskCreate) => {
    createTask(data, {
      onSuccess: () => {
        toast({
          title: "태스크 생성 성공",
          description: "태스크가 성공적으로 생성되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        queryClient.refetchQueries({
          queryKey: ["taskList", projectId, data.taskStatus],
        });

        onClose();
        reset();
      },
      onError: () => {
        toast({
          title: "생성 실패",
          description: "태스크 생성 중 오류가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    });
  };

  const onSubmit = (data: TaskCreate) => {
    if (taskId) {
      if (data?.description == null) data.description = "";
      handleUpdateTask(data, previousStatus);
    } else {
      handleCreateTask(data);
    }
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        name: initialData?.name || "",
        description: initialData?.description || "",
        ownerId: initialData?.ownerId || undefined,
        priority: initialData?.priority || "LOW",
        progress: initialData?.progress || 0,
        startDate:
          initialData?.startDate ||
          dayjs().startOf("day").format("YYYY-MM-DDTHH:mm"),
        endDate:
          initialData?.endDate ||
          dayjs().add(7, "day").startOf("day").format("YYYY-MM-DDTHH:mm"),
        taskStatus: initialData?.status || taskStatus,
      });
      setPreviousStatus(initialData?.status || "PENDING");
    }
  }, [isOpen, initialData, taskStatus, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
        reset();
      }}
      isCentered
      autoFocus={true}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{taskId ? "태스크 수정" : "태스크 생성"}</ModalHeader>
        <ModalCloseButton autoFocus={true} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Controller
              name="name"
              control={control}
              rules={{ required: "이름은 필수 입력 사항입니다." }}
              render={({ field, fieldState: { error, invalid } }) => (
                <TextField
                  label="태스크 이름"
                  {...field}
                  maxLength={20}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                  autoComplete="name"
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { invalid } }) => (
                <TextField label="태스크 설명" {...field} isInvalid={invalid} />
              )}
            />

            <Controller
              name="ownerId"
              control={control}
              rules={{ required: "팀원은 필수 선택 사항입니다." }}
              render={({ field, fieldState }) => (
                <SelectProjectMemberField
                  label="팀원 선택"
                  value={field.value}
                  onChange={field.onChange}
                  isInvalid={!!fieldState?.error}
                  errorMessage={fieldState?.error?.message}
                />
              )}
            />

            <Controller
              name="priority"
              control={control}
              rules={{ required: "우선순위를 선택해주세요." }}
              render={({ field }) => (
                <RadioField
                  label="우선순위"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "낮음", value: "LOW" },
                    { label: "보통", value: "MEDIUM" },
                    { label: "높음", value: "HIGH" },
                  ]}
                />
              )}
            />

            <Controller
              name="startDate"
              control={control}
              rules={{
                required: "시작일은 필수 입력 사항입니다.",
                validate: (value) => {
                  if (value && endDate) {
                    const start = new Date(value);
                    const end = new Date(endDate);
                    return start < end || "시작일은 종료일 이전이어야 합니다.";
                  }
                  return true;
                },
              }}
              render={({ field, fieldState: { error, invalid } }) => (
                <DateField
                  label="시작일"
                  {...field}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              rules={{
                required: "종료일은 필수 입력 사항입니다.",
                validate: (value) => {
                  if (!value) return "종료일은 필수 입력 사항입니다.";
                  if (startDate) {
                    const start = new Date(startDate);
                    const end = new Date(value);
                    if (end <= start) return "종료일은 시작일 이후여야 합니다.";
                  }
                  return true;
                },
              }}
              render={({ field, fieldState: { error, invalid } }) => (
                <DateField
                  label="종료일"
                  {...field}
                  isInvalid={invalid}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              name="taskStatus"
              control={control}
              defaultValue="PENDING"
              render={({ field }) => (
                <RadioField
                  label="상태"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { label: "시작 전", value: "PENDING" },
                    { label: "진행 중", value: "IN_PROGRESS" },
                    { label: "완료", value: "COMPLETED" },
                  ]}
                />
              )}
            />

            <Controller
              name="progress"
              control={control}
              render={({ field }) => (
                <SliderField
                  label="진행률"
                  min={0}
                  max={100}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </ModalBody>

          <ModalFooter>
            <Button mr={3} bg="#95A4FC" color="white" type="submit">
              {taskId ? "수정" : "생성"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
