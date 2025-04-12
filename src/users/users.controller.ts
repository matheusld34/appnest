import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

// > Buscar os detalhes de 1 usuario (CHECK)
// > Cadastrar usuário (CHECK)
// > Atualizar um usuário especifico
// > Deletar usuário

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @Get(':id')
    findOneUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id)
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

}
