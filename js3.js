document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const newsSystem = document.getElementById('newsSystem');
    const gradeFormSection = document.getElementById('gradeFormSection');
    const gradeForm = document.getElementById('gradeForm');
    const gradesList = document.getElementById('gradesList');
    const editGradeForm = document.getElementById('editGradeForm');
    const logoutButton = document.getElementById('logoutButton');

    const users = [
        { username: 'asylbek', password: '15102010', role: 'admin' },
        { username: 'asik', password: '15102010', role: 'teacher' },
        { username: 'indira', password: '12345', role: 'parent' }
    ];

    let gradesData = JSON.parse(localStorage.getItem('gradesData')) || [];
    let currentUser = null;

    // Кіру
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            alert('Кіру сәтті аяқталды!');
            loginForm.classList.add('hidden');
            newsSystem.classList.remove('hidden');
            currentUser = user;

            // Рольге байланысты мүмкіндіктер
            if (user.role === 'admin' || user.role === 'teacher') {
                gradeFormSection.classList.remove('hidden');
            } else {
                gradeFormSection.classList.add('hidden');
            }

            displayGrades();
        } else {
            alert('Қате логин немесе құпия сөз!');
        }

        loginForm.reset();
    });

    // Баға қосу (мұғалім үшін)
    gradeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const studentName = document.getElementById('studentName').value;
        const subject = document.getElementById('subject').value;
        const grade = document.getElementById('grade').value;
        const date = document.getElementById('date').value;

        const gradeEntry = { studentName, subject, grade, date };
        gradesData.push(gradeEntry);
        localStorage.setItem('gradesData', JSON.stringify(gradesData));
        displayGrades();

        gradeForm.reset();
    });

    // Бағаларды көрсету
    function displayGrades() {
        gradesList.innerHTML = '';
        gradesData.forEach((grade, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${grade.studentName}</strong> (${grade.subject}) - 
                Баға: ${grade.grade} (${grade.date})
                ${currentUser.role === 'admin' ? `
                    <button onclick="editGrade(${index})">Өзгерту</button>
                    <button onclick="deleteGrade(${index})">Жою</button>
                ` : ''}
            `;
            gradesList.appendChild(listItem);
        });
    }

    // Бағаны өзгерту
    window.editGrade = (index) => {
        if (currentUser.role !== 'admin') {
            alert('Бағаны тек әкімші өзгерте алады!');
            return;
        }

        const grade = gradesData[index];
        document.getElementById('editStudentName').value = grade.studentName;
        document.getElementById('editSubject').value = grade.subject;
        document.getElementById('editGrade').value = grade.grade;
        editGradeForm.classList.remove('hidden');

        document.getElementById('saveGradeChanges').onclick = () => {
            gradesData[index] = {
                studentName: document.getElementById('editStudentName').value,
                subject: document.getElementById('editSubject').value,
                grade: document.getElementById('editGrade').value,
                date: grade.date
            };
            localStorage.setItem('gradesData', JSON.stringify(gradesData));
            editGradeForm.classList.add('hidden');
            displayGrades();
        };
    };

    // Бағаны жою
    window.deleteGrade = (index) => {
        if (currentUser.role !== 'admin') {
            alert('Бағаны тек әкімші жоя алады!');
            return;
        }

        gradesData.splice(index, 1);
        localStorage.setItem('gradesData', JSON.stringify(gradesData));
        displayGrades();
    };

    // Шығу
    logoutButton.addEventListener('click', () => {
        newsSystem.classList.add('hidden');
        loginForm.classList.remove('hidden');
        currentUser = null;
    });
});


