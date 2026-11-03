// "Project use" marks tools named in a supplied project description or repository README.
// "Learning" marks items listed in the plan without a project example; it is not a proficiency score.
export const skills = [
  {
    id: 'ml',
    name: 'Machine learning & AI',
    intro: 'Models and retrieval systems documented in the project archive.',
    tools: [
      { name: 'XGBoost', level: 'Project use', projects: ['doctor-helper'] },
      { name: 'TensorFlow / Keras', level: 'Project use', projects: ['cifar-10-classification'] },
      { name: 'LightGBM / LambdaMART', level: 'Project use', projects: ['search-ranking-model'] },
      { name: 'RAG · Llama 3 · FAISS', level: 'Project use', projects: ['doctor-helper'] },
      { name: 'Sentence Transformers', level: 'Project use', projects: ['doctor-helper'] },
      { name: 'Classification & CNNs', level: 'Project use', projects: ['doctor-helper', 'cifar-10-classification'] },
      { name: 'NetworkX simulation', level: 'Project use', projects: ['city-mind'] },
      { name: 'Scikit-learn', level: 'Project use', projects: ['city-mind'] },
    ],
  },
  {
    id: 'data',
    name: 'Data & analysis',
    intro: 'Working with structured data, evaluation and search relevance.',
    tools: [
      { name: 'BM25 & NDCG@10', level: 'Project use', projects: ['search-ranking-model'] },
      { name: 'PostgreSQL', level: 'Project use', projects: ['doctor-helper'] },
      { name: 'SQLite · PostGIS', level: 'Project use', projects: ['city-mind'] },
      { name: 'SQL', level: 'Project use', projects: ['doctor-helper', 'city-mind'] },
      { name: 'NumPy · Pandas', level: 'Learning', projects: [] },
      { name: 'Matplotlib & visualisation', level: 'Learning', projects: [] },
      { name: 'Exploratory analysis', level: 'Learning', projects: [] },
    ],
  },
  {
    id: 'web',
    name: 'Web & backend',
    intro: 'Interfaces and APIs that make model-driven ideas usable.',
    tools: [
      { name: 'React', level: 'Project use', projects: ['doctor-helper', 'city-mind'] },
      { name: 'Django REST Framework', level: 'Project use', projects: ['doctor-helper'] },
      { name: 'FastAPI', level: 'Project use', projects: ['city-mind'] },
      { name: 'TypeScript', level: 'Project use', projects: ['city-mind'] },
      { name: 'Leaflet', level: 'Project use', projects: ['city-mind'] },
      { name: 'Tailwind CSS', level: 'Project use', projects: ['city-mind'] },
      { name: 'HTML', level: 'Learning', projects: [] },
    ],
  },
  {
    id: 'languages-tools',
    name: 'Languages & tools',
    intro: 'Languages and working tools listed in the supplied plan.',
    tools: [
      { name: 'Python', level: 'Project use', projects: ['doctor-helper', 'cifar-10-classification', 'search-ranking-model', 'city-mind'] },
      { name: 'C', level: 'Learning', projects: [] },
      { name: 'R', level: 'Learning', projects: [] },
      { name: 'Git & GitHub', level: 'Project use', projects: ['search-ranking-model', 'city-mind'] },
      { name: 'JupyterLab · Google Colab', level: 'Learning', projects: [] },
      { name: 'VS Code · MySQL', level: 'Learning', projects: [] },
      { name: 'React · Three.js · GSAP · Vite', level: 'Built this site', projects: [], evidence: 'Used to build this portfolio website.' },
    ],
  },
]

export const services = [
  {
    title: 'Explore a dataset',
    line: 'Clean, investigate and present a dataset so its patterns and limitations are easier to understand.',
    examples: ['Analysis and visualisation'],
  },
  {
    title: 'Prototype a model',
    line: 'Build a baseline, evaluate it clearly and explain what the result can and cannot tell us.',
    examples: ['Classification', 'Learning to rank'],
  },
  {
    title: 'Connect AI to an interface',
    line: 'Help shape a small web application around a model or decision-support workflow.',
    examples: ['Doctor Helper', 'CITYMIND'],
  },
]
