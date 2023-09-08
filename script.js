const apiEndpoint = 'https://refl-backend.isnicholas.com/';
// Send a POST request to the Flask backend
function midpointPush(id, condition) {
  //delete trainingTaskResponses[4]['attn1'];
  //delete trainingTaskResponses[2]['attn2'];
  trainingTaskResponses[25]['timesFailedQuiz'] = timesFailedQuiz;
  fetch(apiEndpoint + `midpoint_push/${id}/${condition}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },


    body: JSON.stringify(trainingTaskResponses)
})
.then(function(response) {
    if (response.ok) {
        console.log('Data uploaded successfully');
    } else {
        console.log('Failed to upload data');
    }
})
.catch(function(error) {
    console.log('Error:', error);
});
}


function postSurveyPush(id, condition) {
  fetch(apiEndpoint + `post_survey_push/${id}/${condition}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(postSurveyResponses)
})
.then(function(response) {
    if (response.ok) {
        console.log('Data uploaded successfully');
    } else {
        console.log('Failed to upload data');
    }
})
.catch(function(error) {
    console.log('Error:', error);
});
}

function participantPush(id, condition) {
  fetch(apiEndpoint + `participant_push/${id}/${condition}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(urlParams)
})
.then(function(response) {
    if (response.ok) {
        console.log('Data uploaded successfully');
    } else {
        console.log('Failed to upload data');
    }
})
.catch(function(error) {
    console.log('Error:', error);
});
}





function timesPush(id, condition) {
  fetch(apiEndpoint + `times_push/${id}/${condition}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(times)
})
.then(function(response) {
    if (response.ok) {
        console.log('Data uploaded successfully');
    } else {
        console.log('Failed to upload data');
    }
})
.catch(function(error) {
    console.log('Error:', error);
});
}

function endPush(id, condition) {
  fetch(apiEndpoint + `end_task_push/${id}/${condition}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(evalTaskResponses)
})
.then(function(response) {
    if (response.ok) {
        console.log('Data uploaded successfully');
    } else {
        console.log('Failed to upload data');
    }
})
.catch(function(error) {
    console.log('Error:', error);
});
}

var image_not_appended = true;
var text_not_appended = true;
var textDataJSON = {};

function midpointPullImage(id, condition) {
  const improvementPlanResultPage = document.getElementById('improvementPlanResultPage');

  const url = apiEndpoint + `pull_improvement_plan_image/${id}/${condition}`;

  fetch(url, { method: 'GET' })
    .then(response => response.blob())
    .then(imageBlob => {
      const imageURL = URL.createObjectURL(imageBlob);
      const imageElement = document.createElement('img');
      imageElement.src = imageURL;

      imageElement.style.width = '80%'; // Adjust the width as needed
      imageElement.style.height = 'auto'; // Maintain the aspect ratio
      imageElement.style.display = 'block';
      imageElement.style.margin = '0 auto';

      const pElement = document.createElement('p');
      pElement.appendChild(imageElement);
      
      if (image_not_appended) {
        var inner = document.getElementById('improvementPlanResultPage')
        var buttons = inner.getElementsByTagName('button');
        improvementPlanResultPage.insertBefore(pElement, improvementPlanResultPage.childNodes[improvementPlanResultPage.childNodes.length-buttons.length]);
        image_not_appended = false;
      }
      
    })
    .catch(error => {
      console.error('Error: Image not found, please wait a few seconds and refresh the page.');
    }); 
}

  function midpointPullText(id, condition) {
  

  const url = apiEndpoint + `pull_improvement_plan_text/${id}/${condition}`;

  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      textDataJSON = data;
        //loop through elements of textDataJSON dictionary
    for (const [key, value] of Object.entries(textDataJSON)) { 
      //append each element to page as a paragraph
      if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf(value) == -1) {
        document.getElementById("improvementPlanResultPage").innerHTML += `<p>${value}</p>` }
    }
    }
    )
    .catch(error => {
      console.error('Error:', error);
    }
    );

}


function pullTasks(id, condition) {
  
  const url = apiEndpoint + `pull_tasks/${id}/${condition}`;
  //fetch json file from s3 bucket
  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      taskDataJSON = data;
    }
    )
    .catch(error => {
      console.error('Error:', error);
    }
    );
}

function hello(ap) {
  const url = ap + `hello_world`;
   fetch(url, { method: 'GET' })
    .then(response => response.text())
    .then(text => {
      texty = text;
    }
    )
    .catch(error => {
      console.error('Error:', error);
    }
    );
  
}


function pullResp(id, condition) {
  
  const url = apiEndpoint + `pull_resp/${id}/${condition}`;
  //fetch json file from s3 bucket
  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      respDataJSON = data;
    }
    )
    .catch(error => {
      console.error('Error:', error);
    }
    );
}



function compareQ6ResponsesWithAnswers(startingTaskNum, endingTaskNum, trainingTaskResponses, respDataJSON) {
  let corrects = 0;
  for (let i = startingTaskNum; i <= endingTaskNum; i++) {
    
    
    // Get the user's response and correct answer for "q6" for taskNum
    const userResponsetemp = trainingTaskResponses[i]['q6'];
    if (userResponsetemp == 'satisfied') {
      var userResponse = 1;
    }
    else {
      var userResponse = 0;
    }

    const correctAnswer = respDataJSON[i-1]['Y'];

    if (userResponse === correctAnswer) {
      corrects += 1;
    }
  }
  return corrects;
}


// Store the participant's responses



var quizResponses = {};
var trainingTaskResponses = {};
var evalTaskResponses = {}
var surveyResponses = {}
var postSurveyResponses = {}
var current_element = "titlePage";
var evalStarted = false
var times = {};
var trainingTaskStartTime = Date.now();
var evalTaskStartTime = Date.now();
var experimentStartTime = Date.now();
var timesFailedQuiz = 0;
const queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
//var unique_id = Math.floor(Math.random() * Date.now()).toString(16)
var unique_id = urlParams.get('participantId');
urlParams['condition'] = condition
urlParams['type'] = 'pre-pilot'
urlParams['completed'] = false
urlParams['bonus'] = 0
urlParams['commitFail'] = false



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var participantPassedQuiz = false;
// Show the next task and hide the previous task
var totalTrainingTasks = 25;
var totalEvalTasks = 25;
var taskNum = 1;
var condition = getRandomInt(4);
var atPostSurvey = false;

function saveProgress(currentPage) {
  const progressData = {
    unique_id: unique_id,
    condition: condition,
    quizResponses: quizResponses,
    trainingTaskResponses: trainingTaskResponses,
    evalTaskResponses: evalTaskResponses,
    surveyResponses: surveyResponses,
    current_element: currentPage,
    taskNum: taskNum,
    participantPassedQuiz: participantPassedQuiz,
    taskDataJSON: taskDataJSON,
    respDataJSON: respDataJSON,
    atPostSurvey: atPostSurvey,
    evalStarted: evalStarted,
    times: times,
    experimentStartTime: experimentStartTime,
    trainingTaskStartTime: trainingTaskStartTime,
    evalTaskStartTime: evalTaskStartTime,
    timesFailedQuiz: timesFailedQuiz,
    textDataJSON: textDataJSON,
    urlParams: urlParams


  };

  localStorage.setItem("participantProgress", JSON.stringify(progressData));
}

function loadProgress() {
  const progressData = JSON.parse(localStorage.getItem("participantProgress"));

  if (progressData) {
    unique_id = progressData.unique_id;
    condition = progressData.condition;
    quizResponses = progressData.quizResponses;
    trainingTaskResponses = progressData.trainingTaskResponses;
    evalTaskResponses = progressData.evalTaskResponses;
    surveyResponses = progressData.surveyResponses;
    current_element = progressData.current_element;
    taskNum = progressData.taskNum;
    participantPassedQuiz = progressData.participantPassedQuiz;
    taskDataJSON = progressData.taskDataJSON;
    respDataJSON = progressData.respDataJSON;
    atPostSurvey = progressData.atPostSurvey;
    evalStarted = progressData.evalStarted;
    times = progressData.times;
    experimentStartTime = progressData.experimentStartTime;
    trainingTaskStartTime = progressData.trainingTaskStartTime;
    evalTaskStartTime = progressData.evalTaskStartTime;
    timesFailedQuiz = progressData.timesFailedQuiz;
    textDataJSON = progressData.textDataJSON;
    urlParams = progressData.urlParams;

    // hide all possible elements
    document.getElementById("titlePage").style.display = "none";
    document.getElementById("questionPage").style.display = "none";
    document.getElementById("improvementPlanTutorialPage").style.display = "none";
    document.getElementById("improvementPlanResultPage").style.display = "none";
    document.getElementById("consentPage").style.display = "none";
    document.getElementById("trainingTaskInstructionsPageFirst").style.display = "none";
    document.getElementById("trainingTaskInstructionsPagePassed").style.display = "none";
    document.getElementById("evalTaskInstructionsPage").style.display = "none";
    document.getElementById("taskPages").style.display = "none";


    // depending on the current element, show appropriate page by calling the appropriate function
    if (current_element == "titlePage") {
      document.getElementById("titlePage").style.display = "block";
    } else if (current_element == "questionPage") {
      showQuestionPage(); }
    else if (current_element == "improvementPlanTutorialPage") {
      showImprovementPlanTutorial();
    } else if (current_element == "improvementPlanResultPage") {
      showImprovementPlanResult();
    } else if (current_element == "consentPage") {
      showConsentPage();
    } else if (current_element == "trainingTaskInstructionsPageFirst") {
      showTrainingTaskInstructions();
    } else if (current_element == "trainingTaskInstructionsPagePassed") {
      showTrainingTaskInstructions();
    } else if (current_element == "evalTaskInstructionsPage") {
      showEvalTaskInstructions();
    } else if (current_element == "taskPages") {
      document.getElementById("taskPages").style.display = "block";
      showTask(taskNum);
      populateDataFromJSON(taskNum);
    } else if (current_element == "tutorialResultPage") {
      document.getElementById("tutorialResultPage").style.display = "block";
    } else if (current_element == "postSurveyPage") {
      showPostSurvey();
    } else if (current_element == "commitPage") {
      showCommitPage();
    } else if (current_element == "finishTrainingPage") {
      document.getElementById("finishTrainingPage").style.display = "block";
    } else if (current_element == "finishEvalPage") {
      document.getElementById("finishEvalPage").style.display = "block";
    } else if (current_element == "finishPage") {
      document.getElementById("finishPage").style.display = "block";
    } else if (current_element == 'attentionFailPage') { 
      showAttentionFailPage();
    }

    

    // You need to adjust the logic to handle other elements and progress continuation based on the loaded data.
    // Make sure to set the appropriate styles and displays for the elements based on the 'current_element' and 'taskNum'.
  }
}

// Call the loadProgress function on page load to resume the participant's progress
document.addEventListener("DOMContentLoaded", loadProgress);








// Show the instruction page initially
document.getElementById("titlePage").style.display = "block";
pullTasks(unique_id, condition);
pullResp(unique_id, condition);

// Show the questionnaire page and hide the instruction page
function showQuestionPage() {
  document.getElementById("trainingTaskInstructionsPageFirst").style.display = "none";
  document.getElementById("questionPage").style.display = "block";
  if ([2,3,5,6].includes(condition)) {
    if (document.getElementById("questionPage").innerHTML.indexOf("Question 3") == -1) {
    document.getElementById("questionPage").innerHTML += `<div class="question">
  <p>Question 3: A concept is an intermediate descriptor of the passenger's airline experience that can be useful towards deducing whether a passenger was ultimately satisfied or dissatisfied with their flight.</p>
  <input type="radio" name="q3" value="option1"> True
  <input type="radio" name="q3" value="option2"> False
</div>
<div class="question">
  <p>Question 4: The concept ratings you provide will be compared to ground truth ("correct") concept values.</p>
  <input type="radio" name="q4" value="option1"> True
  <input type="radio" name="q4" value="option2"> False
</div>`
  } }
  if (document.getElementById("questionPage").innerHTML.indexOf("showTrainingTaskInstructions()") == -1) {
  document.getElementById("questionPage").innerHTML += `<button onclick="showTrainingTaskInstructions()">Back</button>
  <button onclick="checkAnswers()">Submit</button>
  <p id="tryAgainMessage" style="color: red; display: none;">Sorry, your answers are not correct. Please try again.</p>` }


  saveProgress("questionPage");
}

// Show the improvementPlan page and hide the finishTrainingPage
function showImprovementPlanTutorial() {
  times['trainingTasks'] = Date.now() - trainingTaskStartTime;
  midpointPush(unique_id, condition);
  corrs = compareQ6ResponsesWithAnswers(1, 25, trainingTaskResponses, respDataJSON);
  bonus = corrs * 0.04;
  urlParams['bonus'] = bonus
  participantPush(unique_id, condition)
  document.getElementById("finishTrainingPage").style.display = "none";
  document.getElementById("improvementPlanResultPage").style.display = "none";
  document.getElementById("improvementPlanTutorialPage").style.display = "block";
  saveProgress("improvementPlanTutorialPage");
  if (document.getElementById("improvementPlanTutorialPage").innerHTML.indexOf("Thank you for completing the first 25 tasks!") == -1) {
  document.getElementById("improvementPlanTutorialPage").innerHTML += ` <p>Thank you for completing the first 25 tasks!</p>
  <p> You correctly answered ${corrs} out of 25 questions, earning you a bonus of ${bonus.toFixed(2)}$. </p>`;
  if (condition == 0) {
    document.getElementById("improvementPlanTutorialPage").innerHTML += `<p>You will now be asked to complete the remaining 25 tasks. 
    You will again be given a bonus of $0.04 for each question you answer correctly. </p>
    <button onclick="showEvalTaskInstructions()">Next</button>`
  } else {
    document.getElementById("improvementPlanTutorialPage").innerHTML += `<p> We will now assess your decision making behavior based on your responses to the first 25 tasks and will generate an improvement plan to help you increase your accuracy for the next 25 tasks. </p>
    <p> On the next page you will see a horizontal bar plot that shows you how you used either the factors or concepts to come to your final decisions. For each factor/concept, a high value (blue bar extending to the right from 0) means that you generally assumed that factor/concept has a positive relationship with the passenger's overall satisfaction, 
    while a low value (red bar extending to the left from 0) means that you generally assumed that factor/concept has a negative relationship with the passenger's overall satisfaction. </p>
    <p>Note that a positive relationship between a factor/concept, such as Age, and the passenger's satisfaction, means that the higher the value for the factor/concept (the higher the age), the more likely you were to select that the passenger was overall satisfied. 
    A negative relationship between the factor/concept, such as Age, and the passenger's satisfaction, means that the higher the value for the factor/concept (the higher the age), the more likely you were to predict that the passenger was overall dissatisfied.</p>
    <p> In addition to the bar chart describing your behavior, there will be arrows overlaid on top of some of the bars. These arrows are your guide towards making better decisions. Adjust the relationship you use for each factor/concept based on the arrow to improve your accuracy for the next set of tasks!  Each arrow will also be paired with a textual interpretation of the arrow. </p>
    <button onclick="showImprovementPlanResult()">Next</button>`
  } }
}

 function showImprovementPlanResult() {
  
  document.getElementById("improvementPlanTutorialPage").style.display = "none";
  document.getElementById("postSurveyPage").style.display = "none";
  document.getElementById("taskPages").style.display = "none";
  document.getElementById("improvementPlanResultPage").style.display = "block";


  midpointPullText(unique_id, condition);


  

 

         
  
  
  
    midpointPullImage(unique_id, condition);






  if (atPostSurvey) {
    var inner = document.getElementById('improvementPlanResultPage')
    var buttons = inner.getElementsByTagName('button');
    if (buttons) {
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].remove();
      }
    }
    if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf(`<button onclick="showPostSurvey()">Back to Post-Survey</button>`) == -1) {
      document.getElementById("improvementPlanResultPage").innerHTML.replace(`<button onclick="startEvalTasks()">Return To Survey</button>`, ``)
      document.getElementById("improvementPlanResultPage").innerHTML.replace(`<button onclick="showEvalTaskInstructions()">Next</button>`, ``)
    document.getElementById("improvementPlanResultPage").innerHTML += `<button onclick="showPostSurvey()">Back to Post-Survey</button>` }
  }
  else {
    if (evalStarted) {
      var inner = document.getElementById('improvementPlanResultPage')
      var buttons = inner.getElementsByTagName('button');
      if (buttons) {
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].remove();
        }
      }
      if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf(`<button onclick="startEvalTasks()">Return To Survey</button>`) == -1) {
    document.getElementById("improvementPlanResultPage").innerHTML += `<button onclick="startEvalTasks()">Return To Survey</button>` }
    }
    else {
    if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf(`<button onclick="showEvalTaskInstructions()">Next</button>`) == -1) {
    document.getElementById("improvementPlanResultPage").innerHTML += `<button onclick="showImprovementPlanTutorial()">Back</button>`
    document.getElementById("improvementPlanResultPage").innerHTML += `<button onclick="showEvalTaskInstructions()">Next</button>` }}
  }

  saveProgress("improvementPlanResultPage");
  
}
const concept_introduction = `<p>Additionally, consider how the factors available come together to form the following concepts: passenger expectations, in-flight experience, and delays. A concept is an intermediate descriptor of the passenger's airline experience that can be useful towards deducing whether a passenger was ultimately satisfied or dissatisfied with their flight.  For each passenger, given the information available, rate each of the concepts on a scale of 1-5. Note that the passengers did not provide their ratings for these concepts (there is no true or "correct" concept rating). These are just there to help you reason about the task, and there are no right or wrong answers. Each concept can be loosely defined as follows: </p>
  <p><b>Passenger Expectations (1 (Low) - 5 (High))</b> - Did this passenger have high or low expectations for their flight (before the flight took place)? Things you might consider: Would a passenger in a higher class have lower or higher expections? What about whether a passenger is loyal or disloyal to the airline? Could the purpose of the travel matter?</p>
  <p><b>In-Flight Experience (1 (Satisfied) - 5 (Unsatisfied))</b> - Was the passenger satisfied with their experience during the flight (on plane)? Things you might consider: Which factors on the survey response form filled out by the passenger could indicate whether they were satisfied during the flight? </p>
  <p><b>Delays (1 (No Delays) - 5 (Significant Delays))</b> - Was the passenger's flight significantly delayed? Things you might consider: If there was a delay, do you think the passenger would find it significant?</p>
  <p>When solving this task, think about which factors are important to each concept, and think about which factors and concepts are important to an airline passenger's overall flight satisfaction. Try and use your concept ratings when coming to a final decision about the passenger's overall flight satisfaction.</p>`

  function showEvalTaskInstructions() {
  document.getElementById("improvementPlanResultPage").style.display = "none";
  document.getElementById("improvementPlanTutorialPage").style.display = "none";
  document.getElementById("evalTaskInstructionsPage").style.display = "block";
  document.getElementById("taskPages").style.display = "none";
  if ([2,3,5,6].includes(condition)) {
    if (document.getElementById("evalTaskInstructionsPage").innerHTML.indexOf(concept_introduction) == -1) {
    document.getElementById("evalTaskInstructionsPage").innerHTML += concept_introduction + `  <p><strong>Click start below whenever you are ready to start making predictions!</strong></p>`
    }
  }
  if (document.getElementById("evalTaskInstructionsPage").innerHTML.indexOf(`<button onclick="startEvalTasks()">Continue</button>`) == -1) {
  document.getElementById("evalTaskInstructionsPage").innerHTML += `<button onclick="startEvalTasks()">Continue</button>`; }
  saveProgress("evalTaskInstructionsPage");
}

function showConsentPage() {
  document.getElementById("titlePage").style.display = "none";
  document.getElementById("trainingTaskInstructionsPageFirst").style.display = "none";
  document.getElementById("consentPage").style.display = "block";
  participantPush(unique_id, condition);
  saveProgress("consentPage");
}



// Check the answers and display the result or retry the questionnaire
function checkAnswers() {
  // Get the selected answers
  var answer1 = document.querySelector('input[name="q1"]:checked');
  var answer2 = document.querySelector('input[name="q2"]:checked');


  if ([2,3,5,6].includes(condition)) {
  var answer3 = document.querySelector('input[name="q3"]:checked');
  var answer4 = document.querySelector('input[name="q4"]:checked');
  } else {
    var answer3 = document.querySelector('input[name="q1"]:checked')
    var answer4 = document.querySelector('input[name="q2"]:checked')

  }

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

    if (answer3.value === "option1" || [0,1,4].includes(condition)) {
      correctAnswers++;
    }

    if (answer4.value === "option2" || [0,1,4].includes(condition) ) {
      correctAnswers++;
    }


    // Change the correct answer for question 3 in the condition above if needed

    if (correctAnswers === 4) {
      participantPassedQuiz = true
      
      document.getElementById("questionPage").style.display = "none";
      document.getElementById("tutorialResultPage").style.display = "block";
      saveProgress("tutorialResultPage")


      // Store questionnaire responses
      quizResponses.question1 = answer1.value;
      quizResponses.question2 = answer2.value;
      quizResponses.question3 = answer3.value;
      quizResponses.question4 = answer4.value;

      // Access questionnaire responses using quizResponses
    } else {
      document.getElementById("tryAgainMessage").style.display = "block";
      timesFailedQuiz += 1;
    }
  } else {
    alert("Please answer all questions.");
  }
}

function showCommitPage() { 
  document.getElementById("consentPage").style.display = "none";
  document.getElementById("commitPage").style.display = "block";
  saveProgress("commitPage");

}

// Show the task instructions page and hide the result page
function showTrainingTaskInstructions() {
  document.getElementById("consentPage").style.display = "none";
  document.getElementById("questionPage").style.display = "none";
  document.getElementById("tutorialResultPage").style.display = "none";
  document.getElementById("taskPages").style.display = "none";
  document.getElementById("commitPage").style.display = "none";

  if (participantPassedQuiz == false) {
    document.getElementById("trainingTaskInstructionsPageFirst").style.display = "block";
    if ([2,3,5,6].includes(condition)) {
      if (document.getElementById("trainingTaskInstructionsPageFirst").innerHTML.indexOf(concept_introduction) == -1) {
        document.getElementById("trainingTaskInstructionsPageFirst").innerHTML += concept_introduction;
      }
       }
       if (document.getElementById("trainingTaskInstructionsPageFirst").innerHTML.indexOf(`<button onclick="showConsentPage()">Back</button>`) == -1) {

    document.getElementById("trainingTaskInstructionsPageFirst").innerHTML += `<button onclick="showConsentPage()">Back</button>
  <button onclick="showQuestionPage()">Continue</button>`; }
      
    
    saveProgress("trainingTaskInstructionsPageFirst");
  }
  else {
    document.getElementById("trainingTaskInstructionsPagePassed").style.display = "block";
    if ([2,3,5,6].includes(condition)) {
      if (document.getElementById("trainingTaskInstructionsPagePassed").innerHTML.indexOf(concept_introduction) == -1) {
      document.getElementById("trainingTaskInstructionsPagePassed").innerHTML += concept_introduction;} }

      if (document.getElementById("trainingTaskInstructionsPagePassed").innerHTML.indexOf(`Click start below whenever you are ready to start making predictions!`) == -1) {
    document.getElementById("trainingTaskInstructionsPagePassed").innerHTML += `<p><strong>Click start below whenever you are ready to start making predictions!</strong></p>
      <button onclick="startTrainingTasks()">Continue!</button>`}
    
    saveProgress("trainingTaskInstructionsPagePassed");
  }
  
}

function showPostSurvey() {
  atPostSurvey = true;
  endPush(unique_id, condition);
  document.getElementById("finishEvalPage").style.display = "none";
  document.getElementById("improvementPlanResultPage").style.display = "none";
  document.getElementById("postSurveyPage").style.display = "block";
  saveProgress("postSurveyPage");
  endCorrects = compareQ6ResponsesWithAnswers(26, 50, evalTaskResponses, respDataJSON)
  corrs = compareQ6ResponsesWithAnswers(1, 25, trainingTaskResponses, respDataJSON)
  endBonus = endCorrects * 0.04
  fullBonus = ((corrs + endCorrects) * 0.04).toFixed(2)
  urlParams['bonus'] = fullBonus
  if (document.getElementById("postSurveyPage").innerHTML.indexOf(`Thank you for completing the prediction tasks!`) == -1) {
  document.getElementById("postSurveyPage").innerHTML += `<p>Thank you for completing the prediction tasks! 
  In the second part, you answered ${endCorrects} ouf of 25 questions correctly, earning you a bonus of $${endBonus.toFixed(2)}. As a reminder, in the first part, you answered ${corrs} out of 25 correctly. Overall, you answered ${corrs + endCorrects} out of 50 correctly, earning you a total bonus of $${((corrs + endCorrects) * 0.04).toFixed(2)}. </p> 
  <p>Before you go, please answer a few more questions about your experience.</p>
  <p>What is your age?</p>
    <input type="radio" name="age" value="18-24"> 18-24
    <input type="radio" name="age" value="25-34"> 25-34
    <input type="radio" name="age" value="35-44"> 35-44
    <input type="radio" name="age" value="45-54"> 45-54
    <input type="radio" name="age" value="55-64"> 55-64
    <input type="radio" name="age" value="65+"> 65+
    <input type="radio" name="age" value="I don't wish to answer"> I don't wish to answer

    <p>What is the highest level of education you received?</p>
    <input type="radio" name="education" value="High School or less"> High School or less
    <input type="radio" name="education" value="Some College"> Some College
    <input type="radio" name="education" value="Bachelor's Degree"> Bachelor's Degree
    <input type="radio" name="education" value="Master's Degree"> Master's Degree
    <input type="radio" name="education" value="Doctorate or higher"> Doctorate or higher
    <input type="radio" name="education" value="I don't wish to answer"> I don't wish to answer

    <p>3. What is your gender?</p>
    <input type="radio" name="gender" value="Male"> Male
    <input type="radio" name="gender" value="Female"> Female
    <input type="radio" name="gender" value="Non-Binary"> Non-Binary
    <input type="radio" name="gender" value="Not Listed"> Not Listed <input type="text" name="Not Listed" />
    <input type="radio" name="gender" value="I don't wish to answer"> I don't wish to answer

    <p>What is your race?</p>
    <input type="radio" name="race" value="American Indian or Alaska Native"> American Indian or Alaska Native
    <input type="radio" name="race" value="Asian"> Asian
    <input type="radio" name="race" value="Black or African American"> Black or African American
    <input type="radio" name="race" value="Native Hawaiian or Other Pacific Islander"> Native Hawaiian or Other Pacific Islander
    <input type="radio" name="race" value="White"> White
    <input type="radio" name="race" value="Other"> Other
    <input type="radio" name="race" value="I don't wish to answer"> I don't wish to answer

    <p>How would you rate your familiarity with staistical concepts such as regression and correlation?</p>
    <input type="radio" name="stats" value="Very Unfamiliar"> Very Unfamiliar&emsp;&emsp;&emsp;
    <input type="radio" name="stats" value="Somewhat Familiar"> Somewhat Familiar&emsp;&emsp;&emsp;
    <input type="radio" name="stats" value="Familiar"> Familiar&emsp;&emsp;&emsp;
    <input type="radio" name="stats" value="Very Familiar"> Very Familiar &emsp;&emsp;&emsp;
    <input type="radio" name="stats" value="I don't wish to answer"> I don't wish to answer&emsp;&emsp;&emsp;

    <p>How frequently do you fly on commercial airline flights? (A round trip would count as two flights)</p>
    <input type="radio" name="flights" value="Never"> Never &emsp;&emsp;&emsp;
    <input type="radio" name="flights" value="Once a year"> Once a year &emsp;&emsp;&emsp;
    <input type="radio" name="flights" value="1-5 times a year"> 1-5 times a year &emsp;&emsp;&emsp;
    <input type="radio" name="flights" value="6-10 times a year"> 6-10 times a year &emsp;&emsp;&emsp;
    <input type="radio" name="flights" value="More than 10 times a year"> More than 10 times a year &emsp;&emsp;&emsp;
    <input type="radio" name="flights" value="I don't wish to answer"> I don't wish to answer
    
    <p>If there was a difference in your decision accuracy between the first 25 and last 25 tasks, what do you feel led to that difference?</p>
    <textarea name="difference" rows="4" cols="50"></textarea></p>` 

  if ([2,3,5,6].includes(condition)) {
    document.getElementById("postSurveyPage").innerHTML += `<p>We introduced the concepts of the passenger's expectations, in-flight experience, and delays. Did you find these concepts intuituitive and relevant to the task of predicting passenger satisfaction?</p>
    <textarea name="conceptsIntuitive" rows="4" cols="50"></textarea>`

    document.getElementById("postSurveyPage").innerHTML += `<p>Did you find thinking about the problem in terms of concepts helpful? Why or why not?</p>
    <textarea name="conceptsHelpful" rows="4" cols="50"></textarea>`

  }

  if (condition != 0) {
    document.getElementById("postSurveyPage").innerHTML += `<p>The following questions relate to the improvement plan you received after you completed the first part of the experiment. To view that plan again, click the button below.</p>
    <button onclick="showImprovementPlanResult()">Show Improvement Plan</button>`


    document.getElementById("postSurveyPage").innerHTML += `<p>How did you interpret the improvement plan?</p>
    <textarea name="interpretation" rows="4" cols="50"></textarea>

    <p>To what extent do you feel the bar chart of the improvement plan (without guidance of the arrows) captures important aspects of your decision making behavior over the first 25 tasks?</p>
    <textarea name="captures" rows="4" cols="50"></textarea>

    

    <p>Did you try using the improvement plan to improve your decisions? If so, how? If not, why?</p>
    <textarea name="improvement" rows="4" cols="50"></textarea>`
  }

  document.getElementById("postSurveyPage").innerHTML += `<p>How would you describe your experience with this survey in general?</p>
    <textarea name="general" rows="4" cols="50"></textarea>`


  document.getElementById("postSurveyPage").innerHTML += `<p>Thanks for participating! Please click the button below to submit your responses and receive your payment.</p>
  <button onclick="finishSurvey()">Submit</button>` }
}

// Show the next page and hide the result page
function startTrainingTasks() {
  const trainingTaskStartTime = Date.now();
  document.getElementById("trainingTaskInstructionsPagePassed").style.display = "none";
  document.getElementById("taskPages").style.display = "block";
  showTask(taskNum);
  saveProgress("taskPages");
}

function showLastTrainingTask() {
  document.getElementById("finishTrainingPage").style.display = "none";
  document.getElementById("taskPages").style.display = "block";
  taskNum = totalTrainingTasks;
  showTask(taskNum);
  saveProgress("taskPages");
}

function startEvalTasks() {
  const evalTaskStartTime = Date.now();
  evalStarted = true;
  document.getElementById("evalTaskInstructionsPage").style.display = "none";
  document.getElementById("improvementPlanResultPage").style.display = "none";

  document.getElementById("taskPages").style.display = "block";
  if (taskNum == totalTrainingTasks) {
    taskNum = 1 + totalEvalTasks;
  }
  showTask(taskNum);
  saveProgress("taskPages");
}

function showLastEvalTask() {
  document.getElementById("finishEvalPage").style.display = "none";
  document.getElementById("taskPages").style.display = "block";
  var taskNum = totalTrainingTasks + totalEvalTasks;
  showTask(taskNum);
}





function checkTaskAnswers() {
  var taskResponses = {};
  var taskQuestions = document.querySelectorAll('.task input[type="radio"]');

  var q1_ans = document.querySelector('input[name="q1"]:checked');
  //var q2_ans = document.querySelector('input[name="q2"]:checked');
  //var q3_ans = document.querySelector('input[name="q3"]:checked');
  var q4_ans = document.querySelector('input[name="q4"]:checked');
  var q5_ans = document.querySelector('input[name="q5"]:checked');
  var q6_ans = document.querySelector('input[name="q6"]:checked');
  if (taskNum == 4) {
    var attn1answer = document.querySelector('input[name="attn1"]:checked'); }
    if (taskNum == 2) {
    var attn2answer = document.querySelector('input[name="attn2"]:checked');}
  

  if (taskNum == 4 & attn1answer == null) {
      return false; }
  if (taskNum == 2 & attn2answer == null) {
      return false; }

  if ([2,3,5,6].includes(condition)) {
    return ((q1_ans && q4_ans && q5_ans && q6_ans) != null)
  } else {
    return (q6_ans != null)
  }

  

  
}

function showNextTask(taskType) {
  
  if (taskType == 'training') {

    trainingTaskResponses[taskNum] = storeTaskResponses();
  }
  else {
    evalTaskResponses[taskNum] = storeTaskResponses();
  }

  if (checkTaskAnswers()) {
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
        times['evalTasks'] = Date.now() - evalTaskStartTime;
        document.getElementById("finishEvalPage").style.display = "block";
      }
    }


  }
  else {
    alert("Please answer all questions.");
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

  const profileInfo =  `<h1>Airline Passenger Profile ${displayTask}/${totalTasks}</h1>
  <div class="container">
    <!-- Section 1: Passenger's basic flight information -->
    <div class="section1">
      <h2>Passenger Ticket Information</h2>
      <p>Age: <span id="age"></span></p>
      <p>Gender: <span id="gender"></span></p>
      <p>Class: <span id="class"></span></p>
      <p>Type of Travel: <span id="typeOfTravel"></span></p>
      <p>Customer Type: <span id="customerType"></span></p>
    </div>

    <!-- Section 2: Information related to the completed flight -->
    <div class="section2">
      <h2>Completed Flight Details</h2>
      <p>Flight Distance: <span id="flightDistance"></span> km</p>
      <p>Departure Delay (Minutes): <span id="departureDelay"></span></p>
      <p>Arrival Delay (Minutes): <span id="arrivalDelay"></span></p>
    </div>

    <!-- Section 3: Passenger's flight satisfaction survey responses -->
    <div class="section3">
      <h2>Flight Satisfaction Survey Responses</h2>
      <p>Inflight Wi-Fi Service: <span id="inflightWifi"></span></p>
      <p>On-Board Service: <span id="onBoardService"></span></p>
      <p>Check-In Service: <span id="checkInService"></span></p>
      <p>Baggage Handling: <span id="baggageHandling"></span></p>
      <p>Gate Location: <span id="gateLocation"></span></p>
      <p>Food and Drink: <span id="foodAndDrink"></span></p>
      <p>Seat Comfort: <span id="seatComfort"></span></p>
      <p>Inflight Entertainment: <span id="inflightEntertainment"></span></p>
      <p>Ease of Online Booking: <span id="onlineBooking"></span></p>
      <p>Cleanliness: <span id="cleanliness"></span></p>
      <p>Departure/Arrival Time Convenient: <span id="departureArrivalTime"></span></p>
    </div>
  </div>`;

  

  if ([2,3].includes(condition)) {
  task_concept_text = `<div class="question">
  <p>Did this passenger have high expectations prior to their flight?</p>
  <div class="choices">
  <label><input type="radio" name="q1" value="1"> 1 (Low)&emsp;&emsp;&ensp;&ensp;&ensp;&nbsp;&ensp;&ensp; </label>
  <label><input type="radio" name="q1" value="2"> 2&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label><input type="radio" name="q1" value="3"> 3&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label><input type="radio" name="q1" value="4"> 4&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label><input type="radio" name="q1" value="5"> 5 (High)</label>
  </div>
</div>
<div class="question">
  <p>Was this passenger satisfied with their in-flight experience?</p>
  <div class="choices">
  <label> <input type="radio" name="q4" value="1"> 1 (Not Satisfied)&ensp;&ensp;</label>
  <label> <input type="radio" name="q4" value="2"> 2&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="q4" value="3"> 3&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="q4" value="4"> 4&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="q4" value="5"> 5 (Very Satisfied)</label>
  </div>
</div>
<div class="question">
  <p>Did this passenger experience delays?</p>
  <div class="choices">
  <label> <input type="radio" name="q5" value="1"> 1 (No Delays)&emsp;&ensp;&ensp;</label>   
  <label><input type="radio" name="q5" value="2"> 2&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label><input type="radio" name="q5" value="3"> 3&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label><input type="radio" name="q5" value="4"> 4&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label><input type="radio" name="q5" value="5"> 5 (Significant Delays)</label>
  </div>
</div> ` 

if (currentTask != 4 & currentTask != 2) {task_concept_text += `<p><b>Please consider your concept ratings above when answering the following question.</b></p>`}}
  else { task_concept_text = `` }

  if (currentTask == 4) {
  attention_check1 = `<div class="question">
  <p>Select value "2" below.</p>
  <div class="choices">
  <label> <input type="radio" name="attn1" value="1"> 1 (Not Satisfied)&ensp;&ensp;</label>
  <label> <input type="radio" name="attn1" value="2"> 2&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="attn1" value="3"> 3&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="attn1" value="4"> 4&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="attn1" value="5"> 5 (Very Satisfied)</label>
  </div>
  <p><b>Please consider your concept ratings above when answering the following question.</b></p>` }
  else {attention_check1 = ``}

  if (currentTask == 2) {

  
  attention_check2 = `<div class="question">
  <p>Select value "4" below.</p>
  <div class="choices">
  <label> <input type="radio" name="attn2" value="1"> 1 (Not Satisfied)&ensp;&ensp;</label>
  <label> <input type="radio" name="attn2" value="2"> 2&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="attn2" value="3"> 3&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="attn2" value="4"> 4&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="attn2" value="5"> 5 (Very Satisfied)</label>
  </div>
  <p><b>Please consider your concept ratings above when answering the following question.</b></p>`}
  else {
    attention_check2 = ``}
  
  if (condition != 0 && taskType == "eval") {
    improvementPlanButton = `<button onclick="showImprovementPlanResult()">Show Improvement Plan</button>`
  }
  else {
    improvementPlanButton = ``
  }
  
  document.getElementById("taskPages").innerHTML = profileInfo + `
    <div class="task">` + task_concept_text + attention_check1 + attention_check2 + `
    
    <div class="question">
      <p>Was this passenger overall satisfied with the flight?</p>
      <div class="choices">
      <label><input type="radio" name="q6" value="not_satisfied"> Not Satisfied&ensp;&ensp;&ensp;&ensp;&ensp;</label>
      <label><input type="radio" name="q6" value="satisfied"> Satisfied</label>
      </div>
    </div>

    <button onclick="show${instructionType}TaskInstructions()">Show Instructions</button>` + improvementPlanButton + `
    <button onclick="showPreviousTask('${taskType}')">Previous Task</button>
      <button onclick="showNextTask('${taskType}')">Next Task</button>
    </div>
  `;
  populateDataFromJSON(currentTask);
  
  // Check if there are stored responses for the current task
  if (trainingTaskResponses[currentTask] != undefined) {
    populateTaskForm(trainingTaskResponses[currentTask]);
  }
  else {
    if (evalTaskResponses[currentTask] != undefined) {
    populateTaskForm(evalTaskResponses[currentTask]); }
  }
  saveProgress('taskPages');
} 

function getClass(taskData) {
  if (taskData["Class_Eco Plus"]) {
    return 'Economy Plus';
  } else if (taskData["Class_Business"]) {
    return 'Business';
  } else {
    return 'Economy';
  }
}

function populateDataFromJSON(currentTask) {
  var taskData = taskDataJSON.find(task => task.Task === currentTask);
  if (!taskData) {
    console.error(`Task data not found for Task ${currentTask}`);
    return;
  }

  document.getElementById('age').innerText = taskData.Age;
  document.getElementById('gender').innerText = taskData.Gender_Male === 1 ? 'Male' : 'Female';
  document.getElementById('class').innerText = getClass(taskData);
  document.getElementById('typeOfTravel').innerText = taskData["Type of Travel_Business travel"] === 1 ? 'Business travel' : 'Personal travel';
  document.getElementById('customerType').innerText = taskData["Customer Type_Loyal Customer"] === 1 ? 'Loyal Customer' : 'Non-Loyal Customer';
  document.getElementById('flightDistance').innerText = taskData['Flight Distance'];
  document.getElementById('departureDelay').innerText = taskData['Departure Delay in Minutes'];
  document.getElementById('arrivalDelay').innerText = taskData['Arrival Delay in Minutes'];
  document.getElementById('inflightWifi').innerText = taskData['Inflight wifi service'];
  document.getElementById('onBoardService').innerText = taskData['On-board service'];
  document.getElementById('checkInService').innerText = taskData['Checkin service'];
  document.getElementById('baggageHandling').innerText = taskData['Baggage handling'];
  document.getElementById('gateLocation').innerText = taskData['Gate location'];
  document.getElementById('foodAndDrink').innerText = taskData['Food and drink'];
  document.getElementById('seatComfort').innerText = taskData['Seat comfort'];
  document.getElementById('inflightEntertainment').innerText = taskData['Inflight entertainment'];
  document.getElementById('onlineBooking').innerText = taskData['Ease of Online booking'];
  document.getElementById('cleanliness').innerText = taskData['Cleanliness'];
  document.getElementById('departureArrivalTime').innerText = taskData['Departure/Arrival time convenient'];

  
}



// Show the previous task and hide the current task
function showPreviousTask(taskType) {
  
  if (taskType == 'training') {

    trainingTaskResponses[taskNum] = storeTaskResponses(); }
  else {
    evalTaskResponses[taskNum] = storeTaskResponses();}
  
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
      showTrainingTaskInstructions();
    }
    else {
      showEvalTaskInstructions();
    }
    
  }
  saveProgress('taskPages');
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
function storeTaskResponses() {
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

function checkForAttention() {

  var questions = document.querySelectorAll('.commitQuestion input[type="radio"]');
  var anyChecked = false;
  questions.forEach(function (question) {
  
    if (question.checked) {
      anyChecked = true;

  if (question.name == 'commitQ' && question.value != "Yes") {
    showAttentionFailPage();
    return true;
  } else {
    showTrainingTaskInstructions();
    return true;
  }
} 
});
if (anyChecked == false) {
alert("Please answer all questions.")} }

function showAttentionFailPage() {
  urlParams['commitFail'] = true;
  participantPush(unique_id, condition);
  document.getElementById("commitPage").style.display = "none";
  document.getElementById("attentionFailPage").style.display = "block";
  saveProgress("attentionFailPage");
}

// Add event listener to the form submission
function finishSurvey() {
      times['experimentTime'] = Date.now() - experimentStartTime;
      urlParams['completed'] = true;
      participantPush(unique_id, condition);
      // Get the user's responses for all input fields and store them in postSurveyResponses
      postSurveyResponses.age = getRadioValue('age');
      postSurveyResponses.education = getRadioValue('education');
      postSurveyResponses.gender = getRadioValue('gender');
      postSurveyResponses.stats= getRadioValue('stats');
      postSurveyResponses.race = getRadioValue('race');
      postSurveyResponses.flights = getRadioValue('flights');
      postSurveyResponses.difference = getTextareaValue('difference');
      postSurveyResponses.general = getTextareaValue('general');
      if (condition != 0) {
        postSurveyResponses.interpretation = getTextareaValue('interpretation');
        postSurveyResponses.captures = getTextareaValue('captures');
        postSurveyResponses.improvement = getTextareaValue('improvement');
      }
      
      if ([2,3,5,6].includes(condition)) {
        postSurveyResponses.conceptsIntuitive = getTextareaValue('conceptsIntuitive');
        postSurveyResponses.conceptsHelpful = getTextareaValue('conceptsHelpful');}

      // You can now use the postSurveyResponses object to send the data to the server or process it as needed
      console.log(postSurveyResponses);
      postSurveyPush(unique_id, condition);
      timesPush(unique_id, condition);

      // Hide the survey and show the thank you page
      document.getElementById('postSurveyPage').style.display = 'none';
      window.location.replace("https://connect.cloudresearch.com/participant/project/acb3e3f16b4a439d9bbf999688fc3515/complete");

    };

    // Function to get the value of the selected radio button
    function getRadioValue(name) {
      const radioButtons = document.getElementsByName(name);
      for (const radioButton of radioButtons) {
        if (radioButton.checked) {
          return radioButton.value;
        }
      }
      return "I don't wish to answer";
    }

    // Function to get the value of the textarea
    function getTextareaValue(name) {
      return document.getElementsByName(name)[0].value;
    }



