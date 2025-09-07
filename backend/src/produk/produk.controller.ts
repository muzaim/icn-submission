// src/cuti/cuti.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  UseInterceptors,
  HttpException,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { CreateProdukDto } from './dto/create-produk.dto';
import { ProdukService } from './produk.service';
import { Produk } from './entities/produk.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  // Endpoint untuk menambah cuti
  @Post()
  @UseInterceptors(
    FileInterceptor('foto', {
      storage: diskStorage({
        destination: './uploads', // Folder tempat menyimpan file
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `produk-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new HttpException(
              'Only image files are allowed!',
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async create(
    @Body() createProdukDto: CreateProdukDto,
    @UploadedFile() foto: Express.Multer.File,
  ) {
    if (!foto) {
      throw new HttpException('Foto is required', HttpStatus.BAD_REQUEST);
    }

    // Tambahkan path foto ke DTO
    const produkData = {
      ...createProdukDto,
      foto: foto.filename, // Simpan nama file di database
    };

    return this.produkService.create(produkData);
  }

  @Post(':id')
@UseInterceptors(
  FileInterceptor('foto', {
    storage: diskStorage({
      destination: './uploads', // Folder tempat menyimpan file
      filename: (req, file, callback) => {
        const uniqueSuffix =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `produk-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return callback(
          new HttpException(
            'Only image files are allowed!',
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }
      callback(null, true);
    },
  }),
)
async update(
  @Param('id') id: number,
  @Body() updateProdukDto: CreateProdukDto,
  @UploadedFile() foto: Express.Multer.File,
) {
  // Find the existing product by ID
  const existingProduk = await this.produkService.findOne(id);

  if (!existingProduk) {
    throw new HttpException('Produk not found', HttpStatus.NOT_FOUND);
  }

  // Prepare the update data
  const updatedData = { ...updateProdukDto };

  // If a new foto is uploaded, update the foto field
  if (foto) {
    updatedData.foto = foto.filename; // Update the foto with the new file
    // Optionally, delete the old file if necessary (e.g., using fs.unlink)
  } else {
    // Keep the existing foto if no new file is uploaded
    updatedData.foto = existingProduk.foto;
  }

  // Call the service to update the product
  return this.produkService.update(id, updatedData);
}


  // Endpoint untuk mengambil semua cuti
  @Get()
  async findAll(): Promise<Produk[]> {
    return this.produkService.findAll();
  }

  // Endpoint untuk mengambil cuti berdasarkan ID
  @Get(':id')
  async findById(id: number): Promise<Produk> {
    // Melakukan query untuk mencari Cuti berdasarkan ID dan melakukan LEFT JOIN dengan Pegawai
    const cuti = await this.produkService.findOne(id);
    return cuti;
  }

  @Delete(':id')
  // Menghapus cuti berdasarkan ID
  async remove(@Param('id') id: number): Promise<void> {
    // Check if the ID is valid and exists in the database
    const result = await this.produkService.delete(id);

    if (result.affected === 0) {
      throw new Error('Produk not found');
    }
  }
}
