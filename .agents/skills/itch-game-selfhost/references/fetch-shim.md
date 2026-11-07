# fetch 垫片：隐藏外呼改道到本地副本

## 适用场景

游戏运行时会向**第三方/作者服务器**发非游玩必需的请求（版本更新检查、统计打点），且满足其一：

- URL 在源码里被混淆，无法直接改（wreckbox 案例连 `fetch(` 都搜不到）
- 不想改游戏逻辑代码（逐字节 diff 只应有"插入垫片"这一处变更）

**不适用**：itch 的 `htmlgame.js`（`<script src>` 标签加载，fetch 垫片拦不到）——那个直接删标签，见 pitfalls #1。游玩必需的资源缺失不适用垫片，老老实实下载。

## 前置：拿到外呼目标并本地化

1. 运行时监控（pitfalls #4 的方法）抓到完整请求 URL，例如：
   `https://vilonx-01.github.io/wreckbox-updates/version.json?t=<时间戳>`
2. 走代理下载该资源，**按路径结构**放进游戏目录：
   `wreckbox/wreckbox-updates/version.json`
3. 看一眼内容—— wreckbox 的 version.json 里就有作者的授权声明（第 0 步风险检查的素材）

## 垫片代码（最终版，本地/CDN 通吃）

插入位置：`<head>` 内 charset meta 之后（保证先于一切游戏脚本执行）。

```html
<link rel="icon" href="data:,">
<script>
/* Local-play patch: reroute the update check to the local copy (no external calls). */
(() => {
  const orig = window.fetch;
  window.fetch = function (input, init) {
    try {
      const url = typeof input === "string" ? input : (input && input.url) || "";
      if (url.includes("vilonx-01.github.io") || url.includes("wreckbox-updates")) {
        const i = url.indexOf("//");
        if (i !== -1) {
          const j = url.indexOf("/", i + 2);
          if (j !== -1) {
            const base = location.pathname.replace(/[^/]*$/, "");
            const local = base + url.slice(j + 1);
            input = typeof input === "string" ? local : new Request(local, input);
          }
        }
      }
    } catch (e) {}
    return orig.call(this, input, init);
  };
})();
</script>
```

要点：

- **只改道绝对 URL**（`indexOf("//") !== -1` 的分支里才动 input）：相对路径请求包含关键词时保持原样，否则目录会被切掉（pitfalls #8）
- `base` 取当前文档目录：本地根目录解析为 `/`，CDN 的 `/games/<slug>/` 解析为其自身目录——**同一份垫片两个环境通吃**，本地副本的目录结构须与源站路径一致
- 匹配关键词同时写域名与路径片段（`wreckbox-updates`），防作者换域
- `+641 字节` 级别的纯插入改动，保留 `/* Local-play patch */` 注释方便日后识别

## 验证清单

1. 本地实测：`performance.getEntriesByType("resource")` 里该请求已变为同域本地路径；error 收集器为零
2. CDN 实测：顶层打开 `https://cdn.playbloo.net/games/<slug>/index.html`，资源请求应指向 `https://cdn.playbloo.net/games/<slug>/<path>`，无第三方域名
3. 垫片不要破坏正常 fetch：随便 fetch 一个本地相对路径确认原样通过

## 已知边界

- **file:// 双击直开**：Chrome 下 fetch 本地文件受 CORS 限制，垫片改道后的本地请求也会失败——游戏有兜底则静默降级（控制台可能剩一条网络错误提示），游玩不受影响；要控制台绝对干净就用静态服务器模式
- 只拦 `fetch`：若监控发现游戏用 `XMLHttpRequest` 外呼，需按同样思路包 `xhr.open`，别照抄本垫片就以为完事
