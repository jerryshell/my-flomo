# My Flomo

My Flomo 是一个自托管的想法记录及回顾应用，提供与 Flomo 兼容的功能实现。该项目采用前后端分离架构，后端使用 Go 语言开发，前端使用 React 和 TypeScript 构建，支持数据完全自主控制。

## 功能特性

- **Memo 管理**: 支持 Memo 的创建、编辑、删除和查看操作
- **数据导入导出**: 提供 Flomo 数据导入和 CSV 格式的数据交换功能
- **API 兼容**: 实现与 Flomo 兼容的 API 接口规范
- **邮件回顾**: 配置定时任务发送每日 Memo 回顾邮件
- **Telegram Bot 回顾**: 配置 Telegram Bot 接收每日 Memo 回顾消息
- **插件支持**: 通过 API 插件令牌支持第三方应用集成
- **账户管理**: 用户注册、登录、密码修改和账户注销功能
- **数据安全**: 支持用户账户及相关数据的永久删除

## 技术架构

### 后端实现

- **编程语言**: Go
- **Web 框架**: Gin
- **数据存储**: SQLite 数据库，通过 GORM ORM 进行数据操作
- **身份认证**: JWT (JSON Web Token) 机制
- **定时任务**: Cron 表达式调度
- **邮件服务**: SMTP 协议支持
- **Telegram Bot**: 通过 Telegram Bot API 发送每日回顾消息

### 前端实现

- **编程语言**: TypeScript
- **前端框架**: React
- **状态管理**: Recoil
- **路由管理**: React Router DOM
- **构建工具**: Vite
- **HTTP 客户端**: Axios

## 项目结构

```
My Flomo/
├── api/                   # 后端服务
│   ├── config/            # 配置管理
│   ├── db/                # 数据库连接
│   ├── form/              # 表单结构定义
│   ├── handler/           # HTTP 请求处理器
│   ├── middleware/        # 中间件
│   ├── model/             # 数据模型
│   ├── result/            # 响应结果结构
│   ├── route/             # 路由定义
│   ├── service/           # 业务逻辑层
│   ├── store/             # 数据存储层
│   └── util/              # 工具函数
└── web/                   # 前端应用
    ├── src/
    │   ├── api/           # API 接口定义
    │   ├── atoms/         # Recoil 状态原子
    │   ├── components/    # React 组件
    │   ├── interfaces/    # TypeScript 接口定义
    │   └── pages/         # 页面组件
    └── public/            # 静态资源
```

## 安装与部署

### 后端服务部署

1. 进入后端目录

```bash
cd api
```

2. 安装项目依赖

```bash
go mod download
```

3. 配置环境变量（可选配置）

```bash
export HOST=localhost                  # 服务监听地址，默认 localhost
export PORT=8060                       # 服务监听端口，默认 8060
export DSN=my-flomo.db                 # SQLite 数据库文件路径，默认 my-flomo.db
export JWT_KEY=YOUR_JWT_KEY            # JWT 签名密钥，默认 YOUR_JWT_KEY
export CRON_SPEC="0 20 * * *"          # 定时任务表达式，默认每天 20:00
export SMTP_HOST=smtp-mail.outlook.com # SMTP 服务器地址，默认 smtp-mail.outlook.com
export SMTP_PORT=587                   # SMTP 服务端口，默认 587
export SMTP_USERNAME=                  # SMTP 认证用户名，默认为空
export SMTP_PASSWORD=                  # SMTP 认证密码，默认为空
export SMTP_SUBJECT="My Flomo 每日回顾" # 邮件主题，默认 "My Flomo 每日回顾"
export LOG_PATH=                       # 日志文件路径，默认空（输出到控制台）
export LOG_LEVEL=debug                 # 日志级别，默认 info
```

4. 启动后端服务

```bash
go run main.go
```

### 前端应用部署

1. 进入前端目录

```bash
cd web
```

2. 安装项目依赖

```bash
npm install
```

3. 配置环境变量

编辑 `.env` 文件，配置后端 API 地址：

```
VITE_API_BASE_URL=http://localhost:8060
```

4. 开发环境运行

```bash
npm run dev
```

5. 构建生产版本

```bash
npm run build
```

6. 预览构建结果

```bash
npm run preview
```

## Telegram Bot 配置

### 创建 Telegram Bot

1. 在 Telegram 中搜索并联系 `@BotFather`
2. 发送 `/newbot` 命令创建新机器人
3. 按照提示设置机器人的名称和用户名
4. 创建完成后，BotFather 会提供 Bot Token，请妥善保存

### 配置每日回顾

1. 获取 Chat ID：

   - 在 Telegram 中搜索并联系 `@userinfobot`
   - 发送任意消息，机器人会返回 Chat ID

2. 在用户设置中配置 Telegram：

   - 登录 My Flomo 应用
   - 进入设置页面
   - 启用每日回顾功能
   - 填入 Telegram Bot Token 和 Chat ID

3. 配置完成后，系统将在每日定时任务执行时，通过 Telegram Bot 发送一条随机 Memo 作为每日回顾

4. 测试功能：
   - 在设置页面点击"测试每日回顾"按钮
   - 系统将立即发送一条随机 Memo 到 Telegram，用于验证配置是否正确

## API 接口文档

### 认证相关接口

- `POST /auth/login` - 用户登录或注册
- `POST /auth/verifyToken/token/:token` - 验证令牌有效性

### Memo 管理接口

- `GET /memo/list` - 获取 Memo 列表（需认证）
- `POST /memo/create` - 创建 Memo（需认证）
- `POST /memo/update` - 更新 Memo（需认证）
- `POST /memo/delete/id/:id` - 删除 Memo（需认证）
- `GET /memo/dailyReview` - 触发每日回顾（邮件和 Telegram）

### 插件功能接口

- `GET /plugin/getToken` - 获取插件令牌（需认证）
- `POST /plugin/createToken` - 创建插件令牌（需认证）
- `POST /plugin/createMemo/:pluginToken` - 通过插件令牌创建 Memo
- `GET /plugin/randomMemo/:pluginToken` - 通过插件令牌获取随机 Memo

### 用户管理接口

- `GET /user/getSettings` - 获取用户设置（需认证）
- `POST /user/updatePassword` - 更新用户密码（需认证）
- `POST /user/updateSettings` - 更新用户设置（需认证）

### 数据管理接口

- `POST /upload` - 文件上传（需认证）
- `POST /deleteMyAccount` - 删除用户账户（需认证）
- `GET /csvExport/token/:token` - 导出 CSV 格式数据
- `POST /csvImport` - 导入 CSV 格式数据（需认证）

## 开源协议

本项目采用 MIT License 开源协议。详细条款请参阅 [LICENSE](LICENSE) 文件。

## 贡献指南

欢迎提交 Issue 报告和 Pull Request 贡献代码。在提交代码前，请确保：

1. 代码符合项目编码规范要求
2. 添加必要的测试用例覆盖
3. 更新相关文档内容

## 联系方式

如有问题或建议，请通过 GitHub Issues 页面提交反馈。
