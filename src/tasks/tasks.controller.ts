import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from '../common/dto/pagination.dto'
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadTokenDto } from 'src/auth/dto/payload-token.dto';

@Controller('tasks')
export class TasksController {
    constructor(
        private readonly taskService: TasksService,
    ) { }

    @Get()
    findAllTasks(@Query() paginationDto: PaginationDto) {
        return this.taskService.findAll(paginationDto)
    }

    @Get(":id")
    findOneTask(@Param('id', ParseIntPipe) id: number) {
        return this.taskService.findOne(id);
    }

    @UseGuards(AuthTokenGuard)
    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @TokenPayloadParam() tokenPayload: PayloadTokenDto
    ) {
        return this.taskService.create(createTaskDto, tokenPayload)
    }

    @UseGuards(AuthTokenGuard)
    @Patch(":id")
    updateTask(
        @Param("id", ParseIntPipe) id: number,
        @Body() updateTaskDto: UpdateTaskDto,
        @TokenPayloadParam() tokenPayload: PayloadTokenDto
    ) {
        return this.taskService.update(id, updateTaskDto, tokenPayload)
    }

    @UseGuards(AuthTokenGuard)
    @Delete(":id")
    deleteTask(
        @Param("id", ParseIntPipe) id: number,
        @TokenPayloadParam() tokenPayload: PayloadTokenDto
    ) {
        return this.taskService.delete(id, tokenPayload)
    }

}
