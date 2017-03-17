function questr(containerId, config) {
    backfillDefaults(config);
    render(containerId, config);
    restartQuestions(config, containerId);
}

function backfillDefaults(config) {
    //handle questions/answers
    var questionIndex = 0;
    var answerIndex = 0;
    $.each(config.questions, function(index, question) {
        //add an id if necessary
        if (!(question.hasOwnProperty("id"))) {
            question.id = "recommendi-question-" + questionIndex;
            questionIndex++;
        }
        //set next question if necessary
        if (!(question.hasOwnProperty("nextid"))) {
            if (index < config.questions.length-1) {
                //add an id to the next question if necessary
                if (!(config.questions[index+1].hasOwnProperty("id"))) {
                    config.questions[index+1].id = "recommendi-question-" + questionIndex;
                    questionIndex++;
                }
                //set the nextid to the next question
                question.nextid = config.questions[index+1].id;   
            } else {
                //if this is the last question, set as end
                question.end = true;
            }
        }
        //set end to false if not already set
        if (!(question.hasOwnProperty("end"))) {
            question.end = false;
        }
        //handle each answer
        $.each(question.answers, function(index, answer) {
            //add an id if necessary
            if (!(answer.hasOwnProperty("id"))) {
                answer.id = "recommendi-answer-" + answerIndex;
                answerIndex++;
            }
            //set next question if necessary
            if (!(answer.hasOwnProperty("nextid"))) {
                answer.nextid = question.nextid;
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
            result.id = "recommendi-result-" + resultIndex;
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
}

function render(containerId, config) {
    var qContainerEl = $("#" + containerId);
    $.each(config.questions, function(index, question) {
        if (question.hasOwnProperty("element")) {
            $("#" + question.element).addClass("recommendi-question");
            questionEl.attr("data-recommendi-question-id", question.id);
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
            questionEl.addClass("recommendi-question")
            questionEl.attr("data-recommendi-question-id", question.id);
            var textEl = $(document.createElement("div"));
            textEl.addClass("recommendi-question-text");
            textEl.text(question.text);
            textEl.appendTo(questionEl);
            var aContainerEl = $(document.createElement("div"));
            aContainerEl.addClass("recommendi-answer-container");
            aContainerEl.appendTo(questionEl);
            $.each(question.answers, function(index, answer) {
                var buttonEl = $(document.createElement("button"));
                buttonEl.addClass("recommendi-answer");
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
        $("#" + config.resultelement.element).addClass("recommendi-result");
        $.each(config.results, function(index, result) {
            $("#" + result.element).addClass("recommendi-recommendation");
            $("#" + result.element).attr("data-recommendi-recommendation-id", result.id);
        });
    } else {
        var resultEl = $(document.createElement("div"));
        resultEl.addClass("recommendi-result");
        var rTextEl = $(document.createElement("div"));
        rTextEl.addClass("recommendi-result-text");
        rTextEl.text(config.resultelement.text);
        rTextEl.appendTo(resultEl);
        var rContainerEl = $(document.createElement("div"));
        rContainerEl.addClass("recommendi-recommendation-container");
        $.each(config.results, function(index, result) {
            var recommendationEl = $(document.createElement("div"));
            recommendationEl.addClass("recommendi-recommendation");
            recommendationEl.attr("data-recommendi-recommendation-id", result.id);
            var rImageEl = $(document.createElement("img"));
            rImageEl.addClass("recommendi-recommendation-image");
            rImageEl.attr("src", result.image);
            rImageEl.appendTo(recommendationEl);
            var rTextEl = $(document.createElement("div"));
            rTextEl.addClass("recommendi-recommendation-text");
            rTextEl.text(result.text);
            rTextEl.appendTo(recommendationEl);
            recommendationEl.appendTo(rContainerEl);
        });
        rContainerEl.appendTo(resultEl);
        var restartContainerEl = $(document.createElement("div"));
        restartContainerEl.addClass("recommendi-restart-button-container");
        var restartEl = $(document.createElement("button"));
        restartEl.addClass("recommendi-restart-button");
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
    var containerEl = $("#" + containerId);
    containerEl.find(".recommendi-question").hide();
    config.responses.push(answer.value);
    if (answer.end) {
        containerEl.find(".recommendi-recommendation").hide();
        $.each(config.results, function(index, result) {
            $.each(result.sequences, function(index, sequence) {
                if (arraysEqual(config.responses, sequence)) {
                    containerEl.find(".recommendi-recommendation[data-recommendi-recommendation-id=\"" + result.id + "\"]").show();
                    return true;
                }
            });
        });
        containerEl.find(".recommendi-result").show();
    } else {
        var nextQuestionEl = containerEl.find(".recommendi-question[data-recommendi-question-id=\"" + answer.nextid + "\"]");
        nextQuestionEl.show();
    }
}

function handleRestartQuestions(e) {
    e.preventDefault();
    restartQuestions(
        e.data.config,
        e.data.containerId
    );
}

function restartQuestions(config, containerId) {
    var containerEl = $("#" + containerId);
    containerEl.find(".recommendi-question").hide();
    containerEl.find(".recommendi-result").hide();
    containerEl.find(".recommendi-question[data-recommendi-question-id=\"" + config.initialid + "\"]").show();
    config.responses = [];
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
