const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'huanxi.db');

let db;

function getDb() {
  if (!db) {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    db = new DatabaseSync(DB_PATH);
    db.exec('PRAGMA journal_mode = WAL');
    db.exec('PRAGMA foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      cover_image TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      name TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      price REAL,
      original_price REAL,
      size_info TEXT,
      is_inquiry_only INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 1,
      featured INTEGER DEFAULT 0,
      images TEXT DEFAULT '[]',
      tags TEXT DEFAULT '[]',
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT UNIQUE NOT NULL,
      product_id INTEGER,
      product_name TEXT,
      product_image TEXT,
      price REAL,
      quantity INTEGER DEFAULT 1,
      total_price REAL,
      customer_name TEXT,
      customer_phone TEXT,
      customer_wechat TEXT,
      customer_address TEXT,
      message TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS analytics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      page TEXT,
      product_id INTEGER,
      ip TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      subtitle TEXT,
      image_url TEXT NOT NULL,
      link TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics(created_at);
    CREATE INDEX IF NOT EXISTS idx_analytics_event ON analytics(event_type);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
  `);

  // Seed admin
  const adminCount = database.prepare('SELECT COUNT(*) as c FROM admins').get();
  if (adminCount.c === 0) {
    const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'huanxi2024', 10);
    database.prepare('INSERT INTO admins (username, password_hash, role) VALUES (?, ?, ?)').run(
      process.env.ADMIN_USERNAME || 'admin', hash, 'super'
    );
    console.log('✅ 管理员账号创建成功');
  }

  // Seed initial data
  const catCount = database.prepare('SELECT COUNT(*) as c FROM categories').get();
  if (catCount.c === 0) {
    seedData(database);
    console.log('✅ 初始数据导入成功');
  }
}

function seedData(db) {
  const insertCat = db.prepare(`
    INSERT INTO categories (name, slug, description, cover_image, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `);

  const tianzhuId = insertCat.run(
    '天珠', 'tianzhu',
    '正宗藏式天珠，一珠一缘，天然有灵。每一颗天珠都是时间与自然的馈赠，蕴含千年灵气。',
    '/static/天珠/天然缠丝新藏系 黄金财神眼顶级纯天然天眼佛眼图腾 价格28888🉐 尺寸-36×15mm.jpg', 1
  ).lastInsertRowid;

  const wenwanId = insertCat.run(
    '文玩', 'wenwan',
    '精选文玩珍品，传承工艺之美。老天铁、野生文玩，每一件都是不可复制的艺术臻品。',
    '/static/文玩/老天铁  金刚手菩萨 设计款佩戴霸气.jpg', 2
  ).lastInsertRowid;

  const teaId = insertCat.run(
    '茶系列', 'tea',
    '高山名茶，品茗养心。以茶会友，以茶静心，是高端礼品的不二之选。',
    '/static/茶系列/天台芽1.jpg', 3
  ).lastInsertRowid;

  const insertProduct = db.prepare(`
    INSERT INTO products (category_id, name, subtitle, description, price, size_info,
      is_inquiry_only, stock, featured, images, tags, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // ===== 天珠系列 =====
  insertProduct.run(tianzhuId,
    '黄金财神眼顶级纯天然天眼佛眼图腾',
    '顶级纯天然 · 天眼佛眼图腾 · 稀世珍藏',
    '此珠天然形成，黄金财神眼纹路清晰壮美，气场强大而祥和。佩戴者感受财运加持，心境澄明。天然缠丝新藏系出品，每一颗均为孤品，缘聚方得，错过无缘。',
    28888, '尺寸：36×15mm', 0, 1, 1,
    JSON.stringify([
      '/static/天珠/天然缠丝新藏系 黄金财神眼顶级纯天然天眼佛眼图腾 价格28888🉐 尺寸-36×15mm.jpg',
      '/static/天珠/天然缠丝新藏系 黄金财神眼顶级纯天然天眼佛眼图腾 价格28888🉐 尺寸-36×15mm2.jpg',
      '/static/天珠/天然缠丝新藏系 黄金财神眼顶级纯天然天眼佛眼图腾 价格28888🉐 尺寸-36×15mm3.jpg',
      '/static/天珠/天然缠丝新藏系 黄金财神眼顶级纯天然天眼佛眼图腾 价格28888🉐 尺寸-36×15mm4.jpg',
      '/static/天珠/天然缠丝新藏系 黄金财神眼顶级纯天然天眼佛眼图腾 价格28888🉐 尺寸-36×15mm5.jpg',
      '/static/天珠/天然缠丝新藏系 黄金财神眼顶级纯天然天眼佛眼图腾 价格28888🉐 尺寸-36×15mm6.jpg',
    ]),
    JSON.stringify(['孤品', '天然', '财神眼', '佛眼', '天眼']), 1
  );

  insertProduct.run(tianzhuId,
    '双线大鹏金翅鸟象形图腾',
    '天然缠丝 · 双线大鹏 · 护法加持',
    '大鹏金翅鸟为藏传佛教护法神兽，双线图腾寓意双重守护。天然缠丝工艺，纹路自然流畅，造型威严壮美。尺寸大气，气场宏大，适合寻求庇佑与力量之人。',
    30000, '尺寸：38.5×14mm', 0, 1, 1,
    JSON.stringify([
      '/static/天珠/天然缠丝新藏系 双线大鹏金翅鸟象形图腾 价格30000🉐 尺寸-38.5×14mm1.jpg',
      '/static/天珠/天然缠丝新藏系 双线大鹏金翅鸟象形图腾 价格30000🉐 尺寸-38.5×14mm2.jpg',
      '/static/天珠/天然缠丝新藏系 双线大鹏金翅鸟象形图腾 价格30000🉐 尺寸-38.5×14mm3.jpg',
      '/static/天珠/天然缠丝新藏系 双线大鹏金翅鸟象形图腾 价格30000🉐 尺寸-38.5×14mm4.jpg',
      '/static/天珠/天然缠丝新藏系 双线大鹏金翅鸟象形图腾 价格30000🉐 尺寸-38.5×14mm5.jpg',
      '/static/天珠/天然缠丝新藏系 双线大鹏金翅鸟象形图腾 价格30000🉐 尺寸-38.5×14mm6.jpg',
    ]),
    JSON.stringify(['大鹏金翅鸟', '天然缠丝', '护法', '双线图腾']), 2
  );

  insertProduct.run(tianzhuId,
    '千年黑白天珠 · 女士专属锁骨链',
    '千年古珠 · 黑白相融 · 女士专属',
    '千年黑白天珠，历经时间淬炼，蕴含千年灵气。搭配现代锁骨链设计，古典与时尚完美融合。黑白二色象征阴阳调和，佩戴者气质脱俗，是彰显身份与品味的绝佳之选。',
    55000, null, 0, 1, 1,
    JSON.stringify([
      '/static/天珠/千年黑白  女士锁骨链 5万5.jpg',
      '/static/天珠/千年黑白  女士锁骨链 5万52.jpg',
      '/static/天珠/千年黑白  女士锁骨链 5万53.jpg',
      '/static/天珠/千年黑白  女士锁骨链 5万54.jpg',
    ]),
    JSON.stringify(['千年古珠', '黑白', '女士', '锁骨链']), 3
  );

  insertProduct.run(tianzhuId,
    '千年药师天珠搭配顶级绿松石黄金设计款',
    '千年药师 · 顶级绿松石 · 18K黄金',
    '古老千年药师天珠，搭配顶级绿松石与18K黄金，专属珠宝级定制设计。药师佛加持，护佑健康平安。绿松石天然原色，与黄金相映成辉，尽显奢华气度。',
    null, null, 1, 1, 1,
    JSON.stringify([
      '/static/天珠/千年药师搭配顶级绿松石 黄金 设计款 美女的专属锁骨链.jpg',
      '/static/天珠/千年药师搭配顶级绿松石 黄金 设计款 美女的专属锁骨链2.jpg',
      '/static/天珠/千年药师搭配顶级绿松石 黄金 设计款 美女的专属锁骨链3.jpg',
      '/static/天珠/千年药师搭配顶级绿松石 黄金 设计款 美女的专属锁骨链4.jpg',
    ]),
    JSON.stringify(['千年药师', '绿松石', '黄金', '设计款', '询价']), 4
  );

  insertProduct.run(tianzhuId,
    '白化财神眼天珠',
    '稀有白化 · 财神眼图腾 · 珍贵孤品',
    '罕见白化天珠，手感细腻有收缩弹性，财神眼图腾清晰可辨。白化天珠极为稀罕，藏传佛教认为此类天珠可增旺财运，护佑平安。',
    8800, '尺寸：37×13.8mm', 0, 1, 0,
    JSON.stringify([
      '/static/天珠/天然缠丝新藏系 有收缩手感的白化财神眼图腾 价格8800🉐 尺寸-37×13.8mm.jpg',
      '/static/天珠/天然缠丝新藏系 有收缩手感的白化财神眼图腾 价格8800🉐 尺寸-37×13.8mm2.jpg',
      '/static/天珠/天然缠丝新藏系 有收缩手感的白化财神眼图腾 价格8800🉐 尺寸-37×13.8mm3.jpg',
      '/static/天珠/天然缠丝新藏系 有收缩手感的白化财神眼图腾 价格8800🉐 尺寸-37×13.8mm4.jpg',
      '/static/天珠/天然缠丝新藏系 有收缩手感的白化财神眼图腾 价格8800🉐 尺寸-37×13.8mm5.jpg',
      '/static/天珠/天然缠丝新藏系 有收缩手感的白化财神眼图腾 价格8800🉐 尺寸-37×13.8mm6.jpg',
    ]),
    JSON.stringify(['白化', '财神眼', '珍稀']), 5
  );

  insertProduct.run(tianzhuId,
    '层层叠叠眼中眼图腾',
    '眼中眼图腾 · 层叠玄妙 · 天然形成',
    '眼中眼图腾，层层叠叠，深邃神秘。此纹路极为罕见，天然形成，每一层都是岁月的印记。具有极高的收藏价值，是进阶藏家不可错过的珍品。',
    5888, '尺寸：38×15.2mm', 0, 1, 0,
    JSON.stringify([
      '/static/天珠/天然缠丝新藏系 层层叠叠眼中眼图腾 价格5888🉐 尺寸-38x15.2mm.jpg',
      '/static/天珠/天然缠丝新藏系 层层叠叠眼中眼图腾 价格5888🉐 尺寸-38x15.2mm2.jpg',
      '/static/天珠/天然缠丝新藏系 层层叠叠眼中眼图腾 价格5888🉐 尺寸-38x15.2mm3.jpg',
      '/static/天珠/天然缠丝新藏系 层层叠叠眼中眼图腾 价格5888🉐 尺寸-38x15.2mm4.jpg',
      '/static/天珠/天然缠丝新藏系 层层叠叠眼中眼图腾 价格5888🉐 尺寸-38x15.2mm5.jpg',
      '/static/天珠/天然缠丝新藏系 层层叠叠眼中眼图腾 价格5888🉐 尺寸-38x15.2mm6.jpg',
    ]),
    JSON.stringify(['眼中眼', '天然缠丝', '玄妙']), 6
  );

  insertProduct.run(tianzhuId,
    '雪堆白天然喜马拉雅天使之眼',
    '喜马拉雅 · 天使之眼 · 纯净灵动',
    '雪堆白天珠，产自喜马拉雅圣地，颜色纯净如雪，天使之眼图腾清晰灵动。佩戴此珠，净化心灵，带来祥和与喜悦。',
    3988, '尺寸：32×13mm', 0, 1, 0,
    JSON.stringify([
      '/static/天珠/天然缠丝新藏系 雪堆白 天然喜马拉雅天使之眼 价格3988🉐 尺寸-32×13mm.jpg',
      '/static/天珠/天然缠丝新藏系 雪堆白 天然喜马拉雅天使之眼 价格3988🉐 尺寸-32×13mm2.jpg',
      '/static/天珠/天然缠丝新藏系 雪堆白 天然喜马拉雅天使之眼 价格3988🉐 尺寸-32×13mm3.jpg',
      '/static/天珠/天然缠丝新藏系 雪堆白 天然喜马拉雅天使之眼 价格3988🉐 尺寸-32×13mm4.jpg',
      '/static/天珠/天然缠丝新藏系 雪堆白 天然喜马拉雅天使之眼 价格3988🉐 尺寸-32×13mm5.jpg',
      '/static/天珠/天然缠丝新藏系 雪堆白 天然喜马拉雅天使之眼 价格3988🉐 尺寸-32×13mm6.jpg',
    ]),
    JSON.stringify(['雪堆白', '喜马拉雅', '天使之眼']), 7
  );

  // ===== 文玩 & 老天铁系列 =====
  insertProduct.run(wenwanId,
    '老天铁 · 金刚手菩萨 · 设计款',
    '老天铁 · 金刚手菩萨 · 密宗护法',
    '金刚手菩萨为密宗护法菩萨，降伏一切魔障。老天铁铸造，形态庄严慈悲，工艺精湛。此款为设计定制版，融合传统铸造工艺与现代审美，佩戴霸气十足，是高端收藏的绝佳选择。',
    null, null, 1, 1, 1,
    JSON.stringify([
      '/static/文玩/老天铁  金刚手菩萨 设计款佩戴霸气.jpg',
      '/static/文玩/老天铁  金刚手菩萨 设计款佩戴霸气2.jpg',
      '/static/文玩/老天铁  金刚手菩萨 设计款佩戴霸气3.jpg',
      '/static/文玩/老天铁  金刚手菩萨 设计款佩戴霸气4.jpg',
    ]),
    JSON.stringify(['老天铁', '金刚手菩萨', '密宗', '询价']), 1
  );

  insertProduct.run(wenwanId,
    '老天铁 · 大鹏鸟 · 18K金 · 钻石 · 蓝宝石',
    '老天铁 · 18K金钻 · 顶级珠宝级工艺',
    '老天铁大鹏鸟，镶嵌天然钻石与蓝宝石，18K金底座，珠宝级定制工艺。大鹏金翅鸟为护法神兽，此件集工艺之美与加持之力于一身。钻石与蓝宝石相互辉映，极为珍贵稀有。',
    null, null, 1, 1, 1,
    JSON.stringify([
      '/static/文玩/老天铁 大鹏鸟 18k金 钻石 蓝宝石1.jpg',
      '/static/文玩/老天铁 大鹏鸟 18k金 钻石 蓝宝石2.jpg',
      '/static/文玩/老天铁 大鹏鸟 18k金 钻石 蓝宝石3.jpg',
      '/static/文玩/老天铁 大鹏鸟 18k金 钻石 蓝宝石4.jpg',
    ]),
    JSON.stringify(['老天铁', '大鹏鸟', '18K金', '钻石', '蓝宝石', '询价']), 2
  );

  insertProduct.run(wenwanId,
    '老天铁 · 托甲 · 不动明王 · 设计款',
    '老天铁 · 不动明王 · 护身神器',
    '老天铁托甲，镶嵌不动明王法相，造型威严有力。不动明王为密宗护法尊神，身着火焰，手持金刚杵，百邪不侵。设计款限量制作，佩戴者气场倍增。',
    null, null, 1, 1, 0,
    JSON.stringify([
      '/static/文玩/老天铁  托甲 不动明王  设计款佩戴霸气.jpg',
      '/static/文玩/老天铁  托甲 不动明王  设计款佩戴霸气2.jpg',
      '/static/文玩/老天铁  托甲 不动明王  设计款佩戴霸气3.jpg',
      '/static/文玩/老天铁  托甲 不动明王  设计款佩戴霸气4.jpg',
    ]),
    JSON.stringify(['老天铁', '托甲', '不动明王', '询价', '护身']), 3
  );

  insertProduct.run(wenwanId,
    '老天铁 · 超小尺寸大鹏鸟 · 18K金钻',
    '迷你大鹏 · 18K金钻 · 随身携带',
    '超小尺寸大鹏鸟老天铁，镶嵌18K金与天然钻石，精工细作。虽小巧玲珑，却气场不减。可作吊坠随身佩戴，低调中透露不凡品味，是精品收藏与日常佩戴的完美结合。',
    null, null, 1, 1, 0,
    JSON.stringify([
      '/static/文玩/老天铁 超小尺寸大鹏鸟 18k金钻.jpg',
      '/static/文玩/老天铁 超小尺寸大鹏鸟 18k金钻2.jpg',
      '/static/文玩/老天铁 超小尺寸大鹏鸟 18k金钻3.jpg',
      '/static/文玩/老天铁 超小尺寸大鹏鸟 18k金钻4.jpg',
    ]),
    JSON.stringify(['老天铁', '大鹏鸟', '18K金', '迷你', '询价']), 4
  );

  insertProduct.run(wenwanId,
    '老天铁设计款',
    '老天铁 · 原创设计 · 传统工艺',
    '老天铁原创设计款，延续传统工艺精髓，融入现代设计语言。每件作品均为匠人手工打造，工艺细腻，纹路精美。是收藏文玩爱好者不可多得的精品。',
    null, null, 1, 1, 0,
    JSON.stringify([
      '/static/文玩/老天铁设计款.jpg',
      '/static/文玩/老天铁设计款2.jpg',
      '/static/文玩/老天铁设计款3.jpg',
      '/static/文玩/老天铁设计款4.jpg',
    ]),
    JSON.stringify(['老天铁', '设计款', '原创', '询价']), 5
  );

  insertProduct.run(wenwanId,
    '野生文玩 · 绝版孤品',
    '十余年野生 · 仅此一串 · 稀世孤品',
    '这串文玩已有十余年历史，纯野生采集，无人工干预。包浆温润自然，手感极佳，光泽内敛深邃。仅此一串，世间唯一，缘者得之。',
    1800, null, 0, 1, 0,
    JSON.stringify(['/static/文玩/10几年前的野生仅此一串 1800.jpg']),
    JSON.stringify(['野生', '孤品', '文玩', '绝版']), 6
  );

  // ===== 茶系列 =====
  insertProduct.run(teaId,
    '天台芽 · 高山云雾茶',
    '天台山云雾茶 · 清香甘醇 · 怡神养性',
    '产自天台山高山云雾之中，每年仅一季采摘。嫩芽细叶，工艺精良，茶汤清澈透亮，香气馥郁持久，回甘悠长。精美礼盒包装，是馈赠贵人的高端礼品首选。',
    null, null, 1, 99, 0,
    JSON.stringify([
      '/static/茶系列/天台芽1.jpg',
      '/static/茶系列/天台芽12.jpg',
      '/static/茶系列/天台芽13.jpg',
      '/static/茶系列/微信图片_2026-06-15_220338_442.jpg',
      '/static/茶系列/微信图片_2026-06-15_220345_968.jpg',
      '/static/茶系列/微信图片_2026-06-15_220350_350.jpg',
      '/static/茶系列/微信图片_2026-06-15_220354_057.jpg',
    ]),
    JSON.stringify(['天台芽', '高山茶', '云雾茶', '礼品']), 1
  );

  // Banners
  const insertBanner = db.prepare(`
    INSERT INTO banners (title, subtitle, image_url, sort_order, is_active)
    VALUES (?, ?, ?, ?, 1)
  `);
  insertBanner.run('欢喜天珠', '戴的是气场 · 求的是心安', '/static/天珠/天然缠丝新藏系 黄金财神眼顶级纯天然天眼佛眼图腾 价格28888🉐 尺寸-36×15mm.jpg', 1);
  insertBanner.run('一眼入心 · 一珠一缘', '佩戴天珠是最有力量的表达', '/static/展厅/品牌主理人照片.jpg', 2);
  insertBanner.run('老天铁 · 密宗臻品', '传承工艺之美，收藏价值永存', '/static/文玩/老天铁  金刚手菩萨 设计款佩戴霸气.jpg', 3);
}

module.exports = { getDb, initDb };
