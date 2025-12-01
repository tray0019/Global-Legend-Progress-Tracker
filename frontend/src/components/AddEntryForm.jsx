import React from "react";

function AddEntryForm(props){
    function handleSubmit(){
        props.onAddEntry();
    }

    return (
        <div className="add-entry-form">
            <h5>Add Entry</h5>
            <input
                type="text"
                value={props.value}
                onChange={function (e){
                    props.onChange(e.target.value);
                }}
                placeholder="Describe your  progress..."/>

                <button onClick={handleSubmit}>
                    Save Entry
                </button>
        </div>
    )
}

export default AddEntryForm;