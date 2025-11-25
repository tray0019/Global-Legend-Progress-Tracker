
import {useEffect, useState } from "react";
import axios from "axios";

function App(){

  const [goals, setGoals ] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [ newEntryDescription, setNewEntryDescription ] = useState("");

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
  
  

return (
  <div style={{ maxWidth: "600px", margin: "20px auto"}}>
    <h1>Goals</h1>

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
          </div>

        </li>
      )
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