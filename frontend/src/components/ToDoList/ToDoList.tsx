import React, { useState, useEffect, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ToDo, SortOption } from "../../types/toDo";
import {
  bulkUpdateToDos,
  getToDos,
  updateToDo,
  bulkDeleteToDos,
  createToDo,
  deleteToDo,
} from "../../services/toDoService";
import TodoItem from "./ToDoItem";
import BulkActionModal from "../BulkActionModal/BulkActionModal";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import NewToDoModal from "../NewToDoModal/NewToDoModal";
import FiltersModal from "../FiltersModal/FiltersModal";
import "./ToDoList.scss";
import axios from "axios";

const SORT_OPTIONS: Record<string, SortOption> = {
  "a-z": { sortBy: "title", sortOrder: "asc" },
  "z-a": { sortBy: "title", sortOrder: "desc" },
  "created-desc": { sortBy: "created_date", sortOrder: "desc" },
  "created-asc": { sortBy: "created_date", sortOrder: "asc" },
  "updated-desc": { sortBy: "updated_date", sortOrder: "desc" },
  "updated-asc": { sortBy: "updated_date", sortOrder: "asc" },
};

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
  const [pendingCreated, setPendingCreated] = useState<ToDo[]>([]);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [filters, setFilters] = useState<
    | { title?: string; description?: string; completed?: boolean | null }
    | undefined
  >(undefined);
  const [isListEmpty, setIsListEmpty] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string>("");
  const [sort, setSort] = useState<SortOption | undefined>(undefined);

  const initialLoadRef = useRef(false);

  const loadToDos = useCallback(
    async (
      pageToLoad: number = page,
      overrideFilters?: {
        title?: string;
        description?: string;
        completed?: boolean | null;
      },
      overrideSort?: SortOption,
    ) => {
      if (loading) return;
      setLoading(true);
      setError(null);
      try {
        const usedFilters = overrideFilters ?? filters;
        const usedSort = overrideSort ?? sort;
        const { data: response } = await getToDos(
          pageToLoad,
          PAGE_LIMIT,
          usedFilters,
          usedSort,
        );

        setToDos((prev) => {
          const existingIds = new Set(prev.map((toDo) => toDo.id));

          const newToDos = response.toDos.filter(
            (toDo) => !existingIds.has(toDo.id),
          );

          // if we're loading the first page (new filters or fresh load), replace
          if (pageToLoad === 1) {
            return response.toDos;
          }

          // otherwise append only new items
          return [...prev, ...newToDos];
        });

        setPage(response.page + 1);

        setHasMore(response.page < response.totalPages);
      } catch (e: any) {
        console.error(e);

        if (axios.isAxiosError(e)) {
          setError(
            e.response?.data?.error ??
              "Failed to load to-dos. Please try again.",
          );
        } else {
          setError(String(e) || "Failed to load to-dos. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, filters, sort],
  );

  const handleOpenFilters = () => setIsFiltersModalOpen(true);

  const handleApplyFilters = (newFilters?: {
    title?: string;
    description?: string;
    completed?: boolean | null;
  }) => {
    setFilters(newFilters);
    setToDos([]);
    setPage(1);
    setHasMore(true);
    setIsListEmpty(false);
    setIsFiltersModalOpen(false);
    loadToDos(1, newFilters);
  };

  const handleClearFilters = () => {
    setFilters(undefined);
    setToDos([]);
    setPage(1);
    setHasMore(true);
    setIsListEmpty(true);
    setIsFiltersModalOpen(false);
    loadToDos(1, {});
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortKey(value);
    setIsSortOpen(false);
    
    if (!value) {
      setSort(undefined);
      setToDos([]);
      setPage(1);
      setHasMore(true);
      loadToDos(1, filters, undefined);
      return;
    }
    
    const newSort = SORT_OPTIONS[value];
    if (newSort) {
      setSort(newSort);
      setToDos([]);
      setPage(1);
      setHasMore(true);
      loadToDos(1, filters, newSort);
    }
  };

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
    } catch (e: any) {
      console.error(e);

      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error ?? "Failed to update to-dos.");
      } else {
        setError(String(e) || "Failed to update to-dos.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteToDo(id);

      const remainingToDos = toDos.filter((toDo) => toDo.id !== id);
      setToDos(remainingToDos);
      setSelectedToDos((prev) => prev.filter((sid) => sid !== id));

      if (remainingToDos.length === 0) {
        setPage(1);
        setIsListEmpty(true);
      }
    } catch (e: any) {
      console.error(e);

      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error ?? "Failed to delete to-do.");
      } else {
        setError(String(e) || "Failed to delete to-do.");
      }
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await bulkDeleteToDos(selectedToDos);

      type ToDoReduce = {
        remainingToDos: ToDo[];
        deletedToDos: ToDo[];
      };

      const { remainingToDos } = toDos.reduce(
        (acc: ToDoReduce, toDo: ToDo) => {
          if (ids.includes(toDo.id)) {
            acc.deletedToDos.push(toDo);
          } else {
            acc.remainingToDos.push(toDo);
          }
          return acc;
        },
        { remainingToDos: [], deletedToDos: [] } as ToDoReduce,
      );

      setToDos((prev) => prev.filter((toDo) => !ids.includes(toDo.id)));

      setIsBulkModalOpen(false);
      setSelectedToDos([]);

      if (remainingToDos.length === 0) {
        setPage(1);
        setIsListEmpty(true);
      }
    } catch (e: any) {
      console.error(e);

      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error ?? "Failed to delete to-dos.");
      } else {
        setError(String(e) || "Failed to delete to-dos.");
      }

      // setError("Failed to delete to-dos.");
      setError(e.response.data.error);
    }
  };

  const handleCreateToDo = async (newToDo: Partial<ToDo>) => {
    try {
      const created = await createToDo(newToDo);
      setPendingCreated((prev) => [...prev, created]);
      setError(null);
    } catch (e: any) {
      console.error(e);

      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error ?? "Failed to create to-do");
      } else {
        setError(String(e) || "Failed to create to-do");
      }

      // setError("Failed to create to-do");
      setError(e.response.data.error);
    }
  };

  const handleConcludeCreateToDo = () => {
    if (pendingCreated.length > 0) {
      const toPrepend = [...pendingCreated].reverse();
      setToDos((prev) => [...toPrepend, ...prev]);
      setPendingCreated([]);
    }
    setError(null);
    setIsNewToDoModalOpen(false);
    loadToDos(1);
  };

  const handleUpdateTodo = async (updatedToDo: ToDo) => {
    try {
      await updateToDo(updatedToDo.id, updatedToDo);
      setToDos((prev) =>
        prev.map((todo) => (todo.id === updatedToDo.id ? updatedToDo : todo)),
      );
    } catch (e: any) {
      console.error(e);

      if (axios.isAxiosError(e)) {
        setError(e.response?.data?.error ?? "Failed to update to-do.");
      } else {
        setError(String(e) || "Failed to update to-do.");
      }

      // setError("Failed to update to-do.");
      setError(e.response.data.error);
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
  }, [isListEmpty, loadToDos, filters]);

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
        <div className="todo-list__actions__top">
          <button id="create" onClick={handleCreateToDoButton}>
            Create new to-do
          </button>
          <button id="select" onClick={handleSelectAll}>
            {selectedToDos.length === toDos.length
              ? "Deselect All"
              : "Select All"}
          </button>
          {!!selectedToDos.length && selectedToDos.length !== toDos.length ? (
            <button id="select" onClick={() => setSelectedToDos([])}>
              Deselect all
            </button>
          ) : (
            <></>
          )}
          <button
            id="bulk"
            onClick={handleBulkActionButton}
            disabled={selectedToDos.length === 0}
          >
            Bulk Actions
          </button>
        </div>
        <div className="todo-list__actions__bottom">
          <div className="todo-list__actions__bottom__filters">
            <button id="filters" onClick={handleOpenFilters}>
              Filters
            </button>
            {filters && (
              <button id="clear-filters" onClick={handleClearFilters}>
                Clear filters
              </button>
            )}
          </div>
          <div className="todo-list__actions__bottom__sort">
            <label htmlFor="sort-by" style={{ display: "none" }}>
              Sort by
            </label>
            <div className={"select-wrapper" + (isSortOpen ? " is-open" : "")}>
              <select
                id="sort-by"
                name="sort-by"
                value={sortKey}
                onMouseDown={() => setIsSortOpen(true)}
                onBlur={() => setIsSortOpen(false)}
                onChange={handleSortChange}
              >
                <option value="" disabled>
                  -- Sort by --
                </option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
                <option value="created-desc">
                  Created date (newer to older)
                </option>
                <option value="created-asc">
                  Created date (older to newer)
                </option>
                <option value="updated-desc">
                  Updated date (newer to older)
                </option>
                <option value="updated-asc">
                  Updated date (older to newer)
                </option>
              </select>
            </div>
          </div>
        </div>
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
            onDelete={handleDelete}
          />
        ))}
      </InfiniteScroll>

      {isNewToDoModalOpen && (
        <NewToDoModal
          onConfirm={handleCreateToDo}
          onCancel={handleConcludeCreateToDo}
          error={error}
        />
      )}

      {isFiltersModalOpen && (
        <FiltersModal
          onConfirm={handleApplyFilters}
          onClearFilters={handleClearFilters}
          onCancel={() => setIsFiltersModalOpen(false)}
          error={error}
          initialFilters={filters}
        />
      )}

      {isBulkModalOpen && (
        <BulkActionModal
          selectedIds={selectedToDos}
          toDos={toDos}
          onConfirm={handleBulkUpdate}
          onDelete={handleBulkDelete}
          onCancel={() => setIsBulkModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TodoList;
