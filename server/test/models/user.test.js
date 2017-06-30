import { User } from '../../src/models';

describe('User model tests', () => {
  beforeEach(async () => {
    await User.sync({ force: true });
  });

  test('save permalink as lowercase', async () => {
    expect.assertions(1);
    const user = await User.create({ id: 1234, permalink: 'NgHtMrE' });
    expect(user.get('permalink')).toBe('nghtmre');
  });
});
