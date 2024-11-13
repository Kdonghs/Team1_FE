import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface CreateProjectRequest {
  name: string;
  description?: string;
  imageURL?: string;
  optionIds: number[];
  startDate: string;
  endDate: string;
  endDateAfterStartDate: boolean;
  atLeastOneDayDifference: boolean;
}

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      const response = await axios.post("/api/project", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
