import React from "react";

function EntryList(props){
    var entries = props.entries;

    if(!entries || entries.length === 0){
    return <p>No entries yet.</p>

    }

    return(
        <ul>
            {entries.map(function (entry){
                return(
                    <li key={entry.id}>
                        {entry.description}

                        <button 
                            sytle={{ marginLeft: "8px"}}
                            onClick={function(){
                                props.onDeleteEntry(entry.id);
                            }}>
                            Delete
                        </button>
                        <button
                            style={{ marginLeft: "8bx" }}
                            onClick={function(){
                                props.onRenameEntry(entry.id, entry.description);
                            }}>
                                Rename
                        </button>
                    </li>
                )
            })}
        </ul>
    )
}

export default EntryList;

