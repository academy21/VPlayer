let controlBtn      = document.getElementById("control_button");
let fullscreenBtn   = document.getElementById("fullscreen");
let progressBar     = document.getElementById("progress_bar");
let currentPosition = document.getElementById("current_position");
let videoEl         = document.querySelector("#custom_video > video");
let playPauseSymbol = document.getElementById('playPauseSymbol');
let pauseFlg = false;

let currentTime = 0;
let currentPlayPauseId = 0;

function getCurrentVideoPositionInPercent() {
    let videoLength = videoEl.duration;
    currentTime = videoEl.currentTime;

    return (currentTime / videoLength) * 100;
}

function setCurrentProgressBarPosition(position) {
    currentPosition.style['width'] = position + "%";
}

function togglePlayPause(e) {
    if (pauseFlg) {
        videoEl.pause();
        playPauseSymbol.className = 'button_play';

        clearInterval(currentPlayPauseId);
    } else {
        videoEl.play();
        playPauseSymbol.className = 'button_pause';

        currentPlayPauseId = setInterval(function() {
            setCurrentProgressBarPosition(getCurrentVideoPositionInPercent());
        } , 100);
    }

    pauseFlg = !pauseFlg;
}

function toggleFullscreen() {
    if (videoEl.requestFullScreen) {
        videoEl.requestFullScreen();
    } else if (videoEl.webkitRequestFullScreen) {
        videoEl.webkitRequestFullScreen();
    } else if (videoEl.mozRequestFullScreen) {
        videoEl.mozRequestFullScreen();
    }
}

controlBtn.onclick = togglePlayPause;
fullscreenBtn.onclick = toggleFullscreen;

let custom_video = document.getElementById("custom_video");

custom_video.onmouseenter = function (e) {
    controlBtn.style['display'] = 'block';
    fullscreenBtn.style['display'] = 'block';
    progressBar.style['display'] = 'block';
};

custom_video.onmouseleave = function (e) {
    controlBtn.style['display'] = 'none';
    fullscreenBtn.style['display'] = 'none';
    progressBar.style['display'] = 'none';
};

document.body.onkeydown = function (e) {
    switch (e.keyCode) {
        case 32: // Space
            togglePlayPause();
            break;
    }
}
