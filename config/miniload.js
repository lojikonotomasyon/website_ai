window.PAGE_SPECS = {
    layout: 'grid',
    cards: [
        {
            title: { tr: 'Raf Sistemi', en: 'Rack System' },
            items: [
                { label: { tr: 'Maksimum Yükseklik', en: 'Maximum Height' },      value: '12 m' },
                { label: { tr: 'Raf Derinliği',      en: 'Rack Depth' },          value: '30 m' },
                { label: { tr: 'Seviye Sayısı',      en: 'Number of Levels' },    value: '8-12' },
                { label: { tr: 'Kutu Boyutu',        en: 'Box Size' },            value: '600 x 400 x 300 mm' },
            ]
        },
        {
            title: { tr: 'Performans', en: 'Performance' },
            items: [
                { label: { tr: 'Depolama Kapasitesi',   en: 'Storage Capacity' },    value: { tr: '1600+ kutu/saat (koridor başına)', en: '1600+ boxes/hour (per aisle)' } },
                { label: { tr: 'Geri Alma Kapasitesi',  en: 'Retrieval Capacity' },  value: { tr: '1600+ kutu/saat (koridor başına)', en: '1600+ boxes/hour (per aisle)' } },
                { label: { tr: 'Doğruluk Oranı',        en: 'Accuracy Rate' },       value: { tr: '%99.8',          en: '99.8%' } },
                { label: { tr: 'Çalışma Süresi',        en: 'Uptime' },              value: '24/7' },
            ]
        },
        {
            title: { tr: 'Kontrol Sistemi', en: 'Control System' },
            items: [
                { label: { tr: 'PLC',      en: 'PLC' },            value: 'Beckhoff' },
                { label: { tr: 'WMS',      en: 'WMS' },            value: { tr: 'Entegre',           en: 'Integrated' } },
                { label: { tr: 'Kontrol',  en: 'Control' },        value: { tr: 'Otomatik',          en: 'Automatic' } },
                { label: { tr: 'İletişim', en: 'Communication' },  value: 'EtherCAT, Ethernet, SocketIO, Websocket, Http' },
            ]
        },
    ]
};
