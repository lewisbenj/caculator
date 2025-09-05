// Biến toàn cục
let display = document.getElementById('display');
let historyList = document.getElementById('historyList');
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;
let history = [];

/**
 * Thêm giá trị vào màn hình hiển thị
 * @param {string} value - Giá trị cần thêm
 */
function appendToDisplay(value) {
    if (shouldResetDisplay) {
        display.value = '';
        shouldResetDisplay = false;
    }

    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
}

/**
 * Xóa toàn bộ màn hình và reset tất cả biến
 */
function clearAll() {
    display.value = '0';
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

/**
 * Xóa ký tự cuối cùng trên màn hình
 */
function clearLast() {
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

/**
 * Tính toán kết quả biểu thức hiện tại
 */
function calculate() {
    try {
        let expression = display.value;
        
        // Thay thế các ký hiệu hiển thị bằng ký hiệu JavaScript
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Kiểm tra biểu thức hợp lệ (chỉ chứa số và toán tử hợp lệ)
        if (!/^[0-9+\-*/.() ]+$/.test(expression)) {
            throw new Error('Biểu thức không hợp lệ');
        }

        // Tính toán kết quả
        let result = eval(expression);
        
        // Kiểm tra kết quả hợp lệ
        if (!isFinite(result)) {
            throw new Error('Không thể chia cho 0');
        }

        // Làm tròn kết quả nếu là số thập phân dài
        if (result % 1 !== 0) {
            result = parseFloat(result.toFixed(10));
        }

        // Thêm vào lịch sử
        addToHistory(display.value, result);

        // Hiển thị kết quả
        display.value = result.toString();
        shouldResetDisplay = true;

    } catch (error) {
        // Hiển thị lỗi và tự động reset sau 1.5 giây
        display.value = 'Lỗi';
        setTimeout(() => {
            clearAll();
        }, 1500);
    }
}

/**
 * Tính phần trăm của giá trị hiện tại
 */
function calculatePercentage() {
    try {
        let value = parseFloat(display.value);
        if (isNaN(value)) {
            throw new Error('Giá trị không hợp lệ');
        }
        
        let result = value / 100;
        addToHistory(display.value + '%', result);
        
        display.value = result.toString();
        shouldResetDisplay = true;
        
    } catch (error) {
        display.value = 'Lỗi';
        setTimeout(() => {
            clearAll();
        }, 1500);
    }
}

/**
 * Thêm phép tính vào lịch sử
 * @param {string} expression - Biểu thức đã tính
 * @param {number} result - Kết quả
 */
function addToHistory(expression, result) {
    let historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().toLocaleTimeString('vi-VN')
    };
    
    // Thêm vào đầu danh sách lịch sử
    history.unshift(historyItem);
    
    // Giới hạn lịch sử tối đa 10 phép tính
    if (history.length > 10) {
        history.pop();
    }
    
    // Cập nhật hiển thị lịch sử
    updateHistoryDisplay();
}

/**
 * Cập nhật hiển thị danh sách lịch sử
 */
function updateHistoryDisplay() {
    historyList.innerHTML = '';
    
    history.forEach(item => {
        let historyDiv = document.createElement('div');
        historyDiv.className = 'history-item';
        historyDiv.innerHTML = `
            <div>${item.expression} = ${item.result}</div>
            <small style="opacity: 0.7; font-size: 12px;">${item.timestamp}</small>
        `;
        historyList.appendChild(historyDiv);
    });
}

/**
 * Xử lý sự kiện bàn phím
 * @param {KeyboardEvent} event - Sự kiện bàn phím
 */
function handleKeyboardInput(event) {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
        // Số từ 0-9
        appendToDisplay(key);
    } else if (key === '.') {
        // Dấu thập phân
        appendToDisplay('.');
    } else if (key === '+') {
        // Phép cộng
        appendToDisplay('+');
    } else if (key === '-') {
        // Phép trừ
        appendToDisplay('-');
    } else if (key === '*') {
        // Phép nhân
        appendToDisplay('*');
    } else if (key === '/') {
        // Phép chia - ngăn không cho mở menu tìm kiếm của trình duyệt
        event.preventDefault();
        appendToDisplay('/');
    } else if (key === 'Enter' || key === '=') {
        // Tính toán kết quả
        calculate();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        // Xóa toàn bộ
        clearAll();
    } else if (key === 'Backspace') {
        // Xóa ký tự cuối
        clearLast();
    } else if (key === '%') {
        // Tính phần trăm
        calculatePercentage();
    }
}

/**
 * Khởi tạo ứng dụng
 */
function initializeCalculator() {
    // Đảm bảo DOM đã load xong
    display = document.getElementById('display');
    historyList = document.getElementById('historyList');
    
    // Reset màn hình về trạng thái ban đầu
    clearAll();
    
    // Thêm event listener cho bàn phím
    document.addEventListener('keydown', handleKeyboardInput);
    
    console.log('🧮 Máy tính đã sẵn sàng!');
}

// Khởi tạo khi DOM đã load xong
document.addEventListener('DOMContentLoaded', initializeCalculator);