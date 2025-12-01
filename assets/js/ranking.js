document.addEventListener('DOMContentLoaded', function() {
    const rankingTabs = document.querySelectorAll('.ranking-tab');
    const rankingContainers = document.querySelectorAll('.ranking-table-container');
    const rankingInfo = document.getElementById('ranking-count');
    const paginationContainer = document.getElementById('pagination');
    const paginationDetails = document.getElementById('pagination-details');
    
    let currentPage = 1;
    let currentTab = 'global';

    initRankingPage();

    function initRankingPage() {
        rankingTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabType = this.getAttribute('data-tab');
                switchRankingTab(tabType);
            });
        });

        updateRankingInfo('global');
        highlightCurrentUser();
        addEntryAnimations();
    }

    function switchRankingTab(tabType) {
        rankingTabs.forEach(tab => {
            tab.classList.remove('active');
        });

        rankingContainers.forEach(container => {
            container.classList.remove('active');
        });

        const activeTab = document.querySelector(`[data-tab="${tabType}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        const activeContainer = document.getElementById(`ranking-${tabType}`);
        if (activeContainer) {
            activeContainer.classList.add('active');
        }

        updateRankingInfo(tabType);
        localStorage.setItem('rankingActiveTab', tabType);
        highlightCurrentUser();
    }

    function updateRankingInfo(tabType) {
        const activeTab = document.querySelector(`[data-tab="${tabType}"]`);
        if (!activeTab) return;

        const total = parseInt(activeTab.getAttribute('data-total')) || 0;
        const totalPages = parseInt(activeTab.getAttribute('data-pages')) || 1;
        
        let infoText = '';
        if (tabType === 'global') {
            infoText = `${total} jogador${total !== 1 ? 'es' : ''} no total`;
        } else if (tabType === 'semanal') {
            infoText = `${total} jogador${total !== 1 ? 'es' : ''} esta semana`;
        }

        if (rankingInfo) {
            rankingInfo.textContent = infoText;
        }
        
        updatePaginationInfo(tabType, total, totalPages);
        renderPagination(totalPages);
    }

    function highlightCurrentUser() {
        const currentUserRows = document.querySelectorAll('.ranking-row.current-user');
        
        currentUserRows.forEach(row => {
            row.style.position = 'relative';
            
            setTimeout(() => {
                if (isElementOutOfView(row)) {
                    row.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }, 300);
        });
    }

    function isElementOutOfView(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;

        return (
            rect.bottom < 0 || 
            rect.right < 0 || 
            rect.left > windowWidth || 
            rect.top > windowHeight
        );
    }

    function addEntryAnimations() {
        const rows = document.querySelectorAll('.ranking-row');
        
        rows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    function loadSavedTab() {
        const savedTab = localStorage.getItem('rankingActiveTab');
        if (savedTab && (savedTab === 'global' || savedTab === 'semanal')) {
            switchRankingTab(savedTab);
        }
    }

    function enableAutoRefresh() {
        setInterval(() => {
            if (!document.hidden) {
                refreshRankingData();
            }
        }, 5 * 60 * 1000);
    }

    function refreshRankingData() {
        location.reload();
    }

    function addKeyboardNavigation() {
        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                const currentTab = document.querySelector('.ranking-tab.active');
                if (!currentTab) return;

                const allTabs = Array.from(rankingTabs);
                const currentIndex = allTabs.indexOf(currentTab);
                
                let newIndex;
                if (event.key === 'ArrowLeft') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : allTabs.length - 1;
                } else {
                    newIndex = currentIndex < allTabs.length - 1 ? currentIndex + 1 : 0;
                }

                const newTab = allTabs[newIndex];
                if (newTab) {
                    const tabType = newTab.getAttribute('data-tab');
                    switchRankingTab(tabType);
                    newTab.focus();
                }
            }
        });
    }

    function addQuickSearch() {
        
    }

    function calculateRankingStats() {
        const activeContainer = document.querySelector('.ranking-table-container.active');
        if (!activeContainer) return;

        const pointsElements = activeContainer.querySelectorAll('.points-value');
        const points = Array.from(pointsElements).map(el => 
            parseInt(el.textContent.replace(/[.,]/g, '')) || 0
        );

        if (points.length === 0) return;

        const stats = {
            total: points.reduce((sum, p) => sum + p, 0),
            average: points.reduce((sum, p) => sum + p, 0) / points.length,
            highest: Math.max(...points),
            lowest: Math.min(...points.filter(p => p > 0))
        };
        return stats;
    }

    loadSavedTab();
    addKeyboardNavigation();
    
    setTimeout(() => {
        calculateRankingStats();
    }, 500);
    function renderPagination(totalPages) {
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = '';
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'flex';
        
        const prevBtn = createPaginationButton('‹ Anterior', currentPage > 1, () => {
            if (currentPage > 1) {
                changePage(currentPage - 1);
            }
        });
        paginationContainer.appendChild(prevBtn);
        
        const pageNumbers = generatePageNumbers(currentPage, totalPages);
        pageNumbers.forEach(pageNum => {
            if (pageNum === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            } else {
                const pageBtn = createPaginationButton(
                    pageNum,
                    true,
                    () => changePage(pageNum),
                    pageNum === currentPage
                );
                paginationContainer.appendChild(pageBtn);
            }
        });
        
        const nextBtn = createPaginationButton('Próximo ›', currentPage < totalPages, () => {
            if (currentPage < totalPages) {
                changePage(currentPage + 1);
            }
        });
        paginationContainer.appendChild(nextBtn);
    }
    
    function createPaginationButton(text, enabled, onClick, active = false) {
        const button = document.createElement('button');
        button.className = 'pagination-btn';
        button.textContent = text;
        button.disabled = !enabled;
        
        if (active) {
            button.classList.add('active');
        }
        
        if (enabled) {
            button.addEventListener('click', onClick);
        }
        
        return button;
    }
    
    function generatePageNumbers(current, total) {
        const pages = [];
        const delta = 2;
        
        if (current > delta + 2) {
            pages.push(1);
            if (current > delta + 3) {
                pages.push('...');
            }
        }
        
        for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
            pages.push(i);
        }
        
        if (current < total - delta - 1) {
            if (current < total - delta - 2) {
                pages.push('...');
            }
            pages.push(total);
        }
        
        return pages;
    }

    function changePage(page) {
        if (page === currentPage) return;
        
        currentPage = page;
        
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        
        window.location.href = url.toString();
    }
    
    function updatePaginationInfo(tabType, total, totalPages) {
        if (!paginationDetails) return;
        
        const currentPageFromUrl = new URLSearchParams(window.location.search).get('page') || 1;
        currentPage = parseInt(currentPageFromUrl);
        
        const itemsPerPage = 20;
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, total);
        
        if (total > 0) {
            paginationDetails.textContent = `Mostrando ${startItem}-${endItem} de ${total} ${total === 1 ? 'jogador' : 'jogadores'}`;
        } else {
            paginationDetails.textContent = 'Nenhum resultado encontrado';
        }
    }
    
    
    function initCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        currentPage = parseInt(urlParams.get('page')) || 1;
        
        const savedTab = localStorage.getItem('rankingActiveTab') || 'global';
        currentTab = savedTab;
    }
    
    initCurrentPage();
});