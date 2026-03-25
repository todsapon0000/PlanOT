/**
 * ฟังก์ชันคำนวณชั่วโมงทำงานรวมของแต่ละแถว
 */
function calculateHours() {
    const rows = document.querySelectorAll("tbody tr");

    rows.forEach(row => {
        let totalHours = 0;
        const cells = row.querySelectorAll(".drop-zone");

        cells.forEach(cell => {
            // ดึงสีพื้นหลัง (Inline Style) มาตรวจสอบ
            const bgColor = cell.style.backgroundColor;
            
            // 1. ตรวจสอบสีดำ (#000) หรือ สีเทา (#868686) -> หยุด/ลา = 0 ชม.
            if (cell.classList.contains('is-off')) {
                totalHours += 0;
            }
            // 2. ตรวจสอบสีเขียวเข้ม (ทำงานโอที 12 ชม.)
            else if (cell.classList.contains('ot-12')) {
                totalHours += 12;
            }
            // 3. ตรวจสอบสีเขียวอ่อน (ทำงานปกติ 8 + โอที 3 = 11 ชม.)
            else if (cell.classList.contains('has-data')) {
                totalHours += 11;
            }
            // 4. ช่องว่างสีขาว (ทำงานปกติ 8 ชม.) 
            // *หมายเหตุ: ถ้าช่องว่างไม่มี class และไม่มีสีพื้นหลัง ให้ถือเป็นวันทำงานปกติ
            else if (cell.innerHTML === "" || cell.innerHTML.trim() === "") {
                totalHours += 8;
            }
        });

        // แสดงผลรวมในช่องสุดท้าย (ถ้ามีช่องรวมชั่วโมง)
        const totalDisplay = row.querySelector(".total-hours");
        if (totalDisplay) {
            totalDisplay.innerText = totalHours + " ชม.";
        }
        
        console.log(`พนักงานในแถวนี้ ทำงานรวม: ${totalHours} ชม.`);
    });
}

// สั่งให้คำนวณใหม่ทุกครั้งที่มีการเปลี่ยนแปลงข้อมูลในตาราง
document.addEventListener("drop", () => {
    setTimeout(calculateHours, 100); // รอให้ DOM อัปเดตเสร็จก่อนคำนวณ
});