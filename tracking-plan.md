# StudyBrew Tracking Plan

> 这是本项目的数据埋点唯一真相来源(source of truth)。任何新增/修改/废弃事件,先改这份文档再改代码,PR 里带上这份文档的 diff。

- 维护者:jc
- 数据平台:PostHog (Cloud)
- 最近更新:2026-08-15
- 状态说明:`Planned` = 已设计未实现 / `Live` = 已上线且在采集 / `Deprecated` = 已停用,保留记录避免历史数据混淆

---

## 0. 命名规范(Naming Convention)

行业通用做法(Segment / Amplitude / PostHog 风格指南)是固定住一种模式,团队里不管谁加新事件都不会跑偏:

- 格式:`object_past-tense-verb`,全部 snake_case,例如 `cafe_detail_viewed`、`add_cafe_submitted`
- 事件名一旦上线**不可随意改名/改语义**——需求变了就废弃旧事件(标记 Deprecated + 记录日期),开一个新事件,不要偷偷改变同一个事件名背后的含义,否则历史数据和新数据不可比
- 属性名同样用 snake_case,布尔类属性用 `is_/has_` 前缀(如 `is_mobile`)
- 每个事件都要能回答:谁做的(distinct_id,自动带)、做了什么(event 本身)、在哪做的(properties 里带上下文,如 cafe_id、source)

---

## 1. Activation

| 事件名 | 状态 | 触发时机 | 属性 | 代码位置 |
|---|---|---|---|---|
| `cafe_pin_clicked` | Live | 点击地图上的咖啡馆 pin 图标(打开 Leaflet popup)—— 只代表"点了个图钉",不代表看了详情,跟下面的 `cafe_detail_viewed(source:map_pin)` 是两回事 | `cafe_id` | `components/map/CafePin.tsx` |
| `cafe_detail_viewed` | Live | 点开某咖啡馆详情 | `cafe_id`, `source`(map_pin / list_card) | `components/cafe/CafeCard.tsx`(list_card)、`components/cafe/CafePopcard.tsx`(map_pin,地图 pin 点开的是 Leaflet Popup 里的 CafePopcard,不是 CafePin.tsx 本身,也不经过 `app/cafe/[id]/page.tsx`) |
| `filter_applied` | Live | 使用任意筛选项 | `filter_type`, `filter_value` | `components/filters/FilterBar.tsx` |
| `copy_address` | Live | 复制地址(强意图信号) | `cafe_id`, `source`(list_card / detail_page / map_popup) | 复制地址在三个地方各自实现,分别打点:`components/cafe/CafeCard.tsx`、`components/cafe/CopyAddress.tsx`(详情页用)、`components/cafe/CafePopcard.tsx` |
| `view_toggled` | Live | 移动端 map/list 切换 | `to_view` | `app/HomeClient.tsx` |
| `logo_clicked` | Live | 点击 header 的 StudyBrew logo(等于"回首页浏览") | `from_page`(home / detail / add) | `app/HomeClient.tsx` header |

**激活定义**:首次会话内触发 `cafe_detail_viewed` 或 `filter_applied` ≥1 次。

---

## 2. Recurring users(回访)

不新增自定义事件,依赖 PostHog 自动采集的 pageview/session + 匿名 `distinct_id`。

| 分析对象 | 说明 |
|---|---|
| Retention 图表 | 回访动作 = 任意事件,或指定 `cafe_detail_viewed` |
| WAU / MAU | PostHog Trends 自带 |
| `first_seen_platform` | 首次访问时记录 mobile/desktop,用于分设备看留存(Planned) |

**已知局限**:无登录系统,身份基于浏览器匿名 ID,换设备/清 cookie 会被计为新用户。

---

## 3. Contribution(贡献意愿)

| 事件名 | 状态 | 触发时机 | 属性 | 代码位置 |
|---|---|---|---|---|
| `add_cafe_started` | Live | 点击 "Add a café"(新建) | `source` | `app/HomeClient.tsx` header CTA |
| `edit_cafe_started` | Live | 点击详情页的 "Edit this listing"(编辑已有café,跟 `add_cafe_started` 是两个独立入口) | `cafe_id` | `components/cafe/CafeDetail.tsx` → `components/cafe/EditCafeLink.tsx`(CafeDetail 是 Server Component,拆了个小 client 组件专门接 onClick,跟 ShareLandingTracker 是同一个套路) |
| `add_cafe_address_searched` | Live | 每次打开表单(新建或编辑)只记一次:第一次真正搜出结果的那次 debounce 触发才 capture,同一次填表期间不管改几次查询词都不会重复触发;编辑页用已有地址自动预填的那次**不算**搜索,不会触发 | `has_results`(bool) | `hooks/useAddressSearch.ts` → `components/form/AddressSearch.tsx` |
| `add_cafe_address_selected` | Live | 从地址搜索下拉里选中一条结果 | — | `components/form/AddressSearch.tsx` |
| `add_cafe_submit_attempted` | Live | 点击提交 | `filled_field_count`, `is_edit`(bool,同一个 handleSubmit 同时处理新建和编辑) | `components/form/CafeForm.tsx` |
| `add_cafe_submit_succeeded` (client) | Live | 前端收到成功响应 | `cafe_id`, `is_edit` | `components/form/CafeForm.tsx` |
| `add_cafe_submit_failed` | Live | 校验/API 报错 | `error_type`, `is_edit` | `components/form/CafeForm.tsx` |
| `cafe_added_server` (server) | Live | Supabase insert 成功后,服务端补埋一次 | `cafe_id` | `app/api/cafes/route.ts` (posthog-node) |

> 客户端 + 服务端双重埋点是为了防止广告拦截器丢数据,`cafe_added_server` 是最终"真相"计数。

**核心漏斗**:`add_cafe_started → add_cafe_address_searched → add_cafe_address_selected → add_cafe_submit_attempted → add_cafe_submit_succeeded`

> 注:`useAddressSearch` hook 目前只在 Add/Edit café 表单里被用到,首页没有独立的地址搜索功能(首页只有筛选器),所以地址搜索相关事件全部归在 Contribution,不放在 Activation。

---

## 4. Referral / Share

> 修正:`ShareButton` 实际是 header 级别的整站分享(在首页 `HomeClient.tsx` header 里,分享的是当前页面 URL 带 `?ref=share`),不是某个咖啡馆详情页级别的分享 —— 目前没有单独的咖啡馆分享入口。所以这两个事件都**不带 `cafe_id`**。以后如果详情页做了专属分享按钮,再给两个事件加上 `cafe_id`。
>
> 复制链接和点击分享按钮是同一个 `handleShare` 里紧挨着发生的(`navigator.clipboard.writeText` 成功后立刻 capture),没有必要拆成 `share_button_clicked` + `share_link_copied` 两个事件,合并成一个,删掉了 `share_link_copied`。

| 事件名 | 状态 | 触发时机 | 属性 | 代码位置 |
|---|---|---|---|---|
| `share_button_clicked` | Live | 点击分享按钮且复制链接成功 | `share_method`(固定 `copy_link`) | `components/ui/ShareButton.tsx` |
| `shared_link_visited` | Live | 访客带 `?ref=share` 落地首页 | — | `components/ui/ShareLandingTracker.tsx`(挂在 `app/HomeClient.tsx` 里) |

**回流分析**:分享链接带 `?ref=share` 参数,对比"带该参数进站"的访客后续是否触发 `cafe_detail_viewed` / `add_cafe_started`,估算分享带来的增量。

---

## 5. Changelog

| 日期 | 变更 | 备注 |
|---|---|---|
| 2026-08-13 | 初始版本创建 | 全部事件状态为 Planned,尚未接入 PostHog |
| 2026-08-13 | 修正:`address_searched` 从 Activation 移到 Contribution,拆成 `add_cafe_address_searched` + `add_cafe_address_selected` 两个事件;新增 `logo_clicked`(Activation) | 代码确认 useAddressSearch 只在 Add 表单里用 |
| 2026-08-14 | 全部事件接入代码(仍是 Planned,等浏览器全量点击验证 + Live events 核对完再挨个改成 Live)。顺带修正三处跟实际代码不符的地方:`cafe_detail_viewed` 的 map_pin 触发点在 `CafePopcard.tsx` 不在 `app/cafe/[id]/page.tsx`;`copy_address` 补了 `source` 属性(有三处独立实现);Referral/Share 整节改成 header 级分享(去掉 `cafe_id`,合并掉 `share_link_copied`) | 代码实现阶段核对 |
| 2026-08-15 | 浏览器点击验证过程中发现并修了几处:新增 `cafe_pin_clicked`(Activation,地图 pin 点击之前完全没埋点);新增 `edit_cafe_started`(Contribution,"Edit this listing" 之前也完全没埋点);`add_cafe_address_searched` 语义改了 —— 之前编辑页打开时自动预填地址会误触发一次,而且同一次填表打字打得慢会因为多次 debounce 触发多条,现在改成每次开表单只记第一次真正搜索,编辑预填不算 | 手动 QA 点出来的三个问题 |
| 2026-08-15 | 全部事件状态从 Planned 改成 Live | 本轮手动 QA(CAPTCHA/提交全流程走通、`add_cafe_address_searched` 去重和防误触验证过、PostHog 连通性多次 curl 确认)整体确认没问题,不是逐条在 Live Events 里核对每个属性的审计记录 |

> 之后每次上线一批事件,把对应行状态从 Planned 改成 Live,并在这里加一行记录日期和范围。事件废弃时同理,标记 Deprecated,不要直接删除这一行(否则历史数据的人会看不懂事件为什么消失了)。
