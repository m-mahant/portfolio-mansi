import { initFirebaseAdmin, db } from '../src/config/firebase.config';
import { FieldValue } from 'firebase-admin/firestore';
import {
  SiteSettings,
  AboutProfile,
  SocialLink,
  Project,
  Artwork,
  Experience,
  Education,
  ThemeSettings,
  Media,
  Blog,
  IntroPageConfig,
  HomePageConfig,
  WorkPageConfig,
  ContactPageConfig,
  DevelopmentPageConfig,
  ArtPageConfig,
  BlogPageConfig,
  ExperiencePageConfig,
} from '../src/types/database.types';
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from '../src/lib/brand';

const SAMPLE_MEDIA_URL = 'https://placehold.co/1200x800/1f2937/f9fafb.png?text=Portfolio';

// Populates Cloud Firestore with realistic portfolio data across all collections.
export async function seedFirebaseContent(): Promise<void> {
  console.log('Initializing Firebase Admin SDK...');
  initFirebaseAdmin();

  if (!db) {
    throw new Error('Firestore database instance is not initialized.');
  }

  const now = new Date().toISOString();

  // 1. SITE SETTINGS (siteSettings/general)
  console.log('Seeding siteSettings/general...');
  const siteSettings: SiteSettings = {
    siteName: BRAND_NAME,
    siteTitle: `${BRAND_NAME} — Portfolio`,
    siteSubtitle: BRAND_TAGLINE,
    shortDescription: BRAND_DESCRIPTION,
    logo: {
      mediaId: 'med-site-logo-01',
      url: SAMPLE_MEDIA_URL,
      storagePath: 'portfolio/site/logo.jpg',
      altText: 'Mansi Mahant Logo',
    },
    favicon: {
      mediaId: 'med-site-favicon-01',
      url: SAMPLE_MEDIA_URL,
      storagePath: 'portfolio/site/favicon.jpg',
      altText: 'Favicon',
    },
    copyrightText: '© 2026 Mansi Mahant. All rights reserved.',
    seo: {
      title: `${BRAND_NAME} — Dynamic multi-work portfolio`,
      description: BRAND_DESCRIPTION,
      keywords: ['Portfolio CMS', 'Software', 'Art', 'Writing', 'Experience', 'Next.js', 'Firestore'],
    },
    updatedAt: now,
  };
  await db.collection('siteSettings').doc('general').set(siteSettings, { merge: true });
  await db.collection('siteSettings').doc('general').update({
    email: FieldValue.delete(),
    location: FieldValue.delete(),
    availabilityStatus: FieldValue.delete(),
    resumeUrl: FieldValue.delete(),
    resumeMediaId: FieldValue.delete(),
    resumeDownloadLabel: FieldValue.delete(),
    showResume: FieldValue.delete(),
    showContact: FieldValue.delete(),
    showSocialLinks: FieldValue.delete(),
  });

  // 2. ABOUT PROFILE (about/profile)
  console.log('Seeding about/profile...');
  const aboutProfile: AboutProfile = {
    introduction: 'Bridging the worlds of robust systems architecture and immersive digital visual arts.',
    shortBio: 'Senior Full-Stack Engineer and Creative Technologist crafting cloud-native applications and generative digital artwork.',
    longBio: 'With over 8 years of experience engineering scalable web platforms, distributed microservices, and interactive user interfaces, I combine rigorous software principles with a passion for digital illustration, 3D render composition, and algorithmic craft.',
    myStory: 'My journey began with a dual fascination: the mathematical beauty of algorithms and the expressive freedom of visual arts. Over the past decade, I have built production enterprise systems while continuing to explore procedural shaders, ceramics, and digital illustration.',
    developerSide: 'On the technical front, I specialize in TypeScript, React, Next.js, Node.js, Cloud Native infrastructure, microservices architecture, and database design with high emphasis on performance, type-safety, and SOLID principles.',
    artistSide: 'On the creative front, I craft 3D visual environments, generative shader art, digital paintings, and physical ceramics that challenge the boundaries between code and organic form.',
    philosophy: 'Code is structural art; art is expressive logic. Every system should be as elegant internally as it is captivating visually.',
    whatIDo: [
      'Cloud Native Systems Architecture',
      'Full-Stack Web Application Engineering',
      'Real-Time Collaborative Tools & WebSockets',
      '3D Visual Environments & Shader Art',
      'Digital Illustration & Editorial Design',
      'RESTful & GraphQL API Design',
    ],
    interests: [
      'Generative Shader Art',
      'Ceramic Sculpting & Wheel Throwing',
      'Distributed Systems & Event-Driven Architecture',
      'WebGPU & Real-Time Computer Graphics',
      'Algorithmic Pattern Generation',
      'Open Source Software',
    ],
    resumeUrl: SAMPLE_MEDIA_URL,
    resumeLabel: 'Download Full Resume',
    profileImage: {
      mediaId: '6a97bf8d83c1c6139f7e2f86',
      url: SAMPLE_MEDIA_URL,
      altText: 'Mansi Mahant Portrait',
    },
    secondaryImage: {
      mediaId: '6a97bf8d83c1c6139f7e2f86',
      url: SAMPLE_MEDIA_URL,
      altText: 'Studio and Workspace',
    },
    seo: {
      title: 'About — Mansi Mahant',
      description: "Learn about Mansi Mahant's dual identity as Software Engineer and Digital Artist.",
    },
    updatedAt: now,
  };
  await db.collection('about').doc('profile').set(aboutProfile, { merge: true });

  // 2B. PAGE CONFIGURATIONS (intro, home, work, listing pages, contact)
  console.log('Seeding introPage/config...');
  const introPageConfig: IntroPageConfig = {
    headline: 'Where Logic Meets',
    headlineAccent: 'Imagination',
    subtitle: 'Engineering digital experiences with the precision of code and the freedom of art.',
    exploreButtonLabel: 'Explore Portfolio',
    exploreButtonTarget: '/',
    loadingText: 'MANSI MAHANT',
    autoRedirect: false,
    autoRedirectDelay: 5000,
    showOnInitialVisit: true,
    redirectTarget: '/',
    enabled: true,
    seo: {
      title: 'Welcome | Mansi Mahant',
      description: "Entry experience for Mansi Mahant's portfolio.",
    },
    updatedAt: now,
  };
  await db.collection('introPage').doc('config').set(introPageConfig);

  console.log('Seeding homePage/config...');
  const homePageConfig: HomePageConfig = {
    hero: {
      mainHeading: 'Building Digital Futures × Creative Crafts',
      accentHeading: 'Full-stack engineering meets visual design & digital craftsmanship.',
      description: 'Specializing in robust cloud architecture, interactive frontends, and fine digital illustration.',
      profileImage: {
        mediaId: '6a97bf8d83c1c6139f7e2f86',
        url: SAMPLE_MEDIA_URL,
        altText: 'Home hero portrait',
      },
      devCardTitle: 'Software Engineering',
      devCardDescription: 'Full-stack web apps, cloud architectures, REST APIs, and high-performance algorithms.',
      artCardTitle: 'Creative Visual Art',
      artCardDescription: 'Digital illustrations, 3D modeling, traditional painting, and interactive visual media.',
      devCtaText: 'Explore Engineering Work',
      devCtaTarget: '/work/development',
      artCtaText: 'View Digital Art Gallery',
      artCtaTarget: '/work/art-crafts',
    },
    seo: {
      title: 'Home | Mansi Mahant',
      description: 'Official portfolio showcasing full-stack engineering projects and digital artwork.',
    },
    updatedAt: now,
  };
  await db.collection('homePage').doc('config').set(homePageConfig, { merge: true });

  console.log('Seeding workPage/config...');
  const workPageConfig: WorkPageConfig = {
    title: 'Work Overview',
    subtitle: 'Select a discipline to view published projects and creative artwork.',
    description: 'Comprehensive gallery of software engineering projects and digital artwork portfolios.',
    devTitle: 'Development',
    devDescription: 'Full-stack web engineering, cloud architecture diagrams, API specs, and technical case studies.',
    artTitle: 'Art & Crafts',
    artDescription: 'Digital illustrations, 3D modeling, creative media, and artistic process documentation.',
    seo: {
      title: 'Work Overview | Mansi Mahant',
      description: 'Explore software development case studies and creative digital art portfolios.',
    },
    updatedAt: now,
  };
  await db.collection('workPage').doc('config').set(workPageConfig, { merge: true });
  await db.collection('workPage').doc('config').update({
    featuredProjectIds: FieldValue.delete(),
    featuredArtworkIds: FieldValue.delete(),
  });

  console.log('Seeding developmentPage/config...');
  const developmentPageConfig: DevelopmentPageConfig = {
    title: 'Software Development Portfolio',
    subtitle:
      'Explore software engineering case studies, full-stack architectures, API systems, and production implementations.',
    seo: {
      title: 'Software Development Portfolio | Mansi Mahant',
      description:
        'Explore software engineering case studies, full-stack architectures, API systems, and production implementations.',
    },
    updatedAt: now,
  };
  await db.collection('developmentPage').doc('config').set(developmentPageConfig, { merge: true });

  console.log('Seeding artPage/config...');
  const artPageConfig: ArtPageConfig = {
    eyebrow: 'Art & Crafts',
    title: 'Art & Crafts Portfolio',
    subtitle:
      'Explore 3D renders, digital illustrations, generative code artwork, and tactile handcrafted ceramics.',
    description:
      'A curated space showcasing the dialogue between digital precision and physical craftsmanship. From procedural GLSL shaders to wheel-thrown stoneware ceramics, every piece embodies an exploration in medium, texture, light, and geometry.',
    galleryHeading: 'Art & Crafts Gallery',
    seo: {
      title: 'Art & Crafts Gallery | Mansi Mahant',
      description:
        'Explore 3D renders, digital illustrations, generative code artwork, and handcrafted fine ceramics.',
    },
    updatedAt: now,
  };
  await db.collection('artPage').doc('config').set(artPageConfig, { merge: true });

  console.log('Seeding blogPage/config...');
  const blogPageConfig: BlogPageConfig = {
    title: 'Blog & Articles',
    subtitle: 'Insights, engineering reflections, design patterns, and creative notes.',
    seo: {
      title: 'Blog & Articles | Mansi Mahant',
      description: 'Insights, engineering reflections, design patterns, and creative notes.',
    },
    updatedAt: now,
  };
  await db.collection('blogPage').doc('config').set(blogPageConfig, { merge: true });

  console.log('Seeding experiencePage/config...');
  const experiencePageConfig: ExperiencePageConfig = {
    title: 'Professional Experience & Education',
    subtitle:
      'A timeline of software engineering roles, technical leadership positions, cloud infrastructure projects, and formal academic background.',
    educationSectionTitle: 'Education & Certifications',
    educationSectionSubtitle: 'Academic background and professional certifications.',
    seo: {
      title: 'Experience & Education | Mansi Mahant',
      description:
        'A timeline of software engineering roles, technical leadership positions, and formal academic background.',
    },
    updatedAt: now,
  };
  await db.collection('experiencePage').doc('config').set(experiencePageConfig, { merge: true });

  console.log('Seeding contactPage/config...');
  const contactPageConfig: ContactPageConfig = {
    heading: 'Get In Touch',
    subtitle: 'Have a project in mind, need technical advisory, or want to commission digital art?',
    email: 'hello@example.com',
    location: 'San Francisco, CA',
    availabilityStatus: 'Available for Senior Full-Stack Engineering & Creative Technologist opportunities',
    showForm: true,
    closedTitle: 'Commissions Currently Closed',
    closedMessage: 'Thank you for your interest. Contact submissions are temporarily paused.',
    resumeUrl: SAMPLE_MEDIA_URL,
    resumeLabel: 'Download Full Resume',
    seo: {
      title: 'Contact | Mansi Mahant',
      description: 'Get in touch for engineering roles, technical consulting, or artwork commissions.',
    },
    updatedAt: now,
  };
  await db.collection('contactPage').doc('config').set(contactPageConfig, { merge: true });


  // 3. SOCIAL LINKS (socialLinks/{socialId})
  console.log('Seeding socialLinks (7 entries)...');
  const socialLinks: SocialLink[] = [
    {
      id: 'social-01',
      platform: 'GitHub',
      label: '@example',
      url: 'https://github.com/example',
      icon: 'github',
      displayOrder: 1,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'social-02',
      platform: 'LinkedIn',
      label: 'Mansi Mahant',
      url: 'https://linkedin.com/in/example',
      icon: 'linkedin',
      displayOrder: 2,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'social-03',
      platform: 'Email',
      label: 'hello@example.com',
      url: 'mailto:hello@example.com',
      icon: 'email',
      displayOrder: 3,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'social-04',
      platform: 'Behance',
      label: 'example',
      url: 'https://behance.net/example',
      icon: 'behance',
      displayOrder: 4,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'social-05',
      platform: 'Dribbble',
      label: 'example',
      url: 'https://dribbble.com/example',
      icon: 'dribbble',
      displayOrder: 5,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'social-06',
      platform: 'Instagram',
      label: '@example',
      url: 'https://instagram.com/example',
      icon: 'instagram',
      displayOrder: 6,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'social-07',
      platform: 'ArtStation',
      label: 'example',
      url: 'https://artstation.com/example',
      icon: 'artstation',
      displayOrder: 7,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const validSocialIds = new Set(socialLinks.map((s) => s.id));
  const existingSocialSnap = await db.collection('socialLinks').get();
  for (const doc of existingSocialSnap.docs) {
    if (!validSocialIds.has(doc.id)) {
      await doc.ref.delete();
    }
  }
  for (const item of socialLinks) {
    await db.collection('socialLinks').doc(item.id).set(item, { merge: true });
  }

  // 4. DEVELOPMENT PROJECTS (projects/{projectId}) - 20 records
  console.log('Seeding projects (5 entries)...');
  const projects: Project[] = [
    {
      id: 'project-01',
      title: 'Personal Portfolio CMS',
      slug: 'personal-portfolio-cms',
      subtitle: 'Dynamic Portfolio Fusing Software Engineering & Editorial Art',
      shortDescription: 'A production Next.js 16 and Express REST application powered by Cloud Firestore and ImageKit CDN.',
      description: 'This platform is an advanced portfolio system built with Next.js App Router, Express, and Cloud Firestore. It features dynamic theme token management, OpenAPI Swagger documentation, and a granular CMS layer.',
      coverImage: {
        mediaId: '6a97bf88ccf795e5202d6084', width: 1920, height: 1080,
        url: SAMPLE_MEDIA_URL,
        altText: 'Portfolio platform screenshot',
      },
      status: 'published',
      isFeatured: true,
      displayOrder: 1,
      tags: ['Full-Stack', 'Next.js', 'Express', 'Firebase', 'TypeScript'],
      technologies: ['Next.js 16', 'Express', 'TypeScript', 'Cloud Firestore', 'Tailwind CSS', 'ImageKit'],
      overview: 'Designed to solve the problem of static portfolio maintenance by delivering a fully dynamic, CMS-backed dual identity platform for software developers and digital artists.',
      problem: 'Traditional portfolios either showcase code projects OR creative artwork, forcing multi-disciplinary engineers into rigid single-track presentations with static deployments.',
      solution: 'Engineered an architectural framework combining a headless Node.js/Express API server, Firebase Admin SDK, and Next.js App Router for dynamic Server Component rendering.',
      features: [
        { title: 'Dynamic CMS Control', description: 'Real-time editing of bio, projects, artworks, experience, and theme tokens without redeploying code.' },
        { title: 'Hide Empty Sections Engine', description: 'Automated backend section computation preventing blank visual containers.' },
        { title: 'OpenAPI Swagger UI', description: 'Mounted interactive OpenAPI 3.0 API documentation at /api-docs.' },
      ],
      architecture: {
        enabled: true,
        description: 'Clean repository-service-controller design separating presentation, domain business rules, and Firestore persistence.',
        diagramUrl: SAMPLE_MEDIA_URL,
      },
      workflow: {
        enabled: true,
        description: 'End-to-end client request lifecycle from Next.js Server Components down to Firestore document queries.',
        steps: [
          { stepNumber: 1, title: 'Server Component Fetch', description: 'Next.js Server Component initiates fetch request to backend public API.' },
          { stepNumber: 2, title: 'Repository Evaluation', description: 'Firestore repository executes cached document query and applies status filters.' },
          { stepNumber: 3, title: 'Section Calculation', description: 'Validator logic computes section availability flags before returning response.' },
        ],
      },
      apiFlow: {
        enabled: true,
        description: 'REST API endpoints relative to /api/v1.',
        endpoints: [
          { method: 'GET', path: '/api/v1/projects', description: 'List published development projects', authenticationRequired: false },
          { method: 'GET', path: '/api/v1/projects/:slug', description: 'Get project details by slug', authenticationRequired: false },
        ],
      },
      performance: {
        enabled: false,
        summary: '',
        metrics: [],
      },
      challenges: 'Handling hydration consistency across dynamic server-rendered theme variables and responsive image aspect ratios.',
      results: 'A fully backend-driven dynamic portfolio with no redeploys needed to update content.',
      gallery: [
        { mediaId: 'med-proj-01-g1', url: SAMPLE_MEDIA_URL, altText: 'Dashboard View', displayOrder: 1 },
        { mediaId: 'med-proj-01-g2', url: SAMPLE_MEDIA_URL, altText: 'Detail Case Study', displayOrder: 2 },
      ],
      links: [
        { label: 'GitHub Repository', url: 'https://github.com/m-mahant/portfolio-mansi', type: 'github', isVisible: true, displayOrder: 1 },
      ],
      seo: { title: 'Personal Portfolio CMS', description: 'Case study of this portfolio platform\'s architecture.' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'project-02',
      title: 'OmniCloud Analytics SaaS',
      slug: 'omnicloud-analytics-saas',
      subtitle: 'Real-time Multi-Tenant Cloud Telemetry & Cost Optimization Platform',
      shortDescription: 'Enterprise SaaS processing multi-cloud telemetry streams, anomalies, and infrastructure cost optimization.',
      description: 'OmniCloud Analytics provides unified visibility across AWS, Azure, and GCP workloads. Built with Go, Node.js microservices, Kafka event streams, and React dashboard UI.',
      coverImage: {
        mediaId: '6a97bf88ccf795e5202d6088', width: 1920, height: 1080,
        url: SAMPLE_MEDIA_URL,
        altText: 'OmniCloud Analytics SaaS Platform',
      },
      status: 'published',
      isFeatured: true,
      displayOrder: 2,
      tags: ['SaaS', 'Cloud Infrastructure', 'Go', 'Kafka', 'React'],
      technologies: ['Go', 'Node.js', 'Apache Kafka', 'PostgreSQL', 'TimescaleDB', 'React', 'Tailwind CSS'],
      overview: 'Multi-cloud monitoring system built to aggregate multi-region metrics and detect infrastructure cost drift in real-time.',
      problem: 'Enterprise devops teams struggle with fragmented billing dashboards and delayed alerts across cloud providers.',
      solution: 'Architected an event-driven ingestion pipeline handling over 50,000 events/sec with automated anomaly detection models.',
      features: [
        { title: 'Unified Billing Dashboard', description: 'Single-pane-of-glass tracking AWS, Azure, and GCP expenditure.' },
        { title: 'Real-time Drift Alerts', description: 'Instant Slack and PagerDuty notifications on unexpected compute scaling.' },
      ],
      performance: {
        enabled: true,
        summary: 'Ingestion throughput exceeding 50k events per second with under 10ms processing latency.',
        metrics: [
          { name: 'Ingestion Rate', value: '50000', unit: 'msg/s' },
          { name: 'Query Latency', value: '12', unit: 'ms' },
        ],
      },
      challenges: 'Partitioning high-throughput TimescaleDB tables while preserving fast windowed aggregations.',
      results: 'Reduced client cloud infrastructure overspending by an average of 28% within the first month.',
      links: [
        { label: 'Live Platform', url: 'https://omnicloud.example.com', type: 'live', isVisible: true, displayOrder: 1 },
      ],
      seo: { title: 'OmniCloud Analytics SaaS', description: 'Cloud infrastructure telemetry and cost optimization platform case study.' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'project-03',
      title: 'KubeTrace CLI & Telemetry Engine',
      slug: 'kubetrace-cli-telemetry',
      subtitle: 'Rust-Powered Kubernetes eBPF Network Tracing & Security Tool',
      shortDescription: 'High-performance CLI tool using eBPF probes for zero-overhead Kubernetes container tracing.',
      description: 'KubeTrace is a lightweight Rust binary that injects eBPF probes into Linux kernels to monitor pod-to-pod network connectivity, system calls, and security anomalies without sidecar proxies.',
      coverImage: {
        mediaId: '6a97bf88ccf795e5202d608c', width: 702, height: 986,
        url: SAMPLE_MEDIA_URL,
        altText: 'KubeTrace CLI Tool',
      },
      status: 'published',
      isFeatured: true,
      displayOrder: 3,
      tags: ['Developer Tools', 'Rust', 'Kubernetes', 'eBPF', 'Security'],
      technologies: ['Rust', 'eBPF', 'libbpf-rs', 'Kubernetes API', 'Tokio', 'Clap'],
      overview: 'Developer tool built to diagnose microservice latency bottlenecks at the kernel level without mutating pod manifests.',
      problem: 'Traditional sidecar proxies add noticeable latency and CPU overhead to microservice service meshes.',
      solution: 'Leveraged eBPF kernel hooks to capture socket traffic and sys-calls directly with sub-1% CPU impact.',
      features: [
        { title: 'Zero Sidecar Overhead', description: 'Observes all network packets at the eBPF layer without proxy proxies.' },
        { title: 'Terminal UI Topology Visualizer', description: 'Live interactive ratatui-based graph of cluster traffic flow.' },
      ],
      results: 'Adopted by 1,200+ Kubernetes operators with over 5,000 GitHub stars.',
      links: [
        { label: 'GitHub Repository', url: 'https://github.com/example/kubetrace', type: 'github', isVisible: true, displayOrder: 1 },
      ],
      seo: { title: 'KubeTrace CLI Tool', description: 'Rust eBPF Kubernetes network tracing tool.' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'project-04',
      title: 'Nexus Cloud Mesh Control Plane',
      slug: 'nexus-cloud-mesh-control-plane',
      subtitle: 'Distributed Service Mesh Control Plane with mTLS & Traffic Shaping',
      shortDescription: 'Cloud-native control plane providing mTLS encryption, canary deployments, and rate-limiting across multi-region Kubernetes clusters.',
      description: 'Nexus Cloud Mesh provides declarative traffic routing, service discovery, and automated TLS certificate rotation across edge Kubernetes deployments.',
      coverImage: {
        mediaId: '6a97bf88ccf795e5202d6090', width: 1920, height: 1080,
        url: SAMPLE_MEDIA_URL,
        altText: 'Nexus Cloud Mesh Architecture',
      },
      status: 'published',
      isFeatured: false,
      displayOrder: 4,
      tags: ['Cloud Platforms', 'Go', 'Kubernetes', 'gRPC', 'Envoy'],
      technologies: ['Go', 'Envoy Proxy', 'gRPC', 'Kubernetes CRDs', 'Cert-Manager', 'Prometheus'],
      overview: 'Control plane managing distributed Envoy proxies across 12 cloud regions.',
      problem: 'Managing mTLS certificates and canary rules manually across multi-cloud clusters is error-prone.',
      solution: 'Built a Custom Resource Definition (CRD) controller in Go using controller-runtime to sync state in 500ms.',
      results: 'Automated 100% of internal mTLS certificate rotations for 4,000+ workloads.',
      seo: { title: 'Nexus Cloud Mesh Control Plane', description: 'Distributed service mesh control plane case study.' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'project-05',
      title: 'DataPulse Streaming Pipeline',
      slug: 'datapulse-streaming-pipeline',
      subtitle: 'High-Throughput Real-Time ETL & Complex Event Processing Engine',
      shortDescription: 'Scalable data pipeline processing 200k financial events per second using Apache Flink and ClickHouse.',
      description: 'DataPulse ingest and transforms live financial tick data, executing continuous window queries and writing structured columnar metrics to ClickHouse for instant OLAP dashboards.',
      coverImage: {
        mediaId: '6a97bf88ccf795e5202d6094', width: 1920, height: 1080,
        url: SAMPLE_MEDIA_URL,
        altText: 'DataPulse Streaming Engine',
      },
      status: 'published',
      isFeatured: false,
      displayOrder: 5,
      tags: ['Data Platforms', 'Java', 'Apache Flink', 'ClickHouse', 'Kafka'],
      technologies: ['Java 21', 'Apache Flink', 'Apache Kafka', 'ClickHouse', 'Docker', 'Grafana'],
      overview: 'Low-latency financial data ingestion platform capable of real-time sliding window aggregations.',
      problem: 'Legacy batch jobs caused a 4-hour delay in intraday financial reporting and risk analytics.',
      solution: 'Rebuilt reporting pipeline around Apache Flink stream processing and ClickHouse columnar storage.',
      results: 'Reduced reporting latency from 4 hours to under 300 milliseconds.',
      seo: { title: 'DataPulse Streaming Pipeline', description: 'Real-time Flink and ClickHouse streaming analytics engine.' },
      createdAt: now,
      updatedAt: now,
    }
  ];

  const validProjectIds = new Set(projects.map((p) => p.id));
  const existingProjSnap = await db.collection('projects').get();
  for (const doc of existingProjSnap.docs) {
    if (!validProjectIds.has(doc.id)) {
      await doc.ref.delete();
    }
  }
  for (const item of projects) {
    if (item.coverImage && item.slug) {
      item.coverImage.storagePath = `portfolio/development/${item.slug}/cover.png`;
      item.coverImage.url = SAMPLE_MEDIA_URL;
    }
    await db.collection('projects').doc(item.id).set(item, { merge: true });
  }

  // 5. ARTWORKS (artworks/{artworkId}) - 20 records
  console.log('Seeding artworks (5 entries)...');
  const artworks: Artwork[] = [
    {
      id: 'artwork-01',
      title: 'Ethereal Digital Canvas',
      slug: 'ethereal-digital-canvas',
      subtitle: 'Abstract Chromatic Fluid Dynamics & Light Dispersion',
      shortDescription: 'Generative digital artwork exploring fluid light refraction and organic color gradients.',
      description: 'Ethereal Digital Canvas is a high-resolution generative piece crafted using GLSL fragment shaders and post-processed digital painting techniques. It visualizes the unseen turbulence of light passing through prismatic mediums.',
      category: 'Digital Art',
      tags: ['Digital Painting', 'Generative Shaders', 'Abstract Light', 'Fluid Dynamics'],
      materials: ['GLSL Shaders', 'Procreate', 'Adobe Photoshop', 'Digital Stylus'],
      year: '2026',
      dimensions: '7680 x 4320 px (8K Ultra HD)',
      inspiration: 'Inspired by quantum optics and the natural caustics formed by sunlight penetrating deep water.',
      process: 'Developed custom raymarching GLSL code to model light refraction, then refined layer blending and color curves in Procreate.',
      story: 'Created during an exploration of how mathematical equations can evoke raw human emotion through vibrant visual harmony.',
      featuredImage: {
        mediaId: '6a97bf88ccf795e5202d6098', width: 3554, height: 1999,
        url: SAMPLE_MEDIA_URL,
        altText: 'Ethereal Digital Canvas Artwork',
      },
      images: [
        { mediaId: 'med-art-01-g1', url: SAMPLE_MEDIA_URL, storagePath: '/artworks/ethereal-1.webp', altText: 'Detail View Light Refraction', displayOrder: 1 },
        { mediaId: 'med-art-01-g2', url: SAMPLE_MEDIA_URL, storagePath: '/artworks/ethereal-2.webp', altText: 'Chromatic Dispersion Close-up', displayOrder: 2 },
      ],
      status: 'published',
      isFeatured: true,
      displayOrder: 1,
      seo: { title: 'Ethereal Digital Canvas — Artwork', description: 'Generative digital artwork by Mansi Mahant.' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'artwork-02',
      title: 'Cybernetic Monolith 01',
      slug: 'cybernetic-monolith-01',
      subtitle: '3D Procedural Architecture & Volumetric Fog Render',
      shortDescription: 'Photorealistic 3D render depicting a futuristic brutalist structure illuminated by neon neon circuitry.',
      description: 'A sci-fi architectural visual exploration combining brutalist concrete forms with intricate cybernetic micro-geometry. Rendered in Cycles engine with sub-surface scattering and volumetric fog.',
      category: '3D Render',
      tags: ['Blender 3D', 'Brutalism', 'Cyberpunk', 'Volumetric Lighting'],
      materials: ['Blender 4.2', 'Cycles Renderer', 'Substance Painter', 'Procedural Textures'],
      year: '2025',
      dimensions: '3840 x 5120 px (Vertical 4K)',
      inspiration: 'Influenced by Syd Mead concept art and 1970s architectural brutalism.',
      process: 'Modeled base geometry in Blender, generated procedural panel noise maps, and sculpted volumetric atmosphere passes.',
      story: 'Part of a series contemplating the intersection between ancient stone monuments and future AI compute monoliths.',
      featuredImage: {
        mediaId: '6a97bf88ccf795e5202d609c', width: 3554, height: 1999,
        url: SAMPLE_MEDIA_URL,
        altText: 'Cybernetic Monolith 3D Render',
      },
      images: [
        { mediaId: 'med-art-02-g1', url: SAMPLE_MEDIA_URL, storagePath: '/artworks/cyber-wire.webp', altText: 'Wireframe Geometry View', displayOrder: 1 },
      ],
      status: 'published',
      isFeatured: true,
      displayOrder: 2,
      seo: { title: 'Cybernetic Monolith 01 — 3D Render', description: '3D brutalist cybernetic render case study.' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'artwork-03',
      title: 'Algorithmic Flora Series',
      slug: 'algorithmic-flora-series',
      subtitle: 'L-System Procedural Botanical Code Formations',
      shortDescription: 'Generative code artwork synthesizing organic plant structures through recursive L-System algorithms.',
      description: 'Algorithmic Flora uses mathematical Lindenmayer systems (L-Systems) written in JavaScript p5.js to generate infinite variations of organic botanical stems, leaves, and bioluminescent blossoms.',
      category: 'Generative Art',
      tags: ['Generative Code', 'p5.js', 'L-Systems', 'Algorithmic Art'],
      materials: ['JavaScript', 'p5.js Library', 'SVG Vector Export', 'Plotter Ink'],
      year: '2025',
      dimensions: 'Generative Canvas (Vector Scalable)',
      inspiration: 'Inspired by Aristid Lindenmayer\'s 1968 biological growth models.',
      process: 'Wrote recursive string-rewriting rules in p5.js, mapping production rules to custom vector stroke weights and gradients.',
      story: 'Exploring how simple mathematical rules reproduce complex botanical patterns found in nature.',
      featuredImage: {
        mediaId: '6a97bf88ccf795e5202d60a0', width: 3554, height: 1999,
        url: SAMPLE_MEDIA_URL,
        altText: 'Algorithmic Flora Artwork',
      },
      images: [
        { mediaId: 'med-art-03-g1', url: SAMPLE_MEDIA_URL, storagePath: '/artworks/flora-1.webp', altText: 'Variation Alpha Branching', displayOrder: 1 },
      ],
      status: 'published',
      isFeatured: true,
      displayOrder: 3,
      seo: { title: 'Algorithmic Flora Series — Generative Art', description: 'L-System procedural botanical generative code art.' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'artwork-04',
      title: 'Obsidian Vessel & Cobalt Glaze',
      slug: 'obsidian-vessel-cobalt-glaze',
      subtitle: 'Hand-Thrown Wheel Ceramic Vessel with Crystalline Glaze',
      shortDescription: 'Wheel-thrown black stoneware clay vessel finished with a hand-formulated matte cobalt crystalline glaze.',
      description: 'A physical ceramic artwork hand-thrown on the potter\'s wheel using dark iron-rich stoneware clay. Fired to Cone 10 (2350°F) in a reduction kiln atmosphere to develop deep iridescent crystal formations.',
      category: 'Ceramics',
      tags: ['Ceramics', 'Wheel Thrown', 'Glaze Chemistry', 'Physical Craft'],
      materials: ['Dark Stoneware Clay', 'Cobalt Oxide', 'Crystalline Glaze', 'Reduction Firing'],
      year: '2025',
      dimensions: '14" Height x 9" Diameter (Physical)',
      inspiration: 'Traditional Japanese Raku ceramics paired with modern mineral crystal chemistry.',
      process: 'Centered 8 lbs of stoneware clay on the wheel, pulled thin walls, and fired across a 12-hour controlled cooling schedule.',
      story: 'Ceramic work offers a tactile grounding counterweight to digital software development—where every flaw is permanent and natural.',
      featuredImage: {
        mediaId: '6a97bf88ccf795e5202d60ac', width: 2880, height: 1620,
        url: SAMPLE_MEDIA_URL,
        altText: 'Obsidian Ceramic Vessel',
      },
      images: [
        { mediaId: 'med-art-04-g1', url: SAMPLE_MEDIA_URL, storagePath: '/artworks/vessel-glaze.webp', altText: 'Glaze Crystal Close-up', displayOrder: 1 },
      ],
      status: 'published',
      isFeatured: false,
      displayOrder: 4,
      seo: { title: 'Obsidian Vessel — Ceramic Artwork', description: 'Hand-thrown stoneware ceramic vessel with cobalt glaze.' },
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'artwork-05',
      title: 'Origami Polyhedral Topography',
      slug: 'origami-polyhedral-topography',
      subtitle: 'Precision Architectural Paper Folding & Shadow Sculpture',
      shortDescription: 'Hand-creased architectural paper relief sculpture composed of 300 interlocking geometric polyhedrons.',
      description: 'A meticulous paper craft sculpture crafted from 300 GSM cotton archival paper. Each facet is individually scored, folded, and assembled into a relief grid that transforms dynamically under shifting light angles.',
      category: 'Paper Craft',
      tags: ['Paper Sculpting', 'Origami', 'Architectural Craft', 'Shadow Play'],
      materials: ['300 GSM Archival Cotton Paper', 'Precision Knife', 'Bone Folder', 'Shadow Box Frame'],
      year: '2024',
      dimensions: '24" x 36" x 2" (Framed Wall Sculpture)',
      inspiration: 'Origami tessellations and acoustic damping wall patterns.',
      process: 'Calculated crease patterns digitally in CAD, vector plot scored the paper, and hand-folded each module over 40 hours.',
      story: 'Demonstrating how flat two-dimensional paper sheets evolve into complex three-dimensional structural relief.',
      featuredImage: {
        mediaId: '6a97bf89ccf795e5202d60cc', width: 3554, height: 1999,
        url: SAMPLE_MEDIA_URL,
        altText: 'Origami Polyhedral Sculpture',
      },
      images: [
        { mediaId: 'med-art-05-g1', url: SAMPLE_MEDIA_URL, storagePath: '/artworks/origami-shadows.webp', altText: 'Light and Shadow Directional View', displayOrder: 1 },
      ],
      status: 'published',
      isFeatured: false,
      displayOrder: 5,
      seo: { title: 'Origami Polyhedral Topography — Paper Craft', description: 'Architectural folded paper craft sculpture.' },
      createdAt: now,
      updatedAt: now,
    }
  ];

  const validArtworkIds = new Set(artworks.map((a) => a.id));
  const existingArtSnap = await db.collection('artworks').get();
  for (const doc of existingArtSnap.docs) {
    if (!validArtworkIds.has(doc.id)) {
      await doc.ref.delete();
    }
  }
  for (const item of artworks) {
    if (item.featuredImage && item.slug) {
      item.featuredImage.storagePath = `portfolio/art/${item.slug}/cover.jpg`;
      item.featuredImage.url = SAMPLE_MEDIA_URL;
    }
    if ((item as any).coverImage && item.slug) {
      (item as any).coverImage.storagePath = `portfolio/art/${item.slug}/cover.jpg`;
      (item as any).coverImage.url = SAMPLE_MEDIA_URL;
    }
    if (item.images && Array.isArray(item.images)) {
      item.images.forEach((img: any, idx: number) => {
        img.storagePath = `portfolio/art/${item.slug}/gallery-${idx + 1}.jpg`;
        img.url = SAMPLE_MEDIA_URL;
      });
    }
    await db.collection('artworks').doc(item.id).set(item, { merge: true });
  }

  // 6. EXPERIENCES (experiences/{experienceId}) - 20 records
  console.log('Seeding experiences (5 entries)...');
  const experiences: Experience[] = [
    {
      id: 'experience-01',
      company: 'Apex Digital Labs',
      role: 'Staff Software Engineer & System Architect',
      employmentType: 'Full-time',
      location: 'San Francisco, CA (Hybrid)',
      startDate: '2024-03',
      endDate: 'Present',
      isCurrent: true,
      description: 'Leading core architecture for enterprise cloud platforms, directing microservices migrations, and establishing engineering standards across 4 squads. Mentoring senior engineers and spearheading technical roadmaps.',
      responsibilities: [
        'Architected Next.js and Node.js microservices handling 20M+ daily active requests with 99.99% availability.',
        'Designed zero-trust edge authorization layer using WebAssembly and Cloudflare Workers, cutting origin latency by 35%.',
        'Spearheaded automated CI/CD pipelines reducing deployment lead time from 2 days to 15 minutes.',
        'Mentored 12 software engineers across full-stack TypeScript, Go, and cloud infrastructure best practices.',
      ],
      technologies: ['TypeScript', 'Next.js', 'Node.js', 'Go', 'Kubernetes', 'Cloudflare Workers', 'GraphQL', 'PostgreSQL'],
      achievements: [
        'Reduced overall cloud infrastructure annual spending by $320,000 through automated pod scaling and query optimization.',
        'Awarded Technical Leadership Award for zero-downtime database migration of 40M customer records.',
      ],
      displayOrder: 1,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'experience-02',
      company: 'Vortex Cloud Infrastructure',
      role: 'Senior Full-Stack Engineer',
      employmentType: 'Full-time',
      location: 'San Francisco, CA',
      startDate: '2022-06',
      endDate: '2024-02',
      isCurrent: false,
      description: 'Engineered real-time telemetry dashboards and cloud observability tools for Kubernetes operations teams. Built scalable backend APIs and high-density WebGL frontend consoles.',
      responsibilities: [
        'Developed high-density React & WebGL monitoring dashboard displaying 10,000 active cluster node metrics in real time.',
        'Built Golang ingestion pipelines streaming 50,000 metric events per second into TimescaleDB and ClickHouse.',
        'Implemented OAuth2 and SAML single sign-on (SSO) integration for enterprise enterprise customers.',
      ],
      technologies: ['React', 'TypeScript', 'Go', 'Kafka', 'ClickHouse', 'TimescaleDB', 'Docker', 'Tailwind CSS'],
      achievements: [
        'Accelerated customer incident MTTR by 40% with unified real-time alert correlation views.',
      ],
      displayOrder: 2,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'experience-03',
      company: 'Synthetix AI Systems',
      role: 'Lead Creative Technologist & UI Engineer',
      employmentType: 'Full-time',
      location: 'San Jose, CA (Remote)',
      startDate: '2021-01',
      endDate: '2022-05',
      isCurrent: false,
      description: 'Bridged AI research and frontend design by building node-based visual workflow editors for autonomous LLM agents and computer vision models.',
      responsibilities: [
        'Built drag-and-drop workflow editor using React Flow and TypeScript for building complex AI multi-agent graph flows.',
        'Constructed Python FastAPI backend server managing asynchronous vector searches in Qdrant and OpenAI model completions.',
        'Created custom WebGL particle shaders for real-time visualization of high-dimensional vector embeddings.',
      ],
      technologies: ['React Flow', 'TypeScript', 'Python', 'FastAPI', 'Qdrant Vector DB', 'WebGL', 'Tailwind CSS'],
      achievements: [
        'Published open-source AI agent workflow builder gaining 4,500+ GitHub stars.',
      ],
      displayOrder: 3,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'experience-04',
      company: 'Lumina Interactive Studio',
      role: 'Senior Frontend Developer & UI Designer',
      employmentType: 'Full-time',
      location: 'Oakland, CA',
      startDate: '2019-08',
      endDate: '2020-12',
      isCurrent: false,
      description: 'Crafted high-end editorial web experiences, interactive 3D product showcases, and dynamic brand platforms for Fortune 500 technology clients.',
      responsibilities: [
        'Developed interactive 3D WebGL experiences using Three.js and GSAP smooth scroll animations.',
        'Engineered reusable design systems and component libraries in React and Storybook with strict accessibility compliance.',
        'Optimized Web Vitals performance across 15 client sites, achieving consistent 95+ Lighthouse scores.',
      ],
      technologies: ['React', 'Three.js', 'TypeScript', 'GSAP', 'Storybook', 'Tailwind CSS', 'Next.js'],
      achievements: [
        'Won 3 Awwwards Site of the Day accolades for outstanding creative technical web design.',
      ],
      displayOrder: 4,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'experience-05',
      company: 'Quantum Byte Solutions',
      role: 'Full-Stack Software Engineer',
      employmentType: 'Full-time',
      location: 'San Jose, CA',
      startDate: '2018-02',
      endDate: '2019-07',
      isCurrent: false,
      description: 'Developed RESTful microservices, customer portals, and automated billing integrations for a fast-growing B2B enterprise software provider.',
      responsibilities: [
        'Built Node.js Express REST APIs and connected PostgreSQL database migrations for billing systems.',
        'Integrated Stripe Payment Gateway for automated recurring subscriptions and revenue reporting.',
        'Maintained React single-page application frontend with Redux state management.',
      ],
      technologies: ['Node.js', 'Express', 'React', 'PostgreSQL', 'Stripe API', 'Docker', 'Jest'],
      achievements: [
        'Refactored legacy monolith into Node.js microservices, improving deployment frequency from monthly to daily.',
      ],
      displayOrder: 5,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    }
  ];

  const validExpIds = new Set(experiences.map((e) => e.id));
  const existingExpSnap = await db.collection('experiences').get();
  for (const doc of existingExpSnap.docs) {
    if (!validExpIds.has(doc.id)) {
      await doc.ref.delete();
    }
  }
  for (const item of experiences) {
    await db.collection('experiences').doc(item.id).set(item, { merge: true });
  }

  // 7. EDUCATION (education/{educationId}) - 20 records
  console.log('Seeding education (5 entries)...');
  const education: Education[] = [
    {
      id: 'education-01',
      institution: 'University of California, Berkeley',
      degree: 'Master of Science (M.S.)',
      field: 'Computer Science & Software Systems',
      startDate: '2016-09',
      endDate: '2018-05',
      description: 'Advanced specialization in Distributed Systems, Cloud Architecture, Database Systems, and Computer Graphics.',
      achievements: [
        'Graduated with High Honors (GPA 3.92/4.00).',
        'Master\'s Thesis: Distributed Consensus in Ultra-Low Latency Edge Environments.',
        'Graduate Research Assistant in Cloud Systems Lab.',
      ],
      displayOrder: 1,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'education-02',
      institution: 'California State University, San Jose',
      degree: 'Bachelor of Science (B.S.)',
      field: 'Computer Science',
      startDate: '2012-09',
      endDate: '2016-05',
      description: 'Foundational coursework in Data Structures, Algorithms, Operating Systems, Software Engineering, and Object-Oriented Design.',
      achievements: [
        'Dean\'s Honor List for 6 consecutive semesters.',
        'President of the Computer Science Student Association.',
        '1st Place Winner in Senior Software Engineering Capstone Project.',
      ],
      displayOrder: 2,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'education-03',
      institution: 'Amazon Web Services (AWS)',
      degree: 'AWS Certified Solutions Architect — Professional',
      field: 'Cloud Architecture & Infrastructure',
      startDate: '2024-01',
      endDate: '2027-01',
      description: 'Advanced technical certification validating expertise in designing distributed cloud systems on AWS.',
      achievements: [
        'Passed with score of 940/1000.',
        'Validated skills in multi-account AWS organization setup, VPC peering, and disaster recovery.',
      ],
      displayOrder: 3,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'education-04',
      institution: 'Cloud Native Computing Foundation (CNCF)',
      degree: 'Certified Kubernetes Administrator (CKA)',
      field: 'Container Orchestration & DevOps',
      startDate: '2023-05',
      endDate: '2026-05',
      description: 'Hands-on performance-based certification for installing, configuring, and managing Kubernetes production clusters.',
      achievements: ['Mastered pod networking, RBAC policies, storage classes, and cluster troubleshooting.'],
      displayOrder: 4,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'education-05',
      institution: 'Google Cloud Platform (GCP)',
      degree: 'Google Cloud Certified Professional Cloud Architect',
      field: 'Google Cloud Architecture',
      startDate: '2023-11',
      endDate: '2025-11',
      description: 'Professional certification proving ability to design, develop, and manage robust GCP solutions.',
      achievements: ['Demonstrated proficiency in BigQuery, GKE, Cloud Spanner, and IAM security.'],
      displayOrder: 5,
      isVisible: true,
      createdAt: now,
      updatedAt: now,
    }
  ];

  const validEduIds = new Set(education.map((e) => e.id));
  const existingEduSnap = await db.collection('education').get();
  for (const doc of existingEduSnap.docs) {
    if (!validEduIds.has(doc.id)) {
      await doc.ref.delete();
    }
  }
  for (const item of education) {
    await db.collection('education').doc(item.id).set(item, { merge: true });
  }


  // 9. MEDIA ASSETS (media/{mediaId}) - 43 records
  console.log('Seeding media assets (43 entries)...');
  const mediaAssets: Media[] = [
  {
    "id": "6a97bf88ccf795e5202d6084",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d6084",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 329328,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 1,
    "createdAt": "2026-09-02T06:17:44.606Z",
    "updatedAt": "2026-09-02T06:17:45.996Z"
  },
  {
    "id": "6a97bf88ccf795e5202d6088",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d6088",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 146480,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 2,
    "createdAt": "2026-09-02T06:17:44.611Z",
    "updatedAt": "2026-09-02T06:17:45.998Z"
  },
  {
    "id": "6a97bf88ccf795e5202d608c",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d608c",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 154751,
    "width": 702,
    "height": 986,
    "altText": "Sample media",
    "displayOrder": 3,
    "createdAt": "2026-09-02T06:17:44.614Z",
    "updatedAt": "2026-09-02T06:17:46.000Z"
  },
  {
    "id": "6a97bf88ccf795e5202d6090",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d6090",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 173182,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 4,
    "createdAt": "2026-09-02T06:17:44.616Z",
    "updatedAt": "2026-09-02T06:17:46.001Z"
  },
  {
    "id": "6a97bf88ccf795e5202d6094",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d6094",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 212257,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 5,
    "createdAt": "2026-09-02T06:17:44.618Z",
    "updatedAt": "2026-09-02T06:17:46.003Z"
  },
  {
    "id": "6a97bf88ccf795e5202d6098",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d6098",
    "fileName": "rainforest.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 3148665,
    "width": 3554,
    "height": 1999,
    "altText": "rainforest.jpg",
    "displayOrder": 6,
    "createdAt": "2026-09-02T06:17:44.620Z",
    "updatedAt": "2026-09-02T06:17:46.004Z"
  },
  {
    "id": "6a97bf88ccf795e5202d609c",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d609c",
    "fileName": "seagulls.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 2231783,
    "width": 3554,
    "height": 1999,
    "altText": "seagulls.jpg",
    "displayOrder": 7,
    "createdAt": "2026-09-02T06:17:44.622Z",
    "updatedAt": "2026-09-02T06:17:46.005Z"
  },
  {
    "id": "6a97bf88ccf795e5202d60a0",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d60a0",
    "fileName": "sahalie.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 3078949,
    "width": 3554,
    "height": 1999,
    "altText": "sahalie.jpg",
    "displayOrder": 8,
    "createdAt": "2026-09-02T06:17:44.624Z",
    "updatedAt": "2026-09-02T06:17:46.006Z"
  },
  {
    "id": "6a97bf88ccf795e5202d60a4",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d60a4",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 292656,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 9,
    "createdAt": "2026-09-02T06:17:44.626Z",
    "updatedAt": "2026-09-02T06:17:46.007Z"
  },
  {
    "id": "6a97bf88ccf795e5202d60a8",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d60a8",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 204177,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 10,
    "createdAt": "2026-09-02T06:17:44.628Z",
    "updatedAt": "2026-09-02T06:17:46.008Z"
  },
  {
    "id": "6a97bf88ccf795e5202d60ac",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d60ac",
    "fileName": "small-village.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 2317537,
    "width": 2880,
    "height": 1620,
    "altText": "small-village.jpg",
    "displayOrder": 11,
    "createdAt": "2026-09-02T06:17:44.630Z",
    "updatedAt": "2026-09-02T06:17:46.009Z"
  },
  {
    "id": "6a97bf88ccf795e5202d60b0",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d60b0",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 149565,
    "width": 884,
    "height": 890,
    "altText": "Sample media",
    "displayOrder": 12,
    "createdAt": "2026-09-02T06:17:44.632Z",
    "updatedAt": "2026-09-02T06:17:46.010Z"
  },
  {
    "id": "6a97bf88ccf795e5202d60b4",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d60b4",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 549411,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 13,
    "createdAt": "2026-09-02T06:17:44.634Z",
    "updatedAt": "2026-09-02T06:17:46.011Z"
  },
  {
    "id": "6a97bf88ccf795e5202d60b8",
    "provider": "imagekit",
    "fileId": "6a97bf88ccf795e5202d60b8",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 235075,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 14,
    "createdAt": "2026-09-02T06:17:44.635Z",
    "updatedAt": "2026-09-02T06:17:46.012Z"
  },
  {
    "id": "6a97bf89ccf795e5202d60c8",
    "provider": "imagekit",
    "fileId": "6a97bf89ccf795e5202d60c8",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 400129,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 15,
    "createdAt": "2026-09-02T06:17:45.158Z",
    "updatedAt": "2026-09-02T06:17:46.050Z"
  },
  {
    "id": "6a97bf89ccf795e5202d60cc",
    "provider": "imagekit",
    "fileId": "6a97bf89ccf795e5202d60cc",
    "fileName": "montane.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 1721688,
    "width": 3554,
    "height": 1999,
    "altText": "montane.jpg",
    "displayOrder": 16,
    "createdAt": "2026-09-02T06:17:45.167Z",
    "updatedAt": "2026-09-02T06:17:46.052Z"
  },
  {
    "id": "6a97bf89ccf795e5202d60d0",
    "provider": "imagekit",
    "fileId": "6a97bf89ccf795e5202d60d0",
    "fileName": "hanuman.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 7510285,
    "width": 5120,
    "height": 2880,
    "altText": "hanuman.jpg",
    "displayOrder": 17,
    "createdAt": "2026-09-02T06:17:45.400Z",
    "updatedAt": "2026-09-02T06:17:46.053Z"
  },
  {
    "id": "6a97bf89ccf795e5202d60d4",
    "provider": "imagekit",
    "fileId": "6a97bf89ccf795e5202d60d4",
    "fileName": "forest-.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 4202791,
    "width": 3554,
    "height": 1999,
    "altText": "forest-.jpg",
    "displayOrder": 18,
    "createdAt": "2026-09-02T06:17:45.504Z",
    "updatedAt": "2026-09-02T06:17:46.054Z"
  },
  {
    "id": "6a97bf89ccf795e5202d60d8",
    "provider": "imagekit",
    "fileId": "6a97bf89ccf795e5202d60d8",
    "fileName": "mountain-waterfall.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 2559310,
    "width": 3554,
    "height": 1999,
    "altText": "mountain-waterfall.jpg",
    "displayOrder": 19,
    "createdAt": "2026-09-02T06:17:45.754Z",
    "updatedAt": "2026-09-02T06:17:46.115Z"
  },
  {
    "id": "6a97bf89ccf795e5202d60dc",
    "provider": "imagekit",
    "fileId": "6a97bf89ccf795e5202d60dc",
    "fileName": "landscape.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 4646490,
    "width": 4096,
    "height": 2048,
    "altText": "landscape.jpg",
    "displayOrder": 20,
    "createdAt": "2026-09-02T06:17:45.757Z",
    "updatedAt": "2026-09-02T06:17:46.114Z"
  },
  {
    "id": "6a97bf89ccf795e5202d60e0",
    "provider": "imagekit",
    "fileId": "6a97bf89ccf795e5202d60e0",
    "fileName": "moonlight.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 567275,
    "width": 1920,
    "height": 1080,
    "altText": "moonlight.jpg",
    "displayOrder": 21,
    "createdAt": "2026-09-02T06:17:45.760Z",
    "updatedAt": "2026-09-02T06:17:46.112Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f56",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f56",
    "fileName": "fun-fact.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 331182,
    "width": 5120,
    "height": 2880,
    "altText": "fun-fact.jpg",
    "displayOrder": 22,
    "createdAt": "2026-09-02T06:17:49.282Z",
    "updatedAt": "2026-09-02T06:17:49.694Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f5a",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f5a",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 131415,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 23,
    "createdAt": "2026-09-02T06:17:49.288Z",
    "updatedAt": "2026-09-02T06:17:49.693Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f5e",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f5e",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 331393,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 24,
    "createdAt": "2026-09-02T06:17:49.291Z",
    "updatedAt": "2026-09-02T06:17:49.692Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f62",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f62",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 89649,
    "width": 702,
    "height": 986,
    "altText": "Sample media",
    "displayOrder": 25,
    "createdAt": "2026-09-02T06:17:49.293Z",
    "updatedAt": "2026-09-02T06:17:49.691Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f66",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f66",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 191807,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 26,
    "createdAt": "2026-09-02T06:17:49.295Z",
    "updatedAt": "2026-09-02T06:17:49.690Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f6a",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f6a",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 457050,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 27,
    "createdAt": "2026-09-02T06:17:49.296Z",
    "updatedAt": "2026-09-02T06:17:49.689Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f6e",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f6e",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 44861,
    "width": 884,
    "height": 890,
    "altText": "Sample media",
    "displayOrder": 28,
    "createdAt": "2026-09-02T06:17:49.298Z",
    "updatedAt": "2026-09-02T06:17:49.688Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f72",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f72",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 109417,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 29,
    "createdAt": "2026-09-02T06:17:49.300Z",
    "updatedAt": "2026-09-02T06:17:49.687Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f76",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f76",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 376429,
    "width": 1920,
    "height": 1080,
    "altText": "Sample media",
    "displayOrder": 30,
    "createdAt": "2026-09-02T06:17:49.302Z",
    "updatedAt": "2026-09-02T06:17:49.686Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f7a",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f7a",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 74243,
    "width": 884,
    "height": 890,
    "altText": "Sample media",
    "displayOrder": 31,
    "createdAt": "2026-09-02T06:17:49.304Z",
    "updatedAt": "2026-09-02T06:17:49.685Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f7e",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f7e",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 60342,
    "width": 702,
    "height": 986,
    "altText": "Sample media",
    "displayOrder": 32,
    "createdAt": "2026-09-02T06:17:49.305Z",
    "updatedAt": "2026-09-02T06:17:49.684Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f82",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f82",
    "fileName": "sample-media.png",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Development",
    "mimeType": "image/png",
    "fileSize": 62420,
    "width": 590,
    "height": 604,
    "altText": "Sample media",
    "displayOrder": 33,
    "createdAt": "2026-09-02T06:17:49.307Z",
    "updatedAt": "2026-09-02T06:17:49.683Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f86",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f86",
    "fileName": "me.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Me",
    "mimeType": "image/jpeg",
    "fileSize": 1716739,
    "width": 3744,
    "height": 5616,
    "altText": "me.jpg",
    "displayOrder": 34,
    "createdAt": "2026-09-02T06:17:49.309Z",
    "updatedAt": "2026-09-02T06:17:49.682Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f8a",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f8a",
    "fileName": "mountain-stream.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 1980804,
    "width": 3554,
    "height": 1999,
    "altText": "mountain-stream.jpg",
    "displayOrder": 35,
    "createdAt": "2026-09-02T06:17:49.310Z",
    "updatedAt": "2026-09-02T06:17:49.681Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f8e",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f8e",
    "fileName": "mossy.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 3063726,
    "width": 3554,
    "height": 1999,
    "altText": "mossy.jpg",
    "displayOrder": 36,
    "createdAt": "2026-09-02T06:17:49.312Z",
    "updatedAt": "2026-09-02T06:17:49.680Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f92",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f92",
    "fileName": "black-beach.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 1717008,
    "width": 3554,
    "height": 1999,
    "altText": "black-beach.jpg",
    "displayOrder": 37,
    "createdAt": "2026-09-02T06:17:49.314Z",
    "updatedAt": "2026-09-02T06:17:49.679Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f96",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f96",
    "fileName": "mccord.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 3987731,
    "width": 3554,
    "height": 1999,
    "altText": "mccord.jpg",
    "displayOrder": 38,
    "createdAt": "2026-09-02T06:17:49.316Z",
    "updatedAt": "2026-09-02T06:17:49.678Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f9a",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f9a",
    "fileName": "landscape-waterfall.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 2350988,
    "width": 3554,
    "height": 1999,
    "altText": "landscape-waterfall.jpg",
    "displayOrder": 39,
    "createdAt": "2026-09-02T06:17:49.317Z",
    "updatedAt": "2026-09-02T06:17:49.677Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2f9e",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2f9e",
    "fileName": "lake.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 2811934,
    "width": 3554,
    "height": 1999,
    "altText": "lake.jpg",
    "displayOrder": 40,
    "createdAt": "2026-09-02T06:17:49.319Z",
    "updatedAt": "2026-09-02T06:17:49.676Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2fa2",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2fa2",
    "fileName": "sigoldugljufur.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 4357393,
    "width": 3554,
    "height": 1999,
    "altText": "sigoldugljufur.jpg",
    "displayOrder": 41,
    "createdAt": "2026-09-02T06:17:49.321Z",
    "updatedAt": "2026-09-02T06:17:49.674Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2fa6",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2fa6",
    "fileName": "doctor-doom-5120x2194-26922.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 3732039,
    "width": 5120,
    "height": 2194,
    "altText": "doctor-doom-5120x2194-26922.jpg",
    "displayOrder": 42,
    "createdAt": "2026-09-02T06:17:49.323Z",
    "updatedAt": "2026-09-02T06:17:49.673Z"
  },
  {
    "id": "6a97bf8d83c1c6139f7e2faa",
    "provider": "imagekit",
    "fileId": "6a97bf8d83c1c6139f7e2faa",
    "fileName": "forest.jpg",
    "url": SAMPLE_MEDIA_URL,
    "thumbnailUrl": SAMPLE_MEDIA_URL,
    "folder": "/portfolio/Art_Crafts",
    "mimeType": "image/jpeg",
    "fileSize": 2660769,
    "width": 3440,
    "height": 1440,
    "altText": "forest.jpg",
    "displayOrder": 43,
    "createdAt": "2026-09-02T06:17:49.325Z",
    "updatedAt": "2026-09-02T06:17:49.670Z"
  }
];

  const validMediaIds = new Set(mediaAssets.map((m) => m.id));
  const existingMediaSnap = await db.collection('media').get();
  for (const doc of existingMediaSnap.docs) {
    if (!validMediaIds.has(doc.id)) {
      await doc.ref.delete();
    }
  }
  for (const item of mediaAssets) {
    await db.collection('media').doc(item.id).set(item, { merge: true });
  }

  // 8. THEME SETTINGS (themeSettings/active)
  console.log('Seeding themeSettings/active...');
  const themeSettings: ThemeSettings = {
    mode: 'dark',
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      mutedText: '#94a3b8',
      border: '#334155',
    },
    lightColors: {
      primary: '#4f46e5',
      secondary: '#7c3aed',
      accent: '#ec4899',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      mutedText: '#64748b',
      border: '#e2e8f0',
    },
    darkColors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f8fafc',
      mutedText: '#94a3b8',
      border: '#334155',
    },
    fonts: {
      headingFont: 'Cinzel',
      bodyFont: 'Inter',
      accentFont: 'Pacifico',
      buttonFont: 'Inter',
      cardTitleFont: 'Cinzel',
      cardSubtitleFont: 'Inter',
      cardDescriptionFont: 'Inter',
      tagFont: 'Fira Code',
      navigationFont: 'Inter',
      monoFont: 'Fira Code',
    },
    styles: {
      borderRadius: '0.5rem',
      cardStyle: 'glassmorphism',
      buttonStyle: 'solid',
    },
    animations: {
      pageTransitions: 'smooth',
      scrollReveal: true,
      hoverEffects: true,
      imageHoverEffects: true,
    },
    updatedAt: now,
  };
  await db.collection('themeSettings').doc('active').set(themeSettings, { merge: true });

  // 10. BLOGS (blogs/{blogId}) - 7 entries (5 published, 1 draft, 1 archived)
  console.log('Seeding blogs (7 entries)...');
  const seedBlogs: Blog[] = [
    {
      id: 'blog-01',
      title: 'Building Scalable Cloud-Native Applications',
      slug: 'building-scalable-cloud-native-applications',
      excerpt: 'An in-depth architectural guide to constructing resilient, cloud-native microservices with Kubernetes, event streams, and automated failover systems.',
      content: `Building modern cloud-native applications requires a paradigm shift from traditional monolithic design to distributed, event-driven microservices. In this comprehensive guide, we explore how container orchestration with Kubernetes, combined with service mesh observability and resilient backend API design, empowers engineering teams to achieve high availability and seamless horizontal scaling.

### Key Architectural Principles

1. **Decoupled State Management**: Stateless application instances combined with managed serverless data stores.
2. **Resilient Communication**: Implementing circuit breakers, retry policies, and gRPC service-to-service communication.
3. **Continuous Observability**: Integrating distributed tracing with OpenTelemetry and centralized log aggregators.

By following these battle-tested design patterns, platforms can support millions of concurrent connections while maintaining zero downtime during deployments.`,
      featuredImage: {
        mediaId: 'med-blog-01',
        url: SAMPLE_MEDIA_URL,
        storagePath: 'portfolio/blog/building-scalable-cloud-native-applications/cover.jpg',
        altText: 'Cloud Native Architecture Diagram',
      },
      category: 'Cloud Architecture',
      tags: ['cloud', 'kubernetes', 'microservices', 'architecture'],
      status: 'published',
      publishedAt: '2026-08-15T10:00:00.000Z',
      createdAt: '2026-08-10T09:00:00.000Z',
      updatedAt: '2026-08-15T10:00:00.000Z',
      seo: {
        title: 'Building Scalable Cloud-Native Applications — Mansi Mahant',
        description: 'Architectural principles and strategies for building high-availability cloud microservices.',
        keywords: ['cloud', 'kubernetes', 'microservices', 'architecture'],
      },
    },
    {
      id: 'blog-02',
      title: 'Designing Reliable Backend APIs',
      slug: 'designing-reliable-backend-apis',
      excerpt: 'Best practices for engineering type-safe RESTful backend services with strict validation, centralized error handling, and OpenAPI documentation.',
      content: `Backend APIs serve as the foundation of modern web applications. Building APIs that are predictable, performant, and secure requires strict adherence to software design principles and validation standards.

### Best Practices for API Reliability

- **Strict Schema Validation**: Utilize libraries like Zod or Pydantic to validate every incoming HTTP payload before business logic execution.
- **Unified Error Handling**: Create standardized error response factories (\`AppError\`) to eliminate uncaught exceptions and provide consistent client feedback.
- **Automated OpenAPI Specs**: Keep Swagger/OpenAPI documentation synchronized with backend controller definitions.

By establishing clean contract-driven development, frontend and backend teams can integrate features faster and with greater confidence.`,
      featuredImage: {
        mediaId: 'med-blog-02',
        url: SAMPLE_MEDIA_URL,
        storagePath: 'portfolio/blog/designing-reliable-backend-apis/cover.jpg',
        altText: 'API Engineering & Data Schema Blueprint',
      },
      category: 'Backend Engineering',
      tags: ['api', 'nodejs', 'typescript', 'express'],
      status: 'published',
      publishedAt: '2026-08-20T14:30:00.000Z',
      createdAt: '2026-08-18T11:00:00.000Z',
      updatedAt: '2026-08-20T14:30:00.000Z',
      seo: {
        title: 'Designing Reliable Backend APIs — Mansi Mahant',
        description: 'Mastering type-safe RESTful API design with Express, TypeScript, and Zod.',
        keywords: ['api', 'nodejs', 'typescript', 'rest'],
      },
    },
    {
      id: 'blog-03',
      title: 'From Software Engineering to Digital Art',
      slug: 'software-engineering-to-digital-art',
      excerpt: 'Exploring the creative synthesis between software engineering rigor and visual digital artwork, procedural shaders, and ceramic craft.',
      content: `Many view software engineering and fine art as opposing disciplines—one driven by strict logic and mathematics, the other by intuition and emotion. However, my journey across both fields has revealed a profound harmony between code and artistic design.

### Code as Creative Medium

When writing GLSL shaders or procedural 3D visual environments, algorithms become brushes and mathematical equations dictate form, texture, and light reflection. The structured discipline of software development enhances artistic precision, allowing complex visual concepts to come alive dynamically.

Whether developing cloud infrastructure or rendering generative digital art, the goal remains the same: creating visual and functional harmony.`,
      featuredImage: {
        mediaId: 'med-blog-03',
        url: SAMPLE_MEDIA_URL,
        storagePath: 'portfolio/blog/software-engineering-to-digital-art/cover.jpg',
        altText: 'Algorithmic Shader Art Canvas',
      },
      category: 'Creative Technology',
      tags: ['creative-coding', 'generative-art', 'design', 'shaders'],
      status: 'published',
      publishedAt: '2026-08-25T09:15:00.000Z',
      createdAt: '2026-08-22T08:00:00.000Z',
      updatedAt: '2026-08-25T09:15:00.000Z',
      seo: {
        title: 'From Software Engineering to Digital Art — Mansi Mahant',
        description: 'The intersection of software architecture, GLSL shaders, and visual art.',
        keywords: ['creative coding', 'generative art', 'design', 'shaders'],
      },
    },
    {
      id: 'blog-04',
      title: 'Exploring Generative Art and Creative Algorithms',
      slug: 'exploring-generative-art',
      excerpt: 'How mathematical functions, noise algorithms, and WebGL shaders enable infinite variation in real-time generative artwork.',
      content: `Generative art leverages mathematical algorithms to create dynamic visual compositions. By harnessing Perlin noise, fractal geometry, and vector fields, artists can generate visuals that evolve continuously over time.

### Core Techniques in Generative Art

1. **Simplex & Perlin Noise**: Generating organic movement, terrain topographies, and fluid motion.
2. **Particle Dynamics**: Simulating physics forces like gravity, friction, and electromagnetic pull.
3. **Real-time WebGPU Shaders**: Rendering millions of primitives directly on the GPU at 60 FPS.

Through code, artists transition from creating single static images to designing generative rules that yield endless visual possibilities.`,
      featuredImage: {
        mediaId: 'med-blog-04',
        url: SAMPLE_MEDIA_URL,
        storagePath: 'portfolio/blog/exploring-generative-art/cover.jpg',
        altText: 'Particle Swarm Generative Visualization',
      },
      category: 'Generative Art',
      tags: ['shaders', 'webgl', 'canvas', 'math'],
      status: 'published',
      publishedAt: '2026-08-28T16:45:00.000Z',
      createdAt: '2026-08-26T12:00:00.000Z',
      updatedAt: '2026-08-28T16:45:00.000Z',
      seo: {
        title: 'Exploring Generative Art & Creative Algorithms — Mansi Mahant',
        description: 'Deep dive into noise functions, particle systems, and WebGL creative coding.',
        keywords: ['shaders', 'webgl', 'generative art', 'math'],
      },
    },
    {
      id: 'blog-05',
      title: 'Building Developer-Friendly Systems',
      slug: 'building-developer-friendly-systems',
      excerpt: 'Enhancing Developer Experience (DX) through type safety, clear architectural abstractions, automated CI pipelines, and self-documenting codebases.',
      content: `Developer Experience (DX) is a critical determinant of product velocity and code quality. A well-architected system empowers developers to ship features quickly without fear of unexpected regressions.

### Pillars of Great Developer Experience

- **Strict Type Systems**: Eliminating runtime errors by defining shared TypeScript contracts across frontend and backend.
- **Automated Validation**: Running automated linting, type-checking, and test suites prior to every commit.
- **Self-Documenting Code**: Using clear naming conventions and mandatory high-level context documentation (\`AGENTS.md\`, \`PROJECT_CONTEXT.md\`).

Investing in DX leads to happier engineering teams, faster release cycles, and more stable production systems.`,
      featuredImage: {
        mediaId: 'med-blog-05',
        url: SAMPLE_MEDIA_URL,
        storagePath: 'portfolio/blog/building-developer-friendly-systems/cover.jpg',
        altText: 'Developer Experience and Tooling Mindmap',
      },
      category: 'System Architecture',
      tags: ['dx', 'architecture', 'solid', 'typescript'],
      status: 'published',
      publishedAt: '2026-09-01T08:00:00.000Z',
      createdAt: '2026-08-30T10:00:00.000Z',
      updatedAt: '2026-09-01T08:00:00.000Z',
      seo: {
        title: 'Building Developer-Friendly Systems — Mansi Mahant',
        description: 'Strategies for maximizing developer experience and engineering velocity.',
        keywords: ['dx', 'architecture', 'solid', 'typescript'],
      },
    }
  ];

  const validBlogIds = new Set(seedBlogs.map((b) => b.id));
  const existingBlogsSnap = await db.collection('blogs').get();
  for (const doc of existingBlogsSnap.docs) {
    if (!validBlogIds.has(doc.id)) {
      await doc.ref.delete();
    }
  }
  for (const item of seedBlogs) {
    await db.collection('blogs').doc(item.id).set(item, { merge: true });
  }

  console.log('Successfully seeded all Cloud Firestore collections!');
}

// Execute script if run directly.
if (require.main === module) {
  seedFirebaseContent()
    .then(() => {
      console.log('Firebase seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Firebase seeding failed:', err);
      process.exit(1);
    });
}
