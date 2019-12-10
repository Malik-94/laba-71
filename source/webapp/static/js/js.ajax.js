function ratingAdd() {
    $.ajax({
        url: "http://localhost:8000/api/v1/quote/",
        method: 'POST',
        headers: {'Authorization': 'Token ' + localStorage.getItem('apiToken')},
        data: JSON.stringify({text: 'test', author_email: 'test_desc'}),
        dataType: 'json',
        contentType: 'application/json',
        success: taskProjectParseData,
        error: jqueryAjaxError
    });
}

function jqueryParseData(response, status) {
    console.log(response);
    console.log(status);
}

function taskProjectParseData(response, status) {
    console.log(response.tasks);
    console.log(status);
}


function jqueryAjaxError(response, status) {
    console.log(response);
    console.log(status);
    console.log('error');
}



$(document).ready(function() {
    ratingAdd();

});