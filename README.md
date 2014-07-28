TimeTracker
================

### TimeTracker is a minimal time tracking tool focused on simplicity and a great UX that follows the principles of the Pomodoro Technique

The UI is heavily inspired by Juani's <a href="https://github.com/heyimjuani/html5timetracker">HTML5 Time Tracker</a> but has been redeveloped and redesigned from scratch to have the following features:

- Increased performance and scalability
- Pure JavaScript: no jQuery or Countdown plugin needed
- Progress bar
- Dynamic favicon and Document title that show the status of the timer
- Local Storage is now stored as a single unified JSON parameter
- Page loads faster thanks to fewer server requests
- Timer based on Date and not on unreliable JS timers (<a href="http://stackoverflow.com/a/6347336/217180">better accuracy</a>)
- Responsive Design
- Mobile iOS Web App capable
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
