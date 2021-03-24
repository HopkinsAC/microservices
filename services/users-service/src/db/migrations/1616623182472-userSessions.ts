import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class UserSessions1616623182472 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        columns: [
          {
            isPrimary: true,
            length: "36",
            name: "id",
            type: "char"
          },
          {
            length: "36",
            name: "userId",
            type: "char"
          },
          {
            default: "now()",
            name: "createdAt",
            type: "timestamp"
          },
          {
            default: "now()",
            name: "expiresAt",
            type: "timestamp"
          }
        ],
        name: "userSessions"
      })
    );

    await queryRunner.createForeignKey(
      "userSessions",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "users"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("userSessions");
  }

}
