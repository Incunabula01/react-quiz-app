import React from 'react';
import styles from './QuestionCard.module.scss';
import {AnswerTypes} from '../App';

type QuestionCardProps = {
    question: string;
    answers: string[];
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer: AnswerTypes | undefined;
    questionNum: number;
    totalQuestions: number;
}


const QuestionCard: React.FC<QuestionCardProps> = ({question, answers, callback, userAnswer, questionNum, totalQuestions}) => (
    <div className={styles['card-container']}>
        <p className={styles.number}>Question: {questionNum} / {totalQuestions}</p>
        <p dangerouslySetInnerHTML={{__html: question}}></p>
        <div className={styles['button-container']}>
            {answers.map((answer, i) => {
                const answerCheck = (userAnswer?.correctAnswer === answer);
                const buttonClass = answerCheck ? 'correct' : (!answerCheck && userAnswer?.userClicked) ? 'incorrect' : '';
                return (
                    <div key={answer + i}>
                        <button disabled={userAnswer ? true : false} onClick={callback} value={answer} className={styles[buttonClass]}>
                            <span dangerouslySetInnerHTML={{ __html: answer }} />
                        </button>
                    </div>
                )
            })}
        </div>
    </div>
)

export default QuestionCard;