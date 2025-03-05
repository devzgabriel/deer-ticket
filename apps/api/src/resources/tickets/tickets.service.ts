import { TicketStatus } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/database/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(private database: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    const existentSkills = await this.database.skill.findMany({
      where: {
        id: { in: createTicketDto.requiredSkills },
      },
    });

    let assigneeId = createTicketDto.assigneeId;

    if (!assigneeId) {
      const randomUser = await this.database.teamMember.findFirst({
        where: {
          skills: {
            some: {
              id: { in: createTicketDto.requiredSkills },
            },
          },
        },
      });

      assigneeId = randomUser?.id;
    }

    const ticket = await this.database.ticket.create({
      data: {
        title: createTicketDto.title,
        description: createTicketDto.description,
        status: 'OPEN',
        deadline: createTicketDto.deadline,
        priority: createTicketDto.priority,
        requiredSkills: {
          connect: existentSkills.map((skill) => ({ id: skill.id })),
        },
        assignedTo: assigneeId ? { connect: { id: assigneeId } } : undefined,
      },
    });

    return ticket;
  }

  async findAll() {
    return this.database.ticket.findMany();
  }

  async findOne(id: string) {
    return this.database.ticket.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    const existentSkills = await this.database.skill.findMany({
      where: {
        id: { in: updateTicketDto.requiredSkills },
      },
    });

    const ticket = await this.database.ticket.update({
      where: { id },
      data: {
        title: updateTicketDto.title,
        description: updateTicketDto.description,
        deadline: updateTicketDto.deadline,
        priority: updateTicketDto.priority,
        requiredSkills: existentSkills
          ? {
              set: existentSkills.map((skill) => ({ id: skill.id })),
            }
          : undefined,
      },
    });

    return ticket;
  }

  async updateStatus(id: string, status: TicketStatus) {
    return this.database.ticket.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
