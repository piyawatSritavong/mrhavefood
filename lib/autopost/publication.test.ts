import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isPublicationDue } from './publication.ts';

test('Thai scheduled time stays private before the boundary and becomes public exactly at it', () => {
  const article = { status: 'published', published_at: '2026-10-28T07:39:00+07:00' };
  const boundary = Date.parse('2026-10-28T00:39:00Z');
  assert.equal(isPublicationDue(article, boundary - 1), false);
  assert.equal(isPublicationDue(article, boundary), true);
  assert.equal(isPublicationDue(article, boundary + 1), true);
});

test('drafts, unpublished records, and invalid dates never become public', () => {
  for (const status of ['draft', 'unpublished']) {
    assert.equal(isPublicationDue({ status, published_at: '2020-01-01T00:00:00Z' }), false);
  }
  assert.equal(isPublicationDue({ status: 'published', published_at: 'invalid' }), false);
});
