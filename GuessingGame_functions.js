var generateWinningNumber = function(){
    var winner = Math.floor(Math.random()*100);
    //winner = (winner===0)? 1 : winner;
    return winner+1;
};

var shuffle = function(anArray){

    for(let m = anArray.length-1; m>=0; m--){

        let randomSelector = Math.floor(Math.random()*(m+1));
        console.log(randomSelector);
        let remember_m = anArray[m];
        anArray[m]=anArray[randomSelector];
        anArray[randomSelector] = remember_m;
    }
    return anArray;
}

var Game = function(){
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
};

Game.prototype.difference = function(){
    return Math.abs(this.winningNumber - this.playersGuess);
};
Game.prototype.isLower = function(){
    return this.playersGuess < this.winningNumber;
};
Game.prototype.playersGuessSubmission = function(g){
    if(g>0 && g<=100) this.playersGuess = g;
    else throw 'That is an invalid guess.';
    return this.checkGuess();
};

////these will be reattached in the reset Event Handler, detached during checkGuess

var closeShop = function(){
    hintAttach = $('#hint').detach();
    submitAttach = $('button#submit').detach();
    $('button#submit').prop('disabled',true);
    $('#guess-input').prop('disabled',true);
    $('h2').text('Hit reset to play again!');
};


Game.prototype.checkGuess = function(){
    if (this.pastGuesses.includes(this.playersGuess)) return 'You have already guessed that number.';
    
    this.pastGuesses.push(this.playersGuess);

    if(this.playersGuess === this.winningNumber){
        closeShop();
        $('h1').css({'font-size':'8em','color':'white'});
        $('#guess-input').css({'animation-name': 'rise', 'background-color':'#ffffcc'});
        return 'You Win!'; 
    } else if(this.pastGuesses.length>=5){
        closeShop();
        return 'You Lose.';
    }
    
    if(this.playersGuess>this.winningNumber){
        $('h2').text('Guess lower!');
    } else $('h2').text('Guess higher!');
    
    if(this.difference()<10) return 'You\'re burning up!';
    else if(this.difference()<25) return 'You\'re lukewarm.';
    else if(this.difference()<50) return 'You\'re a bit chilly.';
    else if(this.difference()<100) return 'You\'re ice cold!';
    else return 'string';
};

var newGame = function(){
    return new Game();
};

Game.prototype.provideHint = function(){
    var createArr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
    return shuffle(createArr);
};


console.log(shuffle([4,6,97,8,11,12]));
////JQuery Begins

function sendGuess(aGame){
    var aGuess = $('#guess-input').val();
    console.log(aGuess);
    $('#guess-input').val('');
    $('h1').text(aGame.playersGuessSubmission(parseInt(aGuess,10)));
    $('.guess li:nth-child('+aGame.pastGuesses.length+')').text(aGuess);
};

var detached;
var hintAttach;
var submitAttach;

$(document).ready(function(){ 

    var ourGame = new Game();
    detached = $('#hint-list').detach();

    $('#submit').click(function(e){
        sendGuess(ourGame);
        $('#hint-list').detach();
    });
    $('#reset').click(function(e){
        ourGame = new Game();
        $('h1').text('Moonrise Guessing Game!');
        $('h2').text('Let\'s play!');
        $('li').each(function(idx){
            $('li:nth-child('+(idx+1)+')').text('x');
        });
        $('#menu-btns').append(hintAttach);
        $('#input-parent').append(submitAttach);
        $('button#submit').prop('disabled',false);
        $('#guess-input').prop('disabled',false);
        $('#hint-list').detach();
        $('h1').css({'font-size':'2.5em','color':'black'});
        $('#guess-input').css({'background-color':'white'});
    })
    $('#hint').click(function(){
        $('body').prepend(detached);
        var hints = ourGame.provideHint();
        $('#hint-list li').each(function(idx){
            $('#hint-list li:nth-child('+(idx+1)+')').text(hints[idx]);
        });

    })
});


//// Debugging

// var test = new Game();

// test.winningNumber = 11;
// console.log(test.playersGuessSubmission(8));
// console.log(test.playersGuessSubmission(45));
// console.log(test.playersGuessSubmission(45));
// console.log(test.playersGuessSubmission(11));
// console.log(test.playersGuessSubmission(30));
// console.log(test.playersGuessSubmission(67));

// console.log(test.pastGuesses);
