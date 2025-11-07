if (document.getElementById("name").value == ''){
    let aviso = document.createElement("p");
    aviso.className = "erros";
    const div = document.getElementById("semnome");
    div.appendChild(aviso);
    aviso.textContent = "Por favor preencha seu nome."
} else {
    aviso.remove();
}