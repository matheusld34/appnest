import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    private tasks: Task[] = [
        {
            id: 1,
            name: "Seguir o Sujeito Programador no Youtube",
            description: "Aprendendo muito sobre programação",
            completed: false,
        }
    ]

    async findAll() {
        const allTasks = await this.prisma.task.findMany();
        return allTasks;
    }

    async findOne(id: number) {
        const task = await this.prisma.task.findFirst({
            where: {
                id: id
            }
        })

        if (task?.name) return task;

        throw new HttpException("Tarefa não foi encontrada!", HttpStatus.NOT_FOUND)

    }

    async create(createTaskDto: CreateTaskDto) {
        const newTask = await this.prisma.task.create({
            data: {
                name: createTaskDto.name,
                description: createTaskDto.description,
                completed: false,
            }
        })

        return newTask;
    }

    async update(id: number, updateTaskDto: UpdateTaskDto) {
        const findTask = await this.prisma.task.findFirst({
            where: {
                id: id
            }
        })
        if (!findTask) {
            throw new HttpException("Essa tarefa não existe!", HttpStatus.NOT_FOUND)
        }

        const task = await this.prisma.task.update({
            where: {
                id: findTask.id
            },
            data: updateTaskDto
        })

        return task;
    }


    delete(id: number) {
        const taskIndex = this.tasks.findIndex(task => task.id === id)

        if (taskIndex < 0) {
            throw new HttpException("Essa tarefa não existe.", HttpStatus.NOT_FOUND)
        }

        this.tasks.splice(taskIndex, 1)

        return {
            message: "Tarefa excluida com sucesso!"
        }

    }

}
