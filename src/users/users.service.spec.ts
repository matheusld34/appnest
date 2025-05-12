/* Testes unitários
 Testes ponta a ponta (e2e)
 > AAA
 >  Configuração do test (Arrange)
 >  Algo que deseja fazer a ação (Act)
 >  Conferir se ação foi esperada (Assert) 
*/

import { PrismaService } from "src/prisma/prisma.service";
import { UsersService } from "./users.service"
import { HashingServiceProtocol } from "src/auth/hash/hashing.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateUserDto } from "./dto/create-user.dto";
import { HttpException, HttpStatus } from "@nestjs/common";

describe('UsersService', () => {
    let userService: UsersService;
    let prismaService: PrismaService;
    let hashingService: HashingServiceProtocol;

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            create: jest.fn().mockResolvedValue({
                                id: 1,
                                name: 'Matheus',
                                email: 'matheus@teste.com'
                            }),
                            findFirst: jest.fn()
                        }
                    }
                },
                {
                    provide: HashingServiceProtocol,
                    useValue: {
                        hash: jest.fn()
                    }
                }
            ]
        }).compile()

        userService = module.get<UsersService>(UsersService)
        prismaService = module.get<PrismaService>(PrismaService);
        hashingService = module.get<HashingServiceProtocol>(HashingServiceProtocol)

    })

    it('should be define users service', () => {
        expect(userService).toBeDefined();
    })


    it('should create a new user', async () => {

        const createUserDto: CreateUserDto = {
            email: 'matheus@teste.com',
            name: 'Matheus',
            password: '123123'
        }

        jest.spyOn(hashingService, 'hash').mockResolvedValue("HASH_MOCK_EXEMPLO")

        const result = await userService.create(createUserDto)

        expect(hashingService.hash).toHaveBeenCalled()

        expect(prismaService.user.create).toHaveBeenCalledWith({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                passwordHash: "HASH_MOCK_EXEMPLO"
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        expect(result).toEqual({
            id: 1,
            name: createUserDto.name,
            email: createUserDto.email
        })

    })


    it('should throw error if prisma create fails', async () => {
        const createUserDto: CreateUserDto = {
            email: 'matheus@teste.com',
            name: 'Matheus',
            password: '123123'
        }

        jest.spyOn(hashingService, 'hash').mockResolvedValue('HASH_MOCK_EXEMPLO')
        jest.spyOn(prismaService.user, 'create').mockRejectedValue(new Error('Database error'))

        await expect(userService.create(createUserDto)).rejects.toThrow(
            new HttpException('Falha ao cadastrar usuário!', HttpStatus.BAD_REQUEST)
        )

        expect(hashingService.hash).toHaveBeenCalledWith(createUserDto.password)

        expect(prismaService.user.create).toHaveBeenCalledWith({
            data: {
                name: createUserDto.name,
                email: createUserDto.email,
                passwordHash: "HASH_MOCK_EXEMPLO",
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })


    })


    it('should return a user when found', async () => {
        //Arrange
        const mockUser = {
            id: 1,
            name: 'Matheus',
            email: 'matheus@teste.com',
            avatar: null,
            Task: [],
            passwordHash: 'hash_exemplo',
            active: true,
            createdAt: new Date(),
        }

        jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(mockUser)

        const result = await userService.findOne(1)

        expect(prismaService.user.findFirst).toHaveBeenCalledWith({
            where: {
                id: 1,
            },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                Task: true
            }
        })

        expect(result).toEqual(mockUser)

    })

    it('should thorw error exception when user is not found', async () => {

        jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null)

        await expect(userService.findOne(1)).rejects.toThrow(
            new HttpException('Usuário não encontrado!', HttpStatus.BAD_REQUEST)
        )

        expect(prismaService.user.findFirst).toHaveBeenCalledWith({
            where: { id: 1 },
            select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
                Task: true
            }
        })

    })

})