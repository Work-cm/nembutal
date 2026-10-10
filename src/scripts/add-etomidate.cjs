/**
 * Add the "Etomidate Powder Pure" product (copied from etomidateshop.com)
 * into MongoDB under the 'research chemicals' category.
 *
 * Usage:  node src/scripts/add-etomidate.cjs
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

const DESCRIPTION = `Pharmaceutical-grade pure etomidate powder with exceptional purity and consistency. Sourced exclusively from certified manufacturers adhering to the strictest international pharmaceutical standards, every batch undergoes a rigorous multi-stage quality control process that ensures ≥99.8% purity (HPLC verified).

The crystalline structure is uniform in size and structure, ensuring consistent dissolution rates, predictable pharmacokinetics, and reproducible results across all experimental protocols — critical for exact dosing requirements, dissolution studies, and formulation development.

Every batch is accompanied by a comprehensive Certificate of Analysis (COA) including HPLC purity verification, NMR molecular structure confirmation, MS molecular weight validation, FTIR functional group identification, full elemental analysis, residual solvents and heavy metals testing, microbial screening, and batch-specific stability data.

Each container is vacuum-sealed under inert nitrogen atmosphere in light-protective amber glass or aluminum-laminated materials with pharmaceutical-grade desiccants, preserving full potency and stability even with long-term storage.

Used in academic and pharmaceutical research for GABA-A receptor modulation studies, structure-activity investigations, comparative anesthetic research, formulation development, bioequivalence studies, and reference material preparation. For laboratory research only.

Specifications:
- CAS Number: 33125-97-2
- Purity: ≥99.8% (HPLC verified)
- Form: Fine crystalline powder
- Molecular Formula: C14H16N2O2
- Molecular Weight: 244.29 g/mol
- Storage: Store in cool, dry place away from light
- Certificate of Analysis included with every order
- Vacuum-sealed, tamper-evident packaging`;

const productData = {
  name: 'Etomidate Powder Pure',
  slug: 'etomidate-powder-pure',
  casNumber: '33125-97-2',
  category: 'research chemicals',
  images: ['/images/products/etomidate-powder-pure.jpg'],
  description: DESCRIPTION,
  price: 800,
  priceVariants: [
    { _id: 'etomidate-50g', label: '50g', quantity: 50, price: 800 },
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
