window.PAGE_SPECS = {
    layout: 'grid',
    cards: [
        {
            title: { tr: 'Shuttle Özellikleri', en: 'Shuttle Specifications' },
            items: [
                { label: { tr: 'Gövde Yüksekliği', en: 'Body Height' },      value: { tr: '17 cm (kasa ve palet)', en: '17 cm (tote and pallet)' } },
                { label: { tr: 'Maksimum Hız',    en: 'Maximum Speed' },    value: { tr: '5 m/sn', en: '5 m/s' } },
                { label: { tr: 'Yük Kapasitesi (Kasa)', en: 'Load Capacity (Tote)' }, value: '50 kg' },
                { label: { tr: 'Yük Kapasitesi (Palet)', en: 'Load Capacity (Pallet)' }, value: { tr: 'maks. 1000 kg', en: 'max. 1000 kg' } },
                { label: { tr: 'Akü Ömrü',        en: 'Battery Life' },     value: { tr: '13 saat kesintisiz',  en: '13 hours non-stop' } },
                { label: { tr: 'Şarj Süresi',     en: 'Charge Time' },      value: { tr: '2 saat',  en: '2 hours' } },
                { label: { tr: 'Otomatik Şarj',   en: 'Automatic Charging' }, value: { tr: 'Boş zamanlarda ve molalarda', en: 'During idle times and breaks' } },
            ]
        },
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
