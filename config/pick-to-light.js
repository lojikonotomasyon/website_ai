window.PAGE_SPECS = {
    layout: 'grid',
    cards: [
        {
            title: { tr: 'LED Göstergeler', en: 'LED Indicators' },
            items: [
                { label: { tr: 'Renk',       en: 'Color' },          value: { tr: 'Kırmızı, Yeşil, Mavi', en: 'Red, Green, Blue' } },
                { label: { tr: 'Parlaklık',  en: 'Brightness' },     value: '1000 cd/m²' },
                { label: { tr: 'Görüş Açısı', en: 'Viewing Angle' }, value: '120°' },
                { label: { tr: 'Ömür',       en: 'Lifespan' },       value: { tr: '50.000 saat', en: '50,000 hours' } },
            ]
        },
        {
            title: { tr: 'Gösterge Paneli', en: 'Display Panel' },
            items: [
                { label: { tr: 'Ekran',    en: 'Display' },     value: '7 segment LED' },
                { label: { tr: 'Karakter', en: 'Characters' },  value: { tr: '4 haneli', en: '4-digit' } },
                { label: { tr: 'Güç',      en: 'Power' },       value: '12V DC' },
                { label: { tr: 'Koruma',   en: 'Protection' },  value: 'IP65' },
            ]
        },
        {
            title: { tr: 'Performans', en: 'Performance' },
            items: [
                { label: { tr: 'Toplama Hızı', en: 'Picking Speed' },   value: { tr: '800+ picks/saat', en: '800+ picks/hour' } },
                { label: { tr: 'Doğruluk',     en: 'Accuracy' },        value: { tr: '%99.9',           en: '99.9%' } },
                { label: { tr: 'Yanıt Süresi', en: 'Response Time' },   value: '< 100ms' },
                { label: { tr: 'Çalışma',      en: 'Uptime' },          value: '24/7' },
            ]
        },
        {
            title: { tr: 'Kontrol Sistemi', en: 'Control System' },
            items: [
                { label: { tr: 'PLC',      en: 'PLC' },            value: 'Siemens S7-1200' },
                { label: { tr: 'WMS',      en: 'WMS' },            value: { tr: 'Entegre',  en: 'Integrated' } },
                { label: { tr: 'İletişim', en: 'Communication' },  value: 'Profinet' },
                { label: { tr: 'Kontrol',  en: 'Control' },        value: { tr: 'Otomatik', en: 'Automatic' } },
            ]
        },
    ]
};
