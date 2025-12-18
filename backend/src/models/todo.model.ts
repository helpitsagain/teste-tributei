import { v4 as uuidv4 } from "uuid";

export interface ToDo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

let toDos: ToDo[] = [];

// Gerar 500 to-dos fictícios
for (let i = 1; i <= 500; i++) {
  toDos.push({
    id: uuidv4(),
    title: `To-do ${i}`,
    description: `Description ${i}`,
    completed: Math.random() > 0.5, // aleatório
  });
}

export const getToDos = () => toDos;

export const setToDos = (newToDos: ToDo[]) => {
  toDos = newToDos;
};
