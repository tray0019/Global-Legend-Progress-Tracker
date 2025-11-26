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
        <div style={{ marginBottom: "20px"}}>
            <h3>Add Goal</h3>

            <input 
                type="text"
                value={title}
                onChange={function (e) {setTitle(e.target.value);}}
                placeholder="Enter goal title..."
                style={{
                    width: "100%",
                    padding: "8px",
                    boxSizing: "border-box"
                }} />

                <button
                style={{ marginTop: "8px"}}
                onClick={handleSubmit}
                >Save Goal</button>

        </div>
    );
}

export default AddGoalForm;