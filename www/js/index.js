document.addEventListener("deviceready", init, false);
function init() {

    document.querySelector("#takeVideo").addEventListener("touchend", function() {
        navigator.device.capture.captureVideo(captureSuccess, captureError, {limit: 1});
    }, false);

    $('#app').on('click','.delete-video',function(){
        $(this).closest('.video-wrap').remove();
    })
}

function captureError(e) {
    alert("capture error: "+JSON.stringify(e));
    navigator.notification.alert('Error code: ' + e.code, null, 'Capture Error');
}

function captureSuccess(s) {

    //message part
    document.querySelector("#message").innerHTML = '';
    addMessage(JSON.stringify(s[0]));

    //downloadImage(s[0].localURL,s[0].name);
    //Move to app data directory
    var succ = function (s) {
        addMessage('-------succ!---------');
        addMessage(JSON.stringify(s));

        //Add new captured video
        var v = "<div class='video-wrap'>";
        v += "<video controls='controls'>";
        v += "<source src='" + s.nativeURL + "' type='video/mp4'>";
        v += "</video>";
        v += '<div class="row"><button class="btn btn-danger delete-video">Delete</button> </div>';
        v += '</div>';

        var newdiv = document.createElement('div');

        var divIdName = 'video_'+s.name+'_div';

        newdiv.setAttribute('id',divIdName);

        newdiv.innerHTML = v;

        document.querySelector("#videoArea").appendChild(newdiv);
    }
    var fail = function(err) {
        console.log(err);
        addMessage('-------err!---------');
        addMessage(JSON.stringify(err));
    }

    window.resolveLocalFileSystemURI(s[0].fullPath, function(file) {
        window.resolveLocalFileSystemURI(cordova.file.cacheDirectory, function(destination) {
            file.copyTo(destination,"tmp_"+s[0].name,succ,fail);
        },fail)
    },fail);

}

function addMessage(msg){
    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth()+1)  + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    var el = document.createElement('p');

    el.innerHTML = '<p>' + msg + '&nbsp;'+ datetime +'</p>';

    document.querySelector("#message").appendChild(el);
}
