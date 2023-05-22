import { DataSource } from 'typeorm';
import SnakeCaseStrategy from './snakeCaseStrategy';
import { voiceLockerGSetting, voiceLockerCSetting } from '../entity/voiceLockerSetting';

export const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: 'sqlite3/database.sqlite3',
    synchronize: true,
    logging: false,
    namingStrategy: new SnakeCaseStrategy(),
    entities: [voiceLockerGSetting, voiceLockerCSetting],
});
