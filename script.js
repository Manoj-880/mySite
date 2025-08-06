document.addEventListener("DOMContentLoaded", () => {
    //handle toggle menu
    const menuBtn = document.querySelector('.menu-icon');
    const sideNavBar = document.querySelector('.side-menu');
    const navItems = document.querySelectorAll('.side-menu .nav-item');


    sideNavBar.style.display = 'none';

    menuBtn.addEventListener('click', () => {
        console.log(sideNavBar.style.display);

        if (sideNavBar.style.display == "" || sideNavBar.style.display == 'none') {
            sideNavBar.style.display = 'flex';
        } else {
            sideNavBar.style.display = 'none';
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // prevent default anchor behavior

            const targetId = item.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                sideNavBar.style.display = 'none'; // hide the menu
                targetElement.scrollIntoView({ behavior: 'smooth' }); // scroll to section
            }
        });
    });

    //download file
    document.getElementById('dnlbtn').addEventListener('click', () => {
        const link = document.createElement('a');
        link.href = 'assets/cv.pdf';
        link.download = 'cv.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });


    // showing projects
    const projectsData = [
        {
            image: 'assets/projects/jagbandhu.png',
            title: 'Jagbandhu',
            link: 'https://www.jagbandhu.com'
        },
        {
            image: 'assets/projects/fcf.png',
            title: 'Feed Care Fear',
            link: 'https://www.figma.com/design/vjrkcZ21wBSYECQb4EpP85/web-application--Copy-?node-id=0-1&m=dev'
        },
        {
            image: 'assets/projects/mason.png',
            title: 'Mason Upvc',
            link: 'https://www.figma.com/design/vjrkcZ21wBSYECQb4EpP85/web-application--Copy-?node-id=0-1&m=dev'
        },
        {
            image: 'assets/projects/nehwe.png',
            title: 'Nehwe',
            link: 'https://www.figma.com/design/vjrkcZ21wBSYECQb4EpP85/web-application--Copy-?node-id=0-1&m=dev'
        },
        {
            image: 'assets/projects/srbs.png',
            title: "SRBS",
            link: "https://www.figma.com/design/m6bOYNNibty89G1BHuSDqT/Mobile-App?node-id=0-1&t=JIlfm5Rw1G3KMUtK-1",
        },
        {
            image: "assets/projects/smscholarly.png",
            title: "S&M Scholarly",
            link: "https://www.smscholarly.com//",
        }
    ];

    const container = document.querySelector('.projects-content');

    const gridWrapper = document.createElement('div');
    gridWrapper.className = 'row g-4 justify-content-center mt-4';

    projectsData.forEach((project) => {
        const card = document.createElement('div');
        card.className = 'project-card col-sm-5';


        card.innerHTML = `
        <a href="${project.link}" target="_blank" style="text-decoration: none;">
                <img src="${project.image}" alt="${project.title}" class="col-12 col-sm-12">
                <div class="project-data row">
                    <div class="project-details col-10 col-sm-10">
                        <p class="project-action small-text">
                            Click here to visit
                        </p>
                        <p class="project-title medium-test">
                            ${project.title}
                        </p>
                    </div>
                    <i class="fa-solid fa-square-arrow-up-right col-2 col-sm-2 project-icon"></i>
                </div>
            </a>
        `;

        gridWrapper.appendChild(card);
    });

    container.appendChild(gridWrapper);

    // experience content
    const experiencesData = [
        {
            img: "assets/career/sm.png",
            title: "S&M Scholarly Solutions",
            timeline: "Aug 2022 - Present",
            description: `In my role at S&M Scholarly Solutions, I design user interfaces for mobile and web applications, ensuring they are both intuitive and visually engaging. I develop responsive websites and web applications to provide a seamless user experience across various devices. Additionally, I build backend servers to manage data transactions between mobile apps and web applications and create cross-platform mobile applications using Flutter. I am also responsible for designing graphical elements and assets needed for these projects. Currently, I am expanding my expertise by learning SEO optimization to enhance web visibility and search engine performance.`
        },
        {
            img: "assets/career/fsa.png",
            title: "FullStack Academy",
            timeline: "Jan 2022 - May 2022",
            description: `During my time at FullStack Academy, I underwent intensive training in modern web development and full-stack engineering. I gained hands-on experience with HTML, CSS, JavaScript, React, Node.js, and MongoDB, focusing on building scalable and responsive web applications. The program emphasized real-world project development, where I collaborated with peers to design, develop, and deploy full-stack applications. I also deepened my understanding of UI/UX design principles, version control with Git, and agile development workflows. This immersive experience laid the foundation for my transition into professional full-stack development.`
        },
        {
            img: "assets/career/vvit.png",
            title: "Vasireddy Venkatadri Institute of Technology",
            timeline: "Jun 2017 - Jul 2021",
            description: `I pursued my Bachelor's degree in Mechanical Engineering at VVIT, where I developed a strong analytical and problem-solving mindset. Alongside my core engineering curriculum, I actively participated in various technical events and workshops that introduced me to programming and software development. My growing interest in technology led me to explore web and mobile app development independently during my academic years. This period was instrumental in shaping my decision to shift toward a career in software engineering, equipping me with both a technical foundation and the adaptability to transition into full-stack development.`
        }
    ];

    const experienceContainer = document.querySelector('.experience-content');

    experiencesData.forEach((exp) => {
        const card = document.createElement('div');
        card.className = 'experience-card col-sm-12';

        card.innerHTML = `
        <div class="exp-card-heading row col-sm-12">
            <div class="card-brief row col-8 col-sm-8">
            <img src="${exp.img}" alt="${exp.title}" class="col-2 col-sm-2">
            <p class="medium-test col-10 col-sm-10">${exp.title}</p>
            </div>
            <p class="paragraph col-3 col-sm-3">${exp.timeline}</p>
        </div>
        <p class="paragraph">${exp.description}</p>
        `;

        experienceContainer.appendChild(card);
    });
});
