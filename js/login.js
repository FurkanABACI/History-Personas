document.addEventListener("DOMContentLoaded", function () {
    const toast = document.getElementById("toast");
    const signInBtn = document.getElementById("signInBtn");
    const signupBtn = document.getElementById("signupBtn");
    const dialogPage = document.getElementById("dialogPage");
    const dialogSignUpBtn = document.getElementById("dialogSignUpBtn");
    const dialogCancel = document.getElementById("dialogCancel");
    const userEmail = document.getElementById("userEmail");
    const userPassword = document.getElementById("userPassword");
    const userFirstName = document.getElementById("userFirstName");
    const userLastName = document.getElementById("userLastName");
    const createUserEmail = document.getElementById("createUserEmail");
    const createUserPassword = document.getElementById("createUserPassword");
    const confrimUserPassword = document.getElementById("confrimUserPassword");
    const createUserProfilePhoto = document.getElementById("createUserProfilePhoto");

    // ------------------- Toast -------------------
    function showToast(message, duration = 3000, callback) {
        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
            if (callback) callback();
        }, duration);
    }

    // ------------------- LocalStorage -------------------
    function getUsers() {
        return JSON.parse(localStorage.getItem("kullanicilar") || "[]");
    }

    function saveUsers(users) {
        localStorage.setItem("kullanicilar", JSON.stringify(users));
    }

    // ------------------- Avatar Oluştur -------------------
    function generateAvatar(firstName, lastName) {
        const initials = (firstName[0] + lastName[0]).toUpperCase();
        return initials;
    }

    // ------------------- Event Listeners -------------------
    signupBtn.addEventListener("click", () => dialogPage.showModal());
    dialogCancel.addEventListener("click", () => dialogPage.close());
 
    dialogSignUpBtn.addEventListener("click", () => {
        let firstName = userFirstName.value.trim();
        let lastName = userLastName.value.trim();
        let email = createUserEmail.value.trim();
        let password = createUserPassword.value;
        let password2 = confrimUserPassword.value;
        let profilePhotoFile = createUserProfilePhoto.files[0];

        if (!firstName || !lastName || !email || !password || !password2) {
            showToast("Lütfen tüm alanları doldurun!");
            return;
        }

        const nameRegex = /^[A-Za-zçğıöşüÇĞİÖŞÜ\s'-]+$/;
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            showToast("İsim ve soyisim sadece harflerden oluşabilir!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
        if (!emailRegex.test(email)) {
            showToast("Geçersiz e-posta adresi! Örn: example@gmail.com");
            return;
        }

        if (password !== password2) {
            showToast("Şifreler eşleşmiyor!");
            return;
        }

        let users = getUsers();

        if (users.some(u => u.email === email)) {
            showToast("Bu e-posta adresi zaten kullanımda!");
            return;
        }

        try {
            let hashedPassword = bcrypt.hashSync(password, 10);

            // Profil fotoğrafı yoksa baş harflerden avatar oluştur
            let avatar = profilePhotoFile ? URL.createObjectURL(profilePhotoFile) : generateAvatar(firstName, lastName);

            users.push({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
                profilePhoto: avatar,
                language:'tr',
                theme:'Light'
            });

            saveUsers(users);

            showToast("Kayıt başarılı! Giriş yapabilirsiniz.");

            // Formu temizle ve dialog'u kapat
            userFirstName.value = "";
            userLastName.value = "";
            createUserEmail.value = "";
            createUserPassword.value = "";
            confrimUserPassword.value = "";
            createUserProfilePhoto.value = "";
            dialogPage.close();

        } catch (error) {
            showToast("Kayıt işlemi sırasında bir hata oluştu.");
            console.error("Bcrypt Hata:", error);
        }
    });

    // ------------------- Kullanıcı Giriş -------------------
    signInBtn.addEventListener("click", () => {
        let email = userEmail.value.trim();
        let password = userPassword.value;

        if (!email || !password) {
            showToast("Lütfen e-posta ve şifrenizi girin!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
        if (!emailRegex.test(email)) {
            showToast("Geçersiz e-posta adresi! Örn: example@gmail.com");
            return;
        }

        let users = getUsers();
        let user = users.find(u => u.email === email);

        if (!user) {
            showToast("Kullanıcı bulunamadı. Lütfen kayıt olun!");
            return;
        }

        if (bcrypt.compareSync(password, user.password)) {
            showToast("Hoş geldiniz, " + user.firstName + "!");
            localStorage.setItem("currentUserEmail", user.email);
            window.location.replace("../indexFolder/index.html");
        } else {
            showToast("Yanlış şifre!");
        }
    });
});
