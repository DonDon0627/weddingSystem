document.addEventListener("DOMContentLoaded", () => {
  const videoIntro = document.getElementById("videoIntro");
  const introVideo = document.getElementById("introVideo");
  const mainContent = document.getElementById("mainContent");
  let isRemoved = false;

  function removeIntro() {
    if (isRemoved) return;
    isRemoved = true;

    // 1. 影片層開始「淡出」
    videoIntro.classList.add("fade-out");

    // 2. 主要網頁內容同時開始「淡入」
    mainContent.classList.add("fade-in");

    // 3. 暫停影片
    introVideo.pause();

    // 4. 瞬間將網頁軸捲動到最頂端（在遮罩下進行）
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });

    // 5. 等待轉場完成後，解鎖網頁捲動軸
    // 這裡設定 1500 毫秒 (1.5秒) 是為了完美搭配 CSS 裡 main-content 淡入的時間
    setTimeout(() => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }, 1000);
  }

  // 點擊任意處跳過
  videoIntro.addEventListener("click", () => {
    removeIntro();
  });

  // 影片播放完畢後過 3 秒自動關閉
  introVideo.addEventListener("ended", () => {
    setTimeout(() => {
      removeIntro();
    }, 500);
  });
});

// 同步更新座位圖

// 1. 定義座位物件類別 (Seat Class)
class Seat {
  constructor(id, number, x, y, zone, status = "available") {
    this.id = id; // 唯一識別碼 (例如: "seat_1")
    this.number = number; // 顯示的數字編號 (例如: 1)
    this.x = x; // X 座標 (px)
    this.y = y; // Y 座標 (px)
    this.status = status; // 狀態: 'available', 'occupied', 'selected'
    this.element = null; // 對應的 DOM HTML 元素
    this.zone = zone;

    // 建立畫面的 DOM 元素
    this.createDOMElement();
  }

  // 創建 DOM 元素並綁定事件
  createDOMElement() {
    const el = document.createElement("div");
    el.className = `seat ${this.status}`;
    el.innerText = this.number;
    el.style.left = `${this.x}px`;
    el.style.top = `${this.y}px`;

    // 綁定點擊事件 (點擊切換狀態或觸發聯動)
    el.addEventListener("click", () => this.onClick());

    this.element = el;
    document.getElementById("map-container").appendChild(el);
  }

  // 點擊事件處理
  onClick() {
    console.log(`點擊了座位物件:`, this.toJSON());
    alert(`座位 ${this.number} 號 | 狀態: ${this.status}`);
  }

  // 更新座位狀態 (供後續查詢系統聯動呼叫)
  setStatus(newStatus) {
    this.status = newStatus;
    if (this.element) {
      this.element.className = `seat ${this.status}`;
    }
  }

  // 導出為純資料物件 (方便 JSON.stringify 傳給後端 API)
  toJSON() {
    return {
      id: this.id,
      number: this.number,
      x: this.x,
      y: this.y,
      status: this.status,
    };
  }
}

// 2. 座位管理器 (儲存所有座位物件)
const seatMap = new Map(); // 使用 Map 結構方便根據 ID 查詢
let seatCounter = 1;

// 新增座位的函式
function addSeat(x, y, number = seatCounter, zone = "", status = "available") {
  const id = `seat_${Date.now()}_${number}`;
  const newSeat = new Seat(id, number, x, y, zone, status);

  // 將座位物件保存在 Map 中
  seatMap.set(id, newSeat);
  seatCounter++;
  return newSeat;
}

// 按區域 (Zone) 批量更新該區所有座位的狀態
function updateSeatsByZone(zoneName, newStatus) {
  for (let seat of seatMap.values()) {
    if (seat.zone == zoneName) {
      seat.setStatus(newStatus); // 將該區所有座位都改為指定的狀態 (如 'selected')
    }
  }
}

// 根據編號搜尋座位物件並改變狀態
function updateSeatByNumber(number, newStatus) {
  for (let seat of seatMap.values()) {
    if (seat.number === number) {
      //   console.log(seat);
      seat.setStatus(newStatus);
      break;
    }
  }
}

function clearSeatStatus() {
  for (let seat of seatMap.values()) {
    seat.setStatus("available");
  }
}

// --- 範例操作區 ---

// 預設初始化新增幾個座位 (依據座標擺放)

addSeat(545, 305, 1);
addSeat(545, 280, 2);
addSeat(545, 255, 3);
addSeat(545, 230, 4);

addSeat(545, 202, 5);
addSeat(540, 175, 6);
addSeat(537, 150, 7);
addSeat(530, 125, 8);

addSeat(520, 95, 9);
addSeat(500, 75, 10);
addSeat(475, 50, 11);
addSeat(450, 30, 12);

addSeat(425, 20, 13);
addSeat(400, 10, 14);
addSeat(375, 5, 15);
addSeat(350, 0, 16);

addSeat(320, 0, 17);
addSeat(295, 0, 18);
addSeat(270, 0, 19);
addSeat(245, 0, 20);

addSeat(220, 0, 21);
addSeat(195, 5, 22);
addSeat(170, 10, 23);
addSeat(145, 20, 24);

addSeat(120, 30, "25", "Startrust");
addSeat(95, 40, 26, "Startrust");
addSeat(70, 65, 27, "Startrust");
addSeat(50, 95, 28, "Startrust");

addSeat(35, 125, 29, "Startrust");
addSeat(25, 150, 30);
addSeat(20, 175, 31, "BEMS");
addSeat(20, 202, 32, "BEMS");

addSeat(20, 230, 33, "BEMS");
addSeat(20, 255, 34, "BEMS");
addSeat(20, 280, 35, "BEMS");
addSeat(20, 305, 36, "BEMS");

addSeat(90, 305, 37, "BEMS");
addSeat(90, 280, 38, "BEMS");
addSeat(90, 255, 39, "BEMS");
addSeat(90, 230, 40, "BEMS");

addSeat(90, 204, 41, "BEMS");
addSeat(95, 180, 42, "BEMS");
addSeat(105, 155, 43, "Startrust");

addSeat(117, 132, 44, "Startrust");
addSeat(130, 110, 45, "Startrust");
addSeat(152, 93, 46, "Startrust");

addSeat(174, 80, 47);
addSeat(197, 73, 48);
addSeat(220, 70, 49);

addSeat(245, 70, 50);
addSeat(270, 70, 51);
addSeat(295, 70, 52);
addSeat(320, 70, 53);

addSeat(345, 70, 54);
addSeat(368, 75, 55);
addSeat(391, 85, 56);

addSeat(413, 95, 57);
addSeat(432, 115, 58);
addSeat(450, 133, 59);

addSeat(460, 155, 60);
addSeat(470, 180, 61);
addSeat(473, 204, 62);

addSeat(473, 230, 63);
addSeat(473, 255, 64);
addSeat(473, 280, 65);
addSeat(473, 305, 66);

// 下半部

addSeat(545, 480, 67);
addSeat(545, 505, 68);
addSeat(545, 530, 69);
addSeat(545, 555, 70);

addSeat(545, 580, 71);
addSeat(540, 605, 72);
addSeat(537, 630, 73);
addSeat(528, 655, 74);

addSeat(520, 678, 75);
addSeat(500, 700, 76);
addSeat(475, 725, 77);
addSeat(450, 745, 78);

addSeat(425, 755, 79);
addSeat(400, 765, 80);
addSeat(375, 770, 81);
addSeat(350, 775, 82);

addSeat(320, 775, 83);
addSeat(295, 775, 84);
addSeat(270, 775, 85);
addSeat(245, 775, 86);

addSeat(220, 775, 87);
addSeat(195, 772, 88);
addSeat(170, 768, 89, "KLA");
addSeat(145, 760, 90, "KLA");

addSeat(120, 750, 91, "KLA");
addSeat(95, 730, 92, "KLA");
addSeat(70, 710, 93, "KLA");
addSeat(50, 685, 94, "KLA");

addSeat(35, 655, 95, "KLA");
addSeat(25, 630, 96, "KLA");
addSeat(20, 605, 97, "KLA");
addSeat(20, 580, 98, "KLA");

addSeat(20, 555, 99, "KLA");
addSeat(20, 530, 100, "KLA");
addSeat(20, 505, 101, "KLA");
addSeat(20, 480, 102);

addSeat(90, 480, 103);
addSeat(90, 505, 104, "KLA");
addSeat(90, 530, 105, "KLA");
addSeat(90, 555, 106, "KLA");

addSeat(90, 580, 107, "KLA");
addSeat(92, 603, 108, "KLA");
addSeat(100, 625, 109, "KLA");

addSeat(113, 648, 110, "KLA");
addSeat(130, 670, 111, "KLA");
addSeat(152, 686, 112, "KLA");

addSeat(173, 698, 113, "KLA");
addSeat(195, 705, 114);
addSeat(220, 710, 115);

addSeat(245, 710, 116);
addSeat(270, 710, 117);
addSeat(295, 710, 118);
addSeat(320, 710, 119);

addSeat(345, 708, 120);
addSeat(370, 704, 121);
addSeat(394, 696, 122);

addSeat(416, 681, 123);
addSeat(437, 663, 124);
addSeat(453, 642, 125);

addSeat(462, 620, 126);
addSeat(470, 599, 127);
addSeat(470, 577, 128);

addSeat(470, 555, 129);
addSeat(470, 530, 130);
addSeat(470, 505, 131);
addSeat(470, 480, 132);

// console.log(seatMap);

// 查詢座位表

let guests = [];
let searchTimer = null;

fetch("guests.json")
  .then((response) => response.json())
  .then((data) => {
    guests = data;
    // console.log(guests);
  });

const searchInput = document.getElementById("searchInput");
const result = document.getElementById("result");

searchInput.addEventListener("input", function () {
  const keyword = this.value.trim();

  if (searchTimer) {
    clearTimeout(searchTimer);
  }

  if (keyword === "") {
    result.innerHTML = "";
    clearSeatStatus();
    return;
  }

  searchTimer = setTimeout(() => {
    const matches = guests.filter((guest) => guest.name.includes(keyword));

    if (matches.length === 0) {
      result.innerHTML = "<p>找不到符合的姓名</p>";
      clearSeatStatus();
      return;
    }
    clearSeatStatus();
    result.innerHTML = matches
      .map((guest) => {
        //   console.log(guest.keywords);
        if (guest.zone) {
          updateSeatsByZone(guest.zone, "selected");
          return `
            <div class="seat-result">
                <h3>來賓：${guest.displayName}</h3>
                <p>座位區域：${guest.zone}</p>
            </div>
        `;
        } else if (guest.seat) {
          updateSeatByNumber(guest.seat, "selected");
        }
        return `
            <div class="seat-result">
                <h3>來賓：${guest.displayName}</h3>
                <p>座位號碼：${guest.seat}</p>
            </div>
        `;
      })
      .join("");
  }, 500);
});
