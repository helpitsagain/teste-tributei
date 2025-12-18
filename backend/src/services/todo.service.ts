import { v4 as uuidv4 } from "uuid";
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

export const bulkDeleteToDos = (ids: string[]) => {
  const toDos = getToDos();

  const { remainingToDos, deletedToDos } = toDos.reduce(
    (acc, toDo) => {
      if (ids.includes(toDo.id)) {
        acc.deletedToDos.push(toDo);
      } else {
        acc.remainingToDos.push(toDo);
      }
      return acc;
    },
    { remainingToDos: [], deletedToDos: [] } as {
      remainingToDos: ToDo[];
      deletedToDos: ToDo[];
    },
  );

  setToDos(remainingToDos);

  return deletedToDos;
};

export const createToDo = (title: string, description: string) => {
  const toDos = getToDos();

  const newToDo: ToDo = {
    id: uuidv4(),
    title,
    description,
    completed: false,
  };

  toDos.push(newToDo);

  setToDos(toDos);

  return newToDo;
};

export const deleteToDo = (id: string) => {
  const toDos = getToDos();

  const index = toDos.findIndex((toDo) => toDo.id === id);

  if (index === -1) {
    return null;
  }

  const [removedToDo] = toDos.splice(index, 1);

  setToDos(toDos);

  return removedToDo;
};
