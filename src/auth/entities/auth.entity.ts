import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Auth {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text', { unique: true })
    username: string;
    
    @Column('text')
    password: string;
}
