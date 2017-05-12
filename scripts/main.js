var CountdownClock = function(digits, options) {

	// SETUP

	var self = this; // hold reference to this so can use inside of fns

	options = options || {};

	this.time = digits || '0000'; // set default time if not provided - tens of minutes : minutes : tens of seconds : seconds:
	this.initialTime = this.time; // hold initial time for reset
	
	this.counter; // hold setInterval fn
	this.status = 0; // set initial status to paused (0) - time running (1)
	
	this.errorMsg = options.errorMsg || document.querySelector('#countdown-clock-error-msg'); // ui for error message
	
	this.number1 = options.number1 ||  document.querySelector('#location-one'); // set first number on stop clock
	this.number2 = options.number2 ||  document.querySelector('#location-two'); // set second number on stop clock
	this.number3 = options.number3 ||  document.querySelector('#location-three'); // set third number on stop clock
	this.number4 = options.number4 ||  document.querySelector('#location-four'); // set fourth number on stop clock

	this.number1Index; // hold first number index for classname
	this.number2Index; // hold second number index for classname
	this.number3Index; // hold third number index for classname
	this.number4Index; // hold fourth number index for classname

	this.digitClassNames = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']; // set digit class names for ui
	
	this.controls = options.controls || document.querySelector('.controls'); // set control container ui element
	this.startBtn = options.startBtn || true; // set start button
	this.pauseBtn = options.pauseBtn || true; // set pause button
	this.resetBtn = options.resetBtn || true; // set reset button

	if( self.startBtn ) {
		// start button set up 
		var startBtnEl = document.createElement('button');
		startBtnEl.setAttribute('id', 'start');
		startBtnEl.textContent = 'Start';

		startBtnEl.addEventListener('click', function() {
			self.start();
		});

		this.controls.appendChild(startBtnEl);
	}
		
	if( self.pauseBtn ) {
		// pause button set up
		var pauseBtnEl = document.createElement('button');
		pauseBtnEl.setAttribute('id', 'pause');
		pauseBtnEl.textContent = 'Pause';

		pauseBtnEl.addEventListener('click', function() {
			self.pause();
		});

		this.controls.appendChild(pauseBtnEl);
	}
		
	if( self.resetBtn ) {
		// reset button set up
		var resetBtnEl = document.createElement('button');
		resetBtnEl.setAttribute('id', 'reset');
		resetBtnEl.textContent = 'Reset';

		resetBtnEl.addEventListener('click', function() {
			self.reset();
		});

		this.controls.appendChild(resetBtnEl);
	}
	
	// calculate sizing of countdown clock

	this.digitWidth = Math.floor(window.innerWidth*0.028);
	this.containerDigitWidth = (this.digitWidth*5) + (this.digitWidth/10)*5 + (this.digitWidth/10)*5;
	this.containerDividerWidth = this.digitWidth + (this.digitWidth/10) + (this.digitWidth/10);
	this.containerHeight = (this.digitWidth*7) + (this.digitWidth/10)*14;
	this.containerTimerWidth = (this.containerDigitWidth*4) + (this.containerDividerWidth*5);

	// set up layout of countdown clock
	
	this.containerCountdownClock = options.containerCountdownClock || document.querySelector('.container-countdown-clock');
	this.containerDivider = options.containerDivider || document.querySelectorAll('.'+this.containerCountdownClock.className + ' .container-divider');
	this.containerDigit = options.containerDigit || document.querySelectorAll('.'+this.containerCountdownClock.className + ' .container-digit');
	
	// set up HTML
	
	this.containerDigit.forEach(function(containerDigit) {
		for( var i = 0; i < 35; i++ ) {
			var spanEl = document.createElement('span');
			spanEl.classList.add('digit');
			containerDigit.appendChild(spanEl);
		}	
	});
	
	this.containerDivider.forEach(function(containerDivider) {
		for( var i = 0; i < 7; i++ ) {
			if( !containerDivider.classList.contains('colon') ) {
				var spanEl = document.createElement('span');
				spanEl.classList.add('divider');
				containerDivider.appendChild(spanEl);
			} else {
				var spanEl = document.createElement('span');
				spanEl.classList.add('digit');
				containerDivider.appendChild(spanEl);
			}
			
		}	
	});
	
	// set up layout of countdown clock
	
	this.digit = options.digit || document.querySelectorAll('.digit');
	this.divider = options.divider || document.querySelectorAll('.divider');

	// set up styles of countdown clock

	this.containerCountdownClock.style.width = self.containerTimerWidth+'px';
	this.containerCountdownClock.style.height = self.containerHeight+'px';
	this.containerCountdownClock.style.padding = self.containerDividerWidth+'px';
	this.containerCountdownClock.style.border = '8px solid #aaa';
	this.containerCountdownClock.style.borderRadius = '5px';
	this.containerCountdownClock.style.backgroundColor = '#000';
	this.containerCountdownClock.style.overflow = 'hidden';
	
	this.containerDivider.forEach(function(containerDivider) {
		containerDivider.style.width = self.containerDividerWidth+'px';
		containerDivider.style.height = self.containerHeight+'px';
		containerDivider.style.float = 'left';
	});
	
	this.containerDigit.forEach(function(containerDigit) {
		containerDigit.style.width = self.containerDigitWidth+'px';
		containerDigit.style.height = self.containerHeight+'px';
		containerDigit.style.float = 'left';
	});
	
	this.divider.forEach(function(divider) {
		divider.style.width = self.digitWidth+'px';
		divider.style.height = self.digitWidth+'px';
		divider.style.margin = (self.digitWidth/10)+'px';
		divider.style.float = 'left';
		divider.style.borderRadius = '50%';
		divider.style.backgroundColor = '#222';
	});

	this.digit.forEach(function(digit) {
		digit.style.width = self.digitWidth+'px';
		digit.style.height = self.digitWidth+'px';
		digit.style.margin = (self.digitWidth/10)+'px';
		digit.style.float = 'left';
		digit.style.borderRadius = '50%';
	});
	
	// DISPLAY COUNTDOWN CLOCK
 
	try {

		// convert string numbers to integers and store them in array 
		this.timeArray = [];

		for(var i = 0; i < this.time.length; i++) {
			this.timeArray.push(Number(this.time.charAt(i)));
		}
		
		// action: Throw Error
		// conditional: timeArray has less than or more than 4 characters
		if(this.timeArray.length !== 4) {
			throw new Error('Countdown Clock only accepts 4 string numbers');

		} else {

			try {
				// set initial index of each digit
				this.number1Index = this.timeArray[this.timeArray.length-4];
				this.number2Index = this.timeArray[this.timeArray.length-3]; 
				this.number3Index = this.timeArray[this.timeArray.length-2]; 
				this.number4Index = this.timeArray[this.timeArray.length-1];

				// action: Throw Error
				// conditional: time variable does not contain all string numbers
				if(isNaN(this.number1Index) || 
				   isNaN(this.number2Index) || 
				   isNaN(this.number3Index) || 
				   isNaN(this.number4Index)) {
					throw new Error('Countdown Clock only accepts 4 string numbers');
				
				// action: Throw Error
				// conditional: time variable first number is > 6
				} else if(this.number1Index > 6) {
					throw new Error('the first number represents tens of minutes so cannot be higher than 6');

				// action: Throw Error
				// conditional: time variable third number is > 5
				} else if(this.number3Index > 5) {
					throw new Error('the third number represents tens of seconds so cannot be higher than 5');
				}
				
				// set up initial classes for ui to display digits
				this.number1.classList.add(this.digitClassNames[this.number1Index]);
				this.number2.classList.add(this.digitClassNames[this.number2Index]);
				this.number3.classList.add(this.digitClassNames[this.number3Index]);
				this.number4.classList.add(this.digitClassNames[this.number4Index]);

			} catch(err) {
				this.errorMsg.textContent = err.message;
			}
	
		}
		
	} catch (err) {
		this.errorMsg.textContent = err.message;
	}


	// ACTIONS

	this.start = function() {

		var self = this;

		// action: Status update to 1 (running)
		// conditional: status is 0 (paused)
		if(this.status === 0) {
			this.status = 1;

			// start countdown
			this.counter = window.setInterval(function() {

				// action: Time decrement by 1
				// conditional: time is > 0
				if (self.time > 0) {
					self.time = self.time - 1;

					// action: Number 4 decrement by 1
					// conditional: number 3 is > 0 and number 4 is not 0
					if (self.number4Index !== 0 && self.number3Index > 0) {

						self.number4.classList.remove(self.digitClassNames[self.number4Index]);
						self.number4.classList.add(self.digitClassNames[self.number4Index-1]);
						self.number4Index = self.number4Index-1;

					// action: Number 4 start at 9
					// action: Number 3 decrement by 1
					// conditional: number 4 is 0 and number 3 is > 0
					} else if (self.number4Index === 0 && self.number3Index > 0) {

						self.number3.classList.remove(self.digitClassNames[self.number3Index]);
						self.number3.classList.add(self.digitClassNames[self.number3Index-1]);
						self.number3Index = self.number3Index - 1;

						self.number4.classList.remove(self.digitClassNames[self.number4Index]);
						self.number4Index = 9;
						self.number4.classList.add(self.digitClassNames[self.number4Index]);

					// action: Time decrement by 40
					// action: Number 2 decrement by 1
					// action: Number 3 is 5
					// action: Number 4 is 9
					// conditional: number 4 is 0 and number 3 is 0 and number 2 > 0
					} else if (self.number4Index === 0 && 
							   self.number3Index === 0 && 
							   self.number2Index > 0) {
						
						// account for difference in countdown time (99 count) and adjust to match digits
						self.time = self.time - 40;

						self.number2.classList.remove(self.digitClassNames[self.number2Index]);
						self.number2.classList.add(self.digitClassNames[self.number2Index-1]);
						self.number2Index = self.number2Index - 1;

						self.number3.classList.remove(self.digitClassNames[self.number3Index]);
						self.number3Index = 5;
						self.number3.classList.add(self.digitClassNames[self.number3Index]);

						self.number4.classList.remove(self.digitClassNames[self.number4Index]);
						self.number4Index = 9;
						self.number4.classList.add(self.digitClassNames[self.number4Index]);

					// action: Time decrement by 40
					// action: Number 1 decrement by 1
					// action: Number 2 is 9
					// action: Number 3 is 5
					// action: Number 4 is 9
					// conditional: number 4 is 0 and number 3 is 0 and number 2 > 0
					} else if (self.number4Index === 0 && 
							   self.number3Index === 0 && 
							   self.number2Index === 0 && 
							   self.number1Index > 0) {

						// account for difference in countdown time (99 count) and adjust to match digits
						self.time = self.time - 40;
						self.number1.classList.remove(self.digitClassNames[self.number1Index]);
						self.number1.classList.add(self.digitClassNames[self.number1Index-1]);
						self.number1Index = self.number1Index - 1;

						self.number2.classList.remove(self.digitClassNames[self.number2Index]);
						self.number2Index = 9;
						self.number2.classList.add(self.digitClassNames[self.number2Index]);

						self.number3.classList.remove(self.digitClassNames[self.number3Index]);
						self.number3Index = 5;
						self.number3.classList.add(self.digitClassNames[self.number3Index]);

						self.number4.classList.remove(self.digitClassNames[self.number4Index]);
						self.number4Index = 9;
						self.number4.classList.add(self.digitClassNames[self.number4Index]);

					// action: Number 4 decrement by 1
					// conditional: number 4 > 0 and number 3 is 0
					} else if (self.number4Index > 0 && self.number3Index === 0) {

						self.number4.classList.remove(self.digitClassNames[self.number4Index]);
						self.number4.classList.add(self.digitClassNames[self.number4Index-1]);
						self.number4Index = self.number4Index-1;

					// action: Number 4 decrement by 1
					// conditional: number 4 > 0 and number 3 is 0 and number 2 is 0
					} else if (self.number4Index > 0 && 
							   self.number3Index === 0 && 
							   self.number2Index === 0) {

						self.number4.classList.remove(self.digitClassNames[self.number4Index]);
						self.number4.classList.add(self.digitClassNames[self.number4Index-1]);
						self.number4Index = self.number4Index-1;

					// action: Number 4 decrement by 1
					// conditional: number 4 > 0 and number 3 is 0 and number 2 is 0 and number 1 is 0
					} else if (self.number4Index > 0 && 
							   self.number3Index === 0 && 
							   self.number2Index === 0 && 
							   self.number1Index === 0) {

						self.number4.classList.remove(self.digitClassNames[self.number4Index]);
						self.number4.classList.add(self.digitClassNames[self.number4Index-1]);
						self.number4Index = self.number4Index-1;
					}

				// action: Stop countdown
				// conditional: time is 0
				} else {
					clearInterval(self.counter);
				}

			}, 1000); // end setInterval fn

		}

	}; // end start fn
	
	this.pause = function() {

		// action: Status update to 0 (paused)
		// action: Counter cleared (interval stopped)
		// conditional: status is 1 (running)
		if(this.status === 1) {
			this.status = 0;

			clearInterval(this.counter);
		}

    };
    
    this.reset = function() {
		
		clearInterval(this.counter);

		// remove current classes associated with digits
		this.number1.classList.remove(this.digitClassNames[this.number1Index]);
		this.number2.classList.remove(this.digitClassNames[this.number2Index]);
		this.number3.classList.remove(this.digitClassNames[this.number3Index]);
		this.number4.classList.remove(this.digitClassNames[this.number4Index]);
		
		// convert string numbers to integers and store them in an array 
		var timeArray = [];

		for(var i = 0; i < this.initialTime.length; i++) {
			timeArray.push(Number(this.initialTime.charAt(i)));
		}
				
		// set initial index of each number
		this.number1Index = timeArray[this.timeArray.length-4];
		this.number2Index = timeArray[this.timeArray.length-3]; 
		this.number3Index = timeArray[this.timeArray.length-2]; 
		this.number4Index = timeArray[this.timeArray.length-1];
        
        // add classes associated with digits
		this.number1.classList.add(this.digitClassNames[this.number1Index]);
		this.number2.classList.add(this.digitClassNames[this.number2Index]);
		this.number3.classList.add(this.digitClassNames[this.number3Index]);
		this.number4.classList.add(this.digitClassNames[this.number4Index]);
		
		// set status to paused (0)
		this.status = 0;
		
		// set time variable used in countdown to be initial time
		this.time = this.initialTime;

    };

};

// Instantiate a countdown clock

document.addEventListener("DOMContentLoaded", function() {	

	// Default Example
	new CountdownClock('0010');

	// Custom Example
	new CountdownClock('0025', {
		containerCountdownClock: document.querySelector('.another-container-countdown-clock'),
		number1: document.querySelector('#another-location-four'),
		number2: document.querySelector('#another-location-three'),
		number3: document.querySelector('#another-location-two'),
		number4: document.querySelector('#another-location-one'),
		controls: document.querySelector('.another-controls'),
		errorMsg: document.querySelector('#another-countdown-clock-error-msg')
	});

});



