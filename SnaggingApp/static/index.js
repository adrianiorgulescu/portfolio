document.addEventListener('DOMContentLoaded', function() {

    //Script for clicks on project name (go to project page)
    let idStartsWith = 'project_'
    console.log(idStartsWith)
    
    let projects = document.querySelectorAll(`[id^=${idStartsWith}]`);

    projects.forEach(function (i) {
        let text = i.id;
        let project_id = text.replace(/project_/i, "");
        i.addEventListener('click', () => load_project(project_id));
    });
});

function load_project(project_id) {
    location.href=`/project/${project_id}`
};