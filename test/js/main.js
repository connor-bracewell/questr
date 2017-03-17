$(document).ready(function() {

    var containerId = "page-container";
    var jsonUrl = "data.json";

    $.getJSON(jsonUrl, function(data) {
        questr(containerId, data);
    });

});
