// ========== 患者端（轻量：信息提交 + 进度查看 + 紧急联系 + AI陪伴）==========
const Patient = {
  // 4 个底部 Tab
  tabs: [
    { name: '首页', icon: '🏠' },
    { name: '我的需求', icon: '📋' },
    { name: '陪诊进度', icon: '📍' },
    { name: '我的', icon: '👤' },
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
        <div class="hero-greet">${u.name}，您好 👋</div>
        <div class="hero-weather">
          <span class="weather-icon">☀️</span>
          <span>北京 · 多云转晴 · 22°</span>
        </div>
        <div style="margin-top:8px; font-size:12px; color:var(--primary-dark);">💡 ${today.tip}</div>
      </div>

      <!-- AI 陪伴入口（核心大入口）-->
      <div class="ai-entry" onclick="App.openAI()">
        <div class="ai-entry-icon">
          <div class="ai-orb">AI</div>
        </div>
        <div class="ai-entry-text">
          <div class="ai-entry-title">跟 AI 说说您今天的需求</div>
          <div class="ai-entry-sub">语音 / 文字 · 我帮您整理并同步给后台</div>
        </div>
        <div class="ai-entry-arrow">›</div>
      </div>

      <!-- 今日状态卡 -->
      ${today.hasService ? `
        <div class="today-card">
          <div class="tc-head">
            <span class="tc-badge ${today.statusType}">● ${today.status}</span>
            <span class="tc-time">${today.time}</span>
          </div>
          <div class="tc-title">${today.hospital} · ${today.dept}</div>
          <div class="tc-escort">
            <span class="tc-avatar">${today.escortAvatar}</span>
            <div>
              <div style="font-weight:600;">陪诊师 ${today.escort}</div>
              <div style="font-size:11px; color:var(--text-3);">${today.escortStatus}</div>
            </div>
            <a href="tel:${today.escortPhone}" class="tc-call">📞 致电</a>
          </div>
          <button class="btn btn-outline btn-sm" style="margin-top:10px; width:100%;" onclick="App.switchTab(2)">查看实时进度 ›</button>
        </div>
      ` : `
        <div class="today-card today-empty">
          <div class="em-icon">📅</div>
          <div>今日暂无陪诊安排</div>
          <button class="btn btn-sm" style="margin-top:10px;" onclick="App.switchTab(1)">提交陪诊需求 ›</button>
        </div>
      `}

      <!-- 紧急联系 -->
      <div class="sos-row">
        <button class="sos-btn" onclick="Patient.sos()">
          <span class="sos-icon">🆘</span>
          <span>紧急求助</span>
        </button>
        <button class="sos-btn sos-2" onclick="Patient.toast('已接通 24h 客服')">
          <span class="sos-icon">📞</span>
          <span>客服热线</span>
        </button>
      </div>

      <div class="slogan-bar">— 您不孤单，我们全程在 —</div>
    `;
  },

  // ===== Tab 2: 我的需求 - 基本信息 / 病史 / 联系方式 / 服务要求 =====
  renderNeed(el) {
    const u = MockData.patient.user;
    const med = MockData.patient.medical;
    el.innerHTML = `
      <div class="page-head">
        <h2>我的需求</h2>
        <div style="font-size:11px; color:var(--text-3);">填写后 AI 会帮您整理并同步给后台</div>
      </div>

      <!-- 基本信息 -->
      <div class="card">
        <div class="card-title">👤 基本信息</div>
        <div class="pb-row"><span class="pb-label">姓名</span><span class="pb-value">${u.name}</span></div>
        <div class="pb-row"><span class="pb-label">性别</span><span class="pb-value">${u.gender}</span></div>
        <div class="pb-row"><span class="pb-label">年龄</span><span class="pb-value">${u.age} 岁</span></div>
        <div class="pb-row"><span class="pb-label">身份证号</span><span class="pb-value">${u.idMasked}</span></div>
        <button class="btn btn-outline btn-sm" style="margin-top:8px; width:100%;" onclick="Patient.toast('编辑基本信息（演示）')">编辑</button>
      </div>

      <!-- 病史信息 -->
      <div class="card">
        <div class="card-title">🩺 病史信息</div>
        <div class="pb-row"><span class="pb-label">既往病史</span><span class="pb-value">${med.history}</span></div>
        <div class="pb-row"><span class="pb-label">过敏史</span><span class="pb-value">${med.allergy}</span></div>
        <div class="pb-row"><span class="pb-label">用药情况</span><span class="pb-value">${med.medicine}</span></div>
        <div class="pb-row"><span class="pb-label">行动能力</span><span class="pb-value">${med.mobility}</span></div>
        <div class="pb-row"><span class="pb-label">医保类型</span><span class="pb-value">${med.insurance}</span></div>
        <button class="btn btn-outline btn-sm" style="margin-top:8px; width:100%;" onclick="Patient.toast('更新病史信息（演示）')">更新病史</button>
      </div>

      <!-- 联系方式 -->
      <div class="card">
        <div class="card-title">📞 联系方式</div>
        <div class="pb-row"><span class="pb-label">本人手机</span><span class="pb-value">${u.phone}</span></div>
        <div class="pb-row"><span class="pb-label">紧急联系人</span><span class="pb-value">${u.emergencyName}（${u.emergencyRel}）</span></div>
        <div class="pb-row"><span class="pb-label">紧急电话</span><span class="pb-value">${u.emergencyPhone}</span></div>
        <button class="btn btn-outline btn-sm" style="margin-top:8px; width:100%;" onclick="Patient.toast('编辑联系方式（演示）')">编辑</button>
      </div>

      <!-- 服务要求 -->
      <div class="card">
        <div class="card-title">📝 服务要求</div>
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
            <div class="ai-title">🤖 AI 提示</div>
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
      status: '待处理', // 待处理 → 已分配 → 已对接 → 服务中 → 已完成
    });
    this.toast(`✅ 需求已提交\n编号 ${req.id}\n后台将为您匹配陪诊师并对接医院`);
    setTimeout(() => App.switchTab(2), 1500);
  },

  // ===== Tab 3: 陪诊进度 =====
  renderProgress(el) {
    const needs = NeedPool.list.filter(n => n.patientName === MockData.patient.user.name);
    el.innerHTML = `
      <div class="page-head">
        <h2>陪诊进度</h2>
        <div style="font-size:11px; color:var(--text-3);">您提交的所有需求进度</div>
      </div>
      ${needs.length === 0 ? `
        <div class="empty">
          <div class="em-icon">📭</div>
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
              <span style="font-size:11px; color:var(--text-3);">${n.id}</span>
            </div>
            <div style="margin-top:8px; font-weight:600; font-size:14px;">${n.hospital} · ${n.dept}</div>
            <div style="font-size:12px; color:var(--text-3); margin-top:4px;">期望：${n.date} · ${n.serviceType}</div>
            ${n.escortName ? `<div style="font-size:12px; margin-top:6px;">陪诊师：${n.escortName} ${n.escortPhone ? '· '+n.escortPhone : ''}</div>` : ''}
            <!-- 进度条 -->
            <div class="step-bar" style="margin-top:10px;">
              ${flow.map((s, i) => `<div class="step ${i < idx ? 'done' : ''} ${i === idx ? 'active' : ''}"></div>`).join('')}
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-3); margin-top:4px;">
              ${flow.map((s, i) => `<span style="${i===idx?'color:var(--primary-dark);font-weight:700;':''}">${s}</span>`).join('')}
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
          <div class="oh-back" onclick="App.switchTab(2)">‹</div>
          <h2>需求详情</h2>
        </div>
        <div class="card" style="text-align:center;">
          <div class="status-badge ${n.status==='待处理'?'pending':n.status==='服务中'?'serving':'done'}" style="font-size:13px; padding:6px 14px;">${n.status}</div>
          <div style="margin-top:8px; font-size:12px; color:var(--text-3);">编号 ${n.id}</div>
        </div>
        <div class="card">
          <div class="card-title">📋 需求信息</div>
          <div class="pb-row"><span class="pb-label">医院</span><span class="pb-value">${n.hospital}</span></div>
          <div class="pb-row"><span class="pb-label">科室</span><span class="pb-value">${n.dept}</span></div>
          <div class="pb-row"><span class="pb-label">日期</span><span class="pb-value">${n.date}</span></div>
          <div class="pb-row"><span class="pb-label">服务类型</span><span class="pb-value">${n.serviceType}</span></div>
          ${n.note ? `<div class="pb-row"><span class="pb-label">特殊需求</span><span class="pb-value">${n.note}</span></div>` : ''}
        </div>
        ${n.escortName ? `
          <div class="card">
            <div class="card-title">👩‍⚕️ 已分配陪诊师</div>
            <div class="pb-row"><span class="pb-label">姓名</span><span class="pb-value">${n.escortName}</span></div>
            <div class="pb-row"><span class="pb-label">电话</span><span class="pb-value">${n.escortPhone}</span></div>
            <a href="tel:${n.escortPhone}" class="btn btn-sm" style="margin-top:8px; width:100%; display:block; text-align:center;">📞 联系陪诊师</a>
          </div>
        ` : `
          <div class="ai-tip">
            <div class="ai-icon">AI</div>
            <div class="ai-content">
              <div class="ai-title">⏳ 等待分配中</div>
              <div class="ai-text">后台正在为您匹配最合适的陪诊师，通常 30 分钟内会有结果。</div>
            </div>
          </div>
        `}
        <button class="btn btn-outline" style="margin-top:10px; width:100%;" onclick="App.switchTab(2)">返回</button>
      </div>
    `;
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
        <div class="config-row" onclick="Patient.toast('查看权益卡')"><span class="cr-label">💳 权益卡</span><span class="cr-val">剩余 2 次</span><span style="color:var(--text-3)">›</span></div>
        <div class="config-row" onclick="Patient.toast('查看历史陪诊')"><span class="cr-label">📋 历史陪诊</span><span style="color:var(--text-3)">›</span></div>
        <div class="config-row" onclick="Patient.toast('打开评价')"><span class="cr-label">⭐ 我的评价</span><span style="color:var(--text-3)">›</span></div>
        <div class="config-row" onclick="Patient.toast('打开设置')"><span class="cr-label">⚙️ 设置</span><span style="color:var(--text-3)">›</span></div>
        <div class="config-row" onclick="Patient.toast('联系客服')"><span class="cr-label">🎧 在线客服</span><span style="color:var(--text-3)">›</span></div>
      </div>
      <button class="btn btn-outline" style="margin-top:14px;" onclick="Patient.toast('已退出登录（演示）')">退出登录</button>
    `;
  },

  // 紧急求助
  sos() {
    if (confirm('🚨 确认发送紧急求助？\n后台和陪诊师将立即收到通知。')) {
      this.toast('🚨 已发送紧急求助\n后台管理员与陪诊师已收到');
    }
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
};
