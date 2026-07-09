// ========== 陪诊师端 ==========
const Escort = {
  render(tab, el) {
    if (tab === 0) this.renderWorkbench(el);
    else if (tab === 1) this.renderInService(el);
    else if (tab === 2) this.renderGrowth(el);
    else this.renderProfile(el);
  },

  // 工作台
  renderWorkbench(el) {
    const d = MockData.escort;
    el.innerHTML = `
      <!-- 收入卡 -->
      <div class="income-card">
        <div class="ic-label">💰 今日收入预估</div>
        <div class="ic-num">¥${d.user.todayIncome}</div>
        <div class="ic-row">
          <span>⭐ ${d.user.rankLabel} · 第 ${d.user.rank} 名</span>
          <span>•</span>
          <span>本月累计 ¥9,860</span>
        </div>
      </div>

      <!-- 订单池 -->
      <div class="section-title">
        <h3>🎯 AI 智能推荐订单</h3>
        <span class="tag tag-blue">按契合度排序</span>
      </div>
      ${d.orderPool.map(o => `
        <div class="order-pool-item">
          <div class="op-head">
            <span class="op-patient">${o.patient} · ${o.gender}/${o.age}岁</span>
            <span class="op-match">${o.match}% 契合</span>
          </div>
          <div class="op-info">
            <span>🏥 ${o.hospital} · ${o.dept}</span>
            <span>🕐 ${o.time}</span>
            <span>📍 ${o.distance}</span>
          </div>
          <div class="op-tags">
            <span class="tag tag-orange">${o.type}</span>
            ${o.tags.map(t => `<span class="tag tag-gray">${t}</span>`).join('')}
          </div>
          <div style="font-size:11px; color:var(--secondary); margin-top:4px;">💡 AI：该订单与您过往经验匹配度 ${o.match}%</div>
          <div class="op-actions">
            <button class="btn btn-outline btn-sm" onclick="Escort.toast('已忽略订单 ${o.id}')">忽略</button>
            <button class="btn btn-sm" onclick="Escort.acceptOrder('${o.id}', '${o.patient}')">立即接单</button>
          </div>
        </div>
      `).join('')}
    `;
  },

  // 陪诊中辅助
  renderInService(el) {
    const s = MockData.escort.inService;
    el.innerHTML = `
      <div class="section-title">
        <h3>🧭 陪诊中 · AI 副驾驶</h3>
        <span class="tag tag-green">服务中</span>
      </div>

      <!-- 患者信息 -->
      <div class="card card-warm">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:15px; font-weight:700;">${s.patient.name} · ${s.patient.age}岁</div>
            <div style="font-size:12px; color:var(--text-2); margin-top:4px;">
              ${s.patient.tags.map(t => `<span class="tag tag-orange" style="margin-right:4px;">${t}</span>`).join('')}
            </div>
          </div>
          <button class="btn btn-sm btn-ghost" onclick="Escort.toast('查看完整病历（已脱敏）')">📋 病历</button>
        </div>
      </div>

      <!-- 院内路径 -->
      <div class="card">
        <div style="font-size:13px; font-weight:700; margin-bottom:8px;">🗺️ 院内最优路径 · ${s.hospital}</div>
        <div class="path-map">
          <div class="pm-grid"></div>
          <div class="pm-path"></div>
          <div class="pm-spot" style="left:20%; top:70%"></div>
          <div class="pm-spot" style="left:45%; top:50%"></div>
          <div class="pm-spot" style="left:70%; top:25%; background:var(--primary)"></div>
          <div class="pm-label" style="left:10%; top:78%">门诊大厅</div>
          <div class="pm-label" style="left:38%; top:42%">电梯</div>
          <div class="pm-label" style="right:10%; top:18%; color:var(--primary-dark)">心内科 3F</div>
        </div>
        <div style="font-size:11px; color:var(--text-3); margin-top:6px;">📍 预计步行 5 分钟 · 已避开就诊高峰路线</div>
      </div>

      <!-- AI 话术提醒 -->
      <div class="ai-tip">
        <div class="ai-icon">AI</div>
        <div class="ai-content">
          <div class="ai-title">💡 ${s.aiTip.title}</div>
          <div class="ai-text">${s.aiTip.text}</div>
        </div>
      </div>

      <!-- 物品清单 -->
      <div class="card">
        <div style="font-size:13px; font-weight:700; margin-bottom:6px;">🎒 物品清单核对</div>
        <div class="checklist" id="checklist">
          ${s.checklist.map((c, i) => `
            <div class="cl-item ${c.done ? 'done' : ''}" data-idx="${i}">
              <div class="cl-check">✓</div>
              <div class="cl-name">${c.name}</div>
              <div class="cl-cam" onclick="Escort.toast('拍照确认 ${c.name}')">📷</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 突发上报 -->
      <div class="section-title"><h3>🚨 突发情况上报</h3></div>
      <div class="action-grid">
        <div class="ag-item" onclick="Escort.toast('已上报：医生停诊')">
          <div class="ag-icon">🚫</div>
          <div class="ag-name">医生停诊</div>
        </div>
        <div class="ag-item" onclick="Escort.toast('已上报：患者不适，主管已收到')">
          <div class="ag-icon">🤒</div>
          <div class="ag-name">患者不适</div>
        </div>
        <div class="ag-item" onclick="Escort.toast('已上报：排队超时')">
          <div class="ag-icon">⏰</div>
          <div class="ag-name">排队超时</div>
        </div>
        <div class="ag-item" onclick="Escort.toast('已上报：其他突发情况')">
          <div class="ag-icon">📝</div>
          <div class="ag-name">其他上报</div>
        </div>
      </div>

      <button class="btn" style="background:var(--success);" onclick="Escort.toast('✅ 服务签退已发起，等待患者验证码确认')">完成服务 · 签退</button>
    `;

    // 清单勾选
    document.querySelectorAll('#checklist .cl-item').forEach(item => {
      item.addEventListener('click', e => {
        if (e.target.classList.contains('cl-cam')) return;
        const idx = parseInt(item.dataset.idx);
        const c = MockData.escort.inService.checklist[idx];
        c.done = !c.done;
        item.classList.toggle('done', c.done);
      });
    });
  },

  // 成长墙
  renderGrowth(el) {
    const g = MockData.escort.growth;
    el.innerHTML = `
      <!-- 综合评分 -->
      <div class="card" style="text-align:center;">
        <div style="font-size:13px; color:var(--text-3);">我的综合评分</div>
        <div class="radar-box">
          <div class="rb-score">${g.score}</div>
          <div class="rb-label">/ 5.0 · 超越 96% 陪诊师</div>
          ${this.radarSvg(g.radar)}
        </div>
      </div>

      <!-- 感动瞬间 -->
      <div class="section-title">
        <h3>💝 感动瞬间墙</h3>
        <span class="tag tag-orange">患者好评</span>
      </div>
      <div class="touch-wall">
        ${g.touchWall.map(t => `
          <div class="tw-item">
            <div class="tw-quote">"${t.quote}"</div>
            <div class="tw-from">${t.from}</div>
          </div>
        `).join('')}
      </div>

      <!-- 学习中心 -->
      <div class="section-title">
        <h3>📚 AI 推荐学习</h3>
        <span class="more">全部 ›</span>
      </div>
      ${g.learn.map(l => `
        <div class="learn-item" onclick="Escort.toast('开始学习：${l.title}')">
          <div class="li-thumb">${l.icon}</div>
          <div style="flex:1;">
            <div class="li-title">${l.title}</div>
            <div class="li-meta">${l.meta}</div>
          </div>
          <span style="color:var(--text-3)">›</span>
        </div>
      `).join('')}
    `;
  },

  // 雷达图 SVG
  radarSvg(radar) {
    const keys = Object.keys(radar);
    const vals = keys.map(k => radar[k]);
    const cx = 120, cy = 120, r = 80;
    const n = keys.length;
    const angle = i => -Math.PI / 2 + (i * 2 * Math.PI / n);
    const point = (i, radius) => [cx + radius * Math.cos(angle(i)), cy + radius * Math.sin(angle(i))];
    // 背景多边形（4层）
    const levels = [0.25, 0.5, 0.75, 1.0];
    const bgPolys = levels.map(lv => {
      const pts = keys.map((_, i) => point(i, r * lv).join(',')).join(' ');
      return `<polygon points="${pts}" fill="none" stroke="#EFEFEF" stroke-width="1"/>`;
    }).join('');
    // 数据多边形
    const dataPts = vals.map((v, i) => point(i, r * (v / 5)).join(',')).join(' ');
    // 轴线
    const axes = keys.map((_, i) => {
      const [x, y] = point(i, r);
      return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="#EFEFEF" stroke-width="1"/>`;
    }).join('');
    // 标签
    const labels = keys.map((k, i) => {
      const [x, y] = point(i, r + 16);
      return `<text x="${x}" y="${y}" text-anchor="middle" font-size="11" fill="#555" font-weight="600">${k}</text>`;
    }).join('');
    // 数值
    const valTexts = keys.map((k, i) => {
      const [x, y] = point(i, r * (vals[i] / 5));
      return `<text x="${x}" y="${y - 4}" text-anchor="middle" font-size="10" fill="#FF8A3D" font-weight="700">${vals[i]}</text>`;
    }).join('');

    return `
      <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${bgPolys}
        ${axes}
        <polygon points="${dataPts}" fill="rgba(255,138,61,0.25)" stroke="#FF8A3D" stroke-width="2"/>
        ${vals.map((v, i) => {
          const [x, y] = point(i, r * (v / 5));
          return `<circle cx="${x}" cy="${y}" r="3" fill="#FF8A3D"/>`;
        }).join('')}
        ${labels}
        ${valTexts}
      </svg>
    `;
  },

  // 我的
  renderProfile(el) {
    const u = MockData.escort.user;
    el.innerHTML = `
      <div class="card" style="text-align:center; padding:20px;">
        <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:26px;font-weight:700;">${u.avatar}</div>
        <div style="margin-top:8px; font-size:17px; font-weight:700;">${u.name}</div>
        <div style="font-size:12px; color:var(--text-3); margin-top:2px;">⭐ ${MockData.escort.growth.score} 分 · 金牌陪诊师</div>
      </div>

      <div class="card">
        <div style="display:flex; justify-content:space-around; text-align:center;">
          <div>
            <div style="font-size:22px; font-weight:800; color:var(--primary-dark);">328</div>
            <div style="font-size:11px; color:var(--text-3);">累计接单</div>
          </div>
          <div>
            <div style="font-size:22px; font-weight:800; color:var(--secondary);">98%</div>
            <div style="font-size:11px; color:var(--text-3);">完成率</div>
          </div>
          <div>
            <div style="font-size:22px; font-weight:800; color:var(--success);">4.92</div>
            <div style="font-size:11px; color:var(--text-3);">满意度</div>
          </div>
        </div>
      </div>

      <div class="card">
        <div style="font-size:13px; font-weight:700; margin-bottom:10px;">我的工作</div>
        <div class="config-row" onclick="Escort.toast('查看接单历史')"><span class="cr-label">📋 接单历史</span><span style="color:var(--text-3)">›</span></div>
        <div class="config-row" onclick="Escort.toast('查看收入明细')"><span class="cr-label">💰 收入明细</span><span style="color:var(--text-3)">›</span></div>
        <div class="config-row" onclick="Escort.toast('打开学习中心')"><span class="cr-label">📚 学习中心</span><span style="color:var(--text-3)">›</span></div>
        <div class="config-row" onclick="Escort.toast('打开设置')"><span class="cr-label">⚙️ 设置</span><span style="color:var(--text-3)">›</span></div>
      </div>
    `;
  },

  acceptOrder(id, patient) {
    this.toast(`✅ 已接单 #${id}\n患者：${patient}\n订单已锁定，请按时到达`);
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
