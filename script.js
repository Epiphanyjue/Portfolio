document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // --- Homepage Entry Gate + BGM Consent ---
    // =========================================
    const setupSiteEntryGate = () => {
        const gate = document.getElementById('site-entry-gate');
        const enterBtn = document.getElementById('entry-confirm-btn');
        const statusText = document.getElementById('entry-status');
        const progressBar = document.getElementById('entry-progress-bar');
        const progressText = document.getElementById('entry-progress-text');
        const isHomePage = Boolean(document.getElementById('landing'));

        if (!gate || !enterBtn || !isHomePage) return;

        const gateSeenKey = 'y2kee_entry_gate_confirmed';
        const hasConfirmed = sessionStorage.getItem(gateSeenKey) === 'true';

        const releaseGate = () => {
            gate.classList.add('is-leaving');
            document.body.classList.remove('entry-locked');
            sessionStorage.setItem(gateSeenKey, 'true');

            setTimeout(() => {
                gate.classList.add('is-hidden');
            }, 650);
        };

        if (hasConfirmed) {
            gate.classList.add('is-hidden');
            return;
        }

        document.body.classList.add('entry-locked');
        enterBtn.disabled = true;
        gate.style.setProperty('--entry-progress', '0%');

        let progress = 0;
        const loadingTimer = setInterval(() => {
            const increment = progress < 70 ? 8 : 4;
            progress = Math.min(progress + increment, 100);

            gate.style.setProperty('--entry-progress', `${progress}%`);
            if (progressBar) progressBar.style.width = `${progress}%`;
            if (progressText) progressText.textContent = `${progress}%`;

            if (progress >= 100) {
                clearInterval(loadingTimer);
                gate.classList.remove('is-loading');
                gate.classList.add('is-ready');
                enterBtn.disabled = false;
                if (statusText) statusText.textContent = 'SIGNAL READY';
            }
        }, 90);

        const homeAudio = new Audio('music/start.mp3');
        homeAudio.volume = 0.45;
        homeAudio.loop = true;

        enterBtn.addEventListener('click', async () => {
            enterBtn.disabled = true;
            enterBtn.classList.add('is-booting');
            if (statusText) statusText.textContent = 'BOOTING AUDIO...';

            try {
                await homeAudio.play();
                if (statusText) statusText.textContent = 'AUDIO ONLINE';
            } catch (error) {
                console.warn('主页背景音乐播放失败，仍继续进入页面:', error);
                if (statusText) statusText.textContent = 'AUDIO BLOCKED / ENTERING';
            }

            setTimeout(releaseGate, 280);
        });
    };

    setupSiteEntryGate();

    // =========================================
    // --- [NEW] Intro Animation Controller ---
    // =========================================
    // =========================================
    // --- [NEW] P4 Hardcore Landing Controller ---
    // =========================================
    const playIntroAnimation = () => {
        const landing = document.getElementById('p4-landing-sequence');
        if (!landing) return;

        // 如果想每次都看动画调试，请注释下面三行
        // if (sessionStorage.getItem('p4_intro_played')) {
        //     landing.style.display = 'none';
        //     return;
        // }

        document.body.style.overflow = 'hidden';

        // 动画序列编排 (Timeline)
        // 0ms: 初始状态 (Loading 弹跳中)
        
        // 500ms: 电影黑边出现
        setTimeout(() => {
            landing.classList.add('stage-1');
        }, 500);

        // 2000ms: 黄色切片升起，遮住 Loading
        setTimeout(() => {
            landing.classList.add('stage-2');
        }, 2200);

        // 2800ms: 切换到底层网页，切片落下 (Reveal)
        setTimeout(() => {
            landing.classList.add('stage-3');
            document.body.style.overflow = ''; // 恢复滚动
            sessionStorage.setItem('p4_intro_played', 'true');
        }, 2800);

        // 3500ms: 清理 DOM
        setTimeout(() => {
            landing.classList.add('hidden');
        }, 3500);
    };
    
    // 确保在 CSS 加载完后执行
    window.addEventListener('load', playIntroAnimation);


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
                        
                        // [新增]在这里添加这行代码控制音量
                        audio.volume = 0.5; // 同样建议设置小一点
                        
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
        
        // [修改 1] 初始化时尝试从 localStorage 读取索引，如果没有则默认为 0
        let themeIndex = parseInt(localStorage.getItem('p4_user_theme_index')) || 0;

        // [修改 2] 定义一个应用颜色的内部函数
        const applyThemeByIndex = (index) => {
            const t = themes[index];
            document.documentElement.style.setProperty('--current-date-color', t.color);
            document.documentElement.style.setProperty('--current-date-text', t.text);
            document.documentElement.style.setProperty('--current-theme-color', t.color);
            document.documentElement.style.setProperty('--current-theme-bg', t.text);
        };

        // [修改 3] 页面加载时：仅在非子页面（即首页）恢复保存的颜色
        // 这样做的目的是防止覆盖 art/blog/game 子页面强制的专属红/蓝/黄主题色
        const currentUrl = window.location.href;
        if (!currentUrl.includes('art.html') && !currentUrl.includes('blog.html') && !currentUrl.includes('game.html')) {
            // 只有当存的不是默认黄色(0)时才执行替换，避免不必要的闪烁
            if (themeIndex !== 0) {
                applyThemeByIndex(themeIndex);
            }
        }

        dateDiv.addEventListener('click', () => {
            themeIndex = (themeIndex + 1) % themes.length;
            
            // [修改 4] 每次点击时保存新的索引到 localStorage
            localStorage.setItem('p4_user_theme_index', themeIndex);
            
            applyThemeByIndex(themeIndex);
        });

        // dateDiv.addEventListener('click', () => {
        //     themeIndex = (themeIndex + 1) % themes.length;
        //     const t = themes[themeIndex];
            
        //     // 更新 CSS 变量，立刻改变全站高亮色
        //     document.documentElement.style.setProperty('--current-date-color', t.color);
        //     document.documentElement.style.setProperty('--current-date-text', t.text);
        //     document.documentElement.style.setProperty('--current-theme-color', t.color);
        //     document.documentElement.style.setProperty('--current-theme-bg', t.text);
        // });
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
        // 桌面端与移动端卡片宽度不同，按当前实际尺寸计算滚动距离。
        const getScrollAmount = () => {
            const firstCard = scrollContainer.querySelector('.work-card');
            const track = scrollContainer.querySelector('.film-track');
            if (!firstCard || !track) return scrollContainer.clientWidth;

            const trackStyle = window.getComputedStyle(track);
            const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
            return firstCard.getBoundingClientRect().width + gap;
        };

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
            scrollContainer.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
        });

        btnRight.addEventListener('click', () => {
            scrollContainer.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
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
            e.preventDefault(); 
            
            // [新增功能] 1. 播放开始音效/音乐
            // 请确保你的 music 文件夹下有 start.mp3 文件
            const startAudio = new Audio('music/start.mp3');
            // 如果你希望音量小一点，可以解开下面这行的注释并调整数值(0.0 - 1.0)
            startAudio.volume = 0.5; 
            startAudio.play().catch(error => console.log("播放失败，请检查浏览器自动播放策略或文件路径:", error));

            // [原有逻辑] 2. 添加点击后的剧烈收缩类 (需配合 CSS)
            startGameBtn.classList.add('clicked-anim');

            // [原有逻辑] 3. 模拟 "系统启动" 延迟
            document.body.style.cursor = 'wait';
            
            setTimeout(() => {
                document.body.style.cursor = 'crosshair';
                // 触发平滑滚动到 Profile 区域
                const profileSec = document.getElementById('profile');
                if(profileSec) {
                    profileSec.scrollIntoView({ behavior: 'smooth' });
                }
                // 动画结束后移除类
                setTimeout(() => startGameBtn.classList.remove('clicked-anim'), 500);
            }, 500); // 稍微延长到 500ms 让动画播完
        });
    }
    // =========================================
    // --- 7. [NEW] 侧边栏自动收缩/展开逻辑 ---
    // =========================================
    const initSidebarAutoShrink = () => {
        let shrinkTimer;
        const nav = document.querySelector('.p4-top-nav');
        const mobileOrTouch = window.matchMedia('(max-width: 900px), (hover: none), (pointer: coarse)');

        // 移动端导航始终保持为顶部栏，不运行依赖 hover 的侧栏收缩。
        if (!nav || mobileOrTouch.matches) return;

        // 核心函数：恢复展开
        const expandSidebar = () => {
            if (nav.classList.contains('sidebar-mode')) {
                nav.classList.remove('minimized');
            }
        };

        // 核心函数：尝试收缩 (设置延时)
        const scheduleShrink = () => {
            // 清除之前的计时器
            clearTimeout(shrinkTimer);
            
            // 只有在侧边栏模式下才执行收缩
            if (nav.classList.contains('sidebar-mode')) {
                // 设置 1.5 秒无操作后自动收缩
                shrinkTimer = setTimeout(() => {
                    // 如果此时鼠标没有悬停在导航栏上，才收缩
                    if (!nav.matches(':hover')) {
                        nav.classList.add('minimized');
                    }
                }, 1500);
            }
        };

        // 1. 监听滚动事件
        window.addEventListener('scroll', () => {
            // 滚动时：立即展开
            expandSidebar();
            
            // 停止滚动后：重新开始计时收缩
            scheduleShrink();
        });

        // 2. 监听鼠标交互 (移入展开，移出准备收缩)
        nav.addEventListener('mouseenter', () => {
            clearTimeout(shrinkTimer); // 只要鼠标进去，就永远不收缩
            expandSidebar();
        });

        nav.addEventListener('mouseleave', () => {
            scheduleShrink(); // 鼠标离开后，重新开始倒计时
        });
        
        // 初始化运行一次
        scheduleShrink();
    };
    
    // 启动该功能
    initSidebarAutoShrink();
// ... (保留 document.addEventListener 之前的所有代码) ...

// =========================================
    // --- 8. [NEW] Hover 延迟预览功能 (Game/Blog) ---
    // =========================================
    const setupLinkHoverPreview = () => {
        // 触控设备直接点击卡片进入内容，不创建悬浮预览层。
        if (window.matchMedia('(hover: none), (pointer: coarse), (max-width: 900px)').matches) return;

        // 1. 获取所有列表项
        const listItems = document.querySelectorAll('.content-list .list-item');
        if (listItems.length === 0) return;

        // 2. 创建或获取全局悬浮窗
        let popup = document.querySelector('.p4-hover-popup');
        if (!popup) {
            popup = document.createElement('div');
            popup.className = 'p4-hover-popup';
            // 确保其不受页面 overflow 影响 (如果放在 body 下)
            document.body.appendChild(popup);
        }

        let hoverTimer = null;

        // 3. 辅助函数：计算并设置位置
        const positionPopup = (item) => {
            const rect = item.getBoundingClientRect();
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            
            // 默认显示在右侧：Item 的右边缘 + 30px 间距
            let left = rect.right + 30;
            // 顶部对齐：Item 的顶部 + 滚动距离
            let top = rect.top + scrollTop;

            // 简单防溢出处理：如果右侧空间不足 (屏幕宽度 - left < 350)，则尝试放左边?
            // 但考虑到 P4 风格通常较为激进，我们这里只需确保不完全出界即可
            // 这里为了保持设计统一，优先放右侧。
            
            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
        };

        // 4. 绑定事件
        listItems.forEach(item => {
            const dataDiv = item.querySelector('.preview-data');
            if (!dataDiv) return;

            // --- 鼠标移入 ---
            item.addEventListener('mouseenter', () => {
                // 清除可能存在的旧计时器 (防止快速切换时闪烁)
                if (hoverTimer) clearTimeout(hoverTimer);

                // 开启新计时器：1000ms 后执行显示逻辑
                hoverTimer = setTimeout(() => {
                    // a. 填充内容
                    popup.innerHTML = dataDiv.innerHTML;
                    
                    // b. 设置位置
                    positionPopup(item);
                    
                    // c. 显示 (添加 active 类触发 CSS 动画)
                    popup.classList.add('active');
                    
                }, 1000); // 1秒延迟
            });

            // --- 鼠标移出 ---
            item.addEventListener('mouseleave', () => {
                // a. 立即清除计时器 (如果还没到1秒，不仅不会显示，还会取消显示计划)
                if (hoverTimer) clearTimeout(hoverTimer);
                
                // b. 隐藏悬浮窗
                popup.classList.remove('active');
            });

            // --- 点击 (作为补充) ---
            // 如果用户点击了，通常意味着跳转，此时也应该关闭弹窗
            item.addEventListener('click', () => {
                if (hoverTimer) clearTimeout(hoverTimer);
                popup.classList.remove('active');
            });
        });
    };
    
    // 执行功能
    setupLinkHoverPreview();

}); // End of DOMContentLoaded
