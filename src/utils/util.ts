

declare var Pusher: any;
declare var config: RemoteConfig;
declare var session: RemoteSession;

export namespace Util {

    export function getCourseId() {
        return session.course_id || '1207667';
    }

    export function getStudentId() {
        return session.user_id || 'asdasdas'; //'8791939';
    }

    export function isStudent() {
        return session.role == "Student";
    }

    export function isInstructor() {
        return session.role == "Instructor";
    }

    export function POSTUser(path: string) {
        return this.POST(path, {
            studentId: getStudentId(),
            courseId: getCourseId(),
        })
    }

    export function POSTCourse(path: string) {
        return this.POST(path, {
            courseId: getCourseId()
        })
    }

    export function POST(path: string, data: any) {
        return fetch(path, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            } as any,
            body: JSON.stringify(data),
            credentials: 'include'
        })
    }

    export function showNotification(title: string, message: string, icon: string) {
        if ((Notification as any).permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification(title, {
                icon: icon,
                body: message
            });

            notification.onclick = () => {
                if (top === window) top.focus();
                else window.parent.focus();
                notification.close();
            };
        }
    }

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    export function debounce(func: Function, wait: number, immediate?: boolean) {
        let timeout: any;
        return function() {
            let context = this, args = arguments;
            let later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

}

export default Util