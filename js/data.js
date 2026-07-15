// ========== 全局需求池（患者端提交 → 后台处理 → 患者端查看进度）==========
// 状态：待处理 → 已分配 → 已对接 → 服务中 → 已完成 / 已取消
const NeedPool = {
  list: [],
  seq: 1,
  add(need) {
    const id = 'N' + String(Date.now()).slice(-6) + this.seq++;
    const now = new Date().toLocaleString('zh-CN', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
    const n = Object.assign({ id, status: '待处理', createTime: now, escortName: null, escortPhone: null, hospitalContact: null, feedback: null, amount: 0 }, need);
    this.list.unshift(n);
    return n;
  },
  getById(id) { return this.list.find(n => n.id === id); },
  update(id, patch) {
    const n = this.getById(id);
    if (n) Object.assign(n, patch);
    return n;
  },
};

// ========== AI 配置（DeepSeek API）==========
// 真实接入 DeepSeek Chat API，支持自然语言理解患者需求并自动填写表单
const AIConfig = {
  apiKey: localStorage.getItem('huwuyou_ai_key') || 'sk-3682d3ff55984b5ba1058b2b0405fc4f',
  baseUrl: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
  enabled: true,
  setKey(key) {
    this.apiKey = key;
    localStorage.setItem('huwuyou_ai_key', key);
  },
};

// ========== 模拟数据 ==========
const MockData = {
  // ===== 患者端 =====
  patient: {
    user: {
      name: '王秀兰', avatar: '王', gender: '女', age: 68,
      phone: '138****8866', idMasked: '110***********4825',
      emergencyName: '王明', emergencyRel: '儿子', emergencyPhone: '139****2233',
    },
    medical: {
      history: '高血压（10年）、2型糖尿病（5年）',
      allergy: '青霉素过敏',
      medicine: '氨氯地平 5mg/日、二甲双胍 0.5g/日',
      mobility: '可独立行走，长距离需轮椅',
      insurance: '北京医保（在职）',
    },
    todaySchedule: {
      hasService: true,
      status: '陪诊中', statusType: 'serving', time: '今日 08:30',
      hospital: '北京协和医院', dept: '心内科复诊',
      escort: '李敏', escortAvatar: '李', escortPhone: '138****8888',
      escortStatus: '已到达医院 · 正在排队挂号',
      tip: '今日有雨，陪诊师已带伞，您出门注意防滑',
    },
  },

  // ===== 管理员 =====
  admin: {
    user: { name: '牛管理员', avatar: '牛', role: '超级管理员', account: 'admin@huwuyou' },
  },

  // ===== 陪诊师库 =====
  escorts: [
    { id: 'E01', name: '李敏', avatar: '李', age: 32, gender: '女', phone: '138-8888-0001',
      star: 4.9, orders: 328, status: '服务中', score: 96,
      tags: ['心内科','高血压','糖尿病','老人陪诊','轮椅协助'], region: '东城区',
      joinDate: '2024-03-15', income: 12860, completionRate: 98 },
    { id: 'E02', name: '张芳', avatar: '张', age: 28, gender: '女', phone: '138-8888-0002',
      star: 4.8, orders: 215, status: '空闲', score: 92,
      tags: ['骨科','复诊','儿童陪同'], region: '西城区',
      joinDate: '2024-06-20', income: 9850, completionRate: 96 },
    { id: 'E03', name: '王强', avatar: '王', age: 35, gender: '男', phone: '138-8888-0003',
      star: 4.7, orders: 186, status: '空闲', score: 88,
      tags: ['眼科','代办跑腿','代取药'], region: '朝阳区',
      joinDate: '2024-04-08', income: 8420, completionRate: 94 },
    { id: 'E04', name: '陈静', avatar: '陈', age: 30, gender: '女', phone: '138-8888-0004',
      star: 4.9, orders: 274, status: '空闲', score: 95,
      tags: ['心内科','神经内科','老人陪诊'], region: '东城区',
      joinDate: '2024-02-11', income: 11240, completionRate: 99 },
    { id: 'E05', name: '刘洋', avatar: '刘', age: 27, gender: '男', phone: '138-8888-0005',
      star: 4.6, orders: 132, status: '空闲', score: 85,
      tags: ['骨科','轮椅协助','耳背'], region: '海淀区',
      joinDate: '2024-08-01', income: 6380, completionRate: 92 },
  ],

  // ===== 合作医院 =====
  hospitals: [
    { id: 'H01', name: '北京协和医院', contact: '张主任', phone: '010-6915-XXXX', dept: '全科室', status: '已合作', greenChannel: true, orders: 580 },
    { id: 'H02', name: '北京同仁医院', contact: '李主任', phone: '010-5826-XXXX', dept: '眼科/耳鼻喉', status: '已合作', greenChannel: true, orders: 320 },
    { id: 'H03', name: '北京大学第一医院', contact: '王主任', phone: '010-8357-XXXX', dept: '综合', status: '已合作', greenChannel: true, orders: 245 },
    { id: 'H04', name: '中国人民解放军总医院', contact: '赵主任', phone: '010-6688-XXXX', dept: '综合', status: '洽谈中', greenChannel: false, orders: 0 },
  ],

  // ===== 患者档案（除当前登录患者外的其他档案）=====
  patientArchives: [
    { id: 'P01', name: '张建国', gender: '男', age: 72, phone: '139****1122',
      emergencyName: '张伟', emergencyPhone: '138****3344',
      history: '冠心病、高血压', allergy: '无', medicine: '阿司匹林', mobility: '需轮椅', insurance: '北京医保',
      orders: 3, lastService: '07-12', satisfaction: 4.7 },
    { id: 'P02', name: '李秀英', gender: '女', age: 65, phone: '139****5566',
      emergencyName: '李强', emergencyPhone: '138****7788',
      history: '糖尿病、视网膜病变', allergy: '磺胺类', medicine: '胰岛素', mobility: '可独立行走', insurance: '北京医保',
      orders: 5, lastService: '07-10', satisfaction: 4.9 },
    { id: 'P03', name: '陈志强', gender: '男', age: 68, phone: '137****8899',
      emergencyName: '陈静', emergencyPhone: '136****1100',
      history: '脑梗后遗症', allergy: '无', medicine: '阿托伐他汀', mobility: '需轮椅', insurance: '北京医保',
      orders: 2, lastService: '07-08', satisfaction: 4.6 },
    { id: 'P04', name: '刘淑芬', gender: '女', age: 70, phone: '138****2211',
      emergencyName: '刘强', emergencyPhone: '139****3300',
      history: '骨关节炎、高血压', allergy: '青霉素', medicine: '布洛芬', mobility: '可独立行走', insurance: '北京医保',
      orders: 7, lastService: '07-14', satisfaction: 4.8 },
  ],

  // ===== 财务记录 =====
  finance: {
    monthRevenue: 86420, weekRevenue: 21860, todayRevenue: 3280,
    commissionRate: 0.15, // 平台抽佣
    pending: 4280, // 待结算
    settled: 73390,
    bills: [
      { id: 'B001', patient: '王秀兰', escort: '李敏', amount: 598, status: '已结算', time: '07-14', type: '全程陪诊' },
      { id: 'B002', patient: '张建国', escort: '陈静', amount: 398, status: '已结算', time: '07-12', type: '陪同复诊' },
      { id: 'B003', patient: '李秀英', escort: '张芳', amount: 298, status: '已结算', time: '07-10', type: '半程陪诊' },
      { id: 'B004', patient: '刘淑芬', escort: '王强', amount: 98, status: '待结算', time: '07-14', type: '代办跑腿' },
      { id: 'B005', patient: '陈志强', escort: '李敏', amount: 598, status: '待结算', time: '07-13', type: '全程陪诊' },
    ],
  },

  // ===== 评价 =====
  reviews: [
    { id: 'R001', patient: '刘淑芬', escort: '李敏', star: 5, time: '07-14',
      text: '李敏非常耐心，全程搀扶我妈，老人很满意。', tags: ['耐心','专业','老人友好'], status: '正常' },
    { id: 'R002', patient: '张建国', escort: '王强', star: 3, time: '07-12',
      text: '态度一般，陪诊师到得有点晚。', tags: ['迟到'], status: '差评待处理' },
    { id: 'R003', patient: '李秀英', escort: '张芳', star: 5, time: '07-10',
      text: '张芳对眼科流程很熟，节省了很多时间。', tags: ['流程熟','效率高'], status: '正常' },
    { id: 'R004', patient: '陈志强', escort: '陈静', star: 4, time: '07-08',
      text: '整体不错，就是等候时间略长。', tags: ['等候长'], status: '正常' },
  ],

  // ===== 风险预警 =====
  alerts: [
    { id: 'A001', level: 'high', type: '超时未签到', desc: '陪诊师李敏 订单N001 已超时15分钟未签到', time: '10分钟前', status: '未处理' },
    { id: 'A002', level: 'medium', type: '差评预警', desc: '订单N003 收到3星差评，建议24小时内回访', time: '1小时前', status: '未处理' },
    { id: 'A003', level: 'low', type: '定位异常', desc: '陪诊师王强 位置偏离预定医院3公里', time: '2小时前', status: '已处理' },
  ],

  // ===== 待处理需求（预置）=====
  initNeeds: [
    { patientName: '张建国', gender: '男', age: 72, phone: '139****1122',
      emergencyName: '张伟', emergencyPhone: '138****3344',
      history: '冠心病、高血压', allergy: '无', medicine: '阿司匹林', mobility: '需轮椅', insurance: '北京医保',
      hospital: '北京协和医院', dept: '心内科', date: '明日', serviceType: '全程陪诊',
      note: '老人耳背，需耐心沟通', status: '待处理', createTime: '07-15 09:24', amount: 598 },
    { patientName: '李秀英', gender: '女', age: 65, phone: '139****5566',
      emergencyName: '李强', emergencyPhone: '138****7788',
      history: '糖尿病、视网膜病变', allergy: '磺胺类', medicine: '胰岛素', mobility: '可独立行走', insurance: '北京医保',
      hospital: '北京同仁医院', dept: '眼科', date: '07-18', serviceType: '半程陪诊',
      note: '视力较差需搀扶', status: '待处理', createTime: '07-15 10:12', amount: 298 },
    // 给患者王秀兰加一条已完成的预置订单，让患者端进度页初始有数据
    { patientName: '王秀兰', gender: '女', age: 68, phone: '138 8866 8866',
      emergencyName: '王强', emergencyPhone: '139****1122',
      history: '高血压、冠心病', allergy: '青霉素', medicine: '降压药', mobility: '可独立行走', insurance: '北京医保',
      hospital: '北京协和医院', dept: '心内科', date: '07-10', serviceType: '全程陪诊',
      note: '老人耳背，需要大声说话', status: '已完成', createTime: '07-08 14:30', amount: 598,
      escortName: '李敏', escortPhone: '137****4488', hospitalContact: '刘主任',
      feedback: { star: 5, text: '李敏非常耐心，全程陪同挂号看病取药，老人很满意', tags: ['服务耐心', '专业靠谱'], time: '07-10 16:20' },
    },
  ],

  kpi: {
    todayOrders: 24, weekOrders: 138, pendingNeeds: 6, inService: 8,
    doneRate: 96, complaintRate: 0.8, satisfaction: 4.8, monthRevenue: 86420,
  },
};

MockData.initNeeds.forEach(n => NeedPool.add(n));
