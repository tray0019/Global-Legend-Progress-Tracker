import React, { useState } from "react";

function AddGoalForm(props){
    const [title, setTitle] = useState("");

    function handleSubmit(){
        if(!title.trim()){
            alert("Please enter a goal title.");
            return;
        }

        // Call the parent's function;
        props.onAdd(title);

        //Clear input
        setTitle("");
    }

    return (
        <div className="add-goal-form">
            <h3>Add Goal</h3>

            <input 
                type="text"
                value={title}
                onChange={function (e) {setTitle(e.target.value);}}
                placeholder="Enter goal title..."/>

                <button
                onClick={handleSubmit}
                >Save Goal</button>

        </div>
    );
}

export default AddGoalForm;