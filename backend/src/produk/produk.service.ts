import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produk } from './entities/produk.entity';
import { CreateProdukDto } from './dto/create-produk.dto';

@Injectable()
export class ProdukService {
  constructor(
    @InjectRepository(Produk)
    private produkRepository: Repository<Produk>,
  ) {}

  findAll() {
    return this.produkRepository.find().then((produkList) => {
      // Base URL for your images (make sure this is correct)
      const baseUrl = `${process.env.BASE_URL}/uploads/`;

      // Map through the result and add the full image URL
      return produkList.map((produk) => {
        // Add the base URL to the image filename
        produk.foto = baseUrl + produk.foto;
        return produk;
      });
    });
  }

  findOne(id: number) {
    return this.produkRepository.findOne({ where: { id } }).then((produk) => {
      // Base URL for your images (make sure this is correct)
      const baseUrl = `${process.env.BASE_URL}/uploads/`;

      // If the product exists, add the full image URL
      if (produk) {
        produk.foto = baseUrl + produk.foto;
      }

      return produk;
    });
  }

  create(data: Partial<Produk>) {
    const produk = this.produkRepository.create(data);
    return this.produkRepository.save(produk);
  }

  // Update the product with the given ID
  async update(id: number, updateProdukDto: CreateProdukDto): Promise<Produk> {
    const existingProduk = await this.produkRepository.findOne({
      where: { id },
    });

    if (!existingProduk) {
      throw new Error('Product not found');
    }

    // Update the fields that are provided in the DTO
    const updatedProduk = this.produkRepository.create({
      ...existingProduk,
      ...updateProdukDto, // Merge existing data with the new data from DTO
    });

    return this.produkRepository.save(updatedProduk);
  }

  async getPriceByProductId(id: number): Promise<number> {
    const produk = await this.produkRepository
      .createQueryBuilder('produk')
      .select('produk.harga')
      .where('produk.id = :id', { id })
      .getOne();

    if (!produk) {
      throw new Error(`Product with ID ${id} not found`); // Menangani error jika produk tidak ditemukan
    }

    return produk.harga;
  }

  delete(id: number) {
    return this.produkRepository.delete(id);
  }
}
