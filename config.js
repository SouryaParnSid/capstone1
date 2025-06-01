// Configuration for QuizGenius application

// Gemini API configuration
const GEMINI_API_KEY = "AIzaSyB9Oojm-3th88yY5HY7h-IdUNZJGzSZOAk";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const GEMINI_VISION_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

// Default quiz settings
const DEFAULT_SETTINGS = {
    questionCount: 5,
    difficulty: "medium"
};

// Quiz generation prompts
const QUIZ_PROMPTS = {
    text: {
        easy: "Generate a simple quiz based on the following text. Create {questionCount} multiple-choice questions that test basic understanding and recall of the information. Each question should have 4 options with only one correct answer. Format your response as a JSON array of objects, each with 'question', 'options' (array of 4 strings), 'correctAnswer' (index of correct option, 0-3), and 'explanation' properties. The explanation should be brief and explain why the answer is correct.",
        medium: "Generate a medium-difficulty quiz based on the following text. Create {questionCount} multiple-choice questions that test understanding, application, and analysis of the information. Each question should have 4 options with only one correct answer. Format your response as a JSON array of objects, each with 'question', 'options' (array of 4 strings), 'correctAnswer' (index of correct option, 0-3), and 'explanation' properties. The explanation should be clear and informative.",
        hard: "Generate a challenging quiz based on the following text. Create {questionCount} multiple-choice questions that test deep understanding, critical thinking, and application of concepts. Questions should require analysis and synthesis of information. Each question should have 4 options with only one correct answer. Format your response as a JSON array of objects, each with 'question', 'options' (array of 4 strings), 'correctAnswer' (index of correct option, 0-3), and 'explanation' properties. The explanation should be detailed and educational."
    },
    image: {
        easy: "Analyze this image and generate a simple quiz about its content. Create {questionCount} multiple-choice questions that test basic understanding and observation of what's visible in the image. Each question should have 4 options with only one correct answer. Format your response as a JSON array of objects, each with 'question', 'options' (array of 4 strings), 'correctAnswer' (index of correct option, 0-3), and 'explanation' properties. The explanation should be brief and explain why the answer is correct.",
        medium: "Analyze this image and generate a medium-difficulty quiz about its content. Create {questionCount} multiple-choice questions that test understanding, interpretation, and analysis of what's visible in the image. Each question should have 4 options with only one correct answer. Format your response as a JSON array of objects, each with 'question', 'options' (array of 4 strings), 'correctAnswer' (index of correct option, 0-3), and 'explanation' properties. The explanation should be clear and informative.",
        hard: "Analyze this image in detail and generate a challenging quiz about its content. Create {questionCount} multiple-choice questions that test deep understanding, critical thinking, and interpretation of what's visible in the image. Questions should require careful analysis and synthesis of visual information. Each question should have 4 options with only one correct answer. Format your response as a JSON array of objects, each with 'question', 'options' (array of 4 strings), 'correctAnswer' (index of correct option, 0-3), and 'explanation' properties. The explanation should be detailed and educational."
    }
};
