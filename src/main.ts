import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: false,
  }));
  const port = configService.get('PORT', 3000);
  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle(configService.get('SWAGGER_TITLE', 'Todo API'))
    .setDescription(configService.get('SWAGGER_DESCRIPTION', 'A comprehensive Todo application API with user authentication, todo management, and advanced filtering capabilities.'))
    .setVersion(configService.get('SWAGGER_VERSION', '1.0'))
    .addTag('Authentication', 'User registration, login, and authentication endpoints')
    .addTag('Users', 'User profile management and account operations')
    .addTag('Todos', 'Todo CRUD operations with filtering and pagination')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for references
    )
    .addServer(configService.get('SERVER_URL', `http://localhost:${port}`), 'Development server')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: 'Todo API Documentation',
  });

  await app.listen(port);
  
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation is available at: http://localhost:${port}/api`);
}
bootstrap();
