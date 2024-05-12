<?php

function debug($variable) : string {
    echo "<pre>";
    var_dump($variable);
    echo "</pre>";
    exit;
}

// Escapa / Sanitizar el HTML
function s($html) : string {
    $s = htmlspecialchars($html);
    return $s;
}

function esUltimo(string $actual, string $proximo) : bool {
    if($actual !== $proximo) {
        return true;
    }
    return false;
}

// Funcion que revisa que el usuario este logeado
function isAuth() : void {
    if(!isset($_SESSION["login"])) {
        header("Location: /");
    }
}

function isAdmin() : void {
    if(!isset($_SESSION["admin"])) {
        header("Location: /");
    }
}

//function iniciarSession() {
//    if(!isset($_SESSION)){
//        session_start();
//    }  
//}
