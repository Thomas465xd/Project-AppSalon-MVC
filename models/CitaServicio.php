<?php

namespace Model;

class CitaServicio extends ActiveRecord {
    protected static $tabla = 'citasservicios';
    protected static $columnasDB = ['id', 'citaId', 'servicioId'];

    public $id;
    public $citaId;
    public $servicioId;

    public function __construct($args = []) {
        $this->id = $args['id'] ?? null;
        $this->citaId = $args['citaId'] ?? '';
        $this->servicioId = $args['servicioId'] ?? '';
    }

    public function validar() {
        if(!$this->citaId) {
            self::setAlerta('error', 'Elige una cita');
        }

        if(!$this->servicioId) {
            self::setAlerta('error', 'Elige un servicio');
        }

        return self::getAlertas();
    }
}