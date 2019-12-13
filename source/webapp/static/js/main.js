const baseUrl = 'http://localhost:8000/api/v1/';

function getFullPath(path) {
    path = path.replace(/^\/+|\/+$/g, '');
    path = path.replace(/\/{2,}/g, '/');
    return baseUrl + path + '/';
}

function makeRequest(path, method, auth=true, data=null) {
    let settings = {
        url: getFullPath(path),
        method: method,
        dataType: 'json'
    };
    if (data) {
        settings['data'] = JSON.stringify(data);
        settings['contentType'] = 'application/json';
    }
    if (auth) {
        settings.headers = {'Authorization': 'Token ' + getToken()};
    }
    return $.ajax(settings);
}

function saveToken(token) {
    localStorage.setItem('authToken', token);
}

function getToken() {
    return localStorage.getItem('authToken');
}

function removeToken() {
    localStorage.removeItem('authToken');
}

function logIn(username, password) {
    const credentials = {username, password};
    let request = makeRequest('login', 'post', false, credentials);
    request.done(function(data, status, response) {
        console.log('Received token');
        saveToken(data.token);
        formModal.modal('hide');
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
    }).fail(function(response, status, message) {
        console.log('Could not get token');
        console.log(response.responseText);
    });
}

function logOut() {
    let request = makeRequest('logout', 'post', true);
    request.done(function(data, status, response) {
        console.log('Cleaned token');
        removeToken();
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
    }).fail(function(response, status, message) {
        console.log('Could not clean token');
        console.log(response.responseText);
    });
}


function createQuote(text, author_name, author_email,){
    const createntials = {text, author_name, author_email,};
    let request = makeRequest('quote/', 'post', false, createntials);
    request.done(function(data, status, response){
        console.log(data);
        formModal.modal('hide');
    }).fail(function(response,data,messeage) {
        console.log('Could not add token');
        console.log(response.responseText);
    });
}

let logInForm, quoteForm, homeLink, enterLink, exitLink, formSubmit, formTitle, content, formModal,
    usernameInput, passwordInput, authorInput, textInput, emailInput, createlink;

function setUpGlobalVars() {
    logInForm = $('#log_in_form');
    quoteForm = $('#quote_form');
    homeLink = $('#home_link');
    enterLink = $('#enter_link');
    exitLink = $('#exit_link');
    formSubmit = $('#form_submit');
    formTitle = $('#form_title');
    content = $('#content');
    formModal = $('#form_modal');
    usernameInput = $('#username_input');
    passwordInput = $('#password_input');
    authorInput = $('#author_input');
    textInput = $('#text_input');
    emailInput = $('#email_input');
    createlink = $('#create_link');
}

function setUpAuth() {
    logInForm.on('submit', function(event) {
        event.preventDefault();
        logIn(usernameInput.val(), passwordInput.val());
    });

    enterLink.on('click', function(event) {
        event.preventDefault();
        logInForm.removeClass('d-none');
        quoteForm.addClass('d-none');
        formTitle.text('Войти');
        formSubmit.text('Войти');
        formSubmit.off('click');
        formSubmit.on('click', function(event) {
            logInForm.submit();
        });
    });

    exitLink.on('click', function(event) {
        event.preventDefault();
        logOut();
    });
}

function createQuoteForm(){
    quoteForm.on('submit', function(event) {
        event.preventDefault();
        createQuote(textInput.val(),authorInput.val(),emailInput.val());
    });

    createlink.on('click', function(event) {
            event.preventDefault();
            logInForm.addClass('d-none');
            quoteForm.removeClass('d-none');
            formTitle.text('Добавить');
            formSubmit.text('Добавить');
            formSubmit.off('click');
            formSubmit.on('click', function(event) {
                quoteForm.submit()
            });
        });

}

function quoteDelete(id) {
    let request = makeRequest('quote/' + id + '/', 'delete', true);
    request.done(function(data, status, response) {
        console.log('Файл удален');
        getQuotes();
    }).fail(function(response, status, message) {
        console.log();
        console.log(response.responseText);
    });
}



function checkAuth() {
    let token = getToken();
    if(token) {
        enterLink.addClass('d-none');
        exitLink.removeClass('d-none');
    } else {
        enterLink.removeClass('d-none');
        exitLink.addClass('d-none');
    }
}

function rateUp(id) {
    let request = makeRequest('quote/' + id + '/rate_up', 'post', false);
    request.done(function(data, status, response) {
        console.log('Rated up quote with id ' + id + '.');
        $('#rating_' + id).text(data.rating);
    }).fail(function(response, status, message) {
        console.log('Could not rate up quote with id ' + id + '.');
        console.log(response.responseText);
    });
}

function rateDown(id) {
    let request = makeRequest('quote/' + id + '/rate_down', 'post', false);
    request.done(function(data, status, response) {
        console.log('Rated up quote with id ' + id + '.');
        $('#rating_' + id).text(data.rating);
    }).fail(function(response, status, message) {
        console.log('Could not rate down quote with id ' + id + '.');
        console.log(response.responseText);
    });
}





function getQuotes() {
    let request = makeRequest('quote', 'get', false);
    let token = getToken();
    if (token)
        request = makeRequest('quote', 'get', true);

    request.done(function(data, status, response) {
        console.log(data);
        data.forEach(function(item, index, array) {
            content.append($(`<div class="card" id="quote_${item.id}">
                <p>${item.text}</p>
                <p id="rating_${item.id}">${item.rating}</p>
                <p><a href="#" class="btn btn-success" id="rate_up_${item.id}">+</a></p>
                <p><a href="#" class="btn btn-danger" id="rate_down_${item.id}">-</a></p>
                <p><a href="#" class="btn btn-danger" id="delete_${item.id}">Delete</a></p>
            </div>`));
            $('#rate_up_' + item.id).on('click', function(event) {
                console.log('click');
                event.preventDefault();
                rateUp(item.id);
            });
             $('#rate_down_' + item.id).on('click', function(event) {
                console.log('click');
                event.preventDefault();
                rateDown(item.id);
            });
             $('#delete_' + item.id).on('click', function (event) {
                event.preventDefault();
                quoteDelete(item.id);
            });
        });
    }).fail(function(response, status, message) {
        console.log('Could not get quotes.');
        console.log(response.responseText);
    });
}

$(document).ready(function() {
    setUpGlobalVars();
    setUpAuth();
    checkAuth();
    getQuotes();
    createQuoteForm();
    quoteDelete();

});