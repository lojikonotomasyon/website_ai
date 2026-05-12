window.PAGE_SPECS = {
    layout: 'grid',
    cards: [
        {
            title: { tr: 'Sensör Teknolojileri', en: 'Sensor Technologies' },
            items: [
                { label: { tr: 'Sıcaklık', en: 'Temperature' },  value: '-40°C — +85°C' },
                { label: { tr: 'Basınç',   en: 'Pressure' },     value: '0-10 bar' },
                { label: { tr: 'Hız',      en: 'Speed' },        value: '0-5000 RPM' },
                { label: { tr: 'Mesafe',   en: 'Distance' },     value: '0-100 m' },
            ]
        },
        {
            title: { tr: 'İletişim Protokolleri', en: 'Communication Protocols' },
            items: [
                { label: { tr: 'Ethernet',  en: 'Ethernet' },   value: '100/1000 Mbps' },
                { label: { tr: 'Modbus',    en: 'Modbus' },     value: 'TCP/RTU' },
                { label: { tr: 'OPC UA',    en: 'OPC UA' },     value: 'Client/Server' },
                { label: { tr: 'Profinet',  en: 'Profinet' },   value: 'Real-time' },
            ]
        },
        {
            title: { tr: 'Performans', en: 'Performance' },
            items: [
                { label: { tr: 'Veri Hızı', en: 'Data Rate' },  value: { tr: '1000 nokta/saniye', en: '1000 points/second' } },
                { label: { tr: 'Gecikme',   en: 'Latency' },    value: '< 10ms' },
                { label: { tr: 'Doğruluk',  en: 'Accuracy' },   value: { tr: '%99.9', en: '99.9%' } },
                { label: { tr: 'Uptime',    en: 'Uptime' },     value: { tr: '%99.99', en: '99.99%' } },
            ]
        },
        {
            title: { tr: 'Raporlama', en: 'Reporting' },
            items: [
                { label: { tr: 'Gerçek Zamanlı', en: 'Real-Time' },  value: { tr: 'Anlık',    en: 'Instant' } },
                { label: { tr: 'Günlük',         en: 'Daily' },       value: { tr: 'Otomatik', en: 'Automatic' } },
                { label: { tr: 'Aylık',          en: 'Monthly' },     value: { tr: 'Detaylı',  en: 'Detailed' } },
                { label: { tr: 'Yıllık',         en: 'Annual' },      value: { tr: 'Trend',    en: 'Trend' } },
            ]
        },
    ]
};
