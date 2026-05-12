window.PAGE_SPECS = {
    layout: 'columns',
    cards: [
        {
            title: { tr: 'İletişim Protokolleri', en: 'Communication Protocols' },
            items: [
                { label: { tr: 'OPC UA',       en: 'OPC UA' },       value: { tr: 'Endüstriyel veri iletişimi standardı',  en: 'Industrial data communication standard' } },
                { label: { tr: 'Modbus TCP',   en: 'Modbus TCP' },   value: { tr: 'PLC ve SCADA arası iletişim',           en: 'PLC and SCADA communication' } },
                { label: { tr: 'Profinet',     en: 'Profinet' },     value: { tr: 'Siemens endüstriyel Ethernet',          en: 'Siemens industrial Ethernet' } },
                { label: { tr: 'EtherNet/IP',  en: 'EtherNet/IP' },  value: { tr: 'Allen Bradley iletişim protokolü',      en: 'Allen Bradley communication protocol' } },
                { label: { tr: 'REST API',     en: 'REST API' },     value: { tr: 'Web tabanlı sistem entegrasyonu',       en: 'Web-based system integration' } },
                { label: { tr: 'SOAP',         en: 'SOAP' },         value: { tr: 'Kurumsal sistem entegrasyonu',          en: 'Enterprise system integration' } },
            ]
        },
        {
            title: { tr: 'Entegre Sistemler', en: 'Integrated Systems' },
            items: [
                { label: { tr: 'ERP',         en: 'ERP' },          value: 'SAP, Oracle, Microsoft Dynamics' },
                { label: { tr: 'MES',         en: 'MES' },          value: 'Siemens Opcenter, Wonderware' },
                { label: { tr: 'SCADA',       en: 'SCADA' },        value: 'WinCC, FactoryTalk View, Ignition' },
                { label: { tr: 'PLC',         en: 'PLC' },          value: 'Siemens, Allen Bradley, Schneider' },
                { label: { tr: 'Veritabanı',  en: 'Database' },     value: 'SQL Server, Oracle, PostgreSQL' },
                { label: { tr: 'Cloud',       en: 'Cloud' },        value: 'Azure, AWS, Google Cloud' },
            ]
        },
        {
            title: { tr: 'Özellikler', en: 'Features' },
            items: [
                { label: { tr: 'Gerçek Zamanlı',   en: 'Real-Time' },       value: { tr: 'Milisaniye seviyesinde veri aktarımı',  en: 'Millisecond-level data transfer' } },
                { label: { tr: 'Güvenlik',         en: 'Security' },        value: { tr: 'SSL/TLS şifreleme, kimlik doğrulama',   en: 'SSL/TLS encryption, authentication' } },
                { label: { tr: 'Ölçeklenebilirlik', en: 'Scalability' },    value: { tr: 'Modüler yapı, kolay genişletme',         en: 'Modular design, easy expansion' } },
                { label: { tr: 'İzleme',           en: 'Monitoring' },      value: { tr: 'Sistem durumu ve performans takibi',     en: 'System status and performance tracking' } },
                { label: { tr: 'Yedekleme',        en: 'Backup' },          value: { tr: 'Otomatik veri yedekleme ve kurtarma',    en: 'Automatic data backup and recovery' } },
                { label: { tr: 'Raporlama',        en: 'Reporting' },       value: { tr: 'Detaylı entegrasyon raporları',          en: 'Detailed integration reports' } },
            ]
        },
    ]
};
