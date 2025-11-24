
import {useEffect, useState } from "react";
import axios from "axios";

function App(){

  const [goals, setGoals ] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/goals")
    .then(res => {
      console.log("API response:",res.data);// DEBUG
      setGoals(res.data);
    })
      .catch(err => {
        console.error(err);
      }); 
  },[]);

  
  

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

            <button style={{ marginTop: "10px"}}>
              View
            </button>
          </div>

        </li>
      )
    })}

  </ul>

  </div>
)


};

export default App;