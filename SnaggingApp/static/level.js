document.addEventListener('DOMContentLoaded', function() {
    
    var scale = document.getElementById("variableSlider").value;
    
    var { pdfjsLib } = globalThis;
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.mjs';
    
    //Get the pdf document
    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
        console.log('PDF loaded');
        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
        console.log('Page loaded');
    
            renderPage(page, scale)
    
            //Insert a slider for zoom control:
            // Get the slider element and the paragraph to display the variable value
            const slider = document.getElementById("variableSlider");
            const variableValueDisplay = document.getElementById("variableValue");
    
            // Update the variable value and display when the slider is changed
            slider.addEventListener("input", function() {
                const variableValue = this.value;        
                scale= variableValue;
                
                renderPage(page, scale)
            });
        });
    }, 
    
    function (reason) {
        // PDF loading error
        console.error(reason);
    });
    
    //Add snag button show/hide:
    if (responsible.includes(current_user)) {
        //  block of code to be executed if the condition is true
        document.querySelector('#add_snag').style.display = 'none';

    }

    //Mark complete buttons:
    try{
        let idStartsWith = 'mdl-mark-complete_'
        
        let pin_mark_complete = document.querySelectorAll(`[id^=${idStartsWith}]`);
        
        pin_mark_complete.forEach(function (i) {
            let text = i.id;
            let pin_id = text.replace(/mdl-mark-complete_/i, "");
            i.addEventListener('click', () => markComplete(pin_id));
        });
        } catch(e) {
            console.log('ignore error; no buttons if user responsible');
        }

    //Ready for inspection buttons:
    try{
        let idStartsWith = 'AAmdl-ready-for-inspectionScreenshot_'
        
        let pin_mark_completeScrnsht = document.querySelectorAll(`[id^=${idStartsWith}]`);
        
        pin_mark_completeScrnsht.forEach(function (j) {
            let text = j.id;
            let pin_id = text.replace(/AAmdl-ready-for-inspectionScreenshot_/i, "");
            j.addEventListener('click', () => readyForInspectionScreenshot(pin_id));
        });
        } catch(e) {
            console.log('ignore error; no buttons if user responsible');
        }
    
    try{
        let id22StartsWith = 'mdl-ready-for-inspectionUpload_'
            
        let pin_mark_completeUpld = document.querySelectorAll(`[id^=${id22StartsWith}]`);
            
        pin_mark_completeUpld.forEach(function (j) {
            let text = j.id;
            let pin_id = text.replace(/mdl-ready-for-inspectionUpload_/i, "");
            j.addEventListener('click', () => markAsReadyForInspectionUpload(csrftoken, pin_id));
        });
        } catch(e) {
            console.log('ignore error; no buttons if user responsible');
        }
    
    //Take photo buttons (add evidence):
    try{
        let idStartsWith = 'mdl-take_photo_'
        
        let pin_take_photo = document.querySelectorAll(`[id^=${idStartsWith}]`);
        
        pin_take_photo.forEach(function (m) {
            let text = m.id;
            let pin_id = text.replace(/mdl-take_photo_/i, "");
            m.addEventListener('click', () => takePhoto(pin_id, csrftoken));
        });
        } catch(e) {
            console.log('ignore error; no buttons if user master');
        }
    
    //Event listener for the ADD SNAG BUTTON:
    document.querySelector('#add_snag').addEventListener('click', () => addSnag());
    //addsnag canvas hidden by default
    document.querySelector('#addSnagCanvasDiv').style.display = 'none';
    
    //Take photo buttons (add snag):
    document.querySelector(`#add_snag_mdl-take_photo`).addEventListener('click', () => takePhotoAddSnag(csrftoken));
    document.querySelector(`#add_snag_mdl-upload_from_folder`).addEventListener('click', () => takePhotoAddSnagFolder(csrftoken));

    document.querySelector(`#add_snag_screenshot-btn`).addEventListener('click', () => changeAddSnagModalScreenshot());
    document.querySelector(`#add_snag_upload-btn-Folder`).addEventListener('click', () => changeAddSnagModalUpload());

    //mark as ready for inspection buttons hidden by default:
    try{
        let id99StartsWith = 'mdl-ready-for-inspectionUpload_'
        let bntReadyForInspectionUpload = document.querySelectorAll(`[id^=${id99StartsWith}]`);
        bntReadyForInspectionUpload.forEach(function (n) {
            n.style.display = 'none';
        });
        } catch(e) {
            console.log('ignore error');
        }
    
    //show mark ready for inspection buttons after relevant event:
    try{
        let id33StartsWith = 'add_evidence_upload-btn-Folder_'
        
        let pin_take_photoAddEvidence = document.querySelectorAll(`[id^=${id33StartsWith}]`);
        
        pin_take_photoAddEvidence.forEach(function (m) {
            let text = m.id;
            let pin_id = text.replace(/add_evidence_upload-btn-Folder_/i, "");
            m.addEventListener('click', () => showMarkInspUploadButton(pin_id));
           // m.addEventListener('click', () => uploadPhotoEvidenceFromFolder(pin_id));
           m.addEventListener('click', () => {
            setTimeout(() => {
                uploadPhotoEvidenceFromFolder(csrftoken, pin_id);
            }, 1000); // 1 second
            });
        });
        } catch(e) {
            console.log('ignore error; no buttons if user master');
        }
    
    function showMarkInspUploadButton(pin_id) {
        document.querySelector(`#mdl-ready-for-inspectionUpload_${pin_id}`).style.display = 'block';
        document.querySelectorAll(`#AAmdl-ready-for-inspection_${pin_id}`).forEach(function (n) {
            n.style.display = 'none';
        });
    //  uploadImageDeleteFunction(csrftoken, pin_id);
    }  

    // hide mark ready for inspection button for snapshot scenario
    try{
        let id10StartsWith = 'AAmdl-ready-for-inspectionScreenshot_'
        let bntReadyForInspectionScreenshot = document.querySelectorAll(`[id^=${id10StartsWith}]`);
        bntReadyForInspectionScreenshot.forEach(function (n) {
            n.style.display = 'none';
        });
        } catch(e) {
            console.log('ignore error');
        }
    
    //show mark ready for inspection buttons after relevant event:
    try{
        let id33StartsWith = 'screenshot-btn_'
        
        let pin_take_photo33 = document.querySelectorAll(`[id^=${id33StartsWith}]`);
        
        pin_take_photo33.forEach(function (m) {
            let text = m.id;
            let pin_id = text.replace(/screenshot-btn_/i, "");
            m.addEventListener('click', () => showMarkInspScreenshotButton(pin_id));
        });
        } catch(e) {
            console.log('ignore error; no buttons if user master');
        }
    
    function showMarkInspScreenshotButton(pin_id) {
        document.querySelector(`#AAmdl-ready-for-inspectionScreenshot_${pin_id}`).style.display = 'block';
        document.querySelectorAll(`#AAmdl-ready-for-inspection_${pin_id}`).forEach(function (n) {
            n.style.display = 'none';
        });
    }  

    //image & location text & submit snag buttons hidden as default:
    document.querySelector('#display_add_snag_image').style.display = 'none';
    document.querySelector('#locationSelectedText').style.display = 'none';
    document.querySelector('#submitSnagButtonScreenshot').style.display = 'none';
    document.querySelector('#submitSnagButtonUpload').style.display = 'none';
    
    //function for add snag modal modifications
    function changeAddSnagModalScreenshot() {
        document.querySelector('#display_add_snag_image').style.display = 'block';
        document.querySelector('#addSnagAddPhoto').style.display = 'none';
        document.querySelector('#submitSnagButtonScreenshot').style.display = 'block';
        document.querySelector('#submitSnagButtonDisabled').style.display = 'none';
    }  

    function changeAddSnagModalUpload() {
        document.querySelector('#display_add_snag_image').style.display = 'block';
        document.querySelector('#addSnagAddPhoto').style.display = 'none';
        document.querySelector('#submitSnagButtonUpload').style.display = 'block';
        document.querySelector('#submitSnagButtonDisabled').style.display = 'none';
    }  

    //Submit snag:
    document.querySelector(`#submitSnagButtonScreenshot`).addEventListener('click', () => submitSnagScreenshot(csrftoken, current_level_id));
    document.querySelector(`#submitSnagButtonUpload`).addEventListener('click', () => submitSnagUpload(csrftoken, current_level_id));

    //refresh page after modal close: 
    try{
        let id2StartsWith = 'AAmdl-ready-for-inspection_'
        let bntReadyForInspection = document.querySelectorAll(`[id^=${id2StartsWith}]`);

        bntReadyForInspection.forEach(function (n) {
            let text = n.id;
            let pin_id = text.replace(/AAmdl-ready-for-inspection_/i, "");
            n.addEventListener('click', () => markAsReadyForInspectionUpload(csrftoken, pin_id));
        });
        } catch(e) {
            console.log('ignore error');
        }

    //refresh page after take photo mark as ready for insp: 
    try{
        let id44StartsWith = 'AAmdl-ready-for-inspectionScreenshot_'
        let bntMrkRdInspTakePhoto = document.querySelectorAll(`[id^=${id44StartsWith}]`);
        bntMrkRdInspTakePhoto.forEach(function (p) {
            p.addEventListener('click', () => refreshPage());
        });
        } catch(e) {
            console.log('ignore error');
        }

    //refresh page after mark as complete: 
    try{
        let id3StartsWith = 'mdl-mark-complete_'
        let bntMrkCompl = document.querySelectorAll(`[id^=${id3StartsWith}]`);
        bntMrkCompl.forEach(function (p) {
            p.addEventListener('click', () => refreshPage());
        });
        } catch(e) {
            console.log('ignore error');
        }
});

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

function addSnag() {
    //Show modal on screen:
    var modalPopup = new bootstrap.Modal(document.getElementById(`addSnagModal`), {
        keyboard: true
    });
    var modalToggle = document.getElementById(`addSnagModal`)
    modalPopup.show(modalToggle);
    
    //Process info from modal:
    const exampleModal = document.getElementById(`addSnagModal`)
    exampleModal.addEventListener('shown.bs.modal', event => {
    // Button that triggered the modal:
    // const pinpoint = event.relatedTarget
    })
}

//refresh page function: 
function refreshPage() {
    window.location.reload();
}

function markComplete(pin_id) {
    fetch(`/pinpoint_update/${pin_id}`, {
        method: 'PUT',
        headers: {'X-CSRFToken':csrftoken},
        body: JSON.stringify({
            mark_complete: true
        })
    })
    // update info on screen
    let x = pinsX[index];
    let y = pinsY[index];
    x = scale * x;
    y = scale * y;
    drawPinpointGreen(context, x, y) 
}
      
function readyForInspectionScreenshot(pin_id) {
    fetch(`/pinpoint_update/${pin_id}`, {
        method: 'PUT',
        headers: {'X-CSRFToken':csrftoken},
        body: JSON.stringify({
            ready_for_inspection: true
        })
    })
}

// Function to render the page
function renderPage(page, scale) {
    let viewport = page.getViewport({scale: scale});
    
    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    //canvas for add snag pinpoint selection:
    var addSnagCanvas = document.getElementById('add-snag-select-location-canvas');
    var addSnagContext= addSnagCanvas.getContext('2d');
    addSnagCanvas.height = viewport.height;
    addSnagCanvas.width = viewport.width;
    
    // Render PDF page into canvas context
    var renderContext = {
        canvasContext: context,
        viewport: viewport
    };
        
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
    
        //Render the pins onto the canvas:
        pinsId.forEach(function (currentValue, index) {
            let x = pinsX[index];
            let y = pinsY[index];
            let z = pinsResolved[index];
            let w = pinsReadyForInspection[index];
            x = scale * x;
            y = scale * y;
                
            if (z === 'True') {
                drawPinpointGreen(context, x, y)   
            } else {
                if (w === 'True'){
                    drawPinpointBlue(context, x, y) 
                }
                else {
                    drawPinpointRed(context, x, y) 
                }
            }
                
            // Add click event listener to canvas
            canvas.addEventListener('click', function(event) {
            const boundingBox = canvas.getBoundingClientRect();
            const mouseX = event.clientX - boundingBox.left;
            const mouseY = event.clientY - boundingBox.top;
    
            // Check if the click is inside the pinpoint
            if (isInsidePinpoint(x, y, mouseX, mouseY)) {
                //Show modal on screen:
                var modalPopup = new bootstrap.Modal(document.getElementById(`Modal_${currentValue}`), {
                    keyboard: true
                });
                var modalToggle = document.getElementById(`toggleMyModal_${currentValue}`)
                modalPopup.show(modalToggle);
                    
                //Process info from modal:
                const exampleModal = document.getElementById(`Modal_${currentValue}`)
                exampleModal.addEventListener('shown.bs.modal', event => {
                // Button that triggered the modal
                        
                // const pinpoint = event.relatedTarget
                })
            }
            })
        })
    });

    //FOR ADD SNAG:
    //NEW Snag location select:
    document.querySelector(`#addSnagAddLocation`).addEventListener('click', () => addSnagLocation());
    function addSnagLocation() {

        //show the add snag location canvas
        document.querySelector('#addSnagCanvasDiv').style.display = 'block';
        const cnvsHeight = viewport.height;
        const cnvsWidth = viewport.width;
        addSnagContext.beginPath();
        addSnagContext.rect(0, 0, cnvsWidth, cnvsHeight);
        addSnagContext.fillStyle = "rgb(102, 255, 255)";
        addSnagContext.fill();

        //Draw new pinpoint on the top canvas
        addSnagCanvas.addEventListener("click", function(event){
        var canvasRectPositionNew = canvas.getBoundingClientRect();
        var xPositionNew = event.clientX - canvasRectPositionNew.left;
        var yPositionNew = event.clientY - canvasRectPositionNew.top;

        drawPinpointRed(addSnagContext, xPositionNew, yPositionNew)

        // Add the values for x_coordinate and y_coordinate to the new snag form
        document.getElementById("xCoordNew").value = xPositionNew/scale;
        document.getElementById("yCoordNew").value = yPositionNew/scale; 

        //Adjust modal for new conditions:
        document.querySelector('#locationSelectedText').style.display = 'block';
        document.querySelector('#addSnagAddLocation').style.display = 'none';

        //re-open the modal with the form:
        var modalPopup = new bootstrap.Modal(document.getElementById(`addSnagModal`), {
            keyboard: true
        });
        var modalToggle = document.getElementById(`addSnagModal`)
        modalPopup.show(modalToggle);

        //Hide the second (top) canvas
        document.querySelector('#addSnagCanvasDiv').style.display = 'none';
        });
    } 
};
    
// Function to draw a pinpoint on the canvas
function drawPinpointGreen(context, x, y) {
    context.beginPath();
    context.arc(x, y, 15, 0, 2 * Math.PI);
    context.fillStyle = 'green';
    context.fill();
};
    
function drawPinpointRed(context, x, y) {
    context.beginPath();
    context.arc(x, y, 15, 0, 2 * Math.PI);
    context.fillStyle = 'red';
    context.fill();
};
    
function drawPinpointBlue(context, x, y) {
    context.beginPath();
    context.arc(x, y, 15, 0, 2 * Math.PI);
    context.fillStyle = 'blue';
    context.fill();
};
        
// Function to check if a point (mouse click) is inside a pinpoint
function isInsidePinpoint(pinpointX, pinpointY, mouseX, mouseY) {
    const distance = Math.sqrt((pinpointX - mouseX) ** 2 + (pinpointY - mouseY) ** 2);
    return distance <= 5; // Assuming a radius of 5 for the pinpoint
};

//Camera functions: 

function takePhoto(pin_id, csrftoken) {
    const canvas = document.querySelector(`#photo-canvas_${pin_id}`); 
    const video_window = document.querySelector(`#video_${pin_id}`);

    navigator.mediaDevices.getUserMedia({ video: {facingMode: 'environment'} })
    .then(function(stream) {
        video_window.srcObject = stream
        document.querySelector(`#screenshot-btn_${pin_id}`).addEventListener('click', () => getPhoto(stream, video_window, canvas, csrftoken, pin_id));
        document.querySelector(`#photo-modal-close-btn_${pin_id}`).addEventListener('click', () => stopStream(stream));
    })

    function getPhoto(stream, video_window, canvas, csrftoken, pin_id) {
        canvas.height = video_window.videoHeight;
        canvas.width = video_window.videoWidth;
        canvas.getContext('2d').drawImage(video_window, 0, 0);

        saveImageScreenshot(canvas, csrftoken, pin_id)

        nextWindowImage(canvas, pin_id)

        stream.getTracks().forEach(function(track) {
          track.stop();
        });
    };
};

function takePhotoAddSnag(csrftoken) {
    const canvas = document.querySelector(`#add_snag_photo-canvas`); 
    const video_window = document.querySelector(`#add_snag_video`);

    navigator.mediaDevices.getUserMedia({ video: {facingMode: 'environment'} })
    .then(function(stream) {
        video_window.srcObject = stream
        document.querySelector('#add_snag_screenshot-btn').addEventListener('click', () => getPhoto2(stream, video_window, canvas, csrftoken));
        document.querySelector('#photo-modal-close-btn2').addEventListener('click', () => stopStream(stream));
    })

    function getPhoto2(stream, video_window, canvas, csrftoken) {
        canvas.height = video_window.videoHeight;
        canvas.width = video_window.videoWidth;
        canvas.getContext('2d').drawImage(video_window, 0, 0);
        var imageData = canvas.toDataURL("image/png"); 
        const screenshotImage2 = document.querySelector('#add_snag_image');
        screenshotImage2.src = canvas.toDataURL('image/webp');

        stream.getTracks().forEach(function(track) {
          track.stop();
        });
    };
};

function saveImageScreenshot(canvas, csrftoken, pin_id) {
    var imageData = canvas.toDataURL("image/png"); 
    var formData = new FormData();
    formData.append('evidence', imageData);

    fetch(`/pinpoint_update/${pin_id}`, {
        method: 'POST',
        body: formData,
        headers: {
        'X-CSRFToken':csrftoken,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

function stopStream(stream) {
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
};

function uploadPhotoEvidenceFromFolder(csrftoken, pin_id) {

    var imageOnPageEvidence = document.getElementById(`mdl-thumbnail-evidence_${pin_id}`);
    var imageData = imageOnPageEvidence.src; 
    console.log(imageData)

    var formData = new FormData();
    formData.append('evidence', imageData);

    fetch(`/pinpoint_update/${pin_id}`, {
        method: 'POST',
        body: formData,
        headers: {
        'X-CSRFToken':csrftoken,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
};

function markAsReadyForInspectionUpload(csrftoken, pin_id) {
    fetch(`/pinpoint_update/${pin_id}`, {
        method: 'PUT',
        headers: {'X-CSRFToken':csrftoken},
        body: JSON.stringify({
            ready_for_inspection: true
        })
    })
    .then (refreshPage());
};

function nextWindowImage(canvas, pin_id) {
    const screenshotImage = document.querySelector(`#mdl-thumbnail-evidence_${pin_id}`);
    screenshotImage.src = canvas.toDataURL('image/webp');
};

// New snag submit functions: 
function submitSnagScreenshot(csrftoken, current_level_id) {
    // the contents: 
    var x_coordinate = document.querySelector(`#xCoordNew`).value;  
    var y_coordinate = document.querySelector(`#yCoordNew`).value;
    var sender = current_user_id
    var recipients = document.querySelector(`#newResponsible`).value;
    var canvas = document.querySelector(`#add_snag_photo-canvas`); 
    var photo  = canvas.toDataURL("image/png"); 

    var due_date = document.querySelector(`#dateInput`).value;
    var description = document.querySelector(`#newSnag-description`).value;

    // process information
    var formData = new FormData();
    formData.append('image', photo);
    formData.append('x_coordinate', x_coordinate);
    formData.append('y_coordinate', y_coordinate);
    formData.append('sender_id', sender);
    formData.append('recipient_id', recipients);
    formData.append('due_date', due_date);
    formData.append('description', description);

    //send also the current level:
    formData.append('current_level_id', current_level_id);

    // submit information via fetch - post:
    fetch(`/pinpoint_new`, {
        method: 'POST',
        body: formData,
        headers: {
        'X-CSRFToken':csrftoken,
        },
    })
    .then(response => {
        // refresh the page to diplay new pinpoint
        refreshPage()

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(responseData => {
        // Handle the response data here
        console.log('Response:', responseData);
      })
      .catch(error => {
        // Handle errors here
        console.error('Error:', error);
      });
};

function submitSnagUpload(csrftoken, current_level_id) {

    // the contents: 
    var imageOnPage = document.getElementById('add_snag_image');
    var photo = imageOnPage.src; 
    var x_coordinate = document.querySelector(`#xCoordNew`).value;  
    var y_coordinate = document.querySelector(`#yCoordNew`).value;
    var sender = current_user_id
    var recipients = document.querySelector(`#newResponsible`).value;

    var due_date = document.querySelector(`#dateInput`).value;
    var description = document.querySelector(`#newSnag-description`).value;

    // process  information
    var formData = new FormData();
    formData.append('image', photo);
    formData.append('x_coordinate', x_coordinate);
    formData.append('y_coordinate', y_coordinate);
    formData.append('sender_id', sender);
    formData.append('recipient_id', recipients);
    formData.append('due_date', due_date);
    formData.append('description', description);

    //send also the current level:
    formData.append('current_level_id', current_level_id);

    // submit information via fetch - post:
    fetch(`/pinpoint_new`, {
        method: 'POST',
        body: formData,
        headers: {
        'X-CSRFToken':csrftoken,
        },
    })
    .then(response => {
        // refresh the page to diplay new pinpoint
        refreshPage()

        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(responseData => {
        // Handle the response data here
        console.log('Response:', responseData);
    })
    .catch(error => {
        // Handle errors here
        console.error('Error:', error);
    });
};
    