import { useQuiz } from "../contexts/QuizContext";

function FinishScreen() {
	const { points, totalPoints, highscore, dispatch } = useQuiz();

	const persentage = Math.round((points / totalPoints) * 100);
	return (
		<>
			<p className="result">
				You Scored <strong>{points}</strong> out of {totalPoints} ({persentage}
				%)
			</p>
			<p className="highscore"> (Highscore is {highscore} points) </p>
			<div className="btns">
				<button
					className="btn btn-ui"
					onClick={() => dispatch({ type: "restart" })}
				>
					Restart Quiz
				</button>
				<button
					className="btn btn-ui"
					onClick={() => dispatch({ type: "backToHome" })}
				>
					Back To Home
				</button>
			</div>
		</>
	);
}

export default FinishScreen;
