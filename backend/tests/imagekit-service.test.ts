import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { NotFoundError } from '@imagekit/nodejs';
import { ImageKitService } from '../src/services/imagekit.service';

describe('ImageKitService.deleteFile', () => {
  it('treats a 404 from ImageKit as already-deleted instead of throwing', async () => {
    const fakeClient = {
      files: {
        delete: async () => {
          throw new NotFoundError(404, { message: 'The requested file does not exist.' }, '404 The requested file does not exist.', new Headers());
        },
      },
    };

    const service = new ImageKitService(fakeClient as never);
    await assert.doesNotReject(() => service.deleteFile('some_missing_file_id'));
  });

  it('still throws for non-404 ImageKit delete failures', async () => {
    const fakeClient = {
      files: {
        delete: async () => {
          throw new Error('Network timeout');
        },
      },
    };

    const service = new ImageKitService(fakeClient as never);
    await assert.rejects(() => service.deleteFile('some_file_id'));
  });
});
