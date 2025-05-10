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
                            create: jest.fn()
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

        await userService.create(createUserDto)

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

    })

})