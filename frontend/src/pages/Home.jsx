
import {useEffect, useState } from "react";
import axios from "axios";

import AddGoalForm from "../components/AddGoalForm"
import GoalCard from "../components/GoalCard"

function Home(){

  const [goals, setGoals ] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newEntryDescription, setNewEntryDescription ] = useState("");
  const [renameGoalTitle, setRenameGoalTitle] = useState("");


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
    axios.get("http://localhost:8080/goals/"+goalId)
    .then(function (res){
      console.log("Selected goal:",res.data);
      setSelectedGoal(res.data);
    }).catch(function (err){
      console.error("Error fetching goal:", err);
    });
  }

  function handleAddEntry(){
    if(!selectedGoal){
      return;
    }

    if(!newEntryDescription.trim()){
      alert("Please enter a description (or type something).");
      return;
    }

    axios.post(
      "http://localhost:8080/goal/" + selectedGoal.goalId+"/entries",
      { description: newEntryDescription }
    )
    .then(function (res){
      console.log("Entry added:",res.data);

      // Clear input
      setNewEntryDescription("");

      // Refresh the selected goal so entries update
      handleView(selectedGoal.goalId);
    })
    .catch(function (err){
        console.error("Error adding entry:", err)
    });
  }

  function handleDeleteEntry(entryId){
    if(!selectedGoal){
      return;
    }

    axios.delete("http://localhost:8080/entries/"+entryId)
    .then(function (){
        console.log("Entry deleted:", entryId);

        //Refresh goal details so the List updates
        handleView(selectedGoal.goalId);
    })
    .catch(function (err){
        console.console.log(("Error deleting entry:",err));
    });
  }

  function handleDeleteGoal(goalId){
    axios.delete("http://localhost:8080/goals/"+goalId)
    .then(function(){
        console.log("Goal deleted:", goalId);

        // if the goal is currently selected, clear it
        if(selectedGoal && selectedGoal.goalId === goalId){
          setSelectedGoal(null);
        }

        // Refresh the goals List
        axios.get("http://localhost:8080/goals")
          .then(function (res){
            setGoals(res.data);
          })
          .catch(function (err){
            console.log("Error refreshing goals:", err);
            
          });
    });
  }
  
  function handleAddGoal(title){

    axios.post("http://localhost:8080/goals", {
        goalTitle: title  
    })
    .then(function (res){ console.log("Goal created:",res.data); 
      
      // Refresh goals list 
      axios.get("http://localhost:8080/goals") 
      .then(function (res2) { 
        setGoals(res2.data); 
      }) 
      .catch(function (err2){ 
        console.error("Error refreshing goals:",err2); 
      }); 
    }) 
        .catch(function (err){ 
          console.error("Error creating goal:", err); });
      
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

  
  

return (
    <div style={{ maxWidth: "600px", margin: "20px auto"}}>
      <h1>Goals</h1>

        <AddGoalForm onAdd={handleAddGoal}/>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {goals.map(function(goal){
            return(
              <GoalCard
                key={goal.id}
                goal={goal}
                renameValue={setRenameGoalTitle}
                onChangeRename={setRenameGoalTitle}
                onView={handleView}
                onDelete={handleDeleteGoal}
                onRename={handleRenameGoal}
                />
            );
          })}

        </ul>

    </div>
)

}
// , 
export default Home;