document.addEventListener('DOMContentLoaded', function() {

    //Script for clicks on user name (to go to user page)
    let idStartsWith = 'user_click_'
    
    let users = document.querySelectorAll(`[id^=${idStartsWith}]`);

    users.forEach(function (i) {
        let text = i.id;
        let user_id = text.replace(/user_click_/i, "");
        i.addEventListener('click', () => load_profile(user_id));
    });

    //script to show like emoji blue or white depending if current user has liked post or not:
    let post_start_id = 'postX_'

    let posts = document.querySelectorAll(`[id^=${post_start_id}]`);

    //get the current user id:
    const current_user_id = document.querySelector(`#current_user_id`).value;

    posts.forEach(function (y) {
        let text3 = y.id;
        let postLike_id = text3.replace(/postX_/i, "");

        //fetch post data
        fetch(`/post/${postLike_id}`)
        .then(response => response.json())
        .then(CurrentPost => {
            var like_list = CurrentPost.like
        //if current user has liked the post show blue heart, otherwise show white heart
        if (like_list.includes(parseInt(current_user_id))) {
            document.querySelector(`#heart_no_like_${postLike_id}`).style.display = 'none'
            document.querySelector(`#heart_has_like_${postLike_id}`).style.display = 'block'
        } else {
            document.querySelector(`#heart_has_like_${postLike_id}`).style.display = 'none'
            document.querySelector(`#heart_no_like_${postLike_id}`).style.display = 'block'
        }

        });
        
    });

    //Script for like implementation
    let id_LikeStartsWith1 = 'heart_has_like_'
    
    let elements1 = document.querySelectorAll(`[id^=${id_LikeStartsWith1}]`);

    elements1.forEach(function (i) {
        let text = i.id;
        let post_id = text.replace(/heart_has_like_/i, "");
        i.addEventListener('click', () => add_OR_remove_like(post_id));
    });

    let id_LikeStartsWith2 = 'heart_no_like_'
    
    let elements2 = document.querySelectorAll(`[id^=${id_LikeStartsWith2}]`);

    elements2.forEach(function (i) {
        let text = i.id;
        let post_id = text.replace(/heart_no_like_/i, "");
        i.addEventListener('click', () => add_OR_remove_like(post_id));
    });


    //Script for "profile page" - for the follow and unfollow buttons:

    //the user logged-in:
    let logged_user = current_user_id;
    //get the profile page user id:
    try{
        const profile_page_user = document.querySelector(`#profile_page_user_id`).value;
        //if the logged-in user is same as the profile page user, no action. Else, activate buttons.
            if(typeof profile_page_user !== 'undefined'){
                if(profile_page_user !== logged_user){
                //console.log(profile_page_user);
                //console.log(logged_user);

                //fetch user follower data
                fetch(`/follower/${logged_user}`)
                .then(response => response.json())
                .then(CurrentUser => {
                    var follower_list = CurrentUser.following
                    if (follower_list.includes(parseInt(profile_page_user))) {
                        //  block of code to be executed if the condition is true
                        document.querySelector(`#follow`).style.display = 'none'
                        document.querySelector(`#unfollow`).style.display = 'block'
                    } else {
                        //  block of code to be executed if the condition is true
                        document.querySelector(`#follow`).style.display = 'block'
                        document.querySelector(`#unfollow`).style.display = 'none'
                    }
                    document.querySelector('#unfollow').addEventListener('click', () => update_followers_unfollow(profile_page_user, logged_user));
                    document.querySelector('#follow').addEventListener('click', () => update_followers_follow(profile_page_user, logged_user));
                })
            }
            }
        } catch(e) {
            console.log('ignore error; only works in profile page');
        }
    
    //IMPLEMENTATION OF EDIT POST FEATURE: 
    
    //edit field hidden by default, until user clicks edit button
    hide_edit_field();

    //script for post edit button:
    let button_id = 'edit_button_'

    let posts_edit = document.querySelectorAll(`[id^=${button_id}]`);

    posts_edit.forEach(function (y) {
        let text2 = y.id;
        let post_id = text2.replace(/edit_button_/i, "");
        
        y.addEventListener('click', () => edit_post(parseInt(post_id)));
    });

    
});

function edit_post(post_id) {

    //fetch post info and display it 
    fetch(`/post/${post_id}`)
    .then(response => response.json())
    .then(EditedPost => {
       // document.querySelector('#specific_user_posts').style.display = 'block';
        document.querySelector(`#edit-post-form_${post_id}`).innerHTML =
        `<textarea id="post-body_${post_id}" name="post-body_${post_id}" class="form-control" max_length="500" rows="2">
${EditedPost.content}</textarea>` 
    });

    //hide original post & show the edit post window
    document.querySelector(`#postX_${post_id}`).style.display = 'none'
    document.querySelector(`#edit_post_${post_id}`).style.display = 'block'

    //submit new post data to model
    document.querySelector(`#post_submit_button_${post_id}`).addEventListener('click', () => submit_post_information(post_id));

};

//send info to database (i.e. edit the post content)
function submit_post_information(post_id) {

    const edited_form_content = document.querySelector(`#post-body_${post_id}`).value;
  
    fetch(`/post/${post_id}`, {
        method: 'PUT',
        headers: {'X-CSRFToken':csrftoken},
        body: JSON.stringify({
            content: edited_form_content
        })
    })

    //fetch new post info and display it 
    fetch(`/post/${post_id}`)
    .then(response => response.json())
    .then(UpdatedPost => {

        document.querySelector(`#postcontent_${post_id}`).innerHTML =
        `${UpdatedPost.content}` 
        
    })
    //hide edit post & show the normal post window
    document.querySelector(`#postX_${post_id}`).style.display = 'block'
    document.querySelector(`#edit_post_${post_id}`).style.display = 'none'

};

function hide_edit_field() {

    let hide_id_start = 'edit_post_'
    let items = document.querySelectorAll(`[id^=${hide_id_start}]`);

    items.forEach(function (z) {
        z.style.display  = 'none'
    });
   
};

function update_followers_unfollow(profile_page_user_id, logged_user) {
    fetch(`/user_followers/${parseInt(profile_page_user_id)}`)   
        .then(response => response.json())
        .then(CurrentUser => {
            var follower_count = CurrentUser.followers.length
            //fetch post data - method PUT
            fetch(`/follower/${logged_user}`, {
                method: 'PUT',
                headers: {'X-CSRFToken':csrftoken,},
                body: JSON.stringify({
                    following: parseInt(profile_page_user_id)
                })
            })
            // update buttons & follower count on page
            let new_follower_count = follower_count - 1 
            document.querySelector(`#follower_count`).innerHTML = `Number of followers: ${new_follower_count}`
            document.querySelector(`#follow`).style.display = 'block'
            document.querySelector(`#unfollow`).style.display = 'none'
    
        })

    
};

function update_followers_follow(profile_page_user_id, logged_user) {
    fetch(`/user_followers/${parseInt(profile_page_user_id)}`)   
        .then(response => response.json())
        .then(CurrentUser => {
            var follower_count = CurrentUser.followers.length
            //fetch post data - method PUT
            fetch(`/follower/${logged_user}`, {
                method: 'PUT',
                headers: {'X-CSRFToken':csrftoken,},
                body: JSON.stringify({
                    following: parseInt(profile_page_user_id)
                })
            })
        // update buttons & follower count on page
        let new_follower_count = parseInt(follower_count) + 1 
        document.querySelector(`#follower_count`).innerHTML = `Number of followers: ${parseInt(new_follower_count)}`
        document.querySelector(`#follow`).style.display = 'none'
        document.querySelector(`#unfollow`).style.display = 'block'

    })

};



function add_OR_remove_like(post_id) {

    //fetch post data
    fetch(`/post/${post_id}`)
    .then(response => response.json())
    .then(CurrentPost => {
        const this_user_id = document.querySelector(`#current_user_id`).value;
        fetch(`/post/${post_id}`, {
            method: 'PUT',
            headers: {'X-CSRFToken':csrftoken,},
            body: JSON.stringify({
                like: parseInt(this_user_id)
            })
        })
        var like_list = CurrentPost.like
        //update the number of likes for post
        var like_count = like_list.length

        if (like_list.includes(parseInt(this_user_id))) {
            let new_like_count = like_count - 1 
            //  block of code to be executed if the condition is true
            document.querySelector(`#heart_has_like_${post_id}`).innerHTML = `<strong class="adrian">🤍</strong> ${new_like_count}`
            document.querySelector(`#heart_has_like_${post_id}`).style.display = 'block'
            document.querySelector(`#heart_no_like_${post_id}`).style.display = 'none'
        } else {
            let new_like_count = like_count + 1 
            //  block of code to be executed if the condition is false
            document.querySelector(`#heart_no_like_${post_id}`).innerHTML = `<strong class="adrian">💙</strong> ${new_like_count}`
            document.querySelector(`#heart_no_like_${post_id}`).style.display = 'block'
            document.querySelector(`#heart_has_like_${post_id}`).style.display = 'none'
        }

    });

}

//get the csrf token cookie (use it for fetch/PUT csrf verification)
//as per Django documentation:
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


function load_profile(user_id) {

    location.href=`/profile/${user_id}`

};