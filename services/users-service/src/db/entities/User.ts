/*******************************************************************************
 *
 * Author: Andew C. Hopkins
 * Timestamp: 2021-03-26T13:16:00 PDT
 * Copyright (C) 2021
 * 
 *******************************************************************************
 */

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export default class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  username: string

  @Column({ select: false })
  passwordHash: string

  @CreateDateColumn()
  createdAt: string
}
