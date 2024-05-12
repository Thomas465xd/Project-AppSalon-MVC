<?php 

namespace Controllers;

use Model\Cita;
use Model\Servicio;
use Model\CitaServicio;

class APIController {
    public static function index() {
        $servicios = Servicio::all();
        echo json_encode($servicios);

    }

    public static function guardar() {

        // Almacena la cita y devuelve el Id
        $cita = new Cita($_POST);
        $resultado = $cita->guardar();

        $id = $resultado["id"];

        // Almacena la Cita y el Servicio

        // Almacena los servicios con el id de la cita
        $idServicios = explode(",", $_POST['servicios']);

        foreach($idServicios as $idServicio) {
            $args = [
                'citaId' => $id,
                'servicioId' => $idServicio
            ];

            $citaServicio = new CitaServicio($args);
            $citaServicio->guardar();
        }

        echo json_encode(["resultado" => $resultado]);
    }

    public static function eliminar() {
        
        if($_SERVER["REQUEST_METHOD"] === "POST") {

            // Obtener el id
            $id = $_POST["id"];

            // Eliminar la cita
            $cita = Cita::find($id);
            $cita->eliminar();

            // Redireccionar
            header("Location:" . $_SERVER["HTTP_REFERER"]);
        }
    }
}