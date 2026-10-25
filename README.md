# My Flomo

自托管的想法记录与回顾应用，提供与 Flomo 兼容的插件接口。后端使用 Go，前端使用 React 与 TypeScript，数据保存在本地 SQLite 文件中。前端构建产物嵌入后端，运行时只需一个端口。

## 功能

- 想法管理：创建、编辑、删除、查看
- 数据导入：导入 Flomo 导出的 HTML，导入 CSV
- 数据导出：导出全部想法为 CSV
- 每日回顾：定时任务随机取一条想法，发送到邮箱或 Telegram
- 插件接口：使用插件令牌写入想法，或随机读取一条
- 账户管理：注册登录、修改密码、注销账户并删除全部数据
- 服务状态：展示运行时间、版本、内存与协程信息

## 技术栈

- 后端：Go、Gin、GORM、SQLite、JWT、robfig cron、SMTP、Telegram Bot API、zap、embed
- 前端：React、TypeScript、Vite、Jotai、React Router、原生 fetch、Tailwind CSS、shadcn/ui、Radix UI、Lucide

## 项目结构

```
api/
├── config/      # 环境变量与日志配置
├── db/          # SQLite 连接与表结构迁移
├── form/        # 请求表单结构
├── handler/     # HTTP 处理器
├── middleware/  # JWT 鉴权中间件
├── model/       # 数据模型
├── result/      # 统一响应结构
├── route/       # 路由表
├── service/     # 业务逻辑
├── store/       # 数据访问
├── util/        # ID、JWT、邮箱校验、日志工具
└── web/         # 前端资源嵌入与单页应用回退
    └── public/  # 构建产物，由 bun run build 生成

web/              # 前端源码
└── src/
    ├── api/         # 接口封装
    ├── atoms/       # Jotai 状态
    ├── components/  # 组件
    │   └── ui/      # shadcn/ui 基础组件
    ├── hooks/       # 健康检查
    ├── interfaces/  # 类型定义
    ├── lib/         # 类名工具
    ├── pages/       # 页面
    ├── theme/       # 主题切换
    └── utils/       # 邮箱校验
```

## 部署

前端构建产物写入 `api/web/public`，编译时嵌入 Go 二进制。运行后一个端口同时提供页面与接口。

需要 Go 1.26 与 Bun。

```bash
cd web
bun install
bun run build

cd ../api
go run main.go
```

访问 `http://localhost:8060`。

构建发布二进制。

```bash
cd api
make build
./my-flomo-server
```

`make build` 会先构建前端再编译后端。仓库不包含 `api/web/public`，首次编译后端前必须先构建前端。修改前端后需要重新执行 `bun run build`，并重新编译后端。

### 环境变量

环境变量均可省略，省略时使用下表中的默认值。

- `HOST`：监听地址，默认 `localhost`
- `PORT`：监听端口，默认 `8060`
- `DSN`：SQLite 文件路径，默认 `my-flomo.db`
- `JWT_KEY`：JWT 签名密钥，默认 `YOUR_JWT_KEY`，部署前必须修改
- `CRON_SPEC`：定时任务表达式，默认 `0 20 * * *`
- `SMTP_HOST`：SMTP 服务器地址，默认 `smtp-mail.outlook.com`
- `SMTP_PORT`：SMTP 端口，默认 `587`
- `SMTP_USERNAME`：SMTP 用户名，默认空
- `SMTP_PASSWORD`：SMTP 密码，默认空
- `SMTP_SUBJECT`：回顾邮件主题，默认 `My Flomo 每日回顾`
- `LOG_PATH`：日志文件路径，默认空，输出到标准输出
- `LOG_LEVEL`：日志级别，默认 `info`，可选 `debug`、`info`、`warn`、`error`、`dpanic`、`panic`、`fatal`
- `MACHINE_ID`：雪花 ID 的机器号，取值 0 至 1023，默认取主机名哈希

默认监听 `localhost`，仅本机可访问。需要局域网或其他设备访问时，设置 `HOST=0.0.0.0`。

### 前端开发

后端照常启动，前端使用 Vite 开发服务器。

```bash
# 终端 1
cd api
go run main.go

# 终端 2
cd web
bun install
bun run dev
```

Vite 将 `/auth`、`/memo`、`/plugin`、`/user`、`/upload`、`/deleteMyAccount`、`/csvExport`、`/csvImport`、`/health` 代理到 `http://localhost:8060`。`web/.env` 中的 `VITE_API_BASE_URL` 保持为空，接口使用同源相对路径。

## 每日回顾

- 后端按 `CRON_SPEC` 触发，默认每天 20:00 执行一次
- 只处理开启「每日回顾」的账户，每个账户随机取一条想法
- 邮件通道需要 `SMTP_USERNAME` 与 `SMTP_PASSWORD`，缺少任一项时跳过邮件
- Telegram 通道需要账户内填写 Bot Token 与 Chat ID
- 设置页的「测试每日回顾」按钮立即触发一次，用于验证配置

手动触发：`GET /memo/dailyReview`，无需认证。

## API

JSON 接口返回统一结构，CSV 导出直接返回文件。

```json
{
  "success": true,
  "code": 200,
  "message": "success",
  "data": null
}
```

需认证的接口在请求头中携带 `token`，值为登录接口返回的 JWT。令牌有效期 7 天。

### 认证

- `POST /auth/login`：登录，邮箱未注册时自动创建账户
- `POST /auth/verifyToken/token/:token`：校验令牌

### 想法

- `GET /memo/list`：按创建时间倒序返回全部想法，需认证
- `POST /memo/create`：创建想法，请求体 `{"content": "..."}`，需认证
- `POST /memo/update`：更新想法，请求体 `{"id": "...", "content": "..."}`，需认证
- `POST /memo/delete/id/:id`：删除想法，需认证
- `GET /memo/dailyReview`：触发每日回顾，无需认证

### 插件

- `GET /plugin/getToken`：获取当前插件令牌，需认证
- `POST /plugin/createToken`：重新生成插件令牌，需认证
- `POST /plugin/createMemo/:pluginToken`：通过插件令牌创建想法，请求体 `{"content": "..."}`
- `GET /plugin/randomMemo/:pluginToken`：通过插件令牌随机返回一条想法

插件接口兼容 Flomo 调用习惯，响应中 `code` 为 `0` 表示成功，`-1` 表示失败。

### 用户

- `GET /user/getSettings`：获取每日回顾与 Telegram 配置，需认证
- `POST /user/updatePassword`：修改密码，请求体 `{"password": "..."}`，需认证
- `POST /user/updateSettings`：更新每日回顾与 Telegram 配置，需认证

### 数据

- `POST /upload`：上传 Flomo 导出的 HTML 文件，表单字段 `uploadFileList[]`，支持多文件，需认证
- `POST /deleteMyAccount`：注销账户，想法与账户一并永久删除，需认证
- `GET /csvExport/token/:token`：导出 CSV，令牌放在路径中
- `POST /csvImport`：导入 CSV，表单字段 `csvFile`，需认证

CSV 列为 `ID`、`CreatedAt`、`UpdatedAt`、`Content`，时间格式 `YYYY-MM-DD HH:mm:ss`，按 `Asia/Shanghai` 时区解析。

### 健康检查

- `GET /health`：返回服务状态、版本、运行时与内存信息，无需认证

## 参与

欢迎提交 Issue 与 Pull Request。

## 开源协议

本项目采用 MIT License 开源协议。详细条款请参阅 [LICENSE](LICENSE) 文件。
