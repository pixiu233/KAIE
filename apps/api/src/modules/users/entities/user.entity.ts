// ============================================
// User 实体 - modules/users/entities/user.entity.ts
// ============================================
export interface UserEntity {
    id: string;
    email: string;
    password: string;
    name: string;
    role: string;
    status: string;
    avatar?: string;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

