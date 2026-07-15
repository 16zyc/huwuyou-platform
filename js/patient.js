// ========== 患者端（轻量：信息提交 + 进度查看 + 紧急联系 + AI陪伴）==========
// SVG 图标（对齐后台 lucide 风格）
const P_ICON = {
  home: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7H8v7H4a2 2 0 0 1-1-2z"/></svg>',
  needs: '<svg class="icon" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
  track: '<svg class="icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  user: '<svg class="icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  ai: '<svg class="icon" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
  phone: '<svg class="icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  alert: '<svg class="icon" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  activity: '<svg class="icon" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
  clipboard: '<svg class="icon" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
  userSquare: '<svg class="icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
  card: '<svg class="icon" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
  star: '<svg class="icon" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  settings: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  headset: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  calendar: '<svg class="icon" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  inbox: '<svg class="icon" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>',
  chevronRight: '<svg class="icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>',
  chevronLeft: '<svg class="icon" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>',
  clock: '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  shield: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
};

const Patient = {
  // 4 个底部 Tab
  tabs: [
    { name: '首页', icon: P_ICON.home },
    { name: '我的需求', icon: P_ICON.needs },
    { name: '陪诊进度', icon: P_ICON.track },
    { name: '我的', icon: P_ICON.user },
  ],

  render(tab, el) {
    if (tab === 0) this.renderHome(el);
    else if (tab === 1) this.renderNeed(el);
    else if (tab === 2) this.renderProgress(el);
    else this.renderProfile(el);
  },

  // ===== Tab 1: 首页 - AI陪伴入口 + 今日状态 + 紧急联系 =====
  renderHome(el) {
    const u = MockData.patient.user;
    const today = MockData.patient.todaySchedule;
    el.innerHTML = `
      <!-- 问候 -->
      <div class="hero-card">
        <div class="hero-greet">${u.name}，您好</div>
        <div class="hero-weather">
          <span>北京 · 多云转晴 · 22°</span>
        </div>
        <div style="margin-top:8px; font-size:12px; color:var(--text-secondary);">今日提示：${today.tip}</div>
      </div>

      <!-- AI 陪伴入口（核心大入口）-->
      <div class="ai-entry" onclick="App.openAI()">
        <div class="ai-entry-icon">
          <div class="ai-orb">${P_ICON.ai}</div>
        </div>
        <div class="ai-entry-text">
          <div class="ai-entry-title">智能陪诊助手</div>
          <div class="ai-entry-sub">语音 / 文字描述需求，自动整理并同步给后台</div>
        </div>
        <div class="ai-entry-arrow">${P_ICON.chevronRight}</div>
      </div>

      <!-- 今日状态卡 -->
      ${today.hasService ? `
        <div class="today-card">
          <div class="tc-head">
            <span class="tc-badge ${today.statusType}">${today.status}</span>
            <span class="tc-time">${today.time}</span>
          </div>
          <div class="tc-title">${today.hospital} · ${today.dept}</div>
          <div class="tc-escort">
            <span class="tc-avatar">${today.escortAvatar}</span>
            <div>
              <div style="font-weight:600;">陪诊师 ${today.escort}</div>
              <div style="font-size:11px; color:var(--text-muted);">${today.escortStatus}</div>
            </div>
            <a href="tel:${today.escortPhone}" class="tc-call">致电</a>
          </div>
          <button class="btn btn-outline btn-sm" style="margin-top:10px; width:100%;" onclick="App.switchTab(2)">查看实时进度</button>
        </div>
      ` : `
        <div class="today-card today-empty">
          <div class="em-icon">${P_ICON.calendar}</div>
          <div>今日暂无陪诊安排</div>
          <button class="btn btn-sm" style="margin-top:10px;" onclick="App.switchTab(1)">提交陪诊需求</button>
        </div>
      `}

      <!-- 紧急联系 -->
      <div class="sos-row">
        <button class="sos-btn sos-urgent" onclick="Patient.sos()">
          <span class="sos-icon">${P_ICON.alert}</span>
          <span>紧急求助</span>
        </button>
        <button class="sos-btn sos-call" onclick="Patient.toast('已接通 24h 客服')">
          <span class="sos-icon">${P_ICON.phone}</span>
          <span>客服热线</span>
        </button>
      </div>

      <div class="slogan-bar">护无忧 · 全程陪诊 · 安全放心</div>
    `;
  },

  // ===== Tab 2: 我的需求 - 基本信息 / 病史 / 联系方式 / 服务要求 =====
  renderNeed(el) {
    const u = MockData.patient.user;
    const med = MockData.patient.medical;
    el.innerHTML = `
      <div class="page-head">
        <h2>我的需求</h2>
        <div style="font-size:11px; color:var(--text-muted);">填写后 AI 会帮您整理并同步给后台</div>
      </div>

      <!-- 基本信息 -->
      <div class="card">
        <div class="card-title">${P_ICON.user} 基本信息</div>
        <div class="pb-row"><span class="pb-label">姓名</span><span class="pb-value">${u.name}</span></div>
        <div class="pb-row"><span class="pb-label">性别</span><span class="pb-value">${u.gender}</span></div>
        <div class="pb-row"><span class="pb-label">年龄</span><span class="pb-value">${u.age} 岁</span></div>
        <div class="pb-row"><span class="pb-label">身份证号</span><span class="pb-value">${u.idMasked}</span></div>
        <button class="btn btn-outline btn-sm" style="margin-top:8px; width:100%;" onclick="Patient.toast('编辑基本信息（演示）')">编辑</button>
      </div>

      <!-- 病史信息 -->
      <div class="card">
        <div class="card-title">${P_ICON.activity} 病史信息</div>
        <div class="pb-row"><span class="pb-label">既往病史</span><span class="pb-value">${med.history}</span></div>
        <div class="pb-row"><span class="pb-label">过敏史</span><span class="pb-value">${med.allergy}</span></div>
        <div class="pb-row"><span class="pb-label">用药情况</span><span class="pb-value">${med.medicine}</span></div>
        <div class="pb-row"><span class="pb-label">行动能力</span><span class="pb-value">${med.mobility}</span></div>
        <div class="pb-row"><span class="pb-label">医保类型</span><span class="pb-value">${med.insurance}</span></div>
        <button class="btn btn-outline btn-sm" style="margin-top:8px; width:100%;" onclick="Patient.toast('更新病史信息（演示）')">更新病史</button>
      </div>

      <!-- 联系方式 -->
      <div class="card">
        <div class="card-title">${P_ICON.phone} 联系方式</div>
        <div class="pb-row"><span class="pb-label">本人手机</span><span class="pb-value">${u.phone}</span></div>
        <div class="pb-row"><span class="pb-label">紧急联系人</span><span class="pb-value">${u.emergencyName}（${u.emergencyRel}）</span></div>
        <div class="pb-row"><span class="pb-label">紧急电话</span><span class="pb-value">${u.emergencyPhone}</span></div>
        <button class="btn btn-outline btn-sm" style="margin-top:8px; width:100%;" onclick="Patient.toast('编辑联系方式（演示）')">编辑</button>
      </div>

      <!-- 服务要求 -->
      <div class="card">
        <div class="card-title">${P_ICON.clipboard} 服务要求</div>
        <div class="form-group">
          <div class="fg-label">希望就诊医院</div>
          <select class="fg-select" id="req_hospital">
            <option value="">请选择</option>
            <option>北京协和医院</option>
            <option>北京同仁医院</option>
            <option>北京大学第一医院</option>
            <option>中国人民解放军总医院</option>
          </select>
        </div>
        <div class="form-group">
          <div class="fg-label">就诊科室</div>
          <select class="fg-select" id="req_dept">
            <option value="">请选择</option>
            <option>心内科</option><option>神经内科</option><option>骨科</option>
            <option>眼科</option><option>内分泌科</option><option>其他</option>
          </select>
        </div>
        <div class="form-group">
          <div class="fg-label">期望陪诊日期</div>
          <input type="date" class="fg-input" id="req_date" />
        </div>
        <div class="form-group">
          <div class="fg-label">服务类型</div>
          <div class="fg-options" id="reqType">
            <div class="fg-option sel" data-v="半程陪诊">半程陪诊<div class="fo-sub">4小时</div></div>
            <div class="fg-option" data-v="全程陪诊">全程陪诊<div class="fo-sub">挂号-取药</div></div>
            <div class="fg-option" data-v="代办跑腿">代办跑腿<div class="fo-sub">代取药</div></div>
            <div class="fg-option" data-v="陪同复诊">陪同复诊<div class="fo-sub">单次</div></div>
          </div>
        </div>
        <div class="form-group">
          <div class="fg-label">特殊需求（轮椅/耳背/方言等）</div>
          <textarea class="fg-input" id="req_note" placeholder="如有特殊照护需求请说明"></textarea>
        </div>
        <button class="btn" style="width:100%;" onclick="Patient.submitNeed()">提交需求</button>
        <div class="ai-tip" style="margin-top:10px;">
          <div class="ai-icon">AI</div>
          <div class="ai-content">
            <div class="ai-title">智能整理</div>
            <div class="ai-text">提交后 AI 会自动整理您的需求为结构化档案，同步给管理后台，由工作人员为您匹配陪诊师和对接医院。</div>
          </div>
        </div>
      </div>
    `;
    // 套餐切换
    document.querySelectorAll('#reqType .fg-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('#reqType .fg-option').forEach(o => o.classList.remove('sel'));
        opt.classList.add('sel');
      });
    });
    // 默认日期
    const d = new Date(); d.setDate(d.getDate()+1);
    document.getElementById('req_date').value = d.toISOString().slice(0,10);
  },

  // 提交需求 → 写入全局需求池（后台会看到）
  submitNeed() {
    const hospital = document.getElementById('req_hospital').value;
    const dept = document.getElementById('req_dept').value;
    const date = document.getElementById('req_date').value;
    const typeSel = document.querySelector('#reqType .fg-option.sel');
    const note = document.getElementById('req_note').value.trim();
    if (!hospital) { this.toast('请选择医院'); return; }
    if (!dept) { this.toast('请选择科室'); return; }
    if (!date) { this.toast('请选择日期'); return; }

    const u = MockData.patient.user;
    const med = MockData.patient.medical;
    const req = NeedPool.add({
      patientName: u.name, gender: u.gender, age: u.age,
      phone: u.phone, emergencyName: u.emergencyName, emergencyPhone: u.emergencyPhone,
      history: med.history, allergy: med.allergy, medicine: med.medicine, mobility: med.mobility,
      hospital, dept, date, serviceType: typeSel.dataset.v, note,
      status: '待处理',
    });
    this.toast(`需求已提交\n编号 ${req.id}\n后台将为您匹配陪诊师并对接医院`);
    setTimeout(() => App.switchTab(2), 1500);
  },

  // ===== Tab 3: 陪诊进度 =====
  renderProgress(el) {
    const needs = NeedPool.list.filter(n => n.patientName === MockData.patient.user.name);
    el.innerHTML = `
      <div class="page-head">
        <h2>陪诊进度</h2>
        <div style="font-size:11px; color:var(--text-muted);">您提交的所有需求进度</div>
      </div>
      ${needs.length === 0 ? `
        <div class="empty">
          <div class="em-icon">${P_ICON.inbox}</div>
          <div>暂无需求记录</div>
          <button class="btn btn-sm" style="margin-top:10px;" onclick="App.switchTab(1)">去提交需求</button>
        </div>
      ` : needs.map(n => {
        const flow = ['待处理','已分配','已对接','服务中','已完成'];
        const idx = flow.indexOf(n.status);
        return `
          <div class="card" onclick="Patient.openNeedDetail('${n.id}')">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span class="status-badge ${n.status==='待处理'?'pending':n.status==='已分配'?'accepted':n.status==='已对接'?'accepted':n.status==='服务中'?'serving':'done'}">${n.status}</span>
              <span style="font-size:11px; color:var(--text-muted);">${n.id}</span>
            </div>
            <div style="margin-top:8px; font-weight:600; font-size:14px;">${n.hospital} · ${n.dept}</div>
            <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">期望：${n.date} · ${n.serviceType}</div>
            ${n.escortName ? `<div style="font-size:12px; margin-top:6px;">陪诊师：${n.escortName} ${n.escortPhone ? '· '+n.escortPhone : ''}</div>` : ''}
            <!-- 进度条 -->
            <div class="step-bar" style="margin-top:10px;">
              ${flow.map((s, i) => `<div class="step ${i < idx ? 'done' : ''} ${i === idx ? 'active' : ''}"></div>`).join('')}
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-top:4px;">
              ${flow.map((s, i) => `<span style="${i===idx?'color:var(--accent);font-weight:700;':''}">${s}</span>`).join('')}
            </div>
          </div>
        `;
      }).join('')}
    `;
  },

  openNeedDetail(id) {
    const n = NeedPool.getById(id);
    if (!n) return;
    const screen = document.getElementById('screen');
    screen.classList.remove('fade-in'); void screen.offsetWidth; screen.classList.add('fade-in');
    screen.innerHTML = `
      <div class="order-page">
        <div class="order-header">
          <div class="oh-back" onclick="App.switchTab(2)">${P_ICON.chevronLeft}</div>
          <h2>需求详情</h2>
        </div>
        <div class="card" style="text-align:center;">
          <div class="status-badge ${n.status==='待处理'?'pending':n.status==='服务中'?'serving':'done'}" style="font-size:13px; padding:6px 14px;">${n.status}</div>
          <div style="margin-top:8px; font-size:12px; color:var(--text-muted);">编号 ${n.id}</div>
        </div>
        <div class="card">
          <div class="card-title">${P_ICON.clipboard} 需求信息</div>
          <div class="pb-row"><span class="pb-label">医院</span><span class="pb-value">${n.hospital}</span></div>
          <div class="pb-row"><span class="pb-label">科室</span><span class="pb-value">${n.dept}</span></div>
          <div class="pb-row"><span class="pb-label">日期</span><span class="pb-value">${n.date}</span></div>
          <div class="pb-row"><span class="pb-label">服务类型</span><span class="pb-value">${n.serviceType}</span></div>
          ${n.note ? `<div class="pb-row"><span class="pb-label">特殊需求</span><span class="pb-value">${n.note}</span></div>` : ''}
        </div>
        ${n.escortName ? `
          <div class="card">
            <div class="card-title">${P_ICON.shield} 已分配陪诊师</div>
            <div class="pb-row"><span class="pb-label">姓名</span><span class="pb-value">${n.escortName}</span></div>
            <div class="pb-row"><span class="pb-label">电话</span><span class="pb-value">${n.escortPhone}</span></div>
            <a href="tel:${n.escortPhone}" class="btn btn-sm" style="margin-top:8px; width:100%; display:flex; align-items:center; justify-content:center; gap:6px;">${P_ICON.phone} 联系陪诊师</a>
          </div>
        ` : `
          <div class="ai-tip">
            <div class="ai-icon">AI</div>
            <div class="ai-content">
              <div class="ai-title">${P_ICON.clock} 等待分配中</div>
              <div class="ai-text">后台正在为您匹配最合适的陪诊师，通常 30 分钟内会有结果。</div>
            </div>
          </div>
        `}

        <!-- 评价表单（已完成且未评价时显示）-->
        ${n.status === '已完成' && !n.feedback ? `
          <div class="card">
            <div class="card-title">${P_ICON.star} 服务评价</div>
            <div class="form-group">
              <div class="fg-label">总体评分</div>
              <div class="star-picker" id="starPicker">
                ${[1,2,3,4,5].map(s => `<span class="sp-star" data-v="${s}" onclick="Patient.pickStar(${s})">★</span>`).join('')}
              </div>
            </div>
            <div class="form-group">
              <div class="fg-label">评价标签（可多选）</div>
              <div class="fg-options" id="reviewTags">
                <div class="fg-option" data-v="服务耐心">服务耐心</div>
                <div class="fg-option" data-v="专业靠谱">专业靠谱</div>
                <div class="fg-option" data-v="准时到达">准时到达</div>
                <div class="fg-option" data-v="沟通顺畅">沟通顺畅</div>
                <div class="fg-option" data-v="有待改进">有待改进</div>
              </div>
            </div>
            <div class="form-group">
              <div class="fg-label">详细评价</div>
              <textarea class="fg-input" id="review_text" placeholder="请描述您的服务体验..." rows="3"></textarea>
            </div>
            <button class="btn" style="width:100%;" onclick="Patient.submitFeedback('${n.id}')">提交评价</button>
          </div>
        ` : ''}

        ${n.status === '已完成' && n.feedback ? `
          <div class="card">
            <div class="card-title">${P_ICON.star} 我的评价</div>
            <div class="pb-row"><span class="pb-label">评分</span><span class="pb-value" style="color:#eab308;">${'★'.repeat(n.feedback.star)}${'☆'.repeat(5-n.feedback.star)}</span></div>
            <div class="pb-row"><span class="pb-label">标签</span><span class="pb-value">${n.feedback.tags.join('、')}</span></div>
            ${n.feedback.text ? `<div class="pb-row"><span class="pb-label">评价</span><span class="pb-value">${n.feedback.text}</span></div>` : ''}
          </div>
        ` : ''}

        <button class="btn btn-outline" style="margin-top:10px; width:100%;" onclick="App.switchTab(2)">返回</button>
      </div>
    `;
    // 评价标签多选
    if (n.status === '已完成' && !n.feedback) {
      this._starVal = 0;
      document.querySelectorAll('#reviewTags .fg-option').forEach(opt => {
        opt.addEventListener('click', () => {
          opt.classList.toggle('sel');
        });
      });
    }
  },

  // 评价：选择星级
  pickStar(val) {
    this._starVal = val;
    document.querySelectorAll('#starPicker .sp-star').forEach((s, i) => {
      s.classList.toggle('active', i < val);
    });
  },

  // 评价：提交
  submitFeedback(needId) {
    const star = this._starVal || 5;
    const text = document.getElementById('review_text').value.trim();
    const tags = Array.from(document.querySelectorAll('#reviewTags .fg-option.sel')).map(o => o.dataset.v);
    const feedback = { star, text, tags: tags.length ? tags : ['服务耐心'], time: new Date().toLocaleString('zh-CN') };
    NeedPool.update(needId, { feedback });
    // 同步到后台评价列表
    const n = NeedPool.getById(needId);
    MockData.reviews.unshift({
      id: 'R' + Date.now().toString().slice(-6),
      patient: n.patientName,
      escort: n.escortName || '陪诊师',
      star, text: text || '服务满意',
      tags: feedback.tags, time: feedback.time, status: star <= 3 ? '差评待处理' : '已处理',
    });
    this.toast('评价已提交，感谢您的反馈');
    setTimeout(() => App.switchTab(2), 1500);
  },

  // ===== Tab 4: 我的 =====
  renderProfile(el) {
    const u = MockData.patient.user;
    el.innerHTML = `
      <div class="profile-head">
        <div class="ph-avatar">${u.avatar}</div>
        <div class="ph-name">${u.name}</div>
        <div class="ph-sub">${u.gender} · ${u.age}岁 · ${u.phone}</div>
      </div>
      <div class="card">
        <div class="config-row" onclick="Patient.toast('查看权益卡')"><span class="cr-label" style="display:flex; align-items:center; gap:8px;">${P_ICON.card} 权益卡</span><span class="cr-val">剩余 2 次</span><span style="color:var(--text-muted)">${P_ICON.chevronRight}</span></div>
        <div class="config-row" onclick="Patient.toast('查看历史陪诊')"><span class="cr-label" style="display:flex; align-items:center; gap:8px;">${P_ICON.clipboard} 历史陪诊</span><span style="color:var(--text-muted)">${P_ICON.chevronRight}</span></div>
        <div class="config-row" onclick="Patient.toast('打开评价')"><span class="cr-label" style="display:flex; align-items:center; gap:8px;">${P_ICON.star} 我的评价</span><span style="color:var(--text-muted)">${P_ICON.chevronRight}</span></div>
        <div class="config-row" onclick="Patient.toast('打开设置')"><span class="cr-label" style="display:flex; align-items:center; gap:8px;">${P_ICON.settings} 设置</span><span style="color:var(--text-muted)">${P_ICON.chevronRight}</span></div>
        <div class="config-row" onclick="Patient.toast('联系客服')"><span class="cr-label" style="display:flex; align-items:center; gap:8px;">${P_ICON.headset} 在线客服</span><span style="color:var(--text-muted)">${P_ICON.chevronRight}</span></div>
      </div>
      <button class="btn btn-outline" style="margin-top:14px;" onclick="Patient.toast('已退出登录（演示）')">退出登录</button>
    `;
  },

  // 紧急求助
  sos() {
    if (confirm('确认发送紧急求助？\n后台和陪诊师将立即收到通知。')) {
      this.toast('已发送紧急求助\n后台管理员与陪诊师已收到');
    }
  },

  toast(msg) {
    let t = document.getElementById('_toast');
    if (!t) {
      t = document.createElement('div');
      t.id = '_toast';
      t.style.cssText = 'position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); background:rgba(15,23,42,0.9); color:#fff; padding:14px 20px; border-radius:6px; font-size:13px; z-index:9999; max-width:80%; text-align:center; line-height:1.5; white-space:pre-line;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.style.display = 'none', 2500);
  },
};
