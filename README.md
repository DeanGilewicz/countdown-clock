## COUNTDOWN CLOCK

### File Structure:

The dist folder provides all of the necessary files for inclusion in your project.

** /dist
- css
	- main.min.css
	- main.min.css.map


- js
	- main.min.js
	- main.min.js.map


- index.html


### HTML:

Within the Countdown Clock dist folder is the index.html file that provides an example of the default HTML markup and a custom example of HTML markup that can be used in your project. It is recommended for the default markup to be included in your project to begin with.


### CSS:

The main.min.css file provides the main styles and layout for the Countdown Clock and must be included in your project.


### JavaScript:

The main.min.js file provides the logic for the Countdown Clock and must be included in your project.


### Using Countdown Clock: 

To instantiate an instance of the Countdown Clock, simply pass in a string of 4 numbers as the first parameter.
```
document.addEventListener("DOMContentLoaded", function() {	
    new CountdownClock('0010');
});
```
Countdown Clock also accepts a second parameter - an options object - that can be used to customize the Countdown Clock.

```
document.addEventListener("DOMContentLoaded", function() {

	// defaults

	var options = {
		errorMsg: document.querySelector('#countdown-clock-error-msg'),
		number1: document.querySelector('#location-one'),
		number2: document.querySelector('#location-two'),
		number3: document.querySelector('#location-three'),
		number4: document.querySelector('#location-four'),
		controls: document.querySelector('.controls'),
		startBtn: true,
		pauseBtn: true,
		resetBtn: true,
		containerCountdownClock: document.querySelector('.container-countdown-clock'),
		containerDivider: document.querySelectorAll('.' + classNameOfcontainerCountdownClock + ' .container-divider'),
		containerDigit: document.querySelectorAll('.' + classNameOfcontainerCountdownClock + ' .container-digit'),
		digit: document.querySelectorAll('.'+this.containerCountdownClock.className + ' .digit'),
		divider: document.querySelectorAll('.'+this.containerCountdownClock.className + ' .divider')
	}

	new CountdownClock('0010', options);
});
```
