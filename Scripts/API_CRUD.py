import requests
from datetime import datetime
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
import emoji
import random
import string

# Configuración de la API
API_BASE_URL = 'http://localhost:3000/api'
AUTH_CREDENTIALS = {
    'email': 'carlos.mendez@empresa.com',
    'contraseña': 'carlos123'
}

# Inicializar la consola de rich
console = Console()

def generate_unique_email(base_email):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_str = ''.join(random.choices(string.ascii_lowercase, k=4))
    return f"{base_email.split('@')[0]}_{timestamp}_{random_str}@{base_email.split('@')[1]}"

def generate_unique_name(base_name):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_str = ''.join(random.choices(string.ascii_lowercase, k=4))
    return f"{base_name} {timestamp} {random_str}"

def print_header():
    console.print(Panel.fit(
        emoji.emojize(":wrench: Pruebas CRUD del Sistema :factory: :gear:"),
        style="bold blue"
    ))

def print_success(message):
    console.print(f":white_check_mark: {message}", style="green")

def print_error(message):
    console.print(f":x: {message}", style="red")

def print_info(message):
    console.print(f":information_source: {message}", style="blue")

def print_table(title, headers, rows):
    table = Table(title=title)
    for header in headers:
        table.add_column(header)
    for row in rows:
        table.add_row(*[str(item) for item in row])
    console.print(table)

def get_auth_token():
    try:
        response = requests.post(
            f"{API_BASE_URL}/auth/iniciar-sesion",
            json=AUTH_CREDENTIALS
        )
        if response.status_code == 200:
            return response.json()['data']['token']
        else:
            print_error(f"Error al obtener token: {response.json()['message']}")
            return None
    except Exception as e:
        print_error(f"Error de conexión: {str(e)}")
        return None

def test_usuarios_crud(token):
    headers = {'Authorization': f'Bearer {token}'}
    
    # 1. Crear usuario
    print_info("Creando nuevo usuario...")
    new_user = {
        'nombre': generate_unique_name('Nuevo Usuario'),
        'email': generate_unique_email('nuevo@empresa.com'),
        'contraseña': 'nuevo123',
        'rol': 'Trabajador'
    }
    response = requests.post(
        f"{API_BASE_URL}/usuarios",
        json=new_user,
        headers=headers
    )
    if response.status_code == 201:
        new_user_id = response.json()['data']['id']
        print_success(f"Usuario creado con ID: {new_user_id}")
    else:
        print_error(f"Error al crear usuario: {response.json()['message']}")
        return
    
    # 2. Leer usuario específico
    print_info("Leyendo usuario específico...")
    response = requests.get(
        f"{API_BASE_URL}/usuarios/{new_user_id}",
        headers=headers
    )
    if response.status_code == 200:
        user = response.json()['data']
        print_table("Usuario encontrado", ["ID", "Nombre", "Email", "Rol"], 
                   [[user['id'], user['nombre'], user['email'], user['rol']]])
    else:
        print_error(f"Error al leer usuario: {response.json()['message']}")
    
    # 3. Actualizar usuario
    print_info("Actualizando usuario...")
    updated_user = {
        'nombre': generate_unique_name('Usuario Actualizado'),
        'email': generate_unique_email('actualizado@empresa.com')
    }
    response = requests.put(
        f"{API_BASE_URL}/usuarios/{new_user_id}",
        json=updated_user,
        headers=headers
    )
    if response.status_code == 200:
        print_success("Usuario actualizado")
    else:
        print_error(f"Error al actualizar usuario: {response.json()['message']}")
    
    # 4. Consulta específica: Usuarios por rol
    print_info("Consultando usuarios por rol...")
    response = requests.get(
        f"{API_BASE_URL}/usuarios",
        headers=headers
    )
    if response.status_code == 200:
        users = response.json()['data']
        trabajadores = [[u['id'], u['nombre'], u['email'], u['rol']] 
                       for u in users if u['rol'] == 'Trabajador']
        print_table("Usuarios Trabajadores", ["ID", "Nombre", "Email", "Rol"], trabajadores)
    else:
        print_error(f"Error al consultar usuarios: {response.json()['message']}")
    
    # 5. Soft delete
    print_info("Eliminando usuario (soft delete)...")
    response = requests.delete(
        f"{API_BASE_URL}/usuarios/{new_user_id}",
        headers=headers
    )
    if response.status_code == 200:
        print_success("Usuario eliminado (soft delete)")
    else:
        print_error(f"Error al eliminar usuario: {response.json()['message']}")

def test_reportes_mantenimiento_crud(token):
    headers = {'Authorization': f'Bearer {token}'}
    
    # 1. Crear reporte
    print_info("Creando nuevo reporte de mantenimiento...")
    new_reporte = {
        'equipo_id': 1,
        'descripcion': f'Nuevo reporte de prueba {datetime.now().strftime("%Y%m%d%H%M%S")}',
        'tipo': 'Preventivo',
        'evidencias': f'evidencias/prueba_{datetime.now().strftime("%Y%m%d%H%M%S")}.jpg',
        'usuario_id': 1  # ID del usuario que crea el reporte
    }
    response = requests.post(
        f"{API_BASE_URL}/reportes-mantenimiento",
        json=new_reporte,
        headers=headers
    )
    if response.status_code == 201:
        new_reporte_id = response.json()['data']['id']
        print_success(f"Reporte creado con ID: {new_reporte_id}")
    else:
        print_error(f"Error al crear reporte: {response.json()['message']}")
        return
    
    # 2. Leer reporte específico
    print_info("Leyendo reporte específico...")
    response = requests.get(
        f"{API_BASE_URL}/reportes-mantenimiento/{new_reporte_id}",
        headers=headers
    )
    if response.status_code == 200:
        reporte = response.json()['data']
        print_table("Reporte encontrado", ["ID", "Equipo ID", "Descripción", "Tipo"], 
                   [[reporte['id'], reporte['equipo_id'], reporte['descripcion'], reporte['tipo']]])
    else:
        print_error(f"Error al leer reporte: {response.json()['message']}")
    
    # 3. Actualizar reporte
    print_info("Actualizando reporte...")
    updated_reporte = {
        'descripcion': f'Reporte actualizado {datetime.now().strftime("%Y%m%d%H%M%S")}',
        'tipo': 'Correctivo'
    }
    response = requests.put(
        f"{API_BASE_URL}/reportes-mantenimiento/{new_reporte_id}",
        json=updated_reporte,
        headers=headers
    )
    if response.status_code == 200:
        print_success("Reporte actualizado")
    else:
        print_error(f"Error al actualizar reporte: {response.json()['message']}")
    
    # 4. Consulta específica: Reportes por tipo
    print_info("Consultando reportes por tipo...")
    response = requests.get(
        f"{API_BASE_URL}/reportes-mantenimiento",
        headers=headers
    )
    if response.status_code == 200:
        reportes = response.json()['data']
        correctivos = [[r['id'], r['descripcion'], r['tipo']] 
                      for r in reportes if r['tipo'] == 'Correctivo']
        print_table("Reportes Correctivos", ["ID", "Descripción", "Tipo"], correctivos)
    else:
        print_error(f"Error al consultar reportes: {response.json()['message']}")
    
    # 5. Soft delete
    print_info("Eliminando reporte (soft delete)...")
    response = requests.delete(
        f"{API_BASE_URL}/reportes-mantenimiento/{new_reporte_id}",
        headers=headers
    )
    if response.status_code == 200:
        print_success("Reporte eliminado (soft delete)")
    else:
        print_error(f"Error al eliminar reporte: {response.json()['message']}")

def test_recargas_combustible_crud(token):
    headers = {'Authorization': f'Bearer {token}'}
    
    # 1. Crear recarga
    print_info("Creando nueva recarga de combustible...")
    new_recarga = {
        'vehiculo_id': 1,
        'kilometraje': random.randint(50000, 100000),
        'cantidad': round(random.uniform(20.0, 60.0), 2),
        'gasolinera': generate_unique_name('Gasolinera Test'),
        'foto_ticket': f'tickets/test_{datetime.now().strftime("%Y%m%d%H%M%S")}.jpg',
        'usuario_id': 1  # ID del usuario que crea la recarga
    }
    response = requests.post(
        f"{API_BASE_URL}/recargas-combustible",
        json=new_recarga,
        headers=headers
    )
    if response.status_code == 201:
        new_recarga_id = response.json()['data']['id']
        print_success(f"Recarga creada con ID: {new_recarga_id}")
    else:
        print_error(f"Error al crear recarga: {response.json()['message']}")
        return
    
    # 2. Leer recarga específica
    print_info("Leyendo recarga específica...")
    response = requests.get(
        f"{API_BASE_URL}/recargas-combustible/{new_recarga_id}",
        headers=headers
    )
    if response.status_code == 200:
        recarga = response.json()['data']
        print_table("Recarga encontrada", ["ID", "Vehículo ID", "Kilometraje", "Cantidad", "Gasolinera"], 
                   [[recarga['id'], recarga['vehiculo_id'], recarga['kilometraje'], 
                     recarga['cantidad'], recarga['gasolinera']]])
    else:
        print_error(f"Error al leer recarga: {response.json()['message']}")
    
    # 3. Actualizar recarga
    print_info("Actualizando recarga...")
    updated_recarga = {
        'cantidad': round(random.uniform(20.0, 60.0), 2),
        'gasolinera': generate_unique_name('Gasolinera Actualizada')
    }
    response = requests.put(
        f"{API_BASE_URL}/recargas-combustible/{new_recarga_id}",
        json=updated_recarga,
        headers=headers
    )
    if response.status_code == 200:
        print_success("Recarga actualizada")
    else:
        print_error(f"Error al actualizar recarga: {response.json()['message']}")
    
    # 4. Consulta específica: Recargas por vehículo
    print_info("Consultando recargas por vehículo...")
    response = requests.get(
        f"{API_BASE_URL}/recargas-combustible",
        headers=headers
    )
    if response.status_code == 200:
        recargas = response.json()['data']
        vehiculo_recargas = [[r['id'], r['kilometraje'], r['cantidad'], r['gasolinera']] 
                           for r in recargas if r['vehiculo_id'] == 1]
        print_table("Recargas del Vehículo", ["ID", "Kilometraje", "Cantidad", "Gasolinera"], 
                   vehiculo_recargas)
    else:
        print_error(f"Error al consultar recargas: {response.json()['message']}")
    
    # 5. Soft delete
    print_info("Eliminando recarga (soft delete)...")
    response = requests.delete(
        f"{API_BASE_URL}/recargas-combustible/{new_recarga_id}",
        headers=headers
    )
    if response.status_code == 200:
        print_success("Recarga eliminada (soft delete)")
    else:
        print_error(f"Error al eliminar recarga: {response.json()['message']}")

def main():
    print_header()
    
    # Obtener token de autenticación
    token = get_auth_token()
    if not token:
        return
    
    try:
        # Probar CRUD de usuarios
        print_info("\n=== Probando CRUD de Usuarios ===")
        test_usuarios_crud(token)
        
        # Probar CRUD de reportes de mantenimiento
        print_info("\n=== Probando CRUD de Reportes de Mantenimiento ===")
        test_reportes_mantenimiento_crud(token)
        
        # Probar CRUD de recargas de combustible
        print_info("\n=== Probando CRUD de Recargas de Combustible ===")
        test_recargas_combustible_crud(token)
        
    except Exception as e:
        print_error(f"Error durante las pruebas: {str(e)}")

if __name__ == "__main__":
    main()