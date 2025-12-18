import { ToDo, getToDos, setToDos } from "../models/todo.model";

export const getToDosPaginated = (page: number, limit: number) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const toDos = getToDos();
  const total = toDos.length;

  const uniqueToDos = Array.from(
    new Map(toDos.map((item) => [item.id, item])).values(),
  );

  const paginatedToDos = uniqueToDos.slice(startIndex, endIndex);

  return {
    toDos: paginatedToDos,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateToDo = (id: string, updatedToDo: Partial<ToDo>) => {
  const toDos = getToDos();
  const index = toDos.findIndex((toDo) => toDo.id === id);

  if (index === -1) {
    return null;
  }

  toDos[index] = { ...toDos[index], ...updatedToDo };
  setToDos(toDos);

  return toDos[index];
};

export const bulkUpdateToDos = (ids: string[], updates: Partial<ToDo>) => {
  const toDos = getToDos();
  const updatedToDos: ToDo[] = [];

  ids.forEach((id) => {
    const index = toDos.findIndex((toDo) => toDo.id === id);
    if (index !== -1) {
      toDos[index] = { ...toDos[index], ...updates };
      updatedToDos.push(toDos[index]);
    }
  });

  setToDos(toDos);

  return updatedToDos;
};
