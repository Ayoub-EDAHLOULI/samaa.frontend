export interface RecognitionResultResponse {
  isMatch: boolean;
  confidence: number;
  message: string;
  recognitionId?: string;
  reciter?: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  };
}

export interface RecognitionHistoryItem {
  id: string;
  confidenceScore: number;
  audioDuration: number | null;
  deviceOs: string | null;
  ayahNumber: number | null;
  createdAt: string;
  reciter: {
    id: string;
    name: string;
    slug: string;
    imageUrl: string | null;
  };
  surah: {
    id: number;
    arabicName: string;
    englishName: string;
  } | null;
}

export interface AdminRecognitionItem extends RecognitionHistoryItem {
  user: {
    id: string;
    displayName: string;
    email: string;
  } | null;
}

export interface PaginatedRecognitions {
  data: AdminRecognitionItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginatedHistory {
  data: RecognitionHistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
