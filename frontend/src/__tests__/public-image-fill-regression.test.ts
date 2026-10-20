import assert from 'node:assert/strict';
import { test, describe } from 'node:test';

// Helper logic mimicking PublicImage prop resolution to prevent fill vs width/height conflicts in Next.js Image.
export function resolvePublicImageDimensions(fill?: boolean, width?: number, height?: number) {
  const imageWidth = fill ? undefined : (width ?? 800);
  const imageHeight = fill ? undefined : (height ?? 600);
  return { imageWidth, imageHeight };
}

describe('PublicImage Fill vs Width/Height Conflict Regression Test', () => {
  test('should set imageWidth and imageHeight to undefined when fill is true', () => {
    const dimensions = resolvePublicImageDimensions(true, 500, 500);
    assert.equal(dimensions.imageWidth, undefined, 'imageWidth must be undefined when fill is true');
    assert.equal(dimensions.imageHeight, undefined, 'imageHeight must be undefined when fill is true');
  });

  test('should fallback to provided width/height when fill is false or omitted', () => {
    const customDimensions = resolvePublicImageDimensions(false, 400, 300);
    assert.equal(customDimensions.imageWidth, 400);
    assert.equal(customDimensions.imageHeight, 300);

    const defaultDimensions = resolvePublicImageDimensions(undefined);
    assert.equal(defaultDimensions.imageWidth, 800);
    assert.equal(defaultDimensions.imageHeight, 600);
  });
});
