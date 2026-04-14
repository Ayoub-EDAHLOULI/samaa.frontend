export interface Language {
  id: number;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLanguageDto {
  code: string;
  name: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface UpdateLanguageDto {
  name?: string;
  isDefault?: boolean;
  isActive?: boolean;
}
