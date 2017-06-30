import { User } from '../../src/models';

const id = 12345;
const permalink = 'nghtmre';

describe('User model tests', () => {
  beforeEach(async () => {
    await User.sync({ force: true });
  });

  test('create user given id and permalink', async () => {
    expect.assertions(1);

    await expect(User.create({ id, permalink }))
      .resolves
      .toBeDefined();
  });

  test('cannot create user without an id', async () => {
    expect.assertions(1);

    await expect(User.create({ permalink }))
      .rejects
      .toBeDefined();
  });

  test('cannot create user without a permalink', async () => {
    expect.assertions(1);

    await expect(User.create({ id }))
      .rejects
      .toBeDefined();
  });

  test('cannot create user with duplicate id', async () => {
    expect.assertions(2);

    await expect(User.create({ id, permalink }))
      .resolves
      .toBeDefined();

    await expect(User.create({ id, permalink: 'different permalink' }))
      .rejects
      .toBeDefined();
  });

  test('cannot create user with duplicate permalink', async () => {
    expect.assertions(2);

    await expect(User.create({ id, permalink }))
      .resolves
      .toBeDefined();

    await expect(User.create({ id: 9876, permalink }))
      .rejects
      .toBeDefined();
  });
});
