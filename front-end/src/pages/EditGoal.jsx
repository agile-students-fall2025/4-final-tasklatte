import { useState } from "react";
import "./EditGoal.css";

const EditGoal = ({goal, onClose, onSave, onDelete}) => {
    const [title, setTitle] = useState(goal.title);
    const [description, setDescription] = useState(goal.description);

    return(
        <div className = "EditGoals">
            <div className = "edit-goals-content">
                <h1>Edit Goal</h1>
                <label>
                    Title:
                    <input value={title} onChange={(e) => setTitle(e.target.value)}/>
                </label>
                <label>
                    Description:
                    <input value={description} onChange={(e) => setDescription(e.target.value)}/>
                </label>
                <div className = "edit-goal-buttons">
                    <button className="delete-button" onClick={onDelete}>
                    Delete
                    </button>

                    <button className="save-button" onClick={() => onSave({title, description})}>
                    Save
                    </button>
                </div> 
            </div>
        </div>
    )
}

export default EditGoal;