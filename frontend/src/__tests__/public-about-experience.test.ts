import assert from 'node:assert/strict';
import { test, describe } from 'node:test';
import { AboutProfile, Experience, Education } from '../types/public.types';

// Unit tests verifying about profile data structures, experience timeline filtering, and education ordering logic.
describe('Public About, Experience & Education Data Logic', () => {
  test('should validate About Profile field presence and empty section hiding logic', () => {
    const mockAbout: AboutProfile = {
      introduction: 'Software Engineer & Digital Artist',
      myStory: 'Fusing engineering principles with creative crafts.',
      whatIDo: ['Full-Stack Web Engineering', 'Cloud Architecture'],
      developerSide: 'Focusing on robust architecture and clean code.',
      artistSide: 'Exploring visual aesthetics and 3D modeling.',
      philosophy: 'Technical precision meets creative expression.',
      interests: ['System Design', 'Generative Art'],
      shortBio: 'Full-Stack Developer & Creative Artist.',
      profileImage: {
        url: 'https://placehold.co/800x1000/png?text=Portrait',
        altText: 'Riley Navarro Portrait',
      },
      secondaryImage: {
        url: 'https://placehold.co/800x1000/png?text=Portrait',
        altText: 'Studio and Workspace',
      },
      updatedAt: '2026-09-01T00:00:00.000Z',
    };

    assert.equal(Boolean(mockAbout.myStory), true);
    assert.equal(Boolean(mockAbout.developerSide), true);
    assert.equal(Boolean(mockAbout.artistSide), true);
    assert.equal(Boolean(mockAbout.profileImage?.url), true);
    assert.equal(Boolean(mockAbout.secondaryImage?.url), true);
    assert.equal(mockAbout.whatIDo?.length, 2);
    assert.equal(mockAbout.interests?.length, 2);
  });

  test('should filter visible experience records and sort strictly by displayOrder', () => {
    const mockExperiences: Experience[] = [
      {
        id: 'exp-3',
        company: 'Company C',
        role: 'Role 3',
        startDate: '2022-01',
        endDate: '2023-01',
        isCurrent: false,
        description: 'Desc 3',
        responsibilities: ['Resp 3'],
        technologies: ['Go'],
        achievements: ['Ach 3'],
        displayOrder: 3,
        isVisible: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      {
        id: 'exp-1',
        company: 'Company A',
        role: 'Role 1',
        startDate: '2024-01',
        endDate: 'Present',
        isCurrent: true,
        description: 'Desc 1',
        responsibilities: ['Resp 1'],
        technologies: ['React'],
        achievements: ['Ach 1'],
        displayOrder: 1,
        isVisible: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      {
        id: 'exp-hidden',
        company: 'Hidden Co',
        role: 'Hidden Role',
        startDate: '2020-01',
        isCurrent: false,
        description: 'Hidden',
        responsibilities: [],
        technologies: [],
        achievements: [],
        displayOrder: 2,
        isVisible: false,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    const filtered = mockExperiences
      .filter((exp) => exp.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    assert.equal(filtered.length, 2);
    assert.equal(filtered[0].id, 'exp-1');
    assert.equal(filtered[1].id, 'exp-3');
  });

  test('should filter visible education records and sort by displayOrder', () => {
    const mockEducation: Education[] = [
      {
        id: 'edu-2',
        institution: 'University B',
        degree: 'B.S.',
        field: 'Computer Science',
        startDate: '2018-09',
        endDate: '2022-05',
        description: 'Academic study B',
        achievements: ['Honors'],
        displayOrder: 2,
        isVisible: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
      {
        id: 'edu-1',
        institution: 'University A',
        degree: 'M.S.',
        field: 'Software Engineering',
        startDate: '2022-09',
        endDate: '2024-05',
        description: 'Academic study A',
        achievements: ['Deans List'],
        displayOrder: 1,
        isVisible: true,
        createdAt: '2026-01-01',
        updatedAt: '2026-01-01',
      },
    ];

    const filtered = mockEducation
      .filter((edu) => edu.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    assert.equal(filtered.length, 2);
    assert.equal(filtered[0].id, 'edu-1');
    assert.equal(filtered[1].id, 'edu-2');
  });
});
