document.addEventListener('DOMContentLoaded', function() {

    //Script for clicks on level name (go to level page)
    let idStartsWith = 'level_'
    
    let levels = document.querySelectorAll(`[id^=${idStartsWith}]`);

    levels.forEach(function (i) {
        let text = i.id;
        let level_id = text.replace(/level_/i, "");
        i.addEventListener('click', () => load_level(level_id));
    });
  
});

function load_level(level_id) {
    location.href=`/level/${level_id}`
};