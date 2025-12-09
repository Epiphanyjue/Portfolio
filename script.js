document.addEventListener('DOMContentLoaded', () => {
    
// =========================================
    // --- 0. 全局变量与工具 ---
    // =========================================
    const navBar = document.querySelector('.p4-top-nav');

    // =========================================
    // --- [新增] 子页面自动主题色适配 ---
    // =========================================
    const initPageTheme = () => {
        const url = window.location.href;
        const root = document.documentElement;
        
        // 颜色定义 (对应 style.css 中的变量)
        const colors = {
            red:    { main: '#E60033', text: '#FFFFFF' }, // Art
            blue:   { main: '#0044CC', text: '#FFFFFF' }, // Blog
            yellow: { main: '#FFE600', text: '#111111' }  // Game & Default
        };

        // 辅助函数：应用颜色
        const applyTheme = (theme) => {
            root.style.setProperty('--current-date-color', theme.main);
            root.style.setProperty('--current-date-text', theme.text);
            root.style.setProperty('--current-theme-color', theme.main);
            root.style.setProperty('--current-theme-bg', theme.text);
        };

        // 根据 URL 判断当前页面
        if (url.includes('art.html')) {
            applyTheme(colors.red);
        } else if (url.includes('blog.html')) {
            applyTheme(colors.blue);
        } else if (url.includes('game.html')) {
            applyTheme(colors.yellow);
        }
        // 如果是 index.html 或其他情况，保持 CSS 中定义的默认值 (Yellow)
    };
    
    // 立即执行主题初始化
    initPageTheme();

// =========================================
    // --- [NEW] 子页面点击标题播放音乐逻辑 ---
    // =========================================
    const setupMusicPlayer = () => {
        const titleBtn = document.querySelector('.section-big-title');
        // [新增] 获取条形码元素
        const barcodeDeco = document.querySelector('.barcode-deco');
        const url = window.location.href;
        
        // 1. 定义每个页面对应的音乐文件路径
        // 请确保您的项目根目录下有 'music' 文件夹，并包含以下文件
        let musicFile = '';
        if (url.includes('game.html')) {
            musicFile = 'music/game.mp3'; 
        } else if (url.includes('blog.html')) {
            musicFile = 'music/blog.mp3';
        } else if (url.includes('art.html')) {
            musicFile = 'music/art.mp3';
        } else {
            return; // 如果不是这三个子页面，不执行后续逻辑
        }
        //    return; 
        // }

        if (titleBtn && musicFile) {
            const audio = new Audio(musicFile);
            audio.loop = true;
            let isPlaying = false;

            titleBtn.addEventListener('click', () => {
                if (isPlaying) {
                    // 暂停逻辑
                    audio.pause();
                    titleBtn.classList.remove('playing'); 
                    // [新增] 移除条形码的波形动画类
                    if (barcodeDeco) barcodeDeco.classList.remove('playing');
                } else {
                    // 播放逻辑
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            titleBtn.classList.add('playing');
                            // [新增] 添加条形码的波形动画类
                            if (barcodeDeco) barcodeDeco.classList.add('playing');
                        }).catch(error => {
                            console.error("播放失败:", error);
                            // alert("播放失败..."); // 可以注释掉 alert 避免打扰
                        });
                    }
                }
                isPlaying = !isPlaying;
            });
        }
    };
    setupMusicPlayer();
    // =========================================
    // --- [NEW] Art 页面图片灯箱交互逻辑 ---
    // =========================================
    const setupArtLightbox = () => {
        // 仅在存在灯箱元素的页面运行
        const lightbox = document.getElementById('art-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');
        const backdrop = document.querySelector('.lightbox-backdrop');
        const artCards = document.querySelectorAll('.art-card');

        if (!lightbox || !lightboxImg) return;

        // 1. 打开灯箱
        artCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                if (img) {
                    // 优先读取 data-gif 属性，如果没有则使用 src
                    const targetSrc = img.getAttribute('data-gif') || img.src;
                    
                    lightboxImg.src = targetSrc;
                    lightbox.classList.add('active');
                }
            });
        });

        // 2. 关闭灯箱的函数
        const closeLightbox = () => {
            lightbox.classList.remove('active');
            // 延迟清空 src，防止动画过程中图片消失
            setTimeout(() => {
                lightboxImg.src = ''; 
            }, 300);
        };

        // 3. 绑定关闭事件
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (backdrop) backdrop.addEventListener('click', closeLightbox);
        
        // 按 ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    };
    setupArtLightbox();
    // =========================================
    // --- [NEW] 首页滚动位置记忆与恢复 (瞬间跳转版) ---
    // =========================================
    // 如果当前页面包含 #landing 元素（说明是首页），则检查是否有保存的滚动位置
    if (document.getElementById('landing')) {
        const savedScroll = sessionStorage.getItem('p4_home_scroll');
        if (savedScroll) {
            // 1. 临时禁用浏览器的自动滚动恢复
            if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
            }
            
            // 2. 强制设为"auto"(瞬间)，覆盖 CSS 中的 smooth
            document.documentElement.style.scrollBehavior = 'auto';
            
            // 3. 立即跳转
            window.scrollTo(0, parseInt(savedScroll));
            
            // 4. 跳转完成后，稍后恢复 CSS 定义的平滑滚动效果
            setTimeout(() => {
                document.documentElement.style.scrollBehavior = '';
            }, 50);
        }
    }

    // 获取转场遮罩元素（如果 HTML 中没有，JS 自动创建以防报错）
    let transitionOverlay = document.querySelector('.page-transition-overlay');
    if (!transitionOverlay) {
        transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition-overlay';
        // 创建 5 个条纹用于动画
        for(let i=0; i<5; i++) {
            const strip = document.createElement('div');
            strip.className = 'transition-strip';
            strip.style.animationDelay = `${i * 0.05}s`;
            transitionOverlay.appendChild(strip);
        }
        const text = document.createElement('div');
        text.className = 'transition-text';
        text.innerText = "LOADING...";
        transitionOverlay.appendChild(text);
        document.body.appendChild(transitionOverlay);
    }

    // =========================================
    // --- 1. 进场与离场动画控制 ---
    // =========================================

    // A. 页面加载完成：执行“滑出”动画
    setTimeout(() => {
        transitionOverlay.classList.add('active-out');
        setTimeout(() => {
            transitionOverlay.classList.remove('active-out');
            const strips = transitionOverlay.querySelectorAll('.transition-strip');
            strips.forEach(s => s.style.transform = 'scaleX(0)');
        }, 400); 
    }, 10);

    // B. 链接点击拦截：执行“滑入”动画
    const setupPageTransitions = () => {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const target = link.getAttribute('target');

                if (!href || href.startsWith('#') || href.startsWith('javascript') || href.startsWith('mailto') || target === '_blank') {
                    return; 
                }

                e.preventDefault();
                
                // 离开前记录首页位置
                if (document.getElementById('landing')) {
                    sessionStorage.setItem('p4_home_scroll', window.scrollY);
                }

                transitionOverlay.classList.remove('active-out');
                transitionOverlay.classList.add('active-in');

                setTimeout(() => {
                    window.location.href = href;
                }, 300); 
            });
        });
    };
    setupPageTransitions();


    // =========================================
    // --- 2. 原有的辅助功能 (日期、滚动、ScrollSpy) ---
    // =========================================
    
    // [RESTORED] 日期组件与颜色切换功能
    const createDateWidget = () => {
        if(!navBar || document.querySelector('.date-widget')) return;
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date-widget');
        
        const updateDate = () => {
            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const weeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            dateDiv.innerHTML = `${month}/${day} [${weeks[now.getDay()]}]`;
        };
        updateDate();
        navBar.appendChild(dateDiv);

        // --- 恢复的点击切换颜色逻辑 ---
        // P4 主题色定义
        const themes = [
            { color: '#FFE600', text: '#111111' }, // 黄 (默认)
            { color: '#E60033', text: '#FFFFFF' }, // 红
            { color: '#0044CC', text: '#FFFFFF' }, // 蓝
            { color: '#009944', text: '#FFFFFF' }  // 绿
        ];
        let themeIndex = 0;

        dateDiv.addEventListener('click', () => {
            themeIndex = (themeIndex + 1) % themes.length;
            const t = themes[themeIndex];
            
            // 更新 CSS 变量，立刻改变全站高亮色
            document.documentElement.style.setProperty('--current-date-color', t.color);
            document.documentElement.style.setProperty('--current-date-text', t.text);
            document.documentElement.style.setProperty('--current-theme-color', t.color);
            document.documentElement.style.setProperty('--current-theme-bg', t.text);
        });
    };
    createDateWidget();

    // 滚动监听与 ScrollSpy
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]'); 
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // 侧边栏模式切换
        if (scrollY > window.innerHeight * 0.5) {
            navBar.classList.add('sidebar-mode');
        } else {
            navBar.classList.remove('sidebar-mode');
        }

        // ScrollSpy
        let currentId = '';
        sections.forEach(sec => {
            if (scrollY >= (sec.offsetTop - 200)) currentId = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentId) link.classList.add('active');
        });
    });

    // 锚点平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if(id === '#') return;
            const target = document.querySelector(id);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // p4-reveal 滚动显现动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.p4-reveal').forEach(el => observer.observe(el));

    // =========================================
    // --- 3. [NEW] 底部 Contact 按钮自动激活逻辑 ---
    // =========================================
    const contactTriggerBtn = document.getElementById('contact-trigger');
    const footerBanner = document.querySelector('.p4-footer-banner'); // 检测新的 footer banner

    // 修改：改为检测新的 footer banner 区域
    if (contactTriggerBtn && footerBanner) {
        const bottomObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // 当新的底部横幅出现超过 30% 时，Contact 按钮自动激活
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    contactTriggerBtn.classList.add('auto-active');
                } else {
                    contactTriggerBtn.classList.remove('auto-active');
                }
            });
        }, {
            threshold: [0.3]
        });
        bottomObserver.observe(footerBanner);
    }

// =========================================
    // --- 4. [RESTORED] Contact 弹窗交互逻辑 ---
    // =========================================
    const contactOverlay = document.getElementById('contact-overlay');
    const closeContactBtn = document.getElementById('close-contact');
    const navContactBtn = document.getElementById('contact-trigger'); // 顶部/侧边栏按钮
    const footerContactBtn = document.getElementById('footer-contact-trigger'); // [NEW] 底部大文字按钮
    
    // 打开弹窗的通用函数
    const openContact = (e) => {
        if(e) e.preventDefault();
        if(contactOverlay) contactOverlay.classList.add('active');
    };

    // 关闭弹窗的通用函数
    const closeContact = () => {
        if(contactOverlay) contactOverlay.classList.remove('active');
    };
    
    if (contactOverlay) {
        // 1. 顶部/侧边栏按钮点击
        if (navContactBtn) {
            navContactBtn.addEventListener('click', openContact);
        }

        // 2. [NEW] 底部 Footer 文字点击
        if (footerContactBtn) {
            footerContactBtn.addEventListener('click', openContact);
        }

        // 3. 点击关闭按钮
        if (closeContactBtn) {
            closeContactBtn.addEventListener('click', closeContact);
        }

        // 4. 点击遮罩背景关闭
        contactOverlay.addEventListener('click', (e) => {
            if (e.target === contactOverlay || e.target.classList.contains('overlay-bg')) {
                closeContact();
            }
        });
    }

    // =========================================
    // --- 5. [UPDATED] Highlights 左右精确切换逻辑 (带禁用状态) ---
    // =========================================
    const scrollContainer = document.querySelector('.film-strip-container');
    const btnLeft = document.getElementById('scrollLeft');
    const btnRight = document.getElementById('scrollRight');
    
    if (scrollContainer && btnLeft && btnRight) {
        // 精确计算每次滚动的距离：卡片宽度(380) + 间距(40) = 420px
        const scrollAmount = 420; 

        // --- [新增] 更新按钮状态的函数 ---
        const updateButtonState = () => {
            // 获取当前滚动位置
            const scrollLeft = scrollContainer.scrollLeft;
            // 获取可滚动的最大宽度 = 内容总宽度 - 容器可视宽度
            // 使用 Math.round 防止高分屏下的像素小数导致计算不准
            const maxScrollLeft = Math.round(scrollContainer.scrollWidth - scrollContainer.clientWidth);
            
            // 1. 判断左侧按钮 (如果已经在最左边，禁用)
            if (scrollLeft <= 1) { // 留 1px 容差
                btnLeft.classList.add('disabled');
            } else {
                btnLeft.classList.remove('disabled');
            }

            // 2. 判断右侧按钮 (如果已经在最右边，禁用)
            if (scrollLeft >= maxScrollLeft - 1) { // 留 1px 容差
                btnRight.classList.add('disabled');
            } else {
                btnRight.classList.remove('disabled');
            }
        };

        // 点击事件
        btnLeft.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        btnRight.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        // --- [关键] 监听滚动事件 ---
        // 无论是点击按钮滚动，还是用户用触摸板/手指滑动，都会触发此事件更新按钮颜色
        scrollContainer.addEventListener('scroll', updateButtonState);

        // --- [关键] 监听窗口大小改变 ---
        // 窗口大小改变会影响 container.clientWidth，从而影响是否到底
        window.addEventListener('resize', updateButtonState);

        // 初始化时立即执行一次，确保加载时左侧按钮就是灰色的
        updateButtonState();
    }

    // =========================================
    // --- 6. [NEW] START GAME 按钮特殊逻辑 ---
    // =========================================
    const startGameBtn = document.getElementById('start-game-btn');
    if (startGameBtn) {
        startGameBtn.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止默认锚点跳转
            
            // 可以在这里添加音效，例如: new Audio('sound_enter.mp3').play();
            
            // 模拟短暂的 "系统启动" 延迟
            document.body.style.cursor = 'wait';
            
            setTimeout(() => {
                document.body.style.cursor = 'crosshair';
                // 触发平滑滚动到 Profile 区域
                const profileSec = document.getElementById('profile');
                if(profileSec) {
                    profileSec.scrollIntoView({ behavior: 'smooth' });
                }
            }, 300); // 300ms 延迟，配合 CSS 动画
        });
    }
});