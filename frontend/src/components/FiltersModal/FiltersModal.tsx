import React, { useState } from "react";
import Error from "../Error/Error";
import "./FiltersModal.scss";

interface Filters {
  title?: string;
  description?: string;
  completed?: boolean | null;
}

interface FiltersModalProps {
  onConfirm: (filters: Filters | undefined) => void;
  onClearFilters: () => {};
  onCancel: () => void;
  error?: any;
}

const FiltersModal: React.FC<
  FiltersModalProps & { initialFilters?: Filters }
> = ({ onConfirm, onClearFilters, onCancel, error, initialFilters }) => {
  const [title, setTitle] = useState(initialFilters?.title ?? "");
  const [description, setDescription] = useState(
    initialFilters?.description ?? "",
  );
  const [status, setStatus] = useState(
    initialFilters?.completed === true
      ? "completed"
      : initialFilters?.completed === false
        ? "pending"
        : "",
  );

  const handleApply = () => {
    const filters: Filters = {};
    if (title.trim() !== "") filters.title = title.trim();
    if (description.trim() !== "") filters.description = description.trim();
    if (status === "completed") filters.completed = true;
    if (status === "pending") filters.completed = false;

    const hasFilters = Object.keys(filters).length !== 0;

    onConfirm(hasFilters ? filters : undefined);
  };

  return (
    <div className="modal-overlay">
      <div className="filters-modal">
        <h2 className="filters-modal__title">Filters</h2>
        <div className="filters-modal__content">
          <div className="filters-form">
            <div className="filters-form__field">
              <label>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="filters-form__field">
              <label>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="filters-form__field">
              <label>Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Any</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filters-modal__actions">
          <button id="apply" onClick={handleApply}>
            Apply
          </button>
          {initialFilters && (
            <button id="clear" onClick={onClearFilters}>
              Clear filters
            </button>
          )}
          <button id="cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>

        {!!error && <Error message={error} />}
      </div>
    </div>
  );
};

export default FiltersModal;
