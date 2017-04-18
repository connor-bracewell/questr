function questr(config) {
    var containerId = config.container;
    backfillDefaults(config);
    render(containerId, config);
    initializeQuestions(config, containerId);
}

function backfillDefaults(config) {
    //handle questions/answers
    var questionIndex = 0;
    var answerIndex = 0;
    $.each(config.questions, function(index, question) {
        //add an id if necessary
        if (!(question.hasOwnProperty("id"))) {
            question.id = "questr-question-" + questionIndex;
            questionIndex++;
        }
        //set next question if necessary
        if (!(question.hasOwnProperty("nextquestion"))) {
            if (index < config.questions.length-1) {
                //add an id to the next question if necessary
                if (!(config.questions[index+1].hasOwnProperty("id"))) {
                    config.questions[index+1].id = "questr-question-" + questionIndex;
                    questionIndex++;
                }
                //set the nextquestion to the next question
                question.nextquestion = config.questions[index+1].id;   
            } else {
                //if this is the last question, set as end
                question.end = true;
            }
        }
        //set end to false if not already set
        if (!(question.hasOwnProperty("end"))) {
            question.end = false;
        }
        //add default show/hide animations as required
        if (!(question.hasOwnProperty("hideanim"))) {
            question.hideanim = function(el, nextAnim, nextEl) {
                el.hide();
                nextAnim(nextEl);
            };
        }
        if (!(question.hasOwnProperty("showanim"))) {
            question.showanim = function(el) {
                el.show();
            };
        }
        //handle each answer
        $.each(question.answers, function(index, answer) {
            //add an id if necessary
            if (!(answer.hasOwnProperty("id"))) {
                answer.id = "questr-answer-" + answerIndex;
                answerIndex++;
            }
            //set next question if necessary
            if (!(answer.hasOwnProperty("nextquestion"))) {
                answer.nextquestion = question.nextquestion;
            }
            //tag as end if necessary
            if (!(answer.hasOwnProperty("end"))) {
                answer.end = question.end;
            }
        });
    });
    //handle results
    var resultIndex
    $.each(config.results, function(index, result) {
        if (!(result.hasOwnProperty("id"))) {
            result.id = "questr-result-" + resultIndex;
            resultIndex++;
        }
        if (result.hasOwnProperty("sequence")) {
            result.sequences = [result.sequence];
        }
    });
    //handle basic config
    if (!(config.hasOwnProperty("initialid"))) {
        config.initialid = config.questions[0].id;
    }
    //add default show/hide animations as required
    if (!(config.introelement.hasOwnProperty("hideanim"))) {
        config.introelement.hideanim = function(el, nextAnim, nextEl) {
            el.hide();
            nextAnim(nextEl);
        };
    }
    if (!(config.resultelement.hasOwnProperty("hideanim"))) {
        config.resultelement.hideanim = function(el, nextAnim, nextEl) {
            el.hide();
            nextAnim(nextEl);
        };
    }
    if (!(config.resultelement.hasOwnProperty("showanim"))) {
        config.resultelement.showanim = function(el) {
            el.show();
        };
    }
}

function render(containerId, config) {
    var qContainerEl = $("#" + containerId);
    if (config.introelement.hasOwnProperty("element")) {
        $("#" + config.introelement.element).addClass("questr-intro");
        $("#" + config.startelement.element).click(
            {
                config: config,
                containerId: containerId
            },
            handleStartQuestions
        );
    } else {
        var introEl = $(document.createElement("div"));
        introEl.addClass("questr-intro");
        var iTextEl = $(document.createElement("div"));
        iTextEl.addClass("questr-intro-text");
        iTextEl.text(config.introelement.text);
        iTextEl.appendTo(introEl);
        var startContainerEl = $(document.createElement("div"));
        startContainerEl.addClass("questr-start-button-container");
        var startEl = $(document.createElement("button"));
        startEl.addClass("questr-start-button");
        startEl.text(config.startelement.text);
        startEl.click(
            {
                config: config,
                containerId: containerId
            },
            handleStartQuestions
        );
        startEl.appendTo(startContainerEl);
        startContainerEl.appendTo(introEl);
        introEl.appendTo(qContainerEl);
    }
    $.each(config.questions, function(index, question) {
        if (question.hasOwnProperty("element")) {
            var questionEl = $("#" + question.element);
            questionEl.addClass("questr-question");
            questionEl.attr("data-questr-question-id", question.id);
            $.each(question.answers, function(index, answer) {
                $("#" + answer.element).click(
                    {
                        config: config,
                        answer: answer,
                        containerId: containerId
                    },
                    handleSelectAnswer
                );
            });
        } else {
            var questionEl = $(document.createElement("div"));
            questionEl.addClass("questr-question")
            questionEl.attr("data-questr-question-id", question.id);
            var textEl = $(document.createElement("div"));
            textEl.addClass("questr-question-text");
            textEl.text(question.text);
            textEl.appendTo(questionEl);
            var aContainerEl = $(document.createElement("div"));
            aContainerEl.addClass("questr-answer-container");
            aContainerEl.appendTo(questionEl);
            $.each(question.answers, function(index, answer) {
                var buttonEl = $(document.createElement("button"));
                buttonEl.addClass("questr-answer");
                buttonEl.text(answer.text);
                buttonEl.click(
                    {
                        config: config,
                        answer: answer,
                        containerId: containerId
                    },
                    handleSelectAnswer
                );
                buttonEl.appendTo(aContainerEl);
            });
            questionEl.appendTo(qContainerEl);
        }
    });
    if (config.resultelement.hasOwnProperty("element")) {
        $("#" + config.resultelement.element).addClass("questr-result");
        $.each(config.results, function(index, result) {
            $("#" + result.element).addClass("questr-recommendation");
            $("#" + result.element).attr("data-questr-recommendation-id", result.id);
        });
        $("#" + config.restartelement.element).click(
            {
                config: config,
                containerId: containerId
            },
            handleRestartQuestions
        );
    } else {
        var resultEl = $(document.createElement("div"));
        resultEl.addClass("questr-result");
        var rTextEl = $(document.createElement("div"));
        rTextEl.addClass("questr-result-text");
        rTextEl.text(config.resultelement.text);
        rTextEl.appendTo(resultEl);
        var rContainerEl = $(document.createElement("div"));
        rContainerEl.addClass("questr-recommendation-container");
        $.each(config.results, function(index, result) {
            var recommendationEl = $(document.createElement("div"));
            recommendationEl.addClass("questr-recommendation");
            recommendationEl.attr("data-questr-recommendation-id", result.id);
            var rImageEl = $(document.createElement("img"));
            rImageEl.addClass("questr-recommendation-image");
            rImageEl.attr("src", result.image);
            rImageEl.appendTo(recommendationEl);
            var rTextEl = $(document.createElement("div"));
            rTextEl.addClass("questr-recommendation-text");
            rTextEl.text(result.text);
            rTextEl.appendTo(recommendationEl);
            recommendationEl.appendTo(rContainerEl);
        });
        rContainerEl.appendTo(resultEl);
        var restartContainerEl = $(document.createElement("div"));
        restartContainerEl.addClass("questr-restart-button-container");
        var restartEl = $(document.createElement("button"));
        restartEl.addClass("questr-restart-button");
        restartEl.text(config.restartelement.text);
        restartEl.click(
            {
                config: config,
                containerId: containerId
            },
            handleRestartQuestions
        );
        restartEl.appendTo(restartContainerEl);
        restartContainerEl.appendTo(resultEl);
        resultEl.appendTo(qContainerEl);
    }
}

function handleSelectAnswer(e) {
    e.preventDefault();
    selectAnswer(
        e.data.config,
        e.data.answer,
        e.data.containerId
    );
}

function selectAnswer(config, answer, containerId) {
    config.responses.push(answer.value);
    var containerEl = $("#" + containerId);
    if (answer.results) {
        containerEl.find(".questr-recommendation").hide();
        $.each(answer.results, function(index, result) {
            containerEl.find(".questr-recommendation[data-questr-recommendation-id=\"" + result + "\"]").show();
        });
        var activeQEl = containerEl.find(".questr-question.active-question");
        var activeQId = activeQEl.attr("data-questr-question-id");
        var activeQAnim = $.grep(config.questions, function(e){ return e.id == activeQId})[0].hideanim;
        var resultsEl = containerEl.find(".questr-result");
        var resultsAnim = config.resultelement.showanim;
        console.log(resultsAnim);
        activeQAnim(activeQEl, resultsAnim, resultsEl);
        activeQEl.removeClass("active-question");
    } else {
        var activeQEl = containerEl.find(".questr-question.active-question")
        var activeQId = activeQEl.attr("data-questr-question-id");
        var activeQAnim = $.grep(config.questions, function(e){ return e.id == activeQId})[0].hideanim;
        var nextQEl = containerEl.find(".questr-question[data-questr-question-id=\"" + answer.nextquestion + "\"]");
        var nextQId = answer.nextquestion;
        var nextQAnim = $.grep(config.questions, function(e){ return e.id == nextQId})[0].showanim;
        activeQAnim(activeQEl, nextQAnim, nextQEl);
        activeQEl.removeClass("active-question");
        nextQEl.addClass("active-question");
    }
}

function handleRestartQuestions(e) {
    e.preventDefault();
    restartQuestions(
        e.data.config,
        e.data.containerId
    );
}

function handleStartQuestions(e) {
    e.preventDefault();
    startQuestions(
        e.data.config,
        e.data.containerId
    );
}

function initializeQuestions(config, containerId) {
    var containerEl = $("#" + containerId);
    containerEl.find(".questr-question").hide();
    containerEl.find(".questr-result").hide();
    containerEl.find(".questr-intro").show();
}

function startQuestions(config, containerId) {
    var containerEl = $("#" + containerId);
    var introEl = containerEl.find(".questr-intro");
    var firstQEl = getQuestionEl(containerEl, config.initialid);
    var firstQAnim = $.grep(config.questions, function(e){ return e.id == config.initialid})[0].showanim;
    config.introelement.hideanim(introEl, firstQAnim, firstQEl);
    firstQEl.addClass("active-question");
    config.responses = [];
}

function restartQuestions(config, containerId) {
    var containerEl = $("#" + containerId);
    containerEl.find(".questr-question").hide();
    var resultsEl = containerEl.find(".questr-result");
    var firstQEl = getQuestionEl(containerEl, config.initialid);
    var firstQAnim = $.grep(config.questions, function(e){ return e.id == config.initialid})[0].showanim;
    config.resultelement.hideanim(resultsEl, firstQAnim, firstQEl);
    firstQEl.addClass("active-question");
    config.responses = [];
}

function getQuestionEl(containerEl, questionId) {
    return containerEl.find(".questr-question[data-questr-question-id=\"" + questionId + "\"]");
}

function arraysEqual(a, b) {
    if (a === b) {
        return true;
    } else if (a == null || b == null) {
        return false;
    } else if (a.length != b.length) {
        return false;
    }

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
