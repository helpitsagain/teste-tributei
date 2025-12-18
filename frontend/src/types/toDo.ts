export interface ToDo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface ToDosResponse {
  toDos: ToDo[];
  total: number;
  page: number;
  totalPages: number;
}
