window.PAGE_SPECS = {
    layout: 'grid',
    cards: [
        {
            title: { tr: 'Yazılım Özellikleri', en: 'Software Features' },
            items: [
                { label: { tr: 'Platform',   en: 'Platform' },       value: 'Windows Server' },
                { label: { tr: 'Veritabanı', en: 'Database' },       value: 'SQL Server' },
                { label: { tr: 'İletişim',   en: 'Communication' },  value: 'OPC UA, Modbus' },
                { label: { tr: 'Güvenlik',   en: 'Security' },       value: 'SSL/TLS' },
            ]
        },
        {
            title: { tr: 'Donanım Gereksinimleri', en: 'Hardware Requirements' },
            items: [
                { label: { tr: 'CPU',      en: 'CPU' },      value: { tr: 'Intel i7 veya üzeri', en: 'Intel i7 or higher' } },
                { label: { tr: 'RAM',      en: 'RAM' },      value: { tr: '16GB minimum',        en: '16GB minimum' } },
                { label: { tr: 'Depolama', en: 'Storage' },  value: 'SSD 500GB' },
                { label: { tr: 'Ağ',       en: 'Network' },  value: 'Gigabit Ethernet' },
            ]
        },
        {
            title: { tr: 'Performans', en: 'Performance' },
            items: [
                { label: { tr: 'Veri Noktası',     en: 'Data Points' },    value: '1000+' },
                { label: { tr: 'Güncelleme Hızı',  en: 'Update Rate' },    value: '100ms' },
                { label: { tr: 'Kullanıcı',        en: 'Users' },          value: { tr: '50+ eş zamanlı', en: '50+ concurrent' } },
                { label: { tr: 'Uptime',           en: 'Uptime' },         value: { tr: '%99.9',           en: '99.9%' } },
            ]
        },
        {
            title: { tr: 'Entegrasyon', en: 'Integration' },
            items: [
                { label: { tr: 'PLC',  en: 'PLC' },  value: 'Siemens, Allen Bradley' },
                { label: { tr: 'HMI',  en: 'HMI' },  value: 'Touch Panel' },
                { label: { tr: 'MES',  en: 'MES' },  value: { tr: 'Entegre',       en: 'Integrated' } },
                { label: { tr: 'ERP',  en: 'ERP' },  value: { tr: 'API Bağlantısı', en: 'API Connection' } },
            ]
        },
    ]
};
