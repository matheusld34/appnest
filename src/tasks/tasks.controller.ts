import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) { }

    @Get()
    findAllTasks() {
        return this.taskService.findAll()
    }

    @Get(":id")
    findOneTask(@Param('id') id: string) {
        return this.taskService.findOne(id);
    }

    @Post()
    createTask(@Body() body: any) {
        console.log(body)

        return this.taskService.create(body)
    }

    @Patch(":id")
    updateTask(@Param("id") id: string, @Body() body: any) {
        console.log("ID: ", id)
        console.log("Body: ", body)

        return "Atualizando tarefa..."
    }

    @Delete(":id")
    deleteTask(@Param("id") id: string) {
        console.log("ID ENVIADO: " + id)

        return "Deltar a terefa com id " + id
    }

}
