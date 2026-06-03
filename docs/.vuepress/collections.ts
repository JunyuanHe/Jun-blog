import { defineCollection, defineCollections } from 'vuepress-theme-plume'


/* =================== locale: zh-CN ======================= */

export const zhBlog = defineCollection({
    type: 'post',
    dir: 'blog',
    title: '博客'
})

export const zhDemo = defineCollection({
    type: 'doc',
    dir: 'demo',
    title: 'demo note',
    linkPrefix: '/demo/',
    sidebar: 'auto'
})

export const zhRobDiy = defineCollection({
    type: 'doc',
    dir: 'robdiy',
    title: 'robdiy',
    linkPrefix: '/robdiy/',
    sidebar: 'auto',
})

export const zhCourses = defineCollection({
    type: 'doc',
    dir: 'courses',
    title: 'courses', 
    linkPrefix: '/courses/',
    sidebar: 'auto',
})

export const zhAi = defineCollection({
    type: 'doc',
    dir: 'ai',
    title: '人工智能学习路线',
    linkPrefix: '/ai/',
    sidebar: 'auto',
})

export const zhTechExams = defineCollection({
    type: 'doc',
    dir: 'tech-exams',
    title: 'tech exams',
    linkPrefix: '/tech-exams/',
    sidebar: 'auto',
})

export const zhLearningNotes = defineCollection({
    type: 'doc',
    dir: 'learning-notes',
    title: 'learning notes',
    linkPrefix: '/learning-notes/',
    sidebar: 'auto',
})

export const zhDiary = defineCollection({
    type: 'doc',
    dir: '自省录',
    title: '自省录',
    linkPrefix: '/diary/',
    sidebar: 'auto',
})

export const zhCollections = defineCollections([
  zhBlog,
  zhDemo,
  zhRobDiy,
  zhAi,
  zhCourses,
  zhTechExams,
  zhLearningNotes,
  zhDiary
])


/* =================== locale: en-US ======================= */

export const enBlog = defineCollection({
    type: 'post',
    dir: 'blog',
    title: 'blog'
})


export const enDemo = defineCollection({
    type: 'doc',
    dir: 'demo',
    title: 'demo',
    linkPrefix: '/demo/',
    sidebar: 'auto',
})

export const enRobDiy = defineCollection({
    type: 'doc',
    dir: 'robdiy',
    title: 'robdiy',
    linkPrefix: '/robdiy/',
    sidebar: 'auto',
})

export const enCourses = defineCollection({
    type: 'doc',
    dir: 'courses',
    title: 'courses',
    linkPrefix: '/courses/',
    sidebar: 'auto',
})

export const enAi = defineCollection({
    type: 'doc',
    dir: 'ai',
    title: 'AI learning map',
    linkPrefix: '/ai/',
    sidebar: 'auto',
})

export const enLearningNotes = defineCollection({
    type: 'doc',
    dir: 'learning-notes',
    title: 'learning notes',
    linkPrefix: '/learning-notes/',
    sidebar: 'auto',
})

/**
 * 导出所有的 note
 * 每一个 note 都应该填入到 `notes.notes` 数组中
 * （enDemoNote 为参考示例，如果不需要它，请删除）
 */
export const enCollections = defineCollections([
    enBlog,
    enDemo, 
    enLearningNotes, 
    enRobDiy, 
    enAi,
    enCourses
])



