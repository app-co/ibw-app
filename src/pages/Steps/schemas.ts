import { z } from "zod";

export const schemaRegister = z.object({
  name: z.string(),
  born: z.string(),
  sex: z.string(),
  country: z.string(),
  surf_begin: z.string(),
  cpf_passport: z.string(),
  email: z.string().email(),
  foto: z.string(),
  regulamento: z.boolean().default(false),
});

export type TRegister = z.infer<typeof schemaRegister>;
