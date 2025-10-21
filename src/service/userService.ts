import { Repository } from "typeorm";
import { User } from "../entity/User";

export class UserService {
  constructor(
    private readonly userRepository: Repository<User>
  ) { }

  async createUser(data: Partial<User>) {
    const user = this.userRepository.create(data);
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async updateUser(id: number, data: Partial<User>) {
    await this.userRepository.update(id, data);
    return await this.findOne(id);
  }

  async deleteUser(id: number) {
    await this.userRepository.delete(id);
    return { message: "User deleted successfully" };
  }

  async findByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email })
      .getOne();
  }

}
