import React from "react";

function pad2(number){
    return number < 10 ? "0" + number: ""+number;
}

function formatDate(dateObj){
    return (
        dateObj.getFullYear()+
        "-"+
        pad2(dateObj.getMonth()+1)+
        "-"+
        pad2(dateObj.getDate())
    );
}

function GlobalYearCalendar(props){
    var contributions = props.contributions || [];

    var countByDate = {};
    var i;

    for(i = 0; i < contributions.length;i++){
        var item = contributions[i];
        countByDate[item.date] = item.count;
    }

    var today = new Date();

    var start = new Date();
    start.setDate(start.getDate()-364);

    while(start.getDay() !== 0){
        start.setDate(start.getDate()-1);
    }

    var weeks = [];
    var current = new Date(start);

    while (current <= today){
        var week = [];

        for(i=0; i <7; i++){
            var dateCopy = new Date(current);
            var dateString = formatDate(dateCopy);

            var inRange = dateCopy <= today &&
                dateCopy >= (function (){
                    var tmp = new Date(today);
                    tmp.setDate(tmp.getDate()-364);
                    return tmp;
                })();

            var count = countByDate[dateString] || 0;

            week.push({
                date: dateCopy,
                dateString: dateString,
                inRange: inRange,
                count: count
            });

            current.setDate(current.getDate()+1);
        }

        weeks.push(week);
    }

    function getColor(cell){
        if(!cell.inRange){
            return "transparent;"
        }

        var count = cell.count;

        if (count <= 0) return "#e5e7eb";     // no activity (gray)
        if (count === 1) return "#bbf7d0";    // light green
        if (count === 2) return "#4ade80";    // medium green
                        return "#16a34a";   
    }

    var firstYear = start.getFullYear();
    var lastYear = today.getFullYear();

    var label = "Overall - Last 12 months ("+ firstYear + "-"+lastYear+")";

    return(
        <div style={{ marginBottom: "20px"}}>
            <div style={{ marginBottom: "4px", fontSize: "0.9rem"}} >
                    {label}
            </div>
            <div style={{ display: "flex" }} >
                {weeks.map(function (week, weekIndex){
                    return(
                        <div
                            key={ "week-"+weekIndex}
                            style={{
                                dislay: "flex",
                                flexDirection: "column",
                                marginRight: "2px",
                            }} >
                                {week.map(function (cell, dayIndex){
                                    return(
                                        <div
                                            key={"day-"+weekIndex+"-"+dayIndex}
                                            title={cell.dateString + " - "+cell.count+"goal(s)"}
                                            style={{
                                                width: "12px",
                                                height: "12px",
                                                marginBottom: "2px",
                                                borderRadius: "2px",
                                                backgroundColor: getColor(cell),
                                                }}
                                        />
                                    );
                                })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default GlobalYearCalendar;