// ========== 应用主控 ==========
const App = {
  currentRole: 'patient',
  currentTab: 0,

  // 各端 Tab 配置
  tabs: {
    patient: [
      { name: '首页', icon: '🏠' },
      { name: '陪诊中', icon: '📍' },
      { name: '评价', icon: '⭐' },
      { name: '我的', icon: '👤' },
    ],
    escort: [
      { name: '工作台', icon: '🛠' },
      { name: '陪诊中', icon: '🧭' },
      { name: '成长墙', icon: '🌱' },
      { name: '我的', icon: '👤' },
    ],
    agency: [
      { name: '驾驶舱', icon: '📊' },
      { name: '预警', icon: '⚠️' },
      { name: '团队', icon: '👥' },
      { name: '财务', icon: '💰' },
    ],
    admin: [
      { name: '配置', icon: '⚙️' },
      { name: 'AI监控', icon: '🤖' },
      { name: '审计', icon: '📜' },
      { name: '公告', icon: '📢' },
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
    this.renderTabbar();
    this.renderScreen();
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
    void screen.offsetWidth; // 触发重绘
    screen.classList.add('fade-in');

    const role = this.currentRole;
    const tab = this.currentTab;
    if (role === 'patient') Patient.render(tab, screen);
    else if (role === 'escort') Escort.render(tab, screen);
    else if (role === 'agency') Agency.render(tab, screen);
    else if (role === 'admin') Admin.render(tab, screen);
  },

  // AI 发送
  aiSend() {
    const input = document.getElementById('aiInput');
    const q = input.value.trim();
    if (!q) return;
    const body = document.querySelector('.ai-panel-body');
    body.innerHTML += `<div class="ai-msg ai-user">${this.escape(q)}</div>`;
    input.value = '';
    body.scrollTop = body.scrollHeight;

    // 模拟思考
    setTimeout(() => {
      const reply = this.aiReply(q);
      body.innerHTML += `<div class="ai-msg ai-bot">${this.escape(reply).replace(/\n/g, '<br>')}</div>`;
      body.scrollTop = body.scrollHeight;
    }, 500);
  },

  aiReply(q) {
    if (q.includes('发烧')) return AI_REPLIES['发烧'];
    if (q.includes('协和') || q.includes('路线') || q.includes('规划')) return AI_REPLIES['协和'];
    if (q.includes('天气')) return AI_REPLIES['天气'];
    return AI_REPLIES['default'];
  },

  escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
