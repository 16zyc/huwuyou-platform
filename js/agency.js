// ========== 机构端 ==========
const Agency = {
  render(tab, el) {
    if (tab === 0) this.renderDashboard(el);
    else if (tab === 1) this.renderRisk(el);
    else if (tab === 2) this.renderTeam(el);
    else this.renderFinance(el);
  },

  // 驾驶舱
  renderDashboard(el) {
    const d = MockData.agency;
    el.innerHTML = `
      <div class="section-title">
        <h3>📊 运营驾驶舱</h3>
        <span class="tag tag-green">实时</span>
      </div>

      <!-- KPI -->
      <div class="kpi-grid">
        ${d.kpi.map(k => `
          <div class="kpi-card ${k.theme}">
            <div class="kp-icon">${k.icon}</div>
            <div class="kp-label">${k.label}</div>
            <div class="kp-num">${k.num}</div>
            <div class="kp-trend ${k.up ? 'up' : 'down'}">${k.up ? '▲' : '▼'} ${k.trend}</div>
          </div>
        `).join('')}
      </div>

      <!-- 风险预警 -->
      <div class="section-title">
        <h3>⚠️ 风险预警</h3>
        <span class="tag tag-red">${d.risks.length} 待处理</span>
      </div>
      ${d.risks.map(r => `
        <div class="risk-item ${r.type === 'warn' ? 'warn' : ''}">
          <div class="ri-icon">${r.icon}</div>
          <div class="ri-content">
            <div class="ri-title">${r.title}</div>
            <div class="ri-desc">${r.desc}</div>
          </div>
          <div class="ri-time">${r.time}</div>
        </div>
      `).join('')}

      <!-- AI 质控提示 -->
      <div class="ai-tip" style="margin-top:14px;">
        <div class="ai-icon">AI</div>
        <div class="ai-content">
          <div class="ai-title">🧠 AI 质控大脑</div>
          <div class="ai-text">今日服务录音已完成 32 单语音转文字与情绪识别分析，整体满意度稳定。建议关注陪诊师 <b>刘强</b> 的情绪波动，已自动生成成长建议。</div>
        </div>
      </div>
    `;
  },

  // 风险预警列表
  renderRisk(el) {
    const d = MockData.agency;
    el.innerHTML = `
      <div class="section-title">
        <h3>⚠️ 风险预警中心</h3>
        <span class="tag tag-red">${d.risks.length} 待处理</span>
      </div>
      ${d.risks.map(r => `
        <div class="card">
          <div style="display:flex; align-items:flex-start; gap:10px;">
            <div style="font-size:24px;">${r.icon}</div>
            <div style="flex:1;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:14px; font-weight:700;">${r.title}</span>
                <span class="tag ${r.type==='err'?'tag-red':'tag-orange'}">${r.type==='err'?'紧急':'提醒'}</span>
              </div>
              <div style="font-size:12px; color:var(--text-2); margin-top:4px;">${r.desc}</div>
              <div style="font-size:11px; color:var(--text-3); margin-top:6px;">🕐 ${r.time}</div>
              <div style="display:flex; gap:8px; margin-top:10px;">
                <button class="btn btn-sm btn-outline" onclick="Agency.toast('已标记为已知')">标记已知</button>
                <button class="btn btn-sm" onclick="Agency.toast('已创建工单，主管将在24小时内回访')">立即处理</button>
              </div>
            </div>
          </div>
        </div>
      `).join('')}

      <div class="ai-tip" style="margin-top:14px;">
        <div class="ai-icon">AI</div>
        <div class="ai-content">
          <div class="ai-title">📋 差评预警流程</div>
          <div class="ai-text">当评分 ≤3 星时，系统自动创建工单推送至机构主管，要求 24 小时内电话回访，回访记录存档。</div>
        </div>
      </div>
    `;
  },

  // 陪诊师档案
  renderTeam(el) {
    const d = MockData.agency;
    el.innerHTML = `
      <div class="section-title">
        <h3>👥 陪诊师档案</h3>
        <span class="tag tag-blue">${d.escorts.length} 人</span>
      </div>

      <!-- 排行榜 -->
      <div class="card">
        <div style="font-size:13px; font-weight:700; margin-bottom:10px;">🏆 满意度排行</div>
        ${d.escorts.map((e, i) => `
          <div class="profile-row" onclick="Agency.toast('查看 ${e.name} 详细档案')">
            <div style="font-size:14px; font-weight:700; color:var(--text-3); width:20px;">${i + 1}</div>
            <div class="pr-avatar">${e.initial}</div>
            <div class="pr-info">
              <div class="pr-name">${e.name}</div>
              <div class="pr-meta">${e.meta}</div>
            </div>
            <div class="pr-score">${e.score}</div>
          </div>
        `).join('')}
      </div>

      <!-- AI 成长建议 -->
      <div class="section-title"><h3>🧠 AI 成长建议</h3></div>
      <div class="card card-warm">
        <div style="display:flex; align-items:flex-start; gap:10px;">
          <div style="font-size:22px;">👨‍⚕️</div>
          <div>
            <div style="font-weight:700;">刘强 · 综合评分 4.79</div>
            <div style="font-size:12px; color:var(--text-2); margin-top:4px;">💡 AI 建议：需加强儿科知识，可推荐《儿科陪诊应急处理》课程；近期情绪波动较大，建议安排一次导师辅导。</div>
          </div>
        </div>
      </div>
      <div class="card card-blue">
        <div style="display:flex; align-items:flex-start; gap:10px;">
          <div style="font-size:22px;">👩‍⚕️</div>
          <div>
            <div style="font-weight:700;">王芳 · 综合评分 4.85</div>
            <div style="font-size:12px; color:var(--text-2); margin-top:4px;">💡 AI 建议：守时性略有下降，建议优化路线规划；专业度表现优秀，可作为新员工培训导师。</div>
          </div>
        </div>
      </div>
    `;
  },

  // 财务结算
  renderFinance(el) {
    const f = MockData.agency.finance;
    el.innerHTML = `
      <div class="section-title">
        <h3>💰 财务结算</h3>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card warm">
          <div class="kp-icon">📅</div>
          <div class="kp-label">本周劳务报酬</div>
          <div class="kp-num">¥${f.week.toLocaleString()}</div>
          <div class="kp-trend up">▲ 较上周 +8%</div>
        </div>
        <div class="kpi-card blue">
          <div class="kp-icon">📆</div>
          <div class="kp-label">本月累计</div>
          <div class="kp-num">¥${f.month.toLocaleString()}</div>
          <div class="kp-trend up">▲ 较上月 +15%</div>
        </div>
      </div>

      <div class="section-title">
        <h3>📋 待结算清单</h3>
        <span class="tag tag-orange">${f.pending} 笔待打款</span>
      </div>

      <div class="card">
        ${f.list.map(item => `
          <div class="profile-row">
            <div class="pr-avatar">${item.name[0]}</div>
            <div class="pr-info">
              <div class="pr-name">${item.name}</div>
              <div class="pr-meta">劳务报酬</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:15px; font-weight:800; color:var(--primary-dark);">¥${item.amount.toLocaleString()}</div>
              <span class="tag ${item.status==='待打款'?'tag-orange':'tag-green'}">${item.status}</span>
            </div>
          </div>
        `).join('')}
        <button class="btn" style="margin-top:14px;" onclick="Agency.toast('✅ 已发起在线打款申请，共 ${f.pending} 笔')">一键打款（待打款部分）</button>
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
