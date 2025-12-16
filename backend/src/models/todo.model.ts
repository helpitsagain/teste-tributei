export interface ToDo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

let todos: ToDo[] = [];

// Gerar 500 to-dos fictícios
for (let i = 1; i <= 500; i++) {
  todos.push({
    id: i,
    title: `To-do ${i}`,
    description: `Description ${i}`,
    completed: Math.random() > 0.5, // aleatório
  });
}

export const getToDos = () => todos;

export const setToDos = (newToDos: ToDo[]) => {
  todos = newToDos;
};
