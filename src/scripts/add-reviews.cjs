/**
 * Add realistic customer reviews to every product in MongoDB.
 * Tops each product up to a random target of 4-8 reviews and
 * recomputes rating / numReviews.
 *
 * Usage:  node src/scripts/add-reviews.cjs
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
  name: String,
  slug: String,
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const NAMES = [
  'James M.', 'Sarah K.', 'Michael T.', 'Emily R.', 'David L.', 'Jessica W.',
  'Robert H.', 'Amanda P.', 'Chris B.', 'Laura S.', 'Kevin D.', 'Nicole F.',
  'Brian G.', 'Stephanie A.', 'Jason C.', 'Melissa V.', 'Thomas E.', 'Rachel N.',
  'Daniel O.', 'Megan J.', 'Andrew Z.', 'Jennifer Q.', 'Mark U.', 'Ashley I.',
  'Paul X.', 'Samantha Y.', 'Steven W.', 'Karen L.', 'Eric P.', 'Michelle D.',
  'Lars H.', 'Piet V.', 'Giovanni R.', 'Marie L.', 'Hans B.', 'Claire D.',
  'Jonas S.', 'Ana M.', 'Lucas F.', 'Sofia T.',
];

const COMMENTS = {
  5: [
    'Fast discreet shipping, package arrived in 6 days. Quality is exactly as described. Will order again.',
    'Legit product and excellent customer service on WhatsApp. Very professional operation.',
    'Third order now and never disappointed. Stealth packaging is top notch.',
    'Exactly what I ordered. Communication was quick and shipping to Europe took about a week.',
    'Genuine product, sealed packaging, no issues with customs. Highly recommend.',
    'Confirmation was fast, tracking provided same day. Smooth process from start to finish.',
    'Best source I have found in a long time. Product quality is on point.',
    'Arrived earlier than expected. Very discreet outer packaging, nobody could tell what it was.',
    'Customer support answered all my questions before I ordered. Great experience overall.',
    'Quality exceeded my expectations. Prices are fair for what you get.',
    'Ordered twice already, both times flawless. This is now my go-to store.',
    'Quick dispatch, professional service, authentic product. 5 stars deserved.',
  ],
  4: [
    'Good product and discreet delivery. Shipping took a day or two longer than stated but overall satisfied.',
    'Solid quality, fair price. Would have given 5 stars if tracking updated faster.',
    'Reliable vendor. Product works as expected, packaging was discreet.',
    'Happy with my purchase. Response time could be quicker but they did resolve my query.',
    'Good experience overall. Package was well hidden and arrived safely.',
    'Product is legit. Only minor issue was a small delay in dispatch.',
    'Professional service, good stealth. Ordering again soon.',
    'Everything as described. Took 9 days to arrive but worth the wait.',
  ],
  3: [
    'Product is fine but shipping took almost two weeks. Decent overall.',
    'Okay experience. Product quality is good but communication was slow at times.',
    'Received my order but it took longer than promised. Quality is acceptable.',
    'Average service. Package arrived safe but tracking was not very helpful.',
  ],
  2: [
    'Delivery took way too long, though the product itself is fine.',
    'Had to message support a few times before getting a reply. Product is okay.',
  ],
};

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Weighted rating: 65% x5, 24% x4, 8% x3, 3% x2
function randomRating() {
  const r = Math.random();
  if (r < 0.65) return 5;
  if (r < 0.89) return 4;
  if (r < 0.97) return 3;
  return 2;
}

function randomDate() {
  const daysBack = Math.floor(Math.random() * 180) + 5; // 5-185 days ago
  const d = new Date(Date.now() - daysBack * 86400000);
  // jitter the hours/minutes so it doesn't look generated
  d.setHours(Math.floor(Math.random() * 14) + 8, Math.floor(Math.random() * 60), 0, 0);
  return d;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const products = await Product.find({});
  console.log(`Found ${products.length} products`);

  const usedNameComment = new Set();
  let added = 0;

  for (const product of products) {
    const target = 4 + Math.floor(Math.random() * 5); // 4-8 reviews per product
    const existing = product.reviews.length;
    const needed = Math.max(0, target - existing);

    for (let i = 0; i < needed; i++) {
      const rating = randomRating();
      // avoid identical name+comment pairs on the same product
      let name = pick(NAMES);
      let comment = pick(COMMENTS[rating]);
      let guard = 0;
      while (usedNameComment.has(`${product._id}|${name}|${comment}`) && guard++ < 20) {
        name = pick(NAMES);
        comment = pick(COMMENTS[rating]);
      }
      usedNameComment.add(`${product._id}|${name}|${comment}`);
      product.reviews.push({ name, rating, comment, createdAt: randomDate() });
      added++;
    }

    if (product.reviews.length > 0) {
      const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
      product.rating = Math.round((total / product.reviews.length) * 10) / 10;
      product.numReviews = product.reviews.length;
    }
    await product.save();
  }

  console.log(`Added ${added} reviews across ${products.length} products`);
  await mongoose.disconnect();
  console.log('Done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
