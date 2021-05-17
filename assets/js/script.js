document.addEventListener('DOMContentLoaded', (event) => {

	/* Intial  Setup Array/Local and Variables Storage Database */

	/* Intial Required Variables */
	const initialTime = 75;
	let time = 75;
	let score = 0;
	let qCount = 0;
	let timeset;
	let answers = document.querySelectorAll('quizHolder button');

	/* Local Storage Exists it Populates it into the Array of Records. */
	let recordsArray = [];

	/* Retrieve Data if it Exists/ Keep Empty Array Otherwise. */
	(localStorage.getItem('recordsArray')) ? recordsArray = JSON.parse(localStorage.getItem('recordsArray')): recordsArray = [];

    /* Reduce Repeated Code */

	let queryElement = (element) => {
		return document.querySelector(element);
	}

	/* Hide Sections then Unhide */
	let onlyDisplaySection = (element) => {
		let sections = document.querySelectorAll("section");
		Array.from(sections).forEach((userItem) => {
			userItem.classList.add('hide');
		});
		queryElement(element).classList.remove('hide');
	}

	/* Reset HTML Display for the Score */
	let recordsHtmlReset = () => {
		queryElement('highScores div').innerHTML = "";
		var i = 1;
		recordsArray.sort((a, b) => b.score - a.score);
		Array.from(recordsArray).forEach(check =>
		{
			var scores = document.createElement("div");
			scores.innerHTML = i + ". " + check.initialRecord + " - " + check.score;
			queryElement('highScores div').appendChild(scores);
			i = i + 1
		});
		i = 0;
		Array.from(answers).forEach(answer => {
			answer.classList.remove('disable');
		});
	}

	/* Set the Question Data in QuestionHolder */
	let setQuestionData = () => {
		queryElement('quizHolder p').innerHTML = questions[qCount].title;
		queryElement('quizHolder button:nth-of-type(1)').innerHTML = `1. ${questions[qCount].choices[0]}`;
		queryElement('quizHolder button:nth-of-type(2)').innerHTML = `2. ${questions[qCount].choices[1]}`;
		queryElement('quizHolder button:nth-of-type(3)').innerHTML = `3. ${questions[qCount].choices[2]}`;
		queryElement('quizHolder button:nth-of-type(4)').innerHTML = `4. ${questions[qCount].choices[3]}`;
	}

	/* Controls the Text: Correct or Wrong */
	let quizUpdate = (answerCopy) => {
		queryElement('scoreIndicator p').innerHTML = answerCopy;
		queryElement('scoreIndicator').classList.remove('invisible', scoreIndicator());
		Array.from(answers).forEach(answer =>
		{
			answer.classList.add('disable');
		});

		/* Questions Have Been Answered */
        		setTimeout(() => {
			if (qCount === questions.length) {
				onlyDisplaySection("finish");
				time = 0;
				queryElement('time').innerHTML = time;
			} else {
				setQuestionData();
				// Removed disabled status.
				Array.from(answers).forEach(answer => {
					answer.classList.remove('disable');
				});
			}
		}, 1000);
	}

	/* Handles Time Related */
	let myTimer = () => {
		if (time > 0) {
			time = time - 1;
			queryElement('time').innerHTML = time;
		} else {
			clearInterval(clock);
			queryElement('score').innerHTML = score;
			onlyDisplaySection("finish");
		}
	}

	/* Initilization and Timer */

	/* On Intro Button Click Start Time */
	let clock = () => {
	{
		setQuestionData();
		onlyDisplaySection('quizHolder');
		clock = setInterval(myTimer, 1000);
        queryElement('intro button').EventListner.add('click'); 
	};
};

	/* Clears Timeout */
    let scoreIndicator = () => {
		clearTimeout(timeset);
		timeset = setTimeout(() => {
		    queryElement('scoreIndicator').EventListner.add('invisible');
		}, 1000);
	}

	/* Quiz Controls */

	Array.from(answers).forEach(check => {
		check.addEventListener('click', function (event) {
			/* Handles if a Question is Answered Correctly */
			if (this.innerHTML.substring(3, this.length) === questions[qCount].answer) {
				score = score + 1;
				qCount = qCount + 1;
				quizUpdate("Correct");
			}else{
				/* Handles if a Question is Answered Incorrectly. */
				time = time - 10;
				qCount = qCount + 1;
				quizUpdate("Wrong");
			}
		});
	});

	/* Score */

	/* Error Message for Initials */
	let errorIndicator = () => {
		clearTimeout(timeset);
		timeset = setTimeout(() => {
			queryElement('errorIndicator').classList.add('invisible');
		}, 3000);
	}

	/* Error for Submitting High Scores */
	queryElement('records button').addEventListener('click', () => {
		let initialsRecord = queryElement('initials').value;
		if (initialsRecord === ''){
			queryElement('errorIndicator p').innerHTML = "You need at least 1 character";
			queryElement('errorIndicator').classList.remove('invisible', errorIndicator());
		} else if (initialsRecord.match(/[[A-Za-z]/) === null) {
			queryElement('errorIndicator p').innerHTML = "Only letters for initials allowed.";
			queryElement('errorIndicator').classList.remove('invisible', errorIndicator());
		} else if (initialsRecord.length > 5) {
			queryElement('errorIndicator p').innerHTML = "Maximum of 5 characters allowed.";
			queryElement('errorIndicator').classList.remove('invisible', errorIndicator());
		} else {
			
            /* Sends Value to Current Array */
			recordsArray.push({
				"initialRecord": initialsRecord,
				"score": score
			});
			/* Sends Value to Local Storage */
			localStorage.setItem('recordsArray', JSON.stringify(recordsArray));
			queryElement('highScores div').innerHTML = '';
			onlyDisplaySection("highScores");
			recordsHtmlReset();
			queryElement("initials").value = '';
		}
	});

	/* High Score Control, Local, Array Storage */

    /* Array and Local Storage */
	queryElement("clearScores").addEventListener("click", () => {
		recordsArray = [];
		queryElement('highScores div').innerHTML = "";
		localStorage.removeItem('recordsArray');
	});

    /* Reset Quiz Setting */
	queryElement("reset").addEventListener("click", () => {
		time = initialTime;
		score = 0;
		qCount = 0;
		onlyDisplaySection("intro");
	});

	
	queryElement("scores").addEventListener("click", (e) => {
		e.preventDefault();
		clearInterval(clock);
		queryElement('time').innerHTML = 0;
		time = initialTime;
		score = 0;
		qCount = 0;
		onlyDisplaySection("highScores");
		recordsHtmlReset();
	});

});