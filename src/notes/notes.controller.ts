import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from 'src/dto/notes/create-note.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateNoteDto } from 'src/dto/notes/update-note.dto';

@Controller('/api/notes')
export class NotesController {
  constructor(private readonly noteService: NotesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllNotes(@Request() req: any) {
    return this.noteService.getAllNotes(req.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getNote(@Request() req: any, @Param() params: any) {
    return this.noteService.getNote(req.user.userId, params.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createNote(@Request() req: any, @Body() body: CreateNoteDto) {
    const createNoteDto: CreateNoteDto = {
      title: body.title,
      content: body.content,
      user: req.user.userId,
    };
    return this.noteService.createNote(createNoteDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateNote(
    @Request() req: any,
    @Param() params: any,
    @Body() body: UpdateNoteDto,
  ) {
    const updateNoteDto: UpdateNoteDto = {
      title: body.title,
      content: body.content,
    };
    return this.noteService.updateNote(
      req.user.userId,
      params.id,
      updateNoteDto,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteNote(@Request() req: any, @Param() params: any) {
    return this.noteService.deleteNote(req.user.userId, params.id);
  }
}
