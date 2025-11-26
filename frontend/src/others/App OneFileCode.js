
import {useEffect, useState } from "react";
import axios from "axios";

function App(){

  const [goals, setGoals ] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newEntryDescription, setNewEntryDescription ] = useState("");
  const [newGoalTitle, setNewGoalTitle ] = useState("");
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
  
  function handleAddGoal(){
    if(!newGoalTitle.trim()){
      alert("Please enter a goal title.");
      return;
    }

    axios.post("http://localhost:8080/goals", {
        goalTitle: newGoalTitle  
    })
      .then(function (res){
      console.log("Goal created:",res.data);

      // Clear input
      setNewGoalTitle("");

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
      console.error("Error creating goal:", err);
    });
  }

  function handleRenameGoal(goalId){
    if(!renameGoalTitle.trim()){
      alert("Please enter a new title.");
      return;
    }

    axios.put("http://localhost:8080/goals/"
      +goalId+"?newTitle="+renameGoalTitle)
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

          // Clear input
          setRenameGoalTitle("");
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

    <div style={{ marginBottom: "20px"}}>
      <h3>Add Goal</h3>
      <input
        type="text"
        value={newGoalTitle}
        onChange={function (e) {setNewGoalTitle(e.target.value);}}
        placeholder="Enter goal title..."
        style={{ width: "100%", padding: "8px", boxSizing: "border-box"}}/>
      
      <button
        onClick={handleAddGoal}
        style={{ marginTop: "8px"}} >
          Save Goal
      </button>
    </div>

    <ul style={{ listStyle: "none", padding: 0}}>
    {goals.map(function (goal){

      
      return (
        <li key={goal.id} style={{ marginBottom: "12px"}}>
          <div style={{
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            backgroundColor: "#fff"
          }}>
            <h3 style={{ margin: 0}}>{goal.goalTitle}</h3>

            <button style={{ marginTop: "10px"}}
              onClick={function() { handleView(goal.id);}}
            >
              View
            </button>


            <button
            style={{ marginTop: "10px"}}
            onClick={function() {
              if(window.confirm("Are you sure you want to delete this goal?"))
              handleDeleteGoal(goal.id);}}
            >Delete</button>

            <div style={{ marginTop: "10px"}}>
            <input
            type="text"
            value={renameGoalTitle}
            onChange={function (e){ setRenameGoalTitle(e.target.value);}}
            placeholder="New Title..."
            style={{ width: "70%", padding: "6px"}}   />

            <button
              style={{ marginLeft: "8px"}} 
              onClick={function () {handleRenameGoal(goal.id);}} >
                Rename
            </button>

            </div>
          </div>
        </li>
      );
    })}

  </ul>

  {/**
   * Goal Detail
   */}
   
   {selectedGoal && (
    <div style={{
      marginTop: "24px",
      padding: "16px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      backGroundColor: "#f9f9f9"
    }}>
      <h2>{selectedGoal.goalTitle}</h2>
      {(!selectedGoal.entries || selectedGoal.entries.length === 0) &&(
        <p>No entries yet.</p>
      )}

      {selectedGoal.entries && selectedGoal.entries.length > 0 && (
        <ul>
          {selectedGoal.entries.map(function (entry){
            return (
              <li key={entry.id}>
                {entry.description}

                <button
                style={{marginLeft: "8px"}}
                onClick={function () { 
                  handleDeleteEntry(entry.id);}}
                >Delete</button>

                <button
                 style={{ marginLeft: "8px" }}
                 onClick={function () {handleRenameEntry(entry.id, entry.description);}}>
                  Rename
                </button>


              </li>
            );
          })}
        </ul>
      )}


      </div> 
   )}

   {/**Add Entry Form */}
      <div style={{marginTop: "16px"}}>
        <h4>Add Entry</h4>
        <input
          type="text"
          value={newEntryDescription}
          onChange={function(e) {setNewEntryDescription(e.target.value);}}
          placeHolder="Describe your progress..."
          style={{ width: "100%", padding: "8px", boxSizing: "border-box"}}/>
          <button onClick={handleAddEntry} style={{marginTop:"8px"}}>
            Save Entry
          </button>

          </div>
  {/** */}
  </div> 
)};

export default App;