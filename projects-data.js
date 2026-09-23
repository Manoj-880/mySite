/* ================================================================
   SHARED PROJECT DATA — used by index (grid) and project.html (detail)
================================================================ */
window.PROJECTS = [
    {
        slug: 'carzzi',
        image: 'assets/projects/carzzi.png',
        title: 'Carzzi',
        description: 'Vehicle-services platform with Flutter mobile apps and a React web interface. Customer communication via MSG91; shipped to both the App Store and Play Store.',
        link: 'https://www.crazzi.com',
        repo: '',
        category: 'mobile',
        year: '2026',
        timeline: 'Jul 2026 – Present',
        role: 'Design + Full-Stack',
        company: 'Speshway Solutions',
        tech: ['Flutter', 'Dart', 'React', 'Node.js', 'Express.js', 'MongoDB', 'MSG91'],
        overview: 'Carzzi is a vehicle-services platform that connects vehicle owners with service providers for maintenance, repairs, and on-demand car care. It spans native mobile apps for customers and service partners plus a web dashboard for operations, with transactional SMS and OTP handled through MSG91.',
        contributions: [
            'Designed the end-to-end product — user flows, wireframes, and the UI system in Figma — for both the customer and partner apps.',
            'Built the cross-platform mobile apps in Flutter, including booking, live status tracking, and payments.',
            'Developed the React web interface for the operations/admin side and the Node.js + Express REST API backing all clients.',
            'Integrated MSG91 for OTP login and transactional notifications, and prepared and released the apps to both the App Store and Play Store.'
        ],
        links: [
            { label: 'www.crazzi.com', url: 'https://www.crazzi.com', icon: 'fa-arrow-up-right-from-square' }
        ]
    },
    {
        slug: 'jsr',
        image: 'assets/projects/jsr.png',
        title: 'JSR',
        description: 'Windows desktop application for agricultural trading built with Electron.js — offline-first, an MDI interface, and cloud backup.',
        link: '',
        repo: '',
        category: 'desktop',
        year: '2026',
        timeline: 'Aug 2026 – Sep 2026',
        role: 'Full-Stack',
        company: 'Speshway Solutions',
        tech: ['Electron.js', 'React', 'Node.js', 'SQLite', 'Cloud Backup'],
        overview: 'JSR is a Windows desktop application for an agricultural trading business, used to manage daily purchases, sales, stock, and party ledgers. It is built to keep working with no internet connection and to sync a backup to the cloud whenever a connection is available. It ships as a desktop installer, not a website — there is no public URL, and the executable is not offered for download here.',
        contributions: [
            'Architected the app on Electron.js with a multi-document (MDI) interface so operators can work across several ledgers and entries at once.',
            'Implemented an offline-first local data layer on SQLite with a background cloud-backup and restore routine.',
            'Built the React front-end for billing, stock, and reporting, plus print-ready invoice and statement layouts.',
            'Packaged and distributed the signed Windows installer with auto-update support.'
        ],
        links: []
    },
    {
        slug: 'jagbandhu',
        image: 'assets/projects/jagbandhu.png',
        title: 'JagBandhu',
        description: 'Family platform spanning a Flutter mobile app and user/admin web apps — Family Tree, Events, Event Gallery, Circles, and User Storage.',
        link: 'https://www.jagbandhu.com',
        repo: '',
        category: 'web',
        year: '2026',
        timeline: 'Nov 2022 – Jul 2026',
        role: 'Design + Full-Stack',
        company: 'S&M Scholarly',
        tech: ['Flutter', 'React', 'Node.js', 'Express.js', 'MongoDB', 'AWS'],
        overview: 'JagBandhu is a family and community platform that helps extended families stay connected — mapping relationships as a family tree, organising events, sharing event galleries, forming private circles, and giving each member personal cloud storage. It ships as a Flutter mobile app with separate user and admin web applications.',
        contributions: [
            'Owned the design system and product UX across the mobile app and both web apps.',
            'Built the interactive Family Tree, Events, Event Gallery, Circles, and User Storage modules.',
            'Developed the Flutter mobile client and the React user + admin web front-ends against a shared Node.js/Express API.',
            'Set up media storage and delivery on AWS and handled the production deployment.'
        ],
        links: [
            { label: 'www.jagbandhu.com', url: 'https://www.jagbandhu.com', icon: 'fa-arrow-up-right-from-square' }
        ]
    },
    {
        slug: 'uktbc',
        image: 'assets/projects/uktbc.png',
        title: 'UKTBC',
        description: 'Donation platform built to UK Gift Aid regulations, with donor and member interfaces and government-compliant reporting.',
        link: 'https://uktbc.org',
        repo: '',
        category: 'web',
        year: '2025',
        timeline: 'Aug 2025 – Oct 2025',
        role: 'Full-Stack',
        company: 'S&M Scholarly',
        tech: ['Figma', 'React', 'Express.js', 'MongoDB', 'Azure'],
        overview: 'A donation and membership platform for a UK temple organisation, built to comply with HMRC Gift Aid rules. Donors can give one-off or recurring donations and declare Gift Aid; administrators manage members, events, and the compliant reports required for government submissions.',
        contributions: [
            'Designed the donor and member-facing interfaces in Figma and implemented them in React.',
            'Built the Gift Aid declaration flow and the reporting exports required for HMRC compliance.',
            'Developed the Express.js API and MongoDB data model for donations, members, and events.',
            'Deployed and configured the application on Azure.'
        ],
        links: [
            { label: 'uktbc.org', url: 'https://uktbc.org', icon: 'fa-arrow-up-right-from-square' }
        ]
    },
    {
        slug: 'nehwe',
        image: 'assets/projects/nehwe.png',
        title: 'Nehwe',
        description: 'Gamified e-learning app — end-to-end UI/UX design with custom graphics and a comprehensive design system.',
        link: '',
        repo: '',
        category: 'design',
        year: '2022',
        timeline: 'Aug 2022 – Nov 2022',
        role: 'Product Design',
        company: 'S&M Scholarly',
        tech: ['Figma', 'Design System', 'Illustration', 'Prototyping'],
        overview: 'Nehwe is a gamified e-learning app that turns lessons into levels, streaks, and rewards to keep learners engaged. The engagement was a ground-up UI/UX project: research, information architecture, custom illustration, and a full design system handed off to development. There is no public website for Nehwe.',
        contributions: [
            'Led the full UI/UX process — user research, flows, wireframes, and high-fidelity screens.',
            'Created the custom graphics, mascot, and gamification elements (badges, progress, rewards).',
            'Built a comprehensive design system — tokens, components, and states — for consistent, fast development.',
            'Delivered an interactive prototype and a developer handoff package.'
        ],
        links: [
            { label: 'Figma file', url: 'https://www.figma.com/design/Hboll34gY6z43Bm7Gp0UpF/Nehwe--Copy-?t=dksRZbh6WaWRPBfg-1', icon: 'fa-figma', brand: true }
        ]
    },
    {
        slug: 'secureusdt',
        image: 'assets/projects/secureusdt.png',
        title: 'SecureUSDT',
        description: 'Full-stack USDT investment platform with automated profits, secure wallets, and invoices.',
        link: 'https://www.secureusdt.com',
        repo: '',
        category: 'web',
        year: '2025',
        timeline: '2025',
        role: 'Full-Stack',
        company: 'Freelance',
        tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'AWS', 'TronWeb'],
        overview: 'SecureUSDT is a USDT (TRC-20) investment platform where users deposit into managed plans and receive automated returns on a schedule. It includes wallet management, transaction history, and generated invoices for every deposit and payout.',
        contributions: [
            'Built the full stack solo — React front-end, Node.js/Express API, and MongoDB.',
            'Integrated TronWeb for on-chain USDT deposits and withdrawals and wallet balance checks.',
            'Implemented the scheduled profit-calculation engine and automated payout runs.',
            'Added invoice generation and deployed the platform on AWS.'
        ],
        links: [
            { label: 'www.secureusdt.com', url: 'https://www.secureusdt.com', icon: 'fa-arrow-up-right-from-square' }
        ]
    },
    {
        slug: 'sm-scholarly',
        image: 'assets/projects/smscholarly.png',
        title: 'S&M Scholarly',
        description: 'Full-stack suite for schools: CMS, analytics, and parent portal deployed on AWS.',
        link: 'https://www.smscholarly.com/',
        repo: '',
        category: 'web',
        year: '2022',
        timeline: 'Aug 2022 – Jul 2026',
        role: 'Full-Stack',
        company: 'S&M Scholarly',
        tech: ['React', 'Node.js', 'MySQL', 'AWS'],
        overview: 'A multi-product EdTech suite for schools covering a content management system, an analytics dashboard, and a parent portal. As the in-house designer-developer I contributed across the suite over four years alongside the other client projects.',
        contributions: [
            'Designed and built front-end features across the CMS, analytics dashboard, and parent portal in React.',
            'Developed Node.js APIs and MySQL schemas supporting the product suite.',
            'Maintained a shared component library so the products stayed visually consistent.',
            'Supported releases and AWS deployment.'
        ],
        links: [
            { label: 'www.smscholarly.com', url: 'https://www.smscholarly.com/', icon: 'fa-arrow-up-right-from-square' }
        ]
    }
];
