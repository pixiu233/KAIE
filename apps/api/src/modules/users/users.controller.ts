// ============================================
// Users 控制器 - users.controller.ts
// ============================================
import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { UserRole } from '../../shared-types';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '获取所有用户列表（仅管理员）' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: '返回用户列表' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.usersService.findAll(page, limit);
  }

  @Get('profile')
  @ApiOperation({ summary: '获取当前用户资料' })
  @ApiResponse({ status: 200, description: '返回当前用户资料' })
  async getProfile(@CurrentUser() user: User) {
    const { password, ...result } = user;
    return result;
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '获取指定用户信息（仅管理员）' })
  @ApiResponse({ status: 200, description: '返回指定用户信息' })
  @ApiResponse({ status: 404, description: '用户不存在' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);

    if (!user) {
      return { message: 'User not found' };
    }

    const { password, ...result } = user;
    return result;
  }

  @Put('profile')
  @ApiOperation({ summary: '更新当前用户资料' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(userId, updateUserDto);
    const { password, ...result } = user;
    return result;
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '更新指定用户信息（仅管理员）' })
  @ApiResponse({ status: 200, description: '更新成功' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.update(id, updateUserDto);
    const { password, ...result } = user;
    return result;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: '删除用户（仅管理员）' })
  @ApiResponse({ status: 200, description: '删除成功' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
    return { message: 'User deleted successfully' };
  }
}
