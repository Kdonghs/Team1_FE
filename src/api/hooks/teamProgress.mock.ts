import { rest } from "msw";

export const mockTeamProgressData = {
  errorCode: 200,
  errorMessage: "Success",
  resultData: [
    {
      teamMember: {
        id: 1,
        name: "김",
        role: "팀원",
        imageURL: "",
      },
      progress: 1,
      activeTasks: [
        {
          id: 1,
          name: "태스크1",
          description: "첫번째 태스크입니다.",
          ownerId: 1,
          progress: 1,
          startDate: "2024-10-10T00:00:00",
          endDate: "2025-09-03T00:00:00",
          priority: "HIGH",
          status: 50,
        },
      ],
    },
    {
      teamMember: {
        id: 2,
        name: "이",
        role: "팀원",
        imageURL: "",
      },
      progress: 30,
      activeTasks: [],
    },
    {
      teamMember: {
        id: 3,
        name: "박",
        role: "팀원",
        imageURL: "",
      },
      progress: 70,
      activeTasks: [],
    },
  ],
  size: 2147483647,
  page: 0,
  pages: 1,
  hasNext: false,
  total: 3,
};

export const teamProgressMockHandler = [
  rest.get(
    `https://seamlessup.com/api/project/:projectId/task/progress`,
    (_, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockTeamProgressData));
    }
  ),
];
