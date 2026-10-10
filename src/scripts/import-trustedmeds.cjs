/**
 * Import the full product catalog from trustedmedsstore.com (WooCommerce Store API)
 * into MongoDB. Downloads product images locally into public/images/products.
 *
 * Usage:  node src/scripts/import-trustedmeds.cjs [--no-images] [--update-only]
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const API_BASE = 'https://trustedmedsstore.com/wp-json/wc/store/v1';
const IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'products');
const NO_IMAGES = process.argv.includes('--no-images');
const UPDATE_ONLY = process.argv.includes('--update-only');
const CONCURRENCY = 4;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

// ---- Category map: WooCommerce slug -> local category value ----
const CATEGORY_MAP = {
  'foundayo': 'foundayo',
  'buy-codeine-online': 'codeine',
  'codeine': 'codeine',
  'diet-pills': 'diet pills',
  'painkillers': 'painkillers',
  'nembutal': 'nembutal',
  'research-chemicals': 'research chemicals',
  'benzodiazepines': 'benzodiazepines',
  'buy-benzodiazepines-online': 'benzodiazepines',
  'men-sex-health': 'men sex health',
  'alluvi': 'alluvi',
  'steroids': 'steroids',
};

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
    price: { type: Number, default: 0 },
  }],
  countInStock: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

// ---------------- helpers ----------------
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 catalog-import' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(fetchJson(res.headers.location));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let body = '';
      res.on('data', (c) => (body += c));
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(new Error('timeout')); });
  });
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('http:') ? http : https;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 catalog-import' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return resolve(download(res.headers.location, dest));
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const out = fs.createWriteStream(dest);
      res.pipe(out);
      out.on('finish', () => out.close(resolve));
      out.on('error', reject);
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(new Error('timeout')); });
  });
}

/** Minimal HTML -> plain text converter tuned for WooCommerce descriptions. */
function htmlToText(html) {
  if (!html) return '';
  let t = html
    // table cells -> separators before block handling
    .replace(/<\/(td|th)>/gi, '  |  ')
    .replace(/<\/tr>/gi, '\n')
    // block-level tags -> newlines
    .replace(/<(p|h[1-6]|div|section|header|footer|table|ul|ol|blockquote)[^>]*>/gi, '\n')
    .replace(/<\/(p|h[1-6]|div|section|header|footer|table|ul|ol|blockquote)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<br\s*\/?>/gi, '\n')
    // strip remaining tags
    .replace(/<[^>]+>/g, '')
    // entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#8217;|&#8216;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&#8211;|&#8212;/g, '–')
    .replace(/&#8364;/g, '€')
    .replace(/&#036;/g, '$')
    .replace(/&#(\d+);/g, (m, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z]+;/gi, ' ')
    // collapse whitespace
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return t;
}

const decodeName = (s) =>
  String(s || '')
    .replace(/&#(\d+);/g, (m, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '–')
    .trim();

const centsToUnits = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n / 100 : 0;
};

function extFromUrl(url) {
  const clean = url.split('?')[0].split('#')[0];
  const m = clean.match(/\.(png|jpe?g|webp|avif|gif)$/i);
  return m ? `.${m[1].toLowerCase().replace('jpeg', 'jpg')}` : '.jpg';
}

async function downloadImages(slug, images) {
  const out = [];
  for (let i = 0; i < images.length; i += 1) {
    const img = images[i];
    const url = img.src || img.thumbnail;
    if (!url) continue;
    const filename = `${slug}-${i + 1}${extFromUrl(url)}`;
    const dest = path.join(IMAGE_DIR, filename);
    try {
      if (!fs.existsSync(dest)) await download(url, dest);
      out.push(`/images/products/${filename}`);
    } catch (e) {
      console.warn(`   image failed for ${slug}: ${e.message}`);
    }
  }
  return out;
}

/** Fetch variation prices for variable products (best effort). */
async function fetchVariations(product) {
  if (product.type !== 'variable' || !product.variations?.length) return [];
  const results = [];
  for (const v of product.variations) {
    let label = (v.attributes || []).map((a) => a.value).join(' / ') || `Option ${v.id}`;
    let price = null;
    try {
      const detail = await fetchJson(`${API_BASE}/products/${v.id}`);
      price = centsToUnits(detail?.prices?.price);
    } catch { /* fall back below */ }
    if (price === null || price <= 0) {
      // Interpolate across the store price range when individual fetch fails
      const min = centsToUnits(product.prices?.price_range?.min_amount);
      const max = centsToUnits(product.prices?.price_range?.max_amount);
      const idx = product.variations.indexOf(v);
      const steps = Math.max(product.variations.length - 1, 1);
      price = min + ((max - min) * idx) / steps;
    }
    results.push({ _id: String(v.id), label, quantity: 1, price: Math.round(price) });
  }
  return results;
}

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
  if (!NO_IMAGES && !fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });

  // ---- fetch all pages ----
  const all = [];
  let page = 1;
  while (true) {
    const url = `${API_BASE}/products?per_page=100&page=${page}`;
    const batch = await fetchJson(url);
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    console.log(`Fetched page ${page}: ${batch.length} products (total ${all.length})`);
    if (batch.length < 100) break;
    page += 1;
  }
  console.log(`\nTotal products found: ${all.length}`);

  let created = 0, updated = 0, skipped = 0;
  const unmapped = new Set();

  // simple worker pool
  const queue = [...all];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const p = queue.shift();
      if (!p) break;
      const name = decodeName(p.name);
      const slug = p.slug;
      const catSlug = p.categories?.[0]?.slug || '';
      const category = CATEGORY_MAP[catSlug];
      if (!category) {
        unmapped.add(catSlug || 'none');
        skipped += 1;
        continue;
      }

      const description = htmlToText(p.description) || htmlToText(p.short_description) || name;
      const priceVariants = await fetchVariations(p);
      const price = centsToUnits(
        p.prices?.price_range?.min_amount ?? p.prices?.price ?? 0
      );
      const images = NO_IMAGES
        ? (p.images || []).map((i) => i.src).filter(Boolean)
        : await downloadImages(slug, p.images || []);

      const doc = {
        name, slug, category, description,
        price: Math.max(price, 0),
        images,
        countInStock: p.is_in_stock ? 50 : 0,
        rating: Number(p.average_rating) || 4.5,
        numReviews: Number(p.review_count) || 0,
        featured: false,
      };
      if (priceVariants.length) doc.priceVariants = priceVariants;

      try {
        const existing = await Product.findOne({ slug }).select('_id');
        if (existing) {
          await Product.updateOne({ _id: existing._id }, { $set: doc });
          updated += 1;
        } else if (!UPDATE_ONLY) {
          await Product.create(doc);
          created += 1;
          process.stdout.write(`  + ${name}\n`);
        } else {
          skipped += 1;
        }
      } catch (e) {
        console.warn(`   failed ${slug}: ${e.message}`);
        skipped += 1;
      }
    }
  });
  await Promise.all(workers);

  // mark bestsellers: first product of each category -> featured
  if (!UPDATE_ONLY) {
    const cats = Object.values(CATEGORY_MAP);
    for (const c of new Set(cats)) {
      await Product.updateMany({ category: c }, { $set: { featured: false } });
      await Product.updateOne(
        { category: c },
        { $set: { featured: true } },
        { sort: { createdAt: 1 } }
      );
    }
  }

  const total = await Product.countDocuments();
  console.log(`\nDone. Created: ${created}, Updated: ${updated}, Skipped: ${skipped}`);
  console.log(`Products in DB now: ${total}`);
  if (unmapped.size) console.log('Unmapped categories:', [...unmapped].join(', '));
  await mongoose.disconnect();
}

run().catch((e) => { console.error(e); process.exit(1); });
