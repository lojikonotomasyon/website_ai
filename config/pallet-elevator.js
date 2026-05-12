window.PAGE_SPECS = {
    layout: 'grid',
    cards: [
        {
            title: { tr: 'Yük Kapasitesi', en: 'Load Capacity' },
            items: [
                { label: { tr: 'Maksimum Yük',      en: 'Maximum Load' },    value: '2000 kg' },
                { label: { tr: 'Platform Boyutu',   en: 'Platform Size' },   value: '1200 x 1000 mm' },
                { label: { tr: 'Pallet Boyutu',     en: 'Pallet Size' },     value: '1200 x 800 mm' },
                { label: { tr: 'Yük Yüksekliği',   en: 'Load Height' },     value: '1500 mm' },
            ]
        },
        {
            title: { tr: 'Hareket Özellikleri', en: 'Movement Features' },
            items: [
                { label: { tr: 'Maksimum Hız',         en: 'Maximum Speed' },       value: '2.5 m/s' },
                { label: { tr: 'İvme',                 en: 'Acceleration' },        value: '0.5 m/s²' },
                { label: { tr: 'Duraklama Mesafesi',   en: 'Stopping Distance' },   value: '500 mm' },
                { label: { tr: 'Kat Sayısı',           en: 'Number of Floors' },    value: { tr: '4-20 kat', en: '4-20 floors' } },
            ]
        },
        {
            title: { tr: 'Güvenlik Özellikleri', en: 'Safety Features' },
            items: [
                { label: { tr: 'Güvenlik Oranı', en: 'Safety Rate' },   value: { tr: '%99.9',        en: '99.9%' } },
                { label: { tr: 'Acil Durum',     en: 'Emergency' },     value: { tr: 'Manuel iniş', en: 'Manual descent' } },
                { label: { tr: 'Kapı Kilidi',    en: 'Door Lock' },     value: { tr: 'Otomatik',    en: 'Automatic' } },
                { label: { tr: 'Yük Kontrolü',   en: 'Load Control' },  value: { tr: 'Sensörlü',    en: 'Sensor-based' } },
            ]
        },
        {
            title: { tr: 'Kontrol Sistemi', en: 'Control System' },
            items: [
                { label: { tr: 'PLC',       en: 'PLC' },            value: 'Siemens S7-1200' },
                { label: { tr: 'HMI',       en: 'HMI' },            value: 'Touch Panel' },
                { label: { tr: 'Kontrol',   en: 'Control' },        value: { tr: 'Otomatik/Manuel', en: 'Automatic/Manual' } },
                { label: { tr: 'İletişim',  en: 'Communication' },  value: 'Profinet' },
            ]
        },
    ]
};
