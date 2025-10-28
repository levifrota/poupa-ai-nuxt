import { z } from "zod";

export const generateAiReportSchema = z
  .object({
    startDate: z.string().refine(
      (value) => {
        if (!value) return false;
        const date = new Date(value);
        return !Number.isNaN(date.getTime());
      },
      "Data de início inválida",
    ),
    endDate: z.string().refine(
      (value) => {
        if (!value) return false;
        const date = new Date(value);
        return !Number.isNaN(date.getTime());
      },
      "Data de fim inválida",
    ),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return startDate <= endDate;
    },
    {
      message: "A data de início deve ser anterior ou igual à data de fim",
      path: ["endDate"],
    },
  );

export type GenerateAiReportSchema = z.infer<typeof generateAiReportSchema>;
