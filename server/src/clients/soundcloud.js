import axios from 'axios';

import { Parser } from '../utils';

const { SOUNDCLOUD_CLIENT_ID } = process.env;

const fetchUserProfileByUserId = async (userId) => {
  const url = `http://api.soundcloud.com/users/${userId}?client_id=${SOUNDCLOUD_CLIENT_ID}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw {
      name: 'UserProfilePageNotFound',
      message: 'Unable to find user profile page.',
      status: 404,
    };
  }
};

const fetchUserProfilePageByUserPermalink = async (permalink) => {
  const url = `https://soundcloud.com/${permalink}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (err) {
    throw {
      name: 'UserProfilePageNotFound',
      message: 'Unable to find user profile page.',
      status: 404,
    };
  }
};

const fetchUserProfileByUserPermalink = async (permalink) => {
  try {
    const userProfilePage = await fetchUserProfilePageByUserPermalink(permalink);
    const userId = Parser.extractUserIdFromUserProfilePage(userProfilePage);
    return await fetchUserProfileByUserId(userId);
  } catch (err) {
    throw err;
  }
};

export default {
  fetchUserProfileByUserId,
  fetchUserProfilePageByUserPermalink,
  fetchUserProfileByUserPermalink,
};
