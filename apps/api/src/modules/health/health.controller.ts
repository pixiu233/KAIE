// ============================================
// Health 控制器 - health.controller.ts
// ============================================
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({ status: 200, description: '服务健康' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV ?? 'development',
    };
  }
}

