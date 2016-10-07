
// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher(config.PUSHER_APP_KEY, {
    encrypted: true
});

var channel = pusher.subscribe('private-status');

channel.bind('client-is_online', function (data) {
    console.log(data.studentId + " is online..");
    if (data.studentId == "Anonymous") {
        return;
    }
    var icon = $('#' + data.studentId + " .icon.circle");
    var windowLocation = data.windowLocation;
    icon.removeClass('grey');
    if (windowLocation.indexOf("starter") > -1) {
        icon.addClass('green');
    } else {
        icon.addClass('yellow');
    }
    if (!data.notificationsOn) {
        $('#' + data.studentId + " .notifications-off").text("Notifications Disabled");
    }
});

channel.bind('pusher:subscription_succeeded', function () {
    console.log("Channel is conneted")
    channel.trigger('client-get_status', {});
})

channel.bind('registered', function (data) {
    console.log(data.studentId + " has signed in for the day..");

    var icon = $('#' + data.studentId + " .icon.circle");
    icon.removeClass('grey');
    icon.removeClass('green');
    icon.removeClass('yellow');
    icon.addClass('blue');

    //$('#' + data.studentId).addClass('green');

});

channel.bind('help', function (data) {
    console.log(data.studentId + " needs help..");
    var title = "Student needs help";
    var student = data.student;

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: student.image,
            body: getName(student) + " needs help!",
        });

        notification.onclick = function () {
            if (top === window) top.focus();
            else window.parent.focus();
            this.close();
        };
    }
});


//Get value from an input field
function getFieldValue(fieldId) {
    // 'get field' is part of Semantics form behavior API
    return $('.ui.form').form('get field', fieldId).val();
}

function sendPoll(formData) {
    $.post('/newpoll', formData).success(function () {
        console.log('Notification sent!');
        window.location.href = "/allpolls";
    });
}

var sendNotification = function (e) {
    var formData = {
        header: getFieldValue('header'),
        body: getFieldValue('body')
    };
    sendPoll(formData);
    return false;
};

var pulsePoll = function () {
    sendPoll({
        header: "How are you doing?",
        body: "",
        type: "poll"
    });
}

var announcementReminder = function () {
    sendPoll({
        header: "5 more minutes to go!",
        body: "",
        type: "alert"
    });
}

var quizReminder = function () {
    sendPoll({
        header: "Go to Quiz", 
        body: "", 
        type: "quiz"
    })
}

var connect = function () {
    $('.connect').disabled = true;
    var time = 0;
    var index = 1;
    $('.student').each(function () {
        var studentId = $(this).attr('id');
        var selectedUrl = $(this).attr('skype');
        var directSelectedUrl = $(this).attr('skype-full');
        var totalStudentCount = config.totalStudents;
        var currIndex = index;
        setTimeout(function () {
            $('#connect-progress').show();
            var percent = (currIndex / totalStudentCount) * 100;
            var progress = $('#connect-progress').progress({
                percent: percent
            });

            var url = directSelectedUrl;
            var w = (window.parent) ? window.parent : window
            w.location.assign(url)

            if (currIndex == 7) {
                // Last one, complete 
                $('#connect-progress').hide();
                $('.connect').disabled = false;
            }
        }, time);
        time += 5000;
        index++;
    });
}

var refreshStatus = function () {
    var icon = $('.student .icon.circle').each(function () {
        $(this).addClass('grey');
        $(this).removeClass('green');
        $(this).removeClass('blue');
        $(this).removeClass('yellow');
    });

    channel.trigger('client-get_status', {});
}

$('.student').each(function () {
    var studentId = $(this).attr('id');
    var selectedUrl = $(this).attr('skype');
    var directSelectedUrl = $(this).attr('skype-full');
    $(this).find('.connect-button').on('click', function () {
        window.open(selectedUrl + "?sl=");
    });
    $(this).find('.connect-direct-button').on('click', function () {
        var url = directSelectedUrl;
        var w = (window.parent) ? window.parent : window
        w.location.assign(url);
    });
    $(this).find('.reward-button').on('click', function () {
        $.post('/reward', { studentId: studentId }).success(function (data) {
            console.log('Rewaring student: ' + studentId);
        });
    });
    $(this).find('.ping-button').on('click', function () {
        $.post('/ping', { studentId: studentId }).success(function (data) {
            console.log('Pinging student: ' + studentId);
        });
    });  
});
$('.refresh-button').on('click', refreshStatus);
$('.connect').on('click', connect);

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

    $('.ui.form')
        .form({
            fields: {
                header: {
                    identifier: 'header',
                    rules: [
                        {
                            type: 'empty',
                            prompt: 'Please enter a poll header'
                        },
                    ]
                }
            }
        });

    $('.ui.radio.checkbox')
        .checkbox()
        ;

    $('.pulse-poll').on('click', pulsePoll);
    $('.announcement-reminder').on('click', announcementReminder);
    $('.quiz-reminder').on('click', quizReminder);
    $('.ago_date').each(function () {
        var utctime = moment.tz($(this).text(), "UTC");
        $(this).text(utctime.tz('America/Los_Angeles').startOf('min').fromNow());
    });
    $('.ui.sidebar')
        .sidebar('show')
        ;
    $('#connect-progress').progress({
        percent: 0
    });
    $('#connect-progress').hide();
});
