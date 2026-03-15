import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as fs from 'fs';
import * as path from 'path';
const hbs = require('hbs');

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: '*' });

  /**
   * resolve runtime paths
   */
  const root = __dirname;

  const viewsPath = join(root, 'views');
  const publicPath = join(root, 'public');
  const partialsPath = join(viewsPath, 'partials');

  /**
   * setup view engine
   */
  app.setBaseViewsDir(viewsPath);
  app.setViewEngine('hbs');

  /**
   * register partials safely
   */
  if (fs.existsSync(partialsPath)) {

    const files = fs.readdirSync(partialsPath);

    files.forEach(file => {

      if (!file.endsWith('.hbs')) return;

      const name = path.parse(file).name;

      const template = fs.readFileSync(
        join(partialsPath, file),
        'utf8'
      );

      hbs.registerPartial(name, template);

    });

  }

  /**
   * static files
   */
  app.useStaticAssets(publicPath);

  const port = process.env.PORT ?? 3000;

  await app.listen(port);

  console.log(`🚀 Server running → http://localhost:${port}`);
  console.log('Views:', viewsPath);
  console.log('Partials:', partialsPath);
}

bootstrap();