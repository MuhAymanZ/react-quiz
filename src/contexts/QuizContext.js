import { useContext, useEffect, useReducer } from "react";
import { createContext } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
	questions: [],

	// 'loading','error','ready','active', 'finished'
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highscore: 0,
	secondsRemaining: null,
};
const reducer = (state, action) => {
	switch (action.type) {
		case "dataReceived":
			return { ...state, questions: action.payload, status: "ready" };
		case "dataFailed":
			return { ...state, status: "error" };
		case "start":
			return {
				...state,
				status: "active",
				secondsRemaining: state.questions.length * SECS_PER_QUESTION,
			};
		case "newAnswer":
			const question = state.questions.at(state.index);
			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question.correctOption
						? state.points + question.points
						: state.points,
			};
		case "nextQuestion":
			return { ...state, index: state.index + 1, answer: null };
		case "finish":
			return {
				...state,
				status: "finished",
				highscore:
					state.points > state.highscore ? state.points : state.highscore,
			};
		case "restart":
			return {
				...state,
				status: "active",
				index: 0,
				answer: null,
				points: 0,
				secondsRemaining: state.questions.length * SECS_PER_QUESTION,
			};
		case "backToHome":
			return { ...initialState, questions: state.questions, status: "ready" };
		case "tick":
			return {
				...state,
				secondsRemaining: state.secondsRemaining - 1,
				status: state.secondsRemaining === 0 ? "finished" : state.status,
			};
		default:
			throw new Error("Action Unknown");
	}
};

function QuizProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const {
		questions,
		status,
		index,
		answer,
		points,
		highscore,
		secondsRemaining,
	} = state;

	const totalPoints = questions.reduce((acc, cur) => acc + cur.points, 0);
	const questionsNum = questions.length;
	const question = questions[index];

	useEffect(() => {
		async function fetchQuestions() {
			try {
				const res = await fetch(`https://react-quiz-db.vercel.app/questions`);
				const data = await res.json();
				console.log(data);
				dispatch({ type: "dataReceived", payload: data });
			} catch (error) {
				dispatch({ type: "dataFailed" });
			}
		}
		fetchQuestions();
	}, []);
	return (
		<QuizContext.Provider
			value={{
				questions,
				status,
				index,
				answer,
				points,
				highscore,
				secondsRemaining,
				totalPoints,
				questionsNum,
				question,
				dispatch,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
}

function useQuiz() {
	const context = useContext(QuizContext);
	if (context === undefined)
		throw new Error(`You can't access this context here`);
	return context;
}

export { QuizProvider, useQuiz };
