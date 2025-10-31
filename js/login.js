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

    //  Sign Up dialog aç/kapa
    signupBtn.addEventListener("click", () => dialogPage.showModal());
    dialogCancel.addEventListener("click", () => dialogPage.close());

    //  User Login
    signInBtn.addEventListener("click", loginUser);

    //  Register User
    dialogSignUpBtn.addEventListener("click", registerUser);
}

//  Kullanıcı Kaydı
function registerUser() {
    let firstName = document.getElementById("userFirstName").value.trim();
    let lastName = document.getElementById("userLastName").value.trim();
    let email = document.getElementById("createUserEmail").value.trim();
    let password = document.getElementById("createUserPassword").value;
    let password2 = document.getElementById("confrimUserPassword").value;

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

    users.push({
        firstName,
        lastName,
        email,
        password
    });

    localStorage.setItem("kullanicilar", JSON.stringify(users));
    alert("Kayıt başarılı ");
    document.getElementById("dialogPage").close();
}

//  Kullanıcı Girişi
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
    alert("Giriş başarılı ");

    //  Ana sayfaya yönlendir
    window.history.pushState({}, "", "/");
    urlLocationHandler(); // Doğrudan router fonksiyonunu çağır
    
    // Navbar'ı hemen güncelle
    setTimeout(updateNavbarUI, 100);
}