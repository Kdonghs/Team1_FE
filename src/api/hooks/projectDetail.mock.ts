import { rest } from "msw";

export const projectMockHandler = [
  rest.get(`https://seamlessup.com/api/project/:projectId`, (req, res, ctx) => {
    const { projectId } = req.params;

    const projectData = {
      id: projectId,
      name: `모킹 프로젝트 ${projectId}`,
      startDate: "2024-11-03T05:42:00.000Z",
      endDate: "2024-11-04T05:42:00.000Z",
      optionIds: [1, 2, 3],
    };

    return res(
      ctx.status(200),
      ctx.json({
        resultData: projectData,
      })
    );
  }),

  rest.put(
    `https://seamlessup.com/api/project/:projectId`,
    async (req, res, ctx) => {
      const { projectId } = req.params;
      const updatedData = await req.json();
      return res(
        ctx.status(200),
        ctx.json({
          resultData: {
            id: projectId,
            ...updatedData,
          },
        })
      );
    }
  ),
];
