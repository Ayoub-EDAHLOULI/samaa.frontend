// SurahResponse — id is the Quran number (1–114)
export interface Surah {
  id: number;
  arabicName: string;
  englishName: string;
  ayahCount: number;
}

// PUT /surahs/:id body — all fields optional
export interface UpdateSurahDto {
  arabicName?: string;
  englishName?: string;
  ayahCount?: number;
}
