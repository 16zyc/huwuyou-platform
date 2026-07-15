// ========== 应用主控 ==========
const App = {
  currentRole: 'patient',
  currentTab: 0,

  // 双端 Tab 配置
  tabs: {
    patient: [
      { name: '首页', icon: '🏠' },
      { name: '我的需求', icon: '📋' },
      { name: '陪诊进度', icon: '📍' },
      { name: '我的', icon: '👤' },
    ],
    admin: [
      { name: '工作台', icon: '📊' },
      { name: '需求处理', icon: '📥' },
      { name: '陪诊师', icon: '👥' },
      { name: '医院', icon: '🏥' },
      { name: '设置', icon: '⚙️' },
    ],
  },

  init() {
    // 角色切换
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.switchRole(btn.dataset.role);
      });
    });

    // AI 悬浮球
    const aiFloat = document.getElementById('aiFloat');
    const aiPanel = document.getElementById('aiPanel');
    aiFloat.addEventListener('click', () => {
      aiFloat.hidden = true;
      aiPanel.hidden = false;
    });
    document.getElementById('aiClose').addEventListener('click', () => {
      aiPanel.hidden = true;
      aiFloat.hidden = false;
    });

    // AI 快捷提问
    document.querySelectorAll('.ai-quick button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('aiInput').value = btn.dataset.q;
        this.aiSend();
      });
    });
    document.getElementById('aiSend').addEventListener('click', () => this.aiSend());
    document.getElementById('aiInput').addEventListener('keydown', e => {
      if (e.key === 'Enter') this.aiSend();
    });

    // 默认加载患者端
    this.switchRole('patient');
  },

  switchRole(role) {
    this.currentRole = role;
    this.currentTab = 0;
    // AI 悬浮球仅患者端显示
    document.getElementById('aiFloat').hidden = role !== 'patient';
    document.getElementById('aiPanel').hidden = true;
    // 后台切换 body class（控制布局）
    document.body.classList.toggle('admin-mode', role === 'admin');
    this.renderTabbar();
    this.renderScreen();
  },

  // 切换 Tab（外部可调）
  switchTab(tab) {
    this.currentTab = tab;
    this.renderTabbar();
    this.renderScreen();
  },

  // 打开 AI 面板
  openAI() {
    document.getElementById('aiFloat').hidden = true;
    document.getElementById('aiPanel').hidden = false;
  },

  renderTabbar() {
    const tabs = this.tabs[this.currentRole];
    const tabbar = document.getElementById('tabbar');
    tabbar.innerHTML = tabs.map((t, i) => `
      <button class="${i === this.currentTab ? 'active' : ''}" data-tab="${i}">
        <span class="tab-icon">${t.icon}</span>
        <span>${t.name}</span>
      </button>
    `).join('');
    tabbar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentTab = parseInt(btn.dataset.tab);
        this.renderTabbar();
        this.renderScreen();
      });
    });
  },

  renderScreen() {
    const screen = document.getElementById('screen');
    screen.classList.remove('fade-in');
    void screen.offsetWidth;
    screen.classList.add('fade-in');

    const role = this.currentRole;
    const tab = this.currentTab;
    if (role === 'patient') Patient.render(tab, screen);
    else if (role === 'admin') Admin.render(tab, screen);
  },

  // ===== AI 发送（理解患者需求 → 整理结构化 → 同步后台）=====
  aiSend() {
    const input = document.getElementById('aiInput');
    const q = input.value.trim();
    if (!q) return;
    const body = document.querySelector('.ai-panel-body');
    body.innerHTML += `<div class="ai-msg ai-user">${this.escape(q)}</div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;

    setTimeout(() => {
      const reply = this.aiReply(q);
      body.innerHTML += `<div class="ai-msg ai-bot">${this.escape(reply).replace(/\n/g, '<br>')}</div>`;
      body.scrollTop = body.scrollHeight;
    }, 600);
  },

  // AI 理解患者需求
  aiReply(q) {
    // 约下周二去协和看心内科
    if (q.includes('协和') && q.includes('心内科')) {
      // 自动创建一条需求
      const u = MockData.patient.user;
      const med = MockData.patient.medical;
      NeedPool.add({
        patientName: u.name, gender: u.gender, age: u.age, phone: u.phone,
        emergencyName: u.emergencyName, emergencyPhone: u.emergencyPhone,
        history: med.history, allergy: med.allergy, medicine: med.medicine, mobility: med.mobility, insurance: med.insurance,
        hospital: '北京协和医院', dept: '心内科', date: '下周二', serviceType: '全程陪诊',
        note: 'AI对话解析生成：' + q, status: '待处理',
      });
      return '✅ 我已帮您整理好需求：\n\n• 患者：' + u.name + '（' + u.gender + '，' + u.age + '岁）\n• 病史：' + med.history + '\n• 医院：北京协和医院 · 心内科\n• 时间：下周二\n• 服务：全程陪诊\n\n需求已同步给后台，工作人员将为您匹配陪诊师并对接医院。\n您可以在「陪诊进度」里查看最新状态。';
    }
    // 帮我爸找陪诊
    if (q.includes('爸') || q.includes('陪诊')) {
      return '好的，我来帮您找陪诊师。请告诉我：\n\n1. 患者是我本人还是家属？\n2. 想去哪个医院、哪个科室？\n3. 期望哪天去？\n\n您也可以直接说"我想约下周二去协和看心内科"，我一次帮您整理好。';
    }
    // 今天陪诊师什么时候到
    if (q.includes('今天') || q.includes('什么时候') || q.includes('到')) {
      const t = MockData.patient.todaySchedule;
      if (t.hasService) return '您今天的安排：\n\n• ' + t.hospital + ' · ' + t.dept + '\n• 时间：' + t.time + '\n• 陪诊师：' + t.escort + '（' + t.escortPhone + '）\n• 当前状态：' + t.escortStatus + '\n\n陪诊师已到达医院，正在为您排队挂号。您可以点首页「查看实时进度」了解详情。';
      return '今天没有陪诊安排。需要约一个吗？';
    }
    // 默认
    return '我在听。您可以直接告诉我：\n\n• "我想约下周二去协和看心内科"\n• "帮我爸找陪诊"\n• "今天陪诊师什么时候到？"\n\n我会帮您整理需求并同步给后台，不用填一堆表单。';
  },

  escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
