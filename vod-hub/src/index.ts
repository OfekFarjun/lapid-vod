import Koa from 'koa';
import cors from '@koa/cors';
import { router as filesRouter } from './api/files';
import { bodyParser } from '@koa/bodyparser';
export const app = new Koa();

app.use(bodyParser());
app.use(cors())

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err: any) {
        err.status = err.statusCode || err.status || 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});

app.use(filesRouter.routes()).use(filesRouter.allowedMethods());

app.listen(3000).on('listening',
    () => console.log('Server is up & running on port 3000')
);