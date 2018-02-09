interface RemoteConfig {
    PUSHER_APP_KEY: string; // Pusher App Key
    iframeUrl: string; // Iframe URL to use in student view
    classSkype: string; // Classroom Skype session URL
}

interface RemoteSession {
    full_name: string;
    course_id: string;
    course_name?: string;
    user_id: string;
    user_image: string;
    user_color: string;
    user_initials: string;
    host: string;
    role?: string;
    launch_id: string;
    opentok_api_key: string;
    opentok_session_id: string;
    opentok_token: string;
    opentok_teacher_token?: string;
    opentok_teacher_session_id?: string;
    protocol: string;
}

interface RemoteUser {
    studentId: string;
    fullName: string;
    initials: string;
    color: string;
    avatarUrl: string;
    role: string;
    opentokSessionId: string;
    opentokToken: string;
}