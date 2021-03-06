var correctGuesses = 0;
var incorrectGuesses = 0;

var hoveredButton = null;
var hasGuessed = false;

var instruxShowing = true; 

var keyGuess = false;
/*
//cookies
 $(document).ready(function() {
        // check cookie
        var visited = $.cookie("visited");

        if (visited != null) {
            $(".overlayLight").addClass("hide");
      		$(".overlayDark").addClass("hide");
      		instruxShowing = false;
        }

        // set cookie
        $.cookie("visited", { expires: 30});
    });*/


//selecting initial button that verifies user read instrux
$(".button").click(function(){
	/*$(".overlayLight").addClass("hide");*/
	$(".overlayLight").fadeOut(350);
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
				var width = $(window).width();
				keyGuess = true;
				if(instruxShowing == false || width <= 720){
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
				width = $(window).width();
				keyGuess = true;
				if(instruxShowing == false || width <= 720){
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
				width = $(window).width();
				keyGuess = true;
				if(instruxShowing == true && width > 720){
					$(".overlayLight").fadeOut(350);
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
					$(".next_placeholder").removeClass("hide");
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

	//clicking next
	$(".next").click(function(){
		$(".next_placeholder").removeClass("hide");
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


		//this is the bit that keeps track of what senator you're on, out of 100
		$(".track_place").html((i+1) + " / 100");
		$(".track_mobile").html((i+1) + "/100");


		//passing it a blank string to reset values
		$(".guesses").html("");
		$(".image_block img").attr("src","img/" + names[i].Last_name.toLowerCase() + ".jpg");
		options.forEach(function(guess){
			
			//putting each "guess" into a new class that we definie in hard code as .guess. Have to 
			//use appendTo rather than append because of this-- can't define var otherwise?
			var guessButton = $("<div class = 'guess'>" + guess + "</div>").appendTo($(".guesses"));

			$(guessButton).click(function(){
				answer(guess, name, guessButton);
				
			});

		})				

	}

	//score bar mostly?

	function answer(guess, answer, guessButton){

		if(hasGuessed == false){
			hasGuessed = true;

			if(answer == guess){
				correctGuesses++;
				//add correct written score desktop
				$("#score_block #correct").html("Correct: <span>" + correctGuesses + "</span>");
				//add correct written score mobile
				$(".MTW_inner #correct").html("<span>" + correctGuesses + "</span>");

				//adding on green score bars for correct answers
				$(".answer").prepend("<div class='bar bar_green'></div>");
				$(guessButton).append("<i class='fa fa-check-circle fa-right'></i>");

				//turning .guess green if correct name selected
				$(guessButton).addClass("green");
				$(".guess").removeClass("hover_color");
			}


			else{
				incorrectGuesses ++;
				//add incorrect score desktop
				$("#score_block #incorrect").html("Incorrect: <span>" + incorrectGuesses + "</span>");
				//add incorrect score mobile
				$(".MTW_inner #incorrect").html("<span>" + incorrectGuesses + "</span>");
				
				//adding on score bars incorrect
				$(".answer").append("<div class='bar bar_red'></div>");

				//Turning .guess red if incorrect name selected
				$(".guess").removeClass("hover_color");
				$(guessButton).addClass("red");
				
				//and adding green checkmark to correct answer, after selecting wrong answer
				$(".guess").each(function(i, currentGuess){
					
					if($(currentGuess).html() == answer){
						$(currentGuess).addClass("bold");
						$(currentGuess).append("<i class='fa fa-check-circle fa-right'></i>");
					}
				})
			}
			//add "next" button
 			$(".next").addClass("show");
			$(".next_placeholder").addClass("hide");
			//add sharing buttons
			$(".twitter1 a").attr("href", "https://twitter.com/intent/tweet?text=" + "I%20correctly%20ID'd%20" + correctGuesses + "/" + (correctGuesses + incorrectGuesses) + "%20U.S.%20senators%20with%20National%20Journal's%20'Name%20That%20Senator'%20quiz.%20Give%20it%20a%20shot:%20http://njour.nl/s/120721");
			$(".twitter2 a").attr("href", "https://twitter.com/intent/tweet?text=" + "I%20correctly%20ID'd%20" + correctGuesses + "/" + (correctGuesses + incorrectGuesses) + "%20U.S.%20senators%20with%20National%20Journal's%20'Name%20That%20Senator'%20quiz.%20Give%20it%20a%20shot:%20http://njour.nl/s/120721");
			}

		var totalGuesses = (correctGuesses + incorrectGuesses); 

		//fixes the way overlay comes up if you resize from mobile to desktop. 

		if (keyGuess == true || hasGuessed == true){
            $(".overlayLight").addClass("hide");
      		$(".overlayDark").addClass("hide");
      		instruxShowing = false;
        }

		//when twitter button appears
		if (totalGuesses >= 10){
			$(".twitter1").css("opacity","100")
		}

		//when whole game fades in exchange for yellow screen
		if (totalGuesses == 100){
			$(".instrux").addClass("hide");
		}

		//bringing up yellow screen after whole game fades, upon reaching end.
		if (totalGuesses == 100){
			$(".container").delay(250).fadeOut(750);
			$(".end_container").delay(1000).queue(function(){$(".end_container").addClass('show_inherit')});
			$(".end_container_mobile").delay(1000).queue(function(){$(".end_container_mobile").addClass('show')});
			$(".score").html("You correctly identified <span>" + correctGuesses + " out of 100</span> senators.");
		}


	}


});

//$(".twitter2 a").attr("href", "https://twitter.com/intent/tweet?text=" + "I%20correctly%20ID'd%20" + correctGuesses + "/" + (correctGuesses + incorrectGuesses) + "%20U.S.%20senators%20with%20National%20Journal's%20Senate%20Flashcards.%20Give%20it%20a%20shot:%20" + window.location);
