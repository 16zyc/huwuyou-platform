// ========== 管理员端 ==========
const Admin = {
  render(tab, el) {
    if (tab === 0) this.renderConfig(el);
    else if (tab === 1) this.renderModels(el);
    else if (tab === 2) this.renderLogs(el);
    else this.renderNotices(el);
  },

  // 全局配置
  renderConfig(el) {
    const c = MockData.admin.config;
    el.innerHTML = `
      <div class="section-title">
        <h3>⚙️ 全局配置</h3>
        <span class="tag tag-green">已生效</span>
      </div>

      <div class="card">
        ${c.map(item => `
          <div class="config-row">
            <span class="cr-label">${item.label}</span>
            <input class="cr-input" value="${item.value}" onchange="Admin.toast('${item.label} 已更新')">
          </div>
        `).join('')}
      </div>

      <div class="section-title"><h3>🔧 服务 SOP 配置</h3></div>
      <div class="card">
        <div style="font-size:12px; color:var(--text-3); margin-bottom:8px;">💡 低代码配置，运营人员无需开发即可调整标准服务步骤</div>
        <div class="config-row"><span class="cr-label">1. 接单确认</span><span class="cr-value">必填</span></div>
        <div class="config-row"><span class="cr-label">2. GPS 签到</span><span class="cr-value">必填</span></div>
        <div class="config-row"><span class="cr-label">3. 物品核对</span><span class="cr-value">必填</span></div>
        <div class="config-row"><span class="cr-label">4. 服务过程记录</span><span class="cr-value">必填</span></div>
        <div class="config-row"><span class="cr-label">5. 签退（验证码）</span><span class="cr-value">必填</span></div>
        <div class="config-row"><span class="cr-label">6. 客户评价</span><span class="cr-value">必填</span></div>
        <button class="btn btn-outline btn-sm" style="margin-top:10px;" onclick="Admin.toast('已添加新步骤')">+ 添加步骤</button>
      </div>

      <div class="section-title"><h3>🔐 数据隐私配置</h3></div>
      <div class="card card-blue">
        <div style="font-size:12px; color:var(--text-2); margin-bottom:8px;">同态加密已启用 · 患者姓名/病历自动脱敏</div>
        <div class="config-row"><span class="cr-label">患者姓名脱敏</span><span class="cr-value">✅ 已开启</span></div>
        <div class="config-row"><span class="cr-label">病历同态加密</span><span class="cr-value">✅ 已开启</span></div>
        <div class="config-row"><span class="cr-label">陪诊师端显示</span><span class="cr-value">张先生/女士 + 脱敏标签</span></div>
      </div>
    `;
  },

  // AI 模型监控
  renderModels(el) {
    const m = MockData.admin.models;
    el.innerHTML = `
      <div class="section-title">
        <h3>🤖 AI 模型监控</h3>
        <span class="tag tag-green">运行中</span>
      </div>

      <div class="card">
        <div style="font-size:12px; color:var(--text-3); margin-bottom:6px;">实时模型准确率</div>
        ${m.map(model => `
          <div class="model-stat">
            <span class="ms-name">${model.name}</span>
            <div class="ms-bar"><div class="ms-bar-fill" style="width:${model.val}%"></div></div>
            <span class="ms-val">${model.val}%</span>
          </div>
        `).join('')}
      </div>

      <div class="section-title"><h3>📊 模型训练记录</h3></div>
      <div class="card">
        <div class="log-item"><span class="lg-time">今日 09:55</span><span class="lg-level info">训练</span><span class="lg-text">每日例行训练完成，整体准确率提升 0.3%</span></div>
        <div class="log-item"><span class="lg-time">昨日 22:00</span><span class="lg-level info">训练</span><span class="lg-text">情绪识别模型新增 1,280 条样本训练完成</span></div>
        <div class="log-item"><span class="lg-time">昨日 14:30</span><span class="lg-level info">优化</span><span class="lg-text">智能派单模型优化距离权重参数</span></div>
        <div class="log-item"><span class="lg-time">前日 10:12</span><span class="lg-level info">训练</span><span class="lg-text">语义分析模型完成周训练，差评识别提升 1.2%</span></div>
      </div>

      <div class="ai-tip">
        <div class="ai-icon">AI</div>
        <div class="ai-content">
          <div class="ai-title">📈 模型健康度</div>
          <div class="ai-text">所有模型运行正常，准确率均在 92% 以上。建议下周为情绪识别模型补充儿童就诊场景样本。</div>
        </div>
      </div>
    `;
  },

  // 异常审计日志
  renderLogs(el) {
    const logs = MockData.admin.logs;
    el.innerHTML = `
      <div class="section-title">
        <h3>📜 异常审计日志</h3>
        <span class="tag tag-red">实时</span>
      </div>

      <div class="card">
        ${logs.map(l => `
          <div class="log-item">
            <span class="lg-time">${l.time}</span>
            <span class="lg-level ${l.level}">${l.level==='err'?'错误':l.level==='warn'?'警告':'信息'}</span>
            <span class="lg-text">${l.text}</span>
          </div>
        `).join('')}
      </div>

      <div class="section-title"><h3>🎯 风控规则</h3></div>
      <div class="card">
        <div class="config-row"><span class="cr-label">频繁退款（≥3次/24h）</span><span class="cr-value">自动风控</span></div>
        <div class="config-row"><span class="cr-label">虚假定位检测</span><span class="cr-value">限制接单</span></div>
        <div class="config-row"><span class="cr-label">刷单行为识别</span><span class="cr-value">自动封禁</span></div>
        <div class="config-row"><span class="cr-label">陪诊师超时未到达</span><span class="cr-value">通知主管</span></div>
        <div class="config-row"><span class="cr-label">差评 ≤3 星</span><span class="cr-value">创建工单</span></div>
      </div>
    `;
  },

  // 公告管理
  renderNotices(el) {
    const n = MockData.admin.notices;
    el.innerHTML = `
      <div class="section-title">
        <h3>📢 公告管理</h3>
        <button class="btn btn-sm" onclick="Admin.toast('打开公告编辑器')">+ 新建公告</button>
      </div>

      ${n.map(item => `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="flex:1;">
              <div style="font-size:14px; font-weight:700;">${item.title}</div>
              <div style="font-size:12px; color:var(--text-2); margin-top:6px;">🎯 推送范围：${item.target}</div>
              <div style="font-size:11px; color:var(--text-3); margin-top:6px;">🕐 ${item.time}</div>
            </div>
            <span class="tag tag-green">已推送</span>
          </div>
          <div style="display:flex; gap:8px; margin-top:10px;">
            <button class="btn btn-sm btn-outline" onclick="Admin.toast('编辑公告')">编辑</button>
            <button class="btn btn-sm btn-ghost" onclick="Admin.toast('已重新推送')">重新推送</button>
          </div>
        </div>
      `).join('')}

      <div class="section-title"><h3>🎯 精准推送</h3></div>
      <div class="card card-warm">
        <div style="font-size:12px; color:var(--text-2); margin-bottom:8px;">支持按区域、用户群、陪诊师精准推送紧急通知</div>
        <div class="config-row"><span class="cr-label">按区域推送</span><span class="cr-value">北京/上海/广州...</span></div>
        <div class="config-row"><span class="cr-label">按用户群推送</span><span class="cr-value">患者/陪诊师/全部</span></div>
        <div class="config-row"><span class="cr-label">按标签推送</span><span class="cr-value">老人陪诊/儿童陪同...</span></div>
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
