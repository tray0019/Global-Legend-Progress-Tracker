import React from "react";

function AddEntryForm(props){
    function handleSubmit(){
        props.onAddEntry();
    }

    return (
        <div style={{ marginTop: "12px" }}>
            <h5>Add Entry</h5>
            <input
                type="text"
                value={props.value}
                onChange={function (e){
                    props.onChange(e.target.value);
                }}
                placeholder="Describe your  progress..."
                style={{
                    width: "100px",
                    padding: "8px",
                    boxSizing:"border-box",
                }}/>

                <button
                    style={{ marginTop: "8px"}}
                    onClick={handleSubmit}>
                    Save Entry
                </button>
        </div>
    )
}

export default AddEntryForm;