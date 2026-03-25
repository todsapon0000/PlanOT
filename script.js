
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import { getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdGk3k56iTifOJgOCI_ZuBMpzUgGwmOJA",
  authDomain: "planot-39b3e.firebaseapp.com",
  projectId: "planot-39b3e",
  storageBucket: "planot-39b3e.firebasestorage.app",
  messagingSenderId: "1079540415400",
  appId: "1:1079540415400:web:c67565129b2c3cd8fffb9d",
  measurementId: "G-D7RPZM9ZXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


async function savePlan() {
    const db = getFirestore();
    const holidayKey = document.getElementById('holiday-selector')?.value; // เช่น "2026-04-13"
    const holidayName = document.getElementById('holiday-selector')?.options[document.getElementById('holiday-selector').selectedIndex].text;

    if (!holidayKey || holidayKey === '-- เลือกวันหยุด --') return alert("⚠️ กรุณาเลือกวันที่ก่อนบันทึก");

    // 1. สกัดข้อมูลจากตาราง (ดึง Logic ที่เรา Clean ชื่อพนักงานและเช็ค 0/8 ไว้แล้ว)
    const shiftA_Data = extractTableData('report-shift-a-display', 'A');
    const shiftB_Data = extractTableData('report-shift-b-display', 'B');

    // 2. เตรียมก้อนข้อมูลพื้นฐาน (ก้อนเดียวกัน)
    const basePayload = {
        shiftA: shiftA_Data,
        shiftB: shiftB_Data,
        updatedAt: new Date().toISOString()
    };

    try {
        // 🚩 3. กำหนดกลุ่มวันที่ต้องการ (Songkran Special)
        const songkranDays = ["apr13", "apr14", "apr15"];
        const newyear2025to2026 = ["jan01", "jan02"];
        const Consecutive_holidays = ["jul28", "jul29"];
        
        if (songkranDays.includes(holidayKey)) {

            // วนลูปเพื่อบันทึกแยก Document ตามวันที่
            for (const dateKey of songkranDays) {
                // กำหนดชื่อวันหยุดให้ตรงกับ Document ID นั้นๆ
                let currentName = "";
                if (dateKey === "apr13") currentName = "13 เม.ย. วันสงกรานต์";
                if (dateKey === "apr14") currentName = "14 เม.ย. วันสงกรานต์";
                if (dateKey === "apr15") currentName = "15 เม.ย. วันสงกรานต์";
                // 🚩 บันทึกแยกคนละ Doc ID ใน Collection "ot_plans"
                await setDoc(doc(db, "ot_plans", dateKey), {
                    ...basePayload,
                    holidayId: dateKey,      // ID แยกกัน (13, 14, 15)
                    holidayName: currentName  // ชื่อแยกกัน
                });
                console.log(`✅ บันทึก Doc: ${dateKey} สำเร็จ`);
                
            }
                alert("✅ บันทึกข้อมูลสำเร็จ");

        } else if (newyear2025to2026.includes(holidayKey)) {

            // วนลูปเพื่อบันทึกแยก Document ตามวันที่
            for (const dateKey of newyear2025to2026) {
                // กำหนดชื่อวันหยุดให้ตรงกับ Document ID นั้นๆ
                let currentName = "";
                if (dateKey === "jan01") currentName = "1 ม.ค. วันขึ้นปีใหม่";
                if (dateKey === "jan02") currentName = "2 ม.ค. วันหยุดชดเชยวันขึ้นปีใหม่";

                // 🚩 บันทึกแยกคนละ Doc ID ใน Collection "ot_plans"
                await setDoc(doc(db, "ot_plans", dateKey), {
                    ...basePayload,
                    holidayId: dateKey,      // ID แยกกัน (13, 14, 15)
                    holidayName: currentName  // ชื่อแยกกัน
                });
                console.log(`✅ บันทึก Doc: ${dateKey} สำเร็จ`);
                
            }
                alert("✅ บันทึกข้อมูลสำเร็จ");

        } else if (Consecutive_holidays.includes(holidayKey)) {

            // วนลูปเพื่อบันทึกแยก Document ตามวันที่
            for (const dateKey of Consecutive_holidays) {
                // กำหนดชื่อวันหยุดให้ตรงกับ Document ID นั้นๆ
                let currentName = "";
                if (dateKey === "jul28") currentName = "28 ก.ค. วันเฉลิมพระชนมพรรษา (ร.10)";
                if (dateKey === "jul29") currentName = "29 ก.ค. วันอาสาฬหบูชา";

                // 🚩 บันทึกแยกคนละ Doc ID ใน Collection "ot_plans"
                await setDoc(doc(db, "ot_plans", dateKey), {
                    ...basePayload,
                    holidayId: dateKey,      // ID แยกกัน (13, 14, 15)
                    holidayName: currentName  // ชื่อแยกกัน
                });
                console.log(`✅ บันทึก Doc: ${dateKey} สำเร็จ`);
                
            }
                alert("✅ บันทึกข้อมูลสำเร็จ");

        } else {
            // 🚩 4. กรณีวันปกติ: บันทึกแค่ Doc เดียวตามที่เลือก
            await setDoc(doc(db, "ot_plans", holidayKey), {
                ...basePayload,
                holidayId: holidayKey,
                holidayName: holidayName
            });
            alert("✅ บันทึกข้อมูลสำเร็จ");
        }

    } catch (error) {
        console.error("❌ Save Error:", error);
        alert("เกิดข้อผิดพลาดในการบันทึก: " + error.message);
    }
}

function extractTableData(containerId, shiftName) {
    const container = document.getElementById(containerId);
    if (!container) return [];

    const allRows = container.querySelectorAll('table tbody tr');
    const data = [];

    // 🚩 รวม Index ทั้งหมด: [มีวันอาทิตย์] + [ไม่มีวันอาทิตย์]
    const targetIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    allRows.forEach((row, index) => {
        if (!targetIndexes.includes(index)) return;

        // 🚩 แยกประเภทตาม Index ให้ชัดเจน
        const isSunRow = [0, 1, 2, 6, 7, 8, 11, 12, 13].includes(index);
        const tableType = isSunRow ? "has-sunday" : "no-sunday";

        const cells = row.cells;
        if (cells.length < 11) return; // ป้องกันแถวที่มีคอลัมน์ไม่ครบ


        // --- STEP A: Scan หา "การมีอยู่" ของพนักงานในแถวนี้ (คอลัมน์ จ-อา คือ 1-7) ---
        let foundStaffName = "ว่าง";
        let hasStaffInRow = false; 

        for (let i = 1; i <= 7; i++) {
            const cell = cells[i];
            const staffEl = cell.querySelector('.draggable-name');
            const cellText = cell.innerText.trim();

            // เช็คว่ามีป้ายชื่อ หรือ มีข้อความที่ไม่ใช่ตัวเลขพื้นฐาน
            if (staffEl || (cellText !== "" && cellText !== "8" && cellText !== "0" && !cellText.includes("หยุด") && !cellText.includes("ลา"))) {
                hasStaffInRow = true; // 🚩 ตรวจพบว่าแถวนี้มีการมอบหมายงาน
                
                // ดึงชื่อพนักงาน
                if (staffEl && staffEl.innerText.trim() !== "") {
                    foundStaffName = staffEl.innerText.replace('×', '').trim();
                } else if (isNaN(cellText)) {
                    foundStaffName = cellText.replace('×', '').trim();
                }
                break; // เจอคนแรกแล้วหยุด scan หาชื่อ
            }
        }

        // --- STEP B: ฟังก์ชันกำหนดค่ารายวัน (Logic: ถ้าว่างทั้งแถว=0, ถ้ามีคนให้ช่องที่เหลือ=8) ---
        const getDayValue = (cellIndex) => {
            if (!hasStaffInRow) return "0";

            // 2. ถ้าเป็นแถวไม่มีวันอาทิตย์ (กรณีเผื่อใช้ซ้ำ) และเป็นช่องอาทิตย์ -> คืนค่า "-"
            if (tableType === "no-sunday" && cellIndex === 7) return "หยุด";

            const cell = cells[cellIndex];
            const hasStaffInCell = cell.querySelector('.draggable-name');
            const rawText = cell.innerText.replace('×', '').trim();

            // 3. ถ้าแถวนี้ "มีคน" ให้เช็ครายช่อง:
            if (hasStaffInCell) return "12"; // ช่องที่มีคนอยู่จริง
            if (rawText.includes("หยุด")) return "หยุด";
            if (rawText.includes("ลา")) return "ลา";
            
            // 🚩 ถ้าช่องว่าง แต่ "ทั้งแถวมีคน" (hasStaffInRow เป็น true) -> ให้คืนค่า "8"
            if (rawText === "" || rawText === "8") return "8"; 
            
            return isNaN(rawText) ? "12" : rawText;
        };
        

        // --- STEP C: ประกอบร่าง Object ข้อมูลต่อ 1 แถว ---
        const entry = {
            "building": cells[0].innerText.split('\n')[0].trim(), // แยกชื่อตึกออกจากชื่อคนในช่องแรก
            "staff": foundStaffName.replace('×', '').trim(),
            "shift": shiftName,
            "tableType": tableType,
            "จ": getDayValue(1),
            "อ": getDayValue(2),
            "พ": getDayValue(3),
            "พฤ": getDayValue(4),
            "ศ": getDayValue(5),
            "ส": getDayValue(6),
            "อา": getDayValue(7),
            "เวลาทำงาน": cells[8]?.innerText.trim() || "0",
            "เวลาโอที": cells[9]?.innerText.trim() || "0",
            "รวม": cells[10]?.innerText.trim() || "0"
        };

        data.push(entry);
    });

    console.log(`📊 สกัดข้อมูลกะ ${shiftName} (เฉพาะ ${data.length} แถวที่เลือก) สำเร็จ:`, data);
    return data;
}
// ส่งออกไปให้ HTML รู้จัก
window.savePlan = savePlan;


let draggedData = null;

const holiday = {
    "dec31_25": { date: "2025-12-31", name: "วันสิ้นปี (2568)" }, // เพิ่มอันนี้เข้าไป
    "jan01": { date: "2026-01-01", name: "วันขึ้นปีใหม่" },
    "jan02": { date: "2026-01-02", name: "วันหยุดชดเชยวันขึ้นปีใหม่" },
    "apr13": { date: "2026-04-13", name: "วันสงกรานต์" },
    "apr14": { date: "2026-04-14", name: "วันสงกรานต์" },
    "apr15": { date: "2026-04-15", name: "วันสงกรานต์" },
    "may01": { date: "2026-05-01", name: "วันแรงงานแห่งชาติ" },
    "jun03": { date: "2026-06-03", name: "วันเฉลิมพระชนมพรรษา สมเด็จพระนางเจ้าฯ พระบรมราชินี" },
    "jul28": { date: "2026-07-28", name: "วันเฉลิมพระชนมพรรษา (ร.10)" },
    "jul29": { date: "2026-07-29", name: "วันอาสาฬหบูชา" },
    "aug12": { date: "2026-08-12", name: "วันแม่แห่งชาติ" },
    "oct13": { date: "2026-10-13", name: "วันคล้ายวันสวรรคต ร.9 (วันนวมินทรมหาราช)" },
    "oct23": { date: "2026-10-23", name: "วันปิยมหาราช" },
    "dec07": { date: "2026-12-07", name: "วันหยุดชดเชยวันพ่อแห่งชาติ" },
    "dec31": { date: "2026-12-31", name: "วันสิ้นปี" }
};


document.addEventListener("DOMContentLoaded", () => {

    const mainContent = document.getElementById('main-content');
    const btnreport = document.getElementById('btn-report');
    const saveplanot = document.getElementById('saveplanot');

    if (btnreport) {
        btnreport.addEventListener('click', report); // สั่งรันฟังก์ชัน report เมื่อกดปุ่ม
    }


    if (mainContent) {
        // 1. บังคับให้ซ่อนทันที (ป้องกันอาการวูบวาบ)
        mainContent.style.opacity = "0";
        mainContent.style.transform = "translateY(15px)";
        mainContent.style.transition = "none"; 

        // 2. ใช้ double requestAnimationFrame เพื่อบังคับให้ Browser วาดสถานะ "ซ่อน" ก่อน
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                mainContent.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
                mainContent.style.opacity = "1";
                mainContent.style.transform = "translateY(0)";
            });
        });
    }

    enforceLockedSundays(); // รันตอนโหลดหน้าแรก
    // 1. ตั้งค่า Drag & Drop
    document.querySelectorAll(".draggable-name").forEach(setDragEvents);
    document.querySelectorAll(".drop-zone, .staff-pool").forEach(zone => {
        zone.ondragover = (e) => e.preventDefault();
        zone.ondrop = handleDrop;
    });

    updateHolidayTexts(null, null, null);

    // 2. ตั้งค่า Dropdown Listener
    const selector = document.getElementById('holiday-selector');
    if (selector) {
        selector.addEventListener('change', (e) => {
            updateTableHeaders(e.target.value);
        });
    }
});

// 🚩 เพิ่มส่วนนี้เพื่อแก้ปัญหาเวลาคนกดปุ่ม Back/Forward ใน Browser แล้วไม่ Fade
window.addEventListener("pageshow", (event) => {
    const mainContent = document.getElementById('main-content');
    if (event.persisted && mainContent) {
        // ถ้าโหลดจาก Cache ให้รัน Logic ซ่อนแล้วโชว์ใหม่
        mainContent.style.opacity = "0";
        setTimeout(() => {
            mainContent.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
            mainContent.style.opacity = "1";
            mainContent.style.transform = "translateY(0)";
        }, 50);
    }
});

// --- ฟังก์ชันจัดการปฏิทินและหัวตาราง ---

function getWeekRangeFull(dateString) {
    let selectedDate = new Date(dateString);
    let day = selectedDate.getDay(); 
    let diffToMonday = selectedDate.getDate() - (day === 0 ? 6 : day - 1);
    let monday = new Date(selectedDate); 
    monday.setDate(diffToMonday);
    
    let days = [];
    for (let i = 0; i < 7; i++) {
        let nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        // เก็บเป็น YYYY-MM-DD เพื่อใช้เปรียบเทียบ
        const y = nextDay.getFullYear();
        const m = String(nextDay.getMonth() + 1).padStart(2, '0');
        const d = String(nextDay.getDate()).padStart(2, '0');
        days.push({
            dayNum: nextDay.getDate(),
            fullDate: `${y}-${m}-${d}`
        });
    }
    return days; 
}

function updateTableHeaders(selectedHolidayValue) {
    debugger
    const targetDate = holiday[selectedHolidayValue];
    if (!targetDate) return;

    const weekData = getWeekRangeFull(targetDate.date);
    const holidayDay = new Date(targetDate.date).getDate(); 
    
    document.querySelectorAll("table").forEach(table => {
        const dateRow = table.querySelector("td.sat-header")?.parentElement;
        if (dateRow) {
            const cells = dateRow.querySelectorAll("td");
            weekData.forEach((data, index) => {
                if (cells[index]) {
                    cells[index].innerText = data.dayNum;
                    // 🚩 สำคัญ: ฝังวันที่เต็มไว้ที่หัวตาราง
                    cells[index].setAttribute('data-full-date', data.fullDate);
                    
                    cells[index].classList.remove("holiday-column-active");
                    cells[index].style.removeProperty('--holiday-width');
                    cells[index].style.removeProperty('--holiday-left');

                    if (data.dayNum === holidayDay) {
                        cells[index].classList.add("holiday-column-active");
                        // Logic จัดการความกว้างกรอบแดง (ตามที่คุณเขียนไว้)

                        applyHolidayStyle(cells[index], selectedHolidayValue);
                    }
                }
            });
        }

        // จัดการข้อความโชว์หัวเว็บ
        updateHolidayTexts(targetDate, selectedHolidayValue, weekData);
    });
    
    // 🚩 คำนวณชั่วโมงใหม่ทันทีหลังจากเปลี่ยนวันหยุด
    calculateTotalHours();
    enforceLockedSundays();
}

function enforceLockedSundays() {
    // 1. เลือกทุกตารางในหน้าเว็บ
    const allTables = document.querySelectorAll("table");

    allTables.forEach((table, index) => {
        // 🚩 เงื่อนไข: ถ้าเป็นตารางลำดับคี่ (0=ซ้าย, 1=ขวา) คือ กะ B
        if (index % 2 !== 0) {
            // 🚩 เปลี่ยนจาก querySelector เป็น querySelectorAll 
            // เพื่อหา 'ทุกช่อง' ที่เป็นวันอาทิตย์ในตารางนั้น
            const sunCells = table.querySelectorAll(".no-sun-cell"); 
            
            sunCells.forEach(cell => {
                // ตรวจสอบว่าไม่ใช่หัวตาราง (thead)
                if (cell.tagName === "TD") {
                    setAutoOff(cell); // สั่งล็อคทุกแถว
                }
            });
        }
    });
    
    // หลังจากล็อคแล้ว ให้สั่งคำนวณชั่วโมงใหม่เพื่อให้ยอดรวม (48 ชม.) อัปเดต
    if (typeof calculateTotalHours === "function") {
        calculateTotalHours();
    }
}

function applyHolidayStyle(cell, val) {

    if (val.startsWith("jan01") || val.startsWith("jan02")) {
        cell.style.setProperty('--holiday-width', '310%');
        cell.style.setProperty('--holiday-left', val.startsWith("jan01") ? '-70px' : '-137px');
    } else if (val.startsWith("apr15")) {
        cell.style.setProperty('--holiday-width', '309%');
        cell.style.setProperty('--holiday-left', '-137px');
    } else if (val.startsWith("apr14")) {
        cell.style.setProperty('--holiday-width', '310%');
        cell.style.setProperty('--holiday-left', '-70px');
    } else if (val.startsWith("apr13")) {
        cell.style.setProperty('--holiday-width', '310%');
        cell.style.setProperty('--holiday-left', '-3px');
    } else if (val.startsWith("jul28") || val.startsWith("jul29") || val.startsWith("dec31")) {
        cell.style.setProperty('--holiday-width', '205%');
        cell.style.setProperty('--holiday-left', val.startsWith("jul29") ? '-67px' : '0');
    } else {
        cell.style.setProperty('--holiday-width', '100%');
        cell.style.setProperty('--holiday-left', '0');
    }
}

function updateHolidayTexts(targetDate, val, weekData) {
    const dateDisplay = document.getElementById('date');
    const DateHeader = document.getElementsByClassName('holiday');
    
    // 🚩 กรณีไม่มีการเลือกวันหยุด (Default)
    if (!targetDate || !val) {
        const current = getCurrentWeekData();
        targetDate = { date: current.date, name: current.name };
        weekData = current.weekData;
        val = "default";
    }

    const d = new Date(targetDate.date);
    const dateDisplayText = `${weekData[0].dayNum} - ${weekData[6].dayNum} ${d.toLocaleDateString('th-TH', { month: 'short' })} ${d.getFullYear()}`;
    
    let DateHeadertext = `( ${d.getDate()} ${d.toLocaleDateString('th-TH', { month: 'short' })} ${d.getFullYear()} : ${targetDate.name} )`;

    // Logic แยกตามช่วงเทศกาลเดิมของคุณ
    if (val.startsWith("jan")) DateHeadertext = `31 ธันวาคม 2025 - 1 มกราคม 2026 : ${targetDate.name}`;
    else if (val.startsWith("apr")) DateHeadertext = `13 เมษายน 2026 - 15 เมษายน 2026 : ${targetDate.name}`;
    else if (val.startsWith("jul")) DateHeadertext = `28 กรกฎาคม 2026 - 29 กรกฎาคม 2026 : ${targetDate.name}`;
    else if (val.startsWith("dec31")) DateHeadertext = `31 ธันวาคม 2026 - 1 มกราคม 2027 : ${targetDate.name}`;
    else if (val === "default") DateHeadertext = targetDate.name; // แสดง "สัปดาห์ปัจจุบัน..."

    if (dateDisplay) dateDisplay.innerText = dateDisplayText;
    Array.from(DateHeader).forEach(el => el.innerText = DateHeadertext);
    
    // 🚩 สำคัญ: ฝังวันที่สัปดาห์ปัจจุบันลงใน Header ของตารางด้วย เพื่อให้คำนวณชั่วโมงได้ทันที
    updateTableDatesOnly(weekData);
}

// ฟังก์ชันเสริมสำหรับฝังวันที่ลงหัวตารางโดยไม่เช็คกรอบแดง
function updateTableDatesOnly(weekData) {
    document.querySelectorAll("table").forEach(table => {
        const dateRow = table.querySelector("td.sat-header")?.parentElement;
        if (dateRow) {
            const cells = dateRow.querySelectorAll("td");
            weekData.forEach((data, index) => {
                if (cells[index]) {
                    cells[index].innerText = data.dayNum;
                    cells[index].setAttribute('data-full-date', data.fullDate);
                }
            });
        }
    });
}

// ฟังก์ชันสำหรับดึงข้อมูลสัปดาห์ปัจจุบัน (จันทร์ - อาทิตย์)
function getCurrentWeekData() {
    const now = new Date();
    const day = now.getDay();
    // ปรับให้เริ่มที่วันจันทร์ (ถ้าเป็นวันอาทิตย์ (0) ให้ถอยไป 6 วัน)
    const diffToMonday = now.getDate() - (day === 0 ? 6 : day - 1);
    const monday = new Date(now);
    monday.setDate(diffToMonday);

    const weekData = [];
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        weekData.push({
            dayNum: nextDay.getDate(),
            fullDate: nextDay.toISOString().split('T')[0] // YYYY-MM-DD
        });
    }
    return {
        date: monday.toISOString().split('T')[0],
        name: "สัปดาห์ปัจจุบัน (ยังไม่ได้เลือกวันหยุด)",
        weekData: weekData
    };
}

// --- ฟังก์ชันคำนวณชั่วโมง ---

/**
 * ฟังก์ชันคำนวณชั่วโมงทำงานทั้งหมดในตาราง
 * เงื่อนไขการคำนวณต่อช่อง:
 * - วันนักขัตฤกษ์ (จาก List) หรือ วันอาทิตย์: ปกติ 0, OT 12 (เขียวเข้ม)
 * - วันทำงานปกติ (จันทร์-เสาร์): ปกติ 8, OT 3 (เขียวอ่อน)
 * - ช่องว่าง (ไม่มีข้อมูล): ปกติ 8, OT 0 (สีขาว)
 * - สถานะหยุด/ลา (is-off, is-leave, is-auto): ปกติ 0, OT 0 (ดำ/เทา)
 */
function calculateTotalHours() {
    const rows = document.querySelectorAll("tbody tr");
    
    // 1. ดึงวันที่จาก Header มาเป็นเกณฑ์อ้างอิง (ใช้ data-full-date ที่ฝังไว้)
    // หมายเหตุ: อ้างอิงจากตำแหน่งเซลล์ที่มีคลาส .sat-header เพื่อระบุแถววันที่
    const headerRow = document.querySelector("thead td.sat-header")?.parentElement;
    if (!headerRow) return; // ป้องกัน Error หากยังไม่ได้โหลดปฏิทิน
    
    const headerCells = headerRow.querySelectorAll("td");
    const weekDates = Array.from(headerCells).map(c => c.getAttribute('data-full-date'));

    rows.forEach(row => {
        let normalHours = 0;
        let otHours = 0;

        const cells = row.querySelectorAll(".drop-zone");

        cells.forEach((cell, index) => {
            const currentDate = weekDates[index]; // วันที่ของคอลัมน์นี้ (YYYY-MM-DD)
            
            // ตรวจสอบเงื่อนไขวันหยุดนักขัตฤกษ์จาก Object holiday
            const isHolidayDate = Object.values(holiday).some(h => h.date === currentDate);
            const isSunday = cell.classList.contains('sun-cell');

            // --- 🚩 เริ่มตรวจสอบสถานะของช่อง (Cell Status) ---
            
            // กรณีที่ 1: เป็นช่องหยุด/ลา หรือหยุดอัตโนมัติ (is-auto)
            if (cell.classList.contains('is-off') || cell.classList.contains('is-leave') || cell.classList.contains('is-auto')) {
                normalHours += 0;
                otHours += 0;
                
                // จัดสีให้ตรงตามสถานะ (เผื่อมีการสลับคลาสไปมา)
                if (cell.classList.contains('is-leave')) {
                    cell.style.backgroundColor = "#868686"; // สีเทา (ลา)
                } else {
                    cell.style.backgroundColor = "#000000"; // สีดำ (หยุด/Auto)
                }
                cell.style.color = "#fff";
            } 
            
            // กรณีที่ 2: มีพนักงานลงชื่อทำงาน (has-data)
            else if (cell.classList.contains('has-data')) {
                if (isHolidayDate || isSunday) {
                    // วันพิเศษ: OT 12 ชม.
                    normalHours += 0;
                    otHours += 12;
                    cell.style.backgroundColor = "#2d5a27"; // เขียวเข้ม
                    cell.style.color = "#fff";
                } else {
                    // วันปกติ: 8 + 3 ชม.
                    normalHours += 8;
                    otHours += 3;
                    cell.style.backgroundColor = "#e8f5e9"; // เขียวอ่อน
                    cell.style.color = "#2e7d32";
                }
            } 
            
            // กรณีที่ 3: ช่องว่างเปล่า (พนักงานทำงานปกติแต่ไม่มี OT)
            else {
                normalHours += 8;
                otHours += 0;
                cell.style.backgroundColor = ""; // ล้างสีกลับเป็นสีขาว
                cell.style.color = "";
            }
        });

        // --- 📊 แสดงผลสรุปท้ายแถว ---
        
        const nDisp = row.querySelector(".total-normal");
        const oDisp = row.querySelector(".total-ot");
        const gDisp = row.querySelector(".total-grand");
        
        const grandTotal = normalHours + otHours;

        if (nDisp) nDisp.innerText = normalHours;
        if (oDisp) oDisp.innerText = otHours;
        
        if (gDisp) {
            gDisp.innerText = grandTotal;

            // 🚩 เงื่อนไขสีแดง: ถ้า total-grand มากกว่า 60 ให้ตัวหนังสือเป็นสีแดง
            if (grandTotal > 60) {
                gDisp.style.color = "#dc3545"; // สีแดงเข้ม (Danger)
                gDisp.style.fontWeight = "bold";
            } else {
                gDisp.style.color = "#0d6efd"; // สีน้ำเงิน (Primary)
                gDisp.style.fontWeight = "bold";
            }
        }
    });
}

// --- ฟังก์ชัน Drag & Drop และ Reset ---

function setDragEvents(el) {
    el.ondragstart = (e) => {
        if (e.target.classList.contains('is-auto')) {
            e.preventDefault();
            return;
        }
        const name = e.target.getAttribute('data-name') || e.target.innerText.replace('×', '').trim();
        draggedData = { name, sourceNode: e.target };
    };
}

function handleDrop(e) {
    e.preventDefault();
    const zone = e.currentTarget; // พื้นที่ที่วางลงไป (td หรือ sidebar)
    if (!draggedData) return;
    
    const { name, sourceNode } = draggedData;

    // --- 🟢 กรณีที่ 1: วางลงในตาราง (Drop Zone) ---
    if (zone.classList.contains("drop-zone")) {
        const targetRow = zone.closest('tr');
        
        // 1. ถ้าลากมาจากในตาราง (การย้ายที่) ให้ล้างช่องเก่าก่อน
        if (sourceNode && sourceNode.tagName === "TD") {
            const oldRow = sourceNode.closest('tr');
            resetCell(sourceNode);
            checkAndClearAuto(oldRow); // ล้าง "หยุด" อัตโนมัติในแถวเก่าถ้ามี
        }

        // 2. ล้างช่องใหม่ที่จะวางให้สะอาด
        resetCell(zone);

        // 3. ตรวจสอบเงื่อนไขชื่อที่ลากมา
        if (name === "หยุด") {
            setManualOff(zone);
        } else if (name === "ลา") {
            setLeaveOff(zone);
        } else {
            // 🚩 กรณีลงชื่อพนักงานปกติ
            applyName(zone, name);
            handleWeekendLogic(zone); // ใส่ "หยุด" อัตโนมัติให้เสาร์-อาทิตย์

            // --- 🚀 ส่วน Alert สรุปข้อมูลรายวัน ---
            const cellIndex = zone.cellIndex;
            // ดึงวันที่จาก Header (ต้องมี data-full-date ที่ฝังไว้จาก fn.js)
            const headerCell = zone.closest('table').querySelectorAll('thead tr:last-child td')[cellIndex];
            const fullDate = headerCell ? headerCell.getAttribute('data-full-date') : "ไม่ระบุวันที่";

            // เช็คเงื่อนไขว่าเป็นวันหยุดนักขัตฤกษ์ หรือ วันอาทิตย์หรือไม่
            const isHolidayDate = Object.values(holiday).some(h => h.date === fullDate);
            const isSunday = zone.classList.contains('sun-cell');
            
            let nH = (isHolidayDate || isSunday) ? 0 : 8;
            let oH = (isHolidayDate || isSunday) ? 12 : 3;

        }

        // 4. ตรวจสอบและล้างหยุดอัตโนมัติในแถวปัจจุบัน (กรณีวางทับ)
        checkAndClearAuto(targetRow);
    } 

    // --- 🔵 กรณีที่ 2: วางลงใน Sidebar (Staff Pool) ---
    else if (zone.classList.contains("staff-pool")) {
        // ห้ามลากป้าย "หยุด" หรือ "ลา" กลับเข้ากลุ่มพนักงาน
        if (name === "หยุด" || name === "ลา") {
            draggedData = null;
            return;
        }

        // 1. ถ้าลากมาจากตาราง ให้ล้างช่องเก่าในตาราง
        if (sourceNode && sourceNode.tagName === "TD") {
            const oldRow = sourceNode.closest('tr');
            resetCell(sourceNode);
            checkAndClearAuto(oldRow);
        } 
        // 2. ถ้าลากสลับกลุ่มใน Sidebar เอง ให้ลบตัวเดิมทิ้ง
        else if (sourceNode) {
            sourceNode.remove();
        }

        // 3. สร้างพนักงานใหม่ในกลุ่มที่ลากมาวาง
        const newStaff = document.createElement('li'); // ปรับเป็น 'div' ได้ตาม HTML ของคุณ
        newStaff.className = "p-2 mb-2 bg-white border rounded draggable-name shadow-sm small";
        newStaff.draggable = true;
        newStaff.innerText = name;
        
        // ผูก Event ให้ลากต่อได้
        setDragEvents(newStaff);
        zone.appendChild(newStaff);
    }

    // --- 🔄 สรุปผลท้ายที่สุด ---
    calculateTotalHours(); // คำนวณยอดรวมชั่วโมงใหม่ทั้งหมด
    draggedData = null;    // ล้างค่าตัวแปรกลาง
}

// 3. ปรับปรุงฟังก์ชัน resetCell ให้เคลียร์ทุกอย่างสะอาดหมดจด
function resetCell(td) {
    if (!td) return;
    
    // ล้าง Class ทั้งหมด
    td.classList.remove("has-data", "is-off", "is-auto", "is-leave");
    
    // ล้าง Style (สีพื้นหลังและสีตัวอักษร)
    td.style.backgroundColor = "";
    td.style.color = "";
    td.style.opacity = "";
    
    // ล้างเนื้อหาภายใน
    td.innerHTML = "";
    
    // คืนค่าการลาก
    td.draggable = false;
}

function applyName(td, name) {
    td.classList.add("has-data");
    td.innerHTML = `<span>${name}</span><button class="delete-btn-popup" onclick="handleManualDelete(this.parentElement)">×</button>`;
    td.draggable = true;
    setDragEvents(td);
}

function setManualOff(td) {
    td.classList.add("is-off");
    td.innerHTML = `<span>หยุด</span><button class="delete-btn-popup" onclick="handleManualDelete(this.parentElement)">×</button>`;
    td.draggable = true;
    setDragEvents(td);
}

function setLeaveOff(td) {
    td.classList.add("is-leave");
    td.innerHTML = `<span>ลา</span><button class="delete-btn-popup" onclick="handleManualDelete(this.parentElement)">×</button>`;
    td.draggable = true;
    setDragEvents(td);
}

function handleManualDelete(td) {
    const row = td.closest('tr');
    resetCell(td); // ล้างช่องที่กดลบ
    checkAndClearAuto(row); // 🚩 เพิ่มการเช็คเพื่อลบ "หยุด" อัตโนมัติในช่องข้างๆ
    calculateTotalHours(); // คำนวณชั่วโมงใหม่
}

function handleWeekendLogic(zone) {
    const row = zone.closest('tr');
    const sat = row.querySelector('.sat-cell');
    const sun = row.querySelector('.sun-cell');
    if (zone.classList.contains('sun-cell') && sat && !sat.classList.contains('has-data')) setAutoOff(sat);
    else if (zone.classList.contains('sat-cell') && sun && !sun.classList.contains('has-data')) setAutoOff(sun);
}

function setAutoOff(td) {
    td.classList.add("is-off", "is-auto");
    td.innerHTML = `<span>หยุด</span>`;
    td.draggable = false;
}


// 2. ฟังก์ชันตรวจสอบและล้างค่า "หยุด" อัตโนมัติ (หัวใจสำคัญ)
function checkAndClearAuto(row) {
    if (!row) return;
    const sat = row.querySelector('.sat-cell');
    const sun = row.querySelector('.sun-cell');

    if (!sat || !sun) return;

    // 🚩 กรณีที่ 1: ถ้าวันเสาร์เป็น "หยุดอัตโนมัติ" (is-auto) 
    // และวันอาทิตย์ไม่มีข้อมูล (has-data) หรือถูกลบไปแล้ว -> ให้ล้างวันเสาร์ด้วย
    if (sat.classList.contains('is-auto')) {
        if (!sun.classList.contains('has-data') && !sun.classList.contains('is-off') && !sun.classList.contains('is-leave')) {
            resetCell(sat);
        }
    }

    // 🚩 กรณีที่ 2: ถ้าวันอาทิตย์เป็น "หยุดอัตโนมัติ" (is-auto) 
    // และวันเสาร์ไม่มีข้อมูล (has-data) หรือถูกลบไปแล้ว -> ให้ล้างวันอาทิตย์ด้วย
    if (sun.classList.contains('is-auto')) {
        if (!sat.classList.contains('has-data') && !sat.classList.contains('is-off') && !sat.classList.contains('is-leave')) {
            resetCell(sun);
        }
    }
}

function submitWorkPlan() {
    // 🚩 1. เช็คก่อนว่าเลือกวันหยุดหรือยัง
    const holidaySpan = document.querySelector(".holiday");
    const holidayName = holidaySpan ? holidaySpan.innerText.trim() : "";

    // ถ้ายังไม่มีชื่อวันหยุด หรือข้อความว่างเปล่า ให้แจ้งเตือนและหยุดการทำงานทันที
    if (!holidayName || holidayName === "" || holidayName === "ไม่มี") {
        alert("⚠️ กรุณาเลือกวันหยุดประจำสัปดาห์ก่อนกดยืนยันแผน!");
        
        // เลื่อนหน้าจอไปที่ตัวเลือกวันหยุดเพื่อให้ผู้ใช้เห็นชัดเจน (Optional)
        document.querySelector("#holidaySelect")?.focus(); 
        return; // ออกจากฟังก์ชัน ไม่ทำ console.log ต่อ
    }

    // 🚩 2. ถ้าเลือกแล้ว ให้เริ่มรวบรวมข้อมูลตามปกติ
    const finalReport = {
        submittedAt: new Date().toLocaleString('th-TH'),
        holidayName: holidayName,
        plans: [] 
    };

    // ค้นหาทุกแผนงาน (Plan Sections)
    const planSections = document.querySelectorAll(".row.mb-3"); 

    if (planSections.length === 0) {
        alert("ไม่พบข้อมูลตารางแผนงาน");
        return;
    }

    planSections.forEach((section, index) => {
        const planTitle = section.querySelector(".card-header")?.innerText.trim() || `แผนที่ ${index + 1}`;
        const currentPlan = {
            planName: planTitle,
            shiftA: [], 
            shiftB: []  
        };

        const tables = section.querySelectorAll("table");
        tables.forEach((table, tableIndex) => {
            const shiftType = (tableIndex === 0) ? "Shift A" : "Shift B";
            const rows = table.querySelectorAll("tbody tr");

            rows.forEach(row => {
                const headerRow = table.querySelector("thead tr:last-child");
                const weekDates = Array.from(headerRow.querySelectorAll("td")).map(c => c.getAttribute('data-full-date'));

                const buildingStaff = row.querySelector("td:first-child")?.innerText.trim() || "Unknown";
                const cells = row.querySelectorAll(".drop-zone");
                
                // ค้นหาชื่อพนักงานในแถว (Logic เดิม)
                let foundName = "";
                cells.forEach(cell => {
                    const name = cell.querySelector('span')?.innerText.trim();
                    if (name && !["หยุด", "ลา", "×", ""].includes(name)) foundName = name;
                });

                const dailyDetails = [];
                cells.forEach((cell, cellIdx) => {
                    const currentDate = weekDates[cellIdx];
                    const isHoliday = Object.values(holiday).some(h => h.date === currentDate);
                    const isSunday = cell.classList.contains('sun-cell');
                    const isSpecialDay = (isHoliday || isSunday);

                    let status = "Working";
                    let nameInCell = cell.querySelector('span')?.innerText.trim();
                    
                    if (cell.classList.contains('is-off')) status = "Off";
                    else if (cell.classList.contains('is-leave')) status = "Leave";
                    else if (cell.classList.contains('is-auto')) status = "Auto-Off";
                    else if (cell.innerHTML === "") status = "Empty";

                    let finalStaffName = (status === "Working" && nameInCell) ? nameInCell : foundName;
                    if (["Off", "Leave", "Auto-Off"].includes(status)) finalStaffName = foundName;

                    // คิดชั่วโมง (Logic เดิมที่คุณต้องการ)
                    let nH = 0; let oH = 0;
                    if (status === "Working") {
                        if (isSpecialDay) { nH = 0; oH = 12; } else { nH = 8; oH = 3; }
                    } else if (status === "Empty") {
                        if (isSpecialDay) { nH = 0; oH = 0; } else { nH = 8; oH = 0; }
                    }

                    dailyDetails.push({
                        date: currentDate,
                        shift: shiftType,
                        staffName: finalStaffName,
                        buildingName: buildingStaff,
                        status: status,
                        hours: nH,
                        ot: oH
                    });
                });

                const staffSummary = {
                    buildingStaff: buildingStaff,
                    actualName: foundName,
                    totalGrand: row.querySelector(".total-grand")?.innerText || "0",
                    daily: dailyDetails
                };

                if (tableIndex === 0) currentPlan.shiftA.push(staffSummary);
                else currentPlan.shiftB.push(staffSummary);
            });
        });

        finalReport.plans.push(currentPlan);
    });

    // 🚩 3. แสดงผลเมื่อผ่านการตรวจสอบแล้ว
    console.clear();
    console.log(`%c🚀 [SUBMITTED] ยืนยันแผนการทำงานสำหรับ: ${holidayName}`, "color: #1b5e20; font-size: 16px; font-weight: bold;");
    console.log("📂 ข้อมูลทั้งหมด:", finalReport);
    
    alert(`✅ ยืนยันแผนของ "${holidayName}" สำเร็จ! (ตรวจสอบข้อมูลใน Console)`);
}

function clearIndexUI() {
    // 1. ล้างเฉพาะส่วนที่เป็นตารางข้อมูล (ตารางที่ใช้ลากวาง)
    const containers = ['shift-a-container', 'shift-b-container', 'report-shift-a-display', 'report-shift-b-display'];
    
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            // ล้างข้อมูลพนักงานที่ลากมาวางไว้
            const dayZones = container.querySelectorAll('.drop-zone');
            dayZones.forEach(zone => {
                zone.innerHTML = ""; 
            });

            // ถ้ามีช่องที่เป็น Text ตัวเลข ให้ล้างเป็นค่าว่าง (ยกเว้นตึก)
            const rows = container.querySelectorAll('tbody tr');
            rows.forEach(row => {
                // เริ่มล้างตั้งแต่คอลัมน์ที่ 1 เป็นต้นไป (คอลัมน์ 0 คือชื่อตึก)
                for (let i = 1; i < row.cells.length; i++) {
                    // ถ้าช่องนั้นไม่มีแผ่นป้ายชื่อ ให้ล้างตัวหนังสือออก
                    if (!row.cells[i].querySelector('.draggable-name')) {
                        row.cells[i].innerText = ""; 
                    }
                }
            });
        }
    });

    // 🚩 ลบบรรทัดที่รีเซ็ตค่า selector ออก เพื่อไม่ให้ตัวเลือกวันหยุดหาย
    // const holidaySelector = document.getElementById('holiday-selector'); 
    // if (holidaySelector) holidaySelector.value = "default"; <--- ลบทิ้งหรือปิดไว้

    console.log("🧹 ล้างข้อมูลตารางเรียบร้อย แต่คงค่าตัวเลือกวันหยุดไว้");
}

function report() {
    const main = document.getElementById('main-content');
    const reportSection = document.getElementById('report-section');
    const displayArea = document.getElementById('report-table-display');
    const originalSelector = document.getElementById('holiday-selector'); 
    const container = document.getElementById('holiday-selector-container');

    if (!main || !reportSection) return;
    
    // 1. Fade Out หน้า Index
    main.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    main.style.opacity = '0';
    main.style.transform = 'translateY(-10px)';

    setTimeout(() => {
        // 2. สลับการแสดงผล (ล้างสถานะ d-none)
        main.classList.add('d-none');
        reportSection.classList.remove('d-none');


        // 4. "ยืม" Select มาวางใหม่ (ต้องทำทุกครั้งที่กดเข้าหน้านี้)
        if (originalSelector && container) {
            container.innerHTML = `
                <select class="form-select form-select-sm shadow-sm" id="reportHolidaySelect">
                    ${originalSelector.innerHTML}
                </select>
            `;
            // ให้ค่าตรงกับหน้า Index ปัจจุบัน
            document.getElementById('reportHolidaySelect').value = originalSelector.value;
        }

        // 5. Fade In หน้า Report สวยๆ
        reportSection.style.display = 'flex';
        requestAnimationFrame(() => {
            reportSection.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            reportSection.style.opacity = '1';
            reportSection.style.transform = 'translateY(0)';
        });

        // เปิด Header ไว้เสมอ
        const header = document.getElementById('header-nav');
        if (header) {
            header.classList.remove('d-none');
            header.style.opacity = '1';
        }
    }, 300);
}


/**
 * ฟังก์ชันกลางสำหรับสลับหน้าพร้อมเอฟเฟกต์ Fade
 * @param {HTMLElement} hideTarget - Element ที่ต้องการซ่อน
 * @param {HTMLElement} showTarget - Element ที่ต้องการแสดง
 */
function switchPage(hideTarget, showTarget) {
    if (!hideTarget || !showTarget) return;

    // 1. เริ่ม Fade Out ตัวที่จะซ่อน
    hideTarget.style.opacity = '0';
    hideTarget.style.transition = 'opacity 0.3s ease-in-out';

    setTimeout(() => {
        // 2. ซ่อนตัวเก่าแบบเด็ดขาด
        hideTarget.classList.add('d-none');
        hideTarget.style.display = 'none';

        // 3. เตรียมตัวใหม่ (ตั้งค่าเป็น 0 ก่อนโชว์)
        showTarget.classList.remove('d-none');
        showTarget.style.display = 'flex'; // หรือ 'block' ตามความเหมาะสม
        showTarget.style.opacity = '0';
        showTarget.style.transition = 'opacity 0.3s ease-in-out';

        showTarget.style.opacity = '1';
        showTarget.style.flex = '1 0 auto';



    }, 300); // สัมพันธ์กับ transition 0.3s
}


function goToIndex() {
    const main = document.getElementById('main-content');
    const reportSection = document.getElementById('report-section');
    const header = document.getElementById('header-nav');

    if (!main || !reportSection) return;

    // 1. เริ่ม Fade Out หน้า Report (ถ้ากำลังเปิดอยู่)
    reportSection.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    reportSection.style.opacity = '0';
    reportSection.style.transform = 'translateY(-10px)';

    // 2. รอจังหวะ Animation แป๊บหนึ่ง (300ms) แล้วค่อยสลับหน้า
    setTimeout(() => {
        // ซ่อนหน้า Report
        reportSection.classList.add('d-none');
        
        // 🚩 หัวใจสำคัญ: ดึงหน้า Index กลับมา
        main.classList.remove('d-none'); // เอา d-none ออก
        
        // ตั้งค่าเริ่มต้นสำหรับ Fade In หน้าหลัก
        main.style.opacity = '0';
        main.style.transform = 'translateY(10px)';
        main.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';

        // มั่นใจว่า Header (Navbar) แสดงผล
        if (header) {
            header.classList.remove('d-none');
            header.style.opacity = '1';
        }

        // 3. สั่ง Fade In หน้า Index ขึ้นมา
        requestAnimationFrame(() => {
            main.style.opacity = '1';
            main.style.transform = 'translateY(0)';
        });

        // ล้างตารางในหน้า Report (Optional เพื่อความสะอาด)
        const displayArea = document.getElementById('report-table-display');
        if (displayArea) displayArea.innerHTML = '';

    }, 300);
}



async function submitReport() {
    const db = getFirestore();
    const displayArea = document.getElementById('report-table-display');
    const holidayKey = document.getElementById('reportHolidaySelect')?.value;

    console.log("🔍 กำลังดึงข้อมูลสำหรับ Key:", holidayKey);

    // 1. Check เบื้องต้น
    if (!displayArea) return console.error("ไม่พบพื้นที่ report-table-display");
    if (!holidayKey || holidayKey === '-- เลือกวันหยุด --') return alert("กรุณาเลือกวันหยุด");

    // 2. ล้างหน้าจอเดิมและแสดงสถานะ Loading
    displayArea.style.display = 'block'
    displayArea.innerHTML = `<div class="text-center p-5"><h4>🔄 กำลังโหลดข้อมูล...</h4></div>`;

    try {
        // 3. ดึงข้อมูลจาก Firebase (ดึงก้อน JSON 12, 8, 0 มา)
        const docRef = doc(db, "ot_plans", holidayKey);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            alert("❌ ไม่พบข้อมูลแผน OT ของวันที่เลือกในระบบครับ\nกรุณาไปที่หน้าบันทึกข้อมูลก่อน");
            displayArea.innerHTML = `<div class="alert alert-warning text-center">ไม่พบข้อมูลที่บันทึกไว้</div>`;
            return;
        }

        const data = docSnap.data();

        // 4. ส่งข้อมูลไปวาดตาราง (ใช้ฟังก์ชัน Helper แยกออกมาเพื่อให้โค้ดสะอาด)
        displayArea.innerHTML = renderReportHTML(data);

        applyHolidayBordersToReport('report-table-display', data.holidayId);

        
        displayArea.style.setProperty("maxHeight", "auto", "important");
        displayArea.style.setProperty("overflowX", "auto", "important");
        displayArea.style.setProperty("display", "block", "important");
        displayArea.style.setProperty("visibility", "visible", "important");
        
        console.log("✅ วาดตาราง Report สำเร็จ!");

    } catch (error) {
        console.error("❌ Report Error:", error);
        displayArea.innerHTML = `<div class="alert alert-danger">เกิดข้อผิดพลาด: ${error.message}</div>`;
    }
}

function renderReportHTML(data) {

    const datadate = data.holidayId

    

    const convertIdToDate = (id) => {
        const m = {jan:"01",feb:"02",mar:"03",apr:"04",may:"05",jun:"06",jul:"07",aug:"08",sep:"09",oct:"10",nov:"11",dec:"12"};
        return `2026-${m[id.substring(0,3).toLowerCase()]}-${id.substring(3)}`;
    };


    // 1. ดึงวันที่เริ่มต้นจาก holidayKey (เช่น "2026-03-13")
    // สมมติฟังก์ชัน getDates(holidayKey) คืนค่าเป็น Array [13, 14, 15, 16, 17, 18, 19]
    const dates = getWeekRangeFull(convertIdToDate(datadate));

    

    // 🚩 1. ดึงค่าจาก Dropdown (has-sunday หรือ no-sunday)
    const selectedType = document.getElementById('reportSundaySelect')?.value || "has-sunday";
    const typeLabel = (selectedType === "has-sunday") ? "มีวันอาทิตย์" : "ไม่มีวันอาทิตย์";

    // 🚩 2. ฟังก์ชันกรองข้อมูล: แยกตามกะ และตามประเภทที่เลือกจาก Dropdown
    // ข้อมูลเดิมมี 18 แถว พอกรองแล้วจะเหลือ 9 แถว (index 0-8)
    const filterData = (shiftList) => {
        return (shiftList || []).filter(item => item.tableType === selectedType);
    };

    const dataA = filterData(data.shiftA);
    const dataB = filterData(data.shiftB);

    // 🚩 3. Helper สร้างตารางย่อย (รับช่วงข้อมูล 3 แถว)
    const createSubTable = (list, start, end, shiftName, planTitle) => {
        const slicedRows = list.slice(start, end);
        if (slicedRows.length === 0) return "";

const rowsHTML = slicedRows.map(item => {
    // 🚩 1. ฟังก์ชันจัดการเนื้อหา (ตัวหนังสือที่จะโชว์)
    const format = (val) => {
        if (val === "12") return item.staff || 'ว่าง'; // ส่งชื่อพนักงานตรงๆ (ไม่ต้องมี span ครอบแล้ว)
        if (val === "8") return ""; 
        return val;
    };

    // 🚩 2. ฟังก์ชันตรวจสอบสถานะเพื่อกำหนด Class ที่ช่อง <td> (รวมทุกเงื่อนไขสี)
    const getTdClass = (val) => {
        let classes = "align-middle fw-bold "; // คลาสพื้นฐาน: จัดกลาง + ตัวหนา

        // 🟢 เงื่อนไข: มาทำงาน (12) -> พื้นหลังเขียว ตัวหนังสือขาว
        if (val === "12") { classes += `has-data`; }
        // ⚫ เงื่อนไข: หยุด -> พื้นหลังดำ ตัวหนังสือขาว
        else if (val === "หยุด") { classes += `is-off`; }
        // 🟡 เงื่อนไข: ลา -> พื้นหลังเหลือง ตัวหนังสือดำ
        else if (val === "ลา") { classes += `is-leave`; }
        
        return classes;
    };

    return `
        <tr>
            <td class="bg-light fw-bold align-middle" style="font-size: 0.75rem;">${item.building}</td>
            
            <td class="${getTdClass(item.จ)}">${format(item.จ)}</td>
            <td class="${getTdClass(item.อ)}">${format(item.อ)}</td>
            <td class="${getTdClass(item.พ)}">${format(item.พ)}</td>
            <td class="${getTdClass(item.พฤ)}">${format(item.พฤ)}</td>
            <td class="${getTdClass(item.ศ)}">${format(item.ศ)}</td>
            <td class="${getTdClass(item.ส)}">${format(item.ส)}</td>
            <td class="${getTdClass(item.อา)}">${format(item.อา)}</td>

            <td class="table-secondary fw-bold align-middle">${item.เวลาทำงาน || 0}</td>
            <td class="table-secondary fw-bold align-middle">${item.เวลาโอที || 0}</td>
            <td class="table-secondary fw-bold align-middle">${item.รวม || 0}</td>
        </tr>`;
}).join('');

        return `
            <div class="rounded-table-container mb-2">
                <div class="p-1 bg-dark text-white fw-bold text-center" style="font-size: 0.8rem;">
                    ( กะ ${shiftName} ${typeLabel} ) ${planTitle}
                </div>
                <table class="table table-sm table-bordered border-dark text-center align-middle bg-white shadow-sm" style="font-size: 0.75rem;">
                    <thead class="table-dark">
                        <tr>
                            <th rowspan="2" class="align-middle">อาคาร</th>
                            <th>จ</th><th>อ</th><th>พ</th><th>พฤ</th><th>ศ</th><th>ส</th><th>อา</th>
                            <th rowspan="2" class="align-middle">ทำงาน</th>
                            <th rowspan="2" class="align-middle">OT</th>
                            <th rowspan="2" class="align-middle">รวม</th>
                        </tr>
                        <tr style="font-size: 0.65rem;">
                            <td>${dates[0].dayNum}</td><td>${dates[1].dayNum}</td><td>${dates[2].dayNum}</td>
                            <td>${dates[3].dayNum}</td><td>${dates[4].dayNum}</td><td>${dates[5].dayNum}</td>
                            <td>${dates[6].dayNum}</td>
                        </tr>
                    </thead>
                    <tbody>${rowsHTML}</tbody>
                </table>
            </div>`;
    };

    // 🚩 4. โครงสร้างหลัก: แบ่งซ้าย (กะ A) และ ขวา (กะ B)
    return `
        <div class="report-wrapper p-2" style="min-width: 1150px;">
            <div class="row g-3">
                <div class="col-6 border-end">
                    <h5 class="text-center fw-bold text-primary mb-3 border-bottom pb-2">SHIFT A</h5>
                    ${createSubTable(dataA, 0, 3, "A", "แผน OT เข้า 1 คน")}
                    ${createSubTable(dataA, 3, 6, "A", "แผน OT เข้า 2 คน")}
                    ${createSubTable(dataA, 6, 9, "A", "แผน OT เข้า 3 คน")}
                </div>

                <div class="col-6">
                    <h5 class="text-center fw-bold text-success mb-3 border-bottom pb-2">SHIFT B</h5>
                    ${createSubTable(dataB, 0, 3, "B", "แผน OT เข้า 1 คน")}
                    ${createSubTable(dataB, 3, 6, "B", "แผน OT เข้า 2 คน")}
                    ${createSubTable(dataB, 6, 9, "B", "แผน OT เข้า 3 คน")}
                </div>
            </div>
        </div>
    `;
}

// 🚩 ฟังก์ชัน Helper สำหรับดึงวันที่ (เลียนแบบ Logic ของ updateTableHeaders)
function generateDatesFromKey(holidayKey) {
    try {
        // สมมติ holidayKey คือ "2026-03-13" (YYYY-MM-DD)
        let startDate = new Date(holidayKey);
        if (isNaN(startDate)) return ["-","-","-","-","-","-","-"];

        let dates = [];
        for (let i = 0; i < 7; i++) {
            let d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            dates.push(d.getDate()); // ดึงแค่วันที่ 1-31
        }
        return dates;
    } catch (e) {
        return ["-","-","-","-","-","-","-"];
    }
}

// ผูกฟังก์ชันเข้ากับ window
window.submitReport = submitReport;



// ฟังก์ชันสำหรับแปลงค่า Value จาก Select เป็นชุดข้อมูลวันที่ (weekData)
function getHolidayDataByValue(val) {
    let targetDate, name;
    
    // กำหนดวันที่หลักตาม Value (ตัวอย่างปี 2026)
    const holidayConfig = holiday

    const config = holidayConfig[val];
    
    if (config) {
        targetDate = { date: config.date, name: config.name };
    } else {
        // ถ้าเป็น default หรือหาไม่เจอ ให้ใช้สัปดาห์ปัจจุบัน
        const current = getCurrentWeekData(); // เรียกฟังก์ชันเดิมที่คุณมี
        return current; 
    }

    // คำนวณหาจันทร์-อาทิตย์ ของสัปดาห์ที่มีวันหยุดนั้นอยู่
    // (ใช้ Logic เดียวกับที่คุณใช้ใน getCurrentWeekData แต่เปลี่ยนจุดเริ่มเป็น config.date)
    const weekData = calculateWeekFromDate(config.date); 
    
    return { targetDate, val, weekData, name: config.name };
}

// ฟังก์ชันช่วยคำนวณ 7 วันในสัปดาห์จากวันที่กำหนด
function calculateWeekFromDate(dateString) {
    const d = new Date(dateString);
    const day = d.getDay(); // 0 (Sun) - 6 (Sat)
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // ปรับให้เริ่มที่วันจันทร์
    
    const monday = new Date(d.setDate(diff));
    const week = [];
    
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        week.push({
            dayNum: nextDay.getDate(),
            fullDate: nextDay.toISOString().split('T')[0]
        });
    }
    return week;
}

window.handleManualDelete = handleManualDelete;
window.report = report;

function applyHolidayBordersToReport(containerId, selectedHolidayId) {
    const container = document.getElementById(containerId);
    if (!container || !selectedHolidayId) return;

    // 🚩 1. นิยามกลุ่มที่จะให้รวมเป็นกรอบเดียว
    const groups = [
        ["apr13", "apr14", "apr15"],
        ["dec31_25","jan01", "jan02"],
        ["jul28", "jul29"]
    ];

    const targetGroup = groups.find(g => g.includes(selectedHolidayId)) || [selectedHolidayId];
    
    // แปลงเป็นเลขวันที่ [13, 14, 15]
    const targetDayNums = targetGroup.map(id => {
        const d = holiday[id]?.date;
        return d ? new Date(d).getDate().toString() : null;
    });

    // หาตำแหน่ง วันแรก และ วันสุดท้าย ในกลุ่ม
    const firstDay = targetDayNums[0];
    const lastDay = targetDayNums[targetDayNums.length - 1];

    const tables = container.querySelectorAll("table");

    tables.forEach(table => {
        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");
        const dateCells = thead?.rows[1].querySelectorAll("td");
        if (!dateCells) return;

        dateCells.forEach((cell, index) => {
            const dayNumInCell = cell.innerText.trim();
            const colIndex = index + 1;

            // ... ภายใน dateCells.forEach ...
            if (targetDayNums.includes(dayNumInCell)) {
                const targetHeader = thead.rows[0].cells[colIndex];
                const columnCells = [targetHeader, cell];
                
                Array.from(tbody.rows).forEach(row => {
                    if (row.cells[colIndex]) columnCells.push(row.cells[colIndex]);
                });

                columnCells.forEach(el => {
                    // 🚩 1. ล้าง Class เดิมก่อน (กันพลาดเวลา render ซ้ำ)
                    el.classList.remove("holiday-box-member", "is-first", "is-last");
                    
                    // 🚩 2. ใส่ Class หลัก
                    el.classList.add("holiday-box-member");

                    // 🚩 3. เช็คว่าเป็นวันแรกของกลุ่มหรือไม่ (เส้นซ้าย)
                    if (dayNumInCell === firstDay) {
                        el.classList.add("is-first");
                    }

                    // 🚩 4. เช็คว่าเป็นวันสุดท้ายของกลุ่มหรือไม่ (เส้นขวา)
                    if (dayNumInCell === lastDay) {
                        el.classList.add("is-last");
                    }
                });
            }
        });
    });
}