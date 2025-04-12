import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(id: number) {
        const user = await this.prisma.user.findFirst({
            where: {
                id: id,
            },
            select: {
                id: true,
                email: true,
                name: true,
            }
        })

        if (user) return user;

        throw new HttpException('Usuário não encontrado!', HttpStatus.BAD_REQUEST)

    }

    async create(createUserDto: CreateUserDto) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    passwordHash: createUserDto.password
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            })

            return user;

        } catch (err) {
            console.log(err);
            throw new HttpException('Falha ao cadastrar usuário!', HttpStatus.BAD_REQUEST)
        }
    }

}
