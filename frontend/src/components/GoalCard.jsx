import React from "react";

function GoalCard(props){
    var goal = props.goal;
    var isSelected = props.isSelected;
    var selectedGoal = props.selectedGoal;

    return (
    <li style={{ marginBottom: "12px" }}>
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
                props.onView(goal.id)}}>
            View
        </button>

        {/**Delete Button */}
        <button
            style={{ marginTop: "10px", marginRight: "8px"}}
            onClick={function(){
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

        {isSelected && selectedGoal && (
            <div
                style={{
                    marginTop: "16px",
                    paddingTop: "12px",
                    borderTop: "1px solid #eee",
                }}>
                <h4>Entries</h4>

                {(!selectedGoal.entries || selectedGoal.entries.length === 0)&&(
                    <p>No entries yet.</p>
                )}

                    {selectedGoal.entries &&
                        selectedGoal.entries.length > 0 && (
                        <ul>
                            {selectedGoal.entries.map(function (entry){
                                return (
                                    <li key={entry.id}>
                                        {entry.description}

                                    </li>
                                );
                            })}
                        </ul>
                        )}

                

            </div>
        )}
            
        
        </div>
    </li>
    )
}



export default GoalCard;