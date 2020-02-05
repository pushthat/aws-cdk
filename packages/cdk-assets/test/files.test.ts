import { AssetManifest } from '@aws-cdk/assets';
import * as mockfs from 'mock-fs';
import { AssetPublishing } from '../lib';
import { mockAws } from './mock-aws';

let aws: ReturnType<typeof mockAws>;
beforeEach(() => {
  mockfs({
    '/simple/cdk.out/assets.json': JSON.stringify({
      version: 'assets-1.0',
      assets: {
        theAsset: {
          type: 'file',
          source: {
            path: 'some_file'
          },
          destinations: {
            theDestination: {
              region: 'us-north-50',
              assumeRoleArn: 'arn:aws:role',
              bucketName: 'some_bucket',
              objectKey: 'some_key',
            },
          },
        },
      },
    })
  });

  aws = mockAws();
});

afterEach(() => {
  mockfs.restore();
});

test('pass destination properties to AWS client', async () => {
  const pub = new AssetPublishing({ aws, manifest: AssetManifest.fromPath('/simple/cdk.out'), throwOnError: false });

  await pub.publish();

  expect(aws.s3Client).toHaveBeenCalledWith(expect.objectContaining({
    region: 'us-north-50',
    assumeRoleArn: 'arn:aws:role',
  }));
});

test('Do nothing if file already exists', () => {
  const pub = new AssetPublishing({ aws, manifest: AssetManifest.fromPath('/simple/cdk.out') });

  await pub.publish();

  expect(aws.s3Client).toHaveBeenCalledWith(expect.objectContaining({
    region: 'us-north-50',
    assumeRoleArn: 'arn:aws:role',
  }));
});

test('upload file if new', () => {
  // ...
});

test('zip directory', () => {
  // ...
});