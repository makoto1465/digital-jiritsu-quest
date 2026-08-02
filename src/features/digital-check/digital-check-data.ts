export type DigitalDimension =
  | "words"
  | "steps"
  | "navigation"
  | "typing"
  | "files"
  | "safety"
  | "recovery"
  | "chatgpt";

export type DigitalDevice = "smartphone" | "pc" | "both" | "rarely";
export type AnswerScore = 0 | 1 | 2 | 3;

export interface AnswerOption {
  readonly id: string;
  readonly label: string;
  readonly note?: string;
  readonly score: AnswerScore;
  readonly device?: DigitalDevice;
  readonly nextQuestionId?: string;
}

export interface DigitalQuestion {
  readonly id: string;
  readonly dimension: DigitalDimension | "device";
  readonly difficulty: AnswerScore;
  readonly title: string;
  readonly help: string;
  readonly options: readonly AnswerOption[];
}

export interface DigitalAnswer {
  readonly questionId: string;
  readonly optionId: string;
  readonly score: AnswerScore;
  readonly dimension: DigitalDimension | "device";
  readonly device?: DigitalDevice;
}

const confidenceOptions = (labels?: readonly [string, string, string, string]): readonly AnswerOption[] => [
  { id: "not-yet", label: labels?.[0] ?? "まだ分からない", score: 0 },
  { id: "with-help", label: labels?.[1] ?? "教えてもらえばできそう", score: 1 },
  { id: "mostly", label: labels?.[2] ?? "だいたいできる", score: 2 },
  { id: "comfortable", label: labels?.[3] ?? "自分でできる", score: 3 },
];

export const digitalQuestions: readonly DigitalQuestion[] = [
  {
    id: "device-main",
    dimension: "device",
    difficulty: 1,
    title: "ふだん、どの機器をいちばん使いますか？",
    help: "仕事ではなく、家で使うものでも大丈夫です。",
    options: [
      { id: "smartphone", label: "スマートフォンが中心", note: "iPhone・Android", score: 1, device: "smartphone", nextQuestionId: "navigation-app-switch" },
      { id: "pc", label: "パソコンが中心", note: "Windows・Mac", score: 2, device: "pc", nextQuestionId: "words-browser" },
      { id: "both", label: "どちらも使う", note: "スマホもパソコンも", score: 2, device: "both", nextQuestionId: "files-sync" },
      { id: "rarely", label: "どちらもあまり使わない", note: "これから慣れたい", score: 0, device: "rarely", nextQuestionId: "steps-follow" },
    ],
  },

  {
    id: "words-browser",
    dimension: "words",
    difficulty: 0,
    title: "「ブラウザ」と聞いて、何のことか思い浮かびますか？",
    help: "Chrome、Safari、Edgeなど、Webサイトを見るアプリのことです。",
    options: confidenceOptions(["初めて聞いた", "名前は聞いたことがある", "だいたい分かる", "人にも説明できる"]),
  },
  {
    id: "words-shortcuts",
    dimension: "words",
    difficulty: 1,
    title: "「URL」「アカウント」「クラウド」という言葉は分かりますか？",
    help: "全部分からなくても大丈夫です。いちばん近いものを選んでください。",
    options: confidenceOptions(["ほとんど分からない", "説明があれば分かる", "2つくらい分かる", "どれも分かる"]),
  },
  {
    id: "words-settings",
    dimension: "words",
    difficulty: 2,
    title: "「OS」「ストレージ」「二段階認証」という言葉は分かりますか？",
    help: "細かな定義まで言えなくても、使う場面が想像できれば大丈夫です。",
    options: confidenceOptions(["ほとんど分からない", "聞けば思い出せる", "意味はだいたい分かる", "違いも説明できる"]),
  },

  {
    id: "steps-follow",
    dimension: "steps",
    difficulty: 0,
    title: "画面を見ながら「ここを押す→次にここ」と案内されたら進められますか？",
    help: "ゆっくりで構いません。",
    options: confidenceOptions(["一緒にしてもらいたい", "細かな案内があればできる", "短い案内でできる", "案内なしでも試せる"]),
  },
  {
    id: "steps-menu",
    dimension: "steps",
    difficulty: 1,
    title: "説明に「設定を開いてください」とだけ書かれていたら、設定を探せますか？",
    help: "歯車のマークやプロフィール画像から探す場面を想像してください。",
    options: confidenceOptions(["どこから探すか分からない", "目印があれば探せる", "たぶん探せる", "自分で探して開ける"]),
  },
  {
    id: "steps-new-app",
    dimension: "steps",
    difficulty: 2,
    title: "初めて使うアプリでも、画面を見て操作を試せますか？",
    help: "失敗したら戻る・閉じることも含みます。",
    options: confidenceOptions(["触るのが少し怖い", "詳しい手順があれば試せる", "安全そうなら試せる", "自分で確かめながら進められる"]),
  },

  {
    id: "navigation-app-switch",
    dimension: "navigation",
    difficulty: 0,
    title: "開いているアプリを切り替えて、元の画面へ戻れますか？",
    help: "たとえば、ChatGPTから写真やブラウザを開き、またChatGPTへ戻る操作です。",
    options: confidenceOptions(["戻れなくなることがある", "教えてもらえば戻れる", "だいたい戻れる", "迷わず切り替えられる"]),
  },
  {
    id: "navigation-tabs",
    dimension: "navigation",
    difficulty: 1,
    title: "ブラウザで複数の「タブ」を開き、行き来できますか？",
    help: "ページ上部や下部に並ぶ、開いているページの見出しです。",
    options: confidenceOptions(["タブが何か分からない", "案内があればできる", "2〜3個ならできる", "整理や閉じる操作もできる"]),
  },
  {
    id: "navigation-window",
    dimension: "navigation",
    difficulty: 2,
    title: "画面が見つからないとき、最小化・戻る・履歴などを使い分けられますか？",
    help: "全部を使えなくても大丈夫です。",
    options: confidenceOptions(["違いが分からない", "目印があれば使える", "いくつか使い分けられる", "状況に合わせて使える"]),
  },

  {
    id: "typing-basic",
    dimension: "typing",
    difficulty: 0,
    title: "文字を入力し、間違えた文字を消して直せますか？",
    help: "スマホのキーボードでも、パソコンのキーボードでも構いません。",
    options: confidenceOptions(["入力にかなり時間がかかる", "短い文なら手伝いがあればできる", "短い文は自分で入力できる", "長い文の修正もできる"]),
  },
  {
    id: "typing-copy",
    dimension: "typing",
    difficulty: 1,
    title: "文章を選んで、コピーして貼り付けられますか？",
    help: "今回の結果をChatGPTへ登録するときにも使う操作です。",
    options: confidenceOptions(["まだしたことがない", "案内を見ながらならできる", "だいたいできる", "迷わずできる"]),
  },
  {
    id: "typing-form",
    dimension: "typing",
    difficulty: 2,
    title: "入力欄を選び、必要な部分だけ修正して保存できますか？",
    help: "設定画面や申込み画面を想像してください。",
    options: confidenceOptions(["入力欄を見つけにくい", "場所が分かればできる", "修正して保存できる", "複数の項目でも確認して進められる"]),
  },

  {
    id: "files-save",
    dimension: "files",
    difficulty: 0,
    title: "写真や書類を保存したあと、どこにあるか探せますか？",
    help: "「ダウンロード」「写真」「ファイル」などから探す操作です。",
    options: confidenceOptions(["保存した場所が分からなくなる", "一緒なら探せる", "だいたい探せる", "保存場所を選んで整理できる"]),
  },
  {
    id: "files-attach",
    dimension: "files",
    difficulty: 1,
    title: "写真やPDFを、メールやChatGPTに添付できますか？",
    help: "送る直前に、選んだファイルを確認するところまで考えてください。",
    options: confidenceOptions(["まだしたことがない", "案内があればできる", "よく使う場所ならできる", "種類や保存場所が違ってもできる"]),
  },
  {
    id: "files-sync",
    dimension: "files",
    difficulty: 2,
    title: "スマホとパソコンの間で、写真やファイルを受け渡せますか？",
    help: "クラウド、メール、共有機能など、方法は何でも構いません。",
    options: confidenceOptions(["方法が分からない", "決まった方法なら教わってできる", "1つの方法は使える", "状況で方法を選べる"]),
  },

  {
    id: "safety-message",
    dimension: "safety",
    difficulty: 0,
    title: "怪しいSMSやメールが来たとき、すぐにリンクを押さず確認できますか？",
    help: "正解を当てる問題ではなく、普段どうしているかを選んでください。",
    options: confidenceOptions(["本物かどうか判断しにくい", "誰かに聞けば確認できる", "送信元などを確認できる", "別の公式手段でも確かめられる"]),
  },
  {
    id: "safety-permission",
    dimension: "safety",
    difficulty: 1,
    title: "アプリが写真・マイク・位置情報を求めたとき、許可するか考えられますか？",
    help: "必要な理由が分からないときの対応を想像してください。",
    options: confidenceOptions(["いつも許可してしまう", "説明があれば考えられる", "必要なものだけ許可できる", "後から設定を見直すこともできる"]),
  },
  {
    id: "safety-account",
    dimension: "safety",
    difficulty: 2,
    title: "パスワードや確認コードを、誰に見せてよいか判断できますか？",
    help: "相手が会社やサポートを名乗る場合も含みます。",
    options: confidenceOptions(["判断に自信がない", "注意点を教われば判断できる", "基本的には見せないと分かる", "詐欺の可能性も含めて確認できる"]),
  },

  {
    id: "recovery-error",
    dimension: "recovery",
    difficulty: 0,
    title: "「エラー」と出たとき、画面の文章を読んで次の行動を考えられますか？",
    help: "意味が分からないときに、文章を残す・調べることも含みます。",
    options: confidenceOptions(["すぐ不安になって止まる", "一緒に読めば進める", "表示を読んで試せる", "文章を検索して対処できる"]),
  },
  {
    id: "recovery-wifi",
    dimension: "recovery",
    difficulty: 1,
    title: "ネットにつながらないとき、Wi-Fiや機内モードなどを確認できますか？",
    help: "全部できなくても大丈夫です。",
    options: confidenceOptions(["何を確認するか分からない", "順番の案内があればできる", "基本の確認はできる", "原因を切り分けて試せる"]),
  },
  {
    id: "recovery-search",
    dimension: "recovery",
    difficulty: 2,
    title: "分からない操作を、自分で検索して解決できますか？",
    help: "機器名や画面に出た言葉を検索に入れる操作です。",
    options: confidenceOptions(["何と検索するか迷う", "検索語を教われば探せる", "基本的なことは探せる", "情報を比べて解決できる"]),
  },

  {
    id: "chatgpt-ask",
    dimension: "chatgpt",
    difficulty: 0,
    title: "ChatGPTに、困っていることを文章や音声で伝えられますか？",
    help: "きれいな文章でなくても構いません。",
    options: confidenceOptions(["何と聞くか迷う", "例があれば聞ける", "普段から質問できる", "状況を足して聞き直せる"]),
  },
  {
    id: "chatgpt-followup",
    dimension: "chatgpt",
    difficulty: 1,
    title: "ChatGPTの説明が難しいとき、「もっと簡単に」と頼めますか？",
    help: "追加で質問したり、画面の写真を見せたりする方法も含みます。",
    options: confidenceOptions(["そのまま諦めることが多い", "言い方が分かれば頼める", "聞き直せる", "必要な情報を追加して調整できる"]),
  },
  {
    id: "chatgpt-settings",
    dimension: "chatgpt",
    difficulty: 2,
    title: "ChatGPTの設定やカスタム指示を開いたことがありますか？",
    help: "今日初めて知った場合は「まだ」で大丈夫です。",
    options: confidenceOptions(["まだ開いたことがない", "案内を見れば開けそう", "設定を見たことがある", "自分で変更・保存できる"]),
  },
] as const;

export const digitalDimensionOrder: readonly DigitalDimension[] = [
  "words",
  "steps",
  "navigation",
  "typing",
  "files",
  "safety",
  "recovery",
  "chatgpt",
];

export const digitalDimensionLabels: Readonly<Record<DigitalDimension, string>> = {
  words: "デジタル用語",
  steps: "手順の受け取り方",
  navigation: "画面やアプリの移動",
  typing: "文字入力・コピー",
  files: "写真・ファイル",
  safety: "安全な確認",
  recovery: "困ったときの対処",
  chatgpt: "ChatGPTの使い方",
};

const questionMap = new Map(digitalQuestions.map((question) => [question.id, question]));

export function getQuestion(questionId: string) {
  return questionMap.get(questionId);
}

export function getDevice(answers: readonly DigitalAnswer[]): DigitalDevice {
  return answers.find((answer) => answer.dimension === "device")?.device ?? "rarely";
}

export function getDimensionScores(answers: readonly DigitalAnswer[]) {
  return Object.fromEntries(digitalDimensionOrder.map((dimension) => {
    const values = answers.filter((answer) => answer.dimension === dimension).map((answer) => answer.score);
    const average = values.length ? values.reduce<number>((sum, value) => sum + value, 0) / values.length : 1;
    return [dimension, { average, count: values.length }];
  })) as Record<DigitalDimension, { average: number; count: number }>;
}

export function getNextQuestion(answers: readonly DigitalAnswer[]): DigitalQuestion | null {
  if (answers.length === 0) return getQuestion("device-main") ?? null;
  if (answers.length >= 11) return null;

  const lastAnswer = answers[answers.length - 1];
  const lastQuestion = getQuestion(lastAnswer.questionId);
  const selectedOption = lastQuestion?.options.find((option) => option.id === lastAnswer.optionId);
  if (answers.length === 1 && selectedOption?.nextQuestionId) {
    return getQuestion(selectedOption.nextQuestionId) ?? null;
  }

  const scores = getDimensionScores(answers);
  const uncovered = digitalDimensionOrder.filter((dimension) => scores[dimension].count === 0);
  if (uncovered.length === 0 && answers.length >= 9) {
    const uncertain = digitalDimensionOrder
      .filter((dimension) => scores[dimension].average < 2)
      .sort((a, b) => scores[a].average - scores[b].average);
    if (uncertain.length === 0 || answers.length >= Math.min(11, 9 + uncertain.length)) return null;
  }

  const targetDimension = (uncovered[0] ?? digitalDimensionOrder
    .filter((dimension) => scores[dimension].count < 2)
    .sort((a, b) => scores[a].average - scores[b].average)[0]) ?? "steps";
  const asked = new Set(answers.map((answer) => answer.questionId));
  const targetScore = scores[targetDimension].average;
  const candidates = digitalQuestions
    .filter((question) => question.dimension === targetDimension && !asked.has(question.id))
    .sort((a, b) => Math.abs(a.difficulty - targetScore) - Math.abs(b.difficulty - targetScore));

  return candidates[0] ?? null;
}

export interface PromptResult {
  readonly title: string;
  readonly summary: string;
  readonly prompt: string;
  readonly strengths: readonly string[];
  readonly support: readonly string[];
}

function band(value: number) {
  if (value < 0.75) return 0;
  if (value < 1.65) return 1;
  if (value < 2.45) return 2;
  return 3;
}

const strengthLabels: Readonly<Record<DigitalDimension, string>> = {
  words: "デジタル用語を理解して使える",
  steps: "案内を手掛かりに操作を進められる",
  navigation: "画面やアプリを行き来できる",
  typing: "文字入力やコピーを使える",
  files: "写真やファイルを扱える",
  safety: "安全を確かめてから進められる",
  recovery: "困ったときに確認して立て直せる",
  chatgpt: "ChatGPTへ聞き直しや設定ができる",
};

const supportLabels: Readonly<Record<DigitalDimension, readonly [string, string, string, string]>> = {
  words: ["用語を日常の言葉に置き換える", "用語へ短い意味を添える", "略語だけ短く補う", "珍しい用語だけ補う"],
  steps: ["一度に一つの操作だけ示す", "短い順番で示す", "全体像のあとに要点を示す", "最短手順を中心に示す"],
  navigation: ["現在地と戻り方をセットで示す", "画面上の目印を示す", "迷いやすい分岐だけ補う", "表示が違う場合だけ代替経路を示す"],
  typing: ["入力欄・入力文・保存を分けて示す", "入力対象と確定操作を示す", "変更箇所を明確にする", "入力例だけ簡潔に示す"],
  files: ["保存場所とファイル名を明示する", "選んだファイルの確認を促す", "保存場所が変わる場合だけ補う", "形式や共有範囲だけ注意する"],
  safety: ["実行前に安全確認を入れる", "迷ったときに止める場所を示す", "重要な確認点を簡潔に示す", "重大な注意だけ示す"],
  recovery: ["エラー時の次の一手を一つずつ示す", "戻し方と次の一手を示す", "原因を順に切り分ける", "確認済みの操作を重複させない"],
  chatgpt: ["日本語の画面名と質問例を示す", "押す場所と質問例を示す", "設定名を正確に示す", "機能名と最短手順を示す"],
};

export function buildPromptResult(answers: readonly DigitalAnswer[]): PromptResult {
  const scores = getDimensionScores(answers);
  const average = digitalDimensionOrder.reduce((sum, dimension) => sum + scores[dimension].average, 0) / digitalDimensionOrder.length;
  const overallBand = band(average);
  const device = getDevice(answers);
  const deviceLine: Record<DigitalDevice, string> = {
    smartphone: "私は主にスマートフォンを使います。",
    pc: "私は主にパソコンを使います。",
    both: "私はスマートフォンとパソコンの両方を使います。",
    rarely: "私はデジタル機器の操作にこれから慣れたい段階です。",
  };
  const titles = ["ひとつずつ案内が合うタイプ", "基本を確かめながら進むタイプ", "要点と手順で進めるタイプ", "要点中心で進めるタイプ"];
  const summaries = [
    "見える場所と次の一手が分かると、安心して操作を進められます。",
    "用語を短く言い換え、順番を区切ると理解しやすい状態です。",
    "全体像と必要な手順があれば、自分で試しながら進められます。",
    "基本操作には慣れています。結論を先にし、珍しい部分だけ補足すると効率的です。",
  ];
  const strengths = digitalDimensionOrder
    .filter((dimension) => scores[dimension].average >= 2)
    .sort((a, b) => scores[b].average - scores[a].average)
    .slice(0, 3)
    .map((dimension) => strengthLabels[dimension]);
  const support = [...digitalDimensionOrder]
    .sort((a, b) => scores[a].average - scores[b].average)
    .slice(0, 3)
    .map((dimension) => supportLabels[dimension][band(scores[dimension].average)]);
  const levelLines = [
    "デジタル操作は、基本から一緒に確かめると理解しやすいです。",
    "デジタル操作は、用語と手順を短く補うと理解しやすいです。",
    "デジタル操作は、全体像と必要な手順があれば自分で進められます。",
    "デジタル操作には慣れているため、要点中心で理解できます。",
  ];
  const wordLines = [
    "専門用語は身近な言葉に置き換え、必要なら正式名称を後から添えてください",
    "専門用語には最初だけ短い意味を添えてください",
    "一般的な用語は使い、略語や珍しい用語だけ短く補ってください",
    "一般的なIT用語はそのまま使い、珍しい用語だけ補ってください",
  ];
  const operationLines = [
    "操作は現在の画面、押す場所、その後に見える状態が分かる粒度で案内してください",
    "操作は画面上の表示名と順番が分かるように案内してください",
    "操作は全体像を先に示し、迷いやすい部分だけ具体化してください",
    "操作は最短経路を中心にし、表示が異なる場合だけ代替経路を補ってください",
  ];
  const practicalLines = [
    "入力やファイル操作では、対象・保存場所・完了状態を明確にしてください",
    "入力やファイル操作では、対象と保存・送信前の確認点を示してください",
    "入力やファイル操作では、対象を取り違えやすい場面だけ確認点を示してください",
    "入力やファイル操作は要点中心で構いません",
  ];
  const safetyLines = [
    "安全やプライバシーに関わる場面では実行前の確認を優先し、問題が起きたときは安全に戻す方法と次の一手を示してください",
    "安全やプライバシーに関わる場面では実行前の確認を促し、問題が起きたときは原因の確認と次の一手を示してください",
    "安全上重要な場面だけ実行前の確認を示し、問題時は原因を切り分けてください",
    "重要な安全上の注意と、問題時の切り分けを簡潔に示してください",
  ];
  const wordsBand = band(scores.words.average);
  const operationBand = band((scores.steps.average + scores.navigation.average) / 2);
  const practicalBand = band((scores.typing.average + scores.files.average) / 2);
  const safetyBand = band((scores.safety.average + scores.recovery.average) / 2);
  const chatgptBand = band(scores.chatgpt.average);
  const chatgptLine = chatgptBand <= 1
    ? "ChatGPT自体の操作では、日本語の画面名を使って案内してください。"
    : "ChatGPT自体の操作では、機能名と必要な手順を正確に示してください。";
  const prompt = [
    "【デジタル操作の説明レベル】",
    `${deviceLine[device]}${levelLines[overallBand]}PC・スマートフォン・インターネット・アプリに関する質問では、${wordLines[wordsBand]}。${operationLines[operationBand]}。${practicalLines[practicalBand]}。${safetyLines[safetyBand]}。${chatgptLine}`,
    "画面配置や操作順など、文章だけでは理解しにくいと判断した場合は、画像生成による説明もできると短く提案し、私が希望してから作ってください。説明の詳しさは、質問の難しさ、危険度、私の反応に応じて柔軟に調整し、必要以上に細分化したり専門性を落としたりしないでください。",
  ].join("\n");

  return {
    title: titles[overallBand],
    summary: summaries[overallBand],
    prompt,
    strengths: strengths.length ? strengths : ["分からないことを確認しながら進めようとしている"],
    support,
  };
}
