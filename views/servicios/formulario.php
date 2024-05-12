<div class="campo">
    <label for="nombre">Nombre</label>
    <input 
        type="text" 
        id="nombre" 
        name="nombre" 
        placeholder="Nombre del Servicio" 
        value="<?php echo $servicio->nombre; ?>"
    >
</div>

<div class="campo">
    <label for="precio">Precio</label>
    <input 
        type="number" 
        id="precio" 
        name="precio" 
        placeholder="Precio del Servicio" 
        value="<?php echo $servicio->precio; ?>"
    >
</div>