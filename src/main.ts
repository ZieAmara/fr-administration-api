import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configSwagger = new DocumentBuilder()
    .setTitle('Manage Associations')
    .setDescription('This API allows you to manage all associations of our database.')
    .setVersion('1.0')
    .addTag('Manage associations Api')
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'trusted-scripts.com'],
        styleSrc: ['style.com'],
      },
    },
    dnsPrefetchControl: false, // Desable DNS prefetching for performance
    frameguard: { action: 'deny' }, // Stop clickjacking attacks by not allowing iframes to run in the browser window
    hsts: { maxAge: 31536000, includeSubDomains: true }, // Strict-Transport-Security header for modern browsers (Prevent MIME-sniffing)
    noSniff: true, // X-Content-Type-Options: nosniff (Prevent MIME-sniffing)
    referrerPolicy: { policy: 'no-referrer' }, // Referrer-Policy: no-referrer 
  }));

  const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);
  
  await app.listen(3001);

}
bootstrap();
