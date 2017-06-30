import { User } from '../../src/models';

const id = 12345;
const permalink = 'nghtmre';

describe('User model tests', () => {
  beforeEach(async () => {
    await User.sync({ force: true });
  });

  test('create user given id and permalink', async () => {
    await expect(User.create({ id, permalink }))
      .resolves
      .toBeDefined();
  });

  test('cannot create user without an id', async () => {
    await expect(User.create({ permalink }))
      .rejects
      .toBeDefined();
  });

  test('cannot create user without a permalink', async () => {
    await expect(User.create({ id }))
      .rejects
      .toBeDefined();
  });

  test('cannot create user with duplicate id', async () => {
    await User.create({ id, permalink });
    await expect(User.create({ id, permalink: 'different permalink' }))
      .rejects
      .toBeDefined();
  });

  test('cannot create user with duplicate permalink', async () => {
    await User.create({ id, permalink });
    await expect(User.create({ id: 9876, permalink }))
      .rejects
      .toBeDefined();
  });
});
