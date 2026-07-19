export type WorkspaceId = "movement" | "screens" | "text" | "web" | "files" | "safety" | "recovery" | "independent";

export interface MissionChallenge {
  workspace: WorkspaceId;
  objective: string;
  successNote: string;
  required: readonly (readonly string[])[];
  forbidden?: readonly string[];
}

const challenge = (
  workspace: WorkspaceId,
  objective: string,
  successNote: string,
  required: readonly (readonly string[])[],
  forbidden?: readonly string[],
): MissionChallenge => ({ workspace, objective, successNote, required, forbidden });

export const missionChallenges: Record<string, MissionChallenge> = {
  pointer: challenge("movement", "予定表の『7月19日』を一度選んでください。", "ねらった対象と、選んだ後の変化を確認できました。", [["target-selected"]]),
  scroll: challenge("movement", "お知らせを下へ動かし、『持ち物』を見つけて選んでください。", "画面外にも内容が続く手掛かりを見つけました。", [["notice-scrolled"], ["detail-found"]]),
  context: challenge("movement", "『参加資料』から補助メニューを開き、『情報を見る』を選んでください。", "表面にない操作を、環境に合う方法で開けました。", [["context-opened"], ["info-inspected"]]),
  recovery: challenge("movement", "『練習メモ』をゴミ箱へ動かし、起きた変化を見てから元に戻してください。", "誤操作のあと、状態を見て取り消せました。", [["item-trashed"], ["action-undone"]]),

  navigation: challenge("screens", "ブラウザで『施設案内』を開き、ひとつ前の画面へ戻ってください。", "現在地を失わず、履歴を使って戻れました。", [["page-opened"], ["went-back"]]),
  "open-close": challenge("screens", "メモを開いて閉じ、もう一度開いてください。内容が残ることも確かめます。", "アプリを閉じることと、内容を消すことを区別できました。", [["notes-opened"], ["window-closed"], ["app-reopened"]]),
  "app-switch": challenge("screens", "ブラウザとメモを開き、切替バーまたは環境のショートカットで二往復してください。", "二つの作業を閉じずに行き来できました。", [["two-apps-open"], ["app-switched"]]),
  "menu-discovery": challenge("screens", "三点または歯車の手掛かりからメニューを開き、『表示』を選んでください。", "見た目の手掛かりから隠れた機能を探せました。", [["menu-opened"], ["display-opened"]]),

  typing: challenge("text", "入力欄へ『夏祭り 10時』と入力してください。間違えた文字はその場で直せます。", "入力位置を確かめ、必要な文字を入力できました。", [["target-typed"]]),
  "text-selection": challenge("text", "文章の中から『青いタオル』だけを、ドラッグまたは選択ハンドルで選んでください。", "必要な範囲だけを選べました。", [["text-selected"]]),
  "copy-paste": challenge("text", "『集合場所：中央公民館』を選んでコピーし、下のメモへ貼り付けてください。", "コピー元を残したまま、内容を別の場所で使えました。", [["text-copied"], ["text-pasted"]]),
  "edit-undo": challenge("text", "メモへ文字を追加し、環境の取り消し操作で一度戻してください。", "編集結果を観察し、内容を失わず取り消せました。", [["text-edited"], ["text-undone"]]),

  "browser-search": challenge("web", "『みどり市 図書館』を検索し、公式の検索結果を開いてください。", "目的を検索語にして、結果から行き先を選べました。", [["useful-query"], ["official-opened"]]),
  "search-refine": challenge("web", "検索結果が広すぎます。『開館時間』を加えて絞り込んでください。", "目的に足りない言葉を加え、結果を絞れました。", [["broad-query"], ["refined-query"]]),
  "tabs-compare": challenge("web", "公式サイトと地域ブログを別々に開き、両方の日付を確認してください。", "二つの情報を閉じずに比べられました。", [["two-tabs-open"], ["official-date-checked"], ["blog-date-checked"]]),
  "source-check": challenge("web", "明日の開館時間として信頼できる方を選び、発信元と更新日を確認してください。", "内容だけでなく、誰がいつ出した情報かを確かめました。", [["official-chosen"], ["source-checked"], ["date-checked"]], ["old-source-chosen"]),

  "file-concepts": challenge("files", "『参加案内.pdf』が今どこにあるか確認し、『ダウンロード』を開いてください。", "ファイル名だけでなく、保存場所も見られました。", [["location-checked"], ["downloads-opened"]]),
  "file-organize": challenge("files", "『document1.pdf』を『2026夏祭り案内.pdf』に変更し、『参加資料』へ移してください。", "後で見つけられる名前と場所に整理できました。", [["file-renamed"], ["file-moved"]]),
  "download-locate": challenge("files", "案内PDFを一度だけダウンロードし、日付とサイズを比べて最新版を開いてください。", "取得の完了、保存先、最新版である根拠を確かめられました。", [["download-started"], ["download-metadata-compared"], ["download-verified"]]),
  "attach-review": challenge("files", "新しい版の案内だけをメールへ添付し、ファイル名と宛先を確認してください。", "添付できたことだけでなく、送る内容を確かめました。", [["correct-attached"], ["recipient-reviewed"]], ["wrong-file-sent"]),

  "permission-decision": challenge("safety", "地図には『使用中のみ位置情報』を許可し、懐中電灯の『連絡先』は拒否してください。", "目的に必要な範囲だけ許可できました。", [["map-limited-allowed"], ["contacts-denied"]]),
  "account-recovery": challenge("safety", "『パスワードを忘れた』から練習コードを確認し、誰にも共有せず入力してください。", "推測を繰り返さず、公式の再設定経路を使えました。", [["recovery-opened"], ["code-checked"], ["code-entered"]], ["code-shared"]),
  "form-review": challenge("safety", "申込内容の確認画面で人数の誤りを見つけ、戻って2人へ直してください。", "入力を失わず戻り、確定前に修正できました。", [["review-opened"], ["form-corrected"], ["form-reviewed"]]),
  "suspicious-message": challenge("safety", "停止を急がせるメッセージのリンクは使わず、送信元を確認して公式アプリから状態を確かめてください。", "急がされても止まり、別の公式経路で確認できました。", [["sender-inspected"], ["official-route-used"], ["message-reported"]], ["suspicious-link-opened"]),

  "error-reading": challenge("recovery", "保存エラーの詳細を読み、原因に合う確認をしてから再試行してください。", "エラーを次の行動へ変える手掛かりとして読めました。", [["error-inspected"], ["storage-fixed"], ["retry-succeeded"]]),
  "wifi-recovery": challenge("recovery", "接続表示を確認し、『まちのWi-Fi』へつなぎ直して二つのページを確かめてください。", "状態を一つずつ確認して、つながらない原因を切り分けました。", [["network-inspected"], ["correct-network"], ["connection-verified"]]),
  "help-search": challenge("recovery", "『文字が急に大きい』を環境名と一緒にヘルプ検索し、表示倍率を戻してください。", "困りごとを検索できる言葉に変えられました。", [["help-query"], ["trusted-help"], ["display-restored"]]),
  "alternate-solution": challenge("recovery", "使えない方法に固執せず、上部メニューか環境のショートカットで内容をコピーしてください。", "目的を保ったまま別の安全な経路を選べました。", [["primary-blocked"], ["alternate-used"]]),

  "independent-research": challenge("independent", "明日の中央図書館の時間を、発信元と更新日を含めて自力で確かめてください。", "検索、比較、安全判断を組み合わせて根拠を残せました。", [["independent-query"], ["independent-source"], ["independent-answer"]]),
  "independent-file": challenge("independent", "受け取った申込書を意味のある名前で整理し、正しい宛先への返信に添付してください。", "保存から添付前確認まで、一続きで進められました。", [["independent-saved"], ["independent-organized"], ["independent-attached"]]),
  "independent-settings": challenge("independent", "文字を読みやすくし、行が切れたら一段階戻してちょうどよい値にしてください。", "設定を試し、結果を見て自分に合う状態へ戻せました。", [["independent-setting-open"], ["independent-preview"], ["independent-restored"]]),
  "independent-troubleshoot": challenge("independent", "写真をフォームへ追加できない原因を調べ、元写真を残したままプレビューまで進めてください。", "観察、切り分け、調査、復旧を組み合わせて解決できました。", [["independent-error-read"], ["independent-diagnosed"], ["independent-solved"], ["original-preserved"]]),
};

export function evaluateChallenge(challenge: MissionChallenge, events: readonly string[]) {
  const eventSet = new Set(events);
  const blocked = challenge.forbidden?.some((event) => eventSet.has(event)) ?? false;
  const completedGroups = challenge.required.filter((alternatives) => alternatives.some((event) => eventSet.has(event))).length;
  return {
    blocked,
    complete: !blocked && completedGroups === challenge.required.length,
    completedGroups,
    totalGroups: challenge.required.length,
  };
}
