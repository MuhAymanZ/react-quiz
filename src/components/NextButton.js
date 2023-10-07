import { useQuiz } from "../contexts/QuizContext";

function NextButton() {
	const { dispatch, index, questionsNum } = useQuiz();

	if (index < questionsNum - 1) {
		return (
			<button
				className="btn btn-ui"
				onClick={() => {
					dispatch({ type: "nextQuestion" });
				}}
			>
				Next Question
			</button>
		);
	}
	if (index === questionsNum - 1) {
		return (
			<button
				className="btn btn-ui"
				onClick={() => {
					dispatch({ type: "finish" });
				}}
			>
				Finish
			</button>
		);
	}
}

export default NextButton;
