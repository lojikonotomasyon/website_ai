#!/usr/bin/env python3
"""Adds data-i18n to all card content (step, benefit, application, spec cards)
across all 10 sub-pages, and inserts matching keys into js/i18n.js."""

import os, re
BASE = os.path.dirname(os.path.abspath(__file__))

# ── Translation data for every page ───────────────────────────────────────
# Format: page_prefix → {tr: {key: value}, en: {key: value}}
# Cards: step1h/step1p … step4, ben1h/ben1p … ben4, app1h/app1p … app4,
#        spec1h … spec4h (no p, spec-cards only have ul lists)
# PLC / integration also have: ind1h/ind1p … ind4, scol1h / scol2h / scol3h

CARDS = {
    'sorter': {
        'tr': {
            'step1h': 'Yükleme',       'step1p': 'Ürünler konveyor bandına yüklenir ve sisteme giriş yapar.',
            'step2h': 'Tarama',        'step2p': 'Barkod okuyucu veya kamera ile ürün türü belirlenir.',
            'step3h': 'Yönlendirme',   'step3p': "PLC sistemi ürünü doğru divertor'a yönlendirir.",
            'step4h': 'Ayırma',        'step4p': 'Divertor aktif hale gelir ve ürünü ilgili sepete düşürür.',
            'ben1h': 'Yüksek Hız',                'ben1p': '3000+ parça/saat kapasite ile hızlı sıralama işlemleri.',
            'ben2h': 'Yüksek Doğruluk',           'ben2p': '%99.9+ doğruluk oranı ile hatasız sıralama.',
            'ben3h': 'Kesintisiz Çalışma',         'ben3p': '24/7 kesintisiz çalışma ile sürekli üretim.',
            'ben4h': 'İnsan Gücü Tasarrufu',       'ben4p': 'Otomatik sıralama ile işçi maliyetlerini azaltır.',
            'app1h': 'Depo Yönetimi',   'app1p': 'Büyük depolar ve dağıtım merkezlerinde ürün sıralama.',
            'app2h': 'Lojistik',        'app2p': 'Kargo ve kurye şirketlerinde paket ayrıştırma.',
            'app3h': 'Üretim',          'app3p': 'Fabrikalarda ürün kalite kontrolü ve sıralama.',
            'app4h': 'E-ticaret',       'app4p': 'Online satış platformlarında sipariş hazırlama.',
            'spec1h': 'Cross Belt Sorter', 'spec2h': 'Tilt Tray Sorter',
            'spec3h': 'Narrow Belt Sorter','spec4h': 'Shoe Sorter',
        },
        'en': {
            'step1h': 'Loading',     'step1p': 'Products are loaded onto the conveyor belt and enter the system.',
            'step2h': 'Scanning',    'step2p': 'Product type is identified using a barcode reader or camera.',
            'step3h': 'Routing',     'step3p': 'The PLC system routes the product to the correct divertor.',
            'step4h': 'Sorting',     'step4p': 'The divertor activates and drops the product into the designated bin.',
            'ben1h': 'High Speed',             'ben1p': 'Fast sorting with 3000+ pieces/hour capacity.',
            'ben2h': 'High Accuracy',          'ben2p': 'Error-free sorting with 99.9%+ accuracy rate.',
            'ben3h': 'Continuous Operation',   'ben3p': '24/7 uninterrupted operation for continuous production.',
            'ben4h': 'Labor Savings',          'ben4p': 'Reduces labor costs with automatic sorting.',
            'app1h': 'Warehouse Management', 'app1p': 'Product sorting in large warehouses and distribution centers.',
            'app2h': 'Logistics',            'app2p': 'Package sorting in cargo and courier companies.',
            'app3h': 'Manufacturing',        'app3p': 'Product quality control and sorting in factories.',
            'app4h': 'E-commerce',           'app4p': 'Order fulfillment in online sales platforms.',
            'spec1h': 'Cross Belt Sorter', 'spec2h': 'Tilt Tray Sorter',
            'spec3h': 'Narrow Belt Sorter','spec4h': 'Shoe Sorter',
        },
    },
    'pallet': {
        'tr': {
            'step1h': 'Yükleme',          'step1p': 'Pallet platforma yüklenir ve güvenlik kontrolleri yapılır.',
            'step2h': 'Hedef Belirleme',   'step2p': 'PLC sistemi hedef katı belirler ve rotayı planlar.',
            'step3h': 'Yükselme',          'step3p': 'Platform güvenli bir şekilde hedef kata yükselir.',
            'step4h': 'Boşaltma',          'step4p': 'Pallet hedef kattan alınır ve transfer tamamlanır.',
            'ben1h': 'Dikey Taşıma',           'ben1p': 'Çok katlı binalarda dikey pallet taşıma imkanı.',
            'ben2h': 'Güvenlik',               'ben2p': '%99.9 güvenlik oranı ile güvenli pallet transferi.',
            'ben3h': 'Yüksek Hız',             'ben3p': '2.5 m/s hız ile hızlı pallet transfer işlemleri.',
            'ben4h': 'İnsan Gücü Tasarrufu',   'ben4p': 'Otomatik transfer ile işçi maliyetlerini azaltır.',
            'app1h': 'Depo Yönetimi',  'app1p': 'Çok katlı depolar ve dağıtım merkezlerinde pallet transferi.',
            'app2h': 'Üretim',         'app2p': 'Fabrikalarda katlar arası malzeme ve ürün transferi.',
            'app3h': 'Lojistik',       'app3p': 'Kargo merkezlerinde pallet yükleme ve boşaltma.',
            'app4h': 'Ticari Binalar', 'app4p': 'AVM ve ofis binalarında malzeme transferi.',
            'spec1h': 'Yük Kapasitesi', 'spec2h': 'Hareket Özellikleri',
            'spec3h': 'Güvenlik Özellikleri', 'spec4h': 'Kontrol Sistemi',
        },
        'en': {
            'step1h': 'Loading',          'step1p': 'Pallet is loaded onto the platform and safety checks are performed.',
            'step2h': 'Target Selection', 'step2p': 'The PLC system determines the target floor and plans the route.',
            'step3h': 'Ascent',           'step3p': 'The platform rises safely to the target floor.',
            'step4h': 'Unloading',        'step4p': 'The pallet is collected from the target floor and the transfer is complete.',
            'ben1h': 'Vertical Transport', 'ben1p': 'Vertical pallet transport capability in multi-story buildings.',
            'ben2h': 'Safety',             'ben2p': 'Safe pallet transfer with 99.9% safety rate.',
            'ben3h': 'High Speed',         'ben3p': 'Fast pallet transfer at 2.5 m/s.',
            'ben4h': 'Labor Savings',      'ben4p': 'Reduces labor costs with automatic transfer.',
            'app1h': 'Warehouse Management', 'app1p': 'Pallet transfer in multi-story warehouses and distribution centers.',
            'app2h': 'Manufacturing',        'app2p': 'Material and product transfer between floors in factories.',
            'app3h': 'Logistics',            'app3p': 'Pallet loading and unloading in cargo centers.',
            'app4h': 'Commercial Buildings', 'app4p': 'Material transfer in shopping centers and office buildings.',
            'spec1h': 'Load Capacity', 'spec2h': 'Movement Features',
            'spec3h': 'Safety Features', 'spec4h': 'Control System',
        },
    },
    'miniload': {
        'tr': {
            'step1h': 'Yükleme',    'step1p': "Ürünler shuttle'a yüklenir ve depolama pozisyonu belirlenir.",
            'step2h': 'Taşıma',     'step2p': 'Shuttle belirlenen raf seviyesine hareket eder.',
            'step3h': 'Depolama',   'step3p': 'Ürünler raf seviyesine yerleştirilir ve kaydedilir.',
            'step4h': 'Geri Alma',  'step4p': 'İstenen ürünler hızlıca bulunur ve alınır.',
            'ben1h': 'Yüksek Yoğunluk',        'ben1p': 'Maksimum depolama alanı kullanımı ile yoğun depolama.',
            'ben2h': 'Yüksek Hız',             'ben2p': '500+ kutu/saat kapasite ile hızlı işlem.',
            'ben3h': 'Yüksek Doğruluk',        'ben3p': '%99.8 doğruluk oranı ile hatasız operasyon.',
            'ben4h': 'İnsan Gücü Tasarrufu',   'ben4p': 'Otomatik sistem ile işçi maliyetlerini azaltır.',
            'app1h': 'Depo Yönetimi', 'app1p': 'Büyük depolar ve dağıtım merkezlerinde otomatik depolama.',
            'app2h': 'Üretim',        'app2p': 'Fabrikalarda hammadde ve yarı mamul depolama.',
            'app3h': 'E-ticaret',     'app3p': 'Online satış platformlarında hızlı sipariş hazırlama.',
            'app4h': 'Lojistik',      'app4p': 'Kargo merkezlerinde paket depolama ve sıralama.',
            'spec1h': 'Shuttle Özellikleri', 'spec2h': 'Raf Sistemi',
            'spec3h': 'Performans',          'spec4h': 'Kontrol Sistemi',
        },
        'en': {
            'step1h': 'Loading',    'step1p': 'Products are loaded onto the shuttle and the storage position is determined.',
            'step2h': 'Transport',  'step2p': 'The shuttle moves to the designated rack level.',
            'step3h': 'Storage',    'step3p': 'Products are placed at the rack level and recorded.',
            'step4h': 'Retrieval',  'step4p': 'Requested products are quickly located and retrieved.',
            'ben1h': 'High Density',   'ben1p': 'High-density storage with maximum use of storage area.',
            'ben2h': 'High Speed',     'ben2p': 'Fast processing with 500+ boxes/hour capacity.',
            'ben3h': 'High Accuracy',  'ben3p': 'Error-free operation with 99.8% accuracy rate.',
            'ben4h': 'Labor Savings',  'ben4p': 'Reduces labor costs with automated system.',
            'app1h': 'Warehouse Management', 'app1p': 'Automated storage in large warehouses and distribution centers.',
            'app2h': 'Manufacturing',        'app2p': 'Raw material and semi-finished product storage in factories.',
            'app3h': 'E-commerce',           'app3p': 'Fast order fulfillment in online sales platforms.',
            'app4h': 'Logistics',            'app4p': 'Package storage and sorting in cargo centers.',
            'spec1h': 'Shuttle Specifications', 'spec2h': 'Rack System',
            'spec3h': 'Performance',            'spec4h': 'Control System',
        },
    },
    'picktolight': {
        'tr': {
            'step1h': 'Sipariş Alma',      'step1p': 'WMS sistemi siparişi alır ve toplama listesi oluşturur.',
            'step2h': 'Işık Yönlendirme',  'step2p': 'İlgili ürün konumunda LED ışık yanar ve miktar gösterilir.',
            'step3h': 'Toplama',           'step3p': 'Operatör ışıklı konumdan ürünü alır ve miktarı onaylar.',
            'step4h': 'Onaylama',          'step4p': 'Toplama işlemi onaylanır ve sistem bir sonraki ürüne geçer.',
            'ben1h': 'Yüksek Hız',             'ben1p': '800+ picks/saat kapasite ile hızlı toplama işlemleri.',
            'ben2h': 'Yüksek Doğruluk',        'ben2p': '%99.9 doğruluk oranı ile hatasız toplama.',
            'ben3h': 'Kolay Öğrenme',          'ben3p': 'Basit ışık sistemi ile hızlı öğrenme ve adaptasyon.',
            'ben4h': 'İnsan Gücü Tasarrufu',   'ben4p': 'Verimli toplama ile işçi maliyetlerini azaltır.',
            'app1h': 'Depo Yönetimi', 'app1p': 'Büyük depolar ve dağıtım merkezlerinde toplama operasyonları.',
            'app2h': 'E-ticaret',     'app2p': 'Online satış platformlarında sipariş hazırlama.',
            'app3h': 'Üretim',        'app3p': 'Fabrikalarda malzeme toplama ve kitting işlemleri.',
            'app4h': 'Lojistik',      'app4p': 'Kargo merkezlerinde paket toplama ve sıralama.',
            'spec1h': 'LED Göstergeler', 'spec2h': 'Gösterge Paneli',
            'spec3h': 'Performans',      'spec4h': 'Kontrol Sistemi',
        },
        'en': {
            'step1h': 'Order Receipt',   'step1p': 'The WMS system receives the order and creates a picking list.',
            'step2h': 'Light Guidance',  'step2p': 'LED light illuminates at the relevant product location showing the quantity.',
            'step3h': 'Picking',         'step3p': 'The operator picks the product from the lit location and confirms the quantity.',
            'step4h': 'Confirmation',    'step4p': 'The picking is confirmed and the system moves to the next product.',
            'ben1h': 'High Speed',     'ben1p': 'Fast picking with 800+ picks/hour capacity.',
            'ben2h': 'High Accuracy',  'ben2p': 'Error-free picking with 99.9% accuracy rate.',
            'ben3h': 'Easy Learning',  'ben3p': 'Quick learning and adaptation with simple light system.',
            'ben4h': 'Labor Savings',  'ben4p': 'Reduces labor costs with efficient picking.',
            'app1h': 'Warehouse Management', 'app1p': 'Picking operations in large warehouses and distribution centers.',
            'app2h': 'E-commerce',           'app2p': 'Order fulfillment in online sales platforms.',
            'app3h': 'Manufacturing',        'app3p': 'Material picking and kitting operations in factories.',
            'app4h': 'Logistics',            'app4p': 'Package picking and sorting in cargo centers.',
            'spec1h': 'LED Indicators', 'spec2h': 'Display Panel',
            'spec3h': 'Performance',    'spec4h': 'Control System',
        },
    },
    'scada': {
        'tr': {
            'step1h': 'Veri Toplama',   'step1p': "PLC'lerden ve sensörlerden gerçek zamanlı veri toplanır.",
            'step2h': 'İşleme',         'step2p': 'Toplanan veriler işlenir ve analiz edilir.',
            'step3h': 'Görselleştirme', 'step3p': 'Veriler kullanıcı dostu arayüzde görselleştirilir.',
            'step4h': 'Kontrol',        'step4p': 'Sistemler uzaktan kontrol edilir ve yönetilir.',
            'ben1h': 'Gerçek Zamanlı İzleme', 'ben1p': '7/24 sürekli izleme ve kontrol imkanı.',
            'ben2h': 'Detaylı Raporlama',     'ben2p': 'Kapsamlı analiz ve raporlama özellikleri.',
            'ben3h': 'Güvenlik',              'ben3p': 'Güvenli uzaktan erişim ve kontrol.',
            'ben4h': 'Verimlilik',            'ben4p': 'Operasyonel verimliliği artırır.',
            'app1h': 'Üretim',       'app1p': 'Fabrikalarda üretim süreçlerinin izlenmesi ve kontrolü.',
            'app2h': 'Su Arıtma',    'app2p': 'Su arıtma tesislerinde süreç kontrolü.',
            'app3h': 'Enerji',       'app3p': 'Elektrik santrallerinde enerji yönetimi.',
            'app4h': 'Depo Yönetimi','app4p': 'Depolarda otomasyon sistemlerinin kontrolü.',
            'spec1h': 'Yazılım Özellikleri',    'spec2h': 'Donanım Gereksinimleri',
            'spec3h': 'Performans',             'spec4h': 'Entegrasyon',
        },
        'en': {
            'step1h': 'Data Collection',  'step1p': 'Real-time data is collected from PLCs and sensors.',
            'step2h': 'Processing',       'step2p': 'Collected data is processed and analyzed.',
            'step3h': 'Visualization',    'step3p': 'Data is visualized in a user-friendly interface.',
            'step4h': 'Control',          'step4p': 'Systems are remotely controlled and managed.',
            'ben1h': 'Real-Time Monitoring', 'ben1p': '24/7 continuous monitoring and control capability.',
            'ben2h': 'Detailed Reporting',   'ben2p': 'Comprehensive analysis and reporting features.',
            'ben3h': 'Security',             'ben3p': 'Secure remote access and control.',
            'ben4h': 'Efficiency',           'ben4p': 'Increases operational efficiency.',
            'app1h': 'Manufacturing',       'app1p': 'Monitoring and control of production processes in factories.',
            'app2h': 'Water Treatment',     'app2p': 'Process control in water treatment facilities.',
            'app3h': 'Energy',              'app3p': 'Energy management in power plants.',
            'app4h': 'Warehouse Management','app4p': 'Control of automation systems in warehouses.',
            'spec1h': 'Software Features',    'spec2h': 'Hardware Requirements',
            'spec3h': 'Performance',          'spec4h': 'Integration',
        },
    },
    'production': {
        'tr': {
            'step1h': 'Veri Toplama', 'step1p': 'Sensörlerden ve makinelerden gerçek zamanlı veri toplanır.',
            'step2h': 'Analiz',       'step2p': 'Toplanan veriler analiz edilir ve performans hesaplanır.',
            'step3h': 'İzleme',       'step3p': 'Üretim süreci gerçek zamanlı olarak izlenir.',
            'step4h': 'Uyarı',        'step4p': 'Anormal durumlar için otomatik uyarılar verilir.',
            'ben1h': 'Verimlilik Artışı', 'ben1p': "Üretim verimliliğini %25'e kadar artırır.",
            'ben2h': 'Kalite Kontrolü',   'ben2p': 'Otomatik kalite kontrol ile hata oranını düşürür.',
            'ben3h': 'Zaman Tasarrufu',   'ben3p': 'Manuel kontrolleri otomatikleştirir.',
            'ben4h': 'Maliyet Azaltma',   'ben4p': 'Operasyonel maliyetleri önemli ölçüde azaltır.',
            'app1h': 'Otomotiv', 'app1p': 'Araç üretim hatlarında kalite kontrolü.',
            'app2h': 'İlaç',     'app2p': 'İlaç üretiminde güvenlik ve kalite takibi.',
            'app3h': 'Tekstil',  'app3p': 'Kumaş üretiminde verimlilik optimizasyonu.',
            'app4h': 'Gıda',     'app4p': 'Gıda üretiminde hijyen ve kalite kontrolü.',
            'spec1h': 'Sensör Teknolojileri',   'spec2h': 'İletişim Protokolleri',
            'spec3h': 'Performans',             'spec4h': 'Raporlama',
        },
        'en': {
            'step1h': 'Data Collection', 'step1p': 'Real-time data is collected from sensors and machines.',
            'step2h': 'Analysis',        'step2p': 'Collected data is analyzed and performance is calculated.',
            'step3h': 'Monitoring',      'step3p': 'The production process is monitored in real time.',
            'step4h': 'Alerts',          'step4p': 'Automatic alerts are issued for abnormal conditions.',
            'ben1h': 'Efficiency Boost', 'ben1p': 'Increases production efficiency by up to 25%.',
            'ben2h': 'Quality Control',  'ben2p': 'Reduces error rate with automatic quality control.',
            'ben3h': 'Time Savings',     'ben3p': 'Automates manual controls.',
            'ben4h': 'Cost Reduction',   'ben4p': 'Significantly reduces operational costs.',
            'app1h': 'Automotive',     'app1p': 'Quality control on vehicle production lines.',
            'app2h': 'Pharmaceutical', 'app2p': 'Safety and quality monitoring in pharmaceutical production.',
            'app3h': 'Textile',        'app3p': 'Efficiency optimization in fabric production.',
            'app4h': 'Food',           'app4p': 'Hygiene and quality control in food production.',
            'spec1h': 'Sensor Technologies',   'spec2h': 'Communication Protocols',
            'spec3h': 'Performance',           'spec4h': 'Reporting',
        },
    },
    'datacollection': {
        'tr': {
            'step1h': 'Sensör Okuma',  'step1p': 'Endüstriyel sensörlerden veri okunur.',
            'step2h': 'Veri İletimi',  'step2p': 'Veriler ağ üzerinden iletilir.',
            'step3h': 'İşleme',        'step3p': 'Veriler işlenir ve analiz edilir.',
            'step4h': 'Depolama',      'step4p': 'Veriler güvenli şekilde saklanır.',
            'ben1h': 'Gerçek Zamanlı Analiz', 'ben1p': 'Anlık veri analizi ile hızlı kararlar.',
            'ben2h': 'Güvenli Veri',          'ben2p': 'Şifreli ve güvenli veri iletimi.',
            'ben3h': 'Ölçeklenebilir',        'ben3p': 'Binlerce sensör desteği.',
            'ben4h': '7/24 İzleme',           'ben4p': 'Kesintisiz veri toplama.',
            'app1h': 'Üretim',          'app1p': 'Fabrikalarda makine verilerinin izlenmesi.',
            'app2h': 'Çevre',           'app2p': 'Çevresel parametrelerin takibi.',
            'app3h': 'Bina Otomasyonu', 'app3p': 'Akıllı bina sistemlerinde veri toplama.',
            'app4h': 'Ulaşım',          'app4p': 'Trafik ve ulaşım verilerinin izlenmesi.',
            'spec1h': 'Sensör Desteği',         'spec2h': 'İletişim Protokolleri',
            'spec3h': 'Performans',             'spec4h': 'Güvenlik',
        },
        'en': {
            'step1h': 'Sensor Reading',    'step1p': 'Data is read from industrial sensors.',
            'step2h': 'Data Transmission', 'step2p': 'Data is transmitted over the network.',
            'step3h': 'Processing',        'step3p': 'Data is processed and analyzed.',
            'step4h': 'Storage',           'step4p': 'Data is stored securely.',
            'ben1h': 'Real-Time Analysis', 'ben1p': 'Quick decisions with instant data analysis.',
            'ben2h': 'Secure Data',        'ben2p': 'Encrypted and secure data transmission.',
            'ben3h': 'Scalable',           'ben3p': 'Support for thousands of sensors.',
            'ben4h': '24/7 Monitoring',    'ben4p': 'Uninterrupted data collection.',
            'app1h': 'Manufacturing',       'app1p': 'Monitoring machine data in factories.',
            'app2h': 'Environment',         'app2p': 'Monitoring environmental parameters.',
            'app3h': 'Building Automation', 'app3p': 'Data collection in smart building systems.',
            'app4h': 'Transportation',      'app4p': 'Monitoring traffic and transportation data.',
            'spec1h': 'Sensor Support',          'spec2h': 'Communication Protocols',
            'spec3h': 'Performance',             'spec4h': 'Security',
        },
    },
    'software': {
        'tr': {
            'step1h': 'Analiz',       'step1p': 'İhtiyaçlar analiz edilir ve planlanır.',
            'step2h': 'Tasarım',      'step2p': 'Yazılım mimarisi ve arayüz tasarlanır.',
            'step3h': 'Geliştirme',   'step3p': 'Kod yazılır ve test edilir.',
            'step4h': 'Deploy',       'step4p': 'Yazılım canlıya alınır ve desteklenir.',
            'ben1h': 'Özelleştirilebilir', 'ben1p': 'İhtiyaçlarınıza tam uyumlu çözümler.',
            'ben2h': 'Verimlilik',         'ben2p': 'İş süreçlerinizi optimize eder.',
            'ben3h': 'Güvenlik',           'ben3p': 'Güvenli ve güvenilir yazılım.',
            'ben4h': 'Destek',             'ben4p': '7/24 teknik destek ve bakım.',
            'app1h': 'Üretim Otomasyonu', 'app1p': 'Fabrika otomasyon sistemleri.',
            'app2h': 'Depo Yönetimi',     'app2p': 'Akıllı depo yönetim sistemleri.',
            'app3h': 'Raporlama',         'app3p': 'Özel raporlama ve analiz araçları.',
            'app4h': 'Mobil Uygulamalar', 'app4p': 'Endüstriyel mobil çözümler.',
            'spec1h': 'Backend Teknolojileri',  'spec2h': 'Frontend Teknolojileri',
            'spec3h': 'Veritabanı',             'spec4h': 'DevOps',
        },
        'en': {
            'step1h': 'Analysis',    'step1p': 'Requirements are analyzed and planned.',
            'step2h': 'Design',      'step2p': 'Software architecture and interface are designed.',
            'step3h': 'Development', 'step3p': 'Code is written and tested.',
            'step4h': 'Deployment',  'step4p': 'Software is deployed and supported.',
            'ben1h': 'Customizable', 'ben1p': 'Solutions fully tailored to your needs.',
            'ben2h': 'Efficiency',   'ben2p': 'Optimizes your business processes.',
            'ben3h': 'Security',     'ben3p': 'Safe and reliable software.',
            'ben4h': 'Support',      'ben4p': '24/7 technical support and maintenance.',
            'app1h': 'Manufacturing Automation', 'app1p': 'Factory automation systems.',
            'app2h': 'Warehouse Management',     'app2p': 'Smart warehouse management systems.',
            'app3h': 'Reporting',                'app3p': 'Custom reporting and analysis tools.',
            'app4h': 'Mobile Applications',      'app4p': 'Industrial mobile solutions.',
            'spec1h': 'Backend Technologies',  'spec2h': 'Frontend Technologies',
            'spec3h': 'Database',              'spec4h': 'DevOps',
        },
    },
    'plc': {
        'tr': {
            'step1h': 'Analiz ve Planlama',  'step1p': 'Müşteri ihtiyaçlarını analiz eder, sistem gereksinimlerini belirler ve programlama stratejisini planlarız.',
            'step2h': 'Programlama',         'step2p': 'Ladder Logic, Function Block veya Structured Text kullanarak PLC programını geliştiririz.',
            'step3h': 'Test ve Doğrulama',   'step3p': 'Programı simülasyon ortamında test eder, hataları düzeltir ve performansını optimize ederiz.',
            'step4h': 'Kurulum ve Eğitim',   'step4p': "Programı PLC'ye yükler, sistem entegrasyonunu sağlar ve kullanıcı eğitimi veririz.",
            'ben1h': 'Uzman Ekip',   'ben1p': '10+ yıl deneyimli PLC programcıları ile profesyonel hizmet',
            'ben2h': 'Çoklu Marka',  'ben2p': 'Siemens, Allen Bradley, Schneider, Mitsubishi ve diğer tüm markalar',
            'ben3h': 'Güvenilir',    'ben3p': 'Endüstriyel standartlara uygun, güvenli ve stabil programlar',
            'ben4h': '7/24 Destek',  'ben4p': 'Kurulum sonrası teknik destek ve bakım hizmetleri',
            'ind1h': 'Üretim Otomasyonu', 'ind1p': 'Montaj hatları, paketleme sistemleri, kalite kontrol',
            'ind2h': 'Depo Otomasyonu',   'ind2p': 'AS/RS sistemleri, konveyör kontrolü, sorter sistemleri',
            'ind3h': 'Proses Kontrolü',   'ind3p': 'Kimyasal işlemler, su arıtma, enerji yönetimi',
            'ind4h': 'Otomotiv',          'ind4p': 'Üretim hatları, robot kontrolü, test sistemleri',
            'scol1h': 'PLC Markaları', 'scol2h': 'Programlama Dilleri', 'scol3h': 'Özellikler',
        },
        'en': {
            'step1h': 'Analysis & Planning',  'step1p': 'We analyze client requirements, identify system specifications, and plan the programming strategy.',
            'step2h': 'Programming',          'step2p': 'We develop the PLC program using Ladder Logic, Function Block, or Structured Text.',
            'step3h': 'Testing & Validation', 'step3p': 'We test the program in a simulation environment, correct errors, and optimize performance.',
            'step4h': 'Installation & Training','step4p': "We upload the program to the PLC, ensure system integration, and provide user training.",
            'ben1h': 'Expert Team',  'ben1p': 'Professional service with 10+ years of experienced PLC programmers.',
            'ben2h': 'Multi-Brand',  'ben2p': 'Siemens, Allen Bradley, Schneider, Mitsubishi and all other brands.',
            'ben3h': 'Reliable',     'ben3p': 'Safe and stable programs compliant with industrial standards.',
            'ben4h': '24/7 Support', 'ben4p': 'Post-installation technical support and maintenance services.',
            'ind1h': 'Manufacturing Automation', 'ind1p': 'Assembly lines, packaging systems, quality control.',
            'ind2h': 'Warehouse Automation',     'ind2p': 'AS/RS systems, conveyor control, sorter systems.',
            'ind3h': 'Process Control',          'ind3p': 'Chemical processes, water treatment, energy management.',
            'ind4h': 'Automotive',               'ind4p': 'Production lines, robot control, test systems.',
            'scol1h': 'PLC Brands', 'scol2h': 'Programming Languages', 'scol3h': 'Features',
        },
    },
    'integration': {
        'tr': {
            'step1h': 'Sistem Analizi',         'step1p': 'Mevcut sistemlerinizi analiz eder, entegrasyon gereksinimlerini belirler ve uyumluluk kontrolü yaparız.',
            'step2h': 'Entegrasyon Tasarımı',   'step2p': "API'ler, veri formatları ve iletişim protokollerini belirleyerek entegrasyon mimarisini tasarlarız.",
            'step3h': 'Geliştirme ve Test',     'step3p': 'Entegrasyon yazılımlarını geliştirir, test ortamında doğrular ve performans optimizasyonu yaparız.',
            'step4h': 'Canlıya Alma',           'step4p': 'Sistemi canlı ortama geçirir, izleme ve bakım süreçlerini kurar ve kullanıcı eğitimi veririz.',
            'ben1h': 'Uyumluluk',   'ben1p': 'Tüm endüstriyel sistemler ve yazılımlarla uyumlu entegrasyon çözümleri',
            'ben2h': 'Güvenlik',    'ben2p': 'Endüstriyel güvenlik standartlarına uygun, şifreli ve güvenli entegrasyon',
            'ben3h': 'Performans',  'ben3p': 'Yüksek performanslı, düşük gecikmeli ve ölçeklenebilir çözümler',
            'ben4h': 'Destek',      'ben4p': '7/24 teknik destek ve sürekli bakım hizmetleri',
            'ind1h': 'Üretim Entegrasyonu', 'ind1p': 'ERP-MES-SCADA entegrasyonu, üretim planlama ve kontrol',
            'ind2h': 'Depo Yönetimi',       'ind2p': 'WMS entegrasyonu, stok takibi, otomatik sipariş yönetimi',
            'ind3h': 'Veri Analizi',         'ind3p': 'Gerçek zamanlı veri toplama, raporlama ve analiz entegrasyonu',
            'ind4h': 'Ekipman Yönetimi',    'ind4p': 'CMMS entegrasyonu, bakım planlama ve ekipman izleme',
            'scol1h': 'İletişim Protokolleri', 'scol2h': 'Entegre Sistemler', 'scol3h': 'Özellikler',
        },
        'en': {
            'step1h': 'System Analysis',      'step1p': 'We analyze your existing systems, identify integration requirements, and perform compatibility checks.',
            'step2h': 'Integration Design',   'step2p': 'We design the integration architecture by defining APIs, data formats, and communication protocols.',
            'step3h': 'Development & Testing','step3p': 'We develop integration software, verify in test environments, and perform performance optimization.',
            'step4h': 'Go-Live',              'step4p': 'We deploy the system to live environment, set up monitoring and maintenance processes, and provide user training.',
            'ben1h': 'Compatibility', 'ben1p': 'Integration solutions compatible with all industrial systems and software.',
            'ben2h': 'Security',      'ben2p': 'Encrypted and secure integration compliant with industrial security standards.',
            'ben3h': 'Performance',   'ben3p': 'High-performance, low-latency, and scalable solutions.',
            'ben4h': 'Support',       'ben4p': '24/7 technical support and ongoing maintenance services.',
            'ind1h': 'Manufacturing Integration', 'ind1p': 'ERP-MES-SCADA integration, production planning and control.',
            'ind2h': 'Warehouse Management',      'ind2p': 'WMS integration, inventory tracking, automated order management.',
            'ind3h': 'Data Analytics',            'ind3p': 'Real-time data collection, reporting, and analytics integration.',
            'ind4h': 'Equipment Management',      'ind4p': 'CMMS integration, maintenance planning, and equipment monitoring.',
            'scol1h': 'Communication Protocols', 'scol2h': 'Integrated Systems', 'scol3h': 'Features',
        },
    },
}

# ── Anchor key (last existing key) in each page block ─────────────────────
# Used to locate the right insertion point in i18n.js
TR_ANCHORS = {
    'sorter':         "            techSpecsDesc:   'Sorter sistemlerinin teknik detayları',",
    'pallet':         "            techSpecsDesc:   'Palet ve kasa asansörü sistemlerinin teknik detayları',",
    'miniload':       "            techSpecsDesc:   'Miniload sistemlerinin teknik detayları',",
    'picktolight':    "            techSpecsDesc:   'Pick-to-light sistemlerinin teknik detayları',",
    'scada':          "            techSpecsDesc:   'SCADA sistemlerinin teknik detayları',",
    'production':     "            techSpecsDesc:   'Üretim takibi sistemlerinin teknik detayları',",
    'datacollection': "            techSpecsDesc:   'Veri toplama sistemlerinin teknik detayları',",
    'software':       "            techSpecsDesc:   'Özel yazılım geliştirme teknolojileri',",
    'plc':            "            techSpecsDesc:     'Desteklediğimiz PLC markaları ve programlama dilleri',",
    'integration':    "            techSpecsDesc:     'Desteklediğimiz entegrasyon protokolleri ve sistemler',",
}
EN_ANCHORS = {
    'sorter':         "            techSpecsDesc:   'Technical details of sorter systems',",
    'pallet':         "            techSpecsDesc:   'Technical details of pallet and case elevator systems',",
    'miniload':       "            techSpecsDesc:   'Technical details of miniload systems',",
    'picktolight':    "            techSpecsDesc:   'Technical details of pick-to-light systems',",
    'scada':          "            techSpecsDesc:   'Technical details of SCADA systems',",
    'production':     "            techSpecsDesc:   'Technical details of production tracking systems',",
    'datacollection': "            techSpecsDesc:   'Technical details of data collection systems',",
    'software':       "            techSpecsDesc:   'Custom software development technologies',",
    'plc':            "            techSpecsDesc:     'Supported PLC brands and programming languages',",
    'integration':    "            techSpecsDesc:     'Supported integration protocols and systems',",
}

def make_js_keys(prefix, lang_data, indent='            '):
    """Generate JS key-value lines for insertion."""
    lines = []
    for key, val in lang_data.items():
        escaped = val.replace("'", "\\'")
        lines.append(f"{indent}{key}: '{escaped}',")
    return '\n'.join(lines)

# ── 1. Update i18n.js ──────────────────────────────────────────────────────
i18n_path = os.path.join(BASE, 'js', 'i18n.js')
with open(i18n_path, 'r', encoding='utf-8') as f:
    content = f.read()
original = content

for prefix, data in CARDS.items():
    # Check if already inserted (guard key)
    if f"'{prefix}.step1h'" in content or f'{prefix}.step1h:' in content or f"step1h: '" in content:
        # More precise check: if this page's step1h is already there
        if f"            step1h: '{data['tr']['step1h']}'," in content:
            print(f'  i18n SKIP (already done): {prefix}')
            continue

    tr_anchor = TR_ANCHORS[prefix]
    en_anchor = EN_ANCHORS[prefix]
    tr_new_keys = make_js_keys(prefix, data['tr'])
    en_new_keys = make_js_keys(prefix, data['en'])

    if tr_anchor in content:
        content = content.replace(tr_anchor, tr_anchor + '\n' + tr_new_keys, 1)
    else:
        print(f'  i18n TR anchor NOT FOUND for {prefix}')
    if en_anchor in content:
        content = content.replace(en_anchor, en_anchor + '\n' + en_new_keys, 1)
    else:
        print(f'  i18n EN anchor NOT FOUND for {prefix}')

if content != original:
    with open(i18n_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('  i18n.js updated')
else:
    print('  i18n.js NO CHANGE')

# ── 2. Patch HTML files ────────────────────────────────────────────────────
# Pages 1–8: step-card, benefit-card, application-card, spec-card
# Pages 9–10 (plc, integration): step + step-content, benefit-card,
#                                industry-card, specs-column

HTML_FILES = {
    'sorter': 'sorter.html',
    'pallet': 'pallet-elevator.html',
    'miniload': 'miniload-shuttle.html',
    'picktolight': 'pick-to-light.html',
    'scada': 'scada.html',
    'production': 'production-tracking.html',
    'datacollection': 'data-collection.html',
    'software': 'custom-software.html',
    'plc': 'plc-programming.html',
    'integration': 'system-integration.html',
}

for prefix, filename in HTML_FILES.items():
    path = os.path.join(BASE, filename)
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    original_html = html
    tr = CARDS[prefix]['tr']

    def tag_h3(h, old_text, key):
        return h.replace(
            f'<h3>{old_text}</h3>',
            f'<h3 data-i18n="{prefix}.{key}">{old_text}</h3>',
        )

    def tag_p(h, old_text, key):
        return h.replace(
            f'<p>{old_text}</p>',
            f'<p data-i18n="{prefix}.{key}">{old_text}</p>',
        )

    # step h3 + p
    for n in range(1, 5):
        html = tag_h3(html, tr[f'step{n}h'], f'step{n}h')
        if f'step{n}p' in tr:
            html = tag_p(html, tr[f'step{n}p'], f'step{n}p')

    # benefit h3 + p
    for n in range(1, 5):
        html = tag_h3(html, tr[f'ben{n}h'], f'ben{n}h')
        html = tag_p(html, tr[f'ben{n}p'], f'ben{n}p')

    # application / industry h3 + p
    app_key = 'app' if prefix not in ('plc', 'integration') else 'ind'
    for n in range(1, 5):
        html = tag_h3(html, tr[f'{app_key}{n}h'], f'{app_key}{n}h')
        html = tag_p(html, tr[f'{app_key}{n}p'], f'{app_key}{n}p')

    # spec / specs-column h3 only
    if prefix not in ('plc', 'integration'):
        for n in range(1, 5):
            html = tag_h3(html, tr[f'spec{n}h'], f'spec{n}h')
    else:
        for n in range(1, 4):
            html = tag_h3(html, tr[f'scol{n}h'], f'scol{n}h')

    if html != original_html:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'  HTML OK: {filename}')
    else:
        print(f'  HTML NO CHANGE: {filename}')

print('\nDone.')
