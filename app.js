// QuizGenius Application Logic

// DOM Elements
const elements = {
    // Tabs
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    
    // Input elements
    textInput: document.getElementById('text-input'),
    fileInput: document.getElementById('file-input'),
    dropArea: document.getElementById('drop-area'),
    imagePreviewContainer: document.getElementById('image-preview-container'),
    imagePreview: document.getElementById('image-preview'),
    removeImageBtn: document.getElementById('remove-image'),
    
    // Quiz options
    questionCountSlider: document.getElementById('question-count'),
    questionCountValue: document.getElementById('question-count-value'),
    difficultySelect: document.getElementById('difficulty'),
    
    // Buttons
    generateBtn: document.getElementById('generate-btn'),
    nextBtn: document.getElementById('next-btn'),
    finishBtn: document.getElementById('finish-btn'),
    reviewBtn: document.getElementById('review-btn'),
    newQuizBtn: document.getElementById('new-quiz-btn'),
    
    // Sections
    inputSection: document.querySelector('.input-section'),
    quizSection: document.querySelector('.quiz-section'),
    loadingContainer: document.querySelector('.loading-container'),
    resultsContainer: document.querySelector('.results-container'),
    
    // Quiz elements
    currentQuestionSpan: document.getElementById('current-question'),
    totalQuestionsSpan: document.getElementById('total-questions'),
    scoreSpan: document.getElementById('score'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    feedbackContainer: document.getElementById('feedback-container'),
    feedbackText: document.getElementById('feedback-text'),
    finalScoreSpan: document.getElementById('final-score'),
    maxScoreSpan: document.getElementById('max-score')
};

// Application state
const state = {
    activeTab: 'text',
    imageFile: null,
    imageBase64: null,
    quizOptions: {
        questionCount: 5,
        difficulty: 'medium'
    },
    apiKey: GEMINI_API_KEY, // Use API key from config.js
    quiz: {
        questions: [],
        currentQuestionIndex: 0,
        selectedOptionIndex: null,
        score: 0,
        isReviewing: false
    }
};

// Initialize the application
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Update question count display
    updateQuestionCountDisplay();
}

// Set up all event listeners
function setupEventListeners() {
    // Tab switching
    elements.tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // Question count slider
    elements.questionCountSlider.addEventListener('input', handleQuestionCountChange);
    
    // Image upload handling
    elements.fileInput.addEventListener('change', handleFileSelect);
    elements.dropArea.addEventListener('dragover', handleDragOver);
    elements.dropArea.addEventListener('drop', handleDrop);
    elements.dropArea.addEventListener('click', () => elements.fileInput.click());
    elements.removeImageBtn.addEventListener('click', removeImage);
    
    // Quiz generation
    elements.generateBtn.addEventListener('click', generateQuiz);
    
    // Quiz navigation
    elements.nextBtn.addEventListener('click', showNextQuestion);
    elements.finishBtn.addEventListener('click', finishQuiz);
    
    // Results actions
    elements.reviewBtn.addEventListener('click', reviewQuiz);
    elements.newQuizBtn.addEventListener('click', resetQuiz);
}

// Switch between text and image tabs
function switchTab(tabName) {
    state.activeTab = tabName;
    
    // Update tab buttons
    elements.tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    
    // Update tab content
    elements.tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
}

// Handle question count slider change
function handleQuestionCountChange() {
    state.quizOptions.questionCount = parseInt(elements.questionCountSlider.value);
    updateQuestionCountDisplay();
}

// Update the question count display
function updateQuestionCountDisplay() {
    elements.questionCountValue.textContent = state.quizOptions.questionCount;
}

// These functions have been removed as we're using the API key from config.js

// Handle file selection from input
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        processImageFile(file);
    }
}

// Handle drag over event
function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    elements.dropArea.classList.add('drag-over');
}

// Handle drop event
function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    elements.dropArea.classList.remove('drag-over');
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        processImageFile(file);
    }
}

// Process the selected image file
function processImageFile(file) {
    state.imageFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        state.imageBase64 = e.target.result;
        elements.imagePreview.src = state.imageBase64;
        elements.imagePreviewContainer.style.display = 'block';
        elements.dropArea.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

// Remove the selected image
function removeImage() {
    state.imageFile = null;
    state.imageBase64 = null;
    elements.imagePreview.src = '';
    elements.imagePreviewContainer.style.display = 'none';
    elements.dropArea.style.display = 'block';
    elements.fileInput.value = '';
}

// Generate a quiz based on the input
async function generateQuiz() {
    // Validate input
    if (!validateInput()) {
        return;
    }
    
    // Show loading screen
    elements.loadingContainer.style.display = 'flex';
    
    try {
        // Get quiz data based on active tab
        let quizData;
        if (state.activeTab === 'text') {
            quizData = await generateQuizFromText();
        } else {
            quizData = await generateQuizFromImage();
        }
        
        // Process quiz data
        processQuizData(quizData);
        
        // Hide loading screen and show quiz
        elements.loadingContainer.style.display = 'none';
        elements.inputSection.style.display = 'none';
        elements.quizSection.style.display = 'block';
        elements.resultsContainer.style.display = 'none';
        
        // Display the first question
        displayQuestion();
    } catch (error) {
        console.error('Error generating quiz:', error);
        alert('Error generating quiz. Please try again.');
        elements.loadingContainer.style.display = 'none';
    }
}

// Validate user input before generating quiz
function validateInput() {
    // Check input based on active tab
    if (state.activeTab === 'text') {
        const text = elements.textInput.value.trim();
        if (!text) {
            alert('Please enter some text to generate a quiz.');
            elements.textInput.focus();
            return false;
        }
        if (text.length < 100) {
            alert('Please enter more text for better quiz generation (at least 100 characters).');
            elements.textInput.focus();
            return false;
        }
    } else {
        if (!state.imageFile) {
            alert('Please upload an image to generate a quiz.');
            return false;
        }
    }
    
    // Update quiz options
    state.quizOptions.difficulty = elements.difficultySelect.value;
    
    return true;
}

// Generate quiz from text input
async function generateQuizFromText() {
    const text = elements.textInput.value.trim();
    const prompt = QUIZ_PROMPTS.text[state.quizOptions.difficulty]
        .replace('{questionCount}', state.quizOptions.questionCount);
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    { text: text }
                ]
            }]
        })
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return extractQuizData(data);
}

// Generate quiz from image input
async function generateQuizFromImage() {
    const prompt = QUIZ_PROMPTS.image[state.quizOptions.difficulty]
        .replace('{questionCount}', state.quizOptions.questionCount);
    
    // Remove the data URL prefix to get just the base64 data
    const base64Data = state.imageBase64.split(',')[1];
    
    const response = await fetch(`${GEMINI_VISION_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: state.imageFile.type,
                            data: base64Data
                        }
                    }
                ]
            }]
        })
    });
    
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return extractQuizData(data);
}

// Extract quiz data from API response
function extractQuizData(data) {
    try {
        const responseText = data.candidates[0].content.parts[0].text;
        
        // Find JSON in the response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        // If no JSON format is found, try to parse the whole response
        return JSON.parse(responseText);
    } catch (error) {
        console.error('Error parsing quiz data:', error);
        throw new Error('Failed to parse quiz data from API response');
    }
}

// Process the quiz data
function processQuizData(quizData) {
    state.quiz.questions = quizData;
    state.quiz.currentQuestionIndex = 0;
    state.quiz.score = 0;
    state.quiz.isReviewing = false;
    
    // Update total questions display
    elements.totalQuestionsSpan.textContent = state.quiz.questions.length;
    elements.maxScoreSpan.textContent = state.quiz.questions.length;
}

// Display the current question
function displayQuestion() {
    const question = state.quiz.questions[state.quiz.currentQuestionIndex];
    
    // Reset state
    state.quiz.selectedOptionIndex = null;
    elements.nextBtn.disabled = true;
    elements.feedbackContainer.style.display = 'none';
    
    // Update question number
    elements.currentQuestionSpan.textContent = state.quiz.currentQuestionIndex + 1;
    
    // Set question text
    elements.questionText.textContent = question.question;
    
    // Create options
    elements.optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <div class="option-marker">${String.fromCharCode(65 + index)}</div>
            <div class="option-text">${option}</div>
        `;
        
        // Add click handler
        optionElement.addEventListener('click', () => {
            if (state.quiz.isReviewing) return;
            selectOption(index);
        });
        
        // If reviewing, add correct/incorrect classes
        if (state.quiz.isReviewing) {
            if (index === question.correctAnswer) {
                optionElement.classList.add('correct');
            } else if (index === state.quiz.selectedOptionIndex) {
                optionElement.classList.add('incorrect');
            }
        }
        
        elements.optionsContainer.appendChild(optionElement);
    });
    
    // Show finish button on last question
    elements.nextBtn.style.display = state.quiz.currentQuestionIndex < state.quiz.questions.length - 1 ? 'block' : 'none';
    elements.finishBtn.style.display = state.quiz.currentQuestionIndex === state.quiz.questions.length - 1 ? 'block' : 'none';
}

// Handle option selection
function selectOption(index) {
    // If already selected an option, return
    if (state.quiz.selectedOptionIndex !== null) return;
    
    const question = state.quiz.questions[state.quiz.currentQuestionIndex];
    const options = elements.optionsContainer.querySelectorAll('.option');
    
    // Store selected index
    state.quiz.selectedOptionIndex = index;
    
    // Mark selected option
    options[index].classList.add('selected');
    
    // Check if correct
    const isCorrect = index === question.correctAnswer;
    
    // Update score if correct
    if (isCorrect) {
        state.quiz.score++;
        elements.scoreSpan.textContent = state.quiz.score;
    }
    
    // Show correct answer
    options.forEach((option, i) => {
        if (i === question.correctAnswer) {
            option.classList.add('correct');
        } else if (i === index && !isCorrect) {
            option.classList.add('incorrect');
        }
    });
    
    // Show feedback
    elements.feedbackContainer.className = 'feedback-container ' + (isCorrect ? 'correct' : 'incorrect');
    elements.feedbackText.textContent = question.explanation;
    elements.feedbackContainer.style.display = 'block';
    
    // Enable next button
    elements.nextBtn.disabled = false;
    elements.finishBtn.disabled = false;
}

// Show the next question
function showNextQuestion() {
    state.quiz.currentQuestionIndex++;
    displayQuestion();
}

// Finish the quiz and show results
function finishQuiz() {
    elements.finalScoreSpan.textContent = state.quiz.score;
    elements.quizSection.querySelector('.quiz-container').style.display = 'none';
    elements.resultsContainer.style.display = 'block';
}

// Review the quiz answers
function reviewQuiz() {
    state.quiz.isReviewing = true;
    state.quiz.currentQuestionIndex = 0;
    elements.quizSection.querySelector('.quiz-container').style.display = 'block';
    elements.resultsContainer.style.display = 'none';
    displayQuestion();
}

// Reset the quiz and return to input screen
function resetQuiz() {
    // Reset state
    state.quiz.questions = [];
    state.quiz.currentQuestionIndex = 0;
    state.quiz.score = 0;
    state.quiz.isReviewing = false;
    
    // Reset UI
    elements.scoreSpan.textContent = '0';
    elements.quizSection.querySelector('.quiz-container').style.display = 'block';
    elements.resultsContainer.style.display = 'none';
    
    // Show input section
    elements.inputSection.style.display = 'block';
    elements.quizSection.style.display = 'none';
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);
