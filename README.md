TimeTracker
================

### TimeTracker is a minimal time tracking tool focused on simplicity and a great UX that follows the principles of the Pomodoro Technique

<img src="https://cloud.githubusercontent.com/assets/141241/3752283/4ad38e2c-1806-11e4-8f09-ddb2e9cdf47d.png" alt="List of completed tasks" width="320px"> .
<img src="https://cloud.githubusercontent.com/assets/141241/3752282/486f7bdc-1806-11e4-9f2a-e0d95e692c21.png" alt="Task timer" width="320px">
<img src="https://cloud.githubusercontent.com/assets/141241/3771174/bb1bc9c8-18f2-11e4-9afc-9070de7d4633.png" alt="Entering a task description" width="320px">

The UI is heavily inspired by Juani's <a href="https://github.com/heyimjuani/html5timetracker">HTML5 Time Tracker</a> but has been redeveloped and redesigned from scratch to have the following features:

- Desktop, Mobile & Web App
- Increased performance and scalability
- Pure JavaScript: no jQuery or Countdown plugin needed
- Progress bar
- Dynamic favicon and Document title that show the status of the timer
- Local Storage is now stored as a single unified JSON parameter
- Page loads faster thanks to fewer server requests
- Timer based on Date and not on unreliable JS timers (<a href="http://stackoverflow.com/a/6347336/217180">better accuracy</a>)
- Responsive Design
- Persistent timer (you can close the window and it will continue counting)

Try it live on http://luckyshot.github.io/timetracker/

TODO
----------------

- Browser Notifications ( https://developer.mozilla.org/en-US/docs/Web/API/notification )
- Use ES5 array methods ( http://www.jimmycuadra.com/posts/ecmascript-5-array-methods )
- Settings page to edit Countdown?
- "END" favicon to draw attention by flashing/toggling colors



Credits
----------------

- Heavily inspired by Juani Ruiz's <a href="https://github.com/heyimjuani/html5timetracker">HTML5 Time Tracker</a>
- Tom Moor's <a href="https://github.com/tommoor/tinycon">Tinycon plugin</a>
- The Financial Times's <a href="https://github.com/ftlabs/fastclick">FastClick</a>
