package com.ecommerce.inventory;

import com.ecommerce.inventory.entity.Product;
import com.ecommerce.inventory.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class ProductDataSeeder implements CommandLineRunner {

        private final ProductRepository productRepository;

        public ProductDataSeeder(ProductRepository productRepository) {
                this.productRepository = productRepository;
        }

        @Override
        public void run(String... args) throws Exception {
                if (productRepository.count() == 0) {
                        seedProducts();
                }
        }

        private void seedProducts() {
                List<Product> products = Arrays.asList(
                                new Product(
                                                "Wireless Noise-Canceling Headphones",
                                                "Premium over-ear headphones with 30-hour battery life and active noise cancellation.",
                                                new BigDecimal("24999"),
                                                25,
                                                "WH-1000XM5",
                                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
                                                "Audio"),
                                new Product(
                                                "Mechanical Gaming Keyboard",
                                                "RGB backlit mechanical keyboard with Cherry MX Red switches for speed and precision.",
                                                new BigDecimal("8999"),
                                                15,
                                                "KB-RGB-002",
                                                "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&auto=format&fit=crop&q=60",
                                                "Peripherals"),
                                new Product(
                                                "Ultra-Wide Curved Monitor 34\"",
                                                "Immersive 34-inch WQHD curved monitor with 144Hz refresh rate.",
                                                new BigDecimal("45999"),
                                                8,
                                                "MON-UW-34",
                                                "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60",
                                                "Displays"),
                                new Product(
                                                "Ergonomic Mesh Office Chair",
                                                "Fully adjustable chair with lumbar support and breathable mesh back.",
                                                new BigDecimal("18499"),
                                                3,
                                                "CHR-ERGO-04",
                                                "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&auto=format&fit=crop&q=60",
                                                "Furniture"),
                                new Product(
                                                "USB-C Hub 7-in-1 Adapter",
                                                "Compact hub with HDMI, 3 USB ports, SD card reader, and PD charging.",
                                                new BigDecimal("2499"),
                                                50,
                                                "HUB-USBC-07",
                                                "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&auto=format&fit=crop&q=60",
                                                "Accessories"),
                                new Product(
                                                "Professional 4K Webcam",
                                                "Ultra HD webcam with auto-focus and built-in ring light for streaming.",
                                                new BigDecimal("12999"),
                                                12,
                                                "CAM-4K-PRO",
                                                "https://images.unsplash.com/photo-1594614271360-0ed9a570ae15?w=500&auto=format&fit=crop&q=60",
                                                "Peripherals"),
                                new Product(
                                                "Wireless Gaming Mouse",
                                                "Lightweight wireless mouse with 20,000 DPI sensor and 70hr battery.",
                                                new BigDecimal("4999"),
                                                0,
                                                "MSE-WL-GM",
                                                "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop&q=60",
                                                "Peripherals"),
                                new Product(
                                                "Portable SSD 1TB",
                                                "Rugged portable solid-state drive with up to 1050MB/s transfer speeds.",
                                                new BigDecimal("8499"),
                                                30,
                                                "SSD-1TB-RUG",
                                                "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&auto=format&fit=crop&q=60",
                                                "Storage"),
                                new Product(
                                                "Smart Watch Series 7",
                                                "Advanced fitness tracker with ECG, blood oxygen, and always-on retina display.",
                                                new BigDecimal("32999"),
                                                18,
                                                "WTC-SMT-07",
                                                "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60",
                                                "Wearables"),
                                new Product(
                                                "Drone with 4K Camera",
                                                "Foldable drone with 30-minute flight time and intelligent flight modes.",
                                                new BigDecimal("65999"),
                                                5,
                                                "DRN-4K-AIR",
                                                "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500&auto=format&fit=crop&q=60",
                                                "Drones"),
                                new Product(
                                                "VR Headset System",
                                                "All-in-one virtual reality system with high-resolution display and touch controllers.",
                                                new BigDecimal("24999"),
                                                10,
                                                "VR-SYS-02",
                                                "https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=500&auto=format&fit=crop&q=60",
                                                "Gaming"),
                                new Product(
                                                "Bluetooth Speaker Portable",
                                                "Waterproof portable speaker with 360-degree sound and 12-hour playtime.",
                                                new BigDecimal("7999"),
                                                40,
                                                "SPK-BT-H20",
                                                "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60",
                                                "Audio"),
                                new Product(
                                                "Tablet Pro 12.9\"",
                                                "Powerful tablet with M1 chip, Liquid Retina XDR display, and 5G cellular.",
                                                new BigDecimal("89999"),
                                                7,
                                                "TAB-PRO-12",
                                                "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60",
                                                "Electronics"),
                                new Product(
                                                "Mirrorless Camera Body",
                                                "Full-frame mirrorless camera with 24.2MP sensor and 4K video recording.",
                                                new BigDecimal("149999"),
                                                4,
                                                "CAM-FF-MRL",
                                                "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&auto=format&fit=crop&q=60",
                                                "Cameras"),

                                new Product(
                                                "Fast Wireless Charging Pad",
                                                "15W fast wireless charger compatible with all Qi-enabled devices.",
                                                new BigDecimal("1999"),
                                                60,
                                                "CHG-WL-15",
                                                "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&auto=format&fit=crop&q=60",
                                                "Accessories"));

                productRepository.saveAll(products);
                System.out.println("Seeded " + products.size() + " products.");
        }
}
