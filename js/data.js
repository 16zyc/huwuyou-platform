// ========== 全局需求池（患者端提交 → 后台处理 → 患者端查看进度）==========
// 状态：待处理 → 已分配 → 已对接 → 服务中 → 已完成 / 已取消
const NeedPool = {
  list: [],
  seq: 1,
  add(need) {
    const id = 'N' + String(Date.now()).slice(-6) + this.seq++;
    const now = new Date().toLocaleString('zh-CN', { month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
    const n = Object.assign({ id, status: '待处理', createTime: now, escortName: null, escortPhone: null, hospitalContact: null, feedback: null }, need);
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

// ========== 模拟数据 ==========
const MockData = {
  // ===== 患者端 =====
  patient: {
    user: {
      name: '王秀兰', avatar: '王', gender: '女', age: 68,
      phone: '138****8866', idMasked: '110***********4825',
      emergencyName: '王明', emergencyRel: '儿子', emergencyPhone: '139****2233',
    },
    // 病史信息
    medical: {
      history: '高血压（10年）、2型糖尿病（5年）',
      allergy: '青霉素过敏',
      medicine: '氨氯地平 5mg/日、二甲双胍 0.5g/日',
      mobility: '可独立行走，长距离需轮椅',
      insurance: '北京医保（在职）',
    },
    // 今日陪诊安排
    todaySchedule: {
      hasService: true,
      status: '陪诊中', statusType: 'serving', time: '今日 08:30',
      hospital: '北京协和医院', dept: '心内科复诊',
      escort: '李敏', escortAvatar: '李', escortPhone: '138****8888',
      escortStatus: '已到达医院 · 正在排队挂号',
      tip: '今日有雨，陪诊师已带伞，您出门注意防滑',
    },
  },

  // ===== 后台：陪诊师库 =====
  escorts: [
    { id: 'E01', name: '李敏', avatar: '李', age: 32, gender: '女', phone: '138-8888-0001',
      star: 4.9, orders: 328, status: '服务中',
      tags: ['心内科', '高血压', '糖尿病', '老人陪诊', '轮椅协助'],
      region: '东城区', score: 96 },
    { id: 'E02', name: '张芳', avatar: '张', age: 28, gender: '女', phone: '138-8888-0002',
      star: 4.8, orders: 215, status: '空闲',
      tags: ['骨科', '复诊', '儿童陪同'], region: '西城区', score: 92 },
    { id: 'E03', name: '王强', avatar: '王', age: 35, gender: '男', phone: '138-8888-0003',
      star: 4.7, orders: 186, status: '空闲',
      tags: ['眼科', '代办跑腿', '代取药'], region: '朝阳区', score: 88 },
    { id: 'E04', name: '陈静', avatar: '陈', age: 30, gender: '女', phone: '138-8888-0004',
      star: 4.9, orders: 274, status: '空闲',
      tags: ['心内科', '神经内科', '老人陪诊'], region: '东城区', score: 95 },
    { id: 'E05', name: '刘洋', avatar: '刘', age: 27, gender: '男', phone: '138-8888-0005',
      star: 4.6, orders: 132, status: '空闲',
      tags: ['骨科', '轮椅协助', '耳背'], region: '海淀区', score: 85 },
  ],

  // ===== 后台：合作医院 =====
  hospitals: [
    { id: 'H01', name: '北京协和医院', contact: '张主任', phone: '010-6915-XXXX', dept: '全科室', status: '已合作' },
    { id: 'H02', name: '北京同仁医院', contact: '李主任', phone: '010-5826-XXXX', dept: '眼科/耳鼻喉', status: '已合作' },
    { id: 'H03', name: '北京大学第一医院', contact: '王主任', phone: '010-8357-XXXX', dept: '综合', status: '已合作' },
    { id: 'H04', name: '中国人民解放军总医院', contact: '赵主任', phone: '010-6688-XXXX', dept: '综合', status: '洽谈中' },
  ],

  // ===== 后台：待处理需求（预置，演示用）=====
  initNeeds: [
    { patientName: '张建国', gender: '男', age: 72, phone: '139****1122',
      emergencyName: '张伟', emergencyPhone: '138****3344',
      history: '冠心病、高血压', allergy: '无', medicine: '阿司匹林', mobility: '需轮椅', insurance: '北京医保',
      hospital: '北京协和医院', dept: '心内科', date: '明日', serviceType: '全程陪诊',
      note: '老人耳背，需耐心沟通', status: '待处理', createTime: '07-15 09:24' },
    { patientName: '李秀英', gender: '女', age: 65, phone: '139****5566',
      emergencyName: '李强', emergencyPhone: '138****7788',
      history: '糖尿病、视网膜病变', allergy: '磺胺类', medicine: '胰岛素', mobility: '可独立行走', insurance: '北京医保',
      hospital: '北京同仁医院', dept: '眼科', date: '07-18', serviceType: '半程陪诊',
      note: '视力较差需搀扶', status: '待处理', createTime: '07-15 10:12' },
  ],

  // ===== 后台：KPI =====
  kpi: {
    todayOrders: 24, weekOrders: 138, pendingNeeds: 6, inService: 8,
    doneRate: 96, complaintRate: 0.8, satisfaction: 4.8,
  },
};

// 初始化预置需求
MockData.initNeeds.forEach(n => NeedPool.add(n));
