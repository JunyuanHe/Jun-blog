---
title: Deploying VuePress to GitHub Pages with a Custom Domain
tags: 
  - Vuepress
  - Github pages
createTime: 2025/05/27 13:58:47
permalink: /en/article/3i6eeadd/

---

## Problem Description

In GitHub, after specifying a custom domain in Settings > Pages, the `CNAME` file gets deleted every time VuePress is deployed automatically using GitHub Actions.

## Solution

According to [VuePress documentation](https://v1.vuepress.vuejs.org/guide/deploy.html#github-pages), there's a tip that says:

> **TIP**
>
> When you use a Custom Domain name, you MUST add the CNAME file into /docs/.vuepress/public folder (Create the folder if it isn't there). Otherwise, your CNAME file will always be removed with each deploy and never work.

So the correct approach is to create a file named `CNAME` inside the `/docs/.vuepress/public` directory. The content of the file should be your custom domain:

```
mycustomdomain.com
```

This way, when VuePress builds the site, the file will be copied to the `/docs/.vuepress/dist` directory, and GitHub will not delete the original CNAME during deployment.

Additionally, add the following CNAME setting in your `.github/workflows/deploy.yml` file:

```yml
# See the workflow documentation for more info
      # @see https://github.com/crazy-max/ghaction-github-pages
      - name: Deploy to GitHub Pages
        uses: crazy-max/ghaction-github-pages@v4
        with:
          # Deploy to the gh-pages branch
          target_branch: gh-pages
          # VuePress default output directory
          build_dir: docs/.vuepress/dist
        env:
          # @see https://docs.github.com/en/actions/reference/authentication-in-a-workflow#about-the-github_token-secret
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          CNAME: https://mycustomdomain.com/ # [!code highlight]
```

All done!
