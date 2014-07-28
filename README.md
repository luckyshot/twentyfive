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

Try it live on http://luckyshot.github.io/timetracker/

TODO
----------------

- Settings page to edit Countdown
- END favicon to draw attention by flashing/toggling colors
- Timer to be based on Date and not on setInterval ( better accuracy, see http://stackoverflow.com/a/6347336/217180 )
- Responsive design
- Web app capable (so we can use it as a mobile webapp)


Credits
----------------

Heavily inspired by Juani Ruiz's HTML5 Time Tracker (https://github.com/heyimjuani/html5timetracker)
Tom Moor's Tinycon plugin (https://github.com/tommoor/tinycon)
