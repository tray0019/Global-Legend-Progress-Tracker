
import {useEffect, useState } from "react";
import axios from "axios";

import AddGoalForm from "../components/AddGoalForm"
import GoalCard from "../components/GoalCard"
import {
  getAllGoals,getGoalById,createGoal,renameGoal,deleteGoal} from "../api/goalApi";
import {
  addEntry,renameEntry,deleteEntry } from "../api/entryApi";
import { getGoalChecks, markGoalDoneToday } from "../api/goalCheckApi";


function pad2(number){
  return number < 10 ? "0" + number: "" + number;
}

function getCurrentMonthRange(){
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();

  var from = year+"-"+pad2(month+1)+"-01";
  var lastDay = new Date(year,month + 1, 0).getDate();
  var to = year + "-"+pad2(month+1)+"-"+pad2(lastDay);

  return { from: from, to: to};
}


function Home(){

  const [goals, setGoals ] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newEntryDescription, setNewEntryDescription ] = useState("");

  const [ checkDates, setCheckDates ] = useState([]);



  useEffect(function() {
    axios.get("http://localhost:8080/goals")
    .then(res => {
      console.log("API response:",res.data);// DEBUG
      setGoals(res.data);
    })
      .catch(err => {
        console.error(err);
      }); 
  },[]);

  function handleView(goalId){

    getGoalById(goalId)
      .then(function (res){
        console.log("Selected goal:",res.data);
        setSelectedGoal(res.data);
      })
      .catch(function(err){
        console.error("Error fetching goal:", err);
      });

      var range = getCurrentMonthRange();
      
      getGoalChecks(goalId, range.from, range.to)
        .then(function (res2){
          var dates = [];
          for(var i=0; i<res2.data.length; i++){
            dates.push(res2.data[i].date);
          }
          setCheckDates(dates);
        }).catch(function (err2){
          console.error("Error fetch goal checks:", err2);
        })


  }

  function handleAddEntry(){
    addEntry(selectedGoal.goalId, newEntryDescription)
      .then(function(){
        setNewEntryDescription("");
        handleView(selectedGoal.goalId);
      });
  }

  function handleDeleteEntry(entryId){
    deleteEntry(entryId)
      .then(function(){
          handleView(selectedGoal.goalId)
      });
  }

  function handleDeleteGoal(goalId){
    deleteGoal(goalId)
      .then(function(){
        console.log("Goal deleted:",goalId);

        if(selectedGoal && selectedGoal.goalId === goalId){
          setSelectedGoal(null);
          setCheckDates([]);
        }

        return getAllGoals();        
      })
      .then(function (res){
        setGoals(res.data);
      })
      .catch(function(err){
        console.error("Error deleting goal:",err);
        alert("Could not delete goal. Check server logs for details");
      });
  }
  
  function handleAddGoal(title){

    createGoal(title)
      .then(function(res){
        console.log("Goal created:", res.data);
        
        getAllGoals()
          .then(function(res2){
            setGoals(res2.data)
          });
      })
        .catch(function(err){
          console.log("Error creating goal:",err);
          
        });
  }




  function handleRenameGoal(goalId){
    
    var newTitle = window.prompt(
        "Enter the new title for this goal:"
    );

    // User pressed cancel
    if(newTitle === null){
      return;
    }
    
    // Empty string (spaces etc.)
    if(!newTitle.trim()){
      alert("Title cannot be empty.");
      return;
    }

    axios.put("http://localhost:8080/goals/"+goalId+"?newTitle="+newTitle)
      .then(function (res){
        console.log("Goal renamed:",res.data);
        
        // Refresh List
        axios.get("http://localhost:8080/goals")
          .then(function (res2){
            setGoals(res2.data);
          })
          .catch(function (err2){
              console.error(err2);
          });

          // If renamed goal is selected, refresh details
          if(selectedGoal && selectedGoal.goalId === goalId){
            handleView(goalId);
          }

      })
      .catch(function (err){
          console.error("Error renaming goal:",err);
          
      });

  }

  function handleRenameEntry(entryId, currentDescription){
    if(!selectedGoal){
      return;
    }
      var newDescription = window.prompt(
      "Enter new description:",
      currentDescription
    );


    // User clicked Cancel
    if(newDescription === null){
      return;
    }

    // Empty or space only
    if(!newDescription.trim()){
      alert("Description cannot be empty.");
      return;
    }

    axios.put(
      "http://localhost:8080/entries/"+entryId,
      { description: newDescription}
    )
    .then(function (res){
      console.log("Entry renamed:",res.data);

      // Refresh goal details so List updates
      handleView(selectedGoal.goalId);
    
    })
    .catch(function (err){
        console.error("Error renaming entry:", err); 
    });
  }

  function handleMarkDoneToday(goalId){
    markGoalDoneToday(goalId)
      .then(function (res){
        var createdNew = res.data;

        if(createdNew){
          alert("Marked as done for today!");
        }else{
          alert("This goal is already marked done for today.");
        }

        if(selectedGoal && selectedGoal.goalId === goalId){
            handleView(goalId);
          }
          
      }).catch(function (err){
          console.error("Error marking goal done today:",err);
      });
  }

  
  

return (
    <div className="app-container">
      <h1>Goals</h1>

        <AddGoalForm onAdd={handleAddGoal}/>

        <ul className="goal-list">
          {Array.isArray(goals) && goals.map(function(goal){
            var isSelected = 
              selectedGoal && selectedGoal.goalId === goal.id; // goal.id vs goalId
            return(
              <GoalCard
                key={goal.id}
                goal={goal}
                onView={handleView}
                onDelete={handleDeleteGoal}
                onRename={handleRenameGoal}

                isSelected={isSelected}
                selectedGoal={selectedGoal}
                newEntryDescription={newEntryDescription}
                onChangeNewEntry={setNewEntryDescription}
                onAddEntry={handleAddEntry}
                onDeleteEntry={handleDeleteEntry}
                onRenameEntry={handleRenameEntry}

                onMarkDoneToday={handleMarkDoneToday}
                checkDates={checkDates}
                />
            );
          })}
        </ul>
    </div>
)

}
// , 
export default Home;