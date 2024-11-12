import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import { Controller, useForm } from "react-hook-form";

import type { TaskCreate } from "@/api/generated/data-contracts";

import { usePostProjectTask } from "../../../../api/hooks/usePostProjectTask";
import { DateField } from "../../../../components/common/Fields/dateField";
import { RadioField } from "../../../../components/common/Fields/radioField";
import { SelectProjectMemberField } from "../../../../components/common/Fields/selectProjectMemberField";
import { SliderField } from "../../../../components/common/Fields/sliderField";
import { TextField } from "../../../../components/common/Fields/textField";

export const AddTaskButton = ({ projectId }: { projectId: number }) => {
  const { mutate } = usePostProjectTask(projectId);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TaskCreate>({
    defaultValues: {
      name: "",
      description: "",
      ownerId: undefined,
      priority: "LOW",
      progress: 0,
      startDate: dayjs().startOf("day").format("YYYY-MM-DDTHH:mm"),
      endDate: dayjs().add(7, "day").startOf("day").format("YYYY-MM-DDTHH:mm"),
      taskStatus: "PENDING",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = (data: TaskCreate) => {
    console.log(data);
    mutate(data, {
      onSuccess: () => {
        toast({
          title: "태스크 생성 성공",
          description: "태스크가 성공적으로 생성되었습니다.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        reset();
      },
      onError: () => {
        toast({
          title: "태스크 생성 실패",
          description: "태스크 생성 중 오류가 발생했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    });
  };

  return (
    <>
      <Flex justifyContent="center">
        <IconButton
          isRound
          variant="solid"
          aria-label="AddTask"
          fontSize="20px"
          icon={<AddIcon />}
          bg="transparent"
          color="#727272"
          onClick={onOpen}
        />
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          reset();
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>새 태스크 추가</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Controller
                name="name"
                control={control}
                defaultValue="name"
                rules={{
                  required: "이름은 필수 입력 사항입니다.",
                }}
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
                name="ownerId"
                control={control}
                rules={{
                  required: "팀원은 필수 선택 사항입니다.",
                }}
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
                defaultValue="LOW"
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

                      return (
                        start < end || "시작일은 종료일 이전이어야 합니다."
                      );
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

                      if (end <= start) {
                        return "종료일은 시작일 이후여야 합니다.";
                      }

                      const oneDayInMillis = 24 * 60 * 60 * 1000;
                      if (end.getTime() - start.getTime() < oneDayInMillis) {
                        return "시작일과 마감일 간격은 1일 이상이어야 합니다.";
                      }
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
                rules={{
                  min: { value: 0, message: "진행률은 0 이상이어야 합니다." },
                  max: { value: 100, message: "진행률은 100 이하여야 합니다." },
                }}
                render={({ field }) => (
                  <SliderField
                    label="진행률"
                    min={0}
                    max={100}
                    value={field.value}
                    onChange={field.onChange}
                    isInvalid={!!errors.progress}
                    errorMessage={errors.progress?.message}
                  />
                )}
              />
            </ModalBody>

            <ModalFooter>
              <Button mr={3} bg="#95A4FC" color="white" type="submit">
                태스크 생성
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};
