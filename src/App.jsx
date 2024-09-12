import axios from 'axios';
import React, { useState, useEffect } from 'react';


function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  useEffect(() => {
    axios("https://the-trivia-api.com/v2/questions")
      .then((res) => {
        const fetchedQuestions = res.data;
        setQuestions(fetchedQuestions);

        if (fetchedQuestions.length > 0) {
          const firstQuestion = fetchedQuestions[0];
          setShuffledOptions(shuffleArray([...firstQuestion.incorrectAnswers, firstQuestion.correctAnswer]));
        }
      }).catch((err) => {
        console.log(err);
      });
  }, []);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function handleAnswerSubmit() {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer) {
      if (selectedAnswer === currentQuestion.correctAnswer) {
        setCorrectCount(correctCount + 1);
      }
      
      if (currentQuestionIndex < questions.length - 1) {
        const nextQuestion = questions[currentQuestionIndex + 1];
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShuffledOptions(shuffleArray([...nextQuestion.incorrectAnswers, nextQuestion.correctAnswer]));
        setSelectedAnswer('');
      } else {
        setShowResults(true);
      }
    } else {
      alert("Jawab tou Select krlo Jani!");
    }
  }

  return (
    <div className="quiz-container">
      <h1>Quiz App</h1>
      {questions.length > 0 ? (
        !showResults ? (
          <div className="question-container">
            <h2>Q{currentQuestionIndex + 1}: {questions[currentQuestionIndex].question.text}</h2>
            <ul className="options-list">
              {shuffledOptions.map((item, index) => (
                <li key={index} className="option-item">
                  <input 
                    type="radio" 
                    name="choice" 
                    id={item} 
                    value={item} 
                    checked={selectedAnswer === item} 
                    onChange={() => setSelectedAnswer(item)} 
                  />
                  <label htmlFor={item}>{item}</label>
                </li>
              ))}
            </ul>
            <button className="submit-btn" onClick={handleAnswerSubmit}>
              Next Question
            </button>
          </div>
        ) : (
          <div className="results-container">
            <h2>Quiz Completed!</h2>
            <p>Correct Answers: {correctCount}</p>
            <p>Incorrect Answers: {questions.length - correctCount}</p>
            <button className="submit-btn" onClick={() => window.location.reload()}>Restart Quiz</button>
          </div>
        )
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default App;
