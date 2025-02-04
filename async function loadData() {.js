async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        console.log('從data.json載入的數據:', data);
    } catch (error) {
        console.error('載入數據時發生錯誤:', error);
    }
}

loadData();

function renderCards(data) {
    const container = document.querySelector('.grid');
    if (!container) return;

    container.innerHTML = data.map(tool => `
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="flex items-center mb-4">
                <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
                <h3 class="ml-2 text-xl font-semibold">${tool.name}</h3>
            </div>
            <div class="mb-3">
                ${tool.tags.map(tag => `
                    <span class="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm mr-2">${tag}</span>
                `).join('')}
            </div>
            <p class="text-gray-600">${tool.desc}</p>
            <a href="${tool.url}" target="_blank" class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                查看詳情
            </a>
        </div>
    `).join('');
}

// 修改loadData函數以使用renderCards
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        renderCards(data);
    } catch (error) {
        console.error('載入數據時發生錯誤:', error);
    }
}
// 添加載入狀態和錯誤提示的HTML元素
const loadingEl = document.createElement('div');
loadingEl.className = 'text-center py-4';
loadingEl.innerHTML = `
    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    <p class="mt-2 text-gray-600">正在載入資料...</p>
`;

const errorEl = document.createElement('div'); 
errorEl.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4';
errorEl.style.display = 'none';

const container = document.querySelector('.grid');
if(container) {
    container.parentNode.insertBefore(loadingEl, container);
    container.parentNode.insertBefore(errorEl, container);
}

// 修改loadData函數以處理載入狀態
async function loadData() {
    try {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        if(container) container.style.display = 'none';
        
        const response = await fetch('data.json');
        const data = await response.json();
        
        renderCards(data);
        
        loadingEl.style.display = 'none';
        if(container) container.style.display = 'grid';
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `載入數據時發生錯誤: ${error.message}`;
        console.error('載入數據時發生錯誤:', error);
    }
}
// 定義分頁相關變量
let currentPage = 1;
const itemsPerPage = 10;
let allData = [];

// 修改loadData函數以支持分頁
async function loadData() {
    try {
        loadingEl.style.display = 'block';
        errorEl.style.display = 'none';
        if(container) container.style.display = 'none';
        
        const response = await fetch('data.json');
        allData = await response.json();
        
        // 計算分頁數據
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = allData.slice(start, end);
        
        renderCards(pageData);
        
        // 添加分頁控制按鈕
        renderPagination();
        
        loadingEl.style.display = 'none';
        if(container) container.style.display = 'grid';
    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
        errorEl.textContent = `載入數據時發生錯誤: ${error.message}`;
        console.error('載入數據時發生錯誤:', error);
    }
}

// 渲染分頁控制按鈕
function renderPagination() {
    const totalPages = Math.ceil(allData.length / itemsPerPage);
    
    const paginationEl = document.createElement('div');
    paginationEl.className = 'flex justify-center space-x-2 mt-4';
    
    // 上一頁按鈕
    const prevBtn = document.createElement('button');
    prevBtn.className = `px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`;
    prevBtn.textContent = '上一頁';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if(currentPage > 1) {
            currentPage--;
            loadData();
        }
    };
    
    // 下一頁按鈕
    const nextBtn = document.createElement('button');
    nextBtn.className = `px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`;
    nextBtn.textContent = '下一頁';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if(currentPage < totalPages) {
            currentPage++;
            loadData();
        }
    };
    
    // 頁碼信息
    const pageInfo = document.createElement('span');
    pageInfo.className = 'px-4 py-2';
    pageInfo.textContent = `第 ${currentPage} 頁，共 ${totalPages} 頁`;
    
    paginationEl.appendChild(prevBtn);
    paginationEl.appendChild(pageInfo);
    paginationEl.appendChild(nextBtn);
    
    // 移除舊的分頁控制元素
    const oldPagination = document.querySelector('.pagination');
    if(oldPagination) {
        oldPagination.remove();
    }
    
    // 添加新的分頁控制元素
    paginationEl.classList.add('pagination');
    container.parentNode.insertBefore(paginationEl, container.nextSibling);
}
// 修改loadData函數以支持搜索
async function loadData(searchTerm = '') {
    try {
        // 顯示載入狀態
        container.innerHTML = '';
        container.appendChild(loadingEl);

        // 構建帶有搜索參數的URL
        const url = searchTerm 
            ? `data.json?search=${encodeURIComponent(searchTerm)}`
            : 'data.json';
            
        const response = await fetch(url);
        const data = await response.json();
        
        // 在客戶端進行過濾
        const filteredData = searchTerm
            ? data.filter(item => {
                const searchLower = searchTerm.toLowerCase();
                return item.name.toLowerCase().includes(searchLower) ||
                       item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                       item.desc.toLowerCase().includes(searchLower);
            })
            : data;

        // 更新全局數據
        allData = filteredData;
        
        // 計算當前頁的數據
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = filteredData.slice(start, end);

        // 移除載入狀態
        loadingEl.remove();
        
        // 渲染卡片和分頁
        renderCards(pageData);
        renderPagination();

    } catch (error) {
        console.error('載入數據時發生錯誤:', error);
        // 顯示錯誤信息
        errorEl.textContent = '載入數據失敗，請稍後重試';
        errorEl.style.display = 'block';
        container.appendChild(errorEl);
    }
}

// 添加搜索事件監聽器
document.querySelector('input[placeholder="搜索AI工具..."]').addEventListener('input', (e) => {
    currentPage = 1; // 重置頁碼
    loadData(e.target.value);
});
// 用 Cursor 提示：/创建分类过滤功能，根据按钮选择显示对应标签的工具
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const tag = this.dataset.tag
    // 切换按钮样式
    document.querySelectorAll('.filter-btn').forEach(b => 
      b.classList.toggle('bg-blue-100', b === this)
    )
    // 过滤逻辑
    document.querySelectorAll('.grid > div').forEach(card => {
      const cardTags = [...card.querySelectorAll('span')].map(span => span.textContent)
      const show = tag === 'all' || cardTags.includes(tag)
      card.style.display = show ? 'block' : 'none'
    })
  })
})