document.getElementById("signup").addEventListener("click", () => {
    const nameInput = document.getElementById("name");
    const div = document.getElementById("semnome");
    let aviso = div.querySelector(".erros");

    if (nameInput.value.trim() === '') {
        if (!aviso) {
            aviso = document.createElement("p");
            aviso.className = "erros";
            aviso.textContent = "Por favor preencha seu nome.";
            div.appendChild(aviso);
        } else {
            aviso.textContent = "Por favor preencha seu nome.";
        }
    } else {
        if (nameInput.value.trim() === '') {
            aviso.remove();
        }
    }
});
