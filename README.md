# Sub-Store 配置模板

一套用于 [Sub-Store](https://github.com/sub-store-org/Sub-Store) 的代理订阅配置模板，支持 Clash 和 sing-box 客户端。

## 📋 项目简介

本项目提供了一系列预配置的模板文件和脚本，帮助用户快速生成符合个人需求的代理配置文件。支持：

- **Clash** - 提供黑名单和白名单两种路由策略模板
- **sing-box** - 支持多个版本（1.9.x、1.10.x、1.11.x、1.12.x）的配置模板

## 📁 项目结构

```
.
├── clash/                          # Clash 配置模板
│   ├── template_white_list.yaml   # 白名单模式（默认直连，仅代理被墙网站）
│   ├── template_black_list.yaml   # 黑名单模式（默认代理，仅直连国内网站）
│   ├── traffic_diversion.yaml     # 流量分流配置
│   ├── rules/                     # 规则模板文件
│   │   ├── rule_template_black.yaml   # 黑名单规则模板
│   │   └── rule_template_white.yaml   # 白名单规则模板
│   └── tools/                     # 辅助工具脚本
│       └── clash.js               # Clash 模板处理脚本
├── sing-box/                      # sing-box 配置模板
│   ├── sing-box.js                # 主配置脚本
│   ├── sing-box.json              # 主配置模板
│   ├── README.md                  # sing-box 说明文档
│   ├── LICENSE                    # 许可证文件
│   ├── 1.9.x/                     # 1.9.x 版本配置
│   │   ├── sing-box.json
│   │   └── sing-box-resolve.json
│   ├── 1.10.x/                    # 1.10.x 版本配置
│   │   ├── sing-box.js
│   │   └── sing-box.json
│   ├── 1.11.x/                    # 1.11.x 版本配置
│   │   ├── sing-box.js
│   │   └── sing-box.json
│   └── 1.12.x/                    # 1.12.x 版本配置
│       ├── sing-box.js
│       └── sing-box.json
└── README.md                      # 项目说明文档
```

## 🚀 使用方法

### 在 Sub-Store 中使用

1. **导入模板脚本**
   - 在 Sub-Store 中打开"配置"页面
   - 将对应的 `.js` 脚本（如 `clash.js` 或 `sing-box.js`）内容复制到脚本编辑器中

2. **配置参数**
   
   **通过 Sub-Store 内部订阅使用：**
   ```javascript
   // 参数示例
   {
     "name": "你的订阅名称",  // Sub-Store 中的订阅或集合名称
     "type": "subscription"   // 或 "collection"
   }
   ```
   
   **通过外部订阅链接使用：**
   ```javascript
   // 参数示例
   {
     "url": "https://your-subscription-url.com"  // 外部订阅链接
   }
   ```

3. **选择模板文件**
   - Clash：选择 `template_white_list.yaml`（白名单）或 `template_black_list.yaml`（黑名单）
   - sing-box：根据客户端版本选择对应的 `sing-box.json`

### Clash 模板说明

#### 白名单模式 (`template_white_list.yaml`)
- **策略**：默认直连，仅代理被墙网站
- **适用场景**：主要访问国内网站，偶尔需要访问国外服务
- **规则优先级**：
  1. 系统应用 → 直连
  2. 广告域名 → 拒绝
  3. 被墙网站（GFW、非中国域名）→ 代理
  4. Telegram → 代理
  5. 其他 → 直连

#### 黑名单模式 (`template_black_list.yaml`)
- **策略**：默认代理，仅直连国内网站
- **适用场景**：主要访问国外网站，偶尔需要访问国内服务
- **规则优先级**：
  1. 系统应用 → 直连
  2. 广告域名 → 拒绝
  3. 国内域名/IP → 直连
  4. 私有网络 → 直连
  5. 其他 → 代理

#### 规则来源
使用 [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules) 提供的规则集，自动更新。

### sing-box 模板说明

#### 功能特性
- 🌐 **智能 DNS 分流**：国内使用阿里 DNS，国外使用 Google DNS
- 🎯 **FakeIP 支持**：提升解析速度
- 📱 **分应用代理**：支持针对不同服务（如 Netflix、YouTube、Telegram 等）设置独立代理
- 🚀 **自动按地区分组**：自动识别并分组香港、台湾、日本、新加坡、美国节点
- ⚡ **自动测速选择**：每个地区提供手动选择和自动测速两种模式
- 🔄 **Clash API 支持**：可使用 Clash 风格的 Web UI（如 metacubexd）管理

#### 节点分组规则
脚本会自动识别节点名称中的地区标识，并分配到对应组：
- `hk` / `hk-auto`：香港节点（关键词：港、hk、hongkong、🇭🇰）
- `tw` / `tw-auto`：台湾节点（关键词：台、tw、taiwan、🇹🇼）
- `jp` / `jp-auto`：日本节点（关键词：日本、jp、japan、🇯🇵）
- `sg` / `sg-auto`：新加坡节点（关键词：新、sg、singapore、🇸🇬）
- `us` / `us-auto`：美国节点（关键词：美、us、unitedstates、🇺🇸）
- `all` / `all-auto`：所有节点

#### 版本选择
- **1.9.x**：包含 DNS 解析配置
- **1.10.x+**：使用新版规则集格式（binary format）

#### 规则来源
使用 [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat) 提供的规则集。

## 🛠️ 自定义配置

### 修改代理规则
1. 编辑对应的模板文件（`.yaml` 或 `.json`）
2. 在 `rules` 或 `rule-providers` 部分添加/修改规则
3. 保存后重新在 Sub-Store 中生成配置

### 添加自定义节点分组
编辑 `.js` 脚本文件，在节点分组逻辑部分添加自定义规则：

```javascript
// 示例：添加韩国节点分组
if (['kr', 'kr-auto'].includes(i.tag)) {
  i.outbounds.push(...getTags(proxies, /韩|kr|korea|🇰🇷/i))
}
```

### 修改规则集源
在模板文件中找到 `rule-providers` 或 `rule_set` 部分，修改 `url` 字段为你偏好的规则源。

## 📝 占位符说明

模板文件使用以下占位符，由脚本自动替换：

### Clash
- `__PROXIES__`：完整的代理节点列表（YAML 格式）
- `__PROXY_NAMES__`：代理节点名称列表（逗号分隔）

### sing-box
- 脚本会自动注入代理节点到 `outbounds` 数组
- 脚本会自动将节点按地区分配到对应的 selector/urltest 分组

## ⚠️ 注意事项

1. **规则集更新**：规则集会自动从远程源更新，首次使用时需要联网下载
2. **节点命名**：建议订阅提供商使用标准的地区命名（如包含国旗 emoji 或地区拼音）
3. **版本兼容性**：sing-box 不同版本配置格式可能不兼容，请选择与客户端版本匹配的模板
4. **性能考虑**：大量节点可能影响客户端性能，建议使用节点过滤功能

## 🔗 相关链接

- [Sub-Store 官方仓库](https://github.com/sub-store-org/Sub-Store)
- [Sub-Store 文档](https://www.notion.so/Sub-Store-6259586994d34c11a4ced5c406264b46)
- [Clash Meta](https://github.com/MetaCubeX/mihomo)
- [sing-box](https://github.com/SagerNet/sing-box)
- [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules)
- [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat)

## 📄 许可证

本项目采用 MIT 许可证，详见 [LICENSE](./sing-box/LICENSE) 文件。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**提示**：使用前请先测试配置是否正常工作，建议先在测试环境中验证后再在生产环境使用。
