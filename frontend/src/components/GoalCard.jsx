import React from "react";

import EntryList from "./EntryList";
import AddEntryForm from "./AddEntryForm"
import GoalCheckCalendar from "./GoalCheckCalendar"

function GoalCard(props){
    var goal = props.goal;
    var isSelected = props.isSelected;
    var selectedGoal = props.selectedGoal;

    return (
    <li className="goal-card">
        <div className="goal-actions">

        <h3 style={{ margin: 0}}>{goal.goalTitle}</h3>

        {/**View Button */}
        <button onClick={function(){
                props.onView(goal.id);
                props.onView(goal.id)}}>View</button>

        {/**Delete Button */}
        <button onClick={function(){
                if(window.confirm("Are you sure you want to delete this goal?")){
                    props.onDelete(goal.id);
                }}}>Delete</button>

        {/**Rename Button*/}
            <button onClick={function(){
                    props.onRename(goal.id);
                }}>Rename</button>


            <button
                onClick={function(){
                    props.onMarkDoneToday(goal.id);
                }}>
                Done today✅
            </button>

        {isSelected && selectedGoal && (
            <div className="entries-section">
                <h4>Entries</h4>

                <GoalCheckCalendar checkDates={props.checkDates}/>

                <EntryList
                    entries={props.selectedGoal.entries}
                    onDeleteEntry={props.onDeleteEntry}
                    onRenameEntry={props.onRenameEntry}
                    />

                
                <AddEntryForm
                    value={props.newEntryDescription}
                    onChange={props.onChangeNewEntry}
                    onAddEntry={props.onAddEntry}
                    />

                

            </div>
        )}
            
        
        </div>
    </li>
    )
}



export default GoalCard;