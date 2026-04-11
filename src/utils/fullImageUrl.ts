const fullImageUrl = (imgPath: string | null | undefined): string => {
  if (!imgPath) {
    return "";
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_IMAGES || "";
  return `${baseUrl}${imgPath}`;
};

export default fullImageUrl;
