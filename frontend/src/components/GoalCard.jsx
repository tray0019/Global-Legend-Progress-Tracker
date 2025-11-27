import React from "react";

function GoalCard(props){
    const goal = props.goal;

    return (
    <li style={{ marginBotton: "12px" }}>
        <div 
            style={{
                border: "1px solid #ddd",
                padding: "16px",
                borderRadius: "8px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
            }}>

        <h3 style={{ margin: 0}}>{goal.goalTitle}</h3>

        {/**View Button */}
        <button style={{ marginTop: "10px", marginRight: "8px"}}
            onClick={function(){
                props.onView(goal.id);
            }}>
            View
        </button>

        {/**Delete Button */}
        <button
            style={{ marginTop: "10px", marginRight: "8px"}}
            onClik={function(){
                if(window.confirm("Are you sure you want to delete this goal?")){
                    props.onDelete(goal.id);
                }
            }}
        >
            Delete
        </button>

        {/**Rename Button*/}
            <button
                style={{ marginTop: "10px"}}
                onClick={function(){
                    props.onRename(goal.id);
                }}
                >
                Rename
            </button>
        

        </div>
    </li>
    )
}



export default GoalCard;