import React from "react";

function pad2(number){
    return number < 10 ? "0" + number: ""+ number
}

function GoalCheckCalendar(props){
    var checkDates = props.checkDates || [];

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var monthLabel = now.toLocaleString("default",{ month: "short"});

    var firstDay = new Date(year, month, 1);
    var lastDayNumber = new Date(year, month + 1, 0).getDate();
    var startWeekDay = firstDay.getDay();

    function isChecked(day){
        var dateString = year + "-"+pad2(month + 1)+ "-"+pad2(day);
        
        return checkDates.indexOf(dateString) !== -1;
    }

    var cells = [];
    var i;

    for(i = 0; i < startWeekDay; i++){
        cells.push(
            <div
                key={"empty-"+i}
                style={{
                    width: "18px",
                    height: "18px",
                    margin: "2px",
                }}/>

        );
    }

    for(i = 1; i <= lastDayNumber; i++){
        var checked = isChecked(i);

        cells.push(
            <div
                key={"day"+i}
                title={year+"-"+pad2(month+1)+"-"+pad2(i)}
                style={{
                    width:"18px",
                    height:"18px",
                    margin: "2px",
                    borderRadius: "4px",
                    backgroundColor: checked ? "#16a34a" : "#e5e7eb",
                    display: "inline-block",
                }}/>
        );
    }

    return (
        <div style={{ marginTop: "12px"}}>
            <div style={{ marginBottom: "4px", fontSize: "0.9rem"}}>
                {monthLabel} {year}
            </div>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: "7 * 22px",
                }}>
                    {cells}
            </div>
        </div>
    )
}

export default GoalCheckCalendar;