document.addEventListener('DOMContentLoaded', function() {

  //by default load the inbox
  load_mailbox('inbox');

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  document.querySelector('#compose-form').onsubmit = send_email;

});

// compose email function
function compose_email() {

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#display-email').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
  
    // Clear out composition fields
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';

};

// send email function
function send_email() {

    const compose_recipients = document.querySelector('#compose-recipients').value;
    const compose_subject = document.querySelector('#compose-subject').value;
    const compose_body = document.querySelector('#compose-body').value;
  
    fetch('/emails', {
      method: 'POST',
        body: JSON.stringify({
          recipients: compose_recipients,
          subject: compose_subject,
          body: compose_body
        })
    
    })
    .then(response => response.json())
    .then(result => {
      load_mailbox('sent');
    });
    return false;

}
 
function load_mailbox(mailbox) {
    
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#display-email').style.display = 'none';
  
    // Show the mailbox name
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
    // display inbox
    if (mailbox === 'inbox') {
      fetch('/emails/inbox')
      .then(response => response.json())
      .then(emails => {
  
          document.querySelector('#emails-view').innerHTML = 
          `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>` 
          
          document.querySelector('#emails-view').insertAdjacentHTML('beforeend',
          `<div>
          <table border="2" id="mail-table">
          <tr id="inbox-emails">
            <th>From:</th>
            <th>Subject:</th>
            <th>Received:</th>
          </tr>
          </table>
          </div>`)
      });
          display_inbox();

    };
  
    // display sent
    if (mailbox === 'sent') {
      fetch('/emails/sent')
      .then(response => response.json())
      .then(emails => {
  
          document.querySelector('#emails-view').innerHTML = 
          `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>` 
          
          document.querySelector('#emails-view').insertAdjacentHTML('beforeend',
          `<div>
          <table border="2" id="mail-table">
          <tr id="sent-emails">
            <th>To:</th>
            <th>Subject:</th>
            <th>Sent:</th>
          </tr>
          </table>
          </div>`)
      });
        
        display_sent();
    };
    
    // display archive
    if (mailbox === 'archive') {
      fetch('/emails/archive')
      .then(response => response.json())
      .then(emails => {
  
          document.querySelector('#emails-view').innerHTML = 
          `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>` 
          
          document.querySelector('#emails-view').insertAdjacentHTML('beforeend',
          `<div>
          <table border="2" id="mail-table">
          <tr id="archived-emails">
            <th>From:</th>
            <th>Subject:</th>
            <th>Received:</th>
          </tr>
          </table>
          </div>`)
      });
        
        display_archived();
  };
}
  
//function for displaying inbox emails
function display_inbox() {
  
    fetch('/emails/inbox')
    .then(response => response.json())
    .then(emails => {
  
    emails.forEach(function(i) {
  
      if (i.read === false) {
        document.querySelector('#inbox-emails').insertAdjacentHTML("afterend",
      `<tr bgcolor="#B2BEB5" id="table-row" onclick="display_email(${i.id})">
          <td>${i.sender}</td>
          <td>${i.subject}</td>
          <td>${i.timestamp}</td>
        </tr>`)
      } else {
        document.querySelector('#inbox-emails').insertAdjacentHTML("afterend",
      `<tr bgcolor="white" id="table-row" onclick="display_email(${i.id})">
          <td>${i.sender}</td>
          <td>${i.subject}</td>
          <td>${i.timestamp}</td>
        </tr>`)
      }
  
    });
    
  
    });
  
}
  
//function for displaying sent emails
function display_sent() {
  
    fetch('/emails/sent')
    .then(response => response.json())
    .then(emails => {
  
      emails.forEach(function(i) {
  
        document.querySelector('#sent-emails').insertAdjacentHTML("afterend",
        `<tr id="table-row" onclick="display_email_sent(${i.id})">
            <td>${i.recipients}</td>
            <td>${i.subject}</td>
            <td>${i.timestamp}</td>
          </tr>`)
  
    });
  
    });
}
  
//function for displaying archived emails
function display_archived() {
  
    fetch('/emails/archive')
    .then(response => response.json())
    .then(emails => {
  
      emails.forEach(function(i) {
  
        document.querySelector('#archived-emails').insertAdjacentHTML("afterend",
        `<tr id="table-row" onclick="display_email_archived(${i.id})">
            <td>${i.sender}</td>
            <td>${i.subject}</td>
            <td>${i.timestamp}</td>
          </tr>`)
    
      });
  
    });
  
}
  
function display_email(x) {
  
    fetch(`/emails/${x}`)
      .then(response => response.json())
      .then(email => {
  
        document.querySelector('#display-email').innerHTML = 
          `<div style="background-color:#E0E1DA"><h3>${email.subject}</h3></div>
          <div><h4><span style="color:blue">From: </span>${email.sender}</h4></div>
          <div><h4><span style="color:blue">To: </span>${email.recipients}</h4></div>
          <div><h4><span style="color:blue">Timestamp: </span>${email.timestamp}</h4></div>
          <div><h6><span style="color:blue">Message: </span>${email.body}</h6></div>`
  
    })
  
    fetch(`/emails/${x}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true
        })
    })
  
    fetch(`/emails/${x}`)
    .then(response => response.json())
    .then(email => {  
  
      document.querySelector('#display-email').insertAdjacentHTML("beforeend",
      `<br><button class="btn btn-sm btn-outline-primary" id="reply-button">Reply</button><br>`)
  
      document.querySelector('#display-email').insertAdjacentHTML("beforeend",
      `<br><button class="btn btn-sm btn-outline-primary" id="archive-button">Archive</button>`)
  
      document.querySelector('#archive-button').addEventListener('click', archive_email);
  
      document.querySelector('#reply-button').addEventListener('click', reply_email);
  
      function archive_email() {
        fetch(`/emails/${x}`, {
          method: 'PUT',
          body: JSON.stringify({
              archived: true
          })
        });
        //load the user's inbox once the email has been archived
        load_mailbox('inbox');
      }
  
      function reply_email() {
        // Show compose view and hide other views
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#display-email').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';
  
        fetch(`/emails/${x}`)
        .then(response => response.json())
        .then(email => {
          // Clear out composition fields
          document.querySelector('#compose-recipients').value = `${email.sender}`;
          if (email.subject.indexOf('Re:') > -1) {
            document.querySelector('#compose-subject').value = `${email.subject}`;
          }
          else {
            document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
          }
          
          document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: 
  ${email.body}
  `;
  
          //document.querySelector('#compose-form').addEventListener('submit', send_email);
        })
      }
  
    })
        // Hide other views
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#display-email').style.display = 'block';
  
}
  
// function for displaying individual sent emails
function display_email_sent(x) {
   
     fetch(`/emails/${x}`)
       .then(response => response.json())
       .then(email => {
   
         document.querySelector('#display-email').innerHTML = 
           `<div style="background-color:#E0E1DA"><h3>${email.subject}</h3></div>
             <div><h4><span style="color:blue">From: </span>${email.sender}</h4></div>
             <div><h4><span style="color:blue">To: </span>${email.recipients}</h4></div>
             <div><h4><span style="color:blue">Timestamp: </span>${email.timestamp}</h4></div>
             <div><h6><span style="color:blue">Message: </span>${email.body}</h6></div>`
   
       })
   
     fetch(`/emails/${x}`)
     .then(response => response.json())
     .then(email => {  
  
       document.querySelector('#display-email').insertAdjacentHTML("beforeend",
       `<br><button class="btn btn-sm btn-outline-primary" id="reply-button">Reply</button><br>`)
  
       document.querySelector('#reply-button').addEventListener('click', reply_email);
   
       function reply_email() {
         // Show compose view and hide other views
         document.querySelector('#emails-view').style.display = 'none';
         document.querySelector('#display-email').style.display = 'none';
         document.querySelector('#compose-view').style.display = 'block';
   
         fetch(`/emails/${x}`)
         .then(response => response.json())
         .then(email => {
           // Clear out composition fields
           document.querySelector('#compose-recipients').value = `${email.recipients}`;
           if (email.subject.indexOf('Re:') > -1) {
             document.querySelector('#compose-subject').value = `${email.subject}`;
           }
           else {
             document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
           }
           
           document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: 
   ${email.body}
   `;
   
      //     document.querySelector('#compose-form').addEventListener('submit', send_email);
         })
         }
   
         })
         // Hide other views
         document.querySelector('#emails-view').style.display = 'none';
         document.querySelector('#display-email').style.display = 'block';
   
}
  
//function for displaying individual archived emails:
function display_email_archived(x) {
  
  fetch(`/emails/${x}`)
  .then(response => response.json())
  .then(email => {
        document.querySelector('#display-email').innerHTML = 
        `<div style="background-color:#E0E1DA"><h3>${email.subject}</h3></div>
        <div><h4><span style="color:blue">From: </span>${email.sender}</h4></div>
        <div><h4><span style="color:blue">To: </span>${email.recipients}</h4></div>
        <div><h4><span style="color:blue">Timestamp: </span>${email.timestamp}</h4></div>
        <div><h6><span style="color:blue">Message: </span>${email.body}</h6></div>` 
    })
     
    fetch(`/emails/${x}`)
    .then(response => response.json())
    .then(email => {  
     
         document.querySelector('#display-email').insertAdjacentHTML("beforeend",
         `<br><button class="btn btn-sm btn-outline-primary" id="reply-button">Reply</button><br>`)
     
         document.querySelector('#display-email').insertAdjacentHTML("beforeend",
         `<br><button class="btn btn-sm btn-outline-primary" id="unarchive-button">Unarchive</button>`)
     
         document.querySelector('#unarchive-button').addEventListener('click', unarchive_email);
     
         document.querySelector('#reply-button').addEventListener('click', reply_email);
     
         function unarchive_email() {
           fetch(`/emails/${x}`, {
             method: 'PUT',
             body: JSON.stringify({
                 archived: false
             })
           });
           //load the user's inbox once the email has been unarchived
           load_mailbox('inbox');
         }
     
         function reply_email() {
           // Show compose view and hide other views
           document.querySelector('#emails-view').style.display = 'none';
           document.querySelector('#display-email').style.display = 'none';
           document.querySelector('#compose-view').style.display = 'block';
     
           fetch(`/emails/${x}`)
           .then(response => response.json())
           .then(email => {
             // Clear out composition fields
             document.querySelector('#compose-recipients').value = `${email.sender}`;
             if (email.subject.indexOf('Re:') > -1) {
               document.querySelector('#compose-subject').value = `${email.subject}`;
             }
             else {
               document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
             }
             
             document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: 
     ${email.body}
     `;
     
           //  document.querySelector('#compose-form').addEventListener('submit', send_email);
           })
           }
     
           })
           // Hide other views
           document.querySelector('#emails-view').style.display = 'none';
           document.querySelector('#display-email').style.display = 'block';
};