export interface ReciterTranslation {
  language: string;
  name: string;
  nationality: string | null;
  shortBio: string | null;
  biography: string | null;
  seoTitle: string | null;
  tags: string | null;
}

/** List-endpoint item — one translation for the requested language */
export interface Reciter {
  id: string;
  slug: string;
  imageUrl: string | null;
  countryCode: string | null;
  style: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  totalDiscoveries: number;
  createdAt: string;
  updatedAt: string;
  translation: ReciterTranslation | null;
}

/** Admin detail endpoint — all translations */
export interface AdminReciter {
  id: string;
  slug: string;
  imageUrl: string | null;
  countryCode: string | null;
  style: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  totalDiscoveries: number;
  createdAt: string;
  updatedAt: string;
  translations: ReciterTranslation[];
}

export interface PaginatedReciters {
  data: Reciter[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
