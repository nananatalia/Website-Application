import { z } from "zod";

// walidacja danych wejściowych używając biblioteczki zod
// rejestracja
const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nazwa musi mieć co najmniej 2 znaki"),
  email: z
    .string()
    .trim()
    .min(1, "Email jest wymagany")
    .email("Proszę podać poprawny email")
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Hasło jest wymagane")
    .min(6, "Hasło musi mieć co najmniej 6 znaków"),
  confirmPassword: z
    .string()
    .min(1, "Potwierdzenie hasła jest wymagane"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"], // Błąd zostanie przypisany do pola confirmPassword
});

// login
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email jest wymagany")
    .email("Proszę podać poprawny email")
    .toLowerCase(),
  password: z.string().min(1, "Hasło jest wymagane"),
});

export { registerSchema, loginSchema };