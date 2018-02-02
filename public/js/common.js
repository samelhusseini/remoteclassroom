

var getName = function (student) {
    if (student != null && student.first_name && student.last_name)
        return student.first_name + " " + student.last_name;
    return "Anonymous"
}