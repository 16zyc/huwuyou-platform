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
          <div class="service-item" onclick="Patient.toast('${s.name}预约')">
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
          ${d.orders.map(o => `
            <div class="tl-item ${o.statusType}">
              <div class="tl-time">${o.time}</div>
              <div class="tl-title">${o.title}</div>
              <div class="tl-desc">陪诊师：${o.escort} · <span class="tag ${o.statusType==='done'?'tag-green':'tag-orange'}">${o.status}</span></div>
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
};
