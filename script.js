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

function midpointPush_questions(id, condition) {
  //delete trainingTaskResponses[4]['attn1'];
  //delete trainingTaskResponses[2]['attn2'];
  fetch(apiEndpoint + `midpoint_push/${id}/${condition}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },


    body: JSON.stringify(selectedTasks)
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

function removeButtons(curr_page) {
  var inner = document.getElementById(curr_page)
  var buttons = inner.getElementsByTagName('button');
  if (buttons) {
    length = buttons.length
    for (var i = 0; i < length; i++) {
      buttons[0].remove();
    }
  }
}


function midpointPullImage(id, condition) {
  const improvementPlanResultPage = document.getElementById('improvementPlanResultPage');
  if (timesTriedToPullImage == 0) {
    firstPullImageTime = Date.now()
  }

  pullTimeDiff = Date.now() - firstPullImageTime
  timesTriedToPullImage += 1;

  if (pullTimeDiff < 120000) {
    pullImageErrMessage = 'Your reflective image has not yet loaded, it may take up to 2 minutes. Please wait up to 2 minutes and refresh the page if the image has not yet loaded.'
  }

  else {
    pullImageErrMessage = 'Something may have gone wrong loading your image. Please proceed to the next page and continue with the rest of the experiment to continue claiming your bonus for correctly answering questions.'
  }

  const url = apiEndpoint + `pull_improvement_plan_image/${id}/${condition}`;

  fetch(url, { method: 'GET' })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }

    // Check the content type of the response
    const contentType = response.headers.get('content-type');
    if (!contentType.startsWith('image')) {
      throw new Error('Image not found on the server.');
    }

    return response.blob();
  })
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

      

      if (atPostSurvey) {
        removeButtons('improvementPlanResultPage');
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
      
      if (image_not_appended) {
        var inner = document.getElementById('improvementPlanResultPage')
        var buttons = inner.getElementsByTagName('button');
        
        improvementPlanResultPage.insertBefore(pElement, improvementPlanResultPage.childNodes[improvementPlanResultPage.childNodes.length-buttons.length]);
        image_not_appended = false;

       
      }
      
    })
    .catch(error => {
      console.error('Error: Image not found, please wait a few seconds and refresh the page.');
      document.getElementById("improvementPlanResultPage").innerHTML += `<p>${pullImageErrMessage}</p>`
      if (atPostSurvey) {
        removeButtons('improvementPlanResultPage');
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
    }); 
}

  async function midpointPullReflectionText(id, condition) {
  

  const url = apiEndpoint + `pull_improvement_plan_reflection_text/${id}/${condition}`;
  try {
  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    // Check if the response indicates an error
    console.error(`Error: ${response.status} - ${response.statusText}`);
    return;
  }

  const data = await response.json();

  // Proceed with processing the response data
  for (const [key, value] of Object.entries(data)) {
    if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf(data) == -1) {
      document.getElementById("improvementPlanResultPage").innerHTML += `<p>${data}</p>`;
    }
  }
} catch (error) {
  console.error('Error fetching or processing data:', error);
}
}

async function midpointPullAdviceText(id, condition) {
  

  const url = apiEndpoint + `pull_improvement_plan_advice_text/${id}/${condition}`;
  try {
  const response = await fetch(url, { method: 'GET' });

  if (!response.ok) {
    // Check if the response indicates an error
    console.error(`Error: ${response.status} - ${response.statusText}`);
    return;
  }

  const data = await response.json();
  console.log(data)
  // Proceed with processing the response data
  for (const [key, value] of Object.entries(data)) {
    if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf(data) == -1) {
      document.getElementById("improvementPlanResultPage").innerHTML += `<p>${data}</p>`;
    }
  }

        
      
} catch (error) {
  console.error('Error fetching or processing data:', error);
}
}
    /*
    .then(response => response.json())
    .then(data => {
      try {
      textDataJSON = data;
        //loop through elements of textDataJSON dictionary
    
    for (const [key, value] of Object.entries(textDataJSON)) { 
      //append each element to page as a paragraph
      if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf(value) == -1) {
        document.getElementById("improvementPlanResultPage").innerHTML += `<p>${value}</p>` }
    } }

    catch (error) {
      console.log(error)}
    }
    )
    .catch(error => {
      console.error('Error:', error);
    }
    );

} */


function pullTasks(id, condition) {
  
  const url = apiEndpoint + `pull_tasks/${id}/${condition}`;
  //fetch json file from s3 bucket
  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      taskDataJSON = data;
      var totalItems = Object.keys(taskDataJSON).length;
      var numItems = 50;
      
      
      //while (indices.length < numItems) {
      //  const randomIndex = Math.floor(Math.random() * totalItems);
      //  if (!indices.includes(randomIndex)) {
      //    indices.push(randomIndex);
      //  }
      //}
      
      var i = 0;
      indices.forEach(index => {
        selectedTasks[i] = taskDataJSON[index];
        i++;
      });
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
      var i = 0;
      indices.forEach(index => {
        respDataJSON[i] = data[index];
        i++;
      });

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
var timesTriedToPullImage = 0;
var selectedTasks = {};
var trainingTaskResponses = {};
var indices = [209, 158, 51, 208, 219, 266, 22, 76, 215, 79, 99, 68, 126, 221, 146, 129, 125, 173, 83, 216, 234, 34, 13, 114, 108, 9, 205, 29, 181, 10, 206, 186, 94, 230, 81, 244, 294, 19, 56, 95, 272, 242, 70, 45, 263, 256, 281, 193, 161, 214];
var taskDataJSON = {};
var respDataJSON = {};
var temp_respDataJSON = {};
var evalTaskResponses = {}
var surveyResponses = {}
var postSurveyResponses = {}
var current_element = "titlePage";
var coming_from = "titlePage";
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
var assignment_id = urlParams.get('assignmentId');
var project_id = urlParams.get('projectId');
var firstPullImageTime = Date.now();
var pullImageErrMessage = "";

urlParams['type'] = 'pilot3'
urlParams['completed'] = false
urlParams['bonus'] = 0
urlParams['commitFail'] = false
urlParams['participantID'] = unique_id
urlParams['assignmentId'] = assignment_id
urlParams['projectId'] = project_id




function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

var participantPassedQuiz = false;
// Show the next task and hide the previous task
var totalTrainingTasks = 25;
var totalEvalTasks = 25;
var taskNum = 1;
var conditions = [2, 4, 6]
var condition = 4 //conditions[Math.floor(Math.random() * conditions.length)];
var array = [1,2]
var task1indices = [9, 240, 29, 181, 149, 206, 186, 94, 230, 81, 244, 294, 19, 56, 91, 272, 242, 42, 168, 263, 256, 281, 193, 161, 214]
var task2indices = [209, 158, 51, 208, 219, 266, 210, 76, 215, 79, 278, 4, 126, 221, 146, 54, 125, 173, 83, 216, 234, 128, 13, 114, 108]
shuffle(task1indices)
shuffle(task2indices)
var sub_condition = array[Math.floor(Math.random() * array.length)];
if (sub_condition == 1) {
  var indices = task1indices.concat(task2indices);
}
else {
  var indices = task2indices.concat(task1indices);
}
var atPostSurvey = false;
var conceptValues = {};
var pullTimeDiff = 0;
urlParams['condition'] = condition

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
    temp_respDataJSON: temp_respDataJSON,
    atPostSurvey: atPostSurvey,
    evalStarted: evalStarted,
    times: times,
    experimentStartTime: experimentStartTime,
    trainingTaskStartTime: trainingTaskStartTime,
    evalTaskStartTime: evalTaskStartTime,
    timesFailedQuiz: timesFailedQuiz,
    textDataJSON: textDataJSON,
    urlParams: urlParams,
    coming_from: coming_from, 
    selectedTasks: selectedTasks,
    indices: indices, 
    timesTriedToPullImage: timesTriedToPullImage,
    pullTimeDiff: pullTimeDiff,
    firstPullImageTime: firstPullImageTime,
    pullImageErrMessage: pullImageErrMessage,
    postSurveyResponses: postSurveyResponses
  };

  localStorage.setItem("participantProgress", JSON.stringify(progressData));
  current_element = currentPage;
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
    coming_from = progressData.coming_from;
    selectedTasks = progressData.selectedTasks;
    indices = progressData.indices;
    temp_respDataJSON = progressData.temp_respDataJSON;
    timesTriedToPullImage = progressData.timesTriedToPullImage;
    pullTimeDiff = progressData.pullTimeDiff;
    firstPullImageTime = progressData.firstPullImageTime;
    pullImageErrMessage = progressData.pullImageErrMessage;
    postSurveyResponses = progressData.postSurveyResponses;

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
      showQuestionPage(); 
    } else if (current_element == "improvementPlanTutorialPage") {
      showImprovementPlanTutorial();
    } else if (current_element == "improvementPlanResultPage") {
      showImprovementPlanResult();
    } else if (current_element == "consentPage") {
      showConsentPage();
    } else if (current_element == "trainingTaskInstructionsPageFirst") {
      showTrainingTaskInstructions();
    } else if (current_element == "trainingTaskInstructionsPagePassed") {
      showTrainingTaskInstructions();
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
    } else if (current_element == "evalTaskInstructionsPage") {
      showEvalTaskInstructions();
    } 

    

    // You need to adjust the logic to handle other elements and progress continuation based on the loaded data.
    // Make sure to set the appropriate styles and displays for the elements based on the 'current_element' and 'taskNum'.
  }
}



// Show the instruction page initially
document.getElementById("titlePage").style.display = "block";


// Call the loadProgress function on page load to resume the participant's progress
document.addEventListener("DOMContentLoaded", loadProgress);








pullTasks(unique_id, condition);

// Show the questionnaire page and hide the instruction page
function showQuestionPage() {
  document.getElementById("trainingTaskInstructionsPageFirst").style.display = "none";
  document.getElementById("conceptTrainingInstructionsPage").style.display = "none";
  document.getElementById("questionPage").style.display = "block";
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
  urlParams['part1correct'] = corrs
  bonus = corrs * 0.05;
  urlParams['bonus'] = bonus
  participantPush(unique_id, condition)
  document.getElementById("finishTrainingPage").style.display = "none";
  document.getElementById("improvementPlanResultPage").style.display = "none";
  document.getElementById("improvementPlanTutorialPage").style.display = "block";
  saveProgress("improvementPlanTutorialPage");
  if (document.getElementById("improvementPlanTutorialPage").innerHTML.indexOf("Thank you for completing the first 25 tasks!") == -1) {
  document.getElementById("improvementPlanTutorialPage").innerHTML += ` <p>Thank you for completing the first 25 tasks!</p>
  <p> You correctly answered ${corrs} out of 25 questions, earning you a bonus of ${bonus.toFixed(2)}$. Before answering the next set of 25 questions, we ask that you take a moment to reflect on your decision-making patterns from the first part of the experiment. To help you reflect, we ask that you type your responses to several reflection questions as though you are 'thinking aloud.'</p>
  
  <p>Please describe how you made predictions on the first 25 tasks. Which information (features or concepts) about the passenger and their flight did you find to be most influential in your decision-making and how did you use these features/concepts? Is there any information you tended to ignore?</p>
  <textarea name="reflection1" rows="6" cols="50"></textarea></p> 

  <p>Do you think you can do anything differently to improve your decisions for the next set of 25 tasks? Why or why not? If so, what would you try and change about your decision-making process to improve your predictions (if anything)? </p>
  <textarea name="reflection2" rows="6" cols="50"></textarea></p> 
  `;
  if (condition == 0) {
    document.getElementById("improvementPlanTutorialPage").innerHTML += ` <button onclick="showEvalTaskInstructions()">Next</button>`
  } else {
    document.getElementById("improvementPlanTutorialPage").innerHTML += `<button onclick="showImprovementPlanResult()">Next</button>`
  } }
}

 async function showImprovementPlanResult() {
  
  if (current_element == "improvementPlanTutorialPage") {
      postSurveyResponses.reflection1 = getTextareaValue('reflection1');
      postSurveyResponses.reflection2 = getTextareaValue('reflection2');
  }




  saveProgress("improvementPlanResultPage");

  document.getElementById("improvementPlanTutorialPage").style.display = "none";
  document.getElementById("postSurveyPage").style.display = "none";
  document.getElementById("taskPages").style.display = "none";
  document.getElementById("improvementPlanResultPage").style.display = "block";


  
  if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf("We have analyzed your predictions for the first 25 tasks and have generated a description of your decision-making process (based only on your predictions). Please take a moment to review the description of your decision-making process and answer the questions that follow.") == -1) {
  document.getElementById("improvementPlanResultPage").innerHTML += ``}
  await midpointPullReflectionText(unique_id, condition);

  if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf("Do you believe our description of your decision-making process accurately describes what you found most important when making predictions?") == -1) {
  document.getElementById("improvementPlanResultPage").innerHTML += `<p>Do you believe our description of your decision-making process accurately describes what you found most important when making predictions? Please describe your reasoning. What about the description was accurate and why? What about the description was inaccurate and why? 
</p>
  <textarea name="reflection3" rows="6" cols="50"></textarea></p>`}

  if ([3,4,5,6].includes(condition)) {
  if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf("Given our own understanding of the task and our understanding of your decision-making process, we are also providing you with a piece of advice that can help you improve your decision-making in the future. Please review the advice and respond to the question that follows.") == -1) {
      document.getElementById("improvementPlanResultPage").innerHTML += ``}
    await midpointPullAdviceText(unique_id, condition);
    
  }

  if (document.getElementById("improvementPlanResultPage").innerHTML.indexOf("After spending some more time reflecting on your decision-making process and reading our analysis, do you plan to make any additional changes to your decision-making process for the next 25 tasks? If so, how do you plan to make predictions differently? If not, why not?") == -1) {
    document.getElementById("improvementPlanResultPage").innerHTML += `<p>After spending some more time reflecting on your decision-making process and reading our analysis, do you plan to make any additional changes to your decision-making process for the next 25 tasks? If so, how do you plan to make predictions differently? If not, why not?
</p>
    <textarea name="reflection4" rows="6" cols="50"></textarea></p>`}



  

 

         
  
  
  if (atPostSurvey) {
        removeButtons('improvementPlanResultPage');
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
        document.getElementById("improvementPlanResultPage").innerHTML += `<button onclick="showEvalTaskInstructions()">Next</button>` }}}






  

  saveProgress("improvementPlanResultPage");


  
}
const concept_introduction = `<p><b>Key Concepts:</b></p><p>We provide you with a set of key concepts to help you synthesize information presented for each task: passenger status, in-flight experience, delays, and reason for travel. By concepts, we mean higher-level ideas that consist of one or more pieces of information grouped together. These concept values will be calculated and presented to you for each task. Concepts are not values that were directly provided by the passenger. When solving this task, think about how the concept ratings can be used to predict the airline passenger's overall flight satisfaction. The concepts provided have been shown to play an important role in passenger satisfaction according to research. </p>
`

  function showEvalTaskInstructions() {

  if (current_element == "improvementPlanTutorialPage") {

      
    postSurveyResponses.reflection1 = getTextareaValue('reflection1');
    postSurveyResponses.reflection2 = getTextareaValue('reflection2');
  } 

  if (current_element == "improvementPlanResultPage") {
    
      postSurveyResponses.reflection3 = getTextareaValue('reflection3');
      postSurveyResponses.reflection4 = getTextareaValue('reflection4');
      }
      

    
  
  



  document.getElementById("improvementPlanResultPage").style.display = "none";
  document.getElementById("improvementPlanTutorialPage").style.display = "none";
  document.getElementById("evalTaskInstructionsPage").style.display = "block";
  document.getElementById("taskPages").style.display = "none";
  document.getElementById("conceptTrainingInstructionsPage").style.display = "none";
  coming_from = 'evalTaskInstructionsPage';
  //removeButtons('conceptTrainingInstructionsPage');
  removeButtons('evalTaskInstructionsPage');
  
  if (document.getElementById("evalTaskInstructionsPage").innerHTML.indexOf(concept_introduction) == -1) {
    document.getElementById("evalTaskInstructionsPage").innerHTML += concept_introduction}

  if (document.getElementById("evalTaskInstructionsPage").innerHTML.indexOf(`<button onclick="startEvalTasks()">Continue</button>`) == -1) {
  document.getElementById("evalTaskInstructionsPage").innerHTML += `<button onclick="startEvalTasks()">Continue</button>`; } 

  saveProgress("evalTaskInstructionsPage");}



function showConceptInstructions() {
  document.getElementById("evalTaskInstructionsPage").style.display = "none";
  document.getElementById("trainingTaskInstructionsPagePassed").style.display = "none";
  document.getElementById("trainingTaskInstructionsPageFirst").style.display = "none";
  document.getElementById("taskPages").style.display = "none";
  document.getElementById("conceptTrainingInstructionsPage").style.display = "block";
  if (document.getElementById("conceptTrainingInstructionsPage").innerHTML.indexOf(concept_introduction) == -1) {
    document.getElementById("conceptTrainingInstructionsPage").innerHTML += concept_introduction
  }

  if (coming_from == 'evalTaskInstructionsPage') {
    removeButtons('conceptTrainingInstructionsPage');
    if (document.getElementById("conceptTrainingInstructionsPage").innerHTML.indexOf(`<p><strong>Click start below whenever you are ready to start making predictions!</strong></p>`) == -1) {
      document.getElementById("conceptTrainingInstructionsPage").innerHTML += `<p><strong>Click start below whenever you are ready to start making predictions!</strong></p>`;}
    if (document.getElementById("conceptTrainingInstructionsPage").innerHTML.indexOf(`<button onclick="startEvalTasks()">Start!</button>`) == -1) {
      document.getElementById("conceptTrainingInstructionsPage").innerHTML += `<button onclick="showEvalTaskInstructions()">Back</button>`
      document.getElementById("conceptTrainingInstructionsPage").innerHTML += `<button onclick="startEvalTasks()">Start!</button>`; }
  }

  if (coming_from == 'trainingTaskInstructionsPagePassed') {
    removeButtons('conceptTrainingInstructionsPage');
    if (document.getElementById("conceptTrainingInstructionsPage").innerHTML.indexOf(`<p><strong>Click start below whenever you are ready to start making predictions!</strong></p>`) == -1) {
      document.getElementById("conceptTrainingInstructionsPage").innerHTML += `<p><strong>Click start below whenever you are ready to start making predictions!</strong></p>`;}
      if (document.getElementById("conceptTrainingInstructionsPage").innerHTML.indexOf(`<button onclick="showTrainingTaskInstructions()">Back</button><button onclick="startTrainingTasks()">Start!</button>`) == -1) {
        document.getElementById("conceptTrainingInstructionsPage").innerHTML += `<button onclick="showTrainingTaskInstructions()">Back</button><button onclick="startTrainingTasks()">Start!</button>`;}
    }
  

  if (coming_from == 'trainingTaskInstructionsPageFirst') {
    removeButtons('conceptTrainingInstructionsPage');
    if (document.getElementById("conceptTrainingInstructionsPage").innerHTML.indexOf(`<button onclick="showTrainingTaskInstructions()">Back</button>`) == -1) {
      document.getElementById("conceptTrainingInstructionsPage").innerHTML += `<button onclick="showTrainingTaskInstructions()">Back</button>
    <button onclick="showQuestionPage()">Continue</button>`; }}
  


  saveProgress("conceptTrainingInstructionsPage");


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

    if (answer3.value === "option1") {
      correctAnswers++;
    }

    if (answer4.value === "option2" ) {
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
  document.getElementById("conceptTrainingInstructionsPage").style.display = "none";

  
  


  if (participantPassedQuiz == false) {
    document.getElementById("trainingTaskInstructionsPageFirst").style.display = "block";
    pullResp(unique_id, condition);
    coming_from = "trainingTaskInstructionsPageFirst";

    if (document.getElementById("trainingTaskInstructionsPageFirst").innerHTML.indexOf(concept_introduction) == -1) {
      document.getElementById("trainingTaskInstructionsPageFirst").innerHTML += concept_introduction}
    if (document.getElementById("trainingTaskInstructionsPageFirst").innerHTML.indexOf(`<button onclick="showQuestionPage()">Continue</button>`) == -1) {
        document.getElementById("trainingTaskInstructionsPageFirst").innerHTML += `<button onclick="showQuestionPage()">Continue</button>`;}
    
       
      
    
  }
  else {
    document.getElementById("trainingTaskInstructionsPagePassed").style.display = "block";
    coming_from = "trainingTaskInstructionsPagePassed";

    if (document.getElementById("trainingTaskInstructionsPagePassed").innerHTML.indexOf(concept_introduction) == -1) {
      document.getElementById("trainingTaskInstructionsPagePassed").innerHTML += concept_introduction}
    
    if (document.getElementById("trainingTaskInstructionsPagePassed").innerHTML.indexOf(`<button onclick="startTrainingTasks()">Start!</button>`) == -1) {
        document.getElementById("trainingTaskInstructionsPagePassed").innerHTML += `  <p><strong>Click start below whenever you are ready to start making predictions!</strong></p>`;
        document.getElementById("trainingTaskInstructionsPagePassed").innerHTML += `<button onclick="startTrainingTasks()">Start!</button>`; } }
    
    saveProgress("trainingTaskInstructionsPagePassed");
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
  urlParams['part2correct'] = endCorrects;
  endBonus = endCorrects * 0.05;
  fullBonus = ((corrs + endCorrects) * 0.05).toFixed(2)
  urlParams['bonus'] = fullBonus
  if (document.getElementById("postSurveyPage").innerHTML.indexOf(`Thank you for completing the prediction tasks!`) == -1) {
  document.getElementById("postSurveyPage").innerHTML += `<p>Thank you for completing the prediction tasks! 
  In the second part, you answered ${endCorrects} out of 25 questions correctly, earning you a bonus of $${endBonus.toFixed(2)}. As a reminder, in the first part, you answered ${corrs} out of 25 correctly. Overall, you answered ${corrs + endCorrects} out of 50 correctly, earning you a total bonus of $${((corrs + endCorrects) * 0.05).toFixed(2)}. </p> 
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

    <p>What is your gender?</p>
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

  
    document.getElementById("postSurveyPage").innerHTML += `<p>We introduced the concepts of the passenger's value, in-flight experience, delays, and reason for travel. Did you find these concepts intuituitive and relevant to the task of predicting passenger satisfaction?</p>
    <textarea name="conceptsIntuitive" rows="4" cols="50"></textarea>`

    document.getElementById("postSurveyPage").innerHTML += `<p>Did you find thinking about the problem in terms of concepts helpful? Why or why not?</p>
    <textarea name="conceptsHelpful" rows="4" cols="50"></textarea>`

  

  

    
    

    document.getElementById("postSurveyPage").innerHTML += `<p>During the moment of reflection, were you able to reflect on your predictions from the first part of the study? What impact, if any, did this moment of reflection have on your decision-making?</p>
    <textarea name="improvement" rows="4" cols="50"></textarea>`


    


  document.getElementById("postSurveyPage").innerHTML += `<p>How would you describe your experience with this survey in general?</p>
    <textarea name="general" rows="4" cols="50"></textarea>`


  document.getElementById("postSurveyPage").innerHTML += `<button onclick="finishSurvey()">Submit</button>` }
}

// Show the next page and hide the result page
function startTrainingTasks() {
  const trainingTaskStartTime = Date.now();
  document.getElementById("trainingTaskInstructionsPagePassed").style.display = "none";
  document.getElementById("conceptTrainingInstructionsPage").style.display = "none";
  document.getElementById("taskPages").style.display = "block";
  showTask(taskNum);
  saveProgress("taskPages");
}

function showLastTrainingTask() {
  document.getElementById("finishTrainingPage").style.display = "none";
  document.getElementById("taskPages").style.display = "block";
  document.getElementById("conceptTrainingInstructionsPage").style.display = "none";
  taskNum = totalTrainingTasks;
  showTask(taskNum);
  saveProgress("taskPages");
}

function startEvalTasks() {
  const evalTaskStartTime = Date.now();
  evalStarted = true;
  document.getElementById("evalTaskInstructionsPage").style.display = "none";
  document.getElementById("improvementPlanResultPage").style.display = "none";
  document.getElementById("conceptTrainingInstructionsPage").style.display = "none";

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

  
  return (q6_ans != null)
  

  

  
}

function showNextTask(taskType) {
  
  if (taskType == 'training') {

    trainingTaskResponses[taskNum] = storeTaskResponses(taskNum);
  }
  else {
    evalTaskResponses[taskNum] = storeTaskResponses(taskNum);
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
  <p>You can view the section header, attribute, and key concept definitions below at any time by hovering over their values.</p>
  <div class="container">
    <!-- Section 1: Passenger's basic flight information -->
    <div class="section1">
      <h2><div class="header-tooltip">&#9432Passenger Ticket Information<span class="tooltiptext">Basic information about the passenger's ticket and demographics.</span></div>
      </h2>

      <p><div class="tooltip">&#9432Age: <span class="tooltiptext">The passenger's age.</span><span id="age"></span></div></p>
      <p><div class="tooltip">&#9432Gender: <span class="tooltiptext">The passenger's gender.</span><span id="gender"></span></div></p>
      <p><div class="tooltip">&#9432Class: <span class="tooltiptext">The class the passenger traveled in (Economy, Economy Plus, Business).</span><span id="class"></span></div></p>
      <p><div class="tooltip">&#9432Reason For Travel: <span class="tooltiptext">The reason for the passenger's travel (business or leisure).</span><span id="typeOfTravel"></span></div></p>
      <p><div class="tooltip">&#9432Customer Loyalty: <span class="tooltiptext">The passenger's loyalty to the airline. Loyal customers frequently use the same airline and participate in the airline's rewards programs. </span><span id="customerType"></span></div></p>

    </div>

    <!-- Section 2: Information related to the completed flight -->
    <div class="section2">
      
      <h2><div class="header-tooltip">&#9432Completed Flight Details<span class="tooltiptext">Information about the passenger's flight times and distance.</span></div></h2>

      <p><div class="tooltip">&#9432Flight Distance: <span class="tooltiptext">The total flight distance in kilometers. (For reference, a flight from New York City to London is 5,567km.) </span><span id="flightDistance"></span> km</div></p>
      <p><div class="tooltip">&#9432Departure Delay (Minutes): <span class="tooltiptext">The difference in number of minutes between the scheduled and actual departure time.</span><span id="departureDelay"></span> </div></p>
      <p><div class="tooltip">&#9432Arrival Delay (Minutes): <span class="tooltiptext">The difference in number of minutes between the scheduled and actual arrival time.</span><span id="arrivalDelay"></span> </div></p>
    </div>

    <!-- Section 3: Passenger's flight satisfaction survey responses -->
    <div class="section3">

      
      <h2><div class="header-tooltip">&#9432Passenger Satisfaction Survey Responses<span class="tooltiptext">Passenger's responses to a post-flight satisfaction survey. Higher rating means more satisfied.</span></div></h2>

      <p><div class="tooltip">&#9432Inflight Wi-Fi Service: <span class="tooltiptext">Passenger's rating of the inflight Wi-Fi service.</span><span id="inflightWifi"></span></div></p>
      <p><div class="tooltip">&#9432On-Board Service: <span class="tooltiptext">Passenger's rating of the on-board service. The on-board service includes all aspects of service provided by the flight's attendants while on board the aircraft. </span><span id="onBoardService"></span></div></p>
      <p><div class="tooltip">&#9432Check-In Service: <span class="tooltiptext">Passenger's rating of the check-in service. The check-in service includes the process of checking in to the flight either online or at the airport.</span><span id="checkInService"></span></div></p>
      <p><div class="tooltip">&#9432Baggage Handling: <span class="tooltiptext">Passenger's rating of the baggage handling. Baggage handling consists of the process of dropping-off and picking-up luggage.</span><span id="baggageHandling"></span></div></p>
      <p><div class="tooltip">&#9432Gate Location: <span class="tooltiptext">Passenger's rating of the gate location. The gate area is where the passenger boards their flight. The passenger may also choose to wait for their flight at the gate.</span><span id="gateLocation"></span></div></p>
      <p><div class="tooltip">&#9432Food and Drink: <span class="tooltiptext">Passenger's rating of the food and drink. The food and drink includes all food and drink options provided or purchased while on the aircraft.</span><span id="foodAndDrink"></span></div></p>
      <p><div class="tooltip">&#9432Seat Comfort: <span class="tooltiptext">Passenger's rating of the seat comfort. The seat comfort includes the comfort of the passenger's seat and the space available to the passenger.</span><span id="seatComfort"></span></div></p>
      <p><div class="tooltip">&#9432Inflight Entertainment: <span class="tooltiptext">Passenger's rating of the inflight entertainment. The inflight entertainment includes all entertainment options provided or purchased while on the aircraft.</span><span id="inflightEntertainment"></span></div></p>
      <p><div class="tooltip">&#9432Ease of Online Booking: <span class="tooltiptext">Passenger's rating of the ease of online booking. The ease of online booking includes the process of booking the flight online.</span><span id="onlineBooking"></span></div></p>
      <p><div class="tooltip">&#9432Cleanliness: <span class="tooltiptext">Passenger's rating of the cleanliness. The cleanliness includes the cleanliness of the aircraft and the facilities available to the passenger.</span><span id="cleanliness"></span></div></p>
      <p><div class="tooltip">&#9432Departure/Arrival Time Convenient: <span class="tooltiptext">Passenger's rating of the convenience of the departure and arrival times - did the passenger find the departure and arrival time convenient?</span><span id="departureArrivalTime"></span></div></p>



    </div>
  </div>
  
  <!-- Section 4: Key Concept Values-->
    <div class="section4">
      
      <h2><div class="header-tooltip">&#9432Key Concept Values<span class="tooltiptext">We provide you with a set of key concepts to help you synthesize information above: passenger status, in-flight experience, delays, and reason for travel. By concepts, we mean higher-level ideas that information or a set of different information represent as a group. The concepts below are shown to play an important role in passenger satisfaction according to research. </span></div></h2>


      <p><div class="tooltip">&#9432Passenger Status: <span class="tooltiptext">Passenger status means the status that passengers hold in airline passenger management, which indicates the service quality that the airline provides. Higher value indicates higher status. This concept uses the passenger class and customer loyalty. A disloyal passenger in economy class gets a status rating of 1. If a passenger is loyal, +2 is added to their rating. If a passenger is in Economy Plus, +1 is added to their value rating. If a passenger is in Business Class, +2 is added to their value rating.</span><span id="cvalue"></span></div></p>
      <p><div class="tooltip">&#9432In-Flight Experience: <span class="tooltiptext">In-flight experience their experience during the flight. It is calculated by averaging the following factors: 'Inflight wifi service','Food and drink', 'Seat comfort', 'Inflight entertainment', 'On-board service','Inflight service', 'Cleanliness.' </span><span id="cinflight"></span></div></p>
      <p><div class="tooltip">&#9432Delays: <span class="tooltiptext">Delays indicate delays experienced by the passenger at various points of their journey. Lower value indicates less time delayed. First, the sum of arrival and departure delay time in minutes is calculated. If the sum is 0, the delays concept gets a rating of 1. If the sum is greater than 0 but less than 30, the delays value gets a rating of 2. The delays value then increases by 1 at each 30-minute increment, with total delays greater than 90 minutes receiving a rating of 5. </span><span id="cdelays"></span></div></p>
      <p><div class="tooltip">&#9432Reason For Travel: <span class="tooltiptext">Reason for travel indicates whether passengers traveled for personal versus business reasons. If the passenger was traveling for personal reasons, this concept gets a value of 0, otherwise, it gets a value of 1. This concept is a repetition of the 'Reason for Travel' field because it alone has been found to be an important concept when determining a passenger's satisfaction.</span><span id="creason"></span></div></p>


      
    </div>
  </div>`;

  

 

  if (currentTask == 4) {
  attention_check1 = `<div class="question">
  <p>Select value "2" below.</p>
  <div class="choices">
  <label> <input type="radio" name="attn1" value="1"> 1 (Not Satisfied)&ensp;&ensp;</label>
  <label> <input type="radio" name="attn1" value="2"> 2&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="attn1" value="3"> 3&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="attn1" value="4"> 4&emsp;&emsp;&emsp;&ensp;&ensp;</label>
  <label> <input type="radio" name="attn1" value="5"> 5 (Very Satisfied)</label>
  </div>`;}
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
  </div>`;}
  else {
    attention_check2 = ``}
  
  //if (condition != 0 && taskType == "eval") {
  //  improvementPlanButton = `<button onclick="showImprovementPlanResult()">Show Reflection</button>`
  //}
  //else {
  //  improvementPlanButton = ``
  //}

  improvementPlanButton = ``
  
  document.getElementById("taskPages").innerHTML = profileInfo + `
    <div class="task">` + attention_check1 + attention_check2 + `
    
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
  var taskData = selectedTasks[currentTask-1];
  if (!taskData) {
    console.error(`Task data not found for Task ${currentTask-1}`);
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

  conceptValues[currentTask-1] = {}
  conceptValues[currentTask-1]['value'] = 1
  if (taskData["Customer Type_Loyal Customer"] === 1) {
    conceptValues[currentTask-1]['value'] += 2
  }
  if (getClass(taskData) == 'Business') {
    conceptValues[currentTask-1]['value'] += 2
  }
  if (getClass(taskData) == 'Economy Plus') {
    conceptValues[currentTask-1]['value'] += 1
  }

  conceptValues[currentTask-1]['inflight'] = Math.round(calculateAverage([taskData['Inflight wifi service'], taskData['On-board service'], taskData['Food and drink'], taskData['Seat comfort'], taskData['Inflight entertainment'], taskData['Cleanliness']]))
  var delayTotal = taskData['Departure Delay in Minutes'] + taskData['Arrival Delay in Minutes']
  conceptValues[currentTask-1]['delay'] = 1
  if (delayTotal > 0) {
    conceptValues[currentTask-1]['delay'] += 1
  }
  if (delayTotal > 30) {
    conceptValues[currentTask-1]['delay'] += 1
  }
  if (delayTotal > 60) {
    conceptValues[currentTask-1]['delay'] += 1
  }
  if (delayTotal > 90) {
    conceptValues[currentTask-1]['delay'] += 1
  }

  conceptValues[currentTask-1]['reason'] = 'Personal'
  if (taskData['Type of Travel_Business travel'] == 1) {
    conceptValues[currentTask-1]['reason'] = 'Business'
  }

  document.getElementById('cvalue').innerText = conceptValues[currentTask-1]['value'];
  document.getElementById('cinflight').innerText = conceptValues[currentTask-1]['inflight'];
  document.getElementById('cdelays').innerText = conceptValues[currentTask-1]['delay'];
  document.getElementById('creason').innerText = conceptValues[currentTask-1]['reason'];


  
}



// Show the previous task and hide the current task
function showPreviousTask(taskType) {
  
  if (taskType == 'training') {

    trainingTaskResponses[taskNum] = storeTaskResponses(taskNum); }
  else {
    evalTaskResponses[taskNum] = storeTaskResponses(taskNum);}
  
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
function storeTaskResponses(task_number) {
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

    taskResponses['taskIndex'] = indices[task_number-1]
    
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


function finishSurveyQuick() {
      postSurveyPush(unique_id, condition);
      timesPush(unique_id, condition);

      // Hide the survey and show the thank you page
      document.getElementById('improvementPlanTutorialPage').style.display = 'none';
      document.getElementById('thankYou').style.display = 'block';


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
      

      if ([0, 1,2, 3,4,5,6].includes(condition)) {
        postSurveyResponses.improvement = getTextareaValue('improvement');
      }
      
      
      postSurveyResponses.conceptsIntuitive = getTextareaValue('conceptsIntuitive');
      postSurveyResponses.conceptsHelpful = getTextareaValue('conceptsHelpful');

      // You can now use the postSurveyResponses object to send the data to the server or process it as needed
      console.log(postSurveyResponses);
      postSurveyPush(unique_id, condition);
      timesPush(unique_id, condition);

      // Hide the survey and show the thank you page
      document.getElementById('postSurveyPage').style.display = 'none';
      document.getElementById('thankYou').style.display = 'block';
      

    };

    function redirect() {
      window.location.replace("https://connect.cloudresearch.com/participant/project/09d4ce93bb3946c7aeef3ca8bf9c81ee/complete");
    }

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

    function calculateAverage(array) {
      var total = 0;
      var count = 0;
  
      array.forEach(function(item, index) {
          total += item;
          count++;
      });
  
      return total / count;
  }

  function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }


