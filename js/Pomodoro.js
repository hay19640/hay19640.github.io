
var Sound = function() {
    function Sound(context) {
  
      this.context = context;
    }
  
    Sound.prototype.setup = function setup() {
      this.oscillator = this.context.createOscillator();
      this.gainNode = this.context.createGain();
  
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.context.destination);
      this.oscillator.type = 'sine';
    };
  
    Sound.prototype.play = function play(value) {
      this.setup();
  
      this.oscillator.frequency.value = value;
      this.gainNode.gain.setValueAtTime(0, this.context.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(1, this.context.currentTime + 0.01);
  
      this.oscillator.start(this.context.currentTime);
      this.stop(this.context.currentTime);
    };
  
    Sound.prototype.stop = function stop(time = 1) {
      this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + time);
      this.oscillator.stop(this.context.currentTime + time);
    };
  
    return Sound;
  }();
  
  var context = new (window.AudioContext || window.webkitAudioContext || false)();
  
  if(!context) { 
    alert('Sorry, but the Web Audio API is not supported by your browser.'
          + ' Please, consider downloading the latest version of '
          + 'Google Chrome or Mozilla Firefox');
  
  }
  
  function playSound(note, time = 1000) {
    var sound = new Sound(context);
    sound.play(note);
    sound.stop(time/1000);
  }
  
  
  var secondsCircle = document.getElementById("seconds_circle");
  var minutesCircle = document.getElementById("minutes_circle");
  var minuteText    = document.getElementById("minute_text");
  var secondText    = document.getElementById("second_text");
  var sub           = document.getElementById("sub");
  var plus          = document.getElementById("plus");
  var timerDisplay  = document.getElementById("minuteCount");
      timerDisplay  = timerDisplay.childNodes[0];
  
  var start = document.getElementById("start");
  
  
      secondsCircle.style.strokeDashoffset = 0;
      minutesCircle.style.strokeDashoffset = 500;
  
  
  
  
  var timerValue = 25; // User customizible timer value
  var activeTimer; // Assigned to setTimeout later
  var timerIsActive = false; // Currently counting down?
  
  
  
  var notes = { 
    "g#4" : 415.30,
    "f#4" : 369.99,
    "e4"  : 329.63, 
    "b3"  : 246.94
  };
  
  function playWQ(){ 
    playSound(notes["e4"]);
    secondsCircle.style.strokeDashoffset = 375; 
    //secondsCircle.style.stroke = "#4CF2D8";
    setTimeout(function(){ playSound(notes["g#4"]);
                           secondsCircle.style.strokeDashoffset = 250; 
                         }, 500);
    setTimeout(function(){ playSound(notes["f#4"]);
                           secondsCircle.style.strokeDashoffset = 125; 
                         }, 1000);
    setTimeout(function(){ playSound(notes["b3"], 2000);
                           secondsCircle.style.strokeDashoffset = 0; 
                         }, 1500);
    setTimeout(function(){ playSound(notes["e4"]);
                           minutesCircle.style.strokeDashoffset = 125; 
                         }, 2500); 
    setTimeout(function(){ playSound(notes["f#4"]);
                           minutesCircle.style.strokeDashoffset = 250; 
                         }, 3000);
    setTimeout(function(){ playSound(notes["g#4"]);
                           minutesCircle.style.strokeDashoffset = 375; 
                         }, 3500);
    setTimeout(function(){ playSound(notes["e4"], 2000);
                           minutesCircle.style.strokeDashoffset = 500;  
                         }, 4000);
      setTimeout(function(){ 
                            secondsCircle.classList.remove("wq");
                            minutesCircle.classList.remove("wq");
                            timerIsActive = false;
                         }, 4250);
  }
  
  sub.onclick = function(){
    if(timerValue > 1) { 
      timerValue--; 
      timerDisplay.innerHTML = timerValue; 
      if (!timerIsActive){
        minuteText.innerHTML = zeroPad(timerValue);
      }
    }
  };

  plus.onclick = function(){
    if(timerValue < 60) { 
      timerValue++; 
      timerDisplay.innerHTML = timerValue; 
      if (!timerIsActive){
        minuteText.innerHTML = zeroPad(timerValue);
      }
    }
  };
  
  function timerCountdown(goal, base){
    var now =  new Date().getTime();
    var timeLeft = goal - now;
    var seconds = Math.floor((timeLeft / 1000) % 60);
    var minutes = Math.floor((timeLeft / 1000 / 60) % 60);
     
    if(timeLeft <= 0){ // Time's up!!
       resetDisplay(500, 0, false);
       secondsCircle.classList.add("wq"); 
       minutesCircle.classList.add("wq"); 
       setTimeout(function(){playWQ();}, 250); 
       return;
     }
      activeTimer = setTimeout(function(){
        timerIsActive = true;
        secondText.innerHTML = ":" + zeroPad(seconds); 
        minuteText.innerHTML =  zeroPad(minutes); 
        if(seconds === 0){seconds = 60;} 
        var secondsCircle_length = 500 - ((seconds/60) * 500) 
        var minutesCircle_length = 500 - (( (base - timeLeft) / base) * 500);
        secondsCircle.style.strokeDashoffset = secondsCircle_length;
        minutesCircle.style.strokeDashoffset = minutesCircle_length;
        timerCountdown(goal, base)
      }, 1000)
  }

  function zeroPad(n) {
    n = n + '';
    return n.length >= 2 ? n : new Array(2 - n.length + 1).join(0) + n;
  }
  
  start.onclick = function(){
    if(!timerIsActive){  
      var now       = new Date();
      var unixStart = now.getTime();
      var baseGoal  = (timerValue *60000);
      var unixGoal  = unixStart + baseGoal;
      timerCountdown(unixGoal, baseGoal);
      start.innerHTML = "Reset Timer";
    } else {
      timerIsActive = false;
      resetDisplay();
    }
  };
  
  
  function resetDisplay(secondHand = 0, minuteHand = 500, updateMin = true){
    start.innerHTML = "Start Timer";
    secondText.innerHTML = ":00";
    if(updateMin){minuteText.innerHTML = zeroPad(timerValue);}
    secondsCircle.style.strokeDashoffset = secondHand;
    minutesCircle.style.strokeDashoffset = minuteHand;
    clearTimeout(activeTimer);
  }