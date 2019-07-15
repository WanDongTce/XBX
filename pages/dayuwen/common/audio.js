// 必须每次创建新的实例
function createAudio() {
    const innerAudioContext = wx.createInnerAudioContext();
    return innerAudioContext;
}
function destroyAudio(innerAudioContext, cb) {
    innerAudioContext.destroy();    //如何更换播放地址 实例必须销毁，因为小程序audio实例全局唯一
    cb && cb();
}

function startAudio(innerAudioContext, audioUrl, cb) {
    innerAudioContext.autoplay = false;
    innerAudioContext.src = audioUrl;
    innerAudioContext.play();
    innerAudioContext.onPlay(res => {
        console.log(res);
    });
    cb && cb();
}

function playAudio(innerAudioContext, cb) {
    innerAudioContext.play();
    cb && cb();
}

function pauseAudio(innerAudioContext, cb) {
    innerAudioContext.pause();
    innerAudioContext.onPause(res => {
        console.log(res);
    });
    cb && cb();
}

function upDateTimeAudio(innerAudioContext, cb) {
    innerAudioContext.onTimeUpdate(res => {
        cb();
    });
}

function stopAudio(innerAudioContext, cb) {
    innerAudioContext.stop();   //停止后的音频再播放会从头开始播放 此时实例不能销毁
    cb && cb();
}

// 自然播放至结束的事件
function endedAudio(innerAudioContext, cb) {
    innerAudioContext.onEnded(() => {
        cb && cb();
    });
}

//小程序音频播放接口没有继续播放api，调用InnerAudioContext.play() 替代

module.exports = {
    createAudio,
    destroyAudio,
    startAudio,
    playAudio,
    pauseAudio,
    stopAudio,
    upDateTimeAudio,
    endedAudio
}