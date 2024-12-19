import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesScript } from '../entities/sales-script.entity';
import { CreateSalesScriptDto, UpdateSalesScriptDto } from '../dto/sales-script.dto';

@Injectable()
export class SalesScriptService {
  constructor(
    @InjectRepository(SalesScript)
    private salesScriptRepository: Repository<SalesScript>,
  ) {}

  async findAll(): Promise<SalesScript[]> {
    return this.salesScriptRepository.find();
  }

  async findOne(id: number): Promise<SalesScript> {
    const script = await this.salesScriptRepository.findOne({ where: { id } });
    if (!script) {
      throw new NotFoundException(`Script with ID ${id} not found`);
    }
    return script;
  }

  async create(createSalesScriptDto: CreateSalesScriptDto): Promise<SalesScript> {
    const script = this.salesScriptRepository.create(createSalesScriptDto);
    return this.salesScriptRepository.save(script);
  }

  async update(id: number, updateSalesScriptDto: UpdateSalesScriptDto): Promise<SalesScript> {
    const script = await this.findOne(id);
    Object.assign(script, updateSalesScriptDto);
    return this.salesScriptRepository.save(script);
  }

  async remove(id: number): Promise<void> {
    const script = await this.findOne(id);
    await this.salesScriptRepository.remove(script);
  }
}
