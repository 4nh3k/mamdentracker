export type Language = "vi" | "en"

export type TranslationKey =
  // Header
  | "GAME_MANAGER"
  | "CIRCULAR_QUEUE_SCORING"
  | "NEW_GAME"
  | "SETTINGS"
  | "INSTRUCTIONS"
  // Setup Modal
  | "GAME_SETUP"
  | "PLAYERS"
  | "ADD_AT_LEAST_PLAYERS"
  | "PLAYER_NAME"
  | "SCORING_SYSTEM"
  | "CHOOSE_PRESET"
  | "PRESET"
  | "CUSTOM_POINTS"
  | "POINTS"
  | "GAME_SETTINGS"
  | "CONFIGURE_SPECIAL_ACTIONS"
  | "DOUBLE_LOSER_SCORE"
  | "ENABLE_DOUBLE_ACTION"
  | "START_GAME"
  // Player Queue
  | "PLAYER_QUEUE"
  | "CURRENT_PLAYER"
  | "POSITION"
  | "SPECIAL_ACTIONS"
  | "FROM_ALL"
  | "ENABLE_MULTIPLIER"
  | "MULTIPLIER_ACTIVE"
  | "FAULT"
  // Score Controls
  | "RESET_ALL_SCORES"
  // Game History
  | "GAME_HISTORY"
  | "CLEAR"
  | "NO_ACTIONS_YET"
  | "ROLLBACK"
  // History descriptions
  | "SCORED"
  | "POINT"
  | "POINTS_PLURAL"
  | "DOUBLED"
  | "TOOK_FROM"
  | "FROM_ALL_PLAYERS"
  | "FAULTED"
  | "ALL_SCORES_RESET"
  | "NEW_GAME_STARTED"
  // Instructions Modal
  | "INSTRUCTIONS_TITLE"
  | "CLOSE"
  | "INTRO_TITLE"
  | "INTRO_TEXT"
  | "TURN_RULES_TITLE"
  | "TURN_RULE_1"
  | "TURN_RULE_2"
  | "TURN_RULE_3"
  | "TURN_RULE_3_EXAMPLE"
  | "GAME_RULES_TITLE"
  | "BALL_STRUCTURE_TITLE"
  | "BALL_STRUCTURE_1"
  | "BALL_STRUCTURE_2"
  | "SCORING_METHOD_TITLE"
  | "BALL_3"
  | "BALL_6"
  | "BALL_9"
  | "SCORE_NOTE"
  | "RULE_1"
  | "RULE_2"
  | "RULE_3"
  | "RULE_4"
  | "RULE_5"
  | "RULE_6"
  | "SPECIAL_RULES_TITLE"
  | "SPECIAL_RULE_1"

export const translations: Record<Language, Record<TranslationKey, string>> = {
  vi: {
    // Header
    GAME_MANAGER: "Mâm Đền",
    CIRCULAR_QUEUE_SCORING: "App tính điểm mâm đền",
    NEW_GAME: "Trò Chơi Mới",
    SETTINGS: "Cài Đặt",
    INSTRUCTIONS: "Hướng Dẫn",

    // Setup Modal
    GAME_SETUP: "Thiết Lập Trò Chơi",
    PLAYERS: "Người Chơi",
    ADD_AT_LEAST_PLAYERS: "Thêm ít nhất 2 người chơi để bắt đầu",
    PLAYER_NAME: "Tên người chơi",
    SCORING_SYSTEM: "Hệ thống Tính Điểm",
    CHOOSE_PRESET: "Chọn cài đặt sẵn hoặc tạo điểm tùy chỉnh",
    PRESET: "Cài Đặt Sẵn",
    CUSTOM_POINTS: "Điểm Tùy Chỉnh",
    POINTS: "Điểm",
    GAME_SETTINGS: "Cài Đặt Trò Chơi",
    CONFIGURE_SPECIAL_ACTIONS: "Cấu hình hành động đặc biệt",
    DOUBLE_LOSER_SCORE: "Nhân Đôi Lỗ Mười",
    ENABLE_DOUBLE_ACTION: "Bật lỗ mười gấp đôi",
    START_GAME: "Bắt Đầu Trò Chơi",

    // Player Queue
    PLAYER_QUEUE: "Hàng Đợi Người Chơi",
    CURRENT_PLAYER: "Người Chơi Hiện Tại",
    POSITION: "Vị Trí",
    SPECIAL_ACTIONS: "Điểm làng",
    FROM_ALL: "từ tất cả",
    ENABLE_MULTIPLIER: "Lỗ mười x2",
    MULTIPLIER_ACTIVE: "x2 Đang Hoạt Động - Chọn Điểm Để Nhân Đôi",
    FAULT: "Lỗi",

    // Score Controls
    RESET_ALL_SCORES: "Reset Điểm",

    // Game History
    GAME_HISTORY: "Lịch Sử Trò Chơi",
    CLEAR: "Xóa",
    NO_ACTIONS_YET: "Chưa có hành động nào",
    ROLLBACK: "Hoàn Tác",

    // History descriptions
    SCORED: "ghi được",
    POINT: "điểm",
    POINTS_PLURAL: "điểm",
    DOUBLED: "nhân đôi",
    TOOK_FROM: "lấy",
    FROM_ALL_PLAYERS: "từ tất cả người chơi",
    FAULTED: "phạm lỗi và đổi vị trí",
    ALL_SCORES_RESET: "Tất cả điểm đã được đặt lại về 0",
    NEW_GAME_STARTED: "Trò chơi mới bắt đầu - tất cả điểm đã được đặt lại",

    // Instructions Modal
    INSTRUCTIONS_TITLE: "Hướng Dẫn Chơi Mâm Đền 3-6-9",
    CLOSE: "Đóng",
    INTRO_TITLE: "🏆 Giới thiệu",
    INTRO_TEXT:
      "Mâm Đền là trò chơi bida tính điểm theo lượt, nơi người chơi đánh theo vòng tròn và đền điểm cho nhau dựa trên kết quả từng cơ. Trò chơi kết hợp chiến thuật – may mắn – xử lý lỗi, tạo nên tính công bằng và hấp dẫn.",
    TURN_RULES_TITLE: "🔄 Luật lượt đánh",
    TURN_RULE_1: "Thứ tự người chơi chạy theo vòng tròn (vd: Anh → Tuấn → Nghĩa → Đạt → Anh → …).",
    TURN_RULE_2: "Khi một người ghi điểm, họ được cộng, còn người trước bị trừ số điểm tương ứng.",
    TURN_RULE_3: "Nếu một người bị lỗi (fault), họ sẽ bị đẩy xuống cuối hàng đợi.",
    TURN_RULE_3_EXAMPLE: "Ví dụ: Tuấn → Anh → Nghĩa. Nếu Anh lỗi → đổi thành Tuấn → Nghĩa → Anh.",
    GAME_RULES_TITLE: "🎱 Luật Đánh Đền 3–6–9",
    BALL_STRUCTURE_TITLE: "Cấu trúc bi:",
    BALL_STRUCTURE_1: "Bi đề ba gồm: 1 đầu, các bi 3, 6, 9 giữa.",
    BALL_STRUCTURE_2: "Khi đề ba có bi chết và đủ 3 bếp, được đánh tiếp.",
    SCORING_METHOD_TITLE: "Cách tính điểm:",
    BALL_3: "3",
    BALL_6: "6",
    BALL_9: "9",
    SCORE_NOTE: "-",
    RULE_1: "Khi ăn bi 3–6–9, mỗi đối thủ phải đền điểm tương ứng và bốc bi lên.",
    RULE_2: "Nếu chết cái, người đánh phải đền ngược lại.",
    RULE_3: "Dọn đủ bi 1–9, tổng điểm là 12 điểm mỗi nhà (x2 hệ số).",
    RULE_4: "Nếu đối phương lỗi sau cơ của bạn, bạn được bốc bi lên ở cơ kế tiếp.",
    RULE_5: "Khi ăn bi có điểm, người đánh cơ trước phải đền điểm.",
    RULE_6: "Cộng 3–6–9 vẫn được cộng điểm và bốc lại bi 3–6–9.",
    SPECIAL_RULES_TITLE: "⚠️ Luật đặc biệt",
    SPECIAL_RULE_1: "Bị bắt 3 đui → đền toàn bộ số bi có điểm còn lại trên bàn.",
  },
  en: {
    // Header
    GAME_MANAGER: "Game Manager",
    CIRCULAR_QUEUE_SCORING: "Circular queue scoring system",
    NEW_GAME: "New Game",
    SETTINGS: "Settings",
    INSTRUCTIONS: "Instructions",

    // Setup Modal
    GAME_SETUP: "Game Setup",
    PLAYERS: "Players",
    ADD_AT_LEAST_PLAYERS: "Add at least 2 players to start",
    PLAYER_NAME: "Player name",
    SCORING_SYSTEM: "Scoring System",
    CHOOSE_PRESET: "Choose a preset or create custom points",
    PRESET: "Preset",
    CUSTOM_POINTS: "Custom Points",
    POINTS: "Points",
    GAME_SETTINGS: "Game Settings",
    CONFIGURE_SPECIAL_ACTIONS: "Configure special actions",
    DOUBLE_LOSER_SCORE: "Double Loser's Score",
    ENABLE_DOUBLE_ACTION: "Enable action to double the lowest player's score",
    START_GAME: "Start Game",

    // Player Queue
    PLAYER_QUEUE: "Player Queue",
    CURRENT_PLAYER: "Current Player",
    POSITION: "Position",
    SPECIAL_ACTIONS: "Special Actions",
    FROM_ALL: "from all",
    ENABLE_MULTIPLIER: "Enable 2x Multiplier",
    MULTIPLIER_ACTIVE: "2x Active - Next Action Doubled",
    FAULT: "Fault",

    // Score Controls
    RESET_ALL_SCORES: "Reset All Scores",

    // Game History
    GAME_HISTORY: "Game History",
    CLEAR: "Clear",
    NO_ACTIONS_YET: "No actions yet",
    ROLLBACK: "Rollback",

    // History descriptions
    SCORED: "scored",
    POINT: "point",
    POINTS_PLURAL: "points",
    DOUBLED: "doubled",
    TOOK_FROM: "took",
    FROM_ALL_PLAYERS: "from all players",
    FAULTED: "faulted and moved position",
    ALL_SCORES_RESET: "All scores reset to 0",
    NEW_GAME_STARTED: "New game started - all scores reset",

    // Instructions Modal
    INSTRUCTIONS_TITLE: "How to Play Mâm Đền 3-6-9",
    CLOSE: "Close",
    INTRO_TITLE: "🏆 Introduction",
    INTRO_TEXT:
      "Mâm Đền is a turn-based billiards scoring game where players take turns in a circular queue and score points based on each shot. The game combines strategy, luck, and fault handling to create fairness and excitement.",
    TURN_RULES_TITLE: "🔄 Turn Rules",
    TURN_RULE_1: "Players take turns in a circular order (e.g., Anh → Tuan → Nghia → Dat → Anh → …).",
    TURN_RULE_2: "When a player scores, they gain points while the previous player loses the corresponding points.",
    TURN_RULE_3: "If a player commits a fault, they are moved to the end of the queue.",
    TURN_RULE_3_EXAMPLE: "Example: Tuan → Anh → Nghia. If Anh faults → becomes Tuan → Nghia → Anh.",
    GAME_RULES_TITLE: "🎱 3-6-9 Scoring Rules",
    BALL_STRUCTURE_TITLE: "Ball structure:",
    BALL_STRUCTURE_1: "The setup includes: 1 cue ball, and balls 3, 6, 9 in the middle.",
    BALL_STRUCTURE_2: "When there's a dead ball and 3 cushions are hit, you can continue playing.",
    SCORING_METHOD_TITLE: "Scoring method:",
    BALL_3: "3",
    BALL_6: "6",
    BALL_9: "9",
    SCORE_NOTE: "-",
    RULE_1: "When pocketing balls 3-6-9, each opponent must pay the corresponding points and rack the balls.",
    RULE_2: "If you scratch, you must pay back the points.",
    RULE_3: "Clearing all balls 1-9 gives 12 points per player (x2 multiplier).",
    RULE_4: "If your opponent faults after your shot, you get to rack the balls on the next turn.",
    RULE_5: "When pocketing a scoring ball, the previous player must pay the points.",
    RULE_6: "Combination shots with 3-6-9 still score points and you rack the balls again.",
    SPECIAL_RULES_TITLE: "⚠️ Special Rules",
    SPECIAL_RULE_1: "Getting caught with 3 fouls → pay all remaining scoring balls on the table.",
  },
}

export function useTranslation() {
  // This will be replaced with proper hook implementation
  return (key: TranslationKey, defaultValue?: string): string => {
    return defaultValue || key
  }
}
