from api_calls import APICalls

class CanvasReader(object):
    """
    Class that contains functions useful for downloading (reading) entities for a course.
    Essentially a wrapper for API get calls for groups of data
    Input always contains a course_id which is a string eg '1112'
    Token that authorises this, has to have access to the course material in order for these to work. ie a professor
    or TA
    (Failure is not currently being handled ie you should handle your own exceptions :)
    """

    def __init__(self, access_token, base_url, api_prefix='/api/v1', verbose=True):
        self.api = APICalls(access_token, base_url + api_prefix, verbose=verbose)

    def get_course_info(self, course_id):
        """
        Returns information about a course
        :param course_id: string eg '1112'
        :return: a dictionary
        dictionary keys: [u'default_view', u'is_public_to_auth_users', u'start_at', u'account_id', u'workflow_state',
        u'restrict_enrollments_to_course_dates', u'storage_quota_mb', u'grading_standard_id', u'public_syllabus',
        u'enrollment_term_id', u'hide_final_grades', u'end_at', u'apply_assignment_group_weights', u'calendar',
        u'enrollments', u'is_public', u'course_code', u'id', u'name']
        """
        return self.api.get('/courses/%s' % course_id, single=True)

    def get_users(self, course_id):
        """
        :param course_id: string eg: '1121'- you must have access to this course material for this to work
        :return: list of dictionaries (one for each user)
        dict has fields [u'sortable_name', u'id', u'short_name', u'name']
        """
        return self.api.get('/courses/%s/users' % course_id)

    def get_user_profile(self, user_id):
        """
        :param user_id: string eg: '1121'- you must have access to this course material for this to work
        :return: user profile
        dict has fields [u'lti_user_id', u'title', u'login_id', u'primary_email', u'id', u'bio', u'locale', u'time_zone', u'sortable_name', u'integration_id', u'calendar', u'name', u'avatar_url', u'short_name']
        """
        return self.api.get('/users/%s/profile' % user_id, True, None, True)

    def get_student_assignment_submissions(self, course_id, students):
        parameters = {'student_ids': students, 'grouped': True}
        user_submissions = self.api.get('/courses/%s/students/submissions' % course_id, parameters=parameters)
        return user_submissions


    def get_assignments(self, course_id):
        """
        All the assignments in the course
        :param course_id: string
        :return: list of dictionaries
        dict keys [u'has_overrides', u'points_possible', u'updated_at', u'course_id', u'id', u'locked_for_user',
        u'muted', u'moderated_grading', u'grading_type', u'peer_reviews', u'description', u'anonymous_peer_reviews',
         u'grade_group_students_individually', u'grading_standard_id', u'html_url', u'has_submitted_submissions',
         u'group_category_id', u'needs_grading_count', u'unlock_at', u'only_visible_to_overrides', u'name', u'due_at',
         u'created_at', u'post_to_sis', u'lock_at', u'assignment_group_id', u'automatic_peer_reviews', u'published',
         u'position', u'submission_types', u'submissions_download_url', u'unpublishable']
        """
        return self.api.get('/courses/%s/assignments' % course_id)


    def get_assignment_submissions(self, course_id, assignment_id, grouped=False):
        """
        Returns the submissions for a particular assignment
        Only returns those submissions that have actually been submitted, rather than potential submissions.
        :param course_id: string
        :param assignment_id: string
        :return: list of dictionaries (one for each submission)
        dict keys: [u'body', u'user_id', u'submitted_at', u'excused', u'workflow_state', u'url', u'attempt',
        u'preview_url', u'late', u'grade', u'score', u'grade_matches_current_submission', u'grader_id', u'graded_at',
        u'submission_type', u'id', u'assignment_id']
        """
        parameters = {'grouped': grouped}
        submissions = self.api.get('/courses/%s/assignments/%s/submissions' % (course_id, assignment_id),
                                   parameters=parameters)
        return filter(lambda sub: sub['workflow_state'] != 'unsubmitted', submissions)


    def get_assignment_groups(self, course_id):
        """
        Assignements in cavnas are classified intro groups. This returns the info for all such groups
        :param course_id: string
        :return: list of dictionaries with group info
        dictionary keys: [u'group_weight', u'position', u'rules', u'id', u'name']
        """
        return self.api.get('/courses/%s/assignment_groups' % course_id)