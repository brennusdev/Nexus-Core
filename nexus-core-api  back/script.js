function atualizarRelogio() {

    const agora = new Date();

    const horas = String(agora.getHours()).padStart(2, "0");

    const minutos = String(agora.getMinutes()).padStart(2, "0");

    const segundos = String(agora.getSeconds()).padStart(2, "0");

    const dias = [

        "Domingo",

        "Segunda-feira",

        "Terça-feira",

        "Quarta-feira",

        "Quinta-feira",

        "Sexta-feira",

        "Sábado"

    ];

    const diaSemana = dias[agora.getDay()];

    document.getElementById("clock").innerHTML =
        `${horas}:${minutos}:${segundos}`;

    document.getElementById("date").innerHTML =
        diaSemana;

}

atualizarRelogio();

setInterval(atualizarRelogio,1000);