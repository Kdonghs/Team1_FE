import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import type { ProjectDetail } from "@/api/generated/data-contracts";

import { useGetProjectDetail } from "../../../../api/hooks/useGetProjectDetail";
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

  const onSubmit = handleSubmit((updatedData) => {
    if (!isValid) {
      return;
    }

    const newName = updatedData.name?.trim();
    const newStartDate = updatedData.startDate
      ? new Date(updatedData.startDate).toISOString()
      : undefined;
    const newEndDate = updatedData.endDate
      ? new Date(updatedData.endDate).toISOString()
      : undefined;

    const projectData: ProjectDetail = {
      id: projectId || undefined,
      name: newName,
      startDate: newStartDate || undefined,
      endDate: newEndDate || undefined,
      optionIds: updatedData.optionIds,
    };

    // TODO: API 호출 로직 구현
    console.log(projectData);
    onClose();
  });

  // TODO: 향후 기본 상태에 대한 논의 필요
  const [selectedFeature, setSelectedFeature] = useState("기본");
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
          <form action="" onSubmit={onSubmit}>
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
