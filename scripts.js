$("html").keydown(function(key){
	console.log(key);
});

var correctGuesses = 0;
var incorrectGuesses = 0;

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

			var randName = names[randNum].Name + " <span>(" + names[randNum].Party + "-" + names[randNum].Region + ")</span>";

			if(randName != name && names[randNum].Gender == names[i].Gender && threeNames.indexOf(randName) == -1 ){
				threeNames.push(randName);
			}
		}
		
		threeNames.push(name);
		
		threeNames.sort(function(a,b){
			return Math.random() * 2 - 1
		}); 
		
		return threeNames;
	}


	function nextName(){

	var name = names[i].Name + " <span>(" + names[i].Party + "-" + names[i].Region + ")</span>";

	var options = getOptions(name);

	var hasGuessed = false;

	$("#track_place").html("Senator " + (i+1) + "/100");

	//passing it a blank string to reset values
	$(".guesses").html("");
	$("#image img").attr("src","img/" + names[i].Last_name.toLowerCase() + ".jpg")
	options.forEach(function(guess){
		
		//putting each "guess" into a new class that we definie in hard code as .guess. Have to 
		//use appendTo rather than append because of this-- can't define var otherwise?
		var guessButton = $("<div class = 'guess'>" + guess + "</div>").appendTo($(".guesses"));

		$(guessButton).click(function(){
			
			
			if(hasGuessed == false){

				hasGuessed = true;

				if(name == guess){
					//$("#answer").html("YEP!");
					correctGuesses++;
					$("#correct").html("Correct: <span>" + correctGuesses + "</span>");

					$(guessButton).addClass("green");
					$("#answer").prepend("<div class='bar bar_green'></div>");
					$(guessButton).append("<i class='fa fa-check-circle fa-right'></i>");
				}


				else{
					//$("#answer").html("NOPE");
					incorrectGuesses ++;
					$("#incorrect").html("Incorrect: <span>" + incorrectGuesses + "</span>");

					$(guessButton).addClass("red");
					
					//$(guessButton).append("<i class='fa fa-times fa-wrong'></i>");

					//adding on score bars
					$("#answer").append("<div class='bar bar_red'></div>");
					
					//turn correct answer green, after selecting wrong answer
					$(".guess").each(function(i, currentGuess){
						if($(currentGuess).html() == name){
							$(currentGuess).addClass("bold");
							$(currentGuess).append("<i class='fa fa-check-circle fa-right'></i>");
						}
					})


				}


				$(".next").addClass("show");
			}

		});

	})
				

	}




});








/*
var numbers = [34, 21, 53, 25];
numbers.sort(function(a,b){
	return b-a;
});

console.log(numbers);
*/