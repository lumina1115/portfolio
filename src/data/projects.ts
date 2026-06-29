export type ProjectTheme = 'dark-tech' | 'warm-craft' | 'minimalist';

export type ProjectEntry = {
  id: string;
  data: {
    title: string;
    slug: string;
    subtitle?: string;
    publishDate: Date;
    coverUrl: string;
    tags: string[];
    summary: string;
    theme: ProjectTheme;
  };
};

export const projects: ProjectEntry[] = [
  {
    id: 'project-1',
    data: {
      title: 'Gradient — 脑瘫儿童智能踝足矫形器',
      slug: '脑瘫儿童智能踝足矫形器',
      subtitle: '工业设计 / 智能穿戴 / 医疗机能',
      publishDate: new Date('2026-06-09'),
      coverUrl: 'https://portfolio-image-cdn.zongxz66.workers.dev/project-1/cover.jpg',
      tags: ['工业设计', '智能穿戴', '医疗设计', 'Arduino'],
      summary:
        'Gradient 是一款面向痉挛型脑瘫儿童的智能踝足矫形器。通过 AFO 三点力学结构矫正足内翻步态，内置柔性压力传感面料实时监测足底数据，帮助医生与家长掌握康复进程。让康复，始于每一步。',
      theme: 'minimalist',
    },
  },
  {
    id: 'project-2',
    data: {
      title: 'NeuroLimb — 腿部截肢患者术后康复VR悬吊系统',
      slug: '截肢患者悬吊系统',
      subtitle: '医疗康复 / VR交互 / 智能硬件',
      publishDate: new Date('2026-06-07'),
      coverUrl: 'https://portfolio-image-cdn.zongxz66.workers.dev/project-2/cover.jpg',
      tags: ['工业设计', '医疗康复', 'VR交互', '智能硬件'],
      summary:
        '中国截肢人口突破 2400 万，现有康复方案物理与心理分离。NeuroLimb 以智能动态悬吊 + 高沉浸 VR 视觉反馈，将减重支持与神经重塑合二为一——让患者重新“感受”自己已经失去的肢体。',
      theme: 'dark-tech',
    },
  },
  {
    id: 'project-3',
    data: {
      title: 'BirdScope — AR 智能观鸟终端',
      slug: 'AR观鸟望远镜',
      subtitle: '交互设计 / AI 识别 / 户外装备',
      publishDate: new Date('2026-06-07'),
      coverUrl: 'https://portfolio-image-cdn.zongxz66.workers.dev/project-3/cover.jpg',
      tags: ['工业设计', 'AR交互', 'AI识别', '户外装备'],
      summary:
        '2016→2025 观鸟市场热度指数增长 19 倍，核心受众超 500 万。BirdScope 以“固定式智慧观察终端”切入市场空白——AI 端侧识别 + AR 实时标注 + 波束成形定向拾音，将静态自然风景转化为可交互的数字体验。',
      theme: 'minimalist',
    },
  },
  {
    id: 'project-4',
    data: {
      title: 'KAIZO — 智能披萨炉',
      slug: '家用披萨炉',
      subtitle: '智能家居 / 厨房电器 / CMF 策略',
      publishDate: new Date('2026-06-07'),
      coverUrl: 'https://portfolio-image-cdn.zongxz66.workers.dev/project-4/cover.jpg',
      tags: ['工业设计', '智能家居', '厨房电器', 'CMF设计'],
      summary:
        '全球披萨炉市场 2025 年突破 20 亿美元，但“家用 × 温润自然”象限仍接近空白。KAIZO 以“意承古窑，温润入家”为核心概念，将高温烘烤设备转化为家居空间中的情感化艺术品。',
      theme: 'warm-craft',
    },
  },
];
