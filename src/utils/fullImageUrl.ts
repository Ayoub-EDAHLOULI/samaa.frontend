const fullImageUrl = (imgPath: string | null | undefined): string => {
  if (!imgPath) return "";

  // Already absolute (http/https) or a local blob — return as-is
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://") || imgPath.startsWith("blob:")) {
    return imgPath;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_IMAGES || "";
  return `${baseUrl}${imgPath}`;
};

export default fullImageUrl;
