const quizBox = document.getElementById("quiz");
const resultsBox = document.getElementById("results");
const submitButton = document.getElementById("submit");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

let currentSlide = 0;
let slides;
let questions = [];

function buildQuiz(questions){
    const output = [];
    questions.forEach((currentQuestion, questionNumber) => {
        const answers = [];
        for (const letter in currentQuestion.answers) {
            answers.push(
                `<label>
                    <input type="radio" name="question${questionNumber}" value="${letter}" class="rad_butn">
                    ${letter} : ${currentQuestion.answers[letter]}
                </label>`
            );
        }
        output.push(
            `<div class="slide">
                <div class="question">${questionNumber + 1}. ${currentQuestion.question}</div>
                <div class="answers">${answers.join("")}</div>
            </div>`
        );
    });
    quizBox.innerHTML = output.join('');
    slides = document.querySelectorAll('.slide');
    showSlide(0);
}

function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    
    previousButton.disabled = currentSlide === 0;
    
    if (currentSlide === slides.length - 1) {
        nextButton.style.display = 'none';
        submitButton.style.display = 'block';
    } else {
        nextButton.style.display = 'block';
        submitButton.style.display = 'none';
    }
}

function showNextSlide() {
    showSlide(currentSlide + 1);
}

function showPreviousSlide() {
    showSlide(currentSlide - 1);
}

function showResults(questions){
    const answerContainers = quizBox.querySelectorAll('.answers');
    let numCorrect = 0;
    
    questions.forEach((currentQuestion, questionNumber) => {
        const answerContainer = answerContainers[questionNumber];
        const selector = `input[name=question${questionNumber}]:checked`;
        const userAnswer = (answerContainer.querySelector(selector) || {}).value;
        
        if (userAnswer === currentQuestion.correctAnswer) {
            numCorrect++;
            answerContainers[questionNumber].classList.add('correct');
        } else {
            answerContainers[questionNumber].classList.add('incorrect');
        }
    });

    const percentage = Math.round((numCorrect / questions.length) * 100);
    resultsBox.innerHTML = `${numCorrect} out of ${questions.length} correct (${percentage}%)`;
    // resultsBox.innerHTML = `${numCorrect} out of ${questions.length} correct`;
    
    previousButton.style.display = 'none';
    nextButton.style.display = 'none';
    submitButton.style.display = 'none';
    
    showSlide(0);
}

// Fetch JSON and build quiz
fetch('assets/json/data.json')
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        questions = data;
        buildQuiz(questions);
        
        submitButton.addEventListener("click", () => showResults(questions));
        previousButton.addEventListener("click", showPreviousSlide);
        nextButton.addEventListener("click", showNextSlide);
    })
    .catch(err => {
        console.error("Error loading JSON:", err);
        quizBox.innerHTML = `<p style="color: red;">Error loading quiz questions. Please make sure data.json exists at assets/json/data.json</p>`;
    });