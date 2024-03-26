export const getWelcomeList = (t) => [
  {
    text: t["welcome_text_1"],
    source: "T-brain",
    autoNext: true,
    id: 1,
  },
  {
    text: t["welcome_text_2"],
    source: "T-brain",
    autoNext: true,
    id: 2,
  },
  {
    text: t["welcome_text_3"],
    source: "T-brain",
    autoNext: true,
    highlightWordList: [t["welcome_text_3_1"], t["welcome_text_3_2"]],
    id: 3,
  },
  {
    text: t["welcome_text_4"],
    source: "T-brain",
    autoNext: true,
    id: 4,
  },
  {
    text: t["welcome_text_5"],
    source: "T-brain",
    autoNext: true,
    id: 5,
  },
  {
    taskText: t["welcome_taskText_6"],
    autoNext: false,
    type: "taskStart",
    startBtnShow: true,
    source: "T-brain",
    id: 6,
  },
  {
    source: "T-brain",
    type: "task",
    taskName: t['FirstTask'],
    autoNext: true,
    title: t["AddCryptocurrency"],
    canSkip: false,
    searchType: 'coin',
    finish: false,
    desc: t["welcome_desc_7"],
    highlightWordList: [t["welcome_desc_7_1"]],
    id: 7,
  },
  {
    text: t["welcome_text_8"],
    autoNext: false,
    source: "T-brain",
    needPushHotCoin: true,
    highlightWordList: [t["welcome_text_8_1"], t["welcome_text_8_2"]],
    id: 8,
  },
  {
    text: t["welcome_text_9"],
    autoNext: true,
    source: "T-brain",
    id: 9,
  },
  {
    taskText: t["welcome_taskText_10"],
    type: "taskStart",
    autoNext: false,
    startBtnShow: true,
    source: "T-brain",
    id: 10,
  },
  {
    source: "T-brain",
    type: "task",
    taskName: t['SecondTask'],
    autoNext: true,
    title: t["addMonitoring_text_1"],
    searchType: 'monitor',
    canSkip: true,
    finish: false,
    desc: t["welcome_desc_11"],
    id: 11,
  },
  {
    text: t["welcome_text_12"],
    source: "T-brain",
    autoNext: false,
    needPushHotMonitor: true,
    id: 12,
  },
  {
    text: t["welcome_text_13"],
    source: "T-brain",
    autoNext: true,
    id: 13,
  },
  {
    text: t["welcome_text_14"],
    source: "T-brain",
    autoNext: true,
    id: 14,
  },
  {
    text: t["welcome_text_16"],
    source: "T-brain",
    autoNext: true,
    id: 16,
  },
  {
    text: t["welcome_text_17"],
    source: "T-brain",
    autoNext: true,
    id: 17,
  },
  {
    text: t["welcome_text_18"],
    source: "T-brain",
    autoNext: true,
    id: 18,
  },
  {
    taskText: t["welcome_taskText_15"],
    type: "taskFinish",
    startBtnShow: true,
    source: "T-brain",
    autoNext: false,
    id: 19,
  },
  {
    text: t["Three"],
    source: "T-brain",
    autoNext: true,
    sleep: 1000,
    id: 21,
  },
  {
    text: t["Two"],
    source: "T-brain",
    autoNext: true,
    sleep: 1000,
    id: 22,
  },
  {
    text: t["One"],
    source: "T-brain",
    autoNext: true,
    sleep: 1000,
    id: 23,
  },
  {
    text: t["Go"],
    source: "T-brain",
    autoNext: false,
    sleep: 1000,
    over: true,
    id: 24,
  },
]
