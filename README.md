# 高手科技静态站

这是 `techgaoshou.com` 的新版静态首页原型，适合部署到 GitHub Pages、Hugging Face Static Space 或 Cloudflare Pages。

## 文件

- `index.html`：主页、SEO、文章入口、学习路线、视频课、DCA 小工具
- `styles.css`：响应式视觉样式，支持深浅色
- `app.js`：文章筛选、搜索、阅读进度、主题切换、DCA 计算器、动态视觉
- `assets/techgaoshou-avatar.png`：高手科技头像，用于站点品牌区、关于区和社交分享图
- `articles/`：示例文章页
- `CNAME`：GitHub Pages 自定义域名配置，当前为 `techgaoshou.com`
- `.nojekyll`：让 GitHub Pages 按纯静态站点发布

## 本地预览

```bash
python3 -m http.server 8080
```

然后打开 `http://localhost:8080`。

## 部署建议

### GitHub Pages

推荐创建仓库：`techgaoshou/techgaoshou.github.io`。这是 GitHub 用户站点仓库，推送到 `main` 后会自动发布。

```bash
git remote add origin git@github.com:techgaoshou/techgaoshou.github.io.git
git branch -M main
git push -u origin main
```

然后在 GitHub 仓库的 `Settings -> Pages` 里确认：

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/root`
- Custom domain: `techgaoshou.com`
- Enforce HTTPS: 开启

Cloudflare DNS 需要指向 GitHub Pages。根域名 `techgaoshou.com` 通常添加 GitHub Pages 的 A 记录，`www` 添加 CNAME 到 `techgaoshou.github.io`。

### Hugging Face / Cloudflare Pages

如果继续用 Hugging Face Static Space，把这个目录里的文件放到 Space 根目录即可。如果改用 Cloudflare Pages，构建命令留空，输出目录填 `/` 或项目根目录。
