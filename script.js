//WHY DIDNT I COMMENT ANY OF THIS CODE ARGHHHHH

//handles all the elements of the calender aspect
class Calender{
    constructor(){
        this.calenderDiv = document.getElementById("calender");
        this.constructHTMLElements();
        this.loadData();
    }

    //constructs 78 elements for the calender, which includes the text areas
    //and buttons and divs and id numbers
    constructHTMLElements(){
        let counter = 0; //counter and timeCounter are like row and column counters
        let timeCounter = 0;
        for (let i=0;i < 78; i++){
            if (i % 6 == 0){
                //if we are at the start of a row create a time display (eg 8:00am)
                this.constructTimeElement(timeCounter);
                timeCounter += 1;
            }else {
                //else create a normal calender slot
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
        //to start with all calender slots should be hidden until we load the data
        const calenderSlot = document.getElementById(counter + 78);
        calenderSlot.style.visibility = "hidden";
    }

    //constructs time slots for calender
    constructTimeElement(timeCounter){
        if (timeCounter < 4){
            //handles am times
            var time = timeCounter + 8;
            var timeDisplay = time.toString() + ":00am";
            this.calenderDiv.innerHTML += 
                "<div class='time-display'>"+timeDisplay+"</div>";
        }else if (timeCounter == 4){
            //handles 12:00pm (outlier)
            var timeDisplay = "12:00pm";
            this.calenderDiv.innerHTML +=
                "<div class='time-display'>"+timeDisplay+"</div>";
        }else    {
            //handles pm time
            var time = timeCounter - 4;
            var timeDisplay = time.toString() + ":00pm";
            this.calenderDiv.innerHTML +=
                "<div class='time-display'>"+timeDisplay+"</div>";
        }
    }


    //adds an events to the calender
    addEvent(idNum, courseLabel, time, description, type){
        //unhides the calender slot and changes the appropriate html properties
        document.getElementById((idNum + 78).toString()).style.visibility = "visible";
        document.getElementById((idNum + (78 * 4)).toString()).innerText = courseLabel + "--" + time;
        document.getElementById((idNum + (78 * 2)).toString()).innerText = description;
        document.getElementById((idNum + (78 * 3)).toString()).innerText = type;
    }

    //handles the click of the attended button for each event
    attendedSession(idNum){
        document.getElementById(idNum).setAttribute("style", "background-color: greenyellow;");
        this.addCalenderData(idNum);
    }


    //handles the clearing of an event
    clearSession(idNum){
        var idActual = parseInt(idNum) - (78 * 5);
        document.getElementById(idActual).setAttribute("style", "background-color: white;");
        this.removeCalenderData(idActual.toString());
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
        this.resetWeek();
        this.updateDisplay();
    }

    //handles the input and adds it to the calender
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

    addCalenderData(newData){
        //if there is nothing saved then create an empty array
        if(localStorage.getItem('calenderData') == null){
            localStorage.setItem('calenderData', '[]');
        }

        //get old data and add append data to old data if newData not in the array
        var oldData = JSON.parse(localStorage.getItem('calenderData'));
        if (!oldData.includes(newData)){
            oldData.push(newData);
            localStorage.setItem('calenderData', JSON.stringify(oldData));
        }
    }


    //removes stored data from the local localStorage
    removeCalenderData(toRemove){
        if(localStorage.getItem('calenderData') == null){
            localStorage.setItem('calenderData', '[]');
        }

        var oldData = JSON.parse(localStorage.getItem('calenderData'));
        if(oldData.includes(toRemove)){
            var removeObject = (element) => element = toRemove;
            var removeLocation = oldData.findIndex(removeObject);
            oldData.splice(removeLocation, 1);
            localStorage.setItem('calenderData', JSON.stringify(oldData));
        }
    }

    updateDisplay(){
        if(localStorage.getItem('calenderData') == null){
            localStorage.setItem('calenderData', '[]');
        }
        var calenderData = JSON.parse(localStorage.getItem('calenderData'));
        calenderData.forEach(calender => {
            document.getElementById(calender).setAttribute("style", "background: greenyellow;");
        })
    }

    getCurrentWeek(){
        var todaysDate = new Date();
        var oneJan = new Date(todaysDate.getFullYear(), 0, 1);
        var numDays = Math.floor((todaysDate - oneJan) / (24 * 60 * 60 * 1000));
        return Math.ceil((todaysDate.getDay() + 1 + numDays)/7);
    }

    resetWeek(){
        if(localStorage.getItem('weekNum') == null){
            localStorage.setItem('weekNum', '0');
        }
        var storedWeekNum = JSON.parse(localStorage.getItem('weekNum'));
        if (storedWeekNum != this.getCurrentWeek()){
            console.log('trye');
            localStorage.setItem('weekNum', JSON.stringify(this.getCurrentWeek()));
            localStorage.setItem('calenderData', '[]');
        }
    }
}



class Reminder{
    constructor(){
        this.year = 2021;
        this.constructReminders();
        this.doneReminderButtons = document.querySelectorAll('[data-reminder-button]');
        this.cancelReminderButtons = document.querySelectorAll('[data-reminder-cancel]');
    }

    //returns how many days are in the month
    //https://www.30secondsofcode.org/js/s/days-in-month
    daysInMonth(year, month){
        return new Date(year, month, 0).getDate();
    }


    //returns the number of days until a date, input the date as day, month, or returns Infinity if date has already occured
    getDaysUntil(day, month){
        const date = new Date();
        var days = 0;
        var dMonth = month - date.getMonth();
        if (dMonth > 0){
            for (let i=0;i<dMonth;i++){
                days += this.daysInMonth(this.year, date.getMonth() + i);
            }
        } else if (dMonth < 0){
            return Infinity;
        } 
        if ((day - date.getDate()) < 0 && dMonth == 0){
            return Infinity;
        }  
        return days + (day - date.getDate()) - 1;
    }


    //loads reminder lines from file, reminderNum is the column number that 
    //the data in the file belongs to
    async loadReminderData(reminderFile, reminderNum){
        const response = await fetch(reminderFile);
        const data = await response.text();

        const reminders = data.split('\n').slice(1);
        this.addReminderComponents(this.sortReminders(reminders), reminderNum);
    }

    //sorts and formats the reminders
    sortReminders(reminders){
        var returning = Array();
        let i = 0;
        reminders.forEach(reminder =>{
            //splits into usable data
            let reminderData = reminder.split(',');
            //adds reminder number and day counter to reminderData
            reminderData.unshift(this.getDaysUntil(parseInt(reminderData[3]), parseInt(reminderData[4])));
            reminderData.push(i);
            if (returning.length == 0){
                //if returning is empty
                returning.push(reminderData);
            }else if (reminderData[0] == Infinity){
                //add to the end of returning
                returning.push(reminderData);
            }else{
                //loop over the array and find the location i that the reminder should be in
                let i = 0;
                while (returning.length > i && returning[i][0] < reminderData[0]){
                    i += 1;
                }
                //insert reminderData into position i of returning array
                returning.splice(i, 0, reminderData);
            }
            i++;
        });
        return returning;
    }


    //adds each reminder to the display from an array of reminders
    //reminderNum is the column to place the reminders in
    addReminderComponents(reminders, reminderNum){
        //get the required display and add the base html element of the name
        const reminderDisplay = document.getElementById("data-display-"+reminderNum.toString());
        reminderDisplay.innerHTML += 
            "<p class='reminder-name'>"+reminders[0][1]+"</p>";
        //adds the reminder html elements to the page
        reminders.forEach(reminder =>{
            reminderDisplay.innerHTML += 
                "<div id="+reminderNum.toString() + "-" + reminder[reminder.length-1].toString() + " class='reminder'><div class='reminder-top-display'><div class='reminder-type'>"+reminder[3]+"</div><div class='time-remaining'>Due in: "+reminder[0].toString()+" Days</div><button id="+reminderNum.toString() + "-" + (reminder[reminder.length-1]+1000).toString() + " data-reminder-cancel class='reminder-cancel'>x</button></div><div class='reminder-weight'>Worth "+reminder[6]+"%</div><div class='reminder-bottom-display'><div class='reminder-course-label'>"+reminder[1]+"</div><button id="+reminderNum.toString() + "-" + (reminder[reminder.length-1]+2000).toString() + " data-reminder-button class='reminder-done'>Done</button></div></div>";
        });
        //gets all the created buttons and loops over them for input handling
        this.doneReminderButtons = document.querySelectorAll('[data-reminder-button]');
        this.cancelReminderButtons = document.querySelectorAll('[data-reminder-cancel]');

        reminder.doneReminderButtons.forEach(button =>{
            button.addEventListener('click', () => {
                reminder.reminderDone(button.id);
            });
        });

        reminder.cancelReminderButtons.forEach(button =>{
            button.addEventListener('click', () => {
                reminder.clearReminder(button.id)
            });
        });

        this.updateDisplay();
    }

    //gets all the reminders and puts them into the website
    constructReminders(){
        for(let i=0;i<4;i++){
            this.loadReminderData("reminder-"+(i+1).toString()+".csv", i+1);
        }
        //this.loadReminderData("reminder-1.csv", 1);
    }

    clearReminder(buttonID){
        document.getElementById(buttonID.substring(0, 2) + (parseInt(buttonID.slice(2)) - 1000).toString()).setAttribute("style", "background: white;");
        this.removeReminderData(buttonID.substring(0, 2) + (parseInt(buttonID.slice(2)) - 1000).toString());
    }

    //changes the reminder to be coloured green and adds completed to local localStorage
    reminderDone(buttonID){
        document.getElementById(buttonID.substring(0, 2) +(parseInt(buttonID.slice(2)) - 2000).toString()).setAttribute("style", "background: greenyellow;");
        this.addReminderData(buttonID.substring(0, 2) + (parseInt(buttonID.slice(2)) - 2000).toString());
    }

    addReminderData(newData){
        //if there is nothing saved then create an empty array
        if(localStorage.getItem('reminderData') == null){
            localStorage.setItem('reminderData', '[]');
        }

        //get old data and add append data to old data if newData not in the array
        var oldData = JSON.parse(localStorage.getItem('reminderData'));
        if (!oldData.includes(newData)){
            oldData.push(newData);
            localStorage.setItem('reminderData', JSON.stringify(oldData));
        }
    }


    //removes stored data from the local localStorage
    removeReminderData(toRemove){
        if(localStorage.getItem('reminderData') == null){
            localStorage.setItem('reminderData', '[]');
        }

        var oldData = JSON.parse(localStorage.getItem('reminderData'));
        if(oldData.includes(toRemove)){
            var removeObject = (element) => element = toRemove;
            var removeLocation = oldData.findIndex(removeObject);
            oldData.splice(removeLocation, 1);
            localStorage.setItem('reminderData', JSON.stringify(oldData));
        }
    }

    updateDisplay(){
        if(localStorage.getItem('reminderData') == null){
            localStorage.setItem('reminderData', '[]');
        }
        var reminderData = JSON.parse(localStorage.getItem('reminderData'));
        reminderData.forEach(reminder => {
            document.getElementById(reminder).setAttribute("style", "background: greenyellow;");
        })
    }
}


reminder = new Reminder();
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

//handles the top display days remaining counter
const daysRemainingElement = document.getElementById('days-left');
//change endDate to the appropriate end date for the semester
const daysLeftInSemester = reminder.getDaysUntil(31, 9);
if (daysLeftInSemester >= 0){
    daysRemainingElement.innerHTML = daysLeftInSemester.toString();
}else{
    daysRemainingElement.innerHTML = '-';
}