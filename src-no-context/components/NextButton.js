function NextButton({ dispatch, index, questionNum }) {
	if (index < questionNum - 1) {
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
	if (index === questionNum - 1) {
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
