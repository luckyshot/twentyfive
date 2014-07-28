TimeTracker
================

### TimeTracker is a minimal time tracking tool focused on simplicity and a great UX that follows the principles of the Pomodoro Technique

The UI is heavily inspired by Juani's <a href="https://github.com/heyimjuani/html5timetracker">HTML5 Time Tracker</a> but has been redeveloped and redesigned from scratch to have the following features:

- increased performance and scalability
- got rid of jQuery and the Countdown plugin
- added a progress bar
- added a dynamic favicon that shows the status of the timer
- local storage is now stored in a single parameter as a unified JSON string
- fewer server requests for fast loading
- Timer is based on Date and not on JS timers (<a href="http://stackoverflow.com/a/6347336/217180">better accuracy</a>)
- Responsive design
- Mobile iOS Web App capable

Try it live on http://luckyshot.github.io/timetracker/

TODO
----------------

- web app icons
- save state to avoid safari reloading on awaking ( http://stackoverflow.com/questions/6930771/stop-reloading-of-web-app-launched-from-iphone-home-screen )
- Use ES5 array methods ( http://www.jimmycuadra.com/posts/ecmascript-5-array-methods )
- Settings page to edit Countdown?
- "END" favicon to draw attention by flashing/toggling colors



Credits
----------------

Heavily inspired by Juani Ruiz's HTML5 Time Tracker (https://github.com/heyimjuani/html5timetracker)
Tom Moor's Tinycon plugin (https://github.com/tommoor/tinycon)
