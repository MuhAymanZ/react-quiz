import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";

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
				secondsRemaining: 10,
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

export default function App() {
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

	useEffect(() => {
		async function fetchQuestions() {
			try {
				const res = await fetch(`https://react-quiz-db.vercel.app/questions`);
				const data = await res.json();

				dispatch({ type: "dataReceived", payload: data });
			} catch (error) {
				dispatch({ type: "dataFailed" });
			}
		}
		fetchQuestions();
	}, []);
	return (
		<div className="app">
			<Header />
			<Main>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<StartScreen questionsNum={questions.length} dispatch={dispatch} />
				)}
				{status === "active" && (
					<>
						<Progress
							questionsNum={questions.length}
							index={index}
							points={points}
							totalPoints={totalPoints}
							answer={answer}
						/>

						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer secondsRemaining={secondsRemaining} dispatch={dispatch} />
							{answer !== null && (
								<NextButton
									dispatch={dispatch}
									index={index}
									questionNum={questions.length}
								/>
							)}
						</Footer>
					</>
				)}
				{status === "finished" && (
					<FinishScreen
						points={points}
						totalPoints={totalPoints}
						highscore={highscore}
						dispatch={dispatch}
					/>
				)}
			</Main>
		</div>
	);
}
