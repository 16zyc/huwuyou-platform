// ========== 患者端 ==========
const Patient = {
  render(tab, el) {
    if (tab === 0) this.renderHome(el);
    else if (tab === 1) this.renderInService(el);
    else if (tab === 2) this.renderReview(el);
    else this.renderProfile(el);
  },

  // 首页
  renderHome(el) {
    const d = MockData.patient;
    el.innerHTML = `
      <!-- 问候卡 -->
      <div class="hero-card">
        <div class="hero-greet">${d.user.name}，下午好 👋</div>
        <div class="hero-weather">
          <span class="weather-icon">${d.weather.icon}</span>
          <span>${d.weather.city} · ${d.weather.text} · ${d.weather.temp}</span>
        </div>
        <div style="margin-top:8px; font-size:12px; color:var(--primary-dark);">💡 ${d.weather.tip}</div>
      </div>

      <!-- 服务入口 -->
      <div class="service-grid">
        ${d.services.map(s => `
          <div class="service-item" onclick="Patient.openOrder('${s.name}')">
            <div class="s-icon" style="background:${s.color}">${s.icon}</div>
            <div class="s-name">${s.name}</div>
            <div class="s-sub">${s.sub}</div>
          </div>
        `).join('')}
      </div>

      <!-- 权益卡 -->
      <div class="equity-card" onclick="Patient.toast('查看权益卡详情')">
        <div class="eq-title">护无忧陪诊卡</div>
        <div class="eq-num">${d.user.equity.total - d.user.equity.used}<span style="font-size:14px; opacity:0.6;"> / ${d.user.equity.total} 次</span></div>
        <div class="eq-desc">剩余可用次数 · 有效期至 2027-07-07</div>
      </div>

      <!-- 订单动态 -->
      <div class="section-title">
        <h3>📋 近期订单</h3>
        <span class="more" onclick="Patient.toast('查看全部订单')">全部 ›</span>
      </div>
      <div class="card">
        <div class="timeline">
          ${this.allOrders().map(o => `
            <div class="tl-item ${o.statusType}" onclick="Patient.openOrderDetail('${o.id}')">
              <div class="tl-time">${o.time}</div>
              <div class="tl-title">${o.title}</div>
              <div class="tl-desc">陪诊师：${o.escort} · <span class="status-badge ${o.statusType}">${o.status}</span></div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="slogan-bar">— 您不孤单，我们全程在 —</div>
    `;
  },

  // 陪诊中
  renderInService(el) {
    const s = MockData.patient.inService;
    const activeIdx = s.steps.findIndex(x => x.active);
    el.innerHTML = `
      <div class="section-title">
        <h3>📍 陪诊服务中</h3>
        <span class="tag tag-green">实时直播</span>
      </div>

      <!-- 地图 -->
      <div class="map-box">
        <div class="map-grid"></div>
        <div class="map-route"></div>
        <div class="escort-pin" style="left:${s.escort.pos}">${s.escort.avatar}</div>
        <div class="hospital-label">${s.hospital}</div>
      </div>

      <!-- 进度步骤条 -->
      <div class="card">
        <div style="font-size:13px; font-weight:700; margin-bottom:6px;">服务进度</div>
        <div class="step-bar">
          ${s.steps.map(st => `
            <div class="step ${st.done ? (st.active?'':'done') : ''} ${st.active?'active':''}"></div>
          `).join('')}
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-3);">
          ${s.steps.map(st => `<span style="${st.active?'color:var(--primary-dark);font-weight:700;':''}">${st.name}</span>`).join('')}
        </div>
      </div>

      <!-- 进度看板 -->
      <div class="card">
        <div style="font-size:13px; font-weight:700; margin-bottom:6px;">📊 实时看板</div>
        <div class="progress-board">
          ${s.board.map(b => `
            <div class="pb-row">
              <span class="pb-label">${b.label}</span>
              <span class="pb-value">${b.value}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 操作 -->
      <div class="action-grid">
        <div class="ag-item" onclick="Patient.toast('已为陪诊师发送关怀提醒 💐')">
          <div class="ag-icon">💧</div>
          <div class="ag-name">给陪诊师送水</div>
        </div>
        <div class="ag-item" onclick="Patient.toast('正在拨打 ${s.escort.phone}')">
          <div class="ag-icon">📞</div>
          <div class="ag-name">联系陪诊师</div>
        </div>
      </div>

      <button class="sos-btn" onclick="Patient.sos()">SOS 紧急求助</button>
    `;
  },

  // 评价
  renderReview(el) {
    const r = MockData.patient.review;
    el.innerHTML = `
      <div class="section-title">
        <h3>🤖 AI 服务报告</h3>
        <span class="tag tag-blue">已生成</span>
      </div>

      <div class="card">
        <div style="font-size:13px; color:var(--text-2); margin-bottom:8px;">本次服务总耗时 <b style="color:var(--primary-dark);">57 分钟</b></div>
        <div class="report-timeline">
          ${r.report.map(item => `
            <div class="rt-item">
              <div class="rt-step">${item.step}</div>
              <div class="rt-time">${item.time}</div>
              <div class="rt-dur">${item.dur}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section-title"><h3>⭐ 为陪诊师评分</h3></div>
      <div class="card">
        <div style="text-align:center; margin-bottom:6px;">
          <div style="width:50px;height:50px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;">李</div>
          <div style="margin-top:6px; font-weight:600;">陪诊师 李敏</div>
        </div>
        <div id="rateBox">
          ${this.rateRow('专业度', 'pro', r.rating.pro)}
          ${this.rateRow('温暖度', 'warm', r.rating.warm)}
          ${this.rateRow('守时性', 'time', r.rating.time)}
        </div>
        <div style="margin-top:10px;">
          <div style="font-size:12px; color:var(--text-3); margin-bottom:6px;">💬 说说让您感动的瞬间：</div>
          <textarea id="reviewText" placeholder="例如：李敏姐一路搀扶我，特别贴心..." style="width:100%; height:70px; padding:10px; border:1px solid var(--line); border-radius:10px; font-size:13px; resize:none; font-family:inherit;"></textarea>
        </div>
      </div>

      <div class="section-title"><h3>💝 感谢金（可选）</h3></div>
      <div class="card">
        <div style="font-size:12px; color:var(--text-3); margin-bottom:8px;">打赏将直接进入陪诊师账户</div>
        <div class="tip-btns" id="tipBtns">
          <button data-amount="6">¥6</button>
          <button data-amount="18">¥18</button>
          <button data-amount="66">¥66</button>
          <button data-amount="88">¥88</button>
        </div>
        <button class="btn" style="margin-top:12px;" onclick="Patient.submitReview()">提交评价</button>
      </div>
    `;

    // 星级交互
    document.querySelectorAll('#rateBox .rate-row').forEach(row => {
      const stars = row.querySelectorAll('.star');
      const key = row.dataset.key;
      stars.forEach((star, i) => {
        star.addEventListener('click', () => {
          MockData.patient.review.rating[key] = i + 1;
          stars.forEach((s, j) => s.classList.toggle('on', j <= i));
        });
      });
    });

    // 打赏按钮
    document.querySelectorAll('#tipBtns button').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#tipBtns button').forEach(b => b.classList.remove('sel'));
        btn.classList.add('sel');
      });
    });
  },

  rateRow(label, key, val) {
    return `
      <div class="rate-row" data-key="${key}">
        <span class="r-label">${label}</span>
        <div class="r-stars">
          ${[1,2,3,4,5].map(i => `<span class="star ${i <= val ? 'on' : ''}">★</span>`).join('')}
        </div>
      </div>
    `;
  },

  // 我的
  renderProfile(el) {
    const u = MockData.patient.user;
    el.innerHTML = `
      <div class="card" style="text-align:center; padding:20px;">
        <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;">${u.avatar}</div>
        <div style="margin-top:8px; font-size:17px; font-weight:700;">${u.name}</div>
        <div style="font-size:12px; color:var(--text-3); margin-top:2px;">护无忧会员 · 2026 年加入</div>
      </div>

      <div class="card">
        <div style="display:flex; justify-content:space-around; text-align:center;">
          <div>
            <div style="font-size:22px; font-weight:800; color:var(--primary-dark);">${u.equity.total - u.equity.used}</div>
            <div style="font-size:11px; color:var(--text-3);">剩余次数</div>
          </div>
          <div>
            <div style="font-size:22px; font-weight:800; color:var(--secondary);">7</div>
            <div style="font-size:11px; color:var(--text-3);">累计服务</div>
          </div>
          <div>
            <div style="font-size:22px; font-weight:800; color:var(--success);">4.96</div>
            <div style="font-size:11px; color:var(--text-3);">我的评分</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div style="font-size:13px; font-weight:700; margin-bottom:10px;">我的服务</div>
        <div class="config-row" onclick="Patient.toast('查看订单')"><span class="cr-label">📋 全部订单</span><span style="color:var(--text-3)">›</span></div>
        <div class="config-row" onclick="Patient.toast('查看权益卡')"><span class="cr-label">💳 权益卡管理</span><span style="color:var(--text-3)">›</span></div>
        <div class="config-row" onclick="Patient.toast('查看收藏')"><span class="cr-label">⭐ 收藏陪诊师</span><span style="color:var(--text-3)">›</span></div>
        <div class="config-row" onclick="Patient.toast('打开设置')"><span class="cr-label">⚙️ 设置</span><span style="color:var(--text-3)">›</span></div>
      </div>
    `;
  },

  // 交互
  sos() {
    if (confirm('确认发送紧急求助？将同时通知机构管理员与陪诊师。')) {
      this.toast('🚨 已发送紧急求助，机构管理员与陪诊师已收到');
    }
  },

  submitReview() {
    const text = document.getElementById('reviewText').value.trim();
    const tip = document.querySelector('#tipBtns button.sel');
    let msg = '✅ 评价已提交，感谢您的反馈！';
    if (text) msg += `\n📝 AI 语义分析已提取标签：#耐心 #专业 #温暖`;
    if (tip) msg += `\n💝 已打赏 ${tip.dataset.amount} 元给陪诊师`;
    this.toast(msg);
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

  // ===== 下单闭环 =====
  // 合并历史订单 + 全局订单池
  allOrders() {
    const map = {
      '待接单': { statusType: 'pending', sort: 0 },
      '已接单': { statusType: 'accepted', sort: 1 },
      '服务中': { statusType: 'serving', sort: 2 },
      '已完成': { statusType: 'done', sort: 3 },
      '已取消': { statusType: 'cancelled', sort: 4 },
    };
    // 全局订单池转换为时间轴格式
    const live = OrderPool.list.map(o => ({
      id: o.id,
      time: o.appointmentTime,
      title: `${o.hospital} - ${o.dept}`,
      escort: o.escort || '待派单',
      status: o.status,
      statusType: (map[o.status] || {}).statusType || 'pending',
      _sort: (map[o.status] || {}).sort ?? 0,
      _live: true,
    }));
    // 历史订单
    const hist = MockData.patient.orders.map(o => ({
      ...o,
      statusType: 'done',
      _sort: 3,
      _live: false,
    }));
    return [...live, ...hist].sort((a, b) => (a._sort - b._sort) || (b._live - a._live));
  },

  // 打开下单页
  openOrder(type) {
    if (type === '我的权益卡') { this.toast('查看权益卡详情'); return; }
    const screen = document.getElementById('screen');
    screen.classList.remove('fade-in');
    void screen.offsetWidth;
    screen.classList.add('fade-in');
    const serviceType = type === '代办跑腿' ? '代办跑腿' : '陪诊';
    screen.innerHTML = `
      <div class="order-page">
        <div class="order-header">
          <div class="oh-back" onclick="App.switchRole('patient')">‹</div>
          <h2>${type}</h2>
        </div>

        <div class="card">
          <div class="form-group">
            <div class="fg-label">就医医院 <span class="required">*</span></div>
            <select class="fg-select" id="f_hospital">
              <option value="">请选择医院</option>
              <option>北京协和医院</option>
              <option>北京同仁医院</option>
              <option>北京大学第一医院</option>
              <option>北京大学第三医院</option>
              <option>中国人民解放军总医院</option>
            </select>
          </div>
          <div class="form-group">
            <div class="fg-label">就诊科室 <span class="required">*</span></div>
            <select class="fg-select" id="f_dept">
              <option value="">请选择科室</option>
              <option>心内科</option><option>神经内科</option><option>消化内科</option>
              <option>呼吸内科</option><option>骨科</option><option>眼科</option>
              <option>耳鼻喉科</option><option>内分泌科</option><option>肿瘤科</option>
              <option>皮肤科</option><option>儿科</option><option>其他</option>
            </select>
          </div>
          <div class="form-group">
            <div class="fg-label">就诊时间 <span class="required">*</span></div>
            <input type="datetime-local" class="fg-input" id="f_time" />
          </div>
        </div>

        <div class="card">
          <div class="form-group">
            <div class="fg-label">选择套餐 <span class="required">*</span></div>
            <div class="fg-options" id="pkgOpts">
              ${serviceType === '陪诊' ? `
                <div class="fg-option sel" data-pkg="4小时套餐" data-price="298">
                  <div class="fo-name">4小时陪诊</div>
                  <div class="fo-price">¥298</div>
                  <div class="fo-sub">单次半程陪护</div>
                </div>
                <div class="fg-option" data-pkg="全程套餐" data-price="598">
                  <div class="fo-name">全程陪诊</div>
                  <div class="fo-price">¥598</div>
                  <div class="fo-sub">挂号到取药全程</div>
                </div>
              ` : `
                <div class="fg-option sel" data-pkg="代取药" data-price="98">
                  <div class="fo-name">代取药</div>
                  <div class="fo-price">¥98</div>
                  <div class="fo-sub">跑腿代取</div>
                </div>
                <div class="fg-option" data-pkg="代问诊" data-price="198">
                  <div class="fo-name">代问诊</div>
                  <div class="fo-price">¥198</div>
                  <div class="fo-sub">代向医生咨询</div>
                </div>
              `}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="form-group">
            <div class="fg-label">患者姓名 <span class="required">*</span></div>
            <input type="text" class="fg-input" id="f_name" placeholder="如：张先生" />
          </div>
          <div class="form-group">
            <div class="fg-label">年龄</div>
            <input type="number" class="fg-input" id="f_age" placeholder="如：65" />
          </div>
          <div class="form-group">
            <div class="fg-label">病情描述 / 特殊需求</div>
            <textarea class="fg-input" id="f_desc" placeholder="如：高血压史、需轮椅协助、耳背等（便于AI匹配专业陪诊师）"></textarea>
          </div>
          <div class="ai-tip" style="margin:0;">
            <div class="ai-icon">AI</div>
            <div class="ai-content">
              <div class="ai-title">🔒 隐息保护</div>
              <div class="ai-text">患者姓名与病情将进行同态加密，陪诊师端仅显示"张先生/女士"及脱敏标签。</div>
            </div>
          </div>
        </div>

        <div class="order-summary">
          <div class="os-price">
            <div class="os-label">实付金额（扣减权益卡 1 次）</div>
            <div class="os-num" id="osPrice">¥${serviceType === '陪诊' ? '298' : '98'}</div>
          </div>
          <button class="btn" onclick="Patient.submitOrder('${type}', '${serviceType}')">提交订单</button>
        </div>
      </div>
    `;

    // 套餐切换
    let curPrice = serviceType === '陪诊' ? 298 : 98;
    document.querySelectorAll('#pkgOpts .fg-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('#pkgOpts .fg-option').forEach(o => o.classList.remove('sel'));
        opt.classList.add('sel');
        curPrice = parseInt(opt.dataset.price);
        document.getElementById('osPrice').textContent = '¥' + curPrice;
      });
    });

    // 默认时间填明天 8:30
    const def = new Date(); def.setDate(def.getDate()+1); def.setHours(8,30,0,0);
    const pad = n => String(n).padStart(2,'0');
    document.getElementById('f_time').value =
      `${def.getFullYear()}-${pad(def.getMonth()+1)}-${pad(def.getDate())}T08:30`;
  },

  // 提交订单
  submitOrder(type, serviceType) {
    const hospital = document.getElementById('f_hospital').value;
    const dept = document.getElementById('f_dept').value;
    const time = document.getElementById('f_time').value;
    const name = document.getElementById('f_name').value.trim();
    const age = document.getElementById('f_age').value.trim();
    const desc = document.getElementById('f_desc').value.trim();
    const pkgSel = document.querySelector('#pkgOpts .fg-option.sel');

    if (!hospital) { this.toast('请选择医院'); return; }
    if (!dept) { this.toast('请选择科室'); return; }
    if (!time) { this.toast('请选择就诊时间'); return; }
    if (!name) { this.toast('请填写患者姓名'); return; }

    // 格式化时间显示
    const dt = new Date(time);
    const pad = n => String(n).padStart(2,'0');
    const timeStr = `${pad(dt.getMonth()+1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;

    // 脱敏姓名
    const masked = name.length <= 1 ? name + '先生' :
      name[0] + (name.includes('女')||name.includes('姐')||name.includes('妈') ? '女士' : '先生');

    // 脱敏标签
    const tags = [];
    if (age && parseInt(age) >= 60) tags.push('老人陪诊');
    if (age && parseInt(age) <= 12) tags.push('儿童陪同');
    if (desc) {
      if (/轮椅|行动|腿|脚/.test(desc)) tags.push('需轮椅');
      if (/高血压|血压/.test(desc)) tags.push('高血压史');
      if (/耳|聋|听/.test(desc)) tags.push('耳背');
      if (/心脏|心/.test(desc)) tags.push('心脏病史');
    }
    if (!tags.length) tags.push(serviceType);

    const pkg = pkgSel.dataset.pkg;
    const price = pkgSel.dataset.price;

    // 加入全局订单池
    const order = OrderPool.add({
      type: serviceType,
      hospital, dept,
      appointmentTime: timeStr,
      rawTime: time,
      patient: masked,
      patientFull: name,
      age: age || '未知',
      pkg, price,
      tags,
      desc,
      escort: '待派单',
      matchBase: 70 + Math.floor(Math.random() * 25),
    });

    // 扣减权益卡
    MockData.patient.user.equity.used++;

    this.toast(`✅ 下单成功！\n订单号 ${order.id}\n已进入陪诊师订单池，等待接单`);

    // 返回首页
    setTimeout(() => {
      App.currentTab = 0;
      App.renderTabbar();
      App.renderScreen();
    }, 1600);
  },

  // 订单详情页
  openOrderDetail(id) {
    const o = OrderPool.getById(id);
    if (!o) { this.toast('历史订单详情'); return; } // 历史订单无详情
    const screen = document.getElementById('screen');
    screen.classList.remove('fade-in');
    void screen.offsetWidth;
    screen.classList.add('fade-in');
    const statusFlow = ['待接单','已接单','服务中','已完成'];
    const curIdx = statusFlow.indexOf(o.status);
    screen.innerHTML = `
      <div class="order-page">
        <div class="order-header">
          <div class="oh-back" onclick="App.switchRole('patient')">‹</div>
          <h2>订单详情</h2>
        </div>

        <div class="card" style="text-align:center;">
          <div class="status-badge ${o.status==='待接单'?'pending':o.status==='已接单'?'accepted':o.status==='服务中'?'serving':'done'}" style="font-size:13px; padding:6px 14px;">
            ${o.status === '待接单' ? '🕐' : o.status === '已接单' ? '✅' : o.status === '服务中' ? '📍' : '🎉'} ${o.status}
          </div>
          <div style="margin-top:10px; font-size:13px; color:var(--text-3);">订单号 ${o.id}</div>
        </div>

        <!-- 状态进度 -->
        <div class="card">
          <div style="font-size:13px; font-weight:700; margin-bottom:8px;">📋 服务进度</div>
          <div class="step-bar">
            ${statusFlow.map((s, i) => `
              <div class="step ${i < curIdx ? 'done' : ''} ${i === curIdx ? 'active' : ''}"></div>
            `).join('')}
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-3);">
            ${statusFlow.map((s, i) => `<span style="${i===curIdx?'color:var(--primary-dark);font-weight:700;':''}">${s}</span>`).join('')}
          </div>
        </div>

        <!-- 订单信息 -->
        <div class="card">
          <div class="pb-row"><span class="pb-label">服务类型</span><span class="pb-value">${o.type}</span></div>
          <div class="pb-row"><span class="pb-label">医院科室</span><span class="pb-value">${o.hospital} · ${o.dept}</span></div>
          <div class="pb-row"><span class="pb-label">就诊时间</span><span class="pb-value">${o.appointmentTime}</span></div>
          <div class="pb-row"><span class="pb-label">套餐</span><span class="pb-value">${o.pkg}</span></div>
          <div class="pb-row"><span class="pb-label">患者</span><span class="pb-value">${o.patient}</span></div>
          <div class="pb-row"><span class="pb-label">陪诊师</span><span class="pb-value">${o.escort}</span></div>
        </div>

        ${o.tags.length ? `
          <div class="card">
            <div style="font-size:13px; font-weight:700; margin-bottom:8px;">🏷️ 脱敏标签（陪诊师可见）</div>
            ${o.tags.map(t => `<span class="tag tag-orange" style="margin-right:4px;">${t}</span>`).join('')}
          </div>
        ` : ''}

        <div class="ai-tip">
          <div class="ai-icon">AI</div>
          <div class="ai-content">
            <div class="ai-title">🤖 AI 就医前准备清单</div>
            <div class="ai-text">已为您发送就医准备清单：携带病历本、身份证、医保卡、既往药盒。明日 ${o.appointmentTime} 天气有雨，记得带伞。</div>
          </div>
        </div>

        ${o.status === '待接单' ? `
          <button class="btn btn-outline" style="margin-top:10px;" onclick="Patient.cancelOrder('${o.id}')">取消订单</button>
        ` : ''}
        ${o.status === '已接单' ? `
          <button class="btn" style="margin-top:10px;" onclick="Patient.goService('${o.id}')">查看陪诊直播 ›</button>
        ` : ''}
        ${o.status === '服务中' ? `
          <button class="btn" style="margin-top:10px;" onclick="Patient.goService('${o.id}')">进入陪诊中</button>
        ` : ''}
        ${o.status === '已完成' ? `
          <button class="btn" style="margin-top:10px;" onclick="App.currentTab=2;App.renderTabbar();App.renderScreen();">去评价</button>
        ` : ''}
      </div>
    `;
  },

  // 取消订单
  cancelOrder(id) {
    if (confirm('确认取消该订单？')) {
      OrderPool.update(id, { status: '已取消' });
      // 恢复权益卡
      MockData.patient.user.equity.used = Math.max(0, MockData.patient.user.equity.used - 1);
      this.toast('订单已取消，权益次数已退回');
      setTimeout(() => { App.currentTab = 0; App.renderTabbar(); App.renderScreen(); }, 1200);
    }
  },

  // 跳转陪诊中
  goService(id) {
    App.currentTab = 1;
    App.renderTabbar();
    App.renderScreen();
  },
};
