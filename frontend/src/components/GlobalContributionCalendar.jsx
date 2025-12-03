import React from "react";

function pad2(number){
    return number < 10 ? "0" + number: "" + number;
}

function GlobalContributionCalendar(props){
    var contributions = props.contributions || [];

    var countByDate = {};
    var i;

    for (i=0; i < contributions.length; i++){
        var item = contributions[i];
        countByDate[item.date] = item.count;
    }

    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var monthLabel = now.toLocaleString("default", {month: "short"});

    var firstDay = new Date(year, month, 1);
    var lastDayNumber = new Date(year, month + 1,0).getDate();
    var startWeekDay = firstDay.getDay();

    function getColor(day){
        var dateString = year + "-"+ pad2(month + 1) + "-"+pad2(day);

        var count = countByDate[dateString];

        if(!count || count <= 0){
            return "#e5e7eb";
        }

        if (count === 1) return "#bbf7d0";
        if (count === 2) return "#4ade80";
        return "#16a34a"
    }

    var cells = [];

    for(i = 0; i < startWeekDay; i++){
        cells.push(
            <div
                key={"g-empty-"+i}
                style={{
                    width: "18px",
                    height: "18px",
                    margin: "2px",
                }}/>
        );
    }

    for(i = 1; i <= lastDayNumber; i++){
        var color = getColor(i);

        cells.push(
            <div
                key={"g-day"+i}
                title={year+"-"+pad2(month+1)+"-"+pad2(i)}
                style={{
                    width: "18px",
                    height: "18px",
                    margin: "2px",
                    borderRadius: "4px",
                    backgroundColor: color,
                    display: "inline-block",
                }} />
        );
    }

    return (
        <div style={{ marginButtom: "20px"}}>
            <div style={{ marginBottom: "4px", fontSize: "0.9rem"}}>
                Overall Progress - {monthLabel} {year}
            </div>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    maxWidth: "7 * 22px",
                }} >
                {cells}
            </div>

        </div>
    )
    
}

export default GlobalContributionCalendar;