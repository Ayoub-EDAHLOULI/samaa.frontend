export function mapBackendValidationErrors(errors: string[]) {
  const result: any = {};

  errors.forEach((err) => {
    // "body.handle: message"
    const [path, message] = err.split(":").map((s) => s.trim());

    if (!path || !message) return;

    // Remove "body."
    const cleanPath = path.replace(/^body\./, "");

    // Handle translations.en.title
    if (cleanPath.startsWith("translations.")) {
      const [, lang, field] = cleanPath.split(".");
      result.translations ??= {};
      result.translations[lang] ??= {};
      result.translations[lang][field] = message;
    } else {
      result[cleanPath] = message;
    }
  });

  return result;
}
