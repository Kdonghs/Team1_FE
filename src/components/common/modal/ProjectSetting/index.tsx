import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import type {
  ProjectDetail,
  ProjectUpdate,
} from "../../../../api/generated/data-contracts";
import {
  useGetProjectDetail,
  useUpdateProject,
} from "../../../../api/hooks/project.api";
import { getKoreanTimeISO } from "../../../../utils/dateUtils";
import { ProjectOptionSettingFields } from "../ProjectSetting/ProjectSettingForm/projectOptionSettingFields";
import { AnimatedPageTransition } from "./animatedPageTransition";
import { ProjectDetailSettingFields } from "./ProjectSettingForm/projectDetailSettingFields";
import { renderFooterButtons } from "./renderFooterButtons";

export const ProjectSettingModal = ({ onClose }: { onClose: () => void }) => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : null;

  const methods = useForm<ProjectDetail>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      startDate: "",
      endDate: "",
      optionIds: [2, 4],
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const { data, error, isLoading } = useGetProjectDetail(projectId);
  const [selectedFeature, setSelectedFeature] = useState("기본");
  const { mutateAsync } = useUpdateProject(projectId);
  const toast = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      methods.reset({
        name: data.name || "",
        startDate: data.startDate ? data.startDate.slice(0, 16) : "",
        endDate: data.endDate ? data.endDate.slice(0, 16) : "",
        optionIds: data.optionIds || [],
      });

      if (
        JSON.stringify(data.optionIds) === JSON.stringify([2, 4]) ||
        JSON.stringify(data.optionIds) === JSON.stringify([4, 2])
      ) {
        setSelectedFeature("기본");
      } else {
        setSelectedFeature("사용자 설정");
      }
    }
  }, [data, methods]);

  const onSubmit = handleSubmit(async (updatedData) => {
    if (!isValid) return;

    try {
      const newName = updatedData.name?.trim();
      const newStartDate = updatedData.startDate
        ? getKoreanTimeISO(new Date(updatedData.startDate))
        : undefined;
      const newEndDate = updatedData.endDate
        ? getKoreanTimeISO(new Date(updatedData.endDate))
        : undefined;
      const newOptionIds =
        selectedFeature === "기본" ? [2, 4] : updatedData.optionIds || [];

      const updatedProjectData: ProjectUpdate = {
        name: newName || "",
        startDate: newStartDate,
        endDate: newEndDate,
        optionIds: newOptionIds,
      };

      await mutateAsync(updatedProjectData);

      toast({
        title: "프로젝트 업데이트 성공",
        description: "프로젝트가 성공적으로 업데이트되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      queryClient.refetchQueries({ queryKey: ["project", projectId] });
      onClose();
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      const errorMessage = err.request.responseText;
      toast({
        title: "업데이트 실패",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  const preventEnterKeySubmission = (
    e: React.KeyboardEvent<HTMLFormElement>
  ) => {
    const target = e.target as HTMLFormElement;
    if (e.key === "Enter" && !["TEXTAREA"].includes(target.tagName)) {
      e.preventDefault();
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [back, setBack] = useState(false);

  const handleNextPage = async () => {
    const isFormValid = await methods.trigger();
    if (isFormValid) {
      setCurrentPage(2);
      setBack(false);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage(1);
    setBack(true);
  };

  if (error) {
    return <div>{error.message}</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ModalOverlay />
      <StyledModalContent>
        <ModalHeader fontSize={26} fontWeight={800} pb={10}>
          프로젝트 설정
        </ModalHeader>
        <ModalCloseButton m={5} />
        <FormProvider {...methods}>
          <form
            action=""
            onSubmit={onSubmit}
            onKeyDown={preventEnterKeySubmission}
          >
            <AnimatedPageTransition currentPage={currentPage} back={back}>
              <ModalBody>
                {currentPage === 1 ? (
                  <ProjectDetailSettingFields
                    selectedFeature={selectedFeature}
                    setSelectedFeature={setSelectedFeature}
                  />
                ) : (
                  <>
                    <ProjectOptionSettingFields />
                    <Spacer height="24px" />
                  </>
                )}
              </ModalBody>
            </AnimatedPageTransition>

            <ModalFooter>
              {renderFooterButtons(
                currentPage,
                selectedFeature,
                handleNextPage,
                handlePreviousPage,
                onSubmit,
                isValid
              )}
            </ModalFooter>
          </form>
        </FormProvider>
      </StyledModalContent>
    </>
  );
};

const StyledModalContent = styled(ModalContent)`
  border-radius: 16.23px;
  padding: 0.5em;
  overflow: hidden;
`;
