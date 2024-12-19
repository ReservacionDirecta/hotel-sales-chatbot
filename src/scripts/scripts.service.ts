// backend/src/scripts/scripts.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScriptsService {
  private readonly logger = new Logger(ScriptsService.name);

  constructor(private prisma: PrismaService) {}

  async getSalesScripts() {
    try {
      const scripts = await this.prisma.salesScript.findMany({
        where: { active: true },
        orderBy: {
          id: 'asc'
        }
      });

      this.logger.log(`Found ${scripts.length} active sales scripts`);
      
      return {
        success: true,
        data: scripts,
        message: scripts.length > 0 ? 'Scripts encontrados' : 'No hay scripts disponibles'
      };
    } catch (error) {
      this.logger.error('Error getting sales scripts:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error al obtener los scripts'
      };
    }
  }

  async createSalesScript(data: any) {
    try {
      const script = await this.prisma.salesScript.create({
        data: {
          ...data,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });

      this.logger.log(`Created new sales script with ID: ${script.id}`);

      return {
        success: true,
        data: script,
        message: 'Script creado exitosamente'
      };
    } catch (error) {
      this.logger.error('Error creating sales script:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error al crear el script'
      };
    }
  }

  async updateSalesScript(id: number, data: any) {
    try {
      const script = await this.prisma.salesScript.update({
        where: { id },
        data: {
          ...data,
          updatedAt: new Date()
        }
      });

      this.logger.log(`Updated sales script with ID: ${script.id}`);

      return {
        success: true,
        data: script,
        message: 'Script actualizado exitosamente'
      };
    } catch (error) {
      this.logger.error(`Error updating sales script ${id}:`, error);
      return {
        success: false,
        error: error.message,
        message: 'Error al actualizar el script'
      };
    }
  }
}