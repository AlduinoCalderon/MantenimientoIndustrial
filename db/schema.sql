CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  contraseña TEXT NOT NULL,
  rol ENUM('Trabajador', 'Administrador') NOT NULL,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  contraseña TEXT NOT NULL,
  contacto TEXT,
  empresa TEXT,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE equipos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  cliente_id INT,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE vehiculos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  modelo TEXT NOT NULL,
  placas TEXT UNIQUE NOT NULL,
  deleted_at TIMESTAMP NULL
);

CREATE TABLE reportes_mantenimiento (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  descripcion TEXT NOT NULL,
  tipo ENUM('Preventivo', 'Correctivo') NOT NULL,
  evidencias TEXT,
  equipo_id INT,
  usuario_id INT,
  FOREIGN KEY (equipo_id) REFERENCES equipos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  deleted_at TIMESTAMP NULL
);

CREATE TABLE recargas_combustible (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vehiculo_id INT NOT NULL,
  kilometraje INT NOT NULL,
  cantidad DECIMAL(10, 2) NOT NULL,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  gasolinera TEXT,
  foto_ticket TEXT NOT NULL,
  usuario_id INT,
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  deleted_at TIMESTAMP NULL
);

-- ✅ TRIGGERS DE BORRADO LÓGICO EN CASCADA

DELIMITER $$

-- Cuando se borra un cliente → se borran lógicamente sus equipos y los reportes de esos equipos
CREATE TRIGGER borrar_cliente_cascada
AFTER UPDATE ON clientes
FOR EACH ROW
BEGIN
  IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
    -- Marcar equipos
    UPDATE equipos
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE cliente_id = NEW.id AND deleted_at IS NULL;
    
    -- Marcar reportes de esos equipos
    UPDATE reportes_mantenimiento
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE equipo_id IN (
      SELECT id FROM equipos WHERE cliente_id = NEW.id
    ) AND deleted_at IS NULL;
  END IF;
END$$

-- Cuando se borra un vehículo → se borran lógicamente sus recargas
CREATE TRIGGER borrar_vehiculo_cascada
AFTER UPDATE ON vehiculos
FOR EACH ROW
BEGIN
  IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
    -- Marcar recargas
    UPDATE recargas_combustible
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE vehiculo_id = NEW.id AND deleted_at IS NULL;
  END IF;
END$$

-- Cuando se borra un equipo → se borran lógicamente sus reportes
CREATE TRIGGER borrar_equipo_cascada
AFTER UPDATE ON equipos
FOR EACH ROW
BEGIN
  IF NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
    -- Marcar reportes
    UPDATE reportes_mantenimiento
    SET deleted_at = CURRENT_TIMESTAMP
    WHERE equipo_id = NEW.id AND deleted_at IS NULL;
  END IF;
END$$

DELIMITER ;
