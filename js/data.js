// ========== 模拟数据 ==========
const MockData = {
  // 患者端
  patient: {
    user: { name: '王女士', avatar: '王', equity: { total: 3, used: 1 } },
    weather: { city: '北京', text: '明日有雨', temp: '18°', icon: '🌧', tip: '明日就诊有雨，记得带伞' },
    orders: [
      { id: 'O20260707', time: '明日 08:30', title: '协和医院 - 心内科复诊', escort: '李敏', status: '已接单', statusType: 'done' },
      { id: 'O20260705', time: '07-05 14:00', title: '同仁医院 - 眼科检查', escort: '张芳', status: '已完成', statusType: 'done' },
      { id: 'O20260628', time: '06-28 09:00', title: '协和医院 - 取药', escort: '李敏', status: '已完成', statusType: 'done' },
    ],
    services: [
      { name: '立即陪诊', sub: '4小时/全程', icon: '🩺', color: '#FFE6D1' },
      { name: '代办跑腿', sub: '代取药/问诊', icon: '🏃', color: '#E8F4FD' },
      { name: '我的权益卡', sub: '3次卡', icon: '💳', color: '#FFF6E8' },
    ],
    // 陪诊中
    inService: {
      escort: { name: '李敏', avatar: '李', phone: '138****8888', pos: '60%,42%' },
      hospital: '北京协和医院',
      steps: [
        { name: '已到达医院', done: true },
        { name: '挂号签到', done: true },
        { name: '排队候诊', done: true, active: true },
        { name: '医生问诊', done: false },
        { name: '缴费取药', done: false },
      ],
      board: [
        { label: '当前阶段', value: '排队候诊' },
        { label: '前面排队', value: '3 人' },
        { label: '预计剩余', value: '约 25 分钟' },
        { label: '陪诊师位置', value: '心内科门诊 3F' },
      ],
    },
    // 评价页
    review: {
      report: [
        { step: '取号签到', time: '08:35', dur: '耗时 2 分钟' },
        { step: '排队候诊', time: '08:40', dur: '耗时 28 分钟' },
        { step: '医生问诊', time: '09:08', dur: '耗时 15 分钟' },
        { step: '缴费', time: '09:25', dur: '耗时 5 分钟' },
        { step: '取药完成', time: '09:32', dur: '耗时 7 分钟' },
      ],
      rating: { pro: 5, warm: 5, time: 4 },
    },
  },

  // 陪诊师端
  escort: {
    user: { name: '李敏', avatar: '李', todayIncome: 486, rank: 2, rankLabel: '今日温暖之星' },
    orderPool: [
      {
        id: 'P001', patient: '张先生', gender: '男', age: 68,
        hospital: '协和医院', dept: '心内科', time: '明日 08:30',
        type: '老人陪诊', tags: ['需轮椅', '高血压史', '耳背'],
        match: 92, distance: '1.2km',
      },
      {
        id: 'P002', patient: '陈女士', gender: '女', age: 35,
        hospital: '同仁医院', dept: '眼科', time: '明日 14:00',
        type: '全程陪诊', tags: ['儿童陪同', '近视复查'],
        match: 85, distance: '3.5km',
      },
      {
        id: 'P003', patient: '王先生', gender: '男', age: 52,
        hospital: '北大医院', dept: '消化内科', time: '后天 09:00',
        type: '代问诊', tags: ['胃病史'],
        match: 78, distance: '5.8km',
      },
    ],
    // 陪诊中辅助
    inService: {
      patient: { name: '张先生', age: 68, tags: ['高血压', '耳背'] },
      hospital: '协和医院 心内科 3F',
      path: [
        { spot: '当前位置', pos: '20%,70%', label: '门诊大厅' },
        { spot: '途经', pos: '45%,50%', label: '电梯' },
        { spot: '目的地', pos: '70%,25%', label: '心内科 3F' },
      ],
      aiTip: {
        title: '情绪识别提示',
        text: '检测到患者近期对话语速放缓、声音低沉，建议说些鼓励的话："张叔叔，您今天气色不错，医生看完咱们就能踏实了。"',
      },
      checklist: [
        { name: '病历本', done: true },
        { name: '身份证', done: true },
        { name: '医保卡', done: true },
        { name: '既往药盒', done: false },
        { name: '既往检查报告', done: false },
      ],
    },
    // 成长墙
    growth: {
      score: 4.92,
      radar: { 专业: 4.95, 速度: 4.88, 亲和: 4.98, 细致: 4.92 },
      touchWall: [
        { quote: '小李特别耐心，一路搀扶我上下楼，比自家闺女还细心。', from: '— 张叔叔（心内科）' },
        { quote: '李敏姐帮我整理了所有检查报告，还画了张就医流程图，太专业了！', from: '— 陈女士（眼科）' },
        { quote: '下雨天她还特意多带了把伞给我，特别温暖。', from: '— 王阿姨（骨科）' },
      ],
      learn: [
        { title: '心血管疾病陪诊注意事项', meta: '12 分钟 · 已学完', icon: '❤️' },
        { title: '老年人沟通技巧', meta: '8 分钟 · 学习中', icon: '👵' },
        { title: '儿科陪诊应急处理', meta: '15 分钟 · 推荐', icon: '👶' },
      ],
    },
  },

  // 机构端
  agency: {
    kpi: [
      { label: '今日接单量', num: '128', trend: '+12%', up: true, icon: '📋', theme: '' },
      { label: '完成率', num: '96.8%', trend: '+2.1%', up: true, icon: '✅', theme: 'warm' },
      { label: '投诉率', num: '0.4%', trend: '-0.2%', up: true, icon: '⚠️', theme: 'blue' },
      { label: '平均满意度', num: '4.98', trend: '/ 5.0', up: true, icon: '⭐', theme: '' },
    ],
    risks: [
      { type: 'err', icon: '⏰', title: '陪诊师王芳超时未到达', desc: '订单 #A20260707 · 已超时 18 分钟', time: '10分钟前' },
      { type: 'warn', icon: '💬', title: '患者投诉待处理', desc: '订单 #B20260706 · 态度问题', time: '32分钟前' },
      { type: 'warn', icon: '📍', title: 'GPS定位异常', desc: '陪诊师刘强 · 信号丢失 5 分钟', time: '1小时前' },
    ],
    escorts: [
      { name: '李敏', meta: '接单 328 · 满意度 4.98', score: '4.98', initial: '李' },
      { name: '张芳', meta: '接单 215 · 满意度 4.92', score: '4.92', initial: '张' },
      { name: '王芳', meta: '接单 178 · 满意度 4.85', score: '4.85', initial: '王' },
      { name: '刘强', meta: '接单 156 · 满意度 4.79', score: '4.79', initial: '刘' },
    ],
    finance: {
      week: 18650, month: 78900, pending: 4,
      list: [
        { name: '李敏', amount: 4860, status: '待打款' },
        { name: '张芳', amount: 3250, status: '待打款' },
        { name: '王芳', amount: 2780, status: '已打款' },
      ],
    },
  },

  // 管理员端
  admin: {
    config: [
      { label: '平台抽佣比例', value: '15%' },
      { label: '陪诊师分成', value: '85%' },
      { label: '4小时套餐价', value: '¥298' },
      { label: '全程套餐价', value: '¥598' },
      { label: '卡券有效期', value: '12 个月' },
    ],
    models: [
      { name: '情绪识别模型', val: 96.2 },
      { name: '智能派单模型', val: 94.8 },
      { name: '语义分析模型', val: 92.5 },
      { name: '路线规划模型', val: 98.1 },
    ],
    logs: [
      { time: '10:42', level: 'err', text: '用户 #U8821 频繁退款（3次/24h）已触发风控' },
      { time: '10:18', level: 'warn', text: '陪诊师 #E1024 虚假定位检测，已限制接单' },
      { time: '09:55', level: 'info', text: 'AI 模型每日例行训练完成，准确率提升 0.3%' },
      { time: '09:30', level: 'warn', text: '订单 #A20260707 陪诊师超时未到达，已通知主管' },
      { time: '09:12', level: 'info', text: '北京区域公告已下发：明日医院系统升级提醒' },
      { time: '08:48', level: 'err', text: '检测到刷单行为，3 个账号已封禁' },
    ],
    notices: [
      { title: '明日全市医院系统升级通知', target: '北京区域全部用户', time: '今日 09:12' },
      { title: '夏季高温陪诊注意事项', target: '全部陪诊师', time: '昨日 16:30' },
    ],
  },
};

// AI 助手回复
const AI_REPLIES = {
  '发烧': '根据您描述的发烧症状，建议：\n1. 先测量体温，38.5°C 以下可物理降温\n2. 多饮水、注意休息\n3. 若持续高烧不退，建议立即就医\n\n需要我帮您预约"立即陪诊"服务吗？附近合作医院：协和医院、北大医院。',
  '协和': '已为您规划去协和医院的路线：\n📍 起点：当前位置\n🚗 推荐：地铁 2 号线（约 25 分钟）\n🏥 终点：北京协和医院（东城区帅府园 1 号）\n\n明日 08:30 您有心内科复诊，陪诊师李敏已接单，将提前 30 分钟到达医院为您排队。',
  '天气': '明日北京天气：\n🌧 中雨转小雨，气温 18°C - 22°C\n\n温馨提示：明日就诊有雨，记得带伞。我们已通知陪诊师李敏为您准备备用雨具。',
  'default': '您好！我是护无忧 AI 就医助理。我可以帮您：\n• 规划就诊路线\n• 解答就医疑问\n• 预约陪诊服务\n• 查询订单状态\n\n请问有什么可以帮您？',
};
