window.PAGE_SPECS = {
    layout: 'grid',
    cards: [
        {
            title: { tr: 'Sensör Desteği', en: 'Sensor Support' },
            items: [
                { label: { tr: 'Sıcaklık', en: 'Temperature' },  value: '-40°C — +125°C' },
                { label: { tr: 'Basınç',   en: 'Pressure' },     value: '0-100 bar' },
                { label: { tr: 'Nem',      en: 'Humidity' },     value: '0-100% RH' },
                { label: { tr: 'Seviye',   en: 'Level' },        value: '0-20 m' },
            ]
        },
        {
            title: { tr: 'İletişim Protokolleri', en: 'Communication Protocols' },
            items: [
                { label: { tr: 'Modbus',    en: 'Modbus' },    value: 'RTU/TCP' },
                { label: { tr: 'OPC UA',    en: 'OPC UA' },    value: 'Client/Server' },
                { label: { tr: 'Ethernet',  en: 'Ethernet' },  value: 'TCP/IP' },
                { label: { tr: 'Wireless',  en: 'Wireless' },  value: 'WiFi / LoRa' },
            ]
        },
        {
            title: { tr: 'Performans', en: 'Performance' },
            items: [
                { label: { tr: 'Örnekleme', en: 'Sampling' },    value: '1000 Hz' },
                { label: { tr: 'Gecikme',   en: 'Latency' },     value: '< 10ms' },
                { label: { tr: 'Doğruluk',  en: 'Accuracy' },    value: { tr: '%99.9',      en: '99.9%' } },
                { label: { tr: 'Kapasite',  en: 'Capacity' },    value: { tr: '10.000 sensör', en: '10,000 sensors' } },
            ]
        },
        {
            title: { tr: 'Güvenlik', en: 'Security' },
            items: [
                { label: { tr: 'Şifreleme',         en: 'Encryption' },      value: 'AES-256' },
                { label: { tr: 'Kimlik Doğrulama',  en: 'Authentication' },  value: 'SSL/TLS' },
                { label: { tr: 'Yetkilendirme',     en: 'Authorization' },   value: 'Role-based' },
                { label: { tr: 'Yedekleme',         en: 'Backup' },          value: { tr: 'Otomatik', en: 'Automatic' } },
            ]
        },
    ]
};
