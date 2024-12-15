document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Simple authentication check
    if (username === 'user' && password === 'pass') {
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid credentials');
    }
});

// Fetch university data and display it
if (window.location.pathname.includes('dashboard.html')) {
    fetch('universities.json')
        .then(response => response.json())
        .then(data => {
            const universityList = document.getElementById('university-list');
            data.forEach(university => {
                const div = document.createElement('div');
                div.className = 'university';
                div.innerHTML = `<h3>${university.name}</h3><p>${university.location}</p>`;
                universityList.appendChild(div);
            });
        })
        .catch(error => console.error('Error loading university data:', error));
}
