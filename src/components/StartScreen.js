import { useQuiz } from "../contexts/QuizContext";

function StartScreen() {
	const { questionsNum, dispatch } = useQuiz();
	return (
		<div className="start">
			<h2>Welcome to React Quiz</h2>
			<h3>{questionsNum} questions to test your react mastery</h3>
			<button
				className="btn btn-ui"
				onClick={() => dispatch({ type: "start" })}
			>
				Let's Start!
			</button>
		</div>
	);
}

export default StartScreen;