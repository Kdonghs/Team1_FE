import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { useCreateProject } from "../../../../api/hooks/useCreateProjects";
import type { Project, ProjectData } from "../../../../types";
import { AnimatedPageTransition } from "./animatedPageTransition";
import { ProjectDetailCreatingFields } from "./ProjectCreatingForm/projectDetailCreatingFields";
import { ProjectOptionCreatingFields } from "./ProjectCreatingForm/ProjectOptionCreatingFields";
import { renderFooterButtons } from "./renderFooterButtons";

interface ProjectCreatingModalProps {
  onClose: () => void;
  onProjectCreated: (project: ProjectData) => void;
}

export const ProjectCreatingModal = ({
  onClose,
  onProjectCreated,
}: ProjectCreatingModalProps) => {
  const methods = useForm<Project>({
    mode: "onBlur",
    defaultValues: {
      id: 0,
      name: "",
      description: "",
      imageURL: "",
      startDate: "",
      endDate: "",
      optionIds: [2, 4],
    },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = methods;

  const [selectedFeature, setSelectedFeature] = useState("기본");
  const { mutateAsync: createProject, isPending } = useCreateProject();
  const toast = useToast();

  const validateDates = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) {
      throw new Error("시작일과 종료일을 모두 입력해주세요.");
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    if (
      endDateObj <= startDateObj ||
      endDateObj.getTime() - startDateObj.getTime() < oneDayInMilliseconds
    ) {
      throw new Error("종료일은 시작일보다 최소 1일 이후여야 합니다.");
    }

    return {
      endDateAfterStartDate: true,
      atLeastOneDayDifference: true,
    };
  };

  const onSubmit = handleSubmit((data) => {
    if (!isValid) return;

    try {
      const newStartDate = data.startDate
        ? new Date(data.startDate).toISOString()
        : "";
      const newEndDate = data.endDate
        ? new Date(data.endDate).toISOString()
        : "";

      const dateValidation = validateDates(newStartDate, newEndDate);

      const projectData = {
        name: data.name?.trim() || "",
        description: data.description || "",
        imageURL: data.imageURL?.trim() || undefined,
        startDate: newStartDate,
        endDate: newEndDate,
        optionIds: selectedFeature === "기본" ? [2, 4] : data.optionIds || [],
        ...dateValidation,
      };

      createProject(projectData, {
        onSuccess: (response) => {
          toast({
            title: "프로젝트 생성 성공",
            description: "프로젝트가 성공적으로 생성되었습니다.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onProjectCreated({
            ...response.resultData,
            ...dateValidation,
          });
          onClose();
        },
      });
    } catch (error) {
      toast({
        title: "프로젝트 생성 실패",
        description:
          error instanceof Error
            ? error.message
            : "프로젝트 생성 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  });

  const preventEnterKeySubmission = (
    e: React.KeyboardEvent<HTMLFormElement>,
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

  return (
    <>
      <ModalOverlay />
      <StyledModalContent>
        <ModalHeader fontSize={26} fontWeight={800} pb={10}>
          프로젝트 생성
        </ModalHeader>
        <ModalCloseButton m={5} />
        <FormProvider {...methods}>
          <form onSubmit={onSubmit} onKeyDown={preventEnterKeySubmission}>
            <AnimatedPageTransition currentPage={currentPage} back={back}>
              <ModalBody>
                {currentPage === 1 ? (
                  <ProjectDetailCreatingFields
                    selectedFeature={selectedFeature}
                    setSelectedFeature={setSelectedFeature}
                  />
                ) : (
                  <>
                    <ProjectOptionCreatingFields />
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
                isValid,
                isPending,
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
