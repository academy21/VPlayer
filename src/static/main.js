let controlBtn      = document.getElementById("play_pause_button");
let controlsBar     = document.getElementById("controls");
let fullscreenBtn   = document.getElementById( "fullscreen" );
let restartBtn      = document.getElementById("restart");
let progressBar     = document.getElementById("progress_bar");
let currentPosition = document.getElementById("current_position");
let videoEl         = document.querySelector("#custom_video > video");
let playPauseSymbol = document.getElementById('playPauseSymbol');
let pauseFlg = true;
let mouseInsideFlg = false;

let currentTime = 0;
let currentPlayPauseId = 0;

let rewindInterval = 5;

function rewindVideo(time) {
    let newCurrentTime = videoEl.currentTime + time;

    if ( newCurrentTime > videoEl.duration ) {
        videoEl.currentTime = videoEl.duration;
    } else {
        videoEl.currentTime = newCurrentTime;
    }
}

function getCurrentVideoPositionInPercent() {
    let videoLength = videoEl.duration;
    currentTime = videoEl.currentTime;

    return (currentTime / videoLength) * 100;
}

function setCurrentProgressBarPosition(position) {
    currentPosition.style['width'] = position + "%";
}

function updateTimer() {
    let substrPosition;
    let length;

    let currentTime = videoEl.currentTime;
    substrPosition = currentTime < 60*60 ? 14 : 11;
    length = 19 - substrPosition;
    currentTime = new Date(currentTime * 1000).toISOString().substr(substrPosition, length);

    let videoLength = videoEl.duration;
    substrPosition = videoLength < 60*60 ? 14 : 11;
    length = 19 - substrPosition;
    videoLength = new Date( videoLength * 1000).toISOString().substr(substrPosition, length);

    let timerPlaceholder = document.getElementById("timer");
    timerPlaceholder.innerHTML = currentTime + " / " + videoLength;
}

window.onload = function() {
    updateTimer();
}

function togglePlayPause() {
    if (!pauseFlg) {
        videoEl.pause();
        playPauseSymbol.className = 'button_play';

        clearInterval(currentPlayPauseId);
    } else {
        videoEl.play();
        playPauseSymbol.className = 'button_pause';

        currentPlayPauseId = setInterval(function() {
            setCurrentProgressBarPosition(getCurrentVideoPositionInPercent());
            updateTimer();
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

function restartVideo() {
    videoEl.currentTime = 0.0;
    setCurrentProgressBarPosition(getCurrentVideoPositionInPercent());
}

controlBtn.onclick = togglePlayPause;
fullscreenBtn.onclick = toggleFullscreen;
restartBtn.onclick = restartVideo;

let custom_video = document.getElementById("custom_video");

function showControls () {
    controlBtn.style['display'] = 'block';
    controlsBar.style['opacity'] = 1;
    //progressBar.style['display'] = 'block';
}

function hideControls() {
    controlBtn.style['display'] = 'none';
    controlsBar.style['opacity'] = 0;
    //progressBar.style['display'] = 'none';
}

function hideControlsOnPlay() {
    if ( !pauseFlg ) {
        hideControls();
    }
}

function reinitEventsOnMouseEnter() {
    showControls();
    mouseInsideFlg = true;
}

function reinitEventsOnMouseLeave() {
    hideControlsOnPlay();
    mouseInsideFlg = false;
}

function setControlsVisibility() {
    if ( !mouseInsideFlg && !pauseFlg ) {
        hideControls();
    } else {
        showControls();
    }
}

custom_video.onmouseenter = reinitEventsOnMouseEnter;
custom_video.onmouseleave = reinitEventsOnMouseLeave;

document.body.onkeydown = function (e) {
    switch (e.keyCode) {
        case 32: // Space
            togglePlayPause();
            setControlsVisibility();
            break;
        case 37: // Left
            rewindVideo(-rewindInterval);
            updateTimer();
            setCurrentProgressBarPosition(getCurrentVideoPositionInPercent());
            break;
        case 39: // Right
            rewindVideo(rewindInterval);
            updateTimer();
            setCurrentProgressBarPosition(getCurrentVideoPositionInPercent());
            break;
    }
}
