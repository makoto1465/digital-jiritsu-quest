/**
 * デジタルの「分かりやすさ」チェック
 *
 * 設計方針（デジタルが苦手な人を基準にする）
 * - 質問文に説明なしの専門用語を出さない。出す場合は必ずかっこ書きで言い換える。
 * - 「できますか？」ではなく「いつもどうしていますか？」と、実際の行動を聞く。
 * - 1問につき1つのことだけ聞く。
 * - いちばんやさしい質問から始め、答えに応じて次の質問のむずかしさを上げ下げする。
 * - 分からない人ほど質問数が少なく終わる。
 */

export type DigitalDimension =
  | "words"
  | "steps"
  | "typing"
  | "navigation"
  | "files"
  | "safety"
  | "recovery"
  | "chatgpt";

export type DigitalDevice = "smartphone" | "pc" | "both" | "rarely";
export type AnswerScore = 0 | 1 | 2 | 3;
export type QuestionKind = "single" | "multi";

export interface AnswerOption {
  readonly id: string;
  readonly label: string;
  readonly note?: string;
  readonly score: AnswerScore;
  readonly device?: DigitalDevice;
  /** 「どれも分からない」など、他と同時に選べない選択肢 */
  readonly exclusive?: boolean;
}

export interface DigitalQuestion {
  readonly id: string;
  readonly dimension: DigitalDimension | "device";
  readonly kind: QuestionKind;
  /** 0＝いちばんやさしい / 1＝ふつう / 2＝慣れている人向け */
  readonly level: 0 | 1 | 2;
  readonly title: string;
  readonly help: string;
  readonly options: readonly AnswerOption[];
}

export interface DigitalAnswer {
  readonly questionId: string;
  readonly optionIds: readonly string[];
  readonly score: AnswerScore;
  readonly dimension: DigitalDimension | "device";
  readonly device?: DigitalDevice;
}

/* ------------------------------------------------------------------ 質問 */

const deviceQuestion: DigitalQuestion = {
  id: "device-main",
  dimension: "device",
  kind: "single",
  level: 0,
  title: "ふだん使っているのは、どれですか？",
  help: "仕事で使うものでも、家で使うものでも大丈夫です。",
  options: [
    { id: "smartphone", label: "スマートフォンだけ", note: "iPhone や Android の携帯電話", score: 1, device: "smartphone" },
    { id: "pc", label: "パソコンだけ", note: "Windows や Mac", score: 2, device: "pc" },
    { id: "both", label: "スマートフォンもパソコンも使う", score: 2, device: "both" },
    { id: "rarely", label: "どちらもほとんど使ったことがない", note: "これから覚えたい", score: 0, device: "rarely" },
  ],
};

/**
 * 「どの言葉の意味が分かるか」を最初に確かめる。ここが説明のむずかしさの土台になる。
 * 「見たことがある」と「意味が分かる」は別のことなので、意味が分かるかどうかだけを聞く。
 */
const wordsQuestion: DigitalQuestion = {
  id: "words-known",
  dimension: "words",
  kind: "multi",
  level: 0,
  title: "何のことか分かる言葉を、ぜんぶ選んでください",
  help: "「聞いたことはあるけれど、意味は分からない」言葉は、選ばずに進んでください。1つも選ばなくて大丈夫です。",
  options: [
    { id: "app", label: "アプリ", note: "スマホやパソコンに入っている、目的ごとの道具", score: 1 },
    { id: "browser", label: "ブラウザ", note: "インターネットを見るアプリ。Chrome、Safari、Edge など", score: 1 },
    { id: "account", label: "アカウント", note: "サービスに登録した、自分の名前とパスワード", score: 1 },
    { id: "url", label: "URL", note: "ホームページの住所。https:// で始まる文字", score: 1 },
    { id: "cloud", label: "クラウド", note: "写真やファイルを、インターネット上に預けるしくみ", score: 1 },
    { id: "os", label: "OS", note: "機器を動かす基本のソフト。Windows、iOS、Android など", score: 1 },
    { id: "mfa", label: "二段階認証", note: "パスワードのあと、届いた数字を入れてもう一度確かめるしくみ", score: 1 },
    { id: "none", label: "どれも分からない", score: 0, exclusive: true },
  ],
};

/** 今の困りごとの解決のしかた。説明の細かさを決める、いちばん効く質問。 */
const stepsQuestion: DigitalQuestion = {
  id: "steps-help",
  dimension: "steps",
  kind: "single",
  level: 0,
  title: "スマホやパソコンで分からないことが出てきたとき、いつもどうしていますか？",
  help: "いちばん近いものを選んでください。どれを選んでも大丈夫です。",
  options: [
    { id: "ask-do", label: "家族やお店の人に、代わりにやってもらう", score: 0 },
    { id: "beside", label: "となりで教えてもらいながら、自分で押す", score: 1 },
    { id: "manual", label: "説明を見ながら、自分でやってみる", score: 2 },
    { id: "self", label: "自分で調べて、たいてい解決できる", score: 3 },
  ],
};

const slotQuestions: Readonly<Record<Exclude<DigitalDimension, "words" | "steps" | "chatgpt">, readonly DigitalQuestion[]>> = {
  typing: [
    {
      id: "typing-basic",
      dimension: "typing",
      kind: "single",
      level: 0,
      title: "文字を打つとき、どう感じますか？",
      help: "スマホのキーボードでも、パソコンのキーボードでも構いません。",
      options: [
        { id: "lost", label: "どこを押せばいいか分からない", score: 0 },
        { id: "slow", label: "打ちたい文字を探すのに時間がかかる", score: 1 },
        { id: "short", label: "短い文なら困らない", score: 2 },
        { id: "long", label: "長い文も打てる", score: 3 },
      ],
    },
    {
      id: "typing-copy",
      dimension: "typing",
      kind: "single",
      level: 1,
      title: "文章をコピーして、別の場所に貼り付けたことはありますか？",
      help: "このチェックで作る文章も、コピーして貼り付けます。やり方は最後にご案内するので、できなくて大丈夫です。",
      options: [
        { id: "never", label: "したことがない・やり方が分からない", score: 0 },
        { id: "helped", label: "教えてもらいながらならできる", score: 1 },
        { id: "alone", label: "自分でできる", score: 2 },
        { id: "often", label: "ふだんから使っている", score: 3 },
      ],
    },
    {
      id: "typing-edit",
      dimension: "typing",
      kind: "single",
      level: 2,
      title: "入力欄にある文章の、一部分だけを直して保存できますか？",
      help: "設定画面や申し込み画面を思い浮かべてください。",
      options: [
        { id: "find", label: "どこを直せばいいか分かりにくい", score: 0 },
        { id: "guided", label: "直す場所が分かれば、できる", score: 1 },
        { id: "ok", label: "直して保存まで、自分でできる", score: 2 },
        { id: "check", label: "直したあと、内容を見直してから保存できる", score: 3 },
      ],
    },
  ],
  navigation: [
    {
      id: "nav-back",
      dimension: "navigation",
      kind: "single",
      level: 0,
      title: "知らない画面が出てきたとき、前の画面に戻れますか？",
      help: "うまく戻れないことがあっても、まったく問題ありません。",
      options: [
        { id: "power", label: "戻り方が分からず、電源を切ることがある", score: 0 },
        { id: "helped", label: "教えてもらえば戻れる", score: 1 },
        { id: "button", label: "「戻る」や「×」を押して戻れる", score: 2 },
        { id: "sure", label: "迷わず戻れる", score: 3 },
      ],
    },
    {
      id: "nav-switch",
      dimension: "navigation",
      kind: "single",
      level: 1,
      title: "アプリを使っている途中で別のアプリを開いて、また元のアプリに戻れますか？",
      help: "たとえば、調べものの途中で写真を見て、また元の画面に戻る操作です。",
      options: [
        { id: "lost", label: "元の画面が分からなくなることがある", score: 0 },
        { id: "helped", label: "教えてもらえばできる", score: 1 },
        { id: "ok", label: "だいたい戻れる", score: 2 },
        { id: "quick", label: "すぐ行き来できる", score: 3 },
      ],
    },
    {
      id: "nav-tabs",
      dimension: "navigation",
      kind: "single",
      level: 2,
      title: "インターネットで、ページを2つ以上開いて見比べられますか？",
      help: "上や下に並ぶ「タブ」（開いているページの見出し）を使う操作です。",
      options: [
        { id: "unknown", label: "1つずつしか開いたことがない", score: 0 },
        { id: "guided", label: "やり方を教われば開ける", score: 1 },
        { id: "ok", label: "2〜3個なら開いて見比べられる", score: 2 },
        { id: "manage", label: "並べ替えや、いらないページを閉じるのもできる", score: 3 },
      ],
    },
  ],
  files: [
    {
      id: "files-photo",
      dimension: "files",
      kind: "single",
      level: 0,
      title: "自分で撮った写真を、あとから見つけられますか？",
      help: "写真アプリやアルバムから探す場面です。",
      options: [
        { id: "lost", label: "どこにあるか分からなくなる", score: 0 },
        { id: "helped", label: "一緒に探してもらえば見つかる", score: 1 },
        { id: "ok", label: "だいたい自分で見つけられる", score: 2 },
        { id: "organize", label: "アルバムに分けて整理している", score: 3 },
      ],
    },
    {
      id: "files-save",
      dimension: "files",
      kind: "single",
      level: 1,
      title: "インターネットから保存した書類（PDFなど）が、どこに入るか分かりますか？",
      help: "「ダウンロード」「ファイル」などの場所を思い浮かべてください。",
      options: [
        { id: "unknown", label: "どこに入ったか分からない", score: 0 },
        { id: "helped", label: "教えてもらえば開ける", score: 1 },
        { id: "ok", label: "保存された場所を開ける", score: 2 },
        { id: "manage", label: "名前を変えたり、別の場所へ移せる", score: 3 },
      ],
    },
    {
      id: "files-move",
      dimension: "files",
      kind: "single",
      level: 2,
      title: "スマホとパソコンの間で、写真やファイルを受け渡せますか？",
      help: "方法はメールでも、クラウドでも、線でつなぐのでも構いません。",
      options: [
        { id: "unknown", label: "やり方が分からない", score: 0 },
        { id: "helped", label: "決まったやり方なら、教わればできる", score: 1 },
        { id: "one", label: "1つのやり方なら自分でできる", score: 2 },
        { id: "choose", label: "場面に合わせてやり方を選べる", score: 3 },
      ],
    },
  ],
  safety: [
    {
      id: "safety-message",
      dimension: "safety",
      kind: "single",
      level: 0,
      title: "「料金が未払いです」というメールやSMSが届いたら、どうしますか？",
      help: "正解を当てる問題ではありません。ふだんの行動を選んでください。",
      options: [
        { id: "tap", label: "書いてあるリンクを押して、内容を確かめる", score: 0 },
        { id: "freeze", label: "どうしていいか分からず、そのままにする", score: 1 },
        { id: "ask", label: "家族や知り合いに見てもらう", score: 2 },
        { id: "official", label: "公式のアプリやサイトから、自分で確かめる", score: 3 },
      ],
    },
    {
      id: "safety-permission",
      dimension: "safety",
      kind: "single",
      level: 1,
      title: "アプリが「写真へのアクセスを許可しますか？」と聞いてきたら、どうしますか？",
      help: "スマホでよく出る確認画面です。",
      options: [
        { id: "always", label: "よく分からないので、いつも「許可」を押す", score: 0 },
        { id: "stop", label: "怖くて、そこで止めてしまう", score: 1 },
        { id: "think", label: "必要そうなときだけ許可する", score: 2 },
        { id: "review", label: "許可したあと、設定で見直すこともある", score: 3 },
      ],
    },
    {
      id: "safety-code",
      dimension: "safety",
      kind: "single",
      level: 2,
      title: "電話やメールで「確認コードを教えてください」と言われたら、どうしますか？",
      help: "相手が会社やサポートを名乗る場合も含みます。",
      options: [
        { id: "tell", label: "相手を信じて伝えると思う", score: 0 },
        { id: "unsure", label: "伝えていいのか判断できない", score: 1 },
        { id: "refuse", label: "コードは誰にも伝えない", score: 2 },
        { id: "verify", label: "伝えず、公式の窓口から自分で確認する", score: 3 },
      ],
    },
  ],
  recovery: [
    {
      id: "recovery-stuck",
      dimension: "recovery",
      kind: "single",
      level: 0,
      title: "押しても反応しない・画面が変わらないとき、どうしますか？",
      help: "うまくいかないときの、ふだんの行動を選んでください。",
      options: [
        { id: "stop", label: "こわくなって、そこでやめる", score: 0 },
        { id: "repeat", label: "同じところを何度も押してみる", score: 1 },
        { id: "retry", label: "少し待ってから、もう一度やってみる", score: 2 },
        { id: "restart", label: "アプリを閉じて開き直す、機器を再起動する", score: 3 },
      ],
    },
    {
      id: "recovery-error",
      dimension: "recovery",
      kind: "single",
      level: 1,
      title: "英語や難しい言葉のメッセージが出たとき、どうしますか？",
      help: "内容が分からなくても大丈夫です。",
      options: [
        { id: "close", label: "読まずに閉じる", score: 0 },
        { id: "ask", label: "誰かに見せて聞く", score: 1 },
        { id: "read", label: "書いてあることを読んで、次にすることを考える", score: 2 },
        { id: "search", label: "文章を書き写して、調べたり相談したりする", score: 3 },
      ],
    },
    {
      id: "recovery-search",
      dimension: "recovery",
      kind: "single",
      level: 2,
      title: "分からない操作を、自分で調べて解決できますか？",
      help: "検索でも、公式のヘルプでも、動画でも構いません。",
      options: [
        { id: "words", label: "何と調べればいいか迷う", score: 0 },
        { id: "guided", label: "調べる言葉を教われば探せる", score: 1 },
        { id: "basic", label: "基本的なことは自分で調べられる", score: 2 },
        { id: "compare", label: "いくつかの情報を見比べて解決できる", score: 3 },
      ],
    },
  ],
};

const chatgptUseQuestion: DigitalQuestion = {
  id: "chatgpt-use",
  dimension: "chatgpt",
  kind: "single",
  level: 0,
  title: "ChatGPTを使ったことはありますか？",
  help: "使ったことがなくても、このあとの手順どおりに進められます。",
  options: [
    { id: "new", label: "今日、初めて知った", score: 0 },
    { id: "name", label: "名前は知っているが、使ったことはない", score: 1 },
    { id: "some", label: "何回か使ったことがある", score: 2 },
    { id: "often", label: "ふだんから使っている", score: 3 },
  ],
};

const chatgptDeviceQuestion: DigitalQuestion = {
  id: "chatgpt-device",
  dimension: "chatgpt",
  kind: "single",
  level: 0,
  title: "ChatGPTは、どの機器で使う予定ですか？",
  help: "選んだ機器に合わせて、このあとの登録手順と貼り付け方をご案内します。",
  options: [
    { id: "iphone", label: "iPhone（アップルのスマートフォン）", score: 1, device: "smartphone" },
    { id: "android", label: "Android（iPhone以外のスマートフォン）", score: 1, device: "smartphone" },
    { id: "windows", label: "Windows のパソコン", score: 1, device: "pc" },
    { id: "mac", label: "Mac（アップルのパソコン）", score: 1, device: "pc" },
  ],
};

const chatgptFollowQuestion: DigitalQuestion = {
  id: "chatgpt-follow",
  dimension: "chatgpt",
  kind: "single",
  level: 1,
  title: "ChatGPTの答えが難しかったとき、どうしましたか？",
  help: "これからの説明の細かさを決めるために使います。",
  options: [
    { id: "give-up", label: "よく分からないまま、そのままにした", score: 0 },
    { id: "ask", label: "家族や知り合いに聞いた", score: 1 },
    { id: "simpler", label: "「もっと簡単に説明して」と頼んだ", score: 2 },
    { id: "detail", label: "画面の写真を見せたり、条件を足して聞き直した", score: 3 },
  ],
};

export const digitalQuestions: readonly DigitalQuestion[] = [
  deviceQuestion,
  wordsQuestion,
  stepsQuestion,
  ...slotQuestions.typing,
  ...slotQuestions.navigation,
  ...slotQuestions.files,
  ...slotQuestions.safety,
  ...slotQuestions.recovery,
  chatgptUseQuestion,
  chatgptDeviceQuestion,
  chatgptFollowQuestion,
];

const questionMap = new Map(digitalQuestions.map((question) => [question.id, question]));

export function getQuestion(questionId: string) {
  return questionMap.get(questionId);
}

export const digitalDimensionOrder: readonly DigitalDimension[] = [
  "words",
  "steps",
  "typing",
  "navigation",
  "files",
  "safety",
  "recovery",
  "chatgpt",
];

export const digitalDimensionLabels: Readonly<Record<DigitalDimension, string>> = {
  words: "デジタルの言葉",
  steps: "困ったときの進め方",
  typing: "文字入力・コピー",
  navigation: "画面の行き来",
  files: "写真・ファイル",
  safety: "あやしいものへの対応",
  recovery: "うまくいかないとき",
  chatgpt: "ChatGPTの使い方",
};

/* -------------------------------------------------- 回答から次の質問を選ぶ */

/** 選んだ言葉の数から、用語の分かりやすさを 0〜3 で見積もる */
export function scoreWordAnswer(optionIds: readonly string[]): AnswerScore {
  const known = optionIds.filter((id) => id !== "none").length;
  if (known === 0) return 0;
  if (known <= 2) return 1;
  if (known <= 5) return 2;
  return 3;
}

export function getDevice(answers: readonly DigitalAnswer[]): DigitalDevice {
  return answers.find((answer) => answer.questionId === "device-main")?.device ?? "rarely";
}

/** ChatGPTを使う機器（登録手順の初期表示に使う） */
export function getGuideDevice(answers: readonly DigitalAnswer[]): "pc" | "mobile" {
  const chosen = answers.find((answer) => answer.questionId === "chatgpt-device");
  if (chosen?.device === "pc") return "pc";
  if (chosen?.device === "smartphone") return "mobile";
  const device = getDevice(answers);
  return device === "pc" ? "pc" : "mobile";
}

export function getPasteDevice(answers: readonly DigitalAnswer[]): "iphone" | "android" | "windows" | "mac" {
  const chosen = answers.find((answer) => answer.questionId === "chatgpt-device")?.optionIds[0];
  if (chosen === "iphone" || chosen === "android" || chosen === "windows" || chosen === "mac") return chosen;
  return getDevice(answers) === "pc" ? "windows" : "iphone";
}

/** 今までの回答から、その人の理解度を 0〜3 で見積もる */
export function estimateLevel(answers: readonly DigitalAnswer[]): number {
  const scored = answers.filter((answer) => answer.dimension !== "device" && answer.questionId !== "chatgpt-device");
  if (scored.length === 0) return 1;
  const total = scored.reduce<number>((sum, answer) => sum + answer.score, 0);
  return total / scored.length;
}

function pickForLevel(candidates: readonly DigitalQuestion[], level: number) {
  const wanted = level < 1.1 ? 0 : level < 2.2 ? 1 : 2;
  return candidates.find((question) => question.level === wanted) ?? candidates[0];
}

const slotOrder = ["typing", "navigation", "files", "safety", "recovery"] as const;

export function getNextQuestion(answers: readonly DigitalAnswer[]): DigitalQuestion | null {
  const asked = new Set(answers.map((answer) => answer.questionId));
  if (!asked.has("device-main")) return deviceQuestion;
  if (!asked.has("words-known")) return wordsQuestion;
  if (!asked.has("steps-help")) return stepsQuestion;

  const level = estimateLevel(answers);
  const device = getDevice(answers);
  const answeredDimensions = new Set(answers.map((answer) => answer.dimension));

  for (const dimension of slotOrder) {
    if (answeredDimensions.has(dimension)) continue;
    // まだ操作に慣れていない人には、応用の質問を出さずに短く終える
    if (dimension === "recovery" && level < 0.8) continue;
    if (dimension === "files" && device === "rarely" && level < 0.8) continue;
    return pickForLevel(slotQuestions[dimension], level);
  }

  if (!asked.has("chatgpt-use")) return chatgptUseQuestion;
  const chatgptUse = answers.find((answer) => answer.questionId === "chatgpt-use");
  if (chatgptUse && chatgptUse.score <= 1) {
    return asked.has("chatgpt-device") ? null : chatgptDeviceQuestion;
  }
  return asked.has("chatgpt-follow") ? null : chatgptFollowQuestion;
}

/** 進み具合の表示に使う、想定の質問数 */
export function estimateTotalQuestions(answers: readonly DigitalAnswer[]): number {
  if (answers.length < 3) return 10;
  const level = estimateLevel(answers);
  const device = getDevice(answers);
  let slots = slotOrder.length;
  if (level < 0.8) slots -= 1;
  if (device === "rarely" && level < 0.8) slots -= 1;
  return 3 + slots + 2;
}

/* ------------------------------------------------------ 結果とカスタム指示 */

export interface PromptResult {
  readonly title: string;
  readonly summary: string;
  readonly prompt: string;
  readonly strengths: readonly string[];
  readonly support: readonly string[];
}

function band(value: number): 0 | 1 | 2 | 3 {
  if (value < 0.75) return 0;
  if (value < 1.65) return 1;
  if (value < 2.45) return 2;
  return 3;
}

function dimensionScore(answers: readonly DigitalAnswer[], dimension: DigitalDimension, fallback: number) {
  const values = answers.filter((answer) => answer.dimension === dimension && answer.questionId !== "chatgpt-device").map((answer) => answer.score);
  if (values.length === 0) return { average: fallback, answered: false };
  return { average: values.reduce<number>((sum, value) => sum + value, 0) / values.length, answered: true };
}

const strengthLabels: Readonly<Record<DigitalDimension, string>> = {
  words: "デジタルの言葉の意味がいくつか分かる",
  steps: "説明を見ながら自分で進められる",
  typing: "文字入力やコピーができる",
  navigation: "画面を行き来して元に戻れる",
  files: "写真やファイルを自分で扱える",
  safety: "あやしいものを確かめてから進められる",
  recovery: "うまくいかないときに立て直せる",
  chatgpt: "ChatGPTに聞き直しができる",
};

const supportLabels: Readonly<Record<DigitalDimension, readonly [string, string, string, string]>> = {
  words: ["専門用語を使わず、身近な言葉で説明してもらう", "専門用語には短い言い換えを付けてもらう", "略語や珍しい用語だけ補ってもらう", "用語はそのまま使ってもらう"],
  steps: ["一度に1つの操作だけ案内してもらう", "短い順番に区切って案内してもらう", "全体の流れを先に示してもらう", "要点だけ示してもらう"],
  typing: ["入力する場所・入れる文字・確定の仕方を分けて示してもらう", "入力する場所と確定の仕方を示してもらう", "変える部分だけ示してもらう", "入力例だけ示してもらう"],
  navigation: ["今どの画面にいるか、戻り方とセットで示してもらう", "画面の中の目印を示してもらう", "迷いやすいところだけ補ってもらう", "画面名だけ示してもらう"],
  files: ["保存する場所と名前をはっきり示してもらう", "保存した場所の開き方も示してもらう", "場所が変わるときだけ補ってもらう", "種類や共有範囲だけ確認してもらう"],
  safety: ["押す前に「押しても大丈夫か」を必ず添えてもらう", "迷ったときに止まる場所を示してもらう", "大事な確認だけ示してもらう", "重要な注意だけ示してもらう"],
  recovery: ["うまくいかないときの戻し方を、先に教えてもらう", "元に戻す方法と次の一手を示してもらう", "原因を順番に確かめる方法を示してもらう", "確認済みのことは省いてもらう"],
  chatgpt: ["ChatGPTの画面の日本語名と、聞き方の例を示してもらう", "押す場所と聞き方の例を示してもらう", "機能の名前を正確に示してもらう", "最短の手順だけ示してもらう"],
};

export function buildPromptResult(answers: readonly DigitalAnswer[]): PromptResult {
  const level = estimateLevel(answers);
  const overallBand = band(level);
  const device = getDevice(answers);
  const scores = Object.fromEntries(
    digitalDimensionOrder.map((dimension) => [dimension, dimensionScore(answers, dimension, level)]),
  ) as Record<DigitalDimension, { average: number; answered: boolean }>;

  const deviceLine: Record<DigitalDevice, string> = {
    smartphone: "私はふだんスマートフォンを使います。",
    pc: "私はふだんパソコンを使います。",
    both: "私はスマートフォンとパソコンの両方を使います。",
    rarely: "私はスマートフォンやパソコンの操作にこれから慣れる段階です。",
  };
  const titles = [
    "一つずつ、ゆっくり案内してもらうと分かるタイプ",
    "言葉を言い換えてもらうと分かるタイプ",
    "流れが分かれば自分で進められるタイプ",
    "要点だけで進められるタイプ",
  ];
  const summaries = [
    "「今どこを押すか」「押すとどうなるか」が分かると、安心して進められます。",
    "むずかしい言葉を短く言い換えてもらい、順番に区切ってもらうと分かりやすくなります。",
    "全体の流れと必要な手順があれば、自分で試しながら進められます。",
    "基本の操作には慣れているので、結論を先に伝えてもらうほうが分かりやすい状態です。",
  ];
  const levelLines = [
    "専門用語をなるべく使わず、一つずつ確かめながら教えてください。",
    "むずかしい言葉には短い言い換えを付け、順番を区切って教えてください。",
    "全体の流れを先に示し、必要な手順を教えてください。",
    "基本操作には慣れているので、要点を中心に教えてください。",
  ];
  const wordLines = [
    "専門用語は使わず、身近な言葉に置き換えてください（正式名称は必要なときだけ、かっこ書きで添えてください）",
    "専門用語を使うときは、初回だけ短い言い換えを付けてください",
    "一般的な用語はそのまま使い、略語や珍しい用語だけ短く補ってください",
    "一般的なIT用語はそのまま使ってください",
  ];
  const operationLines = [
    "操作は「今見えている画面」「押す場所の見た目と名前」「押したあとどうなるか」を一つずつ示してください",
    "操作は画面に表示されている名前を使い、順番に区切って示してください",
    "操作は全体の流れを先に示し、迷いやすいところだけ具体的に書いてください",
    "操作は最短の手順を中心に示してください",
  ];
  const practicalLines = [
    "コピー・貼り付け・保存などの基本操作も、手順を省かずに書いてください",
    "入力やファイルの操作では、対象と保存場所、終わったと分かる目印を示してください",
    "入力やファイルの操作では、間違えやすいところだけ確認点を添えてください",
    "入力やファイルの操作は要点だけで構いません",
  ];
  const safetyLines = [
    "お金・個人情報・削除に関わる操作の前には、「押しても大丈夫か」を必ず先に伝えてください。うまくいかないときは、元に戻す方法から教えてください",
    "安全に関わる場面では実行前の確認を促し、うまくいかないときは確かめる順番を示してください",
    "安全上とくに重要な場面だけ確認を促し、問題が起きたら原因の切り分け方を示してください",
    "重要な注意と、問題が起きたときの切り分けを簡潔に示してください",
  ];
  const chatgptLines = [
    "ChatGPT自体の操作を説明するときは、画面に出ている日本語のボタン名を使い、押す場所を一つずつ示してください",
    "ChatGPT自体の操作は、画面の日本語名と押す順番で示してください",
    "ChatGPT自体の操作は、機能名と必要な手順で示してください",
    "ChatGPT自体の操作は、機能名と最短の手順で示してください",
  ];

  const wordsBand = band(scores.words.average);
  const operationBand = band((scores.steps.average + scores.navigation.average) / 2);
  const practicalBand = band((scores.typing.average + scores.files.average) / 2);
  const safetyBand = band((scores.safety.average + scores.recovery.average) / 2);
  const chatgptBand = band(scores.chatgpt.average);

  const prompt = [
    "【デジタル操作の説明レベル】",
    `${deviceLine[device]}${levelLines[overallBand]}パソコン・スマートフォン・インターネット・アプリについての質問では、${wordLines[wordsBand]}。${operationLines[operationBand]}。${practicalLines[practicalBand]}。${safetyLines[safetyBand]}。${chatgptLines[chatgptBand]}。`,
    "画面の配置や操作の順番など、文章だけでは伝わりにくいと判断したときは、図や画像での説明もできると短く提案し、私が希望してから作ってください。説明の細かさは、質問のむずかしさ、危険度、私の反応に合わせて調整し、必要以上に細かく分けたり、内容を省きすぎたりしないでください。",
  ].join("\n");

  const answeredDimensions = digitalDimensionOrder.filter((dimension) => scores[dimension].answered);
  const strengths = answeredDimensions
    .filter((dimension) => scores[dimension].average >= 2)
    .sort((a, b) => scores[b].average - scores[a].average)
    .slice(0, 3)
    .map((dimension) => strengthLabels[dimension]);
  const support = [...answeredDimensions]
    .sort((a, b) => scores[a].average - scores[b].average)
    .slice(0, 3)
    .map((dimension) => supportLabels[dimension][band(scores[dimension].average)]);

  return {
    title: titles[overallBand],
    summary: summaries[overallBand],
    prompt,
    strengths: strengths.length ? strengths : ["分からないことを、そのままにせず確かめようとしている"],
    support,
  };
}
