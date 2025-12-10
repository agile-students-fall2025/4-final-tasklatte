import { useState, useEffect } from "react";
import "./EditGoal.css";

const EditGoal = ({ goal, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Update local state when goal changes
  useEffect(() => {
    setTitle(goal.title || "");
    setDescription(goal.description || "");
  }, [goal]);

  const goalId = goal.id || goal._id;

  return (
    <div className="EditGoals">
      <div className="edit-goals-content">

        <h1>Edit Goal</h1>

        <label>
          Title:
          <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Description:
          <input class="my-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <div className="edit-goal-buttons">
          <button className="delete-button" 
          onClick={() => onDelete(goalId)}>
            Delete
          </button>

          <button
            className="save-button"
            onClick={() => onSave({ id: goalId, title, description })}
          >
            Save
          </button>

          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default EditGoal;
