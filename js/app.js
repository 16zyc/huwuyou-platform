// ========== 应用主控（登录状态机 + 路由）==========
const App = {
  state: 'loginSelect', // loginSelect | patientLogin | adminLogin | patient | admin
  patientTab: 0,
  adminMenu: 'dashboard',

  init() {
    this.render();
  },

  // ===== 路由渲染 =====
  render() {
    const root = document.getElementById('root');
    document.body.className = this.state;
    if (this.state === 'loginSelect') this.renderLoginSelect(root);
    else if (this.state === 'patientLogin') this.renderPatientLogin(root);
    else if (this.state === 'adminLogin') this.renderAdminLogin(root);
    else if (this.state === 'patient') this.renderPatientApp(root);
    else if (this.state === 'admin') Admin.render(root);
  },

  // ===== 1. 登录选择页 =====
  renderLoginSelect(root) {
    root.innerHTML = `
      <div class="login-bg">
        <div class="login-wrap">
          <div class="login-brand">
            <div class="lb-logo">护</div>
            <div class="lb-name">护无忧</div>
            <div class="lb-sub">智陪诊全链路平台 · HomMed AI</div>
          </div>
          <div class="login-slogan">您不孤单，我们全程在</div>
          <div class="role-cards">
            <div class="role-card role-card-patient" onclick="App.goPatientLogin()">
              <div class="rc-icon">👵</div>
              <div class="rc-title">我是患者</div>
              <div class="rc-desc">登录后提交陪诊需求、查看进度、紧急联系</div>
              <div class="rc-arrow">›</div>
            </div>
            <div class="role-card role-card-admin" onclick="App.goAdminLogin()">
              <div class="rc-icon">🖥️</div>
              <div class="rc-title">我是管理员</div>
              <div class="rc-desc">登录后台管理需求、陪诊师、医院与数据</div>
              <div class="rc-arrow">›</div>
            </div>
          </div>
          <div class="login-foot">© 2026 护无忧 · 智陪诊全链路平台</div>
        </div>
      </div>
    `;
  },

  // ===== 2. 患者登录页 =====
  renderPatientLogin(root) {
    root.innerHTML = `
      <div class="login-bg login-bg-patient">
        <div class="login-back" onclick="App.back()">‹ 返回</div>
        <div class="login-wrap">
          <div class="login-brand">
            <div class="lb-logo">护</div>
            <div class="lb-name">患者登录</div>
            <div class="lb-sub">输入手机号即可使用</div>
          </div>
          <div class="login-form">
            <div class="form-group">
              <div class="fg-label">📱 手机号</div>
              <input type="tel" class="fg-input" id="p_phone" placeholder="请输入手机号" value="138 8866 8866" />
            </div>
            <div class="form-group">
              <div class="fg-label">🔐 验证码</div>
              <div class="code-row">
                <input type="text" class="fg-input" id="p_code" placeholder="请输入验证码" value="8888" />
                <button class="code-btn" id="p_sendCode" onclick="App.sendCode('p')">获取验证码</button>
              </div>
            </div>
            <button class="btn btn-login" onclick="App.patientLogin()">登 录</button>
            <button class="btn btn-outline" style="margin-top:10px;" onclick="App.patientQuickLogin()">一键演示登录</button>
            <div class="login-tip">
              <div class="ai-icon-sm">AI</div>
              <div>登录后可使用 AI 陪伴助理：说话就能提交需求</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ===== 3. 管理员登录页 =====
  renderAdminLogin(root) {
    root.innerHTML = `
      <div class="login-bg login-bg-admin">
        <div class="login-back" onclick="App.back()">‹ 返回</div>
        <div class="login-wrap">
          <div class="login-brand">
            <div class="lb-logo lb-logo-admin">⚙</div>
            <div class="lb-name">管理员登录</div>
            <div class="lb-sub">护无忧运营后台</div>
          </div>
          <div class="login-form">
            <div class="form-group">
              <div class="fg-label">👤 账号</div>
              <input type="text" class="fg-input" id="a_account" placeholder="请输入账号" value="admin@huwuyou" />
            </div>
            <div class="form-group">
              <div class="fg-label">🔑 密码</div>
              <input type="password" class="fg-input" id="a_pwd" placeholder="请输入密码" value="huwuyou2026" />
            </div>
            <div class="form-group">
              <div class="fg-label">🛡️ 验证码</div>
              <div class="code-row">
                <input type="text" class="fg-input" id="a_code" placeholder="请输入验证码" value="8888" />
                <button class="code-btn" onclick="App.toast('已发送验证码到管理员手机')">获取验证码</button>
              </div>
            </div>
            <button class="btn btn-login btn-login-admin" onclick="App.adminLogin()">登 录</button>
            <button class="btn btn-outline" style="margin-top:10px;" onclick="App.adminQuickLogin()">一键演示登录</button>
            <div class="login-tip">
              <div class="ai-icon-sm">🔒</div>
              <div>本系统采用银行级加密 · 所有操作均记入审计日志</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ===== 跳转 =====
  goPatientLogin() { this.state = 'patientLogin'; this.render(); },
  goAdminLogin() { this.state = 'adminLogin'; this.render(); },
  back() { this.state = 'loginSelect'; this.render(); },

  // 验证码倒计时
  sendCode(prefix) {
    const btn = document.getElementById(prefix + '_sendCode');
    if (!btn) return;
    let n = 60;
    btn.disabled = true;
    const tick = () => {
      btn.textContent = n + 's';
      if (n-- <= 0) { btn.disabled = false; btn.textContent = '获取验证码'; return; }
      setTimeout(tick, 1000);
    };
    tick();
    this.toast('验证码已发送（演示验证码：8888）');
  },

  // 患者登录
  patientLogin() {
    const phone = document.getElementById('p_phone').value.trim();
    const code = document.getElementById('p_code').value.trim();
    if (!phone) { this.toast('请输入手机号'); return; }
    if (!code) { this.toast('请输入验证码'); return; }
    if (code !== '8888') { this.toast('验证码错误，演示验证码为 8888'); return; }
    this.state = 'patient'; this.patientTab = 0; this.render();
  },
  patientQuickLogin() { this.state = 'patient'; this.patientTab = 0; this.render(); },

  // 管理员登录
  adminLogin() {
    const acc = document.getElementById('a_account').value.trim();
    const pwd = document.getElementById('a_pwd').value.trim();
    const code = document.getElementById('a_code').value.trim();
    if (!acc || !pwd) { this.toast('请输入账号密码'); return; }
    if (code !== '8888') { this.toast('验证码错误，演示验证码为 8888'); return; }
    this.state = 'admin'; Admin.currentMenu = 'dashboard'; this.render();
  },
  adminQuickLogin() { this.state = 'admin'; Admin.currentMenu = 'dashboard'; this.render(); },

  // 退出
  logout() {
    if (confirm('确认退出登录？')) { this.state = 'loginSelect'; this.render(); }
  },

  // ===== 患者端 App（手机壳）=====
  renderPatientApp(root) {
    root.innerHTML = `
      <div id="phone-frame">
        <div id="app">
          <header class="role-bar">
            <div class="role-brand">
              <span class="brand-logo">护</span>
              <div class="brand-text">
                <div class="brand-name">护无忧</div>
                <div class="brand-sub">智陪诊 · HomMed AI</div>
              </div>
            </div>
            <button class="role-btn" onclick="App.logout()" style="padding:6px 10px; font-size:12px;">退出</button>
          </header>
          <main id="screen" class="screen"></main>
          <nav class="tabbar" id="tabbar"></nav>
          <div class="ai-float" id="aiFloat">
            <div class="ai-float-ball">AI</div>
          </div>
          <div class="ai-panel" id="aiPanel" hidden>
            <div class="ai-panel-head">
              <span>AI 陪伴助理</span>
              <button class="ai-close" id="aiClose">×</button>
            </div>
            <div class="ai-panel-body">
              <div class="ai-msg ai-bot">您好，我是 AI 陪伴助理。您可以直接说"我想约下周二去协和看心内科"，我帮您整理好需求并同步给后台。</div>
            </div>
            <div class="ai-quick">
              <button data-q="我想约下周二去协和看心内科">约下周二去协和看心内科</button>
              <button data-q="我爸65岁高血压想找陪诊">帮我爸找陪诊</button>
              <button data-q="今天陪诊师什么时候到？">今天陪诊师什么时候到？</button>
            </div>
            <div class="ai-input">
              <input type="text" id="aiInput" placeholder="说话或打字，我来帮您整理需求" />
              <button id="aiSend">发送</button>
            </div>
          </div>
        </div>
      </div>
    `;
    // 绑定 AI
    document.getElementById('aiFloat').addEventListener('click', () => {
      document.getElementById('aiFloat').hidden = true;
      document.getElementById('aiPanel').hidden = false;
    });
    document.getElementById('aiClose').addEventListener('click', () => {
      document.getElementById('aiPanel').hidden = true;
      document.getElementById('aiFloat').hidden = false;
    });
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
    // Tab 栏
    this.renderPatientTabbar();
    this.renderPatientScreen();
  },

  renderPatientTabbar() {
    const tabs = [
      { name: '首页', icon: '🏠' },
      { name: '我的需求', icon: '📋' },
      { name: '陪诊进度', icon: '📍' },
      { name: '我的', icon: '👤' },
    ];
    const tabbar = document.getElementById('tabbar');
    tabbar.innerHTML = tabs.map((t, i) => `
      <button class="${i === this.patientTab ? 'active' : ''}" data-tab="${i}">
        <span class="tab-icon">${t.icon}</span>
        <span>${t.name}</span>
      </button>
    `).join('');
    tabbar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        this.patientTab = parseInt(btn.dataset.tab);
        this.renderPatientTabbar();
        this.renderPatientScreen();
      });
    });
  },

  renderPatientScreen() {
    const screen = document.getElementById('screen');
    screen.classList.remove('fade-in'); void screen.offsetWidth; screen.classList.add('fade-in');
    Patient.render(this.patientTab, screen);
  },

  // 外部切换 Tab
  switchTab(tab) {
    this.patientTab = tab;
    this.renderPatientTabbar();
    this.renderPatientScreen();
  },

  // ===== AI =====
  openAI() {
    document.getElementById('aiFloat').hidden = true;
    document.getElementById('aiPanel').hidden = false;
  },

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
      body.innerHTML += `<div class="ai-msg ai-bot">${this.escape(reply).replace(/\n/g,'<br>')}</div>`;
      body.scrollTop = body.scrollHeight;
    }, 600);
  },

  aiReply(q) {
    if (q.includes('协和') && q.includes('心内科')) {
      const u = MockData.patient.user; const med = MockData.patient.medical;
      NeedPool.add({
        patientName: u.name, gender: u.gender, age: u.age, phone: u.phone,
        emergencyName: u.emergencyName, emergencyPhone: u.emergencyPhone,
        history: med.history, allergy: med.allergy, medicine: med.medicine, mobility: med.mobility, insurance: med.insurance,
        hospital: '北京协和医院', dept: '心内科', date: '下周二', serviceType: '全程陪诊', amount: 598,
        note: 'AI对话解析生成：' + q, status: '待处理',
      });
      return '✅ 我已帮您整理好需求：\n\n• 患者：' + u.name + '（' + u.gender + '，' + u.age + '岁）\n• 病史：' + med.history + '\n• 医院：北京协和医院 · 心内科\n• 时间：下周二\n• 服务：全程陪诊\n\n需求已同步给后台，工作人员将为您匹配陪诊师并对接医院。\n您可以在「陪诊进度」里查看最新状态。';
    }
    if (q.includes('爸') || q.includes('陪诊')) {
      return '好的，我来帮您找陪诊师。请告诉我：\n\n1. 患者是我本人还是家属？\n2. 想去哪个医院、哪个科室？\n3. 期望哪天去？\n\n您也可以直接说"我想约下周二去协和看心内科"，我一次帮您整理好。';
    }
    if (q.includes('今天') || q.includes('什么时候') || q.includes('到')) {
      const t = MockData.patient.todaySchedule;
      if (t.hasService) return '您今天的安排：\n\n• ' + t.hospital + ' · ' + t.dept + '\n• 时间：' + t.time + '\n• 陪诊师：' + t.escort + '（' + t.escortPhone + '）\n• 当前状态：' + t.escortStatus + '\n\n陪诊师已到达医院，正在为您排队挂号。';
      return '今天没有陪诊安排。需要约一个吗？';
    }
    return '我在听。您可以直接告诉我：\n\n• "我想约下周二去协和看心内科"\n• "帮我爸找陪诊"\n• "今天陪诊师什么时候到？"\n\n我会帮您整理需求并同步给后台，不用填一堆表单。';
  },

  toast(msg) {
    let t = document.getElementById('_toast');
    if (!t) {
      t = document.createElement('div');
      t.id = '_toast';
      t.style.cssText = 'position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.85); color:#fff; padding:14px 20px; border-radius:12px; font-size:13px; z-index:9999; max-width:80%; text-align:center; line-height:1.5; white-space:pre-line;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.style.display = 'none', 2500);
  },

  escape(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  },
};

document.addEventListener('DOMContentLoaded', () => App.init());
