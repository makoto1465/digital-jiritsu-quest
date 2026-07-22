import type { JourneyEnvironment } from "@/features/progress/ProgressProvider";

export type WorkspaceId = "movement" | "screens" | "text" | "web" | "files" | "safety" | "recovery" | "independent";

export interface MissionChallenge {
  workspace: WorkspaceId;
  objective: string;
  successNote: string;
  required: readonly (readonly string[])[];
  forbidden?: readonly string[];
  objectiveByEnvironment?: Partial<Record<JourneyEnvironment, string>>;
  requiredByEnvironment?: Partial<Record<JourneyEnvironment, readonly (readonly string[])[]>>;
}

const challenge = (
  workspace: WorkspaceId,
  objective: string,
  successNote: string,
  required: readonly (readonly string[])[],
  forbidden?: readonly string[],
  objectiveByEnvironment?: Partial<Record<JourneyEnvironment, string>>,
  requiredByEnvironment?: Partial<Record<JourneyEnvironment, readonly (readonly string[])[]>>,
): MissionChallenge => ({ workspace, objective, successNote, required, forbidden, objectiveByEnvironment, requiredByEnvironment });

export const missionChallenges: Record<string, MissionChallenge> = {
  pointer: challenge("movement", "予定表の『7月19日』を{{activate}}してください。", "ねらった対象を操作し、画面の変化を確認できました。", [["target-selected"]]),
  scroll: challenge("movement", "お知らせの中を{{scroll}}し、『持ち物　青いタオル』を{{activate}}してください。", "スクロールして見つけた項目を操作できました。", [["notice-scrolled"], ["detail-found"]]),
  context: challenge("movement", "『参考資料』フォルダーを{{context}}し、表示された『情報を見る』を{{activate}}してください。", "フォルダーのメニューを開き、情報を確認できました。", [["context-opened"], ["info-inspected"]]),
  recovery: challenge("movement", "見本文の『集合場所：中央公民館』を{{selectText}}、『コピー』を{{activate}}します。次にメモ欄を{{context}}し、『貼り付け』を{{activate}}してください。", "見本文を残したまま、同じ文章をメモへ貼り付けられました。", [["text-copied"], ["text-pasted"]]),

  navigation: challenge(
    "screens",
    "ブラウザの『中央公民館｜施設案内』を{{activate}}して開き、左上の『← 戻る』を{{activate}}してください。",
    "現在地を失わず、戻るボタンで前の画面へ戻れました。",
    [["page-opened"], ["went-back"]],
    undefined,
    { windows: "インターネットブラウザを開き、施設案内から検索結果へ戻ります。" },
    { windows: [["browser-opened-from-desktop"], ["page-opened"], ["went-back"]] },
  ),
  "open-close": challenge(
    "screens",
    "『メモ』を{{activate}}して開き、閉じてからもう一度開いてください。",
    "画面を一時的に隠す操作と、閉じる操作を区別できました。",
    [["notes-opened"], ["window-closed"], ["app-reopened"]],
    undefined,
    { windows: "メモ帳を開き、最小化・復元・閉じる違いを練習します。" },
    { windows: [["notes-opened-from-desktop"], ["window-minimized-from-button"], ["window-restored-after-button"], ["window-minimized-from-taskbar"], ["window-restored-after-taskbar"], ["window-closed"], ["app-reopened"]] },
  ),
  "app-switch": challenge(
    "screens",
    "『ブラウザ』と『メモ』を{{activate}}して開き、画面下の切替ボタンを{{activate}}して2回切り替えてください。",
    "二つの作業を閉じずに行き来できました。",
    [["two-apps-open"], ["app-switched"]],
    undefined,
    { windows: "インターネットブラウザとメモ帳を、タスクバーで切り替えます。" },
    { windows: [["browser-opened"], ["notes-opened"], ["app-switched"], ["app-switched-twice"]] },
  ),
  "menu-discovery": challenge(
    "screens",
    "画面右上の『…』を{{activate}}し、表示された『表示』を{{activate}}してください。",
    "ウィンドウを元の大きさへ戻し、場所と大きさを変えられました。",
    [["menu-opened"], ["display-opened"]],
    undefined,
    { windows: "インターネットブラウザの大きさと場所を変えます。" },
    { windows: [["browser-opened"], ["window-maximized"], ["window-restored-down"], ["window-moved"]] },
  ),

  typing: challenge("text", "『予定の検索』の入力欄を選び、『夏祭り10時』と入力してください。空白は入れても入れなくても正解です。", "入力位置を確かめ、必要な文字を入力できました。", [["typing-field-focused"], ["festival-typed"], ["target-typed"]]),
  "text-selection": challenge("text", "文章の『青いタオル』だけを{{selectText}}、選択範囲を確認してください。", "必要な範囲だけを選択できました。", [["text-selected"]]),
  "copy-paste": challenge("text", "『集合場所：中央公民館』を{{selectText}}、『コピー』を{{activate}}します。メモ欄を{{context}}し、『貼り付け』を{{activate}}してください。", "コピー元を残したまま、内容を別の場所で使えました。", [["text-copied"], ["text-pasted"]]),
  "edit-undo": challenge("text", "メモ欄を{{activate}}して文字を追加し、画面下の『取り消し』を{{activate}}してください。", "編集結果を観察し、画面上の操作で取り消せました。", [["text-edited"], ["text-undone"]]),

  "browser-search": challenge("web", "検索欄を{{activate}}し、『みどり市 図書館』と入力します。『検索』を{{activate}}し、『中央図書館｜みどり市公式ホームページ』を{{activate}}してください。", "目的を検索語にして、公式ページを開けました。", [["useful-query"], ["official-opened"]]),
  "search-refine": challenge("web", "検索欄を{{activate}}し、今の検索語の後ろへ『開館時間』と入力します。もう一度『検索』を{{activate}}してください。", "目的に足りない言葉を加え、結果を絞れました。", [["broad-query"], ["refined-query"]]),
  "tabs-compare": challenge("web", "検索結果の公式サイトと地域ブログを順に{{activate}}して別々のタブで開き、それぞれの『日付を確認』を{{activate}}してください。", "二つの情報を閉じずに比べられました。", [["two-tabs-open"], ["official-date-checked"], ["blog-date-checked"]]),
  "source-check": challenge("web", "『みどり市公式』のタブを{{activate}}し、『発信元を確認』『更新日を見る』を順に{{activate}}してください。", "内容だけでなく、誰がいつ出した情報かを確かめました。", [["official-chosen"], ["source-checked"], ["date-checked"]], ["old-source-chosen"]),

  "file-concepts": challenge("files", "左側の『ダウンロード』を{{activate}}し、上部の『場所を確認』を{{activate}}してください。", "ファイル名だけでなく、保存場所も確認できました。", [["downloads-opened"], ["location-checked"]]),
  "file-organize": challenge("files", "『名前変更』を{{activate}}して『2026夏祭り案内.pdf』と入力し、Enterキーを押します。次に『参加資料へ移動』を{{activate}}してください。", "後で見つけられる名前と場所に整理できました。", [["file-renamed"], ["file-moved"]]),
  "download-locate": challenge("files", "『参加案内.pdfをダウンロード』を{{activate}}し、『日付とサイズを比べる』を{{activate}}します。最後に2026年版を{{activate}}してください。", "取得の完了、保存先、最新版である根拠を確かめられました。", [["download-started"], ["download-metadata-compared"], ["download-verified"]]),
  "attach-review": challenge("files", "『ファイルを選ぶ』を{{activate}}し、『2026夏祭り案内.pdf』を{{activate}}します。次に『送信前の3項目を確認』を{{activate}}してください。", "添付できたことだけでなく、送る内容を確かめました。", [["correct-attached"], ["recipient-reviewed"]], ["wrong-file-sent"]),

  "permission-decision": challenge("safety", "地図の『使用中のみ許可』を{{activate}}し、懐中電灯の『許可しない』を{{activate}}してください。", "目的に必要な範囲だけ許可できました。", [["map-limited-allowed"], ["contacts-denied"]]),
  "account-recovery": challenge("safety", "『パスワードを忘れた』を{{activate}}し、『練習メールを開く』を{{activate}}します。表示されたコードを入力欄へ入力し、『確認する』を{{activate}}してください。", "推測を繰り返さず、公式の再設定経路を使えました。", [["recovery-opened"], ["code-checked"], ["code-entered"]], ["code-shared"]),
  "form-review": challenge("safety", "『確認画面へ』を{{activate}}し、『入力へ戻って直す』を{{activate}}します。人数欄を2へ直して確認画面を開き、『内容を確認した』を{{activate}}してください。", "入力を失わず戻り、確定前に修正できました。", [["review-opened"], ["form-corrected"], ["form-reviewed"]]),
  "suspicious-message": challenge("safety", "メッセージ内のリンクは押さず、『送信元を見る』『公式アプリを開く』『迷惑メッセージとして報告』を順に{{activate}}してください。", "急がされても止まり、別の公式経路で確認できました。", [["sender-inspected"], ["official-route-used"], ["message-reported"]], ["suspicious-link-opened"]),

  "error-reading": challenge("recovery", "『詳細を見る』を{{activate}}し、表示された『不要な練習ファイルを整理』を{{activate}}します。最後に『保存を再試行』を{{activate}}してください。", "エラーを次の行動へ変える手掛かりとして読めました。", [["error-inspected"], ["storage-fixed"], ["retry-succeeded"]]),
  "wifi-recovery": challenge("recovery", "『状態を見る』を{{activate}}し、『まちのWi-Fi』を{{activate}}します。最後に『二つのページで確認』を{{activate}}してください。", "状態を一つずつ確認して、つながらない原因を切り分けました。", [["network-inspected"], ["correct-network"], ["connection-verified"]]),
  "help-search": challenge("recovery", "ヘルプ検索欄を{{activate}}し、『{{deviceName}} 文字が大きい』と入力して『ヘルプ検索』を{{activate}}します。表示された公式ヘルプを{{activate}}してください。", "困りごとを検索できる言葉に変えられました。", [["help-query"], ["trusted-help"], ["display-restored"]]),
  "alternate-solution": challenge("recovery", "『右クリックを試す』を{{activate}}して使えないことを確認し、次に『編集メニュー → コピー』を{{activate}}してください。", "使えない操作から、画面上の別の方法へ切り替えられました。", [["primary-blocked"], ["alternate-used"]]),

  "independent-research": challenge("independent", "明日の中央図書館の時間を、発信元と更新日を含めて自力で確かめてください。", "検索、比較、安全判断を組み合わせて根拠を残せました。", [["independent-query"], ["independent-source"], ["independent-answer"]]),
  "independent-file": challenge("independent", "受け取った申込書を意味のある名前で整理し、正しい宛先への返信に添付してください。", "保存から添付前確認まで、一続きで進められました。", [["independent-saved"], ["independent-organized"], ["independent-attached"]]),
  "independent-settings": challenge("independent", "文字を読みやすくし、行が切れたら一段階戻してちょうどよい値にしてください。", "設定を試し、結果を見て自分に合う状態へ戻せました。", [["independent-setting-open"], ["independent-preview"], ["independent-restored"]]),
  "independent-troubleshoot": challenge("independent", "写真をフォームへ追加できない原因を調べ、元写真を残したままプレビューまで進めてください。", "観察、切り分け、調査、復旧を組み合わせて解決できました。", [["independent-error-read"], ["independent-diagnosed"], ["independent-solved"], ["original-preserved"]]),
};

const operationWords: Record<JourneyEnvironment, Record<"activate" | "context" | "scroll" | "selectText" | "deviceName", string>> = {
  windows: {
    activate: "左クリック",
    context: "右クリック",
    scroll: "マウスホイールを下へ回してスクロール",
    selectText: "マウスの左ボタンを押したままドラッグして選択し",
    deviceName: "Windows",
  },
  mac: {
    activate: "クリック",
    context: "Controlクリックまたは2本指クリック",
    scroll: "トラックパッドを2本指で上へ動かしてスクロール",
    selectText: "トラックパッドを押したまま動かして選択し",
    deviceName: "Mac",
  },
  iphone: {
    activate: "タップ",
    context: "長押し",
    scroll: "画面を上へスワイプしてスクロール",
    selectText: "長押しして選択範囲を合わせ",
    deviceName: "iPhone",
  },
  android: {
    activate: "タップ",
    context: "長押し",
    scroll: "画面を上へスワイプしてスクロール",
    selectText: "長押しして選択範囲を合わせ",
    deviceName: "Android",
  },
};

type StepInstructionSet = { default: readonly string[] } & Partial<Record<JourneyEnvironment, readonly string[]>>;

const missionStepInstructions: Record<string, StepInstructionSet> = {
  pointer: { default: ["予定表の『7月19日』を{{activate}}してください。"] },
  scroll: { default: ["お知らせの中で{{scroll}}してください。", "『持ち物　青いタオル』を{{activate}}してください。"] },
  context: { default: ["『参考資料』フォルダーを{{context}}してください。", "表示された『情報を見る』を{{activate}}してください。"] },
  recovery: { default: ["『集合場所：中央公民館』を選択し、『コピー』を{{activate}}してください。", "メモ欄を{{context}}し、『貼り付け』を{{activate}}してください。"] },
  navigation: {
    default: ["『中央公民館｜施設案内』を{{activate}}してください。", "左上の『← 戻る』を{{activate}}してください。"],
    windows: ["デスクトップ左側の『🌐 インターネットブラウザ』をダブルクリックしてください。", "青い文字の『中央公民館｜施設案内』を1回左クリックしてください。", "左上の『←（戻る）』を1回左クリックしてください。"],
  },
  "open-close": {
    default: ["『メモ』を{{activate}}して開いてください。", "開いたメモを閉じてください。", "『メモ』をもう一度{{activate}}してください。"],
    windows: [
      "デスクトップ左側の『▤ メモ帳』をダブルクリックしてください。",
      "メモ帳の右上にある『―（最小化）』を1回左クリックしてください。",
      "画面下のタスクバーにある『▤ メモ帳』を1回左クリックしてください。",
      "同じタスクバーの『▤ メモ帳』をもう一度1回左クリックしてください。",
      "タスクバーの『▤ メモ帳』を1回左クリックして戻してください。",
      "メモ帳の右上にある『×（閉じる）』を1回左クリックしてください。",
      "タスクバーの『▤ メモ帳』を1回左クリックして、もう一度開いてください。",
    ],
  },
  "app-switch": {
    default: ["『ブラウザ』と『メモ』を開いてください。", "画面下の切替ボタンで別のアプリへ切り替えてください。"],
    windows: [
      "タスクバーの『🌐 インターネットブラウザ』を1回左クリックしてください。",
      "タスクバーの『▤ メモ帳』を1回左クリックしてください。",
      "タスクバーの『🌐 インターネットブラウザ』を1回左クリックしてください。",
      "タスクバーの『▤ メモ帳』を1回左クリックしてください。",
    ],
  },
  "menu-discovery": {
    default: ["画面右上の『…』を{{activate}}してください。", "表示された『表示』を{{activate}}してください。"],
    windows: [
      "タスクバーの『🌐 インターネットブラウザ』を1回左クリックしてください。",
      "右上の『□（最大化）』を1回左クリックしてください。",
      "右上の『❐（元のサイズに戻す）』を1回左クリックしてください。",
      "上部の白い帯（タイトルバー）を左へドラッグしてください。",
    ],
  },
  typing: {
    default: [
      "『予定の検索』の入力欄を{{activate}}してください。",
      "『夏祭り』と入力してください。",
      "続けて『10時』と入力してください。空白（スペース）は入れても、入れなくても正解です。",
    ],
  },
  "text-selection": { default: ["文章の『青いタオル』だけを{{selectText}}ください。"] },
  "copy-paste": { default: ["『集合場所：中央公民館』を選択し、『コピー』を{{activate}}してください。", "メモ欄を{{context}}し、『貼り付け』を{{activate}}してください。"] },
  "edit-undo": { default: ["メモ欄へ文字を追加してください。", "画面下の『取り消し』を{{activate}}してください。"] },
  "browser-search": { default: ["検索欄へ『みどり市 図書館』と入力し、『検索』を{{activate}}してください。", "『中央図書館｜みどり市公式ホームページ』を{{activate}}してください。"] },
  "search-refine": { default: ["今の検索語で一度『検索』を{{activate}}してください。", "検索語の後ろへ『開館時間』を追加し、もう一度検索してください。"] },
  "tabs-compare": { default: ["公式サイトと地域ブログを、別々のタブで開いてください。", "公式サイトで『日付を確認』を{{activate}}してください。", "地域ブログで『日付を確認』を{{activate}}してください。"] },
  "source-check": { default: ["『みどり市公式』のタブを{{activate}}してください。", "『発信元を確認』を{{activate}}してください。", "『更新日を見る』を{{activate}}してください。"] },
  "file-concepts": { default: ["左側の『ダウンロード』を{{activate}}してください。", "上部の『場所を確認』を{{activate}}してください。"] },
  "file-organize": { default: ["『名前変更』で『2026夏祭り案内.pdf』と入力し、Enterキーを押してください。", "『参加資料へ移動』を{{activate}}してください。"] },
  "download-locate": { default: ["『参加案内.pdfをダウンロード』を{{activate}}してください。", "『日付とサイズを比べる』を{{activate}}してください。", "2026年版のファイルを{{activate}}してください。"] },
  "attach-review": { default: ["『ファイルを選ぶ』から『2026夏祭り案内.pdf』を選んでください。", "『送信前の3項目を確認』を{{activate}}してください。"] },
  "permission-decision": { default: ["地図の『使用中のみ許可』を{{activate}}してください。", "懐中電灯の『許可しない』を{{activate}}してください。"] },
  "account-recovery": { default: ["『パスワードを忘れた』を{{activate}}してください。", "『練習メールを開く』を{{activate}}してください。", "表示されたコードを入力し、『確認する』を{{activate}}してください。"] },
  "form-review": { default: ["『確認画面へ』を{{activate}}してください。", "入力画面へ戻り、人数を2へ直してください。", "もう一度確認画面を開き、『内容を確認した』を{{activate}}してください。"] },
  "suspicious-message": { default: ["リンクは押さず、『送信元を見る』を{{activate}}してください。", "『公式アプリを開く』を{{activate}}してください。", "『迷惑メッセージとして報告』を{{activate}}してください。"] },
  "error-reading": { default: ["『詳細を見る』を{{activate}}してください。", "『不要な練習ファイルを整理』を{{activate}}してください。", "『保存を再試行』を{{activate}}してください。"] },
  "wifi-recovery": { default: ["『状態を見る』を{{activate}}してください。", "『まちのWi-Fi』を{{activate}}してください。", "『二つのページで確認』を{{activate}}してください。"] },
  "help-search": { default: ["『{{deviceName}} 文字が大きい』と入力し、『ヘルプ検索』を{{activate}}してください。", "表示された公式ヘルプを{{activate}}してください。", "公式ヘルプの手順で表示を戻してください。"] },
  "alternate-solution": { default: ["『右クリックを試す』を{{activate}}してください。", "『編集メニュー → コピー』を{{activate}}してください。"] },
  "independent-research": { default: ["施設名・日付・知りたいことを入れて検索してください。", "発信元と更新日を確認してください。", "明日の開館時間を回答してください。"] },
  "independent-file": { default: ["申込書を保存してください。", "後で分かる名前と場所へ整理してください。", "正しい宛先への返信に添付してください。"] },
  "independent-settings": { default: ["文字サイズの設定を開いてください。", "文字を一段階大きくし、表示を確認してください。", "行が切れたら一段階戻してください。"] },
  "independent-troubleshoot": { default: ["表示されたエラーを確認してください。", "原因を一つずつ調べてください。", "元写真を残したまま問題を直してください。", "写真のプレビューまで進んでください。"] },
};

function resolveOperationWords(text: string, environment: JourneyEnvironment) {
  return text.replace(/\{\{(activate|context|scroll|selectText|deviceName)\}\}/g, (_, key: keyof typeof operationWords.windows) => operationWords[environment][key]);
}

export function resolveChallengeObjective(challenge: MissionChallenge, environment: JourneyEnvironment) {
  const objective = challenge.objectiveByEnvironment?.[environment] ?? challenge.objective;
  return resolveOperationWords(objective, environment);
}

export function getChallengeStepInstructions(missionId: string, challenge: MissionChallenge, environment: JourneyEnvironment) {
  const configured = missionStepInstructions[missionId];
  const steps = configured?.[environment] ?? configured?.default;
  if (!steps?.length) return [resolveChallengeObjective(challenge, environment)];
  return steps.map((step) => resolveOperationWords(step, environment));
}

export function getChallengeRequirements(challenge: MissionChallenge, environment: JourneyEnvironment) {
  return challenge.requiredByEnvironment?.[environment] ?? challenge.required;
}

export function evaluateChallenge(challenge: MissionChallenge, events: readonly string[], environment: JourneyEnvironment) {
  const eventSet = new Set(events);
  const blocked = challenge.forbidden?.some((event) => eventSet.has(event)) ?? false;
  const required = getChallengeRequirements(challenge, environment);
  const completedGroups = required.filter((alternatives) => alternatives.some((event) => eventSet.has(event))).length;
  return {
    blocked,
    complete: !blocked && completedGroups === required.length,
    completedGroups,
    totalGroups: required.length,
  };
}
