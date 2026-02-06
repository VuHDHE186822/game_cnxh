// ========== GAME DATA ==========

const TEAM_COLORS = [
    '#e74c3c', // Đỏ
    '#3498db', // Xanh dương
    '#2ecc71', // Xanh lá
    '#f39c12', // Cam
    '#9b59b6', // Tím
    '#1abc9c', // Xanh ngọc
    '#e91e63', // Hồng
    '#00bcd4'  // Cyan
];

// Câu hỏi trắc nghiệm - sẽ được load từ file JSON
let QUIZ_QUESTIONS = {
    career: [],
    study: [],
    social: [],
    policy: []
};

// Hàm load câu hỏi từ file JSON
async function loadQuestions() {
    try {
        const response = await fetch('data/questions.json');
        if (response.ok) {
            QUIZ_QUESTIONS = await response.json();
            console.log('✅ Đã load', getTotalQuestions(), 'câu hỏi từ file JSON');
        } else {
            console.log('⚠️ Không tìm thấy file JSON, sử dụng câu hỏi mặc định');
            loadDefaultQuestions();
        }
    } catch (error) {
        console.log('⚠️ Lỗi load JSON, sử dụng câu hỏi mặc định:', error);
        loadDefaultQuestions();
    }
}

// Đếm tổng số câu hỏi
function getTotalQuestions() {
    return QUIZ_QUESTIONS.career.length + 
           QUIZ_QUESTIONS.study.length + 
           QUIZ_QUESTIONS.social.length + 
           QUIZ_QUESTIONS.policy.length;
}

// Câu hỏi mặc định nếu không load được JSON
function loadDefaultQuestions() {
    QUIZ_QUESTIONS = {
        career: [
            {
                question: "Theo quan điểm Mác-Lênin, tại sao giai cấp công nhân được coi là giai cấp tiên tiến nhất?",
                options: ["A. Vì họ đông đảo nhất", "B. Vì họ gắn liền với phương thức sản xuất tiên tiến nhất", "C. Vì họ có thu nhập cao nhất", "D. Vì họ được đào tạo tốt nhất"],
                correct: 1,
                explanation: "Giai cấp công nhân gắn liền với lực lượng sản xuất tiên tiến nhất."
            },
            {
                question: "Sinh viên FPT học ngành CNTT sau tốt nghiệp thuộc thành phần nào?",
                options: ["A. Tầng lớp trí thức", "B. Giai cấp tư sản", "C. Công nhân trí thức - bộ phận của giai cấp công nhân", "D. Tầng lớp trung lưu"],
                correct: 2,
                explanation: "Lập trình viên, kỹ sư CNTT là công nhân trí thức thuộc giai cấp công nhân hiện đại."
            }
        ],
        study: [
            {
                question: "Tại sao học tập suốt đời là yêu cầu bắt buộc với công nhân thời đại số?",
                options: ["A. Vì công nghệ thay đổi nhanh, kiến thức cũ nhanh lỗi thời", "B. Vì nhà tuyển dụng yêu cầu", "C. Vì muốn có bằng cấp đẹp", "D. Vì bắt buộc phải học"],
                correct: 0,
                explanation: "Cách mạng 4.0 khiến công nghệ thay đổi nhanh chóng."
            }
        ],
        social: [
            {
                question: "Chuyển đổi số tạo ra cơ hội gì cho giai cấp công nhân Việt Nam?",
                options: ["A. Chỉ tạo ra thất nghiệp", "B. Cơ hội nâng cao trình độ, tham gia vào chuỗi giá trị toàn cầu", "C. Không có cơ hội gì", "D. Chỉ có lợi cho tư bản"],
                correct: 1,
                explanation: "Chuyển đổi số mở ra cơ hội việc làm mới."
            }
        ],
        policy: [
            {
                question: "Công đoàn số có vai trò gì trong thời đại 4.0?",
                options: ["A. Không còn cần thiết", "B. Bảo vệ quyền lợi công nhân trên môi trường số", "C. Chỉ thu phí công đoàn", "D. Tổ chức du lịch"],
                correct: 1,
                explanation: "Công đoàn số bảo vệ quyền lợi công nhân trong nền kinh tế số."
            }
        ]
    };
}

// Hàm lấy loại câu hỏi dựa trên loại ô
function getQuizTypeForCell(cellType) {
    switch(cellType) {
        case 'career': return 'career';
        case 'study': return 'study';
        case 'social': return 'social';
        case 'policy': return 'policy';
        default: return 'career';
    }
}

// Dữ liệu các ô trên bàn cờ (28 cells for 8x8 donut board)
const CELLS = [
    { id: 0, name: "🎓 START - ĐH FPT", type: "start", effect: { study: 1, tech: 1, class: 1, social: 1 }, desc: "Điểm xuất phát - Mỗi lần đi qua +1 tất cả chỉ số" },
    { id: 1, name: "💻 CNTT", type: "career", effect: { tech: 2 }, desc: "Phát triển phần mềm cho doanh nghiệp Việt Nam" },
    { id: 2, name: "🤖 AI", type: "career", effect: { tech: 2, study: 1 }, desc: "Nghiên cứu ứng dụng AI vào sản xuất" },
    { id: 3, name: "📊 Data Science", type: "career", effect: { tech: 1, social: 1 }, desc: "Phân tích dữ liệu phục vụ quản lý xã hội" },
    { id: 4, name: "⚙️ Tự động hóa", type: "career", effect: { tech: 2 }, desc: "Thiết kế hệ thống tự động cho nhà máy" },
    { id: 5, name: "🎴 SỰ KIỆN", type: "event", effect: null, desc: "Rút 1 thẻ sự kiện" },
    { id: 6, name: "🔬 R&D Lab", type: "career", effect: { tech: 2, study: 1 }, desc: "Nghiên cứu phát triển sản phẩm công nghệ mới" },
    { id: 7, name: "🎴 SỰ KIỆN", type: "event", effect: null, desc: "Rút 1 thẻ sự kiện" },
    { id: 8, name: "📱 Kỹ năng số", type: "study", effect: { study: 2 }, desc: "Upskill để không bị đào thải bởi tự động hóa" },
    { id: 9, name: "🌐 Ngoại ngữ", type: "study", effect: { study: 1, tech: 1 }, desc: "Nâng cao năng lực hội nhập quốc tế" },
    { id: 10, name: "📕 Tư duy Mác-Lênin", type: "study", effect: { class: 3 }, desc: "Hiểu rõ sứ mệnh lịch sử của giai cấp công nhân" },
    { id: 11, name: "🤝 Kỹ năng mềm", type: "study", effect: { study: 1, social: 1 }, desc: "Lãnh đạo, làm việc nhóm, giao tiếp" },
    { id: 12, name: "🎯 Kỹ năng quản lý", type: "study", effect: { study: 2, social: 1 }, desc: "Quản lý dự án và con người" },
    { id: 13, name: "🏛️ Công đoàn số", type: "policy", effect: { class: 2 }, desc: "Bảo vệ quyền lợi công nhân thời đại 4.0" },
    { id: 14, name: "📋 Chính sách Nhà nước", type: "policy", effect: { study: 1 }, allTeams: true, desc: "Đào tạo nhân lực số - Tất cả đội +1📚" },
    { id: 15, name: "🏢 DN Công nghệ Việt", type: "policy", effect: { social: 2, class: 1 }, desc: "FPT, Viettel, VNPT - Đóng góp cho đất nước" },
    { id: 16, name: "📲 Kinh tế nền tảng", type: "social", effect: null, drawKnowledge: true, desc: "Grab/Shopee - Rút thẻ tri thức" },
    { id: 17, name: "⚠️ Nguy cơ thất nghiệp", type: "social", effect: null, desc: "Nếu 📚<4: Mất lượt; Nếu ≥4: +1⚔️" },
    { id: 18, name: "🏭 Công nghiệp 4.0", type: "career", effect: { tech: 1, social: 2 }, desc: "Tích hợp IoT, Big Data vào sản xuất" },
    { id: 19, name: "🚀 Startup công nghệ", type: "social", effect: null, desc: "Nếu 💻≥5: +3🌍; Nếu không: -1💻" },
    { id: 20, name: "🔄 Chuyển đổi số", type: "social", effect: { tech: 1 }, allTeams: true, desc: "Xu thế chung - Tất cả đội +1💻" },
    { id: 21, name: "📚 THẺ TRI THỨC", type: "knowledge", effect: null, desc: "Rút 1 thẻ tri thức" },
    { id: 22, name: "🌱 Green Tech", type: "social", effect: { tech: 1, social: 2 }, desc: "Công nghệ xanh vì môi trường" },
    { id: 23, name: "🎴 SỰ KIỆN", type: "event", effect: null, desc: "Rút 1 thẻ sự kiện" },
    { id: 24, name: "💰 Tài chính số", type: "career", effect: { tech: 2 }, desc: "Fintech, Blockchain, Digital Banking" },
    { id: 25, name: "🏅 Chứng chỉ quốc tế", type: "study", effect: { study: 3 }, desc: "AWS, Azure, Google Cloud Certified" },
    { id: 26, name: "🤖 RPA Automation", type: "career", effect: { tech: 2, class: 1 }, desc: "Tự động hóa quy trình nghiệp vụ" },
    { id: 27, name: "📱 Ứng dụng dân sinh", type: "policy", effect: { social: 2, tech: 1 }, desc: "Phát triển app phục vụ cộng đồng" }
];

// Thẻ Tri thức
const KNOWLEDGE_CARDS = [
    { text: "Theo Mác, giai cấp công nhân là giai cấp tiên tiến nhất vì gắn liền với phương thức sản xuất hiện đại.", effect: { class: 2 } },
    { text: "Sứ mệnh lịch sử của GCCN: Xóa bỏ chế độ bóc lột, xây dựng xã hội không có giai cấp.", effect: { class: 2, social: 1 } },
    { text: "Công nhân trí thức = Công nhân + Tri thức: Làm chủ tư liệu sản xuất bằng trí tuệ.", effect: { study: 1, tech: 1, class: 1 } },
    { text: "Chuyển đổi số tạo ra tầng lớp công nhân mới: lập trình viên, kỹ sư AI, chuyên gia dữ liệu.", effect: { tech: 2 } },
    { text: "Sinh viên FPT sau tốt nghiệp: Gắn kết lợi ích cá nhân với sự phát triển của đất nước.", effect: { social: 2 } },
    { text: "Từ 'tự phát' đến 'tự giác': Công nhân cần có ý thức chính trị để thực hiện sứ mệnh.", effect: { class: 3 } },
    { text: "AI không thay thế con người, mà giải phóng con người khỏi lao động đơn giản.", effect: { tech: 1, class: 1 } },
    { text: "Học tập suốt đời là vũ khí của công nhân trí thức thời đại Cách mạng 4.0.", effect: { study: 3 } },
    { text: "Đoàn kết giai cấp trong kỷ nguyên số: Công đoàn điện tử, đấu tranh online.", effect: { class: 2 } },
    { text: "Làm chủ công nghệ = Làm chủ vận mệnh của giai cấp công nhân.", effect: { tech: 2, class: 1 } }
];

// Thẻ Sự kiện
const EVENT_CARDS = [
    { text: "🚨 Robot thay thế 30% công việc nhà máy!", condition: "study", threshold: 4, fail: { tech: -2 }, success: { class: 1 } },
    { text: "🎉 Dự án FPT Smart City thành công!", effect: { social: 2 } },
    { text: "📢 Đình công đòi quyền lợi tại công ty outsource!", effect: { class: 2 }, discussion: "Thảo luận 30s về quyền lợi lao động" },
    { text: "🌐 Chính phủ số hóa dịch vụ công!", effect: { tech: 1 }, allTeams: true },
    { text: "💼 Được tuyển dụng vào tập đoàn công nghệ lớn!", effect: { tech: 2, social: 1 } },
    { text: "📉 Khủng hoảng kinh tế, cắt giảm nhân sự IT!", penalty: "lowestStudy" },
    { text: "🎓 Nhận học bổng đào tạo AI nước ngoài!", effect: { study: 2, tech: 1 } },
    { text: "🤝 Tham gia dự án thiện nguyện dạy code cho trẻ em!", effect: { social: 3 } },
    { text: "💡 Sáng kiến ứng dụng AI vào nông nghiệp!", effect: { tech: 2, social: 2 } },
    { text: "⚠️ Fake news về AI gây hoang mang dư luận!", bonus: "highestClass" }
];

// Achievements definitions
const ACHIEVEMENTS = [
    { id: 'tri_thuc_giac_ngo', name: '🎓 Trí Thức Giác Ngộ', desc: 'Trả lời đúng 3 câu liên tiếp', check: (team) => team.correctStreak >= 3 },
    { id: 'chien_si_cong_doan', name: '⚔️ Chiến Sĩ Công Đoàn', desc: 'Đạt 20 điểm Sứ mệnh', check: (team) => getTeamTotal(team) >= 20 },
    { id: 'lanh_dao_tu_tuong', name: '🏆 Lãnh Đạo Tư Tưởng', desc: 'Dẫn đầu bảng xếp hạng', check: (team, allTeams) => {
        const maxScore = Math.max(...allTeams.map(t => getTeamTotal(t)));
        return getTeamTotal(team) === maxScore && getTeamTotal(team) > 0;
    }},
    { id: 'hoc_tap_suat_doi', name: '📚 Học Tập Suốt Đời', desc: 'Đạt 10 điểm Trình độ', check: (team) => team.stats.study >= 10 },
    { id: 'lam_chu_cong_nghe', name: '💻 Làm Chủ Công Nghệ', desc: 'Đạt 10 điểm Công nghệ', check: (team) => team.stats.tech >= 10 },
    { id: 'y_thuc_giai_cap', name: '⚔️ Ý Thức Giai Cấp', desc: 'Đạt 8 điểm Ý thức', check: (team) => team.stats.class >= 8 },
    { id: 'phuc_vu_nhan_dan', name: '🌍 Phục Vụ Nhân Dân', desc: 'Đạt 8 điểm Đóng góp', check: (team) => team.stats.social >= 8 }
];

// ========== GAME STATE ==========
let gameState = {
    teams: [],
    currentTeam: 0,
    round: 1,
    maxRounds: 6,
    winScore: 30,
    isRolling: false,
    gameEnded: false,
    currentQuiz: null,
    quizTimer: null,
    quizTimeLeft: 15
};

// ========== DOM ELEMENTS ==========
const elements = {
    startScreen: document.getElementById('start-screen'),
    gameScreen: document.getElementById('game-screen'),
    startBtn: document.getElementById('start-btn'),
    rollBtn: document.getElementById('roll-btn'),
    nextTurnBtn: document.getElementById('next-turn-btn'),
    endGameBtn: document.getElementById('end-game-btn'),
    dice: document.getElementById('dice'),
    messageBox: document.getElementById('message-box'),
    currentTurn: document.getElementById('current-turn'),
    roundCounter: document.getElementById('round-counter'),
    scoresGrid: document.getElementById('scores-grid'),
    cardModal: document.getElementById('card-modal'),
    cardType: document.getElementById('card-type'),
    cardText: document.getElementById('card-text'),
    cardEffect: document.getElementById('card-effect'),
    closeCardBtn: document.getElementById('close-card-btn'),
    endModal: document.getElementById('end-modal'),
    finalResults: document.getElementById('final-results'),
    restartBtn: document.getElementById('restart-btn'),
    // Quiz elements
    quizModal: document.getElementById('quiz-modal'),
    quizCellName: document.getElementById('quiz-cell-name'),
    quizTimer: document.getElementById('quiz-timer'),
    quizQuestion: document.getElementById('quiz-question'),
    quizOptions: document.getElementById('quiz-options'),
    quizResult: document.getElementById('quiz-result'),
    quizExplanation: document.getElementById('quiz-explanation'),
    quizContinueBtn: document.getElementById('quiz-continue-btn')
};

// ========== INITIALIZE ==========
function init() {
    elements.startBtn.addEventListener('click', startGame);
    elements.rollBtn.addEventListener('click', rollDice);
    elements.nextTurnBtn.addEventListener('click', nextTurn);
    elements.endGameBtn.addEventListener('click', endGame);
    elements.closeCardBtn.addEventListener('click', closeCardModal);
    elements.restartBtn.addEventListener('click', restartGame);
    elements.quizContinueBtn.addEventListener('click', closeQuizModal);
}

// ========== GAME FUNCTIONS ==========

function startGame() {
    // Lấy tên các đội
    gameState.teams = [];
    for (let i = 1; i <= 8; i++) {
        const input = document.getElementById(`team${i}`);
        const name = input.value.trim() || `Nhóm ${i}`;
        gameState.teams.push({
            id: i,
            name: name,
            position: 0,
            stats: {
                study: 2,   // 📚 Trình độ
                tech: 2,    // 💻 Công nghệ
                class: 1,   // ⚔️ Ý thức giai cấp
                social: 1   // 🌍 Đóng góp xã hội
            },
            skipTurn: false,
            color: TEAM_COLORS[i - 1],
            correctStreak: 0,
            achievements: []
        });
    }

    // Reset game state
    gameState.currentTeam = 0;
    gameState.round = 1;
    gameState.gameEnded = false;

    // Chuyển màn hình
    elements.startScreen.classList.remove('active');
    elements.gameScreen.classList.add('active');

    // Render UI
    renderScoreboard();
    renderPlayers();
    updateTurnInfo();
    showMessage(`🎮 Game bắt đầu! ${gameState.teams[0].name} đổ xúc xắc đầu tiên.`);

    // Enable roll button
    elements.rollBtn.disabled = false;
    elements.nextTurnBtn.disabled = true;
}

function rollDice() {
    if (gameState.isRolling || gameState.gameEnded) return;

    const team = gameState.teams[gameState.currentTeam];
    
    // Kiểm tra skip turn
    if (team.skipTurn) {
        team.skipTurn = false;
        showMessage(`⏭️ ${team.name} bị mất lượt do thiếu kỹ năng!`);
        finishTurn();
        return;
    }

    gameState.isRolling = true;
    elements.rollBtn.disabled = true;

    // Animation xúc xắc
    elements.dice.classList.add('rolling');
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        elements.dice.textContent = Math.floor(Math.random() * 6) + 1;
        rollCount++;
        if (rollCount >= 10) {
            clearInterval(rollInterval);
            elements.dice.classList.remove('rolling');
            
            // Kết quả cuối cùng
            const result = Math.floor(Math.random() * 6) + 1;
            elements.dice.textContent = result;
            
            // Di chuyển
            movePlayer(result);
        }
    }, 100);
}

function movePlayer(steps) {
    const team = gameState.teams[gameState.currentTeam];
    const oldPosition = team.position;
    const newPosition = (team.position + steps) % 28;
    
    // Kiểm tra đi qua START
    if (newPosition < oldPosition) {
        showMessage(`🎓 ${team.name} đi qua START - Tất cả chỉ số +1!`);
        applyEffect(team, { study: 1, tech: 1, class: 1, social: 1 });
    }

    team.position = newPosition;
    
    // Render lại vị trí
    renderPlayers();
    highlightCell(newPosition);

    // Xử lý ô đến
    setTimeout(() => {
        handleCell(newPosition);
    }, 500);
}

function handleCell(cellIndex) {
    const cell = CELLS[cellIndex];
    const team = gameState.teams[gameState.currentTeam];

    showMessage(`📍 ${team.name} đến ô: ${cell.name}`);

    switch (cell.type) {
        case 'start':
            applyEffect(team, cell.effect);
            showMessage(`✨ ${cell.desc}`);
            finishTurn();
            break;

        case 'career':
        case 'study':
        case 'policy':
            // Hiển thị câu hỏi trắc nghiệm
            showQuiz(cell);
            break;

        case 'event':
            drawEventCard();
            break;

        case 'knowledge':
            drawKnowledgeCard();
            break;

        case 'social':
            handleSocialCell(cellIndex);
            break;
    }

    // Cập nhật scoreboard
    renderScoreboard();
}

function handleSocialCell(cellIndex) {
    const cell = CELLS[cellIndex];
    const team = gameState.teams[gameState.currentTeam];

    switch (cellIndex) {
        case 19: // Startup - có câu hỏi
            showQuiz(cell, () => {
                if (team.stats.tech >= 5) {
                    applyEffect(team, { social: 3 });
                    showMessage(`🚀 Startup thành công! +3🌍`);
                } else {
                    applyEffect(team, { tech: -1 });
                    showMessage(`😔 Startup thất bại do thiếu công nghệ! -1💻`);
                }
            });
            break;

        case 20: // Chuyển đổi số
            gameState.teams.forEach(t => {
                applyEffect(t, { tech: 1 });
            });
            showMessage(`🔄 Chuyển đổi số - Tất cả đội +1💻`);
            finishTurn();
            break;

        case 16: // Kinh tế nền tảng - có câu hỏi rồi rút thẻ
            showQuiz(cell, () => {
                drawKnowledgeCard();
            });
            break;

        case 17: // Thất nghiệp - có câu hỏi
            showQuiz(cell, () => {
                if (team.stats.study < 4) {
                    team.skipTurn = true;
                    showMessage(`⚠️ Thiếu kỹ năng! ${team.name} mất lượt tiếp theo.`);
                } else {
                    applyEffect(team, { class: 1 });
                    showMessage(`💪 Nhận thức được tầm quan trọng của học tập! +1⚔️`);
                }
            });
            break;

        case 22: // Green Tech
            showQuiz(cell);
            break;

        default:
            if (cell.effect) {
                showQuiz(cell);
            } else {
                finishTurn();
            }
    }
}

function drawKnowledgeCard() {
    const card = KNOWLEDGE_CARDS[Math.floor(Math.random() * KNOWLEDGE_CARDS.length)];
    const team = gameState.teams[gameState.currentTeam];

    elements.cardType.textContent = "📚 THẺ TRI THỨC";
    elements.cardType.className = "card-type knowledge";
    elements.cardText.textContent = `"${card.text}"`;
    elements.cardEffect.textContent = formatEffect(card.effect);

    applyEffect(team, card.effect);
    renderScoreboard();

    elements.cardModal.classList.add('active');
}

function drawEventCard() {
    const card = EVENT_CARDS[Math.floor(Math.random() * EVENT_CARDS.length)];
    const team = gameState.teams[gameState.currentTeam];

    elements.cardType.textContent = "⚡ THẺ SỰ KIỆN";
    elements.cardType.className = "card-type event";
    elements.cardText.textContent = card.text;

    let effectText = "";

    // Xử lý các loại thẻ đặc biệt
    if (card.condition) {
        // Thẻ có điều kiện
        if (team.stats[card.condition] < card.threshold) {
            applyEffect(team, card.fail);
            effectText = `Điều kiện không đạt! ${formatEffect(card.fail)}`;
        } else {
            applyEffect(team, card.success);
            effectText = `Đạt điều kiện! ${formatEffect(card.success)}`;
        }
    } else if (card.allTeams) {
        // Áp dụng cho tất cả
        gameState.teams.forEach(t => applyEffect(t, card.effect));
        effectText = `Tất cả đội: ${formatEffect(card.effect)}`;
    } else if (card.penalty === "lowestStudy") {
        // Phạt đội có study thấp nhất
        const lowestTeam = gameState.teams.reduce((min, t) => 
            t.stats.study < min.stats.study ? t : min
        );
        applyEffect(lowestTeam, { study: -1, tech: -1, class: -1, social: -1 });
        effectText = `${lowestTeam.name} (📚 thấp nhất) bị trừ điểm!`;
    } else if (card.bonus === "highestClass") {
        // Thưởng đội có class cao nhất
        const highestTeam = gameState.teams.reduce((max, t) => 
            t.stats.class > max.stats.class ? t : max
        );
        gameState.teams.forEach(t => applyEffect(t, { class: 1 }));
        effectText = `${highestTeam.name} giải thích → Tất cả +1⚔️`;
    } else if (card.effect) {
        applyEffect(team, card.effect);
        effectText = formatEffect(card.effect);
    }

    if (card.discussion) {
        effectText += `\n${card.discussion}`;
    }

    elements.cardEffect.textContent = effectText;
    renderScoreboard();

    elements.cardModal.classList.add('active');
}

function closeCardModal() {
    elements.cardModal.classList.remove('active');
    finishTurn();
    checkWinCondition();
}

// ========== QUIZ FUNCTIONS ==========

function showQuiz(cell, callback = null) {
    const team = gameState.teams[gameState.currentTeam];
    const quizType = getQuizTypeForCell(cell.type);
    const questions = QUIZ_QUESTIONS[quizType];
    const quiz = questions[Math.floor(Math.random() * questions.length)];
    
    gameState.currentQuiz = {
        quiz: quiz,
        cell: cell,
        callback: callback,
        answered: false
    };

    // Hiển thị câu hỏi
    elements.quizCellName.textContent = `📍 ${cell.name}`;
    elements.quizCellName.className = `card-type ${cell.type}`;
    elements.quizQuestion.textContent = quiz.question;
    
    // Tạo các lựa chọn
    elements.quizOptions.innerHTML = '';
    quiz.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => selectAnswer(index));
        elements.quizOptions.appendChild(btn);
    });

    // Reset UI
    elements.quizResult.style.display = 'none';
    elements.quizExplanation.style.display = 'none';
    elements.quizContinueBtn.style.display = 'none';
    
    // Bắt đầu đếm ngược
    gameState.quizTimeLeft = 15;
    updateTimerDisplay();
    startQuizTimer();

    // Hiển thị modal
    elements.quizModal.classList.add('active');
}

function startQuizTimer() {
    if (gameState.quizTimer) {
        clearInterval(gameState.quizTimer);
    }
    
    gameState.quizTimer = setInterval(() => {
        gameState.quizTimeLeft--;
        updateTimerDisplay();
        
        if (gameState.quizTimeLeft <= 0) {
            clearInterval(gameState.quizTimer);
            if (!gameState.currentQuiz.answered) {
                timeUp();
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    elements.quizTimer.textContent = `⏱️ ${gameState.quizTimeLeft}s`;
    if (gameState.quizTimeLeft <= 5) {
        elements.quizTimer.classList.add('warning');
    } else {
        elements.quizTimer.classList.remove('warning');
    }
}

function selectAnswer(selectedIndex) {
    if (gameState.currentQuiz.answered) return;
    
    gameState.currentQuiz.answered = true;
    clearInterval(gameState.quizTimer);
    
    const quiz = gameState.currentQuiz.quiz;
    const cell = gameState.currentQuiz.cell;
    const team = gameState.teams[gameState.currentTeam];
    const isCorrect = selectedIndex === quiz.correct;
    
    // Disable tất cả options
    const options = elements.quizOptions.querySelectorAll('.quiz-option');
    options.forEach((opt, idx) => {
        opt.disabled = true;
        if (idx === quiz.correct) {
            opt.classList.add('correct');
        } else if (idx === selectedIndex && !isCorrect) {
            opt.classList.add('wrong');
        }
    });

    // Hiển thị kết quả
    if (isCorrect) {
        elements.quizResult.textContent = '✅ CHÍNH XÁC! Nhận đầy đủ điểm thưởng!';
        elements.quizResult.className = 'quiz-result correct';
        
        // Tăng streak
        team.correctStreak = (team.correctStreak || 0) + 1;
        
        // Áp dụng hiệu ứng đầy đủ
        if (cell.effect) {
            applyEffect(team, cell.effect);
            showMessage(`✨ ${team.name} trả lời đúng! ${formatEffect(cell.effect)}`);
        }
        
        // Nếu là ô allTeams
        if (cell.allTeams) {
            gameState.teams.forEach(t => {
                if (t.id !== team.id) {
                    applyEffect(t, cell.effect);
                }
            });
            showMessage(`📢 Tất cả các đội được cộng điểm!`);
        }
    } else {
        elements.quizResult.textContent = '❌ SAI RỒI! Chỉ nhận 50% điểm thưởng.';
        elements.quizResult.className = 'quiz-result wrong';
        
        // Reset streak
        team.correctStreak = 0;
        
        // Áp dụng 50% hiệu ứng
        if (cell.effect) {
            const halfEffect = {};
            for (let key in cell.effect) {
                halfEffect[key] = Math.floor(cell.effect[key] / 2);
            }
            applyEffect(team, halfEffect);
            showMessage(`😔 ${team.name} trả lời sai! Chỉ nhận ${formatEffect(halfEffect)}`);
        }
    }

    elements.quizResult.style.display = 'block';
    
    // Hiển thị giải thích
    elements.quizExplanation.innerHTML = `<strong>📖 Giải thích:</strong> ${quiz.explanation}`;
    elements.quizExplanation.style.display = 'block';
    
    // Hiển thị nút tiếp tục
    elements.quizContinueBtn.style.display = 'block';
    
    // Cập nhật scoreboard
    renderScoreboard();
    
    // Kiểm tra achievements
    checkAchievements(team);
}

function timeUp() {
    gameState.currentQuiz.answered = true;
    
    const quiz = gameState.currentQuiz.quiz;
    const cell = gameState.currentQuiz.cell;
    const team = gameState.teams[gameState.currentTeam];
    
    // Disable tất cả options và hiển thị đáp án đúng
    const options = elements.quizOptions.querySelectorAll('.quiz-option');
    options.forEach((opt, idx) => {
        opt.disabled = true;
        if (idx === quiz.correct) {
            opt.classList.add('correct');
        }
    });

    // Hết giờ = không nhận điểm
    elements.quizResult.textContent = '⏰ HẾT GIỜ! Không nhận được điểm thưởng.';
    elements.quizResult.className = 'quiz-result wrong';
    elements.quizResult.style.display = 'block';
    
    showMessage(`⏰ ${team.name} hết giờ trả lời! Không nhận được điểm.`);
    
    // Hiển thị giải thích
    elements.quizExplanation.innerHTML = `<strong>📖 Đáp án đúng:</strong> ${quiz.options[quiz.correct]}<br><br>${quiz.explanation}`;
    elements.quizExplanation.style.display = 'block';
    
    // Hiển thị nút tiếp tục
    elements.quizContinueBtn.style.display = 'block';
}

function closeQuizModal() {
    elements.quizModal.classList.remove('active');
    clearInterval(gameState.quizTimer);
    
    // Nếu có callback (cho các ô đặc biệt)
    if (gameState.currentQuiz && gameState.currentQuiz.callback) {
        gameState.currentQuiz.callback();
    } else {
        finishTurn();
        checkWinCondition();
    }
    
    gameState.currentQuiz = null;
}

function applyEffect(team, effect) {
    if (!effect) return;
    
    for (let stat in effect) {
        team.stats[stat] = Math.max(0, team.stats[stat] + effect[stat]);
    }
}

function formatEffect(effect) {
    if (!effect) return "";
    const symbols = { study: "📚", tech: "💻", class: "⚔️", social: "🌍" };
    return Object.entries(effect)
        .map(([key, val]) => `${symbols[key]}${val > 0 ? '+' : ''}${val}`)
        .join(" ");
}

function getTeamTotal(team) {
    return team.stats.study + team.stats.tech + team.stats.class + team.stats.social;
}

function finishTurn() {
    gameState.isRolling = false;
    elements.rollBtn.disabled = true;
    elements.nextTurnBtn.disabled = false;
}

function nextTurn() {
    // Chuyển sang đội tiếp theo
    gameState.currentTeam = (gameState.currentTeam + 1) % 8;
    
    // Nếu quay lại đội đầu tiên = hết 1 vòng
    if (gameState.currentTeam === 0) {
        gameState.round++;
        showMessage(`🔄 Bắt đầu vòng ${gameState.round}!`);
        
        // Kiểm tra hết vòng
        if (gameState.round > gameState.maxRounds) {
            endGame();
            return;
        }
    }

    updateTurnInfo();
    renderScoreboard();
    
    elements.rollBtn.disabled = false;
    elements.nextTurnBtn.disabled = true;

    const team = gameState.teams[gameState.currentTeam];
    showMessage(`🎲 Lượt của ${team.name}. Hãy đổ xúc xắc!`);
}

function checkWinCondition() {
    const team = gameState.teams[gameState.currentTeam];
    const total = getTeamTotal(team);

    if (total >= gameState.winScore) {
        gameState.gameEnded = true;
        showMessage(`🏆 ${team.name} đã chiến thắng với ${total} điểm Sứ mệnh!`);
        
        // Highlight winner
        document.querySelector(`[data-team="${team.id}"]`)?.classList.add('winner');
        
        setTimeout(() => endGame(), 2000);
    }
}

// Check and award achievements
function checkAchievements(team) {
    ACHIEVEMENTS.forEach(achievement => {
        // Nếu chưa đạt achievement này
        if (!team.achievements.includes(achievement.id)) {
            const unlocked = achievement.check(team, gameState.teams);
            if (unlocked) {
                team.achievements.push(achievement.id);
                showAchievementToast(team, achievement);
            }
        }
    });
}

// Show achievement toast notification
function showAchievementToast(team, achievement) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #000;
        padding: 20px 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
        font-weight: bold;
        font-size: 1.1rem;
        z-index: 10000;
        animation: slideIn 0.5s ease-out;
        min-width: 300px;
        border: 3px solid ${team.color};
    `;
    
    toast.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2rem; margin-bottom: 10px;">⭐ ACHIEVEMENT UNLOCKED! ⭐</div>
            <div style="font-size: 1.3rem; margin-bottom: 5px;">${achievement.name}</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">${team.name}</div>
            <div style="font-size: 0.85rem; margin-top: 5px; font-style: italic;">${achievement.desc}</div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => toast.remove(), 500);
    }, 5000);
    
    showMessage(`⭐ ${team.name} mở khóa: ${achievement.name}!`);
}

function checkWinCondition() {
    const team = gameState.teams[gameState.currentTeam];
    const total = getTeamTotal(team);

    if (total >= gameState.winScore) {
        gameState.gameEnded = true;
        showMessage(`🏆 ${team.name} đã chiến thắng với ${total} điểm Sứ mệnh!`);
        
        // Highlight winner
        document.querySelector(`[data-team="${team.id}"]`)?.classList.add('winner');
        
        setTimeout(() => endGame(), 2000);
    }
}

function endGame() {
    gameState.gameEnded = true;

    // Sắp xếp theo điểm
    const sortedTeams = [...gameState.teams].sort((a, b) => getTeamTotal(b) - getTeamTotal(a));

    let resultsHTML = "";
    sortedTeams.forEach((team, index) => {
        const total = getTeamTotal(team);
        const isFirst = index === 0;
        resultsHTML += `
            <div class="final-team ${isFirst ? 'first' : ''}" style="border-left: 4px solid ${team.color}">
                <span>${isFirst ? '🏆 ' : `${index + 1}. `}${team.name}</span>
                <span>${total} điểm (📚${team.stats.study} 💻${team.stats.tech} ⚔️${team.stats.class} 🌍${team.stats.social})</span>
            </div>
        `;
    });

    elements.finalResults.innerHTML = resultsHTML;
    elements.endModal.classList.add('active');
}

function restartGame() {
    elements.endModal.classList.remove('active');
    elements.gameScreen.classList.remove('active');
    elements.startScreen.classList.add('active');
    
    // Clear highlights
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('active'));
    document.querySelectorAll('.team-score').forEach(score => score.classList.remove('winner'));
}

// ========== UI FUNCTIONS ==========

function renderScoreboard() {
    let html = "";
    gameState.teams.forEach((team, index) => {
        const total = getTeamTotal(team);
        const isActive = index === gameState.currentTeam;
        html += `
            <div class="team-score ${isActive ? 'active-team' : ''}" data-team="${team.id}" style="border-color: ${team.color}">
                <div class="team-name" style="color: ${team.color}">${team.name}</div>
                <div class="team-stats">
                    <div class="stat">📚 ${team.stats.study}</div>
                    <div class="stat">💻 ${team.stats.tech}</div>
                    <div class="stat">⚔️ ${team.stats.class}</div>
                    <div class="stat">🌍 ${team.stats.social}</div>
                </div>
                <div class="team-total">${total}/30</div>
            </div>
        `;
    });
    elements.scoresGrid.innerHTML = html;
}

function renderPlayers() {
    // Clear all players
    document.querySelectorAll('.players-here').forEach(el => el.innerHTML = '');

    // Add players to their cells
    gameState.teams.forEach(team => {
        const cell = document.getElementById(`cell-${team.position}`);
        if (cell) {
            const playersArea = cell.querySelector('.players-here');
            const token = document.createElement('div');
            token.className = 'player-token';
            token.style.backgroundColor = team.color;
            token.title = team.name;
            playersArea.appendChild(token);
        }
    });
}

function highlightCell(cellIndex) {
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('active'));
    document.getElementById(`cell-${cellIndex}`)?.classList.add('active');
}

function updateTurnInfo() {
    const team = gameState.teams[gameState.currentTeam];
    elements.currentTurn.innerHTML = `Lượt: <span style="color:${team.color}">${team.name}</span>`;
    elements.roundCounter.textContent = `Vòng: ${gameState.round}/${gameState.maxRounds}`;
}

function showMessage(msg) {
    const p = document.createElement('p');
    p.textContent = msg;
    elements.messageBox.insertBefore(p, elements.messageBox.firstChild);
    
    // Giữ tối đa 5 messages
    while (elements.messageBox.children.length > 5) {
        elements.messageBox.removeChild(elements.messageBox.lastChild);
    }
}

// ========== START ==========
document.addEventListener('DOMContentLoaded', async () => {
    // Load câu hỏi từ JSON trước
    await loadQuestions();
    // Khởi tạo game
    init();
});
