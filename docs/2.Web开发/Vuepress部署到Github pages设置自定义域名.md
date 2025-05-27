---
title: Vuepress部署到Github pages设置自定义域名
createTime: 2025/05/27 13:58:47
permalink: /article/3i6eeadd/
---

## 问题描述

Github中在设置-Pages中指定了自定义域名，但每次Vuepress通过Github Actions的自动部署均会删除该CNAME. 

## 解决方案

在[Vuepress的文档](https://v1.vuepress.vuejs.org/guide/deploy.html#github-pages)中有这么一段话：

> **TIP**
>
> When you use a Custom Domain name, you MUST add the CNAME file into /docs/.vuepress/public folder (Create the folder if it isn't there). Otherwise, your CNAME file will always be removed with each deploy and never work.

于是正确的操作方式是：在`/docs/.vuepress/public`文件夹中新建一个名为`CNAME`的文件，文件内容为你的自定义域名

```
mycustomdomain.com
```

这样，每次vuepress build的时候，该文件就会被复制到`/docs/.vuepress/dist`文件夹下，Github在部署的时候便不会删除原有的CNAME. 

另外，在`.github/workflows/deploy.yml'中增加如下CNAME内容

```yml
# 查看 workflow 的文档来获取更多信息
      # @see https://github.com/crazy-max/ghaction-github-pages
      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v4
        with:
          # 部署到 gh-pages 分支
          target_branch: gh-pages
          # 部署目录为 VuePress 的默认输出目录
          build_dir: docs/.vuepress/dist
        env:
          # @see https://docs.github.com/cn/actions/reference/authentication-in-a-workflow#about-the-github_token-secret
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CNAME: https://mycustomdomain.com/ # [!code highlight]
```

大功告成！
