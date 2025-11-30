import axios from "axios";

var BASE_URL = "http://localhost:8080";

export function addEntry(goalId, description){
    return axios.post(
        BASE_URL+"/goal/"+goalId+"/entries",
        { description: description}
    );
}

export function renameEntry(entryId, newDescription){
    return axios.put(BASE_URL+"/entries/"+entryId,{
        description: newDescription
    });
}

export function deleteEntry(entryId){
    return axios.delete(BASE_URL+"/entries/"+entryId)
}