document.addEventListener("DOMContentLoaded", () => {
    initLoginPage();
    updateNavbarUI();
});

function initLoginPage() {
    const signInBtn = document.getElementById("signInBtn");
    const signupBtn = document.getElementById("signupBtn");
    const dialogPage = document.getElementById("dialogPage");
    const dialogSignUpBtn = document.getElementById("dialogSignUpBtn");
    const dialogCancel = document.getElementById("dialogCancel");

    signupBtn.addEventListener("click", () => dialogPage.showModal());
    dialogCancel.addEventListener("click", () => dialogPage.close());

    signInBtn.addEventListener("click", loginUser);
    dialogSignUpBtn.addEventListener("click", registerUser);
}

function registerUser() {
    let firstName = document.getElementById("userFirstName").value.trim();
    let lastName = document.getElementById("userLastName").value.trim();
    let email = document.getElementById("createUserEmail").value.trim();
    let password = document.getElementById("createUserPassword").value;
    let password2 = document.getElementById("confirmUserPassword").value;
    let profilePhotoInput = document.getElementById("createUserProfilePhoto");

    if (!firstName || !lastName || !email || !password) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    if (password !== password2) {
        alert("Şifreler eşleşmiyor!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("kullanicilar")) || [];
    if (users.find(u => u.email === email)) {
        alert("Bu email zaten kayıtlı!");
        return;
    }


    if (profilePhotoInput.files.length > 0) {
        const file = profilePhotoInput.files[0];
        

        if (file.size > 2 * 1024 * 1024) {
            alert("Profil fotoğrafı maksimum 2MB boyutunda olabilir!");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            saveUser(e.target.result);
        };
        reader.onerror = function () {
            alert("Dosya okunurken hata oluştu!");
        };
        reader.readAsDataURL(file);
    } else {
        saveUser("");
    }

    function saveUser(profilePhoto) {
        const newUser = {
            firstName,
            lastName,
            email,
            password,
            profilePhoto: profilePhoto || "",
            theme: "light",
            language: "tr",
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem("kullanicilar", JSON.stringify(users));
        localStorage.setItem("currentUserEmail", email);

        alert("Kayıt başarılı!");
        document.getElementById("dialogPage").close();

        document.getElementById("userFirstName").value = "";
        document.getElementById("userLastName").value = "";
        document.getElementById("createUserEmail").value = "";
        document.getElementById("createUserPassword").value = "";
        document.getElementById("confirmUserPassword").value = "";
        document.getElementById("createUserProfilePhoto").value = "";

        updateNavbarUI();

        window.history.pushState({}, "", "/");
        urlLocationHandler();
    }
}

function loginUser() {
    let email = document.getElementById("userEmail").value.trim();
    let password = document.getElementById("userPassword").value;

    let users = JSON.parse(localStorage.getItem("kullanicilar")) || [];
    let user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        alert("Email/Şifre hatalı!");
        return;
    }

    localStorage.setItem("currentUserEmail", user.email);
    alert("Giriş başarılı!");

    updateNavbarUI();

    window.history.pushState({}, "", "/");
    urlLocationHandler();
}
