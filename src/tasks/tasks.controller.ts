import { Controller, Get } from '@nestjs/common';
import { TasksService } from './tasks.service';
@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) { }
    @Get()
    getTasks() {
        return "Listasndo Todas Tarefas"
    }

    @Get(":id")
    getTest() {
        return this.taskService.findOneTask();
    }

}
