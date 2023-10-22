// https://opentdb.com/api.php?amount=10

const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _nextBtn = document.getElementById('next-question');
const _playAgainBtn = document.getElementById('play-again');
const _result = document.getElementById('result');


let correctAnswer = "";
let correctScore = 0;
let askedCount = 0;
const totalQuestion = 10;

// Event listeners
function eventListeners() {
  _checkBtn.addEventListener('click', checkAnswer);
  _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', () => {
  loadQuestion();
  eventListeners();
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
});

async function loadQuestion() {
  try {
    const APIUrl = 'https://opentdb.com/api.php?amount=1';
    const result = await fetch(APIUrl);
    if (result.ok) {
      const data = await result.json();
      _result.innerHTML = "";
      showQuestion(data.results[0]);
    } else {
      throw new Error('Failed to fetch question');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Display question and options
function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  let incorrectAnswer = data.incorrect_answers;
  let optionsList = incorrectAnswer;
  optionsList.splice(Math.floor(Math.random() * (optionsList.length + 1)), 0, correctAnswer);

  _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
  _options.innerHTML = `${optionsList.map((option, index) => `
    <li> ${index + 1}. <span> ${option} </span> </li> `).join('')}
  `;

  selectOption();
}

// Options selection
function selectOption() {
  _options.querySelectorAll('li').forEach((option) => {
    option.addEventListener('click', () => {
      if (_options.querySelector('.selected')) {
        const activeOption = _options.querySelector('.selected');
        activeOption.classList.remove('selected');
      }
      option.classList.add('selected');
    });
  });
}

// Answer checking
function checkAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector('.selected')) {
    let selectedAnswer = _options.querySelector('.selected span').textContent;
    if (selectedAnswer.trim() === HTMLDecode(correctAnswer.trim())) {
      correctScore++;
      _result.innerHTML = `<p> <i class="fas fa-check-circle"></i> Correct! </p>`;
    } else {
      _result.innerHTML = `<p> <i class="fa-regular fa-clock"></i> Incorrect! 
        </p> <p><small><b>Correct: </b> ${correctAnswer}</small></p>`;
    }
    checkCount();
  } else {
        _result.innerHTML = `<p> <i class="fa-solid fa-circle-question"></i> Please select an option!</p>`;
        _checkBtn.disabled = false;
  }
}

// To convert HTML entities into normal text of correct answer if there is any
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, 'text/html');
  return doc.documentElement.textContent;
}

function checkCount() {
  askedCount++;
  setCount();
  if (askedCount === totalQuestion) {
    _result.innerHTML += `<p> Your score is ${correctScore}. </p>`;
    _playAgainBtn.style.display = 'block';
    _checkBtn.style.display = "none";// Show the "Play Again" button
  } else {
    setTimeout(() => {
      loadQuestion(); 
    },2000);
  }
}

function setCount() {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
}

// Define the playAgain function
function restartQuiz() {
  correctScore = askCount = 0;
  _playAgainBtn.style.display = 'none'; // Hide the "Play Again" button
  _checkBtn.style.display = "block";
  _checkBtn.disabled = false;
  setCount();
  loadQuestion();
}

