const welcomePage = document.getElementById("welcomePage");
const appPage = document.getElementById("appPage");
const startBtn = document.getElementById("startBtn");

const pageTitle = document.getElementById("pageTitle");
const pageSubtitle = document.getElementById("pageSubtitle");
const todayInfo = document.getElementById("todayInfo");
const recordDateInput = document.getElementById("recordDate");
const musicToggleBtn = document.getElementById("musicToggleBtn");
const musicSelect = document.getElementById("musicSelect");
const bgmAudio = document.getElementById("bgmAudio");
let isPlaying = false;

const contentSections = document.querySelectorAll(".content-section");
const navButtons = document.querySelectorAll(".nav-btn");
const featureCards = document.querySelectorAll(".feature-card");

const form = document.getElementById("goodThingsForm");
const resultSection = document.getElementById("resultSection");
const resultContent = document.getElementById("resultContent");

const chatForm = document.getElementById("chatForm");
const chatResultSection = document.getElementById("chatResultSection");
const chatResultContent = document.getElementById("chatResultContent");

const settingsForm = document.getElementById("settingsForm");
const settingsMessage = document.getElementById("settingsMessage");

const reviewContent = document.getElementById("reviewContent");
const permaChartCanvas = document.getElementById("permaChart");
const clearRecordsBtn = document.getElementById("clearRecordsBtn");
const RECORDS_KEY = "goodThingsRecords";
const PERMA_PALETTE_KEY = "permaChartPaletteKey";
const BGM_TRACK_KEY = "goodBearBgmTrack";
const BGM_PLAYING_KEY = "goodBearBgmPlaying";
const LIFF_ID = "2009972717-AHG9Uiv8";
let permaChartInstance = null;
const permaChartPalettes = {
  warm: ["#E7A7C3", "#F3C7D9", "#D8B9E8", "#C7B6E6", "#BFA7D8"],
  pastel: ["#FFB6C1", "#FFDDA1", "#A2E4B8", "#AEC6CF", "#DDBDF1"],
  roseBrown: ["#E6A5B8", "#DDB1C4", "#D1B8D8", "#C9B4C1", "#C5A78E"]
};
const permaChartGradientPairs = {
  pastel: [
    ["#FFEAF0", "#FF7C97"],
    ["#FFF2D7", "#FFC267"],
    ["#DEF8E8", "#66CF95"],
    ["#E1EDF1", "#7EAABA"],
    ["#F2E8FF", "#B78BE5"]
  ]
};
let activePermaPaletteKey = "pastel";
const permaGradientCache = {};

const pageInfo = {
  homeSection: {
    title: "主畫面",
    subtitle: "今天也讓好好熊陪你，好好生活、好好照顧自己。"
  },
  goodThingsSection: {
    title: "三件好事",
    subtitle: "記錄今天的小小幸福，也溫柔接住自己的心情。"
  },
  chatSection: {
    title: "好好熊陪聊",
    subtitle: "把今天的心情說出來，好好熊會陪你一起整理。"
  },
  reviewSection: {
    title: "幸福回顧",
    subtitle: "回頭看看最近的幸福感來源與努力痕跡。"
  },
  settingsSection: {
    title: "個人設定",
    subtitle: "建立屬於你的療癒小空間。"
  }
};
function updateTodayInfo() {
    const now = new Date();
  
    const date = now.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    });
  
    const time = now.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit"
    });
  
    todayInfo.textContent = `🧸 今天是 ${date}，現在是 ${time}，適合記下一點小幸福。`;
  }
  
  updateTodayInfo();
  function getTodayInputValue() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
  
    return `${year}-${month}-${day}`;
  }
  
  function setDefaultRecordDate() {
    recordDateInput.value = getTodayInputValue();
  }
  
  setDefaultRecordDate();

function persistBgmState() {
  try {
    if (musicSelect) {
      localStorage.setItem(BGM_TRACK_KEY, musicSelect.value);
    }
    localStorage.setItem(BGM_PLAYING_KEY, isPlaying ? "true" : "false");
  } catch (e) {
    // 略過（例如隱私模式無法寫入）
  }
}

function isValidBgmOption(value) {
  if (!musicSelect || !value) {
    return false;
  }
  return Array.from(musicSelect.options).some(function (opt) {
    return opt.value === value;
  });
}

if (musicSelect && bgmAudio) {
  bgmAudio.addEventListener("error", function () {
    const mediaError = bgmAudio.error;
    console.warn(
      "背景音樂載入失敗，請確認檔案存在於專案目錄：",
      bgmAudio.currentSrc || bgmAudio.src,
      mediaError
    );
    if (musicToggleBtn) {
      musicToggleBtn.textContent = "🎵";
    }
    isPlaying = false;
    try {
      localStorage.setItem(BGM_PLAYING_KEY, "false");
    } catch (e) {
      // 略過
    }
  });

  try {
    const savedTrack = localStorage.getItem(BGM_TRACK_KEY);
    if (savedTrack && isValidBgmOption(savedTrack)) {
      musicSelect.value = savedTrack;
    }
  } catch (e) {
    // 略過讀取失敗
  }

  bgmAudio.src = musicSelect.value;

  let savedWantPlay = false;
  try {
    savedWantPlay = localStorage.getItem(BGM_PLAYING_KEY) === "true";
  } catch (e) {
    savedWantPlay = false;
  }

  if (savedWantPlay && musicToggleBtn) {
    bgmAudio
      .play()
      .then(function () {
        isPlaying = true;
        musicToggleBtn.textContent = "⏸️";
      })
      .catch(function () {
        isPlaying = false;
        musicToggleBtn.textContent = "🎵";
        try {
          localStorage.setItem(BGM_PLAYING_KEY, "false");
        } catch (e2) {
          // 略過
        }
      });
  }
}

if (musicToggleBtn && musicSelect && bgmAudio) {
  musicToggleBtn.addEventListener("click", function () {
    if (!isPlaying) {
      bgmAudio
        .play()
        .then(function () {
          musicToggleBtn.textContent = "⏸️";
          isPlaying = true;
          persistBgmState();
        })
        .catch(function (error) {
          console.warn("背景音樂播放失敗：", error);
        });
      return;
    }

    bgmAudio.pause();
    musicToggleBtn.textContent = "🎵";
    isPlaying = false;
    persistBgmState();
  });

  musicSelect.addEventListener("change", function () {
    bgmAudio.src = musicSelect.value;
    persistBgmState();

    if (isPlaying === true) {
      bgmAudio.play().catch(function (error) {
        console.warn("切換背景音樂後播放失敗：", error);
        isPlaying = false;
        musicToggleBtn.textContent = "🎵";
        persistBgmState();
      });
    }
  });
}

startBtn.addEventListener("click", function () {
  welcomePage.classList.add("hidden");
  appPage.classList.remove("hidden");
  showSection("goodThingsSection");
});
function enterAppIfUrlHasPage() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
  
    if (page) {
      welcomePage.classList.add("hidden");
      appPage.classList.remove("hidden");
    }
  }
  
  enterAppIfUrlHasPage();

navButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const target = button.dataset.target;
    showSection(target);
  });
});

featureCards.forEach(function (card) {
  card.addEventListener("click", function () {
    const target = card.dataset.target;
    showSection(target);
  });
});

function showSection(sectionId) {
  contentSections.forEach(function (section) {
    section.classList.add("hidden");
  });

  document.getElementById(sectionId).classList.remove("hidden");

  pageTitle.textContent = pageInfo[sectionId].title;
  pageSubtitle.textContent = getPersonalizedSubtitle(sectionId);

  navButtons.forEach(function (button) {
    if (button.dataset.target === sectionId) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  if (sectionId === "reviewSection") {
    renderReview();
  }
  
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}
function openSectionFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get("page");
  
    const pageMap = {
      good: "goodThingsSection",
      chat: "chatSection",
      review: "reviewSection",
      settings: "settingsSection",
      home: "homeSection"
    };
  
    if (page && pageMap[page]) {
      showSection(pageMap[page]);
    }
  }
  
  openSectionFromUrl();

function getCheckedPermaValue(groupName) {
  const selected = document.querySelector(
    `#goodThingsForm input[name="${groupName}"]:checked`
  );
  return selected ? selected.value : "";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const good1 = document.getElementById("good1").value.trim();
  const good2 = document.getElementById("good2").value.trim();
  const good3 = document.getElementById("good3").value.trim();
  const perma1 = getCheckedPermaValue("perma-good1");
  const perma2 = getCheckedPermaValue("perma-good2");
  const perma3 = getCheckedPermaValue("perma-good3");
  const recordDate = recordDateInput.value;

  if (!good1 || !good2 || !good3) {
    alert("請先寫下三件好事，讓今天的小幸福被好好記錄下來。");
    return;
  }

  if (!perma1 || !perma2 || !perma3) {
    alert("請為每一件好事都選擇一個 PERMA 類別。");
    return;
  }

  const aiMessage = generateGoodThingsResponse();
  saveGoodThingsRecord(good1, good2, good3, perma1, perma2, perma3, recordDate);

  resultContent.innerHTML = `
    <p>今天你記錄了三件值得感謝的事：</p>

    <div class="goodthings-box">
      <ol class="result-list">
        <li>${escapeHtml(good1)}（${escapeHtml(getPermaLabel(perma1))}）</li>
        <li>${escapeHtml(good2)}（${escapeHtml(getPermaLabel(perma2))}）</li>
        <li>${escapeHtml(good3)}（${escapeHtml(getPermaLabel(perma3))}）</li>
      </ol>
    </div>

    <div class="ai-response">
      <div class="ai-title">🧸 好好熊的陪伴回饋</div>
      ${aiMessage}
    </div>
  `;

  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth" });

  form.reset();
  setDefaultRecordDate();
});

chatForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const chatInput = document.getElementById("chatInput").value.trim();

  if (!chatInput) {
    alert("可以先寫下一點點心情，好好熊才知道怎麼陪你喔!");
    return;
  }

  const chatMessage = generateAIResponse(chatInput);

  chatResultContent.innerHTML = `
    <div class="ai-response">
      <div class="ai-title">🧸 好好熊聽見了</div>
      ${chatMessage}
    </div>
  `;

  chatResultSection.classList.remove("hidden");
  chatResultSection.scrollIntoView({ behavior: "smooth" });
});

settingsForm.addEventListener("submit", function (event) {
    event.preventDefault();
  
    const nickname = document.getElementById("nickname").value.trim();
    const theme = document.getElementById("themeSelect").value;
    const tone = document.getElementById("toneSelect").value;
  
    const settings = {
      nickname: nickname,
      theme: theme,
      tone: tone
    };
  
    localStorage.setItem("goodBearSettings", JSON.stringify(settings));
  
    applySettings(settings);
    pageSubtitle.textContent = getPersonalizedSubtitle("settingsSection");
  
    settingsMessage.textContent = "設定已儲存，好好熊會記得你的偏好。";
    settingsMessage.classList.remove("hidden");
  });

function generateGoodThingsResponse() {
    return `
      <div class="ai-block">
        <span class="ai-label">好好熊看見了：</span>
        你今天記錄了三件好事，代表你正在練習把注意力放回生活中值得感謝的片刻。
      </div>
      <div class="ai-block">
        <span class="ai-label">小小提醒：</span>
        這些事情也許看起來不大，但它們都是今天支持你繼續前進的小光點。
      </div>
      <div class="ai-block">
        <span class="ai-label">今日練習：</span>
        可以試著選出今天最有感的一件好事，睡前再想起它一次，讓這份溫暖多停留一下。
      </div>
    `;
  }
  function generateAIResponse(whisper) {
    if (!whisper) {
      const emptyResponses = [
        `
          <div class="ai-block">
            好好熊在這裡陪你。現在不知道要說什麼也沒關係，可以先從一句很簡單的話開始：「我今天其實有一點……」
          </div>
          <div class="ai-block">
            有時候心情不是馬上就能說清楚的，慢慢靠近自己，也是一種照顧自己的方式。
          </div>
        `,
        `
          <div class="ai-block">
            你不需要一次把所有感受都整理好。可以先寫一點點，哪怕只是一句「我今天有點累」，好好熊也會陪你慢慢看見它。
          </div>
          <div class="ai-block">
            今天的你，已經願意停下來看看自己的心，這就很不容易了。
          </div>
        `,
        `
          <div class="ai-block">
            如果現在腦袋空空的，也可以先不用勉強自己。你可以先深呼吸一下，問問自己：「我現在最需要的是休息、陪伴，還是被理解？」
          </div>
        `
      ];
  
      return getRandomResponse(emptyResponses);
    }
  
    let emotionType = "general";
  
    if (
      whisper.includes("焦慮") ||
      whisper.includes("壓力") ||
      whisper.includes("緊張") ||
      whisper.includes("擔心") ||
      whisper.includes("怕") ||
      whisper.includes("累") ||
      whisper.includes("忙")
    ) {
      emotionType = "stress";
    } else if (
      whisper.includes("難過") ||
      whisper.includes("想哭") ||
      whisper.includes("低落") ||
      whisper.includes("失落") ||
      whisper.includes("委屈") ||
      whisper.includes("孤單")
    ) {
      emotionType = "sad";
    } else if (
      whisper.includes("煩") ||
      whisper.includes("生氣") ||
      whisper.includes("不爽") ||
      whisper.includes("討厭") ||
      whisper.includes("火大")
    ) {
      emotionType = "angry";
    } else if (
      whisper.includes("開心") ||
      whisper.includes("快樂") ||
      whisper.includes("幸福") ||
      whisper.includes("期待") ||
      whisper.includes("感動") ||
      whisper.includes("順利")
    ) {
      emotionType = "happy";
    }
  
    const responseGroups = {
      stress: [
        `
          <div class="ai-block">
            好好熊聽見你今天有點焦慮，也感覺到你可能一直在努力撐住很多事情。
          </div>
          <div class="ai-block">
            有時候壓力大，不代表你不夠努力，而是代表你真的同時承擔了太多。你可以先不用急著要求自己立刻變好，先讓自己喘一口氣。
          </div>
          <div class="ai-block">
            如果你願意，可以慢慢想想：現在最讓你累的，是事情太多，還是你很擔心自己做不好呢？
          </div>
          <div class="ai-block">
            現在可以試著吸氣 4 秒、停一下、再慢慢吐氣 6 秒，重複三次。先讓身體知道：我現在是安全的，我可以慢慢來。
          </div>
        `,
        `
          <div class="ai-block">
            好好熊感覺到你今天可能繃得很緊，好像一直在提醒自己「要趕快、要做好、不能出錯」。
          </div>
          <div class="ai-block">
            但你可以先停一下，告訴自己：我不是機器，我也需要休息。事情很多的時候，不代表我要一次全部完成。
          </div>
          <div class="ai-block">
            你可以先選一件最小、最容易開始的事情做就好。完成一小步，也是在往前。
          </div>
          <div class="ai-block">
            如果可以，現在先喝一口水，放鬆肩膀，讓自己從「我必須撐住」慢慢回到「我可以一步一步來」。
          </div>
        `,
        `
          <div class="ai-block">
            好好熊聽見你的壓力了。也許你不是不想休息，而是心裡有個聲音一直說：「我還不能停。」
          </div>
          <div class="ai-block">
            可是休息不是偷懶，而是讓自己有力氣繼續生活。你不需要等到完全崩潰，才允許自己喘口氣。
          </div>
          <div class="ai-block">
            可以試著問問自己：我現在最害怕的結果是什麼？這個結果真的一定會發生嗎？有沒有一個比較溫柔的解釋？
          </div>
        `
      ],
  
      sad: [
        `
          <div class="ai-block">
            好好熊聽見你今天有些難過，也許心裡有一點委屈，或是有些話不知道該怎麼說出口。
          </div>
          <div class="ai-block">
            難過不代表你太脆弱，而是代表這件事對你來說真的很重要。你會有感受，是因為你很在乎。
          </div>
          <div class="ai-block">
            如果你願意，可以慢慢想想：今天最讓你受傷的，是發生的事情，還是你對自己的某個想法呢？
          </div>
          <div class="ai-block">
            今晚可以先對自己溫柔一點，聽一首舒服的歌、抱抱枕頭，或寫下一句：「我已經很努力了，現在可以先休息一下。」
          </div>
        `,
        `
          <div class="ai-block">
            好好熊想先輕輕陪你坐一下。今天的難過不需要急著被解決，它可以先被理解。
          </div>
          <div class="ai-block">
            有些感受之所以很痛，是因為我們真的在乎。這份在乎不是錯，也不是麻煩，而是你很真誠的一部分。
          </div>
          <div class="ai-block">
            如果現在想哭，也沒有關係。哭不是退步，而是身體在幫你把壓著的東西慢慢釋放出來。
          </div>
        `,
        `
          <div class="ai-block">
            好好熊感覺到你今天可能有點孤單，像是有些感受沒有人真正聽見。
          </div>
          <div class="ai-block">
            但你願意把它寫下來，就代表你沒有完全放下自己。你正在用自己的方式，試著照顧那個有點受傷的自己。
          </div>
          <div class="ai-block">
            也許今晚不用逼自己開心，只要做一件讓自己稍微舒服一點的事就好，例如洗個熱水澡、聽歌，或早點躺下。
          </div>
        `
      ],
  
      angry: [
        `
          <div class="ai-block">
            好好熊聽見你今天有點生氣，也感覺到你可能有些煩躁、很悶，甚至有點委屈。
          </div>
          <div class="ai-block">
            有時候生氣不是壞事，它可能是在提醒你：你的界線被碰到了，或你的需求沒有被看見。
          </div>
          <div class="ai-block">
            如果你願意，可以慢慢想想：你最在意的是事情不如預期，還是你覺得自己沒有被理解呢？
          </div>
          <div class="ai-block">
            現在可以先離開讓你煩躁的情境幾分鐘，慢慢呼吸，或把情緒寫下來。等情緒降下來後，再想想自己真正想表達的是什麼。
          </div>
        `,
        `
          <div class="ai-block">
            好好熊感覺到你今天很不舒服，也許不是單純的生氣，而是覺得「為什麼事情會變成這樣」。
          </div>
          <div class="ai-block">
            你的生氣可能正在保護你，提醒你有些地方需要被尊重。先不用急著責怪自己怎麼會生氣。
          </div>
          <div class="ai-block">
            可以試著把這句話補完：「我真正希望被看見的是……」這會幫助你更靠近自己真正的需求。
          </div>
        `,
        `
          <div class="ai-block">
            好好熊知道，當心裡很煩的時候，要馬上冷靜其實很難。
          </div>
          <div class="ai-block">
            所以現在不需要立刻講道理，也不用逼自己馬上想通。你可以先把情緒放在紙上，寫下：「我現在很生氣，因為……」
          </div>
          <div class="ai-block">
            等情緒比較降下來，再決定要不要溝通、怎麼溝通。你有權利保護自己的界線，也可以用比較不傷害自己的方式表達。
          </div>
        `
      ],
  
      happy: [
        `
          <div class="ai-block">
            好好熊感覺到你今天有一些開心、期待，或被幸福接住的時刻。
          </div>
          <div class="ai-block">
            這樣的時刻很值得被好好保存，因為它們會慢慢累積成支持你的力量。
          </div>
          <div class="ai-block">
            如果你願意，可以想想：今天最讓你開心的那一刻，為什麼對你來說特別重要呢？
          </div>
          <div class="ai-block">
            希望你能把這份感覺收進心裡，也記得對自己說：「我值得擁有這些開心與放鬆的時刻。」
          </div>
        `,
        `
          <div class="ai-block">
            好好熊也替你感到開心。能夠注意到生活裡讓自己幸福的片刻，是很珍貴的能力。
          </div>
          <div class="ai-block">
            也許這份開心不一定很巨大，但它有被你接住，這就很重要。
          </div>
          <div class="ai-block">
            你可以試著把這份感覺記在心裡：今天有一個時刻，我是被生活溫柔對待的。
          </div>
        `,
        `
          <div class="ai-block">
            聽起來今天有一些很棒的事情發生。好好熊想提醒你：你可以允許自己好好享受這份開心。
          </div>
          <div class="ai-block">
            有時候我們太習慣擔心下一件事，反而忘記停下來收下眼前的幸福。
          </div>
          <div class="ai-block">
            今天可以把這份快樂多停留一下，讓它成為你明天繼續前進的小能量。
          </div>
        `
      ],
  
      general: [
        `
          <div class="ai-block">
            好好熊聽見你把今天的心情寫下來了。無論今天是順利、普通，還是有一點混亂，這些感受都值得被看見。
          </div>
          <div class="ai-block">
            有時候一天過得不完美，不代表你做得不夠，而只是今天真的不容易。
          </div>
          <div class="ai-block">
            如果你願意，可以慢慢想想：如果用一句話形容今天，你會怎麼描述它呢？
          </div>
          <div class="ai-block">
            現在可以先喝口水、深呼吸，或暫時放下手機一分鐘，讓自己慢慢回到當下。
          </div>
        `,
        `
          <div class="ai-block">
            好好熊在這裡陪你一起整理今天。你不需要把感受說得很漂亮，也不需要立刻找到答案。
          </div>
          <div class="ai-block">
            你可以先問問自己：今天有什麼事情讓我消耗？又有什麼事情讓我稍微被支持？
          </div>
          <div class="ai-block">
            慢慢把這些線索記下來，你會更理解自己，也會更知道自己需要什麼。
          </div>
        `,
        `
          <div class="ai-block">
            謝謝你把今天的一部分交給好好熊。能夠把心情寫下來，本身就是一種整理。
          </div>
          <div class="ai-block">
            也許今天不是特別好，也不是特別壞，但它仍然是你真實經歷過的一天。
          </div>
          <div class="ai-block">
            你可以試著對自己說：「今天的我，也值得被溫柔對待。」
          </div>
        `
      ]
    };
  
    const response = getRandomResponse(responseGroups[emotionType]);
    return addToneIntro(response);
  }

  function getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function saveGoodThingsRecord(good1, good2, good3, perma1, perma2, perma3, recordDate) {
    const records = getGoodThingsRecords();
  
    const newRecord = {
      date: formatRecordDate(recordDate),
      time: new Date().toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      goodThings: [
        { text: good1, perma: perma1 },
        { text: good2, perma: perma2 },
        { text: good3, perma: perma3 }
      ]
    };
  
    records.push(newRecord);
  
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  }
  
  function getGoodThingsRecords() {
    const savedRecords = localStorage.getItem(RECORDS_KEY);
  
    if (!savedRecords) {
      return [];
    }
  
    return JSON.parse(savedRecords);
  }

  function generatePermaTestRecords() {
    const categoryTemplates = {
      P: ["散步看到很美的夕陽", "喝到喜歡的飲料", "聽到喜歡的歌曲"],
      E: ["專心把報告段落完成", "讀書時進入心流狀態", "運動時全神投入"],
      R: ["和同學一起討論很順利", "收到朋友鼓勵訊息", "和家人好好聊天"],
      M: ["想到自己努力是有意義的", "幫家人處理一件小事", "完成志工服務後很踏實"],
      A: ["把待辦清單完成三件", "準時完成今天目標", "解決一個困難問題"]
    };
    const weightedPermaCodes = [
      "P", "P", "P", "P", "P", "P", "P", "P", "P", "P",
      "R", "R", "R", "R", "R", "R", "R", "R",
      "E", "E", "E", "E", "E", "E",
      "A", "A", "A", "A",
      "M", "M"
    ];

    const createdRecords = [];
    const today = new Date();

    for (let i = 0; i < 12; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const picks = [0, 1, 2].map(function (offset) {
        const permaCode = weightedPermaCodes[(i * 3 + offset) % weightedPermaCodes.length];
        const templates = categoryTemplates[permaCode];
        const text = templates[(i + offset) % templates.length];
        return {
          text: `${text}（測試 ${i + 1}）`,
          perma: permaCode
        };
      });

      createdRecords.push({
        date: formatRecordDate(date.toISOString().split("T")[0]),
        time: `${String(20 - (i % 5)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
        goodThings: picks
      });
    }

    localStorage.setItem(RECORDS_KEY, JSON.stringify(createdRecords.reverse()));
    renderReview();
  }

  function clearTestRecords() {
    localStorage.removeItem(RECORDS_KEY);
    renderReview();
  }

  window.generatePermaTestRecords = generatePermaTestRecords;
  window.clearTestRecords = clearTestRecords;
  window.setPermaChartPalette = setPermaChartPalette;
  
  function renderReview() {
    const records = getGoodThingsRecords();
  
    if (records.length === 0) {
      reviewContent.innerHTML = `
        <p>目前還沒有紀錄。完成一次三件好事後，這裡就會出現你的幸福回顧。</p>
      `;
      renderPermaChart();
      return;
    }
  
    const totalDays = records.length;
    const totalGoodThings = records.length * 3;
    const latestRecord = records[records.length - 1];
  
    const recentRecords = records
      .slice(-5)
      .reverse()
      .map(function (record) {
        const goodThing1 = getGoodThingData(record.goodThings[0]);
        const goodThing2 = getGoodThingData(record.goodThings[1]);
        const goodThing3 = getGoodThingData(record.goodThings[2]);

        return `
          <div class="record-card">
            <h4>${record.date} ${record.time}</h4>
            <ol>
              <li>${escapeHtml(goodThing1.text)}（${escapeHtml(getPermaLabel(goodThing1.perma))}）</li>
              <li>${escapeHtml(goodThing2.text)}（${escapeHtml(getPermaLabel(goodThing2.perma))}）</li>
              <li>${escapeHtml(goodThing3.text)}（${escapeHtml(getPermaLabel(goodThing3.perma))}）</li>
            </ol>
          </div>
        `;
      })
      .join("");
  
    reviewContent.innerHTML = `
      <h3>你的幸福感小回顧</h3>
  
      <div class="review-stats">
        <div>
          <strong>${totalDays}</strong>
          <span>次紀錄</span>
        </div>
        <div>
          <strong>${totalGoodThings}</strong>
          <span>件好事</span>
        </div>
      </div>
  
      <p>
        最近一次紀錄是在 <strong>${latestRecord.date}</strong>。
        你已經累積了 <strong>${totalGoodThings}</strong> 件生活中的小小幸福。
      </p>
  
      <div class="bear-review-message">
  <h3>🧸 好好熊想對你說</h3>

  <p>
    你已經累積了 <strong>${totalGoodThings}</strong> 件生活中的小小幸福。
    這些紀錄也許看起來只是日常中的片段，
    但它們其實正在慢慢拼成一份屬於你的幸福感地圖。
  </p>

  <p>
    從這些好事裡可以看見，你正在練習把注意力從壓力與不足，
    慢慢移回那些曾經支持你、溫暖你，或讓你願意繼續往前的小瞬間。
    這不是要你忽略生活中的困難，而是在困難之中，也替自己保留一點被照亮的空間。
  </p>

  <p>
    好好熊想提醒你：能夠願意記錄，代表你正在好好照顧自己。
    即使有些日子不完美、很疲憊，甚至只是勉強撐過去，
    你仍然有能力在生活裡找到一點點值得感謝的事。
  </p>

  <p>
    接下來，也許你可以試著觀察：
    最近讓你感到幸福的來源比較常來自人際陪伴、完成任務、休息放鬆，
    還是來自你對自己的肯定呢？
    這些線索會慢慢幫助你更認識自己，也更知道該如何照顧自己的心。
  </p>
</div>
  
      <h3>最近的紀錄</h3>
      ${recentRecords}
    `;
    renderPermaChart();
  }

function getPermaChartPalette() {
  return permaChartPalettes[activePermaPaletteKey] || permaChartPalettes.pastel;
}

function mixHexColors(hexA, hexB) {
  const normalizeHex = function (hex) {
    return hex.replace("#", "");
  };
  const a = normalizeHex(hexA);
  const b = normalizeHex(hexB);

  const aR = parseInt(a.slice(0, 2), 16);
  const aG = parseInt(a.slice(2, 4), 16);
  const aB = parseInt(a.slice(4, 6), 16);
  const bR = parseInt(b.slice(0, 2), 16);
  const bG = parseInt(b.slice(2, 4), 16);
  const bB = parseInt(b.slice(4, 6), 16);

  const mixedR = Math.round((aR + bR) / 2);
  const mixedG = Math.round((aG + bG) / 2);
  const mixedB = Math.round((aB + bB) / 2);

  return `#${mixedR.toString(16).padStart(2, "0")}${mixedG.toString(16).padStart(2, "0")}${mixedB.toString(16).padStart(2, "0")}`;
}

function getPermaLegendColors(palette) {
  const gradientPairs = permaChartGradientPairs[activePermaPaletteKey];
  if (!gradientPairs) {
    return palette;
  }

  return gradientPairs.map(function (pair, index) {
    if (!pair || pair.length < 2) {
      return palette[index % palette.length];
    }
    return mixHexColors(pair[0], pair[1]);
  });
}

function getPermaSegmentBackground(context, palette) {
  const colorIndex = context.dataIndex % palette.length;
  const fallbackColor = palette[colorIndex];
  const gradientPairs = permaChartGradientPairs[activePermaPaletteKey];

  if (!gradientPairs) {
    return fallbackColor;
  }

  const chart = context.chart;
  const chartArea = chart.chartArea;
  if (!chartArea) {
    return fallbackColor;
  }

  const gradientPair = gradientPairs[colorIndex] || [fallbackColor, fallbackColor];
  const meta = chart.getDatasetMeta(context.datasetIndex);
  const arc = meta && meta.data ? meta.data[context.dataIndex] : null;

  if (!arc || typeof arc.x !== "number") {
    return fallbackColor;
  }

  const outerRadius = Math.max(arc.outerRadius || 1, 1);
  const startAngle = typeof arc.startAngle === "number" ? arc.startAngle : 0;
  const endAngle = typeof arc.endAngle === "number" ? arc.endAngle : startAngle;
  const startX = arc.x + Math.cos(startAngle) * outerRadius;
  const startY = arc.y + Math.sin(startAngle) * outerRadius;
  const endX = arc.x + Math.cos(endAngle) * outerRadius;
  const endY = arc.y + Math.sin(endAngle) * outerRadius;
  const distance = Math.hypot(endX - startX, endY - startY);
  if (!Number.isFinite(distance) || distance < 1) {
    return fallbackColor;
  }

  const cacheKey = [
    activePermaPaletteKey,
    colorIndex,
    Math.round(chartArea.width),
    Math.round(chartArea.height),
    Math.round(startX),
    Math.round(startY),
    Math.round(endX),
    Math.round(endY)
  ].join("|");
  if (permaGradientCache[cacheKey]) {
    return permaGradientCache[cacheKey];
  }

  const gradient = chart.ctx.createLinearGradient(startX, startY, endX, endY);
  gradient.addColorStop(0, gradientPair[0]);
  gradient.addColorStop(1, gradientPair[1]);
  permaGradientCache[cacheKey] = gradient;
  return gradient;
}

function initPermaChartPalette() {
  const savedPaletteKey = localStorage.getItem(PERMA_PALETTE_KEY);
  if (savedPaletteKey && permaChartPalettes[savedPaletteKey]) {
    activePermaPaletteKey = savedPaletteKey;
  }
}

function setPermaChartPalette(paletteKey) {
  if (!permaChartPalettes[paletteKey]) {
    console.warn("未知色盤，請使用：warm / pastel / roseBrown");
    return;
  }

  activePermaPaletteKey = paletteKey;
  localStorage.setItem(PERMA_PALETTE_KEY, paletteKey);
  renderPermaChart();
}

initPermaChartPalette();

function renderPermaChart() {
  if (!permaChartCanvas || typeof Chart === "undefined") {
    return;
  }

  const records = getGoodThingsRecords();
  const permaCounts = {
    P: 0,
    E: 0,
    R: 0,
    M: 0,
    A: 0
  };

  records.forEach(function (record) {
    const goodThings = Array.isArray(record.goodThings) ? record.goodThings : [];
    goodThings.forEach(function (goodThing) {
      const goodThingData = getGoodThingData(goodThing);
      if (permaCounts[goodThingData.perma] !== undefined) {
        permaCounts[goodThingData.perma] += 1;
      }
    });
  });

  const labels = [
    "正向情緒",
    "全情投入",
    "正向關係",
    "生命意義",
    "成就感"
  ];
  const data = [
    permaCounts.P,
    permaCounts.E,
    permaCounts.R,
    permaCounts.M,
    permaCounts.A
  ];

  const palette = getPermaChartPalette();
  const legendColors = getPermaLegendColors(palette);
  const hasData = data.some(function (count) {
    return count > 0;
  });
  const chartData = hasData ? data : [1, 1, 1, 1, 1];
  const totalCount = data.reduce(function (sum, value) {
    return sum + value;
  }, 0);

  if (typeof ChartDataLabels !== "undefined") {
    Chart.register(ChartDataLabels);
  }

  if (permaChartInstance) {
    permaChartInstance.destroy();
  }

  permaChartInstance = new Chart(permaChartCanvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: chartData,
          backgroundColor: function (context) {
            return getPermaSegmentBackground(context, palette);
          },
          borderColor: "#ffffff",
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: {
              size: 14
            },
            padding: 18,
            generateLabels: function (chart) {
              const defaultGenerator = Chart.overrides.doughnut.plugins.legend.labels.generateLabels;
              const defaultLabels = defaultGenerator(chart);
              return defaultLabels.map(function (label, index) {
                const legendColor = legendColors[index % legendColors.length];
                return {
                  ...label,
                  fillStyle: legendColor,
                  strokeStyle: legendColor
                };
              });
            }
          }
        },
        title: {
          display: true,
          text: hasData ? "PERMA 事件分類統計" : "PERMA 事件分類統計（尚無資料）"
        },
        datalabels: {
          color: "#4A4A4A",
          font: {
            weight: "bold",
            size: 12
          },
          formatter: function (value, context) {
            const labelCount = data[context.dataIndex];

            if (!hasData || totalCount === 0) {
              return "0次 (0%)";
            }

            const percentage = Math.round((labelCount / totalCount) * 100);
            return `${labelCount}次 (${percentage}%)`;
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              if (!hasData) {
                return `${context.label}：0 次`;
              }
              return `${context.label}：${context.raw} 次`;
            }
          }
        }
      }
    }
  });
}

function getPermaLabel(permaCode) {
  const permaLabels = {
    P: "正向情緒",
    E: "全情投入",
    R: "正向關係",
    M: "生命意義",
    A: "成就感"
  };

  return permaLabels[permaCode] || "未分類";
}

function getGoodThingData(goodThing) {
  if (typeof goodThing === "string") {
    return {
      text: goodThing,
      perma: ""
    };
  }

  return {
    text: goodThing.text || "",
    perma: goodThing.perma || ""
  };
}
  
  clearRecordsBtn.addEventListener("click", function () {
    const confirmClear = confirm("確定要清除全部三件好事紀錄嗎？清除後就不能恢復囉。");
  
    if (!confirmClear) {
      return;
    }
  
    localStorage.removeItem(RECORDS_KEY);
    renderReview();
  });
  function formatRecordDate(dateString) {
    if (!dateString) {
      return new Date().toLocaleDateString("zh-TW");
    }
  
    const date = new Date(dateString + "T00:00:00");
  
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long"
    });
  }
  function applySettings(settings) {
    const nickname = settings.nickname;
    const theme = settings.theme || "pink";
  
    document.body.classList.remove("theme-pink", "theme-blue", "theme-green", "theme-brown");
    document.body.classList.add(`theme-${theme}`);
  
    if (nickname) {
      pageSubtitle.textContent = `${nickname}，今天也讓好好熊陪你，好好生活、好好照顧自己。`;
    }
  }
  
  function loadSettings() {
    const savedSettings = localStorage.getItem("goodBearSettings");
  
    if (!savedSettings) {
      document.body.classList.add("theme-pink");
      return;
    }
  
    const settings = JSON.parse(savedSettings);
  
    document.getElementById("nickname").value = settings.nickname || "";
    document.getElementById("themeSelect").value = settings.theme || "pink";
    document.getElementById("toneSelect").value = settings.tone || "soft";
  
    applySettings(settings);
  }
  
  loadSettings();
  function getSavedSettings() {
    const savedSettings = localStorage.getItem("goodBearSettings");
  
    if (!savedSettings) {
      return {
        nickname: "",
        theme: "pink",
        tone: "soft"
      };
    }
  
    return JSON.parse(savedSettings);
  }
  
  function getPersonalizedSubtitle(sectionId) {
    const settings = getSavedSettings();
    const nickname = settings.nickname || "你";
  
    const subtitles = {
      homeSection: `${nickname}，今天也讓好好熊陪你，好好生活、好好照顧自己。`,
      goodThingsSection: `${nickname}，今天想記錄哪三件小小幸福呢？`,
      chatSection: `${nickname}，如果今天心裡有點滿，好好熊在這裡陪你慢慢說。`,
      reviewSection: `${nickname}，這是你一路累積下來的幸福感軌跡。`,
      settingsSection: `${nickname}，在這裡打造屬於你的療癒小空間。`
    };
  
    return subtitles[sectionId] || pageInfo[sectionId].subtitle;
  }
  function addToneIntro(response) {
    const settings = getSavedSettings();
    const tone = settings.tone || "soft";
  
    const toneIntros = {
      soft: `
        <div class="ai-block tone-intro">
          🧸 好好熊想先輕輕陪你待一下。你不用急著把自己整理好，慢慢來也可以~
        </div>
      `,
      clear: `
        <div class="ai-block tone-intro">
          🧸 好好熊先幫你把今天的心情整理一下。也許我們可以一起看看：現在最需要被照顧的是什麼?
        </div>
      `,
      bright: `
        <div class="ai-block tone-intro">
          🧸 好好熊來幫你補充一點能量！不管今天過得怎麼樣，你願意把心情說出來就已經很棒了~
        </div>
      `
    };
  
    return toneIntros[tone] + response;
  }
  async function initLineProfile() {
    if (typeof liff === "undefined") {
      console.log("LIFF SDK 尚未載入，目前使用一般網頁模式。");
      return;
    }
  
    try {
      await liff.init({
        liffId: LIFF_ID
      });
  
      if (!liff.isLoggedIn()) {
        console.log("尚未登入 LINE，暫時不讀取 LINE 使用者資料。");
        return;
      }
  
      const profile = await liff.getProfile();
      const settings = getSavedSettings();
  
      const updatedSettings = {
        ...settings,
        lineName: profile.displayName,
        nickname: settings.nickname || profile.displayName
      };
  
      localStorage.setItem("goodBearSettings", JSON.stringify(updatedSettings));
  
      const nicknameInput = document.getElementById("nickname");
      if (nicknameInput && !nicknameInput.value) {
        nicknameInput.value = updatedSettings.nickname;
      }
  
      applySettings(updatedSettings);
  
      console.log("已取得 LINE 使用者暱稱：", profile.displayName);
    } catch (error) {
      console.error("LIFF 初始化或取得 LINE profile 失敗：", error);
    }
  }
  
  initLineProfile();

