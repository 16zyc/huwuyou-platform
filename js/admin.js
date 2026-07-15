// ========== 管理后台（PC优先，手机自适应）==========
const Admin = {
  render(tab, el) {
    if (tab === 0) this.renderDashboard(el);
    else if (tab === 1) this.renderNeeds(el);
    else if (tab === 2) this.renderEscorts(el);
    else if (tab === 3) this.renderHospitals(el);
    else this.renderSettings(el);
  },

  // ===== Tab 1: 工作台 KPI =====
  renderDashboard(el) {
    const k = MockData.kpi;
    const pending = NeedPool.list.filter(n => n.status === '待处理');
    const serving = NeedPool.list.filter(n => n.status === '服务中');
    el.innerHTML = `
      <div class="page-head">
        <h2>运营工作台</h2>
        <div style="font-size:11px; color:var(--text-3);">实时数据 · ${new Date().toLocaleDateString('zh-CN')}</div>
      </div>

      <!-- KPI 卡片 -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-num">${k.todayOrders}</div>
          <div class="kpi-label">今日订单</div>
        </div>
        <div class="kpi-card kpi-warn">
          <div class="kpi-num">${pending.length}</div>
          <div class="kpi-label">待处理需求</div>
        </div>
        <div class="kpi-card kpi-blue">
          <div class="kpi-num">${k.inService}</div>
          <div class="kpi-label">陪诊中</div>
        </div>
        <div class="kpi-card kpi-green">
          <div class="kpi-num">${k.doneRate}%</div>
          <div class="kpi-label">完成率</div>
        </div>
        <div class="kpi-card kpi-green">
          <div class="kpi-num">${k.satisfaction}</div>
          <div class="kpi-label">满意度</div>
        </div>
        <div class="kpi-card kpi-red">
          <div class="kpi-num">${k.complaintRate}%</div>
          <div class="kpi-label">投诉率</div>
        </div>
      </div>

      <!-- 待处理需求提醒 -->
      <div class="section-title">
        <h3>📥 待处理需求（${pending.length}）</h3>
        <span class="more" onclick="App.switchTab(1)">全部 ›</span>
      </div>
      ${pending.length === 0 ? `
        <div class="empty"><div class="em-icon">✅</div><div>暂无待处理需求</div></div>
      ` : pending.slice(0, 3).map(n => `
        <div class="need-row" onclick="Admin.openNeed('${n.id}')">
          <div class="nr-main">
            <div class="nr-patient">${n.patientName} · ${n.gender}/${n.age}岁</div>
            <div class="nr-info">${n.hospital} · ${n.dept} · ${n.date} · ${n.serviceType}</div>
            <div class="nr-tags">
              <span class="tag tag-orange">${n.serviceType}</span>
              ${n.mobility ? `<span class="tag tag-gray">${n.mobility}</span>` : ''}
            </div>
          </div>
          <span class="status-badge pending">${n.status}</span>
        </div>
      `).join('')}

      <!-- 服务中订单 -->
      <div class="section-title">
        <h3>📍 服务中（${serving.length}）</h3>
      </div>
      ${serving.length === 0 ? `
        <div class="empty"><div class="em-icon">💤</div><div>当前无服务中订单</div></div>
      ` : serving.map(n => `
        <div class="need-row">
          <div class="nr-main">
            <div class="nr-patient">${n.patientName} · ${n.hospital} ${n.dept}</div>
            <div class="nr-info">陪诊师：${n.escortName} · ${n.escortPhone}</div>
          </div>
          <span class="status-badge serving">服务中</span>
        </div>
      `).join('')}
    `;
  },

  // ===== Tab 2: 需求处理 - 列表 + 详情 + 分配陪诊师 + 对接医院 =====
  renderNeeds(el) {
    el.innerHTML = `
      <div class="page-head">
        <h2>需求处理</h2>
        <div style="font-size:11px; color:var(--text-3);">患者提交的需求统一在此处理</div>
      </div>
      <div class="filter-bar">
        <button class="filter-btn active" data-f="all">全部（${NeedPool.list.length}）</button>
        <button class="filter-btn" data-f="待处理">待处理（${NeedPool.list.filter(n=>n.status==='待处理').length}）</button>
        <button class="filter-btn" data-f="已分配">已分配</button>
        <button class="filter-btn" data-f="服务中">服务中</button>
        <button class="filter-btn" data-f="已完成">已完成</button>
      </div>
      <div id="needsList"></div>
    `;
    this.renderNeedsList('all');
    // 筛选
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
    el.innerHTML = list.length === 0 ? `
      <div class="empty"><div class="em-icon">📭</div><div>暂无${filter==='all'?'':filter}需求</div></div>
    ` : list.map(n => `
      <div class="need-row" onclick="Admin.openNeed('${n.id}')">
        <div class="nr-main">
          <div class="nr-patient">${n.patientName} · ${n.gender}/${n.age}岁 · ${n.phone}</div>
          <div class="nr-info">${n.hospital} · ${n.dept} · 期望 ${n.date} · ${n.serviceType}</div>
          <div class="nr-tags">
            <span class="tag tag-orange">${n.serviceType}</span>
            ${n.history ? `<span class="tag tag-gray">${n.history.slice(0,6)}</span>` : ''}
            ${n.mobility ? `<span class="tag tag-gray">${n.mobility}</span>` : ''}
            ${n.allergy && n.allergy !== '无' ? `<span class="tag tag-red">${n.allergy}</span>` : ''}
          </div>
          <div style="font-size:11px; color:var(--text-3); margin-top:4px;">提交：${n.createTime} · 编号 ${n.id}</div>
        </div>
        <span class="status-badge ${n.status==='待处理'?'pending':n.status==='已分配'?'accepted':n.status==='已对接'?'accepted':n.status==='服务中'?'serving':'done'}">${n.status}</span>
      </div>
    `).join('');
  },

  // 需求详情 + 分配陪诊师 + 对接医院
  openNeed(id) {
    const n = NeedPool.getById(id);
    if (!n) return;
    const screen = document.getElementById('screen');
    screen.classList.remove('fade-in'); void screen.offsetWidth; screen.classList.add('fade-in');
    // AI 推荐匹配的陪诊师
    const recommended = MockData.escorts
      .filter(e => e.status === '空闲')
      .map(e => {
        let score = e.score;
        if (e.tags.some(t => n.history && n.history.includes(t))) score += 3;
        if (e.tags.some(t => n.dept.includes(t))) score += 2;
        if (n.mobility && n.mobility.includes('轮椅') && e.tags.includes('轮椅协助')) score += 5;
        return { ...e, matchScore: Math.min(99, score) };
      })
      .sort((a, b) => b.matchScore - a.matchScore);

    screen.innerHTML = `
      <div class="order-page">
        <div class="order-header">
          <div class="oh-back" onclick="App.switchTab(1)">‹</div>
          <h2>需求详情</h2>
        </div>

        <!-- 状态 -->
        <div class="card" style="text-align:center;">
          <div class="status-badge ${n.status==='待处理'?'pending':n.status==='服务中'?'serving':'done'}" style="font-size:13px; padding:6px 14px;">${n.status}</div>
          <div style="margin-top:8px; font-size:12px; color:var(--text-3);">编号 ${n.id} · ${n.createTime}</div>
        </div>

        <!-- 患者信息 -->
        <div class="card">
          <div class="card-title">👤 患者信息</div>
          <div class="pb-row"><span class="pb-label">姓名</span><span class="pb-value">${n.patientName}</span></div>
          <div class="pb-row"><span class="pb-label">性别/年龄</span><span class="pb-value">${n.gender} / ${n.age}岁</span></div>
          <div class="pb-row"><span class="pb-label">联系电话</span><span class="pb-value">${n.phone}</span></div>
          <div class="pb-row"><span class="pb-label">紧急联系人</span><span class="pb-value">${n.emergencyName}（${n.emergencyPhone}）</span></div>
        </div>

        <!-- 病史 -->
        <div class="card">
          <div class="card-title">🩺 病史信息</div>
          <div class="pb-row"><span class="pb-label">既往病史</span><span class="pb-value">${n.history || '无'}</span></div>
          <div class="pb-row"><span class="pb-label">过敏史</span><span class="pb-value" style="color:${n.allergy && n.allergy!=='无'?'var(--danger)':'inherit'}">${n.allergy || '无'}</span></div>
          <div class="pb-row"><span class="pb-label">用药</span><span class="pb-value">${n.medicine || '无'}</span></div>
          <div class="pb-row"><span class="pb-label">行动能力</span><span class="pb-value">${n.mobility || '正常'}</span></div>
          <div class="pb-row"><span class="pb-label">医保</span><span class="pb-value">${n.insurance || '-'}</span></div>
        </div>

        <!-- 服务需求 -->
        <div class="card">
          <div class="card-title">📋 服务需求</div>
          <div class="pb-row"><span class="pb-label">医院</span><span class="pb-value">${n.hospital}</span></div>
          <div class="pb-row"><span class="pb-label">科室</span><span class="pb-value">${n.dept}</span></div>
          <div class="pb-row"><span class="pb-label">期望日期</span><span class="pb-value">${n.date}</span></div>
          <div class="pb-row"><span class="pb-label">服务类型</span><span class="pb-value">${n.serviceType}</span></div>
          ${n.note ? `<div class="pb-row"><span class="pb-label">特殊需求</span><span class="pb-value">${n.note}</span></div>` : ''}
        </div>

        ${n.escortName ? `
          <div class="card">
            <div class="card-title">👩‍⚕️ 已分配陪诊师</div>
            <div class="pb-row"><span class="pb-label">姓名</span><span class="pb-value">${n.escortName}</span></div>
            <div class="pb-row"><span class="pb-label">电话</span><span class="pb-value">${n.escortPhone}</span></div>
            ${n.hospitalContact ? `<div class="pb-row"><span class="pb-label">医院对接人</span><span class="pb-value">${n.hospitalContact}</span></div>` : ''}
          </div>
        ` : ''}

        <!-- AI 推荐 + 操作 -->
        ${n.status === '待处理' ? `
          <div class="card">
            <div class="card-title">🤖 AI 推荐陪诊师</div>
            <div style="font-size:11px; color:var(--secondary); margin-bottom:10px;">基于病史、科室、行动能力、区域综合匹配</div>
            ${recommended.slice(0, 3).map((e, i) => `
              <div class="escort-pick ${i===0?'pick-rec':''}">
                <div class="ep-avatar">${e.avatar}</div>
                <div class="ep-info">
                  <div class="ep-name">${e.name} · ${e.gender}/${e.age}岁 · ⭐${e.star}</div>
                  <div class="ep-tags">${e.tags.slice(0,3).map(t=>`<span class="tag tag-gray">${t}</span>`).join('')}</div>
                </div>
                <div class="ep-match">${e.matchScore}%</div>
                <button class="btn btn-sm" onclick="Admin.assignEscort('${n.id}', '${e.id}')">分配</button>
              </div>
            `).join('')}
          </div>

          <div class="card">
            <div class="card-title">🏥 对接医院</div>
            <div style="font-size:11px; color:var(--text-3); margin-bottom:10px;">确认医院对接人和绿色通道</div>
            ${MockData.hospitals.filter(h=>h.name===n.hospital || h.status==='已合作').slice(0,3).map(h => `
              <div class="hospital-pick">
                <div>
                  <div style="font-weight:600; font-size:13px;">${h.name}</div>
                  <div style="font-size:11px; color:var(--text-3);">对接人：${h.contact} · ${h.phone}</div>
                </div>
                <button class="btn btn-outline btn-sm" onclick="Admin.contactHospital('${n.id}', '${h.contact}')">确认对接</button>
              </div>
            `).join('')}
          </div>

          <button class="btn btn-outline" style="width:100%; margin-top:10px;" onclick="Admin.cancelNeed('${n.id}')">取消该需求</button>
        ` : ''}

        ${n.status === '已分配' || n.status === '已对接' ? `
          <button class="btn" style="width:100%; margin-top:10px;" onclick="Admin.startService('${n.id}')">确认开始服务</button>
        ` : ''}

        ${n.status === '服务中' ? `
          <button class="btn" style="width:100%; margin-top:10px;" onclick="Admin.finishService('${n.id}')">完成服务</button>
        ` : ''}

        <button class="btn btn-outline" style="width:100%; margin-top:10px;" onclick="App.switchTab(1)">返回列表</button>
      </div>
    `;
  },

  // 分配陪诊师
  assignEscort(needId, escortId) {
    const e = MockData.escorts.find(x => x.id === escortId);
    if (!e) return;
    NeedPool.update(needId, {
      status: '已分配',
      escortName: e.name, escortPhone: e.phone,
    });
    e.status = '服务中';
    this.toast(`✅ 已分配陪诊师：${e.name}\n患者端已同步通知`);
    setTimeout(() => this.openNeed(needId), 1200);
  },

  // 对接医院
  contactHospital(needId, contact) {
    NeedPool.update(needId, { status: '已对接', hospitalContact: contact });
    this.toast(`✅ 已对接医院\n联系人：${contact}`);
    setTimeout(() => this.openNeed(needId), 1200);
  },

  // 开始服务
  startService(needId) {
    if (confirm('确认开始服务？\n患者端将进入"陪诊中"状态。')) {
      NeedPool.update(needId, { status: '服务中' });
      this.toast('📍 服务已开始\n患者端已同步');
      setTimeout(() => this.openNeed(needId), 1200);
    }
  },

  // 完成服务
  finishService(needId) {
    if (confirm('确认完成服务？\n订单将进入"已完成"，等待患者评价。')) {
      NeedPool.update(needId, { status: '已完成' });
      this.toast('🎉 服务已完成');
      setTimeout(() => App.switchTab(1), 1200);
    }
  },

  // 取消
  cancelNeed(needId) {
    if (confirm('确认取消该需求？')) {
      NeedPool.update(needId, { status: '已取消' });
      this.toast('需求已取消');
      setTimeout(() => App.switchTab(1), 1200);
    }
  },

  // ===== Tab 3: 陪诊师管理 =====
  renderEscorts(el) {
    el.innerHTML = `
      <div class="page-head">
        <h2>陪诊师管理</h2>
        <div style="font-size:11px; color:var(--text-3);">${MockData.escorts.length} 名陪诊师</div>
      </div>
      ${MockData.escorts.map(e => `
        <div class="card" onclick="Admin.openEscort('${e.id}')">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="escort-avatar">${e.avatar}</div>
            <div style="flex:1;">
              <div style="font-weight:600; font-size:14px;">${e.name} · ${e.gender}/${e.age}岁</div>
              <div style="font-size:11px; color:var(--text-3);">⭐ ${e.star} · ${e.orders}单 · ${e.region}</div>
              <div style="margin-top:4px;">${e.tags.slice(0,3).map(t=>`<span class="tag tag-gray">${t}</span>`).join('')}</div>
            </div>
            <span class="status-badge ${e.status==='空闲'?'accepted':'serving'}">${e.status}</span>
          </div>
        </div>
      `).join('')}
    `;
  },

  openEscort(id) {
    const e = MockData.escorts.find(x => x.id === id);
    if (!e) return;
    this.toast(`${e.name} · ${e.status}\n专长：${e.tags.join('、')}\n电话：${e.phone}`);
  },

  // ===== Tab 4: 医院对接 =====
  renderHospitals(el) {
    el.innerHTML = `
      <div class="page-head">
        <h2>医院对接</h2>
        <div style="font-size:11px; color:var(--text-3);">合作医院与绿色通道</div>
      </div>
      ${MockData.hospitals.map(h => `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-weight:600; font-size:14px;">🏥 ${h.name}</div>
              <div style="font-size:11px; color:var(--text-3); margin-top:4px;">科室：${h.dept}</div>
              <div style="font-size:12px; margin-top:4px;">对接人：${h.contact} · ${h.phone}</div>
            </div>
            <span class="status-badge ${h.status==='已合作'?'accepted':'pending'}">${h.status}</span>
          </div>
          ${h.status === '已合作' ? `
            <button class="btn btn-outline btn-sm" style="margin-top:10px; width:100%;" onclick="Admin.toast('已发起绿色通道预约')">发起绿色通道</button>
          ` : `
            <button class="btn btn-sm" style="margin-top:10px; width:100%;" onclick="Admin.toast('已发送合作邀请')">推进合作</button>
          `}
        </div>
      `).join('')}
    `;
  },

  // ===== Tab 5: 设置 =====
  renderSettings(el) {
    el.innerHTML = `
      <div class="page-head">
        <h2>系统设置</h2>
      </div>
      <div class="card">
        <div class="card-title">💰 价格配置</div>
        <div class="pb-row"><span class="pb-label">半程陪诊</span><span class="pb-value">¥298 / 4小时</span></div>
        <div class="pb-row"><span class="pb-label">全程陪诊</span><span class="pb-value">¥598 / 全程</span></div>
        <div class="pb-row"><span class="pb-label">代办跑腿</span><span class="pb-value">¥98 / 次</span></div>
        <div class="pb-row"><span class="pb-label">陪同复诊</span><span class="pb-value">¥398 / 次</span></div>
      </div>
      <div class="card">
        <div class="card-title">🤖 AI 模型监控</div>
        <div class="pb-row"><span class="pb-label">需求理解准确率</span><span class="pb-value" style="color:var(--success)">96.2%</span></div>
        <div class="pb-row"><span class="pb-label">智能派单准确率</span><span class="pb-value" style="color:var(--success)">94.8%</span></div>
        <div class="pb-row"><span class="pb-label">情绪识别准确率</span><span class="pb-value" style="color:var(--success)">91.5%</span></div>
        <div class="pb-row"><span class="pb-label">状态</span><span class="pb-value"><span class="status-badge accepted">运行正常</span></span></div>
      </div>
      <div class="card">
        <div class="card-title">📜 审计日志</div>
        <div style="font-size:12px; color:var(--text-3); line-height:1.8;">
          ${new Date().toLocaleTimeString('zh-CN')} 管理员分配订单 #N001 → 李敏<br>
          ${new Date(Date.now()-3600000).toLocaleTimeString('zh-CN')} 新需求来自患者 王秀兰<br>
          ${new Date(Date.now()-7200000).toLocaleTimeString('zh-CN')} 医院 协和医院 绿色通道已确认<br>
          ${new Date(Date.now()-86400000).toLocaleTimeString('zh-CN')} 系统：每日数据备份完成
        </div>
      </div>
      <div class="card">
        <div class="card-title">📢 公告推送</div>
        <button class="btn btn-outline btn-sm" style="width:100%;" onclick="Admin.toast('打开公告编辑器')">+ 新建公告</button>
      </div>
    `;
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
