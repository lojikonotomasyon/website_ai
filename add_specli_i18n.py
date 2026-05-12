#!/usr/bin/env python3
"""Adds data-i18n-html to spec card <li> items and inserts keys into i18n.js."""
import os, json
BASE = os.path.dirname(os.path.abspath(__file__))

# Data: page_prefix -> {spec1: [(tr_html, en_html), ...], spec2: [...], ...}
# For plc/integration: scol1, scol2, scol3
DATA = {
'sorter': {
  'spec1': [
    ('<strong>Kapasite:</strong> 3000+ parça/saat','<strong>Capacity:</strong> 3000+ pcs/hour'),
    ('<strong>Doğruluk:</strong> %99.9+',           '<strong>Accuracy:</strong> 99.9%+'),
    ('<strong>Hız:</strong> 2.5 m/s',               '<strong>Speed:</strong> 2.5 m/s'),
    ('<strong>Yük Kapasitesi:</strong> 50 kg',       '<strong>Load Capacity:</strong> 50 kg'),
  ],
  'spec2': [
    ('<strong>Kapasite:</strong> 2500+ parça/saat','<strong>Capacity:</strong> 2500+ pcs/hour'),
    ('<strong>Doğruluk:</strong> %99.8+',           '<strong>Accuracy:</strong> 99.8%+'),
    ('<strong>Hız:</strong> 2.0 m/s',               '<strong>Speed:</strong> 2.0 m/s'),
    ('<strong>Yük Kapasitesi:</strong> 30 kg',       '<strong>Load Capacity:</strong> 30 kg'),
  ],
  'spec3': [
    ('<strong>Kapasite:</strong> 2000+ parça/saat','<strong>Capacity:</strong> 2000+ pcs/hour'),
    ('<strong>Doğruluk:</strong> %99.7+',           '<strong>Accuracy:</strong> 99.7%+'),
    ('<strong>Hız:</strong> 1.8 m/s',               '<strong>Speed:</strong> 1.8 m/s'),
    ('<strong>Yük Kapasitesi:</strong> 20 kg',       '<strong>Load Capacity:</strong> 20 kg'),
  ],
  'spec4': [
    ('<strong>Kapasite:</strong> 1500+ parça/saat','<strong>Capacity:</strong> 1500+ pcs/hour'),
    ('<strong>Doğruluk:</strong> %99.5+',           '<strong>Accuracy:</strong> 99.5%+'),
    ('<strong>Hız:</strong> 1.5 m/s',               '<strong>Speed:</strong> 1.5 m/s'),
    ('<strong>Yük Kapasitesi:</strong> 15 kg',       '<strong>Load Capacity:</strong> 15 kg'),
  ],
},
'pallet': {
  'spec1': [
    ('<strong>Maksimum Yük:</strong> 2000 kg',         '<strong>Maximum Load:</strong> 2000 kg'),
    ('<strong>Platform Boyutu:</strong> 1200 x 1000 mm','<strong>Platform Size:</strong> 1200 x 1000 mm'),
    ('<strong>Pallet Boyutu:</strong> 1200 x 800 mm',  '<strong>Pallet Size:</strong> 1200 x 800 mm'),
    ('<strong>Yük Yüksekliği:</strong> 1500 mm',       '<strong>Load Height:</strong> 1500 mm'),
  ],
  'spec2': [
    ('<strong>Maksimum Hız:</strong> 2.5 m/s',     '<strong>Maximum Speed:</strong> 2.5 m/s'),
    ('<strong>İvme:</strong> 0.5 m/s²',            '<strong>Acceleration:</strong> 0.5 m/s²'),
    ('<strong>Duraklama Mesafesi:</strong> 500 mm', '<strong>Stopping Distance:</strong> 500 mm'),
    ('<strong>Kat Sayısı:</strong> 4-20 kat',       '<strong>Floor Count:</strong> 4-20 floors'),
  ],
  'spec3': [
    ('<strong>Güvenlik Oranı:</strong> %99.9', '<strong>Safety Rate:</strong> 99.9%'),
    ('<strong>Acil Durum:</strong> Manuel iniş','<strong>Emergency:</strong> Manual descent'),
    ('<strong>Kapı Kilidi:</strong> Otomatik',  '<strong>Door Lock:</strong> Automatic'),
    ('<strong>Yük Kontrolü:</strong> Sensörlü', '<strong>Load Control:</strong> Sensor-based'),
  ],
  'spec4': [
    ('<strong>PLC:</strong> Siemens S7-1200',    '<strong>PLC:</strong> Siemens S7-1200'),
    ('<strong>HMI:</strong> Touch Panel',         '<strong>HMI:</strong> Touch Panel'),
    ('<strong>Kontrol:</strong> Otomatik/Manuel', '<strong>Control:</strong> Automatic/Manual'),
    ('<strong>İletişim:</strong> Profinet',        '<strong>Communication:</strong> Profinet'),
  ],
},
'miniload': {
  'spec1': [
    ('<strong>Maksimum Hız:</strong> 2.0 m/s',  '<strong>Maximum Speed:</strong> 2.0 m/s'),
    ('<strong>Yük Kapasitesi:</strong> 50 kg',   '<strong>Load Capacity:</strong> 50 kg'),
    ('<strong>Pil Ömrü:</strong> 8 saat',        '<strong>Battery Life:</strong> 8 hours'),
    ('<strong>Şarj Süresi:</strong> 2 saat',     '<strong>Charging Time:</strong> 2 hours'),
  ],
  'spec2': [
    ('<strong>Maksimum Yükseklik:</strong> 12 m', '<strong>Maximum Height:</strong> 12 m'),
    ('<strong>Raf Derinliği:</strong> 30 m',       '<strong>Rack Depth:</strong> 30 m'),
    ('<strong>Seviye Sayısı:</strong> 8-12',       '<strong>Level Count:</strong> 8-12'),
    ('<strong>Kutu Boyutu:</strong> 600x400x300 mm','<strong>Box Size:</strong> 600x400x300 mm'),
  ],
  'spec3': [
    ('<strong>Depolama Kapasitesi:</strong> 500+ kutu/saat','<strong>Storage Capacity:</strong> 500+ boxes/hour'),
    ('<strong>Geri Alma Kapasitesi:</strong> 500+ kutu/saat','<strong>Retrieval Capacity:</strong> 500+ boxes/hour'),
    ('<strong>Doğruluk Oranı:</strong> %99.8',               '<strong>Accuracy Rate:</strong> 99.8%'),
    ('<strong>Çalışma Süresi:</strong> 24/7',                '<strong>Operating Time:</strong> 24/7'),
  ],
  'spec4': [
    ('<strong>PLC:</strong> Siemens S7-1500', '<strong>PLC:</strong> Siemens S7-1500'),
    ('<strong>WMS:</strong> Entegre',         '<strong>WMS:</strong> Integrated'),
    ('<strong>Kontrol:</strong> Otomatik',    '<strong>Control:</strong> Automatic'),
    ('<strong>İletişim:</strong> Profinet',   '<strong>Communication:</strong> Profinet'),
  ],
},
'picktolight': {
  'spec1': [
    ('<strong>Renk:</strong> Kırmızı, Yeşil, Mavi','<strong>Color:</strong> Red, Green, Blue'),
    ('<strong>Parlaklık:</strong> 1000 cd/m²',      '<strong>Brightness:</strong> 1000 cd/m²'),
    ('<strong>Görüş Açısı:</strong> 120°',           '<strong>Viewing Angle:</strong> 120°'),
    ('<strong>Ömür:</strong> 50,000 saat',           '<strong>Lifespan:</strong> 50,000 hours'),
  ],
  'spec2': [
    ('<strong>Ekran:</strong> 7 segment LED', '<strong>Display:</strong> 7-segment LED'),
    ('<strong>Karakter:</strong> 4 haneli',   '<strong>Characters:</strong> 4-digit'),
    ('<strong>Güç:</strong> 12V DC',          '<strong>Power:</strong> 12V DC'),
    ('<strong>Koruma:</strong> IP65',          '<strong>Protection:</strong> IP65'),
  ],
  'spec3': [
    ('<strong>Toplama Hızı:</strong> 800+ picks/saat','<strong>Picking Speed:</strong> 800+ picks/hour'),
    ('<strong>Doğruluk:</strong> %99.9',              '<strong>Accuracy:</strong> 99.9%'),
    ('<strong>Yanıt Süresi:</strong> < 100ms',        '<strong>Response Time:</strong> < 100ms'),
    ('<strong>Çalışma Süresi:</strong> 24/7',         '<strong>Operating Time:</strong> 24/7'),
  ],
  'spec4': [
    ('<strong>PLC:</strong> Siemens S7-1200', '<strong>PLC:</strong> Siemens S7-1200'),
    ('<strong>WMS:</strong> Entegre',         '<strong>WMS:</strong> Integrated'),
    ('<strong>İletişim:</strong> Profinet',   '<strong>Communication:</strong> Profinet'),
    ('<strong>Kontrol:</strong> Otomatik',    '<strong>Control:</strong> Automatic'),
  ],
},
'scada': {
  'spec1': [
    ('<strong>Platform:</strong> Windows Server',    '<strong>Platform:</strong> Windows Server'),
    ('<strong>Veritabanı:</strong> SQL Server',      '<strong>Database:</strong> SQL Server'),
    ('<strong>İletişim:</strong> OPC UA, Modbus',    '<strong>Communication:</strong> OPC UA, Modbus'),
    ('<strong>Güvenlik:</strong> SSL/TLS',           '<strong>Security:</strong> SSL/TLS'),
  ],
  'spec2': [
    ('<strong>CPU:</strong> Intel i7 veya üzeri', '<strong>CPU:</strong> Intel i7 or higher'),
    ('<strong>RAM:</strong> 16GB minimum',         '<strong>RAM:</strong> 16GB minimum'),
    ('<strong>Depolama:</strong> SSD 500GB',       '<strong>Storage:</strong> SSD 500GB'),
    ('<strong>Ağ:</strong> Gigabit Ethernet',      '<strong>Network:</strong> Gigabit Ethernet'),
  ],
  'spec3': [
    ('<strong>Veri Noktası:</strong> 1000+',           '<strong>Data Points:</strong> 1000+'),
    ('<strong>Güncelleme Hızı:</strong> 100ms',        '<strong>Update Rate:</strong> 100ms'),
    ('<strong>Kullanıcı:</strong> 50+ eş zamanlı',     '<strong>Users:</strong> 50+ concurrent'),
    ('<strong>Uptime:</strong> %99.9',                 '<strong>Uptime:</strong> 99.9%'),
  ],
  'spec4': [
    ('<strong>PLC:</strong> Siemens, Allen Bradley', '<strong>PLC:</strong> Siemens, Allen Bradley'),
    ('<strong>HMI:</strong> Touch Panel',            '<strong>HMI:</strong> Touch Panel'),
    ('<strong>MES:</strong> Entegre',               '<strong>MES:</strong> Integrated'),
    ('<strong>ERP:</strong> API Bağlantısı',        '<strong>ERP:</strong> API Connection'),
  ],
},
'production': {
  'spec1': [
    ('<strong>Sıcaklık:</strong> -40°C ile +85°C', '<strong>Temperature:</strong> -40°C to +85°C'),
    ('<strong>Basınç:</strong> 0-10 bar',           '<strong>Pressure:</strong> 0-10 bar'),
    ('<strong>Hız:</strong> 0-5000 RPM',            '<strong>Speed:</strong> 0-5000 RPM'),
    ('<strong>Mesafe:</strong> 0-100m',             '<strong>Distance:</strong> 0-100m'),
  ],
  'spec2': [
    ('<strong>Ethernet:</strong> 100/1000 Mbps', '<strong>Ethernet:</strong> 100/1000 Mbps'),
    ('<strong>Modbus:</strong> TCP/RTU',          '<strong>Modbus:</strong> TCP/RTU'),
    ('<strong>OPC UA:</strong> Client/Server',    '<strong>OPC UA:</strong> Client/Server'),
    ('<strong>Profinet:</strong> Real-time',      '<strong>Profinet:</strong> Real-time'),
  ],
  'spec3': [
    ('<strong>Veri Hızı:</strong> 1000 nokta/saniye','<strong>Data Rate:</strong> 1000 points/second'),
    ('<strong>Gecikme:</strong> < 10ms',             '<strong>Latency:</strong> < 10ms'),
    ('<strong>Doğruluk:</strong> %99.9',             '<strong>Accuracy:</strong> 99.9%'),
    ('<strong>Uptime:</strong> %99.99',              '<strong>Uptime:</strong> 99.99%'),
  ],
  'spec4': [
    ('<strong>Gerçek Zamanlı:</strong> Anlık',  '<strong>Real-Time:</strong> Instant'),
    ('<strong>Günlük:</strong> Otomatik',       '<strong>Daily:</strong> Automatic'),
    ('<strong>Aylık:</strong> Detaylı',         '<strong>Monthly:</strong> Detailed'),
    ('<strong>Yıllık:</strong> Trend',          '<strong>Yearly:</strong> Trend'),
  ],
},
'datacollection': {
  'spec1': [
    ('<strong>Sıcaklık:</strong> -40°C ile +125°C','<strong>Temperature:</strong> -40°C to +125°C'),
    ('<strong>Basınç:</strong> 0-100 bar',          '<strong>Pressure:</strong> 0-100 bar'),
    ('<strong>Nem:</strong> 0-100% RH',             '<strong>Humidity:</strong> 0-100% RH'),
    ('<strong>Seviye:</strong> 0-20m',              '<strong>Level:</strong> 0-20m'),
  ],
  'spec2': [
    ('<strong>Modbus:</strong> RTU/TCP',        '<strong>Modbus:</strong> RTU/TCP'),
    ('<strong>OPC UA:</strong> Client/Server',  '<strong>OPC UA:</strong> Client/Server'),
    ('<strong>Ethernet:</strong> TCP/IP',       '<strong>Ethernet:</strong> TCP/IP'),
    ('<strong>Wireless:</strong> WiFi/LoRa',    '<strong>Wireless:</strong> WiFi/LoRa'),
  ],
  'spec3': [
    ('<strong>Örnekleme:</strong> 1000 Hz',         '<strong>Sampling:</strong> 1000 Hz'),
    ('<strong>Gecikme:</strong> < 10ms',            '<strong>Latency:</strong> < 10ms'),
    ('<strong>Doğruluk:</strong> %99.9',            '<strong>Accuracy:</strong> 99.9%'),
    ('<strong>Kapasite:</strong> 10,000 sensör',    '<strong>Capacity:</strong> 10,000 sensors'),
  ],
  'spec4': [
    ('<strong>Şifreleme:</strong> AES-256',          '<strong>Encryption:</strong> AES-256'),
    ('<strong>Kimlik Doğrulama:</strong> SSL/TLS',   '<strong>Authentication:</strong> SSL/TLS'),
    ('<strong>Yetkilendirme:</strong> Role-based',   '<strong>Authorization:</strong> Role-based'),
    ('<strong>Yedekleme:</strong> Otomatik',         '<strong>Backup:</strong> Automatic'),
  ],
},
'software': {
  'spec1': [
    ('<strong>Python:</strong> Django, Flask',   '<strong>Python:</strong> Django, Flask'),
    ('<strong>Node.js:</strong> Express, NestJS','<strong>Node.js:</strong> Express, NestJS'),
    ('<strong>Java:</strong> Spring Boot',        '<strong>Java:</strong> Spring Boot'),
    ('<strong>C#:</strong> .NET Core',            '<strong>C#:</strong> .NET Core'),
  ],
  'spec2': [
    ('<strong>React:</strong> Modern UI',              '<strong>React:</strong> Modern UI'),
    ('<strong>Vue.js:</strong> Progressive Framework', '<strong>Vue.js:</strong> Progressive Framework'),
    ('<strong>Angular:</strong> Enterprise',           '<strong>Angular:</strong> Enterprise'),
    ('<strong>TypeScript:</strong> Type Safety',       '<strong>TypeScript:</strong> Type Safety'),
  ],
  'spec3': [
    ('<strong>PostgreSQL:</strong> Relational', '<strong>PostgreSQL:</strong> Relational'),
    ('<strong>MongoDB:</strong> NoSQL',         '<strong>MongoDB:</strong> NoSQL'),
    ('<strong>Redis:</strong> Cache',           '<strong>Redis:</strong> Cache'),
    ('<strong>InfluxDB:</strong> Time Series',  '<strong>InfluxDB:</strong> Time Series'),
  ],
  'spec4': [
    ('<strong>Docker:</strong> Containerization',  '<strong>Docker:</strong> Containerization'),
    ('<strong>Kubernetes:</strong> Orchestration', '<strong>Kubernetes:</strong> Orchestration'),
    ('<strong>CI/CD:</strong> Automation',         '<strong>CI/CD:</strong> Automation'),
    ('<strong>Monitoring:</strong> Prometheus',    '<strong>Monitoring:</strong> Prometheus'),
  ],
},
'plc': {
  'scol1': [
    ('<strong>Siemens:</strong> S7-1200, S7-1500, S7-300, S7-400',         '<strong>Siemens:</strong> S7-1200, S7-1500, S7-300, S7-400'),
    ('<strong>Allen Bradley:</strong> ControlLogix, CompactLogix, MicroLogix','<strong>Allen Bradley:</strong> ControlLogix, CompactLogix, MicroLogix'),
    ('<strong>Schneider:</strong> Modicon M340, M580, Premium',             '<strong>Schneider:</strong> Modicon M340, M580, Premium'),
    ('<strong>Mitsubishi:</strong> FX, Q, L serisi',                        '<strong>Mitsubishi:</strong> FX, Q, L series'),
    ('<strong>Omron:</strong> CJ, CP, CS serisi',                           '<strong>Omron:</strong> CJ, CP, CS series'),
    ('<strong>Beckhoff:</strong> CX, CP serisi',                            '<strong>Beckhoff:</strong> CX, CP series'),
  ],
  'scol2': [
    ('<strong>Ladder Logic (LD):</strong> Elektriksel şema benzeri programlama','<strong>Ladder Logic (LD):</strong> Electrical diagram-style programming'),
    ('<strong>Function Block (FBD):</strong> Blok tabanlı programlama',         '<strong>Function Block (FBD):</strong> Block-based programming'),
    ('<strong>Structured Text (ST):</strong> Metin tabanlı programlama',        '<strong>Structured Text (ST):</strong> Text-based programming'),
    ('<strong>Instruction List (IL):</strong> Assembly benzeri programlama',    '<strong>Instruction List (IL):</strong> Assembly-style programming'),
    ('<strong>Sequential Function Chart (SFC):</strong> Durum makinesi programlama','<strong>Sequential Function Chart (SFC):</strong> State machine programming'),
  ],
  'scol3': [
    ('<strong>I/O Sayısı:</strong> 8-8192 arası dijital/analog I/O',           '<strong>I/O Count:</strong> 8-8192 digital/analog I/O'),
    ('<strong>İletişim:</strong> Profinet, EtherNet/IP, Modbus TCP',            '<strong>Communication:</strong> Profinet, EtherNet/IP, Modbus TCP'),
    ('<strong>Güvenlik:</strong> Şifreleme, erişim kontrolü',                   '<strong>Security:</strong> Encryption, access control'),
    ('<strong>Backup:</strong> Otomatik yedekleme ve geri yükleme',             '<strong>Backup:</strong> Automatic backup and restore'),
    ('<strong>Monitoring:</strong> Gerçek zamanlı izleme ve hata ayıklama',     '<strong>Monitoring:</strong> Real-time monitoring and debugging'),
  ],
},
'integration': {
  'scol1': [
    ('<strong>OPC UA:</strong> Endüstriyel veri iletişimi standardı',       '<strong>OPC UA:</strong> Industrial data communication standard'),
    ('<strong>Modbus TCP:</strong> PLC ve SCADA sistemleri arası iletişim', '<strong>Modbus TCP:</strong> Communication between PLC and SCADA systems'),
    ('<strong>Profinet:</strong> Siemens endüstriyel Ethernet protokolü',   '<strong>Profinet:</strong> Siemens industrial Ethernet protocol'),
    ('<strong>EtherNet/IP:</strong> Allen Bradley iletişim protokolü',      '<strong>EtherNet/IP:</strong> Allen Bradley communication protocol'),
    ('<strong>REST API:</strong> Web tabanlı sistem entegrasyonu',          '<strong>REST API:</strong> Web-based system integration'),
    ('<strong>SOAP:</strong> Kurumsal sistem entegrasyonu',                 '<strong>SOAP:</strong> Enterprise system integration'),
  ],
  'scol2': [
    ('<strong>ERP Sistemleri:</strong> SAP, Oracle, Microsoft Dynamics', '<strong>ERP Systems:</strong> SAP, Oracle, Microsoft Dynamics'),
    ('<strong>MES Sistemleri:</strong> Siemens Opcenter, Wonderware',    '<strong>MES Systems:</strong> Siemens Opcenter, Wonderware'),
    ('<strong>SCADA Yazılımları:</strong> WinCC, FactoryTalk View, Ignition','<strong>SCADA Software:</strong> WinCC, FactoryTalk View, Ignition'),
    ('<strong>PLC Markaları:</strong> Siemens, Allen Bradley, Schneider', '<strong>PLC Brands:</strong> Siemens, Allen Bradley, Schneider'),
    ('<strong>Veritabanları:</strong> SQL Server, Oracle, PostgreSQL',    '<strong>Databases:</strong> SQL Server, Oracle, PostgreSQL'),
    ('<strong>Cloud Platformları:</strong> Azure, AWS, Google Cloud',     '<strong>Cloud Platforms:</strong> Azure, AWS, Google Cloud'),
  ],
  'scol3': [
    ('<strong>Gerçek Zamanlı:</strong> Milisaniye seviyesinde veri aktarımı','<strong>Real-Time:</strong> Millisecond-level data transfer'),
    ('<strong>Güvenlik:</strong> SSL/TLS şifreleme, kimlik doğrulama',       '<strong>Security:</strong> SSL/TLS encryption, authentication'),
    ('<strong>Ölçeklenebilirlik:</strong> Modüler yapı, kolay genişletme',   '<strong>Scalability:</strong> Modular structure, easy expansion'),
    ('<strong>İzleme:</strong> Sistem durumu ve performans takibi',          '<strong>Monitoring:</strong> System status and performance tracking'),
    ('<strong>Yedekleme:</strong> Otomatik veri yedekleme ve kurtarma',      '<strong>Backup:</strong> Automatic data backup and recovery'),
    ('<strong>Raporlama:</strong> Detaylı entegrasyon raporları',            '<strong>Reporting:</strong> Detailed integration reports'),
  ],
},
}

HTML_FILES = {
  'sorter': 'sorter.html', 'pallet': 'pallet-elevator.html',
  'miniload': 'miniload-shuttle.html', 'picktolight': 'pick-to-light.html',
  'scada': 'scada.html', 'production': 'production-tracking.html',
  'datacollection': 'data-collection.html', 'software': 'custom-software.html',
  'plc': 'plc-programming.html', 'integration': 'system-integration.html',
}

# ── 1. Build i18n.js insertion blocks ─────────────────────────────────────
i18n_path = os.path.join(BASE, 'js', 'i18n.js')
with open(i18n_path) as f:
    js = f.read()
original_js = js

# Anchor: find the last existing card key in each page's TR and EN blocks
# We'll insert after spec4h / scol3h lines
TR_ANCHORS = {
  'sorter':       "            spec4h: 'Shoe Sorter',",
  'pallet':       "            spec3h: 'Güvenlik Özellikleri', spec4h: 'Kontrol Sistemi',",
  'miniload':     "            spec3h: 'Performans',          spec4h: 'Kontrol Sistemi',",
  'picktolight':  "            spec1h: 'LED Göstergeler', spec2h: 'Gösterge Paneli',\n            spec3h: 'Performans',      spec4h: 'Kontrol Sistemi',",
  'scada':        "            spec1h: 'Yazılım Özellikleri',    spec2h: 'Donanım Gereksinimleri',\n            spec3h: 'Performans',             spec4h: 'Entegrasyon',",
  'production':   "            spec1h: 'Sensör Teknolojileri',   spec2h: 'İletişim Protokolleri',\n            spec3h: 'Performans',             spec4h: 'Raporlama',",
  'datacollection':"            spec1h: 'Sensör Desteği',         spec2h: 'İletişim Protokolleri',\n            spec3h: 'Performans',             spec4h: 'Güvenlik',",
  'software':     "            spec1h: 'Backend Teknolojileri',  spec2h: 'Frontend Teknolojileri',\n            spec3h: 'Veritabanı',             spec4h: 'DevOps',",
  'plc':          "            scol1h: 'PLC Markaları', scol2h: 'Programlama Dilleri', scol3h: 'Özellikler',",
  'integration':  "            scol1h: 'İletişim Protokolleri', scol2h: 'Entegre Sistemler', scol3h: 'Özellikler',",
}
EN_ANCHORS = {
  'sorter':       "            spec1h: 'Cross Belt Sorter', spec2h: 'Tilt Tray Sorter',\n            spec3h: 'Narrow Belt Sorter','spec4h': 'Shoe Sorter',",
  'pallet':       "            spec1h: 'Load Capacity',     spec2h: 'Movement Features',\n            spec3h: 'Safety Features',   spec4h: 'Control System',",
  'miniload':     "            spec1h: 'Shuttle Specifications', spec2h: 'Rack System',\n            spec3h: 'Performance',            spec4h: 'Control System',",
  'picktolight':  "            spec1h: 'LED Indicators', spec2h: 'Display Panel',\n            spec3h: 'Performance',    spec4h: 'Control System',",
  'scada':        "            spec1h: 'Software Features',    spec2h: 'Hardware Requirements',\n            spec3h: 'Performance',          spec4h: 'Integration',",
  'production':   "            spec1h: 'Sensor Technologies',   spec2h: 'Communication Protocols',\n            spec3h: 'Performance',           spec4h: 'Reporting',",
  'datacollection':"            spec1h: 'Sensor Support',          spec2h: 'Communication Protocols',\n            spec3h: 'Performance',             spec4h: 'Security',",
  'software':     "            spec1h: 'Backend Technologies',  spec2h: 'Frontend Technologies',\n            spec3h: 'Database',              spec4h: 'DevOps',",
  'plc':          "            scol1h: 'PLC Brands', scol2h: 'Programming Languages', scol3h: 'Features',",
  'integration':  "            scol1h: 'Communication Protocols', scol2h: 'Integrated Systems', scol3h: 'Features',",
}

def escape(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")

for prefix, page_data in DATA.items():
    # Build JS key lines for TR and EN
    tr_lines = []; en_lines = []
    for card_key, items in page_data.items():
        for i, (tr_html, en_html) in enumerate(items, 1):
            key = f'{card_key}li{i}'
            tr_lines.append(f"            {key}: '{escape(tr_html)}',")
            en_lines.append(f"            {key}: '{escape(en_html)}',")

    tr_anchor = TR_ANCHORS.get(prefix, '')
    en_anchor = EN_ANCHORS.get(prefix, '')
    tr_block = '\n'.join(tr_lines)
    en_block = '\n'.join(en_lines)

    # Check if already inserted
    first_key = list(page_data.keys())[0] + 'li1'
    if f'            {first_key}:' in js:
        print(f'  SKIP (done): {prefix}')
        continue

    if tr_anchor and tr_anchor in js:
        js = js.replace(tr_anchor, tr_anchor + '\n' + tr_block, 1)
    else:
        # Find anchor by searching for last spec key
        print(f'  TR anchor not found for {prefix}, searching...')
    if en_anchor and en_anchor in js:
        js = js.replace(en_anchor, en_anchor + '\n' + en_block, 1)
    else:
        print(f'  EN anchor not found for {prefix}, searching...')

if js != original_js:
    with open(i18n_path, 'w') as f:
        f.write(js)
    print('i18n.js updated')

# ── 2. Patch HTML files ────────────────────────────────────────────────────
for prefix, filename in HTML_FILES.items():
    path = os.path.join(BASE, filename)
    with open(path) as f:
        html = f.read()
    orig = html
    for card_key, items in DATA[prefix].items():
        for i, (tr_html, en_html) in enumerate(items, 1):
            key = f'{prefix}.{card_key}li{i}'
            old = f'<li>{tr_html}</li>'
            new = f'<li data-i18n-html="{key}">{tr_html}</li>'
            html = html.replace(old, new)
    if html != orig:
        with open(path, 'w') as f:
            f.write(html)
        print(f'  OK: {filename}')
    else:
        print(f'  NO CHANGE: {filename}')

print('\nDone.')
