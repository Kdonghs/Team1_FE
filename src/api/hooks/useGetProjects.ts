import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Project {
  id: number;
  name: string;
  description?: string;
  imageURL?: string;
  startDate: string;
  endDate: string;
  optionIds: number[];
  totalMembers?: number;
  projectManager?: {
    name: string;
    imageURL?: string;
  };
}

export const useGetProjects = () => {
  return useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axios.get("/api/project");
      return response.data;
    },
  });
};
