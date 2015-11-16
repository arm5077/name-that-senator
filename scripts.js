var correctGuesses = 0;
var incorrectGuesses = 0;

var hoveredButton = null;
var hasGuessed = false;

var instruxShowing = true; 

//selecting initial button that verifies user read instrux
$(".button").click(function(){
	$(".overlayLight").addClass("hide");
	$(".overlayDark").addClass("hide");
	instruxShowing = false;
})

$.getJSON("names.json", function(names){
	
	// This sorts names alphabetically
	/*
	names.sort(function(a,b){
		if(a.Last_name >= b.Last_name)
			return 1;
		if(a.Last_name < b.Last_name)
			return -1;
	});
	*/
	
	names.sort(function(a,b){
		return Math.random() * 2 - 1 
	});

	var i = 0;


	$(window).keydown(function(key){	

		switch(key.keyCode){
			//up
			case 38:
				key.preventDefault();
				if(instruxShowing == false){
					if (hoveredButton == null){
						hoveredButton = 3;
					}else if(hoveredButton == 0){
						hoveredButton = 3;
					}else{
						hoveredButton --;
					}
				}
			break;
			//down
			case 40:
				key.preventDefault();
				if(instruxShowing == false){
					if (hoveredButton == null){
						hoveredButton = 0;
					}else if(hoveredButton == 3){
						hoveredButton = 0;
					}else{
						hoveredButton ++;
					}
				}	
			break;
			// enter key
			case 13:
				key.preventDefault();
				if(instruxShowing == true){
					$(".overlayLight").addClass("hide");
					$(".overlayDark").addClass("hide");
					instruxShowing = false;
				}else if(hasGuessed==false && hoveredButton != null){
					var guessButton = $(".guess:nth-child(" + (hoveredButton + 1) + ")");
					var answer_name = '<span class="name">' + names[i].Name + '</span><span class="geo">&nbsp;(' + names[i].Party + '-' + names[i].Region + ')</span>';
					answer(guessButton.html(), answer_name, guessButton);
					$(".guess").removeClass("hover_color");
				}else if(hoveredButton != null){
					$(".next").removeClass("show");
					i ++;
					nextName();
					hasGuessed = false;
				}
			

			break;
			case 39:
				key.preventDefault();
				if(hasGuessed==true){
					$(".next").removeClass("show");
					i ++;
					nextName();
					hasGuessed = false;
				}
			break;
		}

		
		if(hoveredButton != null && hasGuessed==false){
			$(".guess").removeClass("hover_color");
			$(".guess:nth-child(" + (hoveredButton + 1) + ")").addClass("hover_color");
		};
	})


	nextName();

	//clicking
	$(".next").click(function(){
		$(".next").removeClass("show");
		i ++;
		nextName();
		hasGuessed = false;
	})

	//name of function is getOptions for ease of reference
	function getOptions(name){
		var threeNames = [];

		while(threeNames.length < 3){
			var randNum = Math.round(Math.random() * 99);

			var randName = '<span class="name">' + names[randNum].Name + '</span><span class="geo">&nbsp;(' + names[randNum].Party + '-' + names[randNum].Region + ')</span>';

			if(randName != name && names[randNum].Gender == names[i].Gender && threeNames.indexOf(randName) == -1 ){
				threeNames.push(randName);
			}
		}
		
		
		var randPlacement = Math.round(Math.random() * 3);
		threeNames.splice(randPlacement, 0, name);

		return threeNames;
	}

	// this constructs a photo and four answers for a senator
	function nextName(){

		hoveredButton = null;

		var name = '<span class="name">' + names[i].Name + '</span><span class="geo">&nbsp;(' + names[i].Party + '-' + names[i].Region + ')</span>';

		var options = getOptions(name);

		hasGuessed = false;

		$("#track_place").html("Senator " + (i+1) + "/100");

		//passing it a blank string to reset values
		$(".guesses").html("");
		$("#image img").attr("src","img/" + names[i].Last_name.toLowerCase() + ".jpg")
		options.forEach(function(guess){
			
			//putting each "guess" into a new class that we definie in hard code as .guess. Have to 
			//use appendTo rather than append because of this-- can't define var otherwise?
			var guessButton = $("<div class = 'guess'>" + guess + "</div>").appendTo($(".guesses"));

			$(guessButton).click(function(){
				answer(guess, name, guessButton);
				
			});

		})				

	}


	function answer(guess, answer, guessButton){

		if(hasGuessed == false){
			hasGuessed = true;

			if(answer == guess){
				correctGuesses++;
				$("#correct").html("Correct: <span>" + correctGuesses + "</span>");

				//*****
				$(guessButton).addClass("green");
				$("#answer").prepend("<div class='bar bar_green'></div>");
				//******
				$(guessButton).append("<i class='fa fa-check-circle fa-right'></i>");
			}


			else{
				incorrectGuesses ++;
				$("#incorrect").html("Incorrect: <span>" + incorrectGuesses + "</span>");

				//******
				$(guessButton).addClass("red");
				
				//adding on score bars
				$("#answer").append("<div class='bar bar_red'></div>");
				
				//turn correct answer green, after selecting wrong answer
				$(".guess").each(function(i, currentGuess){
					
					console.log($(currentGuess).html() + " / " + answer);

					if($(currentGuess).html() == answer){
						$(currentGuess).addClass("bold");
						$(currentGuess).append("<i class='fa fa-check-circle fa-right'></i>");
					}
				})


			}

			$(".next").addClass("show");
			$("#twitter a").attr("href", "https://twitter.com/intent/tweet?text=" + "I%20named%20" + correctGuesses + "%20out%20of%20" + (correctGuesses + incorrectGuesses) + "%20senators.%20" + window.location);



		}

		var totalGuesses = (correctGuesses + incorrectGuesses); 


		if (totalGuesses >= 2){
			$(".twitter").addClass("show");
		}

		if (totalGuesses == 4){
			$(".instrux").addClass("hide");
		}

		if (totalGuesses == 4){
			$(".container").addClass("hide");
			$(".end_container").addClass("show_inherit");
			$(".score").html("And you correctly identified <span>" + correctGuesses + " out of 100</span> senators.");
		}


	}



});







/*

if (totalGuesses == 100){
			$(".end_message").html("<div class='end_message_text'><span>FINAL SCORE:</span> You named <span>" + correctGuesses + " out of 100</span> senators correctly.</div>")
			$(".end_message").addClass("show");
			$(".next").removeClass("show");
			$(".replay").addClass("show");
		}


var numbers = [34, 21, 53, 25];
numbers.sort(function(a,b){
	return b-a;
});

console.log(numbers);
*/