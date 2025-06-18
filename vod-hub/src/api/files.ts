import Router from "koa-router";
import {
  createFileRecord,
  getFileRecord,
  getRecords,
} from "../database/file-record";
import { v4 as uuidv4 } from "uuid";
import { getFromS3, uploadToS3 } from "../s3";
import { Readable } from "stream";
import multer from "@koa/multer";
// import { authMiddleware } from "../middlewares/auth";

const upload = multer();

export const router = new Router({
  prefix: "/files",
});

// router.use(authMiddleware);

router.get("/records", async (ctx) => {
  // if (ctx.state.user.id !== ctx.params.userId) {
  //   ctx.throw(403, "Access denied");
  // }

  ctx.body = await getRecords();
});

router.post("/", upload.any(), async (ctx) => {
  const file = (ctx.files as multer.File[])[0]!;
  const { stationId } = <{ stationId: string }>(
    ctx.request.body
  );

  const fileId = uuidv4();
  await uploadToS3(fileId, file.buffer);
  await createFileRecord(
    fileId,
    stationId,
    file.originalname,
  );

  ctx.body = "OK";
});

router.get("/:id", async (ctx) => {
  const record = await getFileRecord(ctx.params.id);
  if (!record) {
    ctx.throw(404, "File not found");
  }

  if (record) {
    const file = await getFromS3(record.id);

    ctx.body = Readable.from(file);
    ctx.attachment(record.filename);
  }
});

// router.delete("/:id", async (ctx) => {
//   const record = await getFileRecord(ctx.params.id);

//   if (record) {
//     await deleteFromS3(record.id);
//     ctx.body = (await deleteFileRecord(record.id)).acknowledged;
//   }
// });
