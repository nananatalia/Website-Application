// middleware do walidacji requestów przy użyciu biblioteki zod
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    // jeśli walidacja nie powiedzie się, zwracamy błąd 400 z informacją o błędach walidacji
    if (!result.success) {
      const formatted = result.error.format();

      const flatErrors = Object.values(formatted)
        .flat()
        .filter(Boolean)
        .map((err) => err._errors)
        .flat();

      return res.status(400).json({ message: flatErrors.join(", ") });
    }

    next();
  };
};