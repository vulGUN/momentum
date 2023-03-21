import playList from './playList.js';

const audioPlayer = function () {
  const playBtn = document.querySelector('.play'),
    prevPlayBtn = document.querySelector('.play-prev'),
    nextPlayBtn = document.querySelector('.play-next');
  const audio = new Audio();

  let isPlay = false,
    playNum = 0,
    nowPlayTime = 0;

  audio.src = playList[playNum].src;

  audio.addEventListener('loadedmetadata', () => {
    progressBarValue.max = Math.floor(audio.duration);
  });

  function playPauseAudio() {
    if (!isPlay) {
      playAudio();
    } else pauseAudio();
  }

  let interval;

  function playAudio() {
    audio.src = playList[playNum].src;
    audio.play();
    audio.currentTime = nowPlayTime;
    interval = setInterval(updateCurrentTime, 100);
    updateCurrentTime();
    addEndTime();
    playBtn.classList.add('pause');
    playListContainer.children[playNum].classList.add('item-active');
    isPlay = true;
  }

  function pauseAudio() {
    audio.pause();
    playBtn.classList.remove('pause');
    playListContainer.children[playNum].classList.remove('item-active');
    nowPlayTime = audio.currentTime;
    isPlay = false;
    clearInterval(interval);
  }

  function nextSong() {
    nowPlayTime = 0;
    clearInterval(interval);
    playListContainer.children[playNum].classList.remove('item-active');
    playNum > playList.length - 2 ? (playNum = 0) : playNum++;
    playAudio();
    playBtn.classList.add('pause');
  }
  function prevSong() {
    nowPlayTime = 0;
    clearInterval(interval);
    playListContainer.children[playNum].classList.remove('item-active');
    playNum <= 0 ? (playNum = playList.length - 1) : playNum--;
    playAudio();
    playBtn.classList.add('pause');
  }

  playBtn.addEventListener('click', playPauseAudio);
  nextPlayBtn.addEventListener('click', nextSong);
  prevPlayBtn.addEventListener('click', prevSong);

  // добавление плейлиста на страницу

  const playListContainer = document.querySelector('.play-list');

  playList.forEach((el) => {
    /* playList - подгруженный JSON */
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = `${el.title}`;
    playListContainer.append(li);
  });

  playListContainer.addEventListener('click', (e) => {
    playPauseAudio();
    // console.dir(e.target);
    // if (e.target.classList.contains('item-active')) {
    // }
  });

  // отображение актуального времени проигрывания с перемоткой

  const actualTime = document.querySelector('.time-current'),
    timeEnd = document.querySelector('.time-end'),
    progressBarValue = document.querySelector('#progressBar');

  function addEndTime() {
    timeEnd.textContent = `${playList[playNum].duration}`;
  }
  addEndTime();

  function updatePlayTime() {
    let sec = Math.round(nowPlayTime) % 60,
      min = Math.floor(nowPlayTime / 60);

    actualTime.textContent = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  function updateCurrentTime() {
    updatePlayTime();

    progressBarValue.value = nowPlayTime;
    nowPlayTime = Math.round(audio.currentTime);

    if (audio.duration <= audio.currentTime) {
      clearInterval(interval);
      nextSong();
    }
  }

  // перемотка трека

  progressBarValue.addEventListener('input', () => {
    nowPlayTime = progressBarValue.value;
    clearInterval(interval);
    updatePlayTime();
  });

  progressBarValue.addEventListener('change', () => {
    if (isPlay) playAudio();
  });

  // регулировка громкости

  const volume = document.querySelector('.volume'),
    volumeBar = document.querySelector('#volumeBar');

  volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value / 100;
    if (audio.volume === 0) {
      volume.classList.add('volume-off');
    } else volume.classList.remove('volume-off');
  });

  volume.addEventListener('mouseover', () => {
    volumeBar.style.display = 'block';
  });
  volume.addEventListener('mouseout', () => {
    volumeBar.style.display = 'none';
  });
};

export default audioPlayer;
