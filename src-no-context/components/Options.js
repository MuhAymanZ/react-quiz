function Options({ question, dispatch, answer }) {
	const hasAnswered = answer !== null;
	return (
		<div className="options">
			{question.options.map((opt, i) => (
				<button
					className={`btn btn-option ${i === answer ? "answer" : ""} ${
						hasAnswered
							? i === question.correctOption
								? "correct"
								: "wrong"
							: ""
					}`}
					key={opt}
					onClick={() => dispatch({ type: "newAnswer", payload: i })}
					disabled={hasAnswered}
				>
					{opt}
				</button>
			))}
		</div>
	);
}

export default Options;
