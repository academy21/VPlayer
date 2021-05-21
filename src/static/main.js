let controlBtn = document.getElementById("play_pause_button");
let controlsBar = document.getElementById("controls");
let fullscreenBtn = document.getElementById("fullscreen");
let restartBtn = document.getElementById("restart");
let progressBar = document.getElementById("progress_bar");
let currentPosition = document.getElementById("current_position");
let videoEl = document.querySelector("#custom_video > video");
let playPauseSymbol = document.getElementById('playPauseSymbol');
let volumeIcon = document.getElementById("volume");
let pauseFlg = true;
let mouseInsideFlg = false;

let currentTime = 0;
let currentPlayPauseId = 0;

const rewindInterval = 5; // in seconds
const volumeShiftinterval = 10; // in percents

function rewindVideo(time) {
    let newCurrentTime = videoEl.currentTime + time;

    if (newCurrentTime > videoEl.duration) {
        videoEl.currentTime = videoEl.duration;
    } else {
        videoEl.currentTime = newCurrentTime;
    }
}

function setCurrentVideoTime(time) {
    if (time >= 0 && time <= videoEl.duration) {
        videoEl.currentTime = time;
    }

    if (time < 0) {
        videoEl.currentTime = 0;
    }

    if (time > videoEl.duration) {
        videoEl.currentTime = videoEl.duration;
    }
}

function getCurrentVideoPositionInPercent() {
    let videoLength = videoEl.duration;
    currentTime = videoEl.currentTime;

    return (currentTime / videoLength) * 100;
}

function setCurrentProgressBarPositionInPercents(position) {
    currentPosition.style['width'] = position + "%";
}

function updateTimer() {
    let substrPosition;
    let length;

    let currentTime = videoEl.currentTime;
    substrPosition = currentTime < 60 * 60 ? 14 : 11;
    length = 19 - substrPosition;
    currentTime = new Date(currentTime * 1000).toISOString().substr(substrPosition, length);

    let videoLength = videoEl.duration;
    substrPosition = videoLength < 60 * 60 ? 14 : 11;
    length = 19 - substrPosition;
    videoLength = new Date(videoLength * 1000).toISOString().substr(substrPosition, length);

    let timerPlaceholder = document.getElementById("timer");
    timerPlaceholder.innerHTML = currentTime + " / " + videoLength;
}

window.onload = function () {
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

        currentPlayPauseId = setInterval(function () {
            setCurrentProgressBarPositionInPercents(getCurrentVideoPositionInPercent());
            updateTimer();
        }, 100);
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
    setCurrentProgressBarPositionInPercents(getCurrentVideoPositionInPercent());
}

controlBtn.onclick = togglePlayPause;
fullscreenBtn.onclick = toggleFullscreen;
restartBtn.onclick = restartVideo;

let custom_video = document.getElementById("custom_video");

function showControls() {
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
    if (!pauseFlg) {
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
    if (!mouseInsideFlg && !pauseFlg) {
        hideControls();
    } else {
        showControls();
    }
}

function setCurrentVolume(val) {
    if (val < 0) {
        videoEl.volume = 0;
        return videoEl.volume;
    }

    if (val > 1) {
        videoEl.volume = 1;
        return videoEl.volume;
    }

    return videoEl.volume = val;
}

function shiftVolumeInPercents(val) {
    let volumeShift = val / 100;
    let newVolumeVal = videoEl.volume + volumeShift;

    return setCurrentVolume(newVolumeVal);
}

function updateVolumeIcon(val) {
    console.log("val", val);

    volumeIcon.className = '';

    if ( val >= 0.75 ) {
        volumeIcon.className = 'progress_100';
        return;
    }

    if ( val >= 0.50 ) {
        volumeIcon.className = 'progress_75';
        return;
    }

    if ( val >= 0.25 ) {
        volumeIcon.className = 'progress_50';
        return;
    }

    if ( val >= 0.1 ) {
        volumeIcon.className = 'progress_25';
        return;
    }

    volumeIcon.className = 'progress_00';
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
            setCurrentProgressBarPositionInPercents(getCurrentVideoPositionInPercent());
            break;
        case 39: // Right
            rewindVideo(rewindInterval);
            updateTimer();
            setCurrentProgressBarPositionInPercents(getCurrentVideoPositionInPercent());
            break;
        case 38: // Up
            updateVolumeIcon(shiftVolumeInPercents(+volumeShiftinterval));
            break;
        case 40: // Down
            updateVolumeIcon(shiftVolumeInPercents(-volumeShiftinterval));
            break;
    }
}

function getVideoPositionInSeconds(percents) {
    return videoEl.duration / 100 * percents;
}

progressBar.addEventListener('click', function (event) {
    let progress_bar_width = progressBar.offsetWidth;
    let current_mouse_click_x_position = event.offsetX;
    let progress_bar_width_in_percents = (current_mouse_click_x_position / progress_bar_width) * 100;

    setCurrentVideoTime(getVideoPositionInSeconds(progress_bar_width_in_percents));
    setCurrentProgressBarPositionInPercents(progress_bar_width_in_percents);
    updateTimer();
}, false);

function initPlayer() {
    updateVolumeIcon(setCurrentVolume(0.49));
}

initPlayer();
