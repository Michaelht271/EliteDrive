import { UserRepository } from '../../data/repositories/UserRepository';

export const GetUsers = async () => {
  return await UserRepository.getUsers();
};
