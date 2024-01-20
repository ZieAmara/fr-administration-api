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

  // Add origin allow to cors
  const allowedOrigins = [
    'http://localhost',
    'http://localhost:4200',
    'http://localhost:9090',
  ];

  const corsOptions = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };

  app.enableCors(corsOptions);

  app.use(helmet({
    dnsPrefetchControl: false, // Desable DNS prefetching for performance
    frameguard: { action: 'deny' }, // Stop clickjacking attacks by not allowing iframes to run in the browser window
    hsts: { maxAge: 31536000, includeSubDomains: true }, // Strict-Transport-Security header for modern browsers (Prevent MIME-sniffing)
    noSniff: true, // X-Content-Type-Options: nosniff (Prevent MIME-sniffing)
    referrerPolicy: { policy: 'no-referrer' }, // Referrer-Policy: no-referrer 
  }));

  
  const port = 3000;
  await app.listen(port, () => {
    console.log(`Application is running on port: ${ port }`);
  });

}
bootstrap();
