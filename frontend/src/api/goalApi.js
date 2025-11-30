import axios from "axios";

var BASE_URL = "http://localhost:8080";

export function getAllGoals(){
    return axios.get(BASE_URL+"/goals");
}

export function getGoalById(goalId){
    return axios.get(BASE_URL+"/goals/"+goalId);
}

export function createGoal(title){
    return axios.post(BASE_URL+"/goals",{
        goalTitle: title
    });
}

export function renameGoal(goalId, newTitle){
    return axios.put(
        BASE_URL+"/goals/"+goalId+"?newTitle="+newTitle
    );
}

export function deleteGoal(goalId){
    return axios.delete(BASE_URL+"/goals/"+goalId)
}