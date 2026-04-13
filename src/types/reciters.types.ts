export interface Reciter {
  id: string;
  name: string;
  slug: string;
  biography: string | null;
  imageUrl: string | null;
  nationality: string | null;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
  totalDiscoveries: number;
  favoritesCount: number;
  createdAt: string;
  updatedAt: string;
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
