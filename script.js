class Calender{
    constructor(){
        this.calenderDiv = document.getElementById("calender");
        this.constructHTMLElements();
        this.loadData();
    }

    //constructs 78 elements for the calender, which includes the text areas
    //and buttons and divs and id numbers
    constructHTMLElements(){
        let counter = 0;
        let timeCounter = 0;
        for (let i=0;i < 78; i++){
            if (i % 6 == 0){
                this.constructTimeElement(timeCounter);
                timeCounter += 1;
            }else {
                this.constructCalenderSlot(counter);
                counter += 1;
            }
        }
    }


    //constructs normal calender slots and hides them
    //NB: counter is also the id for attended button
    constructCalenderSlot(counter){
        var strCounter = (counter + (78 * 4)).toString(); //input for course label
        var dblStrCounter = (counter + 78).toString(); //div wrapper control
        var tplStrCounter = (counter + (78 * 2)).toString(); //input for course description
        var fthStrCounter = (counter + (78 * 3)).toString(); //course type
        var cancelCounter = (counter + (78 * 5)).toString(); //cancel button id
        this.calenderDiv.innerHTML += 
        "<div class='calender-slot'><div id="+dblStrCounter+" class='wrapper-class'><div class='slot-layer1'><p id="+strCounter+" class='course-title'></p><button id="+cancelCounter+" data-clear-button class='clear-calender'>x</button></div><p id="+tplStrCounter+" class='course-label'></p><div class='slot-layer2'><p id="+fthStrCounter+" class='course-type'></p><button id="+counter.toString()+" data-attended-button class='attended'>Attended</button></div></div></div>"
        const pee = document.getElementById(counter + 78);
        pee.style.visibility = "hidden";
    }

    //constructs time slots for calender
    constructTimeElement(timeCounter){
        if (timeCounter < 4){
            var time = timeCounter + 8;
            var timeDisplay = time.toString() + ":00am";
            this.calenderDiv.innerHTML += 
                "<div class='time-display'>"+timeDisplay+"</div>";
        }else if (timeCounter == 4){
            var timeDisplay = "12:00pm";
            this.calenderDiv.innerHTML +=
                "<div class='time-display'>"+timeDisplay+"</div>";
        }else    {
            var time = timeCounter - 4;
            var timeDisplay = time.toString() + ":00pm";
            this.calenderDiv.innerHTML +=
                "<div class='time-display'>"+timeDisplay+"</div>";
        }
    }


    //adds an events to the calender
    addEvent(idNum, courseLabel, time, description, type){
        document.getElementById((idNum + 78).toString()).style.visibility = "visible";
        document.getElementById((idNum + (78 * 4)).toString()).innerText = courseLabel + "--" + time;
        document.getElementById((idNum + (78 * 2)).toString()).innerText = description;
        document.getElementById((idNum + (78 * 3)).toString()).innerText = type;
    }

    //handles the click of the attended button for each event
    attendedSession(idNum){
        document.getElementById(idNum).setAttribute("style", "background-color: greenyellow;");
    }


    //handles the clearing of an event
    clearSession(idNum){
        var idActual = parseInt(idNum) - (78 * 5);
        document.getElementById(idActual).setAttribute("style", "background-color: white;");
    }

    //loading calender data
    //Credit: The Coding Train 
    //https://www.youtube.com/watch?v=RfMkdvN-23o&ab_channel=TheCodingTrain
    async loadData(){
        const response = await fetch('calenderData.csv');
        const data = await response.text();

        const events = data.split('\n').slice(1);
        events.forEach(event =>{
            this.processEvent(event);
        });
    }

    processEvent(event){
        const eventDetails = event.split(',');

        //converts time data into usable number for idNum
        var timeId = 0;
        if(eventDetails[2].slice(-2) == 'am'){
            timeId = parseInt(eventDetails[2].slice(0,-2)) - 8;
        }else if (eventDetails[2].slice(0,2) == '12'){
            timeId = 4;
        }else{
            timeId = parseInt(eventDetails[2].slice(0, -2)) + 4;
        }
        const idNum = (timeId * 5) + parseInt(eventDetails[1]);

        const timeFormatted = eventDetails[2].slice(0, -2) + ":00" + eventDetails[2].slice(-2);
        this.addEvent(idNum, eventDetails[3], timeFormatted, eventDetails[4], eventDetails[5]);
    }
}




calender = new Calender();

const attendButtons = document.querySelectorAll('[data-attended-button]');
const cancelButtons = document.querySelectorAll('[data-clear-button]');

attendButtons.forEach(button => {
    button.addEventListener('click', () =>{
        calender.attendedSession(button.id);
    })
})

cancelButtons.forEach(button =>{
    button.addEventListener('click', () => {
        calender.clearSession(button.id);
    })
})

