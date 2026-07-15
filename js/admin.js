// ========== 管理后台（SaaS 布局：左侧导航 + 顶栏 + 主内容区）==========
const Admin = {
  currentMenu: 'dashboard', // dashboard|patients|needs|escorts|hospitals|track|finance|reviews|system

  // 9 大菜单（分组）
  menus: [
    { group: '运营总览', items: [
      { id: 'dashboard', name: '工作台', icon: '📊' },
      { id: 'track', name: '服务跟踪', icon: '📍' },
      { id: 'finance', name: '财务结算', icon: '💰' },
    ]},
    { group: '业务管理', items: [
      { id: 'patients', name: '患者档案', icon: '👥' },
      { id: 'needs', name: '需求处理', icon: '📥' },
      { id: 'escorts', name: '陪诊师管理', icon: '🧑‍⚕️' },
      { id: 'hospitals', name: '医院对接', icon: '🏥' },
    ]},
    { group: '系统', items: [
      { id: 'reviews', name: '评价反馈', icon: '⭐' },
      { id: 'system', name: '系统设置', icon: '⚙️' },
    ]},
  ],

  render(root) {
    root.innerHTML = `
      <div class="admin-layout">
        <!-- 左侧导航 -->
        <aside class="admin-sidebar" id="adminSidebar">
          <div class="as-brand">
            <div class="as-logo">护</div>
            <div>
              <div class="as-name">护无忧</div>
              <div class="as-sub">运营后台</div>
            </div>
          </div>
          <nav class="as-menu" id="asMenu"></nav>
          <div class="as-foot">
            <div class="as-version">v2.0 · HomMed AI</div>
          </div>
        </aside>
        <!-- 主区 -->
        <div class="admin-main">
          <header class="admin-topbar">
            <div class="at-left">
              <button class="at-toggle" id="atToggle">☰</button>
              <div class="at-crumb" id="atCrumb">工作台</div>
            </div>
            <div class="at-right">
              <div class="at-search"><input placeholder="搜索患者/订单/陪诊师..." /><span>🔍</span></div>
              <div class="at-alert" id="atAlert">
                <span>🔔</span>
                <span class="at-badge">${MockData.alerts.filter(a=>a.status==='未处理').length}</span>
              </div>
              <div class="at-user">
                <div class="at-avatar">${MockData.admin.user.avatar}</div>
                <div>
                  <div class="at-name">${MockData.admin.user.name}</div>
                  <div class="at-role">${MockData.admin.user.role}</div>
                </div>
              </div>
              <button class="at-logout" onclick="App.logout()" title="退出">⏻</button>
            </div>
          </header>
          <main class="admin-content" id="adminContent"></main>
        </div>
      </div>
    `;
    this.renderMenu();
    this.renderContent();
    document.getElementById('atAlert').addEventListener('click', () => this.switchMenu('dashboard'));
    document.getElementById('atToggle').addEventListener('click', () => {
      document.querySelector('.admin-sidebar').classList.toggle('collapsed');
    });
  },

  renderMenu() {
    const cur = this.currentMenu;
    const html = this.menus.map(g => `
      <div class="as-group">
        <div class="as-group-title">${g.group}</div>
        ${g.items.map(it => `
          <button class="as-item ${it.id === cur ? 'active' : ''}" data-menu="${it.id}">
            <span class="as-icon">${it.icon}</span>
            <span>${it.name}</span>
            ${it.id === 'needs' ? `<span class="as-count">${NeedPool.list.filter(n=>n.status==='待处理').length}</span>` : ''}
          </button>
        `).join('')}
      </div>
    `).join('');
    document.getElementById('asMenu').innerHTML = html;
    document.querySelectorAll('.as-item').forEach(btn => {
      btn.addEventListener('click', () => this.switchMenu(btn.dataset.menu));
    });
  },

  switchMenu(id) {
    this.currentMenu = id;
    this.renderMenu();
    this.renderContent();
  },

  renderContent() {
    const el = document.getElementById('adminContent');
    const id = this.currentMenu;
    // 更新面包屑
    const name = this.menus.flatMap(g => g.items).find(i => i.id === id)?.name || '';
    document.getElementById('atCrumb').textContent = name;
    el.classList.remove('fade-in'); void el.offsetWidth; el.classList.add('fade-in');

    if (id === 'dashboard') this.renderDashboard(el);
    else if (id === 'patients') this.renderPatients(el);
    else if (id === 'needs') this.renderNeeds(el);
    else if (id === 'escorts') this.renderEscorts(el);
    else if (id === 'hospitals') this.renderHospitals(el);
    else if (id === 'track') this.renderTrack(el);
    else if (id === 'finance') this.renderFinance(el);
    else if (id === 'reviews') this.renderReviews(el);
    else if (id === 'system') this.renderSystem(el);
  },

  // ===== 工作台 =====
  renderDashboard(el) {
    const k = MockData.kpi;
    const pending = NeedPool.list.filter(n => n.status === '待处理');
    const serving = NeedPool.list.filter(n => n.status === '服务中');
    el.innerHTML = `
      <div class="db-row">
        <div class="page-head"><h2>运营工作台</h2><div>实时数据 · ${new Date().toLocaleDateString('zh-CN')}</div></div>
      </div>
      <!-- KPI -->
      <div class="kpi-grid">
        <div class="kpi-card"><div class="kpi-num">${k.todayOrders}</div><div class="kpi-label">今日订单</div><div class="kpi-trend up">↑ 12%</div></div>
        <div class="kpi-card kpi-warn"><div class="kpi-num">${pending.length}</div><div class="kpi-label">待处理需求</div><div class="kpi-trend">需关注</div></div>
        <div class="kpi-card kpi-blue"><div class="kpi-num">${k.inService}</div><div class="kpi-label">陪诊中</div><div class="kpi-trend">实时</div></div>
        <div class="kpi-card kpi-green"><div class="kpi-num">${k.doneRate}%</div><div class="kpi-label">完成率</div><div class="kpi-trend up">↑ 2%</div></div>
        <div class="kpi-card kpi-green"><div class="kpi-num">${k.satisfaction}</div><div class="kpi-label">满意度</div><div class="kpi-trend">稳定</div></div>
        <div class="kpi-card kpi-red"><div class="kpi-num">${k.complaintRate}%</div><div class="kpi-label">投诉率</div><div class="kpi-trend down">↓ 0.3%</div></div>
      </div>

      <div class="db-cols">
        <div class="db-col">
          <div class="db-card">
            <div class="db-card-head">
              <h3>📥 待处理需求（${pending.length}）</h3>
              <a class="more" onclick="Admin.switchMenu('needs')">查看全部 ›</a>
            </div>
            <div class="db-card-body">
              ${pending.length === 0 ? '<div class="empty-inline">暂无待处理需求</div>' :
                pending.slice(0,4).map(n => `
                  <div class="db-row-item" onclick="Admin.openNeed('${n.id}')">
                    <div class="dbr-main">
                      <div class="dbr-patient">${n.patientName} · ${n.gender}/${n.age}岁</div>
                      <div class="dbr-info">${n.hospital} · ${n.dept} · ${n.date}</div>
                    </div>
                    <span class="status-badge pending">${n.status}</span>
                  </div>
                `).join('')}
            </div>
          </div>
        </div>
        <div class="db-col">
          <div class="db-card">
            <div class="db-card-head">
              <h3>📍 服务中（${serving.length}）</h3>
              <a class="more" onclick="Admin.switchMenu('track')">查看全部 ›</a>
            </div>
            <div class="db-card-body">
              ${serving.length === 0 ? '<div class="empty-inline">当前无服务中订单</div>' :
                serving.map(n => `
                  <div class="db-row-item" onclick="Admin.openNeed('${n.id}')">
                    <div class="dbr-main">
                      <div class="dbr-patient">${n.patientName}</div>
                      <div class="dbr-info">${n.hospital} · 陪诊师：${n.escortName}</div>
                    </div>
                    <span class="status-badge serving">服务中</span>
                  </div>
                `).join('')}
            </div>
          </div>

          <div class="db-card">
            <div class="db-card-head"><h3>⚠️ 风险预警</h3></div>
            <div class="db-card-body">
              ${MockData.alerts.map(a => `
                <div class="alert-item alert-${a.level}">
                  <div class="ai-level">${a.level==='high'?'🔴':a.level==='medium'?'🟡':'🟢'} ${a.type}</div>
                  <div class="ai-desc">${a.desc}</div>
                  <div class="ai-time">${a.time} · <span class="badge ${a.status==='未处理'?'pending':'done'}">${a.status}</span></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ===== 患者档案 =====
  renderPatients(el) {
    const all = [MockData.patient.user, ...MockData.patientArchives];
    el.innerHTML = `
      <div class="page-head"><h2>患者档案</h2><div>共 ${all.length} 位患者</div></div>
      <div class="toolbar">
        <input class="tb-search" placeholder="🔍 搜索患者姓名/手机号" />
        <select class="tb-select"><option>全部状态</option><option>活跃</option><option>休眠</option></select>
        <button class="btn btn-sm">+ 新建患者</button>
      </div>
      <div class="table-card">
        <table class="data-table">
          <thead><tr>
            <th>患者</th><th>性别/年龄</th><th>电话</th><th>病史</th><th>行动</th><th>过敏</th><th>订单数</th><th>满意度</th><th>操作</th>
          </tr></thead>
          <tbody>
            ${all.map((p, i) => `
              <tr>
                <td><div class="cell-patient"><div class="cp-avatar">${p.name[0]}</div><div><div class="cp-name">${p.name}</div><div class="cp-sub">${p.idMasked || '****'}</div></div></div></td>
                <td>${p.gender} / ${p.age}</td>
                <td>${p.phone}</td>
                <td>${(p.history || (i===0?MockData.patient.medical.history:'-')).slice(0,10)}</td>
                <td>${p.mobility || (i===0?MockData.patient.medical.mobility:'-')}</td>
                <td>${(p.allergy || (i===0?MockData.patient.medical.allergy:'-'))}</td>
                <td>${p.orders || 0}</td>
                <td><span class="star">⭐ ${p.satisfaction || 5.0}</span></td>
                <td><button class="btn-link" onclick="Admin.openPatient(${i})">详情</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  openPatient(idx) {
    const all = [MockData.patient.user, ...MockData.patientArchives];
    const p = all[idx];
    const med = idx === 0 ? MockData.patient.medical : {
      history: p.history, allergy: p.allergy, medicine: p.medicine, mobility: p.mobility, insurance: p.insurance,
    };
    this.modal(`
      <h2>患者档案</h2>
      <div class="modal-grid">
        <div class="pb-row"><span class="pb-label">姓名</span><span class="pb-value">${p.name}</span></div>
        <div class="pb-row"><span class="pb-label">性别/年龄</span><span class="pb-value">${p.gender} / ${p.age}岁</span></div>
        <div class="pb-row"><span class="pb-label">电话</span><span class="pb-value">${p.phone}</span></div>
        <div class="pb-row"><span class="pb-label">紧急联系人</span><span class="pb-value">${p.emergencyName || '-'}（${p.emergencyPhone || '-'}）</span></div>
        <div class="pb-row"><span class="pb-label">既往病史</span><span class="pb-value">${med.history || '-'}</span></div>
        <div class="pb-row"><span class="pb-label">过敏史</span><span class="pb-value" style="color:${med.allergy&&med.allergy!=='无'?'var(--danger)':'inherit'}">${med.allergy || '无'}</span></div>
        <div class="pb-row"><span class="pb-label">用药</span><span class="pb-value">${med.medicine || '-'}</span></div>
        <div class="pb-row"><span class="pb-label">行动能力</span><span class="pb-value">${med.mobility || '-'}</span></div>
        <div class="pb-row"><span class="pb-label">医保</span><span class="pb-value">${med.insurance || '-'}</span></div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline" onclick="Admin.closeModal()">关闭</button>
        <button class="btn" onclick="Admin.closeModal();Admin.switchMenu('needs')">查看相关需求</button>
      </div>
    `);
  },

  // ===== 需求处理 =====
  renderNeeds(el) {
    el.innerHTML = `
      <div class="page-head"><h2>需求处理</h2><div>患者提交的需求统一在此处理</div></div>
      <div class="filter-bar">
        <button class="filter-btn active" data-f="all">全部（${NeedPool.list.length}）</button>
        <button class="filter-btn" data-f="待处理">待处理（${NeedPool.list.filter(n=>n.status==='待处理').length}）</button>
        <button class="filter-btn" data-f="已分配">已分配</button>
        <button class="filter-btn" data-f="已对接">已对接</button>
        <button class="filter-btn" data-f="服务中">服务中</button>
        <button class="filter-btn" data-f="已完成">已完成</button>
      </div>
      <div id="needsList"></div>
    `;
    this.renderNeedsList('all');
    el.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        el.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderNeedsList(btn.dataset.f);
      });
    });
  },

  renderNeedsList(filter) {
    const list = filter === 'all' ? NeedPool.list : NeedPool.list.filter(n => n.status === filter);
    const el = document.getElementById('needsList');
    if (!el) return;
    el.innerHTML = list.length === 0 ? `<div class="empty"><div class="em-icon">📭</div><div>暂无${filter==='all'?'':filter}需求</div></div>` :
      `<div class="table-card">
        <table class="data-table">
          <thead><tr><th>患者</th><th>需求</th><th>时间</th><th>病史摘要</th><th>陪诊师</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            ${list.map(n => `
              <tr>
                <td><div class="cell-patient"><div class="cp-avatar sm">${n.patientName[0]}</div><div><div class="cp-name">${n.patientName}</div><div class="cp-sub">${n.gender}/${n.age} · ${n.phone}</div></div></div></td>
                <td><div class="cell-info"><div>${n.hospital}</div><div class="cp-sub">${n.dept} · ${n.date} · ${n.serviceType}</div></div></td>
                <td><div class="cp-sub">${n.createTime}</div><div class="cp-sub">${n.id}</div></td>
                <td><div class="cell-tags">${n.history?`<span class="tag tag-gray">${n.history.slice(0,8)}</span>`:''}${n.mobility?`<span class="tag tag-gray">${n.mobility}</span>`:''}${n.allergy&&n.allergy!=='无'?`<span class="tag tag-red">${n.allergy}</span>`:''}</div></td>
                <td>${n.escortName || '<span class="cp-sub">待派单</span>'}</td>
                <td><span class="status-badge ${n.status==='待处理'?'pending':n.status==='服务中'?'serving':(n.status==='已分配'||n.status==='已对接')?'accepted':n.status==='已取消'?'cancelled':'done'}">${n.status}</span></td>
                <td><button class="btn-link" onclick="Admin.openNeed('${n.id}')">处理</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  },

  openNeed(id) {
    const n = NeedPool.getById(id);
    if (!n) return;
    const recommended = MockData.escorts.filter(e => e.status === '空闲').map(e => {
      let score = e.score;
      if (e.tags.some(t => n.history && n.history.includes(t))) score += 3;
      if (e.tags.some(t => n.dept.includes(t))) score += 2;
      if (n.mobility && n.mobility.includes('轮椅') && e.tags.includes('轮椅协助')) score += 5;
      return { ...e, matchScore: Math.min(99, score) };
    }).sort((a, b) => b.matchScore - a.matchScore);

    this.modal(`
      <div class="modal-head-row">
        <h2>需求详情</h2>
        <span class="status-badge ${n.status==='待处理'?'pending':n.status==='服务中'?'serving':'done'}">${n.status}</span>
      </div>
      <div class="cp-sub" style="margin-bottom:14px;">编号 ${n.id} · 提交于 ${n.createTime}</div>

      <div class="modal-grid-2">
        <div class="modal-card">
          <div class="card-title">👤 患者信息</div>
          <div class="pb-row"><span class="pb-label">姓名</span><span class="pb-value">${n.patientName}</span></div>
          <div class="pb-row"><span class="pb-label">性别/年龄</span><span class="pb-value">${n.gender} / ${n.age}岁</span></div>
          <div class="pb-row"><span class="pb-label">电话</span><span class="pb-value">${n.phone}</span></div>
          <div class="pb-row"><span class="pb-label">紧急联系人</span><span class="pb-value">${n.emergencyName}（${n.emergencyPhone}）</span></div>
        </div>
        <div class="modal-card">
          <div class="card-title">🩺 病史信息</div>
          <div class="pb-row"><span class="pb-label">既往病史</span><span class="pb-value">${n.history || '无'}</span></div>
          <div class="pb-row"><span class="pb-label">过敏史</span><span class="pb-value" style="color:${n.allergy&&n.allergy!=='无'?'var(--danger)':'inherit'}">${n.allergy || '无'}</span></div>
          <div class="pb-row"><span class="pb-label">用药</span><span class="pb-value">${n.medicine || '无'}</span></div>
          <div class="pb-row"><span class="pb-label">行动能力</span><span class="pb-value">${n.mobility || '正常'}</span></div>
        </div>
      </div>

      <div class="modal-card">
        <div class="card-title">📋 服务需求</div>
        <div class="pb-row"><span class="pb-label">医院</span><span class="pb-value">${n.hospital}</span></div>
        <div class="pb-row"><span class="pb-label">科室</span><span class="pb-value">${n.dept}</span></div>
        <div class="pb-row"><span class="pb-label">日期</span><span class="pb-value">${n.date}</span></div>
        <div class="pb-row"><span class="pb-label">服务类型</span><span class="pb-value">${n.serviceType}</span></div>
        <div class="pb-row"><span class="pb-label">金额</span><span class="pb-value">¥${n.amount || 298}</span></div>
        ${n.note ? `<div class="pb-row"><span class="pb-label">特殊需求</span><span class="pb-value">${n.note}</span></div>` : ''}
      </div>

      ${n.escortName ? `
        <div class="modal-card">
          <div class="card-title">👩‍⚕️ 已分配陪诊师</div>
          <div class="pb-row"><span class="pb-label">姓名</span><span class="pb-value">${n.escortName}</span></div>
          <div class="pb-row"><span class="pb-label">电话</span><span class="pb-value">${n.escortPhone}</span></div>
          ${n.hospitalContact ? `<div class="pb-row"><span class="pb-label">医院对接人</span><span class="pb-value">${n.hospitalContact}</span></div>` : ''}
        </div>
      ` : ''}

      ${n.status === '待处理' ? `
        <div class="modal-card">
          <div class="card-title">🤖 AI 推荐陪诊师</div>
          <div class="ai-hint-text">基于病史、科室、行动能力、区域综合匹配</div>
          ${recommended.slice(0,3).map((e,i) => `
            <div class="escort-pick ${i===0?'pick-rec':''}">
              <div class="ep-avatar">${e.avatar}</div>
              <div class="ep-info">
                <div class="ep-name">${e.name} · ${e.gender}/${e.age}岁 · ⭐${e.star}</div>
                <div class="ep-tags">${e.tags.slice(0,3).map(t=>`<span class="tag tag-gray">${t}</span>`).join('')}</div>
              </div>
              <div class="ep-match">${e.matchScore}%</div>
              <button class="btn btn-sm" onclick="Admin.assignEscort('${n.id}','${e.id}')">分配</button>
            </div>
          `).join('')}
        </div>
        <div class="modal-card">
          <div class="card-title">🏥 对接医院</div>
          ${MockData.hospitals.filter(h=>h.name===n.hospital || h.status==='已合作').slice(0,3).map(h => `
            <div class="hospital-pick">
              <div>
                <div style="font-weight:600; font-size:13px;">${h.name}</div>
                <div class="cp-sub">对接人：${h.contact} · ${h.phone}</div>
              </div>
              <button class="btn btn-outline btn-sm" onclick="Admin.contactHospital('${n.id}','${h.contact}')">确认对接</button>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-outline" style="width:100%;" onclick="Admin.cancelNeed('${n.id}')">取消该需求</button>
      ` : ''}

      ${(n.status === '已分配' || n.status === '已对接') ? `
        <button class="btn" style="width:100%;" onclick="Admin.startService('${n.id}')">确认开始服务</button>
      ` : ''}
      ${n.status === '服务中' ? `
        <button class="btn" style="width:100%;" onclick="Admin.finishService('${n.id}')">完成服务</button>
      ` : ''}
    `);
  },

  assignEscort(needId, escortId) {
    const e = MockData.escorts.find(x => x.id === escortId);
    if (!e) return;
    NeedPool.update(needId, { status: '已分配', escortName: e.name, escortPhone: e.phone });
    e.status = '服务中';
    this.toast(`已分配陪诊师：${e.name}（患者端已同步）`);
    this.closeModal();
    setTimeout(() => this.openNeed(needId), 300);
  },

  contactHospital(needId, contact) {
    NeedPool.update(needId, { status: '已对接', hospitalContact: contact });
    this.toast(`已对接医院（联系人：${contact}）`);
    this.closeModal();
    setTimeout(() => this.openNeed(needId), 300);
  },

  startService(needId) {
    if (confirm('确认开始服务？患者端将进入"陪诊中"状态。')) {
      NeedPool.update(needId, { status: '服务中' });
      this.toast('服务已开始（患者端已同步）');
      this.closeModal();
      setTimeout(() => this.openNeed(needId), 300);
    }
  },

  finishService(needId) {
    if (confirm('确认完成服务？订单将进入"已完成"。')) {
      NeedPool.update(needId, { status: '已完成' });
      this.toast('服务已完成');
      this.closeModal();
      this.renderContent();
    }
  },

  cancelNeed(needId) {
    if (confirm('确认取消该需求？')) {
      NeedPool.update(needId, { status: '已取消' });
      this.toast('需求已取消');
      this.closeModal();
      this.renderContent();
    }
  },

  // ===== 陪诊师管理 =====
  renderEscorts(el) {
    el.innerHTML = `
      <div class="page-head"><h2>陪诊师管理</h2><div>${MockData.escorts.length} 名陪诊师</div></div>
      <div class="toolbar">
        <input class="tb-search" placeholder="🔍 搜索姓名/专长" />
        <select class="tb-select"><option>全部状态</option><option>空闲</option><option>服务中</option></select>
        <button class="btn btn-sm">+ 新增陪诊师</button>
      </div>
      <div class="escort-grid">
        ${MockData.escorts.map(e => `
          <div class="escort-card" onclick="Admin.openEscort('${e.id}')">
            <div class="ec-head">
              <div class="ec-avatar">${e.avatar}</div>
              <div class="ec-info">
                <div class="ec-name">${e.name} <span class="ec-sub">${e.gender}/${e.age}</span></div>
                <div class="ec-meta">⭐ ${e.star} · ${e.orders}单 · ${e.region}</div>
              </div>
              <span class="status-badge ${e.status==='空闲'?'accepted':'serving'}">${e.status}</span>
            </div>
            <div class="ec-tags">${e.tags.slice(0,4).map(t=>`<span class="tag tag-gray">${t}</span>`).join('')}</div>
            <div class="ec-stats">
              <div><div class="ec-num">¥${e.income}</div><div class="ec-label">本月收入</div></div>
              <div><div class="ec-num">${e.completionRate}%</div><div class="ec-label">完成率</div></div>
              <div><div class="ec-num">${e.score}</div><div class="ec-label">综合评分</div></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  openEscort(id) {
    const e = MockData.escorts.find(x => x.id === id);
    if (!e) return;
    this.modal(`
      <div class="modal-head-row">
        <h2>${e.name} 的档案</h2>
        <span class="status-badge ${e.status==='空闲'?'accepted':'serving'}">${e.status}</span>
      </div>
      <div class="modal-grid-2">
        <div class="modal-card">
          <div class="card-title">基本信息</div>
          <div class="pb-row"><span class="pb-label">姓名</span><span class="pb-value">${e.name}</span></div>
          <div class="pb-row"><span class="pb-label">性别/年龄</span><span class="pb-value">${e.gender} / ${e.age}岁</span></div>
          <div class="pb-row"><span class="pb-label">电话</span><span class="pb-value">${e.phone}</span></div>
          <div class="pb-row"><span class="pb-label">入职日期</span><span class="pb-value">${e.joinDate}</span></div>
          <div class="pb-row"><span class="pb-label">服务区域</span><span class="pb-value">${e.region}</span></div>
        </div>
        <div class="modal-card">
          <div class="card-title">业务数据</div>
          <div class="pb-row"><span class="pb-label">总订单数</span><span class="pb-value">${e.orders}</span></div>
          <div class="pb-row"><span class="pb-label">评分</span><span class="pb-value">⭐ ${e.star}</span></div>
          <div class="pb-row"><span class="pb-label">完成率</span><span class="pb-value">${e.completionRate}%</span></div>
          <div class="pb-row"><span class="pb-label">本月收入</span><span class="pb-value">¥${e.income}</span></div>
          <div class="pb-row"><span class="pb-label">综合评分</span><span class="pb-value">${e.score}</span></div>
        </div>
      </div>
      <div class="modal-card">
        <div class="card-title">专长标签</div>
        <div class="cell-tags">${e.tags.map(t=>`<span class="tag tag-gray">${t}</span>`).join('')}</div>
      </div>
      <div class="modal-foot">
        <button class="btn btn-outline" onclick="Admin.closeModal()">关闭</button>
        <button class="btn" onclick="Admin.toast('已打开排班编辑');Admin.closeModal()">排班</button>
      </div>
    `);
  },

  // ===== 医院对接 =====
  renderHospitals(el) {
    el.innerHTML = `
      <div class="page-head"><h2>医院对接</h2><div>${MockData.hospitals.length} 家医院</div></div>
      <div class="toolbar"><button class="btn btn-sm">+ 新增医院</button></div>
      <div class="hospital-grid">
        ${MockData.hospitals.map(h => `
          <div class="hospital-card">
            <div class="hc-head">
              <div>
                <div class="hc-name">🏥 ${h.name}</div>
                <div class="hc-sub">科室：${h.dept}</div>
              </div>
              <span class="status-badge ${h.status==='已合作'?'accepted':'pending'}">${h.status}</span>
            </div>
            <div class="hc-body">
              <div class="pb-row"><span class="pb-label">对接人</span><span class="pb-value">${h.contact}</span></div>
              <div class="pb-row"><span class="pb-label">电话</span><span class="pb-value">${h.phone}</span></div>
              <div class="pb-row"><span class="pb-label">绿色通道</span><span class="pb-value">${h.greenChannel?'<span class="tag tag-success">已开通</span>':'<span class="tag tag-gray">未开通</span>'}</span></div>
              <div class="pb-row"><span class="pb-label">累计订单</span><span class="pb-value">${h.orders}</span></div>
            </div>
            <div class="hc-actions">
              ${h.status === '已合作' ?
                `<button class="btn btn-outline btn-sm" onclick="Admin.toast('已发起绿色通道预约')">绿色通道</button>
                 <button class="btn btn-sm" onclick="Admin.toast('已拨号 ${h.phone}')">📞 联系</button>` :
                `<button class="btn btn-sm" onclick="Admin.toast('已发送合作邀请')">推进合作</button>`
              }
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ===== 服务跟踪 =====
  renderTrack(el) {
    const serving = NeedPool.list.filter(n => n.status === '服务中' || n.status === '已对接' || n.status === '已分配');
    el.innerHTML = `
      <div class="page-head"><h2>服务跟踪</h2><div>实时位置与进度</div></div>
      <div class="kpi-grid">
        <div class="kpi-card kpi-blue"><div class="kpi-num">${NeedPool.list.filter(n=>n.status==='服务中').length}</div><div class="kpi-label">服务中</div></div>
        <div class="kpi-card kpi-warn"><div class="kpi-num">${NeedPool.list.filter(n=>n.status==='已分配').length}</div><div class="kpi-label">待签到</div></div>
        <div class="kpi-card"><div class="kpi-num">${NeedPool.list.filter(n=>n.status==='已对接').length}</div><div class="kpi-label">待开始</div></div>
        <div class="kpi-card kpi-green"><div class="kpi-num">${NeedPool.list.filter(n=>n.status==='已完成').length}</div><div class="kpi-label">已完成</div></div>
      </div>
      ${serving.length === 0 ? '<div class="empty"><div class="em-icon">💤</div><div>暂无进行中订单</div></div>' :
        `<div class="table-card">
          <table class="data-table">
            <thead><tr><th>患者</th><th>医院/科室</th><th>陪诊师</th><th>状态</th><th>进度</th><th>操作</th></tr></thead>
            <tbody>
              ${serving.map(n => {
                const flow = ['待处理','已分配','已对接','服务中','已完成'];
                const idx = flow.indexOf(n.status);
                return `
                <tr>
                  <td>${n.patientName}</td>
                  <td><div>${n.hospital}</div><div class="cp-sub">${n.dept} · ${n.date}</div></td>
                  <td>${n.escortName || '-'}</td>
                  <td><span class="status-badge ${n.status==='服务中'?'serving':'accepted'}">${n.status}</span></td>
                  <td><div class="mini-step">${flow.map((s,i)=>`<span class="ms-dot ${i<idx?'done':''} ${i===idx?'active':''}"></span>`).join('')}</div></td>
                  <td><button class="btn-link" onclick="Admin.openNeed('${n.id}')">详情</button></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>`
      }
    `;
  },

  // ===== 财务结算 =====
  renderFinance(el) {
    const f = MockData.finance;
    el.innerHTML = `
      <div class="page-head"><h2>财务结算</h2><div>订单 · 对账 · 抽佣</div></div>
      <div class="kpi-grid">
        <div class="kpi-card kpi-green"><div class="kpi-num">¥${f.monthRevenue.toLocaleString()}</div><div class="kpi-label">本月营收</div></div>
        <div class="kpi-card kpi-blue"><div class="kpi-num">¥${f.weekRevenue.toLocaleString()}</div><div class="kpi-label">本周营收</div></div>
        <div class="kpi-card"><div class="kpi-num">¥${f.todayRevenue}</div><div class="kpi-label">今日营收</div></div>
        <div class="kpi-card kpi-warn"><div class="kpi-num">¥${f.pending}</div><div class="kpi-label">待结算</div></div>
        <div class="kpi-card kpi-green"><div class="kpi-num">¥${f.settled.toLocaleString()}</div><div class="kpi-label">已结算</div></div>
        <div class="kpi-card"><div class="kpi-num">${(f.commissionRate*100)}%</div><div class="kpi-label">平台抽佣</div></div>
      </div>
      <div class="toolbar">
        <input class="tb-search" placeholder="🔍 搜索订单/患者" />
        <select class="tb-select"><option>全部状态</option><option>已结算</option><option>待结算</option></select>
        <button class="btn btn-sm" onclick="Admin.toast('已一键结算 ${f.pending} 元')">一键结算待结算</button>
      </div>
      <div class="table-card">
        <table class="data-table">
          <thead><tr><th>账单号</th><th>患者</th><th>陪诊师</th><th>类型</th><th>金额</th><th>平台抽佣</th><th>陪诊师所得</th><th>状态</th><th>时间</th></tr></thead>
          <tbody>
            ${f.bills.map(b => `
              <tr>
                <td>${b.id}</td>
                <td>${b.patient}</td>
                <td>${b.escort}</td>
                <td>${b.type}</td>
                <td>¥${b.amount}</td>
                <td>¥${(b.amount * f.commissionRate).toFixed(0)}</td>
                <td>¥${(b.amount * (1 - f.commissionRate)).toFixed(0)}</td>
                <td><span class="status-badge ${b.status==='已结算'?'done':'pending'}">${b.status}</span></td>
                <td>${b.time}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ===== 评价反馈 =====
  renderReviews(el) {
    el.innerHTML = `
      <div class="page-head"><h2>评价反馈</h2><div>差评自动触发回访工单</div></div>
      <div class="kpi-grid">
        <div class="kpi-card kpi-green"><div class="kpi-num">${MockData.kpi.satisfaction}</div><div class="kpi-label">平均满意度</div></div>
        <div class="kpi-card"><div class="kpi-num">${MockData.reviews.length}</div><div class="kpi-label">总评价</div></div>
        <div class="kpi-card kpi-warn"><div class="kpi-num">${MockData.reviews.filter(r=>r.star<=3).length}</div><div class="kpi-label">差评待处理</div></div>
        <div class="kpi-card kpi-green"><div class="kpi-num">${MockData.reviews.filter(r=>r.star>=5).length}</div><div class="kpi-label">好评数</div></div>
      </div>
      <div class="reviews-list">
        ${MockData.reviews.map(r => `
          <div class="review-card ${r.star<=3?'review-bad':''}">
            <div class="rv-head">
              <div class="rv-patient">${r.patient} → ${r.escort}</div>
              <div class="rv-star">${'⭐'.repeat(r.star)}<span style="color:#ddd">${'⭐'.repeat(5-r.star)}</span></div>
            </div>
            <div class="rv-text">"${r.text}"</div>
            <div class="rv-tags">${r.tags.map(t=>`<span class="tag tag-gray">${t}</span>`).join('')}</div>
            <div class="rv-foot">
              <span class="cp-sub">${r.time} · ${r.id}</span>
              ${r.status === '差评待处理' ? `<button class="btn btn-outline btn-sm" onclick="Admin.toast('已创建回访工单')">创建回访工单</button>` : `<span class="tag tag-success">已处理</span>`}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ===== 系统设置 =====
  renderSystem(el) {
    el.innerHTML = `
      <div class="page-head"><h2>系统设置</h2><div>价格 · AI · 审计 · 公告</div></div>
      <div class="setting-grid">
        <div class="modal-card">
          <div class="card-title">💰 价格配置</div>
          <div class="pb-row"><span class="pb-label">半程陪诊</span><span class="pb-value">¥298 / 4小时</span></div>
          <div class="pb-row"><span class="pb-label">全程陪诊</span><span class="pb-value">¥598 / 全程</span></div>
          <div class="pb-row"><span class="pb-label">代办跑腿</span><span class="pb-value">¥98 / 次</span></div>
          <div class="pb-row"><span class="pb-label">陪同复诊</span><span class="pb-value">¥398 / 次</span></div>
          <button class="btn btn-outline btn-sm" style="margin-top:10px;" onclick="Admin.toast('打开价格编辑')">编辑</button>
        </div>
        <div class="modal-card">
          <div class="card-title">🤖 AI 模型监控</div>
          <div class="ai-monitor-row"><span>需求理解准确率</span><div class="am-bar"><div style="width:96.2%"></div></div><span style="color:var(--success)">96.2%</span></div>
          <div class="ai-monitor-row"><span>智能派单准确率</span><div class="am-bar"><div style="width:94.8%"></div></div><span style="color:var(--success)">94.8%</span></div>
          <div class="ai-monitor-row"><span>情绪识别准确率</span><div class="am-bar"><div style="width:91.5%"></div></div><span style="color:var(--success)">91.5%</span></div>
          <div class="ai-monitor-row"><span>状态</span><div></div><span class="status-badge accepted">运行正常</span></div>
        </div>
        <div class="modal-card">
          <div class="card-title">📜 审计日志</div>
          <div class="audit-log">
            ${new Date().toLocaleTimeString('zh-CN')} 管理员分配订单 #N001 → 李敏<br>
            ${new Date(Date.now()-3600000).toLocaleTimeString('zh-CN')} 新需求来自患者 王秀兰<br>
            ${new Date(Date.now()-7200000).toLocaleTimeString('zh-CN')} 医院 协和医院 绿色通道已确认<br>
            ${new Date(Date.now()-86400000).toLocaleTimeString('zh-CN')} 系统：每日数据备份完成
          </div>
        </div>
        <div class="modal-card">
          <div class="card-title">📢 公告推送</div>
          <div class="cp-sub">最近公告：07-14 系统升级至 V2.0</div>
          <button class="btn btn-outline btn-sm" style="margin-top:10px;" onclick="Admin.toast('打开公告编辑器')">+ 新建公告</button>
        </div>
      </div>
    `;
  },

  // ===== 弹窗/Toast =====
  modal(html) {
    let m = document.getElementById('_modal');
    if (!m) {
      m = document.createElement('div');
      m.id = '_modal';
      m.className = 'modal-mask';
      m.innerHTML = '<div class="modal-box"><div class="modal-body" id="_modalBody"></div></div>';
      m.addEventListener('click', e => { if (e.target === m) this.closeModal(); });
      document.body.appendChild(m);
    }
    document.getElementById('_modalBody').innerHTML = html;
    m.style.display = 'flex';
  },

  closeModal() {
    const m = document.getElementById('_modal');
    if (m) m.style.display = 'none';
  },

  toast(msg) {
    let t = document.getElementById('_toast');
    if (!t) {
      t = document.createElement('div');
      t.id = '_toast';
      t.style.cssText = 'position:fixed; left:50%; top:60px; transform:translateX(-50%); background:rgba(0,0,0,0.85); color:#fff; padding:14px 20px; border-radius:12px; font-size:13px; z-index:99999; max-width:80%; text-align:center; line-height:1.5; white-space:pre-line;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.display = 'block';
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.style.display = 'none', 2500);
  },
};
