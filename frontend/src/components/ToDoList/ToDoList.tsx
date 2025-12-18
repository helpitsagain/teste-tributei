import React, { useState, useEffect, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToDo } from "../../types/toDo";
import {
  bulkUpdateToDos,
  getToDos,
  updateToDo,
  bulkDeleteToDos,
} from "../../services/toDoService";
import TodoItem from "./ToDoItem";
import BulkActionModal from "../BulkActionModal/BulkActionModal";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import NewToDoModal from "../NewToDoModal/NewToDoModal";
import "./ToDoList.scss";

const PAGE_LIMIT = 10;

const TodoList: React.FC = () => {
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedToDos, setSelectedToDos] = useState<string[]>([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isNewToDoModalOpen, setIsNewToDoModalOpen] = useState(false);
  const [isListEmpty, setIsListEmpty] = useState(false);

  const initialLoadRef = useRef(false);

  const loadToDos = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getToDos(page, PAGE_LIMIT);

      setToDos((prev) => {
        const existingIds = new Set(prev.map((toDo) => toDo.id));

        const newToDos = response.toDos.filter(
          (toDo) => !existingIds.has(toDo.id),
        );

        return [...prev, ...newToDos];
      });

      setPage(response.page + 1);

      setHasMore(response.page < response.totalPages);
    } catch (e) {
      console.log(e);

      setError("Failed to load todos. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  const handleSelectTodo = (id: string) => {
    setSelectedToDos((prev) =>
      prev.includes(id)
        ? prev.filter((todoId) => todoId !== id)
        : [...prev, id],
    );
  };

  const handleCreateToDoButton = () => {
    setIsNewToDoModalOpen(true);
  };

  const handleSelectAll = () => {
    if (selectedToDos.length === toDos.length) {
      setSelectedToDos([]);
    } else {
      setSelectedToDos(toDos.map((todo) => todo.id));
    }
  };

  const handleBulkActionButton = () => {
    if (selectedToDos.length > 0) {
      setIsBulkModalOpen(true);
    }
  };

  const handleBulkUpdate = async (updates: Partial<ToDo>) => {
    try {
      await bulkUpdateToDos(selectedToDos, updates);

      setToDos((prev) =>
        prev.map((toDo) =>
          selectedToDos.includes(toDo.id) ? { ...toDo, ...updates } : toDo,
        ),
      );

      setIsBulkModalOpen(false);
      setSelectedToDos([]);
    } catch (e) {
      console.log(e);

      setError("Failed to update to-dos.");
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await bulkDeleteToDos(selectedToDos);

      const { remainingToDos } = toDos.reduce(
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

      setToDos((prev) => prev.filter((toDo) => !ids.includes(toDo.id)));

      setIsBulkModalOpen(false);
      setSelectedToDos([]);

      if (remainingToDos.length === 0) {
        setPage(1);
        setIsListEmpty(true);
      }
    } catch (e) {
      console.log(e);

      setError("Failed to delete to-dos.");
    }
  };

  // TODO: implementar form para novo to-do
  const handleNewToDo = async (newToDo: Partial<ToDo>) => {
    try {
      console.log(newToDo);
      // await createNewToDo(newToDo)
    } catch (e) {
      console.log(e);

      setError("Failed to create to-do");
    }
  };

  const handleUpdateTodo = async (updatedToDo: ToDo) => {
    try {
      await updateToDo(updatedToDo.id, updatedToDo);
      setToDos((prev) =>
        prev.map((todo) => (todo.id === updatedToDo.id ? updatedToDo : todo)),
      );
    } catch (e) {
      console.log(e);

      setError("Failed to update to-do.");
    }
  };

  // LIFECYCLE HOOOKS
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      loadToDos();
    }
  }, [loadToDos]);

  useEffect(() => {
    if (isListEmpty) {
      setIsListEmpty(false);
      loadToDos();
    }
  }, [isListEmpty, loadToDos]);

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
    <div className="todo-list">
      <div className="todo-list__actions">
        <button onClick={handleCreateToDoButton}>Create new to-do</button>
        <button onClick={handleSelectAll}>
          {selectedToDos.length === toDos.length
            ? "Deselect All"
            : "Select All"}
        </button>
        {!!selectedToDos.length && selectedToDos.length !== toDos.length ? (
          <button onClick={() => setSelectedToDos([])}>Deselect all</button>
        ) : (
          <></>
        )}
        <button
          onClick={handleBulkActionButton}
          disabled={selectedToDos.length === 0}
        >
          Bulk Actions
        </button>
      </div>

      <InfiniteScroll
        dataLength={toDos.length}
        next={loadToDos}
        hasMore={hasMore}
        loader={<Loader />}
        endMessage={<p className="todo-list__end-message">No more todos.</p>}
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

      {isNewToDoModalOpen && (
        <NewToDoModal
          newToDo={{ title: "aaaaaaaa" }}
          onConfirm={handleNewToDo}
          onCancel={() => setIsNewToDoModalOpen(false)}
        />
      )}

      {isBulkModalOpen && (
        <BulkActionModal
          selectedIds={selectedToDos}
          todos={toDos}
          onConfirm={handleBulkUpdate}
          onDelete={handleBulkDelete}
          onCancel={() => setIsBulkModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TodoList;
