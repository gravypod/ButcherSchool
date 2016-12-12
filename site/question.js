/*
This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software Foundation,
Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301  USA

Copyright (c) 2016 Joshua Katz
*/

/////////////////////// POLYFILLS

if (!Array.prototype.filter) {
  Array.prototype.filter = function(fun) {
    'use strict';

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++) {
      if (i in t) {
        var val = t[i];

        // NOTE: Technically this should Object.defineProperty at
        //       the next index, as push can be affected by
        //       properties on Object.prototype and Array.prototype.
        //       But that method's new, and collisions should be
        //       rare, so use the more-compatible alternative.
        if (fun.call(thisArg, val, i, t)) {
          res.push(val);
        }
      }
    }

    return res;
  };
}

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

/////////////////////// POLYFILLS

var NEEDED_TILL_MEMORIZED = 15;

if (typeof(Storage) === "undefined") {
	alert("This site requires Local Storage.");
} else {

	$(function () {

		console.log("Starting");

		var pool_select_boxes = {};
		var question_pools = {
			"tech_pool": "pools/2014-2018_tech.json",
			"general_pool": "pools/2015-2019_general.json",
			"extra_pool": "pools/2016-2020_amateur_extra.json"
		};
		var questions = [];
		var filtered_questions = [];

		var num_correct = function (q) {
			if (typeof(Storage) === "undefined")
				return 0;
			var score = localStorage.getItem(q.id);
			if (score === undefined)
				return 0;
			return score;
		};

		var answer_correct = function (q) {
			if (typeof(Storage) === "undefined")
				return;
			console.log(q);
			localStorage.setItem(q.id, num_correct(q) + 1);
		};
		var answer_incorrect = function (q) {
			if (typeof(Storage) === "undefined")
				return;
			localStorage.setItem(q.id, 0);
		};

		var is_pool_selected = function (question) {
			return pool_select_boxes[question.pool].is(":checked");
		};

		var is_question_memorized = function (question) {
			return num_correct(question) >= NEEDED_TILL_MEMORIZED;
		};

		var rebuild = function () {
			filtered_questions = questions.filter(function (question) {
				return is_pool_selected(question) && !is_question_memorized(question);
			}).sort(function (a, b) {
				return num_correct(a) - num_correct(b);
			});
		};

		var pick = (function () {
			var buttons = {
				"A": $("#question-a"),
				"B": $("#question-b"),
				"C": $("#question-c"),
				"D": $("#question-d")
			};

			var display = function () {
				var question = filtered_questions.random();

				$("#question-id").text(question.id);
				$("#question-legislation").text(question.legislation !== null ? question.legislation + " " : "");
				$("#question").text(question.questions);

				Object.keys(buttons).forEach(function (letter) {
					var button = buttons[letter];

					button.unbind();
					button.removeClass("answer-wrong");

					if (letter === question.correct) {
						button.click(function () {
							// Go to next question
							pick();
							// Store that this answer is correct
							answer_correct(question);
						});
					} else {
						button.click(function () {
							// Show user that anser is wrong
							button.addClass("answer-wrong");
							// Store that this answer is incorrect
							answer_incorrect(question);
						});
					}

					button.text(question[letter]);
				});
			};

			return function () { rebuild(); setTimeout(display); }
		})();

		console.log("Building question pool");
		Object.keys(question_pools).forEach(function (pool) {
			$.getJSON(question_pools[pool], function (pool_questions) {
				pool_questions.forEach(function (pool_question) {
					pool_question.pool = pool;
					questions.push(pool_question);
				});
			});
		});

		console.log("Creating tickbox handlers");
		Object.keys(question_pools).forEach(function (pool) {

			var tick = $("#" + pool);
			pool_select_boxes[pool] = tick;

			var storedState = localStorage.getItem(pool);
			if (storedState === undefined)
				storedState = false;

			tick.prop("checked", storedState);
			tick.click(function () {
				pick();
				localStorage.setItem(pool, tick.is(":checked"));
			});
		});

		var setup = function () {
			rebuild();
			if (filtered_questions.random() === undefined) {
				setTimeout(setup, 10);
				return;
			}
			pick();
		};

		setup();

	});
}
