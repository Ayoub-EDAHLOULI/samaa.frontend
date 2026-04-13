import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Factory — pass the `t` function from useTranslations("loginPage")
// so error messages come from the active locale's message file.
export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .refine((v) => emailRegex.test(v), t("validation.emailInvalid")),
    password: z.string().min(1, t("validation.passwordRequired")),
  });

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;

// Registration schema factory
export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      displayName: z
        .string()
        .min(2, t("validation.displayNameMin"))
        .max(100, t("validation.displayNameMax")),
      email: z
        .string()
        .min(1, t("validation.emailRequired"))
        .refine((v) => emailRegex.test(v), t("validation.emailInvalid")),
      password: z
        .string()
        .min(8, t("validation.passwordMin"))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("validation.passwordStrength"),
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("validation.passwordMismatch"),
      path: ["confirmPassword"],
    });

export type RegisterFormValues = z.infer<
  ReturnType<typeof createRegisterSchema>
>;

// Forgot password schema factory
export const createForgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .refine((v) => emailRegex.test(v), t("validation.emailInvalid")),
  });

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof createForgotPasswordSchema>
>;
