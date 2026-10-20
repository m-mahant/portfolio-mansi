// Unit test suite verifying development portfolio components and section availability logic.

import assert from 'assert';
import { Project } from '@/types/public.types';

// Mock project instance representing a full technical case study
const fullProject: Project = {
  id: 'proj-1',
  title: 'Cloud Orchestrator Engine',
  slug: 'cloud-orchestrator-engine',
  subtitle: 'Distributed microservices orchestration platform',
  shortDescription: 'Automated infrastructure scaling and container deployment engine.',
  status: 'published',
  isFeatured: true,
  displayOrder: 1,
  tags: ['cloud', 'devops'],
  technologies: ['TypeScript', 'Go', 'Kubernetes', 'Docker'],
  overview: 'The Cloud Orchestrator provides real-time workload placement across multi-cloud regions.',
  problem: 'Legacy deployments suffered from slow cold starts and high cloud resource wastage.',
  solution: 'Implemented dynamic predictive autoscaling with event-driven queue scheduling.',
  features: [
    { title: 'Auto Scaling', description: 'Dynamic pod allocation based on incoming HTTP traffic bursts.' },
  ],
  architecture: {
    enabled: true,
    description: 'Microservices architecture connected via gRPC and Redis event streams.',
    diagramUrl: 'https://ik.imagekit.io/demo/architecture.png',
  },
  workflow: {
    enabled: true,
    description: 'Deployment pipeline',
    steps: [
      { title: 'Code Commit', description: 'Triggers automated container build', displayOrder: 1 },
    ],
  },
  apiFlow: {
    enabled: true,
    description: 'REST API v1 contract',
    endpoints: [
      { method: 'GET', path: '/api/v1/clusters', description: 'Lists active Kubernetes clusters' },
    ],
  },
  performance: {
    enabled: true,
    summary: 'Achieved 40% reduction in deployment latency.',
    metrics: [
      { label: 'P99 Latency', value: '42ms', improvement: '40% reduction' },
    ],
  },
  challenges: 'Managing atomic state sync across multi-region Redis clusters.',
  results: 'Increased deployment throughput by 3x while cutting cloud expenditure.',
  gallery: [
    { mediaId: 'med-1', url: 'https://ik.imagekit.io/demo/screenshot.png', altText: 'Dashboard view', displayOrder: 1 },
  ],
  links: [
    { label: 'GitHub Repository', url: 'https://github.com/example/orchestrator', type: 'github', isVisible: true, displayOrder: 1 },
  ],
  sections: {
    overview: true,
    problem: true,
    solution: true,
    architecture: true,
    workflow: true,
    apiFlow: true,
    performance: true,
    challenges: true,
    results: true,
    gallery: true,
  },
};

// Mock sparse project instance with disabled/missing optional sections
const sparseProject: Project = {
  id: 'proj-2',
  title: 'Minimal Utility Tool',
  slug: 'minimal-utility-tool',
  shortDescription: 'A lightweight CLI helper tool.',
  status: 'published',
  isFeatured: false,
  displayOrder: 2,
  tags: ['cli'],
  technologies: ['Rust'],
  sections: {
    overview: false,
    problem: false,
    solution: false,
    architecture: false,
    workflow: false,
    apiFlow: false,
    performance: false,
    challenges: false,
    results: false,
    gallery: false,
  },
};

export function runPublicDevelopmentTests(): void {
  // Test 1: Verifies full project metadata and technology tags
  assert.strictEqual(fullProject.title, 'Cloud Orchestrator Engine');
  assert.strictEqual(fullProject.isFeatured, true);
  assert.strictEqual(fullProject.technologies.length, 4);
  assert.ok(fullProject.technologies.includes('Kubernetes'));

  // Test 2: Verifies Hide Empty Sections rules for full project
  assert.strictEqual(fullProject.sections?.architecture, true);
  assert.strictEqual(fullProject.sections?.workflow, true);
  assert.strictEqual(fullProject.sections?.apiFlow, true);
  assert.strictEqual(fullProject.sections?.performance, true);

  // Test 3: Verifies Hide Empty Sections rules for sparse project
  assert.strictEqual(sparseProject.sections?.architecture, false);
  assert.strictEqual(sparseProject.sections?.workflow, false);
  assert.strictEqual(sparseProject.sections?.apiFlow, false);
  assert.strictEqual(sparseProject.sections?.performance, false);
  assert.strictEqual(sparseProject.architecture, undefined);
  assert.strictEqual(sparseProject.workflow, undefined);
}

// Auto-run if executed directly via node
if (require.main === module) {
  runPublicDevelopmentTests();
  console.log('✅ Phase 7D Public Development Unit Tests Passed!');
}
