<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'sku' => 'SRV-CLOUD-ENT',
                'name' => 'Enterprise Cloud Hosting (Annual)',
                'description' => 'High-performance cloud hosting for enterprise applications with 99.9% uptime guarantee.',
                'category' => 'Service',
                'unit_price' => 12000.00,
                'currency' => 'SAR',
            ],
            [
                'sku' => 'SW-ERP-LIC-01',
                'name' => 'Custom ERP Software License',
                'description' => 'Full module access to Custom ERP including Finance, HR, and Supply Chain.',
                'category' => 'Software',
                'unit_price' => 25000.00,
                'currency' => 'SAR',
            ],
            [
                'sku' => 'IOT-DEV-GAT-X1',
                'name' => 'Industrial IoT Gateway X1',
                'description' => 'Hardware gateway for industrial sensory networks and data collection.',
                'category' => 'Hardware',
                'unit_price' => 1500.00,
                'currency' => 'SAR',
            ],
            [
                'sku' => 'CON-TECH-ADV',
                'name' => 'Technical Consulting & Advisory',
                'description' => 'Per hour rate for senior technical consulting and digital transformation advisory.',
                'category' => 'Consulting',
                'unit_price' => 500.00,
                'currency' => 'SAR',
            ],
        ];

        foreach ($products as $productData) {
            Product::updateOrCreate(['sku' => $productData['sku']], $productData);
        }
    }
}
