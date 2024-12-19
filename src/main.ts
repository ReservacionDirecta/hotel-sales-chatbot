import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    
    // Enable CORS
    app.enableCors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] // Add your production domain
        : ['http://localhost:3000', 'http://127.0.0.1:3000'], // Frontend runs on 3000
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    // Enable validation
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    // Apply global filters and interceptors
    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new HttpExceptionFilter(),
    );
    app.useGlobalInterceptors(new TransformInterceptor());

    // Set global prefix for all routes
    app.setGlobalPrefix('api');

    // Handle process termination gracefully
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Closing application...');
      await app.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('SIGINT received. Closing application...');
      await app.close();
      process.exit(0);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Don't exit the process, just log the error
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit the process, just log the error
    });

    const port = process.env.PORT || 3001; // Backend runs on 3001
    await app.listen(port).catch(error => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please try the following:
        1. Stop any other service using port ${port}
        2. Wait a few seconds and try again
        3. Or set a different port using PORT environment variable`);
      }
      throw error;
    });
    console.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('Error during application bootstrap:', error);
    process.exit(1);
  }
}

bootstrap();
