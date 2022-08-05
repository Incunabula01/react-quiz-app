import React, {useState} from 'react';
import styles from './App.module.scss';

//https://opentdb.com/api.php?amount=10&category=17&type=multiple
import QuestionCard from './components/QuestionCard';
import { fetchQuizQuestions, Difficulty, QuestionStateTypes } from './API';


export type AnswerTypes = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
  userClicked: boolean;
}


const TOTAL_QUESTIONS = 10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionStateTypes[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerTypes[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  console.log('fetch questions ==>', fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY));

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.EASY);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);  
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      // get users answer
      const answer = e.currentTarget.value;
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if(correct){
        setScore(prev => prev + 1);
      }
      const answerObj = {
        question: questions[number].question,
        answer,
        correct,
        userClicked: true,
        correctAnswer: questions[number].correct_answer
      };
      setUserAnswers(prev => [...prev, answerObj]);
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }

  return (
    <div className={styles['app-container']}>
      {questions.length > 0 ? <h1>{questions[0].category} Quiz</h1>: <h1>Quiz</h1>}
      {(gameOver || userAnswers.length === TOTAL_QUESTIONS) && 
        <button className={styles.start} onClick={startTrivia}>Start</button>
      }
      {!gameOver && <p className={styles.score}>Score: {score}</p>}
      {loading && <p>Loading Questions...</p>}
      
      {(!loading && !gameOver) && <QuestionCard
        questionNum={number + 1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
      />}
      {(!gameOver && userAnswers.length !== TOTAL_QUESTIONS) &&
        <button className={styles.next} onClick={nextQuestion}>Next</button>
      }
      
    </div>
  );
}

export default App;
