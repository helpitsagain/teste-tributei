export interface ToDo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface ToDosResponse {
  success: boolean;
  data: {
    toDos: ToDo[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export type SortByField = 'title' | 'created_date' | 'updated_date';
export type SortOrder = 'asc' | 'desc';

export interface SortOption {
  sortBy: SortByField;
  sortOrder: SortOrder;
}
