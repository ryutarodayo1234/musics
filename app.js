// app.js
function compressPlayer() {
  const player = document.getElementsByClassName("player")[0]; // 最初の要素にアクセス
  player.classList.add("compressed");
}  

function expandPlayer() {
  const player = document.getElementsByClassName("player")[0]; // 最初の要素にアクセス
  player.classList.remove("compressed");
}

document.addEventListener("DOMContentLoaded", () => {
  const player = document.querySelector(".player");
  const albumList = document.getElementById("album-list"); // album-listの取得
  let touchStartY = 0;
  let touchEndY = 0;
  let isSwiped = false;
  let threshold = 100; // しきい値 (ピクセル単位)

  // album-listをクリックした時にcompressPlayerを呼び出す
  albumList.addEventListener("click", () => {
    compressPlayer();
  });

  player.addEventListener("touchstart", (e) => {
    touchStartY = e.touches[0].clientY;
  });

  player.addEventListener("touchend", () => {
    touchEndY = event.changedTouches[0].clientY;

    // スワイプの距離がしきい値を超えている場合に動作を実行
    if (Math.abs(touchStartY - touchEndY) > threshold) {
      if (touchStartY < touchEndY) {
        // 下にスワイプした場合
        compressPlayer();
        isSwiped = true;
      } else if (touchStartY > touchEndY) {
        // 上にスワイプした場合
        expandPlayer();
        isSwiped = true;
      }
    }
  });

});

document.addEventListener("DOMContentLoaded", () => {
  const trackTitle = document.querySelector(".track-title");
  const trackInfo = document.querySelector(".track-info");

  function checkOverflow() {
    if (trackTitle.scrollWidth > trackInfo.clientWidth) {
      trackTitle.classList.add("scroll-animation"); // アニメーションを追加
    } else {
      trackTitle.classList.remove("scroll-animation"); // アニメーションを削除
    }
  }

  // 初期読み込みとリサイズ時にチェック
  checkOverflow();
  window.addEventListener("resize", checkOverflow);
});

document.addEventListener("DOMContentLoaded", () => {
  const albums = document.querySelectorAll(".album");
  const trackTitleElement = document.querySelector(".track-title");
  const artistNameElement = document.querySelector(".artist-name");
  const trackDateElement = document.querySelector(".track-date");
  const playBtn = document.querySelector(".play-btn");
  const progressBar = document.querySelector(".progress-bar");
  const currentTimeEl = document.querySelector(".current-time");
  const durationEl = document.querySelector(".duration");
  const downloadBtn = document.querySelector(".download-btn");
  const repeatBtn = document.querySelector(".repeat-btn"); // 繰り返しボタン
  const audio = new Audio(); // 音楽再生用のAudioオブジェクト
  let isPlaying = false;
  let currentTrackURL = ""; // 現在再生中のトラックのURLを保存する変数
  let isRepeating = false; // 繰り返し状態を管理するフラグ

  // 繰り返しボタンのトグル
  repeatBtn.addEventListener("click", () => {
    isRepeating = !isRepeating; // 繰り返し状態を切り替え
    repeatBtn.classList.toggle("active", isRepeating); // ボタンの状態を視覚的に変更
  });

  // DOM要素を取得
  const trackInformation = document.querySelector('.track-information');
  const infoToggleBtn = document.querySelector('.info-toggle-btn');
  const infoCloseBtn = document.querySelector('.info-close-btn');

  // トグルボタンをクリックしたときの処理
  infoToggleBtn.addEventListener('click', () => {
    trackInformation.style.display = 'block';
  });

  // バツボタンをクリックしたときの処理
  infoCloseBtn.addEventListener('click', () => {
    trackInformation.style.display = 'none';
  });

  albums.forEach(album => {
    const toggleBtn = album.querySelector(".toggle-btn");
    const trackList = album.querySelector(".track-list");

    album.addEventListener("click", () => {
      albums.forEach(otherAlbum => {
        if (otherAlbum !== album) {
          otherAlbum.querySelector(".track-list").style.display = "none";
          otherAlbum.querySelector(".toggle-btn").textContent = "+";
        }
      });

      if (trackList.style.display === "none" || trackList.style.display === "") {
        trackList.style.display = "block";
        toggleBtn.textContent = "-";
      } else {
        trackList.style.display = "none";
        toggleBtn.textContent = "+";
      }
    });

    const tracks = trackList.querySelectorAll("li");
    tracks.forEach(track => {
      track.addEventListener("click", function() {
        const albumArt = this.getAttribute("album-art");
        const trackTitle = this.getAttribute("track-title");
        const artistName = this.getAttribute("artist-name");
        const trackDate = this.getAttribute("track-date");
        currentTrackURL = this.getAttribute("trackURL"); // トラックURLを取得

        if (albumArt) {
          document.querySelector(".album-art img").src = albumArt;
        }
        trackTitleElement.textContent = trackTitle;
        artistNameElement.textContent = artistName;
        trackDateElement.textContent = trackDate;

        audio.src = currentTrackURL;
        audio.load();
        audio.play();
        isPlaying = true;
        playBtn.textContent = "⏸️";

        progressBar.value = 0;
        currentTimeEl.textContent = "0:00";

        // プレイヤーを拡張表示にする
        expandPlayer();
      });
    });
  });

  playBtn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      playBtn.textContent = "▶️";
    } else {
      audio.play();
      playBtn.textContent = "⏸️";
    }
    isPlaying = !isPlaying;
  });

  audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = `-${formatTime(audio.duration - audio.currentTime)}`;
  });

  progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  });

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  }

  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = `-${formatTime(audio.duration)}`;
  });

  // ダウンロードボタンの動作
  downloadBtn.addEventListener("click", () => {
    if (currentTrackURL) {
      const a = document.createElement("a");
      a.href = currentTrackURL;
      a.download = currentTrackURL.split("/").pop(); // ファイル名を設定
      a.click();
    } else {
      alert("ダウンロードするトラックが選択されていません。");
    }
  });

  document.querySelector(".repeat-btn").addEventListener("click", function() {
    if (this.classList.contains("active")) {
      this.classList.remove("active");
      this.textContent = "🔄"; // 次へアイコンに変更
    } else {
      this.classList.add("active");
      this.textContent = "🔂"; // 繰り返しアイコンに変更
    }
  });
  
  // 音楽終了時の処理
  audio.addEventListener("ended", () => {
    if (isRepeating) {
      audio.currentTime = 0; // トラックの再生位置を0にリセット
      audio.play(); // 再生し直す
    } else {
      // 次の曲に進む処理を追加
      const nextTrack = getNextTrack();
      if (nextTrack) {
        nextTrack.click(); // 次の曲を自動的に再生
      }
    }
  });

  // 次の曲を取得する関数
  function getNextTrack() {
    const currentTrack = Array.from(document.querySelectorAll(".track-list li")).find(track => track.getAttribute("trackURL") === currentTrackURL);
    const nextTrack = currentTrack ? currentTrack.nextElementSibling : null;
    return nextTrack;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const creditBtn = document.querySelector(".credit-btn"); // credit-btnの要素を取得
  const trackInfoList = document.querySelector(".track-info-list");
  const trackInformation = document.querySelector(".track-information");

  // 曲情報を追加する関数
  function addTrackInfo(jobTitle, name) {
    // 名前が定義されていない場合は追加しない
    if (!name || name === "未定") return;

    const li = document.createElement("li");
    li.classList.add("info-item");

    const strong = document.createElement("strong");
    strong.classList.add("job-title");
    strong.textContent = jobTitle;

    const br = document.createElement("br");  // 改行タグを作成

    const span = document.createElement("span");
    span.classList.add("name");
    span.textContent = name;

    li.appendChild(strong);
    li.appendChild(br);  // 改行を追加
    li.appendChild(span);

    trackInfoList.appendChild(li);
  }

  // track-list内のトラックがクリックされたときの処理
  const trackListItems = document.querySelectorAll("#album-list .track-list li");

  trackListItems.forEach(item => {
    item.addEventListener("click", () => {
      // trackInfoListをクリア
      trackInfoList.innerHTML = '';

      // クリックされたトラックの情報を取得
      const artistName = item.getAttribute("artist-name");
      const trackTitle = item.getAttribute("track-title");
      const trackDate = item.getAttribute("track-date");
      const composerName = item.getAttribute("composer-name");
      const lyricistName = item.getAttribute("lyricist-name");
      const singerName = item.getAttribute("singer-name");

      // 定義されている情報をリストに追加
      if (artistName) addTrackInfo("アーティスト名", artistName);
      if (trackTitle) addTrackInfo("曲名", trackTitle);
      if (trackDate) addTrackInfo("リリース日", trackDate);
      if (composerName) addTrackInfo("作曲者", composerName);
      if (lyricistName) addTrackInfo("作詞者", lyricistName);
      if (singerName) addTrackInfo("歌手名", singerName);

    });
  });

  // credit-btnをクリックしたときに曲情報を表示
  creditBtn.addEventListener("click", () => {
    if (trackInformation.style.display === "none" || trackInformation.style.display === "") {
      trackInformation.style.display = "block";
    } else {
      trackInformation.style.display = "none";
    }
  });
});
