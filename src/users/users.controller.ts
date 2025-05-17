import { Body, Controller, Delete, Get, HttpStatus, Param, ParseFilePipeBuilder, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

    @UseGuards(AuthTokenGuard)
    @Patch(':id')
    updateUser(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateUserDto: UpdateUserDto,
        @TokenPayloadParam() tokenPayload: PayloadTokenDto
    ) {
        return this.userService.update(id, updateUserDto, tokenPayload)
    }

    @UseGuards(AuthTokenGuard)
    @Delete(':id')
    deleteUser(
        @Param('id', ParseIntPipe) id: number,
        @TokenPayloadParam() tokenPayload: PayloadTokenDto
    ) {
        return this.userService.delete(id, tokenPayload)
    }


    @UseGuards(AuthTokenGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('upload')
    async uploadAvatar(
        @TokenPayloadParam() tokenPayload: PayloadTokenDto,
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: /jpeg|jpg|png/g,
                })
                .addMaxSizeValidator({
                    maxSize: 3 * (1024 * 1024) // Tamanho maximo de 3 MB
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                }),
        ) file: Express.Multer.File
    ) {
        return this.userService.uploadAvatarImage(tokenPayload, file)
    }

}
