/**
 * Central portfolio data — generated from Likitha's resume (Magham_Likitha_DATA.docx).
 * Every fact on the site comes from this file. Update it here and the whole site follows.
 * Nothing here should be added unless it appears on the resume.
 */

export type Palette = { from: string; via: string; to: string; accent: string };

export const profile = {
  fullName: 'Likitha Magham',
  displayName: 'Likitha Magham',
  firstName: 'LIKITHA',
  /** Initial used in the series mark, favicon and "ORIGINAL" badges. */
  initial: 'L',
  /** Shown in the centre of the data-art key visual while there's no photo. */
  monogram: 'LM',
  seriesTag: 'THE SERIES',
  /** Fictional studio card shown at the very start of the opening sequence. */
  originalLabel: 'A MAGHAM ORIGINAL',
  role: 'Data Analyst',
  tagline: ['Data Analyst', 'SQL', 'Python', 'Power BI'],
  intro:
    'A Data Analyst with 4+ years in analytics, business intelligence and reporting automation across retail and IT services, turning finance and operations requirements into dashboards and insights with SQL, Python, Power BI and Excel.',
  location: 'Grand Rapids, MI',
  /** Fill these in to show the contact buttons. Empty values are hidden across the site. */
  email: '',
  links: {
    linkedin: '',
    github: '',
  },
  /**
   * Path to the resume PDF in public/ (e.g. '/assets/Likitha_Magham_Resume.pdf').
   * While it's '', "View Resume" shows the designed resume sheet and the download buttons are hidden.
   */
  resumePdf: '',
  resumeFileName: 'Likitha_Magham_Resume.pdf',
  /**
   * Set to the generated WebP portraits once a photo is added (see README → Photo).
   * While it's null, a data-art key visual stands in wherever the portrait appears.
   */
  portrait: null as null | { src: string; srcSet: string; alt: string },
  /** Shown under "Core toolkit" in About — the skills the summary calls out as strongest. */
  coreToolkit: ['SQL', 'Python', 'Power BI', 'Excel', 'Snowflake', 'DAX', 'Power Query'],
};

export type Education = { school: string; place: string; degree: string; period: string; short: string; score?: string };

export const education: Education[] = [
  {
    school: 'Grand Valley State University',
    place: 'Allendale, MI',
    degree: 'Master of Science in Computer Science',
    period: 'August 2025',
    short: 'M.S. Computer Science',
  },
  {
    school: 'Sathyabama University',
    place: 'Chennai, India',
    degree: 'Bachelor of Science in Computer Science',
    period: '2021',
    short: 'B.S. Computer Science',
  },
];

export const experience = [
  {
    company: 'Meijer',
    role: 'Data Analyst',
    place: 'Grand Rapids, MI',
    period: 'Apr 2025 – Present',
    points: [
      'Develop and maintain 4 Power BI dashboards using DAX, Power Query, and data modeling to track operational performance, process volume, and KPIs, providing weekly reporting visibility to 25 stakeholders across finance and operations.',
      'Automate 6 recurring reports and data workflows using Power Automate, UiPath, and Power BI, reducing manual effort by 10 hours per week and improving reporting consistency.',
      'Write SQL queries against Snowflake to extract, join, and aggregate datasets containing 1M+ rows, supporting operational trend analysis, volume reporting, and process-flow analysis.',
      'Build data preparation workflows in Python and Pandas to clean, transform, and profile datasets, flagging missing values and duplicate records before analysis and reporting.',
      'Apply SQL, Python, and Power Query transformations to integrate source data into structured, report-ready datasets for recurring and ad hoc analysis.',
      'Perform exploratory data analysis in Python and NumPy, creating visualizations with Matplotlib and Seaborn to examine operational metrics, identify trends, and uncover patterns.',
      'Implement data validation checks and investigate recurring data quality issues, reducing report rework and improving data reliability for finance reporting.',
      'Partner with finance and operations stakeholders to gather requirements, define KPIs, validate report output, and deliver reporting that supports business decisions.',
    ],
  },
  {
    company: 'Mphasis',
    role: 'Data & Business Analyst',
    place: 'Bangalore, India',
    period: 'May 2020 – Dec 2023',
    points: [
      'Developed 10 interactive Power BI dashboards to track operational performance and business KPIs, providing 40 stakeholders with self-service reporting and reducing ad hoc reporting requests.',
      'Wrote SQL queries using joins, aggregations, and common table expressions (CTEs) to retrieve, combine, and analyze structured datasets for business and operational reporting.',
      'Integrated data from 4 sources using SQL and Power Query to create structured reporting datasets, improving data accessibility and reducing report preparation time by 30%.',
      'Automated recurring Excel reports using PivotTables, Power Query, and advanced Excel formulas, saving the team 6 hours per week and improving reporting consistency.',
      'Scripted Excel data processing in Python and OpenPyXL to manipulate workbooks and prepare data for recurring reports.',
      'Retrieved data from REST APIs using Python Requests, processed JSON responses, and prepared the output for downstream analysis and reporting.',
      'Performed exploratory data analysis in Python with Pandas and NumPy, visualizing results in Matplotlib and Seaborn to identify trends, patterns, and business insights.',
      'Gathered and documented business requirements, defined 15 KPIs with stakeholders, and supported user acceptance testing (UAT) to validate reporting solutions against business needs.',
    ],
  },
];

export type Metric = { value: string; label: string };

export type Project = {
  id: string;
  title: string;
  /** Year, date range or label shown on the badge. */
  year: string;
  /** Where the work happened — shown in the resume sheet. */
  kind: 'Work' | 'Academic & Independent';
  genre: string;
  logline: string;
  stack: string[];
  build: string[];
  features: string[];
  metrics: Metric[];
  /** Omit when there's no public repository — the GitHub button is hidden instead of linking to a 404. */
  github?: string;
  palette: Palette;
  motif: 'dashboard' | 'pipeline' | 'network' | 'model';
};

const meijer = experience[0].points;
const mphasis = experience[1].points;

export const projects: Project[] = [
  {
    id: 'meijer-operations-bi',
    title: 'Operations BI at Meijer',
    year: '2025 – Now',
    kind: 'Work',
    genre: 'Retail • Power BI • Snowflake',
    logline: 'Weekly operational reporting for finance and operations — dashboards, automated workflows and validated, report-ready data.',
    stack: ['Power BI', 'DAX', 'Snowflake', 'SQL', 'Python', 'Power Automate', 'UiPath'],
    build: [meijer[0], meijer[1], meijer[2], meijer[3], meijer[6]],
    features: [
      '4 Power BI dashboards for operational performance, process volume and KPIs',
      'Snowflake SQL over 1M+ row datasets',
      'Recurring reports automated with Power Automate and UiPath',
      'Python / Pandas data preparation and profiling',
      'Data validation checks for finance reporting',
    ],
    metrics: [
      { value: '4', label: 'Power BI dashboards' },
      { value: '25', label: 'stakeholders with weekly visibility' },
      { value: '6', label: 'reports & workflows automated' },
      { value: '10 hrs', label: 'manual effort saved per week' },
      { value: '1M+', label: 'rows queried in Snowflake' },
    ],
    palette: { from: '#2a0610', via: '#7a0f24', to: '#0b0710', accent: '#ff3d5a' },
    motif: 'dashboard',
  },
  {
    id: 'mphasis-self-service-bi',
    title: 'Self-Service BI at Mphasis',
    year: '2020 – 2023',
    kind: 'Work',
    genre: 'IT Services • Power BI • Automation',
    logline: 'Self-service reporting for 40 stakeholders, built on data integrated from four sources and automated Excel reporting.',
    stack: ['Power BI', 'SQL', 'Power Query', 'Excel', 'Python', 'OpenPyXL', 'REST APIs'],
    build: [mphasis[0], mphasis[2], mphasis[3], mphasis[5], mphasis[7]],
    features: [
      '10 interactive Power BI dashboards',
      'SQL with joins, aggregations and CTEs',
      'Data integrated from 4 sources',
      'Excel automation with PivotTables, Power Query and OpenPyXL',
      'REST API data retrieval with Python Requests',
      '15 KPIs defined with stakeholders, validated through UAT',
    ],
    metrics: [
      { value: '10', label: 'Power BI dashboards' },
      { value: '40', label: 'stakeholders on self-service reporting' },
      { value: '30%', label: 'less report preparation time' },
      { value: '6 hrs', label: 'saved per week on Excel reports' },
      { value: '15', label: 'KPIs defined' },
    ],
    palette: { from: '#1a0d02', via: '#8a4a07', to: '#0a0806', accent: '#ffb547' },
    motif: 'pipeline',
  },
  {
    id: 'supply-chain-reporting',
    title: 'Supply Chain Reporting',
    year: 'Project',
    kind: 'Academic & Independent',
    genre: 'Supply Chain • Dashboarding',
    logline: 'Power BI dashboards that give a single view of supply chain health — inventory, orders, delays and distribution.',
    stack: ['SQL', 'Power BI', 'Excel'],
    build: [
      'Built a set of Power BI dashboards to monitor inventory movement, order volumes, delivery delays, and distribution performance, giving a single view of supply chain health.',
      'Queried and analyzed historical and near-real-time order data using SQL to identify delivery delay patterns, examine operational trends, and support supply chain planning.',
      'Compiled operational metrics into structured Excel reports used to compare performance across periods and flag potential bottlenecks.',
    ],
    features: [
      'Inventory movement monitoring',
      'Order volume tracking',
      'Delivery delay pattern analysis',
      'Distribution performance views',
      'Period-over-period Excel reports that flag bottlenecks',
    ],
    metrics: [
      { value: '4', label: 'supply chain signals in one view' },
      { value: 'SQL', label: 'historical & near-real-time order data' },
      { value: 'Excel', label: 'period-over-period comparisons' },
    ],
    palette: { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' },
    motif: 'network',
  },
  {
    id: 'bi-reporting-system',
    title: 'BI Reporting System',
    year: 'Project',
    kind: 'Academic & Independent',
    genre: 'Business Intelligence • Data Modeling',
    logline: 'An end-to-end Power BI solution — from source data preparation to a unified reporting model and the final KPI views.',
    stack: ['Power BI', 'SQL', 'Excel'],
    build: [
      'Built an end-to-end BI reporting solution in Power BI, covering source data preparation, the reporting model, and the final KPI views.',
      'Consolidated data from multiple datasets into a unified reporting model, improving consistency across reports and providing stakeholders with a more centralized view of business metrics.',
      'Collaborated with business users to gather requirements, define reporting metrics, and refine dashboard functionality to align with business needs and improve reporting usability.',
    ],
    features: [
      'Source data preparation',
      'Unified reporting model across multiple datasets',
      'KPI views for stakeholders',
      'Requirements gathered with business users',
    ],
    metrics: [
      { value: '3', label: 'layers: data prep → model → KPI views' },
      { value: '1', label: 'unified reporting model' },
      { value: 'E2E', label: 'built end-to-end in Power BI' },
    ],
    palette: { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' },
    motif: 'model',
  },
];

export type Achievement = {
  id: string;
  title: string;
  org: string;
  detail: string;
  laurel: string;
  link?: string;
};

/** Impact highlights — every number is from the resume. */
export const achievements: Achievement[] = [
  {
    id: 'hours-saved',
    title: '10 Hours a Week',
    org: 'Meijer',
    detail: 'Automated 6 recurring reports and data workflows with Power Automate, UiPath and Power BI.',
    laurel: 'Automation',
  },
  {
    id: 'million-rows',
    title: '1M+ Rows',
    org: 'Meijer · Snowflake',
    detail: 'SQL to extract, join and aggregate datasets for operational trend, volume and process-flow analysis.',
    laurel: 'Scale',
  },
  {
    id: 'self-service',
    title: '40 Stakeholders',
    org: 'Mphasis',
    detail: '10 interactive Power BI dashboards gave self-service reporting and reduced ad hoc requests.',
    laurel: 'Self-Service BI',
  },
  {
    id: 'faster-prep',
    title: '30% Faster',
    org: 'Mphasis',
    detail: 'Integrated data from 4 sources with SQL and Power Query, cutting report preparation time.',
    laurel: 'Integration',
  },
  {
    id: 'kpis',
    title: '15 KPIs',
    org: 'Mphasis',
    detail: 'Defined with stakeholders from documented requirements, then validated through UAT.',
    laurel: 'Business Partner',
  },
];

export type Certification = { issuer: string; name: string; link: string };

/** None are listed on the resume yet. Add entries here and the "Certified" rail appears. */
export const certifications: Certification[] = [];

export type Skill = { name: string; mono: string; note?: string };
export type SkillCategory = { id: string; title: string; subtitle: string; skills: Skill[] };

export const skillCategories: SkillCategory[] = [
  {
    id: 'analysis',
    title: 'Data Analysis',
    subtitle: 'Programming & analysis',
    skills: [
      { name: 'SQL', mono: 'Sq', note: 'Core' },
      { name: 'Python', mono: 'Py', note: 'Core' },
      { name: 'Pandas', mono: 'Pd' },
      { name: 'NumPy', mono: 'Np' },
    ],
  },
  {
    id: 'bi',
    title: 'BI & Visuals',
    subtitle: 'Business intelligence & visualization',
    skills: [
      { name: 'Power BI', mono: 'Bi', note: 'Core' },
      { name: 'DAX', mono: 'Dx' },
      { name: 'Power Query', mono: 'Pq' },
      { name: 'Data Modeling', mono: 'Dm' },
      { name: 'Tableau', mono: 'Tb' },
      { name: 'Matplotlib', mono: 'Mp' },
      { name: 'Seaborn', mono: 'Sb' },
    ],
  },
  {
    id: 'platforms',
    title: 'Data Platforms',
    subtitle: 'Databases & data platforms',
    skills: [
      { name: 'Snowflake', mono: 'Sf' },
      { name: 'SQL Server', mono: 'Ss' },
      { name: 'PostgreSQL', mono: 'Pg' },
      { name: 'Databricks', mono: 'Db' },
      { name: 'Microsoft Fabric', mono: 'Fb' },
      { name: 'OneLake', mono: 'Ol' },
    ],
  },
  {
    id: 'quality',
    title: 'Data Quality',
    subtitle: 'Preparation & quality',
    skills: [
      { name: 'ETL', mono: 'Et' },
      { name: 'Data Cleaning', mono: 'Cl' },
      { name: 'Data Transformation', mono: 'Tf' },
      { name: 'Data Integration', mono: 'In' },
      { name: 'Data Validation', mono: 'Va' },
      { name: 'Data Quality', mono: 'Dq' },
    ],
  },
  {
    id: 'automation',
    title: 'Automation',
    subtitle: 'Automation & reporting',
    skills: [
      { name: 'Excel', mono: 'Xl', note: 'Core' },
      { name: 'Power Automate', mono: 'Pa' },
      { name: 'UiPath', mono: 'Ui' },
      { name: 'OpenPyXL', mono: 'Ox' },
    ],
  },
  {
    id: 'apis',
    title: 'APIs',
    subtitle: 'APIs & data exchange',
    skills: [
      { name: 'REST APIs', mono: 'Ap' },
      { name: 'Python Requests', mono: 'Rq' },
      { name: 'JSON', mono: 'Js' },
    ],
  },
  {
    id: 'business',
    title: 'Business Analysis',
    subtitle: 'Analysis & delivery',
    skills: [
      { name: 'Requirements Gathering', mono: 'Rg' },
      { name: 'KPI Definition', mono: 'Kp' },
      { name: 'UAT', mono: 'Ua' },
      { name: 'Jira', mono: 'Ji' },
      { name: 'Confluence', mono: 'Cf' },
      { name: 'Visio', mono: 'Vs' },
    ],
  },
];

/**
 * Factual cross-references shown when a skill card is hovered/tapped:
 * where the skill appears in the work history or projects on the resume.
 */
export const skillEvidence: Record<string, string[]> = {
  SQL: ['Meijer — Snowflake, 1M+ rows', 'Mphasis — joins & CTEs', 'Supply Chain Reporting', 'BI Reporting System'],
  Python: ['Meijer — data prep & EDA', 'Mphasis — OpenPyXL & REST APIs'],
  Pandas: ['Meijer — cleaning & profiling', 'Mphasis — EDA'],
  NumPy: ['Meijer — EDA', 'Mphasis — EDA'],
  'Power BI': ['Meijer — 4 dashboards', 'Mphasis — 10 dashboards', 'Supply Chain Reporting', 'BI Reporting System'],
  DAX: ['Meijer dashboards', 'Mphasis'],
  'Power Query': ['Meijer — transformations', 'Mphasis — 4-source integration'],
  'Data Modeling': ['Meijer dashboards', 'BI Reporting System — unified model'],
  Matplotlib: ['Meijer — EDA', 'Mphasis — EDA'],
  Seaborn: ['Meijer — EDA', 'Mphasis — EDA'],
  Snowflake: ['Meijer — 1M+ row datasets'],
  'Data Cleaning': ['Meijer — Python & Pandas workflows'],
  'Data Transformation': ['Meijer — SQL, Python & Power Query'],
  'Data Integration': ['Mphasis — 4 sources, 30% faster prep', 'BI Reporting System'],
  'Data Validation': ['Meijer — checks for finance reporting'],
  'Data Quality': ['Meijer — less report rework'],
  Excel: ['Mphasis — 6 hrs/week saved', 'Supply Chain Reporting'],
  'Power Automate': ['Meijer — 6 reports automated'],
  UiPath: ['Meijer — 10 hrs/week saved'],
  OpenPyXL: ['Mphasis — workbook scripting'],
  'REST APIs': ['Mphasis — Python Requests'],
  'Python Requests': ['Mphasis — REST API retrieval'],
  JSON: ['Mphasis — API responses'],
  'Requirements Gathering': ['Meijer — finance & operations', 'Mphasis', 'BI Reporting System'],
  'KPI Definition': ['Mphasis — 15 KPIs', 'Meijer'],
  UAT: ['Mphasis — reporting validation'],
};

export type Episode = {
  code: string;
  title: string;
  description: string;
  tags: string[];
  runtime: string;
  palette: Palette;
};

export type Season = {
  number: number;
  title: string;
  period: string;
  synopsis: string;
  episodes: Episode[];
};

const crimson: Palette = { from: '#24060b', via: '#6e0d1d', to: '#09070a', accent: '#ff3d5a' };
const amber: Palette = { from: '#1c1003', via: '#6b3c06', to: '#0a0806', accent: '#ffb547' };
const ocean: Palette = { from: '#04121f', via: '#0f4c6e', to: '#05080d', accent: '#4cc9ff' };
const violet: Palette = { from: '#120822', via: '#3d1a6e', to: '#07060c', accent: '#b98bff' };
const jade: Palette = { from: '#03150f', via: '#0d5a40', to: '#050a08', accent: '#46e3a8' };

export const seasons: Season[] = [
  {
    number: 1,
    title: 'The Foundation',
    period: 'Class of 2021',
    synopsis: 'A Bachelor of Science in Computer Science at Sathyabama University, Chennai.',
    episodes: [
      {
        code: 'S01 E01',
        title: 'The Computer Scientist',
        description: 'Bachelor of Science in Computer Science — Sathyabama University, Chennai, India.',
        tags: ['B.S.', 'Computer Science'],
        runtime: '2021',
        palette: amber,
      },
    ],
  },
  {
    number: 2,
    title: 'Enter: Data',
    period: '2020 – 2023',
    synopsis: 'Data & Business Analyst at Mphasis, Bangalore — dashboards, integration, automation and KPIs.',
    episodes: [
      {
        code: 'S02 E01',
        title: 'The Dashboard Builder',
        description: '10 interactive Power BI dashboards that gave 40 stakeholders self-service reporting and reduced ad hoc requests.',
        tags: ['Power BI', 'DAX', 'Self-service'],
        runtime: 'Mphasis',
        palette: crimson,
      },
      {
        code: 'S02 E02',
        title: 'The Integrator',
        description: 'Data from 4 sources combined with SQL and Power Query into structured reporting datasets — 30% less report preparation time.',
        tags: ['SQL', 'CTEs', 'Power Query'],
        runtime: '30% faster',
        palette: ocean,
      },
      {
        code: 'S02 E03',
        title: 'The Automator',
        description: 'Recurring Excel reports automated with PivotTables, Power Query and formulas — 6 hours a week back. Workbooks scripted in Python with OpenPyXL; data pulled from REST APIs.',
        tags: ['Excel', 'OpenPyXL', 'REST APIs'],
        runtime: '6 hrs / week',
        palette: jade,
      },
      {
        code: 'S02 E04',
        title: 'The Business Partner',
        description: 'Gathered and documented requirements, defined 15 KPIs with stakeholders and supported UAT to validate reporting against business needs.',
        tags: ['Requirements', 'KPIs', 'UAT'],
        runtime: '15 KPIs',
        palette: violet,
      },
    ],
  },
  {
    number: 3,
    title: 'The Master’s',
    period: 'Graduated 2025',
    synopsis: 'A Master of Science in Computer Science at Grand Valley State University, plus two independent BI productions.',
    episodes: [
      {
        code: 'S03 E01',
        title: 'The Graduate',
        description: 'Master of Science in Computer Science — Grand Valley State University, Allendale, MI.',
        tags: ['M.S.', 'Computer Science'],
        runtime: 'August 2025',
        palette: violet,
      },
      {
        code: 'S03 E02',
        title: 'The Supply Chain Story',
        description: 'Power BI dashboards and SQL analysis across inventory, orders, delivery delays and distribution — one view of supply chain health.',
        tags: ['SQL', 'Power BI', 'Excel'],
        runtime: 'Original',
        palette: ocean,
      },
      {
        code: 'S03 E03',
        title: 'The Reporting Model',
        description: 'An end-to-end BI reporting system: source data preparation, a unified reporting model and the final KPI views.',
        tags: ['Power BI', 'Data Modeling'],
        runtime: 'Original',
        palette: amber,
      },
    ],
  },
  {
    number: 4,
    title: 'Now Streaming',
    period: '2025 – Present',
    synopsis: 'Data Analyst at Meijer, Grand Rapids — operational reporting for finance and operations.',
    episodes: [
      {
        code: 'S04 E01',
        title: 'The Retail Analyst',
        description: '4 Power BI dashboards on operational performance, process volume and KPIs — weekly visibility for 25 stakeholders.',
        tags: ['Power BI', 'DAX', 'Data Modeling'],
        runtime: 'Apr 2025 – Now',
        palette: crimson,
      },
      {
        code: 'S04 E02',
        title: 'The Million Rows',
        description: 'SQL against Snowflake to extract, join and aggregate 1M+ row datasets for trend, volume and process-flow analysis.',
        tags: ['SQL', 'Snowflake'],
        runtime: '1M+ rows',
        palette: ocean,
      },
      {
        code: 'S04 E03',
        title: 'The Automator Returns',
        description: '6 recurring reports and data workflows automated with Power Automate, UiPath and Power BI — 10 hours a week saved.',
        tags: ['Power Automate', 'UiPath'],
        runtime: '10 hrs / week',
        palette: jade,
      },
      {
        code: 'S04 E04',
        title: 'The Quality Gate',
        description: 'Python and Pandas workflows that flag missing values and duplicates, plus validation checks that reduce rework in finance reporting.',
        tags: ['Python', 'Pandas', 'Data Quality'],
        runtime: 'In production',
        palette: amber,
      },
    ],
  },
];

export type TopPick = { label: string; title: string; detail: string; palette: Palette };

export const topPicks: TopPick[] = [
  { label: 'Core language', title: 'SQL', detail: 'Joins, aggregations & CTEs • Snowflake', palette: amber },
  { label: 'Biggest dataset', title: '1M+ Rows', detail: 'Queried in Snowflake at Meijer', palette: ocean },
  { label: 'Time given back', title: '10 hrs / week', detail: '6 reports automated at Meijer', palette: jade },
  { label: 'Dashboards shipped', title: '14', detail: '10 at Mphasis • 4 at Meijer', palette: crimson },
  { label: 'Widest audience', title: '40 Stakeholders', detail: 'Self-service reporting at Mphasis', palette: violet },
  { label: 'Faster reporting', title: '30%', detail: 'Less report prep • 4 sources integrated', palette: amber },
  { label: 'Business partner', title: '15 KPIs', detail: 'Defined with stakeholders • validated in UAT', palette: ocean },
  { label: 'Experience', title: '4+ Years', detail: 'Retail & IT services operations', palette: jade },
  { label: 'Latest degree', title: 'M.S. CS', detail: 'Grand Valley State University • 2025', palette: violet },
  { label: 'Now streaming', title: 'Meijer', detail: 'Data Analyst since April 2025', palette: crimson },
];

/** Slides for the "▶ Play Intro" cinematic sequence. */
export type IntroSlide = { kicker: string; title: string; lines: string[]; chips?: string[] };

export const introSlides: IntroSlide[] = [
  {
    kicker: 'Now playing',
    title: 'Data Analyst',
    lines: ['Meijer · Grand Rapids, MI', 'April 2025 – Present'],
    chips: ['4+ years', 'Retail', 'IT services'],
  },
  {
    kicker: 'Skills',
    title: 'SQL first.',
    lines: ['Python, Pandas, NumPy · Power BI, DAX, Power Query', 'Snowflake, SQL Server, PostgreSQL, Databricks, Fabric'],
    chips: ['SQL', 'Python', 'Power BI', 'Excel', 'Snowflake'],
  },
  {
    kicker: 'Dashboards',
    title: '14 Dashboards',
    lines: ['4 at Meijer — weekly visibility for 25 stakeholders', '10 at Mphasis — self-service for 40 stakeholders'],
  },
  {
    kicker: 'Automation',
    title: 'Hours Back',
    lines: ['10 hrs / week — 6 reports automated at Meijer', '6 hrs / week — Excel reporting automated at Mphasis', '30% less report prep — 4 sources integrated'],
  },
  {
    kicker: 'Projects',
    title: 'Four Originals',
    lines: ['Operations BI at Meijer', 'Self-Service BI at Mphasis', 'Supply Chain Reporting · BI Reporting System'],
  },
  {
    kicker: 'Education',
    title: 'M.S. Computer Science',
    lines: ['Grand Valley State University, Allendale, MI · August 2025', 'B.S. Computer Science · Sathyabama University · 2021'],
  },
];

export type ProfileId = 'likitha' | 'recruiter' | 'analyst' | 'creative';
export type SectionId = 'about' | 'journey' | 'originals' | 'picks' | 'skills' | 'moments' | 'story';

export const viewerProfiles: {
  id: ProfileId;
  name: string;
  blurb: string;
  color: string;
  order: SectionId[];
}[] = [
  {
    id: 'likitha',
    name: 'Likitha',
    blurb: 'The full series, in order',
    color: '#e5132b',
    order: ['about', 'journey', 'originals', 'picks', 'skills', 'moments', 'story'],
  },
  {
    id: 'recruiter',
    name: 'Recruiter',
    blurb: 'Resume, impact & skills first',
    color: '#4cc9ff',
    order: ['story', 'moments', 'skills', 'originals', 'about', 'journey', 'picks'],
  },
  {
    id: 'analyst',
    name: 'Data Team',
    blurb: 'Dashboards, stack & projects first',
    color: '#46e3a8',
    order: ['originals', 'skills', 'moments', 'journey', 'about', 'picks', 'story'],
  },
  {
    id: 'creative',
    name: 'Creative',
    blurb: 'The story arc & highlights first',
    color: '#ffb547',
    order: ['journey', 'picks', 'originals', 'moments', 'about', 'skills', 'story'],
  },
];

const episodeCount = seasons.reduce((n, s) => n + s.episodes.length, 0);

export const sectionMeta: Record<SectionId, { nav: string; card: string; meta: string; palette: Palette }> = {
  about: { nav: 'About', card: 'About Me', meta: 'The Pilot • Experience & education', palette: violet },
  journey: { nav: 'Journey', card: 'My Journey', meta: `${seasons.length} Seasons • ${episodeCount} Episodes`, palette: amber },
  originals: { nav: 'Originals', card: 'My Projects', meta: `${projects.length} Originals • 2020 – Now`, palette: crimson },
  picks: { nav: 'Top Picks', card: 'Top Picks', meta: 'Top 10 from the resume', palette: jade },
  skills: { nav: 'Skills', card: 'My Skills', meta: `${skillCategories.length} Categories`, palette: ocean },
  moments: {
    nav: 'Impact',
    card: 'My Impact',
    meta: certifications.length ? `${achievements.length} Moments • ${certifications.length} Certifications` : `${achievements.length} Impact moments`,
    palette: crimson,
  },
  story: { nav: 'Resume', card: 'The Full Story', meta: 'Resume • View & download', palette: violet },
};
