window.PAGE_SPECS = {
    layout: 'columns',
    cards: [
        {
            title: { tr: 'PLC Markaları', en: 'PLC Brands' },
            items: [
                { label: { tr: 'Beckhoff',      en: 'Beckhoff' },       value: { tr: 'CX, CP serisi', en: 'CX, CP series' } },
                { label: { tr: 'Siemens',       en: 'Siemens' },        value: 'S7-1200, S7-1500, S7-300, S7-400' },
                 ]
        },
        {
            title: { tr: 'Programlama Dilleri', en: 'Programming Languages' },
            items: [
                { label: { tr: 'Linux C/C++ Realtime',           en: 'Linux C/C++ Realtime' },           value: { tr: 'Linux ile C/C++ Programlama',           en: 'C/C++  programming with Linux' } },
                { label: { tr: 'Ladder Logic (LD)',              en: 'Ladder Logic (LD)' },              value: { tr: 'Elektriksel şema benzeri programlama',  en: 'Electrical diagram-style programming' } },
                { label: { tr: 'Function Block (FBD)',           en: 'Function Block (FBD)' },           value: { tr: 'Blok tabanlı programlama',              en: 'Block-based programming' } },
                { label: { tr: 'Structured Text (ST)',           en: 'Structured Text (ST)' },           value: { tr: 'Metin tabanlı programlama',             en: 'Text-based programming' } },
                { label: { tr: 'Instruction List (IL)',          en: 'Instruction List (IL)' },          value: { tr: 'Assembly benzeri programlama',           en: 'Assembly-style programming' } },
                { label: { tr: 'Sequential Function Chart (SFC)', en: 'Sequential Function Chart (SFC)' }, value: { tr: 'Durum makinesi programlama', en: 'State machine programming' } },
            ]
        },
        {
            title: { tr: 'Özellikler', en: 'Features' },
            items: [
                { label: { tr: 'I/O Sayısı',  en: 'I/O Count' },     value: { tr: '8-8192 arası dijital/analog I/O',        en: '8-8192 digital/analog I/O' } },
                { label: { tr: 'İletişim',    en: 'Communication' }, value: 'Profinet, EtherNet/IP, Modbus TCP' },
                { label: { tr: 'Güvenlik',    en: 'Security' },      value: { tr: 'Şifreleme, erişim kontrolü',              en: 'Encryption, access control' } },
                { label: { tr: 'Backup',      en: 'Backup' },        value: { tr: 'Otomatik yedekleme ve geri yükleme',      en: 'Automatic backup and restore' } },
                { label: { tr: 'Monitoring',  en: 'Monitoring' },    value: { tr: 'Gerçek zamanlı izleme ve hata ayıklama',  en: 'Real-time monitoring and debugging' } },
            ]
        },
    ]
};
