import { useQuiz } from "../contexts/QuizContext";

function Progress() {
	const { index, questionsNum, points, totalPoints, answer } = useQuiz();
	return (
		<header className="progress">
			<progress
				max={questionsNum}
				value={index + Number(answer !== null)}
			></progress>
			<p>
				Question <strong>{index + 1}</strong> / {questionsNum}
			</p>
			<p>
				<strong>{points}</strong> / {totalPoints} points
			</p>
		</header>
	);
}

export default Progress;
