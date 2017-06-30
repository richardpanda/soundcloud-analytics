import { USER_PROFILE_PAGE_PATH, ENCODING } from './constants';
import { readFile } from './fs';

export const readUserProfilePage = () => readFile(USER_PROFILE_PAGE_PATH, ENCODING);
