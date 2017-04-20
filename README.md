# questr
A simple, general, **quest**ion-based **r**ecommender

Turns a part of the DOM tree (or JSON configuration) into an interactive element that asks questions and shows (a) final recommendation(s).
questr emphasizes simplicity and general usability.

### Configuration

To use questr, just include the `questr.js` file and a compatiable version of jQuery in your page, declare a configuration object `config`, and call `questr(config)`.

`config` is a plain JavaScript object with the following fields:
* `container`: The ID of the HTML element that will contain all the questions and results.
* `introelement`: An object with the following fields:
  * `element`: The ID of the HTML element to display when the page is initially shown.
  * `hideanim`: (optional) An animation to play when the intro element is hidden. Should be a function of the form `anim(elem, nextanim, nextelem)` where `elem` is a jQuery object for the element to hide, `nextanim` is the show animation for the next element, and `nextelem` is a jQuery object for the next element to show. `anim` should call `nextanim(nextelem)` once any animations are complete.
* `startelement`: An object with the following fields:
  * `element`: The ID of the HTML element which, when clicked on, will advance from the intro to the first question.
* `questions`: An array of one or more question objects, which have the following fields:
  * `id`: A unique ID string for the question.
  * `element`: The ID of the HTML element which will be shown when this question is active.
  * `showanim`: (optional) An animation to play when this question is revealed. Should be a function of the form `anim(elem)`, where `elem` is a jQuery object for the element to be revealed.
  * `hideanim`: (optional) An animation to play when this question is hidden. See `introelement > hideanim`.
  * `answers`: An array of answer objects, which have the following fields (each should have exactly 1 of `nextquestion` or `results`):
    * `element`: The ID of the HTML element which, when clicked on, will select this answer and continue appropriately.
    * `nextquestion`: The ID of the question (not the question HTML element) which should be shown when this answer is selected.
    * `results`: An array of IDs for the results that should be shown when this answer is selected.
* `resultelement`: An object with the following fields:
  * `element`: The ID of the HTML element which contains all the possible results.
  * `showanim`: (optional) An animation to play when the results are revealed. See `questions > showanim`.
  * `hideanim`: (optional) An animation to play when the results are hidden. See `questions > hideanim`.
* `restartelement`: An object with the following fields:
  * `element`: The ID of the HTML element which, when clicked on, will clear the results and return to the first question.
* `results`: An array of result objects, which have the following fields:
  * `id`: A unique ID string for the result.
  * `element`: The ID of the HTML element which will be shown if this result is selected.
