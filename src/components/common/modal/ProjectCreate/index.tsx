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

// import { useCreateProject } from "../../../../api/hooks/useCreateProjects";
import { AnimatedPageTransition } from "./animatedPageTransition";
import { ProjectDetailCreatingFields } from "./ProjectCreatingForm/projectDetailCreatingFields";
import { ProjectOptionCreatingFields } from "./ProjectCreatingForm/ProjectOptionCreatingFields";
import { renderFooterButtons } from "./renderFooterButtons";

interface ProjectDetail {
  name: string;
  description?: string;
  imageURL?: string;
  startDate: string;
  endDate: string;
  optionIds: number[];
}

interface ProjectCreatingModalProps {
  onClose: () => void;
  onProjectCreated: (project: any) => void;
}

export const ProjectCreatingModal = ({
  onClose,
  onProjectCreated,
}: ProjectCreatingModalProps) => {
  const methods = useForm<ProjectDetail>({
    mode: "onBlur",
    defaultValues: {
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
  // const { mutate: createProject } = useCreateProject();
  const toast = useToast();

  const onSubmit = handleSubmit((data) => {
    if (!isValid) return;

    const newStartDate = data.startDate
      ? new Date(data.startDate).toISOString()
      : "";
    const newEndDate = data.endDate ? new Date(data.endDate).toISOString() : "";

    const projectData = {
      name: data.name?.trim() || "",
      description: data.description,
      imageURL: data.imageURL,
      startDate: newStartDate,
      endDate: newEndDate,
      optionIds: selectedFeature === "기본" ? [2, 4] : data.optionIds || [],
      endDateAfterStartDate: true,
      atLeastOneDayDifference: true,
    };

    // createProject(projectData, {
    //   onSuccess: () => {
    //     toast({
    //       title: "프로젝트 생성 성공",
    //       description: "프로젝트가 성공적으로 생성되었습니다.",
    //       status: "success",
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //     onClose();
    //   },
    //   onError: (err) => {
    //     toast({
    //       title: "프로젝트 생성 실패",
    //       description: "프로젝트 생성 중 오류가 발생했습니다.",
    //       status: "error",
    //       duration: 3000,
    //       isClosable: true,
    //     });
    //     console.error(err);
    //   },
    // });

    // 임시 코드
    onProjectCreated(projectData);

    toast({
      title: "프로젝트 생성 성공",
      description: "프로젝트가 성공적으로 생성되었습니다.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

    onClose();
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
