<?php 

namespace Controllers;
use MVC\Router;

class CitaController {
    public static function index( Router $router) {

        // Iniciar la session
        session_start();

        // Verificar que el usuario este logeado
        isAuth();

        $router->render("cita/index", [
            "nombre" => $_SESSION["nombre"],
            "id" => $_SESSION["id"]
        ]);
    }
}

