import {
  initialSimulatorState,
  type BrowserArticle,
  type BrowserView,
  type SimulatorApp,
  type SimulatorScenario,
  type SimulatorState,
} from "./types";

const genericArticle: BrowserArticle = {
  eyebrow: "練習ページ",
  title: "まちの交流会",
  paragraphs: [
    "開始は午後2時。受付は15分前からです。",
    "知らないページでは、見出しと大きな文字から読むと見つけやすくなります。",
  ],
  copyText: "交流会は午後2時開始です。",
};

const defaultScenario: SimulatorScenario = {
  id: "free-play",
  initialApp: "home",
  homeCopyText: "受付は2階です",
  notesSourceText: "待ち合わせは午後2時、中央ひろばです。",
  browser: {
    prompt: "例：イベントの時間",
    expectedTerms: [],
    resultTitle: "まちの交流会｜時間と場所",
    resultSummary: "必要な情報がまとまっています",
    primaryArticle: genericArticle,
    secondaryArticle: {
      eyebrow: "あとで読む",
      title: "ブラウザ練習のヒント",
      paragraphs: ["タブを使うと、ページを閉じずに見比べられます。"],
    },
    tabLabels: ["調べもの", "あとで読む"],
    featuredResult: true,
  },
  files: [
    { name: "交流会のお知らせ.pdf", description: "PDF資料" },
    { name: "練習写真.jpg", description: "写真" },
    { name: "買い物メモ.txt", description: "メモ" },
  ],
  moveTarget: "あとで見る",
  error: {
    title: "保存ボタンが見つかりません",
    message: "画面が狭いときは、下に続いていることがあります。",
  },
  help: {
    prompt: "例：ログイン できない",
    expectedTerms: [],
    resultTitle: "まず確認すること",
    resultSteps: [
      "入力欄に余分な空白がないか確認する",
      "大文字と小文字が同じか確認する",
      "解決しなければ再設定を使う",
    ],
    questionText:
      "やりたいこと：ファイルを開きたい。表示：エラーが出た。試したこと：ヘルプを検索した。",
  },
};

function scenario(
  stageId: string,
  overrides: Partial<Omit<SimulatorScenario, "id" | "stageId">>,
): SimulatorScenario {
  return {
    ...defaultScenario,
    ...overrides,
    id: stageId,
    stageId,
    browser: { ...defaultScenario.browser, ...overrides.browser },
    error: { ...defaultScenario.error, ...overrides.error },
    help: { ...defaultScenario.help, ...overrides.help },
    files: overrides.files ?? defaultScenario.files,
  };
}

export const simulatorScenarios: Record<string, SimulatorScenario> = {
  "w1-pc-copy-paste": scenario("w1-pc-copy-paste", {
    notesSourceText: "集合は10時です",
    homeCopyText: "集合は10時です",
  }),
  "w1-mobile-copy-paste": scenario("w1-mobile-copy-paste", {
    homeCopyText: "受付は2階です",
    notesSourceText: "受付は2階です",
  }),
  "w2-pc-find-settings": scenario("w2-pc-find-settings", {}),
  "w2-mobile-more-menu": scenario("w2-mobile-more-menu", {
    initialApp: "browser",
    initialBrowserView: "article",
    browser: {
      ...defaultScenario.browser,
      tabLabels: ["地域ニュース", "あとで読む"],
      primaryArticle: {
        eyebrow: "読みやすさ練習の記事",
        title: "地域センターからのお知らせ",
        paragraphs: [
          "この記事の文字を大きくして、読みやすい表示へ変えてみましょう。",
          "右上の三点メニューが設定への入口です。",
        ],
      },
    },
  }),
  "w3-pc-search-tabs": scenario("w3-pc-search-tabs", {
    browser: {
      ...defaultScenario.browser,
      prompt: "さくら公園 開園時間",
      expectedTerms: ["さくら公園", "開園時間"],
      resultTitle: "さくら公園 公式案内",
      resultSummary: "現在の開園時間が掲載されています",
      tabLabels: ["公式案内", "去年の案内"],
      featuredResult: false,
      primaryArticle: {
        eyebrow: "今年の公式案内",
        title: "さくら公園の開園時間",
        paragraphs: ["開園時間は午前9時から午後5時です。", "更新日：今年4月1日"],
      },
      secondaryArticle: {
        eyebrow: "去年のお知らせ",
        title: "昨年のさくら公園 開園時間",
        paragraphs: ["昨年は午前10時から午後4時でした。", "掲載日：昨年4月1日"],
      },
    },
  }),
  "w3-mobile-search-back": scenario("w3-mobile-search-back", {
    browser: {
      ...defaultScenario.browser,
      prompt: "市民センター 休館日",
      expectedTerms: ["市民センター", "休館日"],
      resultTitle: "市民センター公式案内",
      resultSummary: "開館日と休館日を確認できます",
      featuredResult: false,
      primaryArticle: {
        eyebrow: "公式案内",
        title: "市民センターの休館日",
        paragraphs: ["休館日は毎週月曜日です。", "月曜日が祝日の場合は翌日が休館です。"],
      },
    },
  }),
  "w4-pc-password-recovery": scenario("w4-pc-password-recovery", {
    help: {
      ...defaultScenario.help,
      resultTitle: "パスワード再設定",
      resultSteps: ["再設定を開始する", "練習メールの認証コードを確認する"],
    },
  }),
  "w4-mobile-switch-account": scenario("w4-mobile-switch-account", {}),
  "w5-pc-download-attach": scenario("w5-pc-download-attach", {
    browser: {
      ...defaultScenario.browser,
      prompt: "参加案内",
      expectedTerms: [],
      resultTitle: "参加案内.pdf を受け取る",
      resultSummary: "開くと練習用ダウンロードに保存されます",
      featuredResult: true,
      primaryArticle: {
        eyebrow: "ダウンロード完了",
        title: "参加案内.pdf",
        paragraphs: ["練習用の『ダウンロード』フォルダへ保存しました。"],
      },
    },
    files: [
      { name: "参加案内.pdf", description: "今回添付する資料", isTarget: true },
      { name: "去年の参加案内.pdf", description: "古い資料" },
      { name: "練習写真.jpg", description: "写真" },
    ],
    moveTarget: "提出用",
  }),
  "w5-mobile-share-attach": scenario("w5-mobile-share-attach", {
    files: [
      { name: "公園の地図.jpg", description: "今回共有する写真", isTarget: true },
      { name: "練習写真.jpg", description: "別の写真" },
      { name: "買い物メモ.txt", description: "メモ" },
    ],
    moveTarget: "写真",
  }),
  "w6-pc-hidden-button": scenario("w6-pc-hidden-button", {
    error: {
      title: "保存ボタンが見つかりません",
      message: "画面が狭いときは、下に続いていることがあります。",
    },
    help: {
      ...defaultScenario.help,
      prompt: "保存ボタン 見つからない",
      expectedTerms: ["保存", "見つからない"],
      resultTitle: "保存ボタンが見えないとき",
      resultSteps: [
        "案内が重なっていれば閉じる",
        "画面を下へスクロールする",
        "戻るで保存画面を確認する",
      ],
    },
  }),
  "w6-mobile-ask-for-help": scenario("w6-mobile-ask-for-help", {
    error: {
      code: "E-204",
      title: "ファイルを開けませんでした",
      message: "ファイル形式を確認してください。",
    },
    help: {
      ...defaultScenario.help,
      prompt: "E-204 ファイル 開けない",
      expectedTerms: ["E-204", "ファイル"],
      resultTitle: "E-204を解決するための確認",
      resultSteps: ["ファイル名を確認する", "別の表示方法を試す"],
      questionText:
        "やりたいこと：PDFファイルを開きたい。表示：E-204 ファイルを開けませんでした。試したこと：ヘルプでE-204を検索した。",
    },
  }),
  "w7-pc-independent-file": scenario("w7-pc-independent-file", {
    browser: {
      ...defaultScenario.browser,
      prompt: "防災案内 PDF",
      expectedTerms: ["防災案内"],
      resultTitle: "防災案内.pdf",
      resultSummary: "地域の防災資料です",
      featuredResult: false,
      primaryArticle: {
        eyebrow: "公式資料",
        title: "防災案内.pdf",
        paragraphs: ["練習用のダウンロードフォルダへ保存しました。"],
      },
    },
    files: [
      { name: "防災案内.pdf", description: "今回整理する資料", isTarget: true },
      { name: "去年の防災案内.pdf", description: "古い資料" },
      { name: "買い物メモ.txt", description: "メモ" },
    ],
    moveTarget: "あとで読む",
  }),
  "w7-mobile-independent-research": scenario("w7-mobile-independent-research", {
    browser: {
      ...defaultScenario.browser,
      prompt: "星空観察会 開始時刻",
      expectedTerms: ["星空観察会"],
      resultTitle: "星空観察会 公式案内",
      resultSummary: "開催日時を確認できます",
      featuredResult: false,
      primaryArticle: {
        eyebrow: "今年の公式案内",
        title: "星空観察会",
        paragraphs: ["開始時刻は午後7時です。", "受付は午後6時45分からです。"],
        copyText: "星空観察会は午後7時開始です。",
      },
    },
    notesSourceText: "星空観察会は午後7時開始です。",
  }),
};

export function getSimulatorScenario(stageId?: string): SimulatorScenario {
  return (stageId && simulatorScenarios[stageId]) || defaultScenario;
}

export function createInitialSimulatorState(scenarioData: SimulatorScenario): SimulatorState {
  const view = scenarioData.initialBrowserView ?? "start";
  return {
    ...initialSimulatorState,
    activeApp: scenarioData.initialApp,
    browserSearched: view !== "start",
    browserResultOpen: view === "article",
    browserSearchStatus: view === "start" ? "idle" : "found",
    browserHistory: [],
  };
}

export function currentBrowserView(state: SimulatorState): BrowserView {
  if (state.browserResultOpen) return "article";
  if (state.browserSearched) return "results";
  return "start";
}

export function applyBrowserView(state: SimulatorState, view: BrowserView): SimulatorState {
  return {
    ...state,
    browserSearched: view !== "start",
    browserResultOpen: view === "article",
    browserSearchStatus: view === "start" ? "idle" : "found",
  };
}

export function openSimulatorApp(state: SimulatorState, app: SimulatorApp): SimulatorState {
  const previousApp = state.activeApp === "home" || state.activeApp === app
    ? state.previousApp
    : state.activeApp;
  return {
    ...state,
    activeApp: app,
    previousApp,
    moreMenuOpen: false,
    shareChooserOpen: false,
    authCodeViewed: app === "mail" && state.passwordResetStarted
      ? true
      : state.authCodeViewed,
  };
}

export function goBackSimulator(state: SimulatorState): SimulatorState {
  if (state.activeApp === "browser" && state.browserHistory.length > 0) {
    const previousView = state.browserHistory.at(-1) ?? "start";
    return applyBrowserView(
      { ...state, browserHistory: state.browserHistory.slice(0, -1) },
      previousView,
    );
  }
  if (state.previousApp) {
    return {
      ...state,
      activeApp: state.previousApp,
      previousApp: null,
      moreMenuOpen: false,
      shareChooserOpen: false,
    };
  }
  return {
    ...state,
    activeApp: "home",
    moreMenuOpen: false,
    shareChooserOpen: false,
  };
}

export function normalizedText(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("ja-JP");
}

export function matchesExpectedTerms(value: string, expectedTerms: string[]): boolean {
  const normalized = normalizedText(value);
  if (!normalized) return false;
  return expectedTerms.length === 0
    || expectedTerms.every((term) => normalized.includes(normalizedText(term)));
}

export function isTargetFile(scenarioData: SimulatorScenario, fileName: string): boolean {
  const explicitTargets = scenarioData.files.filter((file) => file.isTarget);
  return explicitTargets.length === 0 || explicitTargets.some((file) => file.name === fileName);
}

export function appLabel(app: SimulatorApp): string {
  return {
    home: "ホーム",
    browser: "ブラウザ",
    settings: "設定",
    files: "ファイル",
    mail: "メール",
    help: "ヘルプ",
    notes: "メモ",
    photos: "写真",
    calendar: "予定",
    chat: "チャット",
  }[app];
}
