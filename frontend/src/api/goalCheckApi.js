import axios from "axios";

var BASE_URL = "http://localhost:8080";

export function markGoalDoneToday(goalId){
    return axios.post(BASE_URL+"/goals/"+goalId+"/checks");
}

export function getGoalChecks(goalId, from, to){
    return axios.get(
        BASE_URL+"/goals/"+goalId+"/checks",
        {
            params: {
                from: from,
                to: to
            }
        }
    )
}