
// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher(config.PUSHER_APP_KEY, {
    encrypted: true
});

var channel = pusher.subscribe('polls');
var statuschannel = pusher.subscribe('private-status');
channel.bind('new_poll', function (data) {
    $('.ui.poll.modal').modal('hide');
    $('.ui.survey.modal').modal('hide');
    $('.ui.link.modal').modal('hide');

    var from = data.from ? data.from : "The teacher";
    var notification_body = data.title ? data.title : "Hey there! " + from + " asked a question!";
    var pollId = data.id;

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification("New Notification", {
            icon: config.notifications.poll.icon,
            body: notification_body,
            requireInteraction: true
        });

        notification.onclick = function () {
            if (top === window) top.focus();
            else window.parent.focus();
            this.close();
        };
    }

    //if (data.header)
    $('.notification-header').html(data.header);
    //if (data.body)
    $('.notification-body').html(data.body);
    $('.ui.poll.modal')
        .modal('setting', 'transition', 'horizontal flip')
        .modal('setting', 'allowMultiple', true)
        .modal('setting', 'inverted', true)
        .modal('show')
        ;

    $("#thumbsup").unbind("click");
    $('#thumbsup').on('click', function () {
        var globalStudentId = localStorage.getItem('globalStudentId');
        if (!globalStudentId) globalStudentId = "Anonymous";
        $.post('/poll', { pollId: pollId, message: "yes", student: globalStudentId }).success(function (data) {
            console.log(data);
            console.log('Thumbs Up!' + globalStudentId);
            $('.ui.poll.modal').modal('hide');
        });
    });
    $("#thumbsdown").unbind("click");
    $('#thumbsdown').on('click', function () {
        var globalStudentId = localStorage.getItem('globalStudentId');
        if (!globalStudentId) globalStudentId = "Anonymous";
        $.post('/poll', { pollId: pollId, message: "no", student: globalStudentId }).success(function (data) {
            console.log(data);
            console.log('Thumbs Down!' + globalStudentId);
            $('.ui.poll.modal').modal('hide');
        });
    });
});

channel.bind('new_survey', function (data) {
    $('.ui.poll.modal').modal('hide');
    $('.ui.survey.modal').modal('hide');
    $('.ui.link.modal').modal('hide');

    var from = data.from ? data.from : "The teacher";
    var title = data.title ? data.title : "New Notification";
    var pollId = data.id;

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: config.notifications.survey.icon,
            body: "Hey there! " + from + " asked a question!",
            requireInteraction: true
        });

        notification.onclick = function () {
            if (top === window) top.focus();
            else window.parent.focus();
            this.close();
        };
    }

    $('#survey-response-body').text();
    $("#submit-response").unbind("click");
    $('#submit-response').on('click', function () {
        var globalStudentId = localStorage.getItem('globalStudentId');
        var message = $('.ui.form').form('get field', "body").val();
        if (!globalStudentId) globalStudentId = "Anonymous";
        $.post('/survey', { pollId: pollId, message: message, student: globalStudentId }).success(function (data) {
            console.log(data);
            console.log('Sent response!' + globalStudentId);
            $('.ui.survey.modal').modal('hide');
        });
    });

    //if (data.header)
    $('.notification-header').html(data.header);
    //if (data.body)
    $('.notification-body').html(data.body);
    $('.ui.survey.modal')
        .modal('setting', 'transition', 'horizontal flip')
        .modal('setting', 'allowMultiple', true)
        .modal('setting', 'inverted', true)
        //.modal('setting', 'closable', false)
        .modal('show')
        ;
});

channel.bind('new_link', function (data) {
    $('.ui.poll.modal').modal('hide');
    $('.ui.survey.modal').modal('hide');
    $('.ui.link.modal').modal('hide');

    var from = data.from ? data.from : "The teacher";
    var title = data.title ? data.title : "New Notification";
    var pollId = data.id;

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: config.notifications.link.icon,
            body: "Hey there! " + from + " posted a link!",
            requireInteraction: true
        });

        notification.onclick = function () {
            if (top === window) top.focus();
            else window.parent.focus();
            this.close();
        };
    }

    $('.link-header').html(data.header);
    if (!data.link) data.link = data.header;
    if (data.link.indexOf('www') == 0) data.link = "https://" + data.link;
    $('.link-url').html(data.link);
    $('.link-url').attr('href', data.link)
    $('.ui.linkmodal.modal')
        .modal('setting', 'transition', 'horizontal flip')
        .modal('setting', 'allowMultiple', true)
        .modal('setting', 'inverted', true)
        .modal('setting', 'onApprove', function () {
            window.open(data.link);
        })
        //.modal('setting', 'closable', false)
        .modal('show')
        ;
});

channel.bind('quiz', function (data) {
    $('.ui.poll.modal').modal('hide');
    $('.ui.survey.modal').modal('hide');
    $('.ui.link.modal').modal('hide');

    var from = data.from ? data.from : "The teacher";
    var title = data.title ? data.title : "New Notification";
    var pollId = data.id;

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: config.notifications.quiz.icon,
            body: "Please begin today's quiz!",
            requireInteraction: false
        });

        notification.onclick = function () {
            if (top === window) top.focus();
            else window.parent.focus();
            this.close();
        };
    }

    runQuiz();
});

channel.bind('new_alert', function (data) {
    var from = data.from ? data.from : "The teacher";
    var title = data.title ? data.title : "New Notification";
    var notification_body = data.body ? data.body : "Hey there! " + from + " asked a question!";

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: config.notifications.question.icon,
            body: notification_body,
            requireInteraction: true
        });

        notification.onclick = function () {
            if (top === window) top.focus();
            else window.parent.focus();
            this.close();
        };
    }
});

statuschannel.bind('client-get_status', function (data) {
    console.log("Received request for status.");
    var globalStudentId = localStorage.getItem('globalStudentId');
    if (!globalStudentId) globalStudentId = "Anonymous";
    var notificationsOn = Notification.permission == "granted";
    if (!notificationsOn) {
        console.log("requesting permission");
        Notification.requestPermission();
    }
    var windowLocation = window.location.href;
    statuschannel.trigger('client-is_online',
        {
            studentId: globalStudentId,
            notificationsOn: notificationsOn,
            windowLocation: windowLocation
        });
})

statuschannel.bind('client-reward', function (data) {
    console.log("Received reward.");
    var globalStudentId = localStorage.getItem('globalStudentId');
    if (!globalStudentId) globalStudentId = "Anonymous";
    if (globalStudentId == data.studentId) {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification("Raffle ticket", {
                icon: config.notifications.raffle.icon,
                body: "Congrats " + getName(data.student) + "! You've received a raffle ticket!",
            });

            notification.onclick = function () {
                if (top === window) top.focus();
                else window.parent.focus();
                this.close();
            };
        }
    }
})

statuschannel.bind('client-ping', function (data) {
    console.log("Received ping.");
    var globalStudentId = localStorage.getItem('globalStudentId');
    if (!globalStudentId) globalStudentId = "Anonymous";
    if (globalStudentId == data.studentId) {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification("Ping", {
                icon: config.notifications.ping.icon,
                body: "The teacher is trying to contact you, please put on your headphones!",
            });

            notification.onclick = function () {
                if (top === window) top.focus();
                else window.parent.focus();
                this.close();
            };
        }
    }
})

var studentClicked = function () {
    var studentId = $(this).attr('id');
    var selectedUrl = $(this).attr('skype');
    var selectedIndex = $(this).attr('index');
    localStorage.setItem('studentId', studentId);
    localStorage.setItem('selectedUrl', selectedUrl);
    localStorage.setItem('selectedIndex', selectedIndex);

    console.log("clicked: " + studentId + " : " + selectedUrl);
    $('.owl-carousel .ui.card').removeClass('selected');
    $('.owl-list .ui.item').removeClass('selected');
    $(this).addClass('selected');
}

$('.owl-carousel.students .ui.card').on('click', studentClicked);
$('.owl-list.students .ui.item').on('click', studentClicked);

//Get value from an input field
function getFieldValue(fieldId) {
    // 'get field' is part of Semantics form behavior API
    return $('.ui.form').form('get field', fieldId).val();
}

var getStarted = function () {
    var studentId = localStorage.getItem('studentId');
    var selectedIndex = localStorage.getItem('selectedIndex');
    var selectedUrl = localStorage.getItem('selectedUrl');
    if (selectedUrl != "") {
        localStorage.setItem('globalStudentId', studentId);
        localStorage.setItem('globalStudentIndex', selectedIndex);
        var suffix = "?sl=";
        $.post('/register', { studentId: studentId }).success(function (data) {
            console.log('Registration successful for ' + studentId);
        });
        window.open(selectedUrl + suffix);
    }
}

var needHelp = function () {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var globalStudentId = localStorage.getItem('globalStudentId');
        if (!globalStudentId) globalStudentId = "Anonymous";
        $.post('/help', { studentId: globalStudentId }).success(function (data) {
            console.log('Asking for Help!' + globalStudentId);
        });
    }
}

var runSnap = function () {
    window.open("http://snap.berkeley.edu/snapsource/snap.html");
}

var runQuiz = function () {
    $('.ui.quizmodal.modal')
    .modal('setting', 'transition', 'horizontal flip')
    .modal('setting', 'allowMultiple', true)
    .modal('setting', 'inverted', true)
    //.modal('setting', 'closable', false)
    .modal('show')
    ;
}

$('.get-started').on('click', getStarted);
$('.help-button').on('click', needHelp);
$('.snap-button').on('click', runSnap);
$('.quiz-button').on('click', runQuiz);

$(window).on('beforeunload', function () {
    return 'Are you sure?';
});

$(document).ready(function () {
    $('.owl-carousel').owlCarousel({
        loop: false,
        margin: 10,
        responsiveClass: true,
        responsive: {
            0: {
                items: 3,
                nav: true
            },
            600: {
                items: 5,
                nav: true
            },
            1000: {
                items: 5,
                nav: true,
                loop: false
            }
        }
    });
    var globalStudentId = localStorage.getItem('globalStudentId');
    var globalStudentIndex = localStorage.getItem('globalStudentIndex');

    if (globalStudentId) {
        $.post('/starter', { studentId: globalStudentId }).success(function (data) {
            var starterInfo = JSON.parse(data);
            console.log("total raffle tickets: " + starterInfo.totaltickets);
            $('.total-raffle-tickets').text(starterInfo.totaltickets);
            $('.weekly-raffle-tickets').text(starterInfo.weeklytickets);
            $('.raffle-ticket-card').show();
        });
    }
    if (globalStudentId && globalStudentIndex) {
        $('#' + globalStudentId).addClass('selected');
        $(".owl-carousel.students").trigger("to.owl.carousel", [globalStudentIndex, 1, true])
    }
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});