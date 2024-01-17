import { Controller, Get } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Controller('logger')
export class LoggerController {
  CONTROLLER = LoggerController.name;
  constructor(private readonly logger: LoggerService) {}

  @Get('info')
  getInfoLog(): string {
    this.logger.log('Log info sample', this.CONTROLLER);
    return 'Logged an INFO message.';
  }

  @Get('error')
  getErrorLog(): string {
    this.logger.error('Log error sample', null, this.CONTROLLER);
    return 'Logged an ERROR message.';
  }
}
