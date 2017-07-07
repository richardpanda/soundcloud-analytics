import { soundCloudClient } from '../clients';
import { User, Statistic } from '../models';

class Statistics {
  static async addNewStatistics() {
    const errors = [];

    try {
      const users = await User.findAll();

      for (let user of users) {
        try {
          const userProfile = await soundCloudClient.fetchUserProfileByUserId(user.id);
          await Statistic.create({ userId: userProfile.id, followers: userProfile.followers_count });
        } catch (error) {
          errors.push(error);
        }
      }

    } catch (error) {
      errors.push(error);
    }

    return errors;
  }
}

export default Statistics;
