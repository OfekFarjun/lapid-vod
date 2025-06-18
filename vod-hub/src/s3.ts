import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const getS3Client = () => new S3Client({
    region: 'local',
    credentials: {
        accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
        secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
    },
    forcePathStyle: true,
    endpoint: 'http://localhost:9444/s3',
});

export const uploadToS3 = async (id: string, file: Buffer) => {
    return await getS3Client().send(new PutObjectCommand({
        Bucket: 'vod-hub',
        Key: id,
        Body: file
    }))
}

export const getFromS3 = async (id: string) => {
    const result = await getS3Client().send(new GetObjectCommand({
        Bucket: 'vod-hub',
        Key: id,
    }));

    return Buffer.from(await result.Body?.transformToByteArray()!);
}

export const deleteFromS3 = async (id: string) => {
    return await getS3Client().send(new DeleteObjectCommand({
        Bucket: 'vod-hub',
        Key: id
    }))
}
