document.getElementById('login-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // 简单的身份验证检查
    if (username === 'user' && password === 'pass') {
        window.location.href = '大学信息.html';
    } else {
        alert('用户名或密码错误');
    }
});

// 获取并显示大学数据
if (window.location.pathname.includes('大学信息.html')) {
    fetch('universities.json')
        .then(response => response.json())
        .then(data => {
            const universityList = document.getElementById('university-list');
            data.forEach(university => {
                const div = document.createElement('div');
                div.className = 'university';
                div.innerHTML = `
                    <h3>${university.name}</h3>
                    <p>位置：${university.location}</p>
                    <p>简介：${university.description || '暂无简介'}</p>
                `;
                universityList.appendChild(div);
            });
        })
        .catch(error => console.error('加载大学数据时出错:', error));
}
