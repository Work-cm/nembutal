/**
 * Add the "Etomidate Crystal" product (copied from etomidateshop.com)
 * into MongoDB under the 'research chemicals' category.
 *
 * Usage:  node src/scripts/add-etomidate-crystal.cjs
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  casNumber: { type: String, default: '' },
  category: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  priceVariants: [{
    _id: { type: String, required: true },
    label: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true, default: 0 },
  }],
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const DESCRIPTION = `Specially prepared for research institutions and laboratories worldwide, this Research Grade Etomidate Crystal meets and exceeds the stringent quality standards demanded by academic institutions, government research facilities, and pharmaceutical laboratories.

Every batch undergoes a comprehensive analytical testing protocol: HPLC purity verification down to parts-per-million levels, GC-MS molecular fingerprinting confirming the absence of residual solvents or synthetic byproducts, NMR spectroscopy validating the exact molecular structure (C14H16N2O2), FTIR functional group integrity checks, X-ray powder diffraction for crystalline characterization, thermogravimetric thermal stability analysis, and Karl Fischer titration for exact moisture content.

Processed under ISO Class 7 cleanroom conditions with continuous monitoring of temperature, humidity, particulate count, and microbial contamination. Every production step is documented according to GMP protocols for complete traceability from raw material to finished product.

The fine, uniform particle size is achieved through proprietary micronization technology producing consistent distributions typically ranging from 10-50 microns — essential for reproducible dissolution studies, bioavailability assessments, and formulation development.

Packaging incorporates pharmaceutical-grade amber glass vials, vacuum-sealing under inert nitrogen atmosphere, molecular sieve desiccants, and aluminum-laminated secondary packaging with tamper-evident seals and batch-specific documentation.

Trusted by universities and research facilities across North America, Europe, and Asia for GABA-A receptor pharmacology, anesthetic mechanism studies, and pharmaceutical formulation science. For laboratory research only.

Specifications:
- CAS Number: 33125-97-2
- Purity: ≥99.8% (HPLC/MS verified)
- Grade: Research/Laboratory Grade
- Form: Fine crystalline powder
- Particle Size: Uniform microcrystalline structure
- Molecular Formula: C14H16N2O2
- Complete analytical documentation included
- Nitrogen-flushed, vacuum-sealed packaging
- Batch tracking and traceability records`;

const productData = {
  name: 'Etomidate Crystal',
  slug: 'etomidate-crystal',
  casNumber: '33125-97-2',
  category: 'research chemicals',
  images: ['/images/products/etomidate-crystal.jpg'],
  description: DESCRIPTION,
  price: 800,
  priceVariants: [
    { _id: 'etomidate-crystal-50g', label: '50g', quantity: 50, price: 800 },
  ],
  countInStock: 20,
  featured: false,
};

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await Product.findOne({ slug: productData.slug });
  if (existing) {
    await Product.updateOne({ _id: existing._id }, { $set: productData });
    console.log(`Updated existing product: ${productData.name}`);
  } else {
    await Product.create(productData);
    console.log(`Created product: ${productData.name}`);
  }

  await mongoose.disconnect();
  console.log('Done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
