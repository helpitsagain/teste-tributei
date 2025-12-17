import React, { useState, useEffect, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToDo } from "../../types/toDo";
import { getToDos } from "../../services/toDoService";
import TodoItem from "./ToDoItem";
import BulkActionModal from "../BulkActionModal/BulkActionModal";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";

const TodoList: React.FC = () => {
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedToDos, setSelectedToDos] = useState<number[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  const initialLoadRef = useRef(false);

  const loadToDos = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getToDos(page, 10);
      console.log("response", response.toDos);

      setToDos((prev) => [...prev, ...response.toDos]);

      setPage((prev) => prev + 1);

      setHasMore(response.page < response.totalPages);
    } catch (err) {
      console.log(err);

      setError("Failed to load todos. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  const handleSelectTodo = (id: number) => {
    setSelectedToDos((prev) =>
      prev.includes(id)
        ? prev.filter((todoId) => todoId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedToDos.length === toDos.length) {
      setSelectedToDos([]);
    } else {
      setSelectedToDos(toDos.map((todo) => todo.id));
    }
  };

  const handleBulkAction = () => {
    if (selectedToDos.length > 0) {
      setIsBulkModalOpen(true);
    }
  };

  const handleBulkConfirm = async (updates: Partial<ToDo>) => {
    // Chamar a API para atualização em massa
    // Depois fechar o modal e atualizar a lista
    // Por simplicidade, vamos apenas atualizar o estado local
    setToDos((prev) =>
      prev.map((todo) =>
        selectedToDos.includes(todo.id) ? { ...todo, ...updates } : todo,
      ),
    );
    setSelectedToDos([]);
    setIsBulkModalOpen(false);
  };

  const handleUpdateTodo = (updatedTodo: ToDo) => {
    setToDos((prev) =>
      prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
    );
  };

  // LIFECYCLE HOOOKS
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      loadToDos();
    }
  }, [loadToDos]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        loadToDos();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadToDos, loading, hasMore]);

  if (error && toDos.length === 0) {
    return <Error message={error} onRetry={loadToDos} />;
  }

  return (
    <div>
      <div>
        <button onClick={handleSelectAll}>
          {selectedToDos.length === toDos.length
            ? "Deselect All"
            : "Select All"}
        </button>
        <button
          onClick={handleBulkAction}
          disabled={selectedToDos.length === 0}
        >
          Bulk Action (Mark as Completed)
        </button>
      </div>

      <InfiniteScroll
        dataLength={toDos.length}
        next={loadToDos}
        hasMore={hasMore}
        loader={<Loader />}
        endMessage={<p>No more todos.</p>}
      >
        {toDos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isSelected={selectedToDos.includes(todo.id)}
            onSelect={handleSelectTodo}
            onUpdate={handleUpdateTodo}
          />
        ))}
      </InfiniteScroll>

      {isBulkModalOpen && (
        <BulkActionModal
          selectedIds={selectedToDos}
          todos={toDos}
          onConfirm={handleBulkConfirm}
          onCancel={() => setIsBulkModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TodoList;
