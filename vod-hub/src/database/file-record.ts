import { db } from ".";

interface FileRecord {
    id: string;
    stationId: string;
    filename: string;
}

const records = (async () => (await db).collection('records'))();

export const createFileRecord = async (id: string, stationId: string, filename: string) =>
    (await records).insertOne({
        id,
        stationId,
        filename
    } as FileRecord);

export const getRecords = async () => (await records).find<FileRecord>({}).toArray();

// export const deleteFileRecord = async (id: string) => (await records).deleteOne({ id });

export const getFileRecord = async (id: string) => (await records).findOne<FileRecord>({ id });
