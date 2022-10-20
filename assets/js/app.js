/*!
  TwentyFive - Minimal Pomodoro HTML5 time tracker
  Xavi Esteve, http://xaviesteve.com/
  Copyright (c) 2014 Xavi Esteve
  @license MIT Licensed
*/



var TF;

; (function (doc, win) {

    'use strict';

    var gId = function (id) {
        return document.getElementById(id);
    }

    var TT = {

        defaultDb: {
            config: {
                cycle: 25 * 60 * 1000, // ms
                status: 'idle', // idle, running,
                currentTask: {
                    start: 0,
                    end: 0,
                    duration: 0, // used on save
                    countdown: 0, // used during countdown, cleared on save
                    title: ''
                }
            },
            tasks: []
        },
        db: null,
        t: 0, // stores the timer instance
        tR: 0, // stores the resting timer instance

        notification: null, // stores the Desktop Browser Notification

        currentDay: null, // stores day for daySeparator
        currentMinute: null, // stores current countdown minute
        lastTaskStart: 0, //

        tinyconOptionsRunning: {
            width: 6,
            height: 9,
            font: '9px helvetica',
            colour: '#ffffff',
            background: '#1abc9c'
        },
        tinyconOptionsEnd: {
            width: 7,
            height: 70,
            font: '7px helvetica',
            colour: '#ffffff',
            background: '#e74c3c'
        },

        monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

        /**
         * Displays the specified page and hides the others
         */
        selectView: function (page) {
            doc.body.className = page;

            if (page === 'list') {
                doc.title = 'TwentyFive';
                TT.timeResting();
                TT.tR = window.setInterval(function () { TT.timeResting(); }, 5000);
            } else if (page === 'welcome') {
                doc.title = 'TwentyFive';
            } else if (page == 'naming') {
                var element = gId('taskTitle');
                var past_the_end_pos = element.value.length;
                element.focus();
                element.setSelectionRange(past_the_end_pos, past_the_end_pos);
            }
        },


        /**
         * Converts miliseconds to m:ss format
         */
        msToTime: function (ms) {
            var s = parseInt(ms / 1000);
            if (s > 3599) {
                var hh, mm, ss;
                hh = Math.floor(s / 3600);
                s %= 3600;
                mm = Math.floor(s / 60),
                    ss = s % 60;
                return hh + ':' + ('0' + mm).slice(-2) + ':' + ('0' + ss).slice(-2);
            } else {
                return parseInt(s / 60) + ':' + ('0' + s % 60).slice(-2);
            }
        },


        /**
         * Converts miliseconds to '8 minutes' format
         */
        niceTime: function (ms) {
            var i = 0,
                s = ms / 1000,
                periods = [
                    { name: "second", length: 1, max: 90 },
                    { name: "minute", length: 60, max: 60 * 90 },
                    { name: "hour", length: 3600, max: 3600 * 32 },
                    { name: "day", length: 86400, max: 86400 * 45 },
                    { name: "month", length: 3600 * 24 * 30, max: 3600 * 24 * 30 * 18 },
                    { name: "year", length: 3600 * 24 * 30 * 12 }
                ],
                result;

            for (; i < periods.length; i++) {
                if (typeof periods[i].max !== 'undefined' && s < periods[i].max) {
                    result = Math.round(s / periods[i].length);
                    result += (result !== 1) ? ' ' + periods[i].name + 's' : ' ' + periods[i].name;
                    return result;
                }
            }
            return '';
        },


        /**
         * User has clicked Start Task, get everything ready and start timer
         */
        startCountdown: function () {
            gId('clock').innerHTML = TT.msToTime(TT.db.config.cycle);

            clearInterval(TT.tR);

            gId('bar').style.width = 0;

            TT.startTimer();
            TT.selectView('countdown');
        },


        /**
         * User clicks Done
         */
        finishCountdown: function () {

            TT.selectView('naming');

            clearInterval(TT.t);

            Tinycon.setBubble('END');
            Tinycon.setOptions(TT.tinyconOptionsEnd);

        },


        /**
         * User clicks Cancel
         */
        cancelCountdown: function () {
            TT.selectView('list');
            TT.resetCountdown();
        },

        /**
         * Common operations when finishing or canceling countdown
         */
        resetCountdown: function () {
            clearInterval(TT.t);
            Tinycon.reset();
            TT.currentMinute = null;
            TT.db.config.status = 'idle';
            TT.saveDatabase();
        },


        /**
         * Create a timer interval instance
         */
        startTimer: function () {

            if (TT.db.config.status != 'running') {
                TT.db.config.currentTask = {
                    start: Date.now(),
                    countdown: TT.db.config.cycle,
                    end: Date.now() + TT.db.config.cycle
                };
            }

            Tinycon.setOptions(TT.tinyconOptionsRunning);

            gId('estimate').innerHTML = TT.timestampToDate(TT.db.config.currentTask.start) + ' - ' + TT.timestampToDate(TT.db.config.currentTask.end);

            TT.timerTick();
            TT.t = window.setInterval(TT.timerTick, 1000);
            TT.db.config.status = 'running';
        },


        /**
         * Take care of refreshing and monitoring
         */
        timerTick: function () {

            var progress = '',
                currentMinute;

            if (parseInt(TT.db.config.currentTask.countdown / 1000) == parseInt((TT.db.config.currentTask.start + TT.db.config.cycle - Date.now()) / 1000)) return false;

            TT.db.config.currentTask.countdown = parseInt(TT.db.config.currentTask.start + TT.db.config.cycle - Date.now());


            if (TT.db.config.currentTask.countdown < 1000 && doc.body.classList.contains('naming')) {
                doc.title = (doc.title.indexOf('Finished') > -1 && TF.audio.loop == true) ? '▉▉▉▉▉▉▉▉▉▉▉▉▉' : '[' + TT.msToTime(Date.now() - TT.db.config.currentTask.start) + '] Finished!';

                // will run only once when timer reaches 0
            } else if (TT.db.config.currentTask.countdown < 1000) {
                TT.selectView('naming');

                if (Notification && Notification.permission === 'default') {
                    Notification.requestPermission(function (permission) {
                        Notification.permission = permission;
                    });
                }

                if (Notification && Notification.permission === 'granted') {
                    TT.notification = new Notification('TwentyFive finished!', {
                        body: 'You have worked for 25 minutes in a task, take a rest.',
                        icon: 'assets/image/apple-touch-icon-72x72.png',
                        tag: 'timerFinished'
                    });
                }

                Tinycon.setBubble('END');
                Tinycon.setOptions(TT.tinyconOptionsEnd);

                doc.body.classList.add('danger');

                win.addEventListener('mousemove', TT.windowFocused);
                win.addEventListener('touchstart', TT.windowFocused);

                if (typeof TT.audio === 'undefined') { TT.audio = new Audio("assets/sound/alert.mp3"); }
                TT.audio.loop = true;
                TT.audio.play();

            } else {

                gId('clock').innerHTML = TT.msToTime(TT.db.config.currentTask.countdown);
                doc.title = '▶ [' + TT.msToTime(TT.db.config.currentTask.countdown) + '] TwentyFive';

                progress = (100 - (TT.db.config.currentTask.countdown / TT.db.config.cycle * 100));
                gId('bar').style.width = progress + '%';
                //gId('bar').innerHTML = Math.round(progress)+'<small>%</small>';
                gId('progress').title = Math.round(progress) + '%';

                // Updates bubble on minute change and not every second
                currentMinute = parseInt(TT.db.config.currentTask.countdown / 60 / 1000);
                if (TT.currentMinute != currentMinute) {
                    TT.currentMinute = currentMinute;
                    Tinycon.setBubble((TT.currentMinute === 0) ? 'O' : TT.currentMinute);
                }
            }

            TT.saveDatabase();
        },


        /**
         * Gets task title and stores the task in the DB
         */
        saveNaming: function () {

            //TT.windowFocused(); // remove if not needed

            TT.db.config.currentTask.title = gId('taskTitle').value;
            TT.db.config.currentTask.end = Date.now();
            TT.db.config.currentTask.duration = TT.db.config.cycle - TT.db.config.currentTask.countdown;
            delete TT.db.config.currentTask.countdown;

            // Add task at the beginning
            TT.db.tasks.unshift(TT.db.config.currentTask);

            TT.resetCountdown();

            TT.refreshList();
            TT.selectView('list');
        },

        /**
         * Processes Enter keypress on taskTitle input field
         */
        saveNamingKeyUp: function (e) {
            if (e.key === "Enter") {
                TT.saveNaming();
            }
        },


        /**
         * Reloads the task list
         */
        refreshList: function () {

            var taskListHtml = '',
                namingSuggestions = [],
                namingSuggestionsHtml = '',
                liPadding;

            TT.lastTaskStart = 0;
            if (TT.db.tasks.length === 0) {
                return false;
            }
            for (var i = 0; i < TT.db.tasks.length; i++) {

                if (TT.db.tasks[i].title && namingSuggestions.indexOf(TT.db.tasks[i].title) === -1 && namingSuggestions.length < 5) {
                    namingSuggestions.push(TT.db.tasks[i].title);
                    namingSuggestionsHtml += '<li>' + TT.db.tasks[i].title + '</li>';
                }

                liPadding = Math.round(TT.db.tasks[i].duration / 30000);
                liPadding = (liPadding < 30) ? 30 : liPadding;
                liPadding = (liPadding > 100) ? 100 : liPadding;

                taskListHtml +=
                    TT.timeBetween(TT.db.tasks[i].start, TT.db.tasks[i].end) +
                    '<li style="padding-top:' + (liPadding - 10) + 'px;padding-bottom:' + liPadding + 'px;">' +
                    '<p class="title">' + TT.db.tasks[i].title + '</p>' +
                    '<p class="detail">' +
                    '<span class="interval">' + TT.niceTime(TT.db.tasks[i].duration) + '</span>' +
                    TT.timestampToDate(TT.db.tasks[i].start) + ' - ' +
                    TT.timestampToDate(TT.db.tasks[i].end) +
                    '</p>' +
                    TT.daySeparator(TT.db.tasks[i].start) +
                    '<a href="#" class="delete" title="Remove this task" data-id="' + i + '" data-action="deleteTask">✖</a>' +
                    '</li>';
            }

            gId('taskList').innerHTML = taskListHtml;
            gId('suggestionList').innerHTML = namingSuggestionsHtml;
        },


        /**
         * Used in the taskList to show the user it is a new day
         * If date passed belongs to a new day it outputs it
         */
        timeBetween: function (start, end) {
            var result,
                padding,
                rest = TT.lastTaskStart - end;

            if (TT.lastTaskStart === 0) {
                result = '';
            } else {
                result = TT.niceTime(rest);
                padding = Math.round(rest / 180000);
                padding = (padding < 0) ? 0 : padding;
                padding = (padding > 100) ? 100 : padding;
            }

            TT.lastTaskStart = start;

            return '<p class="timebetween" style="padding: ' + padding + 'px 0">' + result + '</p>';
        },


        /**
         * Calculates how much time has passed since last task and puts it on top of the list
         */
        timeResting: function () {
            if (TT.db.tasks.length == 0) return;
            gId('timeResting').innerHTML = '<p class="timebetween">' + TT.niceTime(Date.now() - TT.db.tasks[0].end) + '</p>';
        },


        /**
         * Used in the taskList to show the user it is a new day
         * If date passed belongs to a new day it outputs it
         */
        daySeparator: function (date) {
            var date = new Date(date);
            if (TT.currentDay != date.getDay()) {
                TT.currentDay = date.getDay();
                return '<p class="date"><span class="day">' + date.getDate() + '</span> <span class="month">' + TT.monthNames[date.getMonth()].substr(0, 3) + '</span></p>'
            }
            return '';
        },


        /**
         * User clicked on the ul#taskList
         */
        taskClick: function (e) {
            var data = e.target.dataset;

            // User clicked Delete button
            if (data.action === 'deleteTask') {
                if (!confirm('Do you want to delete this task?')) return false;
                TT.db.tasks.splice(data.id, 1);
                TT.saveDatabase();
                TT.refreshList();
                e.preventDefault();

                // Clicked somewhere else
            } else {
                return false;
            }
        },



        /**
         *
         */
        suggestionClick: function (e) {
            if (e.target.tagName !== 'LI') return;
            gId('taskTitle').value = e.target.innerHTML;
        },

        

        /**
         * Loads the database, if no database loads default values
         */
        loadDatabase: function () {
            var lsDb = localStorage.getItem('TwentyFive');
            TT.db = (lsDb) ? JSON.parse(lsDb) : TT.defaultDb;
        },

        /**
         * Stores the database in localStorage
         */
        saveDatabase: function () {
            localStorage.setItem('TwentyFive', JSON.stringify(TT.db));
        },

        exportDatabase: function () {
            win.prompt("Copy to clipboard: Ctrl+C, Enter", JSON.stringify(TT.db));
        },

        importDatabase: function () {
            var input = win.prompt("Paste from clipboard: Ctrl+V, Enter");
            if (input === null) {
                // User cancelled the input.
                return;
            }

            // Invariant: `input` is not `null`.

            var errorMessage = "Input is invalid. Nothing got imported. Please make sure you exported the data from another twentyfive instance.";

            var parsedInput = null;
            try {
                parsedInput = JSON.parse(input);
            } catch (e) {
                if (e instanceof SyntaxError) {
                    win.alert(errorMessage);
                    return;
                } else {
                    throw e;
                }
            }
            if (parsedInput === null || parsedInput.constructor != Object) {
                win.alert(errorMessage);
                return;
            }

            // Invariant: `parsedInput` is an `Object`.

            // Take the default DB and update its keys from `parsedInput`. This
            // is to make sure that invalid inputs like `{}` don't remove
            // default keys, breaking the whole app.
            TT.db = Object.assign(TT.defaultDb, parsedInput);
            TT.saveDatabase();

            TT.refreshList();
            if (TT.db.tasks.length == 0) {
                TT.selectView('welcome');
            } else {
                TT.selectView('list');
            }
        },

        /**
         * Deletes the database
         */
        clearDatabase: function () {
            if (!confirm('Do you want to reset all data?')) return false;
            localStorage.removeItem('TwentyFive');
            TT.loadDatabase();
            TT.refreshList();
        },



        /**
         * Converts a timestamp to H:MM format
         */
        timestampToDate: function (timestamp) {
            var date = new Date(timestamp);
            return date.getHours() + ':' + ('0' + date.getMinutes()).slice(-2);
        },


        /**
         * When timer has finished an audio loop is started until the user
         * gets back to the window, then this is fired
         */
        windowFocused: function () {
            doc.body.classList.remove('danger');

            win.removeEventListener('mousemove', TT.windowFocused);
            win.removeEventListener('touchstart', TT.windowFocused);

            TT.audio.loop = false;
            TT.audio.pause();
        },

        /**
         * DOM Events
         */
        initEvents: function () {
            // Page Welcome
            gId('startCountdownWelcome').addEventListener('click', TT.startCountdown);

            // Page List
            gId('startCountdown').addEventListener('click', TT.startCountdown);
            gId('exportDatabase').addEventListener('click', TT.exportDatabase);
            gId('importDatabase').addEventListener('click', TT.importDatabase);
            gId('clearDatabase').addEventListener('click', TT.clearDatabase);
            gId('taskList').addEventListener('click', TT.taskClick);

            // Page Countdown
            gId('finishCountdown').addEventListener('click', TT.finishCountdown);
            gId('cancelCountdown').addEventListener('click', TT.cancelCountdown);

            // Page Naming
            gId('taskTitle').addEventListener('keyup', TT.saveNamingKeyUp);
            gId('saveNaming').addEventListener('click', TT.saveNaming);
            gId('cancelNaming').addEventListener('click', TT.cancelCountdown);
            gId('suggestionList').addEventListener('click', TT.suggestionClick);

            // FastClick
            win.addEventListener('load', function () {
                FastClick.attach(doc.body);
            }, false);
        },


        /**
         * Starts app
         */
        init: function () {
            TT.initEvents();
            TT.db = TT.defaultDb;
            TT.loadDatabase();
            TT.refreshList();

            if (TT.db.config.status === 'idle' && TT.db.tasks.length == 0) {
                TT.selectView('welcome');
            } else {
                TT.startCountdown();
            }
        }
    };

    TF = TT;
    TF.init();


}(document, window));

function myFunction(){
    alert("Are you sure to cancel?")
    }