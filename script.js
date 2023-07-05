// Store the participant's responses
var participantResponses = {
  questionnaire: {},
  tasks: {}
};

var participantPassedQuiz = false;
// Show the next task and hide the previous task
var totalTrainingTasks = 25;
var totalEvalTasks = 25;
var taskNum = 1;



// Show the instruction page initially
document.getElementById("titlePage").style.display = "block";

// Show the questionnaire page and hide the instruction page
function showQuestionPage() {
  document.getElementById("trainingTaskInstructionsPageFirst").style.display = "none";
  document.getElementById("questionPage").style.display = "block";
}

// Show the improvementPlan page and hide the finishTrainingPage
function showImprovementPlanTutorial() {
  document.getElementById("finishTrainingPage").style.display = "none";
  document.getElementById("improvementPlanTutorialPage").style.display = "block";
}

function showImprovementPlanResult() {
  document.getElementById("improvementPlanTutorialPage").style.display = "none";
  document.getElementById("improvementPlanResultPage").style.display = "block";
}

function showEvalTaskInstructions() {
  document.getElementById("improvementPlanResultPage").style.display = "none";
  document.getElementById("evalTaskInstructionsPage").style.display = "block";
  document.getElementById("taskPages").style.display = "none";
}

function showConsentPage() {
  document.getElementById("titlePage").style.display = "none";
  document.getElementById("trainingTaskInstructionsPageFirst").style.display = "none";
  document.getElementById("consentPage").style.display = "block";
}



// Check the answers and display the result or retry the questionnaire
function checkAnswers() {
  // Get the selected answers
  var answer1 = document.querySelector('input[name="q1"]:checked');
  var answer2 = document.querySelector('input[name="q2"]:checked');
  var answer3 = document.querySelector('input[name="q3"]:checked');
  var answer4 = document.querySelector('input[name="q4"]:checked');

  // Check if all questions are answered
  if (answer1 && answer2 && answer3 && answer4) {
    var correctAnswers = 0;

    // Check each answer and count the correct ones
    if (answer1.value === "option1") {
      correctAnswers++;
    }
    // Change the correct answer for question 1 in the condition above if needed

    if (answer2.value === "option1") {
      correctAnswers++;
    }
    // Change the correct answer for question 2 in the condition above if needed

    if (answer3.value === "option2") {
      correctAnswers++;
    }

    if (answer4.value === "option1") {
      correctAnswers++;
    }


    // Change the correct answer for question 3 in the condition above if needed

    if (correctAnswers === 4) {
      participantPassedQuiz = true
      
      document.getElementById("questionPage").style.display = "none";
      document.getElementById("tutorialResultPage").style.display = "block";


      // Store questionnaire responses
      participantResponses.questionnaire.question1 = answer1.value;
      participantResponses.questionnaire.question2 = answer2.value;
      participantResponses.questionnaire.question3 = answer3.value;

      // Access questionnaire responses using participantResponses.questionnaire
    } else {
      document.getElementById("tryAgainMessage").style.display = "block";
    }
  } else {
    alert("Please answer all questions.");
  }
}

// Show the task instructions page and hide the result page
function showTrainingTaskInstructions() {
  document.getElementById("consentPage").style.display = "none";
  document.getElementById("questionPage").style.display = "none";
  document.getElementById("tutorialResultPage").style.display = "none";
  document.getElementById("taskPages").style.display = "none";

  if (participantPassedQuiz == false) {
    document.getElementById("trainingTaskInstructionsPageFirst").style.display = "block";
  }
  else {
    document.getElementById("trainingTaskInstructionsPagePassed").style.display = "block";
  }
  
}

function showPostSurvey() {
  document.getElementById("finishEvalPage").style.display = "none";
  document.getElementById("postSurveyPage").style.display = "block";
}

// Show the next page and hide the result page
function startTrainingTasks() {
  document.getElementById("trainingTaskInstructionsPagePassed").style.display = "none";
  document.getElementById("taskPages").style.display = "block";
  showTask(taskNum);
}

function showLastTrainingTask() {
  document.getElementById("finishTrainingPage").style.display = "none";
  document.getElementById("taskPages").style.display = "block";
  taskNum = totalTrainingTasks;
  showTask(taskNum);
}

function startEvalTasks() {
  document.getElementById("evalTaskInstructionsPage").style.display = "none";
  document.getElementById("taskPages").style.display = "block";
  if (taskNum == totalTrainingTasks) {
    taskNum = 1 + totalEvalTasks;
  }
  showTask(taskNum);
}

function showLastEvalTask() {
  document.getElementById("finishEvalPage").style.display = "none";
  document.getElementById("taskPages").style.display = "block";
  var taskNum = totalTrainingTasks + totalEvalTasks;
  showTask(taskNum);
}



function showImprovementPlan() {
  document.getElementById("finishTrainingPage").style.display = "none";
  document.getElementById("improvementPlanPage").style.display = "block";
}




function showNextTask(taskType) {
  participantResponses.tasks[taskNum] = getTaskResponses();
  if (taskType == 'training') {
    totalTasks = totalTrainingTasks;
  }
  else {
    totalTasks = totalTrainingTasks + totalEvalTasks;
  }
  if (taskNum < totalTasks) {
    taskNum++;
    showTask(taskNum)
  }
  else {
    document.getElementById("taskPages").style.display = "none";

    if (taskType == 'training') {
      document.getElementById("finishTrainingPage").style.display = "block";
    }
    else {
      document.getElementById("finishEvalPage").style.display = "block";
    }
  }
}

function showTask(currentTask) {
  // Store task responses

  if (currentTask <= totalTrainingTasks) {
    taskType = 'training'
    instructionType = 'Training'
    totalTasks = totalTrainingTasks
    displayTask = currentTask
  }
  else {
    taskType = 'eval'
    instructionType = 'Eval'
    totalTasks = totalEvalTasks
    displayTask = currentTask - totalTrainingTasks
  }


  
  document.getElementById("taskPages").innerHTML = `
    <div class="task">
      <h1>Task ${displayTask}/${totalTasks}</h1>
      <p>Filler text for Task ${currentTask}.</p>
      <img src="task_1.png" alt="profile not loading">

    <div class="question">
      <p>Question 1: Does this passenger have high expectations?</p>
      <input type="radio" name="q1_${currentTask}" value="1"> 1 (Low)
      <input type="radio" name="q1_${currentTask}" value="2"> 2
      <input type="radio" name="q1_${currentTask}" value="3"> 3
      <input type="radio" name="q1_${currentTask}" value="4"> 4
      <input type="radio" name="q1_${currentTask}" value="5"> 5 (High)
    </div>
    <div class="question">
       <p>Question 2: Was this passenger satisfied with their Booking Experience?</p>
      <input type="radio" name="q2_${currentTask}" value="1"> 1 (Not Satisfied)
      <input type="radio" name="q2_${currentTask}" value="2"> 2
      <input type="radio" name="q2_${currentTask}" value="3"> 3
      <input type="radio" name="q2_${currentTask}" value="4"> 4
      <input type="radio" name="q2_${currentTask}" value="5"> 5 (Very Satisfied)
    </div>
    <div class="question">
      <p>Question 3: Was this passenger satisfied with their Airport Experience?</p>
      <input type="radio" name="q3_${currentTask}" value="1"> 1 (Not Satisfied)
      <input type="radio" name="q3_${currentTask}" value="2"> 2
      <input type="radio" name="q3_${currentTask}" value="3"> 3
      <input type="radio" name="q3_${currentTask}" value="4"> 4
      <input type="radio" name="q3_${currentTask}" value="5"> 5 (Very Satisfied)
    </div>
    <div class="question">
      <p>Question 4: Was this passenger satisfied with their Flight Experience?</p>
      <input type="radio" name="q4_${currentTask}" value="1"> 1 (Not Satisfied)
      <input type="radio" name="q4_${currentTask}" value="2"> 2
      <input type="radio" name="q4_${currentTask}" value="3"> 3
      <input type="radio" name="q4_${currentTask}" value="4"> 4
      <input type="radio" name="q4_${currentTask}" value="5"> 5 (Very Satisfied)
    </div>
    <div class="question">
      <p>Question 5: Did this passenger experience delays?</p>
      <input type="radio" name="q5_${currentTask}" value="1"> 1 (No Delays)
      <input type="radio" name="q5_${currentTask}" value="2"> 2
      <input type="radio" name="q5_${currentTask}" value="3"> 3
      <input type="radio" name="q5_${currentTask}" value="4"> 4
      <input type="radio" name="q5_${currentTask}" value="5"> 5 (Significant Delays)
    </div>
    <div class="question">
      <p>Question 6: Was this passenger overall satisfied with the flight?</p>
      <input type="radio" name="q6_${currentTask}" value="satisfied"> Satisfied
      <input type="radio" name="q6_${currentTask}" value="not_satisfied"> Not Satisfied
    </div>

    <button onclick="show${instructionType}TaskInstructions()">Show Instructions</button>
    <button onclick="showPreviousTask('${taskType}')">Previous Task</button>
      <button onclick="showNextTask('${taskType}')">Next Task</button>
    </div>
  `;
  
  // Check if there are stored responses for the current task
  if (participantResponses.tasks[currentTask]) {
    populateTaskForm(participantResponses.tasks[currentTask]);
  }
} 


// Show the previous task and hide the current task
function showPreviousTask(taskType) {
  
  participantResponses.tasks[taskNum] = getTaskResponses();
  
  if (taskType == 'training') {
    minTask = 1
  }
  else {
    minTask = 1 + totalEvalTasks
  }
  if (taskNum > minTask) {
    taskNum--;
    showTask(taskNum);
  } else {
    document.getElementById("taskPages").style.display = "none";
    if (taskType == 'training') {
      document.getElementById("trainingTaskInstructionsPage").style.display = "block";
    }
    else {
      document.getElementById("evalTaskInstructionsPage").style.display = "block";
    }
    
  }
}

// Populate the task form with stored responses
function populateTaskForm(taskResponses) {
  var taskQuestions = document.querySelectorAll('.task input[type="radio"]');

  taskQuestions.forEach(function (question) {
    var responseKey = question.name;
    if (taskResponses.hasOwnProperty(responseKey)) {
      if (question.value === taskResponses[responseKey]) {
        question.checked = true;
      }
    }
  });
}


// Get the responses for the current task
function getTaskResponses() {
  var taskResponses = {};
  var taskQuestions = document.querySelectorAll('.task input[type="radio"]');

  taskQuestions.forEach(function (question) {
    if (question.checked) {
      var responseKey = question.name;
      var responseValue = question.value;
      taskResponses[responseKey] = responseValue;
    }

    else {
      if (!(question.name in taskResponses)) {
        taskResponses[question.name] = "";
      }
      
      


    }
  });

  return taskResponses;
}

// Example usage:
// To access the questionnaire responses: participantResponses.questionnaire
// To access the task responses: participantResponses.tasks