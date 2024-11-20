import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './app/authentication/authentication.module';
import { EmployeesModule } from './app/employees/employees.module';
import { OrdersModule } from './app/orders/orders.module';
import { PrismaModule } from './app/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './app/items/items.module';

@Module({
  imports: [
    AuthenticationModule,
    EmployeesModule,
    OrdersModule,
    PrismaModule,
    ItemsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
